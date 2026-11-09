/** Scene library: every diorama on the page is assembled here from the iso.ts primitives and props.ts parts. */
import { Scene, PAL, type Pal, type Rendered } from './iso';
import { person, desk, monitor, laptop, plant, cat, rack, crate, cloud, lamp, mug, codeLines, pine } from './props';

const NAVY = '#1d2547';

export interface HeroArt {
  main: Rendered; far: Rendered;
  /** CSS box (in % of the art container) where the hero photo goes, plus the wall it hangs on */
  photo: { left: number; top: number; w: number; h: number };
  aspect: number;
}

/* ---------------------------------------------------------------- HERO: the workstation room */
export function heroScene(): HeroArt {
  const s = new Scene(54);
  s.island(0, 0, 7, 7, { thick: 0.8, depth: 4.6, tiles: [7, 7], top: ['#fbf1de', '#f2e4c8'], side: PAL.slate, rock: PAL.rock });
  // rug
  s.flatRect(2.5, 6.3, 3.3, 6.6, '#ffb8d0');
  s.flatRect(2.7, 6.1, 3.5, 6.4, '#ff8fb6');
  s.flatRect(2.95, 5.85, 3.75, 6.15, '#ffd3e2');
  // shadows
  s.shadow(1.3, 0.4, 3.7, 1.5, 1.25, 0, 0.1);
  s.shadow(0.45, 2.2, 0.7, 2.6, 0.9, 0, 0.1);
  s.shadow(0.5, 0.5, 0.7, 0.7, 2.6, 0, 0.12);
  s.shadow(3.0, 1.9, 1.3, 1.3, 1.2, 0, 0.14);
  s.shadow(5.5, 5.2, 1.3, 0.7, 1.2, 0, 0.14);

  // walls
  s.box(0, 0, 0, 7, 0.4, 5.6, PAL.wallA);
  s.box(0, 0.4, 0, 0.4, 6.6, 5.6, PAL.wallA);
  s.box(0.4, 0.4, 0, 6.6, 0.07, 0.32, PAL.white);
  s.box(0.4, 0.47, 0, 0.07, 6.53, 0.32, PAL.white);

  // window on the right wall (plane y = 0.4)
  s.quadY(0.4, 5.05, 6.75, 1.85, 4.75, '#ffffff');
  s.quadY(0.41, 5.2, 6.6, 2.0, 4.6, '#a9d6ff');
  s.quadY(0.42, 5.2, 6.6, 2.0, 2.9, '#8fbaf5');
  s.quadY(0.43, 5.35, 5.75, 2.0, 3.35, '#6f93e4');
  s.quadY(0.43, 5.85, 6.15, 2.0, 2.75, '#5b7fd6');
  s.quadY(0.43, 6.2, 6.55, 2.0, 3.0, '#6f93e4');
  s.disc('y', 0.44, 6.1, 4.05, 0.28, '#ffd480');
  s.quadY(0.45, 5.2, 6.6, 3.27, 3.33, '#ffffff');
  s.quadY(0.45, 5.87, 5.93, 2.0, 4.6, '#ffffff');
  // clock + shelf above the desk
  s.disc('y', 0.42, 2.0, 4.35, 0.42, '#ffffff');
  s.disc('y', 0.43, 2.0, 4.35, 0.34, '#eaf0ff');
  s.quadY(0.44, 1.98, 2.02, 4.35, 4.65, NAVY); s.quadY(0.44, 2.0, 2.24, 4.33, 4.37, NAVY);
  s.box(2.9, 0.4, 3.85, 2.0, 0.34, 0.1, PAL.wood);
  s.box(3.05, 0.45, 3.95, 0.3, 0.22, 0.46, PAL.pink); s.box(3.4, 0.45, 3.95, 0.24, 0.22, 0.58, PAL.teal); s.box(3.68, 0.45, 3.95, 0.3, 0.22, 0.4, PAL.amber);
  s.cyl(4.5, 0.62, 3.95, 0.16, 0.26, PAL.white);
  s.box(4.4, 0.55, 4.2, 0.2, 0.15, 0.08, PAL.leaf);

  // photo frame on the left wall (plane x = 0.4); bars protrude, the mat sits recessed
  const FX = 0.4;
  s.box(FX, 1.6, 4.95, 0.12, 3.8, 0.25, PAL.wood); s.box(FX, 1.6, 1.3, 0.12, 3.8, 0.25, PAL.wood);
  s.box(FX, 1.6, 1.3, 0.12, 0.25, 3.9, PAL.wood); s.box(FX, 5.15, 1.3, 0.12, 0.25, 3.9, PAL.wood);
  s.quadX(FX + 0.06, 1.85, 5.15, 1.55, 4.95, '#ffffff');
  s.quadX(FX + 0.07, 2.0, 5.0, 1.7, 4.8, '#c6d3ef');
  const PX = FX + 0.07, PY0 = 2.0, PY1 = 5.0, PZ0 = 1.7, PZ1 = 4.8;

  // sideboard under the frame
  s.box(0.45, 2.2, 0, 0.7, 2.6, 0.9, PAL.white);
  s.box(0.45, 2.2, 0.9, 0.74, 2.6, 0.1, PAL.wood);
  s.quadX(1.16, 2.35, 3.35, 0.15, 0.75, PAL.slate.t); s.quadX(1.16, 3.65, 4.65, 0.15, 0.75, PAL.slate.t);
  s.disc('x', 1.17, 2.85, 0.45, 0.07, '#8ea3d4'); s.disc('x', 1.17, 4.15, 0.45, 0.07, '#8ea3d4');
  plant(s, 0.85, 2.75, 1.0, 0.75, PAL.pink);
  s.box(0.65, 3.85, 1.0, 0.45, 0.6, 0.12, PAL.blue); s.box(0.68, 3.88, 1.12, 0.4, 0.54, 0.1, PAL.teal); s.box(0.7, 3.9, 1.22, 0.36, 0.5, 0.1, PAL.amber);

  // server rack in the back corner
  rack(s, 0.5, 0.5, 0, 0.75, 0.75, 2.6);

  // desk setup on the right wall
  desk(s, 1.35, 0.4, 3.9, 1.5, 1.25);
  monitor(s, 3.2, 0.55, 1.25, 1.6, '+y', (c, a0, a1, z0, z1) => {
    // tiny node graph + code lines
    codeLines(s, 'y', c, a0, a0 + (a1 - a0) * 0.5, z0, z1, ['#74e3d2', '#ffd480', '#ff9fc2', '#9dbbff'], 5, 0.16);
    const nx = a0 + (a1 - a0) * 0.72, zc = (z0 + z1) / 2;
    s.line([nx - 0.1, c, zc + 0.2], [nx + 0.08, c, zc - 0.18], '#6f82b8', 2);
    s.line([nx + 0.08, c, zc - 0.18], [nx + 0.08, c, zc + 0.3], '#6f82b8', 2);
    s.box(nx - 0.2, c, zc + 0.15, 0.2, 0.01, 0.18, PAL.teal); s.box(nx - 0.0, c, zc - 0.32, 0.2, 0.01, 0.18, PAL.amber); s.box(nx - 0.02, c, zc + 0.28, 0.2, 0.01, 0.18, PAL.pink);
  });
  s.box(3.3, 1.4, 1.25, 0.95, 0.34, 0.05, PAL.white);
  laptop(s, 1.7, 0.9, 1.25, 0.85, PAL.slate, '#26335e', { cls: 'bob-s' });
  mug(s, 4.95, 1.25, 1.25, PAL.pink);
  s.raw([4.95, 1.25, 1.5, 4.96, 1.26, 1.9], `<g class="steam"><path d="M${s.P(4.95, 1.25, 1.55)[0].toFixed(1)} ${s.P(4.95, 1.25, 1.55)[1].toFixed(1)}q-5 -8 0 -14t0 -14" fill="none" stroke="#9fb4e6" stroke-width="2.4" stroke-linecap="round"/></g>`);
  s.box(1.55, 0.5, 1.25, 0.22, 0.22, 0.06, PAL.amber);

  // chair + developer (seated, back to us)
  const cx = 4.2, cy = 2.5;
  s.cyl(cx, cy + 0.1, 0, 0.07, 0.5, PAL.navy);
  s.box(cx - 0.45, cy - 0.35, 0.5, 0.9, 0.9, 0.13, PAL.teal);
  s.box(cx - 0.4, cy + 0.42, 0.6, 0.8, 0.12, 1.15, PAL.teal);
  s.box(cx - 0.5, cy + 0.0, 0.0, 1.0, 0.1, 0.07, PAL.navy); s.box(cx - 0.05, cy - 0.45, 0, 0.1, 1.0, 0.07, PAL.navy);
  person(s, cx, cy, 0, '-y', { sit: true, glasses: true, beard: true, shirt: PAL.blue, pants: PAL.navy, hair: PAL.ink, arms: 'forward' });

  // plant (corner, front-left), floor lamp, crates, cat
  plant(s, 0.95, 6.15, 0, 1.5, PAL.amber);
  lamp(s, 6.45, 1.1, 0, 3.3);
  crate(s, 5.6, 5.45, 0, 0.9, PAL.wood); crate(s, 6.15, 5.55, 0, 0.8, PAL.amber); crate(s, 5.7, 5.5, 0.9, 0.7, PAL.teal);
  cat(s, 3.5, 4.5, 0, PAL.amber, { cls: 'cat' });
  // little pennant stuck on a box
  s.box(6.0, 4.4, 0, 0.5, 0.5, 0.5, PAL.blue); s.box(6.1, 4.5, 0.5, 0.3, 0.3, 0.3, PAL.pink);

  // ---- far layer: floating workflow nodes + clouds (parallax)
  s.useLayer('far');
  const nodes: [number, number, number, Pal, string][] = [[9.6, 0.4, 2.7, PAL.teal, 'n1'], [10.9, 2.3, 4.1, PAL.blue, 'n2'], [9.3, 3.6, 5.4, PAL.amber, 'n3'], [11.3, 0.6, 5.7, PAL.pink, 'n4']];
  s.line([nodes[0][0] + 0.4, nodes[0][1] + 0.4, nodes[0][2] + 0.4], [nodes[1][0] + 0.4, nodes[1][1] + 0.4, nodes[1][2] + 0.4], '#6f82b8', 2.4, { dash: '2 7' });
  s.line([nodes[1][0] + 0.4, nodes[1][1] + 0.4, nodes[1][2] + 0.4], [nodes[2][0] + 0.4, nodes[2][1] + 0.4, nodes[2][2] + 0.4], '#6f82b8', 2.4, { dash: '2 7' });
  s.line([nodes[1][0] + 0.4, nodes[1][1] + 0.4, nodes[1][2] + 0.4], [nodes[3][0] + 0.4, nodes[3][1] + 0.4, nodes[3][2] + 0.4], '#6f82b8', 2.4, { dash: '2 7' });
  nodes.forEach(([x, y, z, pal, c], i) => s.box(x, y, z, 0.8, 0.8, 0.8, pal, { cls: `node ${c} f${i % 3}` }));
  cloud(s, -1.2, 2.2, 7.4, 1.0, { cls: 'drift' });
  cloud(s, 6.6, -2.8, 8.4, 0.8, { cls: 'drift d2' });

  const full = s.render({ pad: 14 });
  const main = s.render({ layers: ['main'], fixed: full.vb });
  const far = s.render({ layers: ['far'], fixed: full.vb });
  const a = main.rel(PX, PY1, PZ1); // top-left corner of the photo in screen terms (left edge = larger y)
  const wTrue = (PY1 - PY0) * s.u, hTrue = (PZ1 - PZ0) * s.u;
  return { main, far, aspect: full.vb.w / full.vb.h, photo: { left: a.x * 100, top: a.y * 100, w: (wTrue / full.vb.w) * 100, h: (hTrue / full.vb.h) * 100 } };
}

export * from './scenes-more';
