/**
 * 3D Inflated behaviour (small, vanilla):
 *  - dock menu (mobile), scroll-spy, inflate-in reveal on scroll
 *  - project index: last hovered/focused name keeps its preview bubble inflated
 *  - copy-email button, photo lightbox with "deflate" (see original)
 *  - squishy lab: pump-a-balloon, squish pad, bubble blower, light orb
 * Everything that moves is skipped under prefers-reduced-motion (state still changes, announced in text).
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
document.documentElement.classList.add('js');

// ───────── dock menu ─────────
const menuBtn = $<HTMLButtonElement>('[data-menu-btn]');
const nav = $<HTMLElement>('[data-nav]');
function setMenu(open: boolean) {
  nav?.classList.toggle('is-open', open);
  menuBtn?.setAttribute('aria-expanded', String(open));
  if (menuBtn) menuBtn.textContent = open ? 'Close' : 'Menu';
}
menuBtn?.addEventListener('click', () => setMenu(!nav?.classList.contains('is-open')));
nav?.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav?.classList.contains('is-open')) { setMenu(false); menuBtn?.focus(); } });

// ───────── scroll-spy ─────────
const links = new Map<string, HTMLAnchorElement>();
$$<HTMLAnchorElement>('[data-nav-link]').forEach((a) => links.set(a.dataset.navLink!, a));
if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const id = (en.target as HTMLElement).id;
      links.forEach((a, k) => { if (k === id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    }
  }, { rootMargin: '-35% 0px -60% 0px' });
  $$('main > section[id]').forEach((s) => spy.observe(s));
}

// ───────── inflate-in on scroll ─────────
const rv = $$('.rv');
if (reduce || !('IntersectionObserver' in window)) {
  rv.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }, { rootMargin: '0px 0px -6% 0px' });
  rv.forEach((el) => io.observe(el));
  // belt and braces: anything already scrolled past (fast jumps, anchors, restored scroll) is shown; print shows everything
  let ticking = false;
  const sweep = () => {
    ticking = false;
    rv.forEach((el) => { if (!el.classList.contains('in') && el.getBoundingClientRect().top < innerHeight * 0.94) { el.classList.add('in'); io.unobserve(el); } });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(sweep); } }, { passive: true });
  addEventListener('beforeprint', () => rv.forEach((el) => el.classList.add('in')));
}

// ───────── project index ─────────
const pjs = $$('[data-pj]');
const setActive = (el: Element) => pjs.forEach((p) => p.classList.toggle('is-active', p === el));
pjs.forEach((p) => {
  p.addEventListener('pointerenter', () => setActive(p));
  p.addEventListener('focusin', () => setActive(p));
});
const pjList = $<HTMLElement>('[data-pj-list]');
pjList?.style.setProperty('--n', String(pjs.length));

// ───────── email: prefilled mailto + copy ─────────
const emailLink = () => $<HTMLAnchorElement>('a[data-pf-protected="email"]');
function address(): string { try { return atob(emailLink()?.dataset.v || ''); } catch { return ''; } }
function applyMailto() {
  const a = address(); const l = emailLink();
  if (a && l) l.setAttribute('href', `mailto:${a}?subject=${encodeURIComponent('Hello Abhishek - found your portfolio')}&body=${encodeURIComponent('Hi Abhishek,\n\n')}`);
}
applyMailto(); setTimeout(applyMailto, 0); addEventListener('load', applyMailto);
document.addEventListener('pointerdown', (e) => { if ((e.target as HTMLElement).closest?.('a[data-pf-protected="email"]')) applyMailto(); }, true);
document.addEventListener('focusin', (e) => { if ((e.target as HTMLElement).closest?.('a[data-pf-protected="email"]')) applyMailto(); });
$$<HTMLAnchorElement>('a[data-pf-protected="phone"]').forEach((a) => { try { a.setAttribute('href', 'tel:' + atob(a.dataset.v || '')); } catch {} });

const copyBtn = $<HTMLButtonElement>('[data-copy-email]');
const copyStatus = $<HTMLElement>('[data-copy-status]');
copyBtn?.addEventListener('click', async () => {
  const text = address();
  if (!text) return;
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; } catch {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;opacity:0';
    document.body.appendChild(ta); ta.select();
    try { ok = document.execCommand('copy'); } catch {}
    ta.remove();
  }
  if (copyStatus) copyStatus.textContent = ok ? 'Copied. Paste away.' : 'Could not copy. The address is in the pink button.';
  setTimeout(() => { if (copyStatus) copyStatus.textContent = ''; }, 3500);
});

// ───────── photo lightbox with "deflate" ─────────
const dlg = $<HTMLDialogElement>('[data-lb-dialog]');
const lbHolder = $<HTMLElement>('[data-lb-holder]');
let lbImg: HTMLImageElement | null = null;
const lbCap = $<HTMLElement>('[data-lb-cap]', dlg ?? document);
const lbToggle = $<HTMLButtonElement>('[data-lb-toggle]');
let cur = { src: '', orig: '', alt: '' };
let showingOrig = false;
function paintLb() {
  if (!lbImg && lbHolder) { lbImg = document.createElement('img'); lbImg.decoding = 'async'; lbHolder.appendChild(lbImg); }
  if (!lbImg) return;
  lbImg.src = showingOrig ? cur.orig : cur.src;
  lbImg.alt = showingOrig ? `${cur.alt} (original, untreated)` : cur.alt;
  if (lbToggle) { lbToggle.textContent = showingOrig ? 'Re-inflate (candy grade)' : 'Deflate (see original)'; lbToggle.setAttribute('aria-pressed', String(showingOrig)); }
}
$$<HTMLAnchorElement>('a[data-lb]').forEach((a) => {
  a.addEventListener('click', (e) => {
    if (!dlg || typeof dlg.showModal !== 'function') return;
    e.preventDefault();
    const img = a.querySelector('img');
    cur = { src: a.dataset.lbSrc || a.href, orig: a.dataset.lbOrig || a.href, alt: img?.alt || '' };
    showingOrig = false;
    if (lbCap) lbCap.textContent = a.dataset.lbCap || img?.alt || '';
    paintLb();
    dlg.showModal();
  });
});
lbToggle?.addEventListener('click', () => { showingOrig = !showingOrig; paintLb(); });
dlg?.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

// ═════════════ squishy lab ═════════════
const say = (el: HTMLElement | null, text: string) => { if (el) el.textContent = text; };

// ── 1. pump it up ──
(() => {
  const stage = $<HTMLElement>('[data-pump-stage]');
  const balloon = $<HTMLElement>('[data-pump-balloon]');
  const burst = $<HTMLElement>('[data-burst]');
  const status = $<HTMLElement>('[data-pump-status]');
  const up = $<HTMLButtonElement>('[data-pump-up]');
  const down = $<HTMLButtonElement>('[data-pump-down]');
  if (!stage || !balloon) return;
  let air = 0; let gone = false; let timer: number | undefined;
  const paint = () => {
    balloon.style.setProperty('--air-s', String(0.45 + air * 0.95));
    balloon.classList.toggle('is-hot', air > 0.8);
    say(status, gone ? 'POP! Press Space, or Pump, for a new one.' : `Air: ${Math.round(air * 100)}%${air > 0.8 ? ' - careful!' : ''}`);
  };
  const reset = () => { gone = false; air = 0; balloon.classList.remove('is-gone'); paint(); };
  const pop = () => {
    gone = true; air = 0; balloon.classList.add('is-gone');
    if (burst && !reduce) {
      const cols = ['#ff9ccd', '#8fd3ff', '#ffe66d', '#9cf0cf', '#cdb9ff'];
      burst.innerHTML = '';
      for (let i = 0; i < 14; i++) {
        const s = document.createElement('s'); const a = (i / 14) * Math.PI * 2; const r = 50 + Math.random() * 40;
        s.style.setProperty('--bx', `${Math.cos(a) * r}px`); s.style.setProperty('--by', `${Math.sin(a) * r - 20}px`); s.style.setProperty('--pc', cols[i % cols.length]);
        burst.appendChild(s);
      }
      setTimeout(() => { burst.innerHTML = ''; }, 800);
    }
    paint();
    if (!reduce) setTimeout(() => { if (gone) reset(); }, 1600);
  };
  const pump = (d: number) => { if (gone) { reset(); return; } air = Math.max(0, air + d); if (air > 1) pop(); else paint(); };
  stage.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); pump(0.07); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); pump(-0.1); }
  });
  const hold = (btn: HTMLElement | null, d: number) => {
    if (!btn) return;
    btn.addEventListener('pointerdown', () => { pump(d); timer = window.setInterval(() => pump(d), 130); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, () => { clearInterval(timer); }));
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pump(d); } });
  };
  hold(up, 0.08); hold(down, -0.12);
  paint();
})();

// ── 2. squish pad ──
(() => {
  const btn = $<HTMLButtonElement>('[data-squish]');
  const status = $<HTMLElement>('[data-squish-status]');
  if (!btn) return;
  let n = 0;
  btn.addEventListener('click', () => {
    n += 1; say(status, `Squishes: ${n}${n >= 20 ? ' - that is a lot of squishing' : ''}`);
    if (reduce) return;
    btn.classList.remove('is-squished'); void btn.offsetWidth; btn.classList.add('is-squished');
  });
  btn.addEventListener('animationend', () => btn.classList.remove('is-squished'));
})();

// ── 3. bubble blower ──
(() => {
  const stage = $<HTMLElement>('[data-bubble-stage]');
  const status = $<HTMLElement>('[data-bubble-status]');
  const blow = $<HTMLButtonElement>('[data-bubble-blow]');
  const popAll = $<HTMLButtonElement>('[data-bubble-pop]');
  if (!stage) return;
  const MAX = 16;
  const count = () => stage.querySelectorAll('.sb').length;
  const upd = () => say(status, `Bubbles: ${count()}`);
  const popOne = (b: HTMLElement) => {
    if (b.classList.contains('pop')) return;
    if (reduce) { b.remove(); upd(); return; }
    b.classList.add('pop'); setTimeout(() => { b.remove(); upd(); }, 230);
  };
  const make = () => {
    if (count() >= MAX) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'sb'; b.setAttribute('aria-label', 'Pop bubble'); b.tabIndex = -1;
    const s = 26 + Math.random() * 38;
    b.style.setProperty('--s', `${s}px`); b.style.setProperty('--x', `${14 + Math.random() * 68}%`);
    b.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`); b.style.setProperty('--t', `${4 + Math.random() * 3}s`);
    if (reduce) { b.classList.add('is-static'); b.style.setProperty('--y', `${10 + Math.random() * 60}%`); setTimeout(() => { b.remove(); upd(); }, 4000); }
    else b.addEventListener('animationend', (e) => { if ((e as AnimationEvent).animationName === 'rise') { b.remove(); upd(); } });
    b.addEventListener('pointerenter', () => popOne(b));
    b.addEventListener('click', () => popOne(b));
    stage.appendChild(b); upd();
  };
  const burstOut = () => { const n = 3 + Math.floor(Math.random() * 3); for (let i = 0; i < n; i++) setTimeout(make, reduce ? 0 : i * 90); };
  const clear = () => stage.querySelectorAll<HTMLElement>('.sb').forEach(popOne);
  stage.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'b') { e.preventDefault(); burstOut(); }
    else if (e.key.toLowerCase() === 'p') { e.preventDefault(); clear(); }
  });
  blow?.addEventListener('click', burstOut);
  popAll?.addEventListener('click', clear);
})();

// ── 4. light orb ──
(() => {
  const stage = $<HTMLElement>('[data-orb-stage]');
  const orb = $<HTMLElement>('[data-orb]');
  const status = $<HTMLElement>('[data-orb-status]');
  if (!stage || !orb) return;
  let lx = 30, ly = 26;
  const name = () => `${ly < 36 ? 'top' : ly > 64 ? 'bottom' : 'middle'}${lx < 36 ? '-left' : lx > 64 ? '-right' : ''}`.replace('middle', 'centre');
  const paint = () => { orb.style.setProperty('--lx', `${lx}%`); orb.style.setProperty('--ly', `${ly}%`); say(status, `Light: ${name()}`); };
  stage.addEventListener('pointermove', (e) => {
    const r = orb.getBoundingClientRect();
    lx = Math.min(88, Math.max(12, ((e.clientX - r.left) / r.width) * 100));
    ly = Math.min(88, Math.max(12, ((e.clientY - r.top) / r.height) * 100));
    paint();
  });
  stage.addEventListener('keydown', (e) => {
    const step = 10;
    if (e.key === 'ArrowLeft') lx -= step; else if (e.key === 'ArrowRight') lx += step;
    else if (e.key === 'ArrowUp') ly -= step; else if (e.key === 'ArrowDown') ly += step;
    else if (e.key.toLowerCase() === 'r') { lx = 30; ly = 26; }
    else return;
    e.preventDefault(); lx = Math.min(88, Math.max(12, lx)); ly = Math.min(88, Math.max(12, ly)); paint();
  });
})();
