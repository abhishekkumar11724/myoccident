// Bauhaus behaviour: master/detail switching, scroll spy, scroll-linked shape slides, reveal bars, photo viewer.
// Everything degrades to plain HTML without JS. Reduced motion: no scroll-linked transforms.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

/* ---- master / detail: hover or focus a list item to swap the preview / panel --------------------------- */
function initSwitch(root: HTMLElement) {
  const links = $$<HTMLAnchorElement>('[data-sw]', root);
  const targets = $$('[data-pv]', root);
  const set = (id: string) => {
    links.forEach((a) => a.classList.toggle('is-on', a.dataset.sw === id));
    targets.forEach((t) => t.classList.toggle('is-on', t.dataset.pv === id));
  };
  const wide = matchMedia('(min-width: 921px)');
  links.forEach((a) => {
    const id = a.dataset.sw!;
    a.addEventListener('mouseenter', () => wide.matches && set(id));
    a.addEventListener('focus', () => wide.matches && set(id));
    // case studies: click selects instead of jumping (the panel is already beside the list)
    if (root.classList.contains('bh-works')) {
      a.addEventListener('click', (e) => {
        if (!wide.matches) return;
        e.preventDefault();
        set(id);
      });
    }
  });
}
$$('[data-switch]').forEach(initSwitch);

/* ---- sticky bar: current section ----------------------------------------------------------------- */
const spyLinks = $$<HTMLAnchorElement>('[data-spy]');
const spyMap = new Map<Element, HTMLAnchorElement>();
spyLinks.forEach((a) => {
  const sec = document.getElementById(a.dataset.spy!);
  if (sec) spyMap.set(sec, a);
});
const visible = new Set<Element>();
const paintSpy = () => {
  // the last visible section in document order wins
  const order = [...spyMap.keys()];
  const current = order.filter((s) => visible.has(s)).pop();
  spyLinks.forEach((a) => a.removeAttribute('aria-current'));
  if (current) spyMap.get(current)!.setAttribute('aria-current', 'true');
};
if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      paintSpy();
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  spyMap.forEach((_a, sec) => spy.observe(sec));
}

/* ---- mobile menu closes on choice -------------------------------------------------------------------- */
const menu = document.querySelector<HTMLDetailsElement>('[data-menu]');
menu?.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('a')) menu.open = false;
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu?.open) { menu.open = false; menu.querySelector('summary')?.focus(); } });

/* ---- reveal: bars draw in --------------------------------------------------------------------------- */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
    { threshold: 0, rootMargin: '0px 0px -6% 0px' },
  );
  $$('[data-reveal], .bh-chron').forEach((el) => io.observe(el));
} else {
  $$('[data-reveal], .bh-chron').forEach((el) => el.classList.add('in'));
}

/* ---- scroll-linked slides for decorative shapes (-1 .. 1 across the viewport) ------------------------ */
if (!reduce) {
  const slides = $$('[data-slide]');
  const live = new Set<HTMLElement>();
  let ticking = false;
  const paint = () => {
    ticking = false;
    const vh = innerHeight;
    live.forEach((el) => {
      const host = el.parentElement!;
      const r = host.getBoundingClientRect();
      const p = Math.max(-1, Math.min(1, ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2)));
      el.style.setProperty('--sp', String(-p));
    });
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
  if ('IntersectionObserver' in window) {
    const vis = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? live.add(e.target as HTMLElement) : live.delete(e.target as HTMLElement)));
      req();
    }, { rootMargin: '10% 0px' });
    slides.forEach((s) => vis.observe(s));
    addEventListener('scroll', req, { passive: true });
    addEventListener('resize', req);
  }
}

/* ---- photo viewer ---------------------------------------------------------------------------------- */
const dlg = document.querySelector<HTMLDialogElement>('[data-lightbox]');
if (dlg) {
  const tiles = $$<HTMLAnchorElement>('a[data-lb]');
  const stage = dlg.querySelector<HTMLElement>('[data-lb-stage]')!;
  const noEl = dlg.querySelector<HTMLElement>('[data-lb-no]')!;
  const capEl = dlg.querySelector<HTMLElement>('[data-lb-cap]')!;
  const toggle = dlg.querySelector<HTMLButtonElement>('[data-lb-toggle]')!;
  let idx = 0;
  let showOriginal = false;
  const render = () => {
    const a = tiles[idx];
    const img = new Image();
    img.alt = a.dataset.alt ?? '';
    img.src = showOriginal ? a.href : (a.dataset.print ?? a.href);
    stage.replaceChildren(img);
    noEl.textContent = a.dataset.no ?? '';
    capEl.textContent = a.dataset.cap ?? '';
    toggle.setAttribute('aria-pressed', String(showOriginal));
    toggle.textContent = showOriginal ? 'Show print' : 'Show original';
  };
  const open = (i: number) => { idx = (i + tiles.length) % tiles.length; showOriginal = true; render(); if (!dlg.open) dlg.showModal(); };
  tiles.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); open(i); }));
  toggle.addEventListener('click', () => { showOriginal = !showOriginal; render(); });
  dlg.querySelector('[data-lb-prev]')?.addEventListener('click', () => open(idx - 1));
  dlg.querySelector('[data-lb-next]')?.addEventListener('click', () => open(idx + 1));
  dlg.querySelector('[data-lb-close]')?.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') open(idx + 1);
    else if (e.key === 'ArrowLeft') open(idx - 1);
  });
  dlg.addEventListener('close', () => tiles[idx]?.focus({ preventScroll: true }));
}
