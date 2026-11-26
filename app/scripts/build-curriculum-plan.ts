/**
 * Builds src/lib/curriculum/plan.json — the Curriculum's case studies.
 *
 *   npx tsx scripts/build-curriculum-plan.ts
 *
 * 1. Computes the full reading of every person in the birthday vault (not
 *    countries, clubs, cities or states) and of a sweep of practice birthdays
 *    (every 6th day, 1900–2030), exactly as the results screen would.
 * 2. Lists, for every "chart" field of the catalogue, every variant any of
 *    those birthdays shows — that is the syllabus to master.
 * 3. Picks case studies: every Family & Friends birthday first, then famous
 *    people chosen greedily for the most still-uncovered variants, then
 *    practice birthdays for anything no real person shows.
 *
 * Re-run after changing the vault or the reading engines.
 */
import { writeFileSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { famousBirthdays, type FamousPerson } from "@/lib/famous-birthdays";
import { buildChart, type BirthInput } from "@/lib/curriculum/chart";
import { FIELDS, chartVariants } from "@/lib/curriculum/catalogue";
import { FAMILY_EXCLUDED, type CurriculumPlan, type PlanCase } from "@/lib/curriculum/plan";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, "../src/lib/curriculum/plan.json");
const VAULT_SRC = resolve(here, "../src/lib/famous-birthdays.ts");
const MAX_PER_VARIANT = Number.POSITIVE_INFINITY;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const chartFields = FIELDS.filter((f) => f.kind === "chart");

/** Names listed in the vault's "FAMILY & FRIENDS — PERSONAL ARCHIVE" block, in order. */
function familyNames(): string[] {
  const src = readFileSync(VAULT_SRC, "utf8");
  const start = src.indexOf("FAMILY & FRIENDS — PERSONAL ARCHIVE");
  const end = src.indexOf("GEOGRAPHIC ENTITIES", start);
  if (start < 0 || end < 0) throw new Error("Family & Friends block not found in famous-birthdays.ts");
  const names: string[] = [];
  for (const m of src.slice(start, end).matchAll(/name:\s*(['"])(.*?)\1/g)) {
    const n = m[2].replace(/\\'/g, "'");
    if (!names.includes(n)) names.push(n);
  }
  return names;
}

type Units = Set<string>;

async function unitsOf(input: BirthInput): Promise<Units> {
  const chart = await buildChart(input);
  const out: Units = new Set();
  for (const f of chartFields) for (const v of chartVariants(f, chart, new Date(), { all: true })) out.add(`${f.id}\u0001${v}`);
  return out;
}

function firstTag(p: FamousPerson): string {
  return p.tags.find((t) => !["Personal Archive", "Family & Friends", "Historical Figure"].includes(t)) ?? p.tags[0] ?? "";
}

async function main() {
  const t0 = Date.now();
  const family = familyNames().filter((n) => !FAMILY_EXCLUDED.includes(n));
  const people = famousBirthdays.filter((p) => p.year > 0 && !p.tags.includes("Entity"));
  const seen = new Set<string>();
  const unique = people.filter((p) => {
    const k = `${p.name}|${p.day}|${p.month}|${p.year}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  console.log(`Computing ${unique.length} vault charts…`);
  const personUnits = new Map<FamousPerson, Units>();
  for (const p of unique) {
    personUnits.set(p, await unitsOf({ name: p.name, day: p.day, month: p.month, year: p.year, gender: p.gender }));
  }

  console.log("Sweeping practice birthdays…");
  const practice: { input: BirthInput; units: Units }[] = [];
  let g = 0;
  for (let t = Date.UTC(1900, 0, 1); t <= Date.UTC(2030, 11, 31); t += 6 * 86_400_000) {
    const d = new Date(t);
    const day = d.getUTCDate(), month = d.getUTCMonth() + 1, year = d.getUTCFullYear();
    const input = { name: `Practice Chart · ${day} ${MONTHS[month - 1]} ${year}`, day, month, year, gender: g++ % 2 ? "female" : "male" };
    practice.push({ input, units: await unitsOf(input) });
  }

  // The syllabus: every variant any birthday shows.
  const universe = new Set<string>();
  for (const u of personUnits.values()) u.forEach((x) => universe.add(x));
  for (const p of practice) p.units.forEach((x) => universe.add(x));

  // Case studies.
  const cases: { c: PlanCase; units: Units }[] = [];
  const covered = new Set<string>();
  const add = (c: PlanCase, units: Units) => {
    cases.push({ c, units });
    units.forEach((x) => covered.add(x));
  };
  const byName = new Map(unique.map((p) => [p.name, p]));
  const missingFamily: string[] = [];
  for (const name of family) {
    const p = byName.get(name);
    if (!p) {
      missingFamily.push(name);
      continue;
    }
    const isFamily = p.tags.includes("Family & Friends");
    add({ n: p.name, d: p.day, m: p.month, y: p.year, g: p.gender, k: isFamily ? "family" : "circle", t: firstTag(p) }, personUnits.get(p)!);
  }
  const familyCount = cases.length;

  const pool = unique.filter((p) => !cases.some((x) => x.c.n === p.name && x.c.y === p.year));
  for (;;) {
    let best: FamousPerson | null = null;
    let bestGain = 0;
    for (const p of pool) {
      let gain = 0;
      for (const x of personUnits.get(p)!) if (!covered.has(x)) gain++;
      if (gain > bestGain) {
        bestGain = gain;
        best = p;
      }
    }
    if (!best) break;
    add({ n: best.name, d: best.day, m: best.month, y: best.year, g: best.gender, k: "vault", t: firstTag(best) }, personUnits.get(best)!);
    pool.splice(pool.indexOf(best), 1);
  }
  const vaultCount = cases.length - familyCount;

  const practicePool = [...practice];
  for (;;) {
    let best: (typeof practice)[number] | null = null;
    let bestGain = 0;
    for (const p of practicePool) {
      let gain = 0;
      for (const x of p.units) if (!covered.has(x)) gain++;
      if (gain > bestGain) {
        bestGain = gain;
        best = p;
      }
    }
    if (!best) break;
    const i = best.input;
    add({ n: i.name, d: i.day, m: i.month, y: i.year, g: i.gender as PlanCase["g"], k: "practice", t: "Practice birthday" }, best.units);
    practicePool.splice(practicePool.indexOf(best), 1);
  }

  // variant → the case studies that show it (path order).
  const fields: CurriculumPlan["fields"] = {};
  for (const f of chartFields) fields[f.id] = {};
  for (const key of [...universe].sort()) {
    const [fid, v] = key.split("\u0001");
    fields[fid][v] = [];
  }
  cases.forEach(({ units }, idx) => {
    for (const key of units) {
      const [fid, v] = key.split("\u0001");
      const list = fields[fid]?.[v];
      if (list && list.length < MAX_PER_VARIANT) list.push(idx);
    }
  });

  const plan: CurriculumPlan = {
    generated: new Date().toISOString().slice(0, 10),
    planningYear: new Date().getFullYear(),
    stats: { vaultCharts: unique.length, practiceCharts: practice.length, family: familyCount, vault: vaultCount, practice: cases.length - familyCount - vaultCount, units: universe.size },
    missingFamily,
    cases: cases.map((x) => x.c),
    fields,
  };
  writeFileSync(OUT, JSON.stringify(plan));
  console.log(
    `Wrote ${OUT}\n  ${universe.size} chart units across ${chartFields.length} fields\n  ${cases.length} case studies: ${familyCount} family & friends, ${vaultCount} from the vault, ${plan.stats.practice} practice birthdays\n  ${((Date.now() - t0) / 1000).toFixed(0)} s`,
  );
  if (missingFamily.length) console.log(`  Family names not found: ${missingFamily.join(", ")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
