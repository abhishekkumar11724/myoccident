#!/usr/bin/env node
/**
 * Automated acceptance check for a theme (or /clean/). Needs a running server:
 *     PF_ONLY=glitch npx astro dev --port 4401        # in another terminal / background
 *     node scripts/check-theme.mjs glitch --port 4401 [--previews]
 *     node scripts/check-theme.mjs --path /clean/ --port 4401
 *
 * Drives real Chrome (desktop 1440x900, phone 390x844, desktop with prefers-reduced-motion) and verifies:
 * required sections/hooks, ALL resume content present, photos (count / alt / loaded), no console errors,
 * no failed or external requests, no horizontal overflow, WCAG contrast (warn), reduced-motion, fonts loaded.
 * Screenshots land in /tmp/pf-shots/<id>/ (desktop-fold.png, desktop-seg-N.jpg, mobile-seg-N.jpg ...) - LOOK AT THEM.
 * Exit code 1 if any hard check fails.
 */
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const has = (n) => argv.includes(`--${n}`);
const valueFlags = new Set(['--port', '--path']);
const id = argv.filter((a, i) => !a.startsWith('--') && !valueFlags.has(argv[i - 1]))[0];
const port = opt('port', '4321');
const urlPath = opt('path', id ? `/s/${id}/` : '/');
const url = `http://localhost:${port}${urlPath}`;
const label = id || urlPath.replace(/\W+/g, '') || 'root';
const shots = path.join('/tmp/pf-shots', label);
fs.mkdirSync(shots, { recursive: true });
for (const f of fs.readdirSync(shots)) fs.rmSync(path.join(shots, f), { force: true });

const CHROME = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'].find((p) => fs.existsSync(p));
if (!CHROME) { console.error('No Chrome/Brave found'); process.exit(2); }

const { profile } = await import(pathToFileURL(path.join(ROOT, 'src/content/profile.ts')).href);
const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').trim();

const results = [];
const hard = (name, ok, detail = '') => results.push({ name, ok: !!ok, level: 'fail', detail });
const soft = (name, ok, detail = '') => results.push({ name, ok: !!ok, level: 'warn', detail });

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--force-color-profile=srgb'] });

async function load(ctxOpts, tag) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const log = { console: [], pageErrors: [], failed: [], external: [], bad: [] };
  page.on('console', (m) => { if (m.type() === 'error') log.console.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => log.pageErrors.push(String(e).slice(0, 200)));
  page.on('requestfailed', (r) => log.failed.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on('request', (r) => { const u = new URL(r.url()); if (!['localhost', '127.0.0.1'].includes(u.hostname) && !['data:', 'blob:'].includes(u.protocol)) log.external.push(r.url()); });
  page.on('response', (r) => { if (r.status() >= 400) log.bad.push(`${r.status()} ${r.url()}`); });
  const resp = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.addStyleTag({ content: 'html,body{scroll-behavior:auto !important}' }); // themes may use smooth scrolling; we need instant jumps
  await page.evaluate(() => document.fonts?.ready);
  // scroll through to trigger lazy images / reveal-on-scroll, then return
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.max(300, Math.round((ctxOpts.viewport?.height ?? 800) * 0.7));
  for (let y = 0; y < H + step; y += step) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(90); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  return { ctx, page, log, status: resp?.status() ?? 0, tag };
}

async function tiles(page, prefix, maxTiles = 9, tileH = 1700) {
  const buf = await page.screenshot({ fullPage: true, type: 'png' });
  const meta = await sharp(buf).metadata();
  const n = Math.min(maxTiles, Math.ceil(meta.height / tileH));
  for (let i = 0; i < n; i++) {
    const top = i * tileH, h = Math.min(tileH, meta.height - top);
    await sharp(buf).extract({ left: 0, top, width: meta.width, height: h }).jpeg({ quality: 78 }).toFile(path.join(shots, `${prefix}-seg-${i + 1}.jpg`));
  }
  return { pageHeight: meta.height, tiles: n };
}

// ----------------------------------------------------------- DESKTOP
const d = await load({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }, 'desktop');
await d.page.screenshot({ path: path.join(shots, 'desktop-fold.png') });
const dt = await tiles(d.page, 'desktop');
hard('HTTP 200', d.status === 200, `status ${d.status}`);
hard('<title> has the name', (await d.page.title()).includes(profile.name), await d.page.title());
hard('exactly one <h1>', (await d.page.locator('h1').count()) === 1, `${await d.page.locator('h1').count()} h1`);
hard('has <main> landmark', (await d.page.locator('main').count()) >= 1);
hard('html lang set', !!(await d.page.getAttribute('html', 'lang')));

const sections = ['hero', 'about', 'experience', 'skills', 'case-studies', 'projects', 'beyond-code', 'writing', 'contact'];
for (const s of sections) hard(`section [data-pf-section=${s}]`, (await d.page.locator(`[data-pf-section="${s}"]`).count()) >= 1);
hard('resume link [data-pf-resume] -> .pdf', await d.page.evaluate(() => { const a = document.querySelector('a[data-pf-resume]'); return !!a && /\.pdf$/i.test(a.getAttribute('href') || ''); }));
hard('email link decoded (mailto:)', await d.page.evaluate(() => (document.querySelector('a[data-pf-email]')?.getAttribute('href') || '').startsWith('mailto:')));
hard('phone link decoded (tel:)', await d.page.evaluate(() => (document.querySelector('a[data-pf-phone]')?.getAttribute('href') || '').startsWith('tel:')));
hard('LinkedIn link', await d.page.evaluate(() => /linkedin\.com\/in\//.test(document.querySelector('a[data-pf-linkedin]')?.getAttribute('href') || '')));
hard('GitHub link', await d.page.evaluate(() => /github\.com\//.test(document.querySelector('a[data-pf-github]')?.getAttribute('href') || '')));
hard('contact form [data-pf-contact] with 3 inputs', await d.page.evaluate(() => { const f = document.querySelector('form[data-pf-contact]'); return !!f && f.querySelectorAll('input[name=name],input[name=email],textarea[name=message]').length === 3; }));
hard('UtilityBar present + visible', await d.page.locator('[data-pf-bar]').first().isVisible());
hard('UtilityBar has Clean view link', (await d.page.locator('[data-pf-bar] a[data-pf-clean], [data-pf-bar] .pf-bar-name').count()) >= 1);
// bar must be on screen & unobscured
const barOk = await d.page.evaluate(() => { const b = document.querySelector('[data-pf-bar]'); if (!b) return false; const r = b.getBoundingClientRect(); if (r.width < 100 || r.bottom > innerHeight + 1 || r.top < 0) return false; const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!el && b.contains(el); });
hard('UtilityBar on-screen and not covered', barOk);

// content coverage (textContent so collapsed accordions/tabs still count)
const text = norm(await d.page.evaluate(() => document.body.textContent || ''));
const need = [];
for (const e of profile.experience) { need.push(e.company, e.title); for (const b of e.bullets) need.push(b.head); }
for (const c of profile.caseStudies.filter((c) => c.featured)) need.push(c.title);
for (const p of profile.projects) need.push(p.title);
for (const g of profile.skills) { need.push(g.group); for (const i of g.items) need.push(i); }
for (const e of profile.education) need.push(e.school);
for (const s of profile.stats) need.push(s.value);
need.push(profile.name, profile.role);
const missing = [...new Set(need)].filter((n) => !text.includes(norm(n)));
hard('all resume content present', missing.length === 0, missing.length ? `missing: ${missing.slice(0, 12).join(' | ')}${missing.length > 12 ? ' ...' : ''}` : `${new Set(need).size} items`);
const factsOk = ['~5M', '1000+', '150+', '~68%'].every((f) => text.includes(f.toLowerCase()));
hard('key numbers shown (~5M, 1000+, 150+, ~68%)', factsOk);

// images
const imgs = await d.page.evaluate(() => [...document.images].map((i) => ({ src: i.currentSrc || i.src, alt: i.getAttribute('alt'), ok: i.complete && i.naturalWidth > 0, hidden: !!i.closest('[aria-hidden="true"]') })));
const gen = imgs.filter((i) => i.src.includes('/generated/'));
const uniq = new Set(gen.map((i) => i.src.replace(/\.thumb(\.\w+)$/, '$1')));
hard('>= 24 distinct art-treated photos on page', uniq.size >= 24, `${uniq.size} distinct`);
hard('every <img> has an alt attribute', imgs.every((i) => i.alt !== null), `${imgs.filter((i) => i.alt === null).length} missing`);
hard('photos have meaningful alt (not empty) unless decorative', gen.filter((i) => !i.hidden).every((i) => (i.alt || '').length > 3), `${gen.filter((i) => !i.hidden && (i.alt || '').length <= 3).length} empty`);
hard('all images loaded', imgs.every((i) => i.ok), imgs.filter((i) => !i.ok).slice(0, 4).map((i) => i.src).join(', '));
const portraitCount = gen.filter((i) => /portraits|adventure|bikes|friends/.test(i.src)).length;
soft('shows "me" photos (portraits/adventure/bikes/friends)', portraitCount >= 8, `${portraitCount}`);

// errors / network
const L = d.log;
hard('no console errors', L.console.length === 0 && L.pageErrors.length === 0, [...L.console, ...L.pageErrors].slice(0, 3).join(' || '));
hard('no failed requests / 4xx', L.failed.length === 0 && L.bad.length === 0, [...L.failed, ...L.bad].slice(0, 3).join(' || '));
hard('no external requests (everything self-hosted)', L.external.length === 0, [...new Set(L.external)].slice(0, 4).join(', '));
hard('no horizontal overflow (desktop)', await d.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `scrollWidth ${await d.page.evaluate(() => document.documentElement.scrollWidth)}`);

// fonts
const fonts = await d.page.evaluate(() => { const f = [...document.fonts]; return { n: f.length, errors: f.filter((x) => x.status === 'error').map((x) => x.family), unloaded: f.filter((x) => x.status === 'unloaded').map((x) => x.family) }; });
hard('custom fonts load without error', fonts.errors.length === 0, fonts.errors.join(','));
soft('theme ships its own @font-face fonts', fonts.n > 0, `${fonts.n} faces`);

// contrast (warn): text >= 14px, solid backgrounds only
const lowContrast = await d.page.evaluate(() => {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }; };
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const L = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const bgOf = (el) => { let acc = null; for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage !== 'none') return null; const c = parse(cs.backgroundColor); if (c && c.a > 0.02) { if (c.a >= 0.98) return acc ? { r: acc.r * acc.a + c.r * (1 - acc.a), g: acc.g * acc.a + c.g * (1 - acc.a), b: acc.b * acc.a + c.b * (1 - acc.a), a: 1 } : c; acc = c; } } return acc ? { ...acc, a: 1 } : { r: 255, g: 255, b: 255, a: 1 }; };
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (w.nextNode()) {
    const t = w.currentNode; if (!t.textContent.trim()) continue; const el = t.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4 || el.closest('[data-pf-bar],dialog,[aria-hidden="true"]')) continue;
    if (parseFloat(cs.fontSize) < 12) continue;
    const fg = parse(cs.color), bg = bgOf(el); if (!fg || !bg) continue;
    const a = L(fg), b = L(bg), ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const large = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700);
    if (ratio < (large ? 3 : 4.5)) out.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} "${t.textContent.trim().slice(0, 24)}" ${ratio.toFixed(1)}:1`);
  }
  return out;
});
const domLowContrast = lowContrast; // reported later only if the (authoritative) pixel-sampled test also complains

// pixel-sampled contrast: collect text boxes, hide all text, screenshot the real backdrop behind each box, compute contrast.
{
  const samples = await d.page.evaluate(() => {
    const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }; };
    const out = [], seen = new Set(), w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const t = w.currentNode, txt = t.textContent.trim(); if (txt.length < 3) continue;
      const el = t.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
      if (el.closest('[data-pf-bar],dialog,[aria-hidden="true"],svg,script,style,noscript,canvas,[hidden]')) continue;
      const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      let op = 1; for (let e = el; e; e = e.parentElement) op *= +getComputedStyle(e).opacity; if (op < 0.2) continue;
      const rg = document.createRange(); rg.selectNodeContents(t); const r = rg.getBoundingClientRect(); if (r.width < 10 || r.height < 8) continue;
      if (r.right <= 4 || r.bottom <= 4 || r.left >= innerWidth - 4 || el.closest('.skip,[class*="skip"],[class*="sr-only"],[class*="visually-hidden"]')) continue; // off-screen / focus-only text
      const fg = parse(cs.color); if (!fg || fg.a * op < 0.2) continue;
      if (parseFloat(cs.fontSize) < 12) continue;
      out.push({ x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height, fg: [fg.r, fg.g, fg.b], a: Math.min(1, fg.a * op), fs: parseFloat(cs.fontSize), fw: +cs.fontWeight, txt: txt.slice(0, 26), tag: el.tagName.toLowerCase() + '.' + String(el.className || '').split(' ')[0] });
    }
    return out;
  });
  const pick = samples.length > 90 ? samples.filter((_, i) => i % Math.ceil(samples.length / 90) === 0) : samples;
  await d.page.addStyleTag({ content: '*,*::before,*::after{color:transparent !important;-webkit-text-fill-color:transparent !important;text-shadow:none !important;-webkit-text-stroke:0 !important;caret-color:transparent !important}input::placeholder,textarea::placeholder{color:transparent !important}' });
  await d.page.waitForTimeout(150);
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const Lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const bad = []; let measured = 0;
  for (const q of pick) {
    try {
      const clip = { x: Math.max(0, q.x), y: Math.max(0, q.y), width: Math.min(q.w, 700), height: Math.min(q.h, 140) };
      const png = await d.page.screenshot({ clip, fullPage: true, type: 'png', timeout: 8000 });
      const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      const lums = []; let R = 0, G = 0, B = 0, n = 0;
      for (let i = 0; i < data.length; i += 3 * 3) { lums.push(Lum(data[i], data[i + 1], data[i + 2])); R += data[i]; G += data[i + 1]; B += data[i + 2]; n++; }
      lums.sort((a, b) => a - b);
      const med = lums[Math.floor(lums.length / 2)], mr = R / n, mg = G / n, mb = B / n;
      const er = mr + (q.fg[0] - mr) * q.a, eg = mg + (q.fg[1] - mg) * q.a, eb = mb + (q.fg[2] - mb) * q.a; // effective text colour at its alpha
      const tl = Lum(er, eg, eb);
      const cr = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      const ratio = cr(tl, med), p10 = lums[Math.floor(lums.length * 0.1)], p90 = lums[Math.floor(lums.length * 0.9)];
      const worst = Math.min(cr(tl, p10), cr(tl, p90), ratio);
      const large = q.fs >= 24 || (q.fs >= 18.66 && q.fw >= 700);
      measured++;
      if (ratio < (large ? 3 : 4.5)) bad.push(`${q.tag} "${q.txt}" ${ratio.toFixed(1)}:1 (worst ${worst.toFixed(1)})`);
    } catch { /* element off-canvas; skip */ }
  }
  soft(`pixel-sampled contrast over real backdrops (${measured} text boxes)`, bad.length === 0, `${bad.length} low: ${bad.slice(0, 8).join(' | ')}`);
  if (bad.length) soft('DOM-based contrast (solid backgrounds only; extra signal)', domLowContrast.length === 0, `${domLowContrast.length} low: ${domLowContrast.slice(0, 5).join(' | ')}`);
}
await d.ctx.close();

// ----------------------------------------------------------- MOBILE
const m = await load({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, 'mobile');
await m.page.screenshot({ path: path.join(shots, 'mobile-fold.png') });
const mt = await tiles(m.page, 'mobile', 10, 2400);
// What users experience: can the page scroll sideways? (documentElement.scrollWidth vs the real 390px, then try to scroll.)
// body.scrollWidth is ignored on purpose: decorations clipped with overflow-x:clip still inflate it but cannot be scrolled to.
const mo = await m.page.evaluate(async () => { const w = document.documentElement.scrollWidth; window.scrollTo(120, 0); await new Promise((r) => setTimeout(r, 120)); const sx = window.scrollX; window.scrollTo(0, 0); return { w, sx }; });
hard('no horizontal overflow (phone 390px)', mo.w <= 391 && mo.sx === 0, `page is ${mo.w}px wide in a 390px viewport (scrolled sideways by ${mo.sx}px)`);
hard('phone: no console errors', m.log.console.length === 0 && m.log.pageErrors.length === 0, [...m.log.console, ...m.log.pageErrors].slice(0, 2).join(' || '));
hard('phone: UtilityBar visible', await m.page.locator('[data-pf-bar]').first().isVisible());
const small = await m.page.evaluate(() => { const bad = []; for (const e of document.querySelectorAll('a,button,input,textarea,select')) { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); if (r.width && r.height && cs.visibility !== 'hidden' && (r.width < 24 || r.height < 24) && !e.closest('[data-pf-bar]') && e.getAttribute('name') !== 'botcheck' && !(e.tagName === 'A' && e.closest('p,li,span') && cs.display === 'inline')) bad.push(`${e.tagName.toLowerCase()} ${Math.round(r.width)}x${Math.round(r.height)}`); } return bad; });
soft('phone: tap targets >= 24px', small.length === 0, `${small.length}: ${small.slice(0, 4).join(', ')}`);
await m.ctx.close();

// ----------------------------------------------------------- REDUCED MOTION
const r = await load({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }, 'reduced');
const anims = await r.page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.getTiming().iterations === Infinity && !(a.effect.target?.closest?.('[data-pf-bar]'))).map((a) => a.animationName || a.id || a.effect.target?.className || 'anim'));
hard('prefers-reduced-motion: no infinite CSS animations', anims.length === 0, anims.slice(0, 4).join(', '));
const canvases = await r.page.evaluate(async () => { const c = [...document.querySelectorAll('canvas')]; const snap = () => c.map((x) => { try { return x.toDataURL().length; } catch { return 0; } }); const a = snap(); await new Promise((r) => setTimeout(r, 700)); const b = snap(); return c.length ? b.filter((v, i) => v !== a[i]).length : 0; });
soft('prefers-reduced-motion: canvases are static', canvases === 0, `${canvases} canvas still animating`);
await r.ctx.close();

// ----------------------------------------------------------- previews
if (has('previews') && id) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage(); await page.goto(url, { waitUntil: 'load' }); await page.evaluate(() => document.fonts?.ready); await page.waitForTimeout(1200);
  const out = path.join(ROOT, 'public/previews', `${id}.jpg`); fs.mkdirSync(path.dirname(out), { recursive: true });
  const buf = await page.screenshot({ type: 'png' });
  await sharp(buf).resize(960).jpeg({ quality: 78 }).toFile(out);
  await ctx.close();
}
await browser.close();

// ----------------------------------------------------------- report
const fails = results.filter((x) => !x.ok && x.level === 'fail'), warns = results.filter((x) => !x.ok && x.level === 'warn');
console.log(`\nCheck ${url}\n`);
for (const x of results) console.log(`${x.ok ? 'PASS' : x.level === 'fail' ? 'FAIL' : 'WARN'}  ${x.name}${x.ok || !x.detail ? '' : '  ->  ' + x.detail}`);
console.log(`\n${results.length - fails.length - warns.length} passed, ${fails.length} failed, ${warns.length} warnings`);
console.log(`desktop page height ${dt.pageHeight}px (${dt.tiles} tiles) | mobile ${mt.pageHeight}px (${mt.tiles} tiles)`);
console.log(`screenshots: ${shots}/  (desktop-fold.png, desktop-seg-N.jpg, mobile-fold.png, mobile-seg-N.jpg)`);
fs.writeFileSync(path.join(shots, 'report.json'), JSON.stringify({ url, results }, null, 1));
process.exit(fails.length ? 1 : 0);
