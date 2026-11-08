// Ukiyo-e behaviour: scroll-spy for the rail, "ink in" reveals, emaki scroll controls (buttons, drag, keys) and a print viewer.
// Everything degrades to plain links / visible content without JS; reveals show immediately for reduced motion.

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- reveal on scroll
const revealEls = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
if (reduce || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
  );
  revealEls.forEach((el) => io.observe(el));
  // safety net: never leave content hidden
  window.setTimeout(() => revealEls.forEach((el) => el.classList.add('in')), 6000);
}

// ---- scroll-spy: mark the current section in the rail
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.rail-list a[data-spy]'));
const sections = links.map((a) => document.getElementById(a.dataset.spy!)).filter((s): s is HTMLElement => !!s);
if (sections.length && 'IntersectionObserver' in window) {
  const setCurrent = (id: string | null) => links.forEach((a) => (a.dataset.spy === id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
  const visible = new Map<string, number>();
  const so = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio); else visible.delete(e.target.id);
      }
      let best: string | null = null, bestTop = Infinity;
      for (const id of visible.keys()) {
        const top = Math.abs(document.getElementById(id)!.getBoundingClientRect().top - 120);
        if (top < bestTop) { bestTop = top; best = id; }
      }
      setCurrent(best);
    },
    { rootMargin: '-15% 0px -55% 0px', threshold: [0, 0.01, 0.2] },
  );
  sections.forEach((s) => so.observe(s));
}

// ---- emaki scrolls
// Rows are lazy vertically; once a row approaches the viewport load all of its (horizontally hidden) prints.
{
  const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-emaki]'));
  const warm = (row: HTMLElement) => row.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((im) => { im.loading = 'eager'; });
  if ('IntersectionObserver' in window) {
    const rio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { warm(e.target as HTMLElement); rio.unobserve(e.target); } }), { rootMargin: '700px 0px' });
    rows.forEach((r) => rio.observe(r));
  } else rows.forEach(warm);
}
document.querySelectorAll<HTMLElement>('[data-emaki]').forEach((emaki) => {
  const track = emaki.querySelector<HTMLElement>('.emaki-track');
  if (!track) return;
  const sync = () => emaki.classList.toggle('emaki--fits', track.scrollWidth <= track.clientWidth + 2);
  sync(); window.addEventListener('resize', sync); track.querySelectorAll('img').forEach((im) => im.addEventListener('load', sync));
  const step = () => Math.max(240, Math.round(track.clientWidth * 0.8));
  emaki.querySelectorAll<HTMLButtonElement>('button[data-dir]').forEach((b) =>
    b.addEventListener('click', () => track.scrollBy({ left: Number(b.dataset.dir) * step(), behavior: reduce ? 'auto' : 'smooth' })),
  );

  // mouse drag (touch uses native swipe)
  let down = false, startX = 0, startLeft = 0, moved = false;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) { moved = true; track.classList.add('is-dragging'); }
    if (moved) track.scrollLeft = startLeft - dx;
  });
  const end = () => { down = false; track.classList.remove('is-dragging'); };
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
  track.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
});

// ---- print viewer
const dlg = document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
if (dlg) {
  const slot = dlg.querySelector<HTMLElement>('[data-lb-slot]')!;
  let img: HTMLImageElement | null = null; // created on first open, so the page never carries an image without a source
  const cap = dlg.querySelector<HTMLElement>('[data-lb-cap]')!;
  const toggle = dlg.querySelector<HTMLButtonElement>('[data-lb-toggle]')!;
  let current = { full: '', orig: '', alt: '' }, showingOrig = false;
  const render = () => {
    if (!img) { img = new Image(); img.alt = ''; slot.appendChild(img); }
    img.src = showingOrig ? current.orig : current.full;
    img.alt = showingOrig ? `Original photograph: ${current.alt}` : current.alt;
    toggle.textContent = showingOrig ? 'Back to the woodblock print' : 'Show the original photograph';
  };
  document.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      current = { full: a.dataset.full || a.href, orig: a.dataset.orig || a.href, alt: a.dataset.alt || '' };
      cap.textContent = a.dataset.cap || '';
      showingOrig = false; render(); dlg.showModal();
    }),
  );
  toggle.addEventListener('click', () => { showingOrig = !showingOrig; render(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
}

export {};
