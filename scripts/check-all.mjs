#!/usr/bin/env node
/** Builds the whole site, serves dist/ and runs the acceptance check on /clean/ and every built theme.  npm run check:all */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
const PORT = process.env.PORT || '4488';
const ids = fs.readdirSync('src/themes', { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith('_') && fs.existsSync(`src/themes/${d.name}/Page.astro`)).map((d) => d.name);
// Refuse to run if something already answers on the port: a leftover server from an earlier run would be checked instead of this build.
if (await fetch(`http://localhost:${PORT}/`).then(() => true, () => false)) {
  console.error(`Port ${PORT} is already in use (a stale 'astro preview'?). Stop it, or run with PORT=<free port>.`);
  process.exit(2);
}
const b = spawnSync('npm', ['run', 'build'], { stdio: 'inherit' });
if (b.status) process.exit(b.status);
// Run astro directly (not through npx) so that srv.kill() stops the real server instead of orphaning it.
const srv = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--port', PORT], { stdio: 'ignore' });
process.on('exit', () => srv.kill());
await new Promise((r) => setTimeout(r, 3500));
const rows = [];
for (const target of [['--path', '/clean/'], ...ids.map((i) => [i])]) {
  const r = spawnSync('node', ['scripts/check-theme.mjs', ...target, '--port', PORT], { encoding: 'utf8' });
  const last = (r.stdout.match(/(\d+) passed, (\d+) failed, (\d+) warnings/) || []);
  rows.push(`${(target[1] || target[0]).padEnd(16)} ${r.status === 0 ? 'OK  ' : 'FAIL'} ${last[0] || r.stderr.slice(0, 120)}`);
  if (r.status !== 0) console.log(r.stdout.split('\n').filter((l) => l.startsWith('FAIL')).join('\n'));
}
srv.kill();
console.log('\n' + rows.join('\n'));
process.exit(rows.some((x) => x.includes('FAIL')) ? 1 : 0);
