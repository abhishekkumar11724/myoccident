/**
 * 3D Inflated photo treatment: "pastel lift".
 * The inflation itself (pillow frames, balloon shapes, glossy overlays) is CSS; the photos stay natural, only graded so they
 * sit inside a candy-plastic world:
 *   1. gentle saturation + gamma lift (airy, never muddy)
 *   2. lifted blacks: shadows float on a soft violet floor instead of pure black (like light through coloured plastic)
 *   3. highlight roll-off so there is no clipped glare under the glossy frame overlay
 *   4. bloom: a blurred copy of the bright areas screened back at low strength (dreamy "subsurface glow")
 *   5. a faint bubblegum (top-left) to baby-blue (bottom-right) soft-light grade, matching the page's light direction
 * Variants: default, night (gentler lift so dark scenes do not go milky), scene (a bit more colour for landscapes/food/pets).
 */

const clamp = (v, a = 0, b = 255) => (v < a ? a : v > b ? b : v);
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a || 1e-9), 0, 1); return t * t * (3 - 2 * t); };
const luma = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/** lift blacks toward `floor` (weighted to the darkest tones) and roll highlights off above `knee`. */
const liftBlacks = ({ floor = [58, 46, 98], amount = 0.5, knee = 238, roll = 0.55 } = {}) => (fx) =>
  fx.px((r, g, b) => {
    const l = luma(r, g, b);
    const k = Math.pow(1 - l, 2.2) * amount;
    const o = [r, g, b].map((v, i) => {
      let x = v + (floor[i] - v) * k;
      if (x > knee) x = knee + (x - knee) * roll;
      return x;
    });
    return o;
  });

/** screen a blurred copy of the highlights back over the image. */
const bloom = ({ sigma = 14, strength = 0.28, from = 0.5 } = {}) => (fx) =>
  fx.custom(async (f) => {
    const c = f.clone();
    c.blur(sigma);
    await c.run();
    const d = f.data, b = c.data;
    for (let i = 0; i < d.length; i += 4) {
      const l = luma(b[i], b[i + 1], b[i + 2]);
      const k = sstep(from, 1, l) * strength;
      for (let j = 0; j < 3; j++) {
        const add = b[i + j] * k;
        d[i + j] = 255 - ((255 - d[i + j]) * (255 - add)) / 255;
      }
    }
  });

const candyGrade = (opacity = 0.2) => (fx) =>
  fx.gradientOverlay(35, [[0, '#ff9ccd'], [0.45, '#fff1fa'], [1, '#8fd3ff']], { mode: 'softlight', opacity });

export default {
  maxSize: 1400,
  thumb: 520,
  quality: 80,
  format: 'webp',
  treatments: {
    default: (fx) => {
      fx.adjust({ saturation: 1.07, contrast: 0.96, gamma: 1.1 });
      liftBlacks({ amount: 0.5 })(fx);
      bloom({ strength: 0.26 })(fx);
      candyGrade(0.22)(fx);
      return fx;
    },
    night: (fx) => {
      fx.adjust({ saturation: 1.05, contrast: 0.95, gamma: 1.2, brightness: 0.01 });
      liftBlacks({ amount: 0.36, floor: [52, 44, 96] })(fx);
      bloom({ strength: 0.3, from: 0.4 })(fx);
      candyGrade(0.16)(fx);
      return fx;
    },
    scene: (fx) => {
      fx.adjust({ saturation: 1.12, contrast: 0.96, gamma: 1.08 });
      liftBlacks({ amount: 0.44 })(fx);
      bloom({ strength: 0.24 })(fx);
      candyGrade(0.2)(fx);
      return fx;
    },
  },
  pick: (ctx) => {
    if (ctx.tags?.includes('night')) return 'night';
    if (['scenery', 'food', 'pets'].includes(ctx.category)) return 'scene';
    return 'default';
  },
};
