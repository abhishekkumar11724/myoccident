import type { ThemeMeta } from '../registry';

const meta: ThemeMeta = {
  id: 'ukiyo-e',
  palette: { bg: '#f1e6cf', fg: '#1c1a17', accent: '#c8402f', accent2: '#1b3a5c' },
  fonts: ['Shippori Mincho ExtraBold', 'Zen Old Mincho', 'Yuji Boku'],
  about: {
    origin:
      'Ukiyo-e, "pictures of the floating world", is the woodblock-print art of Edo-period Japan (1603-1868), made for the city merchant class. A designer drew it, a carver cut one block per colour plus a black key block, a printer rubbed each block onto handmade washi, and a publisher sold it. Hokusai\'s Great Wave (c. 1831) and Hiroshige\'s Fifty-three Stations of the Tokaido (1833-34) made it famous, and its flat colour, bold outlines and cropped compositions went on to shape Impressionism and Art Nouveau.',
    traits: [
      'Flat colour fields printed from separate blocks, bound together by a bold sumi-ink key line',
      'Bokashi: smooth hand-graded skies fading from indigo to cream at the horizon',
      'Limited pigments: Prussian blue, vermilion, ochre, moss and the warm white of bare washi paper',
      'Title cartouches, red hanko seals, cloud bands (kasumi) and seigaiha wave patterns',
      'Slight misregistration, wood-grain streaks and visible paper fibre - the hand of the printer',
    ],
    inThisSite:
      'The page is a stack of printed sheets on washi. Sections wear cartouche headings, experience becomes the Tokaido road with numbered stations, case studies are a print series, projects a banzuke ranking sheet and photos hang in horizontal emaki scrolls. Every photograph is re-cut at build time into a woodblock print: flattened, limited to a pigment palette, outlined in sumi, shifted slightly off register and printed on paper fibre.',
    furtherReading: [
      { label: 'Ukiyo-e (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Ukiyo-e' },
      { label: 'The Great Wave off Kanagawa (Wikipedia)', url: 'https://en.wikipedia.org/wiki/The_Great_Wave_off_Kanagawa' },
      { label: 'Hiroshige, Fifty-three Stations of the Tokaido', url: 'https://en.wikipedia.org/wiki/Hiroshige' },
    ],
  },
  flavor: {
    kicker: 'A portfolio printed from many blocks',
    tagline: 'Carved in code, printed on washi.',
    footer: 'Cut, inked and pulled by hand, one block per colour.',
  },
  credits: [
    { name: 'Shippori Mincho (ExtraBold, subset)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/fontdasu/ShipporiMincho', note: 'Latin plus a few kanji, subset with fontTools from the google/fonts repo' },
    { name: 'Zen Old Mincho (Regular, Bold; Latin subset)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/googlefonts/zen-oldmincho', note: 'Body text' },
    { name: 'Yuji Boku (Latin subset)', kind: 'font', license: 'SIL OFL 1.1', url: 'https://github.com/Kinutafontfactory/Yuji', note: 'Brush accents' },
    { name: 'Washi paper tile', kind: 'texture', license: 'Original (procedurally generated)', note: 'Seamless fibre texture rendered with a custom script' },
    { name: 'Seigaiha, wave curl, Fuji, cloud bands, road, seals', kind: 'svg', license: 'Original (hand-written SVG)', note: 'Drawn for this site; inspired by the compositions of Hokusai and Hiroshige' },
    { name: 'Photo recipe: flatten, Lab palette, key-line, misregistration', kind: 'code', license: 'Original', note: 'recipe.mjs using the shared fx toolkit (sharp)' },
    { name: 'Hokusai, Hiroshige, Utamaro, Kuniyoshi (public-domain works)', kind: 'reference', license: 'Public domain', note: 'Studied for composition and colour only; no scans are used' },
  ],
};
export default meta;
