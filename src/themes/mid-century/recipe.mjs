/**
 * Mid-century photo treatment: "limited-ink screen print".
 *
 * A 1962 poster is printed from a few plates, not from pixels. We imitate that:
 *   1. Balance the exposure locally (backlit faces survive) and stretch levels.
 *   2. COLOUR PLATES: four tonal steps (deep / mid / light / bare paper). The ink family is picked per region
 *      from a heavily blurred hue map - warm (rust, burnt orange, mustard) for skin / earth, atomic teal for sky and
 *      water, avocado for foliage - so the result stays a limited, coherent ink set and never speckles.
 *      Steps are cut through a rotated halftone dot screen, so tone changes happen as dots, not as smooth blends.
 *   3. KEY PLATE: the darkest tones are printed again in walnut ink, deliberately a few pixels OFF REGISTER, which
 *      is what makes eyes, glasses, hair and edges read and gives the unmistakable screen-print sliver.
 *   4. Paper fibre, ink dropout specks and light grain on warm stock.
 * Night shots swap the base family to teal with mustard lamps. The page shows the untouched original in its lightbox.
 */

const INK = '#2a1c14';
const PAPER = '#f4e8cd';
// [deep, mid, light] per ink family
const FAMILY = {
  warm: ['#1d5a57', '#d4561c', '#eba824'],
  teal: ['#17504d', '#2a8580', '#8ccab6'],
  avo: ['#2f5a3a', '#7c8a2c', '#d2c765'],
};

const rgb = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const FAM = Object.fromEntries(Object.entries(FAMILY).map(([k, v]) => [k, v.map(rgb)]));
const INK_RGB = rgb(INK), PAPER_RGB = rgb(PAPER);
const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a || 1e-9)); return t * t * (3 - 2 * t); };

const screenPrint = ({ night = false } = {}) => (fx) => {
  fx.sharpen(1.1, { m1: 1, m2: 2.2 });
  fx.custom(async (f) => {
    const { w, h, data: d } = f;
    const n = w * h;

    // ---- 1. luminance, local exposure, auto levels
    const L = new Float32Array(n);
    for (let i = 0, p = 0; p < n; i += 4, p++) L[p] = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;

    const soft = f.clone();
    soft.blur(Math.max(8, w * 0.085));
    await soft.run();
    const strength = night ? 0.62 : 0.5, target = 0.5;
    const B = new Float32Array(n);
    for (let i = 0, p = 0; p < n; i += 4, p++) {
      const loc = Math.max(0.06, soft.data[i] * 0.2126 / 255 + soft.data[i + 1] * 0.7152 / 255 + soft.data[i + 2] * 0.0722 / 255);
      const gain = Math.min(3.0, Math.max(0.55, Math.pow(target / loc, strength)));
      B[p] = clamp(L[p] * gain);
    }
    const hist = new Uint32Array(256);
    for (let p = 0; p < n; p++) hist[(B[p] * 255) | 0]++;
    const at = (q) => { let acc = 0; for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= q * n) return v / 255; } return 1; };
    const black = at(0.02), white = Math.max(black + 0.18, at(0.985)), med = at(0.5);
    const m = clamp((med - black) / (white - black), 0.08, 0.9);
    const g = clamp(Math.log(night ? 0.42 : 0.5) / Math.log(m), 0.6, 1.25);
    for (let p = 0; p < n; p++) B[p] = Math.pow(clamp((B[p] - black) / (white - black)), g);

    // ---- 2. ink-family map from a heavily blurred copy
    const hueSrc = f.clone();
    hueSrc.blur(Math.max(6, w * 0.03));
    await hueSrc.run();
    const fam = new Uint8Array(n); // 0 warm 1 teal 2 avocado
    const hd = hueSrc.data;
    for (let i = 0, p = 0; p < n; i += 4, p++) {
      const r = hd[i] / 255, gg = hd[i + 1] / 255, b = hd[i + 2] / 255;
      const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b), dl = mx - mn;
      const s = mx ? dl / mx : 0;
      let hue = 0;
      if (dl > 1e-5) { hue = mx === r ? ((gg - b) / dl) % 6 : mx === gg ? (b - r) / dl + 2 : (r - gg) / dl + 4; hue *= 60; if (hue < 0) hue += 360; }
      let wt = smooth(150, 185, hue) * (1 - smooth(255, 285, hue)) * smooth(0.08, 0.2, s);
      const wa = smooth(55, 80, hue) * (1 - smooth(140, 160, hue)) * smooth(0.12, 0.26, s);
      if (night) wt = Math.max(wt, smooth(0.34, 0.12, mx) * 0.9); // dark ambient -> teal
      fam[p] = wt > 0.5 ? 1 : wa > 0.5 ? 2 : 0;
    }

    // ---- 3. halftone screen + plates
    const cell = Math.max(7, Math.round(w / 105)), ang = Math.PI / 4, ca = Math.cos(ang), sa = Math.sin(ang);
    const TAU = Math.PI * 2, AMP = 0.16;
    const T1 = night ? 0.27 : 0.32, T2 = night ? 0.46 : 0.5, T3 = night ? 0.7 : 0.74, TK = night ? 0.2 : 0.235;
    const shift = Math.max(2, Math.round(w / 330));
    const dx = shift, dy = Math.round(shift * 0.6);
    const scr = (x, y) => {
      const xr = x * ca + y * sa, yr = -x * sa + y * ca;
      return 0.5 + 0.25 * (Math.cos((TAU * xr) / cell) + Math.cos((TAU * yr) / cell));
    };
    const out = new Uint8ClampedArray(d.length);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = y * w + x, i = p * 4;
        const v = B[p] + (scr(x, y) - 0.5) * AMP;
        const F = FAM[fam[p] === 1 ? 'teal' : fam[p] === 2 ? 'avo' : 'warm'];
        let c;
        if (v < T1) c = F[0];
        else if (v < T2) c = F[1];
        else if (v < T3) c = F[2];
        else c = PAPER_RGB;
        // key plate sampled with an offset (off register)
        const kx = x - dx, ky = y - dy;
        let key = false;
        if (kx >= 0 && ky >= 0) {
          const kp = ky * w + kx;
          key = B[kp] + (scr(kx, ky) - 0.5) * AMP * 0.9 < TK;
        }
        if (key) { out[i] = INK_RGB[0] * 0.94 + c[0] * 0.06; out[i + 1] = INK_RGB[1] * 0.94 + c[1] * 0.06; out[i + 2] = INK_RGB[2] * 0.94 + c[2] * 0.06; }
        else { out[i] = c[0]; out[i + 1] = c[1]; out[i + 2] = c[2]; }
        out[i + 3] = 255;
      }
    }
    // ink dropout: tiny paper-coloured specks inside inked areas
    const rng = f.rng;
    for (let p = 0; p < n; p++) {
      if (rng() < 0.0004) {
        const i = p * 4;
        out[i] = out[i] * 0.4 + PAPER_RGB[0] * 0.6; out[i + 1] = out[i + 1] * 0.4 + PAPER_RGB[1] * 0.6; out[i + 2] = out[i + 2] * 0.4 + PAPER_RGB[2] * 0.6;
      }
    }
    d.set(out);
  });
  fx.texture('paper', { opacity: 0.2, scale: 1.6, mode: 'multiply' }).grain(0.02);
  return fx;
};

export default {
  maxSize: 1000,
  thumb: 520,
  quality: 52,
  format: 'webp',
  treatments: {
    default: screenPrint(),
    night: screenPrint({ night: true }),
  },
  pick: (ctx) => (ctx.tags?.includes('night') ? 'night' : 'default'),
};
