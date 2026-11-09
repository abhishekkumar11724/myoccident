# Abhishek Kumar - portfolio

One web address, a **different art-styled website every day** (19 styles: Brutalism, Vaporwave, Bauhaus, Glitch, ... Isometric).
All 19 sites show the same content, so you edit your text and photos once.

**Live:** https://abhishekkumar11724.github.io/myoccident/ (GitHub repository `abhishekkumar11724/myoccident`, deployed by GitHub Actions on every push to `main`).
Because it lives under `/myoccident/`, local addresses carry that prefix too (see below).

> **Which doc do I need?**
> - Set it up and run it: [Quick start](#quick-start) (below)
> - Change my bio, jobs, projects, links, resume: [docs/EDITING-CONTENT.md](docs/EDITING-CONTENT.md)
> - Add, replace or remove photos / change the photo filters: [docs/PHOTOS-AND-FILTERS.md](docs/PHOTOS-AND-FILTERS.md)
> - Add, remove or reorder styles; change the rotation: [docs/THEMES-AND-ROTATION.md](docs/THEMES-AND-ROTATION.md)
> - Put it online: [docs/DEPLOY.md](docs/DEPLOY.md)
> - Something broke / what can't it do: [docs/LIMITATIONS-AND-TROUBLESHOOTING.md](docs/LIMITATIONS-AND-TROUBLESHOOTING.md)
> - Rules for building a theme (written as a brief for the AI agents that built them): [docs/THEME_GUIDE.md](docs/THEME_GUIDE.md)

## Quick start

**You need:** Node.js **22.23.4 or newer** (Node 24 recommended; this was built on Node 25) and npm. Nothing else for the site itself.
(Optional extras: Google Chrome or Brave on macOS for `npm run check`; Python 3 + `pip install pillow` for `tools/depad-instagram.py`.)

```bash
cd portfolio
npm install              # once
npm run dev              # renders the photo variants, then starts http://localhost:4321/myoccident/
```
- The **first** `npm run dev` / `npm run build` renders every photo in all 19 styles. Expect roughly 10 minutes on a laptop
  (about 30 s per style; an estimate from the build logs). Results are cached, so later runs take seconds.
- Open `http://localhost:4321/myoccident/` - it redirects to today's style. `http://localhost:4321/myoccident/gallery/` lists all 19.
  (The `/myoccident/` part is the `base` in `astro.config.mjs`; set it to `'/'` if the site ever moves to a root address.)

| Command | What it does |
|---|---|
| `npm run dev` | Render photo variants, then start the dev server with live reload |
| `npm run build` | Render photo variants + build the static site into `dist/` |
| `npm run preview` | Serve the built `dist/` locally (run `build` first) |
| `npm run images` | Only the photo step. Flags: `-- --style glitch`, `-- --photo portraits/01-selfie-maroon`, `-- --force` |
| `npm run new:theme -- <id>` | Scaffold a new style (see THEMES doc) |
| `npm run check -- <id> --port <p>` | Automated quality check of one style in real Chrome (dev server must be running) |
| `npm run check:all` | Build, then check every style + the Clean view |
| `npm run credits` | Regenerate `CREDITS.md` from each style's `meta.ts` |

Isolated work on one style (faster, and other styles can't interfere): `PF_ONLY=glitch npm run dev`.

## Project map (what is where)

```
portfolio/
├─ src/
│  ├─ content/
│  │  ├─ profile.ts          YOUR TEXT: bio, jobs, case studies, projects, skills, links, email/phone, resume path
│  │  └─ photos.ts           photo alt text / captions / tags + the gallery categories and their order
│  ├─ themes/
│  │  ├─ order.ts            the 19 styles in daily order + LAUNCH_DATE (day 0)
│  │  ├─ registry.ts         finds which styles exist; defines the ThemeMeta type
│  │  ├─ _template/Page.astro   the plain "Clean view" page (also the starting point for new styles)
│  │  └─ <style>/            ONE FOLDER PER STYLE (19):
│  │       Page.astro          the whole page layout for that style
│  │       theme.css           its styles          client.ts   its behaviour (optional)
│  │       meta.ts             palette, "About this style" text, flavour lines, credits
│  │       recipe.mjs          its PHOTO FILTER (applied to every photo at build time)
│  │       assets/             its fonts and textures (self-hosted)
│  ├─ pages/                 routes: index.astro (daily redirect), gallery.astro, clean.astro, 404.astro,
│  │                         s/<style>/index.astro (one tiny route file per style - do not edit)
│  ├─ components/            shared by all styles: UtilityBar (the style/Clean/Gallery bar), ContactForm,
│  │                         Protected (hides email/phone from scrapers), ThemeHead (page <head>)
│  ├─ lib/                   photos.ts (reads the photo list), urls.ts (base-path-safe links)
│  └─ generated/manifest/    BUILD OUTPUT: list of rendered photos (git-ignored)
├─ photos/<category>/NN-name.webp   YOUR ROOT PHOTOS (9 category folders, 60 photos)
├─ public/                   favicon.svg, og.jpg (link preview image), resume/*.pdf, previews/<style>.jpg (gallery thumbnails),
│                            generated/ = BUILD OUTPUT: the filtered photos per style (git-ignored, ~230 MB)
├─ scripts/                  build-images.mjs (photo pipeline), fx/index.mjs (filter toolkit), check-theme.mjs, check-all.mjs,
│                            new-theme.mjs, credits.mjs
├─ tools/depad-instagram.py  removes the blurred bars from photos exported from an Instagram backup
├─ research/                 one research note per style + _inspiration.md (portfolio patterns)
├─ docs/                     the guides listed at the top
├─ .github/workflows/deploy.yml   GitHub Pages deploy (runs on every push to main)
├─ astro.config.mjs          site URL and base path;  package.json / package-lock.json;  tsconfig.json
├─ .env.example              copy to .env and add your Web3Forms key (contact form)
└─ BRIEF.md (agreed plan)   PROGRESS.md (build log)   CREDITS.md (licences, generated)
```
`dist/`, `node_modules/`, `.astro/`, `.env`, `public/generated/` and `src/generated/manifest/*.json` are build output / local files and are git-ignored.

## "I want to..." cheat-sheet

| I want to... | Do this | Details |
|---|---|---|
| Change my bio / tagline / stats | Edit `src/content/profile.ts` | [EDITING-CONTENT](docs/EDITING-CONTENT.md) |
| Add a job, project, case study, skill | Add an object to the matching list in `profile.ts` | [EDITING-CONTENT](docs/EDITING-CONTENT.md) |
| Change email / phone / LinkedIn / GitHub | `profile.ts` -> `contact` | [EDITING-CONTENT](docs/EDITING-CONTENT.md#contact-details) |
| Replace my resume PDF | Overwrite `public/resume/Abhishek-Kumar-Resume.pdf` | [EDITING-CONTENT](docs/EDITING-CONTENT.md#resume-pdf) |
| Replace my main portrait | Overwrite `photos/portraits/01-selfie-maroon.webp` (and `02`, `03`) keeping the **same filename**, then `npm run images` | [PHOTOS-AND-FILTERS](docs/PHOTOS-AND-FILTERS.md#replace-a-photo) |
| Add new photos | Drop into `photos/<category>/`, add alt text in `photos.ts`, `npm run images` | [PHOTOS-AND-FILTERS](docs/PHOTOS-AND-FILTERS.md#add-a-photo) |
| Change how a style filters my photos | Edit `src/themes/<style>/recipe.mjs`, then `npm run images -- --style <style>` | [PHOTOS-AND-FILTERS](docs/PHOTOS-AND-FILTERS.md#change-a-styles-photo-filter) |
| Change the order / start date | `src/themes/order.ts` | [THEMES-AND-ROTATION](docs/THEMES-AND-ROTATION.md) |
| Add or remove a style | `npm run new:theme` / delete its folders | [THEMES-AND-ROTATION](docs/THEMES-AND-ROTATION.md#add-a-new-style) |
| Turn on the contact form | Put a Web3Forms key in `.env` | [DEPLOY](docs/DEPLOY.md#contact-form-key) |
| Publish a change | Commit and `git push` to `main`; the workflow redeploys | [DEPLOY](docs/DEPLOY.md) |

## How it works in one minute
- **Content** lives once in `profile.ts`. Each style's `Page.astro` reads it and lays it out its own way.
- **Photos** live once in `photos/`. At build time `scripts/build-images.mjs` runs each style's `recipe.mjs` over every photo and writes the
  result to `public/generated/<style>/`. Replace a photo, rebuild, and all 19 styles update. Live effects (hover colour reveal, glitch, WebGL) are CSS/JS in each style.
- **Daily rotation** is a small script on `/` (`src/pages/index.astro`): it takes today's date in India time (IST), subtracts `LAUNCH_DATE`, and picks
  `styles[days % 19]`, then redirects to `/s/<style>/`. No server and no rebuild is needed for the daily change. `/?style=glitch` forces one,
  `/?clean` and `/?gallery` jump to those pages.
- **Clean view** (`/clean/`) is a plain, fast, readable version of the same content. Visitors with JavaScript off are sent there.
- **Shared bar** on every page (`UtilityBar`): style name, "About this style", Clean view, Gallery, previous/next style.

## The 19 styles (daily order; day 0 = 2026-11-10 IST)
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
that feeds the "About this style" panel and `CREDITS.md`.

## Quality checks
`npm run check -- <id> --port <p>` drives real Chrome against a style (desktop, phone, reduced-motion) and verifies required sections, all resume
content present, >= 24 photos with alt text, no console errors / failed / external requests, no sideways scrolling at 390 px, fonts, WCAG contrast measured on the
real rendered pixels, reduced-motion behaviour, and writes screenshots to `/tmp/pf-shots/<id>/`. `npm run check:all` builds the site and runs it for every style.
(It looks for Chrome/Brave at macOS paths; see the troubleshooting doc for other systems.)

## Things to know
- Case-study and project copy was written only from your resume, LinkedIn and public GitHub READMEs. Personal lines (interests, "Beyond code" captions,
  playful per-style flavour text) were written from your photos: **edit them to be yours**.
- Some styles include small interactive sketches (e.g. the Neumorphism case-study consoles). They are labelled "illustrative" and only use numbers from your resume.
- The original Instagram export was deleted from this project (the 60 photos you need are in `photos/`). `.gitignore` still ignores an `assets/` folder, so a re-added export won't be committed; never publish one.
- Limits and known rough edges (browser coverage, SEO, photos referenced by name, page weight): [docs/LIMITATIONS-AND-TROUBLESHOOTING.md](docs/LIMITATIONS-AND-TROUBLESHOOTING.md).
- Licences and credits: `CREDITS.md` (all fonts are free/open and self-hosted; no external requests at runtime).
