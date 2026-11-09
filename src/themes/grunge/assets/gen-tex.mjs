/**
 * Generator for assets/tex.css (procedural textures + torn-edge polygons). Not bundled; run by hand:
 *   node src/themes/grunge/assets/gen-tex.mjs > src/themes/grunge/assets/tex.css
 * Everything is original: SVG feTurbulence tiles, hand-written marker paths and seeded clip-path polygons.
 */
const enc = (svg) => 'url("data:image/svg+xml,' + encodeURIComponent(svg.replace(/\s+/g, ' ').trim()).replace(/'/g, '%27') + '")';

// ---- seeded rng
function mulberry(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ---- noise tiles
const noise = ({ w = 300, h = 300, freq, oct = 2, seed = 1, matrix, post = '' }) => enc(`
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
 <filter id="f" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${oct}" seed="${seed}" stitchTiles="stitch"/>
  <feColorMatrix values="${matrix}"/>${post}
 </filter>
 <rect width="100%" height="100%" filter="url(#f)"/>
</svg>`);

const tex = {
  // warm paper fibres (subtle) + faint blotches
  'tx-paper': noise({ w: 360, h: 360, freq: '.11 .15', oct: 4, seed: 3, matrix: '0 0 0 0 .34  0 0 0 0 .26  0 0 0 0 .15  0 0 0 .5 -.2' }),
  // fine grain, light and dark
  'tx-grain-l': noise({ w: 220, h: 220, freq: '.9', oct: 2, seed: 5, matrix: '0 0 0 0 1  0 0 0 0 .97  0 0 0 0 .9  0 0 0 .55 -.2' }),
  'tx-grain-d': noise({ w: 220, h: 220, freq: '.85', oct: 2, seed: 8, matrix: '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .8 -.28' }),
  // toner flecks (sparse dark specks)
  'tx-speck': noise({ w: 280, h: 280, freq: '.5', oct: 1, seed: 11, matrix: '0 0 0 0 .16  0 0 0 0 .14  0 0 0 0 .1  0 0 0 8 -5.9' }),
  // big dark damp patches on the wall (soft), vertical water streaks, fine plaster mottling
  'tx-stain': noise({ w: 800, h: 800, freq: '.0032 .0045', oct: 3, seed: 21, matrix: '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.1 -.42' }),
  'tx-streak': noise({ w: 600, h: 900, freq: '.014 .0016', oct: 3, seed: 9, matrix: '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.2 -.5' }),
  'tx-plaster': noise({ w: 420, h: 420, freq: '.07 .09', oct: 3, seed: 4, matrix: '0 0 0 0 .8  0 0 0 0 .76  0 0 0 0 .66  0 0 0 .55 -.22' }),
  // worn-ink masks: opaque with holes (alpha-mask). soft = just a few chips (stamps), normal = headings
  'tx-erode': noise({ w: 240, h: 240, freq: '.5', oct: 2, seed: 17, matrix: '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -10 7.5' }),
  'tx-erode-soft': noise({ w: 240, h: 240, freq: '.42', oct: 2, seed: 31, matrix: '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -10 8.3' }),
};

// ---- marker marks (stroke stays 3px however the box stretches)
const mark = (inner, vb = '0 0 200 80') => enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="none">${inner}</svg>`);
const stroke = (d, c = '#b3321e', w = 3.2) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
const marks = {
  'mk-circle-a': mark(stroke('M18 44 C 10 20, 60 6, 108 8 C 158 10, 192 26, 186 46 C 180 66, 120 74, 74 72 C 30 70, 6 56, 14 34 C 18 22, 34 14, 56 10')),
  'mk-circle-b': mark(stroke('M178 30 C 174 10, 120 4, 80 6 C 34 9, 8 28, 14 48 C 20 68, 80 76, 126 72 C 176 68, 197 46, 186 24 C 182 16, 170 10, 148 8')),
  'mk-under': mark(stroke('M4 62 C 40 54, 70 68, 104 60 S 170 66, 196 56') + stroke('M14 74 C 60 68, 120 76, 188 68', '#b3321e', 2.4)),
  'mk-box': mark(stroke('M5 10 L196 5 L194 72 L7 75 L6 3')),
  'mk-hl': mark('<path d="M2 14 L197 8 L199 66 L4 72 Z" fill="#e7d77a" opacity=".8"/>'),
  'mk-ink-under': mark(stroke('M4 64 C 40 56, 70 70, 104 62 S 170 68, 196 58', '#17140f', 3)),
  'mk-x': mark(stroke('M10 8 L190 72 M190 8 L10 72', '#17140f', 3)),
};

// ---- torn edges
function tear(seed, edges, { amp = 6, nx = 26, ny = 16, bite = 0.12 } = {}) {
  const r = mulberry(seed);
  const jit = (on) => {
    if (!on) return 0;
    let j = r() * amp;
    if (r() < bite) j += amp * (0.8 + r() * 1.8); // an occasional bite
    return +j.toFixed(1);
  };
  const pts = [];
  const T = edges.includes('t'), R = edges.includes('r'), B = edges.includes('b'), L = edges.includes('l');
  for (let i = 0; i <= nx; i++) pts.push(`${(i / nx * 100).toFixed(1)}% ${jit(T)}px`);
  for (let i = 1; i < ny; i++) pts.push(`calc(100% - ${jit(R)}px) ${(i / ny * 100).toFixed(1)}%`);
  for (let i = nx; i >= 0; i--) pts.push(`${(i / nx * 100).toFixed(1)}% calc(100% - ${jit(B)}px)`);
  for (let i = ny - 1; i >= 1; i--) pts.push(`${jit(L)}px ${(i / ny * 100).toFixed(1)}%`);
  return `polygon(${pts.join(', ')})`;
}
const variants = { a: 'trbl', b: 'tb', c: 'b', d: 't', e: 'lr', f: 'rb', g: 'tl' };
const tears = {};
let seed = 100;
for (const [k, edges] of Object.entries(variants)) {
  tears[`tear-${k}`] = tear(seed += 7, edges, { amp: 6 });
  tears[`tear-${k}2`] = tear(seed += 7, edges, { amp: 9, nx: 18, ny: 11, bite: 0.2 });
}

let css = '/* GENERATED by assets/gen-tex.mjs - procedural textures and torn-edge polygons. Do not edit by hand. */\n:root {\n';
for (const [k, v] of Object.entries({ ...tex, ...marks })) css += `  --${k}: ${v};\n`;
for (const [k, v] of Object.entries(tears)) css += `  --${k}: ${v};\n`;
css += '}\n';
process.stdout.write(css);
