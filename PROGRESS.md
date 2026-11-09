# Progress log

Started 2026-11-09. One local git commit per theme. Nothing is pushed or deployed.

## Foundation
- [x] Brief, repo, Astro 7 + sharp, content model (`src/content/profile.ts`)
- [x] 60 curated photos (de-padded) + metadata, FX image library, image pipeline
- [x] Rotation loader, gallery, Clean view, shared components (UtilityBar, Protected, ContactForm, ThemeHead)
- [x] Acceptance checker (`npm run check`), theme scaffolder, theme guide
- [x] Inspiration research (`research/_inspiration.md`)

## Themes (rotation order)
| # | Style | Research | Theme | Check | Notes |
|---|-------|----------|-------|-------|-------|
| 1 | Brutalism (`brutalism`) | done | done | 42 pass, 0 fail (1 warn: honeypot, now ignored) | Poured-concrete building: floor-directory rail, acid-yellow signal, concrete-cast photos |
| 2 | Vaporwave (`vaporwave`) | done | done | 42 pass, 0 fail (1 warn: outlined wordmark contrast, judged legible) | Dream-mall sunset desktop: fake-OS windows, taskbar/Start menu, sunset/midnight toggle |
| 3 | Bauhaus (`bauhaus`) | done | done | 43 pass, 0 fail | Exhibition-poster composition, numbered contents nav with shape previews, two-ink halftone photos in geometric masks |
| 4 | Glitch (`glitch`) | done | done | 42 pass, 0 fail | Terminal/VHS: htop experience, hexdump skills, one-shot glitch bursts, photos decode on hover; reduced-motion static |
| 5 | Mid-century (`mid-century`) | done | done | 43 pass, 0 fail | 1962 annual report: sunburst dial clock, scoreboard of key numbers, itinerary timeline, six-ink screen-print photos |
| 6 | Psychedelic (`psychedelic`) | done | done | 43 pass, 0 fail | 1967 Fillmore bill: set-list chapter names, stretched wobbly lettering, heat-mapped halftone photos in arches |
| 7 | Neumorphism (`neumorphism`) | done | done | 43 pass, 0 fail | One soft surface, scroll-reactive knob hero, dock nav, working mini-UI mock per case study (labelled illustrative) |
| 8 | Grunge (`grunge`) | done | done | 43 pass, 0 fail | Photocopied zine on a plaster wall: ransom-note name, torn scraps, record-sleeve experience, xerox photos |
| 9 | Art Nouveau (`art-nouveau`) | done | done | 43 pass, 0 fail | Gilded botanical folio: growing vines, Mucha-style roundel portrait, plates I-VIII, lithograph photos |
| 10 | Memphis (`memphis`) | done | done | 43 pass, 0 fail | Milan laminate showroom: terrazzo hero, zigzag nav, sticker-sheet duotone photos, folder-tab experience, copy-email button |
| 11 | Steampunk (`steampunk`) | done | done | 43 pass, 0 fail | Airship chart room: porthole portrait, working clock + gauges, timetable experience, blueprint case studies (removed an invented reply-time claim) |
| 12 | Paper cutout (`paper-cutout`) | done | done | 43 pass, 0 fail | Layered coloured paper, cut edges, letter-tile name, bookmark nav, draggable scrapbook (grid fallback on touch) |
| 13 | Liquid chrome (`liquid-chrome`) | done | done | 43 pass, 0 fail | WebGL mercury blob (static + CSS fallback), chrome type, oversized case-study index, CD-ROM project cards |
| 14 | De Stijl (`de-stijl`) | todo | todo | todo | |
| 15 | Skeuomorphism (`skeuomorphism`) | todo | todo | todo | |
| 16 | Anti-design (`anti-design`) | todo | todo | todo | |
| 17 | Ukiyo-e (`ukiyo-e`) | done | done | 43 pass, 0 fail, 0 warn | Woodblock sheets on washi: Fuji/Great Wave hero, Tokaido road timeline, emaki photo scrolls, woodblock photo recipe |
| 18 | 3D Inflated (`inflated-3d`) | todo | todo | todo | |
| 19 | Isometric (`isometric`) | todo | todo | todo | |


## Incidents
- Pilot found theme CSS leaking between pages (single dynamic route bundled every theme's CSS) -> fixed with one static route per theme; verified in a production build.
- AWS SSO token expired mid-run and killed the last 5 theme agents (De Stijl, Skeuomorphism, Anti-design, 3D Inflated, Isometric) after their files were written; they were resumed from their transcripts.
- Checker upgraded: true 390px overflow measure; pixel-sampled contrast over real rendered backdrops.
- One invented claim ("Replies within 48h", from my own brief) removed from Steampunk; all themes grepped for similar claims.
