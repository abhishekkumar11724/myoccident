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

## Contact form
Get a free key at web3forms.com, copy `.env.example` to `.env`, set `PUBLIC_WEB3FORMS_KEY`. For GitHub Pages add it as a repository secret of the same name.
Without a key the form falls back to opening the visitor's email app.

## Deploy (not done yet - needs your go-ahead)
`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`. This repo should become `abhishekkumar11724/abhishekkumar11724.github.io`
(Settings -> Pages -> Source: GitHub Actions). Note `assets/` (your Instagram export) is git-ignored on purpose - never publish it.
