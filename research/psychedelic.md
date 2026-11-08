# Psychedelic (San Francisco poster art, c. 1965-1972)

## Definition
Psychedelic art ("mind-revealing", a word coined by Humphry Osmond) is the visual language of the mid-1960s counterculture: saturated, clashing colour; hand-lettering that melts, interlocks and fills its shape; strict symmetry (mandalas, sunbursts, concentric rings) next to flowing Art Nouveau curves; paisley, flowers, eyes and horror-vacui ornament. It was made to be seen under a light show, at volume, and in a crowd, so it shouts first and is read second. On a portfolio the trick is to keep that loudness in the *decoration and display lettering* and give every fact a calm, high-contrast surface.

## Origins & timeline
- 1943-1950s: Albert Hofmann's LSD; Huxley's *The Doors of Perception* (1954); Oscar Janiger's studies where 50 artists painted a subject sober and on LSD. The word "psychedelic" enters popular use.
- 1895-1900s: Alphonse Mucha's *Gismonda* poster (1 Jan 1895) gives the template: a decorative arch/halo behind the head, hair curling in arabesques that fill the frame, ornamental borders. His 1960s rediscovery by the SF poster artists is the root of the "Art Nouveau revival" strand.
- 1965: Op art goes mainstream with MoMA's *The Responsive Eye* (23 Feb-25 Apr 1965; 180,000 visitors): Bridget Riley, Vasarely, Anuszkiewicz. Josef Albers (Yale) teaches chromatic vibration to Victor Moscoso and others. Bill Ham stages the first kinetic light shows at the Red Dog Saloon; Chet Helms then books him at the Avalon Ballroom.
- 1965-66: Wes Wilson's print-shop flyers and the Family Dog (Helms, Avalon) / Bill Graham (Fillmore) dance-concert posters. Wilson develops lettering where letters "melt", fill a block and demand effort to read ("something people had to stop to figure out"), reworking Alfred Roller's Secession block lettering.
- 1966: Stanley Mouse + Alton Kelley begin posters for the Family Dog (Mucha and Edmund Sullivan as sources, plus a Zig-Zag papers reference; later the Dead's skeleton-and-roses). Bonnie MacLean (Fillmore, 30+ posters, mostly 1967) draws plumes, curving letters, stained-glass roundels and pointed arches.
- 1967: Moscoso's Neon Rose series for the Matrix and Family Dog posters; first rock-poster artist with formal training and the first to use photographic collage. Human Be-In poster (Griffin, Jan). Summer of Love. *Life* (1 Sept 1967) puts the poster artists on its cover. Mouse, Kelley, Griffin, Moscoso and Wilson form the Berkeley Bonaparte agency.
- 1968: Rick Griffin's Flying Eyeball Hendrix poster (Fillmore, Feb); Heinz Edelmann (art director, with George Dunning) makes *Yellow Submarine* - the clean-line, collage-and-cell-switching, European answer to the Californian poster; he changed technique every ~5 minutes. Peter Max's Day-Glo cosmic pop (flowers, rainbows, planets) goes mass-market (Life cover, 5 Sept 1969).
- Late 1960s-1970s: the look is absorbed into advertising (GE clocks, Campbell's, cars, hair products) and dies as a counter-culture signal by the mid-1970s. Later echoes: blacklight posters, 1990s rave flyers, fractal art, DeepDream, and the current retro revival in branding.
- Paisley (boteh): Persian/Kashmiri teardrop, copied in Paisley, Scotland (Jacquard looms after 1820); revived by the Beatles and hippie fashion in 1967.

## Defining visual traits
- **Lettering that fills its shape**: letters distorted, swollen and interlocked so a whole line becomes a solid block; counters and gaps filled by neighbouring letters; negative and positive space swapped. (Wilson, MacLean, Griffin.)
- **Vibrating complementary colour**: hot pink next to turquoise, orange next to blue, yellow next to violet, at equal brightness so edges seem to buzz (Albers/Moscoso).
- **Concentric rings, sunbursts, radial rays and mandalas**: strict radial symmetry as halo behind a head or as the whole poster.
- **Art Nouveau flow**: whiplash curves, arches, hair as arabesque, ornamental borders, stained-glass roundels (Mucha, MacLean).
- **Paisley, flowers, eyes, peacock plumes, drips and melting edges**; horror vacui - every corner is filled.
- **Collage and photographic cut-ins** (Moscoso, Edelmann); hand-inked line with flat fills (Edelmann/Max) vs. dense hatching (Griffin).
- **Light-show fluidity**: slow blooming oil-and-dye blobs between two glass dishes on an overhead projector; colour blobs that morph without hard edges.

## Colour
Palette (all hex used on the site):

| Role | Hex |
|------|-----|
| Ink (text, outlines) - deep grape black | `#1c0838` |
| Night violet (page base) | `#2a0d63` |
| Poster paper (text panels) | `#fff3d1` |
| Hot pink | `#ff2e93` |
| Magenta-red (deep) | `#d4106a` |
| Tangerine | `#ff7a12` |
| Sun yellow | `#ffd91f` |
| Turquoise | `#10d9c4` |
| Electric violet | `#7a3cff` |
| Cobalt (cool vibrate partner for orange) | `#2f5bff` |
| Acid lime (sparing) | `#b6f43a` |

Combinations that work: yellow/orange/pink gradient lettering with ink outline + a turquoise or cobalt "echo" offset; turquoise field + pink/orange ornament; violet field + yellow/orange. Body text only ever ink on paper (`#1c0838` on `#fff3d1`, about 15:1) or paper on ink. Large display lettering is always value-separated from its field (light fill with dark outline on dark fields) so the vibration happens at the *edges*, not in the letter body.
Avoid: pure red text on blue or green (chromostereopsis - red advances, blue recedes, different per viewer and glasses), thin text on any gradient or pattern, neon-on-neon body copy, large areas of red/cyan at equal brightness behind text.

## Typography
Historic: Wes Wilson's own melting block capitals; Victor Moscoso's slab/Tuscan capitals; Bonnie MacLean's curving Nouveau script; Art Nouveau display faces (Arnold Boecklin, Victorian wood type); Cooper Black / Windsor on 1970s revival work; Helvetica for the cool Pop counterpoint.
Chosen (all SIL OFL, self-hosted, latin subset via fontsource):
- **Chango 400** (Fontstage) - wide, ultra-heavy, soft-cornered capitals; the stretched-and-filled lettering on every h1/h2 (set in SVG with `textLength` so glyphs stretch to fill a rectangle, like Wilson's blocks).
- **Shrikhand 400** (Jonny Pinhorn) - fat italic Tuscan-ish display with Nouveau swing; card titles, nav, buttons, numerals.
- **Fraunces 400 / 700** (Undercase Type) - soft "wonky" old-style serif with 1970s warmth; all body copy at 17-19px/1.6 on poster paper.
Pairing logic: wild lettering only at display size (>= 28px, mostly 56-130px), calm serif for facts. No italics of Fraunces (budget) - emphasis is weight or Shrikhand.

## Layout & composition
- Poster logic, not dashboard logic: each section is a *full-bleed colour field* (turquoise, violet, hot pink to orange, sun yellow...) with its own ornament, and the text lives on **paper panels** with a thick ink outline and a hard coloured offset shadow, as if the sheet were pasted on a poster.
- Sections are joined by **drip dividers**: three layered wavy bands (pink / orange / yellow) as if the colour were melting down into the next field.
- Chapters are renamed as a **concert set list** (Opening act, The main set, Greatest hits, B-sides, The gear, The trip, Liner notes, Book the band) - the real name always stays visible beside the metaphor.
- Hero = billing poster: stretched name lettering over a rotating sunburst, portrait in an arch with concentric halo rings, stats as circular "sun" medallions.
- Footer = **Encore**: the hero is offered again (name, role, resume, contact) so a visitor at the bottom never has to scroll back.
- Shapes: arches (Mucha), circles / concentric rings, scalloped flower circles, petals / vesicas, ovals; zig-zag perforation on ticket cards; no sharp rectangles for photos.
- Spacing: generous (96-140px between fields), content width ~1180px, 12-col grid collapsing to one column at 760px.

## Textures, ornaments & imagery (and the photo-treatment recipe)
- Procedural only: `repeating-radial-gradient` rings, `conic-gradient` rays, SVG wave bands, a hand-written paisley (boteh) path, 8-petal daisy, eye/lotus mandala as SVG, tie-dye (stacked radial gradients), a dot/halftone via `radial-gradient`.
- **Photo recipe (`recipe.mjs`)**: build-time "heat-map solarisation". Luminance is mapped through a violet -> hot pink -> orange -> yellow -> cream ramp (warm midtones keep skin tones recognisable), partly blended with the saturated original so faces keep their local colour and detail, then a diagonal turquoise / violet / pink softlight overlay (tie-dye cross-hue), a luminance-contour (solarised) band layer for scenery, a fine colour halftone screen mixed in at low opacity (print texture), a screen-blended radial glow, and a soft violet vignette. Variants: `portrait` (gentle, faces first), `group` (gentler), `night` (cobalt/violet/cyan neon with extra bloom), `scene` (landscapes, books, food, desk: stronger contouring because there are no faces to protect), `hero` (best-quality portrait treatment).
- Why: the genre's colour comes from *printing* (split-fountain inks, Day-Glo) and from *light shows* (colour projected through the image); a gradient map plus halftone and glow reproduces both and works on every photo without destroying faces. The CSS then frames the result in arch / circle / flower / petal shapes with concentric halos.

## Motion & interaction
- Only large, slow, compositor-friendly motion (transform/opacity): the page-wide mandala rotates once per ~4 min; 3 radial-gradient blobs drift on 50-80 s loops; the hero sunburst turns once per 3 min; halo rings counter-rotate slowly; section drips never move.
- Display lettering is static (a feTurbulence+feDisplacementMap "melt" computed once, not animated). Hover on cards: a 200 ms lift and shadow colour swap. Photos: hover/tap reveals the untreated original (the "come down").
- Reveal-on-scroll: gentle 600 ms fade/raise, JS-guarded.
- `prefers-reduced-motion: reduce`: every infinite animation is removed (`animation: none`), transforms are reset, reveals show immediately. Nothing flashes; nothing faster than ~1 cycle per 40 s.

## UI translation
- **Nav**: sticky "ticket" strip with scalloped bottom edge; items are numbered tracks (01 About ... 08 Contact) with the set-list name beneath (e.g. "Opening act"); collapses to a horizontally scrollable strip on phones. Active item gets a sun-yellow disc behind it.
- **Buttons**: pill shapes with a pink -> orange gradient, 3px ink outline, hard turquoise offset shadow; hover shifts the shadow; focus ring is a 4px yellow + ink double ring.
- **Cards**: paper panels, 3px ink border, 24px radius, hard coloured shadow (alternating pink / turquoise / violet), zig-zag ticket notches for projects.
- **Forms**: paper inputs with ink borders and a coloured bottom bar on focus; labels in Shrikhand.
- **Timeline (experience)**: each job is a "reel": a coloured date medallion plus a 3-column grid of tracks (bullets) each numbered on a small vinyl-ring icon.
- **Footer**: Encore re-offer of the hero + credits line.

## Pitfalls & accessibility risks
- Vibrating colour + wavy type is the genre's readability trap -> body text never sits on a pattern or gradient; display lettering is always light-on-dark or dark-on-light, 3:1+ at its fill, outlines are decorative; every heading is an `<svg role="img" aria-label>` inside the real `<h1>/<h2>`, so the accessible name is plain text.
- Motion sickness / photosensitivity -> slow, large, low-contrast-delta motion only, nothing flashes, reduced-motion kills all loops.
- Colour-only information -> the "familiar" skills are marked with text, not just a dashed border; set-list names are text.
- Performance: no `filter: blur()` on viewport-size layers; animated layers are transform-only; the SVG melt filter is applied to ~10 small headings and is static.
- Contrast checker blind spots: elements with background images are skipped, so text panels use solid `background-color`.

## References
- Wikipedia, Psychedelic art - history, traits, SF poster artists: https://en.wikipedia.org/wiki/Psychedelic_art
- Wikipedia, Wes Wilson - lettering that fills the space and melts: https://en.wikipedia.org/wiki/Wes_Wilson
- Wikipedia, Victor Moscoso - Albers' vibrating colours, Neon Rose, photo collage: https://en.wikipedia.org/wiki/Victor_Moscoso
- Wikipedia, Rick Griffin - Flying Eyeball, Aoxomoxoa, Zap: https://en.wikipedia.org/wiki/Rick_Griffin
- Wikipedia, Stanley Mouse / Alton Kelley - Mucha-derived Family Dog posters: https://en.wikipedia.org/wiki/Stanley_Mouse
- Wikipedia, Bonnie MacLean - plumes, curving letters, roundels, arches: https://en.wikipedia.org/wiki/Bonnie_MacLean
- Wikipedia, Yellow Submarine (film) / Heinz Edelmann - the European counterpart; technique switching: https://en.wikipedia.org/wiki/Yellow_Submarine_(film)
- Wikipedia, Peter Max - Day-Glo, cosmic pop: https://en.wikipedia.org/wiki/Peter_Max
- Wikipedia, Op art - The Responsive Eye, Riley, Vasarely: https://en.wikipedia.org/wiki/Op_art
- Wikipedia, Paisley (design) - boteh shape history: https://en.wikipedia.org/wiki/Paisley_(design)
- Wikipedia, Alphonse Mucha - Gismonda halo, arabesque hair: https://en.wikipedia.org/wiki/Alphonse_Mucha
- Wikipedia, Liquid light show - oil and dye between glass: https://en.wikipedia.org/wiki/Liquid_light_show
- Wikipedia, Chromostereopsis - why red/blue pairs float: https://en.wikipedia.org/wiki/Chromostereopsis
Only described, not copied: no poster artwork, lettering or text from any of these is reused. All ornament here is hand-written SVG/CSS.

## Decisions for this site
Do:
- Full-bleed colour-field sections + paper panels for every fact; stretched SVG lettering (Chango) for h1/h2 only; Shrikhand for card titles; Fraunces for all copy.
- Set-list metaphor for chapters with real names kept visible; Encore footer.
- Gradient-mapped, halftoned, glowing photos in arch / circle / flower / petal frames with concentric halos; hover reveals the original.
- Slow mandala / blob / sunburst motion; all of it off under reduced motion.
Do not:
- No text on animated or patterned backgrounds; no wavy *body* text; no strobing; no pure red-on-blue text.
- No third-party artwork, stock mandalas or drug imagery; the "trip" metaphor is only about travel and rides.
- No parallax scrolljacking; no heavy JS (client script is a few hundred lines of vanilla: active nav, reveal, nothing else).

## Sources
Wikipedia pages listed above, fetched 2026-11-09 (WebSearch was not available in this session). Font files from fontsource (jsDelivr), SIL OFL 1.1: Chango (Fontstage), Shrikhand (Jonny Pinhorn), Fraunces (Undercase Type).
