/**
 * Steampunk photo treatment: phone photograph -> Victorian albumen print with a burin-engraved shadow hatch.
 *
 * Pipeline (deterministic):
 *   1. tone       luminance only, percentile stretch + gentle S-curve (night shots get lifted shadows)
 *   2. detail     light unsharp so faces keep their features
 *   3. engraving  diagonal line-screen "hatch" multiplied into midtones/shadows, a second cross-hatch only in the deepest darks
 *   4. colour     gradient map: walnut shadows -> copper -> brass -> cream highlights (sepia / brass duotone)
 *   5. (no edge-ink pass: it blotched faces)
 *   6. ageing     soft vignette and a low-frequency aged-paper stain (no grain: keeps files small)
 */
import { clamp, lerp, lum } from '../../../scripts/fx/index.mjs';

const SEPIA = [[0, '#1a0e06'], [0.16, '#3b2311'], [0.38, '#7b5028'], [0.6, '#bb8c48'], [0.8, '#e8cc88'], [1, '#fcf3d6']];
const NIGHT = [[0, '#1d1108'], [0.16, '#3f2612'], [0.38, '#83562b'], [0.6, '#c3944e'], [0.8, '#ecd18f'], [1, '#fdf4d8']];

/** percentile stretch + curve on luminance (written back as grey) */
const tone = ({ gamma = 1, s = 0.35, lo = 0.015, hi = 0.99 } = {}) => async (f) => {
  const d = f.data, n = f.w * f.h, hist = new Uint32Array(256);
  const L = new Float32Array(n);
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    const l = (d[i] * 0.34 + d[i + 1] * 0.5 + d[i + 2] * 0.16) / 255; // slightly orthochromatic: skin glows, skies hold detail
    L[p] = l; hist[Math.min(255, (l * 255) | 0)]++;
  }
  let acc = 0, a = 0, b = 255;
  for (let i = 0; i < 256; i++) { acc += hist[i]; if (acc >= n * lo) { a = i; break; } }
  acc = 0;
  for (let i = 0; i < 256; i++) { acc += hist[i]; if (acc >= n * hi) { b = i; break; } }
  const span = Math.max(40, b - a);
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    let v = clamp((L[p] * 255 - a) / span, 0, 1);
    v = Math.pow(v, gamma);
    v = lerp(v, v * v * (3 - 2 * v), s);
    const g = v * 255;
    d[i] = g; d[i + 1] = g; d[i + 2] = g;
  }
};

/** multiply an engraved line-screen into the grey image (k = strength) */
const hatch = ({ pitch, angle, gamma, k, blurSigma = 0.8 }) => async (f) => {
  const L = f.clone();
  L.blur(blurSigma).lineScreen({ pitch, angle, ink: '#000', paper: '#fff', gamma });
  await L.run();
  const d = f.data, h = L.data;
  for (let i = 0; i < d.length; i += 4) {
    const m = lerp(1, h[i] / 255, k); // 1 = no ink, <1 = hatch line
    d[i] *= m; d[i + 1] *= m; d[i + 2] *= m;
  }
};

function engrave(fx, ctx, o) {
  const pitch = Math.max(3.4, fx.w * 0.0048);
  return fx
    .custom(tone(o.tone))
    .sharpen(1.6, { m1: 1.0, m2: 2.2 })
    .custom(hatch({ pitch, angle: -36, gamma: o.hatchGamma, k: o.hatchK }))
    .custom(hatch({ pitch: pitch * 0.9, angle: 42, gamma: 2.4, k: o.crossK, blurSigma: 1.1 }))
    .gradientMap(o.ramp, { contrast: o.contrast })
    .vignette(0.34, { softness: 0.55, color: '#2a1608' })
    .texture('paper', { opacity: 0.14, scale: 0.35, mode: 'multiply', tintColor: '#f6e9c4' });
}

export default {
  maxSize: 960, thumb: 480, quality: 58, format: 'webp',
  treatments: {
    default: (fx, ctx) => {
      const person = ctx.tags?.includes('solo') || ctx.tags?.includes('group') || ctx.category === 'portraits';
      return engrave(fx, ctx, { tone: { gamma: 0.82, s: 0.3 }, hatchGamma: 1.7, hatchK: person ? 0.34 : 0.42, crossK: person ? 0.18 : 0.26, ramp: SEPIA, contrast: 1.04 });
    },
    night: (fx, ctx) => engrave(fx, ctx, { tone: { gamma: 0.6, s: 0.22, lo: 0.005, hi: 0.995 }, hatchGamma: 1.5, hatchK: 0.3, crossK: 0.14, ramp: NIGHT, contrast: 1.0 }),
  },
  pick: (ctx) => (ctx.tags?.includes('night') ? 'night' : 'default'),
};
