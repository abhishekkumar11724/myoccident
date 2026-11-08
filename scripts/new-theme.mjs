#!/usr/bin/env node
/**  npm run new:theme -- <id>   -> scaffolds src/themes/<id>/ (Page.astro, theme.css, meta.ts, recipe.mjs, client.ts, assets/) and research/<id>.md */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const id = process.argv[2];
if (!id) { console.error('usage: npm run new:theme -- <id>'); process.exit(1); }
const order = fs.readFileSync(path.join(ROOT, 'src/themes/order.ts'), 'utf8');
const m = order.match(new RegExp(`\\{ id: '${id}',\\s+name: '([^']+)',\\s+era: '([^']+)'`));
if (!m) { console.error(`"${id}" is not one of the 19 ids in src/themes/order.ts`); process.exit(1); }
const dir = path.join(ROOT, 'src/themes', id);
if (fs.existsSync(path.join(dir, 'Page.astro'))) { console.error(`${dir}/Page.astro already exists - refusing to overwrite`); process.exit(1); }
fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });

let page = fs.readFileSync(path.join(ROOT, 'src/themes/_template/Page.astro'), 'utf8');
// keep frontmatter + markup, drop the template's global <style> (you write theme.css instead)
page = page.replace(/\n<style is:global>[\s\S]*<\/style>\s*$/, '\n');
page = page.replace("const STYLE = '_template';", `const STYLE = '${id}';\nimport './theme.css';`);
page = page.replace(/<ThemeHead [^>]*\/>/, '<ThemeHead style={STYLE} themeColor="#111111" />');
page = page.replace('<UtilityBar style="clean" variant="clean" />', '<UtilityBar style={STYLE} />');
page = page.replace(/\/\*\*[\s\S]*?\*\//, `/**\n * ${m[1]} theme. START FROM THIS CHECKLIST OF HOOKS, THEN RE-DESIGN THE LAYOUT COMPLETELY.\n * Keep every data-pf-* hook and ALL content (see docs/THEME_GUIDE.md).\n */`);
fs.writeFileSync(path.join(dir, 'Page.astro'), page);

fs.writeFileSync(path.join(dir, 'theme.css'), `/* ${m[1]} - theme styles. Fonts/images referenced with relative url(./assets/...) so Vite bundles them. */\n:root { --pf-bar-bg: rgba(17,17,17,.92); }\nbody { margin: 0; font: 400 17px/1.6 system-ui, sans-serif; padding-bottom: 84px; }\n`);
fs.writeFileSync(path.join(dir, 'client.ts'), `// Optional client-side behaviour for ${m[1]} (import it from Page.astro with <script>import './client.ts'</script>).\n// Respect reduced motion: if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;\nexport {};\n`);
fs.writeFileSync(path.join(dir, 'meta.ts'), `import type { ThemeMeta } from '../registry';\n\nconst meta: ThemeMeta = {\n  id: '${id}',\n  palette: { bg: '#ffffff', fg: '#111111', accent: '#ff0000' },\n  fonts: [],\n  about: {\n    origin: 'TODO: 2-4 sentences on where ${m[1]} comes from.',\n    traits: ['TODO'],\n    inThisSite: 'TODO: how this site interprets the style.',\n    furtherReading: [],\n  },\n  flavor: { kicker: 'TODO', tagline: 'TODO', footer: 'TODO' },\n  credits: [],\n};\nexport default meta;\n`);
fs.writeFileSync(path.join(dir, 'recipe.mjs'), `/** Photo treatment for ${m[1]}. Runs at build time on EVERY file in /photos (see docs/THEME_GUIDE.md, scripts/fx/index.mjs). */\nexport default {\n  maxSize: 1400, thumb: 520, quality: 82, format: 'webp',\n  treatments: {\n    default: (fx, ctx) => fx, // TODO: e.g. fx.kuwahara(4).posterize(5).duotone('#102040', '#f0e0c0')\n  },\n  // pick: (ctx) => (ctx.tags?.includes('night') ? 'night' : 'default'),\n};\n`);
const note = path.join(ROOT, 'research', `${id}.md`);
if (!fs.existsSync(note)) fs.writeFileSync(note, `# ${m[1]} (${m[2]})\n\n_TODO - follow the outline in docs/THEME_GUIDE.md section 2._\n`);
console.log(`scaffolded src/themes/${id}/ and research/${id}.md\nnext: PF_ONLY=${id} npx astro dev --port <PORT>`);
