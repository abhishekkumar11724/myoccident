import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'neumorphism',
  palette: { bg: '#e0e5ec', fg: '#2a3347', accent: '#5a67f0', accent2: '#a3b1c6' },
  fonts: ['Outfit (variable)', 'Nunito Sans (variable)', 'DM Mono'],
  about: {
    origin:
      "Neumorphism ('new skeuomorphism', also called soft UI) arrived in late 2019, when Oleksandr Plyuto's skeuomorphic banking-app concept went viral on Dribbble and Michal Malewicz's Hype4 article helped name and popularise the look. It sat between the leather-and-felt skeuomorphism that iOS 7 buried in 2013 and a decade of flat design: objects look physically extruded from, or pressed into, one continuous surface using only a light shadow on one side and a dark shadow on the other. HarmonyOS (2019) and macOS Big Sur (2020) borrowed its softness, but accessibility critics, who pointed to faint contrast and unclear affordances, helped glassmorphism take over by 2021. It lives on in dashboards, smart-home and music-player UIs, UI kits and portfolios.",
    traits: [
      'One surface colour (#e0e5ec) for page and components; shape comes only from shadow',
      'Two shadows per object from a single light: white up-left, cool grey down-right',
      'Three states of matter: raised (press me), pressed or sunk (this holds something), flat',
      'Circles everywhere: knobs, dials, toggles, tick rings, round avatars',
      'Monochrome chrome with one soft accent for the active state, glow and focus',
      'Famous weakness: low contrast and shadow-only affordances, so good soft UI adds labels, rims and focus rings',
    ],
    inThisSite:
      "The whole page is one slab of #e0e5ec. The rule is simple: raised means press me, sunk means this holds something. Navigation is a dock of round buttons, the hero is a knob whose indicator follows your scroll, stats are dials (only real percentages get a filled arc), and every case study carries a miniature working UI: a compiler console, a latency gauge, an A/B slider. Text stays above 4.5:1, inputs get a visible rim, and focus is a bold indigo ring, so the softness never costs legibility.",
    furtherReading: [
      { label: 'Neumorphism (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Neumorphism' },
      { label: 'Neumorphism (Interaction Design Foundation)', url: 'https://ixdf.org/literature/topics/neumorphism' },
      { label: 'Neumorphism and CSS (CSS-Tricks)', url: 'https://css-tricks.com/neumorphism-and-css/' },
      { label: 'WCAG 2.1: Non-text Contrast (1.4.11)', url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html' },
    ],
  },
  flavor: {
    kicker: 'Soft on the surface, load-bearing underneath.',
    tagline: 'Pressed, not painted.',
    footer: 'Everything here is pushed out of, or pressed into, the same piece of surface.',
  },
  credits: [
    { name: 'Outfit (variable, wght)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/Outfitio/Outfit-Fonts', note: 'Outfit Project Authors; latin subset via fontsource' },
    { name: 'Nunito Sans (variable, wght)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/googlefonts/nunito', note: 'Vernon Adams, Jacques Le Bailly, Manvel Shmavonyan, Alexei Vanyashin; latin subset via fontsource' },
    { name: 'DM Mono 400 / 500', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/googlefonts/dm-mono', note: 'Colophon Foundry for DM; latin subset via fontsource' },
    { name: 'Interface icons (nav dock, project glyphs, controls)', kind: 'icon', license: 'Original work', note: 'Hand-drawn inline SVG, no third-party icon set' },
    { name: 'Shadow system, dials, gauge, console mock-ups', kind: 'code', license: 'Original work', note: 'CSS box-shadow stacks, inline SVG and a small vanilla TypeScript client' },
    { name: 'Photo treatment "airy matte"', kind: 'code', license: 'Original work', note: 'recipe.mjs using the shared sharp-based fx toolkit' },
  ],
};
export default meta;
