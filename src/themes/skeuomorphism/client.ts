// Skeuomorphism behaviour: lamp switch (day/night), key scroll-spy, rolling odometers + swinging needles (once),
// Finder icon/list toggle, topic chips on the notepad, and a small photo viewer. Vanilla, ~3KB.
// Reduced motion: the CSS already renders final values; here we only skip scrolling animation in the viewer.

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- lamp switch: day <-> night desk light (remembered)
const lamp = document.querySelector<HTMLButtonElement>('[data-lamp]');
const syncLamp = () => {
  const night = root.getAttribute('data-light') === 'night';
  lamp?.setAttribute('aria-checked', String(night));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', night ? '#1a1008' : '#6b4426');
};
syncLamp();
lamp?.addEventListener('click', () => {
  const next = root.getAttribute('data-light') === 'night' ? 'day' : 'night';
  root.setAttribute('data-light', next);
  try { localStorage.setItem('sk-light', next); } catch { /* private mode */ }
  syncLamp();
});

// ---- key scroll-spy: the pressed key follows the section in view
const keys = new Map<string, HTMLAnchorElement>();
document.querySelectorAll<HTMLAnchorElement>('a.key[data-spy]').forEach((a) => keys.set(a.dataset.spy!, a));
const sections = [...keys.keys()].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
let currentId = '';
const setCurrent = (id: string) => {
  if (id === currentId) return;
  currentId = id;
  keys.forEach((a, k) => (k === id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
  const a = keys.get(id);
  const scroller = (a ?? document.querySelector<HTMLElement>('a.key'))?.closest<HTMLElement>('.keys');
  if (!a && scroller) scroller.scrollTo({ left: 0, behavior: reduce ? 'auto' : 'smooth' });
  if (a && scroller && scroller.scrollWidth > scroller.clientWidth) {
    scroller.scrollTo({ left: a.offsetLeft - scroller.clientWidth / 2 + a.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
  }
};
const onScroll = () => {
  const y = window.innerHeight * 0.35;
  let found = '';
  for (const s of sections) { const r = s.getBoundingClientRect(); if (r.top <= y && r.bottom > y) found = s.id; }
  setCurrent(found);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- odometers + gauges: roll in once when scrolled into view
const rollers = document.querySelectorAll<HTMLElement>('[data-roll]');
if ('IntersectionObserver' in window && rollers.length) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { (e.target as HTMLElement).classList.add('on'); io.unobserve(e.target); }
  }, { threshold: 0.2 });
  rollers.forEach((r) => io.observe(r));
} else rollers.forEach((r) => r.classList.add('on'));

// ---- Finder window: icon view / list view
const aqua = document.querySelector<HTMLElement>('.aqua');
document.querySelectorAll<HTMLButtonElement>('[data-view-btn]').forEach((b) =>
  b.addEventListener('click', () => {
    aqua?.setAttribute('data-view', b.dataset.viewBtn!);
    document.querySelectorAll<HTMLButtonElement>('[data-view-btn]').forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
  })
);

// ---- notepad topic chips: write a "Re:" line into the message
const msg = document.querySelector<HTMLTextAreaElement>('#pf-message');
const chips = [...document.querySelectorAll<HTMLButtonElement>('.chip[data-topic]')];
const reLine = /^Re: [^\n]*\n\n?/;
chips.forEach((c) =>
  c.addEventListener('click', () => {
    const on = c.getAttribute('aria-pressed') !== 'true';
    chips.forEach((o) => o.setAttribute('aria-pressed', String(o === c && on)));
    if (!msg) return;
    const body = msg.value.replace(reLine, '');
    msg.value = on ? `Re: ${c.dataset.topic}\n\n${body}` : body;
  })
);

// ---- photo viewer
type P = { src: string; w: number; h: number; alt: string; cap: string };
const dlg = document.querySelector<HTMLDialogElement>('dialog.viewer');
const data: P[] = (() => { try { return JSON.parse(document.getElementById('sk-photos')?.textContent || '[]'); } catch { return []; } })();
let idx = 0;
const show = (i: number) => {
  if (!dlg || !data.length) return;
  idx = (i + data.length) % data.length;
  const p = data[idx];
  let img = dlg.querySelector('img');
  if (!img) { img = document.createElement('img'); dlg.querySelector('.viewer-print')!.prepend(img); }
  img.src = p.src; img.width = p.w; img.height = p.h; img.alt = p.alt;
  dlg.querySelector('figcaption')!.textContent = p.cap;
};
document.querySelectorAll<HTMLButtonElement>('[data-open]').forEach((b) =>
  b.addEventListener('click', () => { show(Number(b.dataset.open)); dlg?.showModal(); })
);
dlg?.querySelector('[data-viewer="prev"]')?.addEventListener('click', () => show(idx - 1));
dlg?.querySelector('[data-viewer="next"]')?.addEventListener('click', () => show(idx + 1));
dlg?.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
dlg?.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') show(idx - 1);
  if (e.key === 'ArrowRight') show(idx + 1);
});
