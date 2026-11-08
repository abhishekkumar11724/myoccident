// Neumorphism: small, gentle behaviour. No libraries.
//  1. dock scroll-spy (+ hero knob follows scroll progress)
//  2. data-attribute state machine for the case-study miniatures (segments, switches)
//  3. the SOP "Compile" sequence
//  4. dials draw in once when seen
//  5. skill finder
//  6. photo filter + viewer
//  7. contact intake chips
//  8. reveal the (base64) contact details

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));
const raf = (fn: () => void) => { let t = false; return () => { if (!t) { t = true; requestAnimationFrame(() => { t = false; fn(); }); } }; };

// ---------------------------------------------------------------- 1. dock + knob
{
  const links = $$<HTMLAnchorElement>('a[data-dock-link]');
  const secs = links.map((a) => document.getElementById(a.dataset.dockLink!)).filter(Boolean) as HTMLElement[];
  const tray = $<HTMLElement>('[data-dock]');
  const knob = $<HTMLElement>('[data-knob]');
  const ticks = knob ? $$<SVGElement>('.nm-t', knob) : [];
  let cur = '';
  const setActive = (id: string) => {
    if (id === cur) return;
    cur = id;
    for (const a of links) {
      if (a.dataset.dockLink === id) {
        a.setAttribute('aria-current', 'true');
        if (tray && tray.scrollWidth > tray.clientWidth + 2) tray.scrollTo({ left: a.offsetLeft - (tray.clientWidth - a.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
      } else a.removeAttribute('aria-current');
    }
  };
  const update = raf(() => {
    const line = innerHeight * 0.38;
    let best = secs[0]?.id ?? '';
    for (const s of secs) if (s.getBoundingClientRect().top <= line) best = s.id;
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) best = secs[secs.length - 1]?.id ?? best;
    setActive(best);
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = Math.min(1, Math.max(0, scrollY / max));
    document.documentElement.style.setProperty('--prog', p.toFixed(4)); // drives the hero knob + the brand ring
    if (knob && !reduce) {
      const lit = Math.round(p * (ticks.length - 1));
      ticks.forEach((t, i) => t.classList.toggle('on', i <= lit));
    }
  });
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  if (reduce && ticks[0]) ticks[0].classList.add('on');
  update();
}

// ---------------------------------------------------------------- 2. mock state machines
const syncGroup = (root: HTMLElement, group: string, value: string) => {
  $$<HTMLButtonElement>(`button[data-group="${group}"]`, root).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setVal === value)));
};
const timers = new WeakMap<HTMLElement, number[]>();
const clearTimers = (root: HTMLElement) => { (timers.get(root) ?? []).forEach(clearTimeout); timers.set(root, []); };

function compile(root: HTMLElement) {
  const line = $<HTMLElement>('[data-line]', root);
  const say = (t: string) => { if (line) line.textContent = t; };
  clearTimers(root);
  root.dataset.view = 'compiled';
  syncGroup(root, 'view', 'compiled');
  if (reduce) { root.dataset.stage = 'done'; say('Compiled once. It now runs as a fixed graph, with no LLM in the control loop.'); return; }
  root.dataset.stage = 'working';
  const steps: [number, () => void][] = [
    [0, () => say('Reading the SOP...')],
    [420, () => say('Building the workflow graph...')],
    [860, () => say('Validating every node and edge...')],
    [1300, () => { root.dataset.stage = 'done'; say('Compiled once. It now runs as a fixed graph, with no LLM in the control loop.'); }],
  ];
  timers.set(root, steps.map(([ms, fn]) => window.setTimeout(fn, ms)));
}

$$<HTMLElement>('[data-mock]').forEach((root) => {
  const flow = $<SVGSVGElement>('svg.nm-flow', root);
  if (flow && reduce) { root.dataset.run = 'off'; $('[data-toggle="run"]', root)?.setAttribute('aria-checked', 'false'); flow.pauseAnimations(); }

  root.addEventListener('click', (e) => {
    const b = (e.target as Element).closest('button');
    if (!b || !root.contains(b)) return;

    if (b.dataset.setKey) {
      const key = b.dataset.setKey, val = b.dataset.setVal ?? '';
      root.dataset[key] = val;
      if (b.dataset.group) syncGroup(root, b.dataset.group, val);
      if (root.classList.contains('nm-console')) {
        const line = $<HTMLElement>('[data-line]', root);
        if (key === 'sop') {
          clearTimers(root);
          if (root.dataset.view === 'compiled') compile(root);
          else { root.dataset.stage = 'idle'; if (line) line.textContent = 'Raw SOP loaded. Press Compile.'; }
        }
        if (key === 'view') {
          if (val === 'compiled' && root.dataset.stage !== 'done') compile(root);
          if (val === 'raw') { clearTimers(root); root.dataset.stage = 'idle'; if (line) line.textContent = 'Raw SOP loaded. Press Compile.'; }
        }
      }
      return;
    }

    if (b.dataset.toggle) {
      const k = b.dataset.toggle, on = root.dataset[k] === 'on';
      root.dataset[k] = on ? 'off' : 'on';
      b.setAttribute('aria-checked', String(!on));
      if (k === 'run' && flow) (on ? flow.pauseAnimations() : flow.unpauseAnimations());
      return;
    }

    if (b.hasAttribute('data-compile')) compile(root);
  });
});

// ---------------------------------------------------------------- 4. dials draw in
{
  const dials = $$<HTMLElement>('.nm-dial');
  if (reduce || !('IntersectionObserver' in window)) dials.forEach((d) => d.classList.add('in'));
  else {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.35 });
    dials.forEach((d) => io.observe(d));
  }
}

// ---------------------------------------------------------------- 5. skill finder
{
  const q = $<HTMLInputElement>('[data-skill-q]');
  const wrap = $<HTMLElement>('[data-skills]');
  const out = $<HTMLElement>('[data-skill-count]');
  const chips = $$<HTMLElement>('[data-skill]');
  const run = () => {
    const v = (q?.value ?? '').trim().toLowerCase();
    let n = 0;
    chips.forEach((c) => {
      const hit = !!v && (c.firstChild?.textContent ?? c.textContent ?? '').toLowerCase().includes(v);
      c.classList.toggle('hit', hit);
      if (hit) n++;
    });
    wrap?.classList.toggle('is-searching', !!v);
    if (out) out.textContent = v ? (n ? `${n} match${n === 1 ? '' : 'es'}` : 'no match') : '';
  };
  q?.addEventListener('input', run);
}

// ---------------------------------------------------------------- 6. photo filter + viewer
{
  const albums = $$<HTMLElement>('[data-album]');
  const filterBtns = $$<HTMLButtonElement>('button[data-cat]');
  filterBtns.forEach((b) => b.addEventListener('click', () => {
    const cat = b.dataset.cat!;
    filterBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    albums.forEach((a) => { a.hidden = cat !== 'all' && a.dataset.album !== cat; });
  }));

  const dlg = $<HTMLDialogElement>('[data-lightbox]');
  const frame = dlg ? $<HTMLElement>('.nm-lb-frame', dlg) : null;
  const cap = dlg ? $<HTMLElement>('[data-lb-cap]', dlg) : null;
  const count = dlg ? $<HTMLElement>('[data-lb-count]', dlg) : null;
  let list: HTMLAnchorElement[] = [];
  let idx = 0;
  let img: HTMLImageElement | null = null;
  const show = (i: number) => {
    if (!dlg || !frame || !list.length) return;
    idx = (i + list.length) % list.length;
    const a = list[idx];
    if (!img) { img = document.createElement('img'); img.decoding = 'async'; frame.prepend(img); }
    img.src = a.dataset.full ?? a.href;
    img.alt = a.dataset.alt ?? '';
    if (cap) cap.textContent = a.dataset.cap || a.dataset.alt || '';
    if (count) count.textContent = `${idx + 1} / ${list.length}`;
    const nxt = list[(idx + 1) % list.length]; if (nxt) new Image().src = nxt.dataset.full ?? nxt.href;
  };
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-lb]');
    if (!a || !dlg) return;
    e.preventDefault();
    list = $$<HTMLAnchorElement>('a[data-lb]').filter((x) => !x.closest('[hidden]'));
    show(Math.max(0, list.indexOf(a)));
    if (!dlg.open) dlg.showModal();
  });
  $('[data-lb-prev]')?.addEventListener('click', () => show(idx - 1));
  $('[data-lb-next]')?.addEventListener('click', () => show(idx + 1));
  $('[data-lb-close]')?.addEventListener('click', () => dlg?.close());
  dlg?.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
  });
}

// ---------------------------------------------------------------- 7. contact intake
{
  const intake = $<HTMLElement>('[data-intake]');
  if (intake) {
    const hint = $<HTMLElement>('[data-reply-hint]', intake);
    const hints: Record<string, string> = {
      Email: "I'll reply to the email address you give below.",
      LinkedIn: 'Add your LinkedIn profile link to the message so I can find you.',
      Phone: 'Add your number and a good time to call to the message.',
    };
    const group = (sel: string) => {
      const btns = $$<HTMLButtonElement>(sel, intake);
      btns.forEach((b) => b.addEventListener('click', () => {
        btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        if (sel === '[data-reply]' && hint) hint.textContent = hints[b.textContent!.trim()] ?? '';
      }));
      return () => btns.find((b) => b.getAttribute('aria-pressed') === 'true')?.textContent?.trim() ?? '';
    };
    const topic = group('[data-topic]');
    const reply = group('[data-reply]');
    // runs in the capture phase so the shared ContactForm reads the prefixed message, then we restore the field
    intake.addEventListener('submit', () => {
      const ta = $<HTMLTextAreaElement>('textarea[name="message"]', intake);
      if (!ta || !ta.value.trim()) return;
      const original = ta.value;
      ta.value = `[Topic: ${topic()} | Reply via: ${reply()}]\n\n${original}`;
      setTimeout(() => { if (ta.value !== original && ta.value.startsWith('[Topic:')) ta.value = original; }, 0);
    }, true);
    $$('[data-open-intake]').forEach((a) => a.addEventListener('click', () => {
      if (reduce) return;
      intake.classList.remove('pop'); void intake.offsetWidth; intake.classList.add('pop');
    }));
  }
}

// ---------------------------------------------------------------- 8. reveal contact details (never in the HTML as text)
$$<HTMLAnchorElement>('a[data-pf-protected]').forEach((a) => {
  const slot = $<HTMLElement>('[data-addr]', a);
  if (!slot) return;
  try { slot.textContent = atob(a.dataset.d || a.dataset.v || ''); } catch { /* leave placeholder */ }
});
