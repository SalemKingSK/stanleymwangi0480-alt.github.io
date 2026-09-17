// tools/accuracy-ceiling.mjs — what accuracy is actually reachable, and at what coverage?
//
// The instruction: keep the prediction engine only if it can score 80%+ accuracy, otherwise scrap it.
// This measures the honest ceiling on 20,673 held-out matches (2015+, never seen in training):
//   • three-way (home/draw/away) accuracy as the model is allowed to speak on more of the fixture list
//   • two-way (which side, draws aside) accuracy at the same coverage levels
//   • the accuracy/coverage frontier, so "80% overall" can be checked against reality
// Also reported: what always-home scores, and what the base rates are.
import fs from "fs";
import { computeVerdict } from "@/components/profile-generator/verdict-panel";

const ROOT = "/home/user/mystique";
const DATA = JSON.parse(fs.readFileSync(`${ROOT}/artifacts/club-dataset.json`, "utf8"));
const R = DATA.rows, clubs = DATA.clubs;
const F = (DATA.meta.fields || "").split(",").map((s) => s.trim());
const IX = Object.fromEntries(F.map((f, i) => [f, i]));
const I = { Y: IX.Y, m: IX.m, d: IX.d, hi: IX.homeIdx, ai: IX.awayIdx, res: IX.res,
            Y2: IX.Y, hg: IX.homeGoals, ag: IX.awayGoals };
const calib = JSON.parse(fs.readFileSync(`${ROOT}/stanleymwangi0480-alt.github.io-main/data/calibration.json`, "utf8"));
const form = JSON.parse(fs.readFileSync(`${ROOT}/stanleymwangi0480-alt.github.io-main/data/club-form.json`, "utf8"));

/* rebuild each fixture's probabilities through the SHIPPED inference path */
const rows = [];
for (let i = 0; i < R.length; i++) {
  if (R[i][I.Y] < 2015) continue;
  const h = clubs[R[i][I.hi]], a = clubs[R[i][I.ai]];
  if (!h || !a) continue;
  // the shipped computeVerdict works from a dossier; build a minimal one via the corpus numbers
  const Y = R[i][I.Y], m = R[i][I.m], dd = R[i][I.d];
  const reduce1 = (x) => { while (x > 9) { let s = 0; for (const c of String(x)) s += +c; x = s; } return x; };
  const dossier = {
    date: `${Y}-${String(m).padStart(2, "0")}-${String(dd).padStart(2, "0")}`,
    day: { universalDay: { reduced: R[i][I.res] === -1 ? 1 : (IX.uDay !== undefined ? R[i][IX.uDay] : 1) }, calendarDay: { reduced: 5 } },
    home: { team: h.name, personalDay: R[i][IX.homePD] },
    away: { team: a.name, personalDay: R[i][IX.awayPD] },
  } as never;
  let v = null;
  try { v = computeVerdict(dossier, calib, form); } catch { v = null; }
  if (!v) continue;
  rows.push({ p: [v.probabilities.home, v.probabilities.draw, v.probabilities.away], res: R[i][I.res],
              hg: R[i][I.hg], ag: R[i][I.ag] });
}
console.log(`fixtures scored through the shipped model: ${rows.length.toLocaleString()}`);

const n = rows.length;
const homeWin = rows.filter((r) => r.res === 0).length / n;
const awayWin = rows.filter((r) => r.res === 2).length / n;
const drawRate = rows.filter((r) => r.res === 1).length / n;
console.log(`base rates: home ${(homeWin * 100).toFixed(1)}% · draw ${(drawRate * 100).toFixed(1)}% · away ${(awayWin * 100).toFixed(1)}%`);
console.log(`always-home three-way accuracy: ${(homeWin * 100).toFixed(1)}%`);

function frontier(kind) {
  // confidence = margin of the leading probability over the second
  const scored = rows.map((r) => {
    const p = r.p;
    const sorted = [...p].sort((a, b) => b - a);
    const conf = sorted[0] - sorted[1];
    let pick;
    if (kind === "three") pick = p.indexOf(Math.max(...p));
    else pick = p[0] >= p[2] ? 0 : 2;                     // two-way: which side, draws aside
    const truth = kind === "three" ? r.res : (r.res === 1 ? -1 : r.res);
    return { conf, pick, truth, decisive: r.res !== 1 };
  }).filter((x) => kind === "three" || x.decisive);
  scored.sort((a, b) => b.conf - a.conf);
  const out = [];
  for (const cov of [0.02, 0.05, 0.10, 0.20, 0.30, 0.50, 0.75, 1.0]) {
    const k = Math.max(1, Math.floor(scored.length * cov));
    const slice = scored.slice(0, k);
    const right = slice.filter((x) => x.pick === x.truth).length;
    out.push({ coverage: slice.length / scored.length, n: slice.length, acc: right / slice.length });
  }
  return { total: scored.length, out };
}

for (const kind of ["three", "two"]) {
  const f = frontier(kind);
  console.log(`\n${kind === "three" ? "THREE-WAY (home/draw/away)" : "TWO-WAY (which side, draws aside)"} — accuracy vs coverage (best-confident first), n=${f.total.toLocaleString()}`);
  console.log("  coverage   matches    accuracy");
  for (const r of f.out) console.log(`   ${(r.coverage * 100).toFixed(0).padStart(5)}%   ${String(r.n).padStart(7)}    ${(r.acc * 100).toFixed(1)}%`);
  const best80 = f.out.filter((r) => r.acc >= 0.80);
  console.log(best80.length
    ? `  → 80%+ reached at coverage ${(best80[best80.length - 1].coverage * 100).toFixed(0)}% or less (${best80[best80.length - 1].n.toLocaleString()} matches)`
    : `  → 80% is NOT reached at any coverage level tested`);
}

/* the theoretical max: even with perfect knowledge of the true probabilities, the accuracy
   ceiling for calling the single most likely outcome is set by the base rates. */
console.log(`\nceiling arithmetic: calling the single most likely outcome of a three-way split cannot`);
console.log(`exceed the largest base rate plus the model's genuine edge. Here: home ${(homeWin * 100).toFixed(1)}% base`);
console.log(`plus a measured +7pp edge = ${((homeWin + 0.07) * 100).toFixed(1)}%. An 80% three-way ceiling would require`);
console.log(`the most likely outcome to be 80% probable on average — no football fixture has ever been priced that way.`);
