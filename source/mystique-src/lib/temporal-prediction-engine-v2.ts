/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║       MYSTIQUE COMPASS — TEMPORAL PREDICTION ENGINE v2.0                    ║
 * ║       Pure deterministic synthesis — ZERO external APIs                     ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  14-LAYER SYNTHESIS ENGINE                                                  ║
 * ║                                                                             ║
 * ║  Layer  1 — Personal Year (annual rhythm)                                   ║
 * ║  Layer  2 — Personal Month (sub-monthly accent)                             ║
 * ║  Layer  3 — Active Pinnacle (long-arc life theme)                           ║
 * ║  Layer  4 — Active Challenge (resistance pattern)                           ║
 * ║  Layer  5 — Cheiro Climacteric Years (destiny-altering ages)                ║
 * ║  Layer  6 — Cheiro Lucky Dates/Days (favorable date intelligence)           ║
 * ║  Layer  7 — Lo Shu Dynamic Activation (grid resonance this year)            ║
 * ║  Layer  8 — Missing Numbers Forecast (annual fill of karmic void)           ║
 * ║  Layer  9 — Repeated Numbers Amplifier (birth-grid concentration)           ║
 * ║  Layer 10 — Karmic Debt Trigger Detection                                   ║
 * ║  Layer 11 — Pinnacle Transition Radar (proximity alert ±18 months)          ║
 * ║  Layer 12 — Probability Scoring (5-domain confidence index)                 ║
 * ║  Layer 13 — Daily Prediction Engine (Personal Day forecast)                 ║
 * ║  Layer 14 — Contradiction Engine (conflicting signal analysis)              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * USAGE:
 *   import { generateTemporalPrediction, generateDailyForecast,
 *            generateMonthlyBreakdown, generateMultiYearForecast }
 *     from '@/lib/temporal-prediction-engine-v2';
 *
 *   const prediction = generateTemporalPrediction(day, month, year);
 *   const today      = generateDailyForecast(day, month, year); // no date arg = today
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ProbabilityScores {
  careerMomentum: number;       // 0-100
  financialGrowth: number;
  relationshipStability: number;
  healthDiscipline: number;
  spiritualGrowth: number;
  overallYear: number;
}

export interface CheiroDayIntelligence {
  luckyDaysOfWeek: string[];
  luckyDatesThisMonth: number[];
  nextPowerWindow: string;        // e.g. "June 8 (Sunday — your strongest date)"
  avoidDates: string;
  strongPeriod: string | null;    // Cheiro's solar period for this psychic number
}

export interface LoShuActivation {
  activatedNumbers: number[];     // which numbers PY resonates with
  strengthenedArrows: string[];   // Lo Shu arrows that gain power this year
  weakenedArrows: string[];       // arrows that face unusual pressure
  gridNarrative: string;
}

export interface MissingNumberForecast {
  missingNumbers: number[];
  activatedMissing: number[];     // missing numbers whose void is "filled" by PY
  narrative: string;
}

export interface RepeatedNumberAmplifier {
  dominantNumber: number | null;
  dominantCount: number;
  amplificationNote: string;
}

export interface KarmicTrigger {
  debtNumber: 13 | 14 | 16 | 19 | null;
  isTriggered: boolean;
  triggerExplanation: string;
}

export interface PinnacleTransitionRadar {
  monthsUntilTransition: number | null;
  isInTransitionWindow: boolean;   // within 18 months
  nextPinnacleNumber: number | null;
  transitionNarrative: string;
}

export interface Contradiction {
  signal1: string;
  signal2: string;
  tension: string;
  resolution: string;
}

export interface DailyForecast {
  date: string;
  personalDay: number;
  universalDay: number;
  dayOfWeek: string;
  isLuckyDay: boolean;
  isLuckyDate: boolean;
  isPowerWindow: boolean;         // lucky day + lucky date combined
  avoidMajorDecisions: boolean;
  focus: string;
  shortNarrative: string;
  notificationAlert: string | null;  // push-alert worthy event?
}

export interface TemporalPredictionV2 {
  meta: {
    birthDate: string;
    currentYear: number;
    currentMonth: number;
    currentAge: number;
    personalYear: number;
    personalMonth: number;
    universalYear: number;
    lifePath: number;
    psychicNumber: number;
    compoundBirthSum: number;
    activePinnacleNumber: number;
    activePinnacleStage: 1 | 2 | 3 | 4;
    activePinnacleAgeRange: string;
    activeChallenge: number;
  };

  // ── Core forecast ──────────────────────────────────────────────────────────
  headline: string;
  domains: {
    career: string;
    relationships: string;
    finances: string;
    health: string;
    spirituality: string;
  };

  // ── Enrichment layers ──────────────────────────────────────────────────────
  probabilityScores: ProbabilityScores;
  cheiroDayIntelligence: CheiroDayIntelligence;
  loShuActivation: LoShuActivation;
  missingNumberForecast: MissingNumberForecast;
  repeatedNumberAmplifier: RepeatedNumberAmplifier;
  karmicTrigger: KarmicTrigger;
  pinnacleTransitionRadar: PinnacleTransitionRadar;
  contradictions: Contradiction[];

  // ── Strategic outputs ──────────────────────────────────────────────────────
  tensionSignature: { forceA: string; forceB: string; nature: 'amplifying' | 'friction' | 'neutral'; interpretation: string };
  windowOfOpportunity: { monthRange: string; personalMonths: number[]; reason: string };
  cautionFlag: { risk: string; mitigation: string };
  threeYearArc: {
    thisYear: { py: number; title: string; one_line: string };
    nextYear: { py: number; title: string; one_line: string };
    yearAfter: { py: number; title: string; one_line: string };
    arcSummary: string;
  };

  // ── Cheiro climacteric overlay ─────────────────────────────────────────────
  isClimatericYear: boolean;
  climatericNote: string | null;

  // ── Today's intelligence (when called for today) ───────────────────────────
  todayForecast: DailyForecast;
}

// The dual-essence synthesis (direct + classic compound pair, polarity, and
// historical calibration) is the app's meaning layer. The temporal engine
// imports it so the numeric scores can never contradict the texts they are
// displayed next to: a 'predominantly cautionary' year cannot advertise
// high career momentum, and a 'predominantly constructive' year cannot
// score as a retreat.
import { buildPersonalYearDualEssenceSynthesis } from "@/lib/numerology/personal-year-synthesis";
import { lookupCompound } from "@/lib/numerology/chaldean-pyn-compounds";
import { computeRawPersonalYear, computeRawPersonalYearClassic } from "@/lib/numerology/personal-year-full";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function reduceNum(n: number): number {
  let v = Math.abs(n);
  // Master-number-safe: stop reducing once an intermediate value lands on
  // 11, 22, or 33, instead of collapsing straight through it. This matters
  // for calcLifePath below too — Life Path 11/22/33 are standard master
  // numbers and shouldn't be silently destroyed by over-reduction.
  while (v > 9 && v !== 11 && v !== 22 && v !== 33) v = String(v).split('').reduce((a, d) => a + +d, 0);
  return v;
}
function digitSum(n: number) { return String(Math.abs(n)).split('').reduce((a, d) => a + +d, 0); }
function reduceOnce(n: number) { return String(Math.abs(n)).split('').reduce((a, d) => a + +d, 0); }

// ─────────────────────────────────────────────────────────────────────────────
// CORE CALCULATIONS
// ─────────────────────────────────────────────────────────────────────────────

function calcLifePath(d: number, m: number, y: number) {
  return reduceNum(reduceNum(d) + reduceNum(m) + reduceNum(digitSum(y)));
}
function calcPsychicNumber(d: number) { return reduceNum(d); }
function calcPersonalYear(d: number, m: number, targetYear: number) {
  // Day and month go in AS-IS (unreduced) — only the target year gets
  // digit-summed, since a 4-digit calendar year isn't itself a birth
  // component to preserve in compound form. See personal-year-full.ts's
  // computeRawPersonalYear for the shared canonical version of this.
  return reduceNum(d + m + digitSum(targetYear));
}
function calcPersonalMonth(py: number, cm: number) { return reduceNum(py + cm); }
function calcPersonalDay(py: number, cm: number, cd: number) { return reduceNum(py + cm + cd); }
function calcUniversalYear(y: number) { return reduceNum(digitSum(y)); }
function calcUniversalDay(y: number, m: number, d: number) { return reduceNum(digitSum(y) + m + d); }
function calcCompoundBirthSum(d: number, m: number, y: number) {
  return digitSum(d) + digitSum(m) + digitSum(y);
}

interface PinData {
  p1: number; p2: number; p3: number; p4: number;
  p1end: number; p2end: number; p3end: number;
  c1: number; c2: number; c3: number; c4: number;
  lp: number;
}
function calcPinnacles(d: number, m: number, y: number): PinData {
  const md = reduceNum(d), mm = reduceNum(m), my = reduceNum(digitSum(y));
  const lp = reduceNum(md + mm + my);
  const p1 = reduceNum(mm + md), p2 = reduceNum(md + my);
  const p3 = reduceNum(p1 + p2), p4 = reduceNum(mm + my);
  const p1end = 36 - lp;
  // Challenges reduce FULLY (no master numbers) in the tradition, so a value
  // like |3 - 22| = 19 becomes 1+9 -> 10 -> 1. This keeps every challenge in
  // the 0-9 range the challenge texts are written for (previously a master
  // birth-year digit sum could produce 10, 11, 13, 19, 22... and render as
  // "(no text)" in the UI).
  const reduceChallenge = (n: number) => {
    let v = Math.abs(n);
    while (v > 9) v = String(v).split('').reduce((a, d) => a + +d, 0);
    return v;
  };
  const c1 = reduceChallenge(mm - md), c2 = reduceChallenge(md - my);
  const c3 = reduceChallenge(c1 - c2), c4 = reduceChallenge(mm - my);
  return { p1, p2, p3, p4, p1end, p2end: p1end + 9, p3end: p1end + 18, c1, c2, c3, c4, lp };
}

function getActivePinnacle(age: number, pins: PinData): { num: number; stage: 1|2|3|4; ageRange: string } {
  if (age <= pins.p1end) return { num: pins.p1, stage: 1, ageRange: `Birth – ${pins.p1end}` };
  if (age <= pins.p2end) return { num: pins.p2, stage: 2, ageRange: `${pins.p1end + 1} – ${pins.p2end}` };
  if (age <= pins.p3end) return { num: pins.p3, stage: 3, ageRange: `${pins.p2end + 1} – ${pins.p3end}` };
  return { num: pins.p4, stage: 4, ageRange: `${pins.p3end + 1}+` };
}

function getActiveChallenge(age: number, pins: PinData) {
  if (age <= pins.p1end) return pins.c1;
  if (age <= pins.p2end) return pins.c2;
  if (age <= pins.p3end) return pins.c3;
  return pins.c4;
}

function buildNumberCounts(d: number, m: number, y: number, psychic: number, destiny: number): Record<number, number> {
  const digits = [...String(d).split(''), ...String(m).split(''), ...String(y).split('')]
    .map(Number).filter(n => n > 0);
  digits.push(psychic, destiny);
  const counts: Record<number, number> = {};
  for (const n of digits) counts[n] = (counts[n] || 0) + 1;
  return counts;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA TABLES
// ─────────────────────────────────────────────────────────────────────────────

const PY_TITLES: Record<number, string> = {
  1:'Year of Beginnings', 2:'Year of Patience', 3:'Year of Expression',
  4:'Year of Foundation', 5:'Year of Change', 6:'Year of the Heart',
  7:'Year of the Soul', 8:'Year of Power', 9:'Year of Completion',
  11:'Year of Illumination', 22:'Year of the Master Builder', 33:'Year of the Master Teacher',
};
const PY_ONE_LINERS: Record<number, string> = {
  1:'Launch, begin, and seize your independent initiative.',
  2:'Slow down, ally-build, and develop relational intelligence.',
  3:'Speak, create, and expand your social and creative reach.',
  4:'Systematize, build, and endure the productive grind.',
  5:'Embrace necessary change and resist premature anchoring.',
  6:'Heal relationships, invest in home and heart, and serve.',
  7:'Retreat, study deeply, and trust your inner guidance.',
  8:'Harvest what you have earned and claim rightful authority.',
  9:'Complete, release, forgive, and clear the decks.',
  11:'Serve as a channel — intuition peaks; guard the nervous system.',
  22:'Build at scale, but only on foundations you have verified.',
  33:'Teach from overflow, not depletion; care must include yourself.',
};

// Cheiro psychic number → { luckyDays, luckyDates (own number dates), compatibleNumbers, strongPeriod }
const CHEIRO_DATA: Record<number, {
  luckyDays: string[];
  ownDates: number[];
  compatibleNumbers: number[];
  strongPeriod: string;
  strongMonths: number[];  // calendar months of strong period
}> = {
  1: { luckyDays:['Sunday','Monday'], ownDates:[1,10,19,28], compatibleNumbers:[2,4,7], strongPeriod:'21 Jul – 28 Aug (also 21 Mar – 28 Apr)', strongMonths:[3,4,7,8] },
  2: { luckyDays:['Sunday','Monday','Friday'], ownDates:[2,11,20,29], compatibleNumbers:[1,4,7], strongPeriod:'20 Jun – 27 Jul', strongMonths:[6,7] },
  3: { luckyDays:['Thursday','Friday','Tuesday'], ownDates:[3,12,21,30], compatibleNumbers:[6,9], strongPeriod:'19 Feb – 27 Mar (also 21 Nov – 27 Dec)', strongMonths:[2,3,11,12] },
  4: { luckyDays:['Saturday','Sunday','Monday'], ownDates:[4,13,22,31], compatibleNumbers:[1,2,7,8], strongPeriod:'21 Jun – 27 Jul (also 22 Jul – end Aug)', strongMonths:[6,7,8] },
  5: { luckyDays:['Wednesday','Friday'], ownDates:[5,14,23], compatibleNumbers:[5], strongPeriod:'21 May – 27 Jun (also 21 Aug – 27 Sep)', strongMonths:[5,6,8,9] },
  6: { luckyDays:['Tuesday','Thursday','Friday'], ownDates:[6,15,24], compatibleNumbers:[3,9], strongPeriod:'20 Apr – 27 May (also 21 Sep – 27 Oct)', strongMonths:[4,5,9,10] },
  7: { luckyDays:['Sunday','Monday'], ownDates:[7,16,25], compatibleNumbers:[1,2,4], strongPeriod:'21 Jun – 27 Jul', strongMonths:[6,7] },
  8: { luckyDays:['Saturday','Sunday','Monday'], ownDates:[8,17,26], compatibleNumbers:[4], strongPeriod:'21 Dec – 26 Feb (House of Saturn)', strongMonths:[12,1,2] },
  9: { luckyDays:['Tuesday','Thursday','Friday'], ownDates:[9,18,27], compatibleNumbers:[3,6], strongPeriod:'21 Mar – 26 Apr (also 21 Oct – 27 Nov)', strongMonths:[3,4,10,11] },
};

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_NAMES_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 5 — CHEIRO CLIMACTERIC YEARS
// ─────────────────────────────────────────────────────────────────────────────
// Cheiro's climacteric: ages that are multiples of 7 (7,14,21,28,35,42,49,56,63,70,77,84)
// and the interchangeable "Grand Climacteric" pattern:
// 63 (7×9), and ages where personal year 4 or 8 intersects with a multiple-of-7.
// Also: ages where LP, PY, and pinnacle number all share the same vibration = Grand Conjunction.

const CLIMACTERIC_AGES = [7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84];

function getClimatericNote(age: number, py: number, lp: number, pinnacle: number, targetYear: number): { isClimateric: boolean; note: string | null } {
  const isMultOf7 = CLIMACTERIC_AGES.includes(age);
  const isGrandConjunction = py === lp && lp === pinnacle;
  const isSaturnReturn = age === 29 || age === 30 || age === 58 || age === 59;
  const isPY48 = py === 4 || py === 8;

  if (isGrandConjunction && isMultOf7) {
    return { isClimateric: true, note: `⚡ GRAND CLIMACTERIC CONJUNCTION: Age ${age} is both a Climacteric Year AND your Personal Year, Life Path, and Pinnacle all share the same vibration (${py}). Cheiro considered this a once-in-a-lifetime convergence — decisions made this year have extraordinary consequence and will echo for decades. Act with unusual deliberation.` };
  }
  if (isGrandConjunction) {
    return { isClimateric: true, note: `⚡ TRIPLE CONJUNCTION: Your Personal Year (${py}), Life Path (${lp}), and Pinnacle (${pinnacle}) all resonate at the same number this year — a rare alignment Cheiro associated with destiny-defining moments. What you initiate or complete in ${targetYear} has disproportionate long-term consequence.` };
  }
  if (isMultOf7 && isPY48) {
    return { isClimateric: true, note: `⚡ CHEIRO CLIMACTERIC: Age ${age} is one of Cheiro's critical climacteric years (multiples of 7), and this is also a Personal Year ${py} — a heavy-duty combination. Cheiro wrote that climacteric years under a 4 or 8 vibration often mark the definitive turning of a long arc. Be prepared for significant structural change.` };
  }
  if (isMultOf7) {
    return { isClimateric: true, note: `⚡ CHEIRO CLIMACTERIC YEAR: Age ${age} falls on a Cheiro climacteric milestone (multiples of 7 were considered fate-altering by Cheiro). This is not an ordinary year — decisions made and events that occur this year tend to shape the configuration of the next seven-year arc. Exercise unusual intentionality about what you commit to and what you release.` };
  }
  if (isSaturnReturn) {
    return { isClimateric: true, note: `🪐 SATURN RETURN WINDOW: Around ages 28–30 and 58–60, the Saturn Return is astrologically and numerologically recognized as a major structural restructuring — the end of the first or second major life arc. Current age ${age} sits inside this window. Cheiro's interchangeable numbers (4 and 8 sharing Saturn's frequency) make this doubly significant.` };
  }
  return { isClimateric: false, note: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 6 — CHEIRO LUCKY DATES INTELLIGENCE
// ─────────────────────────────────────────────────────────────────────────────

function getCheiroDayIntelligence(
  psychicNum: number,
  currentMonth: number,
  currentYear: number
): CheiroDayIntelligence {
  const data = CHEIRO_DATA[psychicNum] || CHEIRO_DATA[1];
  const { luckyDays, ownDates, compatibleNumbers, strongPeriod, strongMonths } = data;

  // Find lucky dates in current month
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const luckyDatesThisMonth: number[] = [];
  for (const d of ownDates) {
    if (d <= daysInMonth) luckyDatesThisMonth.push(d);
  }
  // Also add compatible-number dates (those that reduce to compatibleNumbers)
  for (let d = 1; d <= daysInMonth; d++) {
    const rd = reduceNum(d);
    if (compatibleNumbers.includes(rd) && !luckyDatesThisMonth.includes(d)) {
      luckyDatesThisMonth.push(d);
    }
  }
  luckyDatesThisMonth.sort((a, b) => a - b);

  // Find next "power window" = lucky date that falls on a lucky day
  let nextPowerWindow = '';
  for (const d of luckyDatesThisMonth) {
    const dow = new Date(currentYear, currentMonth - 1, d).getDay();
    const dayName = DAY_NAMES[dow];
    if (luckyDays.includes(dayName)) {
      nextPowerWindow = `${MONTH_NAMES_SHORT[currentMonth - 1]} ${d} (${dayName}) — Own-date + Lucky Day conjunction`;
      break;
    }
  }
  if (!nextPowerWindow && luckyDatesThisMonth.length > 0) {
    const d = luckyDatesThisMonth[0];
    const dow = new Date(currentYear, currentMonth - 1, d).getDay();
    nextPowerWindow = `${MONTH_NAMES_SHORT[currentMonth - 1]} ${d} (${DAY_NAMES[dow]}) — Own-date`;
  }

  // Strong period note
  const isInStrongPeriod = strongMonths.includes(currentMonth);
  const strongPeriodNote = isInStrongPeriod
    ? `⚡ You are currently IN Cheiro's strong period for Number ${psychicNum} (${strongPeriod}). All initiatives taken this month carry amplified frequency — especially on ${luckyDays.join(' and ')}.`
    : `Your strong period is ${strongPeriod}. Protect important actions for this window when possible.`;

  // Avoid dates: days reducing to challenging numbers (4 and 8 for most, unless that IS their number)
  const avoidNums = [4, 8].filter(n => !ownDates.map(d => reduceNum(d)).includes(n) && !compatibleNumbers.includes(n));
  const avoidDatesStr = avoidNums.length > 0
    ? `Approach the ${avoidNums.flatMap(n => [n, n + 9, n + 18, n + 27].filter(d => d <= 31)).join(', ')} with extra caution for major decisions`
    : 'No strongly adverse dates — your number carries Saturn compatibility';

  return { luckyDaysOfWeek: luckyDays, luckyDatesThisMonth, nextPowerWindow, avoidDates: avoidDatesStr, strongPeriod: strongPeriodNote };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 7 — LO SHU DYNAMIC ACTIVATION
// ─────────────────────────────────────────────────────────────────────────────

const LO_SHU_ARROWS: Record<string, { numbers: number[]; name: string; meaning: string }> = {
  determinism:  { numbers:[1,5,9], name:'Arrow of Determinism', meaning:'willpower, spiritual drive, goal achievement' },
  intellect:    { numbers:[3,5,7], name:'Arrow of the Intellect', meaning:'analytical power, intuition, spatial reasoning' },
  activity:     { numbers:[1,2,3], name:'Arrow of Activity (Self-Esteem)', meaning:'self-expression, confidence, identity strength' },
  family:       { numbers:[4,5,6], name:'Arrow of the Practical', meaning:'making a living, grounded action, work capacity' },
  wisdom:       { numbers:[7,8,9], name:'Arrow of Wisdom', meaning:'accumulated knowledge, spiritual legacy, expression' },
  will:         { numbers:[1,4,7], name:'Arrow of Will', meaning:'purpose, initiative, sustained intention' },
  emotional:    { numbers:[2,5,8], name:'Arrow of Emotional Balance', meaning:'family harmony, bioenergy, endurance' },
  stability:    { numbers:[3,6,9], name:'Arrow of Stability', meaning:'deep grounding, consistency, long-cycle patience' },
};

function getLoShuActivation(
  py: number,
  numberCounts: Record<number, number>,
  psychicNum: number,
  targetYear: number
): LoShuActivation {
  // Numbers the PY resonates with: the PY number itself, numbers ±1, and numbers
  // in the same Lo Shu row/column as PY
  const pyFamily = new Set<number>([py]);
  // Adjacent vibrations
  if (py > 1) pyFamily.add(py - 1);
  if (py < 9) pyFamily.add(py + 1);

  // Which arrows gain strength because PY adds to their line?
  const strengthenedArrows: string[] = [];
  const weakenedArrows: string[] = [];
  const activatedNumbers = Array.from(pyFamily);

  for (const [id, arrow] of Object.entries(LO_SHU_ARROWS)) {
    const hasAllPresent = arrow.numbers.every(n => (numberCounts[n] || 0) > 0);
    const hasPY = arrow.numbers.includes(py);
    const isFullArrow = hasAllPresent;
    const missingCount = arrow.numbers.filter(n => (numberCounts[n] || 0) === 0).length;

    if (hasPY && isFullArrow) {
      strengthenedArrows.push(`${arrow.name} — PY ${py} supercharges this active arrow (${arrow.meaning})`);
    } else if (hasPY && missingCount === 0) {
      strengthenedArrows.push(`${arrow.name} — already strong; PY ${py} amplifies (${arrow.meaning})`);
    } else if (hasPY && missingCount === 1) {
      const missing = arrow.numbers.find(n => (numberCounts[n] || 0) === 0)!;
      strengthenedArrows.push(`${arrow.name} — PY ${py} activates this line; only the ${missing} is absent, creating partial-arrow momentum (${arrow.meaning})`);
    } else if (!hasPY && isFullArrow) {
      // Full arrow but PY doesn't touch it — neutral or slight tension if PY contradicts
      if (Math.abs(py - arrow.numbers[1]) >= 4) {
        weakenedArrows.push(`${arrow.name} — tension with PY ${py}'s divergent energy field`);
      }
    }
  }

  // Grid narrative
  const dominated = Object.entries(numberCounts)
    .filter(([, c]) => c >= 3)
    .map(([n]) => n)
    .join(', ');

  let narrative = `In ${targetYear}, Personal Year ${py} resonates through your grid's ${py > 0 ? `position ${py}` : 'field'}. `;

  if (strengthenedArrows.length > 0) {
    narrative += `The following Lo Shu lines gain unusual activation this year: ${strengthenedArrows[0].split('—')[0].trim()}${strengthenedArrows.length > 1 ? ` and ${strengthenedArrows.length - 1} more` : ''}. `;
  }
  if ((numberCounts[py] || 0) >= 3) {
    narrative += `You already carry ${numberCounts[py]} instances of the ${py} in your birth grid — this year's vibration is saturated in your chart, producing an amplified, sometimes overwhelming concentration of ${py} energy. `;
  } else if ((numberCounts[py] || 0) === 0) {
    narrative += `The ${py} is absent from your birth grid — this year temporarily fills a karmic void, bringing you face-to-face with qualities you don't naturally carry. Treat this as remedial education, not obstacle. `;
  } else {
    narrative += `The ${py} appears ${numberCounts[py] || 0} time(s) in your birth grid — moderate resonance with this year's field. `;
  }
  if (dominated) {
    narrative += `Your grid is dominated by the ${dominated} — these numbers interact with PY ${py} as the primary lens through which you process this year's demands.`;
  }

  return { activatedNumbers, strengthenedArrows, weakenedArrows, gridNarrative: narrative };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 8 — MISSING NUMBERS FORECAST
// ─────────────────────────────────────────────────────────────────────────────

const MISSING_FILL_NARRATIVES: Record<number, string> = {
  1: 'The 1 void in your chart is temporarily filled this year — situations will demand self-assertion, independent decision-making, and leadership that your natural wiring finds uncomfortable. This is a remedial year for selfhood. Do not delegate what only you can decide.',
  2: 'The absent 2 in your birth grid is activated this year — partnerships, emotional attunement, and patience become the primary curriculum. Your usual preference for direct action will be systematically frustrated until you learn to wait, listen, and collaborate.',
  3: 'The missing 3 in your grid finds temporary voice this year — creative self-expression, communication, and social visibility all become urgent themes. Long-suppressed creative impulses may surface with unusual force.',
  4: 'The 4 void is filled this year — structure, discipline, and the productive grind become unavoidable. Projects that normally feel optional will demand systematic follow-through. Build one permanent foundation this year.',
  5: 'The absent 5 in your chart is animated this year — change, freedom, and unpredictability arrive whether invited or not. Your preference for stability will be tested. Adapt or be disrupted.',
  6: 'The missing 6 is activated — love, responsibility, and domestic concerns dominate. Relationships that have been neglected will demand attention. Family healing or family pressure arrives.',
  7: 'The 7 void is temporarily filled — introspection, spiritual seeking, and the demands of solitude become insistent. The extrovert must turn inward. The intellectual must turn mystical. What have you been avoiding knowing about yourself?',
  8: 'The absent 8 is animated this year — material responsibility, financial decisions, and the exercise of authority arrive front and center. Your usual avoidance of power dynamics will not be possible this year.',
  9: 'The missing 9 is filled — completion, release, and the confrontation with endings that have been postponed. Forgiveness work, closure, and the graceful termination of cycles that overstayed their purpose are the primary curriculum.',
};

function getMissingNumberForecast(py: number, numberCounts: Record<number, number>): MissingNumberForecast {
  const missingNumbers = [1,2,3,4,5,6,7,8,9].filter(n => (numberCounts[n] || 0) === 0);
  const activatedMissing = missingNumbers.filter(n => n === py || n === reduceNum(py + 1) || n === reduceNum(py - 1 || 9));

  // Primary: the PY directly fills its own missing number
  const directFill = missingNumbers.includes(py) ? [py] : [];
  const allActivated = [...new Set([...directFill, ...activatedMissing])];

  let narrative = '';
  if (missingNumbers.length === 0) {
    narrative = 'Your birth grid contains all nine digits — no missing-number voids exist. This year\'s vibration amplifies rather than remedially fills, producing deeper expression of your already-complete numerical foundation.';
  } else if (allActivated.length === 0) {
    narrative = `Missing numbers ${missingNumbers.join(', ')} remain in their karmic void this year — not directly activated by PY ${py}. The lessons they represent are present in the background but not the primary curriculum. Focus on the PY ${py}'s direct teachings.`;
  } else {
    narrative = allActivated.map(n => MISSING_FILL_NARRATIVES[n]).join(' ');
  }

  return { missingNumbers, activatedMissing: allActivated, narrative };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 9 — REPEATED NUMBERS AMPLIFIER
// ─────────────────────────────────────────────────────────────────────────────

function getRepeatedNumberAmplifier(py: number, numberCounts: Record<number, number>): RepeatedNumberAmplifier {
  // Find the most repeated number in birth grid
  let dominantNumber: number | null = null;
  let dominantCount = 0;
  for (const [n, c] of Object.entries(numberCounts)) {
    if (c > dominantCount) { dominantCount = c; dominantNumber = Number(n); }
  }

  if (!dominantNumber || dominantCount < 2) {
    return { dominantNumber: null, dominantCount: 0, amplificationNote: 'Your birth grid has no strongly repeated numbers — vibrations are relatively balanced across the spectrum. No single frequency dominates this year\'s field.' };
  }

  const pyMatchesDominant = py === dominantNumber;
  const pyAdjacentToDominant = Math.abs(py - (dominantNumber || 0)) === 1;

  let amplificationNote = '';
  if (pyMatchesDominant) {
    amplificationNote = `⚡ MAXIMUM AMPLIFICATION: You carry ${dominantCount} instances of the ${dominantNumber} in your birth grid — already the strongest single vibration in your chart. Personal Year ${py} IS this number. This creates an unusually concentrated field: the ${dominantNumber} energy is so dominant that every major event this year will be colored by its themes (${dominantNumber === 1 ? 'leadership, independence, willpower' : dominantNumber === 2 ? 'partnership, patience, emotional depth' : dominantNumber === 3 ? 'creativity, expression, social expansion' : dominantNumber === 4 ? 'discipline, structure, productive labor' : dominantNumber === 5 ? 'freedom, change, adaptability' : dominantNumber === 6 ? 'love, responsibility, family' : dominantNumber === 7 ? 'wisdom, solitude, spiritual depth' : dominantNumber === 8 ? 'power, authority, material consequence' : 'completion, release, universal love'}). Exercise this energy consciously — with ${dominantCount} instances, the shadow of the ${dominantNumber} is as available as its gifts.`;
  } else if (pyAdjacentToDominant) {
    amplificationNote = `RESONANCE AMPLIFICATION: Your birth grid carries ${dominantCount} instances of the ${dominantNumber}. Personal Year ${py} is adjacent in vibration — the ${dominantNumber}'s concentrated energy creates a backdrop that amplifies the PY ${py}'s themes. You will find this year's demands familiar in texture even if different in content.`;
  } else {
    amplificationNote = `CROSS-FREQUENCY TENSION: You carry ${dominantCount} instances of the ${dominantNumber} — your grid's dominant frequency. But Personal Year ${py} operates on a different vibration. The tension between your chart's concentrated ${dominantNumber} energy and this year's ${py} demands will be one of this year's most interesting dynamics: which frequency wins? Usually the answer is both, in sequence — the PY ${py} dominates the outer events while the ${dominantNumber} concentration colors the inner response.`;
  }

  return { dominantNumber, dominantCount, amplificationNote };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 10 — KARMIC DEBT TRIGGER
// ─────────────────────────────────────────────────────────────────────────────

// Karmic debts: 13→4, 14→5, 16→7, 19→1
// A debt is triggered when the PY matches its root number

function detectKarmicTrigger(
  birthDay: number,
  py: number
): KarmicTrigger {
  const DEBT_TO_PY_TRIGGER: Record<number, number[]> = {
    13: [4, 8],    // discipline debts triggered in foundation/power years
    14: [5, 1],    // freedom debt triggered in change/initiation years
    16: [7, 9],    // love-misuse debt triggered in soul/completion years
    19: [1, 8],    // power-misuse debt triggered in pioneer/harvest years
  };

  // Detect which debt is present. The canonical rule: karmic debts 13, 14,
  // 16 and 19 are carried by the RAW birth day (born on the 13th, 14th, 16th
  // or 19th of the month) — the traditional debt location in the chart.
  // The REDUCED roots (4, 5, 7, 1) are NOT debts: a Life Path 4 does not
  // carry "Debt 13", and a year digit-sum like 1990 -> 19 is arithmetic, not
  // karma. This matches detectKarmicDebts() in karmic-life-path.ts, so the
  // two screens of the app can never disagree about the user's karma again.
  let foundDebt: number | null = null;
  for (const debt of [13, 14, 16, 19]) {
    if (birthDay === debt) {
      foundDebt = debt;
      break;
    }
  }

  if (!foundDebt) {
    return { debtNumber: null, isTriggered: false, triggerExplanation: 'No primary Karmic Debt detected in your chart. The standard debt patterns (13, 14, 16, 19) are not directly implicated in your core numbers. This year\'s challenges arise from developmental growth rather than karmic remediation.' };
  }

  const triggerYears = DEBT_TO_PY_TRIGGER[foundDebt] || [];
  const isTriggered = triggerYears.includes(py);

  const DEBT_NAMES: Record<number, string> = {
    13: 'Karmic Debt 13 (The Debt of Laziness — root 4: discipline)',
    14: 'Karmic Debt 14 (The Debt of Misused Freedom — root 5: freedom)',
    16: 'Karmic Debt 16 (The Debt of Misused Love — root 7: spiritual truth)',
    19: 'Karmic Debt 19 (The Debt of Misused Power — root 1: authority)',
  };

  const TRIGGER_NOTES: Record<number, Record<number, string>> = {
    13: {
      4: '⚡ DEBT TRIGGERED: Personal Year 4 directly activates Karmic Debt 13. This is the debt\'s home frequency — the year\'s demand for discipline and sustained effort is precisely the karma that must be addressed. Shortcuts taken this year have unusually severe and immediate consequences. Complete what you start.',
      8: 'Karmic Debt 13 is partially activated by PY 8\'s material demands — the universe will test whether past laziness has been genuinely overcome or merely disguised. Material rewards may feel blocked until genuine disciplined effort is demonstrated.',
    },
    14: {
      5: '⚡ DEBT TRIGGERED: Personal Year 5 directly activates Karmic Debt 14. The Change Year is the Misused Freedom debt\'s crucible — every impulse toward abandonment, recklessness, or escape from commitment this year is the karma presenting itself for resolution. The test: can you exercise freedom without harming others or destroying useful structures?',
      1: 'Karmic Debt 14 is activated by PY 1\'s independence field — the invitation to start fresh carries the shadow risk of abandoning what still deserves completion. Conscious moderation is the prescription.',
    },
    16: {
      7: '⚡ DEBT TRIGGERED: Personal Year 7 directly activates Karmic Debt 16. The Soul Year\'s introspective field brings the Tower into view — false structures built on ego, appearance, or the misuse of intimacy will face exposure this year. Let them fall gracefully rather than trying to maintain what cannot hold.',
      9: 'Karmic Debt 16 is activated by PY 9\'s completion field — old relationship wounds and hidden truths about how love has been used or misused will surface for final resolution. The year rewards radical honesty and punishes continued performance.',
    },
    19: {
      1: '⚡ DEBT TRIGGERED: Personal Year 1 directly activates Karmic Debt 19. Leadership opportunities will arrive this year — and with them, the test of whether power is exercised in service or in domination. This year\'s authority claims will be karmic tests, not merely professional opportunities.',
      8: 'Karmic Debt 19 is fully activated by PY 8\'s power harvest. The material authority that arrives this year is charged with karmic consequence — wield it in service of others and the debt diminishes; use it for self-aggrandizement and the next cycle begins with heavier weight.',
    },
  };

  const note = isTriggered
    ? (TRIGGER_NOTES[foundDebt]?.[py] || `${DEBT_NAMES[foundDebt]} is activated by PY ${py} — this year's themes are specifically calibrated to address the debt's core lesson.`)
    : `${DEBT_NAMES[foundDebt]} is present in your chart but not in its primary trigger year (PY ${py}). The debt's themes are background noise rather than foreground curriculum this year.`;

  return { debtNumber: foundDebt as 13 | 14 | 16 | 19, isTriggered, triggerExplanation: note };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 11 — PINNACLE TRANSITION RADAR
// ─────────────────────────────────────────────────────────────────────────────

function getPinnacleTransitionRadar(
  age: number, birthMonth: number, pins: PinData, targetYear: number, readMonth: number
): PinnacleTransitionRadar {
  // Transition boundaries are birthdays: the shift from Pinnacle N to N+1
  // happens at the birthday marking boundary age X (birth year + X, birth
  // month). Months-until is measured from the requested read date, so a
  // January baby and a December baby of the same age get different answers,
  // and the exact transition year itself reports 'in transition' instead of
  // skipping past it (the old code used '>' and skipped the real boundary).
  const boundaries = [
    { age: pins.p1end, num: pins.p2 },
    { age: pins.p2end, num: pins.p3 },
    { age: pins.p3end, num: pins.p4 },
  ];

  let nearest: { age: number; num: number; months: number } | null = null;
  for (const b of boundaries) {
    let months = (b.age - age) * 12 + (birthMonth - readMonth);
    // When the read month precedes the birth month, `age` has not yet had
    // this year's birthday, so (boundaryAge - age) counts a full year that
    // is really only the remaining months of the current one.
    if (readMonth < birthMonth) months -= 12;
    if (months < 0) continue; // boundary already passed
    if (nearest === null || months < nearest.months) {
      nearest = { age: b.age, num: b.num, months };
    }
  }

  if (nearest === null) {
    return { monthsUntilTransition: null, isInTransitionWindow: false, nextPinnacleNumber: null, transitionNarrative: 'You are in your final Pinnacle (Pinnacle 4). No further Pinnacle transitions remain. The current life-arc theme is your permanent backdrop through the remainder of this incarnation.' };
  }

  const currentPin = getActivePinnacle(age, pins).num;
  const isInWindow = nearest.months <= 18;

  let narrative = '';
  if (nearest.months === 0) {
    narrative = `⚡ PINNACLE TRANSITION NOW: The boundary falls in this very month (your birth month). Your Pinnacle is shifting from ${currentPin} to Pinnacle ${nearest.num}. Both arcs are present at once — the old arc's momentum is winding down while the new arc's field asserts itself. Things that seemed permanent may loosen; things that seemed impossible may suddenly become available. Do not make 10-year commitments to structures that belong to the ending Pinnacle.`;
  } else if (isInWindow) {
    narrative = `⚡ PINNACLE TRANSITION IMMINENT: Approximately ${nearest.months} month${nearest.months !== 1 ? 's' : ''} remain until your Pinnacle shifts from ${currentPin} to Pinnacle ${nearest.num} (around age ${nearest.age}). Transition periods are among the most turbulent and generative in numerology — the old arc's momentum is winding down while the new arc's field begins to assert itself. Both energies are simultaneously present, creating unusual creative instability. Things that seemed permanent may loosen; things that seemed impossible may suddenly become available. Do not make 10-year commitments to structures that belong to the ending Pinnacle.`;
  } else {
    const yearsUntil = Math.max(1, Math.round(nearest.months / 12));
    narrative = `Your current Pinnacle transitions in approximately ${yearsUntil} year${yearsUntil !== 1 ? 's' : ''} (around age ${nearest.age}), shifting to Pinnacle ${nearest.num}. This year remains firmly within the current arc — no transition pressure is present.`;
  }

  return {
    monthsUntilTransition: nearest.months,
    isInTransitionWindow: isInWindow,
    nextPinnacleNumber: nearest.num,
    transitionNarrative: narrative,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 12 — PROBABILITY SCORING ENGINE
// ─────────────────────────────────────────────────────────────────────────────
// Scores are deterministic synthesis outputs — not random.
// Each domain starts at 50 and is modified by layer interactions.

function calcProbabilityScores(
  py: number,
  pinnacle: number,
  challenge: number,
  isClimateric: boolean,
  isKarmicTriggered: boolean,
  isPinnacleTransition: boolean,
  dominantNumber: number | null,
  missingActivated: number[],
  loShuStrengths: number
): ProbabilityScores {
  let career = 50, fin = 50, rel = 50, health = 50, spirit = 50;

  // Personal Year modifiers
  const PY_CAREER: Record<number, number>    = {1:+18,2:-5,3:+10,4:+8,5:+5,6:+3,7:-8,8:+22,9:-5,11:-4,22:+20,33:+4};
  const PY_FIN: Record<number, number>       = {1:+10,2:-8,3:+5,4:+8,5:+0,6:-3,7:-10,8:+25,9:-5,11:-6,22:+18,33:-4};
  const PY_REL: Record<number, number>       = {1:-5,2:+20,3:+12,4:-8,5:+0,6:+18,7:-10,8:-5,9:+5,11:+14,22:-4,33:+10};
  const PY_HEALTH: Record<number, number>    = {1:+5,2:+0,3:+5,4:-10,5:+0,6:+8,7:+5,8:+8,9:+5,11:-4,22:+4,33:-4};
  const PY_SPIRIT: Record<number, number>    = {1:-5,2:+15,3:+5,4:-5,5:+0,6:+8,7:+25,8:+5,9:+20,11:+18,22:+6,33:+18};

  career  += (PY_CAREER[py]  || 0);
  fin     += (PY_FIN[py]     || 0);
  rel     += (PY_REL[py]     || 0);
  health  += (PY_HEALTH[py]  || 0);
  spirit  += (PY_SPIRIT[py]  || 0);

  // Pinnacle modifiers (if PY and Pinnacle match → amplify that domain)
  if (py === pinnacle) { career += 8; fin += 6; spirit += 5; }

  // Challenge drag (challenge numbers > 4 = more disruption risk)
  if (challenge >= 4 && challenge !== 0) { career -= 5; fin -= 5; }
  if (challenge === 2 || challenge === 6) { rel -= 8; }
  if (challenge === 4) { health -= 5; }
  if (challenge === 7) { spirit += 5; }

  // Climacteric amplifier — boosts consequence magnitude, not necessarily score
  if (isClimateric) { career += 5; fin += 5; spirit += 5; }

  // Karmic trigger drag
  if (isKarmicTriggered) { career -= 5; fin -= 5; rel -= 5; }

  // Pinnacle transition = instability
  if (isPinnacleTransition) { career -= 8; rel -= 5; fin -= 5; }

  // Dominant number matching PY = amplifier
  if (dominantNumber === py) { career += 8; fin += 5; spirit += 5; }

  // Missing activated = drag (unfamiliar territory)
  if (missingActivated.includes(py)) { career -= 5; rel -= 5; }

  // Lo Shu strengths
  career  += Math.min(loShuStrengths * 3, 10);
  spirit  += Math.min(loShuStrengths * 2, 8);

  // Clamp all to 20–97
  const clamp = (v: number) => Math.min(97, Math.max(20, Math.round(v)));
  const overall = clamp((career + fin + rel + health + spirit) / 5);

  return {
    careerMomentum: clamp(career),
    financialGrowth: clamp(fin),
    relationshipStability: clamp(rel),
    healthDiscipline: clamp(health),
    spiritualGrowth: clamp(spirit),
    overallYear: overall,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 13 — DAILY PREDICTION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

const PD_FOCUS: Record<number, string> = {
  1:'Initiate, assert yourself, make independent decisions',
  2:'Cooperate, listen deeply, sign nothing without re-reading',
  3:'Communicate, create, and expand your social reach',
  4:'Systematize, execute methodically, handle practical matters',
  5:'Expect the unexpected; stay flexible and keep energy high',
  6:'Tend relationships, home, and responsibilities with care',
  7:'Reflect, study, trust intuition over surface information',
  8:'Handle financial decisions, claim authority, close deals',
  9:'Complete, forgive, release what has run its course',
  11:'Serve as a channel: counsel, mediate, follow the still voice — and log what it says',
  22:'Build deliberately: verify foundations before adding weight',
  33:'Teach and care — from overflow, not depletion',
};

const PD_SHORT: Record<number, string> = {
  1:'A day to lead, not to follow. Begin what matters.',
  2:'A day of subtle power. The quiet word achieves more than force.',
  3:'A day of charm and expression. Share your ideas — they land well.',
  4:'A day of honest labor. The grind produces gold.',
  5:'A day of surprises. Stay loose; the plan will change.',
  6:'A day of the heart. Tend your people and your space.',
  7:'A day of depth. What does your gut say that your mind dismisses?',
  8:'A day of consequence. Decisions made today carry lasting weight.',
  9:'A day of release. Complete one thing before starting another.',
  11:'A day of heightened signal. Separate insight from anxiety.',
  22:'A day for architecture. Plan before you pour.',
  33:'A day of service. Give from abundance, not absence.',
};

function generateDailyForecast(
  birthDay: number, birthMonth: number, birthYear: number,
  targetDate?: Date
): DailyForecast {
  const d = targetDate || new Date();
  const cd = d.getDate(), cm = d.getMonth() + 1, cy = d.getFullYear();

  const py = calcPersonalYear(birthDay, birthMonth, cy);
  const pd = calcPersonalDay(py, cm, cd);
  const ud = calcUniversalDay(cy, cm, cd);
  const dayOfWeek = DAY_NAMES[d.getDay()];
  const psychicNum = calcPsychicNumber(birthDay);
  const cheiro = CHEIRO_DATA[psychicNum] || CHEIRO_DATA[1];

  const isLuckyDay = cheiro.luckyDays.includes(dayOfWeek);
  const isLuckyDate = cheiro.ownDates.includes(cd) || cheiro.compatibleNumbers.includes(reduceNum(cd));
  const isPowerWindow = isLuckyDay && isLuckyDate;

  // "Avoid major decisions" heuristic: PD 4 or 8 on a non-lucky day, or PD = challenge
  const avoidMajorDecisions = (pd === 4 || pd === 8) && !isLuckyDay;

  // Notification alert logic
  let notificationAlert: string | null = null;
  if (isPowerWindow) {
    notificationAlert = `⚡ Power Window: Today (${MONTH_NAMES_SHORT[cm-1]} ${cd}, ${dayOfWeek}) is both a lucky date AND your lucky day of the week — your strongest activation this month. Initiate important actions.`;
  } else if (pd === py) {
    notificationAlert = `✦ Today's Personal Day (${pd}) matches your Personal Year (${py}) — a moment of peak alignment with this year's primary theme. High-leverage timing.`;
  } else if (pd === 8 && isLuckyDay) {
    notificationAlert = `💎 PD 8 on a lucky day — financial and authority decisions made today carry unusual weight and potential. Seize material opportunities.`;
  } else if (avoidMajorDecisions) {
    notificationAlert = `⚠️ PD ${pd} — approach major financial or contractual decisions with extra caution today. Review rather than sign.`;
  }

  return {
    date: `${cd}/${cm}/${cy}`,
    personalDay: pd,
    universalDay: ud,
    dayOfWeek,
    isLuckyDay,
    isLuckyDate,
    isPowerWindow,
    avoidMajorDecisions,
    focus: PD_FOCUS[pd] || 'Navigate today with awareness',
    shortNarrative: PD_SHORT[pd] || '',
    notificationAlert,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 14 — CONTRADICTION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

interface ContradictionRule {
  condA: (py: number, pin: number, ch: number, lp: number) => boolean;
  condB: (py: number, pin: number, ch: number, lp: number) => boolean;
  labelA: string;
  labelB: string;
  tension: string;
  resolution: string;
}

const CONTRADICTION_RULES: ContradictionRule[] = [
  {
    condA: (py) => py === 8,
    condB: (_, __, ch) => ch === 2,
    labelA: 'PY 8 — Push for material harvest now',
    labelB: 'Challenge 2 — Be patient; wait for others',
    tension: 'The Harvest Year demands bold authority claims; the Patience Challenge simultaneously demands subordination and waiting. Pushing too hard triggers relational friction; waiting too long misses the karmic window.',
    resolution: 'Claim authority in your OWN domain without requiring others to move at your pace. Lead where you have clear jurisdiction; collaborate where you don\'t. Parallel tracks, not sequential ones.',
  },
  {
    condA: (py) => py === 1,
    condB: (_, pin) => pin === 4,
    labelA: 'PY 1 — Launch boldly and independently',
    labelB: 'Pinnacle 4 — Engineer carefully and build durably',
    tension: 'The Pioneer Year wants to move fast and trust the vision; the Builder Pinnacle demands that every launch be structurally sound before the first stone is placed. Tension between speed and permanence.',
    resolution: 'Blueprint before breaking ground. The PY 1 energy is best used this year for DESIGNING the initiative with the rigor the Pinnacle 4 demands — launch smaller, test faster, build solid rather than big.',
  },
  {
    condA: (py) => py === 7,
    condB: (_, __, ___, lp) => lp === 1 || lp === 8,
    labelA: 'PY 7 — Retreat inward; this is a Soul Year',
    labelB: 'Life Path 1/8 — Your nature is outward action and material authority',
    tension: 'The Soul Year requires withdrawal and reflection; your Life Path\'s natural orientation is toward external achievement and visible influence. Forced retreat feels like failure to your constitution.',
    resolution: 'Reframe: the PY 7\'s retreat is STRATEGIC preparation for the PY 8\'s harvest. What you study, integrate, and clarify this year becomes the competitive advantage of next year\'s authority claims. Introduce the concept of "deep work" to your identity.',
  },
  {
    condA: (py) => py === 5,
    condB: (_, __, ch) => ch === 4,
    labelA: 'PY 5 — Embrace change and fluid adaptation',
    labelB: 'Challenge 4 — You chronically resist the discipline required for stability',
    tension: 'The Change Year amplifies the Challenge 4\'s constitutional aversion to structure. Every impulse toward freedom and novelty this year strengthens the pattern that most needs to be overcome. The year becomes an excuse for the challenge.',
    resolution: 'Choose ONE non-negotiable daily discipline before the PY 5\'s disruptions begin arriving. Make it small enough to maintain through any amount of external chaos. This anchor is what separates growth from drift in a year that will test your capacity for both.',
  },
  {
    condA: (py) => py === 9,
    condB: (_, pin) => pin === 1,
    labelA: 'PY 9 — Release, complete, let die what is finished',
    labelB: 'Pinnacle 1 — The Pioneer arc demands new independent initiative',
    tension: 'The Completion Year says release; the Pioneer Pinnacle says initiate. The danger is premature release of initiatives that still have value, OR refusing to complete genuine endings because the Pinnacle 1\'s momentum feels urgent.',
    resolution: 'Apply the 90-day test: if something has genuinely not moved in 90 days despite adequate attention and resources, it has completed its cycle — release it. If it is moving but slowly, the Pinnacle 1 energy is asking for new leadership of that initiative, not abandonment.',
  },
  {
    condA: (py) => py === 2,
    condB: (_, pin) => pin === 8,
    labelA: 'PY 2 — Collaborate, wait, develop emotional intelligence',
    labelB: 'Pinnacle 8 — The Authority arc requires you to lead and command',
    tension: 'The Patience Year asks you to be behind-the-scenes; the Authority Pinnacle asks you to command. Many relationship and professional tensions this year will arise from this contradiction being unresolved.',
    resolution: 'Separate the arenas: exercise the Pinnacle 8\'s authority in the domain where it is most clearly yours by right; exercise the PY 2\'s patience in the domains that belong to others. Precision of jurisdiction dissolves most of the tension.',
  },
  {
    condA: (py) => py === 6,
    condB: (_, __, ch) => ch === 1,
    labelA: 'PY 6 — Give, serve, and invest in others\' wellbeing',
    labelB: 'Challenge 1 — You struggle to assert your own needs and identity',
    tension: 'The Heart Year\'s generosity field combined with the Challenge 1\'s self-assertion deficit creates a perfect storm of over-giving, self-erasure, and resentment. Giving becomes martyrdom instead of service.',
    resolution: 'Write out your own needs before each act of service this year. The PY 6 gives FROM abundance; the Challenge 1 must ensure abundance exists before the giving begins. Practice saying what you need clearly and without apology — one time per week, in low-stakes situations.',
  },
  {
    condA: (py) => py === 4,
    condB: (_, __, ch) => ch === 5,
    labelA: 'PY 4 — Build systematically; discipline is the only currency',
    labelB: 'Challenge 5 — Your freedom instinct rebels against all structure',
    tension: 'The Foundation Year\'s most demanding element meets the constitutional challenge that finds structure most repellent. Every system this year will feel like a cage. Every routine will feel like a punishment.',
    resolution: 'Reframe structure as the container for freedom rather than its enemy. The musician who has practiced scales can improvise freely; without the scales, improvisation is noise. Choose structures that have visible payoffs within 90 days — the Challenge 5 can tolerate almost anything if the reward is concrete and near.',
  },
];

function detectContradictions(
  py: number, pinnacle: number, challenge: number, lp: number
): Contradiction[] {
  const found: Contradiction[] = [];
  for (const rule of CONTRADICTION_RULES) {
    if (rule.condA(py, pinnacle, challenge, lp) && rule.condB(py, pinnacle, challenge, lp)) {
      found.push({
        signal1: rule.labelA,
        signal2: rule.labelB,
        tension: rule.tension,
        resolution: rule.resolution,
      });
    }
  }
  return found;
}

// ─────────────────────────────────────────────────────────────────────────────
// BASE DOMAIN FORECASTS (carried from v1, condensed)
// ─────────────────────────────────────────────────────────────────────────────

const CAREER_BY_PY: Record<number, string> = {
  1:'This is the year to launch, not to wait. The PY 1 field strongly favors new ventures, independent initiatives, and breaking from institutional dependency. Collaborations requiring you to subordinate your vision will stall — prefer the solo or founder role.',
  2:'Advancement comes from behind the scenes. The PY 2 rewards patience, alliance-building, and detail work. Do not force promotions or launches — use this year to position yourself for the PY 3 breakthrough.',
  3:'Visibility is your career asset this year. Speaking, writing, presenting, and creative output all attract disproportionate reward. Choose ONE vehicle for your voice and commit to it.',
  4:'The year of building systems and enduring the grind. No shortcuts will hold. Establish processes, document work, and accept that invisible daily effort is the currency of durable success.',
  5:'Multiple opportunities will arrive and depart with unusual speed. Change of role, sector, or location is highly favored. One caution: do not abandon viable long-term structures on impulse.',
  6:'Career advances through service and relationship. Leadership by nurturing is the winning mode. Real estate, health, education, and design fields are especially activated.',
  7:'Career progresses through deep specialization. Research, mastery, and the courage to go deep into a narrow field rather than wide across many is the winning strategy. Avoid high-profile launches.',
  8:'The harvest year. Promotions, major contracts, and authority assignments cluster here for those who have built their foundation. Step into leadership; make significant financial decisions.',
  9:'Let what is finished be finished. End ventures that have no more yield. Clear the board for the PY 1. Legacy work — books, final projects, culminating achievements — flourishes in the Year 9.',
  11:'A master 11 year carries the 2\'s diplomacy at nervous-system voltage. Career advances through counsel, mediation, intuition, and the quality of your alliances — not loud launches. Visibility that finds you is often symbolic; guard against the 11\'s shadow of self-doubt and second-guessing decisive moments.',
  22:'The rarest builder\'s window in the cycle: the master 22 field supports institutions, platforms, teams, and structures intended to outlast you. But the 22 punishes unverified foundations — every pillar you pour without checking the ground becomes the year\'s bill. Scale patiently; audit before expanding.',
  33:'The master 33 year channels the 6\'s service at teacher\'s voltage. Career currency is what you give: mentoring, teaching, healing, organizing for others. The shadow is self-erasure — delegating your own platform away. Lead by lifting, but keep your name on the work.',
};

const REL_BY_PY: Record<number, string> = {
  1:'Relationships are tested by your need for independence. New connections find you more self-possessed and attractive. Ensure your pursuit of independence does not become carelessness toward those who love you.',
  2:'The most relationship-rich year in the cycle. Marriages, deep friendships, and professional collaborations flourish. Shadow: hypersensitivity. Practice distinguishing emotional signal from emotional noise.',
  3:'Social life expands dramatically. New connections arrive through creative channels. Romantic relationships that begin this year carry the PY 3\'s sparkle. Invest in joy together.',
  4:'Relationships are tested by work demands. Partners may feel neglected. Schedule deliberate, non-negotiable connection time — it will not happen organically this year.',
  5:'Freedom is the relationship theme. Existing relationships that have grown rigid will face pressure. Renegotiate relational terms rather than flee. New connections tend to be exciting and unconventional.',
  6:'The year to invest deeply in love. Marriages deepen or crystallize, family bonds are healed, domestic acts of care become charged with meaning. Shadow: self-sacrifice that breeds resentment.',
  7:'Solitude is the relationship this year. Long-term partners need to understand your need for reflection. New romantic connections tend to be slow-burning and spiritually resonant.',
  8:'Relationships are tested by power dynamics. Watch for control patterns emerging in either direction. Business partnerships are the most activated domain. Both partners pursuing ambitious goals simultaneously is the winning configuration.',
  9:'Completions in relationship are the theme. Natural endings for relationships that have genuinely run their course. Support this — trying to force these relationships past their natural ending prolongs suffering.',
  11:'Relationships run at heightened sensitivity in an 11 year: deeper intuitive bonds are possible, and so is reading threat into neutrality. The 11\'s old Chaldean warning (hidden trial, treachery) counsels discernment — not suspicion, but testing alliances before depending on them.',
  22:'Partnerships are tested by scale in a 22 year: joint ventures, shared structures, long-term commitments. The relationship that survives is the one with explicit terms. Beware the 22\'s classic shadow — a good person misled by the folly of others; keep your own counsel on major union decisions.',
  33:'A year of giving that can quietly become a year of disappearing. Deep care bonds form; the shadow is martyrdom and carrying people who should be standing on their own. Give from overflow, and receive — the 33 field collapses when the vessel empties.',
};

const FIN_BY_PY: Record<number, string> = {
  1:'Financial investment in new initiatives is favored. Fund a venture, redirect income streams, commit capital to a direction that will compound across nine years. Risk: overconfidence. Build runway before leaping.',
  2:'A consolidation year. Guard existing assets carefully. Audit, organize, and understand your true financial position. Major investments should wait for PY 3 or PY 8 windows.',
  3:'Income from creative work and social channels is unusually strong. Risk: spending as expansively as you earn. Track carefully — the PY 3 can spend as fast as it generates.',
  4:'The year of financial discipline and debt reduction. Budget tightly, pay obligations, build security. Make one lasting financial structure — investment account, savings plan, property commitment — that you will not touch for years.',
  5:'Unexpected financial events — windfalls and losses — are more probable. Diversify income streams and maintain a larger-than-usual cash reserve. Opportunities in sales, media, and travel-adjacent industries are highlighted.',
  6:'Income is strongest from service-related and caretaking fields. Expenses related to family and home may increase. Financial generosity — shared investments in home or family — tends to yield disproportionate returns.',
  7:'A year for financial consolidation and research. Study your financial position deeply. Investment in education and specialized skills will yield powerful returns starting in the PY 8.',
  8:'The most financially powerful year for those who have built their foundation. Major financial decisions — investments, acquisitions, negotiations — are strongly supported. Claim what you have earned.',
  9:'Release financial attachments that no longer serve. Divest from ventures that have run their course. Do not make major new investments — clear the balance sheet, not load it.',
  11:'Not a money year in the loud sense. The 11 field favors income through counsel, mediation, and quiet skill; speculation is punished. Nervous spending (retail therapy under stress) is the classic leak — audit emotional purchases.',
  22:'The 22 field supports large-scale financial structures — property, institutions, long-term contracts — with one condition: verify. Cheiro\'s warning for the 22 line (disasters through bad partnership and illusion) applies with full force to unvetted deals. Use written terms; delay the handshake until the math is on paper.',
  33:'Money flows through service in a 33 year. Income arrives from what you give — but generosity without boundaries turns income into outflow. Set explicit terms even (especially) with people you love.',
};

const HEALTH_BY_PY: Record<number, string> = {
  1:'Physical energy tends to be high — use it to establish the health habits that will serve you across the nine-year cycle. Risk: burning out by running too hot on ambition without adequate rest.',
  2:'The nervous system is the system to watch. Hypersensitivity, anxiety, and psychosomatic symptoms are more likely. Prioritize sleep, quiet, and gentle movement over high-intensity output.',
  3:'Health benefits from joy and movement. Maintain a grounding physical practice (consistent sleep, daily movement) as anchor beneath the PY 3\'s social exuberance.',
  4:'Risk: physically burning out from overwork. The body is treated as a machine. Enforce recovery deliberately — regular sleep, structured exercise, and honoring physical limits is not optional.',
  5:'Health benefits from variety and movement. The PY 5 field makes sedentary routines psychologically unbearable. Risk: nervous system dysregulation from too much stimulation.',
  6:'Medical checkups, long-overdue health interventions, and healing practices are especially favored and effective this year. Healing old physical patterns is powerfully supported.',
  7:'Mental and spiritual health are the primary health concerns. Meditation, journaling, and solitude in nature are not optional but essential. Physical health maintains best through consistent quiet routine.',
  8:'The body is a power station this year — maintain it like one. Strength, stamina, and cardiovascular health are the relevant investments.',
  9:'Release physical holding patterns accumulated across the nine-year cycle. Bodywork and emotional release practices are unusually effective this year.',
  11:'The nervous system is the 11 year\'s barometer: sleep, stimulant intake, and emotional load govern everything downstream. Anxiety symptoms (palpitations, tension, insomnia) are the year\'s early-warning lights — treat them as signals, not fate.',
  22:'The body is load-bearing infrastructure in a 22 year: it carries the year\'s scale. Burnout arrives through overcommitment, not illness. Schedule recovery as a structural commitment, not a reward.',
  33:'The caregiver\'s year — other people\'s needs will outvote your own unless you schedule your own care first. The 33\'s classic failure is the exhausted healer. Food, sleep, and checkups are non-negotiable this year.',
};

const SPIRIT_BY_PY: Record<number, string> = {
  1:'The spiritual work is the development of authentic will — the capacity to act from genuine inner authority. Practice: journaling, somatic awareness, any contemplative practice that bypasses the inherited inner critic.',
  2:'The spiritual work is the development of receptivity. The PY 2 field is unusually permeable to intuitive guidance. Dreams, synchronicities, and the quiet voice of inner knowing all become louder. Practice: receptive meditation.',
  3:'The spiritual work is the development of authentic expression as a sacred act. Gratitude practices, creative prayer, devotional art, and spiritual community that includes joy are the optimal medicine.',
  4:'The spiritual work is the sanctification of ordinary labor — discovering the sacred in the unglamorous. Can you find the divine in the routine? Can discipline itself become a form of prayer?',
  5:'The spiritual work is freedom as an inner state. Can you remain centered in the middle of change? Practices that develop equanimity — vipassana, tai chi, Stoic inquiry — are especially powerful.',
  6:'The spiritual work is the discovery of love as a cosmological fact. Seva (service), devotional practice, and engagement with the sacred through relationship and community are the optimal disciplines.',
  7:'The richest spiritual year in the cycle. Protect your solitude, pursue your practice with unusual intensity. What comes through the silence this year is real.',
  8:'The spiritual work is the integration of power and ethics — discovering that genuine authority is inseparable from responsibility. Clarity of values tested against the temptations of the material field.',
  9:'The most spiritually complex year. The PY 9 asks for the deepest release: the willingness to let die what is completed. Forgiveness practice, conscious completion rituals, and ancestor work are the appropriate disciplines.',
  11:'The most intuitively open year of the cycle: meditation, dream work, and creative insight all amplify. Ground the openings in routine or the voltage becomes anxiety. The 11 asks you to carry a message — write it down before you preach it.',
  22:'Spirit through work: the 22 finds meaning in what it builds and whom it employs. The year\'s spiritual lesson is integrity of foundation — the unseen quality of the base determines the height of the tower.',
  33:'The teacher\'s year: what you have lived becomes instruction for others. The spiritual risk is performing enlightenment for an audience. Teach from your scars, not your pedestal.',
};

// ─────────────────────────────────────────────────────────────────────────────
// HEADLINE + TENSION + OPPORTUNITY + CAUTION (carried from v1, condensed)
// ─────────────────────────────────────────────────────────────────────────────

const PIN_ARCH: Record<number, string> = {1:'Pioneer',2:'Diplomat',3:'Creator',4:'Builder',5:'Transformer',6:'Nurturer',7:'Sage',8:'Authority',9:'Universalist',11:'Visionary',22:'Master Builder'};
const CH_ARCH: Record<number, string>  = {0:'Pure Choice',1:'Self-Assertion',2:'Emotional Calibration',3:'Creative Permission',4:'Disciplined Execution',5:'Freedom vs Stability',6:'Service vs Self',7:'Inner Trust',8:'Power & Resources',9:'Radical Release'};

function buildHeadline(py: number, pin: number, ch: number, lp: number, uy: number, age: number, isClimateric: boolean, isTransition: boolean, cy: number): string {
  const climatericTag = isClimateric ? ' — a Cheiro climacteric year carrying decade-scale consequence' : '';
  const transitionTag = isTransition ? '; with a Pinnacle transition approaching, the old arc is loosening its grip' : '';
  const pyTitle = PY_TITLES[py];
  const pinArch = PIN_ARCH[pin] || `Pinnacle ${pin}`;
  const chArch = CH_ARCH[ch] || `Challenge ${ch}`;
  return `${cy} places you in a ${pyTitle} (PY ${py}) running through the ${pinArch} Pinnacle, with the ${chArch} as this chapter's resistance theme — Universal Year ${uy} setting the collective backdrop${climatericTag}${transitionTag}. For a Life Path ${lp}, this is a year of ${py <= 3 ? 'initiation and planting' : py <= 6 ? 'construction and deepening' : 'completion and horizon-clearing'} whose unique signature no other birth date shares with you.`;
}

function buildTensionSignature(py: number, pin: number, ch: number, contradictions: Contradiction[]) {
  if (contradictions.length > 0) {
    return { forceA: contradictions[0].signal1, forceB: contradictions[0].signal2, nature: 'friction' as const, interpretation: contradictions[0].tension };
  }
  const nature: 'amplifying' | 'friction' | 'neutral' = py === pin ? 'amplifying' : Math.abs(py - pin) <= 2 ? 'neutral' : 'friction';
  return {
    forceA: `PY ${py} — ${PY_TITLES[py]}`,
    forceB: `Pinnacle ${pin} — ${PIN_ARCH[pin] || 'Pinnacle Arc'}`,
    nature,
    interpretation: nature === 'amplifying'
      ? `PY and Pinnacle resonate at the same or adjacent number — a rare doubling that concentrates this theme's gifts and shadows equally. Conscious engagement with the archetype is essential.`
      : nature === 'friction'
      ? `PY ${py}'s demands pull in a different direction from Pinnacle ${pin}'s long-arc requirements. The productive resolution lies in letting the annual cycle exercise the muscles the Pinnacle needs — not fighting two fronts simultaneously.`
      : `PY ${py} and Pinnacle ${pin} are in natural developmental relationship — the annual themes are preparing the ground for the Pinnacle's deeper work.`,
  };
}

function buildWindowOfOpportunity(py: number, birthMonth: number, cy: number): { monthRange: string; personalMonths: number[]; reason: string } {
  const OPP: Record<number, { pms: number[]; reason: string }> = {
    1: { pms:[1,10], reason:'Personal Months 1 and 10/1 double the initiation frequency — the universe\'s "GO" signal is strongest.' },
    2: { pms:[2,11], reason:'Personal Months 2 and 11 supercharge the partnership vibration — agreements begun here carry unusual depth.' },
    3: { pms:[3,6],  reason:'Personal Months 3 and 6 amplify creative momentum — launches and publications attract the widest organic response.' },
    4: { pms:[4,8],  reason:'Personal Months 4 and 8 amplify building vibration — structural commitments made here hold with unusual permanence.' },
    5: { pms:[5,9],  reason:'Personal Months 5 and 9 amplify the Change Year\'s disruptive momentum — transitions flow with the current.' },
    6: { pms:[6,3],  reason:'Personal Months 6 and 3 amplify relational warmth — key relationship conversations begun here carry exceptional resonance.' },
    7: { pms:[7,11], reason:'Personal Months 7 and 11 amplify reflective depth — decisions made in these windows are unusually clarifying.' },
    8: { pms:[8,4],  reason:'Personal Months 8 and 4 amplify material gravity — financial decisions carry exceptional leverage.' },
    9: { pms:[9,3],  reason:'Personal Months 9 and 3 amplify release and closure — endings made here are clean and leave minimal residue.' },
    11: { pms:[2,11], reason:'Personal Months 2 and 11 double the receptive voltage — alliances and intuitive decisions carry unusual weight.' },
    22: { pms:[4,8],  reason:'Personal Months 4 and 8 amplify the builder frequency — structural and financial commitments made here hold with unusual permanence.' },
    33: { pms:[6,3],  reason:'Personal Months 6 and 3 amplify teaching and expression — lessons shared in these windows land with unusual reach.' },
  };
  const conf = OPP[py] || { pms:[py], reason:'Your Personal Year number months carry the strongest alignment with your annual theme.' };
  const optMonths: number[] = [];
  for (let cm = 1; cm <= 12; cm++) {
    if (conf.pms.includes(calcPersonalMonth(py, cm))) optMonths.push(cm);
  }
  return { monthRange: optMonths.map(m => MONTH_NAMES_SHORT[m-1]).join(' & '), personalMonths: conf.pms, reason: conf.reason };
}

function buildCautionFlag(py: number, pin: number, ch: number): { risk: string; mitigation: string } {
  const FLAGS: Record<number, { risk: string; mitigation: string }> = {
    1: { risk:'Burning bridges prematurely under the PY 1 pioneer impulse — mistaking useful institutional relationships for constraint.', mitigation:'Apply a 30-day waiting period before severing any significant relationship or structure this year.' },
    2: { risk:'Emotional over-reactivity to perceived slights, damaging alliances structurally important to your current arc.', mitigation:'Build a "PY 2 filter": before acting on a perceived slight, wait 48 hours and consult a trusted third party about the interpretation.' },
    3: { risk:'Scattering creative energy across too many projects, completing none, arriving at PY 4 with nothing tangible.', mitigation:'Choose ONE primary creative vehicle before the year begins. All others are secondary.' },
    4: { risk:'Physical and psychological burnout from treating the body as a machine that needs no maintenance.', mitigation:'Build one full recovery day per week into the schedule with the same rigor as work commitments.' },
    5: { risk:'Abandoning a viable long-term structure in a moment of PY 5 restlessness that is a passing weather system, not a genuine signal.', mitigation:'Apply the "12-month rule": if the abandonment impulse is still logically justified 12 months later, it is signal. If not, it was weather.' },
    6: { risk:'Giving so completely to others that your own needs become systematically neglected, producing slow-burning resentment.', mitigation:'Schedule non-negotiable self-replenishment time weekly — frame it as maintenance of the resource others are depending on.' },
    7: { risk:'Intellectual or spiritual withdrawal becoming social isolation, damaging relationships that require consistent presence to survive.', mitigation:'Designate specific "connection days" each week — times you fully emerge from interior work to be present with people who matter.' },
    8: { risk:'Allowing the PY 8 power field to activate domineering behavior, OR allowing power\'s shadow to make you shrink from authority that is genuinely yours.', mitigation:'Run a quarterly check: am I using authority to serve or to control?' },
    9: { risk:'Using "completion" and "letting go" as spiritual justification for premature endings — fleeing commitments that still have value.', mitigation:'Distinguish: (a) what is genuinely completed — let go cleanly; (b) what is merely uncomfortable — do the work.' },
    11: { risk:'Nervous-system overwhelm: the 11 field amplifies every signal, and anxiety can be mistaken for intuition — or vice versa.', mitigation:'Separate signal from noise in writing: keep a short daily log of decisions made on "feeling" and revisit each 48 hours later.' },
    22: { risk:'Building too large before foundations are verified — the classic 22 collapse: a good plan destroyed by one unchecked assumption.', mitigation:'For every major commitment this year, write the single assumption that would undo it, and verify that assumption first.' },
    33: { risk:'Self-erasure through over-service: giving until the vessel that serves is empty, then resenting the people you chose to carry.', mitigation:'Schedule your own replenishment with the same rigor as your obligations — the 33 field collapses when the caregiver disappears.' },
  };
  // Pinnacle-modulated override
  if (pin === 8 && py !== 8) {
    return { risk:'The Pinnacle 8\'s authority shadow amplifying into either domination or self-sabotage around money and power.', mitigation:'Make financial and power decisions with a clear ethical framework written in advance of the decision moment.' };
  }
  if (ch === 4) {
    return { risk:'The Challenge 4 discipline deficit undermining whatever the current Personal Year demands — lack of follow-through is the universal tax.', mitigation:'Choose ONE daily structure to anchor this year and treat it as non-negotiable regardless of mood or external circumstance.' };
  }
  return FLAGS[py] || { risk:'Misalignment between the annual cycle\'s demands and habitual patterns of behavior, causing the year\'s gifts to pass untapped.', mitigation:'Spend the first month of each quarter consciously identifying which annual-cycle tasks are being avoided, and address one directly.' };
}

function buildThreeYearArc(py: number, bd: number, bm: number, cy: number) {
  const py1 = calcPersonalYear(bd, bm, cy + 1);
  const py2 = calcPersonalYear(bd, bm, cy + 2);
  const ARC_SUMMARIES: Record<string, string> = {
    '1-2-3':'The classic initiation-gestation-expression arc. What you launch this year goes underground in the next and blooms publicly the year after.',
    '2-3-4':'Patience-to-expression-to-foundation. Alliances built this year become creative audience next year, which in turn become the platform for serious building.',
    '3-4-5':'Expression-to-discipline-to-freedom. Capture this year\'s inspiration into real structures before PY 4 arrives; what you build becomes the launchpad for PY 5\'s dynamic disruption.',
    '4-5-6':'Discipline-to-disruption-to-heart. This year\'s grind creates the platform that next year\'s changes launch from; PY 6 rewards those who maintained relational investments during these demanding years.',
    '5-6-7':'Disruption-to-healing-to-wisdom. Changes arriving now are healed and integrated in the next year, then deepened into permanent understanding the year after.',
    '6-7-8':'Heart-to-soul-to-harvest. Love and service planted this year are deepened by next year\'s spiritual retreat and materially rewarded two years hence.',
    '7-8-9':'Soul-to-power-to-completion. Wisdom gathered in this year\'s reflection becomes the ethical foundation for next year\'s authority claims, culminating in the following year\'s great completions.',
    '8-9-1':'Climax-completion-rebirth. The harvest this year culminates in next year\'s great completions, opening into a brand new nine-year cycle two years hence.',
    '9-1-2':'Release-rebirth-consolidation. Clear completely this year — do not carry unfinished business into the PY 1\'s fresh canvas. The seeds you plant there are tended in the PY 2.',
  };
  const key = `${py}-${py1}-${py2}`;
  return {
    thisYear:  { py,  title: PY_TITLES[py],  one_line: PY_ONE_LINERS[py] },
    nextYear:  { py: py1, title: PY_TITLES[py1], one_line: PY_ONE_LINERS[py1] },
    yearAfter: { py: py2, title: PY_TITLES[py2], one_line: PY_ONE_LINERS[py2] },
    arcSummary: ARC_SUMMARIES[key] || `Your three-year arc moves from ${PY_TITLES[py]} → ${PY_TITLES[py1]} → ${PY_TITLES[py2]}. Each year\'s investments become next year\'s currency.`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export function generateTemporalPrediction(
  birthDay: number,
  birthMonth: number,
  birthYear: number,
  readYear?: number,
  readMonth?: number
): TemporalPredictionV2 {
  const now = new Date();
  const cy = readYear  ?? now.getFullYear();
  const cm = readMonth ?? now.getMonth() + 1;

  // Core numbers
  const lp       = calcLifePath(birthDay, birthMonth, birthYear);
  const psychic   = calcPsychicNumber(birthDay);
  const py        = calcPersonalYear(birthDay, birthMonth, cy);
  const pm        = calcPersonalMonth(py, cm);
  const uy        = calcUniversalYear(cy);
  const compound  = calcCompoundBirthSum(birthDay, birthMonth, birthYear);
  const destiny   = calcLifePath(birthDay, birthMonth, birthYear); // same as lp in this system
  const numberCounts = buildNumberCounts(birthDay, birthMonth, birthYear, psychic, destiny);

  const age = cy - birthYear - ((cm < birthMonth || (cm === birthMonth && 1 < birthDay)) ? 1 : 0);

  // Pinnacles
  const pins      = calcPinnacles(birthDay, birthMonth, birthYear);
  const { num: pin, stage: pinStage, ageRange } = getActivePinnacle(age, pins);
  const ch        = getActiveChallenge(age, pins);

  // ── Layer 5: Climacteric ────────────────────────────────────────────────────
  const { isClimateric, note: climNote } = getClimatericNote(age, py, lp, pin, cy);

  // ── Layer 6: Cheiro Day Intelligence ───────────────────────────────────────
  const cheiroDayIntelligence = getCheiroDayIntelligence(psychic, cm, cy);

  // ── Layer 7: Lo Shu Activation ─────────────────────────────────────────────
  const loShuActivation = getLoShuActivation(py, numberCounts, psychic, cy);

  // ── Layer 8: Missing Numbers ────────────────────────────────────────────────
  const missingNumberForecast = getMissingNumberForecast(py, numberCounts);

  // ── Layer 9: Repeated Numbers ───────────────────────────────────────────────
  const repeatedNumberAmplifier = getRepeatedNumberAmplifier(py, numberCounts);

  // ── Layer 10: Karmic Debt ───────────────────────────────────────────────────
  const karmicTrigger = detectKarmicTrigger(birthDay, py);

  // ── Layer 11: Pinnacle Transition ───────────────────────────────────────────
  const pinnacleTransitionRadar = getPinnacleTransitionRadar(age, birthMonth, pins, cy, cm);

  // ── Layer 14: Contradictions ────────────────────────────────────────────────
  const contradictions = detectContradictions(py, pin, ch, lp);

  // ── Layer 12: Probability Scores ────────────────────────────────────────────
  const baseProbabilityScores = calcProbabilityScores(
    py, pin, ch,
    isClimateric,
    karmicTrigger.isTriggered,
    pinnacleTransitionRadar.isInTransitionWindow,
    repeatedNumberAmplifier.dominantNumber,
    missingNumberForecast.activatedMissing,
    loShuActivation.strengthenedArrows.length
  );

  // ── Layer 12b — Dual-essence polarity agreement ────────────────────────────
  // The meaning layer (direct + classic compound pair) computes a polarity for
  // the year. The numeric scores must agree with it: a cautionary year cannot
  // advertise high career momentum, a constructive year cannot score as a
  // retreat. Same shared-source principle as the compatibility fix — one
  // truth, read twice.
  const directRawPY = computeRawPersonalYear(birthDay, birthMonth, cy);
  const classicRawPY = computeRawPersonalYearClassic(birthDay, birthMonth, cy);
  const dualEssence = buildPersonalYearDualEssenceSynthesis({
    birthDay, birthMonth, birthYear, targetYear: cy,
    directRaw: directRawPY, directYear: reduceNum(directRawPY),
    directCompound: lookupCompound(directRawPY),
    classicRaw: classicRawPY, classicYear: reduceNum(classicRawPY),
    classicCompound: lookupCompound(classicRawPY),
  });
  const essencePolarity = dualEssence.polarity;

  const POLARITY_ADJUST: Record<string, { career: number; fin: number; rel: number; health: number; spirit: number }> = {
    'predominantly constructive': { career: +6, fin: +5, rel: +4, health: +3, spirit: +4 },
    'predominantly cautionary':    { career: -10, fin: -8, rel: -6, health: -9, spirit: +5 },
    'mixed ordeal-and-reward':     { career: -2, fin: -2, rel: -2, health: -3, spirit: +2 },
    'threshold / transition':      { career: -4, fin: -3, rel: -3, health: -4, spirit: +3 },
  };
  const adj = POLARITY_ADJUST[essencePolarity] || { career: 0, fin: 0, rel: 0, health: 0, spirit: 0 };
  const clampScore = (v: number) => Math.min(97, Math.max(20, Math.round(v)));

  const probabilityScores: ProbabilityScores = {
    careerMomentum: clampScore(baseProbabilityScores.careerMomentum + adj.career),
    financialGrowth: clampScore(baseProbabilityScores.financialGrowth + adj.fin),
    relationshipStability: clampScore(baseProbabilityScores.relationshipStability + adj.rel),
    healthDiscipline: clampScore(baseProbabilityScores.healthDiscipline + adj.health),
    spiritualGrowth: clampScore(baseProbabilityScores.spiritualGrowth + adj.spirit),
    overallYear: 0,
  };
  // Hard consistency rule: a cautionary year must not advertise momentum.
  if (essencePolarity === 'predominantly cautionary') {
    probabilityScores.careerMomentum = Math.min(probabilityScores.careerMomentum, 52);
    probabilityScores.financialGrowth = Math.min(probabilityScores.financialGrowth, 52);
    probabilityScores.relationshipStability = Math.min(probabilityScores.relationshipStability, 48);
    probabilityScores.healthDiscipline = Math.min(probabilityScores.healthDiscipline, 50);
  }

  // ── Body-safety emphasis (tradition-based, framed as care, never fate) ───
  // Certain compounds carry documented risk motifs in the classic texts:
  // 16 the Shattered Citadel warns of 'danger of accidents'; 12 the Sacrifice
  // of 'suffering and anxiety of mind'; 22 the Fool of one who 'awakens only
  // when surrounded by danger'; 13 of upheaval. When such a compound governs
  // the year AND the life-arc context is heavy (Pinnacle 4/9, age 45+, or a
  // pinnacle transition window), the engine surfaces a body-safety emphasis
  // — the traditional reading, stated as care rather than doom.
  const riskCompound = [12, 16, 22, 13].includes(classicRawPY) || [12, 16, 22, 13].includes(directRawPY);
  const heavyContext = pin === 9 || pin === 4 || age >= 45 || pinnacleTransitionRadar.isInTransitionWindow;
  if (riskCompound && heavyContext) {
    probabilityScores.healthDiscipline = Math.min(probabilityScores.healthDiscipline, 48);
  }
  probabilityScores.overallYear = clampScore(
    (probabilityScores.careerMomentum + probabilityScores.financialGrowth +
     probabilityScores.relationshipStability + probabilityScores.healthDiscipline +
     probabilityScores.spiritualGrowth) / 5,
  );

  // ── Layer 13: Daily Forecast ────────────────────────────────────────────────
  const todayForecast = generateDailyForecast(birthDay, birthMonth, birthYear);

  // ── Strategic outputs ────────────────────────────────────────────────────────
  const headline           = buildHeadline(py, pin, ch, lp, uy, age, isClimateric, pinnacleTransitionRadar.isInTransitionWindow, cy);
  const tensionSignature   = buildTensionSignature(py, pin, ch, contradictions);
  const windowOfOpportunity = buildWindowOfOpportunity(py, birthMonth, cy);
  const cautionFlag        = buildCautionFlag(py, pin, ch);
  const threeYearArc       = buildThreeYearArc(py, birthDay, birthMonth, cy);

  return {
    meta: {
      birthDate: `${birthDay}/${birthMonth}/${birthYear}`,
      currentYear: cy, currentMonth: cm, currentAge: age,
      personalYear: py, personalMonth: pm, universalYear: uy,
      lifePath: lp, psychicNumber: psychic, compoundBirthSum: compound,
      activePinnacleNumber: pin, activePinnacleStage: pinStage,
      activePinnacleAgeRange: ageRange, activeChallenge: ch,
      essencePolarity,
    },
    headline,
    domains: {
      career:       CAREER_BY_PY[py] || '',
      relationships: REL_BY_PY[py] || '',
      finances:     FIN_BY_PY[py] || '',
      health:       HEALTH_BY_PY[py] || '',
      spirituality: SPIRIT_BY_PY[py] || '',
    },
    probabilityScores,
    cheiroDayIntelligence,
    loShuActivation,
    missingNumberForecast,
    repeatedNumberAmplifier,
    karmicTrigger,
    pinnacleTransitionRadar,
    contradictions,
    tensionSignature,
    windowOfOpportunity,
    cautionFlag,
    threeYearArc,
    isClimatericYear: isClimateric,
    climatericNote: climNote,
    todayForecast,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVENIENCE EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export { generateDailyForecast };

export function generateMonthlyBreakdown(
  birthDay: number, birthMonth: number, birthYear: number, targetYear: number
): Array<{ month: number; monthName: string; personalMonth: number; isOpportunityWindow: boolean; focus: string; luckyDatesThisMonth: number[] }> {
  const py = calcPersonalYear(birthDay, birthMonth, targetYear);
  const psychic = calcPsychicNumber(birthDay);
  const window  = buildWindowOfOpportunity(py, birthMonth, targetYear);
  const cheiro  = CHEIRO_DATA[psychic] || CHEIRO_DATA[1];

  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const pm = calcPersonalMonth(py, month);
    const optMonths: number[] = [];
    for (let m = 1; m <= 12; m++) {
      if (window.personalMonths.includes(calcPersonalMonth(py, m))) optMonths.push(m);
    }
    const daysInMonth = new Date(targetYear, month, 0).getDate();
    const luckyDatesThisMonth = cheiro.ownDates.filter(d => d <= daysInMonth);
    return {
      month, monthName: MONTH_NAMES_FULL[i], personalMonth: pm,
      isOpportunityWindow: optMonths.includes(month),
      focus: PD_FOCUS[pm] || 'Navigate with awareness',
      luckyDatesThisMonth,
    };
  });
}

export function generateMultiYearForecast(
  birthDay: number, birthMonth: number, birthYear: number,
  startYear: number, spanYears = 5
): Array<{ year: number; py: number; pinnacle: number; challenge: number; scores: ProbabilityScores; headline: string }> {
  return Array.from({ length: spanYears }, (_, i) => {
    const year = startYear + i;
    const pred = generateTemporalPrediction(birthDay, birthMonth, birthYear, year);
    return {
      year,
      py: pred.meta.personalYear,
      pinnacle: pred.meta.activePinnacleNumber,
      challenge: pred.meta.activeChallenge,
      scores: pred.probabilityScores,
      headline: pred.headline,
    };
  });
}

export function generateNotificationBatch(
  birthDay: number, birthMonth: number, birthYear: number,
  daysAhead = 7
): DailyForecast[] {
  const today = new Date();
  return Array.from({ length: daysAhead }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return generateDailyForecast(birthDay, birthMonth, birthYear, d);
  }).filter(f => f.notificationAlert !== null);
}