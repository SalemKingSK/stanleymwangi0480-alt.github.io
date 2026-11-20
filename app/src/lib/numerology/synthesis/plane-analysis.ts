/**
 * MYSTIQUE COMPASS — Psychomatrix Plane Analysis
 *
 * Four Planes of Expression (app-level synthesis layer over the Alexandrov
 * psychomatrix — see note below):
 *   Mental    — 3, 5 (if count 2–3), 9 (if count 1–2)
 *   Physical  — 1, 4, 6
 *   Emotional — 2, 5 (always), 8
 *   Intuitive — 7, 5 (if count ≥ 4), 9 (if count ≥ 3)
 *
 * 5 always contributes to Emotional as a baseline; it additionally routes to
 * Mental (count 2–3) or Intuitive (count ≥ 4) but is never double-counted
 * between Mental and Intuitive. 9 routes exclusively to Mental (count 1–2)
 * or Intuitive (count ≥ 3).
 *
 * ── NOTE ON "ALEXANDROV'S GROUPINGS" ──
 *
 * Only Emotional [2, 5, 8] matches an actual line in Alexandrov's own grid
 * (it's Row 2 verbatim — see psychomatrixLineInterpretations.ts). Mental
 * [3, 5, 9], Physical [1, 4, 6], and Intuitive [7, 5, 9] are this app's own
 * synthesis — useful conceptual groupings, but not rows/columns/diagonals
 * from the source text. Nothing here is being un-invented; it's simply
 * mislabeling to call the whole scheme "Alexandrov's groupings," so this
 * comment now says so plainly instead of implying otherwise.
 *
 * ── CONTINUOUS 5/9 ROUTING (this version) ──
 *
 * An earlier version of this file routed 5 and 9 to Mental vs. Intuitive
 * with a hard count-based switch (e.g. "count5 in [2,3] -> Mental only;
 * count5 >= 4 -> Intuitive only, 0% to Mental"). Re-reading meanings.ts
 * closely, that all-or-nothing switch doesn't match the source text at
 * several counts:
 *   - Digit 5: count 1 ("logic exists but is very weak") was being
 *     dropped entirely (0% to Mental) instead of counting as a weak
 *     signal. Count 2 ("55") explicitly includes "they foresee almost
 *     all of their mistakes in advance" — a genuinely intuitive-flavored
 *     capacity sitting inside the peak-logic entry, not just pure logic.
 *     Count 4+ was being sent 100% to Intuitive and 0% to Mental, but the
 *     text frames it as logic ITSELF transmuting into a clairvoyant gift
 *     ("a true clear-knower... a prophet"), not logic vanishing.
 *   - Digit 9: count 3 ("999") was being sent 100% to Intuitive, but the
 *     text explicitly says 999's memory, while weaker than 99's, is not
 *     zero — "preference must be given to the pair of nines" implies 999
 *     still has real (if reduced) memory, alongside emerging clairvoyance.
 *     Count 2 ("99") was correctly kept 100% Mental at baseline — the
 *     text is explicit that clairvoyance at this count does NOT arise on
 *     its own; it "ONLY" unlocks when 99 is paired with two-or-more 5s,
 *     three-or-more 7s (777), or three-or-more 6s (666). That pairing
 *     is therefore modeled as a conditional TRANSMUTATION bonus below,
 *     not as a baseline Intuitive contribution at count9 === 2.
 *
 * This version replaces the binary switch with a continuous per-count
 * FRACTIONAL SPLIT (see digit5Split / digit9Split below): each count's
 * scale-weight is divided between Mental and Intuitive according to the
 * balance the text itself describes at that count, rather than being
 * assigned wholesale to one plane or the other. The fractions at a given
 * count needn't sum to 1 — e.g. 555's fractions sum to 0.9, reflecting
 * the text's explicit claim that overall logical output is "significantly
 * weakened" at that count, not merely redistributed.
 *
 * ── WHY THIS VERSION IS DIFFERENT FROM A NAIVE RAW-COUNT SUM ──
 *
 * Alexandrov's own reference text (see psychomatrixData.ts /
 * psychomatrix/meanings.ts) does NOT treat a cell's strength as linear in
 * its digit count. Each digit has its own, digit-specific ceiling beyond
 * which additional repeats no longer intensify the reading — the source
 * material says so explicitly ("777 and Beyond", "2222 and Above", "44 or
 * More"). So instead of summing raw digit counts, this version:
 *   1. Converts each contributing cell's raw count into the qualitative
 *      "scale" tier Alexandrov himself assigns it (absent → overload), by
 *      looking that count up in PSYCHOMATRIX_CELL_MEANINGS — the same
 *      canonical table the individual cell readings elsewhere in the app
 *      already use.
 *   2. Converts each tier to a numeric weight (0–6) and sums the weights
 *      for a plane's contributing cells — the plane's "weighted score."
 *   3. Expresses each plane's percentage as its OWN weighted score against
 *      its OWN ceiling — NOT as a share of a four-way pool. Percentages
 *      reflect how fully THAT plane is expressed, independent of the
 *      others, and can legitimately sum to more or less than 100% across
 *      the four planes.
 *
 * ── TRANSMUTATIONS (new in this version) ──
 *
 * Several cell readings in meanings.ts explicitly describe how one cell's
 * meaning changes — sometimes inverts — in the presence of another. A flat
 * per-cell score can't capture that; it needs its own conditional logic.
 * This version adds a TRANSMUTATIONS registry (see below) that inspects the
 * full digit-count profile and attaches plain-language notes — and, where
 * the source text is explicit that the effect is a strengthening or
 * weakening rather than just a mood, a small bounded score adjustment — to
 * whichever plane(s) the interaction actually concerns. Each rule below
 * cites which meanings.ts passage it is derived from (paraphrased, not
 * quoted) so the mapping stays auditable. This is necessarily a partial
 * catalogue — meanings.ts contains many more narrative combinations than
 * are practical to formalize — but every rule here is grounded in an
 * explicit textual conditional, not invented.
 *
 * ALL BASE INTERPRETATION TEXT (PLANE_INTERPRETATIONS) IS ORIGINAL WRITING
 * FOR THIS FEATURE, NOT ALEXANDROV VERBATIM — there is no "four planes"
 * concept in his source material to quote from. The transmutation notes
 * are paraphrased summaries of specific meanings.ts passages, not verbatim
 * excerpts.
 */

import { PSYCHOMATRIX_CELL_MEANINGS, type PsychomatrixCellMeaning } from '../data/psychomatrixData';

export interface PlaneAnalysis {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  cells: number[];
  level: 'Deficient' | 'Developing' | 'Balanced' | 'Dominant' | 'Overwhelming';
  interpretation: string;
  transmutations: string[];
}

export interface PlaneResult {
  mental: PlaneAnalysis;
  physical: PlaneAnalysis;
  emotional: PlaneAnalysis;
  intuitive: PlaneAnalysis;
  dominantPlane: string;
  weakestPlane: string;
  synthesis: string;
}

function getLevel(percentage: number): PlaneAnalysis['level'] {
  if (percentage <= 10) return 'Deficient';
  if (percentage <= 30) return 'Developing';
  if (percentage <= 60) return 'Balanced';
  if (percentage <= 80) return 'Dominant';
  return 'Overwhelming';
}

// ─────────────────────────────────────────────────────────────────────────
// DATA-DRIVEN WEIGHTING — reads Alexandrov's own qualitative tiers instead
// of assuming raw digit count is a linear measure of strength.
// ─────────────────────────────────────────────────────────────────────────

const SCALE_WEIGHTS: Record<PsychomatrixCellMeaning['scale'], number> = {
  absent: 0,
  'very-weak': 1,
  norm: 2,
  special: 3,
  strong: 4,
  dominant: 5,
  overload: 6,
};

/**
 * Resolves a digit's raw occurrence count to its canonical Alexandrov
 * "scale" weight, using the actual per-digit tier table in
 * PSYCHOMATRIX_CELL_MEANINGS. Counts beyond a digit's highest defined tier
 * are capped at that tier's weight — matching the source text's own
 * "X or More" / "and Beyond" language.
 */
function getScaleWeight(digit: number, rawCount: number): number {
  const meanings = PSYCHOMATRIX_CELL_MEANINGS[digit]?.meanings;
  if (!meanings || meanings.length === 0) return 0;

  if (rawCount <= 0) {
    const zero = meanings.find((m) => m.count === 0);
    return zero ? SCALE_WEIGHTS[zero.scale] : 0;
  }

  let best: PsychomatrixCellMeaning | undefined;
  for (const m of meanings) {
    if (m.count <= rawCount && (!best || m.count > best.count)) best = m;
  }
  if (!best) best = meanings[0];

  return SCALE_WEIGHTS[best.scale];
}

// A stand-in for "or more" when computing a cell's own maximum possible
// weight (its ceiling tier), independent of any particular person's count.
const CEILING_PROXY = 99;

// ─────────────────────────────────────────────────────────────────────────
// FRACTIONAL MENTAL/INTUITIVE SPLIT FOR DIGITS 5 AND 9
//
// Each function returns, for a given raw count, what FRACTION of that
// count's scale-weight (from getScaleWeight) belongs to Mental vs.
// Intuitive. Grounded directly in meanings.ts's own per-count language —
// see the "CONTINUOUS 5/9 ROUTING" note at the top of this file for the
// passages behind each number. Fractions for a given count need not sum
// to 1: where the text says a count actively weakens the overall faculty
// (555), the fractions sum to less than 1; nowhere do they need to sum to
// more than 1 at baseline (further credit, where the text describes a
// genuine bonus rather than a redistribution, is added separately as a
// TRANSMUTATION rather than baked into the baseline split).
// ─────────────────────────────────────────────────────────────────────────

interface PlaneSplit {
  mental: number;
  intuitive: number;
}

/**
 * Digit 5 — meanings.ts count-by-count:
 *   0   "No-5": pure dreamer, no logic at all.              -> 0 / 0
 *   1   "logic exists... but is very weak... still a         -> 1.0 / 0
 *       dreamer" — present but purely a Mental signal.
 *   2   "55": peak — "powerful logical faculty" AND           -> .85 / .15
 *       explicitly "foresee almost all of their mistakes
 *       in advance." Overwhelmingly Mental, but the
 *       foreseeing quality is a genuine (small) Intuitive
 *       signal in its own right, independent of the 99+
 *       "clear-knowing" combo (handled as a transmutation).
 *   3   "555": logic "significantly weakens," becomes         -> .45 / .45
 *       "more of an unexpected occurrence"; "clear-knowing"
 *       flashes surface but the person doesn't trust them.
 *       Roughly even split, at a reduced total (0.9) — the
 *       text is explicit this is a net weakening, not a
 *       clean handoff from one plane to the other.
 *   4+  "true clear-knower... a prophet": logic has            -> .15 / .90
 *       essentially transmuted into a dominant intuitive
 *       gift. A small Mental residue remains (the aptitude
 *       for math/technical specialization the text still
 *       credits them with), but Intuitive now dominates.
 */
function digit5Split(count5: number): PlaneSplit {
  if (count5 <= 0) return { mental: 0, intuitive: 0 };
  if (count5 === 1) return { mental: 1.0, intuitive: 0 };
  if (count5 === 2) return { mental: 0.85, intuitive: 0.15 };
  if (count5 === 3) return { mental: 0.45, intuitive: 0.45 };
  return { mental: 0.15, intuitive: 0.9 }; // 4 or more
}

/**
 * Digit 9 — meanings.ts count-by-count:
 *   0   Not a defined entry (text treats a total absence of   -> 0 / 0
 *       9 as effectively impossible), kept at 0/0 as a safe
 *       fallback.
 *   1   "prone to forgetfulness"... but "pioneers and          -> 1.0 / 0
 *       innovators" — a Mental (memory) signal only; the
 *       text draws no Intuitive claim at this count.
 *   2   "99": peak memory — "strong memory... high             -> 1.0 / 0
 *       potential for academic/scientific study." The text
 *       is explicit that clairvoyance does NOT arise here on
 *       its own — it "ONLY" unlocks paired with 55, 777, or
 *       666 — so baseline Intuitive credit is 0; the pairing
 *       is a conditional TRANSMUTATION bonus, not baseline.
 *   3   "999": "memory must give way to... clairvoyance,"      -> .40 / .60
 *       but the text also explicitly ranks 99's memory as
 *       STRONGER than 999's ("preference must be given to
 *       the pair of nines") — so 999 keeps a real, reduced
 *       Mental share alongside its emerging (and per the
 *       text, not fully reliable — "comparative clairvoyance"
 *       when energy is weak) Intuitive share.
 *   4+  "Sign of the Prophet": dominant, highly reliable        -> .15 / .90
 *       clairvoyance. A small memory residue remains (the
 *       text still discusses "memory" being organized, not
 *       erased), but Intuitive now dominates.
 */
function digit9Split(count9: number): PlaneSplit {
  if (count9 <= 0) return { mental: 0, intuitive: 0 };
  if (count9 === 1) return { mental: 1.0, intuitive: 0 };
  if (count9 === 2) return { mental: 1.0, intuitive: 0 };
  if (count9 === 3) return { mental: 0.4, intuitive: 0.6 };
  return { mental: 0.15, intuitive: 0.9 }; // 4 or more
}

// Bounded bonus applied only when the text's own pairing condition for
// unlocking Intuitive credit at 99 is met — see the transmutation rule
// below ("99 + qualifying partner"). Kept as a named constant so it can
// be reasoned about alongside INTUITIVE_MAX, which reserves headroom for
// it rather than letting it simply saturate the ceiling immediately.
const NINE_PAIRING_INTUITIVE_BONUS = 2;

// Ceilings are computed as the actual MAXIMUM attainable weighted
// contribution across all counts 0–4 (4 standing in for "4 or more",
// since every digit's weight is capped at its own highest defined tier
// regardless of how high the count climbs) — not just the value at one
// assumed count. This matters now that a digit's contribution to a given
// plane is no longer monotonic in its count (e.g. digit 5 contributes
// MORE to Mental at count 2 than at count 4+).
function maxWeightedFraction(digit: number, split: (count: number) => PlaneSplit, plane: keyof PlaneSplit): number {
  let max = 0;
  for (let n = 0; n <= 4; n++) {
    const weight = getScaleWeight(digit, n) * split(n)[plane];
    if (weight > max) max = weight;
  }
  return max;
}

const MENTAL_MAX =
  getScaleWeight(3, CEILING_PROXY) +
  maxWeightedFraction(5, digit5Split, 'mental') +
  maxWeightedFraction(9, digit9Split, 'mental');
const PHYSICAL_MAX = getScaleWeight(1, CEILING_PROXY) + getScaleWeight(4, CEILING_PROXY) + getScaleWeight(6, CEILING_PROXY);
const EMOTIONAL_MAX = getScaleWeight(2, CEILING_PROXY) + getScaleWeight(5, CEILING_PROXY) + getScaleWeight(8, CEILING_PROXY);
const INTUITIVE_MAX =
  getScaleWeight(7, CEILING_PROXY) +
  maxWeightedFraction(5, digit5Split, 'intuitive') +
  maxWeightedFraction(9, digit9Split, 'intuitive') +
  NINE_PAIRING_INTUITIVE_BONUS;

// ─────────────────────────────────────────────────────────────────────────
// TRANSMUTATIONS — cross-cell interactions explicitly described in
// meanings.ts and psychomatrixLineInterpretations.ts, formalized as
// conditional rules. Each rule may attach a narrative note to one or more
// planes, and — only where the source text explicitly says the interaction
// strengthens or weakens the quality itself (not just its "flavor") —
// nudge that plane's score within a bounded range.
// ─────────────────────────────────────────────────────────────────────────

interface TransmutationContext {
  c: (n: number) => number;
  mentalScore: number;
  physicalScore: number;
  emotionalScore: number;
  intuitiveScore: number;
  mPct: number;
  pPct: number;
  iPct: number;
  ePct: number;
}

interface TransmutationResult {
  notes: Partial<Record<'mental' | 'physical' | 'emotional' | 'intuitive', string>>;
  /** Bounded score deltas, applied AFTER percentages are first computed from
   * base scores — used only for a second, "adjusted" pass. Small and rare
   * by design; most transmutations are narrative-only. */
  scoreDeltas?: Partial<Record<'mental' | 'physical' | 'emotional' | 'intuitive', number>>;
}

type TransmutationRule = (ctx: TransmutationContext) => TransmutationResult | null;

const TRANSMUTATION_RULES: TransmutationRule[] = [
  // Source: meanings.ts, digit 5, count-3 entry ("555 and Beyond"). The
  // text is explicit that three 5s does NOT intensify logic the way the
  // scale label "special" implies — it says the logical faculty is
  // actually WEAKENED and mostly absorbed into the family-provision line,
  // with sporadic "clear-knowing" flashes the person often doesn't trust.
  // This is now already reflected in digit5Split(3)'s reduced, sub-1.0
  // fraction total (0.45 + 0.45 = 0.9, not 1.0) rather than a separate
  // score delta on top of it — see the "CONTINUOUS 5/9 ROUTING" note at
  // the top of this file. Kept here as a narrative-only note so the
  // reasoning still surfaces to the person, without double-penalizing
  // the score.
  (ctx) => {
    if (ctx.c(5) === 3) {
      return {
        notes: {
          mental: 'Three 5s: the source text is explicit that this count actually WEAKENS sustained logical output rather than strengthening it — the energy is mostly absorbed into family/provision obligations, with occasional "clear-knowing" flashes the person often doesn\'t trust enough to act on.',
        },
      };
    }
    return null;
  },

  // Source: meanings.ts, digit 9 count-2 entry ("The '99' Memory Trait"),
  // final paragraph, together with digit 5's count-2 entry, final
  // paragraph. Both independently describe the SAME underlying pairing:
  // two-or-more 9s is, on its own, a purely Mental (memory) trait — the
  // text is explicit that intuitive-flavored perception "ONLY" appears
  // when 99 is paired with a qualifying partner: two-or-more 5s ("clear-
  // knowing," per the digit-5 entry), or three-or-more 7s / three-or-more
  // 6s (a "clairvoyance rooted in this particular configuration," per the
  // digit-9 entry). Since digit9Split(2) assigns 0 baseline Intuitive
  // credit at 99 (correctly — see note above digit9Split), this rule is
  // the ONLY place 99 can earn Intuitive credit, and only when the text's
  // own pairing condition is actually met.
  (ctx) => {
    const c5 = ctx.c(5);
    const c9 = ctx.c(9);
    const c7 = ctx.c(7);
    const c6 = ctx.c(6);
    if (c9 >= 2 && (c5 >= 2 || c7 >= 3 || c6 >= 3)) {
      const flavor =
        c5 >= 2
          ? '"clear-knowing" — foresight built from logic and memory rather than mystical intuition, and rarely wrong when it occurs'
          : 'a focused clairvoyance rooted in the specific pairing digit present (777 or 666), limited to the domain that digit governs';
      return {
        notes: {
          intuitive: `Two or more 9s paired with two or more 5s, three or more 7s, or three or more 6s: the source text is explicit that this — and only this — is what unlocks ${flavor}. Without a qualifying partner, 9s alone stay a purely Mental (memory) trait, however many are present.`,
        },
        scoreDeltas: { intuitive: NINE_PAIRING_INTUITIVE_BONUS },
      };
    }
    return null;
  },

  // Source: psychomatrixLineInterpretations.ts, Row 2 [2,5,8] transmutation
  // — a direct match for our Emotional plane. If 5 is absent, the person
  // feels but can't explain why ("Ancestral Blindness"). Narrative only —
  // the missing-5 case is already reflected in Emotional's own score via
  // getScaleWeight(5, 0).
  (ctx) => {
    if (ctx.c(5) === 0) {
      return {
        notes: {
          emotional: 'No 5s present: per Row 2\'s transmutation rule, logic is missing as the "bridge" for the heart line — feelings run strong but the person often can\'t explain their own emotional reactions ("Ancestral Blindness").',
        },
      };
    }
    return null;
  },

  // Source: psychomatrixLineInterpretations.ts, Row 1 [1,4,7] transmutation
  // — "Visionary in a Broken Car": will (1) and luck (7) present but no
  // stamina (4) to execute. 1 sits in our Physical plane, 7 in Intuitive,
  // so this is a genuine cross-plane tension under this app's grouping.
  // Narrative only.
  (ctx) => {
    if (ctx.c(1) >= 1 && ctx.c(7) >= 1 && ctx.c(4) === 0) {
      return {
        notes: {
          physical: 'Will (1) and luck (7) present without any 4s: per Row 1\'s transmutation rule, the drive and the opportunities are there, but the physical stamina to carry them out is missing — "Visionary in a Broken Car."',
          intuitive: 'Will (1) and luck (7) present without any 4s: the same Row 1 pattern shows up here as opportunities that arrive but can\'t be physically executed on.',
        },
      };
    }
    return null;
  },

  // Source: psychomatrixLineInterpretations.ts, Row 3 [3,6,9] transmutation
  // — abundant 6s without 9s produces "Slave to the Grind"; abundant 9s
  // without 6s produces "Armchair Philosopher." 6 sits in Physical, 9
  // splits Mental/Intuitive by routing. Narrative only.
  (ctx) => {
    const notes: TransmutationResult['notes'] = {};
    if (ctx.c(6) >= 3 && ctx.c(9) === 0) {
      notes.physical = 'Heavy 6s with no 9s: per Row 3\'s transmutation rule, labor and grounding are present without the wisdom/memory to know when enough is enough — "Slave to the Grind."';
    }
    const c9 = ctx.c(9);
    if (c9 >= 3 && ctx.c(6) === 0) {
      notes.intuitive = 'Heavy 9s with no 6s: per Row 3\'s transmutation rule, memory/wisdom runs without the grounding to act on it — "Armchair Philosopher."';
    } else if (c9 >= 1 && c9 <= 2 && ctx.c(6) === 0) {
      notes.mental = '9s present with no 6s: per Row 3\'s transmutation rule, ideas and recall aren\'t anchored by grounded routine — thinking can outrun follow-through.';
    }
    return Object.keys(notes).length ? { notes } : null;
  },

  // Source: psychomatrixLineInterpretations.ts, Diagonal 1 [1,5,9]
  // transmutation — "Ascension Sickness": strong Diagonal 1 without Row 3
  // grounding. Mapped here as: Intuitive plane running Dominant/
  // Overwhelming while Physical runs Deficient/Developing. Narrative only,
  // but flagged only when the pattern is pronounced on both sides.
  (ctx) => {
    const intuitiveHigh = ctx.iPct > 60;
    const physicalLow = ctx.pPct <= 30;
    if (intuitiveHigh && physicalLow) {
      const note = 'A strongly expressed Intuitive plane paired with a weak Physical plane matches Diagonal 1\'s transmutation warning: strong "vertical" perception without the grounding to bring it into ordinary life — "Ascension Sickness."';
      return { notes: { intuitive: note, physical: note } };
    }
    return null;
  },

  // Source: psychomatrixLineInterpretations.ts, Diagonal 2 [3,5,7]
  // transmutation — without a 5, the connection between the two Diagonal 2
  // digits (3 and 7) is "severed," producing purely mental or purely
  // mechanical expression instead of an integrated one. 3 sits in Mental, 7
  // in Intuitive. Narrative only.
  (ctx) => {
    if (ctx.c(5) === 0 && (ctx.c(3) >= 1 || ctx.c(7) >= 1)) {
      const notes: TransmutationResult['notes'] = {};
      if (ctx.c(3) >= 1) {
        notes.mental = 'Interest/curiosity (3) present with no 5s: per Diagonal 2\'s transmutation rule, this expresses in a purely conceptual, disconnected-from-feeling way rather than an integrated one.';
      }
      if (ctx.c(7) >= 1) {
        notes.intuitive = 'Luck/spark (7) present with no 5s: per Diagonal 2\'s transmutation rule, this expresses mechanically rather than through a felt, integrated connection.';
      }
      return { notes };
    }
    return null;
  },

  // Source: meanings.ts, digit 3 count-2 entry ("Interest '33'") — two or
  // more 3s with an equal or greater count of 5s marks a "born technician."
  // Both digits already live on Mental, so this is narrative-only, framed
  // as an aptitude note rather than a score change (the underlying counts
  // are already scored individually).
  (ctx) => {
    if (ctx.c(3) >= 2 && ctx.c(5) >= 2 && ctx.c(5) >= ctx.c(3)) {
      return {
        notes: {
          mental: 'Two or more 3s matched by an equal or greater number of 5s: the source text calls this profile a "born technician" — a natural aptitude for machinery and technical systems.',
        },
      };
    }
    return null;
  },

  // Source: meanings.ts, digit 3 count-2 entry — two 3s, two-or-more 5s, a
  // "22," and a 6 together suggest an "engineer/design specialist" profile
  // (logic + energy + hands-on craft). Spans Mental (3, 5), Emotional (2),
  // and Physical (6). Narrative only.
  (ctx) => {
    if (ctx.c(3) >= 2 && ctx.c(5) >= 2 && ctx.c(2) >= 2 && ctx.c(6) >= 1) {
      const note = 'Two or more 3s with two or more 5s, a "22," and a 6: the source text describes this combination as an engineer/design-specialist profile — strong logic, good energy, and hands-on craft together.';
      return { notes: { mental: note, physical: note, emotional: note } };
    }
    return null;
  },
];

function collectTransmutations(ctx: TransmutationContext) {
  const notes: Record<'mental' | 'physical' | 'emotional' | 'intuitive', string[]> = {
    mental: [],
    physical: [],
    emotional: [],
    intuitive: [],
  };
  const deltas: Record<'mental' | 'physical' | 'emotional' | 'intuitive', number> = {
    mental: 0,
    physical: 0,
    emotional: 0,
    intuitive: 0,
  };

  for (const rule of TRANSMUTATION_RULES) {
    const result = rule(ctx);
    if (!result) continue;
    (Object.keys(result.notes) as Array<keyof typeof notes>).forEach((plane) => {
      const note = result.notes[plane];
      if (note) notes[plane].push(note);
    });
    if (result.scoreDeltas) {
      (Object.keys(result.scoreDeltas) as Array<keyof typeof deltas>).forEach((plane) => {
        deltas[plane] += result.scoreDeltas![plane] ?? 0;
      });
    }
  }

  return { notes, deltas };
}

const PLANE_INTERPRETATIONS: Record<string, Record<PlaneAnalysis['level'], string>> = {
  mental: {
    Deficient: `MENTAL PLANE — DEFICIENT (Cells 3-5-9: depleted)\n\nThe Mental Plane represents your relationship with intellect, analysis, and structured thinking. A deficient Mental Plane indicates that logical, analytical thinking is not your natural operating system — not that you lack intelligence, but that your intelligence operates through DIFFERENT CHANNELS (likely intuition or emotional intelligence).\n\nTHE GIFT: You are not imprisoned by your own thinking. Where highly mental types get trapped in loops of overanalysis, you move directly to insight through other pathways. Your mind, when engaged, tends to be clear rather than cluttered.\n\nTHE CHALLENGE: You may struggle with tasks that require sustained analytical focus — detailed planning, systematic problem-solving, or communication that requires precise logical structure. Others may mistakenly perceive you as less intelligent when you are simply processing differently.\n\nTHE PRESCRIPTION: Develop mental discipline not as your primary mode but as a SUPPLEMENTARY tool. Structured practices (daily journaling, learning a system like chess or coding) build the mental musculature without requiring you to become someone you are not.`,

    Developing: `MENTAL PLANE — DEVELOPING (Cells 3-5-9: emerging)\n\nThe Mental Plane is present but not dominant in your constitution. You possess the capacity for analytical thought, but it requires conscious effort and tends to be intermittent rather than continuous. Your natural intelligence expresses through intuition, experience, or emotional wisdom more readily than through pure logic.\n\nTHE GIFT: You can think when thinking is needed without being trapped in constant mental activity. Your mind serves your purposes rather than running endlessly on its own momentum.\n\nTHE CHALLENGE: You may find that sustained intellectual work exhausts you more quickly than it does purely mental types — not because you are less capable, but because mental energy is a resource you spend rather than a current you continuously draw.\n\nTHE PRESCRIPTION: Honor your mental energy as a finite resource. Schedule analytical work during your peak energy periods. Supplement your thinking with physical movement — walking meetings, standing desks, or alternating mental and physical tasks throughout the day.`,

    Balanced: `MENTAL PLANE — BALANCED (Cells 3-5-9: integrated)\n\nThe Mental Plane is well-integrated in your constitution — you possess genuine intellectual capacity without being dominated by it. You can think analytically when the situation demands it, but your thinking is grounded in other modes of knowing (physical, emotional, intuitive). This balance is relatively rare and represents the ideal: the mind as a SERVANT rather than a master.\n\nTHE GIFT: You combine analytical clarity with practical wisdom. Your conclusions are both logically sound and experientially tested. Others seek your judgment because it integrates what pure thinkers often miss: the human dimension.\n\nTHE CHALLENGE: In environments that demand exclusively analytical performance, you may feel pressure to suppress your other ways of knowing and operate purely intellectually — a mode that disconnects you from your full capacity.\n\nTHE PRESCRIPTION: Trust your balanced constitution. When the purely analytical answer feels wrong, it usually IS wrong — your other ways of knowing are intercepting data the intellect alone cannot process.`,

    Dominant: `MENTAL PLANE — DOMINANT (Cells 3-5-9: emphasized)\n\nThe Mental Plane dominates your constitution. You live primarily in the world of ideas, analysis, and structured thought. Your natural impulse is to UNDERSTAND before you act, to analyze before you feel, and to reason your way through problems that others solve through intuition or experience.\n\nTHE GIFT: Your analytical capacity is genuine and formidable. You see logical structures, patterns, and implications that others miss entirely. You can deconstruct complex problems into manageable components and solve them systematically.\n\nTHE CHALLENGE: The mind that is your greatest tool can become your prison. Overanalysis leads to paralysis. Excessive mental activity can disconnect you from your body, your emotions, and your intuition — the very sources of wisdom that would make your thinking more complete.\n\nTHE PRESCRIPTION: Practice GETTING OUT OF YOUR HEAD daily. Physical exercise, creative expression, and embodied practices (dance, yoga, martial arts) are not recreational luxuries but essential counterbalances to your dominant mental mode. Learn to trust decisions that feel right before you can articulate why.`,

    Overwhelming: `MENTAL PLANE — OVERWHELMING (Cells 3-5-9: extreme)\n\nThe Mental Plane is not merely dominant but OVERWHELMING in your constitution. You live almost entirely in your head, and the activity there is CONSTANT — a stream of analysis, worry, planning, and conceptual elaboration that rarely ceases. Others may find you brilliant but exhausting; you may find yourself brilliant but exhausted.\n\nTHE GIFT: Your intellectual capacity is extraordinary. You are capable of insights and analytical achievements that others literally cannot access. When your mind is directed toward worthy problems, you produce solutions of genuine significance.\n\nTHE CHALLENGE: The unceasing mental activity is depleting your other resources — physical health, emotional connection, intuitive perception. The mind that never rests eventually breaks. Anxiety, insomnia, and a profound sense of isolation (even when surrounded by people) are common companions.\n\nTHE PRESCRIPTION: Radical intervention in your relationship with thinking is required. Daily embodied practice is NON-NEGOTIABLE — not optional, not "when you have time." Consider meditation, but also consider that some overdeveloped mental types worsen through meditation if it becomes another form of mental control. Physical exhaustion through exercise, manual labor, or sport may be more effective as a direct counterweight.`,
  },
  physical: {
    Deficient: `PHYSICAL PLANE — DEFICIENT (Cells 1-4-6: depleted)\n\nThe Physical Plane represents your relationship with the material world, your body, and practical action. A deficient Physical Plane indicates that embodiment — the experience of being IN a body navigating a physical world — is not your natural orientation. You live more in mind, emotion, or spirit than in the physical realm.\n\nTHE GIFT: Your relative disconnection from the physical gives you access to dimensions of experience — intellectual, emotional, spiritual — that physically dominant types may never access. You can be extraordinarily perceptive about the non-physical dimensions of existence.\n\nTHE CHALLENGE: The physical world makes demands that cannot be met through intellect or emotion alone. Practical tasks, physical health, and the maintenance of material existence may feel burdensome or overwhelming. You may neglect your body until it forces attention through illness or exhaustion.\n\nTHE PRESCRIPTION: Approach the physical world not as distraction from your true life but as the FOUNDATION that makes that life possible. Small, consistent physical practices are more effective than ambitious fitness regimes you will abandon. A daily walk, a simple stretching routine, or regular manual work can ground you without overwhelming you.`,

    Developing: `PHYSICAL PLANE — DEVELOPING (Cells 1-4-6: emerging)\n\nThe Physical Plane is present but not dominant in your constitution. You inhabit your body and engage with the material world, but physicality is not your primary mode of expression. Your relationship with the physical is functional rather than passionate.\n\nTHE GIFT: You are not trapped in materialism — you can engage with the physical world without being defined by it. You appreciate comfort without being enslaved to luxury. You work with your hands when needed but are not limited to manual labor.\n\nTHE CHALLENGE: In highly physical environments, you may fatigue more quickly than natural athletes or manual workers. Your body may signal distress subtly rather than dramatically, and you may miss these signals until conditions become serious.\n\nTHE PRESCRIPTION: Develop a PHYSICAL PRACTICE you genuinely enjoy — not because you "should exercise" but because the right physical practice becomes a source of pleasure and grounding. Experiment widely: some developing-physical types discover unexpected athletic capacity in specific domains.`,

    Balanced: `PHYSICAL PLANE — BALANCED (Cells 1-4-6: integrated)\n\nThe Physical Plane is well-integrated in your constitution. You are comfortable in your body, competent in the material world, and generally effective at translating intention into action. The physical dimension of existence is neither a burden nor an obsession but a natural and reliable aspect of your being.\n\nTHE GIFT: You combine practical effectiveness with other ways of knowing. You can think AND do. You can feel AND act. Your physical health tends to be robust when basic self-care is maintained.\n\nTHE CHALLENGE: The very reliability of your physical plane may lead you to take it for granted — pushing through fatigue, ignoring body signals, and assuming the physical foundation will always support you without deliberate maintenance.\n\nTHE PRESCRIPTION: Celebrate and maintain your physical competence through regular practice. The balanced plane requires less dramatic intervention than the deficient or overwhelming, but it still requires ATTENTION. Treat your body as a valued instrument rather than a reliable appliance.`,

    Dominant: `PHYSICAL PLANE — DOMINANT (Cells 1-4-6: emphasized)\n\nThe Physical Plane dominates your constitution. You experience life primarily through your body and through practical action in the material world. Your natural impulse is to DO rather than to think, to move rather than to contemplate, and to engage physically with problems that others approach intellectually or emotionally.\n\nTHE GIFT: Your practical capacity is formidable. You are effective, reliable, and capable of sustained physical action that other types cannot match. In crisis situations, you are the one who acts while others are still processing. You build, you create, you make things real.\n\nTHE CHALLENGE: The physical dominance can crowd out other modes of experience. You may struggle with introspection, emotional nuance, or spiritual perception — not because you lack the capacity but because you have not developed the habit. Others may perceive you as insensitive or unreflective.\n\nTHE PRESCRIPTION: Develop the inner life as deliberately as you have developed the outer. Journaling, therapy, meditation, or artistic practice are not indulgences but the cultivation of capacities your dominant plane has left underdeveloped. The goal is not to become less physical but to balance your formidable physicality with equivalent interior depth.`,

    Overwhelming: `PHYSICAL PLANE — OVERWHELMING (Cells 1-4-6: extreme)\n\nThe Physical Plane is not merely dominant but OVERWHELMING. You experience life so intensely through the body and material action that other dimensions of existence barely register. The physical must be attended to CONSTANTLY — activity, stimulation, achievement, acquisition.\n\nTHE GIFT: Your physical drive and practical capacity are extraordinary. You can achieve material success and physical accomplishments that others literally cannot. Your energy is genuinely formidable.\n\nTHE CHALLENGE: The relentless physical focus creates a profound inner poverty. When the body finally demands rest (as it must), you are left with an interior landscape you have never developed — no emotional vocabulary, no spiritual resources, no capacity for quiet contentment. Burnout, addiction, and existential crisis are common when the physical plane finally exhausts itself.\n\nTHE PRESCRIPTION: The development of interior life is no longer optional but URGENT. This does not mean abandoning the physical but complementing it. Begin with small practices of stillness — five minutes of silence daily, one hour weekly without activity or stimulation. Learn to be rather than do. The goal is not physical weakness but the integration of physical strength with emotional and spiritual depth.`,
  },
  emotional: {
    Deficient: `EMOTIONAL PLANE — DEFICIENT (Cells 2-5-8: depleted)\n\nThe Emotional Plane represents your relationship with feelings — your own and others'. A deficient Emotional Plane indicates that you experience emotion less intensely or less frequently than most people, and that the emotional dimension of life is not your natural habitat. You process experience through intellect, action, or intuition rather than through feelings.\n\nTHE GIFT: You are not ruled by emotion. In situations where others are overwhelmed by feelings, you remain clear-headed and capable of action. Your judgment is not clouded by sentiment, and your decisions are genuinely rational rather than rationalized emotion.\n\nTHE CHALLENGE: You may struggle to access, identify, or express your own feelings — and equally struggle to perceive or respond appropriately to the feelings of others. This is not coldness but a genuine limitation in emotional perception, much like a color-blind person's limitation in color perception.\n\nTHE PRESCRIPTION: Develop emotional intelligence as a DELIBERATE SKILL rather than expecting it to arise naturally. Practices that systematically build emotional vocabulary (emotion wheels, feeling journals), coupled with safe relationships where emotional expression is explicitly encouraged, can develop capacities that your constitution does not provide spontaneously.`,

    Developing: `EMOTIONAL PLANE — DEVELOPING (Cells 2-5-8: emerging)\n\nThe Emotional Plane is present but not dominant. You experience feelings genuinely, but your relationship with emotion may be inconsistent — sometimes flooded, sometimes numb; sometimes deeply empathetic, sometimes inexplicably disconnected. Your emotional life is a developing territory rather than a settled landscape.\n\nTHE GIFT: You possess emotional access without emotional overwhelm. You can feel deeply when the situation calls for it without being incapacitated by feeling. You are in the process of developing emotional intelligence as a conscious capacity rather than an instinctive function.\n\nTHE CHALLENGE: The inconsistency of emotional access can confuse both you and others. People who experienced you as deeply empathetic on one occasion may be shocked by your apparent emotional absence on another. You may question whether your feelings are "real" when they fluctuate so dramatically.\n\nTHE PRESCRIPTION: Emotional inconsistency is not a flaw but a characteristic of a developing emotional plane. Consistent emotional practice — regular check-ins with yourself, honest emotional communication in safe relationships — stabilizes the plane over time. Patience with yourself is essential; the emotional plane develops slowly.`,

    Balanced: `EMOTIONAL PLANE — BALANCED (Cells 2-5-8: integrated)\n\nThe Emotional Plane is well-integrated — you possess genuine emotional access, the capacity to empathize deeply with others, and the ability to process emotions without being overwhelmed by them. This balance is a significant gift: you can feel fully while remaining functional.\n\nTHE GIFT: Your emotional intelligence is a genuine resource. You navigate relationships with skill, perceive emotional dynamics that others miss, and provide a kind of emotional presence that is healing simply to be near. Your feelings inform your decisions without distorting them.\n\nTHE CHALLENGE: The very naturalness of your emotional capacity may lead you to overextend — becoming the emotional support for too many people, absorbing others' emotional states without sufficient protection, and neglecting the emotional maintenance that even a balanced plane requires.\n\nTHE PRESCRIPTION: Honor your emotional capacity as the gift it is while establishing clear boundaries around its use. You are not obligated to feel for everyone, heal everyone, or carry everyone's emotional weight. Your emotional health requires the same deliberate maintenance as physical health — regular practices that restore emotional equilibrium.`,

    Dominant: `EMOTIONAL PLANE — DOMINANT (Cells 2-5-8: emphasized)\n\nThe Emotional Plane dominates your constitution. You experience life primarily through feelings — your own and others'. Before you think, you feel. Before you act, you feel. The emotional dimension of any situation is not one factor among many but the PRIMARY dimension through which all others are filtered.\n\nTHE GIFT: Your emotional intelligence is extraordinary. You perceive emotional dynamics with an accuracy that approaches the supernatural. Others feel seen, understood, and healed in your presence. You possess what is sometimes called "emotional genius" — the capacity to navigate the human heart with an expertise that intellect alone cannot match.\n\nTHE CHALLENGE: Emotional dominance can make you vulnerable to emotional overwhelm. Your permeable boundaries mean you absorb others' emotional states involuntarily. Decisions that require emotional detachment are genuinely difficult. In environments of high emotional toxicity, you may function poorly or not at all.\n\nTHE PRESCRIPTION: Develop EMOTIONAL BOUNDARIES as a deliberate practice. Distinguish between empathizing (understanding another's feeling) and absorbing (taking on another's feeling). Learn to ask: "Is this mine?" before assuming any feeling you experience is your own. Protect your emotional health with the same vigilance others apply to physical safety.`,

    Overwhelming: `EMOTIONAL PLANE — OVERWHELMING (Cells 2-5-8: extreme)\n\nThe Emotional Plane is not merely dominant but OVERWHELMING. You are so porous to emotion — your own and others' — that maintaining emotional equilibrium requires constant, exhausting effort. Your feelings are not just intense but all-encompassing; they color every perception, influence every decision, and can shift your entire reality in moments.\n\nTHE GIFT: Your emotional depth and empathic capacity are of an order that most people cannot comprehend. You are capable of love, compassion, and emotional perception that transcend the ordinary. You sense what others feel before they feel it themselves.\n\nTHE CHALLENGE: The intensity of your emotional experience is genuinely disabling in ordinary circumstances. You may struggle to function in workplaces, social situations, or even relationships because the emotional volume is simply too high. You are prone to emotional exhaustion, burnout, and diagnoses that attempt to pathologize what is fundamentally a constitutional extreme.\n\nTHE PRESCRIPTION: Your emotional life requires STRUCTURED MANAGEMENT — not suppression but regulation. Identify environments, people, and practices that stabilize you versus those that destabilize you, and organize your life accordingly — not from avoidance but from self-knowledge. Like a person with extreme physical sensitivity who cannot tolerate certain environments, your emotional constitution is not a flaw but a FACT that must be honored through intelligent life design.`,
  },
  intuitive: {
    Deficient: `INTUITIVE PLANE — DEFICIENT (Cells 7-5-9: depleted)\n\nThe Intuitive Plane represents your connection to direct knowing — the perception of truth that bypasses the ordinary processes of reasoning, feeling, or sensory experience. A deficient Intuitive Plane indicates that you process life through established channels (thought, feeling, action) rather than through the more mysterious channel of direct intuition.\n\nTHE GIFT: You are grounded in verifiable reality. Your decisions are based on evidence, logic, and experience rather than on hunches that may or may not prove reliable. You are not subject to the confusion that afflicts intuitive types who cannot distinguish between genuine guidance and random mental noise.\n\nTHE CHALLENGE: You may miss insights that are not accessible through your established channels. Patterns that require intuitive leaps rather than logical deduction may elude you. Creative and spiritual dimensions of experience may feel inaccessible or unreal.\n\nTHE PRESCRIPTION: Intuition can be developed as a capacity, much like physical fitness. Meditation, dream journaling, and the practice of making small decisions based on "first impulse" (then tracking results) can open intuitive channels that your constitution does not naturally provide.`,

    Developing: `INTUITIVE PLANE — DEVELOPING (Cells 7-5-9: emerging)\n\nThe Intuitive Plane is present but inconsistent. You experience moments of genuine intuitive insight — the sudden knowing, the inexplicable certainty, the hunch that proves correct — but these experiences are sporadic rather than reliable. The intuitive channel is opening but not yet fully integrated.\n\nTHE GIFT: You have access to a way of knowing that supplements your rational and emotional intelligence. When intuition speaks, it provides insights your other channels cannot access. You are in the process of discovering a dimension of perception that will become increasingly valuable.\n\nTHE CHALLENGE: The inconsistency of intuitive access makes it difficult to trust. When intuition has been spectacularly right on some occasions and spectacularly wrong on others, you may vacillate between uncritical acceptance of every impulse and cynical rejection of all intuition.\n\nTHE PRESCRIPTION: Approach intuition as a skill to be developed rather than a gift to be received (or not). Keep an intuition journal: record hunches, track outcomes, and notice patterns in when your intuition is most reliable versus when it is not. Over time, you will develop discernment — the capacity to distinguish genuine intuitive insight from projection, wishful thinking, and random mental noise.`,

    Balanced: `INTUITIVE PLANE — BALANCED (Cells 7-5-9: integrated)\n\nThe Intuitive Plane is well-integrated — you possess reliable access to direct knowing that supplements and enriches your other ways of knowing. Your intuition is not a mysterious force that occasionally overwhelms you but a trusted advisor whose counsel you have learned to recognize and heed.\n\nTHE GIFT: You combine rational analysis, emotional intelligence, and intuitive perception in a genuinely integrated way. You can think through a problem, feel your way into it, AND sense its deeper dimensions — then synthesize all three into a response that is wiser than any single channel could produce.\n\nTHE CHALLENGE: The balance itself can be misleading. Because your intuition is generally reliable, you may fail to notice when it is not — when projection or wishful thinking is masquerading as genuine guidance. The balanced intuitive sometimes needs to verify.\n\nTHE PRESCRIPTION: Maintain your intuitive channel through regular practice — meditation, time in nature, creative expression. The intuitive plane, like all planes, requires maintenance to remain healthy. Trust your intuition while periodically subjecting it to the discipline of verification, especially in high-stakes decisions.`,

    Dominant: `INTUITIVE PLANE — DOMINANT (Cells 7-5-9: emphasized)\n\nThe Intuitive Plane dominates your constitution. You perceive reality through a channel that is more direct, more immediate, and more mysterious than the ordinary processes of thought or feeling. You often KNOW without being able to explain how you know. Others find this unsettling or miraculous depending on context.\n\nTHE GIFT: Your intuitive capacity is authentic and formidable. You perceive patterns, connections, and implications that others cannot access through any amount of analysis. Your insights arrive whole and complete, bypassing the step-by-step reasoning that others require. In creative, strategic, and spiritual domains, you operate at a level others cannot match.\n\nTHE CHALLENGE: Strong intuition without equivalent grounding in rational thought or emotional intelligence can become unreliable. You may act on intuitive impulses that are accurate about the WHAT but wrong about the HOW or WHEN. Others may dismiss your insights because you cannot explain your reasoning, creating isolation and frustration.\n\nTHE PRESCRIPTION: Develop the CAPACITY TO ARTICULATE your intuitive insights. This does not mean abandoning intuition for logic but building the bridge between them — learning to translate intuitive knowing into forms others can understand. Additionally, learn to test your intuition against reality periodically. Even the most gifted intuitive benefits from the discipline of verification.`,

    Overwhelming: `INTUITIVE PLANE — OVERWHELMING (Cells 7-5-9: extreme)\n\nThe Intuitive Plane is not merely dominant but OVERWHELMING. You are so open to intuitive perception that establishing boundaries between your own psyche and the collective unconscious is difficult or impossible. Insights, visions, and knowing arrive unbidden and often unmanageably — a fire hose of psychic data that you did not request and cannot turn off.\n\nTHE GIFT: Your intuitive and potentially psychic capacity is of a genuinely extraordinary order. You perceive dimensions of reality that most people do not believe exist. You are, in the most literal sense, a channel for information that transcends ordinary perception.\n\nTHE CHALLENGE: Unmanaged intuitive overwhelm is disabling. The inability to distinguish between your own thoughts and externally received impressions, the constant intrusion of psychic data, and the sheer exhaustion of processing non-ordinary perception can make ordinary life extraordinarily difficult. Psychological confusion, spiritual crisis, and social isolation are common.\n\nTHE PRESCRIPTION: Grounding is ESSENTIAL and non-negotiable. Physical practices, time in nature, manual work, and deliberate engagement with the material world provide the anchor that makes your intuitive capacity sustainable. Additionally, seek training in psychic protection and energetic boundaries — not because you should suppress your gift but because a gift without the capacity to regulate it is a burden. The goal is not less intuition but more control over WHEN and HOW you are intuitive.`,
  },
};

export function analyzePlanes(numberCounts: Record<number, number>): PlaneResult {
  const c = (n: number) => numberCounts[n] || 0;

  const count5 = c(5);
  const count9 = c(9);

  // ── Continuous fractional routing for 5 and 9 (see digit5Split /
  // digit9Split and the "CONTINUOUS 5/9 ROUTING" doc note above) — each
  // digit's scale-weight for the person's actual count is split between
  // Mental and Intuitive according to what that specific count's
  // meanings.ts entry describes, rather than being assigned wholesale to
  // one plane based on a count threshold. ──
  const split5 = digit5Split(count5);
  const split9 = digit9Split(count9);
  const weight5 = getScaleWeight(5, count5);
  const weight9 = getScaleWeight(9, count9);

  // ── Base weighted scores ──
  const baseMentalScore =
    getScaleWeight(3, c(3)) +
    weight5 * split5.mental +
    weight9 * split9.mental;

  const basePhysicalScore =
    getScaleWeight(1, c(1)) +
    getScaleWeight(4, c(4)) +
    getScaleWeight(6, c(6));

  const baseEmotionalScore =
    getScaleWeight(2, c(2)) +
    getScaleWeight(5, count5) + // 5 always contributes here as a baseline
    getScaleWeight(8, c(8));

  const baseIntuitiveScore =
    getScaleWeight(7, c(7)) +
    weight5 * split5.intuitive +
    weight9 * split9.intuitive;

  const clamp = (score: number, max: number) => Math.max(0, Math.min(max, score));

  // First pass — percentages purely from base scores, used as input to the
  // transmutation rules that key off percentage tiers (e.g. Ascension
  // Sickness, which compares Intuitive and Physical percentages).
  const prelimPct = (score: number, max: number) =>
    Math.max(0, Math.min(100, Math.round((score / max) * 100)));

  const transmutations = collectTransmutations({
    c,
    mentalScore: baseMentalScore,
    physicalScore: basePhysicalScore,
    emotionalScore: baseEmotionalScore,
    intuitiveScore: baseIntuitiveScore,
    mPct: prelimPct(baseMentalScore, MENTAL_MAX),
    pPct: prelimPct(basePhysicalScore, PHYSICAL_MAX),
    ePct: prelimPct(baseEmotionalScore, EMOTIONAL_MAX),
    iPct: prelimPct(baseIntuitiveScore, INTUITIVE_MAX),
  });

  // Apply bounded score deltas from transmutations, then clamp to each
  // plane's own valid range [0, MAX].
  const mentalScore = clamp(baseMentalScore + transmutations.deltas.mental, MENTAL_MAX);
  const physicalScore = clamp(basePhysicalScore + transmutations.deltas.physical, PHYSICAL_MAX);
  const emotionalScore = clamp(baseEmotionalScore + transmutations.deltas.emotional, EMOTIONAL_MAX);
  const intuitiveScore = clamp(baseIntuitiveScore + transmutations.deltas.intuitive, INTUITIVE_MAX);

  const mPct = Math.max(0, Math.min(100, Math.round((mentalScore    / MENTAL_MAX)    * 100)));
  const pPct = Math.max(0, Math.min(100, Math.round((physicalScore  / PHYSICAL_MAX)  * 100)));
  const ePct = Math.max(0, Math.min(100, Math.round((emotionalScore / EMOTIONAL_MAX) * 100)));
  const iPct = Math.max(0, Math.min(100, Math.round((intuitiveScore / INTUITIVE_MAX) * 100)));

  // Scores are rounded to one decimal for display only; percentages above
  // (mPct/pPct/ePct/iPct) are computed from the unrounded values.
  const round1 = (n: number) => Math.round(n * 10) / 10;

  const mental: PlaneAnalysis = { name: 'Mental', score: round1(mentalScore), maxScore: MENTAL_MAX, percentage: mPct, cells: [3, 5, 9], level: getLevel(mPct), interpretation: PLANE_INTERPRETATIONS.mental[getLevel(mPct)], transmutations: transmutations.notes.mental };
  const physical: PlaneAnalysis = { name: 'Physical', score: round1(physicalScore), maxScore: PHYSICAL_MAX, percentage: pPct, cells: [1, 4, 6], level: getLevel(pPct), interpretation: PLANE_INTERPRETATIONS.physical[getLevel(pPct)], transmutations: transmutations.notes.physical };
  const emotional: PlaneAnalysis = { name: 'Emotional', score: round1(emotionalScore), maxScore: EMOTIONAL_MAX, percentage: ePct, cells: [2, 5, 8], level: getLevel(ePct), interpretation: PLANE_INTERPRETATIONS.emotional[getLevel(ePct)], transmutations: transmutations.notes.emotional };
  const intuitive: PlaneAnalysis = { name: 'Intuitive', score: round1(intuitiveScore), maxScore: INTUITIVE_MAX, percentage: iPct, cells: [7, 5, 9], level: getLevel(iPct), interpretation: PLANE_INTERPRETATIONS.intuitive[getLevel(iPct)], transmutations: transmutations.notes.intuitive };

  const planes = [mental, physical, emotional, intuitive];
  planes.sort((a, b) => b.percentage - a.percentage);
  const dominantPlane = planes[0]!.name;
  const weakestPlane = planes[3]!.name;

  const DOMINANT_SYNTHESIS: Record<string, string> = {
    Mental: 'You are constitutionally oriented toward the life of the mind. Your primary mode of engagement is THINKING — analysis, planning, conceptual understanding. The challenge is that excessive mental activity disconnects you from body, feelings, and intuition. The integration is to USE your mental dominance as a tool rather than letting it use you.',
    Physical: 'You are constitutionally oriented toward action and the material world. Your primary mode of engagement is DOING — building, moving, achieving tangible results. The challenge is that excessive physical activity crowds out interior life. The integration is to develop the inner dimensions (thought, feeling, intuition) to complement your natural effectiveness.',
    Emotional: 'You are constitutionally oriented toward feeling and relationship. Your primary mode of engagement is CONNECTING — empathizing, nurturing, experiencing the emotional dimension of life. The challenge is that excessive emotional openness creates vulnerability to overwhelm. The integration is to develop boundaries that protect without closing the heart.',
    Intuitive: 'You are constitutionally oriented toward direct knowing and spiritual perception. Your primary mode of engagement is SENSING — the immediate apprehension of truth beyond logic or feeling. The challenge is that excessive intuitive openness creates confusion between genuine guidance and psychic noise. The integration is to ground your intuition in practical life.',
  };

  const allTransmutationNotes = [
    ...mental.transmutations,
    ...physical.transmutations,
    ...emotional.transmutations,
    ...intuitive.transmutations,
  ];
  // De-duplicate notes that were intentionally attached to more than one
  // plane (e.g. the "clear-knowing" or "Visionary in a Broken Car" notes).
  const uniqueTransmutationNotes = Array.from(new Set(allTransmutationNotes));
  const transmutationBlock = uniqueTransmutationNotes.length
    ? `\n\nCROSS-CELL TRANSMUTATIONS DETECTED:\n${uniqueTransmutationNotes.map((n) => `• ${n}`).join('\n')}`
    : '';

  const synthesis = `PLANE SYNTHESIS — Dominant: ${dominantPlane} / Weakest: ${weakestPlane}\n\n${DOMINANT_SYNTHESIS[dominantPlane] || ''}\n\nYOUR FOUR PLANES:\n• Mental   (${mental.percentage}%): ${mental.level} — Cells 3-5-9 · intellect, logic, and structured thought\n• Physical (${physical.percentage}%): ${physical.level} — Cells 1-4-6 · body, action, and material engagement\n• Emotional (${emotional.percentage}%): ${emotional.level} — Cells 2-5-8 · feeling, empathy, and relationship\n• Intuitive (${intuitive.percentage}%): ${intuitive.level} — Cells 7-5-9 · direct knowing and spiritual perception\n\nNote: Cell 5 always contributes to the Emotional plane; it also routes to Mental (if count is 2–3) or Intuitive (if count ≥ 4). Cell 9 routes to Mental (count 1–2) or Intuitive (count ≥ 3). Each plane's percentage reflects how fully that plane is expressed relative to its own maximum, not a share split against the other three.${transmutationBlock}\n\nThe relationship between your strongest plane (${dominantPlane}) and your weakest plane (${weakestPlane}) defines your primary growth edge. The tendency will be to rely entirely on the ${dominantPlane} and neglect the ${weakestPlane} — but genuine integration requires developing the neglected plane to at least functional capacity while maintaining the dominant plane's natural strength.`;

  return { mental, physical, emotional, intuitive, dominantPlane, weakestPlane, synthesis };
}