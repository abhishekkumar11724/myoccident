/**
 * Grunge photo treatment: "photocopied flyer".
 *
 * Pipeline = tone (auto-levels + local contrast + S-curve, the way a copier crushes a photo)
 *   -> toner (a noise-perturbed threshold for people = stochastic stipple; a dot halftone for scenery/objects)
 *   -> dirt (toner speckle, white dropout, vertical drum scratches, a black copier-lid edge on some)
 * Ink is dirty black on newsprint. The three hero portraits are a TWO-COLOUR print (black + a slightly misregistered
 * blood-red layer) so the site's single accent colour shows up in the photography too.
 * Variants: hero (two-colour), default (portraits / hills / bikes), group (softer, many faces), night (shadows lifted first),
 * scene (halftone dots: scenery, books, food, desk).  Everything uses fx.rng so rebuilds are identical.
 * In the browser the untouched original is revealed through a colour spot on hover (see client.ts).
 */

const INK = [23, 20, 15];        // toner  #17140f
const PAPER = [221, 213, 191];   // newsprint #ddd5bf
const RED = [179, 50, 30];       // blood red #b3321e

const HERO = new Set(['portraits/01-selfie-maroon', 'portraits/02-smile-jacket', 'portraits/03-red-kurta-seated']);
const NIGHT = new Set([
  'portraits/05-lakeside-night', 'bikes/03-bike-night-rider', 'bikes/05-night-stand', 'bikes/06-helmet-night',
  'friends-trips/06-fairground-trio', 'friends-trips/07-red-carpet-trio', 'friends-trips/09-night-group',
]);
const SCENE = new Set(['scenery', 'books', 'food', 'work-and-lifestyle']);

const clamp = (v, a = 0, b = 255) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a || 1e-9))); return t * t * (3 - 2 * t); };
const lum = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/** Step 1: greyscale with percentile auto-levels, local contrast (edges pop like on a copier) and an S-curve. */
const tone = ({ clip = 0.012, local = 0.8, sigma = 0.035, gamma = 1, curve = 6.5, lift = 0, target = 0 } = {}) => (fx) =>
  fx.custom(async (f) => {
    const { w, h, data: d } = f, n = w * h;
    const blur = f.clone();
    blur.blur(Math.max(2, w * sigma));
    await blur.run();
    const L = new Float32Array(n);
    for (let i = 0, p = 0; p < n; i += 4, p++) {
      const l = lum(d[i], d[i + 1], d[i + 2]), lb = lum(blur.data[i], blur.data[i + 1], blur.data[i + 2]);
      L[p] = l + local * (l - lb);
    }
    const hist = new Uint32Array(256);
    for (let p = 0; p < n; p++) hist[clamp(Math.round(L[p] * 255) | 0, 0, 255)]++;
    let acc = 0, lo = 0, hi = 255;
    for (let k = 0; k < 256; k++) { acc += hist[k]; if (acc >= n * clip) { lo = k; break; } }
    acc = 0;
    for (let k = 255; k >= 0; k--) { acc += hist[k]; if (acc >= n * clip) { hi = k; break; } }
    // adaptive gamma: pull the mean of the central region (where the subject usually is) towards `target`, so faces stay mid-toned
    let gm = gamma;
    if (target > 0) {
      let sum = 0, cnt = 0;
      for (let y = Math.floor(h * 0.2); y < h * 0.75; y += 3) for (let x = Math.floor(w * 0.25); x < w * 0.75; x += 3) { sum += clamp((L[y * w + x] * 255 - lo) / (hi - lo || 1), 0, 1); cnt++; }
      const m = clamp(sum / cnt, 0.04, 0.96);
      gm = clamp(Math.log(target) / Math.log(m), 0.55, 1.7) * gamma;
    }
    const s0 = 1 / (1 + Math.exp(curve * 0.5)), s1 = 1 / (1 + Math.exp(-curve * 0.5));
    for (let i = 0, p = 0; p < n; i += 4, p++) {
      let v = clamp((L[p] * 255 - lo) / (hi - lo || 1), 0, 1);
      v = Math.pow(v, gm);
      v = clamp(v + lift * (1 - v), 0, 1);
      v = (1 / (1 + Math.exp(-curve * (v - 0.5))) - s0) / (s1 - s0);
      const g = v * 255;
      d[i] = g; d[i + 1] = g; d[i + 2] = g;
    }
  });

/** shared white-noise block field (one value per `grain` px block) */
const noiseField = (f, grain) => {
  const tbl = new Float32Array(1 << 16);
  for (let i = 0; i < tbl.length; i++) tbl[i] = f.rng();
  return (x, y) => tbl[(Math.imul((x / grain) | 0, 73856093) ^ Math.imul((y / grain) | 0, 19349663)) & 0xffff];
};

/** Step 2a: stochastic threshold -> ink on paper (toner stipple). */
const stipple = ({ noise = 0.46, grain = 2, soft = 0.05, blotch = 0.1, bias = 0 } = {}) => (fx) =>
  fx.custom((f) => {
    const { w, h, data: d } = f, nz = f.noise, nf = noiseField(f, grain);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const val = d[i] / 255 + bias + (nf(x, y) - 0.5) * noise + (nz(x * 0.011, y * 0.011) - 0.5) * blotch;
      const o = sstep(0.5 - soft, 0.5 + soft, val); // 1 = paper
      const dens = 0.85 + 0.15 * nz(x * 0.03 + 40, y * 0.03); // toner density varies a little
      d[i] = lerp(INK[0] / dens, PAPER[0], o);
      d[i + 1] = lerp(INK[1] / dens, PAPER[1], o);
      d[i + 2] = lerp(INK[2] / dens, PAPER[2], o);
    }
  });

/** Step 2b: two-colour print - black layer + a misregistered red layer for the mid-tones. */
const twoColour = ({ noise = 0.4, grain = 2, soft = 0.05, off = [7, 4], blackAt = 0.36, redAt = 0.66 } = {}) => (fx) =>
  fx.custom((f) => {
    const { w, h, data: d } = f, nz = f.noise, nf = noiseField(f, grain), nf2 = noiseField(f, grain + 1);
    const L = new Float32Array(w * h);
    for (let p = 0; p < w * h; p++) L[p] = d[p * 4] / 255;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4, blot = (nz(x * 0.011, y * 0.011) - 0.5) * 0.1;
      const kb = sstep(0.5 - soft, 0.5 + soft, L[y * w + x] - blackAt + 0.5 + (nf(x, y) - 0.5) * noise + blot); // 1 = no black
      const rx = clamp(x - off[0], 0, w - 1), ry = clamp(y - off[1], 0, h - 1);
      const kr = sstep(0.5 - soft, 0.5 + soft, L[ry * w + rx] - redAt + 0.5 + (nf2(x, y) - 0.5) * noise + blot); // 1 = no red
      let r = PAPER[0], g = PAPER[1], b = PAPER[2];
      r = lerp(r, (r * RED[0]) / 200, 1 - kr); g = lerp(g, (g * RED[1]) / 200, 1 - kr); b = lerp(b, (b * RED[2]) / 200, 1 - kr);
      d[i] = lerp(INK[0], r, kb); d[i + 1] = lerp(INK[1], g, kb); d[i + 2] = lerp(INK[2], b, kb);
    }
  });

/** Step 3: dirt - toner speckle, dropout, drum scratches, black copier edge. */
const dirt = ({ specks = 1.0, scratches = 3, edge = 0.5, shade = 0.12 } = {}) => (fx) =>
  fx.custom((f) => {
    const { w, h, data: d, rng: r } = f;
    const put = (cx, cy, rad, col, a) => {
      const x0 = Math.floor(cx - rad), x1 = Math.ceil(cx + rad), y0 = Math.floor(cy - rad), y1 = Math.ceil(cy + rad);
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        if (x < 0 || y < 0 || x >= w || y >= h) continue;
        const k = clamp(rad - Math.hypot(x - cx, y - cy) + 0.5, 0, 1) * a;
        if (k <= 0) continue;
        const i = (y * w + x) * 4;
        d[i] = lerp(d[i], col[0], k); d[i + 1] = lerp(d[i + 1], col[1], k); d[i + 2] = lerp(d[i + 2], col[2], k);
      }
    };
    const N = Math.round(w * h * 0.00011 * specks);
    for (let k = 0; k < N; k++) put(r() * w, r() * h, 0.6 + r() * r() * 2.2, INK, 0.75);          // toner flecks
    for (let k = 0; k < N * 0.8; k++) put(r() * w, r() * h, 0.6 + r() * r() * 1.8, PAPER, 0.9);   // dropout
    for (let k = 0; k < scratches; k++) {                                                          // drum scratches
      const x0 = r() * w, y0 = r() * h * 0.6, len = (0.25 + r() * 0.7) * h, wob = r() * 0.004, light = r() < 0.55;
      for (let y = y0; y < Math.min(h - 1, y0 + len); y++) {
        const x = Math.round(x0 + Math.sin(y * wob + k) * 3);
        if (x < 0 || x >= w) continue;
        const i = (Math.floor(y) * w + x) * 4, col = light ? PAPER : INK, a = 0.5 + 0.3 * Math.sin(y * 0.05);
        d[i] = lerp(d[i], col[0], a); d[i + 1] = lerp(d[i + 1], col[1], a); d[i + 2] = lerp(d[i + 2], col[2], a);
      }
    }
    // copier-lid shadow + black edge on one side (chosen by seed)
    const side = Math.floor(r() * 4), thick = (3 + Math.floor(r() * 5)) * edge * 2, reach = 120 * shade;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const dist = side === 0 ? x : side === 1 ? y : side === 2 ? w - 1 - x : h - 1 - y;
      if (dist > Math.max(reach, thick + 8)) continue;
      const along = side % 2 === 0 ? y : x, i = (y * w + x) * 4;
      if (dist < reach) { const k = (1 - dist / reach) * shade * 1.8; d[i] *= 1 - k; d[i + 1] *= 1 - k; d[i + 2] *= 1 - k; }
      const wobble = thick + 4 * Math.sin(along * 0.021 + side) + 3 * Math.sin(along * 0.07);
      if (edge > 0 && dist < wobble) { const a = clamp(wobble - dist, 0, 1); d[i] = lerp(d[i], INK[0], a); d[i + 1] = lerp(d[i + 1], INK[1], a); d[i + 2] = lerp(d[i + 2], INK[2], a); }
    }
  });

const run = (fx, ...steps) => steps.reduce((f, s) => s(f), fx);

export default {
  maxSize: 900, thumb: 440, quality: 46, format: 'webp',
  treatments: {
    // the three hero portraits: black + red two-colour print
    hero: (fx) =>
      run(fx, tone({ local: 0.9, curve: 4.4, target: 0.5 }), twoColour({ grain: 2, noise: 0.42, blackAt: 0.3, redAt: 0.56 }), dirt({ specks: 0.7, scratches: 3, edge: 0.45 })),
    default: (fx) =>
      run(fx, tone({ local: 1.0, curve: 4.6, target: 0.5 }), stipple({ noise: 0.46, grain: 2 }), dirt({ specks: 0.9, scratches: 3, edge: 0.5 })),
    group: (fx) =>
      run(fx, tone({ local: 0.95, sigma: 0.025, curve: 4.4, target: 0.5 }), stipple({ noise: 0.4, grain: 2, blotch: 0.08 }), dirt({ specks: 0.7, scratches: 2, edge: 0.4 })),
    night: (fx) =>
      run(fx, tone({ local: 0.9, curve: 4.4, target: 0.46, lift: 0.06 }), stipple({ noise: 0.44, grain: 2 }), dirt({ specks: 0.8, scratches: 3, edge: 0.5 })),
    // scenery / books / food / desk: newsprint dot screen
    scene: (fx) =>
      run(fx, tone({ local: 0.7, curve: 4.2, target: 0.5 }),
        (f) => f.halftone({ cell: 8, angle: 45, ink: INK, paper: PAPER, gamma: 0.95, boost: 1.12 }),
        dirt({ specks: 1.1, scratches: 4, edge: 0.55 })),
  },
  pick: (ctx) =>
    HERO.has(ctx.id) ? 'hero'
      : NIGHT.has(ctx.id) || ctx.tags?.includes('night') ? 'night'
      : ctx.category === 'friends-trips' ? 'group'
      : SCENE.has(ctx.category) ? 'scene'
      : 'default',
};
