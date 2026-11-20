/**
 * @fileoverview DOMINANCE HIERARCHY ENGINE
 * Ranks the psychomatrix lines from dominant to suppressed, producing a
 * priority architecture for understanding which forces most shape the life.
 */

import type { LineAnalysis } from '@/lib/numerology/psychomatrix-synthesis';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface DominanceEntry {
  element: string;
  description: string;
  score: number;
}

export interface DominanceHierarchyResult {
  top3: DominanceEntry[];
  rankedElements: DominanceEntry[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// LINE META
// ═══════════════════════════════════════════════════════════════════════════════

const LINE_DISPLAY: Record<string, { element: string; description: string }> = {
  row_1:      { element: 'Purpose / Will Engine',            description: 'The directional force that organises ambition, mission, and sustained drive.' },
  row_2:      { element: 'Family / Attachment Field',        description: 'Governs emotional sensitivity, relational depth, and the need for belonging.' },
  row_3:      { element: 'Stability / Habits Foundation',    description: 'Controls consistency, endurance, and the capacity to maintain structure across time.' },
  col_1:      { element: 'Self-Esteem Core',                 description: 'Defines inner confidence, identity ownership, and the permission to occupy space.' },
  col_2:      { element: 'Work / Money Drive',               description: 'Powers execution, material achievement, and the translation of intention into output.' },
  col_3:      { element: 'Talent / Gifts Channel',           description: 'Carries natural abilities and the specific gifts that distinguish this person\'s contribution.' },
  diag_spirit:{ element: 'Spiritual / Intuitive Diagonal',   description: 'Accesses higher perception, meaning-making, and pattern recognition beyond the analytical.' },
  diag_carnal:{ element: 'Temperament / Magnetism Diagonal', description: 'Expresses physical presence, instinctual intelligence, and the body\'s power in the world.' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════════

export function detectDominanceHierarchy(lines: LineAnalysis[]): DominanceHierarchyResult {
  const entries: DominanceEntry[] = lines
    .map((line) => {
      const meta = LINE_DISPLAY[line.id];
      return {
        element: meta?.element ?? line.name,
        description: meta?.description ?? '',
        score: line.totalDigits,
      };
    })
    .sort((a, b) => b.score - a.score);

  return {
    top3: entries.slice(0, 3),
    rankedElements: entries,
  };
}
