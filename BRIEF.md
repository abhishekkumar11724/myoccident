# Portfolio brief (agreed 2026-11-09)

Abhishek Kumar's portfolio. Goes on his resume. Originally meant to replace `abhishekkumar11724.github.io` (then a 404); it is now published at
`https://abhishekkumar11724.github.io/myoccident/` (repository `abhishekkumar11724/myoccident`, which used to hold his 2023 portfolio; see docs/DEPLOY.md).

**Concept:** one URL; a different art-style website every day, chosen by date (IST), cycling through 19 styles.
A gallery lets visitors preview any style; `?style=<id>` deep-links one. A persistent **Clean view** shows a plain, readable version.

| # | Style | # | Style |
|---|-------|---|-------|
| 1 | Skeuomorphism | 11 | Paper cutout |
| 2 | Neumorphism | 12 | Glitch |
| 3 | Art Nouveau | 13 | Anti-design |
| 4 | Liquid chrome | 14 | 3D inflated |
| 5 | De Stijl | 15 | Isometric |
| 6 | Memphis | 16 | Ukiyo-e |
| 7 | Psychedelic | 17 | Brutalism |
| 8 | Vaporwave | 18 | Bauhaus |
| 9 | Steampunk | 19 | Mid-century |
| 10 | Grunge | | |

## Decisions
- 19 distinct layouts over ONE shared content source (`src/content/`). Edit content once, all themes update.
- Astro + TypeScript, static output for GitHub Pages at the user root.
- Photo effects: a Node/`sharp` build step makes per-style variants of every photo in `photos/` using each theme's `recipe.mjs`; live effects (CSS/SVG/WebGL) run in the browser. **Replace a photo in `photos/`, rebuild, every theme restyles it automatically.**
- Art-first themes + a persistent "Clean view" toggle. Respect `prefers-reduced-motion`; nothing flashes > 3×/s.
- Sections everywhere: hero, about, experience, skills, resume download, contact + case studies (resume facts only), GitHub projects, "Beyond code" photos, writing stub.
- Contact: obfuscated email, LinkedIn, GitHub, phone, Web3Forms form (key added later; mailto fallback until then).
- Voice: professional + light personality. Facts identical in every theme; small per-theme flavour lines.
- Each theme has an "About this style" panel (history, traits, credits).
- Assets: only CC0 / public domain / OFL / MIT, self-hosted, logged in `CREDITS.md`.
- Run mode: research all styles -> foundation -> all themes, one local git commit per theme, progress in `PROGRESS.md`.
- Allowed unattended: npm installs, builds/dev server, downloading free-licensed assets, local git commits.
- **NOT allowed without asking: pushing / deploying to GitHub.** (The owner later asked explicitly for the push to `myoccident`; that request covered that repository only.)
- Friends/family in posts agreed to appear. Alcohol photos excluded. The Instagram export that photos were picked from was private and has since been deleted from the project (and was never committed); never open DM folders if one is ever re-added.
