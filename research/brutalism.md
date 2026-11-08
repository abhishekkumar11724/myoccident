# Brutalism (1950s - now): architecture + web

_Research date 2026-11-09. Sources fetched with WebFetch (Wikipedia, NN/g, Awwwards, brutalistwebsites.com). WebSearch was not available. Where a fact comes from my own background knowledge and was not confirmed by a fetched page, it is marked (unverified)._

## Definition
Brutalism is two things that share a name and an attitude. In architecture it is the 1950s-70s movement of raw, unfinished, monolithic buildings in exposed concrete (*béton brut*), with structure and services left visible and materials shown "as found". On the web it is the (2014 onward) reaction against polished, friendly, template-driven design: system fonts, default HTML, harsh unmixed colours, visible structure, and deliberately unpolished layouts; its softer descendant "neobrutalism" adds saturated colours, thick outlines and hard offset shadows. This site blends both on purpose: the *material* and *plan* of the first, the *typographic bluntness and visible structure* of the second, and none of the pastel-card prettiness of the neobrutalist UI trend.

## Origins & timeline
| Date | Event |
|---|---|
| Jan 1950 | Hans Asplund coins Swedish *nybrutalism* ("new brutalism") for Villa Goth, Uppsala (brick, Bengt Edman and Lennart Holm). |
| 1947-52 | Le Corbusier's Unite d'habitation, Marseille: 337 apartments on pilotis, raw board-marked concrete (steel was too expensive post-war). He coins *beton brut* during construction. |
| 1949-54 | Alison and Peter Smithson's Hunstanton School, the first building labelled "New Brutalist": steel frame, sand-lime brick, glass, exposed pipes and a stand-alone water tower. |
| Nov 1953 | Alison Smithson's first published use of "new brutalism" (Architectural Design). |
| 1955 | Reyner Banham's essay "The New Brutalism" (expanded 1966 as *The New Brutalism: Ethic or Aesthetic?*). His test: a legible plan, visible structure, materials valued "as found". He also links it to *art brut*. |
| 4 Nov 1955 | Soviet decree "On the Elimination of Excesses in Design and Construction" starts Soviet architectural modernism (1955-1991). |
| 1951-61 | Le Corbusier's Chandigarh Capitol Complex. |
| 1959-65 | Louis Kahn's Salk Institute, La Jolla: poured concrete made with volcanic ash in the manner of Roman concrete, a travertine court with one water channel. |
| 1962-69 | Boston City Hall (Kallmann McKinnell & Knowles): competition won May 1962, dedicated Feb 1969. Three stacked tiers that mirror the interior plan, brick base, concrete "hoods" over council windows, paired precast fins above. Won the AIA Honor Award 1969; routinely on "ugliest building" lists. |
| 1964-67 | Moshe Safdie's Habitat 67, Montreal (Expo 67): 354 identical precast concrete boxes stacked into stepped pyramids, 146 homes, each with a roof garden on the unit below. |
| 1965-76 | Barbican Estate, London (Chamberlin, Powell and Bon): concrete jackhammered to expose aggregate ("the distressed effect of older stonework"), three 42-storey towers, raised podium and highwalks. Grade II listed 2001. |
| 1968-70 | Denys Lasdun's UEA "ziggurats"; Preston bus station; Geisel Library, UCSD. |
| 1977 | Genex Tower, Belgrade (Mihajlo Mitrovic). |
| Late 1970s | Popularity collapses: stained concrete, leaks, association with urban decay and state power. 2005 UK TV vote: 8 of 12 buildings picked for demolition were brutalist. |
| 2004-2019 | Losses: Tricorn Centre, Birmingham Central Library, Robin Hood Gardens, Welbeck Street car park. |
| 2013 / 2021 | Preston bus station listed Grade II; Dunelm House saved. |
| 2014 | Pascal Deville launches Brutalist Websites (unverified: the fetched page only shows its tagline, framing brutalism as a younger generation's pushback against "the lightness, optimism, and frivolity of today's web design"). |
| 2015+ | Revival: books, guides, #SOSBrutalism; "neobrutalism" buildings (Wang Shu's Ningbo Museum 2008, UTEC Lima 2015). In UI design the term migrates to thick-outline, hard-shadow, saturated-colour interfaces (NN/g, April 2025 cites Gumroad and Figma's brand refresh). |

Why it looked this way: post-war Britain and Europe needed a lot of housing and public buildings, cheaply; concrete was cheap, could be cast in place, and "honesty" about material and structure was an ethic ("an ethic, not an aesthetic"). In the Eastern bloc concrete also signalled equality: older styles were tied to the bourgeoisie. Soviet modernism often added mosaics, bas-reliefs and facing stone, so it is related to but not the same as British/US brutalism.

## Defining visual traits
- Exposed, unpainted concrete; surface carries the **board-marked** imprint of its timber formwork (horizontal board seams, wood grain), or is bush-hammered/jackhammered to show aggregate.
- Regular grids of **tie-holes** (cone holes) where formwork was clamped: round dimples at even spacing.
- Massive, blocky, **monolithic** volumes; heavy overhangs on thin pilotis; strong repeated **modules** (Habitat 67 boxes, Barbican blocks, Boston City Hall's 14-ft bays).
- **Structure and services shown**: pipes, trusses, stairs, water towers; plan legible from the elevation (functions grouped and expressed as separate volumes).
- Almost monochrome: greys, with brick and timber as secondary materials; no applied decoration. Colour appears only as a rare strong accent (Unite's loggia colours, signage, hazard tape).
- Hard light and deep cast shadows; weathering streaks, moss and rust stains are part of the look.
- Web: default/system or monospaced type at extreme sizes, all-caps, harsh unmixed colours, 1990s HTML tables and borders, visible grid, raw underlined links, pointer-heavy hover states, asymmetric or "broken" layout, ASCII-ish ornament. Neobrutalism: 2-4px black outlines, hard offset shadows (e.g. 4px black), flat saturated fills, chunky block layouts, heavy quirky display type, buttons that "press" into their shadow.

## Colour
All colours chosen for AA contrast; ONE signal colour only.
| Role | Hex | Notes |
|---|---|---|
| Wet concrete / dark slab | `#1b1b1a` | sidebar, footer, inverted rows; text on it `#ecebe6` (14:1) |
| Shuttering black | `#0c0c0b` | borders, rules, headings, shadows |
| Weathered concrete (page) | `#cfcdc7` | main page field; text `#0c0c0b` (13:1) |
| Light concrete (panels) | `#e1dfda` | cards, alternate slabs |
| Limewash white | `#f4f2ed` | form fields, quiet slabs |
| Mid concrete (muted text on light) | `#4a4843` | meta text, 7.3:1 on `#cfcdc7` |
| **Signal: acid / high-vis yellow** | `#e4ff1a` | blocks, highlights, active states, hazard stripes. Used as a *background* with black text (17:1) or as *text on dark* (13:1). Never as text on light concrete. |
Avoid: yellow text on light grey; pastel fills; gradients; more than one accent; pure `#fff`/`#000` flat contrast everywhere (the greys are what make it concrete rather than "default HTML"). Why yellow not red: Bauhaus, De Stijl and Memphis in the same rotation are red-led; acid yellow + black is also the actual palette of the building site (hazard tape, high-vis).

## Typography
- **Display + body: Archivo variable** (Omnibus-Type, SIL OFL; fontsource `archivo:vf`, wght 100-900 and wdth 62-125). A neo-grotesque with a *width axis*, so the same file gives a monumental, extra-heavy, expanded caps for headlines (`wght 900, wdth 112`) and a calm, narrower text face (`wght 400-500, wdth 100`). Historic reference: the blunt grotesques of 1950s-70s signage and Swiss/International style, the lettering cast or screwed onto concrete façades.
- **Labels, numbers, meta, code-ish bits: IBM Plex Mono** 400/700 (IBM, SIL OFL). Plex descends from IBM's corporate identity (Paul Rand/Eliot Noyes era), a contemporary of brutalism itself, and carries the "web brutalism = monospace / typewriter" signal without resorting to Courier.
- Scale: section titles `clamp(2.4rem, 7vw, 6.4rem)` uppercase, tracking `-0.02em`, line-height `.88`; body 17px/1.6 Archivo 400; mono labels 12.5-13px uppercase, tracking `.06em`. Never body text below 15px.
- Alternatives considered: Anton (too tall/condensed, poster rather than slab), Space Grotesk (too "startup"), Courier/Times as true default fonts (unreliable across OS; kept only as fallback stack).

## Layout & composition
- Architecture reading: the page is a **building** with a **floor directory**. A fixed vertical rail (the "core") holds the name and an index of numbered floors; the content is stacked **slabs** (full-width bands, hard borders, alternating concrete/white/black/yellow). Ground floor = hero (00), then 01 About ... 08 Contact.
- Visible structure: 3-4px black rules between slabs, grid cells that share borders (modules), table-style rows for experience/projects/skills, drawing-sheet title blocks on case studies, faint column grid lines on the hero.
- Experience bullets (9 at Delhivery) become a **3x3 module wall** with collapsed borders, a nod to Habitat 67's repeated units.
- Spacing scale on a 8px base: 8, 16, 24, 32, 48, 72, 112. Slabs have generous padding (48-112px) but tight leading in headlines.
- Shape language: right angles only. No border radius anywhere. Hard offset shadows (6px solid black or yellow) only on things that are physically "pressable" or "raised" (buttons, hero photo frame).
- Ornament (sparingly): hazard-stripe band, tie-hole dot grid on large slabs, registration "+" marks, section numbers, slab "plate" labels (P-01...). Nothing curvy.

## Textures, ornaments & imagery
- Page background: warm concrete grey with a procedural SVG noise layer (feTurbulence, inline data URI, static, <2KB) and a faint horizontal **board-mark** pattern (repeating 1px lines every ~72px) plus a **tie-hole** grid (radial-gradient dots) on large dark slabs. All CSS/SVG, zero image weight.
- **Photo recipe ("cast in concrete")** in `recipe.mjs`: greyscale -> local exposure balance (so backlit faces survive) -> percentile auto-levels -> contrast 1.3 -> 4-stop concrete tone ramp (`#0c0c0b`, `#403e3a`, `#a09d95`, `#f1efe9`) -> procedural cloud mottle (weathering) and speckle (air-void pitting) -> coarse 2px triangular grain, strongest in midtones. Why: reads as a stark xerox/concrete cast at thumbnail size, matches the palette, faces remain recognisable (checked on backlit snow, night and group shots). Original colour returns on hover/focus (swap in JS, not both images preloaded).
- Photos in square-edged frames with 3px black borders, joined in a **panel wall** with 3px joints (like precast panels), small mono plate labels, no rounded corners, no drop shadows except the hero frame.

## Motion & interaction
- Nothing floaty. Interactions are **abrupt and heavy**: state changes in 0-90ms with `steps()`/linear, buttons translate 4px into their shadow on `:active`, rows invert (black/yellow) on hover.
- Rail "floor indicator": IntersectionObserver highlights the current section and shows its number large (like a lift indicator).
- Load: hero name lines slide up out of clip masks once (500ms, staggered). Section titles "rise" once on first view (clip-path inset). Interest ticker (hazard band) scrolls slowly.
- Reduced motion: no entrance animation, ticker is static and wraps, no transitions; hover swaps remain (instant, non-animated). Nothing flashes more than 3x/s.
- No smooth-scroll hijacking; `scroll-behavior: smooth` only when motion is allowed; `scroll-margin-top` correct for the mobile top bar.

## UI translation
- **Nav**: desktop = fixed 264px left rail "floor directory" (dark concrete) with numbered links, active floor in yellow block, resume button at the bottom. Mobile = sticky top slab with name + `INDEX` `<details>` that opens a 2-column numbered grid.
- **Buttons**: rectangular, 3px black border, yellow or white fill, mono caps, 6px hard shadow; hover moves them 2px, active 6px (fully pressed); focus-visible = 4px black outline + 3px yellow ring.
- **Links**: raw, underlined (2px, offset 3px), hover = yellow highlight block; external links marked with an arrow glyph.
- **Cards / case studies**: "drawing sheets" with a title block (org / role / period / sheet n of N) in mono cells; impact figures in yellow modules.
- **Forms**: white fields, 3px black border, no radius, mono labels, focus ring yellow with black outline.
- **Timeline / experience**: three-column table row (company+dates | role | module wall).
- **Skills**: a wall of precast tiles (collapsed borders), familiar skills with dashed outline and "(familiar)".
- **Writing**: styled as a site "planning notice" board: PLANNED WORKS, each title a row with an IN PLANNING tag (profile data says nothing is published yet; no claims added).
- **Footer**: dark slab, oversized cropped name, build-year stamp.

## Pitfalls & accessibility risks
- Yellow on light concrete fails contrast: yellow is only a fill with black text, or text on near-black. Enforced with variables.
- Giant uppercase text is hard to scan: used for headings only; body is sentence case in a normal weight/width.
- Hard borders everywhere cause clutter: keep padding generous (24-32px) inside cells; limit borders to 3px on structure and 2px inside cells.
- Hover-only colour reveal: colour is a bonus, not information. Same reveal on `:focus-within` and tap-to-open lightbox on touch.
- Fixed rail must not hide content or the UtilityBar: rail is a grid column, not an overlay; bottom padding 96px.
- Heavy photo grain increases file size: coarse grain at q62, thumbnails 480px (avg ~45KB), lazy-loaded.
- Brutalism's "ugliness" must not become unusability: obey the guide's AA contrast and 44px targets; the rawness is typographic and material, not in broken interaction.

## References (describe, never copy)
- Boston City Hall (Kallmann McKinnell & Knowles, 1962-69), https://en.wikipedia.org/wiki/Boston_City_Hall: stacked tiers that expose the plan; the model for the stacked-slab page.
- Barbican Estate (Chamberlin, Powell and Bon, 1965-76), https://en.wikipedia.org/wiki/Barbican_Estate: jackhammered aggregate texture, elevated highwalks; model for the paper-texture noise and "highwalk" rail.
- Habitat 67 (Safdie, 1967), https://en.wikipedia.org/wiki/Habitat_67: repeated modules; model for the 3x3 experience wall and the stats wall.
- Unite d'habitation (Le Corbusier, 1947-52), https://en.wikipedia.org/wiki/Unit%C3%A9_d'habitation: origin of *beton brut*; model for the floor-directory idea.
- Hunstanton School (Smithsons, 1949-54), https://en.wikipedia.org/wiki/Hunstanton_School: "structure and services visible"; model for exposing the grid and rules.
- Salk Institute (Kahn, 1959-65), https://en.wikipedia.org/wiki/Salk_Institute_for_Biological_Studies: symmetry and monumental calm; model for the hero's heavy vertical axis.
- Soviet architectural modernism, https://en.wikipedia.org/wiki/Soviet_architectural_modernism: concrete as equality; mosaic and relief ornament inspired the hazard/stripe motif.
- Brutalist Websites (Pascal Deville, 2014), https://brutalistwebsites.com/: a single long list of raw sites; model for the project "schedule" index.
- Awwwards "Brutalism" collection, https://www.awwwards.com/awwwards/collections/brutalism/: items tagged "Brutalist layout", "Brutalist footer", "Brutalist menu with crazy flashing colors on hover" (we do not flash; hover = invert).
- NN/g "Neobrutalism" (April 2025), https://www.nngroup.com/articles/neobrutalism/: defines the trend and its accessibility risks (contrast of yellow/cyan, condensed display fonts hurting paragraphs); our mitigations follow its best-practices list.
- Inspiration for portfolio patterns: `research/_inspiration.md` (#1 numbered work list, #2 year/title/type table, #13 results-first titles).

## Decisions for this site
Do:
- Concrete greys + black + white + ONE acid-yellow signal; no gradients, no radii, no pastel.
- Fixed floor-directory rail (desktop) / sticky top slab with `<details>` index (mobile); numbered floors 00-08; live floor indicator.
- Huge uppercase Archivo (wide/black) headlines, Plex Mono labels, sentence-case Archivo body.
- Visible grid, 3px structural rules, collapsed-border module walls, title-block case studies, row-schedule projects, tile-wall skills, notice-board writing.
- Photos: stark concrete-toned greyscale with coarse grain; colour returns on hover/focus; square frames, joint-line gallery.
- Hard, abrupt interactions; buttons that press into their shadow.
Do NOT:
- Use neobrutalism Dribbble clichés: pastel fills, rounded corners, multi-colour offset shadows, emoji, sticker rotations.
- Use real hazard imagery as text backgrounds, flashing colours, or any decorative element that hurts legibility.
- Invent facts: every number comes from `profile`; flavour lines only restyle ("Floor 03", "Schedule of works").

## As built (notes after implementation)
- Palette in code: ink `#0c0c0b`, coal `#1b1b1a`, concrete `#cfcdc7` / `#e1dfda`, limewash `#f4f2ed`, signal `#e4ff1a`. Concrete noise alpha was turned down after the first render (it read as dirty grey, not cast concrete).
- Fonts: Archivo variable (one 90KB file covers wght 100-900 and wdth 62-125; headlines use wght 900 / wdth 112-125, body wght 400-600 / wdth 100) + IBM Plex Mono 400/700. Total ~120KB.
- Photo recipe adds two custom steps on top of the shared Fx: local exposure balance (divide by a heavily blurred copy, strength .5) so backlit faces survive, and a percentile auto-tone whose gamma is clamped to 0.55-1.2 (a stronger darkening gamma erased the face in a bright snow shot). Output: avg thumbnail 46KB (480px), full-size 100-250KB (1200px, q62).
- The page ships a CSS reset scoped under `body.bt` and prefixes every class `bt-` because the dev server injects other themes' CSS and the clean template's `<style is:global>` into every theme page (see final report). `all: revert` on the content tags restores UA defaults before the theme rules apply.
- Interaction details that were not in the plan: photo viewer (dialog) with Colour/Mono toggle and arrow keys, floor indicator in the rail (scroll-spy), hazard band + interest ticker under the stats wall, "Currently" line from `profile.experience[0]`.

## Sources
- https://en.wikipedia.org/wiki/Brutalist_architecture (etymology, timeline, architects, decline/revival, Eastern bloc)
- https://en.wikipedia.org/wiki/B%C3%A9ton_brut (board-marked formwork, term origin)
- https://en.wikipedia.org/wiki/Boston_City_Hall ; /Barbican_Estate ; /Habitat_67 ; /Unit%C3%A9_d'habitation ; /Hunstanton_School ; /Salk_Institute_for_Biological_Studies ; /Soviet_architectural_modernism
- https://www.nngroup.com/articles/neobrutalism/ (NN/g, April 2025)
- https://brutalistwebsites.com/ (tagline and structure of the site)
- https://www.awwwards.com/awwwards/collections/brutalism/
- Not retrievable in this session (404/403): Wikipedia "Brutalist web design", 99designs and Smashing articles. Web-brutalism history beyond what is cited above (Deville 2014, Drudge Report/Craigslist as exemplars, Gumroad/Figma) is from background knowledge and marked unverified.
