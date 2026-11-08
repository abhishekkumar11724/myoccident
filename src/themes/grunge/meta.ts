import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'grunge',
  palette: { bg: '#1c1a17', fg: '#ebe5d3', accent: '#b3321e', accent2: '#d9d2bd' },
  fonts: ['Anton', 'Special Elite', 'Permanent Marker', 'Courier Prime 400/700', 'Abril Fatface'],
  about: {
    origin:
      "Grunge design is what DIY looks like when it is chosen on purpose. It grew out of punk zines (photocopied, cut and pasted, from 1976), Seattle's Sub Pop scene and its gig posters (Art Chantry worked with an X-Acto knife and a Xerox machine), and the Mac-era typographic experiments of Emigre, Neville Brody and David Carson's Ray Gun (1992-95). Cheap ink, torn paper, tape, toner noise and hand-lettered scrawl were the material; a refusal of polish was the argument.",
    traits: [
      'Layouts pasted up from paper scraps at slightly wrong angles, held with tape and staples',
      'Photocopy degradation: crushed blacks, toner speckle, halftone dots, black copier-lid edges',
      'Ransom-note type: heavy grotesque, typewriter, marker and newspaper serif mixed in one word',
      'Hand marks: marker circles, arrows, underlines and rubber stamps',
      'Dirty black and newsprint with a single blood-red accent',
      'Ephemera as interface: label-maker strips, ticket stubs, cassette labels, tear-off tabs',
    ],
    inThisSite:
      'The page is a wall with a zine pasted on it. Every block of text sits on its own solid paper scrap (dark ink on light stock) so the facts stay readable; only the headings are distressed, and they remain real text. Photos are photocopied at build time (stipple for people, newsprint halftone for scenery, a black-and-red two-colour print for the hero portraits) and show their original colour through a spot under your pointer, or on tap. Nothing moves except a small jitter when you hover or focus, and that is switched off for reduced-motion.',
    furtherReading: [
      { label: 'Ray Gun magazine (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Ray_Gun_(magazine)' },
      { label: 'Emigre magazine (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Emigre_(magazine)' },
      { label: 'Template Gothic, Barry Deck (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Template_Gothic' },
      { label: 'Art Chantry (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Art_Chantry' },
      { label: 'Zine (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Zine' },
    ],
  },
  flavor: {
    kicker: 'Issue No. 1 - xeroxed in Gurugram - free, take one',
    tagline: 'Cut, pasted and photocopied. The facts are still the facts.',
    footer: 'Photocopied, stapled and left on the wall. Copy it, do not steal it.',
  },
  credits: [
    { name: 'Anton (400)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Anton', note: 'Vernon Adams; display headings; latin subset via fontsource' },
    { name: 'Special Elite (400)', kind: 'font', license: 'Apache 2.0', url: 'https://fonts.google.com/specimen/Special+Elite', note: 'Astigmatic; distressed typewriter labels; latin subset via fontsource' },
    { name: 'Permanent Marker (400)', kind: 'font', license: 'Apache 2.0', url: 'https://fonts.google.com/specimen/Permanent+Marker', note: 'Font Diner; marker scrawl; latin subset via fontsource' },
    { name: 'Courier Prime (400, 700)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/quoteunquoteapps/CourierPrime', note: 'Quote-Unquote Apps; body text; latin subset via fontsource' },
    { name: 'Abril Fatface (400)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Abril+Fatface', note: 'TypeTogether; newspaper-headline serif; latin subset via fontsource' },
    { name: 'Paper, tape, wall, tear, stamp and marker textures', kind: 'texture', license: 'Original work (inline SVG / CSS)', note: 'Procedural SVG feTurbulence tiles, CSS gradients and seeded clip-path polygons written for this site' },
    { name: 'Photocopy photo treatment (recipe.mjs)', kind: 'code', license: 'Original work (MIT, with the repo)', note: 'Stipple, halftone, two-colour print, toner dirt and copier edges on the shared Fx toolkit' },
  ],
};
export default meta;
