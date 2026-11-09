import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'inflated-3d',
  palette: { bg: '#d8f0ff', fg: '#2b1d5a', accent: '#ff5fae', accent2: '#8fd3ff' },
  fonts: ['Modak', 'Fredoka', 'Nunito'],
  about: {
    origin:
      '"3D inflated" is a 2020s look in which everything seems pumped full of air: swollen rounded forms, glossy highlights, translucent candy plastic and soft shadows under floating objects. It descends from 1960s pneumatic design and Claes Oldenburg\'s soft sculptures, from Jeff Koons\' mirror-finish Balloon Dog (1994-2000) and from the see-through fruit-coloured plastic of the 1998 iMac G3, passed through the glossy Frutiger Aero interfaces of 2004-2013 and today\'s Y2K revival. Designers now make it in Blender and Spline, but it can also be built from lighting maths and gradients in the browser.',
    traits: [
      'Every shape is a swollen volume: huge corner radii, no sharp edges, pinch points and knots where the plastic is tied off',
      'One soft key light: bright rim and a small crisp specular blob top-left, a hue-matched colour bleed bottom-right',
      'Translucent candy plastic in bubblegum, baby blue, lemon, mint and lilac on an airy sky gradient',
      'Heavy rounded type that itself looks inflated: lit from an alpha-channel height map',
      'Objects float and cast soft contact shadows; buttons squish when pressed',
    ],
    inThisSite:
      'The page is a pastel sky with balloons and clouds. The name and headings are Modak type run through an SVG lighting filter (blurred alpha as a bump map plus specular and diffuse light), photos hang in balloon and pillow frames, experience hangs off a balloon garland, case studies are knotted tiles, and projects are a name-only index whose preview bubble inflates on hover or focus. A squishy lab at the bottom has four toys with keyboard hints; everything that bobs stops under reduced-motion.',
    furtherReading: [
      { label: 'Balloon Dog (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Balloon_Dog' },
      { label: 'Soft sculpture (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Soft_sculpture' },
      { label: 'Frutiger Aero (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Frutiger_Aero' },
      { label: 'feSpecularLighting (MDN)', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feSpecularLighting' },
    ],
  },
  flavor: {
    kicker: 'Handle with air',
    tagline: 'Soft on the outside, load-tested on the inside.',
    footer: 'Hand-inflated with CSS, SVG lighting and a lot of air. No helium was harmed.',
  },
  credits: [
    { name: 'Modak (Regular, latin)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fontsource.org/fonts/modak', note: 'Display type: name, headings, numerals; via Fontsource' },
    { name: 'Fredoka (variable, latin)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fontsource.org/fonts/fredoka', note: 'Buttons, labels, card titles; via Fontsource' },
    { name: 'Nunito (variable, latin)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://fontsource.org/fonts/nunito', note: 'Body text; via Fontsource' },
    { name: 'Balloons, clouds, stars, hearts, bubbles, knots and strings', kind: 'svg', license: 'Original (hand-written SVG / CSS)', note: 'Drawn for this site; no third-party artwork' },
    { name: 'Inflate filter (blurred alpha + feSpecularLighting + feDiffuseLighting)', kind: 'code', license: 'Original', note: 'Standard SVG filter primitives, configured for this site' },
    { name: 'Photo recipe: gamma lift, violet black floor, bloom, candy soft-light grade', kind: 'code', license: 'Original', note: 'recipe.mjs using the shared fx toolkit (sharp)' },
    { name: 'Koons, Oldenburg, Apple iMac G3, Frutiger Aero', kind: 'reference', license: 'Studied for light, form and colour only', note: 'No images or artwork reused' },
  ],
};
export default meta;
