/**
 * Skeuomorphism photo treatment: "print grade".
 * The skeuomorphism lives in the frames (white-bordered prints, tape, clips, cork), so the photos stay natural.
 * We only make them look like a good drugstore photographic print:
 *   1. matte print floor: blacks lifted to a warm brown (#1f150e-ish) instead of pure black, like paper never reaches true black
 *   2. a gentle S-curve (soft contrast) with highlights rolled off a touch below paper white
 *   3. a 2-3% warm cast (paper + tungsten desk light), saturation nudged down a hair
 *   4. fine luminance grain and a whisper of vignette for the printed feel
 * Variants: default, night (less lift so dark scenes keep depth, a little extra warmth), scene (landscapes / food / pets: a touch more colour).
 * Faces stay true - no posterising, no heavy tints.
 */

const FLOOR = [31, 21, 14]; // matte black point (warm)
const CEIL = 247; // print white point

/** lift blacks toward FLOOR, roll off whites toward CEIL, apply a mild S-curve and warm cast. */
const printCurve = ({ lift = 1, s = 0.16, warm = 1 } = {}) => (fx) =>
  fx.px((r, g, b) => {
    const out = [r, g, b].map((v, i) => {
      let x = v / 255;
      // smooth S-curve around mid-grey
      x = x + s * (x - 0.5) * (1 - Math.abs(2 * x - 1)) * 1.0 - 0;
      x = Math.min(1, Math.max(0, x));
      const floor = FLOOR[i] * lift;
      return floor + x * (CEIL - floor);
    });
    // warm cast (stronger in midtones)
    const l = (out[0] + out[1] + out[2]) / 765;
    const k = 4 * l * (1 - l) * warm;
    return [out[0] + 4.5 * k, out[1] + 1.2 * k, out[2] - 4.5 * k];
  });

export default {
  maxSize: 1400,
  thumb: 520,
  quality: 80,
  format: 'webp',
  treatments: {
    default: (fx) => {
      fx.adjust({ saturation: 0.95, contrast: 0.98, gamma: 1.02 });
      printCurve({ lift: 1, s: 0.18, warm: 1 })(fx);
      return fx.vignette(0.14, { softness: 0.7, color: '#2a1a0e' }).grain(0.025);
    },
    night: (fx) => {
      fx.adjust({ saturation: 0.96, contrast: 0.97, gamma: 1.1 });
      printCurve({ lift: 0.75, s: 0.1, warm: 1.2 })(fx);
      return fx.vignette(0.1, { softness: 0.7, color: '#2a1a0e' }).grain(0.03);
    },
    scene: (fx) => {
      fx.adjust({ saturation: 1.0, contrast: 0.99, gamma: 1.02 });
      printCurve({ lift: 0.9, s: 0.16, warm: 0.8 })(fx);
      return fx.vignette(0.12, { softness: 0.7, color: '#2a1a0e' }).grain(0.022);
    },
  },
  pick: (ctx) => {
    if (ctx.tags?.includes('night')) return 'night';
    if (['scenery', 'food', 'pets'].includes(ctx.category)) return 'scene';
    return 'default';
  },
};
