/**
 * MYSTIQUE COMPASS — Predictive-layer regression guard.
 *
 * WHY THIS EXISTS
 * ───────────────
 * The predictive layer was audited against 36 documented celebrity life
 * events and the app's own 429-case historical library (12 Sep 2026).
 * The audit found the MEANING texts largely faithful to Cheiro, but the
 * code around them had drift:
 *   - 11 compound names contradicted Cheiro's canon (e.g. 45/9 named
 *     "Ambitious Business Success" while Cheiro assigns 45 the meaning of
 *     27, the Sceptre).
 *   - Master years 11/22/33 rendered "undefined" titles and blank texts.
 *   - Karmic debts were mislabeled: every Life Path 4/5/7/1 was told they
 *     carried debts 13/14/16/19 (the ROOT is not the DEBT).
 *   - Numeric scores contradicted the polarity texts on the same screen.
 *   - The pinnacle radar skipped the real transition year and miscomputed
 *     months for pre-birthday reads; challenges >9 rendered "(no text)".
 *   - Narratives hardcoded the current year for historical reads.
 *   - Pinnacle 7 claimed "the material world dries up" as an absolute.
 *
 * This script fails if any of those regressions comes back. It reads the
 * real source files (no copies to drift) and needs no dependencies.
 *
 * Run it after ANY edit to:
 *   lib/temporal-prediction-engine-v2.ts
 *   lib/numerology/chaldean-pyn-compounds.ts
 *   lib/numerology/personal-year-full.ts
 *   lib/cosmic-fate/pinnacles.ts, oracle.ts, oracle-data.ts
 *
 *     node source/scripts/validate-predictive.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LIB = path.join(HERE, "..", "mystique-src", "lib");
const read = (p) => fs.readFileSync(path.join(LIB, p), "utf8");

const compounds = read("numerology/chaldean-pyn-compounds.ts");
const engine = read("temporal-prediction-engine-v2.ts");
const pyFull = read("numerology/personal-year-full.ts");
const pinnacles = read("cosmic-fate/pinnacles.ts");
const oracle = read("cosmic-fate/oracle.ts");
const oracleData = read("cosmic-fate/oracle-data.ts");

let failures = 0;
const fail = (msg) => { failures++; console.log("FAIL: " + msg); };
const ok = (msg) => console.log("  ok: " + msg);

// ── 1. Compound names match Cheiro canon ───────────────────────────────────
const CANON_NAMES = [
  [34, "The Striver's Balance"],
  [35, "The Warning of Dangerous Alliances"],
  [38, "The Vision Under Judgment"],
  [42, "The Magnetism of Duty"],
  [44, "The Master Builder's Trial"],
  [45, "The Scepter's Harvest"],
  [46, "The Magnetic Partnership"],
  [47, "The Veiled Trial"],
  [49, "The Solitary Builder"],
  [50, "The Independent Force"],
  [51, "The Warrior's Advance"],
];
for (const [n, name] of CANON_NAMES) {
  const re = new RegExp(`compound: ${n},\\s*reduced: \\d+,\\s*name: "([^"]+)"`);
  const m = compounds.match(re);
  if (!m) fail(`compound ${n} missing`);
  else if (m[1] !== name) fail(`compound ${n} renamed to "${m[1]}" (expected "${name}")`);
  else ok(`compound ${n} = "${name}"`);
}

// ── 2. Master years fully covered in the engine ────────────────────────────
for (const bank of ["PY_TITLES", "CAREER_BY_PY", "REL_BY_PY", "FIN_BY_PY", "HEALTH_BY_PY", "SPIRIT_BY_PY", "PD_FOCUS", "PD_SHORT"]) {
  const idx = engine.indexOf(`const ${bank}`);
  if (idx === -1) { fail(`${bank} not found`); continue; }
  const seg = engine.slice(idx, engine.indexOf("};", idx));
  for (const n of [11, 22, 33]) {
    if (!new RegExp(`${n}:`).test(seg)) fail(`${bank} missing master row ${n}`);
  }
  ok(`${bank} covers 11/22/33`);
}
for (const tbl of ["PY_CAREER", "PY_FIN", "PY_REL", "PY_HEALTH", "PY_SPIRIT"]) {
  if (!new RegExp(`${tbl}: Record<number, number>\\s*=\\s*\\{[^}]*11:`).test(engine))
    fail(`${tbl} missing master row 11`);
  else ok(`${tbl} covers masters`);
}
if (!/11:\s*\{ pms:\[2,11\]/.test(engine)) fail("OPP missing master 11 window");
else ok("OPP covers masters");
if (!/11:\s*\{ risk:/.test(engine)) fail("FLAGS missing master 11");
else ok("FLAGS covers masters");

// ── 3. Karmic debt: birth-day rule only, no root mislabeling ───────────────
if (!/birthDay === debt/.test(engine)) fail("karmic detection no longer uses birth day");
if (/lifePath === DEBT_TO_ROOT/.test(engine)) fail("karmic detection still mislabels Life Path roots as debts");
else ok("karmic = birth-day canonical rule");

// ── 4. Polarity agreement wired ────────────────────────────────────────────
if (!/POLARITY_ADJUST/.test(engine)) fail("polarity adjust table missing");
if (!/essencePolarity/.test(engine)) fail("essencePolarity not computed");
if (!/predominantly cautionary/.test(engine)) fail("cautionary consistency cap missing");
else ok("scores wired to dual-essence polarity");

// ── 5. Radar + challenges ──────────────────────────────────────────────────
if (!/readMonth < birthMonth/.test(engine)) fail("radar month correction missing");
if (!/PINNACLE TRANSITION NOW/.test(engine)) fail("radar boundary-year handling missing");
if (!/reduceChallenge/.test(engine)) fail("challenge strict reduction missing");
else ok("radar + challenge fixes present");

// ── 6. Wrong-year fix ──────────────────────────────────────────────────────
if (/In \$\{new Date\(\)\.getFullYear\(\)\}/.test(engine)) fail("lo shu narrative still hardcodes current year");
else ok("targetYear threaded through narratives");

// ── 7. Pinnacle 7 two-sided + master pinnacle texts present ────────────────
if (!pinnacles.includes("Crucible of Depth")) fail("Pinnacle 7 rewrite missing");
else ok("Pinnacle 7 two-sided ('Crucible of Depth')");
for (const k of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "22", "33"])
  if (!new RegExp(`"${k}": `).test(pinnacles)) fail(`PINNACLE_DESC missing ${k}`);
ok("PINNACLE_DESC 1-9 + 11/22/33 present");
for (const k of ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])
  if (!new RegExp(`"${k}": `).test(pinnacles)) fail(`CHALLENGE_DESC missing ${k}`);
ok("CHALLENGE_DESC 0-9 present");

// ── 8. Master-year resolvers ───────────────────────────────────────────────
if (!oracle.includes("yearDiveOracle")) fail("yearDiveOracle resolver missing");
else ok("yearDiveOracle present");
if (!oracleData.includes("yearDescription")) fail("yearDescription resolver missing");
else ok("yearDescription present");

// ── 9. Woven synthesis (the intermarriage) present and grounded in real cases ──
const synthesis = read("numerology/personal-year-synthesis.ts");
if (!synthesis.includes("buildWovenSynthesis")) fail("woven synthesis builder missing");
else ok("buildWovenSynthesis present");
if (!synthesis.includes("Its clearest precedent is")) fail("woven synthesis lacks real-life precedent phrasing");
else ok("woven synthesis cites real precedents");
if (!synthesis.includes("the essences set the stage, but conduct decides")) fail("woven synthesis lacks the honesty clause (triumph + reversal)");
else ok("woven synthesis carries the honesty clause");
if (!synthesis.includes("isEntity")) fail("famous-mirror entity filter missing");
else ok("famous mirrors filter non-people entities");
if (!synthesis.includes("wovenSynthesis: string")) fail("wovenSynthesis not exposed in the interface");
else ok("wovenSynthesis exposed for UI");

// ── 10. Master-year interpretation in personal-year-full ───────────────────
if (!pyFull.includes("MASTER_YEAR_NOTES")) fail("master-year notes missing in personal-year-full");
else ok("master-year interpretation present");

// ── 10. Canon quotes present where names alone could mislead ───────────────
for (const [n, quote] of [[45, "same meaning as 27"], [49, "same meaning as 31"], [38, "same meaning as 29"]]) {
  if (!compounds.includes(`assigns ${n} the ${quote}`) && !compounds.includes(`assigns ${n} the same meaning as ${quote}`))
    fail(`canon quote for ${n} missing`);
  else ok(`canon quote ${n} present`);
}

console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: predictive-layer regression guard — ${failures} problem(s)`);
if (failures > 0) process.exit(1);
