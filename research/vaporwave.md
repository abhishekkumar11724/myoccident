# Vaporwave (2010s)

## Definition
Vaporwave is an internet-native music-and-visual micro-genre that surfaced around 2010-2012. It re-uses the dated
commercial tech and mall culture of the 1980s-90s (Windows 95, Mac OS 8, smooth jazz, elevator music, corporate
screensavers, early CGI, Greek busts as "classical" shorthand, Japanese text as "exotic future") and presents it slowed
down, over-saturated and slightly sarcastic. Visually it is a pastel pink/cyan/lavender/peach dream laid over retro
operating-system chrome: windows, taskbars, pixel icons, checkerboard floors, palm trees, sunsets and perspective grids.
It sits next to (but is not the same as) synthwave/outrun, which is darker, neon and driven by 1980s film/arcade nostalgia.

## Origins & timeline
- 1996: Pitchfork later hears Wolfgang Voigt's *Life's a Gas* (as Love Inc.) as a precursor of the sampling approach.
- 2009: "chillwave" and "hypnagogic pop" coined; Daniel Lopatin (Oneohtrix Point Never) uploads loops to YouTube as sunsetcorp.
- Aug 2010: Lopatin's *Chuck Person's Eccojams Vol. 1* - chopped-and-screwed 80s pop; sleeve riffs on the 1993 game *Ecco the Dolphin*.
- Oct 2011: James Ferraro's *Far Side Virtual* (Skype, Second Life, Windows XP, Wii as sound palette). First recorded use of the word "vaporwave" in a blog post the same month.
- 9 Dec 2011: Ramona Langley (Macintosh Plus / Vektroid) releases *Floral Shoppe*; cover = a Helios bust, a black-on-pink checkerboard and a skyline screenshot, with Japanese title text in bright pink. Widely treated as the genre's blueprint.
- 2012-13: spreads on Last.fm, Reddit, 4chan, Tumblr; Blank Banshee 0; Macross 82-99 starts future funk; YouTube 24-hour radio streams.
- 2015-16: reaches mainstream (MTV International rebrand, Rolling Stone mentions); subgenres: mallsoft, future funk, hardvapour, simpsonwave, barber beats.
- 2019: first vaporwave festival (100% ElectroniCON, New York). 2020s: repeatedly "dead", still alive on Bandcamp, Tumblr and Pinterest moodboards, and reborn in "Frutiger Aero"/"Y2K" revivals.
- Critical frame: Adam Harper (*Dummy*, 2012), Grafton Tanner ("music of non-places"), Simon Reynolds. Ambiguous on purpose: sincere nostalgia or satire of consumer technoculture.

## Defining visual traits
- Pastel gradient skies: pink to peach to lavender; "sunset" as a flat disc with horizontal slits (outrun heritage).
- Perspective grid floor receding to a horizon; checkerboard floor tiles (Floral Shoppe cover).
- Retro OS chrome: Windows 95/98 bevelled windows, navy title bars with minimise/maximise/close, taskbar + Start button, dialogs with an info icon, progress bars, system-tray clock, My Computer / Recycle Bin pixel icons. Also Mac OS 8 "Platinum" windows.
- Greco-Roman busts and columns (usually marble white, tinted pink/cyan), Memphis-style geometry (triangles, squiggles), palm trees, dolphins, koi, hibiscus, 3D chrome shapes, wireframes.
- Japanese text/fullwidth Latin as decoration ("ＡＥＳＴＨＥＴＩＣ"), wide letter-spacing "A E S T H E T I C".
- Glitch/VHS artefacts used sparingly: scanlines, dither, low-res compression.
- Mood: mall, lobby, screensaver, 3 a.m. lo-fi; calm and slightly uncanny, never frantic.

## Colour
Core vaporwave palette (widely used; I verify each pair for contrast below):
| Role | Hex | Use here |
|---|---|---|
| Hot pink | `#ff71ce` | title bars, sun base, accents |
| Cyan | `#01cdfe` | title bars, link hover, grid glow |
| Mint | `#05ffa1` | LCD readouts, "OK" states |
| Lavender | `#b967ff` | gradients, borders, grid lines |
| Butter yellow | `#fffb96` | sun top, highlight |
| Peach | `#ffd3b6` | horizon glow, sky |
| Deep grape (ink) | `#2a1457` | ALL body text (on cream: ~14:1) |
| Violet shadow | `#4a2f9a` | bevel shadow / secondary text |
| Cream paper | `#fff8ee` | window bodies |
| Lilac frame | `#e6dbff` | window chrome face (instead of Win95 grey #c0c0c0) |
| LCD night | `#1a0b3a` | sunken readout panels (mint text: ~12:1) |
Combinations to avoid: pastel text on pastel (the genre's readability trap), white text on pink/cyan bars (use deep-grape ink on bright bars), pure neon on white.

## Typography
Historic: Windows 95 UI = MS Sans Serif 8pt; Mac OS 8 = Charcoal/Chicago; wordmarks = wide Futura/Eurostile-ish caps, Times italic ("serif classical"), pixel/bitmap fonts, katakana in Gothic.
Chosen (all self-hosted, latin):
- Syncopate 700 (Apache-2.0): extra-wide caps for the wordmark and section headings, always letter-spaced. Evokes "A E S T H E T I C".
- DotGothic16 400 (OFL): a Japanese-OS style bitmap gothic for UI labels, title bars, buttons, status bars and LCD readouts, used at exact pixel multiples (16px / 20px / 24px) so it stays crisp. (Pixelify Sans was tried first and rejected: its capital C reads as O at UI sizes.)
- Quicksand variable 400-700 (OFL): round, friendly body at 16-17px (500) on cream.
- Instrument Serif italic (OFL): the "marble bust" voice - one dreamy italic accent per heading.
Japanese glyphs deliberately NOT used (no verified subset font in budget; a wrong character is worse than none).

## Layout & composition
- A fixed "scene" (sky, striped sun, perspective grid, clouds) behind everything; content lives in floating OS windows that scroll over it.
- Taskbar docked to the top (Win95 allowed docking on any edge) so it never fights the bottom UtilityBar; Start menu = site navigation.
- Hero: oversized wide wordmark, desktop icons (Resume / LinkedIn / GitHub / Email), a floating image-viewer window with the portrait, overlapping "System Properties" stat window.
- Sections are different app archetypes: Notepad (about), File Explorer (experience), app windows (case studies), boxed software (projects), Setup Wizard (skills), My Pictures (beyond code), Inbox (writing), Compose mail (contact).
- Shape language: 2px bevels, square corners, drop shadows as hard offset (4px 4px 0 deep-grape at 25%), pixel-stepped corners; no rounded pill UI except chips.

## Textures, ornaments & imagery (photo recipe + why)
- Ornaments: striped sun, grid, checkerboard strip dividers, palm silhouettes (SVG), fluted column, stars/sparkles (4-point), pixel icons (hand-written SVG).
- Photo recipe: luminance gradient-map (indigo -> violet -> orchid -> pink -> peach -> cream) so skin tones go pink/peach and faces stay readable (structure comes from luminance), a cyan screen-gradient from the upper left for the dual-light look, soft bloom (blurred highlights screened in pink) for the dreamy glow, faint scanlines, tiny grain. Night shots: palette-quantised with a Bayer dither (pixel / early-VGA feel) plus bloom. Landscapes: stronger sunset sky grade (lavender top -> peach bottom softlight).
- Why: one shared colour world makes 60 very different snaps feel like one mood board, and gradient mapping is the classic vaporwave "pink statue" trick.

## Motion & interaction
- Slow (6-8 s per grid cell) grid scroll via transform only; clouds drift (60-90 s); sun breathes (opacity, 8 s); hero window floats 6 px.
- Marquee ticker (interests) transform-only; wordmark gets a one-shot shimmer on load.
- Interactions: Start menu (`<details>`), explorer tabs, photo lightbox `<dialog>`, scene toggle (sunset <-> midnight), motion pause button, taskbar current-section highlight, live IST clock.
- Reduced motion: all infinite animations off (checker enforces), marquee becomes a static wrapped row, no float, no shimmer. Pause/stop control also provided for everyone (WCAG 2.2.2).

## UI translation
- Nav: top taskbar - Start button + section "task buttons" (pressed = current) + tray (scene, motion, clock). Mobile: Start + current + tray; full list in Start menu.
- Buttons: bevelled 2px, press = inset; primary = pink with grape text; focus = dotted grape outline + cyan ring.
- Cards: windows with title bars (rotating pink/cyan/mint/lavender), minimise/maximise/close glyphs as decoration (aria-hidden), status bar for tags/meta.
- Forms: sunken inputs (cream), "Send" button, status line as a status bar.
- Timeline: file-explorer tree + detail list with path in the address bar.
- Footer: "It is now safe to turn off your computer." shutdown screen joke + gallery link.

## Pitfalls & accessibility risks
- Pastel on pastel: every text run sits on cream `#fff8ee` or lilac with deep-grape ink; title-bar text is ink on bright pastels (>= 7:1) or white on deep violet.
- Busy fixed background: windows are opaque; the scene is `aria-hidden` and `pointer-events: none`.
- Animation: only transform/opacity; nothing flashes; reduced-motion respected; pause control.
- Tap targets: 44px task/menu buttons; mobile Start menu is full-width.
- Hidden tab content (explorer) is still in the DOM and shown without JS.

## References
- Floral Shoppe (Macintosh Plus, 2011) - cover composition: bust + checker + pink. https://en.wikipedia.org/wiki/Floral_Shoppe (described only, not reused)
- Chuck Person's Eccojams Vol. 1 (2010) - origin point. https://en.wikipedia.org/wiki/Vaporwave
- Windows 95 shell - taskbar/Start/Explorer vocabulary. https://en.wikipedia.org/wiki/Windows_95
- 98.css (MIT) - used only as a checklist of Win9x control anatomy (bevels, title bar, status bar, tree view, group box); no code copied. https://jdan.github.io/98.css/
- Synthwave/outrun article - sunset/grid heritage (Out Run 1986, Vice City 2002, Drive 2011). https://en.wikipedia.org/wiki/Synthwave
- Inspiration: fake-OS dialogs and "mode" toggles (JLD'2nd, Displace OS) from research/_inspiration.md - described, not copied.

## Decisions for this site
Do: light dreamy scene, opaque OS windows, section-per-app metaphor, Start-menu nav, scene/motion toggles, hand-written SVG icons and ornaments, gradient-map photo recipe, wide Syncopate wordmark.
Do NOT: use Japanese glyphs; use dark-neon synthwave; use dark-mode glitch (that is the Glitch theme); make text pastel; autoplay sound; ship a Greek-bust image from a third party (a hand-drawn SVG column/bust silhouette instead); copy any album art or screenshots.

## Sources
- https://en.wikipedia.org/wiki/Vaporwave (fetched 2026-11-09)
- https://en.wikipedia.org/wiki/Floral_Shoppe (fetched)
- https://en.wikipedia.org/wiki/Synthwave (fetched)
- https://en.wikipedia.org/wiki/Windows_95 (fetched)
- https://jdan.github.io/98.css/ (fetched; component anatomy)
- Fonts: fontsource (jsDelivr) Syncopate / DotGothic16 / Quicksand / Instrument Serif.
