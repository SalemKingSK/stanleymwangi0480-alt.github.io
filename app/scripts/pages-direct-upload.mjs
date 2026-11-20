// Direct-upload a built folder to Cloudflare Pages (same protocol wrangler uses).
// Usage: node scripts/pages-direct-upload.mjs <dir> <branch> [commit message]
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { hash } from 'blake3-wasm';
import mime from 'mime';

const [dir, branch, msg = 'deploy'] = process.argv.slice(2);
const ACCOUNT = '111291be0d1d0afad06d4a93da1078e7';
const PROJECT = 'mystique-compass';
const API = 'https://api.cloudflare.com/client/v4';
const ASSETS = 'https://dash.cloudflare.com/api/v4'; // JWT-authenticated asset endpoints
const SPECIAL = new Set(['_headers', '_redirects', '_routes.json', '_worker.js']);

function walk(d, base = d, out = []) {
  for (const name of readdirSync(d)) {
    const p = path.join(d, name);
    if (statSync(p).isDirectory()) walk(p, base, out);
    else {
      const rel = path.relative(base, p).split(path.sep).join('/');
      if (!SPECIAL.has(rel) && name !== '.DS_Store') out.push({ rel, p });
    }
  }
  return out;
}
const files = walk(dir).map(({ rel, p }) => {
  const buf = readFileSync(p);
  const b64 = buf.toString('base64');
  const ext = path.extname(p).substring(1);
  return { rel, b64, size: buf.length, ct: mime.getType(p) || 'application/octet-stream', h: hash(b64 + ext).toString('hex').slice(0, 32) };
});

const j = async (r) => { const t = await r.text(); try { return JSON.parse(t); } catch { throw new Error(t.slice(0, 300)); } };
const tok = await j(await fetch(`${API}/accounts/${ACCOUNT}/pages/projects/${PROJECT}/upload-token`));
if (!tok.success) throw new Error(JSON.stringify(tok.errors));
const jwt = tok.result.jwt;
const auth = { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' };

const uniq = [...new Map(files.map((f) => [f.h, f])).values()];
const miss = await j(await fetch(`${ASSETS}/pages/assets/check-missing`, { method: 'POST', headers: auth, body: JSON.stringify({ hashes: uniq.map((f) => f.h) }) }));
if (!miss.success) throw new Error(JSON.stringify(miss.errors));
const missing = new Set(miss.result);
const todo = uniq.filter((f) => missing.has(f.h));
console.log(`${files.length} files, ${todo.length} to upload`);

let batch = [], bytes = 0;
const flush = async () => {
  if (!batch.length) return;
  const body = batch.map((f) => ({ key: f.h, value: f.b64, metadata: { contentType: f.ct }, base64: true }));
  const r = await j(await fetch(`${ASSETS}/pages/assets/upload`, { method: 'POST', headers: auth, body: JSON.stringify(body) }));
  if (!r.success) throw new Error(JSON.stringify(r.errors));
  batch = []; bytes = 0;
};
for (const f of todo) {
  if (bytes + f.b64.length > 40 * 1024 * 1024 || batch.length >= 1000) await flush();
  batch.push(f); bytes += f.b64.length;
}
await flush();
const up = await j(await fetch(`${ASSETS}/pages/assets/upsert-hashes`, { method: 'POST', headers: auth, body: JSON.stringify({ hashes: uniq.map((f) => f.h) }) }));
if (!up.success) throw new Error(JSON.stringify(up.errors));

const manifest = Object.fromEntries(files.map((f) => [`/${f.rel}`, f.h]));
const form = new FormData();
form.append('manifest', JSON.stringify(manifest));
form.append('branch', branch);
form.append('commit_message', msg);
form.append('commit_dirty', 'true');
for (const s of ['_headers', '_redirects', '_routes.json']) {
  const p = path.join(dir, s);
  if (existsSync(p)) form.append(s, new Blob([readFileSync(p)]), s);
}
const dep = await j(await fetch(`${API}/accounts/${ACCOUNT}/pages/projects/${PROJECT}/deployments`, { method: 'POST', body: form }));
if (!dep.success) throw new Error(JSON.stringify(dep.errors));
console.log(JSON.stringify({ id: dep.result.id, url: dep.result.url, env: dep.result.environment, aliases: dep.result.aliases }));
