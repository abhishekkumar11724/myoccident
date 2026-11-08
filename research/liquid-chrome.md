# Liquid chrome (Y2K, 1991 - 2004; revived 2020s)

## Definition
Liquid chrome is the mirror-metal branch of Y2K "millennium futurism": molten silver blobs, chrome lettering with bevels and specular glints,
and reflective gradients whose hard horizon line (bright sky above, black ground below) tells the eye "this surface is a perfect mirror".
It sits between the T-1000 (1991), the Designers Republic / Warp Records sleeve culture of the 1990s, blobject product design (iMac G3, 1998)
and today's "chrome type" revival in streetwear, album art and 3D-poster design. Think cold, expensive, sleek: a black void with a few
very bright, very sharp things in it.

## Origins & timeline
- 1976: Jim Blinn and Martin Newell publish environment (reflection) mapping - the trick that makes a CG surface look chrome by looking up
  its reflection vector in a picture of the surroundings. Sky above, ground below: the horizon line becomes the look. 1982: Gene Miller (MAGI)
  experiments with spherical environment maps; the same year Blinn's "blobby objects" paper gives us metaballs (sum of radial fields, iso-surface at a threshold).
- 1989: ILM's water pseudopod in *The Abyss* is the stepping stone. 3 July 1991: *Terminator 2* opens; the T-1000 (ILM, Dennis Muren, Steve Williams;
  ~5 minutes of screen time, up to ten days to render 15 seconds) makes "liquid metal" a cultural image. Muren's lesson: a flawless mirror looks fake -
  he scattered a little light so the metal read as slightly "dirty" and heavier. Reflections came from panoramic photos of each location.
- 1986 onwards: The Designers Republic (Ian Anderson, Nick Phillips, Sheffield, founded 14 July 1986) invents the maximum-minimalist visual language of
  Warp Records (Autechre, LFO, Aphex Twin) and *Wipeout* (1995): corporate-logo parody, Japanese-inflected futurism, wide extended type, slogans
  ("Robots Build Robots"). Their Emigre issue (1994) was Emigre's best seller. Chris Cunningham's Aphex Twin videos ("Come to Daddy" 1997, "Windowlicker" 1999)
  and Paul Nicholson's 1991 Aphex logo add the sinister-glossy, distorted-face side.
- 1998: iMac G3, Volkswagen New Beetle, Nike Triax - the "blobject" breakthrough (term in print Dec 1993, Phil Patton/Esquire; Steven Skov Holt, Karim Rashid, Marc Newson).
  Translucent and chrome plastics, no hard corners, dot-com optimism.
- c. 2004 - 2013: Frutiger Aero (named 2018 by Sofi Xian) is the warmer, greener, glossier successor - blue skies, lens flares, bokeh. Chrome is its colder cousin.
- 2018 - 2024: Consumer Aesthetics Research Institute (Evan Collins' Y2K Aesthetic Institute) catalogues the era; "chromecore", "cybercore", "Y3K" (Aespa, XG) and
  tribal/"cyber sigil" ornament spread on Instagram/TikTok/Xiaohongshu; chrome type returns in streetwear, posters and album covers. 2025: Apple's "Liquid Glass" echoes the same gloss.

## Defining visual traits
- A near-black void (blue-black, not neutral grey) with a few extremely bright forms.
- Mirror-metal blobs: smooth metaball merging, tendrils and drips, no texture, reflecting a sky/ground environment.
- The horizon line: sky gradient (white at the horizon to deep blue overhead) cut by a hard line into near-black ground with a brighter bounce band at the bottom.
- Chrome lettering: heavy extended type, gradient with the hard horizon at ~50% height, thin bright outline, bevel highlight on top edges, soft blue glow.
- Specular glints: four-point sparkles, anamorphic horizontal lens-flare streaks, small bright ring "ghosts".
- Oil-slick / thin-film iridescence on edges (cyan-violet-magenta-lime shifting by angle) - used sparingly, only on edges and CD discs.
- Wide / extended sans (Eurostile-descended, Microgramma, Bank Gothic, Orbitron-style) for labels; ultra-wide black weights for display.
- Cyber / tribal sigils: symmetrical thorny curves, used as dividers and tattoo-like ornaments.
- Glass-metal UI: pill shapes, 1px bright edge lights, inner highlights, backdrop blur, bevelled buttons.
- Uppercase micro-labels with bracket numbering, Japanese-inflected tech slogans (kept off this site: all copy stays plain English).

## Colour
| Role | Hex | Notes |
|------|-----|-------|
| Void | #03040a / #070a13 | page + panels; blue-black rather than #000 so chrome has something to glint against |
| Deep navy | #0c1224 | raised panels, input fields |
| Steel shadow | #1b2744 | plate edges, ground reflection |
| Steel | #5d6b85 / #8a9bb8 | borders, muted text on dark (>= 4.5:1 checked for #8a9bb8 on #070a13) |
| Chrome light | #cfd8e6 / #eaf3ff | headings, highlights |
| Pure highlight | #ffffff | specular glints only |
| Sky blue (accent) | #6aa9ff | links, focus ring, active states (7.9:1 on void) |
| Icy blue | #bfe3ff | sparkle, glow |
| Oil-slick cyan / violet / magenta | #5ef2ff / #a07bff / #ff6fd8 | iridescent edges and the CD discs, never for text |
Avoid: warm beige/cream, pastel pink (that is Vaporwave), neon green on black (that is Matrix/Glitch), gold chrome (Steampunk/Art Deco), rainbow full-saturation fills.

## Typography
- Historic: Microgramma (Novarese/Butti, 1952) and Eurostile (Novarese, 1962) - squarish superellipse extended sans, the sci-fi default; Bank Gothic; Designers Republic's custom wide sans; Chrome-effect lettering in 80s-90s airbrush and 3D packages.
- Chosen (all SIL OFL, self-hosted woff2, latin subset):
  - **Unbounded** (variable 200-900, Nicolás Gattoni / NaN) for display: wide, soft-cornered, takes a heavy chrome gradient well. Used 700-900, uppercase for the name, mixed-case for headings.
  - **Michroma** (Vernon Adams; Eurostile-like extended) for micro-labels, nav, numbering: 10-12 px, uppercase, +0.08em tracking.
  - **Instrument Sans** (variable, Instrument) for body: clean, neutral, readable on black at 16-18 px.
- Rhythm: display clamp(2.6rem, 11vw, 11rem) for the name; section titles clamp(2.2rem, 6vw, 5rem); body 1.05rem / 1.65.
- Chrome effects only on display type. Body text is near-white (#e8eef9) on near-black, 15:1.

## Layout & composition
- Dark-void single page; huge type overlapping a WebGL blob in the hero; a floating glass-metal pill nav at top.
- Sections introduced by bracket labels "[02] Experience" + a chrome heading + a horizon rule with a glint.
- Experience as brushed-metal plates (fine horizontal line texture), each bullet a cell with a chrome head.
- Case studies: the "oversized type + name-only index" move - a column of huge wide-type names; hover / focus swaps a dark-glass preview plate with the problem/approach/impact.
- Projects as iridescent CD-ROM discs on dark-glass cards. Skills as a spec sheet. Photos in polished-metal bezels.
- Shape language: pills, superellipses, 1px bevel highlights top/left, deep shadows bottom/right; 8px grid; generous black space.

## Textures, ornaments & imagery
- Brushed metal: repeating-linear-gradient hairlines at 1-2 px + a soft horizontal sheen.
- Iridescence: conic-gradient discs, thin-film cosine palette in the shader.
- Ornaments (hand-written SVG): four-point sparkles, a symmetric "sigil" divider, bevelled corner brackets.
- Lens flare: CSS anamorphic streak + ring ghosts in the hero (static; slow drift only when motion is allowed).
- **Photo recipe** (`recipe.mjs`): luminance -> local-contrast boost (so faces survive in dark scenes) -> multi-stop chrome gradient map (black, blue-black,
  steel, silver, white, icy highlight) -> emboss-based specular pass (light from top-left) -> sky/ground reflection overlay with a hard horizon at ~58% height ->
  bloom on the brightest speculars -> subtle edge chromatic aberration -> fine grain. Faces remain recognisable (tone-preserving, not a posterise);
  the thumbnail reads as "chrome statue" at a glance.

## Motion & interaction
- Hero: WebGL fragment shader, 6 metaballs on slow Lissajous paths + one following the pointer, fake environment map (sky/horizon/ground, softboxes, sun glint), iridescent fresnel rim.
  DPR capped at 1.5, adaptive resolution, IntersectionObserver pause, document-hidden pause, one static frame under `prefers-reduced-motion`, CSS/SVG blob fallback without WebGL.
- Chrome headings: slow diagonal sheen sweep (background-position, 9 s, disabled under reduced motion; never flashes).
- Buttons "melt": an SVG goo filter (blur + alpha contrast) merges drips under the button on hover/focus.
- Cards: pointer-tracking edge light (CSS custom properties set from `pointermove`).
- Case-study index: hover / focus / click swaps the preview; keyboard arrows move between rows. No scroll-jacking.
- Reduced motion: no sheen sweep, no blob loop, no drips animation (hover colour change only).

## UI translation
- Nav: floating pill, glass + chrome edge light, monogram disc left, Michroma links, active-section highlight; collapses to a "Menu" disclosure under 1024 px.
- Buttons: bevelled chrome pill (primary) / glass pill with chrome border (secondary); focus ring = 2px sky-blue + 4px glow.
- Cards: dark-glass (rgba navy, 1px edge gradient, inner top highlight).
- Forms: inset dark fields with chrome underline that lights up on focus.
- Footer: giant outlined chrome name, flavour line, sigil.
- Timeline: vertical liquid-metal spine with bead markers.

## Pitfalls & accessibility risks
- Chrome gradient text can have low contrast where the horizon darkens - keep chrome type large (>= 3:1 vs void) and never use it for body copy.
- Moving shader behind text: keep text over mostly dark areas; name has a drop-shadow outline; blob sits behind/beside.
- WebGL on phones: cap DPR, adaptive scale, pause off-screen; provide static fallback.
- Glass blur on big areas is expensive: backdrop-filter only on the small nav.
- Motion: no strobing; the sheen is a 9 s slow sweep; no flashing sparkles (sparkles fade in/out > 2 s).
- Colour alone: active nav item also gets an underline glint; focus rings are shape + colour.

## References
- Terminator 2 (1991) T-1000 - https://en.wikipedia.org/wiki/Special_effects_of_Terminator_2:_Judgment_Day - the original liquid metal; reflections from location panoramas.
- Reflection mapping - https://en.wikipedia.org/wiki/Reflection_mapping - the sky/ground lookup the shader fakes.
- Metaballs - https://en.wikipedia.org/wiki/Metaballs - sum of radial fields + threshold.
- The Designers Republic - https://en.wikipedia.org/wiki/The_Designers_Republic - Warp / Wipeout visual language.
- Aphex Twin - https://en.wikipedia.org/wiki/Aphex_Twin - logo, Cunningham videos, distorted-face sleeves.
- Blobject - https://en.wikipedia.org/wiki/Blobject - iMac G3 and friends.
- Y2K aesthetic - https://en.wikipedia.org/wiki/Y2K_aesthetic ; Frutiger Aero - https://en.wikipedia.org/wiki/Frutiger_Aero (the warmer sibling).
- Eurostile - https://en.wikipedia.org/wiki/Eurostile - the extended-sans ancestor.
- Inspiration notes (this repo): `research/_inspiration.md` - Belen Jones / Guglieri style oversized type + name-only project index.
Nothing was copied from any of these; all art on the site is original CSS/SVG/WebGL.

## Decisions for this site
Do:
- Black-blue void, chrome display type, one accent (sky blue), iridescence only on edges/discs.
- WebGL blob in the hero (and a smaller echo in contact), full CSS fallback.
- Name-only case-study index with preview plate (the signature move), all case-study text in the DOM.
- Photos: chrome gradient-map treatment, polished metal bezels; click opens a lightbox.
Do NOT:
- Use external fonts/libraries; use gold/warm chrome; put chrome gradient on body text; flash or strobe; use infinite motion under reduced-motion.
- Hide facts behind hover only (all content is in the DOM and readable on touch / no-JS).

## Sources
Wikipedia pages listed above (fetched 2026-11-09). No web search tool was available in this session, so contemporary "chrome type revival" claims are limited to
what the Y2K aesthetic article states (revival in the 2020s, Japan/China/Korea, Aespa/XG "Y3K"); the rest is from the lead's brief and the author's knowledge.
