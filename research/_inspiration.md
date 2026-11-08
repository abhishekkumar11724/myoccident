# Inspiration notes: recent.design, Pafolios, Awwwards

Research date: 2026-11-09. Purpose: raw material for a one-URL, 19-art-styles-rotating developer portfolio (Abhishek Kumar, GenAI/backend).
Everything below is description plus links. No code, copy text or assets were taken from any site.

## 0. Method and limits (read first)

- Tools: only WebFetch was usable. WebSearch was not available in this session, so there are no search-result fallbacks.
- WebFetch returns a text/markdown extraction, not pixels. Anything about colour, font, motion or layout that the extraction did not state is marked "(inferred)". Where I only saw a source's own tags or description of a site, I say so.
- Blocked or thin fetches: herasymenkox.com returned HTTP 402; david-hckh.com returned only its page title; library.jjangik.kr and jlern.com returned mostly empty/asset-only content (JS-rendered); the pafolios.com home gallery showed "Loading portfolios..." (client-side rendered), so I used its /directory, /types/* and profile pages instead.
- Only sites whose URLs appeared on the pages I fetched are listed. No URLs were guessed.
- Awwwards and Pafolios "of the day" data is as of 2026-11-08/09.

---

## 1. recent.design

**What it is.** A curated, image-led design inspiration feed ("The best design inspiration on the Internet"). Newest-first. Multi-medium: general Design, Launch Videos (badged "new"), Websites, OG Images, App Screenshots, App Icons, plus Tools, Skills and a Jobs board. Sponsor and job slots are inserted into the feed as native cards.

**How it is organised.**
- Two nav groups: Browse (Design, Launch Videos, Websites, OG Images, App Screenshots, App Icons) and Resources (Tools, Skills, Jobs).
- /websites is a grid of 20 image-only cards (looping WebP poster frames, no captions). Category chips: All, AI, Agency, Portfolio, SaaS, Ecommerce, Startup, Product, Technology, Finance, Food & Drink, Music, Art, Photography, Architecture, Health, Education, Entertainment, Web3, Crypto, Editorial, Personal.
- Each detail page (/i/<id>-<slug>) has a one-sentence editorial description, style tags (Typographic, Minimal, Large Type, Editorial, Experimental, 3D, Playful, Retro, Illustrative, Textured, Dark, Pastel, Muted...), an interaction tag (Transitions, Scrolling Animation, Custom Cursor, Long Scrolling), a detected tech stack (Next.js, Nuxt, Webflow, GSAP, Lenis, Three.js, Howler.js, Motion...), and impressions / outbound-click stats (roughly 290-300K impressions and 1.6-2.3K clicks for the portfolios I saw).
- Takeaway for us: the taxonomy (style / color / interaction / tech) is a good vocabulary for tagging our own 19 skins.

**Examples seen (all via recent.design detail pages; descriptions are the site's, paraphrased).**

| Site | URL | What makes it work |
|---|---|---|
| Harry Atkins | https://harryjatkins.com/ | Sparse, large-type project index with a modest personal intro; project previews can be switched to monochrome. Restraint as the flex. |
| Cathy Dolle | https://www.cathydolle.com/ | Minimal, muted gallery of image studies; tagged Next.js + GSAP + Lenis + Three.js. Experimental motion inside a quiet frame. |
| Belen Jones | https://www.belenjones.com/ | Oversized type, 3D editorial project showcases and shifting pastel scenes. Live page shows a 0-100% loader, a featured project, and a name-only project list instead of a menu. |
| Pacome Pertant | https://pacomepertant.com/ | Moody animation/audio portfolio centred on a whimsical 3D reel plus a clickable project explorer (Nuxt, GSAP, Three.js, Howler). |
| Miranda (Niccolo Miranda) | https://www.niccolomiranda.com/ | Portfolio modelled on a broadsheet newspaper: illustrated portrait, heavy magazine lettering, "scoreboard" box of awards, "letters" section of testimonials, orientation prompt for landscape. Layout metaphor carries the whole page. |
| Dries Bos | https://www.driesbos.com/ | Dark, understated spreadsheet-like list of 15 projects by year / title / type, newest first, each row a thumbnail plus internal case study. Email link has a prefilled subject. |
| Jonnie Hallman | https://destroytoday.com/ | Design engineer at Stripe; client work (Stripe, Casper, Dropbox, FiftyThree) and his own product Cushion sit on one long page, split by illustrated dividers. |
| Displace | https://displace.agency/ | Agency whose sibling site is styled as an OS desktop (the live page I fetched is a conventional agency page with a footer link to "Displace OS", so I could not verify the desktop itself). Live clocks for two cities, "/" search overlay, regional switch. |
| Astro Dither | https://astrodither.robertborghesi.is/ | Experimental sound-and-visual piece: a neon pixel-dithered hand, glitchy reactive motion on dark (Three.js, GSAP, Howler). Shows how far a single hero object can go. |
| Claudio Guglieri | https://guglieri.com/ | Dark page where 3D objects and morphing lettering together form one question as the hero. Type and 3D as one gesture. |

Also seen, lighter notes: Mike Matas https://mikematas.com/ (time-ordered career timeline, minimal), JP https://www.jp.works/ (spinning 3D template previews, whimsical objects), Simon Rogers https://www.simonrogers.info/ (animated repeating blue lettering, alternating upright and slanted), Daniel Triendl https://www.danieltriendl.com/ (character-led illustration portfolio), Shivam Sinha https://www.helloshivam.com/ (mouse-following WebGL light, custom cursor per recent.design).

---

## 2. Pafolios (pafolios.com)

**What it is.** A portfolio-only gallery by Trong (trong.me): "The best design portfolio examples and inspiration", about 890 portfolios, with a daily "Portfolio of the Day" flag on each profile page. Monetised with "Sponsored" tiles (a Ghost theme) in the same card format as portfolios.

**How it is organised.**
- Header: Case studies, Submit; footer: Directory, About, X link. Gallery is client-rendered (needs JS).
- /directory lists categories by profession with counts: UX & Product Designer 560, Pafolios Pick 161, Creative Designer 147, Software Developer 103, Design Agency 86, Brand Designer 53, Writer 44, Interaction Designer 32, Design Engineer 15, No-code Developer 14, Illustrator 11, Artist 9, Photographer 9, Design Subscription 5, Design Intern 5, UX Researcher 4.
- Category pages (/types/software-developer: 103 sites; /types/design-engineer: 15) are paginated stacks of cards (screenshot + name + role label), newest first.
- Profile page = screenshot + role tag + "Portfolio of the Day" date + outbound link. No descriptions, so it is purely visual curation.
- /case-studies is a separate editorial list of 13 well-known product case studies (Google Translate UI, HEY, Duolingo retention, Apple Music redesign, Lonely Planet...), each card with 1-3 tags (Product, Behind the scene, Process, UX Writing) and a one-line blurb. Individual URLs were not exposed in the extraction, so I list none.
- Takeaway: the "Design Engineer" and "Software Developer" buckets are the closest peer set to our site.

**Examples seen (live sites fetched; role label from Pafolios).**

| Site | URL | What makes it work |
|---|---|---|
| Cristian Rus (Design Engineer, PotD 31 Oct 2026) | https://www.cristianrus.me/ | Radically small: first-name heading, tiny portrait, "DESIGN & HUMAN BEHAVIOUR" tagline, three numbered link groups (01 About, 02 Apps, 03 Contact) acting as nav. Apps are bare names linking to their own domains. |
| Shahriar Avi (Design Engineer, PotD 28 Oct 2026) | https://shahriaravi.me/ | Name + live clock + role, then experience, projects (with View Source), and a /craft grid of micro-interaction demos (icon morph, hold-to-delete, clip-path tabs). Nav is just "/craft" and "/writing". |
| Michael Kwok (Design Engineer, PotD 18 Oct 2026) | https://michaelgkwok.design/ | Inline employer logos inside the hero sentence; numbered eyebrows ("01 Case studies"); case-study cards contain a faux product UI (prompt chips, dashboard chart with 7D/30D/1Y toggles) instead of a screenshot; a "Studio" section for jewellery, photography, radio. |
| Eduard Bodak (Design Engineer, PotD 25 Sep 2026) | https://www.eduardbodak.com/ | Freelance-pitch portfolio: headline, three project previews, services, FAQ accordion, a "Connect" overlay with starting prices and timelines, EN/DE switch, live Cologne time, pixel-sprite flourishes. |
| Lorenzo de Lijser (Design Engineer, PotD 21 Aug 2026) | https://lorenzodelijser.com/ | Hero has portrait, "Designer & Engineer" and a contact CTA; case studies open with captioned screenshot galleries then role/scale; a "years" axis timeline; About lists favourite musicians as inline links with tiny thumbnails; email card styled as a draft (To / Subject / From). |
| Craig Weiss (Software Developer, PotD 30 Oct 2026) | https://craigweiss.dev/ | Text-first, lowercase nav (work, shitposts, writing); "Professional Shitposter" listed as a job in the CV; honest "sunset" project note; "built on" date stamp in footer. |
| Justin Lerner (Software Developer, PotD 11 Apr 2026) | https://jlern.com/ | Awwwards-badge, oversized single-letter section headers spelling a handle (J-L-E-R-N-J) and layered illustration assets per project (inferred scroll scenes). Content was mostly asset names in my extraction. |
| Yuvich (Software Developer, PotD 4 Oct 2026) | https://www.yuvich.com/work | Listed on Pafolios; the profile had no description and I did not fetch the live site, so no further detail. |
| Hugo Richard (Software Developer, PotD 15 Jan 2026) | https://hrcd.fr (redirects to https://hugorcd.com/) | Listed on Pafolios; redirect not followed, not inspected. |

---

## 3. Awwwards (awwwards.com)

**What it is.** The long-running web design awards platform: a jury and community score submitted sites; daily "Site of the Day" (SOTD), plus Honorable Mention, Site of the Month/Year, Developer Award, Nominees. Monetised via Pro, Academy, Market (templates), Jobs and promoted tiles.

**How it is organised.**
- "Explore" mega-menu: Awards, Trending topics, Categories (~27), Technologies (100+: GSAP, Three.js, WebGL, React, Webflow, Framer, Next.js...), Collections, Blog. Also Directory (creators), Academy, Jobs, Market.
- /websites/sites_of_the_day/ is a single-column daily feed (reverse chronological, pages 1-5), each card: thumbnail, site name, external link, designer (with PRO badge), award badges and dates.
- /websites/portfolio/ ("Portfolio Websites" under Trending) is a filterable grid (31 per page). Filters: Awards, Category, Tag (~50, e.g. Portfolio, 3D, Parallax, Typography, Storytelling), Technology, Country, Font (e.g. Aeonik, Canela, Druk, Editorial New), Color (27 swatches). The Font and Color filters are unusually useful for style research.
- /websites/developer/ is the Developer Award archive (most SOTDs also carry it).
- /collections/ are user- and staff-curated moodboards (32 per page). Relevant ones seen: "Team & About Pages" (/awwwards/collections/about-page/), "Brutalism" (/awwwards/collections/brutalism/), "Hovers, Cursors and Cute Interactions", "Text Marquee animation", "Horizontal Layout Websites", "Black and White Websites", "Trippy Sites", "Typography in Web Design", "Storytelling Websites", "Photography Portfolio".
- Note: Awwwards cards in these lists did not show scores or per-site tags; the 2026-11-08 SOTD (Extrafazant, https://www.extrafazant.nl/) showed 7.24/10 on its own page.
- Recent non-portfolio SOTDs listed (not inspected, for reference only): Justin Jefferson https://jjettas.com, ViV https://vivmgmt.com/, Grids by Obys https://grids03.obys.agency/, FORMAT by Obys https://format.obys.agency/, A24 by Ravi Klaassens https://a24.raviklaassens.com/, Cartier Le Choeur des Pierres https://www.cartier.com/en-fr/lechoeurdespierres.

**Portfolio / personal-site examples fetched (portfolio filter and SOTD list).**

| Site | URL | What makes it work |
|---|---|---|
| JLD'2nd (James Lee II) | https://jld2nd.dev | Retro-game narrative: a 13-dot Pac-Man-style pager with tooltips (Creator, Pixels, Brain, DNA, Hands...), "Developer Mode / Creative Mode" labels, a fake-OS dialog sequence, Tetris payoff, contact form titled like a file path. Projects are gated behind a "open portfolio?" dialog. |
| It's Tomo (Tomislav Jezidzic) | https://its-tomo.dev/ | Garage metaphor: counter loader, garage-door opening, "Scroll to walk in", click-to-enable sound, and a drivable 1980s van (WASD, nitro, touch controls). Also has a skip link, numbered work list, awards tally (25), "no trackers" privacy line. |
| Guillaume Colombel (SOTD 28 Oct 2026) | https://guillaumecolombel.fr/ | Numbered 01-12 project list is the whole menu; header is just wordmark + About. Bio, jury role, awards tally, copy-email button, no form. |
| Brandon Yasin (SOTD 24 Oct 2026) | https://brandonyasin.com | Home is a draggable image "Archive" field; About has values, six-step process, numbered services; Contact is an overlay that branches Client / Talent / Email with scope, format, budget bands, timeline; replies-in-48h and "booking December" status; local-time / "time travel" toggle. |
| Huy Phan Vol.2 (SOTD 14 Oct 2026) | https://huyml.co/ | Credibility-first hero (award badges), overlay Menu (Work / About / Playground / Contact), audio switch, numbered featured carousel, a dated index with roles and awards per project, live Ho Chi Minh City clock, credits panel naming developer, illustrator, copywriter. Rive credited. |
| Maria Vasilyeva (SOTD 9 Oct 2026) | https://www.mariavasilyeva.com/ | Music metaphor everywhere: preloader copy cues a playlist, nav items are Notes / Melody / Overture / Jazz, plus "Sound" and "Annotations" toggles and a Selected / All / About / Thoughts filter row. |
| Daiki Fujita | https://daikifujita.com | "Touch to dream" vs "Scroll to explore" entry choice; Tokyo clock; bilingual EN/JA about; projects framed as memories; dream-mode game; footer re-offers dream mode; 15 awards listed by year. |
| Andreas Kruszakin-Liboska | https://andreas.vision | Business-outcome intro (funding raised), only two case studies with results-first titles, then seven essays titled as questions; nav Work / About / Writing / Play; email + six plain profile links. |
| Interaction Library (Jungik Lee) | https://library.jjangik.kr/ | A shelf of unshipped interaction prototypes presented as a notebook; each opens full-screen with an Esc hint (samples did not render in my extraction). |

Also in the Portfolio list (not inspected): Made By Igor https://madebyigor.com/, Serhii Lastovychenko https://serhii.website/, Abhay Rohit https://abhayrohit.com/, Yehor Herasymenko https://herasymenkox.com/ (402 on fetch), Beige https://www.beige.zone, Zachary Allott http://www.zacharyallott.com.

---

## 4. Cross-cutting patterns (what "premium" looks like)

**Hero treatments**
- Text-only statement hero: name, a stacked role line ("Designer, Creative Coder & Thinker"), one short first-person paragraph, an employer link. Seen on Cristian Rus, Shivam Sinha, Andreas, Craig Weiss. Confidence signal = restraint.
- Credibility strip in the hero: award badges and "launched 2023" credit (Huy Phan, Brandon Yasin's SOTD badge) or inline employer logos in the sentence (Michael Kwok).
- Entry gates and "choose your mode": Touch to dream / Scroll to explore (Daiki Fujita), Developer Mode / Creative Mode (JLD'2nd), garage door that opens (It's Tomo), sound on/off prompt.
- One strong hero object: neon pixel hand (Astro Dither), 3D objects morphing into a question (Guglieri), 3D editorial scenes (Belen Jones), matte ceramic bottle on dark (Eduardo del Fraile https://eduardodelfraile.com/), illustrated open book (George Thomas Hatton https://georgehatton.com/).
- Drifting/loose image collages: Gregor Collienne https://gregorcollienne.com/ (drifting collage + large menus), Meech213 https://www.meech213.com/ (drifting print-like cards), Brandon Yasin's draggable archive.
- Preloaders used as storytelling: percentage counters (Belen Jones, Maria Vasilyeva, It's Tomo) with themed copy.

**Typography**
- recent.design's most common style tags on portfolios are Typographic, Large Type, Editorial, Minimal. Oversized display type plus a quiet grotesque is the default.
- Small supporting devices: numbered eyebrows ("01 -", "(01)"), lowercase nav, uppercase tiny labels, arrow glyph in date ranges ("2023 -> 2025"), stacked single-word headings (Miranda), italic emphasis on one word (Daiki), bilingual lines (Daiki, Michael Kwok's name in Korean and Chinese).
- Named pairings I saw: BT Glyphius + BT Grotesk (Huy Phan). Awwwards' Font filter lists Aeonik, Canela, Druk, Editorial New as common picks.
- File-name / system labels (.exe, C:/...) as monospace flavour (JLD'2nd; face inferred).

**Navigation (including unconventional)**
- Project list as menu: numbered 01-12 (Colombel), name-only index that changes the featured project (Belen Jones, switching inferred).
- Overlay Menu with a text-roll hover (labels duplicated in markup on Brandon Yasin and Eduard Bodak; inferred).
- Dot-pager with tooltips and a game sprite (JLD'2nd); numbered link groups as nav (Cristian Rus); URL-path labels (/craft, /writing); metaphor labels (Notes/Melody/Overture, Pixels/Brain/DNA).
- OS desktop (Displace OS), "/" command-search overlay (displace.agency), regional switch, live local clocks, sound and annotation toggles as nav-adjacent controls.
- Contact as persistent header item that opens an overlay (Brandon Yasin, Eduard Bodak, Lorenzo de Lijser).

**Section ordering (recurring skeletons)**
1. Hero -> Selected work -> About -> Contact (Michael Kwok: Case studies, Studio, About, footer).
2. Hero -> Experience -> Projects -> Craft/demos -> Footer (Shahriar Avi).
3. Work index -> Bio -> Credentials/awards -> Socials (Colombel).
4. Intro -> Projects -> Essays -> Links (Andreas).
5. Narrative scroller with projects behind a gate (JLD'2nd).
Pattern: work comes first or second almost everywhere; awards/recognition and pricing come late.

**Projects and case studies**
- Index-as-table: year / title / type with thumbnails (Dries Bos); index with date, awards, role tags, industry (Huy Phan).
- Outcome-first titles with constraints (team size, deadline, result) rather than generic labels (Andreas, It's Tomo's mechanics-focused one-liners).
- Cards that contain a mini live UI mock rather than a screenshot (Michael Kwok); captioned mixed mobile/desktop screenshot galleries then role/scale (Lorenzo).
- Client work followed by self-initiated work: talks, own product, studio (Jonnie Hallman).
- "Play/Lab/Craft" areas for experiments, kept apart from case studies (Huy Phan Playground, Shahriar /craft, Interaction Library, Andreas Play).

**Blending personal and professional**
- Personality inside CV structure: "Professional Shitposter" as a job entry (Craig Weiss); a hobby vehicle that is also a demo (It's Tomo); bilingual about (Daiki).
- Scrapbook About: favourite artists as inline links with thumbnails, Are.na and magazines (Lorenzo); family/studio photos (Jonnie); personal-brand story as project 01 (Colombel).
- Writing as the personality layer: essays longer than the projects section (Andreas); Substack link in nav (Maria Vasilyeva).
- A single metaphor renamed across nav, loader and CTAs (music, garage, dreams, body parts, newspaper).

**Micro-interactions and motion**
- Click-to-copy email (Colombel, Eduard Bodak); mailto with prefilled subject (Dries Bos, Lorenzo, Michael Kwok).
- Live clocks (Shahriar Avi, Huy Phan, Daiki, Eduard, Displace); status lines ("replies in 48h", "booking December", "2 working hours").
- Drag canvas (Brandon Yasin); keyboard hints (Esc to close on Interaction Library, D to drive on It's Tomo); hold-to-delete and morphing icons as proof of craft (Shahriar /craft).
- Stack signals on recent.design: Lenis smooth scroll, GSAP, Three.js, Motion, Howler (sound) appear on most "experimental" portfolios; "Transitions" is the single most-used interaction tag.
- Scroll as spatial travel (It's Tomo "walk in"), horizontal reels (Miranda), WebGL project carousel (David Heckhoff per recent.design).

**Footer and contact**
- Intake-style contact: choose path (Client / Talent / Email), scope, format, budget band, timeline (Brandon Yasin); pricing tiers in the contact panel (Eduard Bodak).
- Contact styled as an artefact: an email-draft card (Lorenzo), a form titled as a file path (JLD'2nd), a copy-email button (Colombel).
- Closing moves: "That's all. What now?" with two CTAs (Jonnie Hallman); footer as second entry point to the hero experience (Daiki); bottom strip with showreel, local time, email (Huy Phan); build-date stamp and RSS (Craig Weiss).

---

## 5. Pitfalls to avoid

- Content that does not exist without JS/canvas. Several portfolios returned almost nothing to a text crawler (jlern.com assets only; library.jjangik.kr empty samples; david-hckh.com title only; Pafolios gallery "Loading..."). For us: ship real HTML text for every section so SEO, link previews, reader modes and screen readers work regardless of style.
- Hiding the work. JLD'2nd shows no projects on the page, behind a dialog; Cristian Rus lists apps with no descriptions; Belen Jones' nav is a bare list of names. Recruiters want projects within one click and a one-line outcome each.
- Heavy preloaders (0-100% counters, door-opening intros, playlist loaders). Fun once, painful daily. Keep under ~1.5 s, skippable, and skip on repeat visits. Maria Vasilyeva's capture was almost entirely loader.
- Duplicated hover-roll labels ("MenuMenu", labels repeated three times in markup on Brandon Yasin and Eduard Bodak). Without aria-hidden on the copies, screen readers read them repeatedly.
- Empty/unlabelled links (Colombel had two empty home links before the intro) and email hidden behind JS obfuscation (Craig Weiss), which fails when scripts fail.
- Sound: prompts like "Click anywhere for sound" are fine (opt-in); never autoplay. Keep a persistent mute.
- Mobile: orientation prompts ("turn your device sideways", Miranda), drag-only canvases, WASD driving. It's Tomo is the good counter-example (touch controls, skip link). Provide a non-drag fallback and 44px targets.
- Readability: huge display type, neon on dark, pastel on pastel, and low-contrast "muted" palettes are common recent.design tags. Several of our 19 styles (vaporwave, psychedelic, glitch, grunge, anti-design) are contrast risks, so enforce a minimum contrast for body text and a plain-text reading mode.
- Motion: parallax, Lenis smooth scroll, WebGL on every section. Respect prefers-reduced-motion, cap pixel ratio, lazy-init Three.js, avoid scroll-jacking that breaks native scroll, anchors and back-button.
- Stale signals: copyright years of 2021 (Miranda) and 2023 (Shivam Sinha), a Brooklyn vs New York mismatch (Jonnie Hallman). Generate the year and location from data.
- Award-badge clutter and template placeholders. Huy Phan's featured cards read partly as placeholder entries; badges on every project dilute the signal.
- Gimmick over clarity: a dream mode, a drivable car or a Pac-Man pager is memorable only if the plain scroll path still answers "who, what, proof, contact" in under 10 seconds.

---

## 6. What to steal (transferable ideas, tagged by best-fit style)

1. **Numbered work list as the primary nav (01-12), hover swaps a featured preview.** (Colombel, Belen Jones) -> Bauhaus, Brutalism, Mid-century.
2. **Year / client / type table index with thumbnails.** (Dries Bos) -> Brutalism, De Stijl, Bauhaus.
3. **Broadsheet front page: masthead, dateline, scoreboard box of numbers, "letters" testimonials.** (Miranda) -> Grunge, Mid-century, Art Nouveau.
4. **Fake-OS windows/dialogs for projects, and a "mode" toggle (Engineer / Human).** (JLD'2nd, Displace OS) -> Skeuomorphism, Vaporwave, Glitch.
5. **Project cards that contain a miniature live UI mock (prompt chips, chart toggles) instead of screenshots.** Great for GenAI demos. (Michael Kwok) -> Neumorphism, Isometric, Skeuomorphism.
6. **Intake-style contact overlay: Client / Talent / Email, scope chips, budget bands, reply-time promise.** (Brandon Yasin) -> Neumorphism, Skeuomorphism, Isometric.
7. **Copy-email button plus prefilled mailto subject; email styled as a draft card.** (Colombel, Dries Bos, Lorenzo) -> Memphis, Anti-design, Paper cutout.
8. **Live local clock + availability line ("Replies in 48h").** (Shahriar Avi, Huy Phan, Daiki) -> Steampunk (gauge/dial), Bauhaus, Mid-century.
9. **Metaphor-renamed nav and thematic loader copy.** (Maria Vasilyeva's music labels, JLD'2nd's body parts) -> Art Nouveau, Ukiyo-e (seasons/scroll chapters), Psychedelic.
10. **A /craft or lab grid of tiny interaction demos with keyboard hints (Esc, D).** (Shahriar Avi, Interaction Library) -> Glitch, 3D inflated, Anti-design.
11. **Draggable image archive as a secondary home view.** (Brandon Yasin) -> Paper cutout, Isometric, Ukiyo-e.
12. **Scrapbook About: favourite things as inline links with tiny thumbnails; a joke "job" in the CV.** (Lorenzo, Craig Weiss) -> Memphis, Grunge, Anti-design.
13. **Results-first project titles with constraints (team size, deadline, number).** Maps well to backend/GenAI metrics. (Andreas, It's Tomo) -> Brutalism, De Stijl, Bauhaus.
14. **Footer that re-offers the hero experience, plus a "built on <date>" stamp.** (Daiki Fujita, Craig Weiss) -> Psychedelic, Vaporwave, Steampunk.
15. **Oversized type over shifting pastel/3D scenes, with a name-only index.** (Belen Jones, Guglieri) -> 3D inflated, Liquid chrome, Memphis.

Structural note for the daily-skin concept: nearly all of these ideas live in the information architecture (nav, index, contact, about), not the paint. Keep one stable skeleton (hero -> selected work -> lab -> about -> contact) and let each day's style re-skin it, borrowing one of the above as that day's signature move.
