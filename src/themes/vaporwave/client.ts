// Vaporwave behaviour: Start menu, current-section taskbar button, explorer tabs, picture viewer, IST clock,
// scene (sunset/midnight) + background-motion toggles. Everything degrades to plain HTML without JS.

const root = document.documentElement;
const $ = <T extends Element>(sel: string, ctx: ParentNode = document) => ctx.querySelector<T>(sel);
const $$ = <T extends Element>(sel: string, ctx: ParentNode = document) => [...ctx.querySelectorAll<T>(sel)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

// ---------------------------------------------------------------- Start menu
const start = $<HTMLDetailsElement>('[data-start]');
if (start) {
  const summary = $<HTMLElement>('summary', start)!;
  const close = (focus = false) => { start.open = false; if (focus) summary.focus(); };
  document.addEventListener('click', (e) => { if (start.open && !start.contains(e.target as Node)) close(); });
  start.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) setTimeout(() => close(), 0); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && start.open) close(true); });
}

// ---------------------------------------------------------------- current section -> taskbar button
const navLinks = $$<HTMLAnchorElement>('[data-nav]');
const setCurrent = (id: string | null) => {
  for (const a of navLinks) {
    const on = a.dataset.nav === id;
    a.classList.toggle('is-on', on);
    if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
  }
};
const sections = navLinks.map((a) => document.getElementById(a.dataset.nav!)).filter(Boolean) as HTMLElement[];
if ('IntersectionObserver' in window && sections.length) {
  const visible = new Map<string, number>();
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) { if (en.isIntersecting) visible.set(en.target.id, en.intersectionRatio); else visible.delete(en.target.id); }
    const first = sections.find((s) => visible.has(s.id));
    setCurrent(first ? first.id : null);
  }, { rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.01] });
  sections.forEach((s) => io.observe(s));
}

// folder list in My Pictures follows the scroll too
const folderLinks = $$<HTMLAnchorElement>('.vw-folders a');
const folders = folderLinks.map((a) => document.getElementById((a.getAttribute('href') || '').slice(1))).filter(Boolean) as HTMLElement[];
if ('IntersectionObserver' in window && folders.length) {
  const vis = new Set<string>();
  const io2 = new IntersectionObserver((entries) => {
    for (const en of entries) { if (en.isIntersecting) vis.add(en.target.id); else vis.delete(en.target.id); }
    const first = folders.find((f) => vis.has(f.id));
    for (const a of folderLinks) a.classList.toggle('is-on', !!first && a.getAttribute('href') === `#${first.id}`);
  }, { rootMargin: '-25% 0px -65% 0px', threshold: [0, 0.01] });
  folders.forEach((f) => io2.observe(f));
}

// ---------------------------------------------------------------- explorer tabs (experience)
const ex = $<HTMLElement>('[data-explorer]');
if (ex) {
  const tree = $<HTMLElement>('[data-tree]', ex)!;
  const leaves = $$<HTMLAnchorElement>('[data-tab]', ex);
  const panes = $$<HTMLElement>('[data-pane]', ex);
  const addr = $<HTMLElement>('[data-addr]', ex);
  tree.setAttribute('role', 'tablist');
  tree.setAttribute('aria-orientation', 'vertical');
  tree.setAttribute('aria-label', 'Employers');
  for (const l of leaves) { l.setAttribute('role', 'tab'); l.id = `tab-${l.dataset.tab}`; l.setAttribute('aria-controls', `exp-${l.dataset.tab}`); }
  for (const p of panes) { p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', `tab-${p.dataset.pane}`); }
  const select = (id: string, focus = false) => {
    for (const l of leaves) {
      const on = l.dataset.tab === id;
      l.classList.toggle('is-on', on);
      l.setAttribute('aria-selected', String(on));
      l.tabIndex = on ? 0 : -1;
      if (on) { if (addr) addr.textContent = l.dataset.path || ''; if (focus) l.focus(); }
    }
    for (const p of panes) p.classList.toggle('is-on', p.dataset.pane === id);
  };
  ex.classList.add('is-ready');
  const fromHash = () => { const m = location.hash.match(/^#exp-(.+)$/); return m && leaves.some((l) => l.dataset.tab === m[1]) ? m[1] : null; };
  select(fromHash() ?? leaves[0].dataset.tab!);
  for (const l of leaves) l.addEventListener('click', (e) => { e.preventDefault(); select(l.dataset.tab!); history.replaceState(null, '', `#exp-${l.dataset.tab}`); });
  tree.addEventListener('keydown', (e) => {
    const i = leaves.findIndex((l) => l === document.activeElement);
    if (i < 0) return;
    let n = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % leaves.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + leaves.length) % leaves.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = leaves.length - 1;
    if (n >= 0) { e.preventDefault(); select(leaves[n].dataset.tab!, true); }
  });
  window.addEventListener('hashchange', () => { const h = fromHash(); if (h) select(h); });
}

// ---------------------------------------------------------------- picture viewer
const dlg = $<HTMLDialogElement>('[data-viewer]');
const shots = $$<HTMLAnchorElement>('.vw-shot');
if (dlg && shots.length) {
  const stage = $<HTMLElement>('[data-v-stage]', dlg)!;
  const cap = $<HTMLElement>('[data-v-cap]', dlg)!;
  const title = $<HTMLElement>('[data-v-title]', dlg)!;
  const modeBtn = $<HTMLButtonElement>('[data-v-mode]', dlg)!;
  let idx = 0;
  let real = false;
  const fileOf = (a: HTMLAnchorElement) => (a.dataset.orig || a.href).split('/').pop()!.replace(/\.[a-z0-9]+$/i, '');
  const render = () => {
    const a = shots[idx];
    const img = new Image();
    img.alt = a.dataset.alt || '';
    img.decoding = 'async';
    img.src = (real ? a.dataset.orig : a.dataset.full) || a.href;
    stage.replaceChildren(img);
    cap.textContent = [a.dataset.cap, `${idx + 1} / ${shots.length}`].filter(Boolean).join('  –  ');
    title.textContent = `${fileOf(a)}.bmp`;
    modeBtn.setAttribute('aria-pressed', String(real));
    modeBtn.textContent = real ? 'Dream colours' : 'Real colours';
    const nx = shots[(idx + 1) % shots.length];
    if (nx) new Image().src = (real ? nx.dataset.orig : nx.dataset.full) || nx.href; // warm the next one
  };
  const go = (d: number) => { idx = (idx + d + shots.length) % shots.length; render(); };
  shots.forEach((a, i) => a.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault(); idx = i; render(); dlg.showModal();
  }));
  $('[data-v-prev]', dlg)?.addEventListener('click', () => go(-1));
  $('[data-v-next]', dlg)?.addEventListener('click', () => go(1));
  modeBtn.addEventListener('click', () => { real = !real; render(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
  dlg.addEventListener('close', () => stage.replaceChildren());
}

// ---------------------------------------------------------------- clock (India time)
const clock = $<HTMLTimeElement>('[data-clock]');
if (clock) {
  const fmt = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
  const tick = () => { const d = new Date(); clock.textContent = fmt.format(d).toUpperCase(); clock.dateTime = d.toISOString(); };
  tick();
  setInterval(tick, 15000);
}

// ---------------------------------------------------------------- scene + motion toggles
const sceneBtn = $<HTMLButtonElement>('[data-scene-toggle]');
if (sceneBtn) {
  const label = $<HTMLElement>('[data-scene-label]', sceneBtn);
  const apply = (s: string) => {
    root.dataset.scene = s;
    sceneBtn.setAttribute('aria-pressed', String(s === 'midnight'));
    if (label) label.textContent = s;
    const m = $<HTMLMetaElement>('meta[name="theme-color"]');
    if (m) m.content = s === 'midnight' ? '#2a1457' : '#e6dbff';
  };
  apply(root.dataset.scene === 'midnight' ? 'midnight' : 'sunset');
  sceneBtn.addEventListener('click', () => { const n = root.dataset.scene === 'midnight' ? 'sunset' : 'midnight'; apply(n); store.set('pf-vw-scene', n); });
}

const motionBtn = $<HTMLButtonElement>('[data-motion-toggle]');
if (motionBtn) {
  const label = $<HTMLElement>('[data-motion-label]', motionBtn);
  const apply = (paused: boolean) => {
    root.classList.toggle('vw-paused', paused);
    motionBtn.setAttribute('aria-pressed', String(paused));
    if (label) label.textContent = paused ? 'paused' : 'on';
  };
  if (reduce.matches) {
    motionBtn.setAttribute('aria-pressed', 'true');
    motionBtn.title = 'Animation is off because your system asks for reduced motion';
    if (label) label.textContent = 'off (reduced motion is set on your device)';
    motionBtn.disabled = true;
  } else {
    apply(root.classList.contains('vw-paused'));
    motionBtn.addEventListener('click', () => { const p = !root.classList.contains('vw-paused'); apply(p); store.set('pf-vw-motion', p ? 'off' : 'on'); });
  }
}
