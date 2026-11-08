import fs from 'node:fs';
import path from 'node:path';
import { photoMeta, categoryInfo, categoryOrder, type PhotoMeta } from '@/content/photos';
import { withBase } from './urls';

interface Entry { src: string; thumb: string; w: number; h: number; tw: number; th: number; treatment: string }
interface Manifest { style: string; photos: Record<string, Entry> }

// Read manifests from disk (cached by mtime) instead of import.meta.glob: a glob would put EVERY theme's manifest
// into the module graph, so rebuilding one theme's images would reload every other theme's dev server.
const dir = path.resolve(process.cwd(), 'src/generated/manifest');
const cache = new Map<string, { mtime: number; data: Manifest }>();
function manifest(style: string): Manifest | undefined {
  const f = path.join(dir, `${style}.json`);
  try {
    const mtime = fs.statSync(f).mtimeMs;
    const hit = cache.get(f);
    if (hit && hit.mtime === mtime) return hit.data;
    const data = JSON.parse(fs.readFileSync(f, 'utf8')) as Manifest;
    cache.set(f, { mtime, data });
    return data;
  } catch { return undefined; }
}

export interface Variant { src: string; thumb: string; width: number; height: number; thumbWidth: number; thumbHeight: number }
export interface Photo extends Required<Pick<PhotoMeta, 'alt'>> {
  id: string; category: string; name: string; caption?: string; tags: string[]; focus: string;
  /** this theme's art-treated version (falls back to the original if the style has not been built) */
  img: Variant;
  /** the untouched photo (for "Clean view" / hover reveals) */
  original: Variant;
  orientation: 'portrait' | 'landscape' | 'square';
}
const toVariant = (e: Entry): Variant => ({ src: withBase(e.src), thumb: withBase(e.thumb), width: e.w, height: e.h, thumbWidth: e.tw, thumbHeight: e.th });

/** All photos for a style, in a stable order (category order, then filename). */
export function photos(style: string): Photo[] {
  const orig = manifest('_original')?.photos ?? {};
  const mine = manifest(style)?.photos ?? {};
  const out: Photo[] = Object.keys(orig).map((id) => {
    const [category, ...rest] = id.split('/');
    const m = photoMeta[id];
    const o = toVariant(orig[id]);
    const v = mine[id] ? toVariant(mine[id]) : o;
    const orientation = o.width > o.height * 1.05 ? 'landscape' : o.height > o.width * 1.05 ? 'portrait' : 'square';
    return { id, category, name: rest.join('/'), alt: m?.alt ?? rest.join('/').replace(/^\d+-/, '').replace(/-/g, ' '), caption: m?.caption, tags: m?.tags ?? [], focus: m?.focus ?? 'center', img: v, original: o, orientation };
  });
  const ci = (c: string) => { const i = categoryOrder.indexOf(c); return i < 0 ? 99 : i; };
  return out.sort((a, b) => ci(a.category) - ci(b.category) || a.id.localeCompare(b.id));
}
export function photo(style: string, id: string): Photo {
  const p = photos(style).find((x) => x.id === id);
  if (!p) throw new Error(`Unknown photo "${id}". Available: ${photos(style).map((x) => x.id).join(', ')}`);
  return p;
}
export const photosIn = (style: string, category: string) => photos(style).filter((p) => p.category === category);
export const photosTagged = (style: string, tag: string) => photos(style).filter((p) => p.tags.includes(tag));
/** Groups for a "Beyond code" section, in display order, empty groups removed. */
export function photoGroups(style: string) {
  const all = photos(style);
  return categoryOrder.map((c) => ({ category: c, ...(categoryInfo[c] ?? { title: c, blurb: '' }), photos: all.filter((p) => p.category === c) })).filter((g) => g.photos.length);
}
/** Main portraits suitable for a hero, best first. */
export const heroPhotos = (style: string) => photosTagged(style, 'hero');
export { categoryInfo, categoryOrder };
