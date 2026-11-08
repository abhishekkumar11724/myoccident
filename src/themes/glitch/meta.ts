import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'glitch',
  palette: { bg: '#0a0a0f', fg: '#e8ecf4', accent: '#00ffd5', accent2: '#ff2e63' },
  fonts: ['Syne 800', 'JetBrains Mono 400/700', 'VT323'],
  about: {
    origin:
      "Glitch treats a failing signal as material. Nam June Paik bent broadcast TV with magnets in the 1960s, JODI broke web pages on purpose in the 1990s, Takeshi Murata and others datamoshed compressed video in the 2000s, and in 2010 Kim Asendorf's ASDFPixelSort made pixel-sorted smears a genre. VHS tracking lines, CRT scanlines and terminal error text are its vocabulary; Rosa Menkman's Glitch Studies Manifesto is its argument against the 'perfect, noiseless' channel.",
    traits: [
      'RGB channel splitting: cyan and magenta copies of text and pictures pulling apart by a few pixels',
      'Horizontal slice displacement, like a tape that lost its tracking',
      'Scanlines, grain and CRT-style frames with on-screen-display text',
      'Block corruption and pixel-sorted drips from compression and data-bending',
      'Terminal voice: monospace labels, hex addresses, error codes and boot logs',
      'Near-black fields with acid cyan, magenta and yellow accents',
    ],
    inThisSite:
      'The failure is staged: every glitch is a short, one-off burst on headings, borders and photos (on scroll-in, hover or focus) and never on body text. Photos are pre-damaged at build time (split-tone, slice shifts, pixel sorting, scanlines) and decode to the untouched original when you hover, focus or tap them. Reduced-motion turns every animation, burst and the boot log static.',
    furtherReading: [
      { label: 'Glitch art (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Glitch_art' },
      { label: 'Glitch Studies Manifesto, Rosa Menkman', url: 'https://beyondresolution.info/Glitch-Studies-Manifesto' },
      { label: 'Datamoshing (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Datamoshing' },
      { label: 'ASDFPixelSort, Kim Asendorf', url: 'https://github.com/kimasendorf/ASDFPixelSort' },
      { label: 'WCAG 2.3.1: three flashes or below threshold', url: 'https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html' },
    ],
  },
  flavor: {
    kicker: 'SIGNAL ACQUIRED // human detected',
    tagline: 'Clean code. Corrupted frames.',
    footer: 'END OF TRANSMISSION. No pixels were harmed; a few were sorted.',
  },
  credits: [
    { name: 'Syne (ExtraBold 800)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/bonjour-monde/Syne', note: 'Bonjour Monde; display headings; latin subset via fontsource' },
    { name: 'JetBrains Mono (400, 700)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/JetBrains/JetBrainsMono', note: 'JetBrains; body and UI; latin subset via fontsource' },
    { name: 'VT323', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/phoikoi/VT323', note: 'Peter Hull; terminal numerals and OSD text; latin subset via fontsource' },
    { name: 'Noise tile, scanlines, SMPTE bars, window chrome', kind: 'svg', license: 'Original work (CSS / inline SVG)', note: 'Hand-written for this site; SMPTE bar order after the public broadcast test pattern' },
    { name: 'Glitch photo treatment (recipe.mjs)', kind: 'code', license: 'Original work (MIT, with the repo)', note: 'Split-tone, slice shift, pixel-sort and block corruption written against the shared Fx toolkit' },
  ],
};
export default meta;
