/** All the smaller dioramas: experience floors, case-study machines, project plinths, gallery headers, skills piles, contact + writing. */
import { Scene, PAL, C, type Pal } from './iso';
import { person, desk, monitor, laptop, plant, cat, rack, crate, cloud, lamp, mug, codeLines, pine } from './props';

const NAVY = '#1d2547';
const COOL: [string, string] = ['#f8faff', '#eaf0fd'];
const WARM: [string, string] = ['#fbf1de', '#f2e4c8'];
const MINT: [string, string] = ['#f1fbf7', '#e0f4ec'];

/** island with an automatically deep-enough underside */
function isle(s: Scene, x: number, y: number, w: number, d: number, o: { top?: [string, string]; tip?: number; thick?: number } = {}) {
  const th = o.thick ?? 0.55;
  s.island(x, y, w, d, { thick: th, depth: (w + d) / 4 + (o.tip ?? 0.8), tiles: [Math.max(1, Math.round(w)), Math.max(1, Math.round(d))], top: o.top ?? COOL, side: PAL.slate, rock: PAL.rock });
}
const fin = (s: Scene, cls = 'idle', pad = 8) => s.render({ pad, cls }).html;
const px = (s: Scene, dx: number, dy: number) => ({ dx: dx * C * s.u, dy: dy * 0.5 * s.u }); // screen shift of a +x / +y move
/** conveyor belt along +x with items sliding on it */
function belt(s: Scene, x: number, y: number, z: number, len: number, items: { pal: Pal; k?: number; i?: number }[], o: { d?: number; dir?: 'x' | 'y'; cls?: string } = {}) {
  const d = o.d ?? 1.0, dir = o.dir ?? 'x';
  const body: Pal = { t: '#5b6fa6', l: '#2e3a66', r: '#1d2547' };
  if (dir === 'x') s.box(x, y, z, len, d, 0.34, body); else s.box(x, y, z, d, len, 0.34, body);
  const trav = len - 0.9;
  const sh = dir === 'x' ? { dx: trav * C * s.u, dy: trav * 0.5 * s.u } : { dx: -trav * C * s.u, dy: trav * 0.5 * s.u };
  items.forEach((it, n) => {
    const k = it.k ?? 0.55;
    const bx = dir === 'x' ? x + 0.25 : x + (d - k) / 2, by = dir === 'x' ? y + (d - k) / 2 : y + 0.25;
    s.box(bx, by, z + 0.34, k, k, k, it.pal, { cls: o.cls ?? 'hot conv', style: `--dx:${sh.dx.toFixed(1)}px;--dy:${sh.dy.toFixed(1)}px;--i:${it.i ?? n}` });
  });
}
function bot(s: Scene, x: number, y: number, z: number, pal: Pal = PAL.teal, facing: '+y' | '+x' = '+y', cls = '') {
  const o = cls ? { cls } : undefined;
  s.box(x, y, z, 0.7, 0.55, 0.5, pal, o);
  s.box(x + 0.05, y + 0.05, z + 0.5, 0.6, 0.45, 0.42, PAL.white, o);
  s.box(x + 0.3, y + 0.22, z + 0.92, 0.06, 0.06, 0.22, PAL.navy, o);
  s.box(x + 0.25, y + 0.17, z + 1.1, 0.16, 0.16, 0.16, PAL.pink, o);
  if (facing === '+y') { s.quadY(y + 0.5 + 0.01, x + 0.12, x + 0.27, z + 0.64, z + 0.78, NAVY, o); s.quadY(y + 0.5 + 0.01, x + 0.4, x + 0.55, z + 0.64, z + 0.78, NAVY, o); }
  else { s.quadX(x + 0.65 + 0.01, y + 0.1, y + 0.22, z + 0.64, z + 0.78, NAVY, o); s.quadX(x + 0.65 + 0.01, y + 0.3, y + 0.42, z + 0.64, z + 0.78, NAVY, o); }
}
/** sheet of paper standing flat on a surface (document) */
function sheet(s: Scene, x: number, y: number, z: number, w = 0.9, d = 1.1, lines = 4, o?: { cls?: string; style?: string }) {
  s.box(x, y, z, w, d, 0.05, PAL.white, o);
  for (let i = 0; i < lines; i++) s.quadZ(z + 0.052, x + 0.12, x + w - 0.12 - (i % 2) * 0.2, y + 0.14 + i * (d - 0.3) / lines, y + 0.2 + i * (d - 0.3) / lines, i === 0 ? '#4f7cff' : '#a3b4da');
}
function node(s: Scene, x: number, y: number, z: number, pal: Pal, k = 0.5, cls = '', style = '') { s.box(x, y, z, k, k, k, pal, cls || style ? { cls, style } : undefined); }
const ctr = (x: number, k: number): number => x + k / 2;
const link = (s: Scene, a: [number, number, number], b: [number, number, number], col = '#6f82b8', w = 2.4, dash = '1 6', cls?: string) => s.line(a, b, col, w, { dash, cls });

/** big arrow made of flat quads on the floor, pointing +x */
function arrowFloor(s: Scene, x: number, y: number, len: number, col: string) {
  s.flat([[x, y - 0.12, 0], [x + len - 0.3, y - 0.12, 0], [x + len - 0.3, y - 0.3, 0], [x + len, y, 0], [x + len - 0.3, y + 0.3, 0], [x + len - 0.3, y + 0.12, 0], [x, y + 0.12, 0]], col);
}

/* ================================================================ EXPERIENCE FLOORS */
export function jobScenes(): Record<string, string> {
  const out: Record<string, string> = {};

  { // Delhivery: logistics hub driven by a workflow brain
    const s = new Scene(34);
    isle(s, 0, 0, 7, 6, { top: COOL });
    s.shadow(0.4, 0.4, 1.2, 1.2, 3.2, 0, 0.12);
    rack(s, 0.4, 0.4, 0, 1.2, 1.2, 3.2); rack(s, 1.7, 0.4, 0, 1.0, 1.2, 2.2, ['#ffd480', '#74e3d2']);
    // belt carrying parcels towards a sorting gate
    belt(s, 0.6, 2.7, 0, 5.2, [{ pal: PAL.wood, i: 0 }, { pal: PAL.amber, i: 1 }, { pal: PAL.wood, i: 2 }], { cls: 'hot conv' });
    s.box(4.3, 2.4, 0.34, 0.25, 1.6, 1.3, PAL.blue); s.box(5.35, 2.4, 0.34, 0.25, 1.6, 1.3, PAL.blue); s.box(4.3, 2.4, 1.64, 1.3, 1.6, 0.25, PAL.blue);
    s.box(4.55, 2.45, 0.4, 0.5, 0.05, 0.05, PAL.amber, { cls: 'blink d1' });
    // delivery van
    s.shadow(1.2, 4.3, 2.4, 1.3, 1.3, 0, 0.14);
    s.box(1.2, 4.3, 0.35, 2.4, 1.3, 1.2, PAL.white); s.box(3.6, 4.4, 0.35, 0.8, 1.1, 0.75, PAL.blue); s.box(3.65, 4.45, 1.1, 0.7, 1.0, 0.04, PAL.glass);
    s.quadY(5.6 + 0.01, 1.4, 3.2, 0.9, 1.35, '#ff6b57'); s.quadY(5.6 + 0.01, 1.4, 2.6, 0.55, 0.75, '#c3d0ec');
    for (const wx of [1.9, 3.8]) { s.disc('y', 5.6 + 0.02, wx, 0.35, 0.34, NAVY, { n: 18 }); s.disc('y', 5.6 + 0.03, wx, 0.35, 0.14, '#c3d0ec', { n: 14 }); }
    // cloud with a node graph
    s.useLayer('top');
    cloud(s, 4.6, 0.1, 3.7, 0.8);
    const a: [number, number, number] = [5.6, 3.6, 4.4], b: [number, number, number] = [6.8, 2.9, 5.2];
    link(s, a, b); node(s, a[0] - 0.2, a[1] - 0.2, a[2] - 0.2, PAL.teal, 0.4); node(s, b[0] - 0.2, b[1] - 0.2, b[2] - 0.2, PAL.pink, 0.4);
    out.delhivery = fin(s);
  }

  { // Spyne AI: car photo studio + serverless lambda
    const s = new Scene(34);
    isle(s, 0, 0, 7, 6, { top: COOL });
    s.cyl(3.0, 3.1, 0, 1.9, 0.18, PAL.slate);
    s.shadow(1.7, 2.1, 2.7, 1.6, 1.0, 0.18, 0.14);
    // car
    s.box(1.7, 2.3, 0.18, 2.7, 1.5, 0.6, PAL.pink); s.box(2.3, 2.45, 0.78, 1.4, 1.2, 0.55, PAL.pink);
    s.quadY(3.8 + 0.0, 2.35, 3.65, 0.9, 1.25, '#bfe3ff'); s.quadX(3.7 + 0.0, 2.55, 3.55, 0.9, 1.25, '#9ccbf2');
    for (const wx of [2.2, 3.7]) { s.disc('y', 3.8 + 0.01, wx, 0.36, 0.3, NAVY, { n: 16 }); s.disc('y', 3.8 + 0.02, wx, 0.36, 0.12, '#c3d0ec', { n: 12 }); }
    // camera on tripod + softboxes
    s.cyl(5.7, 4.9, 0, 0.05, 1.5, PAL.navy); s.box(5.35, 4.55, 1.5, 0.7, 0.7, 0.5, PAL.ink); s.box(5.25, 4.65, 1.62, 0.2, 0.5, 0.26, PAL.blue);
    s.disc('y', 5.26, 5.7, 1.75, 0.18, '#7ec8ee', { n: 12 });
    s.box(0.5, 0.6, 0, 0.12, 0.12, 2.2, PAL.navy); s.box(0.35, 0.3, 1.8, 0.1, 1.1, 1.2, PAL.white, { cls: 'hot blink', style: '--i:1' });
    s.box(6.2, 0.6, 0, 0.12, 0.12, 2.2, PAL.navy); s.box(6.1, 0.3, 1.8, 0.1, 1.1, 1.2, PAL.white, { cls: 'hot blink', style: '--i:3' });
    s.useLayer('top');
    cloud(s, 3.4, 0.2, 3.4, 0.9);
    s.quadY(0.9, 3.9, 4.0, 3.95, 4.45, '#2f52c9'); // lambda glyph: two strokes
    s.line([3.95, 0.9, 4.5], [4.45, 0.9, 3.85], '#2f52c9', 3.2); s.line([4.18, 0.9, 4.1], [3.95, 0.9, 3.85], '#2f52c9', 3.2);
    out.spyne = fin(s);
  }

  { // Spyne intern: first desk, a wall-replace frame, internal tools
    const s = new Scene(34);
    isle(s, 0, 0, 6, 6, { top: WARM });
    s.box(0, 0, 0, 6, 0.3, 3.4, PAL.wallA); s.box(0, 0.3, 0, 0.3, 5.7, 3.4, PAL.wallA);
    s.box(1.9, 0.3, 1.0, 2.0, 0.1, 1.6, PAL.wood); s.quadY(0.4 + 0.1, 2.0, 3.8, 1.1, 2.5, '#bfe3ff'); s.quadY(0.52, 2.0, 3.8, 1.1, 1.6, '#7ec8ee'); s.box(2.3, 0.4, 1.6, 0.5, 0.05, 0.6, PAL.pink); s.disc('y', 0.53, 3.1, 2.1, 0.25, '#ffd480', { n: 14 });
    desk(s, 1.0, 0.3, 3.0, 1.2, 1.1);
    laptop(s, 1.5, 0.6, 1.1, 0.8, PAL.slate, '#26335e'); mug(s, 3.3, 0.9, 1.1, PAL.teal);
    s.box(2.4, 0.55, 1.1, 0.5, 0.4, 0.4, PAL.amber);
    s.cyl(2.4, 2.6, 0, 0.07, 0.45, PAL.navy); s.box(1.95, 2.15, 0.45, 0.9, 0.9, 0.12, PAL.pink); s.box(1.95, 2.95, 0.55, 0.9, 0.1, 0.9, PAL.pink);
    person(s, 2.4, 2.45, 0, '-y', { sit: true, shirt: PAL.teal, glasses: false, k: 0.88, hair: PAL.ink });
    plant(s, 5.2, 4.8, 0, 0.9, PAL.blue);
    crate(s, 0.6, 4.2, 0, 0.8, PAL.wood); crate(s, 0.7, 4.3, 0.8, 0.55, PAL.amber);
    out['spyne-intern'] = fin(s);
  }

  { // Education: campus hall with a graduation cap
    const s = new Scene(34);
    isle(s, 0, 0, 7, 6, { top: MINT });
    s.shadow(1.2, 1.2, 4.6, 3.2, 2.6, 0, 0.12);
    s.stairs(1.0, 4.2, 0, 5.0, 1.2, 0.6, 3, 'y', PAL.slate);
    s.box(1.2, 1.0, 0, 4.6, 3.2, 2.5, PAL.wallA);
    s.box(1.0, 0.9, 2.5, 5.0, 3.5, 0.3, PAL.slate); s.pyr(1.0, 0.9, 2.8, 5.0, 3.5, 1.2, PAL.red);
    for (let i = 0; i < 4; i++) s.box(1.5 + i * 1.3, 4.0, 0.6, 0.28, 0.28, 1.9, PAL.white);
    s.quadY(4.2 + 0.01, 2.0, 2.9, 0.7, 2.1, '#6f93e4'); s.quadY(4.2 + 0.01, 4.1, 5.0, 0.7, 2.1, '#6f93e4'); s.quadY(4.2 + 0.01, 3.1, 3.9, 0.6, 1.7, '#14203f');
    s.disc('y', 4.2 + 0.01, 3.5, 2.6, 0.2, '#ffd480', { n: 12 });
    s.cyl(6.4, 0.8, 0, 0.05, 3.2, PAL.navy); s.box(6.4, 0.78, 2.4, 0.8, 0.04, 0.5, PAL.amber);
    s.useLayer('top');
    s.box(2.9, 1.6, 5.1, 1.4, 1.4, 0.12, PAL.ink, { cls: 'idle' }); s.box(3.3, 2.0, 4.8, 0.6, 0.6, 0.3, PAL.navy, { cls: 'idle' });
    s.line([4.3, 1.7, 5.2], [4.5, 2.4, 4.6], '#ffb547', 2.6, { cls: 'idle' });
    out.education = fin(s);
  }
  return out;
}

/* ================================================================ CASE STUDIES */
export function caseScenes(): Record<string, string> {
  const out: Record<string, string> = {};

  { // NL -> workflow compiler: documents in, validated graph out, no LLM in the loop
    const s = new Scene(36);
    isle(s, 0, 0, 9, 5, { top: COOL });
    s.shadow(3.4, 1.0, 2.2, 2.8, 2.4, 0, 0.14);
    // input stack of SOP sheets
    for (let i = 0; i < 4; i++) sheet(s, 0.5 + (i % 2) * 0.1, 0.5 + i * 0.05, i * 0.08, 1.1, 1.3, 4);
    belt(s, 0.4, 2.0, 0, 3.2, [{ pal: PAL.white, k: 0.5, i: 0 }, { pal: PAL.white, k: 0.5, i: 1 }, { pal: PAL.white, k: 0.5, i: 2 }], { d: 0.9 });
    // compiler arch
    s.box(3.5, 1.7, 0, 0.55, 1.5, 1.7, PAL.blue); s.box(5.0, 1.7, 0, 0.55, 1.5, 1.7, PAL.blue);
    s.box(3.5, 1.7, 1.7, 2.05, 1.5, 0.7, PAL.blue); s.pyr(3.7, 1.9, 2.4, 1.65, 1.1, 0.8, PAL.amber);
    s.quadY(3.2 + 0.01, 3.62, 4.0, 0.7, 1.4, '#14203f');
    s.quadY(3.2 + 0.02, 3.7, 3.9, 1.1, 1.3, '#74e3d2', { cls: 'hot blink', style: '--i:0' }); s.quadY(3.2 + 0.02, 3.7, 3.9, 0.8, 1.0, '#ffd480', { cls: 'hot blink', style: '--i:2' });
    s.quadY(3.2 + 0.01, 4.8, 5.4, 1.85, 2.2, '#ffd480');
    // output belt with coloured results
    belt(s, 5.6, 2.0, 0, 3.2, [{ pal: PAL.teal, k: 0.5, i: 0.5 }, { pal: PAL.blue, k: 0.5, i: 1.5 }, { pal: PAL.pink, k: 0.5, i: 2.5 }], { d: 0.9 });
    // validated graph on a pad
    s.box(6.9, 3.4, 0, 1.8, 1.4, 0.12, PAL.slate);
    const A: [number, number, number] = [7.3, 3.7, 0.7], B: [number, number, number] = [8.1, 3.6, 0.7], Cc: [number, number, number] = [7.7, 4.4, 0.7];
    link(s, A, B, '#2f52c9', 2.6, '', ''); link(s, A, Cc, '#2f52c9', 2.6, '', ''); link(s, B, Cc, '#2f52c9', 2.6, '', '');
    node(s, 7.1, 3.5, 0.12, PAL.teal, 0.4, 'hot lift', '--i:0;--lift:-6px'); node(s, 7.9, 3.4, 0.12, PAL.amber, 0.4, 'hot lift', '--i:1;--lift:-6px'); node(s, 7.5, 4.2, 0.12, PAL.pink, 0.4, 'hot lift', '--i:2;--lift:-6px');
    out['nl-to-workflow-compiler'] = fin(s);
  }

  { // Workflow engine: tower of servers + parallel branches
    const s = new Scene(36);
    isle(s, 0, 0, 8, 6, { top: COOL });
    s.shadow(3.0, 1.6, 1.8, 1.8, 4.6, 0, 0.14);
    const tiers: Pal[] = [PAL.navy, PAL.blue, PAL.navy, PAL.blue, PAL.navy];
    tiers.forEach((p, i) => {
      s.box(3.0, 1.6, i * 0.95, 1.8, 1.8, 0.85, p, { cls: 'hot lift', style: `--i:${i};--lift:${-3 - i}px` });
      s.quadY(3.4 + 0.01, 3.2, 4.3, i * 0.95 + 0.25, i * 0.95 + 0.42, '#6f82b8', { cls: 'hot lift', style: `--i:${i};--lift:${-3 - i}px` });
      s.quadY(3.4 + 0.02, 4.4, 4.6, i * 0.95 + 0.3, i * 0.95 + 0.52, ['#74e3d2', '#ffd480', '#ff9fc2'][i % 3], { cls: 'hot blink', style: `--i:${i}` });
    });
    s.box(3.5, 2.1, 4.75, 0.8, 0.8, 0.2, PAL.amber);
    // smaller racks
    rack(s, 6.2, 0.5, 0, 1.0, 1.1, 2.2); rack(s, 0.5, 0.4, 0, 1.0, 1.1, 1.6, ['#74e3d2', '#ff9fc2']);
    // canvas graph with parallel branches (floor pads + links)
    s.box(0.4, 3.8, 0, 2.4, 1.8, 0.1, PAL.slate);
    const p0: [number, number, number] = [0.8, 4.7, 0.55], p1: [number, number, number] = [1.6, 4.1, 0.55], p2: [number, number, number] = [1.6, 5.2, 0.55], p3: [number, number, number] = [2.4, 4.7, 0.55];
    link(s, p0, p1, '#2f52c9', 2.6, ''); link(s, p0, p2, '#2f52c9', 2.6, ''); link(s, p1, p3, '#2f52c9', 2.6, ''); link(s, p2, p3, '#2f52c9', 2.6, '');
    node(s, 0.55, 4.45, 0.1, PAL.teal, 0.5); node(s, 1.35, 3.85, 0.1, PAL.blue, 0.5, 'hot lift', '--i:0;--lift:-5px'); node(s, 1.35, 4.95, 0.1, PAL.blue, 0.5, 'hot lift', '--i:1;--lift:-5px'); node(s, 2.15, 4.45, 0.1, PAL.amber, 0.5);
    // pause bars (pause / resume node)
    s.box(5.4, 4.6, 0, 0.18, 0.18, 0.9, PAL.pink); s.box(5.8, 4.6, 0, 0.18, 0.18, 0.9, PAL.pink);
    out['workflow-engine'] = fin(s);
  }

  { // MCP & agent platform: OpenAPI spec -> MCP server hub -> tools & agents
    const s = new Scene(36);
    isle(s, 0, 0, 8, 6, { top: COOL });
    sheet(s, 0.6, 2.2, 0, 1.3, 1.6, 5);
    s.disc('z', 0.06, 1.2, 3.0, 0.0, '#fff');
    s.box(0.6, 3.9, 0, 1.3, 0.35, 0.1, PAL.slate);
    arrowFloor(s, 2.1, 3.0, 1.2, '#ffb547');
    s.shadow(3.6, 2.1, 1.6, 1.6, 1.8, 0, 0.14);
    s.box(3.6, 2.1, 0, 1.6, 1.6, 1.8, PAL.blue); s.box(3.75, 2.25, 1.8, 1.3, 1.3, 0.25, PAL.amber);
    s.quadY(3.7 + 0.01, 3.8, 5.0, 0.5, 1.4, '#14203f'); s.quadY(3.7 + 0.02, 3.95, 4.8, 1.05, 1.2, '#74e3d2'); s.quadY(3.7 + 0.02, 3.95, 4.5, 0.75, 0.9, '#9dbbff');
    const hub: [number, number, number] = [4.4, 2.9, 0.4];
    const tools: [number, number, Pal][] = [[6.3, 0.7, PAL.teal], [6.6, 2.4, PAL.pink], [6.0, 4.1, PAL.amber], [3.6, 4.6, PAL.violet], [1.6, 0.5, PAL.teal], [4.8, 0.2, PAL.pink]];
    tools.forEach(([tx, ty, pal], i) => { link(s, hub, [tx + 0.3, ty + 0.3, 0.3], '#6f82b8', 2.4, '2 6'); node(s, tx, ty, 0, pal, 0.6, 'hot lift', `--i:${i};--lift:-7px`); });
    bot(s, 5.7, 3.2, 0, PAL.teal, '+y', 'hot lift');
    out['mcp-agent-platform'] = fin(s);
  }

  { // Multi-agent retrieval: dashboards + a searching bot + hybrid result list
    const s = new Scene(36);
    isle(s, 0, 0, 8, 6, { top: COOL });
    const graph = (c: number, a0: number, a1: number, z0: number, z1: number) => {
      s.quadY(c, a0 + 0.1, a0 + 0.3, z0 + 0.1, z0 + 0.5, '#74e3d2'); s.quadY(c, a0 + 0.4, a0 + 0.6, z0 + 0.1, z0 + 0.8, '#ffd480'); s.quadY(c, a0 + 0.7, a0 + 0.9, z0 + 0.1, z0 + 0.35, '#ff9fc2'); s.quadY(c, a0 + 1.0, a0 + 1.2, z0 + 0.1, z0 + 0.65, '#9dbbff');
    };
    [0.4, 2.7, 5.0].forEach((mx, i) => monitor(s, mx, 0.4, 0, 1.8, '+y', (c, a0, a1, z0, z1) => { graph(c, a0, a1, z0, z1); codeLines(s, 'y', c, a0 + 0.1, a1, z1 - 0.5, z1, ['#6f82b8', '#9dbbff'], i + 2, 0.18); }));
    // beams from dashboards to the bot
    bot(s, 3.5, 3.4, 0, PAL.blue, '+y', 'hot lift');
    [1.3, 3.6, 5.9].forEach((bx, i) => link(s, [bx, 1.2, 0.6], [3.85, 3.7, 0.9], '#ffb547', 2.6, '3 6', 'hot shine'));
    // magnifier
    s.disc('y', 4.2, 4.7, 1.55, 0.55, 'rgba(190,225,255,.55)', { n: 24, cls: 'hot lift', style: '--i:0;--lift:-5px' });
    s.line([4.4, 4.2, 1.1], [5.0, 4.2, 0.6], '#14203f', 5, { cls: 'hot lift', style: '--i:0;--lift:-5px' });
    // ranked result list
    [1.3, 1.0, 0.7].forEach((w, i) => s.box(0.6, 3.2 + i * 0.7, 0, w + 0.9, 0.5, 0.16 + (2 - i) * 0.04, [PAL.teal, PAL.amber, PAL.pink][i]));
    out['agents-retrieval'] = fin(s);
  }

  { // Reliability & observability: p99 1.8s -> 550ms (real ratio), gunicorn workers, trace span
    const s = new Scene(36);
    isle(s, 0, 0, 8, 6, { top: COOL });
    s.shadow(0.8, 1.0, 1.4, 1.4, 4.8, 0, 0.14); s.shadow(2.8, 1.0, 1.4, 1.4, 1.5, 0, 0.14);
    s.box(0.8, 1.0, 0, 1.4, 1.4, 4.8, PAL.amber); // 1.8 s
    s.box(2.8, 1.0, 0, 1.4, 1.4, 4.8 * (550 / 1800), PAL.teal, { cls: 'hot lift', style: '--i:0;--lift:-5px' }); // 550 ms
    s.quadY(2.4 + 0.01, 0.95, 2.05, 3.8, 3.95, '#d9871b'); s.quadY(2.4 + 0.01, 0.95, 2.05, 2.8, 2.95, '#d9871b'); s.quadY(2.4 + 0.01, 0.95, 2.05, 1.8, 1.95, '#d9871b'); s.quadY(2.4 + 0.01, 0.95, 2.05, 0.8, 0.95, '#d9871b');
    // arrow down between the bars
    s.flat([[2.3, 0.7, 0], [2.7, 0.7, 0], [2.7, 0.7, 0]], '#fff');
    s.line([2.5, 1.7, 3.6], [2.5, 1.7, 1.5], '#14203f', 4, { cls: 'hot lift', style: '--i:1;--lift:-4px' });
    s.poly([[2.3, 1.7, 1.6], [2.7, 1.7, 1.6], [2.5, 1.7, 1.2]], '#14203f', { cls: 'hot lift', style: '--i:1;--lift:-4px' });
    // two workers (gunicorn) as twin gates
    s.box(5.0, 0.6, 0, 1.0, 1.0, 1.3, PAL.blue); s.box(6.3, 0.6, 0, 1.0, 1.0, 1.3, PAL.blue);
    s.quadY(1.6 + 0.01, 5.2, 5.8, 0.35, 0.65, '#14203f'); s.quadY(1.6 + 0.01, 6.5, 7.1, 0.35, 0.65, '#14203f');
    s.quadY(1.6 + 0.02, 5.3, 5.5, 0.45, 0.55, '#74e3d2', { cls: 'hot blink', style: '--i:0' }); s.quadY(1.6 + 0.02, 6.6, 6.8, 0.45, 0.55, '#74e3d2', { cls: 'hot blink', style: '--i:2' });
    // trace spans: one huge slab vs. a tiny cube
    s.box(4.6, 3.4, 0, 3.0, 0.7, 0.35, PAL.violet); s.box(4.6, 4.3, 0, 0.35, 0.35, 0.35, PAL.violet, { cls: 'hot lift', style: '--i:2;--lift:-5px' });
    s.line([5.2, 4.45, 0.2], [7.0, 3.75, 0.2], '#ff6b57', 2.6, { dash: '2 6' });
    // dial
    s.disc('y', 5.2 + 0.0, 7.2, 3.0, 0.0, '#fff');
    out['reliability-observability'] = fin(s);
  }

  { // Evals & memory: a judge-bot scoring runs, memory graph, 80/20 A/B split
    const s = new Scene(36);
    isle(s, 0, 0, 8, 6, { top: COOL });
    // podium + judge
    s.box(0.7, 0.8, 0, 1.6, 1.2, 0.9, PAL.wood); s.box(0.6, 0.7, 0.9, 1.8, 1.4, 0.14, PAL.wood);
    bot(s, 1.15, 1.1, 1.04, PAL.violet, '+y');
    s.box(2.25, 1.6, 1.1, 0.5, 0.18, 0.18, PAL.wood, { cls: 'hot lift', style: '--i:0;--lift:-7px' }); s.box(2.4, 1.55, 1.28, 0.2, 0.28, 0.2, PAL.navy, { cls: 'hot lift', style: '--i:0;--lift:-7px' });
    // scoreboard
    s.box(0.7, 3.4, 0, 0.16, 0.16, 1.6, PAL.navy); s.box(2.8, 3.4, 0, 0.16, 0.16, 1.6, PAL.navy);
    s.box(0.5, 3.35, 1.6, 2.6, 0.2, 1.5, PAL.navy);
    [0.9, 1.5, 0.7, 1.2].forEach((w, i) => s.quadY(3.55 + 0.01, 0.75, 0.75 + w, 1.75 + i * 0.3, 1.95 + i * 0.3, ['#74e3d2', '#ffd480', '#ff9fc2', '#9dbbff'][i], { cls: 'hot shine', style: `--i:${i}` }));
    // memory graph
    const m: [number, number, Pal][] = [[4.3, 0.6, PAL.teal], [5.6, 1.5, PAL.pink], [4.4, 2.4, PAL.amber], [5.9, 3.2, PAL.blue]];
    for (let i = 0; i < m.length - 1; i++) link(s, [m[i][0] + 0.3, m[i][1] + 0.3, 0.6], [m[i + 1][0] + 0.3, m[i + 1][1] + 0.3, 0.6], '#6f82b8', 2.4, '2 6');
    link(s, [m[0][0] + 0.3, m[0][1] + 0.3, 0.6], [m[2][0] + 0.3, m[2][1] + 0.3, 0.6], '#6f82b8', 2.4, '2 6');
    m.forEach(([x, y, p], i) => node(s, x, y, 0.1, p, 0.6, 'hot lift', `--i:${i};--lift:-6px`));
    // 80 / 20 A/B columns
    s.box(6.2, 4.4, 0, 0.8, 0.8, 1.6, PAL.blue); s.box(7.1, 4.4, 0, 0.8, 0.8, 0.4, PAL.pink);
    out['evals-memory'] = fin(s);
  }

  { // Event-driven webhooks: DB -> Debezium -> Kafka pipe -> queue -> client mailbox
    const s = new Scene(36);
    isle(s, 0, 0, 9, 5, { top: COOL });
    s.cyl(1.0, 1.4, 0, 0.7, 0.5, PAL.teal); s.cyl(1.0, 1.4, 0.5, 0.7, 0.5, PAL.teal); s.cyl(1.0, 1.4, 1.0, 0.7, 0.5, PAL.teal);
    s.box(2.2, 1.0, 0, 0.9, 0.9, 1.0, PAL.amber); s.quadY(1.9 + 0.01, 2.35, 2.95, 0.4, 0.6, '#14203f');
    // pipe (kafka) with packets
    const pipe: Pal = { t: '#7898ec', l: '#4f7cff', r: '#2f52c9' };
    s.box(3.1, 1.2, 0.4, 3.0, 0.5, 0.5, pipe);
    for (const px2 of [3.7, 4.7, 5.6]) s.box(px2, 1.17, 0.38, 0.12, 0.56, 0.54, PAL.navy);
    const sh = px(s, 2.0, 0);
    [0, 1, 2].forEach((i) => s.box(3.3, 1.3, 0.9, 0.3, 0.3, 0.3, [PAL.pink, PAL.amber, PAL.white][i], { cls: 'hot conv', style: `--dx:${sh.dx.toFixed(1)}px;--dy:${sh.dy.toFixed(1)}px;--i:${i}` }));
    // bolt
    s.poly([[3.9, 0.4, 2.6], [4.6, 0.4, 2.6], [4.2, 0.4, 2.0], [4.8, 0.4, 2.0], [3.8, 0.4, 0.9], [4.0, 0.4, 1.7], [3.5, 0.4, 1.7]], '#ffd480', { cls: 'hot blink', style: '--i:0' });
    // queue
    [0, 1, 2, 3].forEach((i) => s.box(6.4, 2.2 + i * 0.55, 0, 0.8, 0.45, 0.45, [PAL.wood, PAL.amber, PAL.wood, PAL.amber][i]));
    // client mailbox
    s.box(7.9, 3.6, 0, 0.14, 0.14, 1.2, PAL.navy); s.box(7.5, 3.4, 1.2, 1.0, 0.7, 0.7, PAL.red, { cls: 'idle' }); s.quadY(4.1 + 0.01, 7.6, 8.1, 1.4, 1.6, '#14203f');
    out['event-driven-webhooks'] = fin(s);
  }

  { // Webmine: serverless crawler scans display pages
    const s = new Scene(36);
    isle(s, 0, 0, 8, 6, { top: COOL });
    // browser window slab with page blocks
    s.box(0.6, 2.0, 0, 4.6, 3.2, 0.2, PAL.white);
    s.box(0.6, 2.0, 0.2, 4.6, 0.5, 0.05, PAL.blue);
    s.disc('z', 0.27, 0.9, 2.25, 0.08, '#ff6b57', { n: 8 }); s.disc('z', 0.27, 1.2, 2.25, 0.08, '#ffd480', { n: 8 }); s.disc('z', 0.27, 1.5, 2.25, 0.08, '#2cc3ad', { n: 8 });
    [[0.9, 2.8, 1.3, 1.1, PAL.pink], [2.4, 2.8, 1.3, 1.1, PAL.teal], [3.9, 2.8, 1.0, 1.1, PAL.amber], [0.9, 4.1, 1.8, 0.8, PAL.violet], [3.0, 4.1, 1.8, 0.8, PAL.blue]].forEach(([x, y, w, d, p], i) => s.box(x as number, y as number, 0.25, w as number, d as number, 0.2 + (i % 3) * 0.1, p as Pal));
    // scanning beam
    s.box(0.6, 2.7, 0.3, 4.6, 0.12, 0.9, PAL.sky, { cls: 'hot lift', style: '--i:0;--lift:-0px' });
    // spider
    const sx = 5.8, sy = 3.0;
    s.shadow(sx, sy, 1.0, 0.9, 0.8, 0, 0.14);
    s.box(sx, sy, 0.45, 1.0, 0.9, 0.55, PAL.ink, { cls: 'hot lift', style: '--i:1;--lift:-5px' }); s.box(sx + 0.25, sy + 0.2, 1.0, 0.5, 0.5, 0.3, PAL.pink, { cls: 'hot lift', style: '--i:1;--lift:-5px' });
    for (const [lx, ly] of [[sx - 0.5, sy - 0.2], [sx - 0.5, sy + 0.6], [sx + 1.4, sy - 0.2], [sx + 1.4, sy + 0.6]]) { s.line([lx + (lx < sx ? 0.5 : -0.4), ly + 0.2, 0.6], [lx, ly + 0.2, 0.05], '#14203f', 3); }
    s.useLayer('top');
    cloud(s, 4.4, 0.0, 3.4, 0.8);
    s.line([5.1, 0.5, 4.0], [5.5, 0.5, 3.4], '#2f52c9', 3.2); s.line([5.35, 0.5, 3.7], [5.1, 0.5, 3.4], '#2f52c9', 3.2);
    out.webmine = fin(s);
  }
  return out;
}

/* ================================================================ PROJECTS */
export function projectScenes(): Record<string, string> {
  const out: Record<string, string> = {};

  { // consumer-cart: a tiny shop
    const s = new Scene(34);
    isle(s, 0, 0, 7, 6, { top: WARM });
    s.shadow(0.8, 0.8, 4.0, 2.6, 2.4, 0, 0.14);
    s.box(0.8, 0.8, 0, 4.0, 2.6, 2.2, PAL.white);
    ['pink', 'white', 'pink', 'white', 'pink', 'white', 'pink', 'white'].forEach((c, i) => s.box(0.8 + i * 0.5, 3.4, 1.9, 0.5, 0.9, 0.12, PAL[c]));
    s.quadY(3.4 + 0.01, 1.2, 2.6, 0.2, 1.6, '#6f93e4'); s.quadY(3.4 + 0.01, 3.0, 4.4, 0.2, 1.6, '#6f93e4'); s.quadY(3.4 + 0.01, 2.6, 3.0, 0.0, 1.3, '#ffb547');
    // crates in front
    crate(s, 5.4, 3.8, 0, 0.8, PAL.amber); crate(s, 1.0, 4.8, 0, 0.8, PAL.wood); crate(s, 1.1, 4.9, 0.8, 0.5, PAL.teal);
    // shopping cart
    s.box(3.0, 4.6, 0.35, 1.3, 0.9, 0.08, PAL.slate); s.box(3.0, 4.6, 0.43, 1.3, 0.06, 0.6, PAL.blue); s.box(3.0, 5.44, 0.43, 1.3, 0.06, 0.6, PAL.blue); s.box(4.24, 4.6, 0.43, 0.06, 0.9, 0.6, PAL.blue); s.box(2.9, 4.6, 0.43, 0.06, 0.9, 0.95, PAL.navy);
    s.disc('y', 5.5, 3.3, 0.2, 0.16, NAVY, { n: 12 }); s.disc('y', 5.5, 4.1, 0.2, 0.16, NAVY, { n: 12 });
    // payment card floating
    s.useLayer('top');
    s.poly([[5.6, 1.2, 3.4], [6.9, 1.2, 3.4], [6.9, 1.2, 4.2], [5.6, 1.2, 4.2]], '#2f52c9', { cls: 'idle' });
    s.poly([[5.6, 1.2, 3.9], [6.9, 1.2, 3.9], [6.9, 1.2, 4.05], [5.6, 1.2, 4.05]], '#14203f', { cls: 'idle' });
    s.poly([[5.75, 1.2, 3.5], [6.1, 1.2, 3.5], [6.1, 1.2, 3.7], [5.75, 1.2, 3.7]], '#ffd480', { cls: 'idle' });
    out['consumer-cart'] = fin(s);
  }

  { // crowd-funding: coin pile, ether diamond, vault
    const s = new Scene(34);
    isle(s, 0, 0, 7, 6, { top: COOL });
    s.shadow(0.8, 0.9, 2.2, 2.0, 1.8, 0, 0.14);
    s.box(0.8, 0.9, 0, 2.2, 2.0, 1.8, PAL.navy); s.quadY(2.9 + 0.01, 1.0, 2.8, 0.2, 1.5, '#2e3a66'); s.disc('y', 2.92, 1.9, 0.85, 0.35, '#ffd480', { n: 14 }); s.disc('y', 2.93, 1.9, 0.85, 0.15, '#d9871b', { n: 12 });
    [[4.2, 1.2, 4], [5.2, 1.5, 3], [4.6, 2.5, 5], [5.7, 3.0, 2], [3.7, 3.4, 3]].forEach(([x, y, n]) => { for (let i = 0; i < n; i++) s.cyl(x as number, y as number, i * 0.2, 0.42, 0.2, PAL.gold); });
    s.useLayer('top');
    // ether-like diamond
    const cx = 3.2, cy = 4.0, z0 = 2.6;
    s.poly([[cx - 0.6, cy, z0 + 1.0], [cx, cy, z0 + 2.0], [cx + 0.6, cy, z0 + 1.0]], PAL.violet.t, { cls: 'idle' });
    s.poly([[cx - 0.6, cy, z0 + 1.0], [cx, cy, z0], [cx, cy, z0 + 1.0]], PAL.violet.l, { cls: 'idle' });
    s.poly([[cx + 0.6, cy, z0 + 1.0], [cx, cy, z0], [cx, cy, z0 + 1.0]], PAL.violet.r, { cls: 'idle' });
    s.poly([[cx - 0.6, cy, z0 + 1.0], [cx, cy, z0 + 1.0], [cx, cy, z0 + 2.0]], PAL.violet.l, { cls: 'idle' });
    s.poly([[cx + 0.6, cy, z0 + 1.0], [cx, cy, z0 + 1.0], [cx, cy, z0 + 2.0]], PAL.violet.t, { cls: 'idle' });
    s.useLayer('main');
    out['crowd-funding-minor'] = fin(s);
  }

  { // rapidfort_api: shipping containers (Docker), crane, pipeline
    const s = new Scene(34);
    isle(s, 0, 0, 8, 6, { top: COOL });
    s.shadow(0.6, 0.6, 3.6, 1.4, 1.9, 0, 0.14);
    const ctn = (x: number, y: number, z: number, p: Pal) => { s.box(x, y, z, 1.8, 1.4, 0.9, p); for (let i = 0; i < 5; i++) s.quadY(y + 1.4 + 0.005, x + 0.2 + i * 0.32, x + 0.28 + i * 0.32, z + 0.1, z + 0.8, p.r); };
    ctn(0.6, 0.6, 0, PAL.blue); ctn(2.4, 0.6, 0, PAL.amber); ctn(0.6, 0.6, 0.9, PAL.teal); ctn(2.4, 0.6, 0.9, PAL.pink);
    ctn(4.4, 3.2, 0, PAL.violet);
    // crane
    s.box(6.6, 0.8, 0, 0.3, 0.3, 4.2, PAL.amber); s.box(4.6, 0.8, 4.0, 2.6, 0.3, 0.3, PAL.amber); s.line([4.8, 1.0, 4.0], [4.8, 1.0, 2.2], '#14203f', 2.4);
    s.box(4.4, 0.8, 1.6, 1.0, 0.6, 0.6, PAL.blue, { cls: 'hot lift', style: '--i:0;--lift:-8px' });
    // wheel-and-pipeline
    s.box(0.8, 3.4, 0, 2.6, 0.5, 0.4, PAL.slate); s.box(0.8, 4.4, 0, 2.6, 0.5, 0.4, PAL.slate);
    [0.9, 1.9, 2.9].forEach((x, i) => { s.box(x, 3.5, 0.4, 0.4, 0.3, 0.3, PAL.teal, { cls: 'hot conv', style: `--dx:${(1.4 * C * s.u).toFixed(0)}px;--dy:${(1.4 * 0.5 * s.u).toFixed(0)}px;--i:${i}` }); });
    s.box(0.8, 5.2, 0, 0.5, 0.5, 0.5, PAL.pink); s.box(1.5, 5.2, 0, 0.5, 0.5, 0.5, PAL.pink); s.box(2.2, 5.2, 0, 0.5, 0.5, 0.5, PAL.pink);
    out['rapidfort_api'] = fin(s);
  }

  { // STL simplified: array, linked list, tree
    const s = new Scene(34);
    isle(s, 0, 0, 8, 6, { top: COOL });
    // vector: row of cubes with index plates
    [PAL.blue, PAL.teal, PAL.amber, PAL.pink, PAL.violet].forEach((p, i) => { s.box(0.6 + i * 1.0, 0.6, 0, 0.9, 0.9, 0.9, p); s.quadY(1.5 + 0.01, 0.8 + i * 1.0, 1.3 + i * 1.0, 0.25, 0.45, 'rgba(255,255,255,.7)'); });
    // linked list
    const ll: [number, number][] = [[0.8, 3.0], [2.6, 3.4], [4.4, 3.0]];
    ll.forEach(([x, y], i) => { node(s, x, y, 0, [PAL.teal, PAL.amber, PAL.pink][i], 0.8, 'hot lift', `--i:${i};--lift:-6px`); if (i) link(s, [ll[i - 1][0] + 0.8, ll[i - 1][1] + 0.4, 0.4], [x, y + 0.4, 0.4], '#14203f', 2.8, '', ''); });
    // tree
    node(s, 6.3, 3.2, 0, PAL.blue, 0.8); node(s, 5.3, 4.6, 0, PAL.violet, 0.7); node(s, 7.0, 4.6, 0, PAL.violet, 0.7);
    link(s, [6.7, 3.6, 0.8], [5.65, 4.95, 0.35], '#14203f', 2.6, '', ''); link(s, [6.7, 3.6, 0.8], [7.35, 4.95, 0.35], '#14203f', 2.6, '', '');
    out['STL_simplified'] = fin(s);
  }

  { // gstar-network: two terminals exchanging messages
    const s = new Scene(34);
    isle(s, 0, 0, 8, 6, { top: COOL });
    const term = (x: number, y: number, face: '+y' | '+x') => monitor(s, x, y, 0, 2.0, face, (c, a0, a1, z0, z1) => { codeLines(s, face === '+y' ? 'y' : 'x', c, a0, a1, z0, z1, ['#74e3d2', '#ffd480', '#9dbbff'], face === '+y' ? 4 : 9, 0.2); });
    s.box(0.5, 0.4, 0, 2.6, 1.2, 0.8, PAL.white);
    term(0.8, 0.5, '+y');
    s.box(5.2, 2.4, 0, 1.2, 2.8, 0.8, PAL.white);
    term(5.4, 2.8, '+x');
    // message packets between them
    link(s, [2.2, 2.0, 0.6], [5.2, 3.6, 0.6], '#6f82b8', 2.4, '2 7');
    const b = px(s, 2.8, 0);
    [PAL.pink, PAL.amber, PAL.teal].forEach((p, i) => s.box(2.4, 2.4, 0.9, 0.4, 0.4, 0.4, p, { cls: 'hot conv', style: `--dx:${(2.8 * C * s.u).toFixed(0)}px;--dy:${(2.8 * 0.5 * s.u + 0.9 * s.u * 0.0).toFixed(0)}px;--i:${i}` }));
    plant(s, 0.9, 4.6, 0, 0.8, PAL.pink);
    out['gstar-network'] = fin(s);
  }

  { // gpt3-template-site: a billboard with a landing page on it
    const s = new Scene(34);
    isle(s, 0, 0, 8, 6, { top: COOL });
    s.box(1.4, 2.6, 0, 0.25, 0.25, 2.6, PAL.navy); s.box(5.6, 2.6, 0, 0.25, 0.25, 2.6, PAL.navy);
    s.box(0.8, 2.4, 2.4, 5.6, 0.2, 2.6, PAL.white);
    const c = 2.4 + 0.2 + 0.01;
    s.quadY(c, 1.0, 6.2, 4.4, 4.8, '#e7eefc'); s.quadY(c, 1.1, 1.7, 4.55, 4.7, '#4f7cff'); s.quadY(c, 4.4, 4.9, 4.55, 4.7, '#a3b4da'); s.quadY(c, 5.0, 5.5, 4.55, 4.7, '#a3b4da'); s.quadY(c, 5.6, 6.0, 4.55, 4.7, '#ffb547');
    s.quadY(c, 1.2, 4.2, 3.7, 4.1, '#14203f'); s.quadY(c, 1.2, 3.2, 3.2, 3.5, '#9dbbff'); s.quadY(c, 1.2, 2.2, 2.55, 2.95, '#ffb547');
    s.quadY(c, 4.6, 6.0, 2.6, 4.0, '#ff9fc2'); s.disc('y', c + 0.001, 5.3, 3.3, 0.45, '#ff6fa3', { n: 16 });
    person(s, 4.2, 4.3, 0, '+y', { shirt: PAL.amber, pants: PAL.navy, arms: 'up', k: 0.75, glasses: true });
    pine(s, 0.7, 4.6, 0, 1.6, 0.9); pine(s, 6.7, 4.4, 0, 1.4, 0.8);
    s.useLayer('top');
    cloud(s, 5.5, 0.0, 5.6, 0.7);
    out['gpt3-template-site'] = fin(s);
  }
  return out;
}

/* ================================================================ BEYOND CODE headers */
export function categoryScenes(): Record<string, string> {
  const out: Record<string, string> = {};
  const mk = (id: string, fn: (s: Scene) => void, top: [string, string] = COOL, w = 6, d = 5) => { const s = new Scene(24); isle(s, 0, 0, w, d, { top, tip: 0.8 }); fn(s); out[id] = fin(s, 'idle', 4); };

  mk('portraits', (s) => {
    s.box(1.4, 1.5, 0, 0.12, 0.12, 2.6, PAL.wood); s.box(3.3, 1.5, 0, 0.12, 0.12, 2.6, PAL.wood); s.box(1.4, 1.4, 1.2, 2.0, 0.1, 2.0, PAL.white);
    s.quadY(1.5 + 0.01, 1.55, 3.25, 1.4, 3.0, '#9dbbff'); s.disc('y', 1.52, 2.4, 2.5, 0.35, '#ffd480', { n: 14 }); s.poly([[1.7, 1.52, 1.45], [3.1, 1.52, 1.45], [2.4, 1.52, 2.3]], '#2cc3ad');
    s.cyl(4.7, 3.4, 0, 0.06, 1.5, PAL.navy); s.box(4.35, 3.05, 1.5, 0.7, 0.7, 0.45, PAL.ink); s.disc('y', 3.77, 4.7, 1.72, 0.16, '#7ec8ee', { n: 12 });
  });
  mk('adventure', (s) => {
    s.pyr(0.5, 0.6, 0, 3.0, 3.0, 3.4, PAL.slate); s.pyr(2.7, 1.2, 0, 2.6, 2.4, 2.6, PAL.rock);
    s.quadY(3.0 + 0.0, 1.2, 1.9, 0.3, 1.6, '#9dd4ff'); s.box(1.1, 3.0, 0, 0.9, 0.5, 0.15, PAL.sky);
    pine(s, 4.2, 3.4, 0, 1.5, 0.8); pine(s, 0.6, 3.6, 0, 1.2, 0.7); pine(s, 3.6, 3.9, 0, 1.0, 0.6);
  }, MINT);
  mk('friends-trips', (s) => {
    s.pyr(2.6, 2.2, 0, 0.8, 0.8, 0.8, PAL.amber, { cls: 'blink' }); s.box(2.2, 2.0, 0, 1.6, 0.2, 0.2, PAL.wood); s.box(2.2, 3.1, 0, 1.6, 0.2, 0.2, PAL.wood);
    person(s, 1.1, 1.6, 0, '+x', { shirt: PAL.pink, k: 0.7, arms: 'up' }); person(s, 4.6, 1.8, 0, '+y', { shirt: PAL.teal, k: 0.7 }); person(s, 1.2, 3.8, 0, '+x', { shirt: PAL.blue, k: 0.7, glasses: true });
  }, WARM);
  mk('bikes', (s) => {
    const y = 2.0;
    s.box(1.6, y, 0.45, 2.2, 0.35, 0.18, PAL.red); s.box(1.8, y - 0.05, 0.63, 0.9, 0.45, 0.35, PAL.red); s.box(2.6, y, 0.7, 0.8, 0.35, 0.14, PAL.ink); s.box(3.4, y + 0.1, 0.63, 0.1, 0.1, 0.7, PAL.navy); s.box(3.25, y - 0.25, 1.28, 0.1, 0.8, 0.1, PAL.navy);
    s.disc('y', y + 0.38, 1.6, 0.5, 0.5, NAVY, { n: 22 }); s.disc('y', y + 0.39, 1.6, 0.5, 0.22, '#c3d0ec', { n: 14 });
    s.disc('y', y + 0.38, 4.0, 0.5, 0.5, NAVY, { n: 22 }); s.disc('y', y + 0.39, 4.0, 0.5, 0.22, '#c3d0ec', { n: 14 });
    s.flatRect(0.6, 5.4, 3.5, 4.5, '#5b6fa6'); s.flatRect(0.6, 5.4, 3.97, 4.03, '#ffd480');
  });
  mk('books', (s) => {
    [[1.0, 1.0, 2.0, PAL.blue], [1.1, 1.0, 1.8, PAL.pink], [0.95, 1.05, 1.9, PAL.amber]].forEach(([x, y, w, p], i) => s.box(x as number, y as number, i * 0.4, w as number, 1.4, 0.4, p as Pal));
    s.box(3.6, 1.0, 0, 1.2, 1.6, 0.2, PAL.white); s.box(3.6, 1.0, 0.2, 0.06, 1.6, 0.04, PAL.navy);
    mug(s, 4.2, 3.8, 0, PAL.teal); s.box(1.2, 3.2, 0, 1.4, 1.0, 0.3, PAL.teal); s.box(1.3, 3.3, 0.3, 1.2, 0.8, 0.3, PAL.violet);
  }, WARM);
  mk('scenery', (s) => {
    s.box(1.0, 1.0, 0, 3.2, 1.6, 1.6, PAL.pink); s.box(1.4, 1.2, 1.6, 2.4, 1.2, 1.1, PAL.pink); s.box(1.9, 1.3, 2.7, 1.4, 0.9, 0.8, PAL.pink);
    for (let i = 0; i < 4; i++) { s.quadY(2.6 + 0.01, 1.3 + i * 0.75, 1.7 + i * 0.75, 0.3, 1.2, '#14203f'); }
    [2.0, 2.6].forEach((x) => s.quadY(2.4 + 0.01, x, x + 0.4, 1.8, 2.4, '#ffd480'));
    s.pyr(1.0, 1.0, 1.6, 0.6, 0.6, 0.6, PAL.amber); s.pyr(3.5, 1.0, 1.6, 0.6, 0.6, 0.6, PAL.amber);
    s.flatRect(0.3, 5.7, 3.7, 4.7, '#9ccbf2');
  }, WARM);
  mk('pets', (s) => {
    // dog
    s.box(1.0, 1.4, 0, 1.4, 0.7, 0.7, PAL.wood); s.box(2.2, 1.3, 0.5, 0.6, 0.6, 0.6, PAL.wood); s.box(0.7, 1.6, 0.5, 0.3, 0.12, 0.5, PAL.wood);
    for (const [x, y] of [[1.1, 1.3], [1.1, 1.9], [2.1, 1.3], [2.1, 1.9]]) s.box(x, y, 0, 0.2, 0.2, 0.2, PAL.wood);
    s.box(2.5, 1.5, 1.1, 0.12, 0.12, 0.18, PAL.ink); s.quadY(1.9 + 0.01, 2.3, 2.55, 0.85, 1.0, '#14203f');
    cat(s, 3.3, 3.3, 0, PAL.amber);
    s.cyl(1.2, 3.6, 0, 0.4, 0.2, PAL.pink); s.box(4.2, 1.2, 0, 0.5, 0.15, 0.15, PAL.white);
  }, MINT);
  mk('food', (s) => {
    s.box(1.0, 1.0, 0, 3.4, 1.1, 0.9, PAL.wood);
    ['amber', 'white', 'amber', 'white', 'amber', 'white'].forEach((c, i) => s.box(0.9 + i * 0.6, 1.0, 2.2, 0.6, 1.5, 0.12, PAL[c]));
    s.box(1.0, 1.0, 0.9, 0.14, 0.14, 1.3, PAL.navy); s.box(4.26, 1.0, 0.9, 0.14, 0.14, 1.3, PAL.navy);
    s.cyl(2.0, 1.55, 0.9, 0.4, 0.4, PAL.slate); s.cyl(3.4, 1.55, 0.9, 0.35, 0.3, PAL.red);
    s.cyl(2.0, 1.55, 1.3, 0.34, 0.03, '#ff9d8c');
    s.box(1.0, 3.3, 0, 0.5, 0.5, 0.5, PAL.amber); s.box(1.7, 3.5, 0, 0.5, 0.5, 0.3, PAL.pink);
  }, WARM);
  mk('work-and-lifestyle', (s) => {
    desk(s, 0.8, 0.8, 3.6, 1.6, 1.1); laptop(s, 1.4, 1.1, 1.1, 0.9, PAL.slate, '#26335e'); mug(s, 3.4, 1.6, 1.1, PAL.pink);
    s.box(2.4, 1.4, 1.1, 0.8, 0.6, 0.04, PAL.white); s.quadZ(1.15, 2.5, 3.0, 1.5, 1.55, '#14203f'); s.quadZ(1.15, 2.5, 3.0, 1.65, 1.7, '#a3b4da');
    plant(s, 4.9, 3.6, 0, 0.9, PAL.amber);
  });
  return out;
}

/* ================================================================ SKILLS piles */
export function stackScenes(counts: number[]): string[] {
  const pals = [PAL.blue, PAL.teal, PAL.amber, PAL.pink, PAL.violet, PAL.red];
  return counts.map((n, g) => {
    const s = new Scene(16);
    const main = pals[g % pals.length], accent = [PAL.amber, PAL.teal, PAL.pink, PAL.blue, PAL.amber, PAL.teal][g % 6];
    // pile: gravity heightfield on a 3x3 grid
    const cols = [[3, 2, 1], [2, 2, 1], [1, 1, 0]];
    const total = Math.min(n, 11);
    let placed = 0;
    for (let lvl = 0; lvl < 3 && placed < total; lvl++) for (let i = 0; i < 3 && placed < total; i++) for (let j = 0; j < 3 && placed < total; j++) {
      if (cols[j][i] > lvl) { const pal = (placed + g) % 4 === 3 ? accent : main; s.box(i + 0.03, j + 0.03, lvl, 0.94, 0.94, 0.94, pal); placed++; }
    }
    return s.render({ pad: 2, cls: 'idle' }).html;
  });
}

/* ================================================================ STATS PLATFORM */
export function statsScene(): string {
  const s = new Scene(34);
  isle(s, 0, 0, 7, 5, { top: COOL, tip: 1.0 });
  const spec: [number, number, number, Pal][] = [[0.6, 0.5, 4.2, PAL.blue], [2.6, 0.5, 3.2, PAL.teal], [4.6, 0.5, 5.2, PAL.amber], [0.6, 2.7, 2.4, PAL.pink], [2.6, 2.7, 3.0, PAL.violet], [4.6, 2.7, 1.9, PAL.leaf]];
  spec.forEach(([x, y, h, p], i) => {
    s.shadow(x, y, 1.5, 1.5, h, 0, 0.12);
    const cls = `col col${i}`;
    s.box(x, y, 0, 1.5, 1.5, h, p, { cls });
    for (let b = 0; b < Math.floor(h / 0.9); b++) s.quadY(y + 1.5 + 0.01, x + 0.2, x + 1.3, 0.35 + b * 0.9, 0.5 + b * 0.9, 'rgba(255,255,255,.4)', { cls });
    s.box(x + 0.45, y + 0.45, h, 0.6, 0.6, 0.35, PAL.white, { cls });
  });
  return s.render({ pad: 6, cls: 'idle' }).html;
}

/* ================================================================ CONTACT + WRITING */
export function contactScene(): string {
  const s = new Scene(38);
  isle(s, 0, 0, 7, 6, { top: WARM, tip: 1.0 });
  // post box on a post
  s.shadow(2.6, 2.2, 1.8, 1.4, 3.6, 0, 0.14);
  s.box(3.35, 2.75, 0, 0.3, 0.3, 1.6, PAL.navy);
  s.box(2.6, 2.2, 1.6, 1.8, 1.4, 1.3, PAL.blue); s.pyr(2.6, 2.2, 2.9, 1.8, 1.4, 0.6, PAL.blue);
  s.quadY(3.6 + 0.01, 2.8, 3.7, 2.1, 2.3, '#14203f'); s.quadY(3.6 + 0.01, 2.85, 3.65, 2.12, 2.2, '#4a5a8c');
  s.quadY(3.6 + 0.01, 3.9, 4.3, 1.8, 2.5, '#ffd480');
  s.box(4.4, 2.6, 2.1, 0.12, 0.12, 0.9, PAL.red, { cls: 'flag' });
  s.box(4.4, 2.6, 2.9, 0.5, 0.12, 0.3, PAL.red, { cls: 'flag' });
  // letter falling in
  s.box(3.2, 1.9, 3.2, 0.9, 0.04, 0.6, PAL.white, { cls: 'hot lift', style: '--i:0;--lift:-10px' });
  // parcels
  crate(s, 0.8, 3.9, 0, 0.9, PAL.wood); crate(s, 1.9, 4.2, 0, 0.7, PAL.amber); crate(s, 0.9, 4.0, 0.9, 0.6, PAL.teal);
  plant(s, 5.6, 4.6, 0, 1.0, PAL.pink);
  person(s, 3.9, 4.8, 0, '+y', { shirt: PAL.amber, pants: PAL.navy, arms: 'up', k: 0.8, glasses: true, beard: true });
  s.useLayer('top');
  cloud(s, 4.8, 0.2, 5.2, 0.7);
  return s.render({ pad: 6, cls: 'idle' }).html;
}

export function writingScene(): string {
  const s = new Scene(36);
  isle(s, 0, 0, 8, 5, { top: COOL, tip: 1.0 });
  // desk with typewriter-ish machine
  desk(s, 0.6, 0.5, 2.8, 1.4, 1.1);
  s.box(1.1, 0.8, 1.1, 1.2, 0.8, 0.45, PAL.navy); s.box(1.2, 0.85, 1.55, 1.0, 0.5, 0.06, PAL.slate);
  s.box(1.3, 0.55, 1.5, 0.8, 0.04, 0.8, PAL.white, { cls: 'hot lift', style: '--i:0;--lift:-3px' });
  [0.2, 0.4, 0.6].forEach((z) => s.quadY(0.6, 1.4, 2.0, 1.55 + z, 1.6 + z, '#a3b4da'));
  // conveyor with queued parcels
  belt(s, 0.6, 3.0, 0, 6.4, [{ pal: PAL.amber, i: 0 }, { pal: PAL.teal, i: 1 }, { pal: PAL.pink, i: 2 }, { pal: PAL.blue, i: 3 }], { d: 1.0 });
  s.box(6.2, 2.7, 0.34, 0.25, 1.6, 1.2, PAL.violet); s.box(7.3, 2.7, 0.34, 0.25, 1.6, 1.2, PAL.violet); s.box(6.2, 2.7, 1.54, 1.35, 1.6, 0.25, PAL.violet);
  s.useLayer('top');
  s.poly([[5.2, 0.4, 3.4], [6.6, 0.8, 3.7], [5.7, 0.9, 3.15]], '#ffffff', { cls: 'idle' }); s.poly([[5.2, 0.4, 3.4], [5.7, 0.9, 3.15], [5.5, 0.7, 3.0]], '#c3d0ec', { cls: 'idle' });
  return s.render({ pad: 6, cls: 'idle' }).html;
}

/* ================================================================ page ornaments */
export function logoSvg(): string {
  const s = new Scene(9);
  s.box(0, 0, 0, 2, 2, 2, PAL.blue); s.box(0.5, 0.5, 2, 1, 1, 0.8, PAL.amber);
  return s.render({ pad: 1, cls: 'logo' }).html;
}
export function towerSlabs(): string {
  const s = new Scene(11);
  s.box(0, 0, 0, 2.4, 2.4, 0.9, PAL.blue, { faces: true });
  return s.render({ pad: 1, cls: 'tw-svg' }).html;
}
/** "tumbling blocks" ribbon (cube tiling) as a data URI; a few cubes are accent colours */
export function tumbleUri(): string {
  const sd = 22, W = 2 * C * sd, cols = 8, H = 3 * sd;
  const faces = (cx: number, cy: number, t: string, l: string, r: string) => {
    const p = (x: number, y: number) => `${(cx + x).toFixed(1)},${(cy + y).toFixed(1)}`;
    return `<polygon points="${p(0, -sd)} ${p(W / 2, -sd / 2)} ${p(0, 0)} ${p(-W / 2, -sd / 2)}" fill="${t}"/><polygon points="${p(-W / 2, -sd / 2)} ${p(0, 0)} ${p(0, sd)} ${p(-W / 2, sd / 2)}" fill="${l}"/><polygon points="${p(0, 0)} ${p(W / 2, -sd / 2)} ${p(W / 2, sd / 2)} ${p(0, sd)}" fill="${r}"/>`;
  };
  const base = ['#eaf1ff', '#d4e1fb', '#bdd0f4'];
  const acc: Record<number, string[]> = { 2: ['#ffe3a8', '#ffc766', '#e8a02a'], 5: ['#a9efe3', '#52d1bb', '#2aa58f'], 7: ['#ffc2d9', '#ff8db8', '#e0609a'] };
  let g = '';
  for (let i = 0; i < cols; i++) {
    const c = acc[i] ?? base;
    g += faces(W / 2 + i * W, sd, c[0], c[1], c[2]);
    const c2 = i === 4 ? acc[2] : base;
    g += faces(i * W, 2.5 * sd, c2[0], c2[1], c2[2]) + faces(i * W, -0.5 * sd, c2[0], c2[1], c2[2]);
  }
  g += faces(cols * W, 2.5 * sd, ...(base as [string, string, string])) + faces(cols * W, -0.5 * sd, ...(base as [string, string, string]));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${(cols * W).toFixed(1)}" height="${H}" viewBox="0 0 ${(cols * W).toFixed(1)} ${H}">${g}</svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}
