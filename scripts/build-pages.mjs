import { mkdir, copyFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_FILES } from './site-files.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const output = path.resolve(root, '.local', 'pages');
if (output !== path.join(root, '.local', 'pages')) throw new Error('Invalid build target');
// Only this fixed, disposable build directory is replaced.
await rm(output, { recursive: true, force: true });
for (const file of SITE_FILES) {
  const destination = path.join(output, file);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(path.join(root, file), destination);
}
await writeFile(path.join(output, '.nojekyll'), '');
console.log(`Built ${SITE_FILES.length} public files in ${output}`);
