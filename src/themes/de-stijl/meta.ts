import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'de-stijl',
  palette: { bg: '#F6F5EE', fg: '#111111', accent: '#D3281D', accent2: '#1C3F94' },
  fonts: ['Archivo (variable, weight 100-900, width 62-125)', 'Hand-built block lettering (SVG)'],
  about: {
    origin:
      "De Stijl (\"The Style\") was a Dutch avant-garde group and journal, founded in Leiden in 1917 by Theo van Doesburg with Piet Mondrian, Bart van der Leck, Vilmos Huszar, J.J.P. Oud and, from 1919, Gerrit Rietveld. Mondrian's Neoplasticism allowed only straight horizontal and vertical lines, rectangles, the three primaries plus black, white and grey, balanced asymmetrically. Rietveld carried it into furniture (the Red and Blue Chair) and architecture (the Schroder House, Utrecht, 1924). The group split in 1924 when Van Doesburg introduced the diagonal; Mondrian left, and the journal ended with Van Doesburg's death in 1931.",
    traits: [
      'Only horizontal and vertical black lines, only rectangles: no curves, no diagonals',
      'Flat red, yellow and blue planes used sparingly against mostly white fields, plus grey and black',
      'Asymmetric balance: one large plane offset by small ones, never centred or mirrored',
      'Square-raster lettering (Van Doesburg, 1919) and plain grotesque capitals',
      'Rietveld: planes and rods that overlap and slide past each other without merging',
    ],
    inThisSite:
      "The page itself is a Mondrian grid: a black ground with an 8px gap, so every cell is a flat plane and the gaps are the lines. Each section is a different asymmetric composition on the same 12 columns. The name and headings are block lettering built from a 5-row raster of squares; case studies are coloured tiles that open a white detail field; the project index carries generated Mondrian thumbnails; and every photo is reduced to six values (black, white, grey, red, yellow, blue) and laid into a mosaic with no holes.",
    furtherReading: [
      { label: 'De Stijl (Wikipedia)', url: 'https://en.wikipedia.org/wiki/De_Stijl' },
      { label: 'Neoplasticism (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Neoplasticism' },
      { label: 'Composition with Red, Blue and Yellow, 1930 (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Composition_with_Red_Blue_and_Yellow' },
      { label: 'Rietveld Schroder House (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Rietveld_Schr%C3%B6der_House' },
      { label: 'Red and Blue Chair (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Red_and_Blue_Chair' },
      { label: 'Architype Van Doesburg (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Architype_Van_Doesburg' },
    ],
  },
  flavor: {
    kicker: 'Horizontal. Vertical. Primary.',
    tagline: 'Eight sections, one grid.',
    footer: 'Built from rectangles only. No diagonals were harmed.',
  },
  credits: [
    { name: 'Archivo (variable, wght 100-900, wdth 62-125)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/Omnibus-Type/Archivo', note: 'Omnibus-Type; latin subset via fontsource (archivo:vf)' },
    { name: 'Block lettering (A-Z, 0-9) and generated Mondrian thumbnails', kind: 'svg', license: 'Original work (generated in blocks.ts)', note: 'Inspired by the idea of Van Doesburg\'s 1919 square-raster alphabet; no glyph is copied' },
    { name: 'Photo treatment "neoplastic print"', kind: 'code', license: 'Original work', note: 'recipe.mjs: local exposure, Kuwahara, six-value palette classification, majority filter and contour lines on the shared sharp-based fx toolkit' },
  ],
};
export default meta;
