/**
 * Memphis primitives as inline SVG strings (100x100 viewBox, 4px ink outline that does not scale).
 * Colours come from CSS custom properties so a shape can be recoloured from the stylesheet:  style="--c: var(--pink)".
 * All shapes are decorative: the wrapper is aria-hidden in Page.astro.
 */
const INK = 'var(--ink, #14110f)';
const sw = 'stroke-width="4" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"';
const fillAttr = `fill="var(--c, #ff4fa3)" stroke="${INK}" ${sw}`;

const burstPoints = (() => {
  const pts: string[] = [];
  const n = 8;
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const r = i % 2 === 0 ? 47 : 33;
    pts.push(`${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r).toFixed(1)}`);
  }
  return pts.join(' ');
})();

const BODY: Record<string, string> = {
  circle: `<circle cx="50" cy="50" r="45" ${fillAttr}/>`,
  triangle: `<path d="M50 7 L94 91 H6 Z" ${fillAttr}/>`,
  hex: `<path d="M50 5 L89 27 V73 L50 95 L11 73 V27 Z" ${fillAttr}/>`,
  squircle: `<rect x="6" y="6" width="88" height="88" rx="24" ${fillAttr}/>`,
  dome: `<path d="M5 88 A45 45 0 0 1 95 88 Z" ${fillAttr}/>`,
  semi: `<path d="M5 70 A45 45 0 0 0 95 70 Z" ${fillAttr}/>`,
  burst: `<polygon points="${burstPoints}" ${fillAttr}/>`,
  diamond: `<path d="M50 4 L96 50 L50 96 L4 50 Z" ${fillAttr}/>`,
  bolt: `<path d="M60 4 L16 56 H45 L38 96 L86 40 H57 Z" ${fillAttr}/>`,
  ring: `<path fill-rule="evenodd" d="M50 5 a45 45 0 1 0 0.01 0 Z M50 29 a21 21 0 1 1 -0.01 0 Z" ${fillAttr}/>`,
  plus: `<path d="M38 6 H62 V38 H94 V62 H62 V94 H38 V62 H6 V38 H38 Z" ${fillAttr}/>`,
  squiggle: `<path d="M4 50 q11 -34 23 0 t23 0 t23 0 t23 0" fill="none" stroke="${INK}" stroke-width="14" vector-effect="non-scaling-stroke" stroke-linecap="round"/><path d="M4 50 q11 -34 23 0 t23 0 t23 0 t23 0" fill="none" stroke="var(--c, #19d3c5)" stroke-width="7" vector-effect="non-scaling-stroke" stroke-linecap="round"/>`,
  zigzag: `<path d="M5 72 L27 28 L50 72 L73 28 L95 72" fill="none" stroke="${INK}" stroke-width="14" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 72 L27 28 L50 72 L73 28 L95 72" fill="none" stroke="var(--c, #ffe94a)" stroke-width="7" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>`,
  dots: [0, 1, 2, 3].flatMap((r) => [0, 1, 2, 3].map((c) => `<circle cx="${14 + c * 24}" cy="${14 + r * 24}" r="6" fill="var(--c, #14110f)"/>`)).join(''),
  bubble: `<path d="M12 8 H88 a8 8 0 0 1 8 8 V58 a8 8 0 0 1 -8 8 H52 L30 92 V66 H12 a8 8 0 0 1 -8 -8 V16 a8 8 0 0 1 8 -8 Z" ${fillAttr}/>`,
};

export type ShapeName = keyof typeof BODY;

/** Returns an <svg> string. Use with <Fragment set:html={shape('circle')} /> inside an aria-hidden wrapper. */
export function shape(name: ShapeName | string, cls = ''): string {
  const body = BODY[name] ?? BODY.circle;
  return `<svg class="shape ${cls}" viewBox="0 0 100 100" focusable="false" aria-hidden="true">${body}</svg>`;
}
