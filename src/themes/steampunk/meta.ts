import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'steampunk',
  palette: { bg: '#2b1a10', fg: '#f3e3b8', accent: '#c2943c', accent2: '#3f9d8a' },
  fonts: ['Abril Fatface', 'Cinzel', 'Libre Baskerville', 'Special Elite'],
  about: {
    origin:
      'Steampunk imagines the 19th century\'s steam-and-clockwork technology as if it had kept developing: airships, brass computing engines, pneumatic tubes and telegraphs. K. W. Jeter coined the word in a 1987 letter to Locus, as a joke on "cyberpunk", for the Victorian-set fantasies he, Tim Powers and James Blaylock were writing. Its ancestors are Jules Verne and H. G. Wells, Babbage\'s Difference and Analytical Engines, Gibson and Sterling\'s The Difference Engine (1990) and Miyazaki\'s Laputa (1986) and Howl\'s Moving Castle (2004); today it lives on in maker culture, fashion and interiors such as the brass-and-cog Arts et Metiers metro station in Paris.',
    traits: [
      'Visible mechanism as ornament: gears, cogs, pistons, valves, pipes and flywheels',
      'Instruments and dials: pressure gauges with swinging needles, clock faces with roman numerals, telegraph keys',
      'Brass, copper with verdigris, riveted iron, walnut and leather - warm lamp-light on worn metal',
      'Victorian print culture: fat-face and slab display type, engraved filigree, patent drawings, blueprints and telegram blanks',
      'Airships, portholes, goggles and pocket watches: the dream of a Victorian future, built by hand',
    ],
    inThisSite:
      'The page is an airship chart room. A live brass clock keeps Gurugram time, key figures are pressure gauges whose needles swing when they come into view, experience is a railway timetable, case studies are cyanotype blueprint sheets with dimension-line results, projects live in a brass-handled drawer cabinet, skills are patent plates with numbered parts, and every photo is re-printed as an engraved sepia albumen plate. All motion is slow and stops under reduced-motion settings.',
    furtherReading: [
      { label: 'Steampunk (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Steampunk' },
      { label: 'Analytical Engine (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Analytical_Engine' },
      { label: 'Blueprint / cyanotype (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Blueprint' },
    ],
  },
  flavor: {
    kicker: 'Dispatch from the engine room',
    tagline: 'Every mechanism visible, every gauge honest.',
    footer: 'Assembled by hand in the engine room. No steam was harmed in the making of this page.',
  },
  credits: [
    { name: 'Abril Fatface', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Abril+Fatface', note: 'TypeTogether; display headings' },
    { name: 'Cinzel', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Cinzel', note: 'Natanael Gama; engraved capitals for plates and labels' },
    { name: 'Libre Baskerville (variable + italic)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fonts.google.com/specimen/Libre+Baskerville', note: 'Impallari Type; body text' },
    { name: 'Special Elite', kind: 'font', license: 'Apache-2.0', url: 'https://fonts.google.com/specimen/Special+Elite', note: 'Astigmatic; typewriter detail text' },
    { name: 'Parchment, walnut, leather, brushed-iron and paper-grain tiles', kind: 'texture', license: 'Original work (CC0)', note: 'Generated procedurally for this site with a seeded noise script' },
    { name: 'Gears, gauges, clock, airship, rivets, filigree, blueprint schematics, patent figures', kind: 'svg', license: 'Original work (CC0)', note: 'Hand-written / procedurally generated SVG, no third-party artwork' },
    { name: 'Engraved sepia photo treatment', kind: 'code', license: 'Original work', note: 'recipe.mjs, built on the shared Fx toolkit' },
  ],
};
export default meta;
