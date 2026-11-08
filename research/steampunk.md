# Steampunk (Victorian retro-futurism, 1980s - now)

## Definition
Steampunk is a retro-futurist style and science-fiction subgenre that imagines 19th-century steam-and-clockwork technology as if it had kept developing: airships, brass analytical engines, pneumatic tubes, telegraphs and goggles, all set in an alternate Victorian or Belle Epoque world. It is not nostalgia for the real Victorian age (that is Neo-Victorianism); it is the Victorian *dream of the future*, built with visible mechanisms, craftsmanship and a "non-luddite" love of machines. As a visual style it is materials-first: polished brass, copper with verdigris, riveted iron, walnut, leather, parchment, engraving and blueprint.

## Origins & timeline
- 1860s-1900s source material: Jules Verne (Twenty Thousand Leagues Under the Sea, 1870; Around the World in Eighty Days), H.G. Wells (The Time Machine 1895, The War of the Worlds 1898). Victorian engraving, patent drawings, trade catalogues and wood-type posters supply the graphic language.
- 1822-1871: Charles Babbage's Difference and Analytical Engines (punched cards borrowed from the Jacquard loom; Ada Lovelace's 1843 notes). The engines were never finished in his lifetime; the London Science Museum built Difference Engine No. 2 in 1991. They are the founding "what if" of the genre.
- 1849: Eugene Bourdon patents the pressure gauge; 1852: Henri Giffard flies the first steam-powered airship (27 km); 1842: Herschel's cyanotype gives the blueprint; 1837-1844: Morse's telegraph ("WHAT HATH GOD WROUGHT", 24 May 1844). These objects become the genre's iconography (gauges, airships, blueprints, telegrams).
- 1954 Disney's 20,000 Leagues (the Nautilus look); 1959 Mervyn Peake's Titus Alone; 1965-69 The Wild Wild West; 1971 Moorcock's The Warlord of the Air.
- 1979-1987: K.W. Jeter (Morlock Night 1979, Infernal Devices 1987), Tim Powers, James Blaylock. April 1987 Locus letter: Jeter coins "steampunk" as a joke on cyberpunk.
- 1986 Miyazaki's Laputa: Castle in the Sky ("one of the first modern steampunk classics"); 1990 Gibson & Sterling's The Difference Engine; 1999 The League of Extraordinary Gentlemen; 2004 Howl's Moving Castle and Steamboy.
- 1994 Francois Schuiten's Arts et Metiers metro station in Paris (brass cladding, giant cogs, portholes). 2006-2015 Neverwas Haul at Burning Man; 2009-10 Oxford Museum of the History of Science steampunk exhibition (Art Donovan, 80,000+ visitors). Maker culture, keyboard/guitar modding, Etsy boom 2009-11.

## Defining visual traits
- Visible mechanism as ornament: gears and cogs, pistons, valves, pipes, flywheels, chains, springs.
- Instruments: round pressure gauges with swinging needles, thermometers, clock dials with roman numerals, telegraph keys, switch levers, brass plaques.
- Airships, balloons, zeppelins, goggles, top hats, pocket watches, keys, compasses, astrolabes.
- Riveted plates, bolts and hex nuts; brass bezels; leather straps with buckles; walnut and mahogany panelling.
- Engraved/etched Victorian ornament: filigree corners, scroll borders, cartouches, banner ribbons.
- Aged paper: parchment, sepia photographs, cabinet cards, wax seals, blueprints, patent plates, telegram blanks, punched cards.
- Warm lamp-light and gaslight glow; slightly smoky air; verdigris patina against warm metal.

## Colour
| Role | Hex |
|---|---|
| Walnut / leather (page ground) | `#1f130b` `#2b1a10` `#3b2416` |
| Pullman green (experience ground) | `#14302a` `#1d4137` |
| Riveted iron | `#25292b` `#3a3f42` `#565c60` |
| Brass (highlight -> shadow) | `#f7e6b0` `#e3bf6b` `#c2943c` `#8a6420` `#4e3610` |
| Copper | `#c9774a` `#b4673a` `#7d3f20` |
| Verdigris / patina | `#9fd3c4` `#3f9d8a` `#2b7365` |
| Parchment | `#f0e3c0` `#e6d4a6` `#d4bf8a` |
| Ink / sepia | `#2a1c10` `#4a2f1a` `#6b4627` |
| Blueprint (cyanotype) | `#0f3258` `#14477a` lines `#cfe5f7` |
| Lamp glow | `#ffb23e` `#ffd27a` |
| Wax / oxblood (warning, seals) | `#8c2a1f` `#b23a26` |
Combos to avoid: neon or pure saturated colours, flat grey-on-grey (reads as industrial-modern not Victorian), bright white backgrounds, brass text on parchment (low contrast: brass is for dark grounds only), cool blue-white LEDs.

## Typography
- Victorian display: fat faces (Didone extremes), Tuscan wood type, Egyptians/slabs, Clarendons, mixed on one poster; engraved roman capitals on brass plates; typewriter or telegram caps for machine text.
- Chosen (all self-hosted, latin subset):
  - **Abril Fatface** (TypeTogether, OFL): the fat-face poster voice for h1/h2/section titles. 400 only.
  - **Cinzel 700** (OFL): engraved roman capitals for plates, nav keys, labels, bullet heads (uppercase, +0.1em tracking).
  - **Libre Baskerville** variable 400-700 + italic (OFL): readable body serif, 16-18px/1.7, dark ink on parchment or cream on walnut.
  - **Special Elite** (Apache-2.0): typewriter for telegram/timetable/parts-list/ticket detail text and numerals.
- Rejected: Rye/Sancreek (read Wild West saloon more than airship), IM Fell (too rough for body at small sizes), blackletter (wrong register).
- Scale: h1 clamp(2.8rem, 8vw, 6.4rem); h2 clamp(2rem, 4.5vw, 3.2rem); body 1.05rem; labels 0.72-0.8rem uppercase Cinzel/Special Elite.

## Layout & composition
- Reads as *an airship chart-room / engineer's console*: the page is a set of physical surfaces stacked vertically - leather hero, iron gauge panel, parchment sheets, Pullman-green timetable, blueprint sheets, walnut drawer cabinet, drafting paper patent sheets, dark brass-and-porthole album, newsprint gazette, walnut telegram desk - separated by riveted brass trim rails.
- A vertical copper pipe with flanges and valve wheels runs down the left margin on wide screens and "feeds" each section.
- Symmetric, framed, ornamented: plates with 4 corner rivets, double-ruled borders, corner filigree; generous padding so facts stay readable.
- Shape language: circles (gauges, portholes, cogs) against rectangles (plates, cards, drawers); bevels and inner shadows rather than flat fills.

## Textures, ornaments & imagery (and the photo recipe)
- Procedural, self-made textures (node + sharp, tileable): parchment fibre, walnut grain, pebbled leather, brushed iron, linen grain. SVG for gears (build-time path generator), gauges, clock, airship, filigree.
- Photo recipe `recipe.mjs`: "albumen print / engraving" - tone-corrected luminance mapped through a sepia-brass gradient map (deep walnut shadows -> brass mid -> cream highlights); a fine diagonal engraving line-screen multiplied over the shadows (burin hatch) with light edge ink; aged paper texture, soft vignette, grain. Night shots get a lifted shadow curve and warm lamp tint. Face detail is preserved by blending line-screen at partial strength only on darks and keeping midtone resolution.
- Why: sepia plus engraved hatch instantly reads Victorian photography/print and unifies 60 mixed-colour phone photos.

## Motion & interaction
- Gauge needles swing to their value once when scrolled into view (springy cubic-bezier). Live brass clock (IST) with ticking second hand. Availability gauge needle settles on the "48h" mark.
- Slow gear rotation in hero/section heads (CSS transform only, started by IntersectionObserver). Airship drifts across the hero. Scroll-linked rotation of two large background cogs. Telegraph key press animation on nav and buttons (translateY + inner shadow). Nav "lamp" lights on the active section.
- Photos: click opens a brass-framed viewing dialog; "Show original" toggle.
- Reduced motion: all infinite animation removed (media query), needles drawn at final position, clock updates without transition, no drift/scroll-linking.

## UI translation
- Nav: sticky riveted brass header; each section a telegraph-key style button with a roman numeral and an amber lamp for the active one; a mini clock dial at right; a valve-wheel toggle on mobile.
- Buttons: brass lever/keys with bevel; pressed = inset. Focus: 3px amber ring plus offset.
- Cards: stats = pressure gauges; experience = railway timetable boards + track of numbered stops; case studies = blueprint sheets with title block and dimension-line impact figures; projects = apothecary-style drawer fronts with brass pulls and label holders; skills = patent plates ("FIG. n") with numbered parts lists; photos = portholes / riveted plates / cabinet cards; writing = newspaper gazette; contact = telegram blank + telegraph panel.
- Form: telegram blank (TO / FROM / REPLY TO / MESSAGE) with typewriter inputs, "Send telegram" brass key.
- Footer: manufacturer's maker's plate.

## Pitfalls & accessibility risks
- Skeuomorphic overload hurting readability -> every text block sits on a solid parchment, cream-on-walnut or iron surface with >= 4.5:1; decoration is aria-hidden.
- Brass text on mid-tone backgrounds -> brass only on very dark grounds (>= 7:1), ink only on parchment.
- Cliche clutter (random gears everywhere) -> gears are functional anchors: section plates, gauge, clock.
- Performance of textures/filters -> pre-rendered webp tiles, no live SVG filters on large areas; transform-only animation; animations start only when in view.
- Motion sickness / flashing -> slow rotations only (> 20s per turn), no flicker, nothing flashes.
- Gauge values are decorative needles; the actual numbers are real text next to them.

## References
- Wikipedia "Steampunk": definition, term origin (Jeter 1987), Laputa/Howl/Difference Engine timeline, Schuiten metro station.
- Wikipedia "Analytical Engine": Babbage/Lovelace, punched cards, mill/store.
- Wikipedia "Bourdon gauge": Bourdon 1849 gauge anatomy (dial, needle, sector gear).
- Wikipedia "Blueprint": cyanotype 1842, white-on-blue sheets.
- Wikipedia "Patent drawing": reference characters with lead lines, black line art, sheet "n of N".
- Wikipedia "Electrical telegraph": Morse 1844 message, key and sounder.
- Wikipedia "Wood type": Victorian fat face / slab / Tuscan display.
- Wikipedia "Airship": Giffard 1852, envelope, gondola, fins.
- Wikipedia "Victorian decorative arts": ornament, wallpaper and colour.
- Studio Ghibli's Laputa (1986) and Howl's Moving Castle (2004): inspiration for scale and warmth only, nothing copied.
- Reference only; no third-party art, copy or code is reused.

## Decisions for this site
- DO: gauge-cluster nav + live brass clock (IST) + availability gauge; hero = console with a big porthole portrait; stats as gauges; experience as timetable boards; blueprint case studies with dimension-line impacts; drawer-cabinet projects; patent-plate skills; porthole/plate/cabinet-card photo album with viewing dialog; newspaper gazette for writing; telegram form.
- DO NOT: use third-party brass textures or stock gear clipart; use steam/particle canvases; make text sit on busy backgrounds; use Wild West fonts; loop anything faster than slow rotation.
- Availability line "Replies within 48h" is a lead-requested flavour line (flag for confirmation).

## Sources
- https://en.wikipedia.org/wiki/Steampunk
- https://en.wikipedia.org/wiki/Analytical_Engine
- https://en.wikipedia.org/wiki/Bourdon_gauge
- https://en.wikipedia.org/wiki/Blueprint
- https://en.wikipedia.org/wiki/Patent_drawing
- https://en.wikipedia.org/wiki/Technical_drawing
- https://en.wikipedia.org/wiki/Electrical_telegraph
- https://en.wikipedia.org/wiki/Wood_type
- https://en.wikipedia.org/wiki/Airship
- https://en.wikipedia.org/wiki/Victorian_decorative_arts
- https://en.wikipedia.org/wiki/Howl%27s_Moving_Castle_(film)
- Fontsource / jsDelivr package metadata for Abril Fatface, Cinzel, Libre Baskerville (OFL-1.1) and Special Elite (Apache-2.0)
