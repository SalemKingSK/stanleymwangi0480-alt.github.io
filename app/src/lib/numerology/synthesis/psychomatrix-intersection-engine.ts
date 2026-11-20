/**
 * @fileoverview PSYCHOMATRIX INTERSECTION ENGINE
 * Type definitions for line intersection analysis used by the contradiction engine.
 */

export interface LineIntersection {
  id: string;
  lines: string[];
  type: 'convergence' | 'opposition' | 'neutral';
  name?: string;
  condition?: string;
  interpretation?: string;
}
