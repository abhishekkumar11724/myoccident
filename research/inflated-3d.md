# 3D Inflated (2020s)

## Definition
"3D inflated" (also "puffy 3D", "balloon style", "inflatable UI") is a 2020s visual language in which every object, letter and interface element looks pumped full of air: swollen rounded volumes, glossy specular highlights, soft rim light, translucent candy-coloured plastic, pinch points and knots where the skin is tied off, and soft contact shadows under floating forms. It sits between three older lineages: 1960s pneumatic pop design and soft sculpture, the Jeff Koons "balloon" sculptures, and the glossy translucent plastic of late-90s/2000s consumer design (iMac G3, Frutiger Aero), re-rendered by a Gen-Z generation with Blender, Spline and now CSS/SVG. It is volumetric and glossy, which separates it from Neumorphism (flat extruded UI lit by one soft light) and Memphis (flat graphic pattern).

## Origins & timeline
- 1957-1962: Claes Oldenburg turns hard, durable things into limp stuffed fabric: a stocking stuffed with newspaper (1957, now *Sausage*), then *The Store* (Dec 1961, Lower East Side storefront of painted plaster food and clothing), then the sewn "soft sculptures" (*Floor Cake*, *Floor Burger*, *Floor Cone*) sewn by Patty Mucha, canvas filled with foam rubber. Wikipedia: Oldenburg "popularized the term" soft sculpture; everyday objects made soft and oversized is a Pop rebellion against precious sculpture. Lesson for us: scale and softness are comic.
- 1960s pneumatic moment: synthetic films (PVC, nylon) made inflatables cheap. Pneumatic architecture and furniture followed (Archigram, Ant Farm, Haus-Rucker-Co, Utopie; Marc Dessauce's *The Inflatable Moment*, 1999, studies it). The Blow chair (De Pas, D'Urbino, Lomazzi for Zanotta, 1967, from background knowledge - not verified in this session) is the canonical inflatable chair. Expo '70 Osaka US Pavilion (David Geiger) showed air-supported roofs.
- 1978-79: Jeff Koons' first *Inflatables* (flowers and a rabbit among mirrors). 1986: *Rabbit* recasts an inflatable bunny in mirror-polished stainless steel (sold 2019 for US$91.1M with fees). 1994-2000: *Celebration* series, including *Balloon Dog* in five colours (Blue, Magenta, Orange, Red, Yellow), stainless steel with a high-chroma transparent coating; *Balloon Dog (Orange)* sold at Christie's for US$58.4M in 2013. Koons: "We're balloons" (breathing in/out = optimism and mortality). The sculpture is the template for glossy tied-off forms with sharp reflections.
- 1998: Apple iMac G3 (Jony Ive, "Bondi blue", translucent plastic made from light-scattering particles; five fruit colours Jan 1999: blueberry, strawberry, tangerine, grape, lime) starts the translucent-candy-plastic wave ("electronics voyeurism").
- 2004-2013: Frutiger Aero / Web 2.0 gloss: glossy skeuomorphic icons, bubbles, aqua gradients, lens flare (named in 2018 by Sofi Xian of the Consumer Aesthetics Research Institute; revival 2023-24 on TikTok, partly a reaction to flat minimalism and the AI boom).
- 2020-2023: Blender / Cinema 4D "soft body" and "inflated" renders become a Dribbble/Behance staple: puffy 3D letters, balloon-skinned icons, "clay" emoji. Microsoft Fluent Emoji 3D, Apple Memoji-style softness, Spline-made web heroes. Gen-Z Y2K revival (Wikipedia: gradients, 3D elements, glossy or metallic finishes, chunky rounded typefaces, inflatable furniture, throw pillows).
- 2025: Apple "Liquid Glass" (TechRadar: probably influenced by Frutiger Aero) puts translucent, glossy volume back in mainstream UI.

## Defining visual traits (concrete, checkable)
- Every silhouette is a swollen rounded form: border radii of 40-50% of the shorter side; no sharp corners anywhere.
- Light model: a soft key light top-left produces a bright inset highlight along the upper-left, a small crisp elliptical specular blob (white, slightly blurred) near the top-left, and a coloured bounce / colour bleed along the bottom-right edge.
- Skin: translucent coloured plastic, so shadows are the same hue darkened (never grey) and the rim glows slightly lighter than the body (subsurface glow).
- Pinch points: balloons have a knot and a tiny neck; pillows have creased corners where seams meet; inflated type has pinched joins between strokes.
- Floating objects with a soft, blurred contact shadow far below them (shadow gets smaller and lighter as the object rises).
- Heavy rounded display type that looks inflated: thick outlines, a bright inner highlight, a darker underside, a drop shadow beneath.
- Candy pastel palette on an airy gradient ground (sky blue to lilac to pink), with a couple of saturated accents for type.
- Cheerful, slightly absurd scale: oversized type, oversized buttons, objects that "squish" when pressed.

## Colour
Pastels are for surfaces, saturated mid-tones for large type, deep indigo for all body text (never black, never pure grey).
| Role | Hex | Notes |
|---|---|---|
| Ink (body text) | `#2b1d5a` | deep indigo; 11:1 on the paper-white panels |
| Ink soft | `#4a3f86` | secondary text, still > 7:1 on panels |
| Paper (panel fill) | `#fffafd` | opaque pastel-white behind all reading text |
| Sky top | `#d8f0ff` | gradient ground, top of page |
| Sky mid-1 | `#e4d9ff` | lilac band |
| Sky mid-2 | `#ffd9ec` | bubblegum band |
| Sky low | `#fff0c4` then `#cdf7e6` | lemon to mint, bottom |
| Bubblegum | `#ff9ccd` surface, `#e0187c` type/accent, `#b80d5f` shade | primary accent |
| Baby blue | `#8fd3ff` surface, `#2563eb` type, `#2a6fc9` shade | secondary |
| Lemon | `#ffe66d` surface, `#e0b000` shade | surface only (fails contrast as text) |
| Mint | `#9cf0cf` surface, `#008a68` type, `#2fbf8f` shade | |
| Lilac | `#c9b3ff` surface, `#7b4dff` type, `#8a63e8` shade | |
| Peach | `#ffc09a` surface, `#f0773f` shade | surface only |
Avoid: pastel text on pastel (lemon, peach, mint and pink fail 3:1 on the sky), grey drop shadows (use hue-matched indigo-tinted ones), pure white highlights over white panels (use tinted body + white highlight so the volume survives), neon on black (that is Vaporwave/Liquid chrome territory).

## Typography
- Display: **Modak** (Ek Type / Google Fonts, OFL), a single ultra-fat weight whose letterforms are already swollen. Used only large (h1 ~ 9-12rem, h2 ~ 4-7rem, numerals), always with the SVG "inflate" filter on top (blur of the alpha channel as a height map, specular + diffuse lighting). Line-height ~0.8 (Modak has tall metrics).
- UI / labels / card titles: **Fredoka** variable (wght 300-700, OFL, Milena Brandao / Hafontia), rounded terminals, 600-700 for buttons and chips.
- Body: **Nunito** variable (wght 200-1000, OFL, Vernon Adams / Jacques Le Bailly), 500 at 17-18px/1.6, rounded but highly readable.
- Other candidates considered: Bagel Fat One (already used by Memphis), Baloo 2, Chewy, Rubik Bubbles (too gimmicky), Lilita One.

## Layout & composition
- A floating pill-shaped dock as navigation (sticky, centred), not a bar spanning the page.
- Sections are large opaque pillow panels (radius 56-72px) floating over the gradient sky, separated by generous air; giant Modak headings sit directly on the sky (not inside the panels) so they feel like balloon letters tied above each pillow.
- Hero: oversized two-line name, a tagline pillow, three squishy buttons; to the right a cluster of three photo balloons (egg-shaped, knotted, with strings) at different heights, plus puffy stars, hearts, clouds and soap bubbles.
- Experience: a vertical rope (garland) with an inflated numeral balloon per role and a cushion card for each role; bullets are small pouches inside the cushion.
- Case studies: inflated tiles, each with a knot at the bottom pinch, in a two-column grid.
- Projects: the "signature move" - a name-only index in oversized type; hover or keyboard focus inflates a preview bubble in a sticky right column (card list on touch and narrow screens).
- Skills: tiny balloons / bubbles in groups; stats: glossy bubbles of different diameters.
- A "Squishy Lab" corner of four toys with keyboard hints.

## Textures, ornaments & imagery (and the photo-treatment recipe + why)
- Ornament: puffy stars, hearts, clouds, soap bubbles, balloons with knots and curly strings, tiny sparkle crosses. All hand-written SVG / CSS gradients (no raster art).
- Depth is built from layered `radial-gradient` highlights, multiple `inset` box-shadows (light top-left, hue-matched bleed bottom-right), `filter: drop-shadow` / large soft box-shadows for floor shadows, and one SVG filter family (`feGaussianBlur` on `SourceAlpha` as the bump map, `feDiffuseLighting` multiplied into the source, `feSpecularLighting` added on top) for headline type and numerals. The SVG filters run only on small, static elements and are never animated.
- Photos stay natural (the guide says lighting/framing styles keep photos natural). Recipe "pastel lift": mild saturation (~1.06), gamma lift, blacks lifted into a violet floor (`#40355f`-ish), highlight roll-off so there is no clipped glare inside glossy frames, soft bloom (blurred copy screened at low opacity), and a faint pink-top-left / sky-blue-bottom-right soft-light grade so the pictures sit inside the candy palette. Night shots get a gentler lift. The inflation is done in CSS: photos live in pillow frames (thick coloured plastic rim, big radius, glossy overlay, soft shadow) or inside balloon shapes.

## Motion & interaction
- Balloons and clouds bob / drift with transform-only keyframes (6-14s ease-in-out). Reduced motion: all infinite animation removed, objects rest in a pleasant pose.
- Buttons squish on press (scale 1.06 -> .94/.88 non-uniform, spring cubic-bezier(.34,1.56,.64,1)); reduced motion: no spring, only a colour/shade change.
- Cards bob up 6px and tilt slightly on hover; project names inflate (scale 1.06) and their preview bubble pops in.
- Sections "inflate in" once on scroll (scale .94 to 1, opacity). Reduced motion: shown immediately.
- Cursor-follow specular highlight on the hero balloons and the lab orb; arrow-key control of the light when focused.
- Lab toys: pump-a-balloon (hold Space / Up arrow, Down to let air out, pops at 100%), squish pad, bubble blower (B), light orb (arrow keys).
- Nothing flashes; no filter is animated; `will-change: transform` only on ~10 floating elements.

## UI translation
- Nav: a floating pill dock with balloon-pill links; active link inflates and turns candy-coloured; collapses to a "Menu" balloon under ~1100px.
- Buttons: huge rounded capsules with a glossy top highlight and hue-matched bottom shade; pressed = squish.
- Cards: opaque pastel-white or tinted pillows with big radii and a knot at the bottom; hover bob.
- Forms: inputs are "pressed into" the pillow (inset shadow), focus = glowing coloured ring; submit is a squishy capsule.
- Footer: soft cloud edge and a one-line flavour sentence.
- Timeline: a rope with balloon numerals.

## Pitfalls & accessibility risks (and mitigation)
- Pastel on pastel contrast: all reading text is deep indigo on opaque pastel-white or light-tinted panels; headings that sit on the sky use saturated mid-tones (pink `#e0187c`, blue `#2563eb`, violet `#7b4dff`, teal `#008a68`) that clear 3:1 as large text; lemon/peach never used for text.
- Heavy SVG filters: only on small static elements (h1, h2, numerals); no filters on full-width layers; not animated; the hero h1 is the largest.
- Too many animations: capped, transform-only, all stopped under `prefers-reduced-motion`.
- Modak's tiny counters are hard to read small: use it only at >= ~40px; everything smaller is Fredoka / Nunito.
- Cute can read as unprofessional: the facts stay in plain Nunito on clean panels, the information hierarchy is conventional, and the whimsy lives in decoration and interaction.
- Hover-only content: the project index also reacts to keyboard focus and falls back to plain cards on touch / narrow screens.

## References
- https://en.wikipedia.org/wiki/Balloon_Dog - Koons, 1994-2000, five colours, stainless steel; the gloss and tied-off form template. (Studied only; no images reused.)
- https://en.wikipedia.org/wiki/Jeff_Koons - Inflatables (1978-79), Rabbit (1986), Celebration (1994-), Popeye series cast to look like shiny inflatables.
- https://en.wikipedia.org/wiki/Claes_Oldenburg and https://en.wikipedia.org/wiki/Soft_sculpture - soft sculpture of everyday objects; Pop context.
- https://en.wikipedia.org/wiki/Frutiger_Aero - glossy 2004-2013 UI and its 2020s revival.
- https://en.wikipedia.org/wiki/Y2K_aesthetic and https://en.wikipedia.org/wiki/IMac_G3 - translucent candy plastic, chunky rounded type, inflatable furniture.
- https://en.wikipedia.org/wiki/Skeuomorph - skeuomorphism vs flat design (2013 iOS 7), the swing back.
- https://en.wikipedia.org/wiki/Inflatable - 1960s inflatables in design and architecture, Expo '70.
- https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feSpecularLighting - the lighting primitive used for the inflate filter (alpha as bump map, add with feComposite arithmetic).
- Contemporary: Blender "soft body" / inflated-type renders by artists such as Ryan Haskell-Glatz (named in the brief; not fetched), Apple Memoji and Microsoft Fluent 3D emoji for the soft-plastic character. Inspiration notes (`research/_inspiration.md`): oversized type over a pastel scene with a name-only project index (Belen Jones), and a /craft-style lab of interaction toys with keyboard hints (Shahriar Avi, Interaction Library).

## Decisions for this site (what we do / deliberately do NOT do)
Do:
- Pastel-sky ground, opaque pillow panels, balloon-shaped photo frames, SVG-inflated headline type (Modak + lighting filter), floating dock nav, rope-and-balloon experience timeline, knotted case-study tiles, name-only project index with inflating preview, bubble stats, balloon skills, and a four-toy squishy lab.
- Keep photos natural with a pastel lift; do the inflation in CSS.
- Keep all reading text on opaque pastel-white or light panels in deep indigo.
- Respect reduced motion fully (no infinite animation, no spring, no reveal animation).
Do not:
- Use WebGL / three.js (not needed; page JS stays tiny).
- Animate SVG filters or put filters on full-viewport layers.
- Use grey shadows, neon-on-black, flat colour blocks, thick black outlines (Memphis) or single-light extruded neumorphic plates.
- Copy any existing site, Koons, Oldenburg or Apple artwork; every shape is original SVG / CSS.

## Sources
- WebFetch (2026-11-09): Wikipedia pages on Balloon Dog, Jeff Koons, Claes Oldenburg, Soft sculpture, Frutiger Aero, Y2K aesthetic, iMac G3, Skeuomorph, Inflatable; MDN feSpecularLighting.
- Not retrievable in this session: web search results (no WebSearch tool; Google / DuckDuckGo blocked), Wikipedia pages for Blow chair and pneumatic architecture (404). The Blow chair details above are from background knowledge and flagged as unverified.
- Fonts: https://fontsource.org/fonts/fredoka (OFL-1.1 confirmed), Modak and Nunito via Fontsource (OFL).
