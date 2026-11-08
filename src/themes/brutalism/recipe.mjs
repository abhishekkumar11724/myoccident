/**
 * Brutalism photo treatment: "cast in concrete".
 * Stark greyscale -> local exposure balance (so backlit faces survive) -> percentile auto-levels -> crushed
 * contrast -> warm-grey concrete tone ramp -> weathering mottle + air-void pitting from procedural textures
 * -> coarse 2px mono grain. The original colour returns on hover in the page JS/CSS.
 */

// shuttering-black -> wet concrete -> dry concrete -> limewash white
const RAMP = [
  [0.0, '#0c0c0b'],
  [0.34, '#403e3a'],
  [0.68, '#a09d95'],
  [1.0, '#f1efe9'],
];

/** Local exposure: divide by a heavily blurred copy (partially), so shadows on a bright background lift. */
const localExposure = ({ strength = 0.5, target = 0.5, sigmaFrac = 0.09 } = {}) => (fx) =>
  fx.custom(async (f) => {
    const c = f.clone();
    c.blur(Math.max(8, f.w * sigmaFrac));
    await c.run();
    const d = f.data, b = c.data;
    for (let i = 0; i < d.length; i += 4) {
      const loc = Math.max(0.06, b[i] / 255);
      const gain = Math.pow(target / loc, strength);
      const o = Math.min(255, d[i] * Math.min(3.2, Math.max(0.55, gain)));
      d[i] = d[i + 1] = d[i + 2] = o;
    }
  });

/** Percentile levels + a gamma that pulls the median towards `target`. Works on a greyscale image. */
const autoTone = ({ lo = 0.015, hi = 0.985, target = 0.46, gmin = 0.55, gmax = 1.2 } = {}) => (fx) =>
  fx.custom(async (f) => {
    const d = f.data, n = d.length / 4, hist = new Uint32Array(256);
    for (let i = 0; i < d.length; i += 4) hist[d[i] | 0]++;
    const at = (q) => { let acc = 0; for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= q * n) return v; } return 255; };
    const black = at(lo), white = Math.max(black + 40, at(hi)), med = at(0.5);
    const m = Math.min(0.9, Math.max(0.08, (med - black) / (white - black)));
    const g = Math.min(gmax, Math.max(gmin, Math.log(target) / Math.log(m)));
    const lut = new Uint8ClampedArray(256);
    for (let v = 0; v < 256; v++) lut[v] = 255 * Math.pow(Math.min(1, Math.max(0, (v - black) / (white - black))), g);
    for (let i = 0; i < d.length; i += 4) { const o = lut[d[i] | 0]; d[i] = d[i + 1] = d[i + 2] = o; }
  });

/** Clumpy film grain: one random value per `cell` x `cell` block, strongest in the midtones. */
const coarseGrain = (amount = 0.07, cell = 2) => (fx) =>
  fx.custom(async (f) => {
    const { w, h, data: d, rng } = f, A = amount * 255, bw = Math.ceil(w / cell), bh = Math.ceil(h / cell);
    const n = new Float32Array(bw * bh);
    for (let i = 0; i < n.length; i++) n[i] = (rng() + rng() - 1) * A; // triangular distribution
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4, l = d[i] / 255, k = 0.55 + 0.9 * (1 - Math.abs(l - 0.5) * 2);
      const v = n[((y / cell) | 0) * bw + ((x / cell) | 0)] * k;
      d[i] += v; d[i + 1] += v; d[i + 2] += v;
    }
  });

export default {
  maxSize: 1200,
  thumb: 480,
  quality: 62,
  format: 'webp',
  treatments: {
    default: (fx) => {
      fx.grayscale();
      localExposure({ strength: 0.5 })(fx);
      autoTone()(fx);
      fx.adjust({ contrast: 1.3 })
        .sharpen(1.1, { m1: 1.2, m2: 2.4 })
        .gradientMap(RAMP, { contrast: 1.06 })
        .texture('cloud', { opacity: 0.2, scale: 1.6, mode: 'multiply' })
        .texture('speckle', { opacity: 0.1, scale: 1.2, mode: 'multiply' });
      coarseGrain(0.075, 2)(fx);
      return fx;
    },
  },
};
