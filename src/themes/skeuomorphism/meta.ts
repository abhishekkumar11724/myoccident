import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'skeuomorphism',
  palette: { bg: '#6b4426', fg: '#f6ead0', accent: '#e0b44c', accent2: '#2d5d34' },
  fonts: ['Playfair Display 700', 'Source Sans 3 400 / 600', 'Courier Prime 400 / 700', 'Patrick Hand 400'],
  about: {
    origin:
      "Skeuomorphism is the old design habit of keeping the look of a thing after its function moved on: stone temples that copy timber pegs, vinyl 'wood' on cars. In interfaces it meant screens that imitate real objects. Apple's Aqua (unveiled January 2000, built so you'd 'want to lick it') brought gel buttons, pinstripes and brushed metal. Under Scott Forstall, iOS (2007-2012) put a yellow legal pad in Notes, wooden shelves in iBooks, green felt in Game Center and stitched leather in Calendar and Find My Friends; Windows Vista and 7 added glass. When Jony Ive took over interface design in late 2012, iOS 7 (June 2013) went flat, and 'the death of skeuomorphism' was declared. Its defenders, Don Norman among them, point out that familiar objects make unfamiliar tools easier to learn.",
    traits: [
      'One light, top-left: bright edges up and left, soft shadows down and right, everywhere',
      'Real materials: pebbled leather with stitching, walnut grain, green baize felt, cork, brushed steel, paper, glass',
      'Letterpress and foil: type pressed into a surface, a 1px highlight below the glyph, gold stamping on leather',
      'Controls that look like hardware: keys that press down, toggle switches, odometer wheels, needle gauges, glossy gel buttons',
      'Physical clutter as ornament: paper clips, pushpins, tape, photo corners, brass screws, Dymo labels',
      'The famous weakness: kitsch and wasted space, so good skeuomorphism keeps contrast high and the metaphor useful',
    ],
    inThisSite:
      "The page is a desk. A real lamp switch in the steel nav bar flips the room between day and night light. The hero is an open leather portfolio with a clipped print and an instrument panel whose odometer wheels roll once into place, experience is three manila folders full of index cards, case studies are memos on baize, projects live in an Aqua window, skills are labelled filing drawers, and photos are prints pinned to cork. The materials are baked from procedural noise into small tiles, text always sits on calm paper or leather with strong contrast, and everything still works with reduced motion.",
    furtherReading: [
      { label: 'Skeuomorph (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Skeuomorph' },
      { label: 'Aqua (user interface) (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Aqua_(user_interface)' },
      { label: 'Skeuomorphism in UI design (Nielsen Norman Group)', url: 'https://www.nngroup.com/articles/skeuomorphism/' },
      { label: 'Dieter Rams (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Dieter_Rams' },
    ],
  },
  flavor: {
    kicker: 'Hand-stitched, not hand-waved.',
    tagline: 'Every surface here is drawn. Nothing is real.',
    footer: 'Leather, felt, brass and paper, all drawn in CSS and none of it real. The lamp switch works, though.',
  },
  credits: [
    { name: 'Playfair Display 700', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/clauseggers/Playfair', note: 'Claus Eggers Sorensen; latin subset via fontsource' },
    { name: 'Source Sans 3 (400, 600)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/adobe-fonts/source-sans', note: 'Adobe; latin subset via fontsource' },
    { name: 'Courier Prime (400, 700)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/quoteunquoteapps/CourierPrime', note: "Alan Dague-Greene for Quote-Unquote Apps; latin subset via fontsource" },
    { name: 'Patrick Hand 400', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/googlefonts/patrick-hand', note: 'Patrick Wagesreiter; latin subset via fontsource' },
    { name: 'Material tiles: walnut, leather, felt, cork, brushed steel, paper, linen', kind: 'texture', license: 'Original work', note: 'Generated from seamless value/Worley noise lit from the top-left by assets/gen-textures.mjs; no third-party imagery' },
    { name: 'Paper clip, screws, pins, tape, gauges, keys, icons', kind: 'svg', license: 'Original work', note: 'Hand-written inline SVG and CSS gradients' },
    { name: 'Photo treatment "print grade"', kind: 'code', license: 'Original work', note: 'recipe.mjs using the shared sharp-based fx toolkit' },
  ],
};
export default meta;
