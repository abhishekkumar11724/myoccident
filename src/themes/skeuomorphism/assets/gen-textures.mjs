/**
 * One-off generator for the Skeuomorphism theme's material tiles (original work, no third-party imagery).
 *   node src/themes/skeuomorphism/assets/gen-textures.mjs
 * Writes seamless WebP tiles next to this file: wood, leather (grey bump), felt (grey), cork, brushed (grey), paper, linen (grey).
 * Everything is lit from the TOP-LEFT so it agrees with the CSS shadow system. Grey tiles are neutral (~50%) and are
 * tinted in CSS with background-blend-mode, so one leather map makes brown, green and oxblood leather.
 * Not referenced by the page, so Vite never bundles this file.
 */
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.dirname(fileURLToPath(import.meta.url));

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);

// ---- periodic value noise (u, v in [0,1) wrap seamlessly when cx, cy are integers)
const lattices = new Map();
function lattice(cx, cy, seed) {
  const k = `${cx},${cy},${seed}`;
  let L = lattices.get(k);
  if (!L) { const r = rng(seed * 7919 + cx * 31 + cy * 17); const a = new Float32Array(cx * cy); for (let i = 0; i < a.length; i++) a[i] = r(); L = { cx, cy, a }; lattices.set(k, L); }
  return L;
}
function vnoise(u, v, cx, cy, seed) {
  const L = lattice(cx, cy, seed);
  const x = u * cx, y = v * cy;
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = fade(x - xi), yf = fade(y - yi);
  const x0 = ((xi % cx) + cx) % cx, x1 = (x0 + 1) % cx, y0 = ((yi % cy) + cy) % cy, y1 = (y0 + 1) % cy;
  const a = L.a;
  return lerp(lerp(a[y0 * cx + x0], a[y0 * cx + x1], xf), lerp(a[y1 * cx + x0], a[y1 * cx + x1], xf), yf);
}
function fbm(u, v, cx, cy, oct, seed, gain = 0.5) {
  let s = 0, amp = 1, tot = 0;
  for (let o = 0; o < oct; o++) { s += amp * vnoise(u, v, cx << o, cy << o, seed + o); tot += amp; amp *= gain; }
  return s / tot;
}

// ---- periodic Worley (F1, F2) on an n x n jittered grid
function worley(n, seed, jitter = 0.9) {
  const r = rng(seed);
  const px = new Float32Array(n * n), py = new Float32Array(n * n), id = new Float32Array(n * n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { px[j * n + i] = i + 0.5 + (r() - 0.5) * jitter; py[j * n + i] = j + 0.5 + (r() - 0.5) * jitter; id[j * n + i] = r(); }
  return (u, v) => {
    const x = u * n, y = v * n;
    const xi = Math.floor(x), yi = Math.floor(y);
    let f1 = 9, f2 = 9, cell = 0;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      const ci = xi + di, cj = yi + dj;
      const wi = ((ci % n) + n) % n, wj = ((cj % n) + n) % n;
      const k = wj * n + wi;
      const ox = px[k] + (ci - wi), oy = py[k] + (cj - wj);
      const d = Math.hypot(x - ox, y - oy);
      if (d < f1) { f2 = f1; f1 = d; cell = id[k]; } else if (d < f2) f2 = d;
    }
    return { f1, f2, cell };
  };
}

// light from top-left; shade ~1 on flat areas
const LX = -0.55, LY = -0.62, LZ = 0.56;
function litFromHeight(h, W, H, k) {
  const out = new Float32Array(W * H);
  const norm = LZ; // flat surface dot = LZ
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const hl = h[y * W + ((x - 1 + W) % W)], hr = h[y * W + ((x + 1) % W)], hu = h[((y - 1 + H) % H) * W + x], hd = h[((y + 1) % H) * W + x];
    let nx = -(hr - hl) * k, ny = -(hd - hu) * k, nz = 1;
    const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
    out[y * W + x] = (nx * LX + ny * LY + nz * LZ) / norm;
  }
  return out;
}

async function save(name, raw, W, H, channels, quality, extra = {}) {
  const file = path.join(OUT, name);
  const info = await sharp(raw, { raw: { width: W, height: H, channels } }).webp({ quality, effort: 6, ...extra }).toFile(file);
  console.log(name.padEnd(18), `${W}x${H}`, (info.size / 1024).toFixed(1) + ' KB');
}
const gray = (f, W, H) => { const b = Buffer.alloc(W * H); for (let i = 0; i < b.length; i++) b[i] = Math.round(clamp(f[i]) * 255); return b; };

// ---------------------------------------------------------------- WOOD (walnut boards, grain runs down the page)
async function wood() {
  const W = 1024, H = 1024, boards = 4, bw = W / boards;
  const buf = Buffer.alloc(W * H * 3);
  const ramp = [[0, [40, 23, 12]], [0.3, [74, 44, 24]], [0.55, [108, 68, 38]], [0.8, [142, 92, 52]], [1, [176, 122, 72]]];
  const col = (t) => { for (let i = 1; i < ramp.length; i++) if (t <= ramp[i][0]) { const [t0, c0] = ramp[i - 1], [t1, c1] = ramp[i]; const f = (t - t0) / (t1 - t0); return [lerp(c0[0], c1[0], f), lerp(c0[1], c1[1], f), lerp(c0[2], c1[2], f)]; } return ramp[4][1]; };
  for (let b = 0; b < boards; b++) {
    const r = rng(500 + b * 31);
    const seed = 40 + b * 13, tone = 0.88 + r() * 0.24, rings = 9 + r() * 7, warpAmt = 0.55 + r() * 0.7, hueShift = (r() - 0.5) * 10;
    for (let y = 0; y < H; y++) for (let xl = 0; xl < bw; xl++) {
      const u = xl / bw, v = y / H;
      const warp = fbm(u, v, 2, 1, 3, seed);
      const t = u * rings + warp * warpAmt * 2.2 + 0.5 * fbm(u, v, 6, 2, 2, seed + 5);
      const band = Math.pow(0.5 + 0.5 * Math.sin(2 * Math.PI * t), 2.2);
      const streak = fbm(u, v, 90, 2, 3, seed + 1, 0.62);
      const fine = fbm(u, v, 160, 6, 2, seed + 2);
      let h = 0.3 * band + 0.5 * streak + 0.08 * warp + 0.12 * fine;
      h = clamp((h - 0.22) * 1.7);
      let [R, G, B] = col(h);
      const pore = fbm(u, v, 150, 36, 2, seed + 3);
      if (pore > 0.7) { const k = 1 - smooth(0.7, 0.9, pore) * 0.35; R *= k; G *= k; B *= k; }
      const edge = 1 - 0.12 * Math.pow(Math.abs(u - 0.5) * 2, 3); // board edges a touch darker
      R = R * tone * edge + hueShift; G = G * tone * edge + hueShift * 0.4; B = B * tone * edge;
      const x = b * bw + xl;
      // seams: 2px groove then 1px catch-light
      if (xl < 2) { R *= 0.3; G *= 0.3; B *= 0.3; } else if (xl === 2) { R *= 1.18; G *= 1.18; B *= 1.18; }
      const o = (y * W + x) * 3;
      buf[o] = clamp(R / 255) * 255; buf[o + 1] = clamp(G / 255) * 255; buf[o + 2] = clamp(B / 255) * 255;
    }
  }
  await save('wood.webp', buf, W, H, 3, 58);
}

// ---------------------------------------------------------------- LEATHER (neutral grey pebble-grain, lit top-left)
async function leather() {
  const W = 384, H = 384, cells = 52;
  const wl = worley(cells, 77, 0.8), wl2 = worley(cells * 2 + 1, 91, 0.9);
  const h = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const u = x / W, v = y / H;
    const a = wl(u, v), b = wl2(u, v);
    const dome = smooth(0, 0.62, a.f2 - a.f1);
    const sub = smooth(0, 0.35, b.f2 - b.f1);
    h[y * W + x] = 0.7 * dome + 0.06 * sub + 0.1 * fbm(u, v, 128, 128, 2, 5) + 0.14 * fbm(u, v, 6, 6, 3, 9);
  }
  const lit = litFromHeight(h, W, H, 5);
  const out = new Float32Array(W * H);
  for (let i = 0; i < out.length; i++) out[i] = 0.5 + (lit[i] - 1) * 0.3 + (h[i] - 0.5) * 0.3;
  await save('leather.webp', gray(out, W, H), W, H, 1, 70);
}

// ---------------------------------------------------------------- FELT / baize (neutral grey fibres)
async function felt() {
  const W = 256, H = 256, f = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) f[y * W + x] = 0.5 + (fbm(x / W, y / H, 5, 5, 3, 21) - 0.5) * 0.16 + (fbm(x / W, y / H, 128, 128, 1, 22) - 0.5) * 0.12;
  const r = rng(3);
  for (let n = 0; n < 9000; n++) {
    const x0 = r() * W, y0 = r() * H, ang = r() * Math.PI, len = 3 + r() * 6, d = (r() - 0.5) * 0.2;
    for (let s = 0; s < len; s++) {
      const x = Math.floor(x0 + Math.cos(ang) * s + W) % W, y = Math.floor(y0 + Math.sin(ang) * s + H) % H;
      f[y * W + x] += d * (1 - Math.abs(s / len - 0.5));
    }
  }
  const sm = await sharp(gray(f, W, H), { raw: { width: W, height: H, channels: 1 } }).blur(0.45).raw().toBuffer();
  await save('felt.webp', sm, W, H, 1, 68);
}

// ---------------------------------------------------------------- CORK (colour, granules + pits)
async function cork() {
  const W = 400, H = 400, n = 72;
  const wl = worley(n, 12, 0.95);
  const h = new Float32Array(W * H), tone = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const u = x / W, v = y / H, a = wl(u, v);
    h[y * W + x] = smooth(0, 0.8, a.f2 - a.f1) * 0.3 + 0.7 * fbm(u, v, 120, 120, 3, 4);
    tone[y * W + x] = a.cell * 0.65 + 0.35 * fbm(u, v, 5, 5, 3, 8);
  }
  const lit = litFromHeight(h, W, H, 2.4);
  const buf = new Float32Array(W * H * 3);
  const dark = [172, 124, 74], light = [222, 182, 130];
  for (let i = 0; i < W * H; i++) {
    const t = tone[i], s = clamp(0.94 + (lit[i] - 1) * 0.32 + (h[i] - 0.5) * 0.16, 0.5, 1.25);
    for (let c = 0; c < 3; c++) buf[i * 3 + c] = lerp(dark[c], light[c], t) * s;
  }
  const r = rng(99);
  const dot = (cx, cy, rad, col, a) => {
    for (let dy = -Math.ceil(rad); dy <= Math.ceil(rad); dy++) for (let dx = -Math.ceil(rad); dx <= Math.ceil(rad); dx++) {
      const d = Math.hypot(dx, dy); if (d > rad) continue;
      const x = (Math.floor(cx) + dx + W) % W, y = (Math.floor(cy) + dy + H) % H, k = (y * W + x) * 3, w = a * (1 - d / (rad + 0.3));
      for (let c = 0; c < 3; c++) buf[k + c] = lerp(buf[k + c], col[c], w);
    }
  };
  for (let i = 0; i < 900; i++) dot(r() * W, r() * H, 0.6 + r() * 1.3, [66, 42, 20], 0.7);
  for (let i = 0; i < 22; i++) dot(r() * W, r() * H, 2.2 + r() * 2.6, [70, 44, 22], 0.55);
  for (let i = 0; i < 700; i++) dot(r() * W, r() * H, 0.5 + r() * 1.0, [240, 212, 164], 0.7);
  const out = Buffer.alloc(W * H * 3);
  for (let i = 0; i < out.length; i++) out[i] = clamp(buf[i] / 255) * 255;
  await save('cork.webp', out, W, H, 3, 66);
}

// ---------------------------------------------------------------- BRUSHED METAL (neutral grey, horizontal streaks)
async function brushed() {
  const W = 512, H = 256, f = new Float32Array(W * H), r = rng(31);
  const rows = new Float32Array(H); for (let y = 0; y < H; y++) rows[y] = r();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const u = x / W, v = y / H;
    f[y * W + x] = 0.5 + (rows[y] - 0.5) * 0.16 + (fbm(u, v, 3, 190, 2, 6) - 0.5) * 0.2 + (fbm(u, v, 24, 128, 1, 7) - 0.5) * 0.08 + (r() - 0.5) * 0.03;
  }
  await save('brushed.webp', gray(f, W, H), W, H, 1, 70);
}

// ---------------------------------------------------------------- PAPER (warm near-white, fibres; multiply over cream)
async function paper() {
  const W = 256, H = 256, f = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) f[y * W + x] = 0.965 + (fbm(x / W, y / H, 64, 64, 2, 33) - 0.5) * 0.045 + (fbm(x / W, y / H, 4, 4, 2, 34) - 0.5) * 0.03;
  const r = rng(8);
  for (let n = 0; n < 1400; n++) {
    const x0 = r() * W, y0 = r() * H, ang = r() * Math.PI, len = 5 + r() * 14, d = (r() - 0.55) * 0.07;
    for (let s = 0; s < len; s++) { const x = Math.floor(x0 + Math.cos(ang) * s + W) % W, y = Math.floor(y0 + Math.sin(ang) * s + H) % H; f[y * W + x] += d; }
  }
  const buf = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H; i++) { const v = clamp(f[i]); buf[i * 3] = v * 255; buf[i * 3 + 1] = v * 252; buf[i * 3 + 2] = v * 244; }
  await save('paper.webp', buf, W, H, 3, 74);
}

// ---------------------------------------------------------------- LINEN (neutral grey plain weave)
async function linen() {
  const W = 126, H = 126, P = 3, f = new Float32Array(W * H), r = rng(55);
  const wt = new Float32Array(W / P), ht = new Float32Array(H / P);
  for (let i = 0; i < wt.length; i++) { wt[i] = r(); ht[i] = r(); }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = Math.floor(x / P), j = Math.floor(y / P), fx = (x % P + 0.5) / P, fy = (y % P + 0.5) / P;
    const over = (i + j) % 2 === 0; // warp thread over weft, else weft over warp
    const prof = over ? Math.sin(Math.PI * fx) : Math.sin(Math.PI * fy);
    const thr = over ? wt[i] : ht[j];
    const slub = vnoise(x / W, y / H, 8, 8, 3);
    f[y * W + x] = 0.5 + (prof - 0.6) * 0.2 + (thr - 0.5) * 0.14 + (slub - 0.5) * 0.1 + (r() - 0.5) * 0.04;
  }
  await save('linen.webp', gray(f, W, H), W, H, 1, 72);
}

await Promise.all([wood(), leather(), felt(), cork(), brushed(), paper(), linen()]);
