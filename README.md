# Abhishek Kumar - portfolio

One URL, a new art-styled website every day (19 styles). All sites render the same content.

```bash
npm install
npm run dev          # builds photo variants, starts http://localhost:4321
npm run build        # builds photo variants + static site into dist/
npm run preview      # serve dist/
```

## How it fits together
| What | Where |
|---|---|
| Your content (bio, experience, case studies, projects, skills, links) | `src/content/profile.ts` - edit once, all 19 themes update |
| Photos (the "root" images) | `photos/<category>/NN-name.webp` + alt text in `src/content/photos.ts` |
| Themes | `src/themes/<id>/` (Page.astro, theme.css, meta.ts, recipe.mjs, assets/) |
| Daily rotation order, launch date | `src/themes/order.ts` (`THEMES` is the order, `LAUNCH_DATE` is day 0) |
| Style research notes | `research/<id>.md` (+ `research/_inspiration.md`) |
| Image effects library | `scripts/fx/index.mjs`, pipeline `scripts/build-images.mjs` |
| Acceptance checks | `npm run check -- <id> --port <p>` (see `docs/THEME_GUIDE.md`) |

## Change a photo
Replace/add a file in `photos/<category>/` (same name to replace), run `npm run images` (or just `npm run dev` / `npm run build`).
Every theme regenerates its own treatment of it automatically. Photos exported from an Instagram backup have blurred bars:
run `python3 tools/depad-instagram.py in.webp out.webp` first. Add alt text in `src/content/photos.ts` (optional but recommended).

## How "a new site every day" works
`/` runs a tiny script that computes today's style from the IST calendar day (day 0 = `LAUNCH_DATE`, then cycles in `THEMES` order) and
redirects to `/s/<style>/`. Everyone gets the same style on the same day. `/?style=glitch` opens one, `/gallery/` lists all, `/clean/` is the
plain readable version (also what JavaScript-less visitors get). No server and no rebuild needed for the daily change.

## The 19 styles (daily rotation order, day 0 = 2026-11-10 IST)
| Day | Style | Era | Idea |
|---|---|---|---|
| 0 | [Brutalism](research/brutalism.md) (`brutalism`) | 1950s - now | Raw concrete energy: default fonts, hard borders, honest structure. |
| 1 | [Vaporwave](research/vaporwave.md) (`vaporwave`) | 2010s | Pastel-neon sunsets, grids, marble busts and 90s software nostalgia. |
| 2 | [Bauhaus](research/bauhaus.md) (`bauhaus`) | 1919 - 1933 | Circles, triangles, squares, primary colours and a strict grid. |
| 3 | [Glitch](research/glitch.md) (`glitch`) | 1990s - now | Broken signal: RGB splits, scan lines and corrupted frames. |
| 4 | [Mid-century](research/mid-century.md) (`mid-century`) | 1945 - 1969 | Atomic-age warmth: teak, mustard, boomerangs and clean sans-serifs. |
| 5 | [Psychedelic](research/psychedelic.md) (`psychedelic`) | 1960s | Swirling, saturated, hand-lettered, everything breathing. |
| 6 | [Neumorphism](research/neumorphism.md) (`neumorphism`) | 2019 - now | Soft extruded UI: one surface, light and shadow doing all the work. |
| 7 | [Grunge](research/grunge.md) (`grunge`) | 1990s | Photocopied zines, torn tape, dirty textures and marker scrawl. |
| 8 | [Art Nouveau](research/art-nouveau.md) (`art-nouveau`) | 1890 - 1910 | Whiplash curves, botanical ornament and sinuous hand-drawn borders. |
| 9 | [Memphis](research/memphis.md) (`memphis`) | 1981 - 1988 | Squiggles, confetti, clashing colour and gleeful anti-minimalism. |
| 10 | [Steampunk](research/steampunk.md) (`steampunk`) | Victorian-futurist | Brass, gears, rivets and sepia: an industrial-age dream machine. |
| 11 | [Paper cutout](research/paper-cutout.md) (`paper-cutout`) | Matisse - now | Layered hand-cut paper with torn edges and soft drop shadows. |
| 12 | [Liquid chrome](research/liquid-chrome.md) (`liquid-chrome`) | Y2K | Molten metal, reflective type and a bright future on a black void. |
| 13 | [De Stijl](research/de-stijl.md) (`de-stijl`) | 1917 - 1931 | Mondrian grids: black lines, white fields, red, yellow and blue. |
| 14 | [Skeuomorphism](research/skeuomorphism.md) (`skeuomorphism`) | 2007 - 2013 | Interfaces that imitate real objects: leather, glass, stitching, felt. |
| 15 | [Anti-design](research/anti-design.md) (`anti-design`) | 2010s - now | Deliberately off-grid: clashing type, overlaps and controlled chaos. |
| 16 | [Ukiyo-e](research/ukiyo-e.md) (`ukiyo-e`) | 1600s - 1800s | Edo-period woodblock prints: indigo, flat colour and bold outlines. |
| 17 | [3D Inflated](research/inflated-3d.md) (`inflated-3d`) | 2020s | Puffy, balloon-like objects with glossy highlights and soft pastel light. |
| 18 | [Isometric](research/isometric.md) (`isometric`) | Technical drawing - now | A tilted 30-degree world built from cubes, platforms and tiny stages. |

Each style has a research note in `research/` (origins, traits, palette, type, motion, pitfalls, references) and its own `meta.ts`
that feeds the "About this style" panel and `CREDITS.md`. Inspiration notes for portfolio patterns: `research/_inspiration.md`.

## Quality gates
`npm run check -- <id> --port <p>` drives real Chrome against a theme (desktop, phone, reduced-motion) and verifies required sections, all resume
content present, >= 24 photos with alt text, no console errors / failed / external requests, true 390px overflow, fonts, pixel-sampled WCAG contrast over real
backdrops, reduced-motion behaviour, and writes screenshots to `/tmp/pf-shots/<id>/`. `npm run check:all` builds the site and runs it for every theme.

## Things to know
- `src/content/profile.ts` is the single source of truth. Case-study and project copy was written only from the resume, LinkedIn and your public GitHub READMEs.
  Personal lines (interests, "Beyond code" captions, playful flavour text per theme) were written from your photos and are meant to be edited by you.
- Some themes include small interactive sketches (e.g. the Neumorphism case-study consoles). They are labelled "illustrative" and only use numbers from the resume.
- `public/generated/` (~230 MB of photo variants) and `src/generated/manifest/` are build output, git-ignored, and cached in CI.
- `assets/` is your private Instagram export: git-ignored, never published. Remove it from the repo folder entirely before sharing the project anywhere.
- Credits and licences: `CREDITS.md` (generated by `npm run credits`).

## Contact form
Get a free key at web3forms.com, copy `.env.example` to `.env`, set `PUBLIC_WEB3FORMS_KEY`. For GitHub Pages add it as a repository secret of the same name.
Without a key the form falls back to opening the visitor's email app.

## Deploy (not done yet - needs your go-ahead)
`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`. This repo should become `abhishekkumar11724/abhishekkumar11724.github.io`
(Settings -> Pages -> Source: GitHub Actions). Note `assets/` (your Instagram export) is git-ignored on purpose - never publish it.
