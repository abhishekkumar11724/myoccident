import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'mid-century',
  palette: { bg: '#f4e8cd', fg: '#2a1c14', accent: '#d4561c', accent2: '#1f6f6b' },
  fonts: ['Jost (variable)', 'Fraunces (variable, roman + italic)', 'Michroma'],
  about: {
    origin:
      "Mid-century design is the optimistic visual language of about 1945-1969. Post-war prosperity, new materials, the Atomic Age and the Space Race met the clean modernism that Bauhaus teachers carried to America. Saul Bass reduced films to one cut-paper symbol (The Man with the Golden Arm, 1955; Anatomy of a Murder, 1959), Paul Rand gave IBM, Westinghouse and ABC witty geometric identities, Alvin Lustig wrapped New Directions books in abstract shapes, Charley Harper counted the wings instead of the feathers, and Alexander Girard, Charles and Ray Eames and George Nelson filled homes with dots, starbursts and ball-and-stick atom clocks. Printed in a handful of flat inks on warm paper, with the odd plate slightly off register.",
    traits: [
      'Flat spot colours on cream stock: mustard, burnt orange, teal, avocado, teak and walnut ink',
      'Cut-paper symbolism: one simple, angular silhouette carries the idea (Saul Bass)',
      'Atomic motifs: orbits, starbursts, sputniks, boomerangs and kidney shapes',
      'Swiss grid: asymmetric layouts, flush-left sans-serif, objective photography',
      'Screen-print texture: halftone dots, overprint and slight misregistration',
      'Optimism and wit: clear information, boxed key figures, playful geometry',
    ],
    inThisSite:
      "The page is the front page of an annual report. A dateline carries the live Gurugram time on a Nelson-style sunburst dial, the six key numbers sit in a Scoreboard box, jobs are legs of an airline itinerary, case studies are film posters with hand-built cut-paper symbols, skills are atoms with Eames dots, and the photos are three-ink screen prints in Kodachrome slide mounts (click one to project the untouched original). The contact form is an airmail envelope.",
    furtherReading: [
      { label: 'Mid-century modern (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Mid-century_modern' },
      { label: 'Saul Bass (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Saul_Bass' },
      { label: 'Atomic Age design (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Atomic_Age_(design)' },
      { label: 'International Typographic Style (Wikipedia)', url: 'https://en.wikipedia.org/wiki/International_Typographic_Style' },
      { label: 'Charley Harper (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Charley_Harper' },
    ],
  },
  flavor: {
    kicker: 'Hot off the press, in six inks.',
    tagline: 'Tomorrow, today - c. 1962.',
    footer: 'Set in Jost, Fraunces and Michroma. Printed on warm stock in six inks, one plate slightly off register.',
  },
  credits: [
    { name: 'Jost (variable, wght)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/indestructible-type/Jost', note: 'Indestructible Type; latin subset via fontsource' },
    { name: 'Fraunces (variable, wght; roman + italic)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/undercasetype/Fraunces', note: 'Undercase Type; latin subset via fontsource' },
    { name: 'Michroma 400', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/googlefonts/michroma', note: 'Vernon Adams; latin subset via fontsource' },
    { name: 'Paper grain, halftone dots, airmail stripes, starbursts, orbit rings, sunburst dial and poster glyphs', kind: 'svg', license: 'Original work (inline SVG + CSS)', note: 'No third-party image assets' },
    { name: 'Photo treatment "limited-ink screen print"', kind: 'code', license: 'Original work', note: 'recipe.mjs using the shared sharp-based fx toolkit' },
  ],
};
export default meta;
