/**
 * Anti-design photo treatment: "wrong on purpose", always in the page palette.
 *
 * Every photo gets ONE deliberately off-key treatment = a COLOUR family x a FORM, chosen deterministically from its
 * category and file number (consecutive photos always differ, so a board never repeats itself):
 *   colour  blue    electric-blue shadows -> paper highlights (risograph print)
 *           orange  black -> safety orange -> paper tri-tone
 *           acid    electric blue -> acid yellow-green (very clashing)
 *           swap    red/blue channels swapped (skin goes blue/orange: reads as a colour-management mistake)
 *   form    duo     hard duotone
 *           half    big halftone dots (blue / orange ink on paper, blue on acid)
 *           slice   vertical strips pushed up/down (outer strips move a lot, the middle (face) barely moves)
 *           strips  strips knocked out to transparent (the page colour shows through)
 *           invert  inverted channels + crunch          outline  outline-only on acid
 *   mono    plain high-contrast greyscale: the page blends these with mix-blend-mode: multiply / screen over colour blocks
 * Faces: heroes / portraits / solo / group shots only get face-safe forms (duo, half on close-ups, calm slices).
 * Dark photos are lifted adaptively so halftones never collapse into a solid colour field.
 * Everything is deterministic. Keep MONO in sync with BLEND in Page.astro.
 */
import { hashString } from '../../../scripts/fx/index.mjs';

const BLUE = '#1a1aff';
const ORANGE = '#ff4500';
const ACID = '#d7ff1e';
const PAPER = '#f4f1e8';
const INK = '#0a0a0a';

const MONO = new Set(['adventure/04-hillside-smile', 'portraits/06-alley-smile', 'bikes/04-bike-bw', 'pets/02-dog-on-ledge']);
const FIXED = {
  'portraits/01-selfie-maroon': 'duo_blue', 'portraits/02-smile-jacket': 'swap', 'portraits/03-red-kurta-seated': 'half_orange',
  'portraits/09-jaipur-arch': 'duo_orange', 'books/02-can-we-be-strangers-again': 'duo_orange', 'adventure/06-snow-forest': 'duo_acid',
};
const PAL = {
  blue: { map: [BLUE, PAPER], ink: BLUE, paper: PAPER },
  orange: { map: [INK, ORANGE, PAPER], ink: ORANGE, paper: PAPER },
  acid: { map: [BLUE, ACID], ink: BLUE, paper: ACID },
};
const FORMS = {
  face: ['duo', 'duo', 'half', 'slice', 'duo', 'half', 'slice'],
  group: ['duo', 'duo', 'slice', 'duo', 'duo', 'slice'],
  thing: ['duo', 'outline', 'half', 'invert', 'slice', 'strips', 'duo', 'half', 'duo'],
};

const lum = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// ---------------------------------------------------------------- steps
/** stretch the 1.5th..98.5th luminance percentile to full range, then (adaptive) lift dark photos toward a mid-grey mean */
const autoLevels = ({ lo = 0.015, hi = 0.985, gamma = 1, adaptive = false } = {}) => (fx) =>
  fx.custom((f) => {
    const d = f.data, hist = new Uint32Array(256);
    let n = 0;
    for (let i = 0; i < d.length; i += 4) { hist[Math.round(lum(d[i], d[i + 1], d[i + 2]) * 255)]++; n++; }
    let acc = 0, a = 0, b = 255;
    for (let k = 0; k < 256; k++) { acc += hist[k]; if (acc >= n * lo) { a = k; break; } }
    acc = 0;
    for (let k = 255; k >= 0; k--) { acc += hist[k]; if (acc >= n * (1 - hi)) { b = k; break; } }
    const s = 255 / Math.max(40, b - a);
    let sum = 0;
    for (let k = 0; k < 256; k++) sum += hist[k] * clamp((k - a) * s, 0, 255);
    const mean = sum / n / 255;
    let g = gamma;
    if (adaptive && mean < 0.42) g = Math.max(g, clamp(Math.log(0.46) / Math.log(Math.max(mean, 0.05)), 1, 2.1));
    for (let i = 0; i < d.length; i += 4) for (let c = 0; c < 3; c++) {
      const v = clamp((d[i + c] - a) * s, 0, 255);
      d[i + c] = g === 1 ? v : 255 * Math.pow(v / 255, 1 / g);
    }
  });
const grey = (contrast = 1.2, opts = {}) => (fx) => autoLevels({ adaptive: true, ...opts })(fx).adjust({ saturation: 0, contrast });

/** vertical strips pushed up/down with wrap-around. The middle band (where the face usually is) barely moves. */
const sliceStrips = ({ n = 7, maxShift = 0.13 } = {}) => (fx) =>
  fx.custom((f) => {
    const { w, h, data: d, rng: r } = f;
    const o = new Uint8ClampedArray(d);
    let x = 0;
    for (let s = 0; s < n && x < w; s++) {
      const sw = s === n - 1 ? w - x : Math.max(8, Math.floor((w / n) * (0.55 + r() * 0.9)));
      const cx = (x + sw / 2) / w;
      const mid = cx > 0.3 && cx < 0.7;
      let dy = Math.round((r() - 0.5) * 2 * h * maxShift * (mid ? 0.06 : 1));
      if (!mid && Math.abs(dy) < h * 0.025) dy = Math.sign(dy || 1) * Math.round(h * 0.04);
      for (let xx = x; xx < Math.min(w, x + sw); xx++) for (let y = 0; y < h; y++) {
        const sy = (y - dy + h * 4) % h, i = (y * w + xx) * 4, j = (sy * w + xx) * 4;
        d[i] = o[j]; d[i + 1] = o[j + 1]; d[i + 2] = o[j + 2];
      }
      x += sw;
    }
  });

/** knock narrow strips out to transparent (alpha 0): the page colour shows through */
const knockStrips = ({ n = 4 } = {}) => (fx) =>
  fx.custom((f) => {
    const { w, h, data: d, rng: r } = f;
    for (let s = 0; s < n; s++) {
      const sw = Math.floor(w * (0.03 + r() * 0.045));
      const x0 = Math.floor(((s + 0.25 + r() * 0.5) / n) * (w - sw));
      for (let y = 0; y < h; y++) for (let x = x0; x < x0 + sw; x++) d[(y * w + x) * 4 + 3] = 0;
    }
  });

const swapRB = (fx) => fx.px((r, g, b) => [b, g, r]).posterize(7);

// ---------------------------------------------------------------- treatments
const T = {
  mono: (fx) => autoLevels({ lo: 0.01, hi: 0.99 })(fx).adjust({ saturation: 0, contrast: 1.25 }),
  swap: (fx) => swapRB(autoLevels({ lo: 0.01, hi: 0.99, gamma: 1.05, adaptive: true })(fx).adjust({ contrast: 1.12, saturation: 1.25 })),
  night_swap: (fx) => swapRB(autoLevels({ lo: 0.01, hi: 0.99, gamma: 1.5 })(fx).adjust({ contrast: 1.1, saturation: 1.3 })),
  invert: (fx) => autoLevels()(fx).adjust({ contrast: 1.15, saturation: 1.2 }).invert().posterize(7),
  outline: (fx) => fx.edges({ mode: 'only', color: INK, paper: ACID, threshold: 0.1, thickness: 2, smooth: 1.6 }),
};
for (const [name, p] of Object.entries(PAL)) {
  const duo = (fx, lift = 1) => grey(1.22, { gamma: lift })(fx).gradientMap(p.map);
  T[`duo_${name}`] = (fx) => duo(fx);
  T[`night_${name}`] = (fx) => duo(fx, 1.6);
  T[`slice_${name}`] = (fx) => sliceStrips()(duo(fx));
  T[`strips_${name}`] = (fx) => knockStrips()(duo(fx));
  T[`half_${name}`] = (fx) => grey(1.2, { gamma: 1.1 })(fx).halftone({ cell: 9, angle: name === 'orange' ? 15 : 45, ink: p.ink, paper: p.paper, gamma: 1.3 });
}

export default {
  maxSize: 1100, thumb: 520, quality: 70, format: 'webp',
  treatments: T,
  pick: (ctx) => {
    if (MONO.has(ctx.id)) return 'mono';
    if (FIXED[ctx.id]) return FIXED[ctx.id];
    const n = parseInt(ctx.name, 10) || 0;
    const off = hashString(ctx.category) % 4;
    const colour = ['blue', 'orange', 'acid', 'swap'][(n + off) % 4];
    if (ctx.tags?.includes('night')) return colour === 'swap' ? 'night_swap' : `night_${colour}`;
    if (colour === 'swap') return 'swap';
    const solo = ctx.tags?.includes('solo') || ctx.category === 'portraits';
    const forms = FORMS[ctx.category === 'friends-trips' ? 'group' : solo ? 'face' : 'thing'];
    const form = forms[(n * 5 + off) % forms.length];
    return form === 'invert' || form === 'outline' ? form : `${form}_${colour}`;
  },
};
