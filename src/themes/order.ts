/**
 * The 19 styles, listed in DAILY ROTATION ORDER (day 0 = LAUNCH_DATE).
 * The order is chosen so neighbouring days contrast in mood (never two similar styles back-to-back).
 * Only `id` / `name` / `year` / `blurb` live here; palette, fonts and the "About this style" panel live in
 * each theme's own meta.ts. A theme is "available" once src/themes/<id>/Page.astro exists.
 */
export interface ThemeInfo { id: string; name: string; era: string; blurb: string; swatch: [string, string, string] }

export const THEMES: ThemeInfo[] = [
  { id: 'brutalism',      name: 'Brutalism',      era: '1950s - now',      blurb: 'Raw concrete energy: default fonts, hard borders, honest structure.', swatch: ['#ffffff', '#111111', '#ff2d2d'] },
  { id: 'vaporwave',      name: 'Vaporwave',      era: '2010s',            blurb: 'Pastel-neon sunsets, grids, marble busts and 90s software nostalgia.', swatch: ['#ff71ce', '#01cdfe', '#b967ff'] },
  { id: 'bauhaus',        name: 'Bauhaus',        era: '1919 - 1933',      blurb: 'Circles, triangles, squares, primary colours and a strict grid.', swatch: ['#e63222', '#f4c20d', '#1f4e9c'] },
  { id: 'glitch',         name: 'Glitch',         era: '1990s - now',      blurb: 'Broken signal: RGB splits, scan lines and corrupted frames.', swatch: ['#0a0a0f', '#00ffd5', '#ff2e63'] },
  { id: 'mid-century',    name: 'Mid-century',    era: '1945 - 1969',      blurb: 'Atomic-age warmth: teak, mustard, boomerangs and clean sans-serifs.', swatch: ['#f2e3c6', '#d98324', '#1f6f6b'] },
  { id: 'psychedelic',    name: 'Psychedelic',    era: '1960s',            blurb: 'Swirling, saturated, hand-lettered, everything breathing.', swatch: ['#ff3d9a', '#ffd400', '#3a1c8f'] },
  { id: 'neumorphism',    name: 'Neumorphism',    era: '2019 - now',       blurb: 'Soft extruded UI: one surface, light and shadow doing all the work.', swatch: ['#e0e5ec', '#a3b1c6', '#6c7bff'] },
  { id: 'grunge',         name: 'Grunge',         era: '1990s',            blurb: 'Photocopied zines, torn tape, dirty textures and marker scrawl.', swatch: ['#1c1a17', '#c9c1ad', '#b3321e'] },
  { id: 'art-nouveau',    name: 'Art Nouveau',    era: '1890 - 1910',      blurb: 'Whiplash curves, botanical ornament and sinuous hand-drawn borders.', swatch: ['#f1e9d2', '#4a6b3a', '#c9892b'] },
  { id: 'memphis',        name: 'Memphis',        era: '1981 - 1988',      blurb: 'Squiggles, confetti, clashing colour and gleeful anti-minimalism.', swatch: ['#ff6fb5', '#2ad4c4', '#ffe14d'] },
  { id: 'steampunk',      name: 'Steampunk',      era: 'Victorian-futurist', blurb: 'Brass, gears, rivets and sepia: an industrial-age dream machine.', swatch: ['#2b1b10', '#b8863b', '#d9c9a3'] },
  { id: 'paper-cutout',   name: 'Paper cutout',   era: 'Matisse - now',    blurb: 'Layered hand-cut paper with torn edges and soft drop shadows.', swatch: ['#f6efe3', '#e4572e', '#2e86ab'] },
  { id: 'liquid-chrome',  name: 'Liquid chrome',  era: 'Y2K',              blurb: 'Molten metal, reflective type and a bright future on a black void.', swatch: ['#050608', '#cfd8e6', '#6aa9ff'] },
  { id: 'de-stijl',       name: 'De Stijl',       era: '1917 - 1931',      blurb: 'Mondrian grids: black lines, white fields, red, yellow and blue.', swatch: ['#f7f7f2', '#d4201a', '#1d3e92'] },
  { id: 'skeuomorphism',  name: 'Skeuomorphism',  era: '2007 - 2013',      blurb: 'Interfaces that imitate real objects: leather, glass, stitching, felt.', swatch: ['#8a5a36', '#e8d9b5', '#2d5d34'] },
  { id: 'anti-design',    name: 'Anti-design',    era: '2010s - now',      blurb: 'Deliberately off-grid: clashing type, overlaps and controlled chaos.', swatch: ['#f5f5f0', '#1a1aff', '#ff4d00'] },
  { id: 'ukiyo-e',        name: 'Ukiyo-e',        era: '1600s - 1800s',    blurb: 'Edo-period woodblock prints: indigo, flat colour and bold outlines.', swatch: ['#f1e6cf', '#1b3a5c', '#c8402f'] },
  { id: 'inflated-3d',    name: '3D Inflated',    era: '2020s',            blurb: 'Puffy, balloon-like objects with glossy highlights and soft pastel light.', swatch: ['#ffd1e8', '#8fd3ff', '#ffe66d'] },
  { id: 'isometric',      name: 'Isometric',      era: 'Technical drawing - now', blurb: 'A tilted 30-degree world built from cubes, platforms and tiny stages.', swatch: ['#eef3fb', '#4f7cff', '#ffb547'] },
];

export const THEME_IDS = THEMES.map((t) => t.id);
export const themeInfo = (id: string) => THEMES.find((t) => t.id === id);
export const LAUNCH_DATE = '2026-11-10'; // day 0 of the rotation (IST)
