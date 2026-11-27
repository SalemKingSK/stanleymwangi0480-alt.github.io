/**
 * Everything the Curriculum needs to know about one birthday: the same
 * reading objects the results screen renders (insight, numerology, synthesis)
 * plus the extra calculations individual sections make for themselves.
 * Field variants are read off this, so a case study's syllabus always matches
 * what its reading really shows.
 */
import type { AstroInsightOutput, NumerologyData } from "@/components/profile-generator/types";
import type { SynthesisResult } from "@/lib/numerology/synthesis";
import { calculatePsychomatrix, type PsychomatrixResult } from "@/lib/numerology/data/psychomatrixData";
import {
  createPersonalizedPsychomatrixReport,
  type PersonalizedPsychomatrixReport,
} from "@/lib/numerology/psychomatrix-synthesis";
import { detectContradictions, type Contradiction } from "@/lib/numerology/synthesis/contradiction-engine";
import { generateRecommendations, type Recommendation } from "@/lib/numerology/synthesis/recommendation-engine";
import {
  detectDominanceHierarchy,
  type DominanceHierarchyResult,
} from "@/lib/numerology/synthesis/dominance-hierarchy-engine";
import { calculateDynamicPotentials } from "@/lib/numerology/dynamic-engine";
import { detectTransitions, type DetectedTransition } from "@/lib/transitions/engine";
import { appNow } from "@/lib/time/focus";

export interface BirthInput {
  name: string;
  day: number;
  month: number;
  year: number;
  gender: string;
}

export interface Chart extends BirthInput {
  insight: AstroInsightOutput;
  numerology: NumerologyData;
  synthesis: SynthesisResult;
  psy: PsychomatrixResult;
  pmxReport: PersonalizedPsychomatrixReport | null;
  contradictions: Contradiction[];
  recommendations: Recommendation[];
  dominance: DominanceHierarchyResult | null;
  dynamic: ReturnType<typeof calculateDynamicPotentials>;
  transitions: DetectedTransition[];
}

/** Same Personal Year the Psychomatrix tab uses for its transitions. */
function psychomatrixPersonalYear(d: number, m: number): number {
  const y = appNow().getFullYear();
  let s = d + m + String(y).split("").reduce((a, c) => a + +c, 0);
  while (s > 9 && s !== 11 && s !== 22 && s !== 33) s = String(s).split("").reduce((a, c) => a + +c, 0);
  return s;
}

/** Build a chart from reading objects that were already computed. */
export function chartFrom(
  input: BirthInput,
  insight: AstroInsightOutput,
  numerology: NumerologyData,
  synthesis: SynthesisResult,
): Chart {
  const { day, month, year } = input;
  const psy = calculatePsychomatrix(day, month, year);
  let pmxReport: PersonalizedPsychomatrixReport | null = null;
  try {
    pmxReport = createPersonalizedPsychomatrixReport(psy);
  } catch {
    pmxReport = null;
  }
  const contradictions = pmxReport ? detectContradictions(pmxReport.lines, pmxReport.intersections) : [];
  const recommendations = pmxReport ? generateRecommendations(pmxReport, numerology, contradictions) : [];
  const dominance = pmxReport ? detectDominanceHierarchy(pmxReport.lines) : null;
  const dynamic = calculateDynamicPotentials(year, psy.counts);
  let transitions: DetectedTransition[] = [];
  try {
    transitions = detectTransitions({
      counts: psy.counts,
      personalYear: psychomatrixPersonalYear(day, month),
      birthDay: day,
      birthMonth: month,
      birthYear: year,
      gender: (input.gender as "male" | "female") || "male",
    });
  } catch {
    transitions = [];
  }
  return {
    ...input,
    insight,
    numerology,
    synthesis,
    psy,
    pmxReport,
    contradictions,
    recommendations,
    dominance,
    dynamic,
    transitions,
  };
}

/** Compute a chart from scratch (used by the plan builder and tests). */
export async function buildChart(input: BirthInput): Promise<Chart> {
  const [{ getAstroInsight }, { generateLoShuData }, { computeSynthesis }] = await Promise.all([
    import("@/lib/astrology"),
    import("@/lib/numerology"),
    import("@/lib/numerology/synthesis"),
  ]);
  const insight = await getAstroInsight(input);
  const numerology = generateLoShuData(input) as unknown as NumerologyData;
  const synthesis = computeSynthesis(numerology, insight);
  return chartFrom(input, insight, numerology, synthesis);
}
