#!/usr/bin/env node
/**
 * Image pipeline: photos/**  x  src/themes/<style>/recipe.mjs  ->  public/generated/<style>/**
 *
 *   npm run images                      # every style, only what changed
 *   npm run images -- --style glitch    # one (or comma-separated) style(s)
 *   npm run images -- --photo portraits/01-selfie-maroon --force
 *
 * Replace/add/remove any file in photos/ and re-run: all themes pick it up. Results are cached by a hash of
 * (photo bytes + recipe file + fx library version), so unchanged work is skipped.
 *
 * recipe.mjs contract (default export):
 *   {
 *     maxSize: 1400, thumb: 520, quality: 82, format: 'webp' | 'png' | 'jpeg',
 *     treatments: { name: (fx, ctx) => fx.chain()... },       // fx is queued; return it (or await fx.run())
 *     pick: (ctx) => 'name',                                  // optional; default 'default'
 *   }
 *   ctx = { id, category, name, tags, alt, width, height, orientation, seed, rng, style }   (tags come from src/content/photos.ts)
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { Fx, FX_VERSION, hashString } from './fx/index.mjs';
import sharp from 'sharp';
import { photoMeta } from '../src/content/photos.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PHOTOS = path.join(ROOT, 'photos');
const THEMES = path.join(ROOT, 'src/themes');
const OUT = path.join(ROOT, 'public/generated');
const MANIFESTS = path.join(ROOT, 'src/generated/manifest');
const fxVersionHash = crypto.createHash('sha1').update(fs.readFileSync(path.join(ROOT, 'scripts/fx/index.mjs'))).digest('hex').slice(0, 10);

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const onlyStyles = (opt('style') || process.env.PF_ONLY || '').split(',').map((s) => s.trim()).filter(Boolean);
const onlyPhoto = opt('photo');
const force = flag('force');
const quiet = flag('quiet');
const log = (...a) => { if (!quiet) console.log(...a); };

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(webp|jpe?g|png)$/i.test(e.name)) yield p;
  }
}

const sha = (buf) => crypto.createHash('sha1').update(buf).digest('hex').slice(0, 12);

async function listPhotos() {
  const out = [];
  for (const file of walk(PHOTOS)) {
    const rel = path.relative(PHOTOS, file).split(path.sep).join('/');
    const id = rel.replace(/\.[^.]+$/, '');
    if (onlyPhoto && id !== onlyPhoto) continue;
    const [category, ...rest] = id.split('/');
    const bytes = fs.readFileSync(file);
    const meta = await sharp(bytes).rotate().metadata();
    const w = meta.autoOrient?.width ?? meta.width, h = meta.autoOrient?.height ?? meta.height;
    const pm = photoMeta[id] || {};
    out.push({ id, tags: pm.tags || [], alt: pm.alt || '', category: rest.length ? category : 'misc', name: rest.length ? rest.join('/') : category, file, hash: sha(bytes), width: w, height: h, orientation: w > h * 1.05 ? 'landscape' : h > w * 1.05 ? 'portrait' : 'square' });
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

const ORIGINAL = {
  maxSize: 1400, thumb: 520, quality: 84, format: 'webp',
  treatments: { default: (fx) => fx },
};

async function loadRecipe(style, recipeFile) {
  if (style === '_original') return { recipe: ORIGINAL, recipeHash: 'orig' };
  const mod = await import(pathToFileURL(recipeFile).href + `?t=${Date.now()}`);
  return { recipe: { ...ORIGINAL, ...mod.default }, recipeHash: sha(fs.readFileSync(recipeFile)) };
}

async function buildStyle(style, recipeFile, photos) {
  const { recipe, recipeHash } = await loadRecipe(style, recipeFile);
  const manPath = path.join(MANIFESTS, `${style}.json`);
  const prev = fs.existsSync(manPath) ? JSON.parse(fs.readFileSync(manPath, 'utf8')) : { photos: {} };
  const next = { style, recipe: recipeHash, fx: FX_VERSION, photos: {} };
  const ext = recipe.format === 'jpeg' ? 'jpg' : recipe.format;
  let built = 0, skipped = 0;

  const todo = [...photos];
  const worker = async () => {
    while (todo.length) {
      const p = todo.shift();
      const treatment = (recipe.pick ? recipe.pick({ ...p, style }) : 'default') || 'default';
      const key = sha(`${p.hash}|${p.tags.join(',')}|${recipeHash}|${fxVersionHash}|${treatment}|${recipe.maxSize}|${recipe.thumb}|${recipe.quality}|${recipe.format}`);
      const relFull = `generated/${style}/${p.id}.${ext}`, relThumb = `generated/${style}/${p.id}.thumb.${ext}`;
      const fullPath = path.join(ROOT, 'public', relFull), thumbPath = path.join(ROOT, 'public', relThumb);
      const old = prev.photos?.[p.id];
      if (!force && old && old.key === key && fs.existsSync(fullPath) && fs.existsSync(thumbPath)) { next.photos[p.id] = old; skipped++; continue; }
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      const seed = hashString(`${style}:${p.id}`);
      const fx = await Fx.from(p.file, { maxSize: recipe.maxSize, seed });
      const ctx = { ...p, style, seed, rng: fx.rng };
      const fn = recipe.treatments[treatment] || recipe.treatments.default;
      if (!fn) throw new Error(`${style}: no treatment "${treatment}"`);
      const res = (await fn(fx, ctx)) || fx;
      await res.run();
      const full = await res.toBuffer({ format: recipe.format, quality: recipe.quality });
      const thumb = await res.toBuffer({ format: recipe.format, quality: Math.max(60, recipe.quality - 6), width: recipe.thumb });
      fs.writeFileSync(fullPath, full); fs.writeFileSync(thumbPath, thumb);
      const tw = Math.min(recipe.thumb, res.w), th = Math.round((tw / res.w) * res.h);
      next.photos[p.id] = { key, treatment, src: relFull, thumb: relThumb, w: res.w, h: res.h, tw, th };
      built++;
    }
  };
  await Promise.all(Array.from({ length: Math.min(3, photos.length || 1) }, worker));
  // drop files of photos that no longer exist
  for (const id of Object.keys(prev.photos || {})) if (!next.photos[id] && !onlyPhoto) {
    for (const k of ['src', 'thumb']) { const f = path.join(ROOT, 'public', prev.photos[id][k]); if (fs.existsSync(f)) fs.rmSync(f); }
  }
  if (onlyPhoto) next.photos = { ...(prev.photos || {}), ...next.photos };
  fs.mkdirSync(MANIFESTS, { recursive: true });
  fs.writeFileSync(manPath, JSON.stringify(next, null, 1));
  log(`  ${style.padEnd(16)} built ${String(built).padStart(3)}  cached ${String(skipped).padStart(3)}`);
}

async function main() {
  const t0 = Date.now();
  if (!fs.existsSync(PHOTOS)) { console.error('No photos/ folder'); process.exit(1); }
  const photos = await listPhotos();
  const styles = [{ style: '_original', recipeFile: null }];
  for (const d of fs.readdirSync(THEMES, { withFileTypes: true })) {
    if (!d.isDirectory() || d.name.startsWith('_')) continue;
    const rf = path.join(THEMES, d.name, 'recipe.mjs');
    if (fs.existsSync(rf)) styles.push({ style: d.name, recipeFile: rf });
  }
  const selected = styles.filter((s) => s.style === '_original' || !onlyStyles.length || onlyStyles.includes(s.style));
  log(`images: ${photos.length} photos x ${selected.length} variants`);
  for (const s of selected) {
    try { await buildStyle(s.style, s.recipeFile, photos); }
    catch (e) { console.error(`  ${s.style}: FAILED - ${e.stack || e}`); process.exitCode = 1; }
  }
  log(`done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}
main();
