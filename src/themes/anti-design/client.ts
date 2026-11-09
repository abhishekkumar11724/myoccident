// Anti-design behaviour: the Lab toys (S R G B M F), photo "original colour" reveal. Cosmetic only, tiny, no dependencies.
const root = document.documentElement;
const out = document.querySelector<HTMLElement>('.lab-out');
const say = (t: string) => { if (out) out.textContent = t; };
const wobbly = () => [...document.querySelectorAll<HTMLElement>('.w')];
const btn = (name: string) => document.querySelector<HTMLButtonElement>(`[data-toy="${name}"]`);
const press = (name: string, on: boolean) => btn(name)?.setAttribute('aria-pressed', String(on));

function shuffle() {
  for (const el of wobbly()) {
    const tall = el.classList.contains('hero-fig') || el.classList.contains('tile') || el.classList.contains('pic') || el.classList.contains('burst');
    const max = el.classList.contains('burst') ? 16 : tall ? 7 : 3.4;
    el.style.setProperty('--sr', `${((Math.random() - 0.5) * 2 * max).toFixed(1)}deg`);
    el.style.setProperty('--sx', `${((Math.random() - 0.5) * (tall ? 2.4 : 1.2)).toFixed(1)}vw`);
    el.style.setProperty('--sy', `${((Math.random() - 0.5) * (tall ? 2.4 : 1.2)).toFixed(1)}vw`);
  }
  say('Shuffled. Nothing important moved. Press R to put it back.');
}
function reset() {
  for (const el of wobbly()) { el.style.removeProperty('--sr'); el.style.removeProperty('--sx'); el.style.removeProperty('--sy'); }
  say('Reset. Back to the original mess.');
}
function toggle(cls: string, name: string, onText: string, offText: string) {
  const on = root.classList.toggle(cls);
  press(name, on);
  say(on ? onText : offText);
}
let lastFact = -1;
function fact() {
  const facts: string[] = JSON.parse(document.getElementById('lab')?.dataset.facts || '[]');
  if (!facts.length) return;
  let i = Math.floor(Math.random() * facts.length);
  if (i === lastFact) i = (i + 1) % facts.length;
  lastFact = i;
  say(`Fact: ${facts[i]}`);
}
const toys: Record<string, () => void> = {
  shuffle,
  reset,
  grid: () => toggle('show-grid', 'grid', 'Grid on: these are the 12 columns this page keeps ignoring.', 'Grid off.'),
  calm: () => toggle('calm', 'calm', 'Boring mode on: no tilt, no overlap, no blend modes. Same content.', 'Boring mode off. Chaos restored.'),
  pause: () => toggle('paused', 'pause', 'Tickers muted.', 'Tickers running again.'),
  fact,
};
document.querySelectorAll<HTMLButtonElement>('[data-toy]').forEach((b) => b.addEventListener('click', () => toys[b.dataset.toy!]?.()));

const keys: Record<string, string> = { s: 'shuffle', r: 'reset', g: 'grid', b: 'calm', m: 'pause', f: 'fact' };
addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
  const t = e.target as HTMLElement | null;
  if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) && (t as HTMLInputElement).type !== 'checkbox')) return;
  const name = keys[e.key.toLowerCase()];
  if (name) toys[name]();
});

// pointer: hover (mouse) or tap shows the untouched photo; leaving puts the treatment back
function reveal(fig: HTMLElement, show: boolean) {
  const img = fig.querySelector<HTMLImageElement>('img');
  const o = fig.dataset.o;
  if (!img || !o) return;
  if (show) { if (!img.dataset.t) img.dataset.t = img.currentSrc || img.src; img.removeAttribute('srcset'); img.src = o; fig.classList.add('real'); }
  else if (img.dataset.t) { img.src = img.dataset.t; fig.classList.remove('real'); }
}
document.querySelectorAll<HTMLElement>('figure[data-o]').forEach((fig) => {
  fig.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') reveal(fig, true); });
  fig.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') reveal(fig, false); });
  fig.addEventListener('click', () => reveal(fig, !fig.classList.contains('real')));
});
