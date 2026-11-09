# Editing your content

All your words live in **one file: `src/content/profile.ts`**. Every one of the 19 styles reads it, so you edit once and all of them update.
Save the file while `npm run dev` is running and the page reloads by itself.

Photos are covered separately in [PHOTOS-AND-FILTERS.md](PHOTOS-AND-FILTERS.md).

---

## The shape of `profile.ts`

| Field | What it is | Notes |
|---|---|---|
| `name`, `firstName`, `handle` | Your name, first name, GitHub handle | `name` appears in every page title and as the page's `<h1>` |
| `role`, `focus`, `location` | "Software Development Engineer", the one-line focus, "Gurugram, India" | Shown in hero areas and the browser tab title |
| `tagline` | One-sentence hero line | Currently "I build GenAI agent platforms and the distributed backends under them." |
| `summary` | 2-sentence professional summary | Straight from the resume summary |
| `aboutPersonal` | List of short personal paragraphs | **Written by me from your photos - make it yours** |
| `interests` | Short chips ("Motorbike rides", "Reading", ...) | **Edit freely** |
| `stats` | `{ value, label }` pairs (e.g. `~5M` / "workflow requests / day") | See the checker note below |
| `contact` | Email, phone, LinkedIn, GitHub | See [Contact details](#contact-details) |
| `resume` | `href`, `label`, `updated` | See [Resume PDF](#resume-pdf) |
| `experience` | Jobs, each with a list of bullets | See [Experience](#experience-jobs) |
| `education` | Degrees | |
| `skills` | Groups of skills | See [Skills](#skills) |
| `caseStudies` | The deeper write-ups | See [Case studies](#case-studies) |
| `projects` | GitHub projects | See [Projects](#projects) |
| `writing` | The (empty) blog section | See [Writing](#writing--blog) |

Golden rules:
- **Facts only.** Numbers and claims should come from your resume / LinkedIn. Don't add availability or response-time promises ("replies within 48h") - none of the pages make any.
- Keep the surrounding punctuation (commas, quotes, braces). If the page stops compiling after an edit, the dev server prints the line to fix.
- Use plain ASCII dashes (`-`) in text; some fonts used by the styles don't have fancy dashes.

---

## Contact details

```ts
contact: {
  emailB64: b64('abhishek.k.11724@gmail.com'),       // <- change the text inside b64('...')
  phoneB64: b64('+917973373716'),                     // the number a phone dials (no spaces)
  phoneDisplayB64: b64('+91-7973373716'),             // how it is displayed
  linkedin: 'https://www.linkedin.com/in/abhishek-kumar-ld',
  github: 'https://github.com/abhishekkumar11724',
},
```
- Email and phone are stored **encoded** (`b64(...)` turns the text into base64 at build time) and decoded by the visitor's browser. That keeps them out of the raw HTML
  so simple scrapers miss them. Just edit the plain text inside the quotes. They are *not* secret: anyone with a browser sees them.
- To hide the phone number entirely, delete `phoneB64`/`phoneDisplayB64` **and** the `<Protected kind="phone" />` usages, or ask for it to be removed - the checker and every style currently expect a phone link.
- Visitors with JavaScript off see "abhishek.k.11724 [at] gmail [dot] com" and "Phone: see the resume PDF".
- The contact **form** needs a free Web3Forms key, otherwise it opens the visitor's email app: see [DEPLOY.md](DEPLOY.md#contact-form-key).

## Resume PDF

1. Overwrite `public/resume/Abhishek-Kumar-Resume.pdf` with the new file (keep the filename), **or**
2. Use another name and change `resume.href` in `profile.ts` (path is relative to `public/`, e.g. `'resume/My-Resume-2027.pdf'`).
3. `resume.updated` is the "PDF, updated Nov 2026" text some styles print next to the download button - change it when you update the file.

## Experience (jobs)

```ts
{
  id: 'delhivery',                       // short unique id (keep unique)
  company: 'Delhivery',
  title: 'Software Development Engineer',
  place: 'Gurugram, IN',
  start: 'Mar 2025',
  end: 'Present',
  blurb: 'One-line summary of the role.',
  bullets: [
    { head: 'NL-to-Workflow Compiler', text: 'Sole developer of a compile-once engine ...' },
    // head = a 2-4 word label, text = the full sentence
  ],
}
```
- Add a job by copying one object into the `experience` list (newest first). Every style loops over the list, so a fourth job appears everywhere.
- Each bullet needs both `head` and `text`; styles show them as a label + sentence.

## Skills

```ts
{ group: 'Languages', items: ['Python', 'JavaScript'], familiar: ['Go (Golang)'] }
```
`familiar` is optional (shown as "familiar"). Add a new group by adding another object.

## Case studies

```ts
{
  id: 'my-new-case-study',        // unique, lowercase-with-dashes
  title: 'Short Title',
  org: 'Delhivery',
  period: '2025 - now',
  role: 'Sole developer',
  kicker: 'One catchy line',
  problem: 'What was wrong (1-2 sentences).',
  approach: 'What you did (1-2 sentences).',
  impact: ['~90% lower cost', 'Sub-second latency'],   // short result lines; keep to numbers you can stand behind
  tags: ['LangGraph', 'Redis'],
  featured: true,                  // true = shown in the main case-study area
}
```
**Tested behaviour:**
- A new case study **appears in all 19 styles** with its text.
- Four styles also draw a custom illustration per case study, keyed by `id`: **Isometric**, **Steampunk** (blueprint diagram), **Neumorphism** (working mini-UI) and **Mid-century** (poster glyph).
  A *new* id gets the text but **no custom illustration** in Isometric, Steampunk and Neumorphism (Mid-century falls back to a default poster glyph).
- **Removing** an existing case study is safe (tested: the site still builds in all 19 styles).
- Keep copy resume-grounded. Each style shows `impact` lines as the headline results.

## Projects

```ts
{
  name: 'consumer-cart',        // unique key (the repo name works well)
  title: 'Consumer Cart',
  blurb: 'One or two sentences.',
  stack: ['React', 'Node.js'],
  repo: 'https://github.com/abhishekkumar11724/consumer-cart',
  live: 'https://consumer-cart.onrender.com/',    // or null if there is no live site
  year: '2023',
}
```
- A new project appears in all 19 styles (tested). Isometric, Neumorphism and Skeuomorphism pick a small icon/illustration by `name`; an unknown name gets a generic icon (Skeuomorphism, Neumorphism) or a blank stage (Isometric).
- Removing a project is safe (tested).
- The current list was written from your public GitHub READMEs; it is a snapshot - update it when your repos change.

## Writing / blog

`writing` currently says "No posts yet" and lists four *planned* topics. To add a post:
```ts
writing: {
  status: 'Latest posts',
  planned: [...],          // can stay or be emptied
  posts: [{ title: 'Why we kept the LLM out of the loop', date: '2027-01-10', href: 'https://...', summary: 'One sentence.' }],
},
```
**Limit:** 14 of the 19 styles list `posts` when the array is not empty. **De Stijl, Liquid chrome, Memphis, Neumorphism and Paper cutout do not** - they only print `status` and `planned`. (Ask to have them updated when you publish your first post.)

## Stats and the checker

`stats` is the row of big numbers (`~5M workflow requests / day`, `1000+ tools`, ...). The automated checker (`scripts/check-theme.mjs`, line ~114) has these four values written in
(`~5M`, `1000+`, `150+`, `~68%`). If you change those stats, update that list too or `npm run check` will report a failure (the site itself is unaffected).

## Text that is NOT in `profile.ts`

Each style has its own voice, so some words live in the style's own files:
- **Flavour lines** (kickers, taglines, footers, button wording) - `src/themes/<style>/meta.ts` (`flavor`) and inline in `src/themes/<style>/Page.astro`. Search for the exact wording to find it.
- **"About this style" panel** (history, traits, credits) - `src/themes/<style>/meta.ts` (`about`, `credits`). Run `npm run credits` afterwards to refresh `CREDITS.md`.
- **Photo captions & alt text** - `src/content/photos.ts` (see [PHOTOS-AND-FILTERS.md](PHOTOS-AND-FILTERS.md#photo-metadata)).
- **Page title / link preview**: `src/components/ThemeHead.astro` builds the title as "Name - Role (Style edition)". The social preview image is `public/og.jpg` (1200x630); replace it to change link previews.
  The absolute site address used for those links is `site` in `astro.config.mjs`.
- **Clean view wording** - `src/themes/_template/Page.astro`.

## After you edit

- `npm run dev` shows changes live.
- Before publishing: `npm run build` must finish without errors; optionally `npm run check:all` (see README) to re-run the quality checks.
