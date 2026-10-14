import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { SITE_FILES } from '../scripts/site-files.mjs';

test('Pages build replaces stale output and contains exactly the public allowlist', async () => {
  const root = new URL('..', import.meta.url);
  const output = new URL('.local/pages/', root);
  await mkdir(output, { recursive: true });
  await writeFile(new URL('stale-build.txt', output), 'must not be published');
  const result = spawnSync(process.execPath, ['scripts/build-pages.mjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  async function walk(directory, prefix = '') {
    const paths = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const name = prefix + entry.name;
      if (entry.isDirectory()) paths.push(...await walk(new URL(entry.name + '/', directory), name + '/'));
      else paths.push(name);
    }
    return paths;
  }
  assert.deepEqual((await walk(output)).sort(), [...SITE_FILES, '.nojekyll'].sort());
  for (const file of SITE_FILES) {
    assert.deepEqual(await readFile(new URL(file, output)), await readFile(new URL(file, root)), file);
  }
});

test('all published module imports and page fragments resolve below the Pages project path', async () => {
  const root = new URL('..', import.meta.url);
  for (const file of SITE_FILES.filter((name) => name.endsWith('.js'))) {
    const source = await readFile(new URL(file, root), 'utf8');
    for (const match of source.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const url = new URL(match[1], `https://example.test/Morrow/${file}`);
      assert.ok(url.pathname.startsWith('/Morrow/'), url.href);
      assert.ok(SITE_FILES.includes(url.pathname.slice('/Morrow/'.length)), url.href);
    }
  }
  for (const page of ['index.html', 'pond.html']) {
    const html = await readFile(new URL(page, root), 'utf8');
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(match[1]), match[0]);
  }
});
