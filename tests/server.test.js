import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

for (const prefix of ['', '/Morrow']) test(`loopback server at ${prefix || '/'} serves only public assets`, async (t) => {
  // A separate ephemeral port avoids touching a user's running pond.
  const child = spawn(process.execPath, ['server.mjs'], {
    cwd: new URL('..', import.meta.url), env: { ...process.env, PORT: '0', BASE_PATH: prefix },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  t.after(async () => {
    if (child.exitCode === null) { child.kill(); await once(child, 'exit'); }
  });
  let output = '';
  const base = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Server startup timed out')), 5000);
    child.on('error', (error) => { clearTimeout(timeout); reject(error); });
    child.stdout.on('data', (chunk) => {
      output += chunk.toString();
      const match = output.match(/http:\/\/127\.0\.0\.1:(\d+)/);
      if (match && match[1] !== '0') { clearTimeout(timeout); resolve(match[0] + prefix); }
    });
    child.on('exit', (code) => { clearTimeout(timeout); reject(new Error(`Server exited ${code}`)); });
  });
  const page = await fetch(base + '/');
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Morrow/);
  assert.match(page.headers.get('content-security-policy'), /default-src 'self'/);
  const script = await fetch(`${base}/src/engine.js`);
  assert.equal(script.status, 200);
  assert.match(script.headers.get('content-type'), /javascript/);
  const pond = await fetch(`${base}/pond.html?lang=tr`);
  assert.equal(pond.status, 200); assert.match(await pond.text(), /src\/app.js/);
  const evidence = await fetch(`${base}/docs/paired-analysis.json`);
  assert.equal(evidence.status, 200);
  assert.match(evidence.headers.get('content-type'), /application\/json/);
  assert.equal((await evidence.json()).sampleSize, 12);
  const article = await fetch(`${base}/docs/article/morrow-article.docx`, { method: 'HEAD' });
  assert.equal(article.status, 200); assert.match(article.headers.get('content-type'), /wordprocessingml/);
  for (const route of ['/.git/config', '/.env', '/AGENTS.md', '/package.json', '/docs/thrift-raw.json', '/scripts/site-files.mjs', '/.local/pages/index.html', '/src/missing.js', '/%zz', '/%2e%2e/Codex/CODEX.md']) {
    assert.equal((await fetch(`${base}${route}`)).status, 404, route);
  }
  assert.equal((await fetch(base + '/', { method: 'POST' })).status, 405);
  const head = await fetch(base + '/', { method: 'HEAD' });
  assert.equal(head.status, 200); assert.equal(await head.text(), '');
});
