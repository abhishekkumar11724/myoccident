// Steampunk behaviour. Everything here is progressive enhancement: the page is complete without it.
// Reduced motion: gauges jump to their final position, gears stay still, the clock still tells the time (no easing).
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

/* ---- 1. start gauges / gears / sky only while they are on screen -------------------------------------------------- */
const liveEls = $('.spin, .gauge, .meter, .sky');
if (reduce || !('IntersectionObserver' in window)) {
  liveEls.forEach((el) => el.classList.add('is-live'));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const el = e.target as HTMLElement;
      if (el.matches('.gauge, .meter')) { if (e.isIntersecting) { el.classList.add('is-live'); io.unobserve(el); } }
      else el.classList.toggle('is-live', e.isIntersecting);
    }
  }, { rootMargin: '80px 0px', threshold: 0.2 });
  liveEls.forEach((el) => io.observe(el));
}

/* ---- 2. the brass clock: Gurugram time (IST) on the dials, visitor's own time in the readout ---------------------- */
const clocks = $<SVGElement>('svg.clock');
const digital = $('[data-clock-digital]');
const localOut = $('[data-clock-local]');
const dayOut = $('[data-clock-day]');
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
const fmtLocal = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
const fmtDay = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'long' });
const acc = new WeakMap<Element, number>();
// keep each hand's angle monotonic so it never spins backwards across 12
const mono = (el: Element, next: number) => {
  let prev = acc.get(el);
  if (prev === undefined) prev = next;
  let v = next;
  while (v < prev - 180) v += 360;
  acc.set(el, v);
  return v;
};
function tick() {
  const now = new Date();
  const parts = Object.fromEntries(fmt.formatToParts(now).filter((p) => p.type !== 'literal').map((p) => [p.type, Number(p.value)])) as Record<string, number>;
  const h = (parts.hour ?? 0) % 12, m = parts.minute ?? 0, s = parts.second ?? 0;
  const aS = s * 6, aM = m * 6 + s * 0.1, aH = h * 30 + m * 0.5;
  for (const c of clocks) {
    const hs = c.querySelector('.hand-s'), hm = c.querySelector('.hand-m'), hh = c.querySelector('.hand-h');
    if (hs) (hs as SVGElement).style.setProperty('--r', mono(hs, aS) + 'deg');
    if (hm) (hm as SVGElement).style.setProperty('--r', mono(hm, aM) + 'deg');
    if (hh) (hh as SVGElement).style.setProperty('--r', mono(hh, aH) + 'deg');
  }
  const hhmm = `${String(parts.hour ?? 0).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  digital.forEach((el) => { el.textContent = hhmm; });
  localOut.forEach((el) => { el.textContent = fmtLocal.format(now); });
  dayOut.forEach((el) => { el.textContent = `${fmtDay.format(now)}, IST`; });
}
if (clocks.length || digital.length) {
  tick();
  let timer = window.setInterval(tick, 1000);
  document.addEventListener('visibilitychange', () => {
    window.clearInterval(timer);
    if (!document.hidden) { tick(); timer = window.setInterval(tick, 1000); }
  });
}

/* ---- 3. nav: amber lamp for the section in view, valve (menu) toggle on small screens ----------------------------- */
const keys = $<HTMLAnchorElement>('.key');
const byId = new Map(keys.map((k) => [k.dataset.nav, k]));
const sections = keys.map((k) => document.getElementById(k.dataset.nav || '')).filter(Boolean) as HTMLElement[];
if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      keys.forEach((k) => { k.classList.remove('is-active'); k.removeAttribute('aria-current'); });
      const k = byId.get(e.target.id);
      if (k) { k.classList.add('is-active'); k.setAttribute('aria-current', 'true'); }
    }
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((s) => spy.observe(s));
}
const valve = document.querySelector<HTMLButtonElement>('[data-valve]');
const nav = document.getElementById('primary-nav');
const setOpen = (open: boolean) => { valve?.setAttribute('aria-expanded', String(open)); nav?.classList.toggle('is-open', open); };
valve?.addEventListener('click', () => setOpen(valve.getAttribute('aria-expanded') !== 'true'));
keys.forEach((k) => k.addEventListener('click', () => setOpen(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

/* ---- 4. big cogs in the hero turn with the page scroll -------------------------------------------------------------- */
const turners = $('[data-turn]');
if (!reduce && turners.length) {
  let queued = false;
  const apply = () => {
    queued = false;
    const y = window.scrollY;
    if (y > 1600) return;
    for (const el of turners) el.style.transform = `rotate(${(y * Number(el.dataset.turn)).toFixed(2)}deg)`;
  };
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(apply); } }, { passive: true });
}

/* ---- 5. photo viewer: brass frame, prev/next, "develop in colour" ------------------------------------------------------- */
const dlg = document.querySelector<HTMLDialogElement>('[data-viewer-dlg]');
const links = $<HTMLAnchorElement>('a[data-viewer]');
if (dlg && links.length) {
  const img = dlg.querySelector<HTMLImageElement>('.viewer-frame img')!;
  const cap = dlg.querySelector<HTMLElement>('.viewer-cap')!;
  const tog = dlg.querySelector<HTMLButtonElement>('[data-v-tog]')!;
  let idx = 0, original = false;
  const show = () => {
    const a = links[idx];
    img.src = original ? (a.dataset.orig || a.href) : a.href;
    img.alt = a.dataset.alt || '';
    cap.textContent = a.dataset.cap || a.dataset.alt || '';
    tog.setAttribute('aria-pressed', String(original));
    tog.textContent = original ? 'Back to sepia' : 'Develop in colour';
  };
  const step = (d: number) => { idx = (idx + d + links.length) % links.length; original = false; show(); };
  links.forEach((a, i) => a.addEventListener('click', (e) => {
    e.preventDefault(); idx = i; original = false; show();
    if (typeof dlg.showModal === 'function') dlg.showModal(); else window.open(a.href, '_blank', 'noopener');
  }));
  dlg.querySelector('[data-v-prev]')?.addEventListener('click', () => step(-1));
  dlg.querySelector('[data-v-next]')?.addEventListener('click', () => step(1));
  tog.addEventListener('click', () => { original = !original; show(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1); });
}

/* ---- 6. telegram: a running word count, like a telegraph clerk charging by the word ----------------------------------- */
const ta = document.querySelector<HTMLTextAreaElement>('form[data-pf-contact] textarea');
if (ta) {
  const meter = document.createElement('p');
  meter.className = 'tg-meter';
  meter.setAttribute('aria-hidden', 'true');
  ta.insertAdjacentElement('afterend', meter);
  const count = () => { const n = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0; meter.textContent = `${n} ${n === 1 ? 'word' : 'words'} - transmitted free of charge`; };
  ta.addEventListener('input', count);
  count();
}
