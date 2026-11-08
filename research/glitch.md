# Glitch (1960s roots, named 1990s - now)

## Definition
Glitch is the aesthetic of a system failing visibly: a digital or analogue signal that tears, mis-registers, repeats or
decodes wrongly, used on purpose. Technically a glitch is a brief malfunction that interrupts how a system normally
runs; "glitch art" is the artistic use of that fault (Rosa Menkman's framing). Its raw material is compression
blocks, RGB channels pulling apart, horizontal slices sliding sideways, scanlines, tracking bars, pixel-sorted smears,
and terminal error text. On a web page it only works if the *failure is staged*: the facts must stay rock solid while the
frame around them appears to break.

## Origins & timeline
- **1935** Len Lye's hand-painted film *A Colour Box*: a crafted precedent for treating the medium's surface as the subject.
- **1963-65** Nam June Paik distorts broadcast TV with magnets (first show, Galerie Parnass, Wuppertal, 1963; TV Magnet 1965)
  and builds the Paik-Abe video synthesizer: the first deliberate analogue signal abuse.
- **1976** JVC launches VHS (Victor HR-3300, 9 Sep 1976, Japan). Its ~240 TV-line resolution, tracking errors, dropouts and
  generation loss become the future "VHS look".
- **1978** *Digital TV Dinner* (Jamie Fenton, Raul Zaritsky): a Bally Astrocade tampered with and recorded to tape; an early
  hardware-error video.
- **Early 1990s** Oval paint on CD undersides so they skip; "glitch" becomes a label for experimental electronic music by the
  mid-1990s (Kim Cascone's later essay on the "aesthetics of failure"). Net.art duo **JODI** (Joan Heemskerk, Dirk Paesmans)
  break browsers and layouts on purpose; wwwwwwwww.jodi.org is a page of ASCII "faulty technical manual" diagrams.
- **2005-2009** Datamoshing: deleting I-frames from compressed video so P-frames keep predicting from the wrong picture, so
  colour and motion smear and "bloom" across cuts. Bertrand Planes' *DivXPrime* (2006) is credited as an early experiment;
  Takeshi Murata, Sven Konig, Paul B. Davis follow; it reaches pop with Kanye West's "Welcome to Heartbreak" video
  (Nabil Elderkin, 2009) and Chairlift.
- **2009-10** Rosa Menkman's *Glitch Studies Manifesto* (against the "noiseless channel" ideal; "what is now a glitch will become a
  fashion") and *A Vernacular of File Formats*. **2010** Kim Asendorf publishes *ASDFPixelSort* (Processing): sort runs of pixels by
  brightness inside threshold bands, producing the drippy "pixel sorting" smear. **2010** first GLI.TC/H festival, Chicago.
- **2010s** Vaporwave / outrun / signalwave borrow VHS tracking lines, magenta neon and fullwidth text; glitch becomes a
  mainstream web idiom (cyberpunk game sites, CSS clip-path "glitch text" tutorials) which is exactly the fashion Menkman warned of.
- **SMPTE colour bars** (white, yellow, cyan, green, magenta, red, blue; RCA 1951, SMPTE ECR 1-1978): the broadcaster's "bars and
  tone" test card: the right emblem of "signal" for a footer / divider.

## Defining visual traits (checkable)
- **RGB channel split / chromatic aberration**: red/magenta and green/cyan copies of text and images offset 2-8 px horizontally.
- **Slice displacement**: thin horizontal bands of the picture shifted sideways (tracking error, bad scan).
- **Scanlines** every 2-4 px at 15-30% black; CRT curvature, bezel, phosphor glow; static grain.
- **Block corruption**: rectangles (8x8 / 16x16 DCT macro-blocks) repeated, shifted or colour-swapped.
- **Pixel sorting**: vertical/horizontal streaks of brightness-sorted pixels dripping from an object edge.
- **Terminal/system voice**: monospace, uppercase labels, `0x` addresses, `ERR_`/`SIGSEGV` codes, `[OK]` boot lines, blinking cursor.
- **Dark void + a few acid hues**: near-black field, cyan (#00ffd5) and magenta (#ff2e63) as the two split channels, acid yellow and white as accents.
- **On-screen display (OSD)**: VCR text such as `PLAY >`, `SP`, `TRK`, timecode, camera corner brackets.
- **Bursts, not loops**: real glitches are intermittent. Stillness with occasional tears is more convincing (and safer) than constant jitter.

## Colour
| Role | Hex | Notes |
|---|---|---|
| Void / page | `#0a0a0f` | near-black with a blue cast (CRT off-state) |
| Panel | `#101018` / raised `#171722` | window bodies / title bars |
| Line | `#2a2a3d` | 1px borders, hairlines |
| Body text | `#e8ecf4` | 16:1 on void: body copy is never tinted |
| Muted text | `#a4acc0` | 8:1 on void, still AA on panels |
| Cyan (channel G/B, primary accent) | `#00ffd5` | links, active, numbers, primary button fill |
| Magenta (channel R, secondary) | `#ff2e63` | the "error" colour; 5.5:1 on void so usable as small text |
| Acid yellow | `#e6ff00` | warnings, hover underline, `+` lines in diffs, sparingly |
| White | `#ffffff` | headings core, flash frames (never full-screen) |
Combinations to avoid: magenta on cyan (vibrates, unreadable), thin cyan text on bright photos, any coloured body text, red-on-black
at full saturation for large flashing areas (red-flash rule of WCAG 2.3.1). Text sits on solid colours only.

## Typography
- Historic anchors: video-terminal faces (DEC VT100, IBM 3270 / VT323-style bitmaps), OCR-A, system monospace (JODI), broadcast
  caption faces, early-web Courier. Glitch posters pair a utilitarian mono with a heavy wide grotesque.
- **Chosen (all SIL OFL, self-hosted, latin subset):**
  - **JetBrains Mono** 400 + 700 - body, labels, code, UI (15.5-16px / 1.7, ~64ch line length). Excellent mono legibility; the
    terminal voice without sacrificing reading comfort.
  - **Syne** 800 - display for the name and section titles: a wide, odd, uppercase-friendly grotesque. Heavy letterforms hold
    up under RGB-split layers and slice clipping because every counter is open.
  - **VT323** 400 - big numerals (telemetry stats, OSD timecode, scroll signal percentage). A faithful VT220 bitmap look.
- Rules: display type uppercase and tight-leading, always with a solid white core under any aberration layers. Body is regular
  weight, sentence case. Labels 11-12px uppercase with +0.08em tracking (never below 12px - UtilityBar rule).

## Layout & composition
- **Window metaphor**: every module is a terminal/IDE window with a title bar (filename, square decorative buttons). Square corners
  (0-2px radius) everywhere except the CRT monitor around the hero portrait (14px bezel).
- **Misregistration**: windows carry a second, offset 1px outline (magenta/cyan, alternating) like a bad print; it jerks 3px once on hover/focus.
- **Tracking stagger**: alternate cards sit 24-32px lower, like a tape that lost sync.
- **Process-list experience** (htop rows: PID / STAT / TIME / CMD), **ls -l projects**, **hexdump-style skills rows** (`0x0040 | Group`),
  **frame-buffer photo wall**, **ENOENT writing section**, **transmit form**. Each section is a different UI shape.
- Spacing scale 4/8/12/16/24/40/64/96; content max-width 1240px; 12-col grid; hero is asymmetric (7/5).
- Navigation: sticky tmux-style status bar; right-edge vertical **signal meter** (SMPTE bars fill with scroll); on phones the meter becomes a 3px strip.

## Textures, ornaments & imagery
- Static SVG-turbulence noise tile, 40px faint calibration grid in the hero only, scanline overlays on images/monitor/footer only (never over copy).
- Ornament: corner brackets, `tear` dividers (a few thin offset bars), SMPTE bars, PLUGE strip, `//` comments.
- **Photo recipe (`recipe.mjs`)**: contrast + slight desaturate, crush blacks toward `#0a0a0f`, diagonal cyan->magenta `overlay` grade, thin-band
  slice shifts (small amplitude), RGB split 2-5 px, scanlines, grain. Variations: *hero* = stronger split + vertical pixel-sort drips
  in the lower margin; *night* = neon boost; *group* = gentler (faces must read); *scenery/books* = pixel-sorted sky bands and block corruption.
  Corruption is masked away from the central subject area. Rationale: unmistakably "signal damage" at thumbnail size but every face stays recognisable.
- **Live effect**: hover / focus / tap swaps to the untouched original through a 0.5s slice "decode" (CSS clip-path steps), then holds the original.

## Motion & interaction
- Bursts only: heading tear (0.7s, one-shot) on scroll-into-view and on hover/focus, JS-gated by a 1.2s per-element cooldown so it can never exceed ~3 changes/s.
  Photo decode on hover/focus/tap. Boot log in the hero types in over ~1.2s on the first visit of a session, is skippable (any key / click / scroll),
  never covers content, and is absent on repeat visits.
- Only continuous motion: the terminal cursor block (steps, ~1 Hz, tiny area).
- **Reduced motion**: all animations/transitions off, no bursts (JS doesn't start them), boot lines static, cursor static, signal meter still updates (it is position, not motion) but without easing.
- No canvases, no WebGL, no audio. Total JS ~2KB.

## UI translation
- **Nav**: status bar `ak@glitch:~$ [about] [experience] ...` with the active section inverted.
- **Buttons**: `[ LABEL ]` brackets; primary = cyan fill + black text, hover adds magenta offset shadow; focus = 2px acid-yellow outline offset 3px.
- **Cards**: windows (title bar + body); **forms**: prompt-style labels `> name`, inputs on `#0d0d14` with cyan hairline, magenta shadow on focus.
- **Footer**: SMPTE colour bars + "END OF TRANSMISSION" flavour line.
- **Timeline**: process rows with exit codes; logs as head + text two-column list.

## Pitfalls & accessibility risks (mitigation)
- Neon-on-black fatigue and tinted body text -> body is `#e8ecf4` on solid `#0a0a0f`/`#101018`, glitch layers live only on headings, borders, images.
- Seizure risk -> WCAG 2.3.1 (no more than three flashes/second; general flash = opposing luminance change >=10% of max in an area > ~341x256 css px).
  Every burst is a single event of <=4 states over >=0.6s, covers a slice (not the viewport), never inverts luminance, never loops, cooldown in JS.
- Duplicated text in pseudo-elements gets read twice -> `content: attr(data-text) / ""` (empty alt) so AT ignores the copies; decorative layers `aria-hidden`.
- Reduced motion -> every `animation`/`transition` gated by `@media (prefers-reduced-motion: no-preference)` where possible; explicit override block too.
- Heavy filters on mobile -> no `filter`/`backdrop-filter` on large layers; effects are `clip-path`/`transform` on small elements.
- Hover-only content -> every photo is a `<button aria-pressed>` so keyboard and touch can decode it; all facts exist in text, not behind hover.
- Gimmick over clarity -> hero answers who/what/proof/contact in the first screen (name, role, tagline, stats, resume + contact buttons).

## References (describe, never copy)
- https://en.wikipedia.org/wiki/Glitch_art - history, Betancourt's five technique categories (databending, misalignment, hardware failure, misregistration, distortion).
- https://en.wikipedia.org/wiki/Datamoshing - I-frame removal, ghosting; Planes, Murata, Kanye West video (2009).
- https://beyondresolution.info/Glitch-Studies-Manifesto - Menkman's manifesto; the site itself uses block-glyph headers and flat uppercase nav.
- https://beyondresolution.info/ - Menkman portfolio (Collapse of PAL, Resolution Studies, Vernacular).
- https://github.com/kimasendorf/ASDFPixelSort - pixel sorting (2010).
- https://wwwwwwwww.jodi.org/ - JODI: monospace ASCII "manual" art, whole page is one link.
- https://en.wikipedia.org/wiki/Nam_June_Paik - magnets, synthesizer, TV Buddha (1974).
- https://en.wikipedia.org/wiki/SMPTE_color_bars - bar order and PLUGE.
- https://en.wikipedia.org/wiki/VHS - tracking, dropouts, generation loss, 240 TVL.
- https://en.wikipedia.org/wiki/Cathode_ray_tube - raster, shadow mask, phosphors, curvature.
- https://css-tricks.com/glitch-effect-text-images-svg/ - technique reference: stacked pseudo-copies of `data-text`, +/-2px offsets, coloured text-shadow, clip-path inset slices animated in steps. (We write our own CSS; ideas only.)
- https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html - the flash thresholds we design under.
- Portfolio patterns (from `research/_inspiration.md`): fake-OS windows (JLD'2nd / Displace OS), file-path-titled contact form, `/craft` lab grid, numbered section eyebrows, copy-able contact.
- Fonts (all downloaded from the fontsource mirror of Google Fonts, SIL OFL 1.1): JetBrains Mono (JetBrains), Syne (Bonjour Monde), VT323 (Peter Hull).

## Decisions for this site
**Do:** staged, intermittent failure around rock-solid content; terminal/IDE windows as the component system; process list / log / ls / hexdump / ENOENT as per-section UI;
SMPTE bars as the one non-terminal ornament; photo wall with decode-on-hover; the scroll "signal" meter; witty error-code flavour lines that never alter facts.
**Do not:** tint or distort body copy; run continuous flicker, noise animation, canvases or audio; use a blocking preloader; invert the whole page; use red/white full-screen flashes;
hide any fact behind hover; add third-party libraries or external requests; fake metrics (the telemetry numbers are exactly `profile.stats`).

## Sources
Wikipedia (Glitch art, Datamoshing, VHS, Cathode-ray tube, SMPTE colour bars, Nam June Paik, Vaporwave), beyondresolution.info (Menkman), GitHub ASDFPixelSort README, JODI,
CSS-Tricks, W3C WCAG 2.3.1 Understanding doc, repo `research/_inspiration.md`. (WebSearch was not available; WebFetch only.)

## Build notes (added after implementation)
- Layout as built: full-width 8-letter display name over a 7/5 hero (boot log + role + CTAs | CRT monitor with the decodable portrait), telemetry strip, `README.md` / `whoami.json` / `interests.sh` windows, a htop-style process list for experience (running job inverted in cyan), staggered "case_NN.log" windows, `ls -l` project rows, hexdump-style skills rows, a justified photo wall (rows driven by each photo's aspect ratio) and an ENOENT terminal for the writing stub.
- Safety as built: bursts are one-shot (0.8s, 3 slice states then off), JS-gated (1.4s per element, 0.35s global), only on `.gl` headings; photo decode is a 0.7s clip-path wipe with a 350ms debounce on release; the only infinite animation is the 1.1s terminal cursor, removed under `prefers-reduced-motion`.
- CSS isolation: the shared `[style]` route makes dev (and likely the static build) inject every theme's CSS into every theme page, including the baseline template's global rules. This theme therefore scopes everything under `html.tg`, prefixes its classes with `g-`, defines its own `@font-face` family names (`GL Syne`, `GL Mono`, `GL Pixel`) and keyframe names (`gl-*`), and carries a small defensive reset for bare-element decoration.
