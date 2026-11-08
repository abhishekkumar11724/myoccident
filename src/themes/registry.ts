import { THEMES, type ThemeInfo } from './order';

// Which themes actually exist on disk (a Page.astro). Optional env PF_ONLY=id1,id2 narrows this for fast,
// isolated dev/build of just the theme(s) you are working on.
const pages = import.meta.glob('./*/Page.astro');
const only = (typeof process !== 'undefined' ? process.env.PF_ONLY : '')?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];

export const builtIds: string[] = THEMES.map((t) => t.id)
  .filter((id) => `./${id}/Page.astro` in pages)
  .filter((id) => !only.length || only.includes(id));

export const builtThemes: ThemeInfo[] = THEMES.filter((t) => builtIds.includes(t.id));
export const loadPage = (id: string) => pages[`./${id}/Page.astro`]() as Promise<{ default: any }>;

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
const metas = import.meta.glob('./*/meta.ts', { eager: true, import: 'default' }) as Record<string, ThemeMeta>;
export const themeMeta = (id: string): ThemeMeta | undefined => metas[`./${id}/meta.ts`];
