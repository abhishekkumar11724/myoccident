import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'psychedelic',
  palette: { bg: '#2a0d63', fg: '#fff3d1', accent: '#ff2e93', accent2: '#ffd91f' },
  fonts: ['Chango 400', 'Shrikhand 400', 'Fraunces 400/700'],
  about: {
    origin:
      "Psychedelic art is the look of the San Francisco dance halls, 1965-1972. Wes Wilson, Victor Moscoso, Bonnie MacLean, Rick Griffin and Stanley Mouse & Alton Kelley hand-lettered concert posters for the Fillmore and the Avalon Ballroom, borrowing Alphonse Mucha's arches and arabesques, Op art's vibrating complementary colours (Moscoso studied under Josef Albers) and Victorian ornament. Heinz Edelmann's Yellow Submarine (1968) and Peter Max gave the same energy a clean, cartoon-pop face; liquid light shows supplied the slow, blooming colour.",
    traits: [
      'Lettering that melts, swells and interlocks until a whole line fills its rectangle (Wes Wilson)',
      'Vibrating complementary colour: hot pink against turquoise, orange against cobalt, yellow against violet',
      'Radial symmetry everywhere: concentric rings, sunbursts, mandalas, halos behind heads (Mucha)',
      'Paisley, daisies, peacock plumes, drips and melting edges; every corner filled (horror vacui)',
      'Art Nouveau curves and arches next to Op art geometry and photographic collage',
      'Liquid light-show motion: slow, large, overlapping colour blooms',
    ],
    inThisSite:
      "Each chapter is a colour-field poster joined to the next by a melting drip, and the sections are renamed as a concert set list (Opening act, The main set, Greatest hits...) with the real names always shown beside them. The wild lettering is kept to headings, where it is drawn as SVG with an accessible plain-text name; every fact sits on a solid cream panel with ink text. Photos are heat-mapped, halftoned and glowing at build time, framed as arches, ovals, flowers and leaves with rainbow rims, and hover to reveal the untreated original. All motion is slow and transform-only, and turns off with reduced motion.",
    furtherReading: [
      { label: 'Psychedelic art (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Psychedelic_art' },
      { label: 'Wes Wilson (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Wes_Wilson' },
      { label: 'Victor Moscoso (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Victor_Moscoso' },
      { label: 'Bonnie MacLean (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Bonnie_MacLean' },
      { label: 'Liquid light show (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Liquid_light_show' },
    ],
  },
  flavor: {
    kicker: 'Tonight only: one engineer, live and amplified',
    tagline: 'Clean code. Loud colours.',
    footer: 'Encore! Thanks for staying till the last chord.',
  },
  credits: [
    { name: 'Chango (Regular 400)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Chango', note: 'Fontstage; stretched SVG display lettering; latin subset via fontsource' },
    { name: 'Shrikhand (Regular 400)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Shrikhand', note: 'Jonny Pinhorn / Indian Type Foundry; card titles, nav and buttons; latin subset via fontsource' },
    { name: 'Fraunces (400, 700)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/undercasetype/Fraunces', note: 'Undercase Type; body copy; latin subset via fontsource' },
    { name: 'Paisley, daisy, mandala, sunburst, drips, halo rings, melt filter', kind: 'svg', license: 'Original work (inline SVG / CSS)', note: 'Hand-written for this site; the boteh shape after the traditional Persian/Kashmiri motif' },
    { name: 'Psychedelic photo treatment (recipe.mjs)', kind: 'code', license: 'Original work (MIT, with the repo)', note: 'Heat-map solarisation, tie-dye wash, halftone mix and glow written against the shared Fx toolkit' },
  ],
};
export default meta;
