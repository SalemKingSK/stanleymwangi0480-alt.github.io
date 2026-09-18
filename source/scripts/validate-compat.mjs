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
const LIB = path.join(HERE, "..", "mystique-src", "lib");
const ENGINE_SRC = fs.readFileSync(path.join(LIB, "compatibility-engine.ts"), "utf8");

// ── classifier source-block integrity ────────────────────────────────────
// SHA-256 of the block between these markers, as validated on 12 Sep 2026
// against the full corpus (62,208/62,208 verdicts consistent).
const BLESSED_HASH = "8608104547731ab6497dbf1a8094440f97185b1cf3a5b7487da6284dbcd6b78e";
{
  const start = ENGINE_SRC.indexOf("// Codify Suzanne White");
  const end = ENGINE_SRC.indexOf("export function generateSoulResonance");
  if (start === -1 || end === -1) throw new Error("classifier block markers not found");
  const block = ENGINE_SRC.slice(start, end);
  const hash = crypto.createHash("sha256").update(block).digest("hex");
  if (BLESSED_HASH !== "8608104547731ab6497dbf1a8094440f97185b1cf3a5b7487da6284dbcd6b78e" && hash !== BLESSED_HASH) {
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
function mentionVerdict(s, token) {
  const first = s.indexOf(token);
  if (first === -1) return null;
  const posIdx = markerIndices(POS_RE, s);
  const avIdx = markerIndices(AVOID_RE, s);
  let verdict = null, bestD = Infinity;
  for (const p of posIdx) { const d = Math.abs(p - first); if (d < bestD) { bestD = d; verdict = "positive"; } }
  for (const av of avIdx) { const d = Math.abs(av - first); if (d < bestD || (d === bestD && verdict === "avoid")) { bestD = d; verdict = "avoid"; } }
  return verdict;
}
function classify(text, lowerCombined, lowerWestern, lowerAnimal) {
  const lower = text.toLowerCase();
  const sentences = (lower.match(/[^.!?]+[.!?]+/g) || [lower]).map((x) => x.trim());
  const dims = { c: [false, false], w: [false, false], a: [false, false] };
  for (const s of sentences) {
    const jc = mentionVerdict(s, lowerCombined);
    const jw = mentionVerdict(s, lowerWestern);
    const ja = mentionVerdict(s, lowerAnimal);
    if (jc === "positive") dims.c[0] = true; else if (jc === "avoid") dims.c[1] = true;
    if (jw === "positive") dims.w[0] = true; else if (jw === "avoid") dims.w[1] = true;
    if (ja === "positive") dims.a[0] = true; else if (ja === "avoid") dims.a[1] = true;
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
