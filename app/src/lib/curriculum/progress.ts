/**
 * Turning the Syllabus Scheme's raw listen counts into study progress:
 * per-unit counts, mastery tiers, spaced-review due dates, streaks.
 */
import { FIELD_BY_ID, partsOf, type FieldDef } from "./catalogue";
import type { SyllabusScheme } from "./store";

export interface Tier {
  min: number;
  id: string;
  label: string;
  color: string;
}

/** Mastery ladder: how many full studies a unit has had. */
export const TIERS: Tier[] = [
  { min: 0, id: "new", label: "Not yet studied", color: "#4b5563" },
  { min: 1, id: "studied", label: "Studied", color: "#60a5fa" },
  { min: 2, id: "reviewed", label: "Reviewed ×2", color: "#34d399" },
  { min: 3, id: "reinforced", label: "Reinforced ×3", color: "#a3e635" },
  { min: 5, id: "fluent", label: "Fluent ×5", color: "#fbbf24" },
  { min: 7, id: "mastered", label: "Mastered ×7", color: "#f97316" },
  { min: 12, id: "sage", label: "Sage ×12", color: "#e879f9" },
];

export function tierOf(count: number): Tier {
  let t = TIERS[0];
  for (const x of TIERS) if (count >= x.min) t = x;
  return t;
}

export function nextTier(count: number): Tier | null {
  return TIERS.find((t) => t.min > count) ?? null;
}

export const unitKey = (field: string, variant: string) => `${field}|${variant}`;

/**
 * Full studies of a unit: with named parts, the fewest listens of any part
 * needed (each part must be heard that many times); otherwise the most
 * listens of any passage.
 */
export function unitCount(scheme: SyllabusScheme, fieldId: string, variant: string): number {
  const rec = scheme.units[fieldId]?.[variant];
  if (!rec) return 0;
  const field = FIELD_BY_ID.get(fieldId);
  if (!field || !field.parts) return Math.max(0, ...Object.values(rec).map((r) => r.n));
  const required = partsOf(field, variant).filter((p) => !p.optional);
  if (!required.length) return Math.max(0, ...Object.values(rec).map((r) => r.n));
  return Math.min(...required.map((p) => rec[p.id]?.n ?? 0));
}

export function unitLast(scheme: SyllabusScheme, fieldId: string, variant: string): number {
  const rec = scheme.units[fieldId]?.[variant];
  return rec ? Math.max(0, ...Object.values(rec).map((r) => r.last)) : 0;
}

export function unitWho(scheme: SyllabusScheme, fieldId: string, variant: string): string[] {
  const rec = scheme.units[fieldId]?.[variant];
  if (!rec) return [];
  return [...new Set(Object.values(rec).flatMap((r) => r.who ?? []))];
}

export function partCounts(scheme: SyllabusScheme, field: FieldDef, variant: string) {
  const rec = scheme.units[field.id]?.[variant] ?? {};
  return partsOf(field, variant).map((p) => ({ ...p, n: rec[p.id]?.n ?? 0 }));
}

const DAY = 86_400_000;
/** Days until the next review, by how many times the unit was studied. */
const REVIEW_DAYS = [0, 1, 3, 7, 14, 30, 60, 120];

/** When a studied unit is next due for review (ms timestamp), or null if never studied. */
export function reviewDue(count: number, last: number): number | null {
  if (count < 1 || !last) return null;
  const days = REVIEW_DAYS[Math.min(count, REVIEW_DAYS.length - 1)];
  return last + days * DAY;
}

export function isDue(count: number, last: number, now = Date.now()): boolean {
  const due = reviewDue(count, last);
  return due !== null && due <= now;
}

export function dayKey(t: number): string {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Listens per day, consecutive-day streak and today's total. */
export function activity(scheme: SyllabusScheme, now = Date.now()) {
  const perDay = new Map<string, number>();
  for (const e of scheme.log) perDay.set(dayKey(e.t), (perDay.get(dayKey(e.t)) ?? 0) + 1);
  const today = perDay.get(dayKey(now)) ?? 0;
  let streak = 0;
  // A streak survives until the end of today even if today has no listens yet.
  let cursor = today ? now : now - DAY;
  while (perDay.get(dayKey(cursor))) {
    streak++;
    cursor -= DAY;
  }
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const t = now - (13 - i) * DAY;
    return { day: dayKey(t), n: perDay.get(dayKey(t)) ?? 0 };
  });
  const total = Object.values(scheme.units).reduce(
    (a, vs) => a + Object.values(vs).reduce((b, ps) => b + Object.values(ps).reduce((c, r) => c + r.n, 0), 0),
    0,
  );
  return { today, streak, last14, totalListens: total };
}
