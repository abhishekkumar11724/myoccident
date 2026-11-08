/**
 * Build-time SVG helpers for the steampunk theme: gear outlines, dial ticks, a seeded RNG for the patent figures.
 * Everything here runs while Astro renders the page, so no geometry code ships to the browser.
 */
export const rad = (deg: number) => (deg * Math.PI) / 180;
export const n2 = (n: number) => +n.toFixed(2);
/** point on a circle; deg measured clockwise from 12 o'clock */
export const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => [n2(cx + r * Math.sin(rad(deg))), n2(cy - r * Math.cos(rad(deg)))];

export function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const hashStr = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

/** Annular sector path (used for gear spoke windows and gauge colour bands). Angles clockwise from 12 o'clock. */
export function sector(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const [x0, y0] = polar(cx, cy, r1, a0), [x1, y1] = polar(cx, cy, r1, a1), [x2, y2] = polar(cx, cy, r0, a1), [x3, y3] = polar(cx, cy, r0, a0);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M${x0} ${y0}A${r1} ${r1} 0 ${large} 1 ${x1} ${y1}L${x2} ${y2}A${r0} ${r0} 0 ${large} 0 ${x3} ${y3}Z`;
}
export function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const [x0, y0] = polar(cx, cy, r, a0), [x1, y1] = polar(cx, cy, r, a1);
  return `M${x0} ${y0}A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${x1} ${y1}`;
}

/**
 * Even-odd gear path centred on (cx, cy): `teeth` trapezoid teeth between rRoot and rOut,
 * a centre bore, and `windows` spoke cut-outs between the hub and the rim.
 */
export function gearPath(teeth: number, rOut: number, opts: { cx?: number; cy?: number; tooth?: number; bore?: number; windows?: number; hub?: number; rim?: number; spoke?: number } = {}) {
  const { cx = 0, cy = 0 } = opts;
  const pitch = (2 * Math.PI * rOut) / teeth;
  const h = opts.tooth ?? Math.min(9, Math.max(3.2, pitch * 0.34));
  const rRoot = rOut - h;
  const p = (2 * Math.PI) / teeth;
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a = i * p - Math.PI / 2;
    for (const [da, r] of [[-0.31, rRoot], [-0.17, rOut], [0.17, rOut], [0.31, rRoot]] as const) {
      const ang = a + da * p;
      d += `${d ? 'L' : 'M'}${n2(cx + r * Math.cos(ang))} ${n2(cy + r * Math.sin(ang))}`;
    }
  }
  d += 'Z';
  const bore = opts.bore ?? rRoot * 0.14;
  if (bore > 0) d += `M${n2(cx + bore)} ${cy}A${bore} ${bore} 0 1 0 ${n2(cx - bore)} ${cy}A${bore} ${bore} 0 1 0 ${n2(cx + bore)} ${cy}Z`;
  const windows = opts.windows ?? 0;
  if (windows > 0) {
    const hub = opts.hub ?? rRoot * 0.34, rim = opts.rim ?? rRoot * 0.82, spoke = opts.spoke ?? 9;
    const step = 360 / windows;
    for (let k = 0; k < windows; k++) d += sector(cx, cy, hub, rim, k * step + spoke / 2, (k + 1) * step - spoke / 2);
  }
  return { d, rRoot };
}

/** Tick marks for a round dial: returns line segments [x1,y1,x2,y2,major] */
export function ticks(r: number, from: number, to: number, majors: number, minorsBetween: number, majorLen: number, minorLen: number) {
  const out: { x1: number; y1: number; x2: number; y2: number; major: boolean; deg: number }[] = [];
  const total = majors * (minorsBetween + 1);
  for (let i = 0; i <= total; i++) {
    const major = i % (minorsBetween + 1) === 0;
    const deg = from + ((to - from) * i) / total;
    const [x1, y1] = polar(0, 0, r, deg), [x2, y2] = polar(0, 0, r - (major ? majorLen : minorLen), deg);
    out.push({ x1, y1, x2, y2, major, deg });
  }
  return out;
}
