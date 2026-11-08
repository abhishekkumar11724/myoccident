# Bauhaus (1919 - 1933)

## Definition
The Staatliches Bauhaus was a German school of art, craft and architecture whose programme fused fine art with
industrial design ("a Gesamtkunstwerk") and whose output - stripped, geometric, primary-coloured, sans-serif - became the
template of 20th-century modernism. "Bauhaus style" in graphic design means: asymmetric compositions on a strict grid,
elementary shapes (circle, triangle, square) in red / yellow / blue plus black and off-white paper, thick rules and bars,
diagonals and rotated text, lowercase geometric sans, and photomontage. Form follows function; ornament is replaced by
structure and contrast of scale.

## Origins & timeline (facts from Wikipedia: Bauhaus, Herbert Bayer, Joost Schmidt, Kandinsky, Moholy-Nagy, Albers, Bauhaus typeface, Tschichold)
- 1 Apr 1919, Weimar: Walter Gropius founds the school by merging the Grand Ducal Saxon Academy of Fine Art with an arts-and-crafts
  school (the latter dating to 1906, Henry van de Velde). Founding faculty: Gropius, Johannes Itten, Lyonel Feininger, Gerhard Marcks.
  Itten runs the *Vorkurs* (preliminary course: basic elements of design, colour theory, materials). Resigns late 1923.
- 1922: Oskar Schlemmer's emblem adopted; Wassily Kandinsky arrives (teaches the basic design course, an advanced theory course and
  adds "form psychology" to colour theory); Paul Klee on the faculty.
- 1923: Moholy-Nagy replaces Itten in the Vorkurs (co-taught with Josef Albers) and steers the school from expressionism towards
  constructivism / New Objectivity. Gropius: "we want an architecture adapted to our world of machines, radios and fast cars."
  The 1923 Weimar exhibition poster by Joost Schmidt (Schmidt: Bauhaus student 1919-25, taught lettering 1925-32, ran the
  advertising / lettering / printing department 1928-32) and the Haus am Horn.
- 1925: Funding cut after the 1924 Thuringian election; school relocates to Dessau (Gropius's building opens late 1926). Herbert Bayer
  (aged ~25) is put in charge of the printing / advertising workshop; designs his "Universal" lowercase-only geometric alphabet
  (a paper design, never cast as type). Albers' geometric stencil letters (c. 1926-31). Moholy-Nagy publishes *Malerei, Photographie,
  Film* (1925) - "New Vision" (Neues Sehen) - and the *Bauhausbuecher* series.
- 1926: Kandinsky's *Punkt und Linie zu Flaeche* (Point and Line to Plane): the circle / half-circle / angle as basic elements.
- 1928: Jan Tschichold's *Die neue Typographie* (not a Bauhaus member, but the codification): asymmetry ("non-centred"), sans-serif only
  ("Grotesk"), hierarchy by contrasting size and weight, standard paper formats. Moholy-Nagy 1929: typography "must be communication
  in its most intense form. The emphasis must be on absolute clarity." Gropius leaves 1928 -> Hannes Meyer (functionalism; first
  profit 1929) -> Mies van der Rohe 1930-33.
- 1932 Dessau closure (Nazi council majority) -> Berlin factory school under Mies -> shut by Gestapo, faculty dissolve it April / July 1933.
  Diaspora (Gropius, Breuer at Harvard; Mies in Chicago; Moholy-Nagy's New Bauhaus Chicago; Albers at Black Mountain / Yale) spreads the
  ideas worldwide. The 1923 Kandinsky questionnaire among staff (widely reported): yellow = triangle, red = square, blue = circle.
- Revivals: ITC Bauhaus (1975) and Bauhaus 93 (1993) are *tourist* versions - the real thing is Bayer's Universal / Futura-like geometric sans.

## Defining visual traits (checkable)
- Three elementary shapes: circle, triangle, square; paired with blue, yellow, red (Kandinsky). Black + warm off-white paper do the rest.
- Strict (often modular) grid, but compositions are ASYMMETRIC and dynamic: a mass at one side balanced by white space, tension from diagonals.
- Diagonals at 45 / 30 / 60 degrees; type blocks rotated 90 degrees; thick black bars as separators and as graphic elements.
- Lowercase-only sans (Bayer): geometric forms (circle + line) for letters; extreme scale contrast between huge display and tiny setting.
- Photography as montage: cut-out figures, scale shifts, circles / angled crops, black-and-white or two-ink reproduction, superimposed geometry.
- Function first: information hierarchy by size and weight, numbered lists, ruled tables, no ornament, no gradients, no shadows.
- Poster energy: overlapped transparent-ish colour fields (multiply look), registration of flat inks.

## Colour (palette with hex + role)
| Token | Hex | Role |
|---|---|---|
| paper | `#F1EBDD` | main ground (warm off-white, never #fff); alt paper `#E8E0CC` for bands |
| ink / black | `#141414` | text, bars, rules, UtilityBar |
| red | `#D8281C` | square, primary action, hover fill, big numerals. White text on red passes 4.5:1 (about 4.9) |
| yellow | `#F2B705` | triangle, highlights, marker underlines. ALWAYS carries black text (white-on-yellow fails) |
| blue | `#1D4E9E` | circle, links on paper, white text on blue (8:1) |
| grey | `#8A8577` | quiet rules only (not for text) |
Combinations to avoid: red text on blue (vibrates, fails), yellow text on paper, gradients, pastel tints, drop shadows (use hard offsets only), more than
two accents in one component. Contrast: black on paper ~16:1; paper on black ~16:1; white on red ~4.9:1; white on blue ~8:1; black on yellow ~11:1.
Order.ts swatch (`#e63222 #f4c20d #1f4e9c`) is nearly identical; we use slightly deeper tones so white-on-red clears AA.

## Typography
- Historic: Bayer's Universal (1925, lowercase), Joost Schmidt's and Albers' stencil / constructed alphabets, Paul Renner's Futura (1927) and Kabel
  as the commercial equivalents, Tschichold's grotesk. ITC Bauhaus / Bauhaus 93 are revival novelties - not used.
- Chosen (OFL, self-hosted): **Jost** (Owen Earl, variable wght 100-900 - a Futura-style geometric sans) for everything: display at wght 800-900 lowercase,
  body 400-500, labels uppercase tracking .14em wght 600 at 12-13px, numerals tabular via `font-variant-numeric`. One family used with extreme scale contrast is
  period-correct (Tschichold: contrast of size and weight carries hierarchy).
- Scale: display clamp(3.5rem, 13vw, 12rem) line-height .82, letter-spacing -.04em; h2 clamp(2.4rem, 6vw, 5rem); body 1.0625rem/1.55; labels .75rem.
- Rule: titles lowercase (Bayer). Body sentences keep normal case so facts stay readable. Proper nouns inside body copy are untouched.

## Layout & composition
- 12-column grid, 1px / 4px black hairlines drawn only where they structure content; gutters 24px (16px mobile).
- Sections open with a **poster band**: a giant outlined / filled numeral, a thick black bar, a rotated vertical label (writing-mode: vertical-rl) and a cluster
  of 2-3 primary shapes overlapping at an angle. Sections alternate paper / alt paper / one saturated field (red, blue, black) with white or black text.
- Shape language: circles for people / photos; triangles for direction / emphasis (bullets, arrows); squares for data / buttons. Photos are clipped to
  a circle, half-circle, quarter circle, or right-triangle (faces kept inside via object-position and a generous focal area).
- Overlaps use `mix-blend-mode: multiply` on flat colour fields so red over yellow reads as a print overprint (orange) - the poster registration look.
- Whitespace is an active element. No centred layouts except the footer wordmark.

## Textures, ornaments & imagery (photo recipe + why)
- No ornament. Texture is limited to a very faint paper grain (SVG feTurbulence at ~4% opacity) so flat colour does not feel digital-sterile.
- Photo recipe "two-ink print": local exposure balance (backlit faces survive) -> percentile auto-levels -> contrast curve -> either **black-ink halftone** (coarse 45 degree
  dots, a real print screen) or **black + red** two-colour (shadows black, mids red ink, highlights paper) for group / scenery shots. Result reads as photomechanical
  reproduction in a 1920s Bauhaus book (Moholy-Nagy's Bauhausbuecher were printed in black + one colour). Faces stay recognisable because the cell is fine enough and the
  exposure is balanced first. Night shots get a lifted shadow curve.
- Imagery in layout: geometric masks (clip-path circle / polygon / ellipse for half-circle), thick black outline frames, large cropped numerals.

## Motion & interaction
- Hover on the numbered work list swaps a featured preview (shape composition + stat) - the signature move. Keyboard focus triggers the same.
- Scroll: decorative shapes slide / rotate a few degrees with scroll position (IntersectionObserver + CSS custom property, not scroll-jacking); section titles
  underline-bar draws in. Nav squares fill when the section is current.
- Buttons: hard offset block shadow that collapses on press; hover fills with a primary colour.
- Reduced motion: no scroll-linked transforms, no transitions >0, preview swap is instant, no infinite animations (there are none).

## UI translation
- Nav: sticky slim black bar with the wordmark in lowercase and eight numbered keys (circle / triangle / square glyph + number); on mobile an "index" disclosure. A large
  numbered contents list (01 - 08) follows the hero as the primary navigation; hover previews on desktop, tap targets on mobile.
- Buttons: rectangles with 3px black border, hard offset shadow, uppercase tracked labels; primary = red with white text, secondary = paper with black text,
  tertiary = yellow with black text. Focus ring: 3px blue outline offset 3px (and yellow on blue/black grounds).
- Cards: no rounded corners except true circles; thick top bar in the card's primary colour; numbered "sheet" labels.
- Forms: bottom-border-only inputs, uppercase labels, red submit; focus turns the border blue 4px.
- Timeline: experience as a horizontal-bar chronology (Gantt-like bars in red / blue / yellow) above the entries; entries in a two-column ruled table.
- Footer: giant lowercase wordmark cropped by the viewport, a black bar, circle / triangle / square signature.

## Pitfalls & accessibility risks
- Yellow on white / paper is illegible: yellow only as a fill with black text.
- Lowercase-only everywhere hurts readability: restrict to display + labels; body stays normal sentence case.
- Rotated text (writing-mode) is hard to read/select: use it only for decorative labels (aria-hidden) or short non-critical tags; the facts stay horizontal.
- Decorative shapes must not intercept pointer events or cause horizontal scroll (overflow clipped on the poster band, `pointer-events:none`).
- Overlap blends reduce contrast: never place text over blended overlaps; text sits on solid fields.
- Hover-only previews: the same info is in the list rows themselves (desc line present in DOM), so touch / keyboard users lose nothing.
- Motion: only subtle scroll-linked slides; none at all when `prefers-reduced-motion`.
- Not the Mondrian orthogonal rectangle grid - that belongs to De Stijl. Bauhaus here = diagonals, circles, triangles, rotated type, photomontage.

## References
- https://en.wikipedia.org/wiki/Bauhaus - timeline, directors, workshops, principles. (read)
- https://en.wikipedia.org/wiki/Herbert_Bayer - Universal typeface 1925 (lowercase-only, geometric; paper design), later P22 Bayer Universal. (read)
- https://en.wikipedia.org/wiki/Joost_Schmidt - 1923 exhibition poster, lettering teacher 1925-32. (read)
- https://en.wikipedia.org/wiki/Wassily_Kandinsky - teaching 1922-33, Yellow-Red-Blue (1925), Point and Line to Plane (1926). (read)
- https://en.wikipedia.org/wiki/L%C3%A1szl%C3%B3_Moholy-Nagy - photograms, New Vision, constructivism, Vorkurs. (read)
- https://en.wikipedia.org/wiki/Jan_Tschichold - Die neue Typographie (1928): asymmetry, sans-serif, hierarchy. (read)
- https://en.wikipedia.org/wiki/Bauhaus_(typeface) - Universal, geometric-sans lineage, revivals (Blippo, ITC Bauhaus, Bauhaus 93). (read)
- https://en.wikipedia.org/wiki/Josef_Albers - stencil alphabet, Vorkurs. (read)
- Joost Schmidt, poster for the 1923 Bauhaus exhibition (Weimar) - reference only: red/black on off-white, circle + square + diagonal bar, rotated lettering. No assets reused.
- Herbert Bayer, 1926 poster for Kandinsky's 60th birthday exhibition (Dessau) - reference only: lowercase, rotated line, thick rule.
- Kandinsky, *Yellow-Red-Blue* (1925, Centre Pompidou) - reference only: circle + cross + rectangle composition.
- Licence: all site art is original CSS / inline SVG; Jost is SIL OFL 1.1 (fontsource).

## Decisions for this site
Do:
- Index-as-navigation: a giant numbered list (01-08) after the hero; hover/focus swaps a featured preview (shape composition + one-line fact). Sticky slim top bar with eight shape-keys.
- Hero = exhibition poster: huge lowercase name, portrait cropped to a circle with a black halftone, yellow half-disc, blue triangle, red square, a thick diagonal bar, rotated labels. Asymmetric, off-grid overlap using multiply.
- Case studies as a numbered "work list" with a year / type / role index table and expandable detail panels (all text in DOM); projects as a ruled index table.
- Experience as a bar chronology + entries in two columns. Skills as shape-keyed groups (circle / triangle / square bullets).
- Photos clipped to circles, half-circles, triangles in "Beyond code" in a rhythm; a two-ink halftone treatment; lightbox-free (simple hover un-halftone via original swap) to keep JS tiny.
- Sections alternate paper / alt paper / one saturated field; one family of type (Jost).
Do NOT:
- No Mondrian-style orthogonal block grid (De Stijl theme), no gradients, no soft shadows, no rounded-corner cards, no ITC Bauhaus / Bauhaus 93 fonts, no ornament, no all-caps body text, no text over blended overlaps.

## Sources
Wikipedia pages listed above (fetched 2026-11-09); Jost font by Owen Earl via fontsource (OFL 1.1).
