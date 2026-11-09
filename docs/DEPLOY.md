# Putting it online

**Status: nothing has been deployed or pushed.** This project has a local git repository (branch `main`, no remote) and a ready-made GitHub Actions workflow
(`.github/workflows/deploy.yml`) that does nothing until you push to GitHub. Pushing to `abhishekkumar11724.github.io` publishes the site, so do it deliberately.

The site is 100% static files (HTML/CSS/JS/images) in `dist/`, so any static host works. These steps are for GitHub Pages at `https://abhishekkumar11724.github.io`.

---

## Before you publish - checklist
- [ ] Read through the personal text in `src/content/profile.ts` (`aboutPersonal`, `interests`) and the photo captions in `src/content/photos.ts`. They were written from your photos, not from facts you gave.
- [ ] Look at all 19 styles once yourself (`npm run dev`, then `http://localhost:4321/gallery/`). Everything was verified by automated checks and screenshots in Chrome only.
- [ ] Decide about your **phone number**: it is on the site (encoded in the HTML, visible to anyone who loads the page). To remove it see [EDITING-CONTENT.md](EDITING-CONTENT.md#contact-details).
- [ ] Update `public/resume/Abhishek-Kumar-Resume.pdf` if your resume changed.
- [ ] Friends and family appear in the photos; you told me they agreed. Remove any photo you are unsure about ([PHOTOS-AND-FILTERS.md](PHOTOS-AND-FILTERS.md#remove-a-photo---read-this-first)).
- [ ] `npm run build` completes with no errors, and `npm run preview` looks right.
- [ ] Nothing private is in the repo: the Instagram export was deleted and `assets/`, `.env`, `node_modules/`, `dist/` and the generated photo variants are git-ignored. (`git ls-files` lists what would be pushed.)

## Contact form key

The form needs a free access key from Web3Forms; without one it simply opens the visitor's email app with the message pre-filled (still works).
1. Go to https://web3forms.com, enter the email address that should receive messages, and they email you an **Access Key**.
2. Locally: copy `.env.example` to `.env` and set `PUBLIC_WEB3FORMS_KEY=your-key`. Restart `npm run dev`. Send a test message from any style's contact form.
3. For the published site: GitHub repo -> **Settings -> Secrets and variables -> Actions -> New repository secret**, name `PUBLIC_WEB3FORMS_KEY`, paste the key. The workflow passes it to the build.
Notes: the key ends up in the page's JavaScript (it has to - the browser sends the form). That is normal for this kind of service, but use a key dedicated to this site.
This form submission is the only request that ever leaves your site, and only when someone presses Send. Service limits/pricing are Web3Forms' own; check their site.

## Publish to GitHub Pages

1. **Repository**: for the address `https://abhishekkumar11724.github.io` the repository must be named exactly `abhishekkumar11724.github.io` under your account.
   If it already exists with old content, back that up first (pushing this project to it replaces the site).
2. **Connect and push** (from this project folder):
   ```bash
   git remote add origin git@github.com:abhishekkumar11724/abhishekkumar11724.github.io.git     # or the https:// URL
   git push -u origin main
   ```
   (The workflow triggers on branch `main`, which is what this repo uses.) If the remote already has commits you must decide how to combine or replace them - do not force-push over something you want to keep.
3. **Enable Pages**: repository **Settings -> Pages -> Build and deployment -> Source: GitHub Actions**.
4. **Watch the build**: repository **Actions** tab -> "Deploy to GitHub Pages". The first run renders all photo variants (roughly 10+ minutes; an estimate), later runs reuse a cache and are much faster.
   The cache is keyed on `photos/`, every `recipe.mjs`, `scripts/fx/index.mjs`, `scripts/build-images.mjs` and `src/content/photos.ts`, so editing text-only content stays fast.
5. Open `https://abhishekkumar11724.github.io/`. It should redirect to today's style.

**Updating later**: edit, `npm run build` to check, commit, `git push`. The workflow redeploys. The daily change needs no redeploy.

## Test the production build locally
```bash
npm run build      # writes dist/ (about 280 MB, mostly photo variants)
npm run preview    # http://localhost:4321/
```

## Custom domain or a sub-path
- **Custom domain** (e.g. `abhishek.dev`): create `public/CNAME` containing just the domain, set `site: 'https://abhishek.dev'` in `astro.config.mjs` (used for link-preview tags and canonical links),
  point the DNS as GitHub's Pages documentation describes, and tick **Enforce HTTPS** in Settings -> Pages.
- **Hosted under a sub-path** (a project site like `user.github.io/portfolio/`): set `base: '/portfolio/'` and `site` in `astro.config.mjs`. All internal links go through `withBase()`, so they follow.

## Other hosts (Netlify, Vercel, Cloudflare Pages...)
Any static host works: build command `npm run build`, publish directory `dist`, Node `22.23.4` or newer, and add `PUBLIC_WEB3FORMS_KEY` as an environment variable.
These hosts don't use the GitHub Actions cache, so every build re-renders photos unless their build cache keeps `public/generated` and `src/generated/manifest`.

## Size and limits
- The published site is about 280 MB (19 styles x 60 photos, each in two sizes). A visitor downloads only one style: about 1.4-4.5 MB of photo thumbnails for most styles, De Stijl about 10 MB (see the limitations doc).
- GitHub documents soft limits for Pages (a recommended maximum published-site size of 1 GB and a monthly bandwidth guideline); check GitHub's current Pages limits page if traffic grows.
