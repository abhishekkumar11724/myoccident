import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'liquid-chrome',
  palette: { bg: '#03040a', fg: '#e6edf9', accent: '#6aa9ff', accent2: '#cfd8e6' },
  fonts: ['Unbounded', 'Michroma', 'Instrument Sans'],
  about: {
    origin:
      'Liquid chrome is the mirror-metal wing of Y2K futurism. Its ancestors are reflection mapping (Blinn and Newell, 1976), which fakes a shiny surface by looking its reflection up in a picture of the sky and ground, and the T-1000 of Terminator 2 (ILM, 1991), whose liquid-metal body made "chrome" a cultural image. In the 1990s The Designers Republic and Warp Records covered the same ground in wide, glossy, slogan-heavy graphics, the 1998 iMac popularised "blobject" shapes, and in the 2020s chrome lettering came back in streetwear, posters and album art.',
    traits: [
      'A near-black blue void with a few extremely bright, mirror-finish forms',
      'The horizon line: bright sky above, hard cut, dark ground with a bounce of light below',
      'Chrome lettering: heavy extended type, thin bright outline, bevel highlights and a soft blue glow',
      'Metaball blobs that merge and drip like liquid mercury, with thin-film (oil-slick) iridescence on the edges',
      'Four-point sparkles, anamorphic lens-flare streaks and cyber-sigil ornaments',
      'Glass-metal UI: pills, bevelled buttons, 1px edge lights and wide Eurostile-style labels',
    ],
    inThisSite:
      'The hero is a live WebGL mercury blob reflecting a procedural sky and horizon, under a giant chrome name. Experience sits on brushed-metal plates along a liquid-metal spine, case studies are an oversized name-only index whose hover unfolds a glass preview plate, projects are iridescent CD-ROMs, and every photograph is re-cut at build time into a chrome poster (gradient map, fake height field, sky/ground reflection and specular glints) set in a polished metal bezel. Buttons melt with an SVG goo filter on hover.',
    furtherReading: [
      { label: 'Reflection mapping (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Reflection_mapping' },
      { label: 'The T-1000 effects of Terminator 2 (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Special_effects_of_Terminator_2:_Judgment_Day' },
      { label: 'The Designers Republic (Wikipedia)', url: 'https://en.wikipedia.org/wiki/The_Designers_Republic' },
      { label: 'Y2K aesthetic (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Y2K_aesthetic' },
    ],
  },
  flavor: {
    kicker: 'Mirror-finish engineering',
    tagline: 'Polished on the outside. Rendered live, in your browser.',
    footer: 'Smooth surface, no seams. The blob above is a fragment shader, not a video.',
  },
  credits: [
    { name: 'Unbounded (variable, latin subset)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Unbounded', note: 'Display type; woff2 from Fontsource (fontsource.org/fonts/unbounded)' },
    { name: 'Michroma (latin)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Michroma', note: 'Labels and numbering; woff2 from Fontsource' },
    { name: 'Instrument Sans (variable, latin subset)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Instrument+Sans', note: 'Body text; woff2 from Fontsource' },
    { name: 'Mercury blob (WebGL fragment shader)', kind: 'code', license: 'Original', note: 'Metaball field, height-derived normals and a procedural sky/horizon/ground environment map, written for this site' },
    { name: 'Chrome gradients, bezels, CD discs, goo-melt buttons', kind: 'code', license: 'Original (CSS and SVG filters)', note: 'Hand-written for this site' },
    { name: 'Spark and sigil ornaments', kind: 'svg', license: 'Original (hand-written SVG)', note: 'Drawn for this site' },
    { name: 'Photo recipe: local contrast, chrome gradient map, fake height-field reflection, speculars, bloom', kind: 'code', license: 'Original', note: 'recipe.mjs using the shared fx toolkit (sharp)' },
    { name: 'Blinn and Newell reflection mapping, ILM T-1000, The Designers Republic', kind: 'reference', license: 'Studied for technique and mood only', note: 'No assets reused' },
  ],
};
export default meta;
