// Art Nouveau behaviour: growing gilt vines in the gutters, header stem, reveal-on-scroll, nav spy, mobile index, lightbox.
// Everything degrades to a static page: reduced motion draws the vines fully and shows all content; no JS keeps a CSS vine tile.

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const NS = 'http://www.w3.org/2000/svg';
function se<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  return e;
}
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ reveal on scroll */
let rv = [...document.querySelectorAll<HTMLElement>('.rv')];
if (reduce || !('IntersectionObserver' in window)) { rv.forEach((e) => e.classList.add('in')); rv = []; }
else {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }),
    { threshold: 0.06, rootMargin: '0px 0px -5% 0px' },
  );
  rv.forEach((e) => io.observe(e));
}
/** safety net for jumps / fast scrolling: anything at or above the viewport's lower edge is revealed */
function revealPassed() {
  if (!rv.length) return;
  const lim = innerHeight * 0.97;
  rv = rv.filter((e) => { if (e.getBoundingClientRect().top < lim) { e.classList.add('in'); return false; } return true; });
}

/* ------------------------------------------------------------------ header: progress stem, mobile index, nav spy */
const bar = document.querySelector<HTMLElement>('.bar');
const menuBtn = document.querySelector<HTMLButtonElement>('.bar-menu');
const setMenu = (open: boolean) => { bar?.classList.toggle('open', open); menuBtn?.setAttribute('aria-expanded', String(open)); };
menuBtn?.addEventListener('click', () => setMenu(!bar?.classList.contains('open')));
document.querySelectorAll<HTMLAnchorElement>('.bar-nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

const links = new Map<string, HTMLAnchorElement>();
document.querySelectorAll<HTMLAnchorElement>('.bar-nav a[data-spy]').forEach((a) => links.set(a.dataset.spy!, a));
if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a, id) => { const on = id === en.target.id; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    }),
    { rootMargin: '-30% 0px -60% 0px' },
  );
  links.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  const heroEl = document.getElementById('hero');
  if (heroEl) new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) links.forEach((a) => { a.classList.remove('on'); a.removeAttribute('aria-current'); }); }, { rootMargin: '-30% 0px -60% 0px' }).observe(heroEl);
}

/* ------------------------------------------------------------------ gilt vines in the gutters */
type Grow = { el: SVGElement; y: number };
interface Vine {
  host: HTMLElement; W: number; H: number; stem: SVGPathElement; total: number;
  table: { len: number; x: number; y: number }[]; grows: Grow[]; bud: SVGGElement;
}
const stage = document.querySelector<HTMLElement>('.stage');
let vines: Vine[] = [];

function build(host: HTMLElement): Vine | null {
  host.replaceChildren();
  const W = Math.round(host.clientWidth), H = Math.round(host.clientHeight);
  if (W < 26 || H < 300) return null;
  const side = host.dataset.vine === 'r' ? -1 : 1;
  const rnd = mulberry32(side === 1 ? 11 : 29);
  const svg = se('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, 'aria-hidden': 'true', focusable: 'false' });
  svg.style.height = `${H}px`;

  const cx = W / 2 + side * (W > 90 ? 6 : 2);
  const A = Math.min(W * 0.24, 26);
  const L = 250;
  let d = `M${cx.toFixed(1)} 0`;
  let s = side;
  const segs: { y: number; s: number }[] = [];
  for (let y = 0; y < H + L; y += L) {
    d += ` C ${(cx + s * A).toFixed(1)} ${(y + L / 3).toFixed(1)} ${(cx + s * A).toFixed(1)} ${(y + (2 * L) / 3).toFixed(1)} ${cx.toFixed(1)} ${y + L}`;
    segs.push({ y, s });
    s = -s;
  }
  const shadow = se('path', { d, class: 'v-shadow', transform: 'translate(2 2)' });
  const stem = se('path', { d, class: 'v-stem' });
  svg.append(shadow, stem);

  const grows: Grow[] = [];
  const place = (id: string, x: number, y: number, rot: number, sc: number) => {
    const g = se('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})` });
    const u = se('use', { href: `#${id}`, class: 'v-grow' });
    u.style.setProperty('--s', sc.toFixed(3));
    g.append(u);
    svg.append(g);
    grows.push({ el: u, y });
  };

  const wide = W >= 96;
  // every leaf points AWAY from the folio (so nothing is tucked under the page edge) and is sized to the room it has
  const outAng = (base: number, spread: number) => -side * (base + rnd() * spread);
  const room = (x: number) => (side === 1 ? x : W - x) - 3; // distance from x to the outer edge of the gutter
  segs.forEach((seg, i) => {
    const bx = cx + seg.s * A * 0.75; // bulge
    const by = seg.y + L / 2;
    const outer = i % 2 === 1; // odd bulges lean away from the folio
    const k = Math.floor(i / 2) % 3;
    if (outer && k === 1 && wide) place('n-iris', bx, by - 4, outAng(96, 12), clamp(room(bx) / 0.92 / 190, 0.2, 0.3));
    else place('n-leaf', bx, by, outAng(112, 26), clamp(room(bx) / 0.9 / 94, 0.3, 0.8) * (0.85 + rnd() * 0.2));
    // smaller second leaf near the crossing, also leaning outward
    const cy = seg.y + L * 0.2;
    const lx = cx - seg.s * A * 0.2;
    place('n-leaf', lx, cy, outAng(100, 24), clamp(room(lx) / 0.92 / 94, 0.28, 0.6) * (0.8 + rnd() * 0.2));
    // tendril on the crossing, every other segment
    if (i % 2 === 1) place('n-curl', cx, seg.y + 4, outAng(70, 20), clamp(W / 150, 0.34, 0.62));
    if (i % 4 === 2 && wide) place('n-bud', cx - seg.s * A * 0.3, seg.y + L * 0.78, outAng(140, 20), 0.55);
  });
  // a dragonfly resting on the vine, a peacock feather further down (only where the gutter is wide enough)
  if (wide) {
    place('n-dragonfly', cx - side * (W * 0.12), H * (side === 1 ? 0.19 : 0.31), side * 22, clamp(W / 330, 0.28, 0.5));
    place('n-feather', cx + side * 2, H * (side === 1 ? 0.54 : 0.74), side * -168, clamp(W / 380, 0.28, 0.46));
  }

  // growth tip: a bud that leads the stem down the page
  const bud = se('g');
  const budUse = se('use', { href: '#n-bud', transform: 'rotate(180) scale(.7)' });
  bud.append(budUse);
  svg.append(bud);
  host.append(svg);

  // y -> stroke length lookup
  const total = stem.getTotalLength();
  const table: Vine['table'] = [];
  for (let len = 0; len <= total; len += 18) { const p = stem.getPointAtLength(len); table.push({ len, x: p.x, y: p.y }); }
  stem.style.strokeDasharray = `${total}`;
  stem.style.strokeDashoffset = `${total}`;
  shadow.style.strokeDasharray = `${total}`;
  shadow.style.strokeDashoffset = `${total}`;
  return { host, W, H, stem: stem, total, table, grows, bud };
}

function lenAtY(v: Vine, y: number) {
  const t = v.table;
  if (y <= 0) return { len: 0, x: t[0].x, y: 0 };
  let lo = 0, hi = t.length - 1;
  while (lo < hi) { const m = (lo + hi) >> 1; if (t[m].y < y) lo = m + 1; else hi = m; }
  const a = t[Math.max(0, lo - 1)], b = t[lo];
  const u = b.y === a.y ? 0 : clamp((y - a.y) / (b.y - a.y));
  return { len: a.len + (b.len - a.len) * u, x: a.x + (b.x - a.x) * u, y };
}

function draw() {
  if (!stage || !vines.length) return;
  const top = stage.getBoundingClientRect().top + scrollY;
  const tip = reduce ? Infinity : scrollY + innerHeight * 0.92 - top;
  for (const v of vines) {
    const q = reduce || tip >= v.H ? { len: v.total, x: v.table[v.table.length - 1].x, y: v.H } : lenAtY(v, tip);
    const off = `${v.total - q.len}`;
    v.stem.style.strokeDashoffset = off;
    (v.stem.previousSibling as SVGPathElement).style.strokeDashoffset = off;
    v.bud.setAttribute('transform', `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`);
    v.bud.style.opacity = reduce || tip >= v.H || tip <= 0 ? '0' : '1';
    for (const g of v.grows) {
      const on = reduce || g.y < tip - 36;
      if (on !== g.el.classList.contains('on')) g.el.classList.toggle('on', on);
    }
  }
}

function rebuild() {
  vines = [...document.querySelectorAll<HTMLElement>('.vine')].map(build).filter((v): v is Vine => !!v);
  draw();
}

let raf = 0;
const onScroll = () => {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    draw();
    revealPassed();
    if (bar) bar.style.setProperty('--prog', clamp(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)).toFixed(4));
  });
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (stage) {
  rebuild();
  let lastW = innerWidth, lastH = stage.offsetHeight, timer = 0;
  new ResizeObserver(() => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      const h = stage.offsetHeight;
      if (Math.abs(h - lastH) > 30 || innerWidth !== lastW) { lastH = h; lastW = innerWidth; rebuild(); }
    }, 220);
  }).observe(stage);
  addEventListener('load', () => { lastH = stage.offsetHeight; rebuild(); });
}

/* ------------------------------------------------------------------ lightbox */
const dlg = document.querySelector<HTMLDialogElement>('dialog[data-lightbox-dialog]');
if (dlg) {
  const items = [...document.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]')];
  const img = document.createElement('img'); // only attached when the viewer opens, so the page has no empty <img> before that
  img.alt = '';
  const frame = dlg.querySelector('[data-lb-frame]')!;
  const cap = dlg.querySelector<HTMLElement>('[data-lb-cap]')!;
  const tog = dlg.querySelector<HTMLButtonElement>('[data-lb-toggle]')!;
  let idx = 0, orig = false;
  const show = (i: number) => {
    idx = (i + items.length) % items.length;
    const a = items[idx];
    if (!img.isConnected) frame.append(img);
    img.src = orig ? a.dataset.orig! : a.dataset.full!;
    img.alt = a.dataset.alt || '';
    cap.textContent = a.dataset.cap || '';
    tog.textContent = orig ? 'Back to the lithograph' : 'Show the original photograph';
  };
  items.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); orig = false; show(i); dlg.showModal(); }));
  tog.addEventListener('click', () => { orig = !orig; show(idx); });
  dlg.querySelector('[data-lb-prev]')?.addEventListener('click', () => { orig = false; show(idx - 1); });
  dlg.querySelector('[data-lb-next]')?.addEventListener('click', () => { orig = false; show(idx + 1); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { orig = false; show(idx - 1); }
    if (e.key === 'ArrowRight') { orig = false; show(idx + 1); }
  });
}
