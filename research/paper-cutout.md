# Paper cutout (c. 1920s - today; Matisse cut-outs 1943-54)

## Definition
Paper cutout is the look of images built by cutting coloured paper with scissors or a blade and gluing the
pieces down in overlapping layers: flat, saturated colour sheets, no outlines (the cut edge *is* the line),
slightly irregular hand-cut contours, visible paper fibre, and depth expressed only by stacking and soft contact
shadows. It spans fine art (Matisse), children's illustration (Eric Carle), silhouette film (Lotte Reiniger),
cheap-and-cheerful TV animation (Terry Gilliam, South Park), folk papercutting traditions and the modern
"paper-craft diorama / layered paper-cut lightbox" scene. On screens it re-emerged through Google's 2014 Material
Design, where "surfaces" are sheets of paper at different elevations casting shadows.

## Origins & timeline
- c. 4th-6th century: papercutting appears in China after Cai Lun's paper (105 AD); oldest surviving piece is a
  symmetrical circle (6th c., Xinjiang). Chinese *jianzhi* (usually red, zodiac animals, New Year/weddings; UNESCO listed).
  Reached Japan (*kirie*, washi), Europe from the 13th-16th c. (*Scherenschnitte* silhouettes; Goethe silhouette 1778),
  Poland (*wycinanki*, roosters and flowers, layered), Mexico (*papel picado* banners).
- 1918-1926: Lotte Reiniger (b. Berlin 1899) animates silhouettes cut from cardboard/tracing paper with lead-wire joints,
  20-50 pieces per puppet; *The Adventures of Prince Achmed* (1926) is the oldest surviving animated feature and used an early
  multiplane (backlit glass layers) - the ancestor of "parallax layers".
- 1941-43: after cancer surgery Henri Matisse (b. 1869) is often bedridden; he turns to "drawing with scissors":
  assistants pre-paint sheets with gouache, he cuts directly into the colour and has pieces pinned and re-pinned on the wall.
- 1943-47: the book *Jazz* (20 stencilled/pochoir plates made from his cut-outs, with hand-lettered text; Icarus, The Clown,
  The Sword Swallower, Monsieur Loyal). 1946-52: *Oceania* panels, algae/coral/star/leaf vocabulary, the Vence chapel
  designs, the *Blue Nudes* (1952). 1953: *The Snail* (Tate; cut gouache paper sheets arranged in a spiral on white).
  He died in 1954 calling these years his "second life".
- 1962: Florence Temko popularises "kirigami" in the West (cut paper that stands away from the page, symmetrical snowflakes).
- 1967-69: Eric Carle (tissue paper he paints, then cuts and layers) - *Brown Bear, Brown Bear* (1967), *The Very Hungry
  Caterpillar* (1969, 55M+ copies, die-cut pages). ALA 2003 citation: "luminous colors and playful designs".
- 1969-74: Terry Gilliam's cut-out animation for *Monty Python's Flying Circus* (Victorian photos and engravings plus own drawings).
- 1992/1995: Trey Parker and Matt Stone shoot *The Spirit of Christmas* with real construction-paper cut-outs, later digitised
  (CorelDRAW, PowerAnimator, then Maya) while keeping a deliberately jerky, flat, primary-colour "homemade" look.
- 2014: Google Material Design - "material has physical surfaces and edges", "seams and shadows provide meaning about what you can touch".
- 2010s-now: layered paper-cut shadow boxes, paper-craft diorama illustrators, Rob Ryan, Nikki McClure, Kara Walker (silhouettes).

## Defining visual traits
- Flat, uniform colour fields with *crisp but slightly wobbly* cut edges; shapes are organic (algae, leaves, clouds, hills, blobs),
  never perfect geometry; corners are cut straight with a little angle error.
- No outlines or gradients inside a piece of paper. Depth = overlap + soft, tight contact shadow (bigger shadow = higher sheet).
- Visible paper: fibre/grain, faint curl highlights, deckle or torn edges (white core showing), pinking-shear zigzag, scalloped rim.
- Glued-on scraps: tape strips, paper clips/pins, stuck-on labels, confetti dots, hand-written captions.
- Palette is saturated gouache-like primaries/secondaries on warm off-white or kraft ground.
- Slight rotations (-4 to +4 degrees) on every glued item; nothing is perfectly aligned.
- Stop-motion rhythm: movement is stepped or jerky, items slide as flat planes (parallax of layers), they do not morph.

## Colour
Gouache sheet colours, deliberately saturated and flat (check each on text contrast before use):
- Paper cream (ground / reading sheet) `#fff5dc`; warm paper `#f6ead0`; kraft board `#c9a06a` / deep kraft `#a9804a`
- Matisse blue (ultramarine) `#1f45c8` - dark sheet, cream text; sky/turquoise `#43bfe0`; pale sky `#cdeaf5`
- Vermilion / poppy `#c9361c` (cream text OK, 5:1); tangerine `#ff7a2f`; coral pink `#ff8fa0`; pale pink `#ffd6dc`
- Sunshine yellow `#ffc928`; pale butter `#ffeaa0`
- Leaf green `#1f8a56` (cream text OK), mint `#bfe8c8`, deep forest `#0f5a3b`
- Violet / lilac `#8a5cd6`, pale lilac `#e2d6f8` (accent only)
- Ink (text on light sheets) `#1c1b33` (deep navy-black; never pure black - the cut-out world has no black line work)
- Avoid: pastel-on-pastel text, yellow text on white, red on blue text (vibrates), more than ~4 saturated hues in one viewport,
  grey drop shadows with large blur (looks digital - keep shadows warm `rgba(60,30,10,.28)`, short and tight).

## Typography
- Historic: Matisse's *Jazz* text is loose hand-lettering in black brush; Carle's titles are simple hand-cut sans; 1960s children's-book lettering.
- Chosen (all SIL OFL, self-hosted, latin subset, fontsource): **Chewy** 400 for display (name, section titles, card titles - chunky,
  slightly wobbly, reads as cut-out lettering); **Nunito** 400 + 700 for body (rounded, very readable at 17-19px, 1.55-1.65 line-height);
  **Patrick Hand** 400 for hand-written scrawls (captions, chip labels, margin notes). Total ~76 KB.
- Scale: h1 clamp(2.6rem, 9vw, 6.4rem) built from letter tiles; h2 clamp(2rem, 5vw, 3.4rem); body 1.05-1.15rem; captions 1.1rem hand.

## Layout & composition
- Every section is a *sheet of paper laid over the one below*, with a different cut edge on the top (wave, scallop, zig-zag pinking,
  torn, organic blobs). Overlap with a short contact shadow. Sheets are full-width with an inner content column ~1100px.
- Hero: a stage of 4-6 depth layers (sky, sun, clouds, far hill, mid hill, near hill, leaf sprigs) that slide at different rates on scroll.
- Cards are paper pieces with one or two sheets peeking out behind them at a slight angle (stack depth); tabs stick out like folder tabs.
- Spacing is generous; shapes are allowed to overlap text columns only when they are decorative and behind.
- Rhythm: alternate light (reading) sheets with one or two saturated dark sheets so the page never turns into one flat colour.

## Textures, ornaments & imagery (photo recipe + why)
- Texture: paper fibre as a very small seamless tile (SVG feTurbulence rendered once or a tiny PNG), applied as a multiply overlay at 8-12%.
- Ornaments: bunting flags, torn tape strips (semi-transparent beige), pins, stars, confetti dots, scalloped circles, leaf/algae sprigs
  (Matisse), a sun made of a wobbly circle + zig-zag ray ring, clouds as three overlapping circles with a flat base.
- Photos: a *build-time* recipe flattens each photograph into layered colour sheets: (1) Kuwahara smoothing, (2) per-photo k-means to
  8-10 colours (skin tones therefore stay skin-coloured, faces stay recognisable), saturation raised, (3) mode filter so the regions
  have clean, hand-cut contours with no pixel noise, (4) **stacked-layer contact shadows**: regions are ranked by lightness (darkest
  at the bottom, lightest on top) and every layer casts a short soft shadow onto the layer below it, plus a hairline lit edge on the
  opposite side - this is what makes it read as *cut paper* rather than "posterised photo", (5) paper fibre texture + faint grain.
  No outlines (cut paper has none).
- CSS then frames every photo as a cut-out: jittered polygon clip-path (scissor cut, generated per item at build time), a thick white
  scalloped border (mask of radial gradients), slight rotation, drop-shadow, tape strip.

## Motion & interaction
- Hero layers parallax on scroll: only `transform: translate3d`, driven by one CSS variable written from a passive, rAF-throttled scroll
  handler (or `animation-timeline: scroll()` where supported). Clouds drift slowly (CSS keyframes, transform only).
- Section sheets lift in on enter (translateY 18px -> 0, 260ms, stepped easing `steps(6)`-feel via cubic-bezier) - stop-motion flavour.
- Cards "lift" on hover: rotate to 0, translateY(-4px), shadow grows (higher sheet = bigger shadow).
- Scrapbook: pointer-draggable photos (pointer events, transforms only, z-index bump, clamped to the board), arrow keys nudge, Esc/Home
  resets, a "Tidy up" button restores the grid. Coarse pointers get the static grid (no drag).
- Copy-email button with a paper "snip" confirmation.
- **Reduced motion:** no parallax writes, no drifting clouds, no reveal transitions, no infinite animations; everything static.

## UI translation
- Nav: paper bookmark tabs hanging from a kraft strip at the top; each tab a different colour with a V-notched end; the current section's
  tab hangs lower (scroll-spy). On phones the tabs scroll horizontally in a single strip.
- Buttons: cut paper pills with a jittered polygon edge + contact shadow; hover lifts; focus = chunky ink dashed "cutting guide" outline.
- Cards: coloured paper with a second/third sheet behind, tape or pin, scalloped header.
- Forms: lined notepaper fields on a cream "letter" sheet; submit is a stamp-style button.
- Timeline/experience: stack of overlapping file folders with tabs, newest on top.
- Skills: torn paper chips grouped on coloured strips. Projects: luggage tags on string. Writing: sticky notes.
- Footer: kraft paper strip with pinking-shear zig-zag edge.

## Pitfalls & accessibility risks
- Text on saturated paper: restrict body copy to cream/pale sheets (ink text) or dark blue/green/red sheets (cream text), checked >= 4.5:1.
- SVG displacement filters are expensive: use them only on small elements, never on the full viewport; prefer build-time jittered
  polygons for rough edges.
- `drop-shadow` filters on very tall elements repaint badly on phones: put shadows on short edge strips and on small cards only.
- Drag-only interactions exclude touch/keyboard: ship a static grid default, enhance with drag only for `(pointer: fine)`, keyboard nudging.
- Parallax: transform-only, passive listener, off for reduced motion. Decorative layers `aria-hidden`.
- Letter-tile headline must keep a real `h1` text node for screen readers (aria-label on the heading, tiles aria-hidden).
- Do not make the page look childish: keep layout grids tidy, type scale restrained, copy factual.

## References
- Matisse, *Jazz* (1947) and *The Snail* (1953, Tate) - saturated gouache cut shapes, spiral of rectangles, hand lettering. https://www.tate.org.uk/art/artworks/matisse-the-snail-t00540 - palette and "no outline" principle. (Not copied; descriptive only.)
- Wikipedia, Henri Matisse (cut-outs section): assistants pre-paint gouache sheets, cut and pin, "second life". https://en.wikipedia.org/wiki/Henri_Matisse
- Wikipedia, Lotte Reiniger: silhouette puppets, multiplane glass layers. https://en.wikipedia.org/wiki/Lotte_Reiniger
- Wikipedia, Eric Carle: hand-painted tissue-paper collage. https://en.wikipedia.org/wiki/Eric_Carle
- Wikipedia, South Park (animation style): construction-paper cut-out origin, deliberate homemade jerkiness. https://en.wikipedia.org/wiki/South_Park
- Wikipedia, Papercutting and Kirigami: traditions, symmetry, kirigami popularised 1962. https://en.wikipedia.org/wiki/Papercutting , https://en.wikipedia.org/wiki/Kirigami
- Wikipedia, Material Design: paper/ink surfaces, shadows convey interactivity. https://en.wikipedia.org/wiki/Material_Design
- Terry Gilliam (Monty Python animations): cut-up Victorian imagery. https://en.wikipedia.org/wiki/Terry_Gilliam
- Licence note: all artworks above are referenced for approach only; no scans, no copied code or copy-text. All shapes on this site are hand-written SVG/CSS.

## Decisions for this site
Do:
- Sheets-over-sheets page structure with five different cut edges; scene hero with parallax layers; letter-tile name headline.
- Bookmark-tab nav; folder-stack experience; layered cards for case studies; luggage-tag projects; torn-chip skills;
  sticky-note writing; draggable scrapbook for Beyond code (grid fallback); letter-style contact with copy-email.
- Build-time photo recipe with k-means colour layers and stacked contact shadows; CSS jittered polygon cut + scalloped white frame.
- Fonts: Chewy, Nunito, Patrick Hand (OFL). All SVG ornaments hand-written.
Do NOT:
- No outlines/strokes on illustrated shapes, no gradients inside paper shapes (except the subtle fibre texture), no neon, no glossy effects.
- No full-viewport SVG filters, no heavy JS libraries, no autoplay beyond slow cloud drift and scroll-linked parallax.
- Do not copy any specific artwork; Matisse-like leaf shapes are drawn fresh.

## Sources
Wikipedia pages listed above (fetched 2026-11-09; Tate/MoMA catalogue pages returned navigation only or 403, so details on *Jazz*
and *The Snail* come from general art-historical knowledge and are described, not quoted). Fontsource CDN for Chewy / Nunito / Patrick Hand (all SIL OFL 1.1).
