// Grunge behaviour (tiny): nav scroll-spy + the "colour spot" on photocopied photos.
// Nothing here animates on its own. The spot only follows a pointer that is already over a photo.
if (document.documentElement.classList.contains('gr')) init();

function init() {
  const $$ = <T extends HTMLElement = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)];

  // ---- 1. which section is on screen -> mark its label in the nav
  const links = new Map($$<HTMLAnchorElement>('[data-nav]').map((a) => [a.dataset.nav!, a]));
  const set = (id: string | null) => links.forEach((a, k) => { if (k === id) a.classList.add('on'); else a.classList.remove('on'); if (k === id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  const io = new IntersectionObserver(
    (entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (vis) {
        const id = (vis.target as HTMLElement).id;
        set(id);
        const a = links.get(id);
        const nav = a?.parentElement;
        if (a && nav && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.clientWidth / 2, behavior: 'auto' });
      }
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.01] },
  );
  links.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  addEventListener('scroll', () => { if (scrollY < 200) set(null); }, { passive: true });

  // ---- 2. colour spot: the untouched original shows through a circle under the pointer; click/tap/Enter pins it fully
  const spot = 86; // px radius of the hover spot
  const ensure = (shot: HTMLElement) => {
    let orig = shot.querySelector<HTMLImageElement>('img.orig');
    if (orig) return orig;
    const base = shot.querySelector<HTMLImageElement>('img');
    const src = shot.dataset.o;
    if (!base || !src) return null;
    orig = document.createElement('img');
    orig.className = 'orig';
    orig.alt = '';
    orig.setAttribute('aria-hidden', 'true');
    orig.decoding = 'async';
    orig.style.objectPosition = base.style.objectPosition;
    orig.src = src;
    shot.appendChild(orig);
    return orig;
  };
  const full = (shot: HTMLElement) => Math.hypot(shot.clientWidth, shot.clientHeight) + 8;

  $$('.shot').forEach((shot) => {
    const move = (e: PointerEvent) => {
      const r = shot.getBoundingClientRect();
      shot.style.setProperty('--x', `${e.clientX - r.left}px`);
      shot.style.setProperty('--y', `${e.clientY - r.top}px`);
    };
    shot.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'touch') return;
      ensure(shot);
      move(e);
      if (shot.getAttribute('aria-pressed') !== 'true') shot.style.setProperty('--rad', `${spot}px`);
    });
    shot.addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') move(e); });
    shot.addEventListener('pointerleave', () => { if (shot.getAttribute('aria-pressed') !== 'true') shot.style.setProperty('--rad', '0px'); });
    shot.addEventListener('focus', () => { ensure(shot); });
    shot.addEventListener('click', () => {
      ensure(shot);
      const on = shot.getAttribute('aria-pressed') !== 'true';
      shot.setAttribute('aria-pressed', String(on));
      shot.style.setProperty('--rad', on ? `${full(shot)}px` : '0px');
      if (on) { shot.style.setProperty('--x', '50%'); shot.style.setProperty('--y', '50%'); }
    });
  });
}
