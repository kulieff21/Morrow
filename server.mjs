import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT ?? 4317);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png' };
const allowed = new Set(['/index.html', '/styles.css', '/favicon.svg', '/src/app.js', '/src/engine.js', '/src/render.js']);

const server = createServer(async (request, response) => {
  const headers = {
    'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    'Referrer-Policy': 'no-referrer',
  };
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { ...headers, Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const route = pathname === '/' ? '/index.html' : pathname;
    if (!allowed.has(route)) { response.writeHead(404, headers).end('Not found'); return; }
    const filename = await realpath(path.join(root, route.slice(1)));
    if (!filename.startsWith(root + path.sep) || !(await stat(filename)).isFile()) {
      response.writeHead(404, headers).end('Not found'); return;
    }
    const content = await readFile(filename);
    response.writeHead(200, { ...headers, 'Content-Type': types[path.extname(filename)] ?? 'application/octet-stream',
      'Content-Length': content.length });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(404, headers).end('Not found');
  }
});
server.on('error', (error) => { console.error(`Morrow could not start: ${error.message}`); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Morrow is ready at http://127.0.0.1:${server.address().port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
