/**
 * Art Nouveau photo treatment: photograph -> soft painted colour lithograph (c. 1900 poster stone).
 *
 * Pipeline (deterministic; randomness only from fx.rng / fx.noise):
 *   1. mute        pull saturation down and lift the blacks a touch (poster inks are never loud)
 *   2. flatten     Kuwahara smoothing = flat painterly colour fields, edges kept
 *   3. stones      luminance stepped into soft bands (like separate litho stones) and split-toned:
 *                  shadows -> aubergine-umber, mids -> rose-ochre / olive, lights -> cream-gold.
 *                  The grade is blended ~50% with the real colours so skin stays skin and foliage stays green.
 *   4. contour     a fine walnut-brown outline from Sobel edges of a softened copy (the Nouveau line), kept thin and light
 *   5. paper       fibre texture, a hint of gold in the highlights, light grain, warm vignette
 * Night photos switch to a teal / aubergine / lamp-gold grade.
 */
import { hex, clamp, lerp, lum } from '../../../scripts/fx/index.mjs';

// ---------------------------------------------------------------- colour ramps (luminance 0..1 -> rgb)
const DAY = [
  [0.0, '#2b1d24'],   // aubergine-umber
  [0.28, '#5c4141'],  // dusty plum-brown
  [0.5, '#9a8760'],   // khaki ochre
  [0.72, '#d6c28f'],  // old paper gold
  [0.9, '#f1e5bf'],   // cream
  [1.0, '#faf2d8'],
];
const NIGHT = [
  [0.0, '#150f1f'],
  [0.3, '#2b2a45'],
  [0.5, '#3f5d63'],   // deep teal
  [0.7, '#b98a62'],   // lamp ochre
  [0.9, '#ecd493'],
  [1.0, '#f8ecc6'],
];

function lut(stops) {
  const st = stops.map(([t, c]) => [t, hex(c)]);
  const out = new Float32Array(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let k = 0;
    while (k < st.length - 2 && t > st[k + 1][0]) k++;
    const [t0, c0] = st[k], [t1, c1] = st[k + 1];
    const u = clamp((t - t0) / (t1 - t0 || 1e-9), 0, 1);
    for (let c = 0; c < 3; c++) out[i * 3 + c] = lerp(c0[c], c1[c], u);
  }
  return out;
}
const L_DAY = lut(DAY);
const L_NIGHT = lut(NIGHT);

// ---------------------------------------------------------------- steps
// ---- hsl helpers
function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, dd = mx - mn;
  if (dd < 1e-6) return [0, 0, l];
  const s = l > 0.5 ? dd / (2 - mx - mn) : dd / (mx + mn);
  let h = mx === r ? (g - b) / dd + (g < b ? 6 : 0) : mx === g ? (b - r) / dd + 2 : (r - g) / dd + 4;
  return [h * 60, s, l];
}
function hsl2rgb(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  if (s < 1e-6) { const v = l * 255; return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t) => { t = (t + 1) % 1; return (t < 1 / 6 ? p + (q - p) * 6 * t : t < 0.5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p) * 255; };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)];
}
const bump = (h, c, w) => { let d = Math.abs(h - c); if (d > 180) d = 360 - d; return Math.exp(-(d * d) / (2 * w * w)); };

/**
 * Nouveau colour: greens slide toward olive, blues toward teal / dusty blue, reds toward terracotta-rose,
 * everything is muted, then luminance is stepped (litho stones) and lightly split-toned.
 */
function stones(ramp, { bands = 9, step = 0.5, mix = 0.25, sat = 0.82, night = false } = {}) {
  return (fx) => {
    const d = fx.data;
    for (let i = 0; i < d.length; i += 4) {
      let [h, s, l] = rgb2hsl(d[i], d[i + 1], d[i + 2]);
      // hue / saturation character per family
      const gr = bump(h, 105, 40), bl = bump(h, 215, 35), rd = Math.max(bump(h, 0, 22), bump(h, 350, 20)), yl = bump(h, 48, 22);
      h += gr * (80 - h) * 0.5 + bl * (200 - h) * 0.45;
      s *= sat * (1 - 0.3 * gr - 0.25 * bl - 0.12 * rd - 0.08 * yl);
      // stepped luminance (soft)
      const q = Math.round(l * bands) / bands;
      l = lerp(l, q, step);
      // keep lights creamy and darks inky (no pure white / black)
      l = 0.07 + l * 0.88;
      const [r, g, b] = hsl2rgb(h, clamp(s, 0, 1), clamp(l, 0, 1));
      const idx = Math.round(clamp(l, 0, 1) * 255) * 3;
      d[i] = lerp(r, ramp[idx], mix);
      d[i + 1] = lerp(g, ramp[idx + 1], mix);
      d[i + 2] = lerp(b, ramp[idx + 2], mix);
    }
  };
}

/** thin walnut contour from Sobel edges on a softened copy; strength 0..1 */
function contour({ blur = 1.5, from = 0.1, to = 0.3, strength = 0.62, ink = '#3a281d' } = {}) {
  const c = hex(ink);
  return async (fx) => {
    const { w, h } = fx;
    const g = fx.clone();
    g.blur(blur);
    await g.run();
    const L = new Float32Array(w * h);
    for (let i = 0, p = 0; i < g.data.length; i += 4, p++) L[p] = lum(g.data[i], g.data[i + 1], g.data[i + 2]);
    const d = fx.data;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        const gx = -L[i - w - 1] - 2 * L[i - 1] - L[i + w - 1] + L[i - w + 1] + 2 * L[i + 1] + L[i + w + 1];
        const gy = -L[i - w - 1] - 2 * L[i - w] - L[i - w + 1] + L[i + w - 1] + 2 * L[i + w] + L[i + w + 1];
        const m = Math.hypot(gx, gy);
        const t = clamp((m - from) / (to - from), 0, 1);
        const a = t * t * (3 - 2 * t) * strength;
        if (a > 0.01) {
          const o = i * 4;
          d[o] = lerp(d[o], c[0], a); d[o + 1] = lerp(d[o + 1], c[1], a); d[o + 2] = lerp(d[o + 2], c[2], a);
        }
      }
    }
  };
}

/** warm gold sheen on the brightest areas (a litho "gold stone") */
function gilt({ from = 0.78, amount = 0.28, color = '#e8c872' } = {}) {
  const c = hex(color);
  return (fx) => {
    const d = fx.data;
    for (let i = 0; i < d.length; i += 4) {
      const l = lum(d[i], d[i + 1], d[i + 2]);
      const t = clamp((l - from) / (1 - from), 0, 1) * amount;
      if (t > 0.002) { d[i] = lerp(d[i], c[0], t); d[i + 1] = lerp(d[i + 1], c[1], t * 0.95); d[i + 2] = lerp(d[i + 2], c[2], t * 0.7); }
    }
  };
}

// ---------------------------------------------------------------- recipe
export default {
  maxSize: 1200,
  thumb: 520,
  quality: 74,
  format: 'webp',
  treatments: {
    default: (fx, ctx) => {
      const group = ctx.tags?.includes('group');
      const scenic = ctx.category === 'scenery' || ctx.category === 'food' || ctx.category === 'books' || ctx.category === 'pets';
      return fx
        .adjust({ contrast: 1.04, brightness: 0.01, gamma: 1.03 })
        .kuwahara(group ? 2 : scenic ? 4 : 3)
        .custom(stones(L_DAY, { bands: 9, step: 0.5, mix: 0.22, sat: scenic ? 0.8 : 0.85 }))
        .custom(contour({ blur: group ? 1.1 : 1.5, from: group ? 0.14 : 0.1, to: group ? 0.36 : 0.3, strength: group ? 0.42 : 0.5 }))
        .custom(gilt())
        .texture('paper', { opacity: 0.2, scale: 0.9, mode: 'multiply', tintColor: '#f3e6c0' })
        .grain(0.014)
        .vignette(0.3, { softness: 0.7, color: '#5a3d22' });
    },
    night: (fx, ctx) => {
      const group = ctx.tags?.includes('group');
      return fx
        .adjust({ contrast: 1.04, brightness: 0.05, gamma: 1.18 })
        .kuwahara(group ? 2 : 3)
        .custom(stones(L_NIGHT, { bands: 9, step: 0.5, mix: 0.3, sat: 0.8, night: true }))
        .custom(contour({ blur: 1.4, from: 0.12, to: 0.34, strength: 0.5, ink: '#1b1226' }))
        .custom(gilt({ from: 0.7, amount: 0.22 }))
        .texture('paper', { opacity: 0.16, scale: 0.9, mode: 'multiply', tintColor: '#e9dcc0' })
        .grain(0.016)
        .vignette(0.34, { softness: 0.7, color: '#150f1f' });
    },
  },
  pick: (ctx) => (ctx.tags?.includes('night') ? 'night' : 'default'),
};
