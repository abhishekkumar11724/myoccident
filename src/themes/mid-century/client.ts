// Mid-century: small, calm behaviour. No libraries.
//  1. live Gurugram clock (sunburst dial + dateline + digital readout) and a time-of-day status line
//  2. dateline shows today's date (IST)
//  3. scroll-reveal (once) and nav scroll-spy
//  4. slide projector: click a slide to view the untouched colour original, arrows / Esc work
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));
const TZ = 'Asia/Kolkata';

// ---------------------------------------------------------------- 1. + 2. clock, date, status
{
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const hands = { h: $$('[data-hand="h"]'), m: $$('[data-hand="m"]'), s: $$('[data-hand="s"]') };
  const small = $$('[data-clock-text]'), big = $$('[data-clock-big]'), status = $$('[data-status]'), date = $$('[data-date]');
  const rot = (els: Element[], deg: number) => els.forEach((e) => e.setAttribute('transform', `rotate(${deg.toFixed(2)} 100 100)`));
  const statusFor = (h: number, wd: string) => {
    const weekend = wd === 'Saturday' || wd === 'Sunday';
    if (h >= 23 || h < 5) return 'Night in Gurugram: most likely asleep.';
    if (h < 9) return 'Early morning: chai first, then code.';
    if (weekend) return h < 19 ? 'Weekend: possibly on a motorbike somewhere.' : 'Weekend evening: probably with a book.';
    if (h < 19) return 'At the desk in Gurugram.';
    return 'Off the clock: dinner, a book, maybe a ride.';
  };
  let lastDay = '', lastStatus = '';
  const tick = () => {
    const p: Record<string, string> = {};
    for (const x of parts.formatToParts(new Date())) p[x.type] = x.value;
    const H = +p.hour % 24, M = +p.minute, S = +p.second;
    rot(hands.h, (H % 12) * 30 + M * 0.5);
    rot(hands.m, M * 6 + S * 0.1);
    rot(hands.s, S * 6);
    const hm = `${p.hour}:${p.minute}`;
    small.forEach((e) => (e.textContent = hm));
    big.forEach((e) => (e.textContent = hm));
    const day = `${p.weekday}, ${p.day} ${p.month} ${p.year}`;
    if (day !== lastDay) {
      lastDay = day;
      date.forEach((e) => { e.textContent = day; e.parentElement?.classList.add('has-date'); });
    }
    const st = statusFor(H, p.weekday);
    if (st !== lastStatus) { lastStatus = st; status.forEach((e) => (e.textContent = st)); }
  };
  tick();
  setInterval(tick, reduce ? 15000 : 1000);
}

// ---------------------------------------------------------------- 3. reveal + scroll-spy
{
  const rv = $$('[data-rv]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    rv.forEach((el, i) => {
      // stagger siblings inside the same grid a little
      if (!reduce && el.parentElement && el.parentElement.querySelectorAll(':scope > [data-rv]').length > 1) {
        const idx = Array.from(el.parentElement.children).indexOf(el);
        (el as HTMLElement).style.transitionDelay = `${Math.min(idx % 3, 2) * 70}ms`;
      }
      io.observe(el);
    });
  } else rv.forEach((el) => el.classList.add('in'));

  const links = $$<HTMLAnchorElement>('a[data-nav]');
  const secs = links.map((a) => document.getElementById(a.dataset.nav!)).filter(Boolean) as HTMLElement[];
  let cur = '';
  const set = (id: string) => {
    if (id === cur) return;
    cur = id;
    links.forEach((a) => (a.dataset.nav === id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    const act = links.find((a) => a.dataset.nav === id);
    const nav = act?.closest('.mast-nav') as HTMLElement | null;
    const navEl = document.querySelector<HTMLElement>('.mast-nav');
    if (!id && navEl) navEl.scrollLeft = 0;
    if (act && nav && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: act.offsetLeft - nav.clientWidth / 3, behavior: reduce ? 'auto' : 'smooth' });
  };
  const spy = () => {
    const line = innerHeight * 0.35;
    let best = '';
    for (const s of secs) if (s.getBoundingClientRect().top <= line) best = s.id;
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) best = secs[secs.length - 1]?.id ?? best;
    set(best);
  };
  let tk = false;
  addEventListener('scroll', () => { if (!tk) { tk = true; requestAnimationFrame(() => { tk = false; spy(); }); } }, { passive: true });
  addEventListener('resize', spy);
  spy();
}

// ---------------------------------------------------------------- 4. slide projector
{
  const dlg = document.querySelector<HTMLDialogElement>('dialog[data-projector]');
  const slides = $$<HTMLAnchorElement>('a.slide-link');
  if (dlg && slides.length) {
    const frame = dlg.querySelector<HTMLElement>('[data-proj-frame]')!;
    let img: HTMLImageElement | null = null;
    const cap = dlg.querySelector<HTMLElement>('[data-proj-cap]')!;
    const cnt = dlg.querySelector<HTMLElement>('[data-proj-count]')!;
    let i = 0;
    const show = (n: number) => {
      i = (n + slides.length) % slides.length;
      const a = slides[i];
      if (!img) { img = document.createElement('img'); frame.appendChild(img); }
      img.src = a.dataset.full || a.href;
      img.alt = a.dataset.alt || '';
      cap.textContent = a.dataset.cap || a.dataset.alt || '';
      cnt.textContent = `Slide ${i + 1} / ${slides.length}`;
    };
    slides.forEach((a, n) => a.addEventListener('click', (e) => {
      e.preventDefault();
      show(n);
      dlg.showModal();
    }));
    dlg.querySelector('[data-proj-prev]')?.addEventListener('click', () => show(i - 1));
    dlg.querySelector('[data-proj-next]')?.addEventListener('click', () => show(i + 1));
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1); }
    });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => { img?.remove(); img = null; });
  }
}
