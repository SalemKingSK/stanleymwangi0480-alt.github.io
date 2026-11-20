#!/usr/bin/env node
// Applies source/scripts/data/dob-corrections.json to famous-birthdays.ts.
// Safe to run twice: it only rewrites a record whose current date equals `from`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(here, '../mystique-src/lib/famous-birthdays.ts');
const { corrections } = JSON.parse(fs.readFileSync(path.join(here, 'data/dob-corrections.json'), 'utf8'));
let src = fs.readFileSync(target, 'utf8');
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let applied = 0, already = 0;
const problems = [];

for (const c of corrections) {
  const [fy, fm, fd] = c.from.split('-').map(Number);
  const [ty, tm, td] = c.to.split('-').map(Number);
  // Match the name with or without a " †" / " (…)" suffix, quoted with ' or ".
  const nameRe = `name:\\s*(?<q>['"])${esc(c.name.replace(/'/g, "\\'"))}(?:\\s*†)?(?:\\s*\\([^)]*\\))?(?:\\s*†)?\\k<q>`;
  const rec = (d, m, y) => new RegExp(`(?<a>\\{\\s*${nameRe},\\s*day:\\s*)${d}(?<b>,\\s*month:\\s*)${m}(?<c>,\\s*year:\\s*)${y}(?![0-9])`, 'g');
  const from = rec(fd, fm, fy);
  const n = (src.match(from) || []).length;
  if (n > 0) {
    src = src.replace(from, `$<a>${td}$<b>${tm}$<c>${ty}`);
    applied += n;
  } else if ((src.match(rec(td, tm, ty)) || []).length) {
    already++;
  } else {
    problems.push(c.name);
  }
}
fs.writeFileSync(target, src);
console.log(`applied ${applied}, already correct ${already}, not found ${problems.length}`);
if (problems.length) { console.log('  not found:', problems.join(', ')); process.exitCode = 1; }
