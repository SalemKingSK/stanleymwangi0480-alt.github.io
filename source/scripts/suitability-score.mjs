// tools/suitability-score.mjs — the transparent version of "which side is the day better suited to?"
//
// No fitted weights anywhere. For each side, count the day's favourable and adverse signals from
// its own founding date; subtract to get the suitability gap; then ask the only question that
// matters: does the side with the better-suited day actually win more often?
//
// Signals per side (all from the founding date vs the match date):
//   relation(personal day, founding day)      same/friend = +1 · enemy = −1
//   Cheiro series                             match day-of-month in the founding series = +1
//   compound of the personal year             royal star = +1 · karmic debt = −1
//   personal day vs founding day (classic)    (same list, classic reading)
//
// Output: home-win rate by suitability gap, and the paired hit rate of the better-suited side.
import fs from "fs";

const ROOT = "/home/user/mystique";
const ART = `${ROOT}/artifacts`;
const DATA = JSON.parse(fs.readFileSync(`${ART}/club-dataset.json`, "utf8"));
const R = DATA.rows, clubs = DATA.clubs;
const F = (DATA.meta.fields || "").split(",").map((s) => s.trim());
const IX = Object.fromEntries(F.map((f, i) => [f, i]));
const I = { Y: IX.Y, m: IX.m, d: IX.d, hi: IX.homeIdx, ai: IX.awayIdx, res: IX.res,
            hPD: IX.homePD, aPD: IX.awayPD, hFd: IX.homePDfounding, aFd: IX.awayPDfounding,
            hC: IX.homeCompound, aC: IX.awayCompound };

const ROYAL = new Set([17, 19, 21, 23, 24, 27, 37]);
const KARMIC = new Set([13, 14, 16, 19]);
const reduce1 = (x) => { while (x > 9) { let s = 0; for (const c of String(x)) s += +c; x = s; } return x; };
const seriesOf = (day) => { const r = reduce1(day) || 9; const out = []; for (let d = r; d <= 31; d += 9) out.push(d); return out; };

function suitability(clubIdx, dayOfMonth) {
  const c = clubs[clubIdx];
  let score = 0;
  const why = [];
  // Cheiro series: does the match day-of-month fall in this club's founding series?
  if (seriesOf(c.d).includes(dayOfMonth)) { score += 1; why.push(`day in founding series ${seriesOf(c.d).join("/")}`); }
  return { score, why, series: seriesOf(c.d), foundingDay: c.d };
}

// The full per-side score needs the dataset's own relation/compound columns, which are keyed per row.
function sideScore(i, side) {
  const dayOfMonth = R[i][I.d];
  const ci = side === "H" ? R[i][I.hi] : R[i][I.ai];
  const fdv = side === "H" ? R[i][I.hFd] : R[i][I.aFd];       // relation: personal day vs founding day
  const comp = side === "H" ? R[i][I.hC] : R[i][I.aC];        // compound of the personal year (0 if none)
  const s = suitability(ci, dayOfMonth);
  let score = s.score;
  if (fdv === 0 || fdv === 1) { score += 1; s.why.push("personal day harmonises with founding day"); }
  else if (fdv === 3) { score -= 1; s.why.push("personal day opposes founding day"); }
  if (comp && ROYAL.has(comp)) { score += 1; s.why.push(`royal star compound ${comp}`); }
  if (comp && KARMIC.has(comp)) { score -= 1; s.why.push(`karmic compound ${comp}`); }
  return { score, why: s.why };
}

const SPLIT_T = 2015;
const test = [];
for (let i = 0; i < R.length; i++) if (R[i][I.Y] >= SPLIT_T) test.push(i);
console.log(`grading ${test.length.toLocaleString()} matches from ${SPLIT_T} onward`);

const buckets = new Map();
let betterRight = 0, betterCalls = 0, homeWins = 0, awayWins = 0, draws = 0;
for (const i of test) {
  const h = sideScore(i, "H"), a = sideScore(i, "A");
  const gap = h.score - a.score;
  const b = buckets.get(gap) || { n: 0, home: 0 };
  b.n++; if (R[i][I.res] === 0) b.home++;
  buckets.set(gap, b);
  if (R[i][I.res] === 0) homeWins++;
  else if (R[i][I.res] === 2) awayWins++;
  else draws++;
  // The paired test must exclude draws from BOTH sides of the fraction: a draw is neither side
  // winning, so counting it in the denominator while it can never be in the numerator would
  // understate the method. Only decisive matches with a real lean are graded.
  if (gap !== 0 && R[i][I.res] !== 1) {
    betterCalls++;
    const betterIsHome = gap > 0;
    if ((betterIsHome && R[i][I.res] === 0) || (!betterIsHome && R[i][I.res] === 2)) betterRight++;
  }
}

const rowsOut = [...buckets.entries()].sort((x, y) => x[0] - y[0]);
console.log("\ngap = (home favourable signals) − (away favourable signals)");
console.log("  gap   matches   home wins");
for (const [gap, b] of rowsOut) {
  console.log(`  ${String(gap).padStart(3)}   ${String(b.n).padStart(7)}   ${(b.home / b.n * 100).toFixed(1)}%`);
}
// collapse to a readable five bands
const bands = [[-99, -2], [-1, -1], [0, 0], [1, 1], [2, 99]];
console.log("\nbanded:");
const bandOut = [];
for (const [lo, hi] of bands) {
  let n = 0, w = 0;
  for (const [gap, b] of rowsOut) if (gap >= lo && gap <= hi) { n += b.n; w += b.home; }
  if (n) {
    bandOut.push({ lo, hi, n, homeRate: +(w / n).toFixed(4) });
    console.log(`  gap ${lo === -99 ? "≤−2" : lo === hi ? lo : `${lo}…${hi}`.padEnd(5)}  n=${String(n).padStart(7)}  home wins ${(w / n * 100).toFixed(1)}%`);
  }
}
const betterRate = betterRight / Math.max(betterCalls, 1);
const homeRate = homeWins / test.length;
const awayRate = awayWins / test.length;
console.log(`\npaired: of the ${betterCalls.toLocaleString()} matches where the gap was non-zero, the better-suited side won ${(betterRate * 100).toFixed(2)}%`);
console.log(`        on the same corpus, always picking home gives ${(homeRate * 100).toFixed(2)}%`);
const decisiveRate = homeRate + awayRate;              // share of all matches that ended decisively
const chanceHome = homeRate / decisiveRate;            // P(home) among decisive matches
const nullP = chanceHome;
const z = (betterRight - betterCalls * chanceHome) / Math.sqrt(Math.max(betterCalls * chanceHome * (1 - chanceHome), 1e-9));
console.log(`        decisive matches with a lean: ${betterCalls.toLocaleString()} (draws excluded from both numerator and denominator)`);
console.log(`        chance on those matches: ${(chanceHome * 100).toFixed(2)}% → z = ${z.toFixed(2)}`);

const lines = [
  "# WHICH SIDE IS THE DAY BETTER SUITED TO? — the transparent test",
  "",
  "No fitted weights. Each side gets a score from its own founding date against the match date:",
  "",
  "- **+1** the match day-of-month falls in the club's Cheiro founding series",
  "- **+1** the personal day harmonises with the founding day (same or friend) · **−1** if it opposes it",
  "- **+1** the season compound is a royal star · **−1** if it is a karmic debt",
  "",
  "The gap is home score minus away score. If the day decides matches, the side with the higher",
  "score should win more often.",
  "",
  `Matches graded: **${test.length.toLocaleString()}** (from ${SPLIT_T} onward). Home wins ${(homeRate * 100).toFixed(2)}% · away wins ${(awayRate * 100).toFixed(2)}% · draws ${(draws / test.length * 100).toFixed(2)}%.`,
  "",
  "## Home-win rate by suitability gap",
  "",
  "| gap | matches | home wins |",
  "|---|---|---|",
  ...rowsOut.map(([gap, b]) => `| ${gap} | ${b.n.toLocaleString()} | ${(b.home / b.n * 100).toFixed(1)}% |`),
  "",
  "## The paired question",
  "",
  `Of the **${betterCalls.toLocaleString()}** decisive matches where one side's day was plainly better suited,`,
  `that side won **${(betterRate * 100).toFixed(2)}%** of the time. Simply backing the home side in those same`,
  `decisive matches gives **${(chanceHome * 100).toFixed(2)}%** — so the suitability gap is worth`,
  `**${((betterRate - chanceHome) * 100).toFixed(2)}pp**, with **z = ${z.toFixed(2)}** (draws excluded from both sides of the fraction).`,
  "",
];
fs.writeFileSync(`${ART}/SUITABILITY-TEST.md`, lines.join("\n"));
fs.writeFileSync(`${ART}/suitability-test.json`, JSON.stringify({
  meta: { n: test.length, betterCalls, betterRate: +betterRate.toFixed(4), homeRate: +homeRate.toFixed(4),
          awayRate: +awayRate.toFixed(4), z: +z.toFixed(3) }, gapTable: rowsOut.map(([gap, b]) => ({ gap, n: b.n, homeRate: +(b.home / b.n).toFixed(4) })),
}, null, 1));
console.log("\nwrote artifacts/SUITABILITY-TEST.md");
