#!/usr/bin/env node
// Runs a TypeScript script against the app source, with the `@/` alias mapped
// to mystique-src/ (the same alias vite.config.ts uses). Uses jiti, which is
// already in node_modules, so it needs no extra install.
//   node scripts/run-ts.mjs scripts/validate-celebrity-accuracy.ts [args]
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const target = process.argv[2];
if (!target) {
  console.error('usage: node scripts/run-ts.mjs <script.ts> [args]');
  process.exit(2);
}
process.argv.splice(2, 1);
// jiti is a transitive dependency (pnpm keeps it under node_modules/.pnpm).
async function loadJiti() {
  try { return await import('jiti'); } catch {}
  const store = path.join(root, 'node_modules/.pnpm');
  const dir = fs.existsSync(store) && fs.readdirSync(store).filter(d => /^jiti@2\./.test(d)).sort().pop();
  if (!dir) throw new Error('jiti not found. Run `npx tsx --tsconfig scripts/tsconfig.scripts.json <script>` instead.');
  return import(pathToFileURL(path.join(store, dir, 'node_modules/jiti/lib/jiti.mjs')).href);
}
const { createJiti } = await loadJiti();
const jiti = createJiti(import.meta.url, {
  alias: { '@/': path.join(root, 'mystique-src') + '/', '@': path.join(root, 'mystique-src') },
  interopDefault: true,
});
await jiti.import(pathToFileURL(path.resolve(process.cwd(), target)).href);
