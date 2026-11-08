/**
 * Scissor-cut helpers (build time). Every cut-out on the page gets its own slightly wrong polygon, generated from a
 * seed, so no two pieces of "paper" share the same edge. Output goes into a CSS custom property (--cut) and is used by
 * `clip-path: var(--cut)`.
 */
export function rng(seed: number) {
  let a = (seed * 2654435761) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const px = (n: number) => `${Math.round(n * 10) / 10}px`;
const pc = (n: number) => `${Math.round(n * 10) / 10}%`;

/** Rectangle with wobbly straight cuts. nx/ny = extra vertices per side, j = edge jitter in px, jc = corner jitter in px. */
export function cutPoly(seed: number, { nx = 4, ny = 2, j = 2, jc = 3 }: { nx?: number; ny?: number; j?: number; jc?: number } = {}) {
  const r = rng(seed);
  const e = (k = j) => r() * k;
  const pts: string[] = [];
  pts.push(`${px(e(jc))} ${px(e(jc))}`);
  for (let i = 1; i <= nx; i++) pts.push(`${pc((i / (nx + 1)) * 100 + (r() - 0.5) * 4)} ${px(e())}`);
  pts.push(`calc(100% - ${px(e(jc))}) ${px(e(jc))}`);
  for (let i = 1; i <= ny; i++) pts.push(`calc(100% - ${px(e())}) ${pc((i / (ny + 1)) * 100 + (r() - 0.5) * 6)}`);
  pts.push(`calc(100% - ${px(e(jc))}) calc(100% - ${px(e(jc))})`);
  for (let i = nx; i >= 1; i--) pts.push(`${pc((i / (nx + 1)) * 100 + (r() - 0.5) * 4)} calc(100% - ${px(e())})`);
  pts.push(`${px(e(jc))} calc(100% - ${px(e(jc))})`);
  for (let i = ny; i >= 1; i--) pts.push(`${px(e())} ${pc((i / (ny + 1)) * 100 + (r() - 0.5) * 6)}`);
  return `polygon(${pts.join(', ')})`;
}

/** Cookie / scalloped circle: lobes bumps around a circle (for round stickers and stamps). */
export function cookie(seed: number, lobes = 12, depth = 3.2, steps = 96) {
  const r = rng(seed);
  const phase = r() * Math.PI * 2;
  const pts: string[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const rad = 46.5 - depth + depth * (0.5 + 0.5 * Math.cos(lobes * a + phase)) + (r() - 0.5) * 0.4;
    pts.push(`${pc(50 + Math.cos(a) * rad)} ${pc(50 + Math.sin(a) * rad)}`);
  }
  return `polygon(${pts.join(', ')})`;
}

/** Blobby circle (irregular hand-cut disc). */
export function blob(seed: number, wobble = 3, steps = 48) {
  const r = rng(seed);
  const k = [r() * 6.28, r() * 6.28, r() * 6.28];
  const pts: string[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const rad = 46 + wobble * (0.5 * Math.sin(2 * a + k[0]) + 0.3 * Math.sin(3 * a + k[1]) + 0.2 * Math.sin(5 * a + k[2]));
    pts.push(`${pc(50 + Math.cos(a) * rad)} ${pc(50 + Math.sin(a) * rad)}`);
  }
  return `polygon(${pts.join(', ')})`;
}

/** Pick from a list by index (cycling). */
export const pick = <T,>(list: readonly T[], i: number): T => list[((i % list.length) + list.length) % list.length];
/** Small deterministic rotation in degrees. */
export const tilt = (seed: number, max = 3) => Math.round((rng(seed)() - 0.5) * 2 * max * 10) / 10;
