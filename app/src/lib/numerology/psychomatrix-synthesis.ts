/**
 * @fileoverview PSYCHOMATRIX SYNTHESIS
 * Converts a raw PsychomatrixResult into a PersonalizedPsychomatrixReport with
 * line-strength analysis used by the contradiction and recommendation engines.
 */

import type { PsychomatrixResult } from '@/lib/numerology/data/psychomatrixData';
import type { LineIntersection } from '@/lib/numerology/synthesis/psychomatrix-intersection-engine';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type StrengthCategory = 'absent' | 'weak' | 'balanced' | 'strong' | 'overload';

export interface LineAnalysis {
  id: string;
  name: string;
  cells: number[];
  totalDigits: number;
  strengthCategory: StrengthCategory;
}

export interface PersonalizedPsychomatrixReport {
  lines: LineAnalysis[];
  intersections: { patterns: LineIntersection[] };
}

// ═══════════════════════════════════════════════════════════════════════════════
// LINE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

interface LineDef {
  id: string;
  name: string;
  cells: number[];
}

const LINE_DEFS: LineDef[] = [
  { id: 'row_1', name: 'Purpose / Will',        cells: [1, 4, 7] },
  { id: 'row_2', name: 'Family / Attachment',   cells: [2, 5, 8] },
  { id: 'row_3', name: 'Stability / Habits',    cells: [3, 6, 9] },
  { id: 'col_1', name: 'Self-Esteem',           cells: [1, 2, 3] },
  { id: 'col_2', name: 'Work / Money',          cells: [4, 5, 6] },
  { id: 'col_3', name: 'Talent / Gifts',        cells: [7, 8, 9] },
  { id: 'diag_spirit', name: 'Spirituality',    cells: [1, 5, 9] },
  { id: 'diag_carnal', name: 'Temperament',     cells: [3, 5, 7] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function toStrengthCategory(totalDigits: number): StrengthCategory {
  if (totalDigits === 0) return 'absent';
  if (totalDigits === 1) return 'weak';
  if (totalDigits <= 3) return 'balanced';
  if (totalDigits <= 5) return 'strong';
  return 'overload';
}

function computeTotalDigits(cells: number[], counts: Record<number, number>): number {
  return cells.reduce((sum, cell) => sum + (counts[cell] ?? 0), 0);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════════

export function createPersonalizedPsychomatrixReport(
  pmx: PsychomatrixResult
): PersonalizedPsychomatrixReport {
  const counts = pmx.counts;

  const lines: LineAnalysis[] = LINE_DEFS.map((def) => {
    const totalDigits = computeTotalDigits(def.cells, counts);
    return {
      id: def.id,
      name: def.name,
      cells: def.cells,
      totalDigits,
      strengthCategory: toStrengthCategory(totalDigits),
    };
  });

  return {
    lines,
    intersections: { patterns: [] },
  };
}
