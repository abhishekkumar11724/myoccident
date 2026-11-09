/** Reusable isometric props built from the primitives in iso.ts. Each takes the scene and a world position. */
import { Scene, PAL, type Pal, type Opts } from './iso';

export type Facing = '+x' | '+y' | '-x' | '-y';
const rng = (seed: number) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

/** code-ish lines on a vertical plane. plane 'y' => spans x; plane 'x' => spans y. */
export function codeLines(s: Scene, plane: 'x' | 'y', c: number, a0: number, a1: number, z0: number, z1: number, colors: string[], seed = 3, gap = 0.17) {
  const R = rng(seed);
  const lh = 0.07;
  for (let z = z1 - 0.12; z > z0 + 0.05; z -= gap) {
    const indent = R() < 0.35 ? 0.18 : 0, len = (a1 - a0) * (0.3 + R() * 0.55);
    const col = colors[Math.floor(R() * colors.length)];
    if (plane === 'y') s.quadY(c, a0 + indent, Math.min(a1, a0 + indent + len), z - lh, z, col);
    else s.quadX(c, a0 + indent, Math.min(a1, a0 + indent + len), z - lh, z, col);
  }
}

/** desk-top monitor facing +y (screen on plane y) or +x. (x,y,z) = min corner of the footprint. */
export function monitor(s: Scene, x: number, y: number, z: number, w: number, face: '+y' | '+x', content: (c: number, a0: number, a1: number, z0: number, z1: number) => void) {
  const h = w * 0.62;
  if (face === '+y') {
    s.box(x + w / 2 - 0.3, y + 0.12, z, 0.6, 0.4, 0.07, PAL.navy);
    s.box(x + w / 2 - 0.08, y + 0.26, z + 0.07, 0.16, 0.1, 0.42, PAL.navy);
    s.box(x, y + 0.2, z + 0.48, w, 0.12, h, PAL.navy);
    const c = y + 0.32 + 0.01;
    s.quadY(c, x + 0.07, x + w - 0.07, z + 0.55, z + 0.48 + h - 0.07, '#1b2547');
    content(c + 0.01, x + 0.12, x + w - 0.12, z + 0.6, z + 0.48 + h - 0.12);
  } else {
    s.box(x + 0.12, y + w / 2 - 0.3, z, 0.4, 0.6, 0.07, PAL.navy);
    s.box(x + 0.26, y + w / 2 - 0.08, z + 0.07, 0.1, 0.16, 0.42, PAL.navy);
    s.box(x + 0.2, y, z + 0.48, 0.12, w, h, PAL.navy);
    const c = x + 0.32 + 0.01;
    s.quadX(c, y + 0.07, y + w - 0.07, z + 0.55, z + 0.48 + h - 0.07, '#1b2547');
    content(c + 0.01, y + 0.12, y + w - 0.12, z + 0.6, z + 0.48 + h - 0.12);
  }
}

export function laptop(s: Scene, x: number, y: number, z: number, w = 0.9, pal: Pal = PAL.slate, screen = '#1b2547', o?: Opts) {
  const d = 0.62;
  s.box(x, y, z, w, d, 0.06, pal, o);
  // screen leaning back (towards -y)
  const yb = y + 0.06, lift = 0.58, back = 0.22;
  s.poly([[x, yb, z + 0.06], [x + w, yb, z + 0.06], [x + w, yb - back, z + 0.06 + lift], [x, yb - back, z + 0.06 + lift]], '#2e3a66', o);
  s.poly([[x + 0.05, yb - 0.005, z + 0.1], [x + w - 0.05, yb - 0.005, z + 0.1], [x + w - 0.05, yb - back + 0.02, z + 0.06 + lift - 0.04], [x + 0.05, yb - back + 0.02, z + 0.06 + lift - 0.04]], screen, o);
}

export function desk(s: Scene, x: number, y: number, w: number, d: number, h = 1.7, pal: Pal = PAL.wood, leg: Pal = PAL.white) {
  s.box(x, y, 0, 0.14, d, h - 0.16, leg);
  s.box(x + w - 0.14, y, 0, 0.14, d, h - 0.16, leg);
  s.box(x, y, h - 0.16, w, d, 0.16, pal);
}

export function plant(s: Scene, x: number, y: number, z: number, k = 1, potPal: Pal = PAL.amber) {
  s.cyl(x, y, z, 0.34 * k, 0.5 * k, potPal);
  const base = z + 0.5 * k;
  const leaves: [number, number, 'x' | 'y', number][] = [[-0.05, 0, 'y', 1.25], [0.05, 0.02, 'x', 1.05], [-0.12, -0.04, 'x', 0.8], [0.12, 0.05, 'y', 0.75], [0, 0, 'y', 0.55]];
  leaves.forEach(([dx, dy, pl, hh], i) => {
    const w = 0.22 * k, h = hh * k, pal = i % 2 ? PAL.leaf.l : PAL.leaf.t;
    const sh = i % 2 ? PAL.leaf.r : PAL.leaf.l;
    const lean = (i - 2) * 0.12 * k;
    const cx = x + dx * k, cy = y + dy * k;
    if (pl === 'y') {
      s.poly([[cx - w, cy, base + h * 0.35], [cx + lean, cy, base], [cx + w, cy, base + h * 0.35], [cx + lean * 2.4, cy, base + h]], pal);
      s.poly([[cx + lean, cy, base], [cx + w, cy, base + h * 0.35], [cx + lean * 2.4, cy, base + h]], sh);
    } else {
      s.poly([[cx, cy - w, base + h * 0.35], [cx, cy + lean, base], [cx, cy + w, base + h * 0.35], [cx, cy + lean * 2.4, base + h]], pal);
      s.poly([[cx, cy + lean, base], [cx, cy + w, base + h * 0.35], [cx, cy + lean * 2.4, base + h]], sh);
    }
  });
}

export function pine(s: Scene, x: number, y: number, z: number, h = 1.6, w = 0.9, pal: Pal = PAL.leaf) {
  s.box(x + w / 2 - 0.07, y + w / 2 - 0.07, z, 0.14, 0.14, h * 0.25, PAL.wood);
  s.pyr(x, y, z + h * 0.18, w, w, h * 0.55, pal);
  s.pyr(x + w * 0.12, y + w * 0.12, z + h * 0.5, w * 0.76, w * 0.76, h * 0.5, pal);
}

export function cat(s: Scene, x: number, y: number, z: number, pal: Pal = PAL.amber, o?: Opts) {
  s.box(x, y, z, 0.8, 0.42, 0.34, pal, o);
  s.box(x + 0.62, y - 0.02, z + 0.04, 0.34, 0.38, 0.34, pal, o);
  s.box(x + 0.64, y - 0.02, z + 0.38, 0.1, 0.1, 0.1, pal, o);
  s.box(x + 0.86, y + 0.2, z + 0.38, 0.1, 0.1, 0.1, pal, o);
  s.box(x - 0.34, y + 0.1, z, 0.36, 0.12, 0.12, PAL.white, o);
  s.quadX(x + 0.96 + 0.005, y + 0.06, y + 0.12, z + 0.2, z + 0.25, '#1d2547', o);
  s.quadX(x + 0.96 + 0.005, y + 0.22, y + 0.28, z + 0.2, z + 0.25, '#1d2547', o);
}

/** cube-built person. Origin = footprint centre on the floor (or on the seat when sit). */
export function person(
  s: Scene, cx: number, cy: number, z: number, facing: Facing,
  o: { shirt?: Pal; pants?: Pal; hair?: Pal; skin?: Pal; sit?: boolean; glasses?: boolean; beard?: boolean; arms?: 'down' | 'forward' | 'up'; k?: number; cls?: string; style?: string } = {},
) {
  const k = o.k ?? 1, shirt = o.shirt ?? PAL.blue, pants = o.pants ?? PAL.navy, hair = o.hair ?? PAL.ink, skin = o.skin ?? PAL.skin;
  const op: Opts = { cls: o.cls, style: o.style };
  const rg = (a: number, b: number): [number, number] => (a < b ? [a, b] : [b, a]);
  // local (f = forward, l = lateral) -> world box
  const B = (f0: number, f1: number, l0: number, l1: number, z0: number, z1: number, pal: Pal) => {
    f0 *= k; f1 *= k; l0 *= k; l1 *= k;
    let xr: [number, number], yr: [number, number];
    if (facing === '+y') { xr = rg(cx + l0, cx + l1); yr = rg(cy + f0, cy + f1); }
    else if (facing === '-y') { xr = rg(cx - l1, cx - l0); yr = rg(cy - f1, cy - f0); }
    else if (facing === '+x') { xr = rg(cx + f0, cx + f1); yr = rg(cy - l1, cy - l0); }
    else { xr = rg(cx - f1, cx - f0); yr = rg(cy + l0, cy + l1); }
    s.box(xr[0], yr[0], z + z0 * k, xr[1] - xr[0], yr[1] - yr[0], (z1 - z0) * k, pal, op);
  };
  const sit = !!o.sit;
  const hipZ = sit ? 0.78 : 0.78;
  if (!sit) {
    B(-0.14, 0.14, -0.28, -0.02, 0, hipZ, pants); B(-0.14, 0.14, 0.02, 0.28, 0, hipZ, pants);
    B(-0.15, 0.15, -0.3, -0.02, 0, 0.08, PAL.ink); B(-0.15, 0.15, 0.02, 0.3, 0, 0.08, PAL.ink);
  } else {
    B(-0.12, 0.6, -0.28, -0.02, 0.62, hipZ, pants); B(-0.12, 0.6, 0.02, 0.28, 0.62, hipZ, pants);
    B(0.42, 0.7, -0.28, -0.02, 0, 0.62, pants); B(0.42, 0.7, 0.02, 0.28, 0, 0.62, pants);
  }
  const t0 = hipZ, t1 = t0 + 0.78;
  B(-0.17, 0.17, -0.3, 0.3, t0, t1, shirt);
  // arms
  const am = o.arms ?? (sit ? 'forward' : 'down');
  if (am === 'forward') { B(0.05, 0.6, -0.46, -0.3, t1 - 0.3, t1 - 0.12, shirt); B(0.05, 0.6, 0.3, 0.46, t1 - 0.3, t1 - 0.12, shirt); B(0.6, 0.72, -0.46, -0.3, t1 - 0.3, t1 - 0.12, skin); B(0.6, 0.72, 0.3, 0.46, t1 - 0.3, t1 - 0.12, skin); }
  else if (am === 'up') { B(-0.08, 0.08, -0.46, -0.3, t0, t1 - 0.05, shirt); B(-0.08, 0.08, 0.3, 0.46, t1 - 0.05, t1 + 0.55, shirt); B(-0.08, 0.08, 0.3, 0.46, t1 + 0.55, t1 + 0.7, skin); B(-0.08, 0.08, -0.46, -0.3, t0 - 0.12, t0, skin); }
  else { B(-0.08, 0.08, -0.46, -0.3, t0 + 0.12, t1 - 0.05, shirt); B(-0.08, 0.08, 0.3, 0.46, t0 + 0.12, t1 - 0.05, shirt); B(-0.08, 0.08, -0.46, -0.3, t0 - 0.02, t0 + 0.12, skin); B(-0.08, 0.08, 0.3, 0.46, t0 - 0.02, t0 + 0.12, skin); }
  // head
  const h0 = t1, h1 = h0 + 0.54;
  B(-0.27, 0.27, -0.27, 0.27, h0, h1, skin);
  const visibleFront = facing === '+y' || facing === '+x';
  if (visibleFront) {
    B(-0.3, 0.3, -0.3, 0.3, h1 - 0.02, h1 + 0.1, hair); // cap of hair
    B(-0.3, -0.12, -0.3, 0.3, h0 + 0.1, h1, hair); // back hair (not seen but keeps silhouette)
    B(0.18, 0.3, -0.3, -0.18, h1 - 0.16, h1, hair); // side tuft
    const F = 0.27 * k + 0.012; // front plane offset
    const q = (l0: number, l1: number, z0: number, z1: number, fill: string, op2?: Opts & { opacity?: number }) => {
      if (facing === '+y') s.quadY(cy + F, cx + l0 * k, cx + l1 * k, z + z0 * k, z + z1 * k, fill, op2 ?? op);
      else s.quadX(cx + F, cy - l1 * k, cy - l0 * k, z + z0 * k, z + z1 * k, fill, op2 ?? op);
    };
    if (o.beard) q(-0.24, 0.24, h0, h0 + 0.17, '#5b4a44', { ...op, opacity: 0.55 } as Opts);
    if (o.glasses) {
      q(-0.23, -0.04, h0 + 0.26, h0 + 0.4, '#1d2547'); q(0.04, 0.23, h0 + 0.26, h0 + 0.4, '#1d2547');
      q(-0.2, -0.07, h0 + 0.285, h0 + 0.375, '#e8f1ff'); q(0.07, 0.2, h0 + 0.285, h0 + 0.375, '#e8f1ff');
      q(-0.04, 0.04, h0 + 0.35, h0 + 0.375, '#1d2547');
      q(-0.15, -0.1, h0 + 0.3, h0 + 0.35, '#1d2547'); q(0.1, 0.15, h0 + 0.3, h0 + 0.35, '#1d2547');
    } else { q(-0.17, -0.09, h0 + 0.3, h0 + 0.38, '#1d2547'); q(0.09, 0.17, h0 + 0.3, h0 + 0.38, '#1d2547'); }
    q(-0.1, 0.1, h0 + 0.12, h0 + 0.16, '#a14b3f');
  } else {
    B(-0.3, 0.3, -0.3, 0.3, h1 - 0.02, h1 + 0.1, hair);
    B(-0.3, 0.1, -0.3, 0.3, h0 + 0.05, h1, hair);
  }
}

export function rack(s: Scene, x: number, y: number, z: number, w: number, d: number, h: number, leds: string[] = ['#74e3d2', '#ffd480', '#ff9fc2'], cls = 'blink') {
  s.box(x, y, z, w, d, h, PAL.navy);
  const n = Math.floor(h / 0.42);
  for (let i = 0; i < n; i++) {
    const zz = z + 0.2 + i * 0.42;
    s.quadY(y + d + 0.01, x + 0.1, x + w - 0.1, zz, zz + 0.26, '#3b4a7e');
    s.quadY(y + d + 0.02, x + w - 0.3, x + w - 0.16, zz + 0.09, zz + 0.17, leds[i % leds.length], { cls: `${cls} d${i % 4}` });
    s.quadY(y + d + 0.02, x + 0.16, x + 0.5, zz + 0.1, zz + 0.16, '#6f82b8');
    s.quadX(x + w + 0.01, y + 0.1, y + d - 0.1, zz, zz + 0.26, '#26335e');
  }
}

export function crate(s: Scene, x: number, y: number, z: number, k = 0.6, pal: Pal = PAL.wood, o?: Opts) {
  s.box(x, y, z, k, k, k, pal, o);
  s.quadY(y + k + 0.01, x + k * 0.12, x + k * 0.88, z + k * 0.42, z + k * 0.58, PAL.white.l, o);
}

export function cloud(s: Scene, x: number, y: number, z: number, k = 1, o?: Opts) {
  s.box(x, y, z, 1.6 * k, 0.9 * k, 0.5 * k, PAL.white, o);
  s.box(x + 0.35 * k, y + 0.1 * k, z + 0.5 * k, 0.9 * k, 0.7 * k, 0.4 * k, PAL.white, o);
  s.box(x + 1.4 * k, y + 0.2 * k, z + 0.1 * k, 0.7 * k, 0.5 * k, 0.4 * k, PAL.white, o);
}

export function lamp(s: Scene, x: number, y: number, z: number, h = 2.4) {
  s.box(x - 0.2, y - 0.2, z, 0.4, 0.4, 0.07, PAL.navy);
  s.cyl(x, y, z + 0.07, 0.05, h - 0.5, PAL.navy);
  s.pyr(x - 0.3, y - 0.3, z + h - 0.5, 0.6, 0.6, 0.45, PAL.amber);
}

export function mug(s: Scene, x: number, y: number, z: number, pal: Pal = PAL.pink) {
  s.cyl(x, y, z, 0.13, 0.22, pal);
  s.box(x + 0.12, y - 0.03, z + 0.06, 0.08, 0.06, 0.1, pal);
}
