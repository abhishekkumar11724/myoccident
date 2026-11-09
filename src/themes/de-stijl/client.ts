// De Stijl behaviour: case-study tiles open their white field, scroll-spy for the bar, mobile menu, photo viewer.
// Everything degrades to plain HTML without JS (panels simply stay open). Reduced motion: no animation classes are added.
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- case studies: one open at a time; tile <-> panel pairs ------------------------------------------- */
const cs = document.querySelector<HTMLElement>('[data-cs]');
if (cs) {
  const tabs = $$<HTMLButtonElement>('[data-cs-tab]', cs);
  const panelOf = (t: HTMLButtonElement) => document.getElementById(t.getAttribute('aria-controls')!)!;
  const open = (t: HTMLButtonElement, focus = false) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-expanded', String(on));
      const p = panelOf(x);
      p.classList.toggle('is-open', on);
      p.classList.remove('fresh');
    });
    const p = panelOf(t);
    if (!reduce) { void p.offsetWidth; p.classList.add('fresh'); }
    // on narrow screens the panel opens under its tile: keep the tile in view
    if (matchMedia('(max-width: 1079px)').matches) {
      const top = t.getBoundingClientRect().top;
      if (top < 70 || top > innerHeight * 0.6) t.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
    }
    if (focus) t.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => {
      // narrow screens behave as an accordion: clicking the open tile closes it
      const narrow = matchMedia('(max-width: 1079px)').matches;
      if (narrow && t.getAttribute('aria-expanded') === 'true') {
        t.setAttribute('aria-expanded', 'false');
        panelOf(t).classList.remove('is-open');
        return;
      }
      open(t);
    });
    t.addEventListener('keydown', (e) => {
      const k = e.key;
      if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(k)) return;
      e.preventDefault();
      const n = k === 'Home' ? 0 : k === 'End' ? tabs.length - 1 : (i + (k === 'ArrowRight' || k === 'ArrowDown' ? 1 : -1) + tabs.length) % tabs.length;
      open(tabs[n], true);
    });
  });
}

/* ---- scroll spy -------------------------------------------------------------------------------------- */
const spy = $$<HTMLAnchorElement>('[data-spy]');
const map = new Map<Element, HTMLAnchorElement>();
spy.forEach((a) => { const s = document.getElementById(a.dataset.spy!); if (s) map.set(s, a); });
const vis = new Set<Element>();
const paint = () => {
  const cur = [...map.keys()].filter((s) => vis.has(s)).pop();
  spy.forEach((a) => a.removeAttribute('aria-current'));
  if (cur) map.get(cur)!.setAttribute('aria-current', 'true');
};
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => { es.forEach((e) => (e.isIntersecting ? vis.add(e.target) : vis.delete(e.target))); paint(); }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_a, s) => io.observe(s));
}

/* ---- mobile menu closes on choice ---------------------------------------------------------------------- */
const menuT = document.querySelector<HTMLInputElement>('.bar-menu-t');
document.querySelector('.bar-menu-grid')?.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a') && menuT) menuT.checked = false; });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuT?.checked) { menuT.checked = false; menuT.focus(); } });

/* ---- photo viewer ------------------------------------------------------------------------------------- */
const dlg = document.querySelector<HTMLDialogElement>('[data-lb-dialog]');
if (dlg) {
  const tiles = $$<HTMLButtonElement>('button[data-lb]');
  const img = dlg.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const cap = dlg.querySelector<HTMLElement>('[data-lb-cap]')!;
  const orig = dlg.querySelector<HTMLButtonElement>('[data-lb-orig]')!;
  let idx = 0;
  let showOrig = false;
  const render = () => {
    const t = tiles[idx];
    img.alt = t.dataset.alt ?? '';
    img.src = showOrig ? t.dataset.orig! : t.dataset.full!;
    cap.textContent = `${String(idx + 1).padStart(2, '0')} / ${tiles.length}${t.dataset.cap ? '  -  ' + t.dataset.cap : ''}`;
    orig.setAttribute('aria-pressed', String(showOrig));
    orig.textContent = showOrig ? 'Neoplastic print' : 'Original colours';
  };
  const open = (i: number) => { idx = (i + tiles.length) % tiles.length; showOrig = false; render(); if (!dlg.open) dlg.showModal(); };
  tiles.forEach((t, i) => t.addEventListener('click', () => open(i)));
  orig.addEventListener('click', () => { showOrig = !showOrig; render(); });
  dlg.querySelector('[data-lb-prev]')?.addEventListener('click', () => open(idx - 1));
  dlg.querySelector('[data-lb-next]')?.addEventListener('click', () => open(idx + 1));
  dlg.querySelector('[data-lb-close]')?.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { open(idx + 1); }
    else if (e.key === 'ArrowLeft') { open(idx - 1); }
  });
  dlg.addEventListener('close', () => tiles[idx]?.focus({ preventScroll: true }));
}
