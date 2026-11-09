import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'anti-design',
  palette: { bg: '#f4f1e8', fg: '#0a0a0a', accent: '#1a1aff', accent2: '#ff4500' },
  fonts: ['Anton 400', 'Instrument Serif 400/italic', 'Space Mono 400/700', 'Bagel Fat One 400', 'system Times New Roman'],
  about: {
    origin:
      "Anti-design rejects the consensus of 'good design': the grid, the neutral typeface, the polite palette. Its roots are Dada's cut-and-paste and chance (Zurich, 1916), the Italian Radical-design groups such as Archizoom (Florence, 1966, 'radical anti-design'), Memphis (Milan, 1981), Tibor Kalman's vernacular provocations, David Carson's Ray Gun (1992-95) and Richard Turley's Bloomberg Businessweek covers (2011-14). On the web it re-emerged in the 2010s as a backlash against frictionless SaaS minimalism, next to brutalist and 'ugly web' design.",
    traits: [
      'Broken, overlapping grids and type bleeding off the viewport',
      'Extreme scale contrast: a giant word and a tiny word in the same sentence',
      "Typefaces that 'should not' share a page: condensed grotesque, fashion serif, mono, bubble and the system default",
      'Clashing flat colour: electric blue, safety orange, acid and ink on off-white, no gradients',
      'Default HTML on show: blue underlined links, native checkboxes, tables and directory listings',
      'Visible mistakes: arrows pointing at nothing, comically big buttons, misaligned captions',
    ],
    inThisSite:
      "The chaos is a layout system: every section breaks the grid in a different, deliberate way (and the G key shows the grid being ignored). Body copy always sits on solid fields with strong contrast, DOM order is reading order, and the B key switches on a Boring mode that removes every tilt and overlap. Photos are treated 'wrongly' on purpose: blue and orange duotones, swapped channels, big halftone, sliced strips, outlines. Tickers pause on hover, focus and with the M key, and stop completely with reduced motion.",
    furtherReading: [
      { label: 'Anti-art and Dada (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Anti-art' },
      { label: 'Archizoom Associati and radical anti-design (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Archizoom_Associati' },
      { label: 'Ray Gun magazine (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Ray_Gun_(magazine)' },
      { label: 'Richard Turley at Bloomberg Businessweek (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Richard_Turley_(graphic_designer)' },
      { label: 'Brutalist Websites (curated gallery)', url: 'https://brutalistwebsites.com/' },
    ],
  },
  flavor: {
    kicker: 'Hello. Several things on this page are wrong on purpose.',
    tagline: 'Everything is where it should not be. Nothing is lost.',
    footer: 'No grids were respected in the making of this website.',
  },
  credits: [
    { name: 'Anton (400)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Anton', note: 'Vernon Adams; wordmark, headings, stickers; latin subset via fontsource' },
    { name: 'Instrument Serif (400, italic)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/Instrument/instrument-serif', note: 'Instrument; body copy and oversized italics; latin subset via fontsource' },
    { name: 'Space Mono (400, 700)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/googlefonts/spacemono', note: 'Colophon Foundry; labels, tickers, annotations; latin subset via fontsource' },
    { name: 'Bagel Fat One (400)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/noonnu/bagel-fat-one', note: 'JAMO; the bubble face for stickers and buttons; latin subset via fontsource' },
    { name: 'Stickers, arrows, hazard stripes, starburst, grid overlay', kind: 'svg', license: 'Original work (CSS / inline SVG)', note: 'Hand-written for this site' },
    { name: 'Anti-design photo treatment (recipe.mjs)', kind: 'code', license: 'Original work (MIT, with the repo)', note: 'Duotones, channel swap, halftone, strip slicing, outline and knock-out written against the shared Fx toolkit' },
  ],
};
export default meta;
