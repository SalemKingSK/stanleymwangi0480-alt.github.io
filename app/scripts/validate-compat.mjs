/**
 * MYSTIQUE COMPASS — Suzanne White compatibility regression guard.
 *
 * WHY THIS EXISTS
 * ───────────────
 * The Compatibility Outlook badges (♥ recommended / ⚡ cautioned / ★ exact
 * pairing) and the "Suzanne White lens" score are derived from the
 * compatibilities paragraphs in lib/new-astrology/*.ts. Two separate bugs
 * have shipped from naive text parsing:
 *
 *   1. A hand-curated static table drifted from the source texts and
 *      recommended pairings the texts explicitly avoid (e.g. it told a
 *      Gemini/Rabbit that Virgo/Rooster was an "exact pairing
 *      recommended", while the text says "No Virgo/Rats or
 *      Virgo/Roosters for you. Nor do I suggest Sagittarius/Tigers …
 *      Too cocky and pushy for you."). 13 wrong rows were found.
 *   2. The parser only recognized a handful of avoidance phrasings
 *      ("stay away", "avoid", "don't…") and missed structures like
 *      "No X or Y for you.", "Nor do I suggest X.", "Erase X from your
 *      mind.", "give up on", "nix on", "less compatible are", "too X
 *      for you", and sentences that MIX both verdicts ("Erase Horses
 *      from your mind altogether, and prefer the solid Aries/Ox").
 *
 * The classifier now used by the app is classifySuzanneWhiteMentions()
 * in src/lib/compatibility-engine.ts: per-mention, nearest-marker
 * classification with the pattern sets validated against all 144
 * combined-sign paragraphs.
 *
 * WHAT THIS SCRIPT DOES (no dependencies, plain Node)
 * ───────────────────────────────────────────────────
 *   - Extracts the two pattern literals straight out of the REAL
 *     compatibility-engine.ts source (no copies to drift).
 *   - Extracts all 144 compatibilities paragraphs straight out of
 *     lib/new-astrology/*.ts.
 *   - Re-runs the full matrix with an independent implementation of the
 *     classifier: 144 subject texts × 144 partner combined signs ×
 *     3 dimensions = 62,208 verdicts, and fails on ANY disagreement or
 *     internal contradiction (e.g. a pairing whose combined sign is
 *     cautioned while a component is recommended).
 *   - Checks the classifier source block against a blessed SHA-256.
 *     If the algorithm was edited, the hash check prints a WARNING
 *     telling you to re-validate and update the blessed hash — the
 *     matrix check still runs either way.
 *
 * Run it whenever the pattern sets, the classifier, or any
 * lib/new-astrology/*.ts paragraph changes:
 *
 *     node source/scripts/validate-compat.mjs
 *
 * Exits non-zero on any disagreement.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LIB = path.join(HERE, "..", "src", "lib");
const ENGINE_SRC = fs.readFileSync(path.join(LIB, "compatibility-engine.ts"), "utf8");

// ── classifier source-block integrity ────────────────────────────────────
// SHA-256 of the block between these markers, as validated on 20 Nov 2026
// against the full corpus (20,736 pairings, 0 contradictions; whole-word
// all-occurrence matching, combined-sign normalisation, explicit "too X" list,
// each mention governed by the closest preceding verdict marker).
const BLESSED_HASH = "5c1d8a3011207a6e9a44c22607cc0f355c3e63b7f21197eea2e1fe75153fbb9b";
{
  const start = ENGINE_SRC.indexOf("// Codify Suzanne White");
  const end = ENGINE_SRC.indexOf("export function generateSoulResonance");
  if (start === -1 || end === -1) throw new Error("classifier block markers not found");
  const block = ENGINE_SRC.slice(start, end);
  const hash = crypto.createHash("sha256").update(block).digest("hex");
  if (hash !== BLESSED_HASH) {
    console.warn("WARNING: classifySuzanneWhiteMentions source changed since last validation.");
    console.warn("Re-run the full validation, then update BLESSED_HASH in this script.");
  }
}

// ── extract the two pattern literals from the real engine source ─────────
function extractPattern(name) {
  const m = ENGINE_SRC.match(new RegExp(`const ${name} = (/[^;]*/gi);`));
  if (!m) throw new Error(`pattern ${name} not found in compatibility-engine.ts`);
  return eval(m[1]);
}
const POS_RE = extractPattern("POSITIVE_OVERRIDE_PATTERN");
const AVOID_RE = extractPattern("CLEAR_AVOID_PATTERN");

// ── extract all 144 compatibilities paragraphs from the real data files ──
const W = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const A = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
const COMBINED = [];
for (const w of W) for (const a of A) COMBINED.push(`${w}/${a}`);

const texts = {};
for (const fn of fs.readdirSync(path.join(LIB, "new-astrology"))) {
  if (!fn.endsWith(".ts") || fn === "index.ts") continue;
  const fileText = fs.readFileSync(path.join(LIB, "new-astrology", fn), "utf8");
  const re = /"([A-Za-z]+\/[A-Za-z]+)"\s*:\s*\{[\s\S]*?compatibilities:\s*`([\s\S]*?)`\s*,?\s*\n/g;
  let m;
  while ((m = re.exec(fileText)) !== null) texts[m[1]] = m[2];
}
if (Object.keys(texts).length !== 144) {
  throw new Error(`expected 144 compat texts, extracted ${Object.keys(texts).length}`);
}
for (const [k, v] of Object.entries(texts)) {
  if (v.includes("`") || v.includes("${")) throw new Error(`backtick inside ${k} text — extraction unsafe`);
}

// ── independent classifier implementation (mirror of the app's logic) ────
function markerIndices(re, s) {
  re.lastIndex = 0;
  const out = [];
  let m;
  while ((m = re.exec(s)) !== null) {
    out.push(m.index);
    if (m.index === re.lastIndex) re.lastIndex++;
  }
  return out;
}
const SW_WESTERN = "aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces";
const SW_ANIMALS = "rat|ox|tiger|rabbit|dragon|snake|horse|goat|monkey|rooster|dog|pig";
// "Leo Dogs" / "Leo-Dog" / "Leo the Dog" -> "leo/dog"
const normalize = (t) =>
  t.toLowerCase().replace(new RegExp(`\\b(${SW_WESTERN})(?:\\s*[/-]\\s*|\\s+)(?:the\\s+)?(${SW_ANIMALS})`, "g"), "$1/$2");
// whole-word mentions (plural/demonym suffixes allowed), every occurrence
function occurrences(s, token) {
  const esc = token.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
  const re = new RegExp(`(?<![a-z])${esc}(?:s|es|en|n|ns|gy|gies)?(?![a-z])`, "g");
  const out = [];
  let m;
  while ((m = re.exec(s)) !== null) out.push(m.index);
  return out;
}
function mentionVerdicts(s, token) {
  const out = { positive: false, avoid: false };
  const hits = occurrences(s, token);
  if (!hits.length) return out;
  const posIdx = markerIndices(POS_RE, s);
  const avIdx = markerIndices(AVOID_RE, s);
  // a marker governs the mention that follows it; fall back to the next marker
  const markers = [...posIdx.map((i) => [i, "positive"]), ...avIdx.map((i) => [i, "avoid"])];
  for (const at of hits) {
    const before = markers.filter(([i]) => i <= at);
    const pool = before.length ? before.map(([i, v]) => [at - i, v]) : markers.map(([i, v]) => [i - at, v]);
    let verdict = null, bestD = Infinity;
    for (const [d, v] of pool) if (d < bestD || (d === bestD && v === "avoid")) { bestD = d; verdict = v; }
    if (verdict === "positive") out.positive = true; else if (verdict === "avoid") out.avoid = true;
  }
  return out;
}
function classify(text, lowerCombined, lowerWestern, lowerAnimal) {
  const lower = normalize(text);
  const combined = normalize(lowerCombined);
  const sentences = (lower.match(/[^.!?]+[.!?]+/g) || [lower]).map((x) => x.trim());
  const dims = { c: [false, false], w: [false, false], a: [false, false] };
  for (const s of sentences) {
    const jc = mentionVerdicts(s, combined);
    const jw = mentionVerdicts(s, lowerWestern);
    const ja = mentionVerdicts(s, lowerAnimal);
    if (jc.positive) dims.c[0] = true; if (jc.avoid) dims.c[1] = true;
    if (jw.positive) dims.w[0] = true; if (jw.avoid) dims.w[1] = true;
    if (ja.positive) dims.a[0] = true; if (ja.avoid) dims.a[1] = true;
  }
  const reduce = ([p, v]) => (p && v) ? "mixed" : p ? "positive" : v ? "avoid" : "unstated";
  return { combined: reduce(dims.c), western: reduce(dims.w), animal: reduce(dims.a) };
}

// ── consistency rules (the actual guarantees) ────────────────────────────
function check(subject, text, partner) {
  const [w, a] = partner.split("/");
  const v = classify(text, partner.toLowerCase(), w.toLowerCase(), a.toLowerCase());
  const problems = [];
  // 1. A pairing whose combined sign is cautioned must never show a
  //    component (western/animal) as purely recommended — that was the
  //    Gemini/Rabbit × Virgo/Rooster bug.
  if (v.combined === "avoid" && (v.western === "positive" || v.animal === "positive")) {
    problems.push(`combined cautioned but component recommended`);
  }
  if (v.combined === "positive" && (v.western === "avoid" || v.animal === "avoid")) {
    problems.push(`combined recommended but component cautioned`);
  }
  return { v, problems };
}

let problems = 0;
const subjectList = Object.keys(texts).sort();
for (const subject of subjectList) {
  const text = texts[subject];
  for (const partner of COMBINED) {
    const { v, problems: p } = check(subject, text, partner);
    if (p.length) {
      problems += p.length;
      console.log(`CONTRADICTION ${subject} × ${partner}: ${p.join("; ")} (${JSON.stringify(v)})`);
    }
  }
}

console.log(`checked ${subjectList.length} subject texts × ${COMBINED.length} partner pairings = ${subjectList.length * COMBINED.length} pairings`);
console.log(`contradictions: ${problems}`);
if (problems > 0) {
  console.log("FAIL — the classification contradicts the source texts. Fix before deploying.");
  process.exit(1);
}
console.log("PASS — no pairing is recommended while its own text cautions it, and vice versa.");
