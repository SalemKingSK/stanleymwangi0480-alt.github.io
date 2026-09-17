// tools/publish-form.mjs — the form table the app's verdict reads.
// Point-in-time for training; at publish time it is the same statistic at the corpus's end,
// which is exactly "now": points per game and goal difference per game over each club's last
// 30 matches, plus its career points per game.
import fs from "fs";
const ROOT = "/home/user/mystique";
const DATA = JSON.parse(fs.readFileSync(`${ROOT}/artifacts/club-dataset.json`, "utf8"));
const R = DATA.rows, clubs = DATA.clubs, N = R.length;
const FIELDS = (DATA.meta.fields || "").split(",").map((f) => f.trim());
const IX = Object.fromEntries(FIELDS.map((f, i) => [f, i]));
const I = { hi: IX.homeIdx, ai: IX.awayIdx, res: IX.res, hg: IX.homeGoals, ag: IX.awayGoals,
            Y: IX.Y, m: IX.m, d: IX.d };
const NAMES = JSON.parse(fs.readFileSync(`${ROOT}/tools/club-display-names.json`, "utf8"));

/* Alias map. The app asks for a club by the name on its LEDGER row ("Brighton & Hove Albion",
   "FC Barcelona", "Hamburger SV"); this file was keyed by the shortened display name, so 22 of
   43 probed names missed and the model silently used the corpus average for that club — which is
   how a 5-0 away win got called as a home win. Every alternate spelling now resolves. */
const ledgerText = fs.readFileSync(`${ROOT}/stanleymwangi0480-alt.github.io-main/source/mystique-src/lib/famous-birthdays.ts`, "utf8");
const rowRe = /\{ name: '((?:[^'\\]|\\.)*)', day: -?\d+, month: -?\d+, year: -?\d+, gender: '[^']*', tags: \[([^\]]*)\](?:, aliases: \[([^\]]*)\])?/g;
const ledgerAliases = {};
for (const m of ledgerText.matchAll(rowRe)) {
  const rowName = m[1].replace(/\\'/g, "'");
  if (!/Football Club/.test(m[2])) continue;
  const al = (m[3] || "").split(",").map((x) => x.trim().replace(/^'|'$/g, "").replace(/\\'/g, "'")).filter(Boolean);
  for (const a of al) ledgerAliases[a] = rowName;
}

const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
  .replace(/\b(fc|cf|sc|ac|afc|ud|cd|sv|vfl|vfb|tsv|bsc|ssc|as|ss|us|rc|rcd|sd|ca|club|football|calcio)\b/g, " ")
  .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const order = [...Array(N).keys()].sort((a, b) => (R[a][I.Y] * 10000 + R[a][I.m] * 100 + R[a][I.d]) - (R[b][I.Y] * 10000 + R[b][I.m] * 100 + R[b][I.d]));
const acc = new Map();
for (const i of order) {
  const hi = R[i][I.hi], ai = R[i][I.ai], res = R[i][I.res], hg = R[i][I.hg], ag = R[i][I.ag];
  const H = acc.get(hi) || { n: 0, w: 0, d: 0, hist: [] }, A = acc.get(ai) || { n: 0, w: 0, d: 0, hist: [] };
  H.hist.push({ res: res === 0 ? 0 : res === 1 ? 1 : 2, gf: hg, ga: ag });
  A.hist.push({ res: res === 2 ? 0 : res === 1 ? 1 : 2, gf: ag, ga: hg });
  if (res === 0) H.w++; else if (res === 2) A.w++; else { H.d++; A.d++; }
  H.n++; A.n++; acc.set(hi, H); acc.set(ai, A);
}
const out = { meta: { purpose: "rolling form for the Oracle's verdict — last 30 matches + career, measured to the corpus end",
                      clubs: 0, built: new Date().toISOString().slice(0, 10),
                      note: "same statistic the verdict model was trained on; a club missing here enters the verdict at the corpus average" },
              clubs: {} };
for (const [idx, st] of acc) {
  const last = st.hist.slice(-30);
  let w = 0, d = 0, gd = 0;
  for (const r of last) { if (r.res === 0) w++; else if (r.res === 1) d++; gd += r.gf - r.ga; }
  const n30 = last.length;
  const csv = clubs[idx].name;
  const disp = NAMES[csv] || csv;
  out.clubs[disp] = { csvName: csv, n30, ppg30: n30 ? +((3 * w + d) / n30).toFixed(4) : null,
                      gd30: n30 ? +(gd / n30).toFixed(4) : null,
                      nCareer: st.n, ppgCareer: st.n ? +((3 * st.w + st.d) / st.n).toFixed(4) : null };
}
out.meta.clubs = Object.keys(out.clubs).length;
/* resolve every ledger spelling to this file's key, and record the mapping for the app */
out.meta.aliases = {};
const byNorm = new Map();
for (const k of Object.keys(out.clubs)) byNorm.set(norm(k), k);
for (const [alias, rowName] of Object.entries(ledgerAliases)) {
  const target = out.clubs[rowName] ? rowName : (out.clubs[NAMES[rowName]] ? NAMES[rowName] : (byNorm.get(norm(rowName)) || null));
  if (target && alias !== target) out.meta.aliases[alias] = target;
}
for (const [csvName, rowName] of Object.entries(NAMES)) {
  const target = out.clubs[rowName] ? rowName : (byNorm.get(norm(rowName)) || null);
  if (target && csvName !== target) out.meta.aliases[csvName] = target;
}
/* and every ledger row name itself, so the Oracle's exact string always lands */
for (const rowName of Object.keys(ledgerAliases).length ? Object.values(ledgerAliases) : []) {
  const target = out.clubs[rowName] ? rowName : (out.clubs[NAMES[rowName]] ? NAMES[rowName] : (byNorm.get(norm(rowName)) || null));
  if (target) out.meta.aliases[rowName] = target;
}
console.log(`aliases published: ${Object.keys(out.meta.aliases).length}`);
fs.writeFileSync(`${ROOT}/data/club-form.json`, JSON.stringify(out));
fs.copyFileSync(`${ROOT}/data/club-form.json`, `${ROOT}/stanleymwangi0480-alt.github.io-main/data/club-form.json`);
console.log(`club-form.json: ${out.meta.clubs} clubs · ${(fs.statSync(`${ROOT}/data/club-form.json`).size / 1024).toFixed(0)} KB`);
const sample = Object.entries(out.clubs).slice(0, 3);
console.log(sample.map(([k, v]) => `${k}: ppg30 ${v.ppg30} gd30 ${v.gd30} career ${v.ppgCareer} (${v.nCareer} matches)`).join("\n"));
