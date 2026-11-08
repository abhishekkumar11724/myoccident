import fs from 'node:fs';
import path from 'node:path';
import { THEMES, type ThemeInfo } from './order';

// Which themes actually exist on disk (a Page.astro + its own route file). Uses the filesystem, NOT import.meta.glob:
// globbing Page.astro files would pull every theme's CSS into every page's bundle.
// Optional env PF_ONLY=id1,id2 narrows this for fast, isolated dev of just the theme(s) you are working on.
const themesDir = path.resolve(process.cwd(), 'src/themes');
const only = (process.env.PF_ONLY ?? '').split(',').map((s) => s.trim()).filter(Boolean);

export const builtIds: string[] = THEMES.map((t) => t.id)
  .filter((id) => fs.existsSync(path.join(themesDir, id, 'Page.astro')) && fs.existsSync(path.resolve(process.cwd(), `src/pages/s/${id}/index.astro`)))
  .filter((id) => !only.length || only.includes(id));

export const builtThemes: ThemeInfo[] = THEMES.filter((t) => builtIds.includes(t.id));

export interface StyleCredit { name: string; kind: 'font' | 'image' | 'icon' | 'texture' | 'svg' | 'code' | 'reference'; license: string; url?: string; note?: string }
export interface ThemeMeta {
  id: string;
  /** colours used on the gallery card + UtilityBar accents */
  palette: { bg: string; fg: string; accent: string; accent2?: string };
  fonts: string[];
  /** "About this style" panel */
  about: {
    origin: string;            // 2-4 sentences: where the style comes from
    traits: string[];          // 4-6 defining traits
    inThisSite: string;        // 1-3 sentences: how THIS site interprets it
    furtherReading?: { label: string; url: string }[];
  };
  /** a short flavour line per theme (never contains facts) */
  flavor: { kicker: string; tagline: string; footer: string };
  credits: StyleCredit[];
}
// Lazy on purpose: an isolated dev server (PF_ONLY) must never import another theme's half-written files.
const metas = import.meta.glob('./*/meta.ts', { import: 'default' }) as Record<string, () => Promise<ThemeMeta>>;
export const themeMeta = async (id: string): Promise<ThemeMeta | undefined> => {
  const load = metas[`./${id}/meta.ts`];
  return load ? await load() : undefined;
};
