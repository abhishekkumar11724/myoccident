/**
 * Neumorphism photo treatment: "airy matte".
 * Soft UI is about LIGHTING and FRAMING, so the photos stay natural: a light grade only.
 *   1. a touch less saturation + a touch less contrast (calm, pastel-friendly)
 *   2. lifted shadows with a cool slate floor, so pure black never fights the pale #e0e5ec surface
 *   3. soft highlight roll-off (no clipped whites that glare inside the pictured wells)
 *   4. a very faint surface-coloured vignette so the picture feels set INTO the surface
 * The depth itself (raised plates, inset wells, inner shadows) is done in CSS.
 * Variants: default, night (gentler lift so dark scenes don't go grey), scene (a hair more colour for landscapes/food).
 */

const SURFACE = '#e0e5ec';

/** matte shadows: blend the darkest tones toward a cool slate floor; roll off highlights above `knee`. */
const matte = ({ floor = [44, 52, 72], lift = 0.5, knee = 236, roll = 0.55 } = {}) => (fx) =>
  fx.px((r, g, b) => {
    const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const sh = Math.pow(1 - l, 2.4) * lift; // strongest in the deepest shadows
    const out = [r, g, b].map((v, i) => {
      let o = v + (floor[i] - v) * sh * 0.55;
      if (o > knee) o = knee + (o - knee) * roll;
      return o;
    });
    return out;
  });

export default {
  maxSize: 1400,
  thumb: 520,
  quality: 78,
  format: 'webp',
  treatments: {
    default: (fx) => {
      fx.adjust({ saturation: 0.88, contrast: 0.95, gamma: 1.07 }).px((r, g, b) => [r - 1, g, b + 3]); // a whisper of cool
      matte({ lift: 0.5 })(fx);
      return fx.vignette(0.12, { softness: 0.7, color: SURFACE });
    },
    night: (fx) => {
      fx.adjust({ saturation: 0.92, contrast: 0.93, gamma: 1.16, brightness: 0.01 });
      matte({ lift: 0.35 })(fx);
      return fx.vignette(0.08, { softness: 0.7, color: SURFACE });
    },
    scene: (fx) => {
      fx.adjust({ saturation: 0.95, contrast: 0.95, gamma: 1.06 });
      matte({ lift: 0.45 })(fx);
      return fx.vignette(0.1, { softness: 0.7, color: SURFACE });
    },
  },
  pick: (ctx) => {
    if (ctx.tags?.includes('night')) return 'night';
    if (['scenery', 'food', 'pets'].includes(ctx.category)) return 'scene';
    return 'default';
  },
};
