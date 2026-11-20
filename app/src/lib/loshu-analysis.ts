// src/lib/loshu-analysis.ts
// Pure logic for analyzing a number's role in the grid and cross-referencing Life Path.

import {
  LOSHU_NUMBER_DEFINITIONS,
  LIFE_PATH_CONFLICTS,
  REMEDIES,
  type NumberDefinition,
  type LifePathConflict,
  type Remedy,
} from "./loshu-definitions";

/** Reduces a number to a single digit (1–9). */
export function reduceToSingleDigit(n: number): number {
  let val = Math.abs(n);
  while (val > 9) {
    val = String(val)
      .split("")
      .reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return val || 9;
}

/** Calculates Life Path from date digits. */
export function calculateLifePath(birthDate: string): number {
  const digits = birthDate.replace(/\D/g, "").split("").map(Number);
  const sum = digits.reduce((acc, d) => acc + d, 0);
  return reduceToSingleDigit(sum);
}

/**
 * Lo Shu Grid digit counts.
 *
 * Layers:
 *  1. Birth digits  — every non-zero digit from the raw date string
 *  2. Main Compound — sum of all date digits; if 2-digit result add both digits
 *                     separately; if 1-digit add it once
 *
 * Psychic Number, Life Path, and Kua are intentionally excluded from grid display.
 */
export interface EnhancedGridResult {
  counts: Record<number, number>;
  breakdown: {
    birthDigits: number[];
    compoundNumber: number;
    compoundDigits: number[];
  };
}

export function getEnhancedGridCounts(birthDate: string): EnhancedGridResult {
  const counts: Record<number, number> = {};

  const addDigit = (n: number) => {
    if (n >= 1 && n <= 9) {
      counts[n] = (counts[n] || 0) + 1;
    }
  };

  // 1. Birth digits (non-zero digits from the raw date string)
  const rawDigits = birthDate
    .replace(/\D/g, "")
    .split("")
    .map(Number)
    .filter((d) => d >= 1 && d <= 9);
  rawDigits.forEach(addDigit);

  // 2. Main Compound Number (sum of ALL digits including zeros)
  const allDigits = birthDate.replace(/\D/g, "").split("").map(Number);
  const compoundNumber = allDigits.reduce((acc, d) => acc + d, 0);
  const compoundDigits =
    compoundNumber >= 10
      ? String(compoundNumber).split("").map(Number).filter(d => d !== 0)
      : compoundNumber > 0 ? [compoundNumber] : [];
  compoundDigits.forEach(addDigit);

  return {
    counts,
    breakdown: {
      birthDigits: rawDigits,
      compoundNumber,
      compoundDigits,
    },
  };
}

/**
 * Legacy function — raw birth date digit counts only.
 * Kept for backward compatibility; prefer getEnhancedGridCounts.
 */
export function getGridCounts(birthDate: string): Record<number, number> {
  const counts: Record<number, number> = {};
  birthDate
    .replace(/\D/g, "")
    .split("")
    .forEach((d) => {
      const n = parseInt(d, 10);
      if (n >= 1 && n <= 9) {
        counts[n] = (counts[n] || 0) + 1;
      }
    });
  return counts;
}

export interface NumberAnalysis {
  number: number;
  count: number;
  definition: NumberDefinition;
  isDrowning: boolean;
  drownsNumbers: number[];
  remedy: Remedy;
  lifePathConflict: LifePathConflict | null;
  lifePath: number;
}

/**
 * Analyzes a number.
 * actualCount is provided because the grid includes compound digits
 * which aren't in the raw birthDate string.
 */
export function analyzeNumber(
  number: number,
  birthDate: string,
  actualCount?: number
): NumberAnalysis {
  const counts = getGridCounts(birthDate);
  const count = actualCount !== undefined ? actualCount : (counts[number] ?? 0);
  const definition = LOSHU_NUMBER_DEFINITIONS[number];
  const lifePath = calculateLifePath(birthDate);

  const isDrowning = count >= 3;
  const drownsNumbers = isDrowning ? (definition.drownsNumbers ?? []) : [];

  const conflictDef = LIFE_PATH_CONFLICTS[number] ?? null;
  const lifePathConflict =
    lifePath === number && isDrowning ? conflictDef : null;

  return {
    number,
    count,
    definition,
    isDrowning,
    drownsNumbers,
    remedy: REMEDIES[number],
    lifePathConflict,
    lifePath,
  };
}