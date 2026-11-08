/**
 * Memphis behaviour (small, vanilla):
 *  - mobile menu, scroll-spy highlight in the ribbon
 *  - email: mailto with a pre-filled subject/body + a copy-to-clipboard button (works as a plain mailto link too)
 *  - sticker lightbox with "peel to original"
 * Everything that moves is one-shot and skipped under prefers-reduced-motion.
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
root.classList.add('js');

// ───────── menu ─────────
const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
const nav = document.querySelector<HTMLElement>('[data-nav]');
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
document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]').forEach((a) => links.set(a.dataset.navLink!, a));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const id = (en.target as HTMLElement).id;
      links.forEach((a, k) => { if (k === id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    }
  }, { rootMargin: '-35% 0px -60% 0px' });
  document.querySelectorAll<HTMLElement>('[data-pf-section]').forEach((s) => io.observe(s));
}

// ───────── email: pre-filled mailto + copy ─────────
const SUBJECT = 'Hello Abhishek - found your portfolio';
const BODY = 'Hi Abhishek,\n\n';
const emailLinks = () => [...document.querySelectorAll<HTMLAnchorElement>('a[data-pf-protected="email"]')];
function address(): string {
  const a = emailLinks()[0];
  try { return atob(a?.dataset.v || ''); } catch { return ''; }
}
function applyMailto() {
  const addr = address();
  if (!addr) return;
  const href = `mailto:${addr}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;
  emailLinks().forEach((a) => a.setAttribute('href', href));
}
// the shared <Protected> script also writes href; re-apply after it and right before any interaction
applyMailto();
setTimeout(applyMailto, 0);
addEventListener('load', applyMailto);
document.addEventListener('pointerdown', (e) => { if ((e.target as HTMLElement).closest?.('a[data-pf-protected="email"]')) applyMailto(); }, true);
document.addEventListener('focusin', (e) => { if ((e.target as HTMLElement).closest?.('a[data-pf-protected="email"]')) applyMailto(); });
document.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest?.('a[data-pf-protected="email"]')) applyMailto(); }, true);

// phone label
document.querySelectorAll<HTMLAnchorElement>('a[data-pf-protected="phone"]').forEach((a) => {
  const v = a.querySelector('[data-reveal]');
  try { if (v) v.textContent = atob(a.dataset.d || ''); } catch {}
});

const box = document.querySelector<HTMLElement>('[data-mailbox]');
const copyBtn = box?.querySelector<HTMLButtonElement>('[data-copy-email]');
const copyLabel = box?.querySelector<HTMLElement>('[data-copy-label]');
const status = box?.querySelector<HTMLElement>('[data-copy-status]');
const host = box?.querySelector<HTMLElement>('[data-confetti]');
const idleNote = status?.textContent ?? '';
let resetTimer: number | undefined;

function legacyCopy(text: string): boolean {
  const ta = document.createElement('textarea');
  ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
  document.body.appendChild(ta); ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch {}
  ta.remove();
  return ok;
}
function burst() {
  if (!host || reduce) return;
  const colors = ['#ff4fa3', '#19d3c5', '#ffe94a', '#2b4bff', '#b69cff', '#ff7a45'];
  const kinds = ['', 'cb-round', 'cb-tri'];
  for (let i = 0; i < 16; i++) {
    const b = document.createElement('span');
    b.className = `confetti-bit ${kinds[i % 3]}`;
    const a = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
    const d = 70 + Math.random() * 70;
    b.style.setProperty('--cc', colors[i % colors.length]);
    b.style.setProperty('--dx', `${Math.cos(a) * d}px`);
    b.style.setProperty('--dy', `${Math.sin(a) * d - 20}px`);
    b.style.setProperty('--dr', `${(Math.random() - 0.5) * 540}deg`);
    host.appendChild(b);
    setTimeout(() => b.remove(), 900);
  }
}
copyBtn?.addEventListener('click', async () => {
  const addr = address();
  if (!addr) return;
  let ok = false;
  try { await navigator.clipboard.writeText(addr); ok = true; } catch { ok = legacyCopy(addr); }
  if (copyLabel) copyLabel.textContent = ok ? 'Copied!' : 'Copy failed';
  if (status) status.textContent = ok ? 'Copied to your clipboard. Paste it anywhere.' : 'Could not copy automatically: the address is shown above, so select it and copy.';
  box?.classList.toggle('is-copied', ok);
  if (ok) burst();
  clearTimeout(resetTimer);
  resetTimer = window.setTimeout(() => {
    if (copyLabel) copyLabel.textContent = 'Copy address';
    if (status) status.textContent = idleNote;
    box?.classList.remove('is-copied');
  }, 3000);
});

// ───────── sticker lightbox ─────────
const photoLinks = [...document.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]')];
const dlg = document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
if (dlg && photoLinks.length && typeof dlg.showModal === 'function') {
  const frame = dlg.querySelector<HTMLElement>('[data-lb-frame]')!;
  const cap = dlg.querySelector<HTMLElement>('[data-lb-cap]')!;
  const peel = dlg.querySelector<HTMLButtonElement>('[data-lb-peel]')!;
  let img: HTMLImageElement | null = null;
  let idx = 0;
  let peeled = false;
  const current = () => photoLinks[idx];
  function paint() {
    const a = current();
    const thumb = a.querySelector('img');
    if (!img) { img = document.createElement('img'); img.className = 'lb-img'; frame.prepend(img); }
    img.src = peeled && a.dataset.orig ? a.dataset.orig : a.href;
    img.alt = peeled ? `${thumb?.alt ?? ''} (original photo)` : (thumb?.alt ?? '');
    cap.textContent = a.dataset.cap || thumb?.alt || '';
    peel.textContent = peeled ? 'Stick it back' : 'Peel to original';
    peel.setAttribute('aria-pressed', String(peeled));
  }
  function show(i: number) { idx = (i + photoLinks.length) % photoLinks.length; peeled = false; paint(); }
  photoLinks.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); show(i); dlg.showModal(); }));
  dlg.querySelector('[data-lb-prev]')?.addEventListener('click', () => show(idx - 1));
  dlg.querySelector('[data-lb-next]')?.addEventListener('click', () => show(idx + 1));
  dlg.querySelector('[data-lb-close]')?.addEventListener('click', () => dlg.close());
  peel.addEventListener('click', () => { peeled = !peeled; paint(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') show(idx - 1); else if (e.key === 'ArrowRight') show(idx + 1); });
}
