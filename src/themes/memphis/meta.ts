import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'memphis',
  palette: { bg: '#fffaf0', fg: '#14110f', accent: '#ff4fa3', accent2: '#19d3c5' },
  fonts: ['Bagel Fat One', 'Lilita One', 'Rubik'],
  about: {
    origin:
      'Memphis (Memphis Milano) was founded in Milan in December 1980 by Ettore Sottsass and a circle of young designers, named after a Bob Dylan song that was playing at their first meeting. Their first collection in 1981 broke with grey, tasteful Modernism: furniture and lamps built from stacked triangles, half-circles and cylinders, covered in squiggle and terrazzo-speckled plastic laminate, in clashing pastel and primary colours. Critics called it a shotgun wedding between Bauhaus and Fisher-Price; by the mid-1980s its look was everywhere, from sitcom sets and sneaker boxes to shopping malls.',
    traits: [
      'Primitive shapes (triangle, half-circle, circle, arch) stacked, tilted and deliberately off-balance',
      'Surface pattern as a character: squiggles, zigzags, polka dots, checks, stripes and speckled terrazzo',
      'Clashing pastels and saturated primaries (pink, turquoise, lemon, lilac) held together by thick black outlines',
      'Plastic laminate and terrazzo: glossy, flat, cheap-and-cheerful surfaces sold as luxury',
      'Humour first: "form follows fun", asymmetry and patterns on patterns',
    ],
    inThisSite:
      'The page is a Milan showroom of laminate furniture. A terrazzo hero, a zigzag nav ribbon, experience as stacked folder tabs, skills as laminate swatches, stats as geometric badges and photos as stickers on a sheet. Every photograph is re-printed at build time as a Ben-Day dot screen in a clashing colour pair with a black key line. The email button copies the address and also opens a pre-filled mail.',
    furtherReading: [
      { label: 'Memphis Group (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Memphis_Group' },
      { label: 'Ettore Sottsass (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Ettore_Sottsass' },
      { label: 'Nathalie Du Pasquier (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Nathalie_Du_Pasquier' },
    ],
  },
  flavor: {
    kicker: 'Form follows fun',
    tagline: 'Loud on purpose. Organised on purpose, too.',
    footer: 'Made with triangles, squiggles and far too many colours.',
  },
  credits: [
    { name: 'Bagel Fat One (Regular, latin)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fontsource.org/fonts/bagel-fat-one', note: 'Display headings, via Fontsource' },
    { name: 'Lilita One (Regular, latin)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fontsource.org/fonts/lilita-one', note: 'Labels, buttons and stickers, via Fontsource' },
    { name: 'Rubik (Regular, Bold; latin)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fontsource.org/fonts/rubik', note: 'Body text, via Fontsource' },
    { name: 'Terrazzo, squiggle, zigzag, triangle and confetti tiles', kind: 'texture', license: 'Original (procedurally generated SVG)', note: 'Seeded script, drawn for this site' },
    { name: 'Geometric shapes, badges, stickers and ornaments', kind: 'svg', license: 'Original (hand-written SVG / CSS)', note: 'Inspired by Memphis vocabulary; no Memphis Milano artwork reproduced' },
    { name: 'Photo recipe: auto-levels, 4-band posterise, 45-degree Ben-Day screen, key-line', kind: 'code', license: 'Original', note: 'recipe.mjs using the shared fx toolkit (sharp)' },
    { name: 'Memphis Group, Sottsass, Du Pasquier, Shire, Bedin, De Lucchi', kind: 'reference', license: 'Studied for shape, pattern and colour only', note: 'No images or patterns reused' },
  ],
};
export default meta;
