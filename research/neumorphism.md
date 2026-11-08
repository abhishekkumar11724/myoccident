# Neumorphism / "soft UI" (2019 - now)

## Definition
Neumorphism ("new skeuomorphism", also called **soft UI**) is a UI style in which controls and cards are not drawn *on* a
background but appear to be **extruded from, or pressed into, one continuous surface**. Element fill is (almost) the same
colour as the page; form is described only by a pair of soft shadows - a light one on the lit side and a dark one on the
far side - plus very gentle gradients and large corner radii. It sits between skeuomorphism (believable material, real
light) and flat design (clean, minimal, no chrome): realistic *lighting*, abstract *objects*.

## Origins & timeline
- **1980s - 2012** Skeuomorphic UI: the desktop metaphor, Windows XP-7 gloss, Apple's leather/felt/wood apps under Steve Jobs
  and Scott Forstall. (Wikipedia "Skeuomorph".)
- **Oct 2012** Forstall's departure; Jony Ive reportedly dislikes the ornament. **2013** iOS 7 at WWDC makes flat design the
  industry default for the next decade. Flat design leaves interfaces clean but with weak affordances ("is this a button?").
- **Aug 2019** Huawei's HarmonyOS, shown on the Honor Vision TV, already uses soft light/shadow depth (Wikipedia; iF award 2020,
  Red Dot 2021 for HarmonyOS 2) - proto-neumorphism in a shipped product.
- **Late 2019** Ukrainian product designer **Oleksandr (Alexander) Plyuto** posts a skeuomorphic mobile-banking concept on
  Dribbble; it goes viral and is widely treated as the first neumorphic design (he wanted to explore how skeuomorphism might
  have evolved on mobile). The exact post date is widely reported as Oct 2019 but I could not verify it from his profile page.
- **Dec 2019** **Michal Malewicz** (Hype4 Academy) writes the article that names and popularises "neumorphism". Attribution of
  the *coinage* is contested in sources: IxDF credits Malewicz; Wikipedia credits a person named Jason Kelly. This site's
  About panel says "named in late 2019 (Michal Malewicz's article is the usual reference)" and does not insist on one name.
- **Early 2020** Neumorphism shots flood Dribbble/Behance; CSS generators (e.g. neumorphism.io) appear; designers publish the
  contrast problem within weeks (CSS-Tricks "Neumorphism and CSS", NN/g-style critiques).
- **12 Nov 2020** macOS Big Sur ships soft, rounded, shadowed icons and translucency - neumorphic influence, not adoption.
- **2021 -** Designer interest drops fast (accessibility) and **glassmorphism** takes over; neumorphism survives as an *accent*
  in dashboards, smart-home / music-player / calculator UIs, UI kits and portfolios (IxDF: "appears mostly in concepts, UI
  kits and portfolio sites").

## Defining visual traits (checkable)
- One surface colour for page *and* components (cool light grey `#e0e5ec` is the canonical value).
- Two shadows per object, **same light source everywhere**: light (white) shadow up-left, dark shadow down-right.
- Three states of matter: **raised** (outer shadows), **pressed / sunk** (same shadows, `inset`), **flat** (no shadow, i.e. the surface).
- Large radii (20-40px cards, full-round buttons/knobs); circles are the hero shape (dials, knobs, toggles, avatars).
- Convex / concave gradients that follow the light direction (light end toward the light shadow for convex; reversed for concave).
- Monochrome UI + ONE soft accent used for the active state, glow, progress and focus.
- Skeuomorphic hardware metaphors reduced to essentials: knobs, sliders, toggle switches, LED dots, tick rings, segmented
  controls, inset "LCD" readouts and wells.
- Thin 1-2px highlight edge on raised objects (a faint white border) to sharpen the silhouette.
- Type is geometric/rounded sans, medium-heavy weights to compensate for the low-contrast chrome.

## Colour (palette with hex + role)
| Token | Hex | Role |
|---|---|---|
| surface | `#e0e5ec` | the one surface: page, cards, buttons |
| surface-hi / lo | `#e9eef5` / `#d4dae4` | convex/concave gradient ends (+-4%) |
| shadow-light | `#ffffff` | top-left highlight |
| shadow-dark | `#a3b1c6` | bottom-right shade (canonical neumorphism.io value) |
| ink | `#2a3347` | headings/body, 9.6:1 on surface |
| ink-2 | `#4a5568` | secondary text, ~5.9:1 |
| ink-3 | `#556075` | captions, ~4.9:1 |
| accent | `#5a67f0` | glows, progress arcs, LEDs, fills (non-text) |
| accent-ink | `#3a45c2` | accent text/icons on surface, ~5.8:1 |
| accent-fill | `#4f5ce8 -> #3f4bd0` | primary button, white text >= 5.2:1 |
| rim | `#7b8496` | 1px border on inputs only (3:1 against surface, WCAG 1.4.11) |
Avoid: dark mode (shadows vanish), pure white or pure black surfaces (one of the two shadows disappears - CSS-Tricks),
more than one accent hue, accent for body text.

## Typography
Historic: the shots of 2019-20 almost all use geometric / rounded grotesks: Poppins, Gilroy, Circular, SF Pro Rounded, Nunito.
Chosen (all SIL OFL, self-hosted woff2, latin subset, ~100KB total):
- **Outfit** (variable 100-900) - display, headings, labels, numerals. Geometric, circular bowls echo the dials. H1 700-ish,
  `clamp(2.9rem, 7.4vw, 6rem)`, tracking -0.03em, "debossed" with a 1px white text-shadow.
- **Nunito Sans** (variable) - body 17-18px / 1.65; humanist, very legible at low-contrast surfaces.
- **DM Mono** 400/500 - the mini "agent console" / code readouts inside case-study mocks.
Small caps labels: Outfit 600, 12.5px, +0.1em tracking, never below 12px.

## Layout & composition
- Centred 1180px column; sections are *not* boxed - the page IS the surface; content is raised/sunk out of it.
- Hierarchy by elevation: **panel (raised large) > well (inset) > control (raised small)**. Never raised inside raised without a well.
- Rule that fixes the "what's clickable?" problem: **raised = press me, sunk = this holds something**. Every raised control also
  carries a text label and/or an accent-ink icon; the active state is a *pressed* (inset) control with an accent LED.
- Navigation = a dock of round soft buttons inside an inset tray, scroll-spy marks the active one.
- Generous padding (shadow blur eats space): cards 28-36px, gaps 28-40px.
- Photos: framed as raised plates with an inset "picture well" inside; heroes are circular (porthole / knob).

## Textures, ornaments & imagery (and the photo-treatment recipe + why)
- No texture; the realism is the shadow stack. A 1px white inner highlight on raised objects.
- Ornament = hardware: tick rings around knobs, LED dots, groove dividers (1px dark + 1px light line), screws omitted (that is skeuomorphism).
- **Photo recipe** ("airy matte"): neumorphism is about *lighting the frame*, not filtering pixels, so photos stay natural. A light
  grade only: -12% saturation, slightly lower contrast, lifted shadows with a cool slate floor (so black never fights the pale surface),
  softened highlight roll-off and a very faint surface-coloured vignette so the picture feels set *into* the surface. Night shots get
  a gentler lift so they don't turn grey. Faces untouched. The depth comes from CSS wells/plates (inset shadow overlays on the img).

## Motion & interaction
- Press/pop only: buttons depress (raised -> inset, translateY 1px) in 140ms; cards lift 2px on hover; toggles slide; dial arcs animate
  from 0 once when scrolled into view (700ms ease-out); gauge needle eases between states.
- The hero knob's indicator follows scroll progress (a volume-knob metaphor). No infinite loops anywhere.
- `prefers-reduced-motion`: all transitions -> 0, dials draw instantly, scroll-linked rotation off, `scroll-behavior: auto`.

## UI translation
- **Nav:** sticky raised bar; inset tray; 9 round icon buttons (icon + 12.5px label >= 1100px, icon-only + active label on phones); active = pressed + accent LED.
- **Buttons:** primary = accent gradient raised pill with white 600 text; secondary = surface raised pill; icon = 48px round. `:active` = inset.
- **Inputs:** inset wells with 1px `rim` border (3:1), label above, accent focus ring (3px outline + white inner ring).
- **Cards:** raised, 28px radius, 1px white edge. Insets (trays) hold bullets, code, chips.
- **Chips:** inset = static label (skills, tags). Raised + pressed-when-selected = filter/choice chip (`aria-pressed`).
- **Stats:** circular dials; percentage stats get a real arc (68 / 90), count stats get a tick ring only (no fake progress).
- **Case studies:** each card contains a miniature live UI (compiler console with raw/compiled toggle, throughput meters with pause/resume,
  OpenAPI->MCP pipeline, retrieval stage toggles, p99 gauge, 80/20 A-B slider) built only from numbers in the resume.
- **Timeline:** stacked cards, header column + inset tray of bullets.
- **Footer:** one embossed line + a row of three round buttons.

## Pitfalls & accessibility risks (and mitigation)
- Low contrast (NN/g, CSS-Tricks, IxDF): body text >= 9:1; secondary >= 4.9:1; never grey-on-grey for facts.
- Shadows are invisible to contrast checkers and to low-vision users: every control has a text label / icon; inputs have a `rim`
  border (WCAG 1.4.11 needs 3:1 for UI component boundaries/states); focus rings are accent-ink, 3px, offset (>= 3:1).
- Active vs inactive must differ by more than shadow: pressed + accent icon + LED dot + `aria-current`/`aria-pressed`.
- Over-use flattens hierarchy (CSS-Tricks: inputs, buttons and progress bars all look alike): we separate by *shape* (round = nav/icon,
  pill = action, rectangle well = input/readout) and by *accent* (only primary action + active state).
- Shadow blur eats space on phones: reduced shadow distances below 640px.
- Heavy multi-layer shadows are costly on big surfaces: limit to <= 2 layers on large panels, no `filter: drop-shadow` on big areas.
- Gradient backgrounds defeat naive contrast checkers: text sits on solid fills only.

## References
- https://en.wikipedia.org/wiki/Neumorphism - timeline (HarmonyOS 2019, Big Sur 2020), criticism, naming dispute.
- https://ixdf.org/literature/topics/neumorphism - definition, how-to, accessibility recommendations ("use sparingly", "keep CTAs conventional").
- https://css-tricks.com/neumorphism-and-css/ - light-source offset table, convex/concave gradient rule, Malewicz test ("works well when it can be removed without any loss").
- https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html - 3:1 for UI component boundaries & states.
- https://en.wikipedia.org/wiki/Skeuomorph - the lineage (1980s - iOS 7 flat in 2013).
- https://neumorphism.io/ - the generator that made the `#e0e5ec` / `#a3b1c6` / `#ffffff` recipe canonical (described, not copied).
- https://dribbble.com/plyuto - Oleksandr Plyuto's profile (the originator of the viral concept; shot itself not fetched).
- Hardware references (inspiration only): Braun/Dieter Rams dials & toggles, Teenage Engineering knobs, Nest thermostat ring.
Nothing copied: all CSS, SVG and copy here are original.

## Decisions for this site (what we do / deliberately do NOT do)
DO: one `#e0e5ec` surface; raised = press / sunk = holds; dock nav; knob hero with scroll-linked indicator; dials for stats; case
studies with miniature live UIs; contact "intake" with topic/reply chips; photos in plates + wells; 3:1 input rims; accent focus rings;
text >= 4.5:1 on solid fills; photos with a light airy grade.
DON'T: dark mode; multiple accent hues; gradient text; shadow-only affordances; fake percentages on non-percentage stats; invent numbers in
the mini UIs (illustrative SOP text is marked "illustrative"); infinite animation; blurry full-page layers.

## Sources
Wikipedia (Neumorphism; Skeuomorph), IxDF Neumorphism topic, CSS-Tricks "Neumorphism and CSS", W3C WCAG 2.1 Understanding 1.4.11,
neumorphism.io, Dribbble profile of Oleksandr Plyuto. (NN/g, Hype4 and UX Collective pages returned 403/404 to the fetcher; their claims are cited only via the pages above.)
