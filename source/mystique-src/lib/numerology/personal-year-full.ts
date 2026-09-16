/**
 * MYSTIQUE COMPASS — Personal Year & Universal Year Meanings
 *
 * Full verbatim interpretations for all 9 Personal Years and
 * the Universal Year (current calendar year vibration).
 *
 * ALL TEXT IS VERBATIM.
 */
import {
  lookupCompound,
  type ChaldeanPYNCompound,
} from "@/lib/numerology/chaldean-pyn-compounds";
import {
  buildPersonalYearDualEssenceSynthesis,
  type PersonalYearDualEssenceSynthesis,
} from "@/lib/numerology/personal-year-synthesis";
export interface PersonalYearResult {
  year: number;
  rawYear: number; // unreduced compound total (e.g. 28 + 2 + 8 = 38), before final reduction
  title: string;
  interpretation: string;
  // ── Classic (pre-reduced-components) system, shown alongside the above ──
  // Both conventions are genuinely used in numerology practice; the app
  // surfaces both rather than picking one as "correct." See
  // computeRawPersonalYearClassic below for the exact difference.
  yearClassic: number;
  rawYearClassic: number;
  titleClassic: string;
  interpretationClassic: string;
  // ── Historical-calibrated dual-essence synthesis ────────────────────────
  // This is the upgraded prediction layer: Direct essence is interpreted as
  // the visible/external manifestation field, Classic essence as the older
  // Chaldean karmic storyline. It adds age modifiers, master-number handling,
  // danger/karmic alerts, historical calibration and practical prediction maps.
  dualEssence: PersonalYearDualEssenceSynthesis;
  dualEssenceTitle: string;
  dualEssenceSynthesis: string;
  predictionFocusAreas: string[];
  protectiveActions: string[];
  intensityScore: number;
  polarity: PersonalYearDualEssenceSynthesis["polarity"];
}
export interface UniversalYearResult {
  yearNumber: number;
  calendarYear: number;
  title: string;
  interpretation: string;
}
/** One-pass digit sum — sums individual digits exactly once, no further reduction.
 * e.g. 1970 → 17 (held at 17, never collapsed to 8) */
export function digitSumOnce(n: number): number {
  return String(Math.abs(n))
    .split("")
    .reduce((a: number, c: string) => a + +c, 0);
}
export function reduceNum(n: number): number {
  let val = Math.abs(n);
  // Check for a master number at EVERY step of the reduction, not just on the
  // original input — otherwise a value like 38 (3+8=11, then 1+1=2) blows
  // straight through the master number it passes through on its way down.
  // Once an intermediate sum lands on 11, 22, or 33, the reduction stops there.
  while (val > 9 && val !== 11 && val !== 22 && val !== 33) {
    val = String(val)
      .split("")
      .reduce((a: number, d: string) => a + +d, 0);
  }
  return val;
}
/** Reduces a number all the way to a single digit (1-9), bypassing master
 * numbers. Used specifically for the year component in the classic essence
 * formula, where the year must always contribute a single digit (1-9) so
 * that e.g. 2027 → 11 → 2, not stopping at 11. */
export function reduceToSingleDigit(n: number): number {
  let val = Math.abs(n);
  while (val > 9) {
    val = String(val)
      .split("")
      .reduce((a: number, d: string) => a + +d, 0);
  }
  return val;
}
/** The unreduced compound Personal Year total for ANY target year — not just
 * the current one. Birth day and birth month go in AS-IS (day 28 stays 28,
 * not pre-reduced to 1), summed with that year's one-pass digit sum.
 * This is the single source of truth every Personal-Year-adjacent feature
 * in the app (the current-year summary, the multi-year cycle chart, the
 * compound-number lookup, zodiac transits, etc.) should call instead of
 * re-deriving its own copy. */
export function computeRawPersonalYear(
  birthDay: number,
  birthMonth: number,
  forYear: number,
): number {
  return birthDay + birthMonth + digitSumOnce(forYear);
}
/** Final single-digit/master-number Personal Year for any target year. */
export function computePersonalYearNumber(
  birthDay: number,
  birthMonth: number,
  forYear: number,
): number {
  return reduceNum(computeRawPersonalYear(birthDay, birthMonth, forYear));
}
/** The CLASSIC compound Personal Year total: birth day and birth month
 * are expressed as a one-pass digit sum (digitSumOnce, so two-digit days
 * like 29 stay as 11 rather than collapsing further), while the year is
 * reduced ALL THE WAY to a single digit (1-9), bypassing master numbers.
 * Using reduceToSingleDigit for the year prevents years like 2027
 * (2+0+2+7=11) from stopping at the master number 11 and inflating the
 * raw total — in the classic system the year always contributes 1-9 only.
 * Examples:
 * Born 8 Sep (8/9), year 2027: digitSumOnce(8)=8, digitSumOnce(9)=9,
 * reduceToSingleDigit(2027)=2+0+2+7=11→1+1=2 → raw=8+9+2=19/1 ✓
 * Born 29 Sep (29/9), year 2026: digitSumOnce(29)=11, digitSumOnce(9)=9,
 * reduceToSingleDigit(2026)=2+0+2+6=10→1+0=1 → raw=11+9+1=21/3 ✓
 * The app shows this system alongside the "direct" (unreduced-components)
 * approach, rather than treating one as more correct than the other. */
export function computeRawPersonalYearClassic(
  birthDay: number,
  birthMonth: number,
  forYear: number,
): number {
  // digitSumOnce for day and month (preserves compounds like 11 from day 29),
  // reduceToSingleDigit for year (bypasses master numbers — year always 1-9).
  return (
    digitSumOnce(birthDay) +
    digitSumOnce(birthMonth) +
    reduceToSingleDigit(forYear)
  );
}
export function computePersonalYearNumberClassic(
  birthDay: number,
  birthMonth: number,
  forYear: number,
): number {
  return reduceNum(
    computeRawPersonalYearClassic(birthDay, birthMonth, forYear),
  );
}
function compoundYearText(c: ChaldeanPYNCompound, raw: number): string {
  // Use the app's Personal-Year reduction for display, preserving master
  // numbers that appear during reduction (e.g. 38 → 11, not 2). The dictionary
  // still keeps c.reduced for classical Chaldean root reference.
  const displayReduced = reduceNum(raw);
  const rootNote =
    displayReduced !== c.reduced ? ` (classical root ${c.reduced})` : "";
  const header = `${raw}/${displayReduced} — ${c.name}${c.isKarmicDebt ? " (Karmic Debt)" : c.isMasterNumber || displayReduced === 11 || displayReduced === 22 || displayReduced === 33 ? " (Master Number)" : ""}${rootNote}\n\n`;
  const sym = `Symbolism: ${c.symbolism}\n\n`;
  const ess = `Vibrational Essence:\n${c.vibrationalEssence}\n\n`;
  const kar = c.karmicDynamics
    ? `Karmic Dynamics:\n${c.karmicDynamics}\n\n`
    : "";
  const man = `Manifestation Patterns:\n${c.manifestationPatterns}`;
  return header + sym + ess + kar + man;
}
const PY_MEANINGS: Record<number, { title: string; interpretation: string }> = {
  1: {
    title: "Personal Year 1 — The Year of Beginnings",
    interpretation: `PERSONAL YEAR 1 — The Year of Beginnings
A Personal Year 1 opens a brand new nine-year epic cycle in your life. This is not merely a good year for starting things — it is the year when the universe HANDS you a blank page and a pen and waits to see what you will write. Everything begun in a Year 1 has the potential to develop across the full nine-year arc that follows.
THE DOORWAY: A Year 1 often begins with a sense of doors closing on old cycles and new ones appearing — sometimes literally, in the form of relocations, career changes, or the end of old relationships. This is not random disruption but the necessary clearing of space for what is to come. The courage to walk through those doors — to say yes to the unfamiliar — is the primary curriculum.
CORE CURRICULUM: Independence, initiative, and the development of authentic selfhood. In a Year 1, you are learning to trust your own judgment, to act without external validation, and to lead your own life rather than being carried along by circumstances. This is the year to ask: "What do I actually want?" — not what others expect, not what is sensible, but what your soul is calling you toward.
THE PRACTICE: Identify ONE major initiative, project, or direction shift, and commit fully. The Year 1 energy rewards focus and punishes scattering. Begin something that will take years to complete. Plant seeds whose harvest you cannot yet imagine. Say yes to the thing that terrifies you — the Year 1 provides courage.
THE SHADOW: Impulsiveness, arrogance, and the temptation to burn bridges that still have value. Not everything old needs to be destroyed to make room for the new; some things need to be integrated. The Year 1 who operates without humility may find that the seeds they plant are not the ones they intended.`,
  },
  2: {
    title: "Personal Year 2 — The Year of Patience",
    interpretation: `PERSONAL YEAR 2 — The Year of Patience
A Personal Year 2 follows the explosive initiations of the Year 1 with a necessary deceleration. Where the Year 1 was about ACTION, the Year 2 is about RECEPTION — allowing the seeds you planted to begin their underground germination, developing the relationships that will support your new direction, and learning that not all progress is visible.
THE SLOWING: Many people find the Year 2 frustrating, especially after the momentum of a Year 1. The universe seems to be saying: "Wait." Projects stall, plans require revision, and the pace of external progress slows to a crawl. This is not punishment but the necessary consolidation phase of any genuine growth — the foundation is being laid below ground where you cannot see it.
CORE CURRICULUM: Partnership, patience, and emotional intelligence. In a Year 2, you are learning to collaborate without losing yourself, to feel the emotional currents beneath the surface of events, and to trust that what is growing in the dark will eventually emerge into light. This is the year to develop your intuition — the Year 2 amplifies psychic sensitivity.
THE PRACTICE: Practice patience as a SPIRITUAL DISCIPLINE, not as passive waiting. When the urge to force outcomes arises, pause and breathe. Cultivate relationships — the Year 2 is ideal for deepening partnerships and resolving old conflicts. Keep a dream journal; your unconscious will be unusually active and communicative.
THE SHADOW: Passivity masquerading as patience, resentment toward the slow pace, and the temptation to abandon the Year 1's initiatives because the initial excitement has faded and the work is now quiet and unglamorous. The Year 2 who cannot tolerate slowness may abort projects that would have borne extraordinary fruit.`,
  },
  3: {
    title: "Personal Year 3 — The Year of Expression",
    interpretation: `PERSONAL YEAR 3 — The Year of Expression
A Personal Year 3 is the most joyful year in the nine-year cycle — the year when the seeds planted in Year 1 and gestated in Year 2 finally break through the soil into visible growth. This is a year of creativity, communication, and social expansion. Life feels lighter; possibilities feel more accessible; self-expression flows naturally.
THE BLOOM: The Year 3 brings a palpable sense of energy returning after the Year 2's slowness. Social opportunities multiply, creative inspiration strikes frequently, and the general atmosphere is one of optimism and forward motion. This is the year to SHARE what you have been developing — to speak, write, create, perform, and connect.
CORE CURRICULUM: Authentic self-expression, creative discipline, and the balance between joy and depth. In a Year 3, you are learning to express yourself fully without performing for approval, to channel creative energy into sustained projects (not just inspired bursts), and to find the depth within joy rather than fleeing depth in favor of surface-level happiness.
THE PRACTICE: Dedicate time each week to creative expression — not for an audience but for the pure pleasure of creating. Say yes to social invitations but maintain a core practice that grounds you. Start a creative project that scares you slightly — the Year 3 provides the courage to share your voice.
THE SHADOW: Scattering creative energy across too many projects, superficiality disguised as sociability, and the temptation to use the Year 3's social energy to avoid the inner work that still needs doing. The Year 3 who never pauses to integrate will arrive at the Year 4 exhausted and directionless.`,
  },
  4: {
    title: "Personal Year 4 — The Year of Foundation",
    interpretation: `PERSONAL YEAR 4 — The Year of Foundation
A Personal Year 4 is the most demanding year in the nine-year cycle but also the most productive — IF you are willing to do the work. This is the year of discipline, structure, and the patient labor that transforms inspired ideas (Year 1), deepened relationships (Year 2), and creative expression (Year 3) into something durable and real.
THE LABOR: The Year 4 often arrives with a sobering shift in energy. The lightness of the Year 3 is replaced by a sense of responsibility and the demand for concrete action. Projects that were exciting in theory must now be executed in practice, and execution requires discipline, organization, and sustained effort. Many people resist the Year 4, finding it oppressive after the Year 3's freedom — but those who embrace it build foundations that support them for years.
CORE CURRICULUM: Discipline, structure, and the transformation of vision into form. In a Year 4, you are learning that inspiration without implementation is fantasy, that freedom requires limits, and that the patient accumulation of small, consistent efforts produces results that dramatic gestures cannot match. This is the year to build your systems — the habits, routines, and organizational structures that will carry your initiatives forward.
THE PRACTICE: Establish one new daily discipline and maintain it for the entire year. Organize one area of your life (finances, health, workspace, schedule) that has been chaotic. Set concrete, measurable goals with deadlines, and hold yourself accountable. The Year 4 rewards consistency and punishes shortcuts.
THE SHADOW: Workaholism, rigidity, and the temptation to sacrifice health and relationships to the demands of productivity. The Year 4 who works without rest will arrive at the Year 5 broken rather than strong. The discipline must serve the vision, not become an end in itself.

SHADOW IN THE ELEMENTS: the Year of Foundation tests whatever was built upon the ground it was built on. When the ground itself moves, the foundation is the subject of the year, and the number reads as the inventory of what held.`,
  },
  5: {
    title: "Personal Year 5 — The Year of Change",
    interpretation: `PERSONAL YEAR 5 — The Year of Change
A Personal Year 5 is the most unpredictable year in the nine-year cycle — the year when the structures built in Year 4 are tested by the winds of change, and the discipline developed in the previous years is challenged by the impulse toward freedom, adventure, and the radically new. This is the year of surprises, both exhilarating and destabilizing.
THE WINDS: The Year 5 often brings events that cannot be planned for — sudden opportunities, unexpected endings, chance encounters that alter the course of life. The universe seems to be saying: "You have built your foundation; now let me show you what freedom feels like." The Year 5 is not a rejection of the Year 4's discipline but its TEST — can you maintain your center while embracing change?
CORE CURRICULUM: Freedom, adaptability, and the wisdom to distinguish between liberation and escape. In a Year 5, you are learning to embrace change without being destabilized by it, to exercise freedom without abandoning responsibility, and to recognize that genuine freedom is internal — the capacity to remain centered regardless of external circumstances.
THE PRACTICE: Say yes to one significant change you have been avoiding. Travel if possible — the Year 5 amplifies the transformative potential of new environments. Practice daily centering (meditation, breathwork, exercise) to maintain groundedness amid flux. Allow plans to shift without abandoning your core commitments.
THE SHADOW: Chaos, recklessness, and the temptation to abandon everything that feels constraining — including commitments and relationships that still have value. The Year 5 who interprets every impulse toward freedom as a mandate to flee will arrive at the Year 6 isolated rather than liberated. The question is not "Should I change?" but "What kind of change serves my highest good?"`,
  },
  6: {
    title: "Personal Year 6 — The Year of the Heart",
    interpretation: `PERSONAL YEAR 6 — The Year of the Heart
A Personal Year 6 brings the focus home — literally and metaphorically. After the upheavals of the Year 5, the Year 6 turns attention toward relationships, family, domestic harmony, and the cultivation of love in all its forms. This is the year of the heart, when matters of connection, care, and responsibility take precedence over ambition and adventure.
THE HOMECOMING: The Year 6 often brings a desire to settle, to beautify, to create environments of genuine warmth and welcome. Relationships that survived the Year 5's turbulence deepen; those that did not reveal their fragility. This is the year to tend what you love — your home, your family (chosen or biological), your community, and yourself.
CORE CURRICULUM: Love, responsibility, and the balance between giving and receiving. In a Year 6, you are learning that genuine love is not sacrifice but service, that responsibility is not burden but privilege, and that the capacity to receive love is as important as the capacity to give it. This is the year to heal relationship wounds and to create beauty in your immediate environment.
THE PRACTICE: Perform one act of service daily for someone you love — without announcement, without expectation of return. Beautify your home. Mend one damaged relationship (or, if mending is impossible, complete it with grace). Learn to receive — accept help, compliments, and care without immediately deflecting or reciprocating.
THE SHADOW: Martyrdom, over-giving, and the temptation to sacrifice yourself entirely to the care of others. The Year 6 who gives without receiving will arrive at the Year 7 depleted rather than enriched. The heart that pours out endlessly without being refilled eventually runs dry. Your capacity to serve is proportional to your capacity to be nourished.

COMMUNAL GRIEF: the Year of the Heart keeps the household and the neighbour; in a visitation year the heart is where a people feel their loss together. The 6 reads then as the mourning of a community and as the care survivors owe one another.`,
  },
  7: {
    title: "Personal Year 7 — The Year of the Soul",
    interpretation: `PERSONAL YEAR 7 — The Year of the Soul
A Personal Year 7 is the most introspective year in the nine-year cycle — a year of withdrawal, reflection, and spiritual deepening. After the relational intensity of the Year 6, the Year 7 invites you inward, away from the demands of relationships and toward the demands of your own soul. This is the year to seek understanding, not achievement; to ask questions, not supply answers; to deepen, not to expand.
THE RETREAT: The Year 7 often brings a diminished appetite for social engagement and an increased hunger for solitude, study, and spiritual practice. Others may find you distant; you are simply elsewhere — attending to the inner dimension of your existence, which requires quiet and focus. This is not antisocial behavior but a sacred necessity, and those who love you should be given to understand this.
CORE CURRICULUM: Wisdom, spiritual depth, and the integration of life experience into understanding. In a Year 7, you are learning to trust your inner guidance over external authority, to develop a spiritual practice that sustains you, and to find the lessons embedded in the experiences of the previous six years. This is the year to study — not for credentials but for transformation.
THE PRACTICE: Establish or deepen a spiritual practice — meditation, contemplation, study of sacred texts, time in nature. Read challenging books. Keep a journal of insights and questions. Protect your solitude fiercely; the Year 7's gifts emerge in silence, not in conversation.
THE SHADOW: Isolation, intellectual arrogance, and the temptation to use spiritual seeking as an escape from practical responsibilities or relational commitments. The Year 7 who ascends to the mountaintop and never descends has missed the point — the wisdom gained in solitude must eventually be shared with others.

SHADOW IN CATASTROPHE: the retreat of the 7 is chosen when it can be; where it is imposed by circumstance, the same introspection appears as a people driven indoors to weigh what their ground was worth.`,
  },
  8: {
    title: "Personal Year 8 — The Year of Power",
    interpretation: `PERSONAL YEAR 8 — The Year of Power
A Personal Year 8 is the year of karmic return — the harvest, for good or ill, of the seeds planted across the previous seven years. This is the year of power, material manifestation, and the exercise of authority. Whatever you have genuinely earned — in career, finances, relationships, or wisdom — tends to arrive now. And whatever you have avoided, neglected, or corrupted tends to surface as well.
THE HARVEST: The Year 8 often brings significant material developments — promotions, financial windfalls, business successes — but these are not random gifts. They are the natural fruition of the work done in Years 1 through 7 (or, in some cases, work done in previous cycles). The Year 8 reveals the karmic mathematics of your life: what you have truly earned will arrive; what you have not earned will not arrive, no matter how desperately you want it.
CORE CURRICULUM: Power, ethical authority, and the integration of material and spiritual values. In a Year 8, you are learning to wield power without being corrupted by it, to direct resources toward meaningful ends, and to recognize that the truest wealth is what you enable others to create. This is the year to take command of your material life — to organize finances, to step into leadership, to claim your authority.
THE PRACTICE: Review your relationship with money and power honestly. Where have you been avoiding financial responsibility? Where have you been over-identifying with material success? Make one significant financial decision that you have been postponing. Step into a leadership role that feels slightly beyond your current capacity — the Year 8 provides the authority.
THE SHADOW: Greed, domination, and the temptation to measure all value in material terms. The Year 8 who grasps too tightly will lose what they try to hold. The Year 8 who uses power to dominate others will find that the karma of that domination returns, often in the Year 9 or the next cycle. Power is a test, not a reward.`,
  },
  9: {
    title: "Personal Year 9 — The Year of Completion",
    interpretation: `PERSONAL YEAR 9 — The Year of Completion
A Personal Year 9 is the most emotionally complex year in the nine-year cycle — the year of endings, release, and the completion of a full epic cycle. What was begun in your last Year 1 is now completing; what has served its purpose must be released; what cannot survive must be allowed to die. This is not a year of tragedy but of PROFOUND NECESSITY — the clearing that makes space for the next cycle to begin.
THE RELEASE: The Year 9 often brings endings — relationships conclude, careers shift, identities dissolve. These endings are not punishments but completions; the universe is removing structures that have served their purpose so that new ones can emerge. The Year 9 who clings to what is ending will experience unnecessary suffering. The Year 9 who releases voluntarily will experience the completion as liberation.
CORE CURRICULUM: Completion, forgiveness, and the cultivation of universal compassion. In a Year 9, you are learning to let go gracefully — of attachments, identities, grudges, and possessions that have completed their cycle. You are learning to forgive — others, yourself, life itself for not meeting your expectations. And you are learning to love impersonally — to care about humanity in general, not just your immediate circle.
THE PRACTICE: Identify one thing — a belief, a grudge, a possession, a commitment — that has completed its cycle, and consciously release it. Practice forgiveness toward someone (including yourself). Cleanse your physical space — declutter, donate, release. Prepare for the renewal that the next Year 1 will bring.
THE SHADOW: Premature endings, avoidance of necessary grief, and the temptation to use "letting go" as an excuse to flee commitments that still have value. The Year 9 who releases everything will arrive at the next Year 1 with nothing to build upon. The art is to release what has genuinely completed while honoring what is still alive and growing.`,
  },
};
const MASTER_BASE_YEAR: Record<number, number> = { 11: 2, 22: 4, 33: 6 };
const MASTER_YEAR_TITLES: Record<number, string> = {
  11: "The Year of Illumination",
  22: "The Year of the Master Builder",
  33: "The Year of the Master Teacher",
};
const MASTER_YEAR_NOTES: Record<number, string> = {
  11: `MASTER YEAR 11 — The Illumination Year\n\nIn the master 11 year, the 2's receptivity operates at the voltage of revelation: intuition peaks, nervous sensitivity peaks, and the boundary between signal and anxiety must be guarded daily. Cheiro's older compound reading adds the discernment warning — hidden trial and treachery are the 11's classic shadows. The year's instruction is to receive deeply and act carefully.\n\n---\nSingle-Digit Foundation (2):\n`,
  22: `MASTER YEAR 22 — The Master Builder Year\n\nIn the master 22 year, the 4's discipline operates at the scale of legacy: institutions, platforms, and foundations intended to outlast you. Cheiro's compound reading warns of illusion, delusion, and a good person misled by the folly of others — verify every foundation before adding weight. The year's instruction is to build, and to audit what you build.\n\n---\nSingle-Digit Foundation (4):\n`,
  33: `MASTER YEAR 33 — The Master Teacher Year\n\nIn the master 33 year, the 6's care operates at the voltage of teaching: what you have lived becomes instruction for others. The 33's shadow is the exhausted savior — giving until the vessel that serves is empty. Cheiro notes the 33 carries the 24's fortune: help and magnetism are available to the one who does not burn out. The year's instruction is to teach from overflow, not depletion.\n\n---\nSingle-Digit Foundation (6):\n`,
};
/** The meaning for a Personal Year, including master years 11/22/33 which
 * carry their single-digit foundation (2/4/6) at heightened voltage. */
function yearMeaning(py: number): { title: string; interpretation: string } {
  const direct = PY_MEANINGS[py];
  if (direct) return direct;
  const base = MASTER_BASE_YEAR[py];
  if (base && PY_MEANINGS[base]) {
    return {
      title: `Personal Year ${py} — ${MASTER_YEAR_TITLES[py] || "Master Year"}`,
      interpretation: MASTER_YEAR_NOTES[py] + PY_MEANINGS[base].interpretation,
    };
  }
  return {
    title: `Personal Year ${py}`,
    interpretation: `Personal Year ${py} carries its own unique vibration.`,
  };
}

export function getPersonalYearAnalysis(
  birthDay: number,
  birthMonth: number,
  birthYear?: number,
  targetYear: number = new Date().getFullYear(),
): PersonalYearResult {
  const y = targetYear;
  const yearDigitSum = digitSumOnce(y); // e.g. 2024 -> 2+0+2+4 = 8 (single pass over the year's own digits — this isn't "pre-reducing a component," it's just how a 4-digit year is turned into a number to add in the first place)
  // Raw compound Personal Year — birth day and birth month go in AS-IS
  // (e.g. day 28 stays 28, not pre-reduced to 1+0=1), summed with the year's
  // digit sum, with NO reduction applied to the total yet.
  // e.g. 28 (day) + 2 (month) + 8 (year) = 38, not 1 + 2 + 8 = 11.
  const rawYear = birthDay + birthMonth + yearDigitSum;
  // Final single-digit/master-number Personal Year, reduced only now — and
  // reduced properly, stopping at 11/22/33 if the reduction passes through
  // one rather than collapsing straight past it.
  const py = reduceNum(rawYear);
  const compound = lookupCompound(rawYear);
  const base = yearMeaning(py);
  const title = compound
    ? `Personal Year ${rawYear}/${py} — ${compound.name}`
    : base.title;
  const interpretation = compound
    ? compoundYearText(compound, rawYear) +
      `\n\n---\nSingle-Digit Interpretation (${py}):\n${base.interpretation}`
    : base.interpretation;
  // ── Classic (pre-reduced-components) system — computed alongside, not
  // instead of, the above. Both are shown to the person; neither overrides
  // the other. ──
  const rawYearClassic = computeRawPersonalYearClassic(birthDay, birthMonth, y);
  const pyClassic = reduceNum(rawYearClassic);
  const compoundClassic = lookupCompound(rawYearClassic);
  const baseClassic = yearMeaning(pyClassic);
  const titleClassic = compoundClassic
    ? `Personal Year ${rawYearClassic}/${pyClassic} — ${compoundClassic.name}`
    : baseClassic.title;
  const interpretationClassic = compoundClassic
    ? compoundYearText(compoundClassic, rawYearClassic) +
      `\n\n---\nSingle-Digit Interpretation (${pyClassic}):\n${baseClassic.interpretation}`
    : baseClassic.interpretation;
  const dualEssence = buildPersonalYearDualEssenceSynthesis({
    birthDay,
    birthMonth,
    birthYear,
    targetYear: y,
    directRaw: rawYear,
    directYear: py,
    directCompound: compound,
    classicRaw: rawYearClassic,
    classicYear: pyClassic,
    classicCompound: compoundClassic,
  });
  return {
    year: py,
    rawYear,
    title,
    interpretation,
    yearClassic: pyClassic,
    rawYearClassic,
    titleClassic,
    interpretationClassic,
    dualEssence,
    dualEssenceTitle: dualEssence.title,
    dualEssenceSynthesis: dualEssence.synthesisText,
    predictionFocusAreas: dualEssence.predictionFocusAreas,
    protectiveActions: dualEssence.protectiveActions,
    intensityScore: dualEssence.intensityScore,
    polarity: dualEssence.polarity,
  };
}
export function getUniversalYear(): UniversalYearResult {
  const y = new Date().getFullYear();
  const uy = reduceNum(
    String(y)
      .split("")
      .reduce((a: number, c: string) => a + +c, 0),
  );
  return { yearNumber: uy, calendarYear: y, ...getUniversalYearMeaning(uy, y) };
}
function getUniversalYearMeaning(
  yearNumber: number,
  calendarYear: number,
): { title: string; interpretation: string } {
  const e = yearNumber;
  const UNIVERSAL_MEANINGS: Record<number, string> = {
    1: `UNIVERSAL YEAR ${1} (${calendarYear}) — Global New Beginning\n\nThe Universal Year ${1} marks the beginning of a nine-year global cycle. This is a year of NEW INITIATIVES on a planetary scale — political movements launch, technologies emerge, and the collective consciousness shifts toward independence and innovation. The energy supports breaking from tradition, challenging old systems, and planting seeds for the next nine years of human development.\n\nFor individuals, this Universal Year amplifies the drive to begin — whether you are in a Personal Year 1 or not, the collective field is charged with pioneer energy. Use it to initiate what you have been postponing. The shadow of the Universal Year 1: conflict as old systems resist the new, and the chaos that accompanies genuine transformation.`,
    2: `UNIVERSAL YEAR ${2} (${calendarYear}) — Global Partnership\n\nThe Universal Year ${2} follows the initiatory Year 1 with a year of DIPLOMACY, COOPERATION, and the slower, more delicate work of building relationships between the new forces that emerged in the previous year. This is a year of treaties, partnerships, and the emotional intelligence required to make the Year 1's innovations sustainable.\n\nFor individuals, this Universal Year amplifies the need for patience, collaboration, and emotional attunement. The collective field is charged with relational energy — conflicts seek resolution, partnerships form, and the intuitive dimension of human experience is more accessible.`,
    3: `UNIVERSAL YEAR ${3} (${calendarYear}) — Global Creative Expression\n\nThe Universal Year ${3} brings a surge of CREATIVITY, COMMUNICATION, and JOY on a planetary scale. The arts flourish, new forms of media emerge, and the collective mood lightens after the Year 2's seriousness. This is a year of festivals, cultural exchange, and the joyful expression of the innovations seeded in Year 1 and nurtured in Year 2.\n\nFor individuals, this Universal Year amplifies creative and social energy. It is an excellent year for artistic projects, public speaking, and expanding your social world. The shadow: the temptation to skim surfaces and avoid the deeper work that still needs doing.`,
    4: `UNIVERSAL YEAR ${4} (${calendarYear}) — Global Foundation\n\nThe Universal Year ${4} brings a year of HARD WORK, DISCIPLINE, and the building of foundations on a global scale. After the Year 3's creative exuberance, the Year 4 demands that ideas be translated into structures — economic systems reformed, infrastructure built, organizations restructured for durability.\n\nFor individuals, this Universal Year amplifies the demand for discipline and sustained effort. It is an excellent year for establishing systems, building businesses, and doing the unglamorous work that supports later success. The shadow: economic strain, political gridlock as competing structures clash, and the personal exhaustion that comes from overwork.`,
    5: `UNIVERSAL YEAR ${5} (${calendarYear}) — Global Change\n\nThe Universal Year ${5} brings a year of UNPREDICTABLE CHANGE, FREEDOM MOVEMENTS, and the destabilization of systems that have grown too rigid. This is a year of revolutions (peaceful and otherwise), sudden breakthroughs, and the acceleration of trends that seemed gradual before.\n\nFor individuals, this Universal Year amplifies the impulse toward freedom and change. Expect the unexpected; plans may shift dramatically. Travel, risk-taking, and the embrace of uncertainty are supported. The shadow: chaos, instability, and the temptation to abandon commitments prematurely.`,
    6: `UNIVERSAL YEAR ${6} (${calendarYear}) — Global Heart\n\nThe Universal Year ${6} brings a year of HEALING, RECONSTRUCTION, and the return of attention to human needs after the Year 5's destabilization. This is a year of humanitarian efforts, family-focused policies, and the collective turn toward care, beauty, and the restoration of what was damaged.\n\nFor individuals, this Universal Year amplifies the pull toward home, family, and loving service. It is an excellent year for healing relationships, beautifying your environment, and contributing to your community. The shadow: the temptation to care for others at the expense of self, and the political weaponization of "care" rhetoric.`,
    7: `UNIVERSAL YEAR ${7} (${calendarYear}) — Global Reflection\n\nThe Universal Year ${7} brings a year of INTROSPECTION, SPIRITUAL SEEKING, and the collective turn inward after the relational intensity of Year 6. This is a year of scientific breakthroughs born from deep research, spiritual movements that emphasize inner transformation, and a general quieting of the external noise.\n\nFor individuals, this Universal Year amplifies the call to solitude, study, and spiritual practice. It is an excellent year for education, meditation, and deep work. The shadow: social withdrawal that becomes isolation, and the rise of cult-like spiritual movements that exploit the collective hunger for meaning.`,
    8: `UNIVERSAL YEAR ${8} (${calendarYear}) — Global Power\n\nThe Universal Year ${8} brings a year of POWER DYNAMICS, ECONOMIC TRANSFORMATION, and the karmic return of seeds planted since the Year 1. This is a year of financial booms or busts, political power shifts, and the exposure of corruption or the vindication of integrity — what was hidden emerges.\n\nFor individuals, this Universal Year amplifies career and financial energy. It is an excellent year for claiming authority, making investments, and reaping what you have earned. The shadow: the concentration of power in corrupt hands, and the personal temptation to measure success purely in material terms.`,
    9: `UNIVERSAL YEAR ${9} (${calendarYear}) — Global Completion\n\nThe Universal Year ${9} brings a year of ENDINGS, COMPLETIONS, and the clearing that prepares for the next cycle. This is a year of closures — regimes fall, eras end, and what has completed its purpose is released. There is a particular melancholy to the Universal Year 9, but also a profound sense of rightness — things are ending because they are genuinely finished.\n\nFor individuals, this Universal Year amplifies the need to release, forgive, and complete. It is an excellent year for clearing clutter (physical and emotional), ending relationships that have run their course, and preparing for the renewal that the next Year 1 will bring. The shadow: premature endings driven by the collective energy rather than genuine completion.`,
  };
  const title = `Universal Year ${e} — ${calendarYear}`;
  const interpretation =
    UNIVERSAL_MEANINGS[e] ||
    `The Universal Year ${e} carries the vibration of ${e} across the collective field of human experience.`;
  return { title, interpretation };
}