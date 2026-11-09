import { defineConfig } from 'astro/config';

// Isolated dev (PF_ONLY=my-theme astro dev): don't reload when OTHER themes' files change (many agents edit in parallel).
const only = (process.env.PF_ONLY ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const ignoreOthers = (p) => {
  const t = p.match(/\/src\/themes\/([^/]+)\//); if (t && !t[1].startsWith('_') && !only.includes(t[1])) return true;
  const r = p.match(/\/src\/pages\/s\/([^/]+)\//); if (r && !only.includes(r[1])) return true;
  const g = p.match(/\/public\/generated\/([^/]+)\//); if (g && g[1] !== '_original' && !only.includes(g[1])) return true;
  const m = p.match(/\/src\/generated\/manifest\/([^/]+)\.json$/); if (m && m[1] !== '_original' && !only.includes(m[1])) return true;
  return /\/(research|docs|scripts|tools|\.git|\.github)\//.test(p) || /\/public\/previews\//.test(p);
};

// Published at https://abhishekkumar11724.github.io/myoccident/  (the "myoccident" repository's GitHub Pages site)  ->  base "/myoccident/".
// All internal links and /public assets go through withBase() (src/lib/urls.ts), so they follow this value.
// Moving to a user-site repo or a custom domain served at the root? Set base to '/' (and `site` to the new origin).
// The checker scripts read `base` from here, and `npm run dev` / `npm run preview` serve under it too.
export default defineConfig({
  site: 'https://abhishekkumar11724.github.io',
  base: '/myoccident/',
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  vite: { server: { watch: only.length ? { ignored: [ignoreOthers] } : undefined } },
});
