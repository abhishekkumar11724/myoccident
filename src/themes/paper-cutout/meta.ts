import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'paper-cutout',
  palette: { bg: '#fff5dc', fg: '#1c1b33', accent: '#e5412a', accent2: '#1f45c8' },
  fonts: ['Chewy', 'Nunito', 'Patrick Hand'],
  about: {
    origin:
      'Paper cutout is the look of images made by cutting coloured paper with scissors and gluing the pieces down in layers. Papercutting goes back to China around the 4th-6th century; in the 1920s Lotte Reiniger cut the silhouettes of the first surviving animated feature; and from 1943, bedridden after surgery, Henri Matisse began "drawing with scissors" - cutting gouache-painted sheets into the algae, stars and dancers of Jazz and The Snail. Eric Carle, Terry Gilliam and South Park carried the flat, homemade, layered look into picture books and television, and Material Design later borrowed the idea of paper surfaces casting shadows.',
    traits: [
      'Flat, saturated gouache colours with no outlines - the cut edge is the line',
      'Hand-cut, slightly wobbly organic shapes: leaves, clouds, hills and blobs rather than perfect geometry',
      'Depth from stacking: sheets overlap and cast short, soft contact shadows',
      'Visible paper fibre, deckle and torn edges, scalloped and pinking-shear borders, tape and glued-on scraps',
      'Everything is a little off-axis: pieces sit at small angles and nothing is perfectly aligned',
    ],
    inThisSite:
      'The page is a stack of coloured sheets, each with its own cut top edge. The hero is a paper diorama whose sun, clouds and hills slide at different speeds as you scroll, and the name is spelled in letter tiles. Navigation is bookmark tabs, experience is a pile of file folders, projects hang on luggage tags, skills are torn chips, and the Beyond-code section is a scrapbook you can rearrange. Every photograph is re-cut at build time into layered colour sheets with contact shadows, then framed with a scalloped white border.',
    furtherReading: [
      { label: 'Henri Matisse, the cut-outs (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Henri_Matisse' },
      { label: 'Lotte Reiniger and silhouette animation (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Lotte_Reiniger' },
      { label: 'Eric Carle and tissue-paper collage (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Eric_Carle' },
      { label: 'Papercutting traditions (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Papercutting' },
    ],
  },
  flavor: {
    kicker: 'Cut, folded and glued by hand',
    tagline: 'Every section is a fresh sheet of paper.',
    footer: 'No scissors were harmed. A few fingers were glued together.',
  },
  credits: [
    { name: 'Chewy (Regular, latin)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Chewy', note: 'Display: name, headings, card titles. Self-hosted via Fontsource' },
    { name: 'Nunito (400, 700; latin)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Nunito', note: 'Body text. Self-hosted via Fontsource' },
    { name: 'Patrick Hand (Regular, latin)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Patrick+Hand', note: 'Hand-written captions and notes. Self-hosted via Fontsource' },
    { name: 'Paper fibre tile (paper.png)', kind: 'texture', license: 'Original (procedurally generated)', note: 'Tileable value-noise mottling and random fibres rendered with a custom script' },
    { name: 'Sun, clouds, hills, cut edges, leaves, bunting', kind: 'svg', license: 'Original (generated and hand-written SVG)', note: 'Drawn for this site; leaf shapes echo Matisse\'s algae cut-outs without copying any artwork' },
    { name: 'Photo recipe: k-means paper sheets, stacked contact shadows', kind: 'code', license: 'Original', note: 'recipe.mjs using the shared fx toolkit (sharp)' },
    { name: 'Matisse, Reiniger, Carle, Gilliam (references)', kind: 'reference', license: 'Studied for approach only', note: 'No scans, copied code or copy-text are used' },
  ],
};
export default meta;
