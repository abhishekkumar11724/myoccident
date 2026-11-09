# Limitations and troubleshooting

An honest list of what this project does **not** do, what was **not** tested, and fixes for problems you might hit.

---

## Not tested / not verified

| Area | Status |
|---|---|
| **Browsers** | Tested only in **Chrome** (desktop 1440 px, phone 390 px emulation, and "reduce motion"). **Not tested:** Safari (including iPhone), Firefox, Edge, real phones. |
| **Higher-risk features** elsewhere | WebGL blob in *Liquid chrome* (has a CSS fallback and a still frame for "reduce motion"); SVG filters (*3D Inflated*, *Paper cutout*, *Grunge*); `overflow-x: clip` (needs Safari 16+); container queries (*Brutalism*); heavy `backdrop-filter` in the shared bar. Try these on an older phone before you rely on them. |
| **Accessibility** | Automated only: headings/landmarks, alt text, keyboard-reachable controls, "reduce motion", and contrast **measured on the real rendered pixels**. **Not** tested with a screen reader or by a person tabbing through each style. |
| **Look & taste** | Reviewed through screenshots and automated checks, not by you. Your own pass through all 19 styles is the real review. |
| **Facts in photo captions** | Landmarks such as "Hawa Mahal", "Jal Mahal" and "Jaipur" were inferred from the pictures. Check captions/alt text in `src/content/photos.ts`. |
| **"About this style" history** | Written by research agents with limited web access; a couple of details are flagged as unverified in the research notes (for example who coined "neumorphism"). Skim before publishing. |
| **Live deployment** | Published to `abhishekkumar11724/myoccident` (see [DEPLOY.md](DEPLOY.md)). The browser checks above ran on a local production build, not on github.io itself. |

## Known limitations

### Rotation and search engines
- The daily switch needs **JavaScript**. With it off, visitors get the Clean view.
- Bots and link-preview scrapers that don't run scripts see only the tiny loading page at `/` (title, description, one link-preview image, `public/og.jpg`), **not** your content.
  Pages `/clean/` and `/s/<style>/` can be indexed directly. Every page's canonical link points to the site home page (`https://abhishekkumar11724.github.io/myoccident/`). Search ranking was not a design goal.
- Time zone is fixed to **IST**; there is no per-visitor "remember my style". Changing the zone means editing two files ([THEMES-AND-ROTATION.md](THEMES-AND-ROTATION.md#change-the-start-date-the-order-or-the-time-zone)).
- Changing the order, the launch date, or the number of styles changes which style appears on which date.

### Photos
- **24 photos are referenced by name** by one or more styles (list in [PHOTOS-AND-FILTERS.md](PHOTOS-AND-FILTERS.md#remove-a-photo---read-this-first)). Deleting or renaming one **breaks the build** with `Unknown photo "..."` (tested).
- **A new folder is invisible** in the grouped galleries until you add it to `categoryOrder` and `categoryInfo` in `src/content/photos.ts`.
- **All 60 photos appear in every style**, so pages are long (about 14,000-30,000 px tall on a desktop and 22,000-39,000 px on a phone) and carry photo weight:
  thumbnails total about 1.4-4.5 MB for most styles and **about 10 MB for De Stijl** (it uses PNG). Grids lazy-load; full-size images load only for heroes and viewers.
- **Filters are applied at build time.** Changing a filter needs `npm run images`; the first full render takes roughly 10 minutes, and editing `scripts/fx/index.mjs` re-renders all 19 styles.
- Some filters are intentionally abstract (Ukiyo-e, De Stijl, Glitch, Psychedelic). Faces in small group shots can become hard to recognise there - that is the style, not a bug.
- Photos are not cropped to a fixed shape by the pipeline; each style crops with CSS (`object-position` from the `focus` setting).

### Content
- Adding a **case study** or **project** works in all 19 styles, but *Isometric*, *Steampunk* and *Neumorphism* draw custom illustrations for the existing items only: new items get the text without a custom illustration.
  Removing existing items is safe (both tested). See [EDITING-CONTENT.md](EDITING-CONTENT.md).
- **Blog posts**: 14 styles list `writing.posts`; *De Stijl, Liquid chrome, Memphis, Neumorphism, Paper cutout* don't.
- The four headline numbers (`~5M`, `1000+`, `150+`, `~68%`) are hard-coded in the checker; change your `stats` and update `scripts/check-theme.mjs` too.
- Per-style flavour text lives in each style, so editing `profile.ts` doesn't change it ([EDITING-CONTENT.md](EDITING-CONTENT.md#text-that-is-not-in-profilets)).
- Some mini-demos are decorative: the Neumorphism case-study consoles (including their example text), Isometric dioramas, Steampunk schematics. They are labelled "illustrative" where they could be mistaken for fact and use only your resume's numbers.
- The "projects" list is a snapshot of your public GitHub as of the build; it does not update by itself.

### Contact
- The form depends on a third party (Web3Forms). Without a key it opens the visitor's email app. If the service is down the form tells the visitor to email you directly.
- Email/phone encoding only stops simple scrapers; both are visible to any browser.

### Tooling
- `npm run check` looks for Chrome or Brave at **macOS paths** (`scripts/check-theme.mjs`, the `CHROME` list near the top). On Windows/Linux, edit that list.
- `npm run check:all` serves the build on port 4488 (override with `PORT=...`).
- `tools/depad-instagram.py` needs Python 3 + Pillow and only auto-detects the padding on 1440 px-square Instagram exports; for other images it leaves them untouched (use `--box`).
- Needs **Node 22.23.4+** (Astro 7). The photo script imports a TypeScript file directly, which older Node can't do.
- No analytics, cookies or tracking. That's deliberate, so you also get no visitor numbers.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Build/dev stops with `Unknown photo "portraits/..."` | A style refers to a photo that is no longer in `photos/` | Put a file back **with the same name** (or replace it), then `npm run images` |
| Broken or missing photos in one style | That style's generated images are missing/stale | `npm run images -- --style <id>` (add `--force` if needed) |
| First `npm run dev` / `build` takes ages | It renders 60 photos x 19 styles the first time | Wait (roughly 10 minutes); later runs reuse the cache. Work on one style with `PF_ONLY=<id> npm run dev` |
| My `profile.ts` edit shows nothing | Syntax slip (missing comma/quote) or stale tab | Check the terminal for the error line; hard-refresh the browser |
| A new photo doesn't appear | Wrong folder, not in `categoryOrder`, or `npm run images` not run | See [PHOTOS-AND-FILTERS.md](PHOTOS-AND-FILTERS.md#add-a-photo); check the folder is listed in `categoryOrder` |
| Alt text shows the file name | No `photoMeta` entry for that photo | Add one in `src/content/photos.ts` |
| Port 4321 busy / "another dev server is running" | A previous dev server is still alive | Stop it, or `npx astro dev --port 4400 --ignore-lock` |
| Errors about Node version or `.ts` files | Node is too old | Install Node 22.23.4+ (24 recommended) |
| `npm run check` says "No Chrome/Brave found" | Chrome isn't at the macOS default path | Install Chrome, or edit the `CHROME` paths in `scripts/check-theme.mjs` |
| `npm run check` fails once with "Execution context was destroyed" or a timeout | The dev server reloaded or the machine was busy during the run | Run it again, ideally with only one dev server running |
| Contact form doesn't send | No/invalid key (without one it should open your email app instead) | Check `.env` has `PUBLIC_WEB3FORMS_KEY`, restart the dev server; on GitHub set the repository secret of the same name |
| Today shows a different style than I expect | Rotation uses the **IST** date, `LAUNCH_DATE`, the list order and the number of styles that exist | See [THEMES-AND-ROTATION.md](THEMES-AND-ROTATION.md); force one with `/?style=<id>` |
| A style is missing from rotation, or the gallery says "Coming soon" | It needs **both** `src/themes/<id>/Page.astro` and `src/pages/s/<id>/index.astro` | Restore the missing file (the route file is the same 3 lines in every style) |
| Instagram photo has blurry side bars | Instagram padded it to a square | `python3 tools/depad-instagram.py in.webp out.webp` |
| `npm run credits` fails | A style's `meta.ts` has a syntax error | Fix the file named in the error |
| Disk is full | `public/generated` (~230 MB), `dist` (~280 MB), `node_modules` (~250 MB) | Delete `dist` and `public/generated` freely (they rebuild); keep `node_modules` while developing |

## Where to look when something is odd
- Browser console + the terminal running `npm run dev` show nearly every error with a file and line.
- `PROGRESS.md` is the log of how the project was built (including bugs found and fixed); `BRIEF.md` is the agreed plan.
- `research/<style>.md` explains *why* a style looks the way it does.
