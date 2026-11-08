/**
 * Ukiyo-e photo treatment: photograph -> Edo-period woodblock print.
 *
 * Pipeline (all deterministic; randomness from fx.rng / fx.noise):
 *   1. grade        auto-levels + gentle saturation (so every photo starts from a print-like tonal range)
 *   2. flatten      Kuwahara (radius 3-4 for people, 5-6 for scenery) = flat colour fields
 *   3. block colour quantise in Lab to a ~16 pigment palette (indigo, cobalt, asagi, vermilion, ochre, skin tans, moss, washi, sumi)
 *                   then a mode filter so region edges look carved, not pixel-noisy
 *   4. bokashi      where the top of the frame is clean sky, replace flat bands with a smooth printed gradient
 *   5. printing     wood-grain streaks + mottled ink density in the colour layer, colour layer shifted 2-3 px
 *                   against the key block (authentic misregistration, thin paper gaps)
 *   6. key block    difference-of-gaussians line art (variable thickness) drawn in sumi over the colours
 *   7. washi        fibre texture, warm paper tone and fine grain
 *
 * Photos that are dark overall (night rides, lakeside) switch to an indigo/sumi palette with lantern ochre and vermilion.
 */
import { hex, clamp, lerp } from '../../../scripts/fx/index.mjs';

// ---------------------------------------------------------------- palettes
const WASHI = '#f1e6cf';
const SUMI = '#17130f';

const DAY = [
  WASHI,      // unprinted paper
  '#ead8a6',  // pale straw
  '#e0b95c',  // yamabuki yellow
  '#cf8f3a',  // ochre
  '#e4bd9a',  // light skin
  '#d09a72',  // skin
  '#b4724a',  // skin shadow / sienna
  '#7a4631',  // brown
  '#c8402f',  // shu vermilion
  '#a53226',  // deep red
  '#e0a39a',  // beni
  '#b6cdd0',  // pale asagi
  '#7aa6bc',  // light blue
  '#3d6d96',  // cobalt
  '#1b3a5c',  // indigo / Prussian
  '#102239',  // deep navy
  '#6c8a4e',  // moss
  '#3e5a3c',  // dark green
  '#a9a89a',  // stone grey
  SUMI,       // sumi black
];

// portraits: no pink / straw so skin does not break into cream-and-pink patches
const FACE = DAY.filter((c) => !['#e0a39a', '#ead8a6', '#a9a89a'].includes(c));

const NIGHT = [
  '#dcd0b0',  // lamp-lit paper
  '#ecc66a',  // lantern yellow
  '#d58b2f',  // lantern ochre
  '#c8402f',  // vermilion
  '#a53226',
  '#d09a72',  // skin lit
  '#a56a48',  // skin
  '#6e4030',  // brown
  '#8fb0c4',  // moon blue
  '#4f7ea3',  // cobalt
  '#2b5280',
  '#1b3a5c',  // indigo
  '#122a47',
  '#0c1a2f',  // deep navy
  '#07101d',  // near black blue
  '#3e5a3c',
  SUMI,
];

// sky ramps (dark -> light) for bokashi
const SKY_COOL = ['#2c5a86', '#4f81a8', '#8db7c6', '#cfe0d6', WASHI];
const SKY_WARM = ['#35557f', '#7d88a6', '#d9a7a0', '#ecc27a', WASHI];
const NIGHT_SKY = ['#07101d', '#0c1a2f', '#122a47', '#1b3a5c', '#2b5280'];

// ---------------------------------------------------------------- colour maths
const SRGB_LIN = new Float32Array(256);
for (let i = 0; i < 256; i++) { const c = i / 255; SRGB_LIN[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
const fLab = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
function rgb2lab(r, g, b) {
  const R = SRGB_LIN[r | 0], G = SRGB_LIN[g | 0], B = SRGB_LIN[b | 0];
  const X = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047, Y = 0.2126 * R + 0.7152 * G + 0.0722 * B, Z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883;
  const fx = fLab(X), fy = fLab(Y), fz = fLab(Z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
const lumaOf = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

function rampColor(stops, t) {
  t = clamp(t, 0, 1) * (stops.length - 1);
  const k = Math.min(stops.length - 2, Math.floor(t)), u = t - k;
  return [lerp(stops[k][0], stops[k + 1][0], u), lerp(stops[k][1], stops[k + 1][1], u), lerp(stops[k][2], stops[k + 1][2], u)];
}

// ---------------------------------------------------------------- steps
/** auto levels: stretch 1%..99% luminance, then gamma so the mean sits in a printable range. returns stats. */
function grade(f, { sat = 1.2, targetMean = 0.52, lift = 1 } = {}) {
  const d = f.data, n = f.w * f.h, hist = new Uint32Array(256);
  for (let i = 0; i < d.length; i += 4) hist[Math.round(lumaOf(d[i], d[i + 1], d[i + 2]) * 255)]++;
  let acc = 0, lo = 0, hi = 255;
  for (let i = 0; i < 256; i++) { acc += hist[i]; if (acc > n * 0.01) { lo = i; break; } }
  acc = 0; for (let i = 255; i >= 0; i--) { acc += hist[i]; if (acc > n * 0.015) { hi = i; break; } }
  if (hi - lo < 60) { lo = Math.max(0, lo - 20); hi = Math.min(255, hi + 20); }
  const s = 255 / (hi - lo);
  let sum = 0;
  for (let i = 0; i < d.length; i += 4) {
    for (let c = 0; c < 3; c++) d[i + c] = clamp((d[i + c] - lo) * s);
    sum += lumaOf(d[i], d[i + 1], d[i + 2]);
  }
  const mean0 = sum / n;
  const dark = mean0 < 0.3; // night scene: keep it dark, do not lift to a daylight mean
  const mean = dark ? mean0 : mean0;
  let gamma = dark ? 1.0 : clamp(Math.log(targetMean) / Math.log(Math.max(0.05, mean)), 0.75, 1.35) * lift;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i + 1], b = d[i + 2];
    if (gamma !== 1) { r = 255 * Math.pow(r / 255, gamma); g = 255 * Math.pow(g / 255, gamma); b = 255 * Math.pow(b / 255, gamma); }
    const l = lumaOf(r, g, b) * 255;
    d[i] = clamp(l + (r - l) * sat); d[i + 1] = clamp(l + (g - l) * sat); d[i + 2] = clamp(l + (b - l) * sat);
  }
  return { night: dark, mean: mean0 };
}

/** backlit / shaded skin falls into navy-and-black: lift skin-hued dark pixels so faces stay faces */
function skinLift(f, amount = 0.8) {
  const d = f.data, cache = new Map();
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    if (r < g || g < b || r < 30) continue;
    const key = ((r >> 2) << 12) | ((g >> 2) << 6) | (b >> 2);
    let gain = cache.get(key);
    if (gain === undefined) {
      const [L, A, B] = rgb2lab(r, g, b), chroma = Math.hypot(A, B), hue = (Math.atan2(B, A) * 180) / Math.PI;
      gain = 1;
      if (chroma > 7 && chroma < 48 && hue > 16 && hue < 80 && L > 6 && L < 58) {
        const hw = clamp(1 - Math.abs(hue - 46) / 34, 0, 1), cw = clamp((chroma - 7) / 12, 0, 1), lw = clamp((56 - L) / 26, 0, 1);
        const w = hw * cw * lw * amount, L2 = L + (58 - L) * w;
        gain = Math.pow((L2 + 16) / (L + 16), 1.5);
      }
      cache.set(key, gain);
    }
    if (gain !== 1) { d[i] = clamp(r * gain); d[i + 1] = clamp(g * gain); d[i + 2] = clamp(b * gain); }
  }
}

/** lift shadows only where the whole neighbourhood is dark (faces in backlit group shots), leave bright skies alone */
async function localLift(f, strength) {
  const { w, h } = f, g = await blurred(f, Math.max(14, w / 30));
  const Lm = lumaField(g), d = f.data;
  for (let p = 0, i = 0; p < w * h; p++, i += 4) {
    const L = lumaOf(d[i], d[i + 1], d[i + 2]);
    if (L < 0.02) continue;
    const dark = clamp((0.64 - Lm[p]) / 0.3, 0, 1);
    const gamma = 1 - strength * dark;
    const L2 = Math.pow(L, gamma), gain = L2 / L;
    d[i] = clamp(d[i] * gain); d[i + 1] = clamp(d[i + 1] * gain); d[i + 2] = clamp(d[i + 2] * gain);
  }
}

/** nearest palette entry in Lab (L weighted a little lower so hue wins); returns Uint8Array of indices */
function quantizeIdx(f, palette) {
  const pal = palette.map((c) => { const [r, g, b] = hex(c); return rgb2lab(r, g, b); });
  const d = f.data, n = f.w * f.h, idx = new Uint8Array(n);
  // cache by 5-bit RGB to cut the Lab conversions
  const cache = new Int16Array(32 * 32 * 32).fill(-1);
  for (let p = 0, i = 0; p < n; p++, i += 4) {
    const key = ((d[i] >> 3) << 10) | ((d[i + 1] >> 3) << 5) | (d[i + 2] >> 3);
    let best = cache[key];
    if (best < 0) {
      const [L, A, B] = rgb2lab((d[i] & 0xf8) + 4, (d[i + 1] & 0xf8) + 4, (d[i + 2] & 0xf8) + 4);
      let bd = 1e12; best = 0;
      for (let k = 0; k < pal.length; k++) {
        const dl = L - pal[k][0], da = A - pal[k][1], db = B - pal[k][2];
        const dist = 0.7 * dl * dl + da * da + db * db;
        if (dist < bd) { bd = dist; best = k; }
      }
      cache[key] = best;
    }
    idx[p] = best;
  }
  return idx;
}

/** majority filter on palette indices: carved-looking shape boundaries, removes speckle */
function modeFilter(idx, w, h, radius, nPal) {
  const out = new Uint8Array(idx.length), cnt = new Uint16Array(nPal);
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - radius), y1 = Math.min(h - 1, y + radius);
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - radius), x1 = Math.min(w - 1, x + radius);
      cnt.fill(0);
      for (let yy = y0; yy <= y1; yy++) { const row = yy * w; for (let xx = x0; xx <= x1; xx++) cnt[idx[row + xx]]++; }
      let best = idx[y * w + x], bc = cnt[best] + 2; // slight bias to keep the pixel's own colour
      for (let k = 0; k < nPal; k++) if (cnt[k] > bc) { bc = cnt[k]; best = k; }
      out[y * w + x] = best;
    }
  }
  return out;
}

const blurred = async (f, sigma) => { const g = f.clone(); g.blur(sigma); await g.run(); return g; };
const lumaField = (f) => { const L = new Float32Array(f.w * f.h); for (let i = 0, p = 0; i < f.data.length; i += 4, p++) L[p] = lumaOf(f.data[i], f.data[i + 1], f.data[i + 2]); return L; };

/**
 * Sky detection: flood-fill from the top edge through smooth, light / blue / warm-glow pixels.
 * Heavy blur first so wires, railings and thin branches do not cut the sky. Returns soft mask + per-column horizon.
 */
async function skyMask(f, graded, rejectSkin = false) {
  const { w, h } = f;
  const s = await blurred(graded, Math.max(4, w / 230));
  const L = lumaField(s), d = s.data;
  const gradMax = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const p = y * w + x;
    gradMax[p] = Math.max(Math.abs(L[p + 1] - L[p - 1]), Math.abs(L[p + w] - L[p - w]));
  }
  const ok = (p) => {
    const i = p * 4, r = d[i], g = d[i + 1], b = d[i + 2], v = L[p];
    if (gradMax[p] > 0.028) return false;
    if (v < 0.3) return false;
    if (g > r + 12 && g > b + 6) return false; // foliage
    if (rejectSkin && r > g && g > b && r - b > 18 && r - b < 110 && v < 0.82) { // orange-brown, skin-like: not sky
      const ratio = (g - b) / Math.max(1, r - b);
      if (ratio > 0.3 && ratio < 0.8) return false;
    }
    return b >= r - 8 || v > 0.58;
  };
  const sky = new Uint8Array(w * h), stack = [];
  const limitY = Math.floor(h * 0.78);
  let seeds = 0, tested = 0;
  for (let x = 0; x < w; x += 2) { tested++; const p = x + w * 2; if (ok(p)) seeds++; }
  if (seeds / tested < 0.3) return { mask: new Float32Array(w * h), coverage: 0, bot: new Float32Array(w) }; // the top of the frame is not sky
  for (let x = 0; x < w; x += 2) { const p = x + w * 2; if (ok(p) && !sky[p]) { sky[p] = 1; stack.push(p); } }
  while (stack.length) {
    const p = stack.pop(), x = p % w, y = (p / w) | 0;
    if (x > 0 && !sky[p - 1] && ok(p - 1)) { sky[p - 1] = 1; stack.push(p - 1); }
    if (x < w - 1 && !sky[p + 1] && ok(p + 1)) { sky[p + 1] = 1; stack.push(p + 1); }
    if (y > 0 && !sky[p - w] && ok(p - w)) { sky[p - w] = 1; stack.push(p - w); }
    if (y < limitY && !sky[p + w] && ok(p + w)) { sky[p + w] = 1; stack.push(p + w); }
  }
  // opening: erode then dilate (via blur + threshold) so thin leaks into buildings / people disappear
  const cl = new Fx2(Float32Array.from(sky), w, h);
  await cl.blurField(Math.max(3, w / 200));
  for (let p = 0; p < cl.data.length; p++) cl.data[p] = cl.data[p] > 0.12 ? 1 : 0;   // dilate: bridges wires and railings
  await cl.blurField(Math.max(3, w / 200));
  for (let p = 0; p < cl.data.length; p++) cl.data[p] = cl.data[p] > 0.88 ? 1 : 0;   // erode back
  const er = new Fx2(cl.data, w, h);
  await er.blurField(Math.max(4, w / 110));
  for (let p = 0; p < er.data.length; p++) er.data[p] = er.data[p] > 0.86 ? 1 : 0;
  await er.blurField(Math.max(4, w / 110));
  for (let p = 0; p < er.data.length; p++) er.data[p] = er.data[p] > 0.2 ? 1 : 0;
  const mf = new Fx2(er.data, w, h);
  await mf.blurField(Math.max(3, w / 220));
  const m = mf.data;
  let coverage = 0;
  for (let p = 0; p < m.length; p++) { m[p] = clamp((m[p] - 0.35) / 0.3, 0, 1); coverage += m[p]; }
  // per-column horizon (last row of sky) smoothed sideways, so the gradient always completes before the horizon
  const bot = new Float32Array(w);
  for (let x = 0; x < w; x++) { let b = 0; for (let y = 0; y < h; y++) if (m[y * w + x] > 0.5) b = y; bot[x] = b; }
  const rad = Math.max(8, Math.round(w / 25)), sm = new Float32Array(w);
  for (let x = 0; x < w; x++) { let a = 0, c = 0; for (let k = -rad; k <= rad; k += 3) { a += bot[clamp(x + k, 0, w - 1)]; c++; } sm[x] = a / c; }
  return { mask: m, coverage: coverage / m.length, bot: sm };
}

/** tiny float-field helper (separable box blur x3 ~ gaussian) */
class Fx2 {
  constructor(data, w, h) { this.data = data; this.w = w; this.h = h; }
  async blurField(sigma) {
    const { w, h } = this, r = Math.max(1, Math.round(sigma * 1.1));
    for (let pass = 0; pass < 3; pass++) {
      const t = new Float32Array(this.data.length), o = new Float32Array(this.data.length);
      for (let y = 0; y < h; y++) {
        let acc = 0, cnt = 0; const row = y * w;
        for (let x = -r; x <= r; x++) { const xx = clamp(x, 0, w - 1); acc += this.data[row + xx]; cnt++; }
        for (let x = 0; x < w; x++) {
          t[row + x] = acc / cnt;
          const add = clamp(x + r + 1, 0, w - 1), sub = clamp(x - r, 0, w - 1);
          acc += this.data[row + add] - this.data[row + sub];
        }
      }
      for (let x = 0; x < w; x++) {
        let acc = 0, cnt = 0;
        for (let y = -r; y <= r; y++) { const yy = clamp(y, 0, h - 1); acc += t[yy * w + x]; cnt++; }
        for (let y = 0; y < h; y++) {
          o[y * w + x] = acc / cnt;
          const add = clamp(y + r + 1, 0, h - 1), sub = clamp(y - r, 0, h - 1);
          acc += t[add * w + x] - t[sub * w + x];
        }
      }
      this.data = o;
    }
  }
}

/** key block: difference-of-gaussians on luminance -> soft line mask 0..1 (dark lines on the dark side of edges) */
async function keyLines(graded, { s1, ratio = 1.7, eps, soft }) {
  const a = await blurred(graded, s1), b = await blurred(graded, s1 * ratio);
  const { w, h } = graded, La = lumaField(a), Lb = lumaField(b), out = new Float32Array(w * h);
  const nz = graded.noise;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = y * w + x;
    const S = Lb[p] - La[p]; // > 0 where this pixel is darker than its neighbourhood
    // brush pressure: line weight wanders slowly across the sheet
    const wob = 0.8 + 0.5 * nz(x * 0.011, y * 0.011) + 0.25 * (nz(x * 0.05 + 40, y * 0.05) - 0.5);
    const e = eps * (1.35 - wob * 0.55);
    out[p] = clamp((S - e) / soft, 0, 1);
  }
  return out;
}

/** merge tiny colour islands into the surrounding field (carved blocks have no specks) */
function removeSmall(idx, w, h, minArea, palLab) {
  const n = w * h, seen = new Uint8Array(n), out = Uint8Array.from(idx), stack = [], comp = [];
  const nb = new Map();
  for (let s = 0; s < n; s++) {
    if (seen[s]) continue;
    const k = idx[s]; comp.length = 0; stack.length = 0; stack.push(s); seen[s] = 1; nb.clear();
    while (stack.length) {
      const p = stack.pop(); comp.push(p);
      const x = p % w, y = (p / w) | 0;
      const visit = (q) => { if (idx[q] === k) { if (!seen[q]) { seen[q] = 1; stack.push(q); } } else nb.set(idx[q], (nb.get(idx[q]) || 0) + 1); };
      if (x > 0) visit(p - 1); if (x < w - 1) visit(p + 1); if (y > 0) visit(p - w); if (y < h - 1) visit(p + w);
    }
    const dark = palLab[k][0] < 30;
    if (comp.length >= (dark ? minArea * 0.35 : minArea) || nb.size === 0) continue;
    let best = -1, bc = 0; for (const [lab, c] of nb) if (c > bc) { bc = c; best = lab; }
    for (const p of comp) out[p] = best;
  }
  return out;
}

/** smooth the label field: blur each class mask, argmax. Dark classes get a bias so thin dark features (eyes, brows, hair) survive. */
async function smoothLabels(idx, w, h, sigma, pal, palLab, darkBias = 1) {
  const n = w * h, nPal = pal.length, counts = new Uint32Array(nPal);
  for (let p = 0; p < n; p++) counts[idx[p]]++;
  const best = new Float32Array(n).fill(-1), out = new Uint8Array(n);
  for (let k = 0; k < nPal; k++) {
    if (counts[k] < n * 0.0008) continue;
    const m = new Float32Array(n);
    for (let p = 0; p < n; p++) if (idx[p] === k) m[p] = 1;
    const fld = new Fx2(m, w, h);
    await fld.blurField(sigma);
    const bias = palLab[k][0] < 28 ? darkBias : palLab[k][0] < 40 ? 1 + (darkBias - 1) * 0.4 : 1;
    const dm = fld.data;
    for (let p = 0; p < n; p++) { const v = dm[p] * bias; if (v > best[p]) { best[p] = v; out[p] = k; } }
  }
  return out;
}

/** outline where neighbouring colour fields differ enough (carver's key line follows the colour boundaries) */
function boundaryLines(idx, w, h, palLab, minDE) {
  const m = new Float32Array(w * h), de = (a, b) => { const A = palLab[a], B = palLab[b]; return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]); };
  const table = new Float32Array(palLab.length * palLab.length);
  for (let a = 0; a < palLab.length; a++) for (let b = 0; b < palLab.length; b++) table[a * palLab.length + b] = de(a, b);
  const N = palLab.length;
  for (let y = 0; y < h - 1; y++) for (let x = 0; x < w - 1; x++) {
    const p = y * w + x, a = idx[p];
    const b1 = idx[p + 1], b2 = idx[p + w];
    let e = 0;
    if (b1 !== a) e = Math.max(e, table[a * N + b1]);
    if (b2 !== a) e = Math.max(e, table[a * N + b2]);
    if (e > minDE) m[p] = clamp((e - minDE) / 14, 0.55, 1);
  }
  return m;
}

/** dilate a 0..1 mask by r px (square) */
function dilate(m, w, h, r) {
  let src = m;
  for (let t = 0; t < r; t++) {
    const o = new Float32Array(src.length);
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      o[p] = Math.max(src[p], src[p - 1], src[p + 1], src[p - w], src[p + w]);
    }
    src = o;
  }
  return src;
}

// ---------------------------------------------------------------- the treatment
async function woodblock(f, ctx) {
  const { w, h } = f;
  const people = ['portraits', 'friends-trips', 'adventure', 'bikes', 'work-and-lifestyle'].includes(ctx.category);
  const faces = ctx.category === 'portraits';
  const S = w / 1400; // everything below is tuned at 1400px wide

  // 1 grade ------------------------------------------------------------------
  const st = grade(f, { sat: faces ? 1.1 : people ? 1.15 : 1.22, lift: people ? 0.82 : 1 });
  const night = st.night;
  const pal = night ? NIGHT : people ? FACE : DAY;
  const palRgb = pal.map(hex), palLab = palRgb.map(([r, g, b]) => rgb2lab(r, g, b));

  const gradedSky = f.clone(); // sky / bokashi are measured before any face lifting
  if (people && !faces) await localLift(f, night ? 0.38 : 0.55);
  if (people) skinLift(f, faces ? 0.5 : night ? 0.85 : 0.9);

  // keep a graded copy for line work (before flattening)
  const graded = f.clone();

  // 2 flatten ----------------------------------------------------------------
  f.kuwahara(faces ? 3 : people ? 5 : 7);
  f.kuwahara(faces ? 2 : people ? 3 : 5);
  await f.run();

  // 3 block colours -----------------------------------------------------------
  let idx = quantizeIdx(f, pal);
  idx = modeFilter(idx, w, h, faces ? 1 : 2, pal.length);
  const idxFine = await smoothLabels(idx, w, h, (faces ? 1.3 : people ? 2.6 : 3.4) * Math.max(0.6, S), pal, palLab, faces ? 1.5 : people ? 1.2 : 1.05);
  // heavier smoothing, used only to decide where the carver cut outlines (big shapes get a key line, texture does not)
  const idxBold = faces ? removeSmall(idxFine, w, h, Math.round(120 * S * S), palLab) : removeSmall(await smoothLabels(idxFine, w, h, (people ? 5 : 7) * Math.max(0.6, S), pal, palLab, 1.0), w, h, Math.round((people ? 450 : 900) * S * S), palLab);
  idx = removeSmall(idxFine, w, h, Math.round((faces ? 30 : people ? 90 : 220) * S * S), palLab);

  const col = new Float32Array(w * h * 3);
  for (let p = 0; p < w * h; p++) { const c = palRgb[idx[p]]; col[p * 3] = c[0]; col[p * 3 + 1] = c[1]; col[p * 3 + 2] = c[2]; }

  // 4 bokashi sky ---------------------------------------------------------------
  let skyAmount = 0, skyInner = null;
  if (!faces) {
    const { mask, coverage, bot } = await skyMask(f, gradedSky, people);
    skyAmount = coverage;
    if (coverage > 0.03) { const si = new Fx2(Float32Array.from(mask), w, h); await si.blurField(Math.max(5, w / 140)); skyInner = si.data; }
    if (coverage > 0.03) {
      const sm = await blurred(gradedSky, Math.max(10, w / 40));
      const Ls = lumaField(sm);
      let warm = 0, n = 0, lmin = 1, lmax = 0;
      for (let p = 0; p < w * h; p += 5) if (mask[p] > 0.9) { warm += sm.data[p * 4] - sm.data[p * 4 + 2]; n++; lmin = Math.min(lmin, Ls[p]); lmax = Math.max(lmax, Ls[p]); }
      warm = n ? warm / n : 0;
      const ramp = (night ? NIGHT_SKY : warm > 14 ? SKY_WARM : SKY_COOL).map(hex);
      const span = Math.max(0.1, lmax - lmin), nz = f.noise;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const p = y * w + x, m = mask[p];
        if (m <= 0) continue;
        const pos = clamp(y / Math.max(40, bot[x]), 0, 1);               // 0 at the top edge, 1 at the horizon
        const t = clamp(0.78 * pos + 0.22 * clamp((Ls[p] - lmin) / span, 0, 1) + (nz(x * 0.003, y * 0.1) - 0.5) * 0.02, 0, 1);
        const c = rampColor(ramp, t);
        col[p * 3] = lerp(col[p * 3], c[0], m); col[p * 3 + 1] = lerp(col[p * 3 + 1], c[1], m); col[p * 3 + 2] = lerp(col[p * 3 + 2], c[2], m);
      }
    }
  }

  // 5 printing: block grain + ink density ---------------------------------------
  const nz = f.noise;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = y * w + x;
    const warp = nz(x * 0.004, y * 0.004) * 60;
    const grain = (nz((x + warp) * 0.005 + 11, y * 0.07) - 0.5) * 0.04;              // soft, wavy wood-grain bands
    const mott = (nz(x * 0.011, y * 0.011) - 0.5) * 0.06 + (f.rng() - 0.5) * 0.008;   // uneven ink load
    const k = 1 + grain + mott;
    col[p * 3] *= k; col[p * 3 + 1] *= k; col[p * 3 + 2] *= k;
  }

  // misregistration: each family of blocks sits a hair off (reds/oranges, blues, the rest), leaving thin paper slivers
  const REDS = new Set(['#c8402f', '#a53226']), BLUES = new Set(['#7aa6bc', '#3d6d96', '#1b3a5c', '#4f7ea3', '#2b5280', '#8fb0c4']);
  const family = (k) => (REDS.has(pal[k]) ? 1 : BLUES.has(pal[k]) ? 2 : 0);
  const mr = faces ? 0.55 : 1;
  const off = [[0, 0], [Math.max(1, Math.round(2.4 * S * mr)), Math.max(1, Math.round(1.4 * S * mr))], [-Math.max(1, Math.round(1.1 * S * mr)), 0]];
  const out = f.data, paper = hex(WASHI);
  for (let p = 0; p < w * h; p++) { const i = p * 4; out[i] = paper[0]; out[i + 1] = paper[1]; out[i + 2] = paper[2]; out[i + 3] = 255; }
  const fam = palRgb.map((_, k) => family(k));
  for (const order of [0, 2, 1]) {
    const [ox, oy] = off[order];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const sx = clamp(x - ox, 0, w - 1), sy = clamp(y - oy, 0, h - 1), q = sy * w + sx;
      if (fam[idx[q]] !== order) continue;
      const i = (y * w + x) * 4;
      out[i] = col[q * 3]; out[i + 1] = col[q * 3 + 1]; out[i + 2] = col[q * 3 + 2];
    }
  }
  // sky was painted into col for sky pixels of any family: make sure unfilled slivers only occur at family joins
  // (the sky colours sit in the 'blue' or 'other' family; nothing more to do)

  // 6 key block ---------------------------------------------------------------
  const ink = hex(SUMI);
  const bl = dilate(boundaryLines(idxBold, w, h, palLab, faces ? 24 : 30), w, h, Math.max(1, Math.round((faces ? 1 : 1.6) * S + 0.4)));
  const sig = Math.max(1, S * 1.8);
  const fine = await keyLines(graded, { s1: sig * (faces ? 1.0 : 1.6), ratio: 1.7, eps: faces ? 0.03 : people ? 0.06 : 0.085, soft: 0.05 });
  for (let p = 0; p < w * h; p++) {
    const inSky = skyInner ? clamp((skyInner[p] - 0.82) / 0.14, 0, 1) : 0;
    const fl = fine[p] * (faces ? 1 : 0.8), fl2 = inSky > 0 ? lerp(fl, fl > 0.6 ? fl : 0, inSky) : fl;
    const a = clamp(Math.max(bl[p] * (1 - inSky), fl2), 0, 1) * 0.95;
    if (a <= 0.004) continue;
    const i = p * 4;
    out[i] = lerp(out[i], ink[0], a); out[i + 1] = lerp(out[i + 1], ink[1], a); out[i + 2] = lerp(out[i + 2], ink[2], a);
  }

  // 7 washi ---------------------------------------------------------------------
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    const fibre = (nz(x * 0.035 + 7, y * 0.9) - 0.5) * 0.5 + (nz(x * 0.9, y * 0.04 + 5) - 0.5) * 0.4 + (nz(x * 0.35, y * 0.35) - 0.5) * 0.35;
    const k = 1 + fibre * 0.07 + (f.rng() - 0.5) * 0.012;
    out[i] = clamp(out[i] * k * 0.99 + 3); out[i + 1] = clamp(out[i + 1] * k * 0.99 + 2); out[i + 2] = clamp(out[i + 2] * k * 0.975 + 1);
  }
  return f;
}

export default {
  maxSize: 1400, thumb: 520, quality: 70, format: 'webp',
  treatments: {
    default: (fx, ctx) => fx.custom(async (f) => { await woodblock(f, ctx); }),
  },
};
