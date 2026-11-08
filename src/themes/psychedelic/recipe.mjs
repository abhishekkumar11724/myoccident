/**
 * Psychedelic photo treatment: "heat-map solarisation" for a 1967 light-show poster.
 *
 *   1. punch contrast + saturation
 *   2. luminance -> rainbow ramp (violet -> hot pink -> orange -> yellow -> [turquoise] -> cream), blended with the
 *      saturated original so faces keep their own local colour and detail (warm mid-tones ~ skin)
 *   3. tie-dye cross-hue: a diagonal turquoise / violet / pink soft-light wash
 *   4. a coloured halftone screen mixed in at low opacity (print texture, Day-Glo ink feel)
 *   5. screen-blended radial glow on the highlights, deep-violet vignette, a little grain
 * Variants (picked from ctx.tags / category): hero + portrait (faces first), group (gentlest),
 * night (cobalt / violet / cyan neon with extra bloom), scene (landscapes, books, food, desk: stronger contouring).
 * Everything is deterministic (fx.rng only).
 */

const INK = '#1c0838';
const PAPER = '#fff3d1';
const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

// ------------------------------------------------------------------ ramps (dark -> light)
const SKIN = [[0, '#24095a'], [0.14, '#5a22c9'], [0.3, '#ff2e93'], [0.5, '#ff7a12'], [0.72, '#ffd91f'], [1, '#fff6dc']];
const COOL = [[0, '#1a0b5e'], [0.14, '#2f5bff'], [0.3, '#10d9c4'], [0.5, '#ffd91f'], [0.72, '#ff7a12'], [1, '#fff3d1']];
const NIGHT = [[0, '#0d0430'], [0.14, '#3b1bb5'], [0.32, '#e0207f'], [0.52, '#ff7ab5'], [0.74, '#35e8d4'], [1, '#e7fff8']];
const SCENE = [[0, '#24095a'], [0.12, '#6a2cff'], [0.26, '#ff2e93'], [0.4, '#ff7a12'], [0.54, '#ffd91f'], [0.68, '#10d9c4'], [0.84, '#7a3cff'], [1, PAPER]];

// ------------------------------------------------------------------ steps (each takes + returns an fx)

/** blend another processed copy of the current image over it: out = lerp(current, other, t) */
const mixWith = (make, t) => (fx) =>
  fx.custom(async (f) => {
    const o = f.clone();
    make(o);
    await o.run();
    const d = f.data, e = o.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] += (e[i] - d[i]) * t;
      d[i + 1] += (e[i + 1] - d[i + 1]) * t;
      d[i + 2] += (e[i + 2] - d[i + 2]) * t;
    }
  });

/** percentile stretch + gamma so the median lands on `mid`: every photo starts from the same exposure */
const autoLevels = (mid = 0.5, lo = 0.015, hi = 0.985) => (fx) =>
  fx.custom((f) => {
    const d = f.data, hist = new Uint32Array(256);
    let n = 0;
    for (let i = 0; i < d.length; i += 4) { hist[Math.round(lum(d[i], d[i + 1], d[i + 2]))]++; n++; }
    const at = (q) => { let a = 0; for (let v = 0; v < 256; v++) { a += hist[v]; if (a >= q * n) return v; } return 255; };
    const b = at(lo), w = Math.max(b + 40, at(hi)), m = at(0.5);
    const tm = Math.min(0.95, Math.max(0.05, (m - b) / (w - b)));
    const gamma = Math.log(mid) / Math.log(tm); // out = in^gamma maps tm -> mid
    const g = Math.min(1.6, Math.max(0.45, gamma));
    for (let i = 0; i < d.length; i += 4) {
      for (let c = 0; c < 3; c++) d[i + c] = 255 * Math.pow(Math.min(1, Math.max(0, (d[i + c] - b) / (w - b))), g);
    }
  });

const punch = ({ contrast = 1.1, saturation = 1.4, mid = 0.5 } = {}) => (fx) => autoLevels(mid)(fx).adjust({ contrast, saturation });

const heat = (ramp, t, contrast = 1.18) => mixWith((o) => o.gradientMap(ramp, { contrast }), t);

const tieDye = ({ angle = 28, opacity = 0.5, stops = ['#10d9c4', '#7a3cff', '#ff2e93'], mode = 'softlight' } = {}) => (fx) =>
  fx.gradientOverlay(angle + (fx.seed % 40), (fx.seed & 1) ? [...stops].reverse() : stops, { mode, opacity });

const halftoneMix = (t, divisor = 100, paper = '#2a0d63') => (fx) =>
  fx.custom(async (f) => {
    const cell = Math.max(5, Math.round(f.w / divisor));
    const o = f.clone();
    o.halftone({ cell, angle: 45, color: true, paper, gamma: 0.9, boost: 1.0 });
    await o.run();
    const d = f.data, e = o.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] += (e[i] - d[i]) * t;
      d[i + 1] += (e[i + 1] - d[i + 1]) * t;
      d[i + 2] += (e[i + 2] - d[i + 2]) * t;
    }
  });

/** screen-blended bloom of the brightest areas, tinted */
const glow = ({ strength = 0.55, threshold = 150, sigma = 12, tint = [255, 120, 190] } = {}) => (fx) =>
  fx.custom(async (f) => {
    const g = f.clone();
    g.px((r, gg, b) => { const l = Math.max(0, lum(r, gg, b) - threshold) * 3.2; return [l, l, l]; }).blur(sigma);
    await g.run();
    const d = f.data, e = g.data;
    for (let i = 0; i < d.length; i += 4) {
      const k = (e[i] / 255) * strength;
      for (let c = 0; c < 3; c++) {
        const add = 255 * k * (tint[c] / 255);
        d[i + c] = 255 - ((255 - d[i + c]) * (255 - add)) / 255;
      }
    }
  });

/** soft radial lift in the centre + violet vignette, so the subject glows on a deep field */
const aura = ({ lift = 0.12, vig = 0.4 } = {}) => (fx) =>
  fx.custom((f) => {
    const { w, h, data: d } = f;
    const cx = w * 0.5, cy = h * 0.46, R = Math.hypot(w, h) * 0.5;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4, q = Math.min(1, Math.hypot(x - cx, y - cy) / R);
      const l = (1 - q) * (1 - q) * lift;
      const v = Math.pow(q, 2.2) * vig;
      for (let c = 0; c < 3; c++) {
        let val = d[i + c] + (255 - d[i + c]) * l;
        val = val * (1 - v) + [28, 8, 56][c] * v;
        d[i + c] = val;
      }
    }
  });

const run = (fx, ...steps) => steps.reduce((f, s) => s(f), fx);

const HERO = new Set(['portraits/01-selfie-maroon', 'portraits/02-smile-jacket', 'portraits/03-red-kurta-seated']);
const SCENE_CATS = new Set(['scenery', 'books', 'food', 'work-and-lifestyle']);

export default {
  maxSize: 1200, thumb: 520, quality: 70, format: 'webp',
  treatments: {
    portrait: (fx, ctx) =>
      run(fx,
        punch({ contrast: 1.1, saturation: 1.35 }),
        heat(ctx.seed % 3 === 0 ? COOL : SKIN, 0.58),
        tieDye({ opacity: 0.42 }),
        halftoneMix(0.2),
        glow({ strength: 0.5 }),
        aura({ lift: 0.1, vig: 0.38 }),
        (f) => f.grain(0.02)),

    hero: (fx) =>
      run(fx,
        punch({ contrast: 1.08, saturation: 1.3 }),
        heat(SKIN, 0.5),
        tieDye({ opacity: 0.4, angle: 35 }),
        halftoneMix(0.16),
        glow({ strength: 0.5 }),
        aura({ lift: 0.09, vig: 0.34 }),
        (f) => f.grain(0.018)),

    group: (fx, ctx) =>
      run(fx,
        punch({ contrast: 1.08, saturation: 1.3 }),
        heat(ctx.seed % 3 === 0 ? COOL : SKIN, 0.46),
        tieDye({ opacity: 0.36 }),
        halftoneMix(0.15),
        glow({ strength: 0.42 }),
        aura({ lift: 0.06, vig: 0.3 }),
        (f) => f.grain(0.02)),

    night: (fx) =>
      run(fx,
        punch({ contrast: 1.1, saturation: 1.4, mid: 0.42 }),
        heat(NIGHT, 0.62, 1.12),
        tieDye({ opacity: 0.4, stops: ['#2f5bff', '#7a3cff', '#ff2e93'] }),
        halftoneMix(0.16),
        glow({ strength: 0.72, threshold: 120, tint: [90, 230, 255] }),
        aura({ lift: 0.05, vig: 0.4 }),
        (f) => f.grain(0.02)),

    scene: (fx) =>
      run(fx,
        punch({ contrast: 1.12, saturation: 1.4 }),
        heat(SCENE, 0.68, 1.2),
        tieDye({ opacity: 0.4, mode: 'overlay' }),
        halftoneMix(0.2),
        glow({ strength: 0.5, tint: [255, 160, 90] }),
        aura({ lift: 0.06, vig: 0.34 }),
        (f) => f.grain(0.02)),
  },
  pick: (ctx) => {
    const tags = ctx.tags ?? [];
    if (HERO.has(ctx.id)) return 'hero';
    if (tags.includes('night')) return 'night';
    if (ctx.category === 'friends-trips' || ctx.category === 'pets' || tags.includes('group')) return 'group';
    if (SCENE_CATS.has(ctx.category) && !tags.includes('solo')) return 'scene';
    if (ctx.category === 'adventure' && tags.includes('landscape') && !tags.includes('solo')) return 'scene';
    return 'portrait';
  },
};
