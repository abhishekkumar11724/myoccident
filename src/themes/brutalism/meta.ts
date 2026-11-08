import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'brutalism',
  palette: { bg: '#cfcdc7', fg: '#0c0c0b', accent: '#e4ff1a', accent2: '#1b1b1a' },
  fonts: ['Archivo (variable: weight + width)', 'IBM Plex Mono'],
  about: {
    origin:
      "Brutalism began in 1950s Britain as 'the New Brutalism': Alison and Peter Smithson's Hunstanton School (1949-54) and Reyner Banham's 1955 essay asked for a legible plan, visible structure and materials shown 'as found'. The name nods to Le Corbusier's beton brut, the raw board-marked concrete of his Unite d'habitation in Marseille (1947-52). It spread through Boston City Hall, the Barbican, Habitat 67 and the concrete blocks of the Eastern bloc, fell out of favour in the late 1970s, and has been rediscovered since about 2015. On the web, 'brutalism' (Brutalist Websites, 2014 onward) means the same honesty: system and monospaced type, raw HTML, harsh colour, visible structure.",
    traits: [
      'Raw concrete: board-marked, jackhammered, never painted over',
      'Monolithic slabs and heavy repeated modules (Habitat 67, the Barbican)',
      'Structure and services left visible; the plan can be read from the outside',
      'Near-monochrome greys with one hard accent (hazard yellow here)',
      'Web version: huge mono and grotesk type, thick rules, underlined raw links, no polish',
    ],
    inThisSite:
      "The page is a concrete building. A floor directory runs down the left, every section is a numbered slab with a hard rule, jobs are walls of repeated modules, case studies are drawing sheets with title blocks, and the photos are cast in concrete: stark grey, coarse grain, colour returns when you hover. One signal colour, no curves, buttons that press into their shadow.",
    furtherReading: [
      { label: 'Brutalist architecture (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Brutalist_architecture' },
      { label: 'Beton brut (Wikipedia)', url: 'https://en.wikipedia.org/wiki/B%C3%A9ton_brut' },
      { label: 'Brutalist Websites', url: 'https://brutalistwebsites.com/' },
      { label: 'Neobrutalism: definition and best practices (NN/g)', url: 'https://www.nngroup.com/articles/neobrutalism/' },
    ],
  },
  flavor: {
    kicker: 'Poured, not polished.',
    tagline: 'Load-bearing content only.',
    footer: 'Cast in place. Nothing hidden behind the panels.',
  },
  credits: [
    { name: 'Archivo (variable, wght + wdth)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/Omnibus-Type/Archivo', note: 'Omnibus-Type; latin subset via fontsource' },
    { name: 'IBM Plex Mono 400 / 700', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/IBM/plex', note: 'IBM; latin subset via fontsource' },
    { name: 'Concrete noise, board-mark lines, tie-hole dots, hazard stripes', kind: 'texture', license: 'Original work (CSS + inline SVG feTurbulence)', note: 'No third-party image assets' },
    { name: 'Photo treatment "cast in concrete"', kind: 'code', license: 'Original work', note: 'recipe.mjs using the shared sharp-based fx toolkit' },
  ],
};
export default meta;
