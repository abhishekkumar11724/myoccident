/**
 * Isometric photo treatment: "clear air".
 * The style lives in the FRAMING (folding screens skewed to exactly 30 degrees, thick edges, floor shadows), not in the pixels,
 * so photos stay natural with a light, clean grade that makes them sit in a bright blue-white world:
 *   1. a little more saturation and a gentle S-curve (flat-illustration colours without cartoonising faces)
 *   2. lifted exposure (daylight-in-an-office feel)
 *   3. shadows pulled toward a cool navy (#1d2a55) instead of neutral black, so they harmonise with the blue three-shade ramps
 *   4. highlights left alone (no clipping, skin stays warm)
 * Variants: default, night (smaller lift so dark scenes stay moody), scene (a touch more colour for landscapes / food / pets).
 */

/** cool the deepest shadows toward `floor`, leave mid-tones and highlights untouched. */
const coolShadows = ({ floor = [30, 42, 90], amount = 0.5 } = {}) => (fx) =>
  fx.px((r, g, b) => {
    const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const k = Math.pow(1 - l, 2.6) * amount; // only the darkest tones move
    return [r + (floor[0] - r) * k * 0.55 + k * 3, g + (floor[1] - g) * k * 0.5, b + (floor[2] - b) * k * 0.45 + k * 8];
  });

export default {
  maxSize: 1280,
  thumb: 520,
  quality: 72,
  format: 'webp',
  treatments: {
    default: (fx) => {
      fx.adjust({ saturation: 1.07, contrast: 1.05, gamma: 1.07, brightness: 0.01 });
      coolShadows({ amount: 0.55 })(fx);
      return fx;
    },
    night: (fx) => {
      fx.adjust({ saturation: 1.05, contrast: 1.03, gamma: 1.13, brightness: 0.01 });
      coolShadows({ amount: 0.4 })(fx);
      return fx;
    },
    scene: (fx) => {
      fx.adjust({ saturation: 1.14, contrast: 1.05, gamma: 1.06 });
      coolShadows({ amount: 0.5 })(fx);
      return fx;
    },
  },
  pick: (ctx) => {
    if (ctx.tags?.includes('night')) return 'night';
    if (['scenery', 'food', 'pets', 'adventure'].includes(ctx.category) && !ctx.tags?.includes('solo')) return 'scene';
    return 'default';
  },
};
