/**
 * FX - tiny chainable raw-pixel image toolkit used by every theme's `recipe.mjs`.
 *
 *   import { Fx } from '../../../scripts/fx/index.mjs';
 *   export default {
 *     treatments: { default: (fx, ctx) => fx.kuwahara(4).posterize(5).duotone('#1b2a49', '#f2e8cf').grain(0.06) },
 *   };
 *
 * Methods are QUEUED and executed in order when the pipeline calls `await fx.run()`
 * (you can also `await fx.run()` yourself mid-recipe, e.g. to `clone()` an intermediate result).
 * Everything is deterministic: randomness comes from `fx.rng` seeded per photo, so rebuilding gives
 * identical output.  Colours accept '#rgb', '#rrggbb' or [r,g,b].
 *
 * Pixel data is RGBA, 8-bit, `fx.data` (Uint8ClampedArray), `fx.w` x `fx.h`.
 * For anything not covered, use `fx.px(fn)` (per pixel) or `fx.custom(async (fx) => {...})`.
 */
import sharp from 'sharp';

export const FX_VERSION = 3;

// ---------------------------------------------------------------- helpers
export function hex(c) {
  if (Array.isArray(c)) return [c[0], c[1], c[2]];
  let s = String(c).replace('#', '');
  if (s.length === 3) s = s.split('').map((x) => x + x).join('');
  const n = parseInt(s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const clamp = (v, a = 0, b = 255) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a || 1e-9), 0, 1); return t * t * (3 - 2 * t); };
const lum = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// value noise (for textures)
function makeNoise(seed) {
  const P = new Float32Array(256 * 256);
  const r = mulberry32(seed);
  for (let i = 0; i < P.length; i++) P[i] = r();
  const at = (x, y) => P[((y & 255) << 8) | (x & 255)];
  return function noise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return lerp(lerp(at(xi, yi), at(xi + 1, yi), u), lerp(at(xi, yi + 1), at(xi + 1, yi + 1), u), v);
  };
}
function fbm(noise, x, y, oct = 4) {
  let s = 0, a = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { s += a * noise(x * f, y * f); a *= 0.5; f *= 2; }
  return s;
}

const BLEND = {
  normal: (b, s) => s,
  multiply: (b, s) => (b * s) / 255,
  screen: (b, s) => 255 - ((255 - b) * (255 - s)) / 255,
  overlay: (b, s) => (b < 128 ? (2 * b * s) / 255 : 255 - (2 * (255 - b) * (255 - s)) / 255),
  softlight: (b, s) => { const B = b / 255, S = s / 255; return 255 * ((1 - 2 * S) * B * B + 2 * S * B); },
  add: (b, s) => b + s,
  difference: (b, s) => Math.abs(b - s),
  lighten: (b, s) => Math.max(b, s),
  darken: (b, s) => Math.min(b, s),
};

const BAYER8 = (() => {
  const m = [[0, 32, 8, 40, 2, 34, 10, 42], [48, 16, 56, 24, 50, 18, 58, 26], [12, 44, 4, 36, 14, 46, 6, 38], [60, 28, 52, 20, 62, 30, 54, 22], [3, 35, 11, 43, 1, 33, 9, 41], [51, 19, 59, 27, 49, 17, 57, 25], [15, 47, 7, 39, 13, 45, 5, 37], [63, 31, 55, 23, 61, 29, 53, 21]];
  return m.map((row) => row.map((v) => v / 64 - 0.5));
})();

// ---------------------------------------------------------------- class
export class Fx {
  /** @param {string|Buffer} input path or buffer; photo is auto-rotated and fitted inside maxSize */
  static async from(input, { maxSize = 1400, seed = 1 } = {}) {
    const { data, info } = await sharp(input)
      .rotate()
      .resize({ width: maxSize, height: maxSize, fit: 'inside', withoutEnlargement: true })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    return new Fx(new Uint8ClampedArray(data.buffer, data.byteOffset, data.length), info.width, info.height, seed);
  }

  constructor(data, w, h, seed = 1) {
    this.data = data; this.w = w; this.h = h; this.seed = seed;
    this.rng = mulberry32(seed);
    this.noise = makeNoise(seed);
    this.q = [];
  }
  clone() {
    const c = new Fx(new Uint8ClampedArray(this.data), this.w, this.h, this.seed);
    return c;
  }
  _add(fn) { this.q.push(fn); return this; }
  async run() { const q = this.q; this.q = []; for (const fn of q) await fn(this); return this; }

  async toBuffer({ format = 'webp', quality = 82, width } = {}) {
    await this.run();
    let s = sharp(Buffer.from(this.data.buffer, this.data.byteOffset, this.data.length), { raw: { width: this.w, height: this.h, channels: 4 } });
    if (width && width < this.w) s = s.resize({ width });
    if (format === 'png') return s.png({ compressionLevel: 9, palette: false }).toBuffer();
    if (format === 'jpeg' || format === 'jpg') return s.flatten({ background: '#fff' }).jpeg({ quality, mozjpeg: true }).toBuffer();
    if (format === 'avif') return s.avif({ quality }).toBuffer();
    return s.webp({ quality, effort: 5, alphaQuality: 90 }).toBuffer();
  }

  // ---- escape hatches
  /** fn(r,g,b,a,x,y) -> [r,g,b,a?] (or return nothing and mutate nothing). */
  px(fn) {
    return this._add((f) => {
      const d = f.data, w = f.w;
      for (let i = 0, p = 0; i < d.length; i += 4, p++) {
        const o = fn(d[i], d[i + 1], d[i + 2], d[i + 3], p % w, (p / w) | 0);
        if (o) { d[i] = o[0]; d[i + 1] = o[1]; d[i + 2] = o[2]; if (o.length > 3) d[i + 3] = o[3]; }
      }
    });
  }
  custom(fn) { return this._add(fn); }

  // ---- tone & colour
  grayscale() { return this.px((r, g, b, a) => { const l = lum(r, g, b) * 255; return [l, l, l, a]; }); }
  invert() { return this.px((r, g, b) => [255 - r, 255 - g, 255 - b]); }
  /** brightness: -1..1 add; contrast: 1 = none; saturation: 1 = none; gamma: 1 = none; hue: degrees */
  adjust({ brightness = 0, contrast = 1, saturation = 1, gamma = 1, hue = 0 } = {}) {
    const ang = (hue * Math.PI) / 180, cs = Math.cos(ang), sn = Math.sin(ang);
    return this.px((r, g, b) => {
      if (hue) {
        const nr = r * (0.213 + cs * 0.787 - sn * 0.213) + g * (0.715 - cs * 0.715 - sn * 0.715) + b * (0.072 - cs * 0.072 + sn * 0.928);
        const ng = r * (0.213 - cs * 0.213 + sn * 0.143) + g * (0.715 + cs * 0.285 + sn * 0.14) + b * (0.072 - cs * 0.072 - sn * 0.283);
        const nb = r * (0.213 - cs * 0.213 - sn * 0.787) + g * (0.715 - cs * 0.715 + sn * 0.715) + b * (0.072 + cs * 0.928 + sn * 0.072);
        r = nr; g = ng; b = nb;
      }
      if (saturation !== 1) { const l = lum(r, g, b) * 255; r = l + (r - l) * saturation; g = l + (g - l) * saturation; b = l + (b - l) * saturation; }
      if (gamma !== 1) { r = 255 * Math.pow(clamp(r) / 255, 1 / gamma); g = 255 * Math.pow(clamp(g) / 255, 1 / gamma); b = 255 * Math.pow(clamp(b) / 255, 1 / gamma); }
      r = (r - 128) * contrast + 128 + brightness * 255;
      g = (g - 128) * contrast + 128 + brightness * 255;
      b = (b - 128) * contrast + 128 + brightness * 255;
      return [r, g, b];
    });
  }
  /** stretch black..white (0-255) to full range */
  levels(black = 0, white = 255) { const s = 255 / (white - black || 1); return this.px((r, g, b) => [(r - black) * s, (g - black) * s, (b - black) * s]); }
  /** per-channel posterize into n levels */
  posterize(n = 4) { const s = 255 / (n - 1); return this.px((r, g, b) => [Math.round((r / 255) * (n - 1)) * s, Math.round((g / 255) * (n - 1)) * s, Math.round((b / 255) * (n - 1)) * s]); }
  /** luminance -> colour ramp. stops: ['#000','#fff'] or [[0,'#000'],[0.5,'#f0f'],[1,'#fff']] */
  gradientMap(stops, { contrast = 1 } = {}) {
    const st = stops.map((s, i) => (Array.isArray(s) && typeof s[0] === 'number' ? [s[0], hex(s[1])] : [i / (stops.length - 1), hex(s)]));
    const lut = new Uint8ClampedArray(256 * 3);
    for (let i = 0; i < 256; i++) {
      const t = i / 255;
      let k = 0; while (k < st.length - 2 && t > st[k + 1][0]) k++;
      const [t0, c0] = st[k], [t1, c1] = st[k + 1];
      const u = clamp((t - t0) / (t1 - t0 || 1e-9), 0, 1);
      for (let c = 0; c < 3; c++) lut[i * 3 + c] = lerp(c0[c], c1[c], u);
    }
    return this.px((r, g, b) => { let l = lum(r, g, b); if (contrast !== 1) l = clamp((l - 0.5) * contrast + 0.5, 0, 1); const i = Math.round(l * 255) * 3; return [lut[i], lut[i + 1], lut[i + 2]]; });
  }
  duotone(dark, light, opts) { return this.gradientMap([dark, light], opts); }
  threshold(t = 0.5, dark = '#000', light = '#fff') { const d = hex(dark), l = hex(light); return this.px((r, g, b) => (lum(r, g, b) >= t ? l : d)); }
  /** snap to a palette. dither: 'none' | 'bayer' | 'noise'. strength = dither amplitude in 0-255 units */
  quantize(palette, { dither = 'none', strength = 48 } = {}) {
    const pal = palette.map(hex);
    return this._add((f) => {
      const d = f.data, w = f.w, rng = f.rng;
      for (let i = 0, p = 0; i < d.length; i += 4, p++) {
        let r = d[i], g = d[i + 1], b = d[i + 2];
        if (dither === 'bayer') { const t = BAYER8[((p / w) | 0) & 7][(p % w) & 7] * strength; r += t; g += t; b += t; }
        else if (dither === 'noise') { const t = (rng() - 0.5) * strength; r += t; g += t; b += t; }
        let best = 0, bd = 1e12;
        for (let k = 0; k < pal.length; k++) {
          const dr = r - pal[k][0], dg = g - pal[k][1], db = b - pal[k][2];
          const dist = 0.3 * dr * dr + 0.59 * dg * dg + 0.11 * db * db;
          if (dist < bd) { bd = dist; best = k; }
        }
        d[i] = pal[best][0]; d[i + 1] = pal[best][1]; d[i + 2] = pal[best][2];
      }
    });
  }
  /** blend a flat colour over the image */
  tint(color, opacity = 0.3, mode = 'normal') {
    const c = hex(color), fn = BLEND[mode] || BLEND.normal;
    return this.px((r, g, b) => [lerp(r, fn(r, c[0]), opacity), lerp(g, fn(g, c[1]), opacity), lerp(b, fn(b, c[2]), opacity)]);
  }
  /** blend a linear gradient (angle in degrees, 0 = left->right, 90 = top->bottom) */
  gradientOverlay(angle, stops, { mode = 'normal', opacity = 1 } = {}) {
    const st = stops.map((s, i) => (Array.isArray(s) && typeof s[0] === 'number' ? [s[0], hex(s[1])] : [i / (stops.length - 1), hex(s)]));
    const fn = BLEND[mode] || BLEND.normal;
    return this._add((f) => {
      const d = f.data, w = f.w, h = f.h, a = (angle * Math.PI) / 180, dx = Math.cos(a), dy = Math.sin(a);
      const len = Math.abs(w * dx) + Math.abs(h * dy);
      for (let i = 0, p = 0; i < d.length; i += 4, p++) {
        const x = p % w, y = (p / w) | 0;
        const t = clamp(((x - w / 2) * dx + (y - h / 2) * dy) / len + 0.5, 0, 1);
        let k = 0; while (k < st.length - 2 && t > st[k + 1][0]) k++;
        const u = clamp((t - st[k][0]) / (st[k + 1][0] - st[k][0] || 1e-9), 0, 1);
        for (let c = 0; c < 3; c++) { const col = lerp(st[k][1][c], st[k + 1][1][c], u); d[i + c] = lerp(d[i + c], fn(d[i + c], col), opacity); }
      }
    });
  }

  // ---- geometry
  resize(width, height) { return this._add(async (f) => { await f._viaSharp((s) => s.resize({ width, height, fit: height ? 'cover' : 'inside' })); }); }
  /** centre-crop to aspect ratio w/h (e.g. 1 for square, 4/5 for portrait) */
  cover(aspect, { focusY = 0.5, focusX = 0.5 } = {}) {
    return this._add(async (f) => {
      let cw = f.w, ch = f.h;
      if (f.w / f.h > aspect) cw = Math.round(f.h * aspect); else ch = Math.round(f.w / aspect);
      const left = Math.round((f.w - cw) * focusX), top = Math.round((f.h - ch) * focusY);
      await f._viaSharp((s) => s.extract({ left, top, width: cw, height: ch }));
    });
  }
  pixelate(block = 8) {
    return this._add((f) => {
      const d = f.data, w = f.w, h = f.h;
      for (let by = 0; by < h; by += block) for (let bx = 0; bx < w; bx += block) {
        let r = 0, g = 0, b = 0, n = 0;
        const ex = Math.min(bx + block, w), ey = Math.min(by + block, h);
        for (let y = by; y < ey; y++) for (let x = bx; x < ex; x++) { const i = (y * w + x) * 4; r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
        r /= n; g /= n; b /= n;
        for (let y = by; y < ey; y++) for (let x = bx; x < ex; x++) { const i = (y * w + x) * 4; d[i] = r; d[i + 1] = g; d[i + 2] = b; }
      }
    });
  }

  // ---- sharp-backed filters
  async _viaSharp(fn) {
    const out = await fn(sharp(Buffer.from(this.data.buffer, this.data.byteOffset, this.data.length), { raw: { width: this.w, height: this.h, channels: 4 } }))
      .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    this.data = new Uint8ClampedArray(out.data.buffer, out.data.byteOffset, out.data.length);
    this.w = out.info.width; this.h = out.info.height;
  }
  blur(sigma = 2) { return this._add((f) => f._viaSharp((s) => s.blur(Math.max(0.3, sigma)))); }
  sharpen(sigma = 1.5, { m1 = 1, m2 = 2 } = {}) { return this._add((f) => f._viaSharp((s) => s.sharpen({ sigma, m1, m2 }))); }
  median(size = 5) { return this._add((f) => f._viaSharp((s) => s.median(size))); }
  /** 3x3 / 5x5 convolution; kernel = flat array, scale/offset as in sharp */
  convolve(kernel, { scale = 1, offset = 0 } = {}) {
    const n = Math.sqrt(kernel.length);
    return this._add((f) => f._viaSharp((s) => s.convolve({ width: n, height: n, kernel, scale, offset })));
  }
  emboss(strength = 1) { const k = strength; return this.convolve([-2 * k, -k, 0, -k, 1, k, 0, k, 2 * k], { scale: 1 }); }

  /** Painterly smoothing (generalised Kuwahara) - flattens regions, keeps edges. radius 2-8 */
  kuwahara(radius = 4) {
    return this._add((f) => {
      const { w, h, data: d } = f, W = w + 1;
      const S = [0, 1, 2, 3, 4].map(() => new Float64Array(W * (h + 1)));
      const [sr, sg, sb, sl, sl2] = S;
      for (let y = 0; y < h; y++) {
        let rr = 0, gg = 0, bb = 0, ll = 0, l2 = 0;
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4, L = lum(d[i], d[i + 1], d[i + 2]);
          rr += d[i]; gg += d[i + 1]; bb += d[i + 2]; ll += L; l2 += L * L;
          const k = (y + 1) * W + x + 1, up = y * W + x + 1;
          sr[k] = sr[up] + rr; sg[k] = sg[up] + gg; sb[k] = sb[up] + bb; sl[k] = sl[up] + ll; sl2[k] = sl2[up] + l2;
        }
      }
      const rect = (T, x0, y0, x1, y1) => T[(y1 + 1) * W + x1 + 1] - T[y0 * W + x1 + 1] - T[(y1 + 1) * W + x0] + T[y0 * W + x0];
      const out = new Uint8ClampedArray(d.length);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        let bestV = 1e18, br = 0, bg = 0, bb2 = 0;
        for (let q = 0; q < 4; q++) {
          const x0 = clamp(q & 1 ? x : x - radius, 0, w - 1), x1 = clamp(q & 1 ? x + radius : x, 0, w - 1);
          const y0 = clamp(q & 2 ? y : y - radius, 0, h - 1), y1 = clamp(q & 2 ? y + radius : y, 0, h - 1);
          const n = (x1 - x0 + 1) * (y1 - y0 + 1);
          const ml = rect(sl, x0, y0, x1, y1) / n;
          const v = rect(sl2, x0, y0, x1, y1) / n - ml * ml;
          if (v < bestV) { bestV = v; br = rect(sr, x0, y0, x1, y1) / n; bg = rect(sg, x0, y0, x1, y1) / n; bb2 = rect(sb, x0, y0, x1, y1) / n; }
        }
        const i = (y * w + x) * 4; out[i] = br; out[i + 1] = bg; out[i + 2] = bb2; out[i + 3] = d[i + 3];
      }
      f.data = out;
    });
  }

  // ---- line work & print
  /**
   * Sobel outlines. mode 'overlay' draws lines on the image, 'only' returns just lines on `paper`.
   * threshold 0-1 (lower = more lines), thickness in px, smooth = pre-blur sigma.
   */
  edges({ threshold = 0.18, thickness = 1, color = '#000', mode = 'overlay', paper = '#fff', smooth = 1.2, softness = 0.08 } = {}) {
    const col = hex(color), pap = hex(paper);
    return this._add(async (f) => {
      const { w, h } = f;
      const g = f.clone(); g.blur(smooth); await g.run();
      const L = new Float32Array(w * h);
      for (let i = 0, p = 0; i < g.data.length; i += 4, p++) L[p] = lum(g.data[i], g.data[i + 1], g.data[i + 2]);
      const m = new Float32Array(w * h);
      for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        const gx = -L[i - w - 1] - 2 * L[i - 1] - L[i + w - 1] + L[i - w + 1] + 2 * L[i + 1] + L[i + w + 1];
        const gy = -L[i - w - 1] - 2 * L[i - w] - L[i - w + 1] + L[i + w - 1] + 2 * L[i + w] + L[i + w + 1];
        m[i] = smooth_(threshold, threshold + softness, Math.sqrt(gx * gx + gy * gy));
      }
      let mask = m;
      for (let t = 1; t < thickness; t++) { // dilate
        const n = new Float32Array(w * h);
        for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = y * w + x; n[i] = Math.max(m[i], mask[i - 1], mask[i + 1], mask[i - w], mask[i + w]); }
        mask = n;
      }
      const d = f.data;
      for (let i = 0, p = 0; i < d.length; i += 4, p++) {
        const a = mask[p];
        const base = mode === 'only' ? pap : [d[i], d[i + 1], d[i + 2]];
        d[i] = lerp(base[0], col[0], a); d[i + 1] = lerp(base[1], col[1], a); d[i + 2] = lerp(base[2], col[2], a);
      }
    });
  }
  /**
   * Halftone dots. Mono: ink dots on paper. color:true keeps source colour in each dot.
   */
  halftone({ cell = 10, angle = 45, ink = '#111', paper = '#f4efe6', color = false, gamma = 1, boost = 1.05 } = {}) {
    const inkC = hex(ink), papC = hex(paper);
    return this._add((f) => {
      const { w, h, data: d } = f, a = (angle * Math.PI) / 180, cs = Math.cos(a), sn = Math.sin(a);
      const out = new Uint8ClampedArray(d.length);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const u = x * cs + y * sn, v = -x * sn + y * cs;
        const cu = (Math.floor(u / cell) + 0.5) * cell, cv = (Math.floor(v / cell) + 0.5) * cell;
        const sx = clamp(Math.round(cu * cs - cv * sn), 0, w - 1), sy = clamp(Math.round(cu * sn + cv * cs), 0, h - 1);
        const si = (sy * w + sx) * 4;
        const dark = Math.pow(1 - lum(d[si], d[si + 1], d[si + 2]), gamma);
        const r = cell * 0.5 * Math.sqrt(dark) * boost * 1.15;
        const cov = clamp(r - Math.hypot(u - cu, v - cv) + 0.5, 0, 1);
        const i = (y * w + x) * 4;
        const dot = color ? [d[si], d[si + 1], d[si + 2]] : inkC;
        out[i] = lerp(papC[0], dot[0], cov); out[i + 1] = lerp(papC[1], dot[1], cov); out[i + 2] = lerp(papC[2], dot[2], cov); out[i + 3] = d[i + 3];
      }
      f.data = out;
    });
  }
  /** horizontal line-screen (engraving look). */
  lineScreen({ pitch = 6, angle = 0, ink = '#111', paper = '#f4efe6', gamma = 1 } = {}) {
    const inkC = hex(ink), papC = hex(paper);
    return this._add((f) => {
      const { w, h, data: d } = f, a = (angle * Math.PI) / 180, cs = Math.cos(a), sn = Math.sin(a);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4, dark = Math.pow(1 - lum(d[i], d[i + 1], d[i + 2]), gamma);
        const v = (-x * sn + y * cs) / pitch, ph = Math.abs(v - Math.floor(v) - 0.5) * 2; // 0 centre .. 1 edge
        const cov = clamp((dark - ph + 0.5) * 3, 0, 1);
        d[i] = lerp(papC[0], inkC[0], cov); d[i + 1] = lerp(papC[1], inkC[1], cov); d[i + 2] = lerp(papC[2], inkC[2], cov);
      }
    });
  }

  // ---- glitch / screen
  rgbSplit(dx = 8, dy = 0) {
    return this._add((f) => {
      const { w, h, data: d } = f, o = new Uint8ClampedArray(d);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const xr = clamp(x - dx, 0, w - 1), yr = clamp(y - dy, 0, h - 1), xb = clamp(x + dx, 0, w - 1), yb = clamp(y + dy, 0, h - 1);
        d[i] = o[(yr * w + xr) * 4]; d[i + 2] = o[(yb * w + xb) * 4 + 2];
      }
    });
  }
  /** radial chromatic aberration, amount in px at the corners */
  chromatic(amount = 6) {
    return this._add((f) => {
      const { w, h, data: d } = f, o = new Uint8ClampedArray(d), cx = w / 2, cy = h / 2, md = Math.hypot(cx, cy);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const ox = ((x - cx) / md) * amount, oy = ((y - cy) / md) * amount; // grows with distance from centre
        d[i] = o[(clamp(Math.round(y - oy), 0, h - 1) * w + clamp(Math.round(x - ox), 0, w - 1)) * 4];
        d[i + 2] = o[(clamp(Math.round(y + oy), 0, h - 1) * w + clamp(Math.round(x + ox), 0, w - 1)) * 4 + 2];
      }
    });
  }
  /** horizontal bands shifted sideways */
  sliceShift({ bands = 12, maxShift = 60, minH = 6, maxH = 40, probability = 1 } = {}) {
    return this._add((f) => {
      const { w, h, data: d } = f, o = new Uint8ClampedArray(d), r = f.rng;
      for (let b = 0; b < bands; b++) {
        if (r() > probability) continue;
        const y0 = Math.floor(r() * h), bh = Math.floor(minH + r() * (maxH - minH)), sh = Math.round((r() - 0.5) * 2 * maxShift);
        for (let y = y0; y < Math.min(h, y0 + bh); y++) for (let x = 0; x < w; x++) {
          const sx = (x - sh + w) % w, i = (y * w + x) * 4, j = (y * w + sx) * 4;
          d[i] = o[j]; d[i + 1] = o[j + 1]; d[i + 2] = o[j + 2];
        }
      }
    });
  }
  scanlines({ gap = 3, opacity = 0.25, color = '#000' } = {}) {
    const c = hex(color);
    return this.px((r, g, b, a, x, y) => { if (y % gap !== 0) return; return [lerp(r, c[0], opacity), lerp(g, c[1], opacity), lerp(b, c[2], opacity)]; });
  }

  // ---- finishing
  grain(amount = 0.08, { mono = true } = {}) {
    return this._add((f) => {
      const d = f.data, r = f.rng, A = amount * 255;
      for (let i = 0; i < d.length; i += 4) {
        const n = (r() - 0.5) * 2 * A;
        if (mono) { d[i] += n; d[i + 1] += n; d[i + 2] += n; } else { d[i] += (r() - 0.5) * 2 * A; d[i + 1] += (r() - 0.5) * 2 * A; d[i + 2] += (r() - 0.5) * 2 * A; }
      }
    });
  }
  vignette(strength = 0.4, { softness = 0.6, color = '#000' } = {}) {
    const c = hex(color);
    return this._add((f) => {
      const { w, h, data: d } = f, cx = w / 2, cy = h / 2, md = Math.hypot(cx, cy);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const t = smooth(1 - softness, 1, Math.hypot(x - cx, y - cy) / md) * strength, i = (y * w + x) * 4;
        d[i] = lerp(d[i], c[0], t); d[i + 1] = lerp(d[i + 1], c[1], t); d[i + 2] = lerp(d[i + 2], c[2], t);
      }
    });
  }
  /** procedural surface texture blended over the image. kind: 'paper' | 'canvas' | 'speckle' | 'cloud' | 'scratches' */
  texture(kind = 'paper', { opacity = 0.35, scale = 1, mode = 'multiply', tintColor } = {}) {
    const fn = BLEND[mode] || BLEND.multiply, tc = tintColor ? hex(tintColor) : null;
    return this._add((f) => {
      const { w, h, data: d } = f, nz = f.noise;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        let v;
        if (kind === 'paper') v = 0.55 + 0.35 * fbm(nz, x * 0.5 * scale, y * 0.5 * scale, 3) + 0.2 * (nz(x * 1.7 * scale, y * 1.7 * scale) - 0.5);
        else if (kind === 'canvas') v = 0.6 + 0.25 * (Math.sin(x * 1.3 * scale) * Math.sin(y * 1.3 * scale)) + 0.15 * nz(x * 0.8 * scale, y * 0.8 * scale);
        else if (kind === 'speckle') v = nz(x * 0.9 * scale, y * 0.9 * scale) > 0.82 ? 0.15 : 0.95;
        else if (kind === 'scratches') v = nz(x * 0.02 * scale, y * 0.9 * scale) > 0.7 ? 0.25 : 0.95;
        else v = 0.3 + 0.7 * fbm(nz, x * 0.01 * scale, y * 0.01 * scale, 4); // cloud / stains
        const i = (y * w + x) * 4, s = clamp(v * 255), c0 = tc ? tc[0] * v : s, c1 = tc ? tc[1] * v : s, c2 = tc ? tc[2] * v : s;
        d[i] = lerp(d[i], fn(d[i], c0), opacity); d[i + 1] = lerp(d[i + 1], fn(d[i + 1], c1), opacity); d[i + 2] = lerp(d[i + 2], fn(d[i + 2], c2), opacity);
      }
    });
  }
}

function smooth_(a, b, x) { return smooth(a, b, x); }

export { clamp, lerp, smooth, lum, BLEND };
export default Fx;
