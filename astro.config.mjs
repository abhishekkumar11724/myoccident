import { defineConfig } from 'astro/config';

// Deployed at the root of https://abhishekkumar11724.github.io  ->  base "/".
// If you ever host under a sub-path, set `base: '/sub-path/'` here; all links go through withBase().
export default defineConfig({
  site: 'https://abhishekkumar11724.github.io',
  base: '/',
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
