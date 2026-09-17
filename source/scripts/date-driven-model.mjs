// tools/date-driven-model.mjs
// ─────────────────────────────────────────────────────────────────────────────
// THE COMPARISON THE READING SHOULD HAVE BEEN DOING.
//
// The user's model, stated plainly: a match is a comparison between
//     how suited the MATCH DAY is to the home club   (its founding date vs that day)
//   and
//     how suited the MATCH DAY is to the away club   (its founding date vs that day)
// and the side the day suits better is the side to back.
//
// My earlier date block did not encode that. It fed in each club's personal day as a bare
// one-hot vector — no relation to the club's own founding date, and no comparison between the
// two sides. That is a legitimate gap, so this file builds the comparison properly:
//
//   per side (from the founding date and the match date alone):
//     personal day · personal month · personal year (season)
//     relation(personal day, founding day)             ← the founding-date comparison
//     relation(personal day, founding day, classic)
//     Cheiro series membership (founding day series contains the match day-of-month)
//     Cheiro compound reading (founding day + match day number → compound → polarity)
//     pinnacle · challenge of the era the club is in
//     day of week (the one honest calendar fact about a fixture)
//   match level:
//     universal day · calendar-day number
//   and for EVERY per-side feature its DIFFERENCE (home − away) — the comparison itself.
//
// Then it measures: does that comparison call matches better than chance, better than always-home,
// and how does it stand against the form model? Trained on <2000, judged on 2015+.
// ─────────────────────────────────────────────────────────────────────────────
import fs from "fs";
import { computeRawPersonalYear, computeRawPersonalYearClassic, reduceToSingleDigit, digitSumOnce, lookupCompound } from "/home/user/mystique/numerology-core.mjs";
import { PINNACLE_DESC, CHALLENGE_DESC } from "/home/user/mystique/pinnacles.mjs";
import { generateTemporalPrediction } from "/home/user/mystique/temporal-engine.mjs";

const ROOT = "/home/user/mystique";
const ART = `${ROOT}/artifacts`;
const DATA = JSON.parse(fs.readFileSync(`${ART}/club-dataset.json`, "utf8"));
const R = DATA.rows, clubs = DATA.clubs;
const N = R.length;
const FLD = (DATA.meta.fields || "").split(",").map((s) => s.trim());
const IX = Object.fromEntries(FLD.map((f, i) => [f, i]));
const I = { Y: IX.Y, m: IX.m, d: IX.d, hi: IX.homeIdx, ai: IX.awayIdx, res: IX.res,
            hPD: IX.homePD, aPD: IX.awayPD, hPM: IX.homePM, aPM: IX.awayPM,
            hPY: IX.homePY, aPY: IX.awayPY, uD: IX.uDay, cal: IX.calDay };

/* ── Chaldean friends/enemies grid (the app's own) ─────────────────────────── */
const FR = { 1: [1, 2, 3, 5, 9], 2: [1, 2, 3], 3: [1, 2, 3, 5, 9], 4: [1, 2, 5, 6, 7], 5: [1, 3, 4, 8],
             6: [4, 5, 6, 8], 7: [4, 5, 6], 8: [1, 4, 5, 6], 9: [1, 2, 3, 6] };
const relIdx = (a, b) => (a === b ? 0 : (FR[a] || []).includes(b) || (FR[b] || []).includes(a) ? 1 : 3);

/* ── Cheiro's lucky-day series ─────────────────────────────────────────────── */
const seriesOf = (day) => { const r = reduceToSingleDigit(day) || 9; const out = []; for (let d = r; d <= 31; d += 9) out.push(d); return out; };
const inSeries = (dayOfMonth, foundingDay) => (seriesOf(foundingDay).includes(dayOfMonth) ? 1 : 0);

/* ── Cheiro compound reading: founding day + match day number → compound ───── */
const ADV = /unfortunate|danger|loss|misfortune|sacrifice|deception|treachery|karmic|debt|warning|betray/;
const FAV = /fortunate|favour|success|good|peace|love|reward|honour|gift|blessing|wisdom|power/;
function cheiroCompound(foundingDay, dayOfMonth) {
  const total = foundingDay + reduceToSingleDigit(dayOfMonth);
  const c = lookupCompound(total);
  const sym = (c?.symbolism || "").toLowerCase();
  const adverse = ADV.test(sym), fortunate = FAV.test(sym);
  return { favourable: fortunate && !adverse ? 1 : 0, adverse: adverse && !fortunate ? 1 : 0, total, compound: c?.compound ?? 0 };
}

/* ── polarity of the pinnacle / challenge texts (the meaning's own language) ── */
const FAVW = ["success","victory","triumph","fortunate","favour","fortune","prosper","opportunity","advancement","achievement","gain","reward","honour","recognition","rise","expansion","growth","progress","benefit","blessing","powerful","strength","support","alliance","partnership","harmony","peace","stability","renewal","resilience","protection","freedom","leadership","influence","constructive","positive"];
const ADVW = ["loss","defeat","failure","obstacle","difficulty","delay","restriction","limitation","opposition","conflict","tension","trouble","warning","danger","disaster","catastrophe","destruction","ruin","decline","fall","downfall","reversal","betrayal","deception","scandal","suffering","burden","blocked","stagnation","friction","resistance","sacrifice","separation","disruption","instability","collapse","hardship","adversity","sorrow"];
const occ = (t, w) => { const s = String(t || "").toLowerCase(); let n = 0; for (const x of w) { let i = 0; while ((i = s.indexOf(x, i)) !== -1) { n++; i += x.length; } } return n; };
const polarity = (t) => { const f = occ(t, FAVW), a = occ(t, ADVW); return f > a * 1.15 ? 1 : a > f * 1.15 ? -1 : 0; };

/* ── per-club-season era memo (pinnacle / challenge) ───────────────────────── */
const eraMemo = new Map();
function eraFor(clubIdx, year) {
  const k = `${clubIdx}|${year}`;
  if (eraMemo.has(k)) return eraMemo.get(k);
  const c = clubs[clubIdx];
  let pin = 0, chal = 0, pinPol = 0, chalPol = 0;
  try {
    const tp = generateTemporalPrediction(c.d, c.m, c.y, year);
    const pn = tp?.meta?.activePinnacleNumber, cn = tp?.meta?.activeChallenge;
    if (pn != null) { pin = Number(pn); pinPol = polarity(PINNACLE_DESC[String(pn)] || ""); }
    if (cn != null) { chal = Number(cn); chalPol = polarity(CHALLENGE_DESC[String(cn)] || ""); }
  } catch { /* era unavailable */ }
  const v = { pin, chal, pinPol, chalPol };
  eraMemo.set(k, v);
  return v;
}

/* ── build the feature table ──────────────────────────────────────────────── */
const dowMemo = new Map();
const dowOf = (Y, m, d) => {
  const k = Y * 10000 + m * 100 + d;
  let v = dowMemo.get(k);
  if (v === undefined) { v = new Date(Date.UTC(Y, m - 1, d)).getUTCDay(); dowMemo.set(k, v); }
  return v;
};

const SIDE = [
  "pDay", "pMonth", "pYear", "relFounding", "relFoundingClassic",
  "inCheiroSeries", "compoundFav", "compoundAdv",
  "pinnacleNum", "challengeNum", "pinnacleFav", "pinnacleAdv", "challengeFav", "challengeAdv",
];
const MATCH = ["universalDay", "calendarNum", "dayOfWeek", "monthNum", "universalYear"];
const perSide = SIDE.length;
const NF = 1 + perSide * 2 + perSide /* differences */ + MATCH.length;

function featuresFor(rowIdx) {
  const Y = R[rowIdx][I.Y], m = R[rowIdx][I.m], d = R[rowIdx][I.d];
  const hi = R[rowIdx][I.hi], ai = R[rowIdx][I.ai];
  const hc = clubs[hi], ac = clubs[ai];
  const uy = digitSumOnce(Y);
  const uD = reduceToSingleDigit(uy + m + d);
  const calRaw = digitSumOnce(Y * 10000 + m * 100 + d);
  const eh = eraFor(hi, Y), ea = eraFor(ai, Y);
  const ch = cheiroCompound(hc.d, d), ca = cheiroCompound(ac.d, d);

  const sideH = [
    reduceToSingleDigit(hc.d + reduceToSingleDigit(m) + d),          // personal day (recomputed from founding day/month)
    reduceToSingleDigit(hc.d + reduceToSingleDigit(m)),              // personal month
    reduceToSingleDigit(computeRawPersonalYear(hc.d, hc.m, Y) || 1), // personal year (season)
    relIdx(reduceToSingleDigit(hc.d + reduceToSingleDigit(m) + d), reduceToSingleDigit(hc.d)),
    relIdx(reduceToSingleDigit(computeRawPersonalYearClassic(hc.d, hc.m, Y) || 1), reduceToSingleDigit(hc.d)),
    inSeries(d, hc.d), ch.favourable, ch.adverse,
    eh.pin, eh.chal, eh.pinPol > 0 ? 1 : 0, eh.pinPol < 0 ? 1 : 0, eh.chalPol > 0 ? 1 : 0, eh.chalPol < 0 ? 1 : 0,
  ];
  const sideA = [
    reduceToSingleDigit(ac.d + reduceToSingleDigit(m) + d),
    reduceToSingleDigit(ac.d + reduceToSingleDigit(m)),
    reduceToSingleDigit(computeRawPersonalYear(ac.d, ac.m, Y) || 1),
    relIdx(reduceToSingleDigit(ac.d + reduceToSingleDigit(m) + d), reduceToSingleDigit(ac.d)),
    relIdx(reduceToSingleDigit(computeRawPersonalYearClassic(ac.d, ac.m, Y) || 1), reduceToSingleDigit(ac.d)),
    inSeries(d, ac.d), ca.favourable, ca.adverse,
    ea.pin, ea.chal, ea.pinPol > 0 ? 1 : 0, ea.pinPol < 0 ? 1 : 0, ea.chalPol > 0 ? 1 : 0, ea.chalPol < 0 ? 1 : 0,
  ];
  const diff = sideH.map((v, i) => v - sideA[i]);
  const match = [uD, reduceToSingleDigit(calRaw), dowOf(Y, m, d), m, reduceToSingleDigit(uy)];
  return Float64Array.from([1, ...sideH, ...sideA, ...diff, ...match]);
}

console.log(`building ${NF} features for ${N.toLocaleString()} matches…`);
const t0 = Date.now();
const X = new Array(N);
for (let i = 0; i < N; i++) X[i] = featuresFor(i);
console.log(`  built in ${((Date.now() - t0) / 1000).toFixed(1)}s · ${NF} features (${perSide} per side ×2 + ${perSide} differences + ${MATCH.length} match-level)`);

/* ── splits, standardisation, IRLS softmax (same machinery as the verdict) ─── */
const SPLIT_V = 2000, SPLIT_T = 2015;
const idx = { train: [], val: [], test: [] };
for (let i = 0; i < N; i++) { const y = R[i][I.Y]; (y < SPLIT_V ? idx.train : y < SPLIT_T ? idx.val : idx.test).push(i); }
const yOf = (i) => R[i][I.res];

function standardise(rows) {
  const mu = new Float64Array(NF), sd = new Float64Array(NF);
  for (let j = 0; j < NF; j++) { let s = 0; for (const i of rows) s += X[i][j]; mu[j] = s / rows.length; }
  for (let j = 0; j < NF; j++) { let s = 0; for (const i of rows) s += (X[i][j] - mu[j]) ** 2; sd[j] = Math.sqrt(s / rows.length) || 1; }
  return { mu, sd };
}
const scaler = standardise(idx.train);
const Z = (i) => { const z = new Float64Array(NF); for (let j = 0; j < NF; j++) z[j] = j === 0 ? 1 : (X[i][j] - scaler.mu[j]) / scaler.sd[j]; return z; };
const Ztr = idx.train.map(Z), Zte = idx.test.map(Z), Zva = idx.val.map(Z);

function softmax(z) { const m = Math.max(...z); const e = z.map((v) => Math.exp(v - m)); const s = e.reduce((a, b) => a + b, 0); return e.map((v) => v / s); }
function irls(rows, frames, yList, { iters = 30, ridge = 0.02 } = {}) {
  const P = 3 * NF, th = new Float64Array(P);
  const solve = (A, b, n) => {
    const M2 = A.map((r, i) => [...r, b[i]]);
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M2[r][c]) > Math.abs(M2[p][c])) p = r;
      [M2[c], M2[p]] = [M2[p], M2[c]];
      const dv = M2[c][c] || 1e-12;
      for (let j = c; j <= n; j++) M2[c][j] /= dv;
      for (let r = 0; r < n; r++) { if (r === c) continue; const f = M2[r][c]; if (!f) continue; for (let j = c; j <= n; j++) M2[r][j] -= f * M2[c][j]; }
    }
    return M2.map((r) => r[n]);
  };
  const M = frames.length;
  for (let it = 0; it < iters; it++) {
    const g = new Float64Array(P), H = Array.from({ length: P }, () => new Float64Array(P));
    for (let k = 0; k < M; k++) {
      const x = frames[k];
      const z = [0, 1, 2].map((c) => { let s = 0; for (let j = 0; j < NF; j++) s += th[c * NF + j] * x[j]; return s; });
      const p = softmax(z);
      for (let c = 0; c < 3; c++) { const e = (yList[k] === c ? 1 : 0) - p[c]; for (let j = 0; j < NF; j++) g[c * NF + j] += e * x[j]; }
      for (let c = 0; c < 3; c++) for (let d2 = 0; d2 < 3; d2++) {
        const w = p[c] * ((c === d2 ? 1 : 0) - p[d2]); if (!w) continue;
        for (let j = 0; j < NF; j++) { const xj = x[j]; if (!xj) continue; const row = H[c * NF + j];
          for (let l = 0; l < NF; l++) row[d2 * NF + l] += w * xj * x[l]; }
      }
    }
    for (let i = 0; i < P; i++) { H[i][i] += ridge; g[i] -= ridge * th[i]; }
    const step = solve(H, g, P);
    for (let i = 0; i < P; i++) th[i] += step[i];
    if (it % 10 === 0 || it === iters - 1) {
      let ok = 0, n = 0, ll = 0;
      for (let k = 0; k < M; k += Math.max(1, Math.floor(M / 3000))) {
        const p = softmax([0, 1, 2].map((c) => { let s = 0; for (let j = 0; j < NF; j++) s += th[c * NF + j] * frames[k][j]; return s; }));
        if (p.indexOf(Math.max(...p)) === yList[k]) ok++;
        ll += -Math.log(Math.max(p[yList[k]], 1e-12)); n++;
      }
      console.log(`    iter ${it}: train ${(ok / n * 100).toFixed(1)}% · log loss ${(ll / n).toFixed(4)}`);
    }
  }
  return th;
}
function evalFrames(th, frames, rows) {
  let ok = 0, ll = 0; const picks = [0, 0, 0];
  for (let k = 0; k < frames.length; k++) {
    const p = softmax([0, 1, 2].map((c) => { let s = 0; for (let j = 0; j < NF; j++) s += th[c * NF + j] * frames[k][j]; return s; }));
    const pick = p.indexOf(Math.max(...p)); picks[pick]++;
    if (pick === yOf(rows[k])) ok++;
    ll += -Math.log(Math.max(p[yOf(rows[k])], 1e-12));
  }
  return { acc: ok / frames.length, ll: ll / frames.length, picks };
}

console.log("\ntraining the DATE-DRIVEN comparison model (founding date vs match date, side against side)…");
const th = irls(idx.train, Ztr, idx.train.map(yOf));
const v = evalFrames(th, Zva, idx.val), t = evalFrames(th, Zte, idx.test);
const base = idx.test.filter((i) => yOf(i) === 0).length / idx.test.length;
console.log(`\ndate-driven comparison : val ${(v.acc * 100).toFixed(1)}% · TEST ${(t.acc * 100).toFixed(1)}% · log loss ${t.ll.toFixed(4)} · picks H/D/A ${t.picks.join("/")}`);
console.log(`always-home baseline   : test ${(base * 100).toFixed(1)}%`);
console.log(`form model (shipped)   : test 48.9%`);

/* ── which features carry whatever signal exists ───────────────────────────── */
const weights = [];
for (let j = 0; j < NF; j++) {
  let mag = 0;
  for (let c = 0; c < 3; c++) mag += Math.abs(th[c * NF + j]);
  weights.push({ name: j === 0 ? "bias" : j <= perSide ? `home·${SIDE[j - 1]}` : j <= perSide * 2 ? `away·${SIDE[j - perSide - 1]}` : j <= perSide * 3 ? `diff·${SIDE[j - perSide * 2 - 1]}` : `match·${MATCH[j - perSide * 3 - 1]}`, mag });
}
weights.sort((a, b) => b.mag - a.mag);
console.log("\nlargest weights (standardised units):");
for (const w of weights.slice(0, 12)) console.log(`   ${w.name.padEnd(26)} ${w.mag.toFixed(3)}`);


/* ─────────────────────────────────────────────────────────────────────────────
   THE PAIRED TEST — the sharpest form of the question.
   "Which side is the day better suited to?" is a COMPARISON, so grade it as one:
   drop draws entirely and force a choice between the two sides, using only the
   home-minus-away DIFFERENCE of every date feature. If the comparison carries any
   information about who wins, this is where it must show.
   ───────────────────────────────────────────────────────────────────────────── */
console.log("\n── paired test: the day compared between the two sides ──");
const DIFF_J = [];
for (let j = 1 + perSide * 2; j < 1 + perSide * 3; j++) DIFF_J.push(j);
const pairedFeature = (i) => Float64Array.from([1, ...DIFF_J.map((j) => X[i][j])]);
const Ptr = idx.train.filter((i) => yOf(i) !== 1), Pte = idx.test.filter((i) => yOf(i) !== 1);
const muP = new Float64Array(DIFF_J.length + 1), sdP = new Float64Array(DIFF_J.length + 1);
{
  const rows = Ptr.map(pairedFeature);
  for (let j = 1; j <= DIFF_J.length; j++) { let s = 0; for (const r of rows) s += r[j]; muP[j] = s / rows.length; }
  for (let j = 1; j <= DIFF_J.length; j++) { let s = 0; for (const r of rows) s += (r[j] - muP[j]) ** 2; sdP[j] = Math.sqrt(s / rows.length) || 1; }
}
const PZ = (i) => { const r = pairedFeature(i), z = new Float64Array(DIFF_J.length + 1); z[0] = 1;
  for (let j = 1; j <= DIFF_J.length; j++) z[j] = (r[j] - muP[j]) / sdP[j]; return z; };

const Pt = Ptr.map(PZ), Pe = Pte.map(PZ), yt = Ptr.map((i) => (yOf(i) === 0 ? 1 : 0));
function fitBinary(frames, y, { iters = 40, ridge = 0.05 } = {}) {
  const P = frames[0].length, w = new Float64Array(P);
  const sig = (z) => 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, z))));
  const solve = (A, b, n) => {
    const M2 = A.map((r, i) => [...r, b[i]]);
    for (let c = 0; c < n; c++) {
      let p2 = c; for (let r = c + 1; r < n; r++) if (Math.abs(M2[r][c]) > Math.abs(M2[p2][c])) p2 = r;
      [M2[c], M2[p2]] = [M2[p2], M2[c]];
      const dv = M2[c][c] || 1e-12; for (let j = c; j <= n; j++) M2[c][j] /= dv;
      for (let r = 0; r < n; r++) { if (r === c) continue; const f = M2[r][c]; if (!f) continue; for (let j = c; j <= n; j++) M2[r][j] -= f * M2[c][j]; }
    }
    return M2.map((r) => r[n]);
  };
  for (let it = 0; it < iters; it++) {
    const g = new Float64Array(P), H = Array.from({ length: P }, () => new Float64Array(P));
    for (let k = 0; k < frames.length; k++) {
      const x = frames[k]; let z = 0; for (let j = 0; j < P; j++) z += w[j] * x[j];
      const p2 = sig(z), e2 = y[k] - p2, wt = Math.max(p2 * (1 - p2), 1e-6);
      for (let j = 0; j < P; j++) { g[j] += e2 * x[j]; for (let l = 0; l < P; l++) H[j][l] += wt * x[j] * x[l]; }
    }
    for (let i = 0; i < P; i++) { H[i][i] += ridge; g[i] -= ridge * w[i]; }
    const step = solve(H, g, P);
    for (let i = 0; i < P; i++) w[i] += step[i];
  }
  return w;
}
const wPaired = fitBinary(Pt, yt);
const scoreOf = (w, x) => { let z = 0; for (let j = 0; j < w.length; j++) z += w[j] * x[j]; return z; };
let okP = 0;
for (let k = 0; k < Pe.length; k++) {
  const s = scoreOf(wPaired, Pe[k]);
  const pickHome = s > 0;
  if ((pickHome && yOf(Pte[k]) === 0) || (!pickHome && yOf(Pte[k]) === 2)) okP++;
}
const baseHomeP = Pte.filter((i) => yOf(i) === 0).length / Pte.length;
const accP = okP / Pe.length;
const zP = (okP - Pe.length * baseHomeP) / Math.sqrt(Math.max(Pe.length * baseHomeP * (1 - baseHomeP), 1e-9));
console.log(`paired (draws removed, n=${Pe.length.toLocaleString()}): model ${(accP * 100).toFixed(2)}% vs home-win rate ${(baseHomeP * 100).toFixed(2)}% → z ${zP.toFixed(2)}`);

// quintile breakdown: does the day-suitability gap order anything?
const scored = Pte.map((i, k) => ({ s: scoreOf(wPaired, Pe[k]), home: yOf(i) === 0 })).sort((a, b) => a.s - b.s);
const qn = Math.floor(scored.length / 5);
console.log("\nquintile of day-suitability gap (home minus away) → home win rate:");
const quint = [];
for (let q = 0; q < 5; q++) {
  const slice = scored.slice(q * qn, q === 4 ? scored.length : (q + 1) * qn);
  const rate = slice.filter((x) => x.home).length / slice.length;
  quint.push({ q: q + 1, n: slice.length, rate: +rate.toFixed(4), lo: +slice[0].s.toFixed(2), hi: +slice[slice.length - 1].s.toFixed(2) });
  console.log(`  Q${q + 1} [${slice[0].s.toFixed(2)}, ${slice[slice.length - 1].s.toFixed(2)}]  n=${String(slice.length).padStart(6)}  home wins ${(rate * 100).toFixed(1)}%`);
}
const q1 = quint[0].rate, q5 = quint[4].rate;
console.log(`  top-minus-bottom quintile: ${((q5 - q1) * 100).toFixed(1)}pp`);

/* ── report ────────────────────────────────────────────────────────────────── */
const lines = [
  "# THE DATE-DRIVEN COMPARISON MODEL — measured",
  "",
  "The structure the reading asked for: each club's founding date read against the match date,",
  "the two sides' readings compared, and the better-suited side backed.",
  "",
  `Features (${NF}), all derived from the founding date and the match date:`,
  `  per side — ${SIDE.join(" · ")}`,
  `  per side — the same list again, and then the home-minus-away DIFFERENCE of every one of them`,
  `  match level — ${MATCH.join(" · ")}`,
  "",
  `Trained on matches before ${SPLIT_V} (${idx.train.length.toLocaleString()}), judged on ${SPLIT_T}+ (${idx.test.length.toLocaleString()}) that it never saw.`,
  "",
  "| model | test accuracy | log loss | picks H/D/A |",
  "|---|---|---|---|",
  `| **date-driven comparison (founding date vs match date)** | **${(t.acc * 100).toFixed(2)}%** | ${t.ll.toFixed(4)} | ${t.picks.join(" / ")} |`,
  `| always predict a home win | ${(base * 100).toFixed(2)}% | — | — |`,
  `| the shipped form-based verdict | 48.88% | 1.0202 | 18745 / 1928 / 0 |`,
  "",
  "## Largest standardised weights",
  "",
  "| feature | |w| |",
  "|---|---|",
  ...weights.slice(0, 15).map((w) => `| ${w.name} | ${w.mag.toFixed(3)} |`),
  "",
  "## The paired test (draws removed — a straight choice between the two sides)",
  "",
  `Only the home-minus-away DIFFERENCE of every date feature is used — that is the comparison itself.`,
  "",
  `- matches: **${Pe.length.toLocaleString()}** (draws dropped)`,
  `- model accuracy: **${(accP * 100).toFixed(2)}%**`,
  `- home-win rate on the same matches: **${(baseHomeP * 100).toFixed(2)}%**`,
  `- z = **${zP.toFixed(2)}**`,
  "",
  "### Home win rate by quintile of day-suitability gap",
  "",
  "| quintile | gap range | matches | home wins |",
  "|---|---|---|---|",
  ...quint.map((x) => `| Q${x.q} | ${x.lo} … ${x.hi} | ${x.n.toLocaleString()} | ${(x.rate * 100).toFixed(1)}% |`),
  "",
  `Top minus bottom quintile: **${((q5 - q1) * 100).toFixed(1)}pp**.`,
  "",
];
fs.writeFileSync(`${ART}/DATE-DRIVEN.md`, lines.join("\n"));
fs.writeFileSync(`${ART}/date-driven-model.json`, JSON.stringify({
  paired: { n: Pe.length, accuracy: +accP.toFixed(4), baseHomeRate: +baseHomeP.toFixed(4), z: +zP.toFixed(3), quintiles: quint },
  meta: { features: NF, perSide: SIDE.length, trainN: idx.train.length, valN: idx.val.length, testN: idx.test.length,
          valAccuracy: +v.acc.toFixed(4), testAccuracy: +t.acc.toFixed(4), testLogLoss: +t.ll.toFixed(4),
          alwaysHome: +base.toFixed(4), picks: { home: t.picks[0], draw: t.picks[1], away: t.picks[2] } },
  sideFeatures: SIDE, matchFeatures: MATCH, topWeights: weights.slice(0, 20),
}, null, 1));
console.log(`\nwrote artifacts/DATE-DRIVEN.md and date-driven-model.json`);
