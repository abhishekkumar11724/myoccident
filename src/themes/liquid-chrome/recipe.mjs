/**
 * Liquid chrome photo treatment: photograph -> polished mirror-metal poster.
 *
 * Pipeline (deterministic):
 *   1. luminance + auto-levels, then LOCAL contrast (unsharp against a very wide blur) and a shadow lift,
 *      so faces survive in backlit / night shots.
 *   2. chrome gradient map on that luminance: black -> blue-black -> steel -> silver -> white  (this layer keeps the face readable).
 *   3. a fake height field (smoothed luminance) -> surface normals -> reflection vector -> procedural environment
 *      (white-to-deep-blue sky, HARD horizon, dark ground with a bright bounce band) mixed over the gradient map:
 *      this is what turns tones into liquid metal, like reflection mapping on a CG chrome statue.
 *   4. top-left specular glints + a thin-film (cyan / violet) fresnel rim on steep slopes.
 *   5. bloom on the brightest speculars, light lateral chromatic aberration, deep vignette, grain.
 * Night shots use a lifted exposure and slightly less environment so they do not collapse to black.
 */
import { hex, clamp, lerp } from '../../../scripts/fx/index.mjs';

const STOPS = [
  [0.0, '#01020a'], [0.12, '#060b19'], [0.28, '#16223d'], [0.44, '#45577d'],
  [0.58, '#8798b8'], [0.72, '#c7d3e8'], [0.86, '#f0f6ff'], [1.0, '#ffffff'],
].map(([t, c]) => [t, hex(c)]);
const LUT = new Float32Array(256 * 3);
for (let i = 0; i < 256; i++) {
  const t = i / 255;
  let k = 0; while (k < STOPS.length - 2 && t > STOPS[k + 1][0]) k++;
  const u = clamp((t - STOPS[k][0]) / (STOPS[k + 1][0] - STOPS[k][0]), 0, 1);
  for (let c = 0; c < 3; c++) LUT[i * 3 + c] = lerp(STOPS[k][1][c], STOPS[k + 1][1][c], u);
}

const SKY_H = hex('#f4f9ff'), SKY_M = hex('#6ea6f0'), SKY_D = hex('#1c4aa8'), SKY_T = hex('#0a1f55');
const GND_B = hex('#9bb4d8'), GND_M = hex('#1a2848'), GND_K = hex('#010207');
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const mix3 = (a, b, t, out) => { out[0] = a[0] + (b[0] - a[0]) * t; out[1] = a[1] + (b[1] - a[1]) * t; out[2] = a[2] + (b[2] - a[2]) * t; };

const _c = [0, 0, 0];
/** procedural environment: ry = up component of the reflection vector, rx = sideways. writes into _c (0..255) */
function env(rx, ry) {
  if (ry >= 0) {
    mix3(SKY_H, SKY_M, smooth(0, 0.35, ry), _c);
    mix3(_c, SKY_D, smooth(0.3, 0.8, ry), _c);
    mix3(_c, SKY_T, smooth(0.75, 1, ry), _c);
    // softbox streak in the sky
    const sb = smooth(0.36, 0.42, rx) * (1 - smooth(0.5, 0.56, rx)) * smooth(0.04, 0.12, ry) * (1 - smooth(0.5, 0.66, ry));
    _c[0] += 70 * sb; _c[1] += 80 * sb; _c[2] += 90 * sb;
  } else {
    const t = -ry;
    mix3(GND_B, GND_M, smooth(0, 0.25, t), _c);
    mix3(_c, GND_K, smooth(0.2, 0.7, t), _c);
  }
  // thin bright line exactly at the horizon
  const hl = Math.exp(-(ry * ry) / 0.00012) * 70;
  _c[0] += hl; _c[1] += hl; _c[2] += hl;
  return _c;
}

/** float separable blur (3 box passes ~ gaussian) */
function blurF(src, w, h, sigma) {
  const r = Math.max(1, Math.round(sigma * 1.1));
  let a = Float32Array.from(src), t = new Float32Array(a.length);
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < h; y++) {
      let acc = 0; const row = y * w;
      for (let x = -r; x <= r; x++) acc += a[row + clamp(x, 0, w - 1)];
      for (let x = 0; x < w; x++) {
        t[row + x] = acc / (2 * r + 1);
        acc += a[row + clamp(x + r + 1, 0, w - 1)] - a[row + clamp(x - r, 0, w - 1)];
      }
    }
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let y = -r; y <= r; y++) acc += t[clamp(y, 0, h - 1) * w + x];
      for (let y = 0; y < h; y++) {
        a[y * w + x] = acc / (2 * r + 1);
        acc += t[clamp(y + r + 1, 0, h - 1) * w + x] - t[clamp(y - r, 0, h - 1) * w + x];
      }
    }
  }
  return a;
}

async function chrome(f, ctx, night) {
  const { w, h } = f, n = w * h, d = f.data, S = w / 1400;
  const people = ['portraits', 'friends-trips', 'adventure', 'bikes', 'work-and-lifestyle'].includes(ctx.category);

  // 1. luminance, levels, local contrast -------------------------------------------------
  const L = new Float32Array(n), hist = new Uint32Array(256);
  for (let p = 0, i = 0; p < n; p++, i += 4) { const v = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255; L[p] = v; hist[Math.round(v * 255)]++; }
  let acc = 0, lo = 0, hi = 255;
  for (let i = 0; i < 256; i++) { acc += hist[i]; if (acc > n * 0.01) { lo = i; break; } }
  acc = 0; for (let i = 255; i >= 0; i--) { acc += hist[i]; if (acc > n * 0.012) { hi = i; break; } }
  if (hi - lo < 70) { lo = Math.max(0, lo - 25); hi = Math.min(255, hi + 25); }
  const sc = 255 / (hi - lo);
  for (let p = 0; p < n; p++) L[p] = clamp((L[p] * 255 - lo) * sc / 255, 0, 1);

  const Lb = blurF(L, w, h, Math.max(10, w / 15));
  const k = night ? 0.55 : people ? 0.36 : 0.4;
  const lift = night ? 0.3 : 0.14;
  const L2 = new Float32Array(n);
  let mean = 0;
  for (let p = 0; p < n; p++) {
    let v = L[p] + k * (L[p] - Lb[p]) + lift * (1 - Lb[p]) * (1 - Lb[p]) * (1 - L[p] * 0.5);
    v = clamp(v, 0, 1);
    L2[p] = v; mean += v;
  }
  mean /= n;
  const target = night ? 0.4 : 0.44;
  const gamma = clamp(Math.log(target) / Math.log(Math.max(0.05, mean)), 0.6, 1.5);
  for (let p = 0; p < n; p++) { const v = Math.pow(L2[p], gamma); const s = v * v * (3 - 2 * v) * 0.3 + v * 0.7; L2[p] = s * (1 - 0.14 * s * s); } // gentle S-curve + highlight roll-off

  // 3. height field -> normals ------------------------------------------------------------
  const h1 = blurF(L2, w, h, 4.6 * S + 0.8), h2 = blurF(L2, w, h, 13 * S + 1);
  const H = new Float32Array(n);
  for (let p = 0; p < n; p++) H[p] = 0.5 * h1[p] + 0.5 * h2[p];
  const strength = (people ? 25 : 30) * Math.max(0.7, S);
  const envMix = night ? 0.32 : people ? 0.4 : 0.46;

  const out = new Uint8ClampedArray(d.length);
  const lx = -0.5, ly = 0.62, lz = 0.6, ll = Math.hypot(lx, ly, lz);
  const LX = lx / ll, LY = ly / ll, LZ = lz / ll;
  const bright = new Float32Array(n);
  for (let y = 0; y < h; y++) {
    const ym = Math.max(0, y - 1) * w, yp = Math.min(h - 1, y + 1) * w, row = y * w;
    for (let x = 0; x < w; x++) {
      const p = row + x, xm = Math.max(0, x - 1), xp = Math.min(w - 1, x + 1);
      const gx = (H[row + xp] - H[row + xm]) * 0.5, gyImg = (H[yp + x] - H[ym + x]) * 0.5;
      // normal (world up = -image y)
      let nx = -gx * strength, ny = gyImg * strength, nz = 1;
      const nl = Math.hypot(nx, ny, nz); nx /= nl; ny /= nl; nz /= nl;
      // reflection of a view vector (0,0,-1): R = (2 nz nx, 2 nz ny, 2 nz^2 - 1)
      const rx = 2 * nz * nx, ry = 2 * nz * ny, rz = 2 * nz * nz - 1;
      // base chrome gradient map
      const li = Math.round(L2[p] * 255) * 3;
      let r = LUT[li], g = LUT[li + 1], b = LUT[li + 2];
      // environment
      const e = env(rx, ry);
      const shade = 0.5 + 0.7 * L2[p];
      const m = envMix * (0.55 + 0.45 * Math.min(1, Math.hypot(nx, ny) * 3.2));   // flat areas keep the gradient map, slopes go full mirror
      r = lerp(r, e[0] * shade, m); g = lerp(g, e[1] * shade, m); b = lerp(b, e[2] * shade, m);
      // specular glints
      const sp = Math.max(0, rx * LX + ry * LY + rz * LZ);
      const spec = Math.pow(sp, 80) * 150 + Math.pow(sp, 10) * 8;
      r += spec; g += spec; b += spec;
      // thin-film rim on steep slopes
      const rim = Math.pow(1 - nz, 2.2);
      const ph = rim * 1.4;
      r += rim * 38 * (0.5 + 0.5 * Math.cos(6.2832 * (ph + 0.0)));
      g += rim * 38 * (0.5 + 0.5 * Math.cos(6.2832 * (ph + 0.33)));
      b += rim * 38 * (0.5 + 0.5 * Math.cos(6.2832 * (ph + 0.67)));
      const i = p * 4;
      out[i] = r; out[i + 1] = g; out[i + 2] = b; out[i + 3] = 255;
      bright[p] = clamp(((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 - 0.8) / 0.2, 0, 1);
    }
  }
  // 5. bloom -------------------------------------------------------------------------------
  const bl = blurF(bright, w, h, 12 * S + 2), bl2 = blurF(bright, w, h, 4 * S + 1);
  const bAmt = night ? 46 : 34;
  for (let p = 0, i = 0; p < n; p++, i += 4) {
    const a = bl[p] * bAmt + bl2[p] * 28;
    out[i] += a * 0.9; out[i + 1] += a * 0.97; out[i + 2] += a * 1.05;
  }
  d.set(out);
  f.chromatic(2.4 * Math.max(0.8, S)).vignette(night ? 0.55 : 0.5, { softness: 0.7, color: '#02030a' }).grain(0.03);
  await f.run();
}

export default {
  maxSize: 1400, thumb: 520, quality: 78, format: 'webp',
  treatments: {
    default: (fx, ctx) => fx.custom(async (f) => { await chrome(f, ctx, false); }),
    night: (fx, ctx) => fx.custom(async (f) => { await chrome(f, ctx, true); }),
  },
  pick: (ctx) => (ctx.tags?.includes('night') ? 'night' : 'default'),
};
