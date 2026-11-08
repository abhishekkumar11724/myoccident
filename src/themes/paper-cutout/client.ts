// Paper cutout behaviour: hero parallax, bookmark scroll-spy, reveal-on-scroll, copy-email, draggable scrapbook.
// Everything is progressive enhancement: with no JS (or reduced motion) the page is static and fully readable.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];

// ------------------------------------------------------------------ hero parallax (transform-only, one CSS variable)
(() => {
  const hero = $('.hero');
  if (!hero || reduce) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const h = hero.offsetHeight || 1;
    const p = Math.min(1, Math.max(0, window.scrollY / h));
    hero.style.setProperty('--p', p.toFixed(4));
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

// ------------------------------------------------------------------ bookmark tabs: current section hangs lower
(() => {
  const links = $$<HTMLAnchorElement>('.tabs a[data-spy]');
  const strip = $('.tabs nav ul');
  if (!links.length) return;
  const byId = new Map(links.map((a) => [a.dataset.spy!, a]));
  const seen = new Set<string>();
  const setCurrent = (id: string | null) => {
    links.forEach((a) => {
      const on = a.dataset.spy === id;
      a.parentElement!.classList.toggle('is-current', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    const a = id ? byId.get(id) : null;
    if (a && strip && strip.scrollWidth > strip.clientWidth) {
      const target = a.offsetLeft - strip.clientWidth / 2 + a.offsetWidth / 2;
      strip.scrollTo({ left: Math.max(0, target), behavior: reduce ? 'auto' : 'smooth' });
    }
  };
  const order = [...byId.keys()];
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) { if (e.isIntersecting) seen.add(e.target.id); else seen.delete(e.target.id); }
    const current = order.filter((id) => seen.has(id));
    setCurrent(current.length ? current[0] : null);
  }, { rootMargin: '-35% 0px -55% 0px' });
  order.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
})();

// ------------------------------------------------------------------ reveal on scroll (stop-motion drop-in)
(() => {
  const items = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
  items.forEach((el) => io.observe(el));
  // safety net: never leave content hidden
  setTimeout(() => $$('.reveal:not(.in)').forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight * 1.2) el.classList.add('in'); }), 1500);
})();

// ------------------------------------------------------------------ copy email
(() => {
  const btn = $<HTMLButtonElement>('[data-copy-email]');
  if (!btn) return;
  const label = $('[data-copy-label]', btn);
  const status = $('.copy-status');
  let timer = 0;
  const addr = () => {
    const a = $<HTMLAnchorElement>('a[data-pf-email]');
    const href = a?.getAttribute('href') || '';
    if (href.startsWith('mailto:')) return href.slice(7);
    const f = $<HTMLFormElement>('form[data-pf-contact]');
    try { return atob(f?.dataset.v || ''); } catch { return ''; }
  };
  btn.addEventListener('click', async () => {
    const text = addr();
    if (!text) return;
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
    }
    if (label) label.textContent = ok ? 'Snipped! Copied' : 'Press Ctrl/Cmd+C';
    if (status) status.textContent = ok ? 'Email address copied to the clipboard.' : 'Could not copy automatically; select the address above and copy it.';
    btn.classList.toggle('is-done', ok);
    clearTimeout(timer);
    timer = window.setTimeout(() => { if (label) label.textContent = 'Copy email'; btn.classList.remove('is-done'); if (status) status.textContent = ''; }, 2400);
  });
})();

// ------------------------------------------------------------------ scrapbook: drag, keyboard nudge, tidy up
(() => {
  const board = $('[data-board]');
  if (!board) return;
  const snaps = $$('[data-snap]', board);
  const pos = new WeakMap<HTMLElement, { x: number; y: number }>();
  const get = (el: HTMLElement) => pos.get(el) ?? { x: 0, y: 0 };
  const set = (el: HTMLElement, x: number, y: number) => {
    pos.set(el, { x, y });
    el.style.setProperty('--x', `${Math.round(x)}px`);
    el.style.setProperty('--y', `${Math.round(y)}px`);
  };
  /** keep the photo inside its scrapbook page */
  const clampTo = (el: HTMLElement, x: number, y: number) => {
    const page = el.closest<HTMLElement>('[data-spage]');
    if (!page) return { x, y };
    const pr = page.getBoundingClientRect(), er = el.getBoundingClientRect(), cur = get(el);
    const dx = x - cur.x, dy = y - cur.y, pad = 4;
    const left = er.left + dx, right = er.right + dx, top = er.top + dy, bottom = er.bottom + dy;
    let nx = x, ny = y;
    if (left < pr.left + pad) nx += pr.left + pad - left;
    if (right > pr.right - pad) nx -= right - (pr.right - pad);
    if (top < pr.top + pad) ny += pr.top + pad - top;
    if (bottom > pr.bottom - pad) ny -= bottom - (pr.bottom - pad);
    return { x: nx, y: ny };
  };

  // accessible roles + roving tabindex per page (arrows move focus, Shift+arrows move the photo)
  $$('[data-spage]', board).forEach((page) => {
    const items = $$<HTMLElement>('[data-snap]', page);
    items.forEach((el, i) => {
      const cap = $('figcaption', el)?.textContent?.trim();
      const alt = $('img', el)?.getAttribute('alt') ?? '';
      el.setAttribute('role', 'group');
      el.setAttribute('aria-roledescription', 'movable photo');
      el.setAttribute('aria-label', cap ? `${cap}. ${alt}` : alt);
      el.tabIndex = i === 0 ? 0 : -1;
    });
  });
  board.addEventListener('keydown', (ev) => {
    const e = ev as KeyboardEvent;
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-snap]');
    if (!el || e.target !== el) return;
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
    if (e.key === 'Home') { e.preventDefault(); set(el, 0, 0); return; }
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    if (e.shiftKey) {
      const step = 18, cur = get(el);
      const dx = e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0;
      const dy = e.key === 'ArrowDown' ? step : e.key === 'ArrowUp' ? -step : 0;
      const n = clampTo(el, cur.x + dx, cur.y + dy);
      set(el, n.x, n.y);
      el.style.zIndex = String(++z);
    } else {
      const page = el.closest('[data-spage]')!;
      const list = $$<HTMLElement>('[data-snap]', page);
      const i = list.indexOf(el), j = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? Math.min(list.length - 1, i + 1) : Math.max(0, i - 1);
      list.forEach((s) => (s.tabIndex = -1));
      list[j].tabIndex = 0; list[j].focus();
    }
  });

  // pointer drag (mouse / pen only; touch keeps native scrolling and the static grid)
  let z = 20;
  const fine = matchMedia('(pointer: fine)').matches;
  const tidyBtn = $<HTMLButtonElement>('[data-tidy]');
  if (!fine) return;
  board.classList.add('can-drag');
  if (tidyBtn) tidyBtn.hidden = false;
  let drag: { el: HTMLElement; sx: number; sy: number; ox: number; oy: number; id: number } | null = null;
  board.addEventListener('pointerdown', (ev) => {
    const e = ev as PointerEvent;
    if (e.pointerType === 'touch' || e.button !== 0) return;
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-snap]');
    if (!el) return;
    e.preventDefault();
    const cur = get(el);
    drag = { el, sx: e.clientX, sy: e.clientY, ox: cur.x, oy: cur.y, id: e.pointerId };
    el.setPointerCapture(e.pointerId);
    el.classList.add('is-drag');
    el.style.zIndex = String(++z);
    el.focus({ preventScroll: true });
    $$<HTMLElement>('[data-snap]', el.closest('[data-spage]')!).forEach((s) => (s.tabIndex = s === el ? 0 : -1));
  });
  board.addEventListener('pointermove', (ev) => {
    const e = ev as PointerEvent;
    if (!drag || e.pointerId !== drag.id) return;
    const n = clampTo(drag.el, drag.ox + (e.clientX - drag.sx), drag.oy + (e.clientY - drag.sy));
    set(drag.el, n.x, n.y);
  });
  const end = (ev: Event) => {
    const e = ev as PointerEvent;
    if (!drag || e.pointerId !== drag.id) return;
    drag.el.classList.remove('is-drag');
    drag = null;
  };
  board.addEventListener('pointerup', end);
  board.addEventListener('pointercancel', end);
  tidyBtn?.addEventListener('click', () => {
    board.classList.add('tidying');
    snaps.forEach((s) => { set(s, 0, 0); s.style.zIndex = ''; });
    window.setTimeout(() => board.classList.remove('tidying'), 700);
  });
})();

export {};
