/**
 * Vaporwave photo treatment: a dreamy tritone "gradient map" with bloom.
 *
 * Luminance is mapped onto indigo -> violet -> orchid -> pink -> peach -> cream, so structure (and faces) come
 * from the original lights and darks while skin tones drift pink/peach. A cyan/magenta soft-light wash adds the
 * dual-light look, blurred highlights are screened back in for the glow, and faint scanlines + grain finish it.
 * Variants: hero (cleanest, big glow), default, group (gentle: many faces), night (Bayer-dithered 8-colour pixel
 * look + strong bloom), scene (scenery/books/food: sunset-sky grade, cyan shadows).
 * Everything is deterministic (fx.rng / no Math.random).
 */

const RAMP = [
  [0.0, '#0c1466'],
  [0.18, '#3b2bb8'],
  [0.38, '#9a4fe6'],
  [0.56, '#ff6fc4'],
  [0.76, '#ffbfae'],
  [1.0, '#fff7e8'],
];
const RAMP_SCENE = [
  [0.0, '#081a73'],
  [0.2, '#2f55d6'],
  [0.4, '#9b5cf0'],
  [0.58, '#ff7ccf'],
  [0.78, '#ffcaa8'],
  [1.0, '#fffbe8'],
];
const DITHER_PAL = ['#12062e', '#2f1475', '#5b2bb5', '#b252d6', '#ff71ce', '#ffb3a7', '#ffe0cf', '#fff6e6'];

const NIGHT = new Set([
  'portraits/05-lakeside-night', 'bikes/03-bike-night-rider', 'bikes/05-night-stand', 'bikes/06-helmet-night',
  'friends-trips/06-fairground-trio', 'friends-trips/07-red-carpet-trio', 'friends-trips/09-night-group',
]);
const SCENE = new Set(['scenery', 'books', 'food', 'work-and-lifestyle', 'pets']);

const run = (fx, ...steps) => steps.reduce((f, s) => s(f), fx);

/** screen-blend a blurred, pink-tinted copy of the highlights */
const bloom = ({ strength = 0.5, threshold = 150, sigma = 10, tint = [255, 150, 215] } = {}) => (fx) =>
  fx.custom(async (f) => {
    const g = f.clone();
    g.px((r, gg, b) => {
      const k = Math.max(0, (0.2126 * r + 0.7152 * gg + 0.0722 * b) - threshold) * 2.6;
      return [Math.min(255, (k * tint[0]) / 255), Math.min(255, (k * tint[1]) / 255), Math.min(255, (k * tint[2]) / 255)];
    }).blur(sigma);
    await g.run();
    const d = f.data, e = g.data;
    for (let i = 0; i < d.length; i += 4) for (let c = 0; c < 3; c++) d[i + c] = 255 - ((255 - d[i + c]) * (255 - e[i + c] * strength)) / 255;
  });

/** stretch the 1st..99th luminance percentile to full range so every photo uses the whole ramp */
const autoLevels = ({ lo = 0.01, hi = 0.995 } = {}) => (fx) =>
  fx.custom((f) => {
    const d = f.data, hist = new Uint32Array(256);
    let n = 0;
    for (let i = 0; i < d.length; i += 4) { hist[Math.round(0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2])]++; n++; }
    let acc = 0, a = 0, b = 255;
    for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= n * lo) { a = v; break; } }
    acc = 0;
    for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= n * hi) { b = v; break; } }
    const s = 255 / Math.max(40, b - a);
    for (let i = 0; i < d.length; i += 4) for (let c = 0; c < 3; c++) d[i + c] = (d[i + c] - a) * s;
  });

const base = ({ contrast = 1.06, saturation = 0.9, gamma = 1.25, mapContrast = 1.0, ramp = RAMP } = {}) => (fx) =>
  autoLevels()(fx.adjust({ saturation })).adjust({ contrast, gamma }).gradientMap(ramp, { contrast: mapContrast });

const dualLight = ({ opacity = 0.42, angle = 28 } = {}) => (fx) =>
  fx.gradientOverlay(angle, [[0, '#01cdfe'], [0.5, '#808080'], [1, '#ff2fb0']], { mode: 'softlight', opacity });

const sky = ({ opacity = 0.4 } = {}) => (fx) =>
  fx.gradientOverlay(90, [[0, '#a99bff'], [0.55, '#808080'], [1, '#ffb27a']], { mode: 'softlight', opacity });

const finish = ({ scan = 0.07, grain = 0.01 } = {}) => (fx) =>
  fx.scanlines({ gap: 4, opacity: scan, color: '#2a1457' }).grain(grain);

export default {
  maxSize: 1000, thumb: 480, quality: 62, format: 'webp',
  treatments: {
    default: (fx) => run(fx, base(), dualLight(), bloom({ strength: 0.45 }), finish()),

    hero: (fx) => run(fx, base({ contrast: 1.08, saturation: 0.95 }), dualLight({ opacity: 0.36 }), bloom({ strength: 0.55, sigma: 12 }), finish({ scan: 0.05, grain: 0.008 })),

    group: (fx) => run(fx, base({ contrast: 1.05, saturation: 0.85, mapContrast: 1.0 }), dualLight({ opacity: 0.34 }), bloom({ strength: 0.4 }), finish({ scan: 0.06 })),

    night: (fx) =>
      run(fx,
        base({ contrast: 1.1, gamma: 1.3 }),
        bloom({ strength: 0.5, threshold: 120, sigma: 9 }),
        (f) => f.quantize(DITHER_PAL, { dither: 'bayer', strength: 40 }),
        dualLight({ opacity: 0.22 }),
        finish({ scan: 0.09, grain: 0.006 })),

    scene: (fx) => run(fx, base({ ramp: RAMP_SCENE, contrast: 1.08, saturation: 1, gamma: 1.2 }), sky({ opacity: 0.5 }), dualLight({ opacity: 0.2 }), bloom({ strength: 0.4, threshold: 160 }), finish({ scan: 0.06 })),
  },
  pick: (ctx) => {
    const tags = ctx.tags || [];
    if (NIGHT.has(ctx.id) || tags.includes('night')) return 'night';
    if (tags.includes('hero')) return 'hero';
    if (tags.includes('group') || ctx.category === 'friends-trips') return 'group';
    if (SCENE.has(ctx.category) || (ctx.category === 'adventure' && tags.includes('landscape'))) return 'scene';
    return 'default';
  },
};
