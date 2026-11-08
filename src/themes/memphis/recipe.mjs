/**
 * Memphis photo treatment: photograph -> pop screen-print, as if lifted from a 1981 Memphis Milano brochure.
 *
 * Pipeline (deterministic):
 *   1. smooth        light Kuwahara so the colour bands follow shapes, not sensor noise
 *   2. tone          auto-levels (2%..98%) + local-contrast lift (blur-based) so faces in shadow and blown backgrounds both land in the
 *                    middle bands; this is what keeps faces recognisable after posterising
 *   3. posterise     luminance -> 4 flat bands, each a Memphis colour (ink, colour A, colour B, cream). Band boundaries are
 *                    dithered with a 45-degree Ben-Day dot screen, so every soft gradient turns into rows of dots
 *   4. outline       only the strongest edges are inked, thick (a comic key line), faces keep their features
 *   5. grain         a hint of print grain so flat colour still feels like paper
 *
 * Palettes are clashing-colour pairs on a black key (pink/lemon, cobalt/turquoise, ...) picked per category and file so a page of 60 photos
 * reads as a sheet of mixed stickers. Night photos use a violet/pink/lemon palette.
 */
import { hex } from '../../../scripts/fx/index.mjs';

const INK = '#14110f';
const PALETTES = {
  // 4 flat bands: [ink shadow, colour A, colour B, cream highlight]
  bubblegum: [INK, '#ff3d9a', '#ffe14a', '#fffaf0'],
  lagoon: [INK, '#2b4bff', '#19d3c5', '#fff6c2'],
  tangerine: [INK, '#ff4b2b', '#ffc83d', '#fff7e2'],
  grape: [INK, '#7a55ff', '#ffa8dc', '#fff8ec'],
  mint: [INK, '#00a38f', '#9af0c8', '#fffbd6'],
  night: ['#0d0620', '#5527d6', '#ff4fa3', '#ffe14a'],
  tealpink: [INK, '#00b8b0', '#ff8fc2', '#fffaf0'],
};

const CHOICES = {
  portraits: ['bubblegum', 'tangerine', 'grape', 'lagoon', 'bubblegum'],
  adventure: ['lagoon', 'bubblegum', 'mint', 'tangerine', 'grape'],
  'friends-trips': ['grape', 'bubblegum', 'tangerine', 'lagoon', 'tealpink'],
  bikes: ['tangerine', 'lagoon', 'tealpink', 'grape'],
  scenery: ['lagoon', 'tangerine', 'mint', 'bubblegum'],
  books: ['bubblegum', 'lagoon', 'mint'],
  pets: ['grape', 'mint', 'bubblegum', 'tangerine'],
  food: ['tangerine', 'tealpink', 'mint'],
  'work-and-lifestyle': ['lagoon', 'bubblegum'],
};

const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a || 1e-9), 0, 1); return t * t * (3 - 2 * t); };

function memphis(paletteName, { lift = 0.5, dots = 0.6, outline = 0.55 } = {}) {
  const pal = PALETTES[paletteName].map(hex);
  const N = pal.length;
  return async (fx) => {
    fx.kuwahara(3);
    await fx.run();
    const { w, h } = fx;
    const n = w * h;

    // luminance
    let L = new Float32Array(n);
    for (let i = 0, p = 0; p < n; i += 4, p++) L[p] = (0.2126 * fx.data[i] + 0.7152 * fx.data[i + 1] + 0.0722 * fx.data[i + 2]) / 255;

    // local mean (large blur) for the local-contrast lift
    const big = fx.clone(); big.blur(Math.max(20, w / 28)); await big.run();
    const edgeSrc = fx.clone(); edgeSrc.blur(Math.max(1.6, w / 520)); await edgeSrc.run();
    const M = new Float32Array(n), E = new Float32Array(n);
    for (let i = 0, p = 0; p < n; i += 4, p++) {
      M[p] = (0.2126 * big.data[i] + 0.7152 * big.data[i + 1] + 0.0722 * big.data[i + 2]) / 255;
      E[p] = (0.2126 * edgeSrc.data[i] + 0.7152 * edgeSrc.data[i + 1] + 0.0722 * edgeSrc.data[i + 2]) / 255;
    }

    // tone: local lift, then percentile stretch
    const T = new Float32Array(n);
    for (let p = 0; p < n; p++) T[p] = L[p] + (0.5 - M[p]) * lift;
    const hist = new Uint32Array(1024);
    let lo = 1e9, hi = -1e9;
    for (let p = 0; p < n; p++) { if (T[p] < lo) lo = T[p]; if (T[p] > hi) hi = T[p]; }
    const span = hi - lo || 1;
    for (let p = 0; p < n; p++) hist[Math.min(1023, Math.floor(((T[p] - lo) / span) * 1024))]++;
    const pct = (q) => { let acc = 0; for (let i = 0; i < 1024; i++) { acc += hist[i]; if (acc >= q * n) return lo + (i / 1024) * span; } return hi; };
    const p2 = pct(0.025), p98 = pct(0.975);
    const range = p98 - p2 || 1;

    // Ben-Day screen: cell relative to image width so thumbs keep the dots
    const cell = Math.max(7, Math.round(w / 90));
    const ca = Math.cos(Math.PI / 4), sa = Math.sin(Math.PI / 4), k = (2 * Math.PI) / cell;

    // key-line from sobel on the blurred luminance (only strongest edges)
    const edge = new Float32Array(n);
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const gx = -E[i - w - 1] - 2 * E[i - 1] - E[i + w - 1] + E[i - w + 1] + 2 * E[i + 1] + E[i + w + 1];
      const gy = -E[i - w - 1] - 2 * E[i - w] - E[i - w + 1] + E[i + w - 1] + 2 * E[i + w] + E[i + w + 1];
      edge[i] = sstep(0.46, 0.62, Math.sqrt(gx * gx + gy * gy));
    }
    // thicken the key-line one pixel
    const thick = new Float32Array(n);
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = y * w + x; thick[i] = Math.max(edge[i], edge[i - 1], edge[i + 1], edge[i - w], edge[i + w]); }

    const ink = hex(INK);
    const d = fx.data;
    for (let y = 0, p = 0; y < h; y++) {
      for (let x = 0; x < w; x++, p++) {
        const i = p * 4;
        const t = clamp((T[p] - p2) / range, 0, 1) * (N - 1);
        const u = x * ca + y * sa, v = -x * sa + y * ca;
        const s = (Math.cos(k * u) + Math.cos(k * v)) * 0.25; // -0.5 .. 0.5
        const val = clamp(t + s * dots, 0, N - 1);
        const b0 = Math.min(N - 2, Math.floor(val));
        const m = sstep(0.5 - 0.07, 0.5 + 0.07, val - b0);
        let r = pal[b0][0] + (pal[b0 + 1][0] - pal[b0][0]) * m;
        let g = pal[b0][1] + (pal[b0 + 1][1] - pal[b0][1]) * m;
        let bl = pal[b0][2] + (pal[b0 + 1][2] - pal[b0][2]) * m;
        const e = thick[p] * outline;
        if (e > 0) { r += (ink[0] - r) * e; g += (ink[1] - g) * e; bl += (ink[2] - bl) * e; }
        d[i] = r; d[i + 1] = g; d[i + 2] = bl; d[i + 3] = 255;
      }
    }
  };
}

const treatments = {};
for (const name of Object.keys(PALETTES)) {
  treatments[name] = (fx) => { fx.custom(memphis(name)); return fx; };
}
treatments.default = treatments.bubblegum;
// landscapes / scenery have fewer faces: let the dots be a bit stronger and the key-line lighter
for (const name of Object.keys(PALETTES)) {
  treatments[`${name}-scene`] = (fx) => { fx.custom(memphis(name, { lift: 0.4, dots: 0.7, outline: 0.4 })); return fx; };
}

export default {
  maxSize: 1000, thumb: 480, quality: 60, format: 'webp',
  treatments,
  pick: (ctx) => {
    const tags = ctx.tags || [];
    const list = CHOICES[ctx.category] || ['bubblegum', 'lagoon', 'tangerine'];
    let name = list[hash(ctx.id) % list.length];
    if (tags.includes('night')) name = hash(ctx.id) % 3 === 0 ? 'grape' : 'night';
    const scene = ctx.category === 'scenery' || (tags.includes('landscape') && !tags.includes('solo') && !tags.includes('group'));
    return scene ? `${name}-scene` : name;
  },
};
