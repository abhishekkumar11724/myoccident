// Glitch behaviour (tiny): signal meter, active nav, one-shot glitch bursts, photo decode, boot skip.
// Everything that animates is skipped under prefers-reduced-motion.
if (document.documentElement.classList.contains('tg')) init();

function init() {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const $$ = <T extends HTMLElement = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)];

  // 1. SIGNAL: scroll progress -> --p (meter fill) and the 000-100 readout
  const readouts = $$('[data-sig]');
  let queued = false;
  const measure = () => {
    queued = false;
    const max = root.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    root.style.setProperty('--p', p.toFixed(3));
    const n = String(Math.round(p * 100)).padStart(3, '0');
    readouts.forEach((e) => (e.textContent = n));
  };
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(measure); } };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  measure();

  // 2. ACTIVE SECTION in the status bar
  const links = new Map($$<HTMLAnchorElement>('[data-nav]').map((a) => [a.dataset.nav!, a]));
  const secIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = (e.target as HTMLElement).dataset.pfSection!;
      links.forEach((a, k) => (k === id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
      if (window.innerWidth <= 760) links.get(id)?.scrollIntoView({ block: 'nearest', inline: 'center' });
    }),
    { rootMargin: '-40% 0px -55% 0px' },
  );
  $$('[data-pf-section]').forEach((s) => secIO.observe(s));

  // 3. BURSTS: short, one-shot, rate-limited (per element 1.4s, globally 0.35s => never > 3/s)
  let lastAny = 0;
  const burst = (els: HTMLElement[]) => {
    if (reduce.matches || !els.length) return;
    const t = performance.now();
    if (t - lastAny < 350 || t - Number(els[0].dataset.t || 0) < 1400) return;
    lastAny = t;
    els.forEach((el) => { el.dataset.t = String(t); el.classList.add('g-is-burst'); });
    setTimeout(() => els.forEach((el) => el.classList.remove('g-is-burst')), 900);
  };
  $$('[data-gl]').forEach((host) => {
    const gls = host.classList.contains('gl') ? [host] : $$(':scope .gl').filter((g) => host.contains(g));
    const go = () => burst(gls);
    host.addEventListener('pointerenter', go);
    host.addEventListener('focusin', go);
  });
  const inIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { burst([e.target as HTMLElement]); inIO.unobserve(e.target); } }),
    { threshold: 0.6 },
  );
  $$('.g-sec-title, .g-name .gl').forEach((el) => inIO.observe(el));

  // 4. PHOTOS: hover / keyboard focus / tap (pin) decodes the untouched original through a slice wipe
  $$<HTMLButtonElement>('[data-shot]').forEach((el) => {
    let hover = false, focus = false, pinned = false, isOn = false, off = 0, lastAnim = 0;
    const sync = () => {
      const want = hover || focus || pinned;
      if (want) {
        clearTimeout(off);
        if (isOn) return;
        isOn = true;
        el.classList.add('g-on');
        const t = performance.now();
        if (!reduce.matches && t - lastAnim > 1200) {
          lastAnim = t;
          el.classList.add('g-anim');
          setTimeout(() => el.classList.remove('g-anim'), 800);
        }
      } else {
        clearTimeout(off);
        off = window.setTimeout(() => { isOn = false; el.classList.remove('g-on', 'g-anim'); }, 350); // debounce: no rapid flip-flop
      }
    };
    el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hover = true; sync(); } });
    el.addEventListener('pointerleave', () => { hover = false; sync(); });
    el.addEventListener('focus', () => { focus = el.matches(':focus-visible'); sync(); });
    el.addEventListener('blur', () => { focus = false; sync(); });
    el.addEventListener('click', () => { pinned = !pinned; el.setAttribute('aria-pressed', String(pinned)); sync(); });
  });

  // 5. BOOT: any key / click / wheel / touch skips it; later visits in this session start without it
  const skip = () => root.classList.add('g-boot-done');
  ['keydown', 'pointerdown', 'wheel', 'touchmove'].forEach((ev) => addEventListener(ev, skip, { once: true, passive: true }));
  try { sessionStorage.setItem('pf-gl-boot', '1'); } catch { /* private mode */ }

}
