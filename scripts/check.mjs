import { readFile, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const files = ['server.mjs'];
for (const dir of ['src', 'scripts', 'tests']) {
  for (const name of await readdir(path.join(root, dir))) {
    if (/\.m?js$/.test(name)) files.push(path.join(dir, name));
  }
}
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || `Syntax check failed: ${file}`);
}
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
if (ids.length !== new Set(ids).size) throw new Error('Duplicate HTML IDs');
const app = await readFile(path.join(root, 'src/app.js'), 'utf8');
for (const match of app.matchAll(/\$\('([^']+)'\)/g)) {
  if (!ids.includes(match[1])) throw new Error(`Missing DOM target: ${match[1]}`);
}
for (const match of html.matchAll(/(?:src|href)="\/(?!\/)([^"#]+)"/g)) {
  await readFile(path.join(root, match[1]));
}
const engine = await readFile(path.join(root, 'src/engine.js'), 'utf8');
if (/Math\.random\s*\(/.test(engine)) throw new Error('Unseeded randomness in engine');
console.log(`Syntax checked ${files.length} JavaScript files; ${ids.length} unique DOM IDs and local asset links verified.`);
