// The complete public website. Build and local preview share this allowlist.
export const SITE_FILES = [
  'index.html', 'pond.html', 'case.css', 'styles.css', 'favicon.svg',
  'src/app.js', 'src/case.js', 'src/engine.js', 'src/render.js',
  'src/i18n.js', 'src/translations.js',
  'docs/paired-analysis.json', 'docs/thrift-analysis.json',
  'docs/replication-analysis.json',
  'docs/screenshots/pond.png', 'docs/article/morrow-article.docx',
];
export const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.json': 'application/json; charset=utf-8',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};
