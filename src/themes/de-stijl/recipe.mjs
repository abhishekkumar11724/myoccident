/**
 * De Stijl photo treatment: "neoplastic print".
 *
 * Neoplasticism allows exactly six values: black, white, grey and the primaries red / yellow / blue, as flat fields.
 * This recipe forces a photograph into that palette while keeping faces readable:
 *   1. local exposure (backlit faces lift) + contrast + a little saturation, so hue is decisive
 *   2. median + Kuwahara: big, flat regions with crisp edges
 *   3. every pixel is classified into the six values by lightness and hue family
 *        shadows -> black | neutral highlights -> white | neutral mid -> grey
 *        warm mid-tones (skin shade, red clothes, brick) -> red | warm highlights (lit skin, sand, sun) -> yellow
 *        cool tones -> blue | greens -> blue when dark, yellow when light
 *   4. a majority filter removes speckle so the colour fields are large rectangles of paint, not noise
 *   5. a thin black contour pass (Sobel on the smoothed image) draws eyes, glasses, jaw and horizon like Mondrian's lines
 * Output is PNG (flat colours band badly in lossy webp and compress very well as PNG).
 * Variants: hero (most detail), people (rides), group (smaller faces), scene (broad fields), night (lifted shadows).
 */

const PAL = {
  k: [17, 17, 17],
  w: [246, 245, 238],
  g: [207, 206, 198],
  r: [211, 40, 29],
  y: [246, 197, 22],
  b: [28, 63, 148],
};
const ORDER = ['k', 'w', 'g', 'r', 'y', 'b'];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/** Divide by a heavily blurred copy (partially) so shaded faces on bright backgrounds lift. Hue is preserved (gain on all channels). */
const localExposure = ({ strength = 0.5, target = 0.5, sigmaFrac = 0.09 } = {}) => (fx) =>
  fx.custom(async (f) => {
    const c = f.clone();
    c.grayscale().blur(Math.max(8, f.w * sigmaFrac));
    await c.run();
    const d = f.data, b = c.data;
    for (let i = 0; i < d.length; i += 4) {
      const loc = Math.max(0.06, b[i] / 255);
      const gain = clamp(Math.pow(target / loc, strength), 0.6, 2.6);
      d[i] = Math.min(255, d[i] * gain);
      d[i + 1] = Math.min(255, d[i + 1] * gain);
      d[i + 2] = Math.min(255, d[i + 2] * gain);
    }
  });

/** Percentile levels on luminance so every photo uses the full range. */
const autoLevels = ({ lo = 0.015, hi = 0.99 } = {}) => (fx) =>
  fx.custom(async (f) => {
    const d = f.data, n = d.length / 4, hist = new Uint32Array(256);
    for (let i = 0; i < d.length; i += 4) hist[Math.round(0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2])]++;
    const at = (q) => { let acc = 0; for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= q * n) return v; } return 255; };
    const black = at(lo), white = Math.max(black + 60, at(hi)), s = 255 / (white - black);
    for (let i = 0; i < d.length; i += 4) { d[i] = (d[i] - black) * s; d[i + 1] = (d[i + 1] - black) * s; d[i + 2] = (d[i + 2] - black) * s; }
  });

/** r,g,b 0-255 -> index into ORDER (k w g r y b). Colour is rare on purpose: only strongly saturated areas become a primary. */
function classify(r, g, b, o) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  if (L < o.black) return 0; // k
  const S = mx === 0 ? 0 : (mx - mn) / mx;
  let h = 0;
  const dd = mx - mn;
  if (dd > 0) {
    if (mx === r) h = ((g - b) / dd) % 6;
    else if (mx === g) h = (b - r) / dd + 2;
    else h = (r - g) / dd + 4;
    h *= 60; if (h < 0) h += 360;
  }
  const warm = h < 50 || h >= 335; // skin, brick, wood, red cloth
  if (S < (warm ? o.warmNeutral : o.neutral)) {
    // neutral: skin and stone fall here -> white / grey / black by lightness
    const wt = warm ? o.skinWhite : o.white;
    return L > wt ? 1 : L > (warm ? o.skinGrey : o.grey) ? 2 : 0;
  }
  if (warm) return h < 30 || h >= 335 ? (L > 0.82 ? 4 : 3) : 4; // red (or yellow if blazing) / orange -> yellow
  if (h < 98) return L > 0.38 ? 4 : 0; // yellow-green
  if (h < 172) return L > o.greenLit ? 4 : 5; // green: light -> yellow, else blue
  if (h < 268) return L > o.skyWhite ? 1 : 5; // cyan-blue: bright sky -> white
  return L > 0.45 ? 3 : 5; // purple / magenta
}

/** Full pipeline step. */
const neoplastic = (o = {}) => (fx) => {
  const opt = { black: 0.2, neutral: 0.3, warmNeutral: 0.52, white: 0.72, grey: 0.36, skinWhite: 0.6, skinGrey: 0.34, greenLit: 0.55, skyWhite: 0.82, edge: 0.22, thick: 2, majority: 2, ...o };
  return fx.custom(async (f) => {
    const { w, h, data: d } = f;
    // contour lines from the smoothed image
    let lines = null;
    if (opt.edge > 0) {
      const e = f.clone();
      e.edges({ mode: 'only', threshold: opt.edge, thickness: opt.thick, color: '#000', paper: '#fff', smooth: opt.edgeSmooth ?? 1.6 });
      await e.run();
      lines = e.data;
    }
    let lab = new Uint8Array(w * h);
    for (let p = 0, i = 0; p < w * h; p++, i += 4) lab[p] = classify(d[i], d[i + 1], d[i + 2], opt);
    // majority filter (removes speckle -> large flat fields)
    const R = opt.majority;
    for (let pass = 0; pass < (opt.passes ?? 1) && R > 0; pass++) {
      const out = new Uint8Array(w * h);
      const cnt = new Uint16Array(6);
      for (let y = 0; y < h; y++) {
        const y0 = Math.max(0, y - R), y1 = Math.min(h - 1, y + R);
        for (let x = 0; x < w; x++) {
          cnt.fill(0);
          const x0 = Math.max(0, x - R), x1 = Math.min(w - 1, x + R);
          for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) cnt[lab[yy * w + xx]]++;
          let best = lab[y * w + x], bc = cnt[best];
          for (let k = 0; k < 6; k++) if (cnt[k] > bc) { bc = cnt[k]; best = k; }
          out[y * w + x] = best;
        }
      }
      lab = out;
    }
    for (let p = 0, i = 0; p < w * h; p++, i += 4) {
      const c = lines && lines[i] < 120 ? PAL.k : PAL[ORDER[lab[p]]];
      d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
    }
  });
};

const HERO = new Set(['portraits/01-selfie-maroon', 'portraits/02-smile-jacket', 'portraits/03-red-kurta-seated']);

const base = (radius, { exposure = 0.55, contrast = 1.18, sat = 1.15 } = {}) => (fx) => {
  localExposure({ strength: exposure })(fx);
  autoLevels()(fx);
  fx.adjust({ contrast, saturation: sat }).median(3).kuwahara(radius);
  return fx;
};

export default {
  maxSize: 900,
  thumb: 440,
  quality: 90,
  format: 'png',
  treatments: {
    hero: (fx) => { base(6, { exposure: 0.6 })(fx); return neoplastic({ edge: 0.2, thick: 2, majority: 4, passes: 1 })(fx); },
    people: (fx) => { base(5)(fx); return neoplastic({ edge: 0.22, thick: 2, majority: 3 })(fx); },
    group: (fx) => { base(4, { exposure: 0.5 })(fx); return neoplastic({ edge: 0.22, thick: 2, majority: 2, passes: 1 })(fx); },
    night: (fx) => { base(4, { exposure: 0.95, contrast: 1.08 })(fx); return neoplastic({ black: 0.16, grey: 0.3, skinWhite: 0.52, white: 0.66, edge: 0.21, majority: 3 })(fx); },
    scene: (fx) => { base(6, { exposure: 0.4 })(fx); return neoplastic({ edge: 0.26, thick: 3, majority: 3 })(fx); },
  },
  pick: (ctx) => {
    const tags = ctx.tags || [];
    if (HERO.has(ctx.id)) return 'hero';
    if (tags.includes('night')) return 'night';
    if (ctx.category === 'friends-trips') return 'group';
    if (ctx.category === 'portraits' || ctx.category === 'bikes') return 'people';
    if (ctx.category === 'adventure') return tags.includes('solo') ? 'people' : 'scene';
    return 'scene';
  },
};
