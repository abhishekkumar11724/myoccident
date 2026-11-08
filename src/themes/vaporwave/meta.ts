import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'vaporwave',
  palette: { bg: '#ffa6dc', fg: '#2a1457', accent: '#ff71ce', accent2: '#01cdfe' },
  fonts: ['Syncopate 700', 'DotGothic16 400', 'Quicksand 300-700', 'Instrument Serif Italic'],
  about: {
    origin:
      "Vaporwave grew out of internet music scenes around 2010-2012: Daniel Lopatin's Chuck Person's Eccojams (2010) and James Ferraro's Far Side Virtual (2011) slowed and looped dated 1980s-90s corporate pop, and Macintosh Plus's Floral Shoppe (December 2011), with its Helios bust, pink checkerboard and Japanese title, became the genre's picture. The look borrows Windows 95 chrome, mall culture, early CGI, Greco-Roman statues and outrun sunsets, and it is deliberately ambiguous: sincere nostalgia or a wink at consumer technoculture.",
    traits: [
      'Pastel gradients: hot pink, cyan, lavender, mint and peach, usually as a sunset sky',
      'Striped sun over a perspective grid or checkerboard floor, with palms and marble columns',
      'Retro-OS furniture: bevelled windows, title bars, a taskbar with a Start button, pixel icons, installers and dialogs',
      'Wide-spaced type ("A E S T H E T I C"), bitmap UI fonts and a classical serif voice',
      'Slowed-down, dreamy motion; VHS scanlines and dither used lightly',
      'Mall and lobby nostalgia: calm, a little uncanny, never frantic',
    ],
    inThisSite:
      'A fixed pastel sunset (striped sun, slowly scrolling grid, palms) sits behind opaque cream and lilac windows, so every fact is deep-purple text on a solid panel. Each section is a different program: Notepad for About, a file Explorer for Experience, app windows for case studies, boxed software for projects, a Setup Wizard for skills, My Pictures for the photos, an Inbox for writing and a mail composer for contact. The Start menu and taskbar are the navigation. In the tray you can flip the scene to midnight or pause the background animation; photos get a dreamy pink/cyan gradient map, and the viewer can show them in real colours.',
    furtherReading: [
      { label: 'Vaporwave (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Vaporwave' },
      { label: 'Floral Shoppe, Macintosh Plus (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Floral_Shoppe' },
      { label: 'Windows 95 shell (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Windows_95' },
      { label: 'Synthwave and outrun (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Synthwave' },
    ],
  },
  flavor: {
    kicker: 'welcome to the dream mall - now loading human.exe',
    tagline: 'Distributed systems, slowed down and reverbed.',
    footer: 'Thank you for visiting the mall. Please take your pastel sunset with you.',
  },
  credits: [
    { name: 'Syncopate (Bold 700)', kind: 'font', license: 'Apache License 2.0', url: 'https://github.com/googlefonts/syncopate', note: 'Vernon Adams; wide caps for wordmark and headings; latin subset via fontsource' },
    { name: 'DotGothic16 (Regular 400)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/fontworks-fonts/DotGothic16', note: 'Fontworks; bitmap-gothic UI labels, title bars and readouts; latin subset via fontsource' },
    { name: 'Quicksand (variable 300-700)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/andrew-paglinawan/QuicksandFamily', note: 'Andrew Paglinawan; body text; latin subset via fontsource' },
    { name: 'Instrument Serif (Italic)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/Instrument/instrument-serif', note: 'Instrument; the classical italic accent; latin subset via fontsource' },
    { name: 'Pixel icon sprite, palm tree, marble column, sun, grid, window chrome', kind: 'svg', license: 'Original work (inline SVG / CSS)', note: 'Hand-written for this site; no third-party artwork or album art is used' },
    { name: 'Vaporwave photo treatment (recipe.mjs)', kind: 'code', license: 'Original work (MIT, with the repo)', note: 'Gradient-map, bloom, dual-light wash and Bayer dither written against the shared Fx toolkit' },
  ],
};
export default meta;
