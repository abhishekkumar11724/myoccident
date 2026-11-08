/**
 * Paper-cutout photo treatment: photograph -> stack of hand-cut coloured paper sheets.
 *
 * Pipeline (deterministic; randomness only from fx.rng / fx.noise):
 *   1. grade       gentle contrast / saturation (night shots are lifted first)
 *   2. flatten     Kuwahara smoothing so colour regions are coherent before clustering
 *   3. sheets      per-photo k-means in Lab (8-10 colours) -> every pixel belongs to one "sheet of paper".
 *                  The palette comes from the photo itself, so skin stays skin and faces stay recognisable;
 *                  each centroid is then pushed to a saturated gouache colour.
 *   4. scissors    mode filter (clean contours, no pixel noise) + low-frequency noise warp of the label map
 *                  (edges wobble the way a hand-cut edge does)
 *   5. layering    sheets are stacked big-at-the-bottom / small-on-top; every sheet casts a short soft contact
 *                  shadow onto the sheets below it (light from the top-left) and its upper-left rim catches a hairline highlight
 *   6. paper       each sheet gets its own faint tone drift, then fibre texture + very fine grain
 * No outlines are drawn: cut paper has none.
 */
import { clamp, lerp } from '../../../scripts/fx/index.mjs';

// ---------------------------------------------------------------- colour helpers
const SRGB = new Float32Array(256);
for (let i = 0; i < 256; i++) { const c = i / 255; SRGB[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
const F = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
function toLab(r, g, b, out, o) {
  const R = SRGB[r], G = SRGB[g], B = SRGB[b];
  const x = F((0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047);
  const y = F(0.2126 * R + 0.7152 * G + 0.0722 * B);
  const z = F((0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883);
  out[o] = 116 * y - 16; out[o + 1] = 500 * (x - y); out[o + 2] = 200 * (y - z);
}
function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  let h = 0, s = 0;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) h = (g - b) / d + (g < b ? 6 : 0); else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
    h /= 6;
  }
  return [h, s, l];
}
function hsl2rgb(h, s, l) {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
}

// The "paper stock": every sheet colour is pulled part-way toward the nearest of these gouache sheets so all photos share one palette
const STOCK = ['#e5412a', '#ff7a2f', '#ffc928', '#1f45c8', '#1f9a62', '#43bfe0', '#ff8fa0', '#8a5cd6', '#fff3d6', '#1c1b33', '#f4b58f', '#dd8a60', '#b06a45', '#8fd6a8', '#a9d8ee']
  .map((h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; });
const STOCK_LAB = STOCK.map((c) => { const o = [0, 0, 0]; toLab(c[0], c[1], c[2], o, 0); return o; });

// ---------------------------------------------------------------- the paper-cut op
function paperCut(fx, { minArea = 70, K = 10, sat = 1.4, modeR = 2, warp = 2.4, shadow = 0.38, pull = 0.5, lift = 1.08, seedBias = 0 } = {}) {
  return fx.custom(async (f) => {
    const { w, h, data: d } = f, N = w * h, rng = f.rng, nz = f.noise;

    // --- Lab for every pixel
    const lab = new Float32Array(N * 3);
    for (let p = 0, i = 0; p < N; p++, i += 4) toLab(d[i], d[i + 1], d[i + 2], lab, p * 3);

    // --- k-means++ on a sample
    const stride = Math.max(1, Math.floor(N / 9000));
    const S = []; for (let p = (seedBias % stride); p < N; p += stride) S.push(p);
    const dist2 = (a, bL, bA, bB) => { const dl = lab[a * 3] - bL, da = lab[a * 3 + 1] - bA, db = lab[a * 3 + 2] - bB; return dl * dl * 0.8 + da * da + db * db; };
    const cen = []; // [L,a,b]
    const first = S[Math.floor(rng() * S.length)];
    cen.push([lab[first * 3], lab[first * 3 + 1], lab[first * 3 + 2]]);
    const dmin = new Float32Array(S.length).fill(1e12);
    while (cen.length < K) {
      const c = cen[cen.length - 1]; let tot = 0;
      for (let s = 0; s < S.length; s++) { const dd = dist2(S[s], c[0], c[1], c[2]); if (dd < dmin[s]) dmin[s] = dd; tot += dmin[s]; }
      let r = rng() * tot, pick = S.length - 1;
      for (let s = 0; s < S.length; s++) { r -= dmin[s]; if (r <= 0) { pick = s; break; } }
      const p = S[pick]; cen.push([lab[p * 3], lab[p * 3 + 1], lab[p * 3 + 2]]);
    }
    for (let it = 0; it < 14; it++) {
      const acc = cen.map(() => [0, 0, 0, 0]);
      for (let s = 0; s < S.length; s++) {
        const p = S[s]; let best = 0, bd = 1e12;
        for (let k = 0; k < K; k++) { const dd = dist2(p, cen[k][0], cen[k][1], cen[k][2]); if (dd < bd) { bd = dd; best = k; } }
        const a = acc[best]; a[0] += lab[p * 3]; a[1] += lab[p * 3 + 1]; a[2] += lab[p * 3 + 2]; a[3]++;
      }
      for (let k = 0; k < K; k++) if (acc[k][3]) cen[k] = [acc[k][0] / acc[k][3], acc[k][1] / acc[k][3], acc[k][2] / acc[k][3]];
    }

    // --- assign every pixel to its nearest sheet
    let lbl = new Uint8Array(N);
    for (let p = 0; p < N; p++) {
      let best = 0, bd = 1e12;
      for (let k = 0; k < K; k++) { const dd = dist2(p, cen[k][0], cen[k][1], cen[k][2]); if (dd < bd) { bd = dd; best = k; } }
      lbl[p] = best;
    }

    // --- scissors: mode filter x2, then wobble the contours
    const mode = (src, r) => {
      const out = new Uint8Array(N), cnt = new Uint16Array(K);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        cnt.fill(0);
        const y0 = Math.max(0, y - r), y1 = Math.min(h - 1, y + r), x0 = Math.max(0, x - r), x1 = Math.min(w - 1, x + r);
        for (let yy = y0; yy <= y1; yy++) { const row = yy * w; for (let xx = x0; xx <= x1; xx++) cnt[src[row + xx]]++; }
        let best = src[y * w + x], bc = cnt[best];
        for (let k = 0; k < K; k++) if (cnt[k] > bc) { bc = cnt[k]; best = k; }
        out[y * w + x] = best;
      }
      return out;
    };
    const sc = w / 1400;
    lbl = mode(lbl, Math.max(2, Math.round(modeR * sc)));
    lbl = mode(lbl, Math.max(2, Math.round(modeR * sc)));
    // despeckle: islands smaller than minArea are re-glued to their most common neighbour
    {
      const seen = new Uint8Array(N), queue = new Int32Array(N), nb = new Uint32Array(K), lim = minArea * sc * sc;
      for (let s0 = 0; s0 < N; s0++) {
        if (seen[s0]) continue;
        const L0 = lbl[s0]; let head = 0, tail = 0; queue[tail++] = s0; seen[s0] = 1; nb.fill(0);
        while (head < tail) {
          const p = queue[head++], x = p % w, y = (p / w) | 0;
          const around = [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < h - 1 ? p + w : -1];
          for (let a = 0; a < 4; a++) {
            const q = around[a]; if (q < 0) continue;
            if (lbl[q] === L0) { if (!seen[q]) { seen[q] = 1; queue[tail++] = q; } } else nb[lbl[q]]++;
          }
        }
        if (tail < lim) {
          let best = -1, bc = 0; for (let k = 0; k < K; k++) if (nb[k] > bc) { bc = nb[k]; best = k; }
          if (best >= 0) for (let i = 0; i < tail; i++) lbl[queue[i]] = best;
        }
      }
    }
    {
      const out = new Uint8Array(N), A = warp * sc * 2;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const dx = (nz(x * 0.035 / sc, y * 0.035 / sc) - 0.5) * A, dy = (nz(x * 0.035 / sc + 91.7, y * 0.035 / sc + 13.3) - 0.5) * A;
        const sx = clamp(Math.round(x + dx), 0, w - 1), sy = clamp(Math.round(y + dy), 0, h - 1);
        out[y * w + x] = lbl[sy * w + sx];
      }
      lbl = out;
    }

    // --- sheet colours: mean RGB of members, pushed to saturated gouache
    const sum = Array.from({ length: K }, () => [0, 0, 0, 0]);
    for (let p = 0, i = 0; p < N; p++, i += 4) { const s = sum[lbl[p]]; s[0] += d[i]; s[1] += d[i + 1]; s[2] += d[i + 2]; s[3]++; }
    const colour = sum.map((s, k) => {
      if (!s[3]) return [128, 128, 128];
      const [hh, ss, ll] = rgb2hsl(s[0] / s[3], s[1] / s[3], s[2] / s[3]);
      let S2 = clamp(ss * sat + (ss > 0.12 ? 0.06 : 0), 0, 0.96);
      let L2 = ll;
      L2 = L2 < 0.5 ? lerp(L2, L2 * 0.95, 0.5) : lerp(L2, 0.5 + (L2 - 0.5) * 1.1, 0.7);
      L2 = L2 * lift;
      L2 = clamp(L2, 0.1, 0.93);
      const rgb = hsl2rgb(hh, S2, L2);
      // pull toward the nearest sheet of the shared paper stock (keeps skin warm, makes the set cohesive)
      const lb = [0, 0, 0]; toLab(clamp(rgb[0]) | 0, clamp(rgb[1]) | 0, clamp(rgb[2]) | 0, lb, 0);
      let bi = 0, bd = 1e12;
      for (let q = 0; q < STOCK.length; q++) { const dl = lb[0] - STOCK_LAB[q][0], da = lb[1] - STOCK_LAB[q][1], db = lb[2] - STOCK_LAB[q][2]; const dd = dl * dl * 0.6 + da * da + db * db; if (dd < bd) { bd = dd; bi = q; } }
      const dist = Math.sqrt(bd), amt = Math.max(0, 1 - dist / 40) * pull;
      const st = STOCK[bi];
      rgb[0] = lerp(rgb[0], st[0], amt); rgb[1] = lerp(rgb[1], st[1], amt); rgb[2] = lerp(rgb[2], st[2], amt);
      // very light sheets read as paper white: warm them
      if (L2 > 0.82) { rgb[0] = lerp(rgb[0], 255, 0.5); rgb[1] = lerp(rgb[1], 245, 0.5); rgb[2] = lerp(rgb[2], 222, 0.5); }
      return rgb;
    });

    // --- stacking order: big sheets at the bottom, small on top (with a little jitter so it is not rigid)
    const order = sum.map((s, k) => [k, s[3] * (0.85 + rng() * 0.3)]).sort((a, b) => b[1] - a[1]).map((x) => x[0]);
    const rank = new Uint8Array(K); order.forEach((k, r) => { rank[k] = r; });

    // --- paint with shadows + rim light
    const STEPS = 5, step = Math.max(1, Math.round(sc * 2.4));
    const drift = Array.from({ length: K }, () => 1 + (rng() - 0.5) * 0.07); // per-sheet tone drift
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const p = y * w + x, i = p * 4, k = lbl[p], rk = rank[k];
      let sh = 0;
      for (let t = 1; t <= STEPS; t++) {
        const qx = x - t * step, qy = y - t * step;
        if (qx < 0 || qy < 0) break;
        if (rank[lbl[qy * w + qx]] > rk) { sh = 1 - (t - 1) / (STEPS + 0.6); break; }
      }
      // rim light: this sheet sits on top, the sheet up-left of it is lower
      let rim = 0;
      for (let t = 1; t <= 2; t++) {
        const qx = x - t * step, qy = y - t * step;
        if (qx < 0 || qy < 0) break;
        if (rank[lbl[qy * w + qx]] < rk) { rim = t === 1 ? 1 : 0.5; break; }
      }
      const c = colour[k], dr = drift[k];
      let r = c[0] * dr, g = c[1] * dr, b = c[2] * dr;
      if (sh > 0) { const m = 1 - shadow * sh; r = r * m * 0.97; g = g * m * 0.93; b = b * m * 0.9; }
      if (rim) { const m = 0.16 * rim; r = lerp(r, 255, m); g = lerp(g, 250, m); b = lerp(b, 235, m); }
      d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255;
    }
  });
}

// ---------------------------------------------------------------- treatments
const finish = (fx) => fx.texture('paper', { opacity: 0.16, scale: 1.1, mode: 'multiply' }).grain(0.005);

export default {
  maxSize: 1400, thumb: 520, quality: 70, format: 'webp',
  treatments: {
    default: (fx, ctx) => {
      const tags = ctx.tags ?? [];
      const face = ctx.category === 'portraits' || tags.includes('solo');
      const group = tags.includes('group');
      const flat = ['scenery', 'pets', 'food', 'books'].includes(ctx.category) && !face;
      fx.adjust({ contrast: 1.06, saturation: 1.15, gamma: 1.28 }).kuwahara(flat ? 5 : face ? 2 : 3);
      if (face) return finish(paperCut(fx, { K: 12, modeR: 2, minArea: 40 }));
      if (group) return finish(paperCut(fx, { K: 11, modeR: 2, minArea: 55 }));
      return finish(paperCut(fx, { K: flat ? 9 : 10, modeR: flat ? 4 : 3, minArea: flat ? 170 : 90 }));
    },
    night: (fx, ctx) => {
      fx.adjust({ gamma: 1.7, contrast: 1.1, saturation: 1.3, brightness: 0.03 }).kuwahara(3);
      return finish(paperCut(fx, { K: 11, sat: 1.5, modeR: 2, warp: 2.2, minArea: 60, lift: 1.12 }));
    },
  },
  pick: (ctx) => (ctx.tags?.includes('night') ? 'night' : 'default'),
};
