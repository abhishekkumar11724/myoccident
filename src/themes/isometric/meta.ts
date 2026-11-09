import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'isometric',
  palette: { bg: '#eef3fb', fg: '#14203f', accent: '#4f7cff', accent2: '#ffb547' },
  fonts: ['Sora (variable)', 'Manrope (variable)', 'Pixelify Sans (variable)'],
  about: {
    origin:
      "Isometric projection is a way of drawing three-dimensional objects with all three axes 120 degrees apart and no vanishing point, so every edge keeps its true scale. William Farish of Cambridge wrote down its rules in 1822 for engineers; De Stijl and Bauhaus architects used it in the 1920s, and Escher's staircases (1953) showed how its missing depth cue can be bent into impossible buildings. Arcade games brought it to screens (Zaxxon and Q*bert in 1982, Knight Lore in 1984, SimCity 2000 in 1993), pixel studio eBoy turned it into dense toy cities, Habbo Hotel into furnishable rooms, and Monument Valley (2014) into a modern classic. Today it is the go-to look for tidy, friendly, flat-shaded dioramas on tech landing pages.",
    traits: [
      'True 30-degree edges and 120-degree axes: no perspective, nothing shrinks with distance',
      'Every solid shows three flat faces: a light top, a mid left side and a dark right side, with one fixed light from the upper left',
      'Tiny worlds: rooms, floating islands, stairs, conveyors, servers and characters built from cubes',
      'A limited palette where each hue is a three-shade ramp, plus hard flat contact shadows instead of glows',
      'Everything sits on a rhombus grid and is drawn back to front (the painter\'s algorithm)',
      'Pixel-art cousin: the 2:1 "dimetric" line used by old games and by eBoy, here kept for tiny labels',
    ],
    inThisSite:
      "The page is a tower of levels. Every diorama is generated at build time by a small projection helper (cubes, cylinders, stairs and wall decals sorted back to front), so it stays crisp and tiny. The hero is an isometric workstation with the portrait hung on its wall, experience is a building you climb floor by floor, each case study carries a miniature machine that switches on when you hover it, and photos stand in folding screens skewed to exactly 30 degrees. Text always lives on flat, un-skewed panels, and every animation is transform-only, paused off-screen and switched off for reduced motion.",
    furtherReading: [
      { label: 'Isometric projection (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Isometric_projection' },
      { label: 'Isometric video game graphics (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Isometric_video_game_graphics' },
      { label: 'Isometric projection in games (Pikuma)', url: 'https://www.pikuma.com/blog/isometric-projection-in-games' },
      { label: 'eBoy (Wikipedia)', url: 'https://en.wikipedia.org/wiki/EBoy' },
    ],
  },
  flavor: {
    kicker: 'Thirty degrees of separation from the ordinary.',
    tagline: 'Tiny worlds, true to scale.',
    footer: 'Built one block at a time, lit from the upper left.',
  },
  credits: [
    { name: 'Sora (variable, wght)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/sora-xor/sora-font', note: 'Sora Project Authors; latin subset via fontsource' },
    { name: 'Manrope (variable, wght)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/sharanda/manrope', note: 'Mikhail Sharanda; latin subset via fontsource' },
    { name: 'Pixelify Sans (variable, wght)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/eifetx/Pixelify-Sans', note: 'Stefie Justprince; latin subset via fontsource; tiny labels only' },
    { name: 'Isometric dioramas (hero room, floors, machines, galleries)', kind: 'svg', license: 'Original work', note: 'Generated at build time by a small projection + painter-sort helper (iso.ts) in this theme' },
    { name: 'Folding-screen photo planes, floor tower, extruded type', kind: 'code', license: 'Original work', note: 'CSS skewY(30deg) scaleX(.866) mapping, stacked text-shadows at 30 degrees, vanilla TypeScript client' },
    { name: 'Photo treatment "clear air"', kind: 'code', license: 'Original work', note: 'recipe.mjs using the shared sharp-based fx toolkit' },
  ],
};
export default meta;
