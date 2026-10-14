import { readFile, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readAnalysis, renderMarkdown } from './analyze-batch.mjs';
import { checkThriftArtifacts } from './analyze-thrift.mjs';
import { SITE_FILES } from './site-files.mjs';

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
let totalIds = 0;
for (const [page, script] of [['pond.html', 'src/app.js'], ['index.html', 'src/case.js']]) {
const html = await readFile(path.join(root, page), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
if (ids.length !== new Set(ids).size) throw new Error('Duplicate HTML IDs');
totalIds += ids.length;
const app = await readFile(path.join(root, script), 'utf8');
for (const match of app.matchAll(/\$\('([^']+)'\)/g)) {
  if (!ids.includes(match[1])) throw new Error(`Missing DOM target: ${match[1]}`);
}
if (!html.includes('<html lang="en">')) throw new Error(`${page} must default to English`);
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const reference = match[1];
  if (/^(https?:|data:|mailto:)/.test(reference)) continue;
  if (reference.startsWith('/')) throw new Error(`Root-relative link breaks Pages: ${reference}`);
  const target = reference.replace(/^\.\//, '').split(/[?#]/)[0];
  if (!SITE_FILES.includes(target)) throw new Error(`Unpublished local asset: ${target}`);
  await readFile(path.join(root, target));
}
}
for (const file of SITE_FILES) await readFile(path.join(root, file));
const engine = await readFile(path.join(root, 'src/engine.js'), 'utf8');
if (/Math\.random\s*\(/.test(engine)) throw new Error('Unseeded randomness in engine');
console.log(`Syntax checked ${files.length} JavaScript files; ${totalIds} DOM IDs across both pages and public asset links verified.`);
const analysis = await readAnalysis();
for (const [filename, expected] of [
  ['paired-analysis.json', JSON.stringify(analysis, null, 2) + '\n'],
  ['paired-analysis.md', renderMarkdown(analysis)],
]) {
  if (await readFile(path.join(root, 'docs', filename), 'utf8') !== expected) {
    throw new Error(`Stale ${filename}; run npm run analyze -- --write`);
  }
}
console.log('Paired analysis artifacts match the frozen input.');
await checkThriftArtifacts();
console.log('Four-arm thrift artifacts match raw evidence and frozen inputs.');
