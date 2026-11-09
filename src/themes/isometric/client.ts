// Isometric theme behaviour: scene wake-up (only while visible), scroll-spy + floor tower, hero parallax, photo lightbox,
// contact topic chips, mobile menu. Everything is transform/opacity only and is skipped under prefers-reduced-motion.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

// ---------------------------------------------------------------- mobile menu
const menuBtn = document.querySelector<HTMLButtonElement>('.menu-btn');
const nav = document.querySelector<HTMLElement>('#nav');
if (menuBtn && nav) {
  const set = (open: boolean) => { nav.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', String(open)); };
  menuBtn.addEventListener('click', () => set(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
}

// ---------------------------------------------------------------- scroll-spy (nav + tower)
const ids = ['hero', 'about', 'experience', 'case-studies', 'projects', 'skills', 'beyond-code', 'writing', 'contact'];
const secs = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
const mark = (id: string) => {
  $$('[data-nav]').forEach((a) => a.classList.toggle('is-on', a.dataset.nav === id));
  $$('[data-tw]').forEach((a) => a.classList.toggle('is-on', a.dataset.tw === id));
};
if ('IntersectionObserver' in window && secs.length) {
  const spy = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) mark((e.target as HTMLElement).id); }, { rootMargin: '-42% 0px -52% 0px' });
  secs.forEach((s) => spy.observe(s));
}
mark('hero');

// ---------------------------------------------------------------- scenes only animate while on screen
if (!reduce && 'IntersectionObserver' in window) {
  const live = new IntersectionObserver((es) => { for (const e of es) e.target.classList.toggle('is-live', e.isIntersecting); }, { rootMargin: '80px 0px' });
  $$('[data-scene]').forEach((s) => live.observe(s));

  // gentle reveal for panels below the fold (never for text-only content; panels are visible without JS)
  const vh = innerHeight;
  const targets = $$('.cs, .proj, .skill, .stat, .floor-card, .floor-art, .gal-head, .writing-card, .intake, .contact-art, .about-copy').filter((el) => el.getBoundingClientRect().top > vh * 0.95);
  const rv = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } }, { rootMargin: '0px 0px -6% 0px' });
  targets.forEach((t) => { t.classList.add('reveal'); rv.observe(t); });
}

// ---------------------------------------------------------------- hero parallax (pointer) - three depth layers
const hero = document.querySelector<HTMLElement>('.hero');
const layers = hero ? $$('.hero-art .layer', hero) : [];
if (hero && layers.length && !reduce && matchMedia('(pointer: fine)').matches) {
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, inView = true;
  new IntersectionObserver((es) => { inView = es[0].isIntersecting; }).observe(hero);
  const tick = () => {
    cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
    layers.forEach((l) => { const d = parseFloat(l.dataset.depth || '0'); l.style.transform = `translate3d(${(cx * d).toFixed(2)}px, ${(cy * d * 0.6).toFixed(2)}px, 0)`; });
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(tick) : 0;
  };
  hero.addEventListener('pointermove', (e) => {
    if (!inView) return;
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2; ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    if (!raf) raf = requestAnimationFrame(tick);
  });
  hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick); });
}

// ---------------------------------------------------------------- stats legend <-> columns
const statsArt = document.querySelector<HTMLElement>('.stats-art');
$$('.stat[data-col]').forEach((el) => {
  const on = () => { statsArt?.setAttribute('data-hot', el.dataset.col || ''); el.classList.add('is-hot'); };
  const off = () => { statsArt?.removeAttribute('data-hot'); el.classList.remove('is-hot'); };
  el.addEventListener('pointerenter', on); el.addEventListener('pointerleave', off);
});

// ---------------------------------------------------------------- contact: topic chips pre-fill the message
const area = document.querySelector<HTMLTextAreaElement>('textarea[name=message]');
const chips = $$<HTMLButtonElement>('.topic-chip');
const intro = 'Hi Abhishek, I would like to talk about ';
const sync = () => {
  if (!area) return;
  const picked = chips.filter((c) => c.getAttribute('aria-pressed') === 'true').map((c) => c.dataset.topic || '');
  const rest = area.value.startsWith(intro) ? area.value.split('\n\n').slice(1).join('\n\n') : area.value;
  area.value = picked.length ? `${intro}${picked.join(', ')}.${rest ? '\n\n' + rest : '\n\n'}` : rest;
};
chips.forEach((c) => c.addEventListener('click', () => { c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true')); sync(); }));
const art = document.querySelector<HTMLElement>('.contact-art');
document.querySelectorAll<HTMLElement>('.intake input, .intake textarea').forEach((f) => {
  f.addEventListener('focus', () => art?.classList.add('flag-up'));
});

// ---------------------------------------------------------------- lightbox
const dlg = document.querySelector<HTMLDialogElement>('dialog.lb');
if (dlg) {
  const box = dlg.querySelector<HTMLElement>('.lb-img')!, cap = dlg.querySelector<HTMLElement>('.lb-cap')!, count = dlg.querySelector<HTMLElement>('.lb-count')!;
  let list: HTMLElement[] = [], i = 0;
  const show = (n: number) => {
    i = (n + list.length) % list.length;
    const b = list[i], img = new Image();
    img.alt = b.dataset.alt || ''; img.width = +(b.dataset.w || 0); img.height = +(b.dataset.h || 0); img.src = b.dataset.src || '';
    box.replaceChildren(img);
    cap.textContent = [b.dataset.cap, b.dataset.alt].filter(Boolean)[0] || '';
    count.textContent = `${i + 1} / ${list.length}`;
  };
  document.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-lb]');
    if (!b) return;
    list = $$('[data-lb]', b.closest('.gal') || document);
    show(list.indexOf(b)); dlg.showModal();
  });
  dlg.querySelector('.lb-prev')?.addEventListener('click', () => show(i - 1));
  dlg.querySelector('.lb-next')?.addEventListener('click', () => show(i + 1));
  dlg.querySelector('.lb-close')?.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') show(i - 1); else if (e.key === 'ArrowRight') show(i + 1); });
  dlg.addEventListener('close', () => box.replaceChildren());
}
