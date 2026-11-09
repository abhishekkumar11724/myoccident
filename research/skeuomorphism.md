# Skeuomorphism (c. 2007-2013 in UI; the idea is far older)

## Definition
A skeuomorph is a derived object that keeps ornamental cues from the thing it replaced (Greek *skeuos*, "container or tool" + *morphe*, "shape"; the word is in print by 1890, and George Basalla's 1988 definition is the one designers quote). In interface design it means screens that imitate real objects and materials - leather, stitching, felt, wood, brushed metal, glass, paper, switches, dials - with realistic light and shadow, either as a *learning aid* (a trash can, a folder, a page) or as pure *visual trend* (stitched leather around a calendar). Its opposite is flat design; its shy 2019 descendant is neumorphism (soft monochrome extrusion), which is a *lighting* trick on one surface. Skeuomorphism proper is *material* and *literal*: many surfaces, each believable.

## Origins & timeline
- Pre-digital: Doric temples carved stone "pegs" that echoed older timber beams; cheap Minoan pottery copied silver cups, even with clay pellets for rivets; 1960s "woodie" cars gave way to vinyl wood-grain; 1970s sedans had landau vinyl roofs (source: Wikipedia, Skeuomorph).
- 1980s: graphical OSes adopt the desktop metaphor (folders, trash can, Rolodex address books, floppy-disk "save"). 1995 Microsoft Bob and 1998 IBM RealThings push literal rooms and objects.
- 6 Jan 2000: Steve Jobs unveils **Aqua** at Macworld SF ("one of the design goals was when you saw it you wanted to lick it"). Droplet translucency, gel/glass buttons, pinstripe windows, brushed-metal windows for apps that imitate devices (iTunes, QuickTime), Genie minimise, Dock; Lucida Grande type. Colours: blue/white/grey with red-yellow-green window buttons. Pinstripes fade by Leopard (2007); brushed metal is phased out then too (Wikipedia, Aqua).
- 2006-2009: **Windows Aero** (Vista, refined in Windows 7): translucent glass title bars, blur, glossy orbs. Later nostalgically called *Frutiger Aero*.
- 2007-2012: **iOS under Scott Forstall** (senior VP overseeing iOS 2007 - Oct 2012, a "most vocal proponent" of Jobs's taste): Notes as a yellow legal pad, iBooks (2010) and Newsstand on wooden shelves, Calendar and Find My Friends in stitched leather, Game Center (iOS 4.1, 8 Sep 2010) as a green-felt card table, Podcasts as a reel-to-reel, Voice Memos as a studio mic, Compass, Clock. Braun hardware was a quiet reference: the iPod echoes the T3 radio, iOS Calculator the ET66 calculator (Dieter Rams, Braun head of design 1961-97).
- 29 Oct 2012: Apple announces Forstall's departure; Jony Ive takes over the Human Interface team. 10 Jun 2013 WWDC: iOS 7 (shipped 18 Sep 2013) goes flat. "Death of skeuomorphism".
- Why it looked this way: early touch screens and bitmap displays needed *affordances* people already understood; Don Norman defends it as giving "comfort" and making learning easier; a 2018 study found skeuomorphic icons are recognised faster. Critics (Fast Company's Austin Carr, 2012: "tacky") cited kitsch, wasted screen space, inconsistency and gauges that read less precisely than digits.

## Defining visual traits (checkable)
- One light source, top-left (or straight above): bright 1px on top/left edges, soft shadow below/right; every object casts a believable shadow, scaled to how high it sits.
- Real **materials**: wood grain, pebbled leather with debossed gold foil, stitching (dashed thread with a tiny shadow in each hole), green baize felt, linen, cork, brushed aluminium, torn/perforated legal-pad paper, glass, chrome, brass screws.
- **Letterpress / deboss**: text pressed *into* a surface = light 1px text-shadow *below* the glyph, dark 1px *above* it; foil stamping on leather = metallic gradient.
- **Gloss**: gel buttons with a hard horizon highlight on the top half (Aqua), glass reflections, specular dots.
- **Controls that look like hardware**: toggle switches, knurled knobs, odometer wheels, needle gauges, push-buttons that visibly depress.
- Physical clutter and fasteners: paper clips, pushpins, masking tape, photo corners, rivets, screws, label holders, Dymo tape.
- Fake-OS apps: windows with traffic lights, brushed toolbars, sheets, sidebars.

## Colour (palette with hex + role)
| Role | Hex | Notes |
|---|---|---|
| Walnut desk (dark / mid / light) | `#2c1a0e` / `#6b4426` / `#a8703f` | background desk, plank tone variation |
| Saddle leather | `#7a4a28` (mid) `#4a2a14` (shade) | hero portfolio, desk pad, footer; text on it is cream `#f6ead0` |
| Oxblood leather (alt) | `#5e1f1c` | contact pad accent |
| Parchment / paper | `#f6edd5`, shade `#e8d9b5` | all reading surfaces; ink `#2a1b0e` (13:1) |
| Legal-pad yellow | `#f6e98e` | about pad; ruled lines `#6f93c9`, margin `#d4503f` |
| Manila | `#e3c88f` | experience folders |
| Baize green | `#2d5d34` (mid) `#1d4425` (shade) | case-study felt |
| Brass | `#e0b44c` highlight, `#a67c1f` body, `#6d4f12` shade | plates, screws, foil text |
| Brushed steel | `#d5d9dd` / `#8f969c` / `#50565c` | nav, drawers, instrument panel |
| Aqua blue | `#3d8bff`, deep `#1d5fd6` | focus ring, selection, active key, links on paper |
| Stamp red | `#b3261e` | rubber stamps, margins, red tab |
Avoid: pure black and pure white (everything is warm-tinted), saturated neon, flat colour fills with no shading, grey-on-grey low contrast (the neumorphism trap), light text on cork/felt without a shadow plate.

## Typography
Historic: Aqua used **Lucida Grande**; iOS used **Helvetica Neue**; Notes used **Marker Felt** (later Noteworthy) for handwriting; iBooks used a Baskerville-like serif; Braun used Akzidenz/Helvetica.
Chosen (all OFL, self-hosted latin subsets from fontsource):
- **Playfair Display 700** - warm high-contrast display serif; thin hairlines deboss beautifully; for the name, section titles, card titles.
- **Source Sans 3 400 / 600** - neutral humanist body (the Lucida Grande/Helvetica role), 17px/1.55 body, 600 for labels and buttons.
- **Courier Prime 400** - typewriter label face for file tabs, dates, index-card captions, the Writing page.
- **Patrick Hand 400** - handwriting for sticky notes, photo captions, margin notes (Marker Felt's role); used sparingly, only for short phrases.

## Layout & composition
A **desk seen from above**: vertical walnut boards fill the viewport; a centred column (max ~1240px) holds the "objects", each section a different thing lying on the desk. Shapes: rounded rectangles with 6-14px radii, stitched insets, tabs, plates. Every object overlaps the desk and casts a shadow to the lower right. Slight random rotation (-2deg..+2deg) only on loose objects (prints, notes, index cards), never on text blocks that must be read at length. Spacing scale 8px base.
Section map: nav = brushed-steel key bar (keys press down) with a lamp switch; hero = open leather portfolio with a clipped snapshot; stats = steel instrument panel (odometers + needle gauges); about = legal pad + Dymo labels; experience = manila folders full of index cards on a leather desk pad + brass education plaque; case studies = memos on green baize; projects = an Aqua Finder window of glossy app icons; skills = filing-cabinet drawers with folder tabs; beyond code = corkboard of prints; writing = a typewriter with a blank sheet; contact = business card + notepad form with a glossy Send button.

## Textures, ornaments & imagery
- Textures are **baked once** by a small Node + sharp generator (`assets/gen-textures.mjs`; tileable value/Worley noise lit from the top-left) into small WebP tiles (wood, leather bump, paper, felt, cork, brushed metal, linen) and combined in CSS with `background-blend-mode`, so one grey leather map makes brown, green and oxblood leather. No filter runs at runtime.
- Ornaments in CSS/inline SVG: stitching, brass screws and rivets, paper clips, pushpins, masking tape, photo corners, Dymo tape strips, rubber stamps (SVG filter on a *tiny* element), traffic-light buttons.
- **Photo recipe: "print grade"** - the skeuomorphism lives in the frames, so photos stay natural: slightly lifted blacks (a matte print floor `#1d140d`), gentle S-curve contrast, a warm 3% cast, tiny luminance grain, a whisper of vignette. Night photos get less lift. Faces stay true.

## Motion & interaction
- Odometer wheels roll once into place when the instrument panel scrolls into view (stagger per wheel, zeros do a full revolution); needles swing to 68% / 90% with a spring-ish easing. Reduced motion or no JS: final values are rendered in place.
- Keys on the nav bar physically depress on `:active`; buttons depress and lose their shadow; drawer fronts nudge forward on hover; prints straighten and lift on hover; the lamp is a real rocker switch that cross-fades the desk lighting between day and night (also remembers choice; honours `prefers-color-scheme` on first visit).
- Typewriter caret blink (infinite) only under `prefers-reduced-motion: no-preference`. Nothing flashes.

## UI translation
- **Nav**: sticky brushed-steel bar, chunky hardware keys, scroll-spy marks the pressed key with a green LED; mobile = horizontally scrolling keys.
- **Buttons**: Aqua gel (primary, green) and leather-with-stitching (secondary); focus = blue Aqua glow ring + white inner line.
- **Cards**: index cards (blue rules, red head line), manila folders, memos with clips; tags as Dymo tape.
- **Forms**: legal-pad notepad, inputs as ruled writing lines, tactile topic chips (pressed = debossed), glossy Send.
- **Timeline/experience**: three hanging manila folders with staggered tabs, rubber-stamped date ranges.
- **Footer**: stitched leather strip.

## Pitfalls & accessibility risks (and mitigation)
- Kitsch overload / illegible text on texture: reading text always sits on a calm paper or leather plate with >= 7:1 contrast; textures are low amplitude.
- Heavy textures/filters hurting phones: textures are pre-baked tiles (total ~0.5MB), no runtime filters except a tiny stamp displacement; fixed lighting overlays are plain gradients.
- Affordance clarity: every interactive thing looks like a physical control and also has a text label; hover + `:focus-visible` states are explicit.
- Dark mode (lamp off): only the desk and ambient overlay darken; paper and leather keep their text colours, so contrast holds.
- Motion: finite, once-only; infinite ones are gated by reduced-motion.

## References
- https://en.wikipedia.org/wiki/Skeuomorph - definition, pre-digital examples, Apple's arc, criticism and defences.
- https://en.wikipedia.org/wiki/Aqua_(user_interface) - Aqua's date, gel buttons, pinstripes, brushed metal, colours.
- https://www.nngroup.com/articles/skeuomorphism/ - the two senses (learning aid vs decoration), iBooks/Kindle wooden shelves, guidance on when it works.
- https://en.wikipedia.org/wiki/IOS_7 and https://en.wikipedia.org/wiki/Scott_Forstall - 2012-2013 handover and the flat redesign.
- https://en.wikipedia.org/wiki/Dieter_Rams - Braun's hardware as an unfussy reference for dials, keys and "Less, but better".
- https://en.wikipedia.org/wiki/Windows_Aero - glass era 2006-2012.
- https://en.wikipedia.org/wiki/Letterpress_printing - the pressed "impression" that the 1px text-shadow imitates.
(We describe these; no code, copy or non-free assets were taken.)

## Decisions for this site
Do:
- A believable DESK with one top-left light and a physical day/night lamp switch.
- Every section is a different object (folder, legal pad, felt memos, Aqua window, drawers, corkboard, typewriter, business card + notepad), all sharing the same materials and shadow system.
- Instruments for stats (odometer + needle), keys for navigation, stamps for dates, Dymo for tags.
- Keep photos natural; put the style in prints, corners, tape, clips and cork.
- Contrast first: dark ink on paper, cream on leather.
Do NOT:
- Re-use neumorphism's single-surface soft shadows; no pastel monochrome; no fake "3D" perspective scenes that hurt reading.
- Animate filters or full-page layers; no scroll-jacking.
- Use stock photography or third-party textures (all textures are generated; all fonts OFL).

## Sources
Wikipedia (Skeuomorph; Aqua (user interface); IOS 7; Scott Forstall; Windows Aero; Dieter Rams; Letterpress printing), Nielsen Norman Group "Skeuomorphism" article, fontsource (OFL font files), the lead's art-direction notes.
