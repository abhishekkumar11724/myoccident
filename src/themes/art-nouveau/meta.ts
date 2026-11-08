import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'art-nouveau',
  palette: { bg: '#f4edd8', fg: '#2a1f17', accent: '#b8872a', accent2: '#2d3f33' },
  fonts: ['Macondo Swash Caps', 'Federo', 'Sorts Mill Goudy'],
  about: {
    origin:
      'Art Nouveau ("new art", c. 1890-1910) was the Belle Epoque movement that tried to unite architecture, glass, jewellery, posters and books into one decorative whole. Its signature is the whiplash line, an S-curve borrowed from plant stems, wrapped around flat colour and fine outlines. Alphonse Mucha\'s Gismonda poster (1894-95), Hector Guimard\'s Paris Metro entrances (1900), Victor Horta\'s Hotel Tassel (1892-93), Aubrey Beardsley\'s drawings, Klimt and the Vienna Secession (1897), Tiffany\'s glass and Otto Eckmann\'s Jugend covers all grew out of Japanese prints, Arts and Crafts and a fascination with natural form.',
    traits: [
      'Whiplash curves and S-shaped stems; no line stays straight for long',
      'Stylised botanical motifs: iris, lily, ginkgo, vines, peacock feathers, dragonflies',
      'Arches, ogee windows and tall narrow panels, with a halo or roundel behind the focal point',
      'Flat decorative colour with a fine dark outline, muted earthy palette and gilding on cream paper',
      'Hand-drawn lettering designed together with the picture, and ornamental borders around everything',
    ],
    inThisSite:
      'The page is a bound folio of botanical plates on a sage-green cloth cover, with gilt vines that grow up the gutters as you scroll. Sections are numbered Plates I-VIII (the real section names stay as headings): experience is a plant stem with the education at its roots, case studies are tall arched panels, projects are herbarium sheets with specimen labels, skills are a glasshouse, and photos hang in arch, oval and circle frames. Every photograph is re-pulled as a soft colour lithograph: muted, smoothed into flat fields, split-toned to aubergine, olive and cream-gold, with a fine brown outline and paper grain.',
    furtherReading: [
      { label: 'Art Nouveau (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Art_Nouveau' },
      { label: 'Alphonse Mucha (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Alphonse_Mucha' },
      { label: 'Hector Guimard and the Paris Metro (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Hector_Guimard' },
      { label: 'Eugene Grasset (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Eug%C3%A8ne_Grasset' },
    ],
  },
  flavor: {
    kicker: 'A portfolio pressed between plates',
    tagline: 'Drawn from life, grown one vine at a time.',
    footer: 'Pressed, gilded and bound by hand.',
  },
  credits: [
    { name: 'Macondo Swash Caps (Regular, Latin subset)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Macondo+Swash+Caps', note: 'Display headings; self-hosted woff2 from fontsource' },
    { name: 'Federo (Regular, Latin subset)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Federo', note: 'Labels, navigation, numerals' },
    { name: 'Sorts Mill Goudy (Regular + Italic, Latin subset)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Sorts+Mill+Goudy', note: 'Body text' },
    { name: 'Leaves, iris, ginkgo, dragonfly, peacock feather, fern, berry sprig, corner spandrels, dividers, roundel, vines', kind: 'svg', license: 'Original (hand-written SVG)', note: 'Drawn for this site; inspired by the botanical ornament of Grasset, Mucha and Horta' },
    { name: 'Paper and cloth textures', kind: 'texture', license: 'Original (procedural SVG noise)', note: 'feTurbulence tiles, no image files' },
    { name: 'Photo recipe: muted lithograph, split-tone, brown contour, paper grain', kind: 'code', license: 'Original', note: 'recipe.mjs using the shared fx toolkit (sharp)' },
    { name: 'Mucha, Grasset, Guimard, Beardsley, Klimt, Tiffany (works and period)', kind: 'reference', license: 'Public domain / studied only', note: 'Studied for composition, colour and ornament; no scans or traced artwork are used' },
  ],
};
export default meta;
