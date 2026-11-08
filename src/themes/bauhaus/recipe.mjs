/**
 * Bauhaus photo treatment: "two-ink print".
 *
 * A 1920s Bauhaus book (Moholy-Nagy's Bauhausbuecher, Bayer's printshop posters) reproduced photographs with a black plate
 * plus one flat spot colour on warm off-white paper. This recipe imitates that:
 *   1. grayscale -> local exposure balance (backlit faces survive) -> percentile auto-levels -> contrast
 *   2. each ink is a rotated round-dot halftone screen; inks overprint by MULTIPLY on the paper colour (so red dots over
 *      black dots read darker, exactly like a press)
 *   3. black plate carries shadows only; the spot-colour plate (red / blue / yellow by category) carries the mid-tones
 * Variants: hero (red + black, fine screen), people (black only), group (black, finer screen), scene (blue + black),
 * warm (yellow + black: food, pets, books, desk), night (black, lifted shadows).
 * The paper colour equals the page paper (#F1EBDD) so a photo sits flush on the page and tints correctly when the page
 * multiplies it over a flat colour field.
 */

const PAPER = [241, 235, 221];
const INK = { black: [22, 22, 22], red: [216, 40, 28], blue: [29, 78, 158], yellow: [244, 190, 12] };

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

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
const autoTone = ({ lo = 0.02, hi = 0.985, target = 0.5, gmin = 0.6, gmax = 1.25 } = {}) => (fx) =>
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

/** Round-dot coverage (0..1) per pixel for one screen. tone(darkness 0..1) -> 0..1 shapes what the plate prints. */
function screen(src, w, h, { cell, angle, tone }) {
  const a = (angle * Math.PI) / 180, cs = Math.cos(a), sn = Math.sin(a);
  const cov = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x * cs + y * sn, v = -x * sn + y * cs;
      const cu = (Math.floor(u / cell) + 0.5) * cell, cv = (Math.floor(v / cell) + 0.5) * cell;
      const sx = clamp(Math.round(cu * cs - cv * sn), 0, w - 1), sy = clamp(Math.round(cu * sn + cv * cs), 0, h - 1);
      const dark = 1 - src[(sy * w + sx) * 4] / 255;
      const t = tone(dark);
      const r = cell * 0.5 * Math.sqrt(clamp(t, 0, 1)) * 1.18;
      cov[y * w + x] = clamp(r - Math.hypot(u - cu, v - cv) + 0.5, 0, 1);
    }
  }
  return cov;
}

/**
 * Compose plates onto the paper by multiply. plates: [{ ink:[r,g,b], cell, angle, tone }] (printed in order).
 * Reads the grey value from the red channel of the current pixels.
 */
const press = (plates) => (fx) =>
  fx.custom(async (f) => {
    const { w, h, data: d } = f;
    const covs = plates.map((p) => screen(d, w, h, p));
    for (let p = 0, i = 0; p < w * h; p++, i += 4) {
      let r = PAPER[0], g = PAPER[1], b = PAPER[2];
      for (let k = 0; k < plates.length; k++) {
        const c = covs[k][p], ink = plates[k].ink;
        r *= 1 - c + (c * ink[0]) / 255;
        g *= 1 - c + (c * ink[1]) / 255;
        b *= 1 - c + (c * ink[2]) / 255;
      }
      d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255;
    }
  }).blur(0.7); // ink spread (also keeps the webp small)

/** shadows-only black plate */
const blackTone = (lo = 0.42, gamma = 0.85) => (dk) => Math.pow(clamp((dk - lo) / (1 - lo), 0, 1), gamma);
/** broad spot-colour plate: prints from light mid-tones downward */
const spotTone = (gain = 1.15, gamma = 0.8) => (dk) => Math.pow(clamp(dk * gain, 0, 1), gamma);
/** single black plate over the whole range */
const monoTone = (gamma = 1.0, gain = 1.05) => (dk) => Math.pow(clamp(dk * gain, 0, 1), gamma);

const prep = ({ contrast = 1.18, exposure = 0.5, target = 0.5 } = {}) => (fx) => {
  fx.grayscale();
  localExposure({ strength: exposure })(fx);
  autoTone({ target })(fx);
  fx.adjust({ contrast }).sharpen(1.0, { m1: 1.1, m2: 2.2 });
  return fx;
};

const duo = (spot, cell, spotAngle = 15, { spotGain = 1.15, spotGamma = 0.8, blackLo = 0.42 } = {}) => [
  { ink: INK[spot], cell, angle: spotAngle, tone: spotTone(spotGain, spotGamma) },
  { ink: INK.black, cell, angle: 45, tone: blackTone(blackLo, 0.85) },
];

const HERO = new Set(['portraits/01-selfie-maroon', 'portraits/02-smile-jacket', 'portraits/03-red-kurta-seated']);
const SPOT = { portraits: 'red', adventure: 'blue', scenery: 'blue', books: 'yellow', food: 'yellow', pets: 'yellow', 'work-and-lifestyle': 'yellow' };

export default {
  maxSize: 820,
  thumb: 420,
  quality: 48,
  format: 'webp',
  treatments: {
    // best portraits: red spot + black, finest screen
    hero: (fx) => {
      prep({ contrast: 1.2, exposure: 0.55 })(fx);
      press(duo('red', 5, 15, { spotGain: 1.05, spotGamma: 0.85, blackLo: 0.4 }))(fx);
      return fx;
    },
    // people / rides: single black screen, bold
    people: (fx) => {
      prep({ contrast: 1.22, exposure: 0.55 })(fx);
      press([{ ink: INK.black, cell: 6, angle: 45, tone: monoTone(0.95, 1.08) }])(fx);
      return fx;
    },
    // many small faces: slightly finer screen
    group: (fx) => {
      prep({ contrast: 1.2, exposure: 0.5 })(fx);
      press([{ ink: INK.black, cell: 5, angle: 45, tone: monoTone(0.95, 1.1) }])(fx);
      return fx;
    },
    // night: lift the shadows so faces survive
    night: (fx) => {
      prep({ contrast: 1.1, exposure: 0.85, target: 0.46 })(fx);
      press([{ ink: INK.black, cell: 5, angle: 45, tone: monoTone(1.15, 0.95) }])(fx);
      return fx;
    },
    // scenery & adventure & non-face things: spot colour + black
    scene: (fx, ctx) => {
      prep({ contrast: 1.2, exposure: 0.4 })(fx);
      press(duo(SPOT[ctx.category] || 'blue', 6, 15))(fx);
      return fx;
    },
  },
  pick: (ctx) => {
    const tags = ctx.tags || [];
    if (HERO.has(ctx.id)) return 'hero';
    if (tags.includes('night')) return 'night';
    if (ctx.category === 'friends-trips') return 'group';
    if (ctx.category === 'bikes') return 'people';
    if (ctx.category === 'portraits') return 'scene'; // red spot (SPOT.portraits)
    if (ctx.category === 'adventure') return tags.includes('solo') ? 'scene' : 'people';
    return 'scene';
  },
};
