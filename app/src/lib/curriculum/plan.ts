/**
 * The case-study plan (built by scripts/build-curriculum-plan.ts) and the
 * syllabus built from it: every unit of every field, with the birthdays that
 * teach it.
 */
import { FIELDS, PRACTICE, fieldAvailable, type FieldDef } from "./catalogue";
import type { BirthInput } from "./chart";
import { appNow } from "@/lib/time/focus";

export interface PlanCase {
  /** Name */
  n: string;
  d: number;
  m: number;
  y: number;
  g: "male" | "female" | "other";
  /** family = Personal / Family Archive, circle = the rest of the Family & Friends block, vault = famous birthday, practice = sweep birthday. */
  k: "family" | "circle" | "vault" | "practice";
  /** A descriptive tag. */
  t: string;
}

export interface CurriculumPlan {
  generated: string;
  planningYear: number;
  stats: { vaultCharts: number; practiceCharts: number; family: number; vault: number; practice: number; units: number };
  missingFamily: string[];
  cases: PlanCase[];
  /** chart field → variant → indexes into `cases` */
  fields: Record<string, Record<string, number[]>>;
}

/** Family & Friends entries left out of the case studies: an event, and a misspelt duplicate. */
export const FAMILY_EXCLUDED = ["Fuel Strike", "Tetesia Wairimu"];

export function caseInput(c: PlanCase): BirthInput {
  return { name: c.n, day: c.d, month: c.m, year: c.y, gender: c.g };
}

export const caseId = (c: { n: string; d: number; m: number; y: number }) => `${c.n}|${c.d}-${c.m}-${c.y}`;

export interface SyllabusUnit {
  field: FieldDef;
  variant: string;
}

/** (Kept for older plans: variants ending in a past year are dropped.) */
function stillCurrent(field: FieldDef, variant: string, now: Date): boolean {
  const y = Number(/ · (\d{4})$/.exec(variant)?.[1]);
  return !y || y >= now.getFullYear();
}

const natural = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

/** Every unit of a field, in natural order. */
export function fieldUniverse(field: FieldDef, plan: CurriculumPlan, now = appNow()): string[] {
  if (!fieldAvailable(field)) return [];
  let list: string[];
  if (field.kind === "practice") list = [PRACTICE];
  else if (field.kind === "library") list = field.library?.() ?? [];
  else if (field.kind === "temporal") list = field.universe?.() ?? [];
  else list = Object.keys(plan.fields[field.id] ?? {}).sort(natural.compare);
  return list.filter((v) => stillCurrent(field, v, now));
}

export function allUnits(plan: CurriculumPlan, now = appNow()): SyllabusUnit[] {
  return FIELDS.flatMap((field) => fieldUniverse(field, plan, now).map((variant) => ({ field, variant })));
}

/** Temporal variants of every case (cached per day). */
let temporalCache: { day: string; map: Map<string, Map<string, number[]>> } | null = null;
function temporalIndex(plan: CurriculumPlan, now: Date): Map<string, Map<string, number[]>> {
  const day = now.toDateString();
  if (temporalCache?.day === day) return temporalCache.map;
  const map = new Map<string, Map<string, number[]>>();
  for (const f of FIELDS) {
    if (f.kind !== "temporal" || !f.temporal) continue;
    const byVariant = new Map<string, number[]>();
    plan.cases.forEach((c, i) => {
      for (const v of f.temporal!({ day: c.d, month: c.m, year: c.y }, now)) {
        const list = byVariant.get(v) ?? [];
        if (list.length < 5) list.push(i);
        byVariant.set(v, list);
      }
    });
    map.set(f.id, byVariant);
  }
  temporalCache = { day, map };
  return map;
}

/**
 * Case studies that show a unit. Library and practice units can be studied on
 * any chart, so none are listed for them (the current reading will do).
 */
export function casesForUnit(plan: CurriculumPlan, field: FieldDef, variant: string, now = appNow()): number[] {
  if (field.kind === "chart") return plan.fields[field.id]?.[variant] ?? [];
  if (field.kind === "temporal") return temporalIndex(plan, now).get(field.id)?.get(variant) ?? [];
  return [];
}

/** Units each case study teaches (chart + temporal fields). */
export function unitsOfCase(plan: CurriculumPlan, index: number, now = appNow()): SyllabusUnit[] {
  const out: SyllabusUnit[] = [];
  for (const field of FIELDS) {
    if (!fieldAvailable(field)) continue;
    if (field.kind === "chart") {
      for (const [variant, idx] of Object.entries(plan.fields[field.id] ?? {})) {
        if (idx.includes(index) && stillCurrent(field, variant, now)) out.push({ field, variant });
      }
    } else if (field.kind === "temporal" && field.temporal) {
      const c = plan.cases[index];
      for (const variant of field.temporal({ day: c.d, month: c.m, year: c.y }, now)) out.push({ field, variant });
    }
  }
  return out;
}

let cached: Promise<CurriculumPlan> | null = null;
/** The plan is a separate chunk, loaded when the Curriculum opens. */
export function loadPlan(): Promise<CurriculumPlan> {
  if (!cached) cached = import("./plan.json").then((m) => (m.default ?? m) as unknown as CurriculumPlan);
  return cached;
}
