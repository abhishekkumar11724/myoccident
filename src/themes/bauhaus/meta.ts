import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'bauhaus',
  palette: { bg: '#F1EBDD', fg: '#141414', accent: '#D8281C', accent2: '#1D4E9E' },
  fonts: ['Jost (variable, weight 100-900)'],
  about: {
    origin:
      "The Staatliches Bauhaus was founded by Walter Gropius in Weimar on 1 April 1919, moved to Dessau in 1925 (its famous building opened in 1926) and, under Mies van der Rohe, to a disused Berlin factory in 1932 before the Nazis forced it to close in 1933. Its teachers - Kandinsky, Klee, Schlemmer, Albers, Moholy-Nagy, Herbert Bayer, Joost Schmidt - set out to unite art, craft and industry: form follows function, no ornament, design for the machine age. Bayer's lowercase 'universal' alphabet (1925), Moholy-Nagy's photomontage and Tschichold's 'New Typography' (1928) turned that idea into posters and books that still define modern graphic design.",
    traits: [
      'Circle, triangle and square, tied by Kandinsky to blue, yellow and red',
      'Asymmetric, dynamic composition on a strict grid; diagonals and rotated type',
      'Black and warm off-white paper, with flat primary colours and overprints',
      'Lowercase geometric sans (Bayer, Futura) with extreme contrast of size and weight',
      'Photomontage and two-ink halftone printing; thick bars and rules instead of ornament',
    ],
    inThisSite:
      "The site is an exhibition poster you can scroll. A numbered contents list (01-08) is the navigation and swaps a featured shape-composition as you hover; the case studies reuse the idea as a master/detail work list. Photos are reproduced like a 1920s Bauhaus book: black halftone plus one spot colour (red for portraits, blue for hills, yellow for the rest), cropped into circles, arches and triangles. All type is Jost, in lowercase for display and normal case for the facts.",
    furtherReading: [
      { label: 'Bauhaus (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Bauhaus' },
      { label: 'Herbert Bayer (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Herbert_Bayer' },
      { label: 'Joost Schmidt (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Joost_Schmidt' },
      { label: 'Bauhaus typeface lineage (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Bauhaus_(typeface)' },
      { label: 'Bauhaus Dessau Foundation', url: 'https://www.bauhaus-dessau.de/en/' },
    ],
  },
  flavor: {
    kicker: 'form follows function.',
    tagline: 'Eight rooms. Pick one.',
    footer: 'Set in Jost, printed in two inks. Form follows function.',
  },
  credits: [
    { name: 'Jost (variable, wght 100-900)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/indestructible-type/Jost', note: 'Owen Earl / indestructible type*; latin subset via fontsource (@fontsource-variable/jost)' },
    { name: 'Shapes, bars, preview compositions, paper grain', kind: 'svg', license: 'Original work (CSS + inline SVG)', note: 'No third-party image assets' },
    { name: 'Photo treatment "two-ink print"', kind: 'code', license: 'Original work', note: 'recipe.mjs: rotated round-dot halftone plates composed by multiply, using the shared sharp-based fx toolkit' },
  ],
};
export default meta;
