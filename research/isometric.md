# Isometric (1822 -> now: engineering drawing, arcade, pixel cities, flat-iso web illustration)

## Definition
Isometric projection is the axonometric projection in which the three coordinate axes are foreshortened equally and any two meet at 120 degrees on the page, so a cube's outline is a regular hexagon and every edge parallel to an axis keeps the same scale (no vanishing points, nothing shrinks with distance). In practice the word is used loosely for any "tilted-down three-quarter" view: engineers draw it with 30-degree edges at true length, pixel artists fake it with a 2:1 line (26.565 degrees, technically dimetric), and illustrators use it for tiny, tidy, flat-shaded worlds in which every solid shows exactly three faces: a light top, a mid left side and a dark right side.

## Origins & timeline
- c. 15th century, China: illustrated *Romance of the Three Kingdoms* uses parallel (axonometric) projection; Zhang Zeduan's *Along the River During the Qingming Festival* (1085-1145) mixes axonometric and perspective views, so one scroll can show space and time together.
- 1822: William Farish (1759-1837, Cambridge) publishes "On Isometrical Perspective", the first detailed rules for drawing it, wanting accurate working drawings "free of optical distortion"; his engine model is captioned "drawn in 30 degree isometric".
- Mid-19th century: becomes a core engineering tool and enters architecture curricula in Europe and the US. 1874 US patent drawings use dimetric views. ISO 5456-3 (1996) standardises axonometric drawing.
- 1923: Theo van Doesburg's De Stijl architecture designs, drawn as axonometrics, cause a sensation at the Paris exhibition; Bauhaus/De Stijl architects adopt it through the 1920s because it shows plan, section and height at once and measurements read straight off the page.
- 1953: M.C. Escher's lithograph *Relativity* (Dec 1953) builds impossible, gravity-shifting staircases; because there is no perspective, depth is ambiguous and the Penrose-stairs trick works. This is the ancestor of "impossible geometry" games.
- 1981-82: Treasure Island (Data East, Sep 1981 Japan), Zaxxon (Sega, Dec 1981 Japan / Apr 1982 abroad; one of the first games with shadows), Q*bert (Gottlieb, 18 Oct 1982; Jeff Lee's cube pyramid inspired by Escher; Warren Davis programmed it; joystick mounted at 45 degrees so inputs match the diagonal hops; each cube changes colour when landed on).
- 1983-87: Congo Bongo, Blue Max, Ant Attack (ZX Spectrum, "Soft Solid 3-D"), Knight Lore (1984, Ultimate), Marble Madness (1984), Head Over Heels (1987), Populous (1989).
- 1990s: A-Train III (1990), Syndicate (1993), SimCity 2000 (Maxis, Dec 1993 Mac / 1994 DOS; Will Wright & Fred Haslam, art director Jenny Martin, drawn in Deluxe Paint on 486s; buildings designed 3x3 tiles then reduced to 2x2, 1x1), X-COM (1994), Civilization II, Diablo (1996), Fallout (1997), Final Fantasy Tactics (1997).
- 1997: eBoy founded 2 May 1997 by Kai Vermehr, Steffen Sauerteig, Svend Smital (Berlin/Los Angeles). "Pixoramas" are dense isometric pixel cities (20+ since 1998, 1,000+ hours each), assembled from a library of 5,000+ reusable parts. Vermehr rejects "retro": the choice was technical, "you are forced to simplify and abstract". Clients: Adidas, Coca-Cola, Nike, Louis Vuitton, MTV (first job, 1998), NYT; books *HELLO* (2002) and *Pixorama* (2008). Steven Heller: eBoy are to pixels what Lichtenstein was to Ben-Day dots.
- 2000-01: Habbo Hotel (Sulake, Finland; Hotel Goldfish Aug 2000, Habbo Hotel beta Jan 2001): isometric rooms you furnish with "furni", the template for "tiny room" nostalgia.
- 2010s revival: Monument Valley (ustwo, 3 Apr 2014; Ken Wong; Escher-style impossible objects, Japanese prints and minimalist sculpture as influences; colour used as a quiet guide to what is interactive; Apple Design Award 2014), Shadowrun Returns, Pillars of Eternity, Fallout Shelter (Bethesda, 14 Jun 2015, side-on "ant farm" cutaway of a vault with rooms you can zoom into).
- 2015-now: "flat isometric illustration" becomes the default look for tech landing pages (servers, clouds, dashboards, shields as tiny blocky dioramas), generated in Figma/Illustrator grids or code.

## Defining visual traits (checkable)
- Axes at 120 degrees; edges at exactly 30 degrees (or 2:1 / 26.565 degrees in pixel-art tradition). Verticals stay vertical. No vanishing points, no size change with depth.
- Every solid shows three faces with a fixed light: top lightest, left mid, right darkest (here: light from the upper left of the screen, shadows fall right).
- Flat colour per face, no gradients inside faces; limited palette of 4-6 hues, each as a 3-shade ramp. Edges are shade changes, not outlines (eBoy pixel art is the exception: dark pixel outlines).
- Tiny scale: rooms, stages, platforms, cubes, buildings, floating islands with soft contact shadows, stairs, conveyors, cutaway cross-sections, characters built out of boxes.
- Grid thinking: everything sits on a rhombus tile grid; screen position of tile (x, y) = ((x - y) * w/2, (x + y) * h/2); painter's algorithm: draw back to front.
- Impossible-geometry play (Escher, Monument Valley) works precisely because the projection has no depth cue.
- Hexagon silhouette / "tumbling blocks" cube tiling is the signature pattern.

## Colour
Crisp light ground with saturated-but-friendly accents, each as a three-shade ramp (top / left / right):
- Ground `#eef3fb`, panel white `#ffffff`, slab edge `#c9d5ee`, grid line `rgba(79,124,255,.12)`.
- Ink (text, dark objects) navy `#14203f`; muted text `#46537a` (7:1 on white).
- Blue (primary, "tech"): `#86a8ff` / `#4f7cff` / `#2f52c9`.
- Amber (energy, CTA): `#ffd480` / `#ffb547` / `#d9871b`.
- Teal (go / success): `#74e3d2` / `#2cc3ad` / `#1b9482`.
- Pink (accent, warmth): `#ff9fc2` / `#ff6fa3` / `#d44683`.
- Navy objects: `#4a5a8c` / `#2e3a66` / `#1d2547`. Cream walls: `#ffffff` / `#e9effc` / `#ccd8ef`. Wood: `#f0c791` / `#d9a066` / `#b87d46`. Leaf: `#86e096` / `#3fb86a` / `#2a8f52`.
- Avoid: gradients inside faces (kills the flat-solid read); pure black; light direction that flips between objects; more than ~3 accent hues per scene; low-contrast pastel text. White text only on the dark blue `#2f52c9`/navy, never on `#4f7cff` for body sizes.

## Typography
- Historic: technical-drawing block capitals (ISO 3098 lettering), pixel bitmap fonts of the arcade/Spectrum era, Futura/Avenir-style geometric sans in tech marketing.
- Chosen (all SIL OFL, self-hosted, latin subset, variable): **Sora** (Jonathan Barnbrook / Sora Project) 600-800 for display, wide geometric forms that echo blocky solids; **Manrope** (Mikhail Sharanda) 400-800 for body, 16-17px / 1.6, very legible at small sizes; **Pixelify Sans** (Stefie Justprince) 400-700 only for tiny uppercase labels and level numbers at >= 13px (a bitmap nod to Q*bert/Zaxxon without sacrificing legibility).
- Display is extruded with a stacked `text-shadow` along the 30-degree axis (0.866px, 0.5px per step), so the name looks like a solid slab; paragraphs are never skewed or transformed.

## Layout & composition
- The page is a vertical chain of "levels" (stages): each section has a pixel-label "LEVEL nn", a title, a flavour line and one diorama; text always lives on flat, un-transformed white panels (decks) next to or under the art.
- Hero: a floating island with an isometric room (back corner, two walls, floor tiles, desk, monitor, plant, cat, a cube-built developer with glasses) and the portrait hung on the left wall in a thick frame. Nodes of a workflow graph float above.
- Experience: a tower built upward; each job is a floor with its own sticky cutaway diorama, newest on top, education as the foundation.
- Case studies: cards that hold a miniature live scene (compiler with a conveyor, tower of servers, MCP hub, ...) instead of a screenshot; scene wakes on hover / focus.
- Photos: standing "folding screens" - panels alternate +30 / -30 degrees so the base line zig-zags like a W, each a thick board; lightbox for the full picture.
- Shape language: rhombi, hexagons, 30-degree cuts, hard offset slabs; shadows are flat parallelogram contact shadows, never blurry glows.

## Textures, ornaments & imagery
- Procedural SVG only: a tiny projection helper + painter's-algorithm sorter generates boxes, cylinders, stairs, discs and wall-mounted quads at build time (crisp at any size, ~100KB for the whole page).
- Ornament: iso grid wash, tumbling-block divider strip, tiny cube bullets, pixel level labels, soft floor shadows under floating islands.
- Photo recipe "clear air": photos stay natural (the style is about framing, not filtering): +5% saturation, gentle contrast, a touch brighter, shadows pulled toward cool navy (so they sit in the blue ground), highlights untouched. Variants: default, night (smaller lift), scene (a bit more colour for landscapes/food/pets). The 3D comes from CSS: panels skewed with `skewY(+-30deg) scaleX(.866)`, thick edges via pseudo-elements.

## Motion & interaction
- Idle: islands float (translateY, 5-7s), conveyor boxes slide along the 30-degree axis, LEDs step, steam/clouds drift - transform & opacity only, started by IntersectionObserver only while the scene is on screen.
- Hover/focus: case-study and project scenes wake up (conveyor runs, lights blink, gate opens); photo panels lift 10px; buttons press in; stat legend lifts its matching column.
- Hero parallax: 3 depth layers shift a few px with the pointer (rAF-throttled); nav tower on the right edge lifts the current floor while scrolling.
- Reduced motion: every animation and transition is removed, parallax and observers are not started, scenes are static and fully visible.

## UI translation
- Nav: sticky header with a cube logo, text links with a pixel level number; a fixed "floor tower" (stacked slabs) on wide screens that highlights the current section; phone: menu button.
- Buttons: extruded blocks (hard 30-degree offset in the darker face colour), pressing sinks them.
- Cards: white decks with a thick slate bottom edge; scene "windows" with a grid floor; chips with a coloured bottom face.
- Forms: intake chips ("What is it about?") that pre-fill the message, inputs with a 3px slab edge, mailbox scene whose flag pops up when you focus the form.
- Timeline: the tower itself (floors with sticky dioramas). Footer: a row of tumbling blocks and the flavour line.

## Pitfalls & accessibility risks
- Text on skewed planes is unreadable: never skew text; labels over art sit on solid chips.
- Depth ambiguity / overlapping parts: strict painter ordering (topological sort on separating planes), contact shadows for grounding.
- Motion overload: slow, small, off-screen paused, reduced-motion off; nothing flashes (LED blink <= 2 Hz).
- Colour alone: stats/tags carry text labels; chips carry icons + text; focus ring is a 3px amber+navy double ring.
- Skewed photos can hide faces: crop with `object-position: focus`, keep skew to true 30 degrees, lightbox shows the whole picture.
- Performance: pure SVG + CSS transforms; no filters on big layers.

## References
- https://en.wikipedia.org/wiki/Isometric_projection - angles (35.264 + 45 rotation), Farish 1822, scale.
- https://en.wikipedia.org/wiki/Axonometric_projection - isometric / dimetric / trimetric, 1923 De Stijl, ISO 5456-3.
- https://en.wikipedia.org/wiki/Isometric_video_game_graphics - Zaxxon, Q*bert, Knight Lore, SimCity 2000, 2:1 dimetric convention.
- https://www.pikuma.com/blog/isometric-projection-in-games - grid-to-screen formulas, painter's algorithm.
- https://en.wikipedia.org/wiki/EBoy - pixoramas, modular library, "not retro".
- https://en.wikipedia.org/wiki/Monument_Valley_(video_game) - Escher, colour as guide.
- https://en.wikipedia.org/wiki/Fallout_Shelter - cutaway "ant farm" cross-section.
- https://en.wikipedia.org/wiki/Relativity_(M._C._Escher) - impossible staircases.
- https://en.wikipedia.org/wiki/Habbo - isometric rooms and "furni".
All described in our own words; no code, copy or assets taken.

## Decisions for this site
Do:
- True 30-degree isometric, generated procedurally (own helper, no library), three-shade ramps, light from the upper left, flat parallelogram shadows.
- Real text on flat panels; iso art as diorama, header ornament, container shape; photos only skewed by the exact `skewY(+-30deg) scaleX(.866)` mapping.
- Case-study and project cards carry miniature live scenes (hover/focus wakes them).
- Stats as an iso bar-column platform whose heights are explicitly decorative.
- Intake-chip contact with mailbox; folding-screen photo galleries with lightbox.
Do NOT:
- Perspective, gradients inside solid faces, blur/glow effects, skewed paragraphs, parallax that moves text, auto-playing anything off-screen, invented numbers (scene heights are decorative; the only proportional bars use numbers already in the resume: 1.8s vs 550ms, 80% vs 20%).

## Sources
Wikipedia articles listed above (fetched 2026-11-09); Pikuma isometric article; fonts from fontsource (Sora, Manrope, Pixelify Sans: SIL OFL 1.1).
