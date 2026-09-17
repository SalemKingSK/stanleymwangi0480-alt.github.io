// tools/slate-backtest.ts — score the shipped verdict against the user's actual results.
// Reads the LIVE calibration.json + club-form.json (whatever is deployed), predicts every fixture
// through the app's own inference path, and prints the scorecard. Run before and after any change.
import fs from "fs";
import { computeVerdictForMatch } from "@/components/profile-generator/verdict-panel";

const DEPLOY = process.env.DEPLOY || "/home/user/mystique/stanleymwangi0480-alt.github.io-main";
const slate = JSON.parse(fs.readFileSync("/home/user/mystique/tools/slate-2026-09-13.json", "utf8"));
const calib = JSON.parse(fs.readFileSync(`${DEPLOY}/data/calibration.json`, "utf8"));
const form = JSON.parse(fs.readFileSync(`${DEPLOY}/data/club-form.json`, "utf8"));

let right = 0, homeRight = 0, awayRight = 0, drawRight = 0;
let predictedHome = 0, predictedDraw = 0, predictedAway = 0;
let twRight = 0, twCalls = 0;
console.log(`slate: ${slate.fixtures.length} fixtures on ${slate.date}`);
console.log("fixture                                  score   actual   my call                        p(home/draw/away)");
console.log("-".repeat(118));
const misses: string[] = [];
for (const f of slate.fixtures) {
  const v = computeVerdictForMatch(slate.date, f.home, f.away, calib as never, form as never);
  if (!v) { console.log(`${f.home} v ${f.away}: NO VERDICT`); continue; }
  const p = v.probabilities;
  const call = v.outcome;
  if (call === "home") predictedHome++; else if (call === "away") predictedAway++; else predictedDraw++;
  const ok = call === f.result;
  if (ok) {
    right++;
    if (f.result === "home") homeRight++;
    else if (f.result === "away") awayRight++;
    else drawRight++;
  } else {
    misses.push(`${f.home} v ${f.away} (${f.score}) — called ${call}`);
  }
  // the two-way lean: which side does the reading favour, draws set aside
  const twSide = p.home >= p.away ? "home" : "away";
  const twOk = twSide === f.result;
  if (f.result !== "draw") { twCalls++; if (twOk) twRight++; }
  console.log(
    `${(f.home + " v " + f.away).slice(0, 38).padEnd(39)} ${f.score.padEnd(7)} ${f.result.padEnd(8)} ${
      (v.label + (ok ? "  ✓" : "  ✗")).slice(0, 30).padEnd(31)} ${(p.home * 100).toFixed(1)}/${(p.draw * 100).toFixed(1)}/${(p.away * 100).toFixed(1)}  | ${
      f.result === "draw" ? "(draw — no side)" : twSide + (twOk ? " ✓" : " ✗")}`
  );
}
const actualHome = slate.fixtures.filter((f: { result: string }) => f.result === "home").length;
const actualAway = slate.fixtures.filter((f: { result: string }) => f.result === "away").length;
const actualDraw = slate.fixtures.filter((f: { result: string }) => f.result === "draw").length;
console.log("-".repeat(118));
console.log(`SCORE: ${right} / ${slate.fixtures.length}  (${(right / slate.fixtures.length * 100).toFixed(1)}%)`);
console.log(`  called home ${predictedHome} (right ${homeRight}) · draw ${predictedDraw} (right ${drawRight}) · away ${predictedAway} (right ${awayRight})`);
console.log(`  actual:  home ${actualHome} · draw ${actualDraw} · away ${actualAway}`);
console.log(`  always-home on this slate would have scored ${actualHome} / ${slate.fixtures.length}`);
console.log(`  TWO-WAY LEAN (which side, draws aside): ${twRight} / ${twCalls} decisive matches = ${(twRight / Math.max(twCalls, 1) * 100).toFixed(1)}%  (always-home among decisive: ${(actualHome / (actualHome + actualAway) * 100).toFixed(1)}%)`);
if (predictedAway === 0 && actualAway > 0) {
  console.log(`  ⚠ STRUCTURAL: the model never called an away win, but ${actualAway} of ${slate.fixtures.length} were away wins —`);
  console.log(`    that caps any score at ${slate.fixtures.length - actualAway}/${slate.fixtures.length} no matter how good the rest is.`);
}
if (misses.length) console.log(`\nmisses:\n${misses.map((m) => "   " + m).join("\n")}`);
