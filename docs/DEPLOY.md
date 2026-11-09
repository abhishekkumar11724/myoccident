# Putting it online

**Where it lives:** https://abhishekkumar11724.github.io/myoccident/
**Repository:** `abhishekkumar11724/myoccident` (branch `main`). A GitHub Actions workflow, `.github/workflows/deploy.yml`, builds the site and publishes it to GitHub Pages **every time you push to `main`**.

The site is 100% static files (HTML/CSS/JS/images) in `dist/`, so any static host works.

---

## How this repository came to hold the site

`myoccident` used to be your 2023 portfolio (a Next.js app; 12 commits, the last one `5128a5f` from 2023-06-12), deployed by a workflow called `nextjs.yml`.
This project replaced it **without erasing it**:

- The new code was pushed on top of the old history using a merge that keeps the **new** files and leaves the old ones out of the tree (no force-push). Nothing was deleted from git.
- The old workflow `nextjs.yml` is gone from the tree (it would have tried to build a Next.js app that no longer exists); `deploy.yml` replaces it.
- **To get the old portfolio back** (for reference or to host elsewhere): `git worktree add ../myoccident-2023 5128a5f` gives you a folder with exactly the old files.
- GitHub Pages was already set to deploy from **GitHub Actions** (the old workflow used it), so no setting had to change. If you ever see the old site, check **Settings -> Pages -> Build and deployment -> Source** is "GitHub Actions".

## The sub-path (`/myoccident/`)

A project repository is served under its name, so every address carries `/myoccident/`: the home page is `.../myoccident/`, a style is `.../myoccident/s/glitch/`, the Clean view `.../myoccident/clean/`.
This is configured once, in `astro.config.mjs` (`base: '/myoccident/'`, `site: 'https://abhishekkumar11724.github.io'`). Every internal link and image goes through `withBase()`, the rotation script receives the base, and the checker reads it from the same file.
Locally, `npm run dev` and `npm run preview` also serve under it: `http://localhost:4321/myoccident/`.

To publish at the root of a domain instead (a repository named `abhishekkumar11724.github.io`, or a custom domain), set `base: '/'` (and `site`), nothing else.

---

## Before you publish a change - checklist
- [ ] `npm run build` completes with no errors; `npm run preview` (open `http://localhost:4321/myoccident/`) looks right.
- [ ] Read through personal text in `src/content/profile.ts` (`aboutPersonal`, `interests`) and photo captions in `src/content/photos.ts`. They were written from your photos, not from facts you gave.
- [ ] Your **phone number** is on the site (encoded in the HTML, visible to anyone who loads the page). To remove it see [EDITING-CONTENT.md](EDITING-CONTENT.md#contact-details).
- [ ] Update `public/resume/Abhishek-Kumar-Resume.pdf` if your resume changed.
- [ ] Friends and family appear in photos; you told me they agreed. Remove any photo you are unsure about ([PHOTOS-AND-FILTERS.md](PHOTOS-AND-FILTERS.md#remove-a-photo---read-this-first)).
- [ ] Nothing private is in the repo: the Instagram export was deleted and `assets/`, `.env`, `node_modules/`, `dist/` and the generated photo variants are git-ignored. (`git ls-files` lists what would be pushed.)

## Updating the live site

```bash
# edit content / photos / styles ...
npm run build                 # must succeed
git add -A && git commit -m "Describe the change"
git push                      # origin = git@github-personal:abhishekkumar11724/myoccident.git
```
Then watch the repository's **Actions** tab -> "Deploy to GitHub Pages". The page updates when the run finishes. The first run renders all photo variants (it has no cache yet, so allow 10+ minutes; an estimate), later runs reuse a cache and are much faster
(the cache is keyed on `photos/`, every `recipe.mjs`, `scripts/fx/index.mjs`, `scripts/build-images.mjs` and `src/content/photos.ts`, so text-only edits stay fast).
The daily style change needs no redeploy; it happens in the visitor's browser.

If a build fails, **the previous version of the site stays online**; open the failed run in the Actions tab to read the error.

**Git access on this Mac:** the `origin` remote uses the SSH host alias `github-personal` (defined in `~/.ssh/config`, key `~/.ssh/ak_personal`). The plain `git@github.com` address is not authorised with the default key. If a push says "Permission denied (publickey)", check `git remote -v` still shows the `github-personal` host.

## Contact form key

The form needs a free access key from Web3Forms; without one it simply opens the visitor's email app with the message pre-filled (still works).
1. Go to https://web3forms.com, enter the email address that should receive messages, and they email you an **Access Key**.
2. Locally: copy `.env.example` to `.env` and set `PUBLIC_WEB3FORMS_KEY=your-key`. Restart `npm run dev`. Send a test message from any style's contact form.
3. For the published site: GitHub repo -> **Settings -> Secrets and variables -> Actions -> New repository secret**, name `PUBLIC_WEB3FORMS_KEY`, paste the key; then re-run the latest workflow (Actions -> Deploy to GitHub Pages -> Re-run) or push any commit. The workflow passes the secret to the build.
Notes: the key ends up in the page's JavaScript (it has to - the browser sends the form). That is normal for this kind of service, but use a key dedicated to this site.
This form submission is the only request that ever leaves your site, and only when someone presses Send. Service limits/pricing are Web3Forms' own; check their site.

## Test the production build locally
```bash
npm run build      # writes dist/ (about 280 MB, mostly photo variants)
npm run preview    # http://localhost:4321/myoccident/
```
`npm run check:all` does the same on port 4488 and then runs the browser checks on every style. It refuses to start if something is already listening on that port.

## Custom domain
Create `public/CNAME` containing just the domain, set `site: 'https://your.domain'` and `base: '/'` in `astro.config.mjs`, point DNS as GitHub's Pages documentation describes, and tick **Enforce HTTPS** in Settings -> Pages.

## Other hosts (Netlify, Vercel, Cloudflare Pages...)
Any static host works: build command `npm run build`, publish directory `dist`, Node `22.23.4` or newer, and add `PUBLIC_WEB3FORMS_KEY` as an environment variable. Set `base` to match where the host serves the site (`'/'` for a domain root).
These hosts don't use the GitHub Actions cache, so every build re-renders photos unless their build cache keeps `public/generated` and `src/generated/manifest`.

## Size and limits
- The published site is about 280 MB (19 styles x 60 photos, each in two sizes). A visitor downloads only one style: about 1.4-4.5 MB of photo thumbnails for most styles, De Stijl about 10 MB (see the limitations doc).
- GitHub documents soft limits for Pages (a recommended maximum published-site size of 1 GB and a monthly bandwidth guideline); check GitHub's current Pages limits page if traffic grows.
