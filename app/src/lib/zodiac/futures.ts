import { appNow } from "@/lib/time/focus";
/**
 * The Temporal Trajectory: each sign's forecast for each year of the 12-year cycle.
 *
 * A forecast depends on the animal ruling the year (a Rat in a Horse year reads the
 * same in 2026 as in 2038), so the texts are keyed by year animal and any 12-year
 * window can be shown — always the current year and the eleven after it.
 */
export const CYCLE_ANIMALS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"] as const;
const STEMS = ["Yang Wood", "Yin Wood", "Yang Fire", "Yin Fire", "Yang Earth", "Yin Earth", "Yang Metal", "Yin Metal", "Yang Water", "Yin Water"];

const mod = (n: number, m: number) => ((n % m) + m) % m;

/** The animal ruling a (Gregorian) year — 1984, 1996, 2008, 2020 are Rat years. */
export function yearAnimal(year: number): string {
  return CYCLE_ANIMALS[mod(year - 4, 12)];
}

/** The year's heavenly-stem element, e.g. 2026 → "Yang Fire". */
export function yearElement(year: number): string {
  return STEMS[mod(year - 4, 10)];
}

export type FuturesRecord = Record<string, { year: string; element?: string; prediction: string }>;

/** Year animal → forecast, from a sign's `futures` record. */
export function futureTexts(futures: FuturesRecord | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const entry of Object.values(futures ?? {})) if (entry?.year && entry.prediction) out[entry.year] = entry.prediction;
  return out;
}

export interface FutureYear {
  year: number;
  animal: string;
  element: string;
  prediction: string;
}

/** `count` consecutive years from `from` (default: this year and the eleven after it). */
export function futureWindow(futures: FuturesRecord | null | undefined, from = appNow().getFullYear(), count = 12): FutureYear[] {
  const texts = futureTexts(futures);
  const out: FutureYear[] = [];
  for (let year = from; year < from + count; year++) {
    const animal = yearAnimal(year);
    const prediction = texts[animal];
    if (prediction) out.push({ year, animal, element: yearElement(year), prediction });
  }
  return out;
}
