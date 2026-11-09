/**
 * Hand-written SVG "inflated" ornaments. Each shape is stacked in four gradient layers (no SVG filters, so they are cheap
 * and can bob around): body colour (from CSS var --c), underside shade (--lo bleed), a top-left highlight, a small specular blob.
 * Gradients (#g-hi, #g-lo, #g-spec) live in the hidden sprite at the top of Page.astro.
 */
type Kind = 'star' | 'heart' | 'cloud' | 'balloon' | 'flower' | 'sparkle';

interface Def { vb: string; d: string; spec: [number, number, number, number, number]; stroke?: number; extra?: string }

const DEFS: Record<Exclude<Kind, 'sparkle'>, Def> = {
  star: {
    vb: '0 0 100 100',
    d: 'M50 12 C54 34 66 46 88 50 C66 54 54 66 50 88 C46 66 34 54 12 50 C34 46 46 34 50 12Z',
    spec: [42, 33, 7, 11, -35],
    stroke: 12,
  },
  heart: {
    vb: '0 0 100 100',
    d: 'M50 84 C22 64 12 47 16 33 C20 19 38 16 50 31 C62 16 80 19 84 33 C88 47 78 64 50 84Z',
    spec: [32, 33, 9, 6, -35],
    stroke: 8,
  },
  cloud: {
    vb: '0 0 240 130',
    d: 'M54 112 C22 112 12 82 36 70 C30 42 66 28 86 46 C96 16 142 14 156 44 C178 32 210 50 202 78 C228 80 232 112 200 112 Z',
    spec: [76, 40, 20, 8, -20],
    stroke: 6,
  },
  flower: {
    vb: '0 0 100 100',
    d: 'M50 14 C62 14 66 28 62 36 C74 30 88 38 84 50 C88 62 74 70 62 64 C66 72 62 86 50 86 C38 86 34 72 38 64 C26 70 12 62 16 50 C12 38 26 30 38 36 C34 28 38 14 50 14Z',
    spec: [38, 30, 8, 5, -35],
    stroke: 5,
  },
  balloon: {
    vb: '0 0 100 170',
    d: 'M50 6 C82 6 97 34 91 62 C86 88 66 100 50 102 C34 100 14 88 9 62 C3 34 18 6 50 6Z',
    spec: [32, 30, 9, 15, -25],
    stroke: 0,
    extra:
      '<path d="M50 104 L43 114 L57 114 Z" style="fill:var(--lo)"/><path d="M50 113 C34 128 66 142 50 168" fill="none" stroke="rgba(43,29,90,.4)" stroke-width="1.6" stroke-linecap="round"/>',
  },
};

export function deco(kind: Kind, cls = ''): string {
  if (kind === 'sparkle') {
    return `<svg class="deco deco-sparkle ${cls}" viewBox="0 0 60 60" aria-hidden="true" focusable="false"><path d="M30 2 C32 20 40 28 58 30 C40 32 32 40 30 58 C28 40 20 32 2 30 C20 28 28 20 30 2Z" fill="#fff"/></svg>`;
  }
  const s = DEFS[kind];
  const st = s.stroke ? `stroke-width="${s.stroke}" stroke-linejoin="round" stroke-linecap="round"` : '';
  const layer = (fill: string) => `<path d="${s.d}" ${st} style="fill:${fill};stroke:${s.stroke ? fill : 'none'}"/>`;
  const [cx, cy, rx, ry, rot] = s.spec;
  return (
    `<svg class="deco deco-${kind} ${cls}" viewBox="${s.vb}" aria-hidden="true" focusable="false">` +
    (s.extra ?? '') +
    layer('var(--c)') +
    layer('url(#g-lo)') +
    layer('url(#g-hi)') +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="url(#g-spec)"/>` +
    `</svg>`
  );
}
