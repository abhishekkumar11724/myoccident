/**
 * Metadata for the files in /photos. Keyed by photo id = "<category>/<filename-without-extension>".
 * The photo FILES are the source of truth - this only adds alt text / captions / hints.
 * A photo with no entry here still works (alt text falls back to its filename).
 *
 * tags:  'solo' | 'group' | 'portrait' (tall) | 'landscape' (wide) | 'night' | 'hero' (good as a main portrait)
 * focus: CSS object-position to keep the subject in frame when a theme crops (default 'center')
 */
export interface PhotoMeta { alt: string; caption?: string; tags?: string[]; focus?: string }

export const categoryInfo: Record<string, { title: string; blurb: string }> = {
  portraits: { title: 'Portraits', blurb: 'Faces, fits and the odd selfie.' },
  adventure: { title: 'Hills & waterfalls', blurb: 'Snow, rivers, waterfalls and sunsets from trips into the hills.' },
  'friends-trips': { title: 'Friends & trips', blurb: 'The people who make the trips worth taking.' },
  bikes: { title: 'Rides', blurb: 'Motorbikes, night rides and open roads.' },
  books: { title: 'Books', blurb: 'What I have been reading.' },
  scenery: { title: 'Scenery', blurb: 'Skies, palaces and mountains.' },
  pets: { title: 'Dogs & cats', blurb: 'Strays and companions met along the way.' },
  food: { title: 'Street food', blurb: 'Lanes worth getting lost in for the food.' },
  'work-and-lifestyle': { title: 'Desk & downtime', blurb: 'Code on the laptop, newspaper in hand.' },
};
/** Display order of categories in "Beyond code" sections. */
export const categoryOrder = ['portraits', 'adventure', 'friends-trips', 'bikes', 'scenery', 'books', 'pets', 'food', 'work-and-lifestyle'];

export const photoMeta: Record<string, PhotoMeta> = {
  // portraits
  'portraits/01-selfie-maroon': { alt: 'Abhishek taking a close selfie in a maroon sweatshirt and glasses, bamboo fence behind him', caption: 'Close-up, warm light', tags: ['solo', 'hero'], focus: '50% 35%' },
  'portraits/02-smile-jacket': { alt: 'Abhishek smiling in a dark jacket, seated in a wicker chair, holding a drink', caption: 'Mid-laugh', tags: ['solo', 'hero'], focus: '50% 30%' },
  'portraits/03-red-kurta-seated': { alt: 'Abhishek seated on a cream armchair in a red kurta and white pyjamas, a large plant beside him', caption: 'Festive fit', tags: ['solo', 'hero', 'portrait'], focus: '50% 25%' },
  'portraits/04-red-kurta-stairs': { alt: 'Abhishek in a red kurta sitting on the edge of a staircase landing', caption: 'On the stairs', tags: ['solo', 'portrait'], focus: '50% 25%' },
  'portraits/05-lakeside-night': { alt: 'Abhishek standing by a lake at night in a grey t-shirt, lights reflecting on the water', caption: 'By the lake at night', tags: ['solo', 'night', 'portrait'], focus: '50% 40%' },
  'portraits/06-alley-smile': { alt: 'Abhishek smiling with arms crossed in a narrow lane lined with shop shutters', caption: 'Old-city lane', tags: ['solo', 'portrait'], focus: '60% 50%' },
  'portraits/07-tree-dusk': { alt: 'Abhishek leaning against a tree at dusk, arms crossed, blue evening sky behind', caption: 'Dusk', tags: ['solo', 'portrait'], focus: '50% 40%' },
  'portraits/08-market-street': { alt: 'Abhishek standing in a busy hill-town market street under strings of bunting', caption: 'Market street', tags: ['solo', 'portrait'], focus: '50% 45%' },
  'portraits/09-jaipur-arch': { alt: 'Abhishek sitting inside a carved red sandstone arch in Jaipur', caption: 'Jaipur', tags: ['solo'], focus: '45% 55%' },
  // adventure
  'adventure/01-waterfall-standing': { alt: 'Abhishek standing in front of a tall waterfall, jacket tied around his waist', caption: 'Under the falls', tags: ['solo', 'landscape'], focus: '50% 50%' },
  'adventure/02-waterfall-closeup': { alt: 'Close portrait of Abhishek, arms crossed, with a waterfall and a red hut behind', caption: 'Arms crossed, waterfall behind', tags: ['solo', 'landscape'], focus: '50% 40%' },
  'adventure/03-bridge-waterfall': { alt: 'Abhishek standing on a wooden bridge with a green railing, waterfall behind', caption: 'On the bridge', tags: ['solo', 'portrait'], focus: '50% 40%' },
  'adventure/04-hillside-smile': { alt: 'Abhishek smiling on a sunny hillside with his jacket tied at the waist', caption: 'Hillside', tags: ['solo', 'portrait'], focus: '50% 35%' },
  'adventure/05-snow-arms-crossed': { alt: 'Abhishek standing on a snowy slope with arms crossed and a big smile', caption: 'Snow', tags: ['solo', 'portrait'], focus: '50% 40%' },
  'adventure/06-snow-forest': { alt: 'Abhishek standing in snow among pine trees with the sun glinting through', caption: 'Pines and snow', tags: ['solo', 'landscape'], focus: '45% 55%' },
  'adventure/07-river-rocks': { alt: 'Abhishek sitting on boulders beside a mountain stream', caption: 'By the stream', tags: ['solo', 'portrait'], focus: '50% 55%' },
  'adventure/08-valley-railing': { alt: 'Abhishek leaning on a rust-coloured railing above a wide mountain valley', caption: 'Valley view', tags: ['solo', 'portrait'], focus: '50% 60%' },
  'adventure/09-with-dog': { alt: 'Abhishek with arms crossed beside a friendly brown dog on a stone ledge', caption: 'With a new friend', tags: ['solo', 'portrait'], focus: '60% 45%' },
  'adventure/10-sunset-silhouette': { alt: 'Silhouette of Abhishek at a blue railing against a golden sunset over hazy hills', caption: 'Golden hour', tags: ['solo', 'landscape'], focus: '50% 50%' },
  'adventure/11-sunset-profile': { alt: 'Abhishek in profile at a railing, looking out over misty hills at sunset', caption: 'Looking out', tags: ['solo', 'portrait'], focus: '50% 40%' },
  'adventure/12-steps-pose': { alt: 'Abhishek sitting on stone steps beside tall pines in a hill town', caption: 'Stone steps', tags: ['solo'], focus: '50% 50%' },
  // friends & trips
  'friends-trips/01-hillside-crew': { alt: 'A group of friends posing on a green hillside near a waterfall, arms raised', caption: 'The crew', tags: ['group', 'landscape'] },
  'friends-trips/02-three-on-the-hill': { alt: 'Three friends on a dry mountain slope, one sitting, two standing', caption: 'Three on a slope', tags: ['group', 'portrait'] },
  'friends-trips/03-hawa-mahal-five': { alt: 'Five friends sitting on a wall in front of Hawa Mahal, Jaipur', caption: 'Hawa Mahal', tags: ['group'] },
  'friends-trips/04-hawa-mahal-selfie': { alt: 'Group selfie of friends in front of Hawa Mahal, Jaipur', caption: 'Selfie, Jaipur', tags: ['group'] },
  'friends-trips/05-holi-crew': { alt: 'Friends covered in colour posing together during Holi', caption: 'Holi', tags: ['group', 'portrait'] },
  'friends-trips/06-fairground-trio': { alt: 'Three friends in dark jackets on a red carpet in front of a lit-up ferris wheel', caption: 'Fair night', tags: ['group', 'night'] },
  'friends-trips/07-red-carpet-trio': { alt: 'Three friends standing on a red carpet in front of a festive set', caption: 'Red carpet', tags: ['group', 'portrait', 'night'] },
  'friends-trips/08-sunset-big-group': { alt: 'A large group of friends gathered at a blue railing at sunset', caption: 'Sunset gathering', tags: ['group'] },
  'friends-trips/09-night-group': { alt: 'A big group of friends crowded together on a terrace at night', caption: 'Night terrace', tags: ['group', 'night'] },
  'friends-trips/10-golden-hour-group': { alt: 'Friends posing close together at golden hour behind a railing', caption: 'Golden hour group', tags: ['group'] },
  'friends-trips/11-hilltop-group': { alt: 'A group on a dry hilltop; one friend leans in for the selfie', caption: 'Hilltop selfie', tags: ['group'] },
  'friends-trips/12-balcony-cheers': { alt: 'A big group cheering on a balcony with misty hills behind', caption: 'Cheers', tags: ['group'] },
  'friends-trips/13-three-friends-sun': { alt: 'Three friends smiling with a sun flare over the mountains behind them', caption: 'Three friends', tags: ['group'] },
  'friends-trips/14-three-on-the-ridge': { alt: 'Three friends sitting together on a ridge with brown hills behind', caption: 'On the ridge', tags: ['group'] },
  'friends-trips/15-sunset-railing-trio': { alt: 'Three friends with arms around each other at a railing during sunset', caption: 'Trio at sunset', tags: ['group'] },
  'friends-trips/16-dinner-with-friends': { alt: 'Friends crowded around a wooden table at a restaurant dinner', caption: 'Dinner', tags: ['group'] },
  // bikes
  'bikes/01-royal-enfield-day': { alt: 'A dark green Royal Enfield motorbike parked on a wet street, another bike behind it', caption: 'Parked', tags: ['landscape'] },
  'bikes/02-bike-street': { alt: 'A matte-black cruiser motorbike parked by a brick wall, headlight in focus', caption: 'Black cruiser', tags: ['portrait'] },
  'bikes/03-bike-night-rider': { alt: 'Abhishek beside his motorbike at night, headlight blazing, in a maroon t-shirt', caption: 'Night ride', tags: ['solo', 'night'] },
  'bikes/04-bike-bw': { alt: 'Black and white photo of Abhishek riding a motorbike wearing a helmet', caption: 'In black and white', tags: ['solo', 'landscape'] },
  'bikes/05-night-stand': { alt: 'Abhishek standing with arms crossed next to a motorbike on a dark road', caption: 'Roadside at night', tags: ['solo', 'night'] },
  'bikes/06-helmet-night': { alt: 'Abhishek in a helmet on a motorbike, headlight glowing in front of a cafe', caption: 'Helmet on', tags: ['solo', 'night'] },
  'bikes/07-photo-booth': { alt: 'Abhishek on a Royal Enfield display bike wearing a white headscarf and helmet at a photo booth', caption: 'Photo booth', tags: ['solo'] },
  // books
  'books/01-a-little-life': { alt: 'A hand holding the novel A Little Life by Hanya Yanagihara', caption: 'A Little Life, Hanya Yanagihara', tags: ['portrait'] },
  'books/02-can-we-be-strangers-again': { alt: 'A hand holding the book Can We Be Strangers Again? by Shrijeet Shandilya', caption: 'Can We Be Strangers Again?, Shrijeet Shandilya', tags: ['portrait'] },
  // scenery
  'scenery/01-jal-mahal': { alt: 'Jal Mahal palace floating in a lake under heavy grey clouds, hills behind', caption: 'Jal Mahal, Jaipur', tags: ['landscape'] },
  'scenery/02-hawa-mahal-lowangle': { alt: 'Hawa Mahal seen from below against a bright blue sky', caption: 'Hawa Mahal, from below', tags: ['landscape'] },
  'scenery/03-hawa-mahal-rooftop': { alt: 'Looking along Hawa Mahal and its pink sandstone balconies from a rooftop', caption: 'Hawa Mahal, up close', tags: ['landscape'] },
  'scenery/04-jantar-mantar-view': { alt: 'Wide view over the old city of Jaipur from a high vantage point', caption: 'Over the old city', tags: ['landscape'] },
  'scenery/05-pink-sky-tree': { alt: 'A tree silhouetted against streaks of pink cloud at dusk', caption: 'Pink sky', tags: ['portrait'] },
  'scenery/06-mountain-valley': { alt: 'A road winding through dry golden mountains under a deep blue sky', caption: 'Mountain road', tags: ['landscape'] },
  'scenery/07-sun-over-mountains': { alt: 'The sun bursting through clouds above layered blue mountains', caption: 'Sun over the ridges', tags: ['landscape'] },
  // pets
  'pets/01-husky': { alt: 'A husky with pale blue eyes sitting on the road, looking up at the camera', caption: 'Husky', tags: ['portrait'] },
  'pets/02-dog-on-ledge': { alt: 'A fluffy brown dog sitting on a stone ledge with its tongue out', caption: 'Ledge dog', tags: ['landscape'] },
  'pets/03-cat-closeup': { alt: 'A tabby cat with eyes half closed, basking by a plastic chair', caption: 'Tabby', tags: ['portrait'] },
  'pets/04-park-dog': { alt: 'A brown and black dog standing alert in a park at dusk', caption: 'Park dog', tags: ['landscape'] },
  // food
  'food/01-alley-eatery': { alt: 'A tiny old-city eatery at the end of a narrow lane with customers outside', caption: 'Worth the walk', tags: ['portrait'] },
  // desk & downtime
  'work-and-lifestyle/01-laptop-code': { alt: 'A laptop showing code in a dark editor beside a TV screen', caption: 'Code after dark', tags: ['portrait'] },
  'work-and-lifestyle/02-reading-newspaper': { alt: 'Abhishek reading a newspaper-style restaurant menu with a thoughtful look', caption: 'Reading the fine print', tags: ['solo'] },
};
