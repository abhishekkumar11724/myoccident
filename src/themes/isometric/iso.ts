/**
 * Tiny isometric engine (build time only - it emits inline SVG strings).
 *
 * World axes: +x runs right-and-down at 30 deg, +y runs left-and-down at 30 deg, +z is straight up.
 *   screen.x = (x - y) * cos30 * u        screen.y = (x + y) * sin30 * u - z * u
 * The viewer looks from (+x, +y, +z): the three visible faces of a box are
 *   top (z+)  = lightest,  "left" (+y normal) = mid,  "right" (+x normal) = darkest.   Light comes from the upper left of the screen.
 * Painter's algorithm: items are ordered by a topological sort on separating planes (an item whose min-x/min-y/min-z
 * lies beyond another's max is "in front" of it), falling back to min-corner sum.
 */
export const C = Math.cos(Math.PI / 6);
const r1 = (n: number) => Math.round(n * 10) / 10;

export interface Pal { t: string; l: string; r: string }
export const PAL: Record<string, Pal> = {
  blue: { t: '#86a8ff', l: '#4f7cff', r: '#2f52c9' },
  sky: { t: '#c4d8ff', l: '#9dbbff', r: '#7898ec' },
  amber: { t: '#ffd480', l: '#ffb547', r: '#d9871b' },
  teal: { t: '#74e3d2', l: '#2cc3ad', r: '#1b9482' },
  pink: { t: '#ff9fc2', l: '#ff6fa3', r: '#d44683' },
  navy: { t: '#4a5a8c', l: '#2e3a66', r: '#1d2547' },
  ink: { t: '#2e3a66', l: '#1d2547', r: '#121830' },
  white: { t: '#ffffff', l: '#eef3ff', r: '#cdd9f0' },
  wallA: { t: '#ffffff', l: '#dfe8ff', r: '#c2d2f6' },
  slate: { t: '#e7eefc', l: '#c3d0ec', r: '#a3b4da' },
  rock: { t: '#c6d3f0', l: '#8ea3d4', r: '#6a80b8' },
  wood: { t: '#f3cd9b', l: '#dca56b', r: '#b97f47' },
  leaf: { t: '#8be39a', l: '#3fb86a', r: '#2a8f52' },
  skin: { t: '#fbd5b0', l: '#efb688', r: '#d3976b' },
  red: { t: '#ff9d8c', l: '#ff6b57', r: '#d1463a' },
  violet: { t: '#c4aeff', l: '#9a7cf5', r: '#7255d1' },
  gold: { t: '#ffe69a', l: '#ffcf4d', r: '#e0a512' },
  glass: { t: '#d9f4ff', l: '#a8e0fa', r: '#7ec8ee' },
};

type P3 = [number, number, number];
type Bbox = [number, number, number, number, number, number];
interface Item { b: Bbox; svg: string; layer: string }
export interface Opts { cls?: string; style?: string; faces?: boolean; layer?: string }

const EPS = 1e-4;
const front = (a: Bbox, b: Bbox) => a[0] >= b[3] - EPS || a[1] >= b[4] - EPS || a[2] >= b[5] - EPS; // a is nearer the viewer than b

function order(items: Item[]): Item[] {
  const its = [...items].sort((p, q) => p.b[0] + p.b[1] + p.b[2] - (q.b[0] + q.b[1] + q.b[2]));
  const n = its.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const fi = front(its[i].b, its[j].b), fj = front(its[j].b, its[i].b);
    if (fi && !fj) { adj[j].push(i); indeg[i]++; } else if (fj && !fi) { adj[i].push(j); indeg[j]++; }
  }
  const out: Item[] = [], done = new Array(n).fill(false);
  for (let k = 0; k < n; k++) {
    let pick = -1;
    for (let i = 0; i < n; i++) if (!done[i] && indeg[i] === 0) { pick = i; break; }
    if (pick < 0) for (let i = 0; i < n; i++) if (!done[i]) { pick = i; break; } // cycle: fall back to key order
    done[pick] = true; out.push(its[pick]);
    for (const m of adj[pick]) indeg[m]--;
  }
  return out;
}

function hull(pts: [number, number][]): [number, number][] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: [number, number][] = [], up: [number, number][] = [];
  for (const q of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...p].reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

export interface Rendered { html: string; vb: { x: number; y: number; w: number; h: number }; rel: (x: number, y: number, z: number) => { x: number; y: number }; u: number }

export class Scene {
  u: number;
  private back = new Map<string, string[]>();
  private items: Item[] = [];
  private minX = 1e9; private minY = 1e9; private maxX = -1e9; private maxY = -1e9;
  private layerOrder: string[] = [];
  cur = 'main';
  constructor(u = 40) { this.u = u; this.useLayer('main'); }

  useLayer(name: string) { this.cur = name; if (!this.layerOrder.includes(name)) this.layerOrder.push(name); return this; }

  /** screen coords of a world point (tracks bounds) */
  P(x: number, y: number, z: number): [number, number] {
    const sx = (x - y) * C * this.u, sy = (x + y) * 0.5 * this.u - z * this.u;
    if (sx < this.minX) this.minX = sx; if (sx > this.maxX) this.maxX = sx;
    if (sy < this.minY) this.minY = sy; if (sy > this.maxY) this.maxY = sy;
    return [sx, sy];
  }
  private d(pts: P3[]) { return pts.map((p, i) => { const [x, y] = this.P(...p); return `${i ? 'L' : 'M'}${r1(x)} ${r1(y)}`; }).join('') + 'Z'; }
  private path(pts: P3[], fill: string, cls = '') { return `<path${cls ? ` class="${cls}"` : ''} d="${this.d(pts)}" fill="${fill}" stroke="${fill}"/>`; }
  private add(b: Bbox, svg: string, o?: Opts) {
    const wrapped = o?.cls || o?.style ? `<g${o.cls ? ` class="${o.cls}"` : ''}${o.style ? ` style="${o.style}"` : ''}>${svg}</g>` : svg;
    this.items.push({ b, svg: wrapped, layer: o?.layer ?? this.cur });
  }
  private addBack(svg: string, layer = this.cur) { if (!this.back.has(layer)) this.back.set(layer, []); this.back.get(layer)!.push(svg); }

  /** axis-aligned box with its min corner at (x,y,z) and size w (x) d (y) h (z) */
  box(x: number, y: number, z: number, w: number, d: number, h: number, pal: Pal, o?: Opts) {
    const x1 = x + w, y1 = y + d, z1 = z + h, f = o?.faces;
    const svg =
      this.path([[x, y1, z], [x1, y1, z], [x1, y1, z1], [x, y1, z1]], pal.l, f ? 'fl' : '') +
      this.path([[x1, y, z], [x1, y1, z], [x1, y1, z1], [x1, y, z1]], pal.r, f ? 'fr' : '') +
      this.path([[x, y, z1], [x1, y, z1], [x1, y1, z1], [x, y1, z1]], pal.t, f ? 'ft' : '');
    this.add([x, y, z, x1, y1, z1], svg, o);
  }

  /** upright cylinder, centre (cx,cy), radius r */
  cyl(cx: number, cy: number, z: number, r: number, h: number, pal: Pal, o?: Opts) {
    const u = this.u, rx = 1.2247 * r * u, ry = 0.7071 * r * u;
    const [tx, ty] = this.P(cx, cy, z + h), [, by] = this.P(cx, cy, z);
    this.P(cx - r, cy - r, z); this.P(cx + r, cy + r, z + h); this.P(cx - r, cy + r, z); this.P(cx + r, cy - r, z);
    const f = o?.faces;
    const svg =
      `<path${f ? ' class="fl"' : ''} d="M${r1(tx - rx)} ${r1(ty)}L${r1(tx - rx)} ${r1(by)}A${r1(rx)} ${r1(ry)} 0 0 0 ${r1(tx)} ${r1(by + ry)}L${r1(tx)} ${r1(ty)}Z" fill="${pal.l}" stroke="${pal.l}"/>` +
      `<path${f ? ' class="fr"' : ''} d="M${r1(tx)} ${r1(ty)}L${r1(tx)} ${r1(by + ry)}A${r1(rx)} ${r1(ry)} 0 0 0 ${r1(tx + rx)} ${r1(by)}L${r1(tx + rx)} ${r1(ty)}Z" fill="${pal.r}" stroke="${pal.r}"/>` +
      `<ellipse${f ? ' class="ft"' : ''} cx="${r1(tx)}" cy="${r1(ty)}" rx="${r1(rx)}" ry="${r1(ry)}" fill="${pal.t}" stroke="${pal.t}"/>`;
    this.add([cx - r, cy - r, z, cx + r, cy + r, z + h], svg, o);
  }

  /** four-sided pyramid (low-poly tree, roof, spire) */
  pyr(x: number, y: number, z: number, w: number, d: number, h: number, pal: Pal, o?: Opts) {
    const ax = x + w / 2, ay = y + d / 2, az = z + h;
    const svg =
      this.path([[x, y + d, z], [x + w, y + d, z], [ax, ay, az]], pal.l) +
      this.path([[x + w, y, z], [x + w, y + d, z], [ax, ay, az]], pal.r);
    this.add([x, y, z, x + w, y + d, az], svg, o);
  }

  /** steps rising towards +x (dir 'x') or +y (dir 'y'); total height h */
  stairs(x: number, y: number, z: number, w: number, d: number, h: number, n: number, dir: 'x' | 'y', pal: Pal, o?: Opts) {
    for (let i = 0; i < n; i++) {
      const hh = (h * (i + 1)) / n;
      if (dir === 'x') this.box(x + (w * i) / n, y, z, w / n, d, hh, pal, o);
      else this.box(x, y + (d * i) / n, z, w, d / n, hh, pal, o);
    }
  }

  /** flat polygon in 3D (decals, screens, windows, leaves) */
  poly(pts: P3[], fill: string, o?: Opts & { stroke?: string; sw?: number; opacity?: number }) {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), zs = pts.map((p) => p[2]);
    const op = o?.opacity !== undefined ? ` opacity="${o.opacity}"` : '';
    const st = o?.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 1}" stroke-linejoin="round"` : ` stroke="${fill}"`;
    const svg = `<path${o?.faces ? ' class="ft"' : ''} d="${this.d(pts)}" fill="${fill}"${st}${op}/>`;
    this.add([Math.min(...xs), Math.min(...ys), Math.min(...zs), Math.max(...xs) + 0.01, Math.max(...ys) + 0.01, Math.max(...zs) + 0.01], svg, o);
  }
  /** rectangle on the plane x = c (spans y0..y1 and z0..z1), e.g. the inner face of the left wall */
  quadX(c: number, y0: number, y1: number, z0: number, z1: number, fill: string, o?: Opts & { opacity?: number }) {
    this.poly([[c, y0, z0], [c, y1, z0], [c, y1, z1], [c, y0, z1]], fill, o);
  }
  /** rectangle on the plane y = c (spans x0..x1 and z0..z1), e.g. the inner face of the right wall */
  quadY(c: number, x0: number, x1: number, z0: number, z1: number, fill: string, o?: Opts & { opacity?: number }) {
    this.poly([[x0, c, z0], [x1, c, z0], [x1, c, z1], [x0, c, z1]], fill, o);
  }
  /** rectangle on the plane z = c */
  quadZ(c: number, x0: number, x1: number, y0: number, y1: number, fill: string, o?: Opts & { opacity?: number }) {
    this.poly([[x0, y0, c], [x1, y0, c], [x1, y1, c], [x0, y1, c]], fill, o);
  }
  /** circle/disc lying in a plane: 'x' => plane x=c (a=y,b=z), 'y' => plane y=c (a=x,b=z), 'z' => plane z=c (a=x,b=y) */
  disc(plane: 'x' | 'y' | 'z', c: number, a: number, b: number, r: number, fill: string, o?: Opts & { n?: number; opacity?: number; ry?: number }) {
    const n = o?.n ?? 26, ry = o?.ry ?? r;
    const pts: P3[] = Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2, da = Math.cos(t) * r, db = Math.sin(t) * ry;
      return plane === 'x' ? [c, a + da, b + db] : plane === 'y' ? [a + da, c, b + db] : [a + da, b + db, c];
    });
    this.poly(pts, fill, o);
  }
  /** straight line / dashed connector between two world points */
  line(p: P3, q: P3, stroke: string, w = 2, o?: Opts & { dash?: string; cap?: string; opacity?: number }) {
    const [x1, y1] = this.P(...p), [x2, y2] = this.P(...q);
    const svg = `<path d="M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="${o?.cap ?? 'round'}"${o?.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o?.opacity !== undefined ? ` opacity="${o.opacity}"` : ''}/>`;
    const e = 0.02;
    this.add([Math.min(p[0], q[0]), Math.min(p[1], q[1]), Math.min(p[2], q[2]), Math.max(p[0], q[0]) + e, Math.max(p[1], q[1]) + e, Math.max(p[2], q[2]) + e], svg, o);
  }
  /** arbitrary SVG added to the sorted list with a given bbox (screen-space helper via this.P) */
  raw(b: Bbox, svg: string, o?: Opts) { this.add(b, svg, o); }

  /** soft flat contact shadow on the plane z (light from the upper left => shadow falls to the right) */
  shadow(x: number, y: number, w: number, d: number, h: number, z = 0, op = 0.16) {
    const sx = h * 0.55, sy = -h * 0.22;
    const pts: [number, number][] = [];
    for (const [px, py] of [[x, y], [x + w, y], [x + w, y + d], [x, y + d], [x + sx, y + sy], [x + w + sx, y + sy], [x + w + sx, y + d + sy], [x + sx, y + d + sy]]) pts.push(this.P(px, py, z));
    const hp = hull(pts);
    this.addBack(`<path d="${hp.map((p, i) => `${i ? 'L' : 'M'}${r1(p[0])} ${r1(p[1])}`).join('')}Z" fill="#1c2f78" opacity="${op}"/>`);
  }

  /** flat decal in the back layer (rugs, floor markings) */
  flat(pts: P3[], fill: string, opacity = 1) { this.addBack(`<path d="${this.d(pts)}" fill="${fill}" stroke="${fill}"${opacity < 1 ? ` opacity="${opacity}"` : ''}/>`); }
  flatRect(x0: number, x1: number, y0: number, y1: number, fill: string, z = 0, opacity = 1) { this.flat([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], fill, opacity); }

  /** checkerboard floor (drawn in the back layer) */
  floor(x: number, y: number, w: number, d: number, nx: number, ny: number, c1: string, c2: string, z = 0) {
    const a: string[] = [], b: string[] = [];
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const x0 = x + (w * i) / nx, x1 = x + (w * (i + 1)) / nx, y0 = y + (d * j) / ny, y1 = y + (d * (j + 1)) / ny;
      ((i + j) % 2 ? b : a).push(this.d([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]));
    }
    this.addBack(`<path d="${a.join('')}" fill="${c1}" stroke="${c1}"/><path d="${b.join('')}" fill="${c2}" stroke="${c2}"/>`);
  }

  /** a floating island: inverted-pyramid underside + slab sides (back layer) + optional checker top */
  island(x: number, y: number, w: number, d: number, o: { thick?: number; depth?: number; tiles?: [number, number]; top?: [string, string]; side?: Pal; rock?: Pal } = {}) {
    const th = o.thick ?? 0.7, dp = o.depth ?? 2, side = o.side ?? PAL.slate, rock = o.rock ?? PAL.rock, tiles = o.tiles ?? [Math.round(w), Math.round(d)];
    const x1 = x + w, y1 = y + d, zb = -th, ax = x + w / 2, ay = y + d / 2;
    this.addBack(
      this.path([[x, y1, zb], [x1, y1, zb], [ax, ay, zb - dp]], rock.l) +
      this.path([[x1, y, zb], [x1, y1, zb], [ax, ay, zb - dp]], rock.r) +
      this.path([[x, y1, zb], [x1, y1, zb], [x1, y1, 0], [x, y1, 0]], side.l) +
      this.path([[x1, y, zb], [x1, y1, zb], [x1, y1, 0], [x1, y, 0]], side.r) +
      this.path([[x, y, 0], [x1, y, 0], [x1, y1, 0], [x, y1, 0]], side.t),
    );
    if (o.top) this.floor(x, y, w, d, tiles[0], tiles[1], o.top[0], o.top[1], 0);
  }

  /** emit the finished <svg> */
  render(o: { pad?: number; cls?: string; title?: string; padL?: number; padR?: number; padT?: number; padB?: number; layers?: string[]; fixed?: { x: number; y: number; w: number; h: number } } = {}): Rendered {
    const pad = o.pad ?? 6;
    const x = this.minX - (o.padL ?? pad), y = this.minY - (o.padT ?? pad);
    const w = this.maxX - this.minX + (o.padL ?? pad) + (o.padR ?? pad), h = this.maxY - this.minY + (o.padT ?? pad) + (o.padB ?? pad);
    const vb = o.fixed ?? { x: r1(x), y: r1(y), w: r1(w), h: r1(h) };
    const body = this.layerOrder.filter((ly) => !o.layers || o.layers.includes(ly)).map((ly) => {
      const its = this.items.filter((i) => i.layer === ly);
      const inner = (this.back.get(ly) ?? []).join('') + order(its).map((i) => i.svg).join('');
      return ly === 'main' ? `<g class="ly" data-ly="main">${inner}</g>` : `<g class="ly" data-ly="${ly}">${inner}</g>`;
    }).join('');
    const html = `<svg class="iso${o.cls ? ' ' + o.cls : ''}" viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}" width="${Math.round(vb.w)}" height="${Math.round(vb.h)}" aria-hidden="true" focusable="false">${body}</svg>`;
    return { html, vb, u: this.u, rel: (px, py, pz) => { const sx = (px - py) * C * this.u, sy = (px + py) * 0.5 * this.u - pz * this.u; return { x: (sx - vb.x) / vb.w, y: (sy - vb.y) / vb.h }; } };
  }
}

/** Tiny standalone icon: one cube in a palette (used for bullets / section headers). */
export function cubeSvg(pal: Pal, size = 28, cls = '') {
  const s = new Scene(size / 2.6);
  s.box(0, 0, 0, 1, 1, 1, pal);
  return s.render({ pad: 0.5, cls: `ico ${cls}` }).html;
}
