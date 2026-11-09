# Styles ("themes") and the daily rotation

> **Addresses in this doc** such as `/`, `/s/<style>/`, `/clean/` and `/gallery/` are relative to the site's base path, `/myoccident/`
> (so `/s/glitch/` is `https://abhishekkumar11724.github.io/myoccident/s/glitch/`). The base is set in `astro.config.mjs`.

A **style** (the code calls it a *theme*) is a complete, separate web design of your content - Brutalism, Glitch, Ukiyo-e, and so on. There are 19.
They share your content (`profile.ts`), your photos (`photos/`), and a few small components, but each owns its layout, CSS, fonts, behaviour and photo filter.

For the strict rulebook used to build the styles (hooks, accessibility, performance), see [THEME_GUIDE.md](THEME_GUIDE.md). It is phrased as a brief for the AI agents that built
them; the facts in it still apply to anyone adding a style.

---

## Anatomy of one style

```
src/themes/glitch/
├─ Page.astro     the full page: <html> ... </html>. Reads profile.ts + photos and lays them out.
├─ theme.css      all styles for this page (bundled with this page only - it cannot leak into other styles)
├─ client.ts      optional JavaScript (animations, viewers). Imported from Page.astro.
├─ meta.ts        data about the style: palette, fonts, "About this style" text, flavour lines, credits
├─ recipe.mjs     the photo filter (see PHOTOS-AND-FILTERS.md)
├─ assets/        fonts (.woff2), textures, SVGs used by this style, all self-hosted
└─ components/    (some styles) small helper components used only by this style
src/pages/s/glitch/index.astro      3-line route file that imports the page - do not edit
research/glitch.md                  the research note for the style
public/previews/glitch.jpg          its thumbnail in the gallery
```
Rules every style follows (the checker enforces them):
- `<h1>` with your name; `<main>`; sections marked `data-pf-section="hero|about|experience|skills|case-studies|projects|beyond-code|writing|contact"`.
- All resume content in the page, a resume download link, email/phone via `<Protected>`, a `<ContactForm>`, and the shared `<UtilityBar>` as the last thing in `<body>`.
- At least 24 photos with alt text, no network requests to other sites, no sideways scrolling on a phone, readable contrast, and animations that stop under "reduce motion".

### Things shared by all styles (change with care - they affect all 19)
| File | What it does |
|---|---|
| `src/components/UtilityBar.astro` | The pill with style name, About this style, Clean view, Gallery and prev/next. Each style re-colours it with CSS variables (`--pf-bar-bg`, `--pf-bar-fg`, `--pf-bar-accent`, ...). |
| `src/components/ContactForm.astro` | The contact form (Web3Forms or email-app fallback). Styled by each style through `.pf-form`, `.pf-input`, `.pf-submit` classes. |
| `src/components/Protected.astro` | Email/phone links that are decoded in the browser. |
| `src/components/ThemeHead.astro` | `<head>`: title, description, link-preview tags, favicon. |
| `src/lib/photos.ts` | How styles read the photo list. |
| `src/themes/_template/Page.astro` | The **Clean view** page (`/clean/`) and the starting point for a new style. |

### Changing a style's look
- **Colours / spacing / fonts**: `theme.css` (CSS variables are usually at the top).
- **Layout or wording**: `Page.astro`.
- **A font**: put the `.woff2` in `assets/`, add an `@font-face` in `theme.css` (`src: url(./assets/my-font.woff2)`), and add it to `credits` in `meta.ts` (use free fonts, e.g. from Fontsource, SIL OFL).
- **"About this style" text and credits**: `meta.ts`, then `npm run credits`.
- **Photo filter**: `recipe.mjs`.
After any edit, preview with `PF_ONLY=<style> npm run dev` and run `npm run check -- <style> --port 4321` while it is running.

---

## How the daily rotation works

1. `/` (`src/pages/index.astro`) contains a tiny inline script. It computes today's calendar day **in India time (IST, UTC+5:30)** and subtracts the launch day.
2. `n = days since LAUNCH_DATE`; the style shown is `styles[n mod number-of-styles]`, using the order in `THEMES` (`src/themes/order.ts`).
3. It then redirects to `/s/<style>/`. Everyone sees the same style on the same IST day, wherever they are.
4. Shortcuts: `/?style=glitch` (an unknown name falls back to today's), `/?clean`, `/?gallery`. With JavaScript off, `/` sends the visitor to `/clean/`.
5. `/gallery/` lists all styles and marks today's with a **Today** badge (same maths, inline in `src/pages/gallery.astro`).

Verified: day 0 (2026-11-10) = Brutalism; the 19-day cycle visits every style once and wraps; the switch happens at midnight IST.
Only styles that actually exist (a `Page.astro` **and** a route file) take part, and the count adapts automatically.

### Change the start date, the order, or the time zone
- **Launch date (day 0)** and **order**: `src/themes/order.ts` -> `LAUNCH_DATE` and the order of the `THEMES` list.
  Note: changing the list's order, length or the launch date changes *which style a given calendar date shows*.
- **Time zone**: the offset `5.5 * 3600 * 1000` and `T00:00:00+05:30` appear in **two** inline scripts: `src/pages/index.astro` and `src/pages/gallery.astro`. Change both.
  (Everyone then sees the same style per day in that zone.)
- The order was chosen so neighbouring days contrast in mood (no two similar styles back to back). Keep that in mind if you shuffle.

### Pause or hide a style without deleting it
Delete (or rename) just its route file, `src/pages/s/<style>/index.astro`. The style drops out of the rotation and the gallery shows it as "Coming soon". Restore the file to bring it back.

---

## Add a new style

1. Add an entry to `THEMES` in `src/themes/order.ts` (this is the only place it must be registered):
   ```ts
   { id: 'art-deco', name: 'Art Deco', era: '1920s - 1930s', blurb: 'One line for the gallery card.', swatch: ['#0b1d3a', '#d4af37', '#f3ead3'] },
   ```
   Position in the list = position in the daily order. The id is lowercase with dashes.
2. Scaffold it: `npm run new:theme -- art-deco`. This creates `src/themes/art-deco/` (a working page with every required hook, `theme.css`, `client.ts`, `meta.ts`, `recipe.mjs`, `assets/`),
   the route file `src/pages/s/art-deco/index.astro`, and `research/art-deco.md`.
3. Develop it: `PF_ONLY=art-deco npm run dev`, then open `http://localhost:4321/myoccident/s/art-deco/`. Replace the scaffold's layout completely (it is only a checklist of hooks) and write the filter in `recipe.mjs`.
4. Quality gate: `npm run check -- art-deco --port 4321` (see the README for what it checks), and look at the screenshots it writes to `/tmp/pf-shots/art-deco/`. Finish with `--previews` to create its gallery thumbnail.
5. Fill in `meta.ts` (palette, fonts, "About this style", credits) and run `npm run credits`.
The rotation and gallery pick it up automatically (the count in the gallery heading and the modulo both adapt).

## Remove a style

1. Delete `src/themes/<id>/`, `src/pages/s/<id>/`, `public/previews/<id>.jpg`, `research/<id>.md`.
2. Remove its entry from `THEMES` in `src/themes/order.ts`.
3. `npm run credits`. (Optionally delete `public/generated/<id>/` and `src/generated/manifest/<id>.json`; they are build output.)
The rotation shrinks to the remaining styles; which style appears on which date shifts.

## Reorder the styles
Move entries inside `THEMES`. No other file needs to change.

---

## Clean view and the gallery
- **Clean view** (`/clean/`) renders `src/themes/_template/Page.astro`: system fonts, high contrast, all content, unfiltered photos. Edit that file to change it. It is also what visitors without JavaScript get.
- **Gallery** (`src/pages/gallery.astro`) builds its cards from `THEMES` plus the screenshots in `public/previews/`. Run a style's check with `--previews` to refresh its thumbnail
  (`npm run check -- <id> --port 4321 --previews`).

## Where research and credits live
- `research/<id>.md`: the research behind each style (history, traits, palette, typography, references). `research/_inspiration.md`: portfolio patterns studied from recent.design, Pafolios and Awwwards.
- `CREDITS.md`: generated by `npm run credits` from every style's `meta.ts` `credits`. All third-party assets are free/open (fonts are SIL OFL or Apache) and self-hosted.
