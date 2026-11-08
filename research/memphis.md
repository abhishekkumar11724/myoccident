# Memphis (1981 - 1988)

Research date: 2026-11-09. Tools: WebFetch only (WebSearch not available). Facts marked (W) were read on the cited Wikipedia pages in this session;
facts marked (K) are well-known design-history background I am carrying from general knowledge and did not re-verify on a fetched page. Vitra and
Design Museum pages returned 403/500, so they are listed under References as "not read".

## Definition
Memphis (Memphis Milano) is an Italian postmodern design collective that, from 1981, answered the grey, tasteful "good design" of late Modernism with
furniture, lamps, ceramics, textiles and laminates that were loud, cheap-looking on purpose, geometric and joyfully illogical. Its vocabulary is
stacked primitive shapes (triangles, half-circles, cylinders, cubes), squiggle and zigzag surface patterns, speckled terrazzo, plastic laminate,
clashing pastel and primary colour, and thick black outlines. In graphic design the same vocabulary spread through 1980s-90s TV, packaging,
sportswear and mall culture, and it returns today as a retro revival.

## Origins & timeline
- 1978 (W/K): Martine Bedin's wheeled "Super" lamp (first prototype now at the V&A) and Sottsass's "Bacterio" wavy-line laminate motif, drawn from the surface of a temple in Madurai (W: Sottsass page) - early seeds of the language.
- Dec 1980 (W): Ettore Sottsass gathers young designers and architects in Milan on an evening to talk about the future of design (Wikipedia gives 6 Dec on the Group page, 11 Dec on the Sottsass page; I say "December 1980"). The name comes from Bob Dylan's "Stuck Inside of Mobile with the Memphis Blues Again", looping on the stereo; Memphis is both a Tennessee city and an ancient Egyptian capital - deliberately ambiguous.
- Early 1981 (W): the group returns with 100+ drawings. Sep 1981 (K): first collection shown in Milan during the furniture fair.
- 1981 (W): Sottsass's Carlton room divider/bookcase and Casablanca cabinet (plastic laminate); Michael Graves's Plaza dressing table. Tahiti lamp (Sottsass, 1981) and Murmansk fruit bowl (1982) (W: Sottsass page).
- 1980s (W): members include Bedin, Branzi, Cibic, De Lucchi, Nathalie du Pasquier (youngest, b. 1957, joined 1981), Graves, Kuramata, Mariscal, Mendini, Peter Shire (LA sculptor/potter, b. 1947), Sowden, Thun, Zanini. Du Pasquier's motto for the group: "form follows fun" (W).
- 1985 (W): Sottsass leaves to focus on Sottsass Associati. 1987/88 (W): the group disbands.
- Mid-1980s to mid-1990s (W): the look saturates pop culture: Miami Vice sets, Nickelodeon's Double Dare, surf/skate/ski/BMX brands, mall architecture, clothing, video games. Late 1990s (W): the Y2K look displaces it.
- 2010s (W): feeds vaporwave; "Corporate Memphis" is Wired's name for flat, geometric startup illustration. Fashion revivals: Dior couture FW 2011-12, Missoni 2015 (W). David Bowie and Karl Lagerfeld collected it (W); Bowie's pieces were auctioned at Sotheby's after 2016 (W).
- Why it looked like that (W): a deliberate break from Modernism; cheap laminate and terrazzo sold to luxury buyers; asymmetry; references to "exotic or earlier styles" without logic; critics called it "bizarre" and "a shotgun wedding between Bauhaus and Fisher-Price". Terence Conran: "Sottsass meant it as a joke!"

## Defining visual traits
- Primitive geometry stacked like toys: triangle, half-circle (semi), circle, square, cylinder, arch; shapes tilted 5-20 degrees, never grid-perfect.
- Surface pattern as a character of its own: squiggle (Bacterio-like wavy strokes), zigzag, dots/polka, checks, stripes, terrazzo chips; pattern is laid against a different pattern.
- Bold black outlines and hard offset shadows; flat fills, no gradients (gradients appear only as airbrushed 80s sky, avoided here).
- Colour: clashing pastels + saturated primaries + black and white (see below). Black is a colour, not just text.
- Laminate and terrazzo feel: smooth glossy flat surfaces with a speckled field.
- Asymmetry and play: elements deliberately off-balance, overlapping, peeking out from behind each other; humour (joke titles, cartoon proportions).
- Totem composition: things stacked vertically (Carlton) with voids and shelves; here translated to stacked tabs and offset blocks.

## Colour
Palette (hex), chosen to read as 1981 Milan laminate samples, not as 2020s "Corporate Memphis" (which is pastel and tame):
| Name | Hex | Role |
|---|---|---|
| Ink | `#14110f` | outlines, text, shadows, nav, photo key-line |
| Cream | `#fffaf0` | text panels, page ground, photo highlights |
| Hot pink | `#ff4fa3` | primary accent, hero terrazzo ground, buttons |
| Turquoise | `#19d3c5` | secondary block colour, nav ribbon edge |
| Lemon | `#ffe94a` | highlight stickers, h1 tile, focus ring |
| Cobalt | `#2b4bff` | link colour on cream, deep accent (white text allowed) |
| Lilac | `#b69cff` | soft block colour |
| Tangerine | `#ff5a36` | small accents, badges |
| Mint | `#8ff0c0` | soft block colour |
Rules: ink text on every bright fill (white on pink/turquoise/lemon fails 4.5:1); white text only on ink or cobalt; body copy always on cream/white
panels; never put thin text over a pattern. Avoid: pink-on-turquoise body text, lemon text on white, gradients, neon-on-black (that is vaporwave/synthwave).

## Typography
Historic: Memphis itself used few typefaces; the printed matter leaned on chunky grotesques and rounded display faces (Avant Garde-era geometrics, Cooper-like
fat faces, hand-drawn bubble letters), set big, tilted or boxed, with shadows.
Chosen (all SIL OFL, self-hosted woff2 latin subset):
- **Bagel Fat One** 400 - display: h1, h2, big numbers. Chunky, rounded, slightly bouncy; set large with hard shadow, never below ~28px.
- **Lilita One** 400 - labels, stickers, buttons, chips, numbered badges (a second chunky voice; reads well at 16-24px).
- **Rubik** 400 and 700 - body and UI text (slightly rounded geometric sans, very legible at 16-18px).
Scale: h1 clamp(3.2rem, 11vw, 9rem); h2 clamp(2.2rem, 5.5vw, 4rem); h3 Lilita 1.35-1.7rem; body 1.0625rem/1.6.
Sentence-case body, display in mixed case (all-caps only for tiny Lilita tags).

## Layout & composition
- Ground: cream with a sparse confetti tile (dots, triangles, squiggles, plus, zigzag). Sections are full-bleed *bands* or blocks, each with its own surface (terrazzo, squiggle laminate, dots, zigzag stripes, checks, triangles) separated by zigzag edges; content always sits on solid cream/white "furniture" panels with 4px ink outlines and 8px hard offset shadows.
- Asymmetric 12-col rhythm: panels offset left/right, rotated +-0.5 to 2 degrees on desktop, 0 on small screens; decorative shapes poke out of corners.
- Shape language: border-radius 22px "laminate slabs", arches, circles, triangles by clip-path/SVG; every shape has a 4px ink stroke.
- Nav: zigzag ribbon at the top (sticky). Hero: terrazzo field, h1 as two colour tiles, photo arch with circle sticker overlapping.
- Spacing: 8px base; big gaps (clamp(4rem, 9vw, 8rem)) between bands to let patterns breathe, tight spacing inside cards.

## Textures, ornaments & imagery
- Terrazzo (original SVG tile, irregular chips in ink/cream/lemon/turquoise/cobalt/pink/tangerine), Bacterio-like squiggle laminate (original SVG), zigzag and triangle tiles, confetti ground. All generated procedurally, no third-party art.
- Ornaments: floating semi-circles, triangles, rings, plus signs, dot-grids, bolts, squiggle underlines.
- Photo recipe (`recipe.mjs`): auto-level + local-contrast lift -> luminance posterised into 4 flat bands (ink / colour A / colour B / cream) with the band edges dithered by a 45-degree Ben-Day dot screen -> thick ink key-line on the strongest edges. Palettes are clashing pairs (pink+lemon, cobalt+turquoise, tangerine+lemon, lilac+pink, teal+pink, mint+lemon, night: violet+pink+lemon) picked per category/file hash so a page of 60 photos reads as a mixed sticker sheet. Why: it is how Memphis-era print and packaging actually separated photos (flat spot colours + halftone), faces stay recognisable because tone is normalised before banding, and every thumbnail is obviously the style.
- Page presentation: photos as stickers (6px cream border + 3px ink outline + hard shadow) in circles, arches, pills, leaf shapes, each rotated a few degrees; click opens a lightbox.

## Motion & interaction
- Only hover/focus-triggered, one-shot, bouncy: stickers and cards tilt and overshoot (cubic-bezier(.34,1.56,.64,1)), buttons press down into their shadow. A short "wiggle" keyframe (0.5s, once) on sticker hover.
- Copy-email button: tap copies the address, label morphs to "Copied!" with a small confetti pop (CSS, one-shot).
- Scroll-spy highlight in the nav (colour change, no movement).
- `prefers-reduced-motion: reduce`: no transforms on hover beyond colour/outline change, no keyframes, instant scroll.
- Nothing loops, nothing flashes.

## UI translation
- Nav: sticky ribbon with brand sticker (AK in a circle), pill links that tilt on hover, current section filled lemon, resume pill at the end, zigzag bottom edge. Mobile: Menu button toggles a stacked pill list (links visible without JS).
- Buttons: 3px ink border, 5px hard shadow in a second colour, press = translate(4px,4px) and shadow collapses. Primary ink-filled with lemon text; secondary cream.
- Cards: slabs with ink outline, hard shadow, a coloured header stripe with laminate pattern, number sticker in a different shape per card.
- Experience: stacked folder tabs (one per employer), each with a colour tab, date sticker, bullet tiles; all visible.
- Skills: laminate swatch cards, each with a pattern header; "familiar" items shown with dashed outline.
- Stats: geometric badges (circle, triangle, hexagon, pill, semi-circle, burst), each colour/shape different.
- Forms: chunky 3px outlined inputs on cream, focus = lemon fill + cobalt ring; status line in a speech bubble.
- Footer: zigzag top edge, ink band with confetti, flavour line.
- Timeline: stacked tabs rather than a line.

## Pitfalls & accessibility risks
- Pattern-on-pattern kills legibility: keep all body copy on solid cream panels (4.5:1+ ink on cream = ~17:1).
- White text on bright fills fails contrast: use ink on pink/turquoise/lemon/lilac/mint/tangerine; white only on ink/cobalt.
- Tilted text hurts reading: rotate only boxes of short labels, never paragraphs beyond 1 degree; reset rotation under 700px.
- Too many colours = noise: a section picks 2-3 of the palette; ink is the constant.
- Motion: bounce on hover only; no autoplay; reduced-motion fallback.
- Colour not the only signal: "familiar" skills also carry a text suffix; section state in nav also has an underline.
- Focus visible: lemon fill + 3px ink outline + 3px cobalt ring on every interactive element.
- Performance: patterns are small SVG tiles (terrazzo 27KB), no filters on big layers, filter: drop-shadow avoided on photos (border-radius shapes + box-shadow instead).

## References
- Wikipedia, Memphis Group - https://en.wikipedia.org/wiki/Memphis_Group - history, members, legacy (read; reference only).
- Wikipedia, Ettore Sottsass - https://en.wikipedia.org/wiki/Ettore_Sottsass - Bacterio, Tahiti, Carlton dates (read).
- Wikipedia, Nathalie Du Pasquier - https://en.wikipedia.org/wiki/Nathalie_Du_Pasquier - youngest member, "form follows fun" (read).
- Wikipedia, Peter Shire - https://en.wikipedia.org/wiki/Peter_Shire - LA member (read).
- Vitra Magazine on Memphis Design - https://www.vitra.com/en-us/magazine/details/memphis-design - (403, not read).
- Design Museum, Memphis - https://designmuseum.org/design-stories/design-icons/memphis - (500, not read).
- Carlton bookcase, Tahiti lamp, Super lamp, Bel Air chair - studied as shapes/colour only; no images reused.
All artwork on this site (terrazzo, squiggles, shapes) is original and procedurally drawn; no Memphis Milano artwork, patterns or photographs are reproduced.

## Decisions for this site
Do:
- Terrazzo hero, zigzag nav ribbon, stacked-folder experience, laminate-swatch skills, geometric stat badges, chunky project cards with squiggle underlines, sticker-sheet photo wall with lightbox, copy-email button with pre-filled mailto, "scrapbook" About with a name-tag and a clearly joking unofficial job line.
- Ink on every bright fill; cream panels for all copy; focus rings in-style; selection colour lemon; scrollbar tinted.
- Photo recipe: dot-screen posterised pop palettes with ink key-line.
Do NOT:
- No gradients, no glow, no neon-on-black (that is Vaporwave/Psychedelic); no thin hairlines (everything 3-4px); no continuous animation; no pattern behind running text; no third-party artwork.

## Sources
Wikipedia pages listed above (fetched 2026-11-09). Fonts: Bagel Fat One, Lilita One, Rubik via Fontsource/jsDelivr (SIL OFL 1.1).
