# Theme guide (read fully before you start)

You are building ONE theme of Abhishek Kumar's portfolio. The site shows a different art-styled website every day
(19 styles). All 19 share ONE content source; each theme is a **completely distinct website design** over that content.
Read `BRIEF.md` for the agreed decisions and `research/_inspiration.md` for portfolio patterns worth borrowing.

**The quality bar:** a visitor should believe a designer who loves this style spent a week on this site.
It must read as the style at a glance (silhouette, colour, type, texture, motion, ornament) *and* stay a credible
professional portfolio: a recruiter must find experience, case studies, projects, skills, resume and contact fast.
Do NOT recolour the baseline template - throw its layout away. Different grid, different nav idea, different hero,
different component shapes. Be bold; be coherent; finish the details (hover, focus, empty states, mobile).

---

## 1. What you deliver (and nothing else)

Only touch these paths (all others are shared; if you need a change there, say so in your final report instead):

| Path | What |
|------|------|
| `research/<id>.md` | Research notes (outline in section 2). Write this FIRST. |
| `src/themes/<id>/Page.astro` | The full page (`<html>` ... `</html>`), data from `@/content/profile` + `@/lib/photos` |
| `src/themes/<id>/theme.css` | Styles (imported by Page.astro). Can also use scoped `<style>` in Page.astro |
| `src/themes/<id>/client.ts` | Optional behaviour (`<script>import './client.ts'</script>` in Page.astro) |
| `src/themes/<id>/meta.ts` | Palette, fonts, "About this style" panel text, flavour lines, **credits** (typed `ThemeMeta`) |
| `src/themes/<id>/recipe.mjs` | The photo treatment (section 5) |
| `src/themes/<id>/assets/**` | Fonts (woff2), svg, textures, any downloaded image - referenced with relative `url(./assets/..)` or `import x from './assets/x.svg?url'` so Vite bundles them |
| `src/pages/s/<id>/index.astro` | Route file - created by the scaffolder, **do not edit**. It statically imports your Page.astro, which is what keeps your CSS from leaking into other themes |
| `public/previews/<id>.jpg` | Gallery thumbnail - produced by `npm run check -- <id> --previews` |

Start with `npm run new:theme -- <id>` (scaffolds all of the above from the baseline).

**Never:** run `npm install`, `astro build` or any git command; edit `src/content`, `src/lib`, `src/components`,
`scripts/`, `astro.config.mjs`, `package.json`; touch other themes' folders. (Other agents work in parallel in the same repo.)

## 2. Research first: `research/<id>.md`

Do real research with WebSearch/WebFetch (history, key figures, defining works, design principles, current web
interpretations). Then write notes with this outline - concrete, not generic, with hex values and named typefaces:

```
# <Style> (<era>)
## Definition (one paragraph)
## Origins & timeline (dates, people, movements, why it looked this way)
## Defining visual traits (bullets, concrete and checkable)
## Colour (palette with hex + role of each; combinations to avoid)
## Typography (historic typefaces; the OFL/free fonts you chose + sizes/weights/pairing)
## Layout & composition (grids, spacing, shape language, ornament)
## Textures, ornaments & imagery (and the photo-treatment recipe + why)
## Motion & interaction (what moves, how, reduced-motion fallback)
## UI translation (nav, buttons, cards, forms, footer, timeline in this style)
## Pitfalls & accessibility risks (and mitigation)
## References (artworks / sites - URL + one line why; licence if you reuse anything)
## Decisions for this site (what we do / deliberately do NOT do)
## Sources
```
Reference, don't copy: describe other sites/artworks; never copy their code, copy-text or non-free assets.

## 3. Workflow

```bash
npm run new:theme -- <id>                         # scaffold (once)
PF_ONLY=<id> npx astro dev --port <YOUR_PORT> --ignore-lock &   # isolated dev server (PF_ONLY hides other themes and ignores their file changes; --ignore-lock lets several agents run servers)
npm run images -- --style <id>                    # (re)build YOUR photo variants after editing recipe.mjs (cached; --force to redo)
npm run check -- <id> --port <YOUR_PORT>          # automated acceptance (must end with 0 failed)
npm run check -- <id> --port <YOUR_PORT> --previews   # last step: also writes public/previews/<id>.jpg
```
Open the screenshots the checker writes to `/tmp/pf-shots/<id>/` (`desktop-fold.png`, `desktop-seg-N.jpg`,
`mobile-fold.png`, `mobile-seg-N.jpg`) with the Read tool and **look at them**. Iterate until it genuinely looks great:
check hierarchy, alignment, legibility, photo crops, empty/awkward gaps, mobile. Passing the checker is necessary, not sufficient.
Also resize-test mentally at 320px, 768px and 1920px widths. Stop your dev server when finished (`kill` the pid you started).
Use ports given in your brief only. If the dev server shows stale/odd errors, restart it. Your theme's CSS is bundled per page, so global selectors (`html`, `body`, `:root`, `*`) in theme.css only affect your own page - still keep the checker's selectors and the UtilityBar intact.

## 4. Data & shared building blocks

```ts
import { profile } from '@/content/profile';             // ALL facts. Never retype facts/numbers in markup.
import { photos, photo, photosIn, photoGroups, heroPhotos, photosTagged, categoryInfo } from '@/lib/photos';
import { withBase } from '@/lib/urls';                    // every internal URL + /public asset goes through this
import ThemeHead from '@/components/ThemeHead.astro';     // <head> basics (title, meta, og, favicon)
import Protected from '@/components/Protected.astro';     // <Protected kind="email|phone" class=".."> text </Protected>
import ContactForm from '@/components/ContactForm.astro'; // <ContactForm class="" submitLabel="" labels={{name,email,message}} />, style .pf-* classes
import UtilityBar from '@/components/UtilityBar.astro';   // <UtilityBar style={STYLE} />  (required, last child of <body>)
import meta from './meta';                                // your flavour lines: meta.flavor.{kicker,tagline,footer}
```
`profile` has: name, role, focus, location, tagline, summary, aboutPersonal[], interests[], stats[{value,label}],
contact{linkedin,github,...}, resume{href,label}, experience[{company,title,start,end,place,blurb,bullets[{head,text}]}],
education[], skills[{group,items,familiar?}], caseStudies[{id,title,org,period,role,kicker,problem,approach,impact[],tags[],featured}],
projects[{title,blurb,stack[],repo,live,year}], writing{status,planned[],posts[]}.

Photos: `photos(STYLE)` -> `Photo { id, category, alt, caption?, tags[], focus, orientation, img{src,thumb,width,height,thumbWidth,thumbHeight}, original{...} }`.
`img` is YOUR art-treated version (from recipe.mjs); `original` is the untouched photo (use for hover reveals or lightboxes only if it suits
the style). Use `thumb` in grids, `src` for big placements; always set `width`/`height`, `alt={p.alt}`, `loading="lazy"` except the first
hero image (`fetchpriority="high"`). 60 photos in 9 categories: portraits, adventure, friends-trips, bikes, scenery, books, pets, food,
work-and-lifestyle. `heroPhotos(STYLE)` = best portraits. Re-crop with `object-fit`/`object-position: {p.focus}`; never stretch.

### Required hooks (the checker enforces these)
- `<main>` + exactly one `<h1>` (the name). `<html lang="en">`.
- Section wrappers with `data-pf-section="hero|about|experience|skills|case-studies|projects|beyond-code|writing|contact"` (education lives inside experience or about; add `data-pf-education`).
- Resume link: `<a data-pf-resume href={withBase(profile.resume.href)} download>`.
- Email + phone via `<Protected>` (adds `data-pf-email` / `data-pf-phone`). LinkedIn/GitHub anchors with `data-pf-linkedin` / `data-pf-github`.
- `<ContactForm>`; `<UtilityBar style={STYLE} />` as the last child of `<body>`; keep ~72px bottom padding so it never covers content.
- **All content present in the DOM** (tabs/accordions OK, `display:none` content counts - but prefer visible): every experience bullet head, every featured case study, every project, every skill, education, all stats, key numbers (~5M, 1000+, 150+, ~68%).
- **>= 24 distinct art-treated photos** on the page, across the "Beyond code" section (group by `photoGroups`) plus hero/about. Meaningful `alt` on all.
- No external requests: fonts/icons/images/scripts all local. No analytics.
- Theme the UtilityBar via CSS custom properties (`--pf-bar-bg/fg/accent/border/radius/font/shadow`, `--pf-dialog-*`) so it feels native to the style; do not hide/shrink it.

### Voice
Professional with light personality. Facts come from `profile` verbatim. You may write short **flavour lines** in the theme's voice
(kicker, section subtitles, button labels, footer line) - witty, never changing facts, never inventing numbers or claims. Put the
main ones in `meta.flavor`. Case-study copy is fixed (resume-derived): reformat it, don't rewrite the claims.

## 5. Photo treatment (`recipe.mjs`) - "replace a photo and everything restyles"

Runs at build time over every file in `photos/` (`npm run images`). Contract:

```js
import { Fx } from '../../../scripts/fx/index.mjs';   // optional; fx is passed in
export default {
  maxSize: 1400, thumb: 520, quality: 82, format: 'webp',      // 'png' for flat-colour styles
  treatments: { default: (fx, ctx) => fx.kuwahara(4).posterize(5).duotone('#1b2a49', '#f2e8cf').grain(0.05) },
  pick: (ctx) => ctx.tags?.includes('night') ? 'night' : 'default',   // optional; ctx = { id, category, name, width, height, orientation, seed, rng, style }
};
```
Fx methods are chainable and queued (`await fx.run()` mid-recipe if you need `fx.clone()`):
`grayscale invert adjust({brightness,contrast,saturation,gamma,hue}) levels(black,white) posterize(n) gradientMap(stops,{contrast}) duotone(dark,light)
threshold(t,dark,light) quantize(paletteHex[],{dither:'none|bayer|noise',strength}) tint(color,opacity,mode) gradientOverlay(angle,stops,{mode,opacity})
resize(w,h) cover(aspect,{focusX,focusY}) pixelate(n) blur(sigma) sharpen median(n) convolve(kernel) emboss kuwahara(r) edges({threshold,thickness,color,mode:'overlay|only',paper})
halftone({cell,angle,ink,paper,color}) lineScreen({pitch,angle,ink,paper}) rgbSplit(dx,dy) chromatic(px) sliceShift({bands,maxShift}) scanlines grain(amount) vignette
texture('paper|canvas|speckle|scratches|cloud',{opacity,scale,mode,tintColor}) px((r,g,b,a,x,y)=>[r,g,b,a]) custom(async (fx)=>{...fx.data,fx.w,fx.h})`.
Blend modes: normal multiply screen overlay softlight add difference lighten darken. Randomness only via `fx.rng` (deterministic).
You may add your own helper functions inside recipe.mjs (write new per-pixel ops with `px`/`custom`). Look at `scripts/fx/index.mjs`.

Guidelines: faces must stay recognisable; the treatment should be *obviously the style* in thumbnails; vary by `ctx.tags`/`ctx.category`
(e.g. night shots, landscapes vs portraits) if it helps; keep each photo well under ~200KB. Styles that are about framing/lighting rather
than pixel filtering (skeuomorphism, neumorphism, isometric, 3D inflated) should keep photos natural (light grade only) and put the style in
CSS frames, shadows, 3D transforms, masks, SVG filters. Live effects (hover glitch, WebGL shimmer, parallax) go in `client.ts`/CSS.
You can verify a recipe quickly: `npm run images -- --style <id> --force`, then view a few files in `public/generated/<id>/`.

## 6. Assets & licensing (self-host everything)

Only **CC0 / public domain / SIL OFL / MIT/Apache** assets. Download into `src/themes/<id>/assets/`. Examples:
- Fonts: `https://cdn.jsdelivr.net/fontsource/fonts/<font-id>@latest/latin-<weight>-<normal|italic>.woff2` (fontsource id is lowercase-hyphen, e.g. `space-grotesk`). Fonts there are OFL/Apache. Take only the weights you use, latin subset, max ~4 files / 250KB total. Declare `@font-face` with `font-display: swap` and relative `url(./assets/..)`.
- Public-domain art/textures: Wikimedia Commons (check the file page says Public domain / CC0), The Met Open Access, Rijksmuseum, Smithsonian Open Access, NYPL, Library of Congress, Openverse CC0, Unsplash/Pexels (free licence - use sparingly, prefer CC0).
- SVG/icons: Lucide/Feather/Tabler (MIT), Heroicons (MIT), Phosphor (MIT), game-icons.net (CC BY - avoid), your own hand-written SVG (best).
- Prefer procedural: CSS gradients, SVG patterns/filters, canvas/WebGL, `Fx` textures - they are original and tiny.
Record **every** third-party asset in `meta.credits` (`name`, `kind`, `license`, `url`, `note`). The credits show up in the "About this style" panel and in CREDITS.md. If you cannot verify a licence, don't use it.
Budget: theme assets (fonts + images + svg + js) <= ~1.2MB total; page JS <= ~80KB gzip (<= 150KB if the style needs WebGL). No heavy libraries; write small vanilla code.

## 7. Quality bar checklist

- Distinct, committed art direction: palette, type, shape language, ornament, texture and motion all say the style; consistent details everywhere (buttons, forms, focus rings, selection colour, scrollbars if fitting, 404-like empty states).
- Layout is responsive 320px -> 1920px+; no horizontal scroll; touch targets >= 44px where practical; sticky/fixed elements never hide content or the UtilityBar.
- Accessibility: logical heading order, visible `:focus-visible` states in-style, body text contrast >= 4.5:1 (3:1 for large text) on solid backgrounds - **the readability of the facts matters more than the effect**; decorative layers `aria-hidden`; honour `prefers-reduced-motion` (stop/replace infinite animations, WebGL loops, parallax, glitch flicker); nothing flashes more than 3 times per second; don't rely on colour alone.
- Performance: lazy-load below-the-fold images, size images with width/height, avoid layout shift, no giant blurred/filtered full-viewport layers that tank phones, `will-change` sparingly.
- Photos look good: sensible crops (`object-position: p.focus`), consistent treatment, captions where it suits, no stretched or pixelated renderings.
- Feels *designed*: pay attention to typographic rhythm, spacing scale, alignment, hover/active states, scroll behaviour (`scroll-behavior: smooth` guarded by reduced-motion).

## 8. Final report (your last message, keep it short)
1. Files created. 2. Final `npm run check` summary line (0 failed required) + any WARN you chose to keep and why.
3. Fonts/assets used with licences (also in `meta.credits`). 4. Things you couldn't do / changes needed in shared code. 5. One line on the design idea.
