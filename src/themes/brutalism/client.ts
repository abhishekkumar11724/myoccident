// Brutalism: small, abrupt behaviour. No libraries.
//  1. floor indicator (scroll-spy) for the rail + mobile index
//  2. mobile index <details> closes on navigation / Esc / outside click
//  3. colour returns on hover/focus for treated photos (swap to data-orig)
//  4. photo viewer (dialog) with a mono/colour toggle
//  5. headings "rise" once on first view (only when motion is allowed)

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

// ---------------------------------------------------------------- 1. floor indicator
{
  const floors = $$('[data-pf-section]').map((s) => ({ el: s, id: s.id }));
  const nowEl = document.querySelector<HTMLElement>('[data-floor-now]');
  const links = $$<HTMLAnchorElement>('a[data-floor]');
  const num = (id: string) => links.find((a) => a.dataset.floor === id)?.querySelector('b')?.textContent?.trim() ?? '00';
  let current = '';
  const set = (id: string) => {
    if (!id || id === current) return;
    current = id;
    links.forEach((a) => (a.dataset.floor === id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    if (nowEl) nowEl.textContent = num(id);
  };
  const pick = () => {
    const line = innerHeight * 0.38;
    let best = floors[0]?.id ?? '';
    for (const f of floors) if (f.el.getBoundingClientRect().top <= line) best = f.id;
    // at the very bottom, the last floor wins even when it is short
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) best = floors[floors.length - 1]?.id ?? best;
    set(best);
  };
  let ticking = false;
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; pick(); }); } }, { passive: true });
  addEventListener('resize', pick);
  pick();
}

// ---------------------------------------------------------------- 2. mobile index
{
  const idx = document.querySelector<HTMLDetailsElement>('details[data-index]');
  if (idx) {
    idx.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('nav a')) idx.open = false; });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && idx.open) { idx.open = false; idx.querySelector('summary')?.focus(); } });
    document.addEventListener('click', (e) => { if (idx.open && !idx.contains(e.target as Node)) idx.open = false; });
  }
}

// ---------------------------------------------------------------- 3. colour on hover / focus
{
  const warm = new Set<string>();
  const preload = (src: string) => { if (warm.has(src)) return; warm.add(src); const i = new Image(); i.decoding = 'async'; i.src = src; };
  const toColour = (img: HTMLImageElement) => {
    const orig = img.dataset.orig; if (!orig || img.dataset.state === 'colour') return;
    if (!img.dataset.mono) img.dataset.mono = img.currentSrc || img.src;
    img.dataset.state = 'colour';
    preload(orig);
    const probe = new Image(); probe.src = orig;
    const apply = () => { if (img.dataset.state === 'colour') img.src = orig; };
    probe.decode ? probe.decode().then(apply, apply) : (probe.onload = apply);
  };
  const toMono = (img: HTMLImageElement) => {
    if (img.dataset.state !== 'colour') return;
    img.dataset.state = 'mono';
    if (img.dataset.mono) img.src = img.dataset.mono;
  };
  $$<HTMLImageElement>('img[data-orig]').forEach((img) => {
    const host = img.closest<HTMLElement>('.bt-plate, .bt-frame') ?? img;
    host.addEventListener('pointerenter', (e) => { if ((e as PointerEvent).pointerType !== 'touch') toColour(img); });
    host.addEventListener('pointerleave', () => toMono(img));
    host.addEventListener('focusin', () => toColour(img));
    host.addEventListener('focusout', () => toMono(img));
  });
}

// ---------------------------------------------------------------- 4. photo viewer
{
  const dlg = document.querySelector<HTMLDialogElement>('dialog[data-lightbox]');
  const items = $$<HTMLAnchorElement>('a[data-lb]');
  if (dlg && items.length) {
    const stage = dlg.querySelector<HTMLElement>('[data-lb-stage]')!;
    let img: HTMLImageElement | null = null;
    const no = dlg.querySelector<HTMLElement>('[data-lb-no]')!;
    const cap = dlg.querySelector<HTMLElement>('[data-lb-cap]')!;
    const colourBtn = dlg.querySelector<HTMLButtonElement>('[data-lb-color]')!;
    let i = 0, colour = false;
    const show = () => {
      const a = items[i];
      if (!img) { img = document.createElement('img'); stage.append(img); }
      img.alt = a.dataset.alt ?? '';
      img.src = colour ? a.href : (a.dataset.mono ?? a.href);
      no.textContent = a.dataset.no ?? '';
      cap.textContent = a.dataset.cap ?? '';
      colourBtn.setAttribute('aria-pressed', String(colour));
      colourBtn.textContent = colour ? 'Mono' : 'Colour';
      const n = items[(i + 1) % items.length], p = items[(i - 1 + items.length) % items.length];
      [n, p].forEach((x) => { const im = new Image(); im.src = colour ? x.href : (x.dataset.mono ?? x.href); });
    };
    const step = (d: number) => { i = (i + d + items.length) % items.length; show(); };
    items.forEach((a, n) => a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault(); i = n; show(); dlg.showModal();
    }));
    dlg.querySelector('[data-lb-prev]')?.addEventListener('click', () => step(-1));
    dlg.querySelector('[data-lb-next]')?.addEventListener('click', () => step(1));
    dlg.querySelector('[data-lb-close]')?.addEventListener('click', () => dlg.close());
    colourBtn.addEventListener('click', () => { colour = !colour; show(); });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'c' || e.key === 'C') { colour = !colour; show(); }
    });
  }
}

// ---------------------------------------------------------------- 5. headings rise once
if (!reduce && 'IntersectionObserver' in window) {
  const targets = $$('.bt-sec-head h2').filter((el) => el.getBoundingClientRect().top > innerHeight * 0.9);
  if (targets.length) {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) { en.target.classList.add('bt-in'); io.unobserve(en.target); }
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach((el) => { el.classList.add('bt-rv'); io.observe(el); });
  }
}

export {};
