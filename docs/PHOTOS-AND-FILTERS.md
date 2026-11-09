# Photos and filters

Two ideas to hold on to:

1. **Your photos are the "root" images.** They live untouched in `photos/<category>/`. You never edit them per style.
2. **Each style has a filter ("recipe")** in `src/themes/<style>/recipe.mjs`. At build time the recipe is run over every root photo and the result is
   written to `public/generated/<style>/`. Replace a root photo, rebuild, and all 19 styles re-filter it automatically.

```
photos/portraits/01-selfie-maroon.webp          <- root photo (yours)
        |  scripts/build-images.mjs  +  src/themes/<style>/recipe.mjs
        v
public/generated/glitch/portraits/01-selfie-maroon.webp         full size, glitch-filtered
public/generated/glitch/portraits/01-selfie-maroon.thumb.webp   thumbnail, glitch-filtered
public/generated/_original/...                                  unfiltered copies (Clean view, "reveal original on hover")
src/generated/manifest/<style>.json                             list of what was rendered
```
`public/generated/` and the manifests are build output: git-ignored, safe to delete, rebuilt by `npm run images` (slow after a delete - see the cache section).

---

## Folder layout and naming

```
photos/
  portraits/            01-selfie-maroon.webp  02-smile-jacket.webp ...
  adventure/  friends-trips/  bikes/  books/  scenery/  pets/  food/  work-and-lifestyle/
```
- **Photo id** = its path under `photos/` without the extension, e.g. `portraits/01-selfie-maroon`. The id is what the code and `photos.ts` use.
- **Category** = the folder name. It decides which "Beyond code" group the photo lands in.
- **Order**: categories follow `categoryOrder` in `src/content/photos.ts`; inside a category photos sort by file name, so use a `NN-` prefix (`01-`, `02-`...) to control order.
- Allowed file types: `.webp`, `.jpg`/`.jpeg`, `.png`. Use lowercase, dashes, no spaces.
- **Size**: the longest side is shrunk to 1000-1400 px depending on the style (never enlarged), so export at **1400 px or more** on the long side if you can. Phone orientation (EXIF) is respected.

## Add a photo

1. **Instagram-backup photos only:** they come padded with blurred bars. Remove them first (needs `pip install pillow`):
   ```bash
   python3 tools/depad-instagram.py ~/Downloads/post.webp photos/adventure/13-new-trip.webp
   ```
   It prints the crop box it detected. If it guesses wrong, force one: `--box left,top,right,bottom`. Photos taken from your phone gallery don't need this.
2. Put the file in the right category folder, with the next number: `photos/adventure/13-new-trip.webp`.
3. Add its details in `src/content/photos.ts` (see [Photo metadata](#photo-metadata)). Without an entry it still works, but the alt text becomes the file name.
4. Run `npm run images` (or just `npm run dev` / `npm run build`). Only the new photo is rendered (for all 19 styles); everything else comes from the cache.
5. It now appears in every style's "Beyond code" section. No style needs editing.

## Replace a photo

Overwrite the file **keeping the same name**, then `npm run images`. The cache notices the new bytes and re-renders just that photo in all 19 styles.
Update its alt text/caption in `photos.ts` if the picture changed.

**To change your main portrait** (the hero/About photo in most styles) overwrite `portraits/01-selfie-maroon.webp`, `portraits/02-smile-jacket.webp` and `portraits/03-red-kurta-seated.webp`.
(Their file names say "maroon / jacket / kurta"; the names don't matter to the code, only the paths do.)

## Remove a photo - read this first

Many styles use specific photos by name (a hero, an About picture, a few night shots). **If you delete or rename one of these, `npm run build`/`dev` stops with
`Unknown photo "<id>"`** (tested). The photos referenced by name somewhere in a style are:

| Category | Files styles refer to |
|---|---|
| portraits | `01-selfie-maroon`, `02-smile-jacket`, `03-red-kurta-seated`, `05-lakeside-night`, `06-alley-smile`, `07-tree-dusk`, `09-jaipur-arch` |
| adventure | `01-waterfall-standing`, `02-waterfall-closeup`, `04-hillside-smile`, `05-snow-arms-crossed`, `06-snow-forest`, `09-with-dog` |
| bikes | `01-royal-enfield-day`, `03-bike-night-rider`, `04-bike-bw`, `05-night-stand`, `06-helmet-night` |
| books | `01-a-little-life`, `02-can-we-be-strangers-again` |
| friends-trips | `06-fairground-trio`, `07-red-carpet-trio`, `09-night-group` |
| pets | `02-dog-on-ledge` |

So: **replace** these (same filename) instead of deleting them. Every other photo (36 of the 60) can be deleted freely:
1. Delete the file from `photos/`, 2. delete its entry from `photoMeta` in `photos.ts`, 3. run `npm run images` (it also removes that photo's generated files).

To find where a style uses a photo: `grep -rn "portraits/05-lakeside-night" src/themes`.

## Photo metadata

`src/content/photos.ts` holds `photoMeta` (one entry per photo), `categoryInfo` (title + blurb per folder) and `categoryOrder`. A photo entry looks like this
(add yours inside `photoMeta`, keyed by the photo id):

```ts
'portraits/01-selfie-maroon': {
  alt: 'Abhishek taking a close selfie in a maroon sweatshirt and glasses, bamboo fence behind him',   // for screen readers
  caption: 'Close-up, warm light',        // optional; shown by styles that print captions
  tags: ['solo', 'hero'],                 // optional, see below
  focus: '50% 35%',                       // optional CSS object-position: where to keep the subject when a style crops
},
```
- **alt**: describe what is in the picture, in one sentence. Every photo shown on a page needs a real alt (the checker fails on missing/very short ones).
- **focus**: `'50% 30%'` means "keep the point 50% across and 30% down in view when cropping". Raise the second number to show more of the lower part, lower it to show more of the top (useful for faces).
- **tags** (all optional): `hero` = good main portrait (used by `heroPhotos()` and the Clean view); `night` = dark scene (several filters have a gentler "night" variant);
  `solo`/`group` = who is in it (some filters treat them differently); `portrait`/`landscape` = informational (orientation is also detected from the pixels).
- **`categoryInfo`** gives each folder its title and one-line blurb; **`categoryOrder`** is the order groups appear in.

**New category (new folder):** add the folder name to `categoryOrder` (where you want it) and to `categoryInfo` (title + blurb). Otherwise the photos still render but
**won't appear in the grouped "Beyond code" galleries** (photos dropped directly into `photos/` fall in a hidden `misc` category for the same reason).

---

## Build commands

```bash
npm run images                                   # all styles, only what changed
npm run images -- --style glitch                 # one style (comma-separate several: glitch,grunge)
npm run images -- --photo portraits/01-selfie-maroon          # one photo, all styles
npm run images -- --style glitch --photo portraits/01-selfie-maroon --force   # redo exactly that
npm run images -- --force                        # redo everything (slow)
PF_ONLY=glitch npm run dev                       # dev server + render only that style's photos
```
**The cache.** A photo/style pair is skipped when none of these changed: the photo's bytes, its tags in `photos.ts`, the style's `recipe.mjs` text, `scripts/fx/index.mjs`, and the output settings.
- Editing a `recipe.mjs` re-renders only that style (60 photos, roughly 30 s).
- Editing **`scripts/fx/index.mjs` re-renders every style** (roughly 10 minutes) - avoid unless you mean it.
- If a recipe imports a helper from another file and you edit only the helper, the cache can't see it: add `--force` for that style.
- Deleting `public/generated/` means the next build must re-render everything (roughly 10 minutes; an estimate).

---

## Change a style's photo filter

Open `src/themes/<style>/recipe.mjs`. It is a small config object:

```js
export default {
  maxSize: 1400,        // longest side of the full-size image, in pixels
  thumb: 520,           // width of the thumbnail version
  quality: 80,          // 1-100 compression for webp/jpeg: lower = smaller file, softer image
  format: 'webp',       // 'webp' (default) | 'png' (flat-colour styles) | 'jpeg'
  treatments: {         // named recipes; each receives `fx` (the photo) and returns it after chaining operations
    default: (fx, ctx) => fx.adjust({ saturation: 1.07, contrast: 1.05 }).grain(0.03),
    night:   (fx, ctx) => fx.adjust({ gamma: 1.13 }),
  },
  pick: (ctx) => ctx.tags?.includes('night') ? 'night' : 'default',   // which treatment for which photo
}
```
- `ctx` tells `pick` and the treatments about the photo: `id`, `category`, `name`, `tags`, `alt`, `width`, `height`, `orientation` (`portrait|landscape|square`), `style`, `seed`, `rng`.
- `fx` operations are **chained and run in order**. Randomness comes from `fx.rng` (seeded per photo), so rebuilding gives the same result every time.
- A treatment may return `fx`, or finish with `await fx.run()` first if it needs to `fx.clone()` an intermediate result.

### Try a change quickly

```bash
# 1. edit src/themes/isometric/recipe.mjs, e.g. saturation: 1.07 -> 1.25
npm run images -- --style isometric --force
# 2. look at the result files
open public/generated/isometric/portraits/01-selfie-maroon.webp
# 3. see it in the page
PF_ONLY=isometric npm run dev          # http://localhost:4321/myoccident/s/isometric/
```

### Real examples from this project

**Lighter touch** (Isometric keeps photos natural and puts the style in CSS frames): `adjust` nudges colour; `coolShadows` is a small custom helper in the same file:
```js
default: (fx) => { fx.adjust({ saturation: 1.07, contrast: 1.05, gamma: 1.07, brightness: 0.01 }); coolShadows({ amount: 0.55 })(fx); return fx; },
```
**Different look for dark photos / landscapes** via `pick` (Skeuomorphism):
```js
pick: (ctx) => ctx.tags?.includes('night') ? 'night'
             : ['scenery','food','pets'].includes(ctx.category) ? 'scene' : 'default',
```
**Turn the filter off** for a style (photos stay as they are): `treatments: { default: (fx) => fx }`.

**Write your own effect** with `px`, which runs a function on every pixel:
```js
fx.px((r, g, b, a, x, y) => [r * 1.1, g, b * 0.9, a])      // warmer
```
or `fx.custom(async (f) => { /* f.data is RGBA bytes, f.w x f.h */ })` for anything else.

### Filter toolkit (`scripts/fx/index.mjs`)

| Group | Operations |
|---|---|
| Tone & colour | `grayscale()` `invert()` `adjust({brightness,contrast,saturation,gamma,hue})` `levels(black,white)` `posterize(n)` `threshold(t,dark,light)` `tint(color,opacity,mode)` `gradientOverlay(angle,stops,{mode,opacity})` |
| Colour mapping | `gradientMap(stops,{contrast})` `duotone(dark,light)` `quantize(paletteHex[],{dither:'none'\|'bayer'\|'noise',strength})` |
| Geometry | `resize(w,h)` `cover(aspect,{focusX,focusY})` `pixelate(n)` |
| Blur & detail | `blur(sigma)` `sharpen(sigma)` `median(n)` `convolve(kernel)` `emboss(strength)` `kuwahara(radius)` (painterly flattening) |
| Line & print | `edges({threshold,thickness,color,mode:'overlay'\|'only',paper})` (outlines) `halftone({cell,angle,ink,paper,color})` `lineScreen({pitch,angle,ink,paper})` |
| Glitch & screen | `rgbSplit(dx,dy)` `chromatic(px)` `sliceShift({bands,maxShift})` `scanlines({gap,opacity,color})` |
| Finishing | `grain(amount)` `vignette(strength)` `texture('paper'\|'canvas'\|'speckle'\|'scratches'\|'cloud',{opacity,scale,mode})` |
| Escape hatches | `px(fn)` `custom(fn)` |

Colours are `'#rrggbb'`, `'#rgb'` or `[r,g,b]`. Blend modes: `normal multiply screen overlay softlight add difference lighten darken`.
Each operation's exact options are documented in the header comment and signatures of `scripts/fx/index.mjs`.

### Size and speed tips
- File size is driven by `quality` and `maxSize`. If a style's page feels heavy, lower `quality` (e.g. 80 -> 70) or `maxSize` (1400 -> 1200) and re-render that style.
- Flat-colour looks (halftone, posterize) compress badly as photos. **De Stijl uses `png`** and is the heaviest page (~10 MB of thumbnails versus 1.4-4.5 MB for the others); switching it to `webp` is the quickest fix.
- Keep each photo "well under ~200 KB" at full size if you can; thumbnails are what grids actually load.

## Live effects (not in the recipe)

Things that react to the visitor - the colour coming back on hover, the glitch burst, the WebGL blob, parallax - are plain CSS/JavaScript inside each style:
`src/themes/<style>/theme.css` (hover, `filter`, `mix-blend-mode`, frames and masks) and `src/themes/<style>/client.ts`. Changing a *frame*, crop shape or hover effect
means editing those files, not the recipe.
Some styles (Isometric, Skeuomorphism, Neumorphism, 3D Inflated) deliberately keep photos near-natural in the recipe and put the style in the CSS frames.

## The unfiltered set

`public/generated/_original/` is the same photos resized but unfiltered. The Clean view, lightboxes and "reveal the original on hover" effects use it. It is built automatically.
