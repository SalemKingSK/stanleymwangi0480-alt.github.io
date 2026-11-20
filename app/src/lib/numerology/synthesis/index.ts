/**
 * MYSTIQUE COMPASS — Synthesis Engine
 *
 * Master orchestrator for all cross-module synthesis analyses.
 * Integrates psychomatrix, astrology, and numerology data.
 */
import type {
  NumerologyData,
  AstroInsightOutput,
} from "@/components/profile-generator/types";
import { getDecan, type DecanResult } from "@/lib/astrology/decans";
import {
  getDoubleAnimal,
  type DoubleAnimalResult,
} from "@/lib/astrology/ba-zi-double-animal";
import { chineseZodiacYear } from "@/lib/astrology/chinese-calendar-math";
import {
  getBirthDayOfWeek,
  type DayOfWeekResult,
} from "@/lib/astrology/birth-day-of-week";
import {
  analyzeCombinedAbsence,
  type CombinedAbsenceResult,
} from "./combined-absence";
import {
  analyzeCellPairs,
  type CellPairResult,
} from "./cell-pair-interactions";
import {
  analyzeLineIntersections,
  type LineIntersectionResult,
  type LineTotals,
} from "./line-intersections";
import {
  getBirthDayAnalysis,
  type BirthDayResult,
} from "@/lib/numerology/birth-day-number";
import {
  calculateChallenges,
  type ChallengeResult,
} from "@/lib/numerology/challenge-numbers";
import {
  detectMasterNumbers,
  calculateMaturityNumber,
  type MasterNumberResult,
  type MaturityNumberResult,
} from "@/lib/numerology/master-numbers";
import {
  detectKarmicDebts,
  getLifePathNumber,
  calculateLifePathPeriods,
  type KarmicDebtResult,
  type LifePathResult,
  type LifePathPeriodResult,
} from "@/lib/numerology/karmic-life-path";
import {
  getPersonalMonth,
  getBirthMonthAnalysis,
  type PersonalMonthResult,
  type BirthMonthResult,
} from "@/lib/numerology/personal-month";
import {
  getSexagenaryAnalysis,
  getHeavenlyStem,
  getEarthlyBranch,
  type StemBranchResult,
  type HeavenlyStemResult,
  type EarthlyBranchResult,
} from "@/lib/astrology/sexagenary";
import {
  getPersonalYearAnalysis,
  getUniversalYear,
  type PersonalYearResult,
  type UniversalYearResult,
} from "@/lib/numerology/personal-year-full";
import {
  getZodiacRelationships,
  type ZodiacRelationshipResult,
} from "@/lib/astrology/zodiac-relationships";
import { analyzePlanes, type PlaneResult } from "./plane-analysis";
import {
  getKarmicLessons,
  type KarmicLessonResult,
} from "@/lib/numerology/karmic-lessons";
import { COMPOUND_NUMBER_MEANINGS } from "@/lib/numerology/data/compoundNumberMeanings";
import { calculatePsychomatrix } from "@/lib/numerology/data/psychomatrixData";
export type {
  DecanResult,
  DoubleAnimalResult,
  DayOfWeekResult,
  CombinedAbsenceResult,
  CellPairResult,
  LineIntersectionResult,
  BirthDayResult,
  ChallengeResult,
  MasterNumberResult,
  MaturityNumberResult,
  KarmicDebtResult,
  LifePathResult,
  LifePathPeriodResult,
  PersonalMonthResult,
  BirthMonthResult,
  StemBranchResult,
  HeavenlyStemResult,
  EarthlyBranchResult,
  PersonalYearResult,
  UniversalYearResult,
  ZodiacRelationshipResult,
  PlaneResult,
  KarmicLessonResult,
};
export interface SynthesisResult {
  decan: DecanResult | null;
  doubleAnimal: DoubleAnimalResult | null;
  birthDayOfWeek: DayOfWeekResult;
  combinedAbsences: CombinedAbsenceResult;
  cellPairs: CellPairResult;
  lineIntersections: LineIntersectionResult;
  birthDayAnalysis: BirthDayResult;
  challenges: ChallengeResult;
  masterNumbers: MasterNumberResult[];
  maturityNumber: MaturityNumberResult;
  lifePath: LifePathResult;
  lifePathPeriods: LifePathPeriodResult;
  karmicDebts: KarmicDebtResult[];
  personalMonth: PersonalMonthResult;
  birthMonthAnalysis: BirthMonthResult;
  sexagenary: StemBranchResult;
  heavenlyStem: HeavenlyStemResult;
  earthlyBranch: EarthlyBranchResult;
  personalYearAnalysis: PersonalYearResult;
  universalYear: UniversalYearResult;
  zodiacRelationships: ZodiacRelationshipResult;
  planeAnalysis: PlaneResult;
  karmicLessons: KarmicLessonResult;
  karmicFateNullMeaning: string | null;
  compoundPersonalizedInsight: string | null;
  personalYearCustomized: string | null;
  compoundEnrichedPY: string | null;
}
export function computeSynthesis(
  numerology: NumerologyData,
  insight: AstroInsightOutput,
): SynthesisResult {
  const {
    birthDay,
    birthMonth,
    birthYear,
    numberCounts,
    psycheNum,
    destinyNum,
    compoundNum,
    compoundMeaning,
    reducedCompoundNum,
    reducedCompoundMeaning,
    karmicFateNum,
  } = numerology;
  const counts = numberCountsToRecord(numberCounts);
  // The Psychomatrix grid (Alexandrov's Pythagorean square: birth digits + the
  // 4 working numbers) is a DIFFERENT digit set from the Lo Shu grid (birth
  // digits + compound number digits). Patterns that describe the Psychomatrix
  // — plane analysis, cell-pair interactions, and line/diagonal intersections —
  // must be matched against the Psychomatrix's own counts, or they'll report
  // configurations (e.g. "2 is absent") that contradict what's actually shown
  // on the Psychomatrix tab.
  const psychomatrixCounts = calculatePsychomatrix(
    birthDay,
    birthMonth,
    birthYear,
  ).counts;
  const decan = getDecan(birthDay, birthMonth);
  const doubleAnimal = getDoubleAnimal(birthDay, birthMonth, birthYear);
  const birthDayOfWeek = getBirthDayOfWeek(birthDay, birthMonth, birthYear);
  const birthDayAnalysis = getBirthDayAnalysis(birthDay);
  const challenges = calculateChallenges(birthDay, birthMonth, birthYear);
  const masterNumbers = detectMasterNumbers(
    psycheNum,
    destinyNum,
    compoundNum,
    reducedCompoundNum,
  );
  const maturityNumber = calculateMaturityNumber(psycheNum, destinyNum);
  const lifePath = getLifePathNumber(birthDay, birthMonth, birthYear);
  const lifePathPeriods = calculateLifePathPeriods(
    birthDay,
    birthMonth,
    birthYear,
  );
  const karmicDebts = detectKarmicDebts(
    psycheNum,
    destinyNum,
    lifePath.number,
    compoundNum,
    reducedCompoundNum,
    [],
    challenges?.challenges?.map((c) => c.number) ?? [],
  );
  const personalMonth = getPersonalMonth(birthDay, birthMonth);
  const birthMonthAnalysis = getBirthMonthAnalysis(birthMonth);
  // Chinese-cycle cards use the Lunar New Year year, like the zodiac card.
  const sexagenary = getSexagenaryAnalysis(birthYear, birthMonth, birthDay);
  const heavenlyStem = getHeavenlyStem(birthYear, birthMonth, birthDay);
  const earthlyBranch = getEarthlyBranch(birthYear, birthMonth, birthDay);
  const personalYearAnalysis = getPersonalYearAnalysis(
    birthDay,
    birthMonth,
    birthYear,
  );
  const universalYear = getUniversalYear();
  const zodiacRelationships = getZodiacRelationships(chineseZodiacYear(birthDay, birthMonth, birthYear));
  const planeAnalysis = analyzePlanes(psychomatrixCounts);
  const karmicLessons = getKarmicLessons(counts);
  const combinedAbsences = analyzeCombinedAbsence(psychomatrixCounts, {
    lifePath: lifePath.number,
    psycheNum,
    destinyNum,
    strongestCell: String(
      Object.entries(psychomatrixCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
        "?",
    ),
  });
  const cellPairs = analyzeCellPairs(psychomatrixCounts, {
    lifePath: lifePath.number,
    psycheNum,
  });
  const lineTotals: LineTotals = {
    row_1:
      (psychomatrixCounts[1] || 0) +
      (psychomatrixCounts[4] || 0) +
      (psychomatrixCounts[7] || 0),
    row_2:
      (psychomatrixCounts[2] || 0) +
      (psychomatrixCounts[5] || 0) +
      (psychomatrixCounts[8] || 0),
    row_3:
      (psychomatrixCounts[3] || 0) +
      (psychomatrixCounts[6] || 0) +
      (psychomatrixCounts[9] || 0),
    col_1:
      (psychomatrixCounts[1] || 0) +
      (psychomatrixCounts[2] || 0) +
      (psychomatrixCounts[3] || 0),
    col_2:
      (psychomatrixCounts[4] || 0) +
      (psychomatrixCounts[5] || 0) +
      (psychomatrixCounts[6] || 0),
    col_3:
      (psychomatrixCounts[7] || 0) +
      (psychomatrixCounts[8] || 0) +
      (psychomatrixCounts[9] || 0),
    diag_spirit:
      (psychomatrixCounts[1] || 0) +
      (psychomatrixCounts[5] || 0) +
      (psychomatrixCounts[9] || 0),
    diag_carnal:
      (psychomatrixCounts[3] || 0) +
      (psychomatrixCounts[5] || 0) +
      (psychomatrixCounts[7] || 0),
  };
  const lineIntersections = analyzeLineIntersections(lineTotals);
  const karmicFateNullMeaning =
    karmicFateNum === null
      ? getKarmicFateNullMeaning(
          psycheNum,
          destinyNum,
          compoundNum,
          psychomatrixCounts,
        )
      : null;
  const compoundPersonalizedInsight = getCompoundPersonalizedInsight(
    compoundNum,
    compoundMeaning,
    reducedCompoundNum,
    reducedCompoundMeaning,
    psychomatrixCounts,
    psycheNum,
    destinyNum,
  );
  const personalYearCustomized = getPersonalYearCustomized(
    personalYearAnalysis.year,
    psychomatrixCounts,
    psycheNum,
    destinyNum,
  );
  const compoundEnrichedPY = getCompoundEnrichedPersonalYear(
    personalYearAnalysis.rawYear,
  );
  return {
    decan,
    doubleAnimal,
    birthDayOfWeek,
    combinedAbsences,
    cellPairs,
    lineIntersections,
    birthDayAnalysis,
    challenges,
    masterNumbers,
    maturityNumber,
    lifePath,
    lifePathPeriods,
    karmicDebts,
    personalMonth,
    birthMonthAnalysis,
    sexagenary,
    heavenlyStem,
    earthlyBranch,
    personalYearAnalysis,
    universalYear,
    zodiacRelationships,
    planeAnalysis,
    karmicLessons,
    karmicFateNullMeaning,
    compoundPersonalizedInsight,
    personalYearCustomized,
    compoundEnrichedPY,
  };
}
function numberCountsToRecord(nc: {
  [key: string]: number;
}): Record<number, number> {
  const r: Record<number, number> = {};
  for (const [k, v] of Object.entries(nc)) r[Number(k)] = v;
  return r;
}
function getKarmicFateNullMeaning(
  psycheNum: number,
  destinyNum: number,
  compoundNum: number | null,
  counts: Record<number, number>,
): string {
  const has7 = Boolean(counts[7]);
  const has4 = Boolean(counts[4]);
  const has6 = Boolean(counts[6]);
  let base = `KARMIC FATE: NULL — No Predetermined Karmic Debt Number
In the system of karmic numerology, the absence of a Karmic Fate Number (calculated as the digit-sum of day + month + year, which for this birth yields a sum below 10) is itself a significant finding. It indicates that this soul has entered the present incarnation without a specific, numerically-predetermined karmic burden.
▸ Unlike those born with a Karmic Fate Number — who carry a quantifiable energetic debt from past lives that colours their entire existence — this configuration suggests one of two possibilities:
1. FRESH SLATE: The soul has either fully resolved its past-life debts in prior incarnations and enters this life unencumbered by predetermined karmic obligation. This is rare and indicates a soul of advanced evolution, one that has completed its remedial assignments and now incarnates with greater freedom of choice.
2. FREE AGENCY PROTOCOL: The soul is operating under a "free will emphasis" incarnation — meaning that rather than working off specific past-life debts, the primary lesson of this life is to exercise conscious choice and accept full responsibility for actions taken in the present. The karma being generated is not inherited but actively created, moment by moment.`;
  const additions: string[] = [];
  if (!has7) {
    additions.push(
      `\n▸ This null karmic fate configuration combined with the ABSENCE OF THE NUMBER 7 (Luck/Divine Interference) in the psychomatrix is particularly significant. With no inherited karmic debt AND no cosmic luck mechanism, the individual possesses a rare degree of self-determination. Nothing will be handed to them by fortune; nothing is owed to them by fate. Every achievement will be the direct result of conscious effort. Every failure will be their own responsibility. The universe says: "You do not need luck. You do not need debt-driven motivation. You have the capacity to choose, and your choices alone will write your story."`,
    );
  }
  if (!has4 && !has6) {
    additions.push(
      `\n▸ The combined absence of 4 (Health) and 6 (Labor) alongside a null karmic fate means the soul's physical vessel and its capacity for mundane work are not karmically "pre-loaded." This incarnation demands CONSCIOUS CULTIVATION of the body and work ethic — these will not come naturally because they are not being driven by past-life momentum.`,
    );
  }
  if (compoundNum && compoundNum >= 30) {
    additions.push(
      `\n▸ The presence of a compound number (${compoundNum}) containing zero alongside a null karmic fate reveals the zero's "pause" or "void" energy in the material realm — a slowing influence that creates the appearance of karmic delay without actually being karmic in origin. The universe is teaching patience through neutral circumstances rather than punitive debt.`,
    );
  }
  return base + additions.join("");
}
/**
 * Compute the raw unreduced Personal Year total (before single-digit reduction)
 * and look up its compound number meaning for enriched interpretation.
 */
function getCompoundEnrichedPersonalYear(rawYear: number): string | null {
  // rawYear is now passed in from getPersonalYearAnalysis() — the single
  // source of truth for the unreduced compound Personal Year total — rather
  // than being re-derived here with a separate (and previously buggy)
  // pre-reduce-each-component formula that could disagree with it.
  const compound = COMPOUND_NUMBER_MEANINGS[rawYear];
  if (!compound || rawYear <= 9) return null;
  const c = compound.split("\n")[0] || "";
  let intro = `\n\n═══════════════════════════════\nCOMPOUND LAYER: Your raw Personal Year calculation produced the unreduced number ${rawYear}. This number carries its own vibrational signature that enriches and personalizes the single-digit Personal Year meaning above.\n\n${c}\n${compound.split("\n").slice(1, 5).join("\n")}`;
  if (compound.length > intro.length + 50) {
    intro += "\n...\n" + compound.split("\n").slice(-3).join("\n");
  }
  return intro;
}
function getCompoundPersonalizedInsight(
  compoundNum: number | null,
  compoundMeaning: string | null,
  reducedCompoundNum: number | null,
  reducedCompoundMeaning: string | null,
  counts: Record<number, number>,
  psycheNum: number,
  destinyNum: number,
): string | null {
  if (!compoundNum) return null;
  const lines: string[] = [];
  lines.push(
    `COMPOUND NUMBER PERSONALIZED SYNTHESIS — ${compoundNum}${reducedCompoundNum ? ` (reduces through ${reducedCompoundNum})` : ""}\n\nThe compound number ${compoundNum} does not exist in isolation — it interacts dynamically with your number-matrix cell configuration, the psychic number (${psycheNum}), and the destiny number (${destinyNum}) to produce a unique expression pattern.`,
  );
  if (psycheNum === 8 && compoundNum === 39) {
    lines.push(
      `\n▸ PSYCHE 8 × COMPOUND 39: The Psychic Number 8 (Saturn — Ambition, Material Success) combined with Compound 39 (Jupiter influence with zero's slowing effect) creates a specific tension: the Saturnian drive for tangible achievement is constantly being slowed by the zero's void energy. This person FEELS the ambition of an 8 — the hunger for status, structure, and visible success — but experiences delays and circuitous paths that pure 8s do not. The zero forces philosophical reflection between ambition and achievement, ensuring that when success arrives, it is accompanied by genuine understanding rather than mere accumulation. The reduced compound 12 (Sun/Moon opposition) adds further complexity: the 8's desire for external authority (Sun/1 energy) is internally challenged by emotional fluidity (Moon/2 energy), creating a "reluctant sovereign" whose authority is earned through visible struggle.`,
    );
  }
  if (psycheNum === 3 && compoundNum === 39) {
    lines.push(
      `\n▸ PSYCHE 3 × COMPOUND 39: Both share Jupiterian energy, creating amplification. However, the zero in 39 tempers Jupiter's natural expansiveness — the usual 3 optimism and sociability is filtered through a lens of hard-won perspective. This person's philosophical nature is not naive but forged through difficulty.`,
    );
  }
  if (destinyNum === 3) {
    lines.push(
      `\n▸ DESTINY 3 × COMPOUND: The Destiny Number 3 amplifies the compound number's influence in the life path. When combined with compound numbers containing zero, the life path involves learning to EXPRESS the hard-won philosophical insights gained through the zero's delays. The compound number's specific energy becomes the "flavour" of their communication.`,
    );
  }
  const has9_3plus = (counts[9] || 0) >= 3;
  const has1_2 = (counts[1] || 0) === 2;
  const has5_1 = (counts[5] || 0) === 1;
  if (has9_3plus && reducedCompoundNum === 12) {
    lines.push(
      `\n▸ HIGH MEMORY (999+) × COMPOUND 12 (SUN/MOON CONFLICT): With clairvoyant-level memory and the Sun-Moon opposition, the individual's mind becomes a battlefield between crystalline clarity (Sun/1) and emotional memory (Moon/2). They remember EVERYTHING — not just facts but the emotional charge attached to each memory. This makes them exceptional at pattern recognition across emotional and logical domains, but also prone to being haunted by past decisions.`,
    );
  }
  if (has1_2 && has5_1 && compoundNum >= 30) {
    lines.push(
      `\n▸ "11" PERSONALITY × WEAK LOGIC (5) × SLOWING COMPOUND: The gentle "11" character type, with only a single 5, combined with a compound number containing zero, produces an individual whose natural agreeableness becomes a liability. The zero's slowing influence means the consequences of misalignments unfold gradually, often going unnoticed until the cumulative weight becomes undeniable.`,
    );
  }
  return lines.join("\n");
}
function getPersonalYearCustomized(
  py: number,
  counts: Record<number, number>,
  psycheNum: number,
  destinyNum: number,
): string {
  // py is now passed in from getPersonalYearAnalysis() — the single source
  // of truth for the final reduced Personal Year — rather than being
  // re-derived here with a separate (and previously buggy) formula that
  // could disagree with it.
  const baseMeanings: Record<number, string> = {
    1: "Personal Year 1 — The Initiatory Gate. A year of new beginnings, seed-planting, and independent action.",
    2: "Personal Year 2 — The Relational Field. A year of partnership, patience, and emotional deepening.",
    3: "Personal Year 3 — Creative Bloom. A year of self-expression, joy, and social expansion.",
    4: "Personal Year 4 — Foundation Cycle. A year of hard work, structure, and limitation willingly embraced.",
    5: "Personal Year 5 — Freedom & Flux. A year of change, adventure, and unexpected opportunity.",
    6: "Personal Year 6 — Heart & Hearth. A year of responsibility, service, and domestic deepening.",
    7: "Personal Year 7 — Spiritual Retreat. A year of introspection, study, and solitude.",
    8: "Personal Year 8 — Power & Harvest. A year of material achievement, authority, and karmic return.",
    9: "Personal Year 9 — Great Completion. A year of endings, release, and transformation.",
    11: "Personal Year 11 — The High-Voltage Gate. A master year of intuitive illumination, heightened nervous sensitivity, and visionary opportunity — the 2's partnership theme raised to a spiritual pitch.",
    22: "Personal Year 22 — The Master Builder's Gate. A master year for turning a big vision into concrete, large-scale reality — the 4's foundation theme raised to an architectural scale.",
    33: "Personal Year 33 — The Master Teacher's Gate. A master year of high-responsibility, healing-oriented service — the 6's domestic-care theme raised to a universal, teaching register.",
  };
  let text = `PERSONAL YEAR ${py} — CUSTOMIZED ANALYSIS\n\n${baseMeanings[py] || `Personal Year ${py}`}\n\nThe generic meaning above is universal. Below is how YOUR number-matrix configuration modifies this year's energy:\n`;
  const row3 = (counts[3] || 0) + (counts[6] || 0) + (counts[9] || 0);
  const col1 = (counts[1] || 0) + (counts[2] || 0) + (counts[3] || 0);
  const diagSpirit = (counts[1] || 0) + (counts[5] || 0) + (counts[9] || 0);
  const has4 = !!counts[4],
    has6 = !!counts[6],
    has7 = !!counts[7];
  const has9_3 = (counts[9] || 0) >= 3,
    has3_2 = (counts[3] || 0) >= 2,
    has5 = (counts[5] || 0) === 1;
  const add: string[] = [];
  // ── PERSONAL YEAR 1 ──
  if (py === 1) {
    if (!has4 && !has6 && !has7)
      add.push(
        `▸ PERSONAL YEAR 1 × SELF-FORGED CONFIGURATION: With no Safety/Health digits present, most people can afford to be impulsive in a Year 1 — luck catches their mistakes, health absorbs their excesses. You have none of these safety nets. Your Year 1 is about DELIBERATE, calculated beginnings. Your initiatives will be harder to launch but impossible to derail — built with intention rather than fortune.`,
      );
    if (has4 && has6)
      add.push(
        `▸ PERSONAL YEAR 1 × BUILDER'S LAUNCHPAD: With both Foundation (4) and Labor (6) present, your Year 1 begins from a fortified position unlike most. Your new initiatives have the rare advantage of starting with solid ground already beneath them. Use this — not to over-plan and delay, but to build systematically from day one. What others spend their Year 4 consolidating, you can solidify from the start.`,
      );
    if ((counts[1] || 0) >= 3)
      add.push(
        `▸ PERSONAL YEAR 1 × TRIPLE-1 INTENSITY: With three or more 1s in your matrix, the Year 1's independent energy is AMPLIFIED to the point of combustibility. The danger is steamrolling over others while insisting you're "just being decisive." Channel the triple-1 into ONE initiative — not three. Singular focus transforms this intensity from destructive to unstoppable.`,
      );
    if (!has4)
      add.push(
        `▸ PERSONAL YEAR 1 × NO FOUNDATION DIGIT: Without the 4 (Safety/Foundation), your Year 1 beginnings lack the structural memory that makes initiatives durable. Counter this by establishing external structures — accountability partners, scheduled reviews, written plans. What your matrix doesn't provide naturally, conscious systems must supply.`,
      );
  }
  // ── PERSONAL YEAR 2 ──
  if (py === 2) {
    if ((counts[2] || 0) === 0)
      add.push(
        `▸ PERSONAL YEAR 2 × ABSENT 2 (NO BIOENERGY): A Personal Year 2 demands patience, diplomacy, and emotional attunement — precisely the capacities your matrix is NOT wired for with zero 2s. The year's relational demands will feel foreign, draining, and at times infuriating. Your task is not to become a different person but to develop the muscles of patience and receptivity AS CONSCIOUS SKILLS. Treat this year as emotional training — not your natural state, but a capacity worth building.`,
      );
    if ((counts[2] || 0) >= 3)
      add.push(
        `▸ PERSONAL YEAR 2 × OVERLOADED 2 (BIOENERGY FLOOD): With three or more 2s, your Year 2 energy is intensified to the point of energetic overwhelm. You will absorb others' emotional states involuntarily, sensing tensions before they're spoken. Protect your energy field — daily grounding practices are not optional this year. Solitude is medicine, not avoidance.`,
      );
    if ((counts[7] || 0) >= 2)
      add.push(
        `▸ PERSONAL YEAR 2 × STRONG LUCK (7s PRESENT): Your Year 2 patience is being UNDERWRITTEN by active luck. The universe is not just asking you to wait — it's arranging circumstances while you wait. Trust the invisible work. The delays that seem pointless to you are the scaffolding of outcomes you cannot yet see.`,
      );
    if ((counts[8] || 0) === 0)
      add.push(
        `▸ PERSONAL YEAR 2 × ABSENT 8 (NO OBLIGATION INSTINCT): The Year 2's relational demands may feel burdensome because your matrix lacks the natural sense of duty (8) that makes care feel automatic. You're not cold — you're differently wired. Approach relationships this year with conscious intention rather than expecting instinct to carry you.`,
      );
  }
  // ── PERSONAL YEAR 3 ──
  if (py === 3) {
    if (has3_2 && has9_3)
      add.push(
        `▸ PERSONAL YEAR 3 × PATTERN ENGINE: Your "Pattern Engine" (multiple 3s and 9s) makes this year's creative potential extraordinarily amplified. The shadow is SCATTER — you could spend the entire year connecting dots without ever drawing a picture. Choose ONE creative project as the year's primary vessel. Let all cross-domain insights FLOW INTO that project.`,
      );
    if ((counts[3] || 0) === 0)
      add.push(
        `▸ PERSONAL YEAR 3 × ABSENT 3 (NO CREATIVE INSTINCT): A Year 3 without the 3 in your matrix is unusual — the universe is asking you to EXPRESS when expression doesn't come naturally. This isn't a flaw. It means your creativity this year will be CONSTRUCTED rather than spontaneous — and constructed creativity, like architecture, can achieve forms that spontaneous creativity cannot. Plan your expression. Schedule it. Build it deliberately.`,
      );
    if ((counts[5] || 0) === 0)
      add.push(
        `▸ PERSONAL YEAR 3 × ABSENT 5 (LOGIC VOID): With no 5 in your matrix, the Year 3's expressive energy may bypass logical structure entirely. Your creativity this year will be intuitive, non-linear, and possibly confusing to others. That's not wrong — it's DIFFERENT. Communicate in your native mode and translate afterward, not before.`,
      );
  }
  // ── PERSONAL YEAR 4 ──
  if (py === 4) {
    if ((counts[4] || 0) === 0)
      add.push(
        `▸ PERSONAL YEAR 4 × ABSENT 4 (NO FOUNDATION): A Year 4 without the 4 in your matrix is the universe's most pointed curriculum. The year demands STRUCTURE, DISCIPLINE, and HARD WORK — exactly what your matrix is not naturally wired for. This is not punishment; it's remedial education. The soul that avoided discipline in previous cycles must now learn it consciously. Build ONE system and maintain it for the entire year. One is enough.`,
      );
    if ((counts[4] || 0) >= 2)
      add.push(
        `▸ PERSONAL YEAR 4 × DOUBLE 4 (FOUNDATION REINFORCED): With multiple 4s, your Year 4 is not a burden but a HOMECOMING. The structure and discipline the year demands is precisely what your matrix already provides. This is less a year of struggle and more a year of optimization — refining systems that already work, strengthening foundations that already hold. The danger is over-engineering: don't fix what isn't broken.`,
      );
    if (!has6)
      add.push(
        `▸ PERSONAL YEAR 4 × NO LABOR INSTINCT (6 ABSENT): Without the 6's natural work drive, the Year 4's demand for sustained effort requires CONSCIOUS FUEL. Your motivation must be externally sourced — goals written down, deadlines enforced by others, accountability that doesn't depend on internal drive. This doesn't make you weak; it makes you honest about your wiring.`,
      );
    if ((counts[7] || 0) === 0 && (counts[4] || 0) >= 2)
      add.push(
        `▸ PERSONAL YEAR 4 × DOUBLE 4 WITHOUT LUCK: Multiple 4s without 7s means your foundations are built ENTIRELY through effort — nothing arrives by chance. This year's hard work is the only path. The compensation: what you build will have no hidden structural weaknesses. Foundations built without luck cannot be undermined by luck's withdrawal.`,
      );
  }
  // ── PERSONAL YEAR 5 ──
  if (py === 5) {
    if ((counts[5] || 0) === 0)
      add.push(
        `▸ PERSONAL YEAR 5 × LOGIC VOID: A Year 5 without the 5 in your matrix creates a specific challenge: change is demanded but your internal compass for navigating change is absent. You will feel the impulse toward freedom without the logical framework to evaluate which freedoms are genuine and which are escapes. Your practice: before every major change this year, write down the REASON. If you cannot articulate it, the change is reaction, not liberation.`,
      );
    if ((counts[5] || 0) >= 2)
      add.push(
        `▸ PERSONAL YEAR 5 × AMPLIFIED LOGIC: With multiple 5s, the Year 5's change energy is cognitively SUPERCHARGED. You won't just experience change — you'll analyze it, strategize around it, and potentially overthink yourself out of necessary spontaneity. The mind is a map; this year, you need to walk the territory, not just study the map.`,
      );
    if ((counts[1] || 0) >= 3 && (counts[8] || 0) >= 2)
      add.push(
        `▸ PERSONAL YEAR 5 × POWER CONFIGURATION: With strong 1s and 8s, the Year 5's freedom impulse will collide with your natural drive toward authority. The question this year is not "what should I change?" but "what am I willing to be responsible for after I change it?" Your changes have CONSEQUENCES beyond the personal — you lead others whether you intend to or not.`,
      );
    if (!has7 && (counts[7] || 0) === 0)
      add.push(
        `▸ PERSONAL YEAR 5 × NO LUCK SAFETY NET: Without 7s, the Year 5's changes have no cosmic cushion. When you leap (and this year demands leaps), you land entirely on your own preparedness. Calculate your risks. The universe will not catch you this year — but it will respect you for landing on your feet.`,
      );
  }
  // ── PERSONAL YEAR 6 ──
  if (py === 6) {
    if ((counts[6] || 0) === 0)
      add.push(
        `▸ PERSONAL YEAR 6 × NO LABOR INSTINCT: A Year 6 without the 6 in your matrix means the year's demand for SERVICE, CARE, and RESPONSIBILITY lands on a matrix not naturally wired for sustained caregiving. This doesn't make you selfish — it makes care a conscious choice rather than an automatic reflex. The care you give this year, because it's chosen rather than compelled, will be more genuine than the reflexive care of those with strong 6s.`,
      );
    if ((counts[6] || 0) >= 3)
      add.push(
        `▸ PERSONAL YEAR 6 × OVERLOADED 6 (MARTYRDOM RISK): With three or more 6s, the Year 6's caregiving energy risks becoming self-destruction. Your matrix ALREADY pours itself out for others; this year amplifies that impulse to dangerous levels. Your primary spiritual practice this year is RECEIVING. Accept help. Rest. The world's needs will survive your temporary withdrawal.`,
      );
    if ((counts[2] || 0) >= 2)
      add.push(
        `▸ PERSONAL YEAR 6 × STRONG BIOENERGY: With healthy 2 energy, your Year 6 caregiving is POWERED rather than draining. You give from abundance, not from obligation. This is the ideal Year 6 configuration — the capacity to nourish others without depleting yourself.`,
      );
    if ((counts[4] || 0) === 0 && (counts[6] || 0) >= 2)
      add.push(
        `▸ PERSONAL YEAR 6 × DOUBLE 6 WITHOUT 4: Labor without Foundation means you'll work tirelessly for others this year but struggle to create SYSTEMS that make your care sustainable. You'll pour yourself out and wonder why the vessel is never refilled. Build one self-care routine and defend it. Your capacity to serve is proportional to your capacity to rest.`,
      );
  }
  // ── PERSONAL YEAR 7 ──
  if (py === 7) {
    if (has5 && (counts[5] || 0) <= 1)
      add.push(
        `▸ PERSONAL YEAR 7 × WEAK LOGIC: The Year 7 calls for introspection, but your single 5 means insights will arrive as feelings and impressions rather than clear, articulable truths. Keep a journal. Do not demand clarity. Demand presence. The clarity will arrive in Year 8.`,
      );
    if ((counts[7] || 0) >= 2)
      add.push(
        `▸ PERSONAL YEAR 7 × AMPLIFIED LUCK: Multiple 7s make your Year 7 unusually POTENT for spiritual breakthrough. The luck function is not random fortune but synchronicity — meaningful coincidences that guide you toward insight. Pay attention to what repeats. The universe speaks in patterns, not proclamations.`,
      );
    if ((counts[7] || 0) === 0)
      add.push(
        `▸ PERSONAL YEAR 7 × NO LUCK (SELF-GUIDED DEPTH): Without 7s, the Year 7's spiritual retreat must be entirely self-directed. No cosmic winks, no convenient synchronicities, no lucky encounters with the right teacher. You must CHOOSE depth and pursue it deliberately. The compensation: what you discover will be genuinely yours, not gifted. Earned wisdom lasts longer than received wisdom.`,
      );
    if ((counts[9] || 0) >= 3)
      add.push(
        `▸ PERSONAL YEAR 7 × CLAIRVOYANT MEMORY: With clairvoyant-level 9s, your Year 7 introspection will access memories and patterns you didn't know you had stored. The spiritual retreat may become uncomfortably deep — you'll see things about yourself you've avoided seeing. Don't flee the discomfort. The 9s give you the CAPACITY to integrate what you uncover.`,
      );
  }
  // ── PERSONAL YEAR 8 ──
  if (py === 8) {
    if ((counts[8] || 0) === 0)
      add.push(
        `▸ PERSONAL YEAR 8 × ABSENT 8 (POWER VOID): A Year 8 without the 8 in your matrix is the universe handing you authority when you have no natural instinct for wielding it. Power will be offered; you must learn to hold it as you go. The danger is either rejecting legitimate authority from discomfort, or wielding it clumsily from inexperience. Accept the power AND accept the learning curve.`,
      );
    if ((counts[8] || 0) >= 3)
      add.push(
        `▸ PERSONAL YEAR 8 × TRIPLE-8 INTENSITY: With three or more 8s, the Year 8's power energy is operating at KARMIC SCALE. This year's harvest is not ordinary — what returns to you (good or bad) will be multiplied. If you have been ethical, expect extraordinary reward. If you have cut corners, expect extraordinary correction. The triple-8 makes this the most significant material year of your current 9-year cycle.`,
      );
    if ((counts[7] || 0) === 0 && (counts[8] || 0) >= 2)
      add.push(
        `▸ PERSONAL YEAR 8 × DOUBLE 8 WITHOUT LUCK: Power without Luck means your Year 8 harvest is PURELY EARNED — nothing arrives by fortune, everything arrives by merit. This is both sobering and reassuring: you won't receive unearned windfalls, but you also won't experience the random reversals that luck-dependent people suffer. What you receive, you DESERVE.`,
      );
    if ((counts[1] || 0) >= 2 && !has4)
      add.push(
        `▸ PERSONAL YEAR 8 × LEADERSHIP WITHOUT FOUNDATION: Multiple 1s without the 4's stabilizing influence means your Year 8 authority may manifest as DOMINATION rather than LEADERSHIP. The ego (1) has power (8) without the grounding (4) that makes authority sustainable. Lead through service this year — deliberately subordinate your will to a purpose larger than yourself.`,
      );
  }
  // ── PERSONAL YEAR 9 ──
  if (py === 9) {
    if (row3 >= 6)
      add.push(
        `▸ PERSONAL YEAR 9 × OVERLOADED STABILITY ROW: The Year 9 demands RELEASE and ENDINGS. However, your Stability Row is overloaded (${row3} digits), indicating intense attachment to routines and material security. The cosmos asks you to let go; your matrix is wired to CLING. The friction manifests as forced endings unless you proactively identify and close completed cycles. Voluntary release will feel like amputation to your overloaded Row 3, but it is the difference between surgery and traumatic injury.`,
      );
    if (col1 >= 6)
      add.push(
        `▸ PERSONAL YEAR 9 × OVERLOADED SELF-ESTEEM: With ${col1} digits in Column 1, your self-image is heavily defended. The Year 9 demands that identity structures be surrendered too. Who are you WITHOUT the achievements, the persona, the carefully curated image? The dissolution of outgrown identity is not destruction — it is liberation.`,
      );
    if (diagSpirit >= 6)
      add.push(
        `▸ PERSONAL YEAR 9 × OVERLOADED SPIRITUALITY: There is a risk of SPIRITUAL BYPASSING — using "higher purpose" language to avoid the messy, practical work of ending things properly. Year 9 with high spiritual energy is powerful for genuine completion — but only if grounded in practical action.`,
      );
    if ((counts[9] || 0) >= 3)
      add.push(
        `▸ PERSONAL YEAR 9 × CLAIRVOYANT COMPLETION: With clairvoyant-level 9s, your Year 9 endings will be accompanied by unusually clear VISION of what comes next. Most people complete in blindness, releasing without knowing what replaces what they've lost. You will SEE the shape of the next cycle before this one fully closes. Trust the vision, but don't rush toward it — completion has its own pace.`,
      );
    if (
      (counts[3] || 0) === 0 &&
      (counts[6] || 0) === 0 &&
      (counts[9] || 0) === 0
    )
      add.push(
        `▸ PERSONAL YEAR 9 × EMPTY STABILITY ROW: With NO digits on the Stability Row (3-6-9), the Year 9's demand for completion operates without the usual resistance of attachment. You may find endings surprisingly easy — perhaps TOO easy. The shadow is premature release: letting go of things that still have value because completion feels natural rather than difficult. Discern carefully: not everything that CAN end SHOULD end.`,
      );
  }
  text += add.length
    ? add.join("\n\n")
    : "No specific number-matrix modifiers were detected for this Personal Year configuration.";
  return text;
}