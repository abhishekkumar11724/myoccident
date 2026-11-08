/**
 * Glitch photo treatment: "signal damage" over a cyan/magenta grade.
 *
 * Every treatment = grade (contrast + diagonal cyan->magenta overlay) -> optional pixel-sort drips / block
 * corruption (both MASKED AWAY from the central subject ellipse so faces stay recognisable) -> thin-band slice
 * shifts -> RGB channel split -> broad scan bands -> grain.
 * Variants: hero (strongest), default (portraits, trips, bikes), night (neon + bloom), group (gentle: many faces),
 * scene (scenery / books / food / desk: heavier sorting and blocks, no faces to protect).
 * Everything uses fx.rng, so rebuilds are deterministic.
 */

const CYAN = '#00ffd5';
const MAGENTA = '#ff2e63';

const HERO = new Set(['portraits/01-selfie-maroon', 'portraits/02-smile-jacket', 'portraits/03-red-kurta-seated']);
const NIGHT = new Set([
  'portraits/05-lakeside-night', 'bikes/03-bike-night-rider', 'bikes/05-night-stand', 'bikes/06-helmet-night',
  'friends-trips/06-fairground-trio', 'friends-trips/07-red-carpet-trio', 'friends-trips/09-night-group',
]);
const SCENE = new Set(['scenery', 'books', 'food', 'work-and-lifestyle']);

const clampInt = (v, a, b) => (v < a ? a : v > b ? b : Math.round(v));
const lumOf = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/** true inside the protected "subject" ellipse (fractions of width/height). */
const safeZone = (w, h, rx = 0.3, ry = 0.38, cx = 0.5, cy = 0.45) => (x, y) => {
  const nx = (x / w - cx) / rx, ny = (y / h - cy) / ry;
  return nx * nx + ny * ny < 1;
};

// ------------------------------------------------------------------ steps (each takes + returns an fx)

const SHADOW = [0, 205, 190];   // teal in the shadows
const LIGHT = [255, 70, 130];   // magenta-pink in the highlights
const lerp = (a, b, t) => a + (b - a) * t;

const grade = ({ contrast = 1.2, saturation = 0.98, tint = 0.34, split = 0.3, angleBase = 25 } = {}) => (fx) => {
  const flip = fx.seed & 1;
  const stops = flip ? [MAGENTA, CYAN] : [CYAN, MAGENTA];
  return fx
    .adjust({ contrast, saturation, gamma: 1.04 })
    .levels(8, 246)
    // split-tone: teal shadows, magenta highlights (the signature "damaged signal" grade)
    .px((r, g, b) => {
      const l = lumOf(r, g, b) / 255, sw = Math.pow(1 - l, 1.3) * split, hw = Math.pow(l, 2.2) * split;
      return [lerp(lerp(r, SHADOW[0], sw), LIGHT[0], hw), lerp(lerp(g, SHADOW[1], sw), LIGHT[1], hw), lerp(lerp(b, SHADOW[2], sw), LIGHT[2], hw)];
    })
    .gradientOverlay(angleBase + (fx.seed % 45), stops, { mode: 'overlay', opacity: tint })
    .px((r, g, b) => [Math.max(r, 8), Math.max(g, 8), Math.max(b, 12)]); // lift blacks toward #0a0a0f
};

/** screen-blended bloom of the brightest areas */
const glow = ({ strength = 0.5, threshold = 165, sigma = 9 } = {}) => (fx) =>
  fx.custom(async (f) => {
    const g = f.clone();
    g.px((r, gg, b) => [Math.max(0, r - threshold) * 3, Math.max(0, gg - threshold) * 3, Math.max(0, b - threshold) * 3]).blur(sigma);
    await g.run();
    const d = f.data, e = g.data;
    for (let i = 0; i < d.length; i += 4) {
      for (let c = 0; c < 3; c++) d[i + c] = 255 - ((255 - d[i + c]) * (255 - e[i + c] * strength)) / 255;
    }
  });

/** pixel sorting: runs of pixels inside a luminance band are sorted by brightness along `axis`. */
const sortRuns = ({ axis = 'y', bands = 4, thick = [10, 55], lo = 0.14, hi = 0.82, maxLen = [0.15, 0.4], protect = true } = {}) => (fx) =>
  fx.custom((f) => {
    const { w, h, data: d, rng: r } = f;
    const safe = protect ? safeZone(w, h) : () => false;
    const alongN = axis === 'y' ? h : w, acrossN = axis === 'y' ? w : h;
    const idx = (al, ac) => (axis === 'y' ? (al * w + ac) * 4 : (ac * w + al) * 4);
    const isSafe = (al, ac) => (axis === 'y' ? safe(ac, al) : safe(al, ac));
    const L = lo * 255, H = hi * 255;
    for (let s = 0; s < bands; s++) {
      const t = Math.floor(thick[0] + r() * (thick[1] - thick[0]));
      const a0 = Math.floor(r() * (acrossN - t));
      const start = Math.floor(r() * alongN * 0.55);
      const lenCap = Math.floor(alongN * (maxLen[0] + r() * (maxLen[1] - maxLen[0])));
      for (let ac = a0; ac < a0 + t; ac++) {
        let al = start + Math.floor(r() * 24); // ragged start edge
        while (al < alongN) {
          while (al < alongN) { const i = idx(al, ac); const l = lumOf(d[i], d[i + 1], d[i + 2]); if (!isSafe(al, ac) && l >= L && l <= H) break; al++; }
          let e = al;
          while (e < alongN && e - al < lenCap) { const i = idx(e, ac); const l = lumOf(d[i], d[i + 1], d[i + 2]); if (isSafe(e, ac) || l < L || l > H) break; e++; }
          if (e - al > 4) {
            const buf = new Uint32Array(e - al);
            for (let k = al; k < e; k++) { const i = idx(k, ac); buf[k - al] = ((lumOf(d[i], d[i + 1], d[i + 2]) | 0) << 24 | d[i] << 16 | d[i + 1] << 8 | d[i + 2]) >>> 0; }
            buf.sort();
            for (let k = al; k < e; k++) { const i = idx(k, ac), v = buf[k - al]; d[i] = (v >>> 16) & 255; d[i + 1] = (v >>> 8) & 255; d[i + 2] = v & 255; }
          }
          al = e + 1;
        }
      }
    }
  });

/** macro-block corruption: rectangles copied from elsewhere, some with a channel dropped */
const blocks = ({ n = 6, w: bwR = [40, 220], h: bhR = [8, 36] } = {}) => (fx) =>
  fx.custom((f) => {
    const { w, h, data: d, rng: r } = f;
    const safe = safeZone(w, h, 0.32, 0.4);
    const o = new Uint8ClampedArray(d);
    let placed = 0;
    for (let tries = 0; tries < n * 6 && placed < n; tries++) {
      const bw = Math.floor(bwR[0] + r() * (bwR[1] - bwR[0])), bh = Math.floor(bhR[0] + r() * (bhR[1] - bhR[0]));
      if (bw >= w || bh >= h) continue;
      const bx = Math.floor(r() * (w - bw)), by = Math.floor(r() * (h - bh));
      if (safe(bx + bw / 2, by + bh / 2) || safe(bx, by) || safe(bx + bw, by) || safe(bx, by + bh) || safe(bx + bw, by + bh)) continue;
      const sx = clampInt(bx + (r() - 0.5) * 320, 0, w - bw), sy = clampInt(by + (r() - 0.5) * 90, 0, h - bh);
      const mode = Math.floor(r() * 3);
      for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
        const i = ((by + y) * w + bx + x) * 4, j = ((sy + y) * w + sx + x) * 4;
        d[i] = mode === 1 ? 0 : o[j];
        d[i + 1] = mode === 2 ? o[j + 1] * 0.25 : o[j + 1];
        d[i + 2] = o[j + 2];
      }
      placed++;
    }
  });

/** broad scan bands (period/thick in source px) - the CSS adds crisp display-size scanlines on top */
const bands = ({ period = 8, thick = 3, opacity = 0.2 } = {}) => (fx) =>
  fx.px((r, g, b, a, x, y) => {
    if (y % period >= thick) return;
    return [r * (1 - opacity) + 5 * opacity, g * (1 - opacity) + 5 * opacity, b * (1 - opacity) + 10 * opacity];
  });

const finish = ({ split = 7, nBands = 5, shift = 26, scan = 0.2, grain = 0.028, vig = 0.28 } = {}) => (fx) =>
  bands({ period: 8, thick: 3, opacity: scan })(
    fx.sliceShift({ bands: nBands, maxShift: shift, minH: 10, maxH: 42 }).rgbSplit(split, 0),
  )
    .vignette(vig, { softness: 0.7, color: '#05050a' })
    .grain(grain);

// small helper so steps read as a pipeline
const run = (fx, ...steps) => steps.reduce((f, s) => s(f), fx);

export default {
  maxSize: 1200, thumb: 520, quality: 64, format: 'webp',
  treatments: {
    default: (fx) =>
      run(fx,
        grade({ tint: 0.34 }),
        sortRuns({ axis: 'y', bands: 2, thick: [10, 40], lo: 0.16, hi: 0.7 }),
        blocks({ n: 4 }),
        (f) => finish({ split: 6, nBands: 4, shift: 24 })(f)),

    hero: (fx) =>
      run(fx,
        grade({ tint: 0.3, contrast: 1.12 }),
        sortRuns({ axis: 'y', bands: 5, thick: [14, 60], lo: 0.12, hi: 0.78, maxLen: [0.2, 0.5] }),
        blocks({ n: 6 }),
        (f) => finish({ split: 9, nBands: 6, shift: 30, scan: 0.22 })(f)),

    night: (fx) =>
      run(fx,
        grade({ tint: 0.4, saturation: 1.05, contrast: 1.1 }),
        glow({ strength: 0.55 }),
        sortRuns({ axis: 'y', bands: 2, thick: [10, 36], lo: 0.2, hi: 0.9 }),
        blocks({ n: 4 }),
        (f) => finish({ split: 7, nBands: 4, shift: 22, scan: 0.24 })(f)),

    group: (fx) =>
      run(fx,
        grade({ tint: 0.28, contrast: 1.1, saturation: 0.9 }),
        blocks({ n: 3 }),
        (f) => finish({ split: 4, nBands: 3, shift: 14, scan: 0.16, grain: 0.03 })(f)),

    scene: (fx) =>
      run(fx,
        grade({ tint: 0.42, saturation: 0.95 }),
        sortRuns({ axis: 'x', bands: 4, thick: [6, 26], lo: 0.2, hi: 0.9, maxLen: [0.25, 0.6], protect: false }),
        sortRuns({ axis: 'y', bands: 3, thick: [10, 50], lo: 0.12, hi: 0.75, protect: false }),
        blocks({ n: 7, w: [60, 280] }),
        (f) => finish({ split: 8, nBands: 6, shift: 36, scan: 0.22 })(f)),
  },
  pick: (ctx) =>
    HERO.has(ctx.id) ? 'hero'
      : NIGHT.has(ctx.id) ? 'night'
      : ctx.category === 'friends-trips' ? 'group'
      : SCENE.has(ctx.category) ? 'scene'
      : 'default',
};
