/**
 * De Stijl helpers: (1) block lettering built from a 5-row raster of squares (in the spirit of Van Doesburg's 1919 alphabet:
 * only horizontals and verticals, every stroke one raster unit wide), (2) tiny procedural Mondrian compositions used as project
 * thumbnails, (3) a first-fit packer that lays photos into a complete, hole-free grid mosaic.
 * Everything here is original work; no third-party glyphs.
 */

/* ------------------------------------------------------------------ block lettering */
const G: Record<string, string[]> = {
  A: ['#####', '#...#', '#####', '#...#', '#...#'],
  B: ['####.', '#...#', '####.', '#...#', '####.'],
  C: ['#####', '#....', '#....', '#....', '#####'],
  D: ['####.', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '####.', '#....', '#####'],
  F: ['#####', '#....', '####.', '#....', '#....'],
  G: ['#####', '#....', '#.###', '#...#', '#####'],
  H: ['#...#', '#...#', '#####', '#...#', '#...#'],
  I: ['###', '.#.', '.#.', '.#.', '###'],
  J: ['....#', '....#', '....#', '#...#', '#####'],
  K: ['#..#', '#.#.', '##..', '#.#.', '#..#'],
  L: ['#....', '#....', '#....', '#....', '#####'],
  M: ['#####', '#.#.#', '#.#.#', '#.#.#', '#.#.#'],
  N: ['#####', '#...#', '#...#', '#...#', '#...#'],
  O: ['#####', '#...#', '#...#', '#...#', '#####'],
  P: ['#####', '#...#', '#####', '#....', '#....'],
  Q: ['#####', '#...#', '#...#', '#..##', '#####'],
  R: ['####.', '#...#', '####.', '#..#.', '#...#'],
  S: ['#####', '#....', '#####', '....#', '#####'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#####'],
  V: ['#...#', '#...#', '#...#', '#...#', '..#..'],
  W: ['#...#', '#...#', '#.#.#', '#.#.#', '#####'],
  X: ['#...#', '.#.#.', '..#..', '.#.#.', '#...#'],
  Y: ['#...#', '#...#', '.###.', '..#..', '..#..'],
  Z: ['#####', '....#', '..#..', '#....', '#####'],
  '0': ['#####', '#...#', '#...#', '#...#', '#####'],
  '1': ['##.', '.#.', '.#.', '.#.', '###'],
  '2': ['#####', '....#', '#####', '#....', '#####'],
  '3': ['#####', '....#', '#####', '....#', '#####'],
  '4': ['#...#', '#...#', '#####', '....#', '....#'],
  '5': ['#####', '#....', '#####', '....#', '#####'],
  '6': ['#####', '#....', '#####', '#...#', '#####'],
  '7': ['#####', '....#', '....#', '....#', '....#'],
  '8': ['#####', '#...#', '#####', '#...#', '#####'],
  '9': ['#####', '#...#', '#####', '....#', '#####'],
  '-': ['...', '...', '###', '...', '...'],
};

export type Tone = 'r' | 'y' | 'b';

/** Width of a word in raster cells (letters + 1 cell gaps). */
export const blockWidth = (text: string) =>
  [...text.toUpperCase()].filter((c) => G[c]).reduce((n, c, i) => n + G[c][0].length + (i ? 1 : 0), 0);

/**
 * Block lettering as an inline SVG string. `accent` colours the middle bar (raster row 3) of the letter at that index
 * (letters only, 0-based) with --r / --y / --b. Drawn in `currentColor`. Decorative: pair it with real text for assistive tech.
 */
export function block(text: string, accent: Record<number, Tone> = {}, cls = ''): string {
  const word = [...text.toUpperCase()].filter((c) => G[c]);
  const W = blockWidth(text);
  let ink = '', col: Record<Tone, string> = { r: '', y: '', b: '' };
  let ox = 0;
  word.forEach((ch, li) => {
    const rows = G[ch];
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; ) {
        if (row[x] !== '#') { x++; continue; }
        let x1 = x; while (row[x1] === '#') x1++;
        const d = `M${ox + x} ${y}h${x1 - x}v1.04h-${x1 - x}z`; // 0.04 overlap: no hairline seams between rows
        const t = accent[li];
        if (t && y === 2) col[t] += d; else ink += d;
        x = x1;
      }
    });
    ox += rows[0].length + 1;
  });
  return `<svg class="blk ${cls}" viewBox="0 0 ${W} 5" style="--ar:${W / 5}" aria-hidden="true" focusable="false"><path d="${ink}"/>${(['r', 'y', 'b'] as Tone[]).map((t) => (col[t] ? `<path class="acc-${t}" d="${col[t]}"/>` : '')).join('')}</svg>`;
}

/* ------------------------------------------------------------------ deterministic rng */
export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ generative Mondrian thumbnail */
/** A little neoplastic composition seeded by `seed` text. Orthogonal only. Colours come from CSS classes .r .y .b .k .w .g */
export function mondrian(seed: string): string {
  const R = rng(hash(seed));
  const pick = <T,>(a: T[]) => a[Math.floor(R() * a.length)];
  const shuffle = <T,>(a: T[]) => a.map((v) => [R(), v] as const).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  const vs = shuffle([20, 31, 44, 58, 71, 82]).slice(0, 2 + Math.floor(R() * 2)).sort((a, b) => a - b);
  const hs = shuffle([18, 30, 43, 57, 70, 83]).slice(0, 2 + Math.floor(R() * 2)).sort((a, b) => a - b);
  const xs = [0, ...vs, 100], ys = [0, ...hs, 100];
  const T = 4.6; // line thickness
  type Cell = { x: number; y: number; w: number; h: number };
  const cells: Cell[] = [];
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) cells.push({ x: xs[i], y: ys[j], w: xs[i + 1] - xs[i], h: ys[j + 1] - ys[j] });
  const bySize = [...cells].sort((a, b) => b.w * b.h - a.w * a.h);
  const big = bySize.slice(0, 3), small = bySize.slice(3);
  const red = pick(big), others = shuffle([...small, ...big.filter((c) => c !== red)]);
  const blue = others[0], yellow = others[1];
  const fill = (c: Cell | undefined, cls: string) => (c ? `<rect class="${cls}" x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}"/>` : '');
  const grey = others[2] && R() > 0.5 ? others[2] : undefined;
  // vertical lines span fully; horizontal lines run from one edge to a vertical line (or fully), like the 1930 paintings
  let lines = '';
  vs.forEach((x) => { lines += `<rect x="${x - T / 2}" y="0" width="${T}" height="100"/>`; });
  hs.forEach((y) => {
    const mode = pick(['full', 'left', 'right', 'full']);
    const vx = pick(vs);
    const x0 = mode === 'right' ? vx : 0, x1 = mode === 'left' ? vx : 100;
    lines += `<rect x="${x0}" y="${y - T / 2}" width="${x1 - x0}" height="${T}"/>`;
  });
  return `<svg class="mini" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><rect class="w" width="100" height="100"/><g class="pl">${fill(grey, 'g')}${fill(red, 'r')}${fill(blue, 'b')}${fill(yellow, 'y')}</g><g class="ln">${lines}</g></svg>`;
}

/* ------------------------------------------------------------------ photo mosaic packer */
export interface Placed { x: number; y: number; w: number; h: number }
export interface Pack { items: Placed[]; header: Placed; fillers: Placed[]; rows: number }

/**
 * First-fit packing on a `cols`-wide grid. The first block (group header) is `hw` x 1. `want` gives the preferred span for each photo.
 * Remaining holes are returned as `fillers` (merged into horizontal runs) so the mosaic is always a complete rectangle.
 */
export function pack(want: { w: number; h: number }[], cols = 6, hw = 2): Pack {
  const occ: boolean[][] = [];
  const row = (r: number) => { while (occ.length <= r) occ.push(Array(cols).fill(false)); return occ[r]; };
  const fits = (x: number, y: number, w: number, h: number) => {
    if (x + w > cols) return false;
    for (let r = y; r < y + h; r++) for (let c = x; c < x + w; c++) if (row(r)[c]) return false;
    return true;
  };
  const place = (w: number, h: number): Placed => {
    for (let y = 0; ; y++) for (let x = 0; x <= cols - w; x++) if (fits(x, y, w, h)) {
      for (let r = y; r < y + h; r++) for (let c = x; c < x + w; c++) row(r)[c] = true;
      return { x, y, w, h };
    }
  };
  const header = place(hw, 1);
  const items = want.map((s) => place(s.w, s.h));
  const rows = occ.length;
  const fillers: Placed[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; ) {
      if (occ[r][c]) { c++; continue; }
      let c1 = c; while (c1 < cols && !occ[r][c1]) c1++;
      fillers.push({ x: c, y: r, w: c1 - c, h: 1 });
      c = c1;
    }
  }
  return { items, header, fillers, rows };
}

/**
 * Pick the span set (header + one span per photo) that leaves the fewest holes and crops photos least.
 * `aspects` = width / height of each photo. Deterministic: seeded by `seed`.
 */
export function bestPack(aspects: number[], seed: string, cols = 6) {
  const R = rng(hash(seed));
  const n = aspects.length;
  const opts = (a: number): { w: number; h: number; wt: number }[] =>
    a > 1.15 ? [{ w: 1, h: 1, wt: 4 }, { w: 2, h: 1, wt: 4 }, { w: 2, h: 2, wt: 2 }, { w: 3, h: 2, wt: 2 }]
    : a < 0.87 ? [{ w: 1, h: 1, wt: 4 }, { w: 1, h: 2, wt: 4 }, { w: 2, h: 2, wt: 1.5 }, { w: 2, h: 3, wt: 1.5 }]
    : [{ w: 1, h: 1, wt: 5 }, { w: 2, h: 2, wt: 2 }];
  const choose = <T extends { wt: number }>(list: T[]) => {
    let t = list.reduce((s, o) => s + o.wt, 0) * R();
    for (const o of list) { t -= o.wt; if (t <= 0) return o; }
    return list[0];
  };
  let best: { score: number; pk: Pack; want: { w: number; h: number }[]; hw: number } | null = null;
  for (let trial = 0; trial < 500; trial++) {
    const want = aspects.map((a) => { const o = choose(opts(a)); return { w: o.w, h: o.h }; });
    const pk = pack(want, cols, 2);
    let filler = 0; pk.fillers.forEach((f) => (filler += f.w * f.h));
    let crop = 0; want.forEach((s, i) => (crop += Math.abs(Math.log(s.w / s.h / aspects[i]))));
    const feature = n > 4 && want[0].w * want[0].h < 4 ? 2 : 0;
    const score = filler * 3 + crop * 1.1 + feature + pk.rows * 0.15;
    if (!best || score < best.score) best = { score, pk, want, hw: 2 };
  }
  return best!;
}
