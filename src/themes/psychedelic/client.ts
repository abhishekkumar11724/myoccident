// Psychedelic: tiny, calm behaviour. Active chapter in the set-list nav, gentle reveal-on-scroll, and
// pausing the slow background loops while their section is off screen. All of it is skipped / instant under reduced motion.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// reveal on scroll
const rv = [...document.querySelectorAll<HTMLElement>('.rv')];
if (reduce || !('IntersectionObserver' in window)) {
  rv.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });
  rv.forEach((el) => io.observe(el));
}

// sections on screen: pause their loops when off screen; also drives the nav highlight
const secs = [...document.querySelectorAll<HTMLElement>('[data-sec]')];
const links = new Map<string, HTMLAnchorElement>();
document.querySelectorAll<HTMLAnchorElement>('.nav-list a[data-nav]').forEach((a) => links.set(a.dataset.nav!, a));
const list = document.querySelector<HTMLElement>('.nav-list ol');
let current = '-';
const setCurrent = (id: string) => {
  if (id === current) return;
  current = id;
  links.forEach((a, k) => (k === id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
  const a = links.get(id);
  if (!a && list) list.scrollTo({ left: 0, behavior: reduce ? 'auto' : 'smooth' });
  if (a && list && list.scrollWidth > list.clientWidth) {
    list.scrollTo({ left: a.offsetLeft - list.clientWidth / 2 + a.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
  }
};
if ('IntersectionObserver' in window) {
  const vis = new IntersectionObserver((entries) => {
    for (const e of entries) (e.target as HTMLElement).classList.toggle('vis', e.isIntersecting);
  }, { rootMargin: '10% 0px' });
  secs.forEach((s) => vis.observe(s));

  const ids = secs.map((s) => s.id).filter((id) => links.has(id));
  const pos = new Map<string, boolean>();
  const nav = new IntersectionObserver((entries) => {
    for (const e of entries) pos.set((e.target as HTMLElement).id, e.isIntersecting);
    const hit = [...ids].reverse().find((id) => pos.get(id)) ?? '';
    setCurrent(hit);
  }, { rootMargin: '-35% 0px -55% 0px' });
  ids.forEach((id) => nav.observe(document.getElementById(id)!));
}
