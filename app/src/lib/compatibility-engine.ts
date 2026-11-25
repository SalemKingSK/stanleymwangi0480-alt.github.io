/**
 * MYSTIQUE COMPASS — Soul Resonance Engine (compatibility layer)
 *
 * Adds three things the app didn't have before, wired to REAL app data
 * (not placeholder/zeroed structures):
 *  1. A full 12x12 Chinese zodiac relation matrix that distinguishes
 *     Secret Friends, Trines, Six Clashes (六冲) and Six Harms (相害),
 *     instead of only secret-friends/trines.
 *  2. Domain-weighted scoring so Romance / Partnership / Friendship
 *     produce different numbers for the same pair, instead of one
 *     generic score reused three times.
 *  3. A Lo Shu void-fill / amplification overlay and an Alexandrov
 *     psychomatrix 6-line comparison, both built from the app's own
 *     `generateLoShuData` / `calculatePsychomatrix` output.
 *
 * This module is additive: it does not replace `buildRelationshipAnalysis`
 * in engagement-tools.tsx (the narrative/timeline/evidence engine). It is
 * meant to be rendered as an extra section inside the existing
 * SoulResonancePanel.
 */
 
import { calculatePsyche, calculateDestiny, generateLoShuData } from "@/lib/numerology";
import {
  JOHARI_PSYCHIC_PROFILES,
  getJohariPairCompatibility,
  johariViewOf,
  generateCombinedWeather,
  type JohariPsychicProfile,
  type JohariPairCompat,
  type CombinedWeatherReport,
} from "@/lib/johari-compatibility-data";
import { getLifePathNumber } from "@/lib/numerology/karmic-life-path";
import { computeRawPersonalYear, computeRawPersonalYearClassic, reduceNum, reduceToSingleDigit } from "@/lib/numerology/personal-year-full";
import { lookupCompound } from "@/lib/numerology/chaldean-pyn-compounds";
import { calculatePsychomatrix } from "@/lib/numerology/data/psychomatrixData";
import { getChineseZodiacSign, getWesternZodiacSign } from "@/lib/astrology";
import { famousBirthdays, type FamousPerson } from "@/lib/famous-birthdays";
import { zodiacData } from "@/lib/zodiac";
import { NEW_ASTROLOGY_DATA } from "@/lib/new-astrology";
 
// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------
 
export interface SoulVitals {
  name: string;
  day: number;
  month: number;
  year: number;
  gender: string;
  psychic: number;
  destiny: number;
  lifePath: number;
  zodiacAnimal: string;
  zodiacElement: string;
  westernSign: string;
  combinedSign: string;
  /** digit -> count, from the app's own Lo Shu grid data */
  loShuCounts: Record<number, number>;
  /** digit -> count, from the app's own Alexandrov psychomatrix data */
  psychomatrixCounts: Record<number, number>;
}
 
export interface DomainScore {
  romance: number;
  partnership: number;
  friendship: number;
}
 
export interface ResonanceLayer {
  label: string;
  score: number;
  verdict: string;
  detail: string;
  domainWeights: DomainScore;
}
 
export interface SoulResonanceReport {
  soulA: SoulVitals;
  soulB: SoulVitals;
  overall: number;
  domains: DomainScore;
  layers: ResonanceLayer[];
  chineseZodiac: { relation: string; score: number; note: string };
  loShuOverlay: {
    voidFill: { numbers: number[]; narrative: string; score: number };
    amplification: { numbers: number[]; narrative: string; score: number };
  };
  psychomatrixComparison: {
    willpower: string;
    energy: string;
    stability: string;
    purpose: string;
    family: string;
    habits: string;
  };
  famousTwins: Array<{ name: string; sharedTrait: string }>;
  reading: string;
  /** Additive: how each soul's current-cycle personal years collide or
   * harmonize with the other's. Optional so existing consumers that were
   * built before this field existed keep compiling and rendering unchanged. */
  pyInteraction?: PYInteractionAnalysis;
  /**
   * Rich Johari compatibility data: full psychic profiles for both souls
   * and all four directional pair readings (psychic↔psychic,
   * destiny↔destiny, psychic-A↔destiny-B, psychic-B↔destiny-A), plus the
   * friend/enemy view each number holds of the other.
   */
  johariCompatibility?: {
    profileA: JohariPsychicProfile;
    profileB: JohariPsychicProfile;
    psychicPair: JohariPairCompat | null;
    destinyPair: JohariPairCompat | null;
    crossPairAB: JohariPairCompat | null;  // A's psychic ↔ B's destiny
    crossPairBA: JohariPairCompat | null;  // B's psychic ↔ A's destiny
    /** Psychic-number view: A's psychic sees B's psychic as friend/enemy */
    aPsychicViewOfBPsychic: "Friendly" | "Neutral" | "Enemy";
    /** Destiny-number view: A's destiny sees B's destiny as friend/enemy */
    aDestinyViewOfBDestiny: "Friendly" | "Neutral" | "Enemy";
    /** Life-path view: A's life path sees B's life path as friend/enemy */
    aLifePathViewOfBLifePath: "Friendly" | "Neutral" | "Enemy";
    bPsychicViewOfAPsychic: "Friendly" | "Neutral" | "Enemy";
    bDestinyViewOfADestiny: "Friendly" | "Neutral" | "Enemy";
    bLifePathViewOfALifePath: "Friendly" | "Neutral" | "Enemy";
    /** Composite verdict synthesizing all three dimensions */
    compositeVerdict: "Strongly Friendly" | "Generally Friendly" | "Mixed" | "Generally Tense" | "Strongly Tense";
    /** Brief explanation of the composite verdict */
    compositeExplanation: string;
    // Legacy fields kept for backward compatibility with existing UI code
    aViewOfB: "Friendly" | "Neutral" | "Enemy";
    bViewOfA: "Friendly" | "Neutral" | "Enemy";
  };
  /**
   * Soul Weather combined personal-year analysis. Populated from the
   * real personal-year numbers so callers don't have to recompute them.
   */
  combinedWeather?: CombinedWeatherReport;
  /**
   * Full verbatim Chinese zodiac compatibility paragraph for the
   * animal pair, sourced from Suzanne White's zodiacData. E.g. the
   * Dog entry's compatibilities["Rat"] paragraph placed here
   * verbatim (no edits, no summary).
   */
  chineseZodiacCompatText?: string;
  /**
   * Codified Western/Chinese (New Astrology) compatibility analysis:
   * each soul's Suzanne White compatibilities paragraph plus structured
   * appreciation/dissatisfaction indicators derived from whether the
   * partner's actual Western sign and Chinese animal appear in the
   * positive or avoidance portions of the paragraph.
   */
  newAstrologyCompat?: {
    aCompatText: string;
    bCompatText: string;
    aAppreciationOfB: {
      westernSignMatch: boolean;
      chineseAnimalMatch: boolean;
      combinedSignMatch: boolean;
      details: string;
    };
    aDissatisfactionWithB: {
      westernSignMatch: boolean;
      chineseAnimalMatch: boolean;
      combinedSignMatch: boolean;
      details: string;
    };
    bAppreciationOfA: {
      westernSignMatch: boolean;
      chineseAnimalMatch: boolean;
      combinedSignMatch: boolean;
      details: string;
    };
    bDissatisfactionWithA: {
      westernSignMatch: boolean;
      chineseAnimalMatch: boolean;
      combinedSignMatch: boolean;
      details: string;
    };
  };
}

// ---------------------------------------------------------------------
// Soul Weather: Direct + Classic personal-year readings with karmic/master
// awareness, wired to the app's own compound dictionary and famous-birthday
// bank instead of surfacing a bare "PY {number}".
// ---------------------------------------------------------------------

export interface PYReading {
  raw: number;
  reduced: number;
  compoundName: string | null;
  isKarmicDebt: boolean;
  isMasterNumber: boolean;
  thesis: string;
  /** Traditional image for the compound (null for plain single digits). */
  symbolism: string | null;
  /** One-line karmic note, only for karmic-debt compounds. */
  karmicNote: string | null;
}

export interface SoulWeatherReport {
  soul: SoulVitals;
  targetYear: number;
  direct: PYReading;
  classic: PYReading;
  age: number | null;
  ageBand: string;
  karmicAlert: string | null;
  masterAlert: string | null;
  famousMatches: Array<{ name: string; score: number; reasons: string[] }>;
  forecast: string;
}

export interface PYInteractionAnalysis {
  aDirect: PYReading;
  aClassic: PYReading;
  bDirect: PYReading;
  bClassic: PYReading;
  interactionType: "harmonious" | "challenging" | "neutral" | "karmic-tension" | "master-amplification";
  narrative: string;
  warning: string | null;
  opportunity: string | null;
}
 
// ---------------------------------------------------------------------
// Static reference data
// ---------------------------------------------------------------------
 
const CHEIRO_HARMONY: Record<number, number[]> = {
  1: [1, 4, 8],
  2: [2, 7],
  3: [3, 6, 9],
  4: [4, 1, 8],
  5: [5],
  6: [6, 3, 9],
  7: [7, 2],
  8: [8, 4, 1],
  9: [9, 3, 6],
  11: [2, 7, 11],
  22: [4, 1, 22],
  33: [6, 3, 9, 33],
};
 
const JOHARI: Record<
  number,
  { planet: string; friends: number[]; neutrals: number[]; growth: number[] }
> = {
  1: { planet: "Sun", friends: [1, 2, 3, 9], neutrals: [5], growth: [4, 6, 7, 8] },
  2: { planet: "Moon", friends: [1, 2, 3], neutrals: [4, 6, 7, 8, 9], growth: [5] },
  3: { planet: "Jupiter", friends: [1, 2, 3, 9], neutrals: [4, 7, 8], growth: [5, 6] },
  4: { planet: "Rahu", friends: [4, 5, 6, 8], neutrals: [3, 7], growth: [1, 2, 9] },
  5: { planet: "Mercury", friends: [1, 3, 5, 6, 9], neutrals: [8], growth: [2, 4, 7] },
  6: { planet: "Venus", friends: [4, 5, 6, 8], neutrals: [3, 7, 9], growth: [1, 2] },
  7: { planet: "Ketu", friends: [1, 2, 4, 7], neutrals: [3, 5, 6, 8, 9], growth: [] },
  8: { planet: "Saturn", friends: [4, 5, 6, 8], neutrals: [3, 7], growth: [1, 2, 9] },
  9: { planet: "Mars", friends: [1, 2, 3, 9], neutrals: [6, 7], growth: [4, 5, 8] },
};
 
// Full 12x12 relation matrix: same-animal, secret friend (六合), trine (三合),
// six clash (六冲) and six harm (相害), plus a neutral fallback. Relations are
// checked against the canonical sets in __tests__/glm-recommendations.test.ts.
//
// Scores come from ZODIAC_SCALE only, so the Soul Resonance report and the
// Relationship Oracle (engagement-tools.tsx) can never grade the same pair
// differently. The per-pair note is descriptive colour.
export type ZodiacRelation = "same" | "secret-friend" | "trine" | "six-harm" | "six-clash" | "neutral" | "unknown";

export const ZODIAC_SCALE: Record<ZodiacRelation, number> = {
  "secret-friend": 92,
  trine: 88,
  same: 72,
  neutral: 55,
  unknown: 55,
  "six-harm": 40,
  "six-clash": 35,
};

const ZODIAC_RELATIONS: Record<string, Record<string, { relation: ZodiacRelation; note: string }>> = {
  Rat: { Rat: { relation: "same", note: "Understand each other's rhythm, but may double weaknesses" }, Ox: { relation: "secret-friend", note: "Secret friends (六合) — natural allies, complementary strengths" }, Tiger: { relation: "neutral", note: "Different paces; Tiger acts, Rat plans" }, Rabbit: { relation: "neutral", note: "Rabbit's caution meets Rat's opportunism" }, Dragon: { relation: "trine", note: "Trine allies (三合) — Rat's cunning + Dragon's vision" }, Snake: { relation: "neutral", note: "Snake's secrecy unsettles Rat's networking" }, Horse: { relation: "six-clash", note: "Six Clash (六冲) — direct opposition. Rat builds, Horse gallops away" }, Goat: { relation: "six-harm", note: "Six Harms (相害) — Goat's dreaminess frustrates Rat's pragmatism" }, Monkey: { relation: "trine", note: "Trine allies (三合) — two tricksters, strong team" }, Rooster: { relation: "neutral", note: "Rooster's precision irritates Rat's flexibility" }, Dog: { relation: "neutral", note: "Dog's loyalty grounds Rat, but Rat feels judged" }, Pig: { relation: "neutral", note: "Same water season, not a 六合 pair — Pig's generosity feeds Rat's schemes" } },
  Ox: { Rat: { relation: "secret-friend", note: "Secret friends (六合) — Rat's agility + Ox's stamina" }, Ox: { relation: "same", note: "Double stubbornness; shared values but slow progress" }, Tiger: { relation: "neutral", note: "Tiger challenges Ox's routine" }, Rabbit: { relation: "neutral", note: "Rabbit's diplomacy softens Ox, but Ox seems dull" }, Dragon: { relation: "neutral", note: "Dragon's flash unsettles Ox's earthiness" }, Snake: { relation: "trine", note: "Trine allies (三合) — Snake's wisdom + Ox's labor" }, Horse: { relation: "six-harm", note: "Six Harms (相害) — Horse's freedom threatens Ox's security needs" }, Goat: { relation: "six-clash", note: "Six Clash (六冲) — Ox builds walls, Goat wanders" }, Monkey: { relation: "neutral", note: "Monkey's tricks exhaust Ox's patience" }, Rooster: { relation: "trine", note: "Trine allies (三合) — Rooster's show + Ox's substance" }, Dog: { relation: "neutral", note: "Dog's vigilance + Ox's steadiness" }, Pig: { relation: "neutral", note: "Pig's ease softens Ox; comfortable but unexciting" } },
  Tiger: { Rat: { relation: "neutral", note: "Rat strategizes, Tiger executes" }, Ox: { relation: "neutral", note: "Ox's slowness frustrates Tiger's urgency" }, Tiger: { relation: "same", note: "Two tigers share courage but compete for dominance" }, Rabbit: { relation: "neutral", note: "Tiger protects Rabbit, but Rabbit fears Tiger's temper" }, Dragon: { relation: "neutral", note: "Dragon's ambition matches Tiger's, but both want to lead" }, Snake: { relation: "six-harm", note: "Six Harms (相害) — mutual suspicion" }, Horse: { relation: "trine", note: "Trine allies (三合) — speed + courage" }, Goat: { relation: "neutral", note: "Goat's gentleness confuses Tiger's directness" }, Monkey: { relation: "six-clash", note: "Six Clash (六冲) — Monkey outsmarts Tiger; Tiger feels mocked" }, Rooster: { relation: "neutral", note: "Rooster's criticism wounds Tiger's pride" }, Dog: { relation: "trine", note: "Trine allies (三合) — Dog's loyalty + Tiger's bravery" }, Pig: { relation: "secret-friend", note: "Secret friends (六合) — Pig's warmth tames Tiger's fierceness" } },
  Rabbit: { Rat: { relation: "neutral", note: "Rat's hustle overwhelms Rabbit's need for peace" }, Ox: { relation: "neutral", note: "Ox's heaviness crushes Rabbit's delicacy" }, Tiger: { relation: "neutral", note: "Tiger's protectiveness comforts Rabbit, but power imbalance" }, Rabbit: { relation: "same", note: "Gentle harmony, but both avoid necessary conflict" }, Dragon: { relation: "six-harm", note: "Six Harms (相害) — Dragon's dominance silences Rabbit" }, Snake: { relation: "neutral", note: "Snake's intensity frightens Rabbit's softness" }, Horse: { relation: "neutral", note: "Horse's restlessness unsettles Rabbit's nest" }, Goat: { relation: "trine", note: "Trine allies (三合) — artistic, gentle harmony" }, Monkey: { relation: "neutral", note: "Monkey's chaos disrupts Rabbit's order" }, Rooster: { relation: "six-clash", note: "Six Clash (六冲) — Rooster's sharpness pierces Rabbit's vulnerability" }, Dog: { relation: "secret-friend", note: "Secret friends (六合) — Dog's devotion shelters Rabbit" }, Pig: { relation: "trine", note: "Trine allies (三合) — domestic bliss, shared comfort" } },
  Dragon: { Rat: { relation: "trine", note: "Trine allies (三合) — visionary + tactical" }, Ox: { relation: "neutral", note: "Ox's skepticism dampens Dragon's dreams" }, Tiger: { relation: "neutral", note: "Two alphas; respect if territory is divided" }, Rabbit: { relation: "six-harm", note: "Six Harms (相害) — Dragon's fire scorches Rabbit's garden" }, Dragon: { relation: "same", note: "Double majesty; magnificent but combustible" }, Snake: { relation: "neutral", note: "Snake's subtlety complements Dragon's grandeur" }, Horse: { relation: "neutral", note: "Horse's independence challenges Dragon's command" }, Goat: { relation: "neutral", note: "Goat's passivity disappoints Dragon's ambition" }, Monkey: { relation: "trine", note: "Trine allies (三合) — Monkey executes Dragon's visions" }, Rooster: { relation: "secret-friend", note: "Secret friends (六合) — Rooster's precision polishes Dragon's gold" }, Dog: { relation: "six-clash", note: "Six Clash (六冲) — Dog's honesty exposes Dragon's illusions" }, Pig: { relation: "neutral", note: "Pig's contentment baffles Dragon's striving" } },
  Snake: { Rat: { relation: "neutral", note: "Rat's chatter disturbs Snake's meditation" }, Ox: { relation: "trine", note: "Trine allies (三合) — Ox's patience + Snake's cunning" }, Tiger: { relation: "six-harm", note: "Six Harms (相害) — Tiger's openness exposes Snake's plots" }, Rabbit: { relation: "neutral", note: "Rabbit's innocence bores Snake's sophistication" }, Dragon: { relation: "neutral", note: "Dragon's showmanship embarrasses Snake's subtlety" }, Snake: { relation: "same", note: "Deep mutual understanding, but trust is slow" }, Horse: { relation: "neutral", note: "Horse's gallop leaves Snake's coils behind" }, Goat: { relation: "neutral", note: "Goat's art + Snake's depth = cultural power" }, Monkey: { relation: "secret-friend", note: "Secret friends (六合) — Snake's strategy + Monkey's ingenuity, wary but allied" }, Rooster: { relation: "trine", note: "Trine allies (三合) — Rooster's display + Snake's strategy" }, Dog: { relation: "neutral", note: "Dog's loyalty baffles Snake's self-interest" }, Pig: { relation: "six-clash", note: "Six Clash (六冲) — Pig's naivety vs Snake's calculation" } },
  Horse: { Rat: { relation: "six-clash", note: "Six Clash (六冲) — Horse's flight vs Rat's burrow" }, Ox: { relation: "six-harm", note: "Six Harms (相害) — Ox's barn confines Horse's prairie" }, Tiger: { relation: "trine", note: "Trine allies (三合) — speed + courage" }, Rabbit: { relation: "neutral", note: "Rabbit's caution reins Horse's wildness" }, Dragon: { relation: "neutral", note: "Dragon's throne bores Horse's wanderlust" }, Snake: { relation: "neutral", note: "Snake's stillness vs Horse's motion" }, Horse: { relation: "same", note: "Two free spirits; magnificent but directionless together" }, Goat: { relation: "secret-friend", note: "Secret friends (六合) — Goat's art + Horse's passion" }, Monkey: { relation: "neutral", note: "Monkey's mischief spooks Horse's sincerity" }, Rooster: { relation: "neutral", note: "Rooster's order cramps Horse's style" }, Dog: { relation: "trine", note: "Trine allies (三合) — Dog's faithfulness + Horse's loyalty" }, Pig: { relation: "neutral", note: "Pig's comfort attracts Horse's exhaustion" } },
  Goat: { Rat: { relation: "six-harm", note: "Six Harms (相害) — Rat's ambition exploits Goat's generosity" }, Ox: { relation: "six-clash", note: "Six Clash (六冲) — Ox's discipline vs Goat's dreaminess" }, Tiger: { relation: "neutral", note: "Tiger's force overwhelms Goat's gentleness" }, Rabbit: { relation: "trine", note: "Trine allies (三合) — aesthetic soulmates" }, Dragon: { relation: "neutral", note: "Dragon's demands exhaust Goat's reserves" }, Snake: { relation: "neutral", note: "Snake's intensity intrigues Goat's mystery" }, Horse: { relation: "secret-friend", note: "Secret friends (六合) — Horse carries Goat to dreams" }, Goat: { relation: "same", note: "Double sensitivity; beautiful but fragile" }, Monkey: { relation: "neutral", note: "Monkey's chaos disrupts Goat's peace" }, Rooster: { relation: "neutral", note: "Rooster's criticism wounds Goat's softness" }, Dog: { relation: "neutral", note: "Dog's protectiveness comforts Goat" }, Pig: { relation: "trine", note: "Trine allies (三合) — domestic paradise" } },
  Monkey: { Rat: { relation: "trine", note: "Trine allies (三合) — two strategists" }, Ox: { relation: "neutral", note: "Ox's slowness bores Monkey's quickness" }, Tiger: { relation: "six-clash", note: "Six Clash (六冲) — Monkey mocks Tiger's dignity" }, Rabbit: { relation: "neutral", note: "Rabbit's fear triggers Monkey's cruelty" }, Dragon: { relation: "trine", note: "Trine allies (三合) — Dragon's vision + Monkey's execution" }, Snake: { relation: "secret-friend", note: "Secret friends (六合) — Monkey's wit + Snake's depth, wary but allied" }, Horse: { relation: "neutral", note: "Horse's sincerity baffles Monkey's irony" }, Goat: { relation: "neutral", note: "Goat's vulnerability makes Monkey uncomfortable" }, Monkey: { relation: "same", note: "Double mischief; fun but untrustworthy" }, Rooster: { relation: "neutral", note: "Rooster's vanity amuses Monkey" }, Dog: { relation: "neutral", note: "Dog's honesty exposes Monkey's tricks" }, Pig: { relation: "six-harm", note: "Six Harms (相害) — Pig's simplicity baffles Monkey's complexity" } },
  Rooster: { Rat: { relation: "neutral", note: "Rat's flexibility undermines Rooster's rules" }, Ox: { relation: "trine", note: "Trine allies (三合) — Rooster's show + Ox's work" }, Tiger: { relation: "neutral", note: "Tiger's sloppiness offends Rooster's precision" }, Rabbit: { relation: "six-clash", note: "Six Clash (六冲) — Rooster's sharp tongue wounds Rabbit" }, Dragon: { relation: "secret-friend", note: "Secret friends (六合) — Rooster's detail completes Dragon" }, Snake: { relation: "trine", note: "Trine allies (三合) — Snake's depth + Rooster's display" }, Horse: { relation: "neutral", note: "Horse's rebellion vs Rooster's order" }, Goat: { relation: "neutral", note: "Goat's dreaminess frustrates Rooster's efficiency" }, Monkey: { relation: "neutral", note: "Monkey's chaos disrupts Rooster's schedule" }, Rooster: { relation: "same", note: "Double perfectionism; excellent or explosive" }, Dog: { relation: "six-harm", note: "Six Harms (相害) — Dog's bluntness + Rooster's bluntness" }, Pig: { relation: "neutral", note: "Pig's messiness offends Rooster" } },
  Dog: { Rat: { relation: "neutral", note: "Rat's self-interest troubles Dog's loyalty" }, Ox: { relation: "neutral", note: "Ox's steadiness + Dog's vigilance" }, Tiger: { relation: "trine", note: "Trine allies (三合) — Tiger's courage + Dog's faith" }, Rabbit: { relation: "secret-friend", note: "Secret friends (六合) — Dog protects, Rabbit nourishes" }, Dragon: { relation: "six-clash", note: "Six Clash (六冲) — Dog's truth vs Dragon's myth" }, Snake: { relation: "neutral", note: "Snake's secrecy alarms Dog's transparency" }, Horse: { relation: "trine", note: "Trine allies (三合) — Horse's freedom + Dog's devotion" }, Goat: { relation: "neutral", note: "Goat's neediness exhausts Dog's reserves" }, Monkey: { relation: "neutral", note: "Monkey's dishonesty triggers Dog's judgment" }, Rooster: { relation: "six-harm", note: "Six Harms (相害) — Rooster's criticism wounds Dog's sensitivity" }, Dog: { relation: "same", note: "Double loyalty; faithful but both brood" }, Pig: { relation: "neutral", note: "Pig's optimism lifts Dog's pessimism" } },
  Pig: { Rat: { relation: "neutral", note: "Same water season, not a 六合 pair — Rat's cleverness + Pig's generosity" }, Ox: { relation: "neutral", note: "Ox's labor + Pig's enjoyment" }, Tiger: { relation: "secret-friend", note: "Secret friends (六合) — Pig's warmth tames Tiger" }, Rabbit: { relation: "trine", note: "Trine allies (三合) — domestic bliss" }, Dragon: { relation: "neutral", note: "Dragon's ambition overwhelms Pig's contentment" }, Snake: { relation: "six-clash", note: "Six Clash (六冲) — Snake's calculation vs Pig's trust" }, Horse: { relation: "neutral", note: "Horse's travel tempts Pig from home" }, Goat: { relation: "trine", note: "Trine allies (三合) — artistic, sensual, peaceful" }, Monkey: { relation: "six-harm", note: "Six Harms (相害) — Monkey's tricks exploit Pig's trust" }, Rooster: { relation: "neutral", note: "Rooster's criticism hurts Pig's softness" }, Dog: { relation: "neutral", note: "Dog's protection + Pig's nourishment" }, Pig: { relation: "same", note: "Double indulgence; blissful but potentially lazy" } },
};
 
// ---------------------------------------------------------------------
// Soul Weather static reference data
// ---------------------------------------------------------------------

const KARMIC_DEBT_NUMBERS = new Set([13, 14, 16, 19]);
const MASTER_NUMBERS = new Set([11, 22, 33]);

const PY_CORE_THEMES: Record<number, string> = {
  1: "new beginnings and self-directed initiative",
  2: "partnership, patience, and diplomacy",
  3: "expression, socializing, and creative growth",
  4: "foundation-building, discipline, and steady work",
  5: "change, freedom, and unexpected movement",
  6: "responsibility, home, and relationships",
  7: "reflection, study, and inner development",
  8: "power, money, and material reckoning",
  9: "completion, release, and closing a cycle",
  11: "heightened intuition and spiritual illumination",
  22: "master-building on a larger, more structural scale",
  33: "master-level compassionate service and teaching",
};

interface PYArchetype {
  label: string;
  verb: string;
}

const PY_ARCHETYPES: Record<number, PYArchetype> = {
  1: { label: "the initiator", verb: "launches" },
  2: { label: "the diplomat", verb: "cooperates" },
  3: { label: "the expresser", verb: "performs" },
  4: { label: "the builder", verb: "consolidates" },
  5: { label: "the free spirit", verb: "moves" },
  6: { label: "the caretaker", verb: "tends" },
  7: { label: "the seeker", verb: "withdraws" },
  8: { label: "the power-broker", verb: "harvests" },
  9: { label: "the closer", verb: "releases" },
};

function archetypeFor(reduced: number): PYArchetype {
  const base = reduceToSingleDigit(reduced);
  return PY_ARCHETYPES[base] ?? PY_ARCHETYPES[9];
}

function ageBandFor(age: number | null): string {
  if (age === null || Number.isNaN(age)) return "age unavailable";
  if (age < 20) return "formation window";
  if (age <= 35) return "launch window";
  if (age <= 55) return "consolidation window";
  return "legacy window";
}

function firstSentenceOf(text: string | undefined | null): string {
  if (!text) return "";
  const flat = text.replace(/\s+/g, " ").trim();
  const m = flat.match(/^.*?[.!?](?=\s|$)/);
  return (m ? m[0] : flat).trim();
}

function buildPYReading(raw: number): PYReading {
  const reduced = reduceNum(raw);
  const compound = lookupCompound(raw);
  const isKarmicDebt = KARMIC_DEBT_NUMBERS.has(raw) || !!compound?.isKarmicDebt;
  const isMasterNumber = MASTER_NUMBERS.has(reduced) || !!compound?.isMasterNumber;
  // Thesis = the essence's opening paragraph plus how it tends to show up
  // (first sentence of manifestationPatterns), not the essence alone.
  const thesis = compound
    ? [compound.vibrationalEssence.split(/\n\n/)[0], firstSentenceOf(compound.manifestationPatterns)].filter(Boolean).join(" ")
    : `A ${reduced}-vibration personal year: ${PY_CORE_THEMES[reduced] ?? "a rhythm shaped by that number's own pattern."}`;
  return {
    raw,
    reduced,
    compoundName: compound?.name ?? null,
    isKarmicDebt,
    isMasterNumber,
    thesis,
    symbolism: compound?.symbolism ?? null,
    karmicNote: isKarmicDebt ? firstSentenceOf(compound?.karmicDynamics) || null : null,
  };
}

function karmicAlertText(reading: PYReading, who: string): string | null {
  if (!reading.isKarmicDebt) return null;
  return `${who} personal year carries karmic-debt voltage (${reading.raw}/${reading.reduced}${reading.compoundName ? ` — ${reading.compoundName}` : ""}). This is not a punishment; it is unfinished business surfacing for resolution, and it rewards structure over improvisation.${reading.karmicNote ? ` ${reading.karmicNote}` : ""}`;
}

function masterAlertText(reading: PYReading, who: string): string | null {
  if (!reading.isMasterNumber) return null;
  return `${who} personal year resolves to a master number (${reading.reduced}). Expect heightened intensity, more symbolic events, and a lower tolerance for anything half-hearted.`;
}

// ---------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------
 
function reduceSingle(n: number): number {
  let v = Math.abs(n);
  while (v > 9) v = String(v).split("").reduce((a, d) => a + Number(d), 0);
  return v || 9;
}
 
function cheiroHarmony(a: number, b: number): { score: number; label: string } {
  const ra = reduceSingle(a);
  const rb = reduceSingle(b);
  if (ra === rb) return { score: 90, label: "identical vibration" };
  const friends = CHEIRO_HARMONY[ra] || [];
  if (friends.includes(rb)) return { score: 85, label: "interchangeable harmony" };
  const trinities = [[1, 4, 8], [2, 7], [3, 6, 9], [5]];
  for (const t of trinities) if (t.includes(ra) && t.includes(rb)) return { score: 80, label: "trinitarian affinity" };
  return { score: 55, label: "neutral field" };
}
 
/**
 * Harish Johari planetary friendship between two numbers. Single source for
 * the Soul Resonance report and the Relationship Oracle in
 * engagement-tools.tsx. Every number 1–9 lists all others as friend, neutral
 * or growth, so the final fallback only triggers for invalid input.
 */
export function johariRelation(a: number, b: number): { score: number; label: string; note: string } {
  const x = reduceSingle(a);
  const y = reduceSingle(b);
  const ax = JOHARI[x];
  const by = JOHARI[y];
  if (!ax || !by) return { score: 55, label: "unclassified mixed field", note: "Johari lens: this pair is mixed; judge by conduct, maturity and the rest of the chart." };
  if (x === y) return { score: 86, label: "same-number mirror", note: `Johari lens: both carry ${ax.planet}. Similarity creates recognition and ease, but can become passive unless the pair keeps a shared aim.` };
  const friend = ax.friends.includes(y) || by.friends.includes(x);
  const growth = ax.growth.includes(y) || by.growth.includes(x);
  const neutral = ax.neutrals.includes(y) || by.neutrals.includes(x);
  if (friend) return { score: 82, label: "friendly planets", note: `Johari lens: ${ax.planet} and ${by.planet} are friendly. This brings ease, affection and low friction; the caution is relaxation without progress.` };
  if (growth) return { score: 74, label: "growth-producing tension", note: `Johari lens: ${ax.planet} and ${by.planet} create alertness. Johari treats enemy/tension numbers as useful for growth because they keep each other active, awake and improving.` };
  if (neutral) return { score: 58, label: "neutral planets", note: `Johari lens: ${ax.planet} and ${by.planet} neither strongly feed nor strongly provoke one another. This is workable, but it needs conscious purpose.` };
  return { score: 55, label: "unclassified mixed field", note: "Johari lens: this pair is mixed; judge by conduct, maturity and the rest of the chart." };
}
 
/** Chinese zodiac pair relation, scored on the shared ZODIAC_SCALE. */
export function chineseZodiacRelation(aAnimal: string, bAnimal: string): { score: number; relation: ZodiacRelation; note: string } {
  const entry = ZODIAC_RELATIONS[aAnimal]?.[bAnimal];
  if (!entry) return { score: ZODIAC_SCALE.unknown, relation: "unknown", note: "No specific relation data for this pairing" };
  return { score: ZODIAC_SCALE[entry.relation], relation: entry.relation, note: entry.note };
}
 
// ---------------------------------------------------------------------
// Building blocks that consume REAL app data
// ---------------------------------------------------------------------
 
export function buildSoulVitals(input: { name: string; day: number; month: number; year: number; gender: string }): SoulVitals {
  const day = Number(input.day);
  const month = Number(input.month);
  const year = Number(input.year);
  const psychic = calculatePsyche(day);
  const destiny = calculateDestiny(day, month, year);
  const lifePath = getLifePathNumber(day, month, year).number;
  const { sign: zodiacAnimal, element: zodiacElement } = getChineseZodiacSign(day, month, year);
  const westernSign = getWesternZodiacSign(day, month, year);
 
  // Reuse the app's own Lo Shu grid generator (numerology.ts) rather than
  // re-deriving the digit algorithm here, so this stays in sync with any
  // future changes to the Lo Shu methodology.
  const loShuNumberCounts = generateLoShuData({ name: input.name, day, month, year, gender: input.gender }).numberCounts;
  const loShuCounts: Record<number, number> = {};
  for (const [digitStr, count] of Object.entries(loShuNumberCounts)) loShuCounts[Number(digitStr)] = count;
 
  const psychomatrixCounts = calculatePsychomatrix(day, month, year).counts;
 
  return {
    name: input.name || "Unknown",
    day, month, year, gender: input.gender || "male",
    psychic, destiny, lifePath,
    zodiacAnimal, zodiacElement, westernSign,
    combinedSign: `${westernSign}/${zodiacAnimal}`,
    loShuCounts,
    psychomatrixCounts,
  };
}
 
function analyzeLoShuOverlay(a: SoulVitals, b: SoulVitals) {
  const aPresent = Object.keys(a.loShuCounts).map(Number).filter((n) => a.loShuCounts[n] > 0);
  const bPresent = Object.keys(b.loShuCounts).map(Number).filter((n) => b.loShuCounts[n] > 0);
  const aVoids = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !aPresent.includes(n));
  const bVoids = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !bPresent.includes(n));
  const aFillsB = aPresent.filter((n) => bVoids.includes(n));
  const bFillsA = bPresent.filter((n) => aVoids.includes(n));
  const shared = aPresent.filter((n) => bPresent.includes(n));
 
  const voidNarrative =
    aFillsB.length > 0
      ? `${a.name}'s ${aFillsB.join(", ")} ${aFillsB.length === 1 ? "fills" : "fill"} ${b.name}'s empty ${aFillsB.length === 1 ? "space" : "spaces"} — karmic completion.`
      : bFillsA.length > 0
        ? `${b.name}'s ${bFillsA.join(", ")} ${bFillsA.length === 1 ? "fills" : "fill"} ${a.name}'s empty ${bFillsA.length === 1 ? "space" : "spaces"} — karmic completion.`
        : "No void-filling between these grids — both are self-contained.";
  const ampNarrative =
    shared.length > 0
      ? `Shared ${shared.join(", ")} — common ground, ${shared.length > 3 ? "amplified strength" : "balanced presence"}.`
      : "No shared numbers — complementary but foreign territories.";
 
  return {
    voidFill: { numbers: [...aFillsB, ...bFillsA], narrative: voidNarrative, score: aFillsB.length > 0 || bFillsA.length > 0 ? 85 : 55 },
    amplification: { numbers: shared, narrative: ampNarrative, score: shared.length > 3 ? 75 : shared.length > 0 ? 65 : 50 },
  };
}
 
// Mirrors the app's own psychomatrix line groupings from
// calculatePsychomatrix (row_1/2/3, col_1/2/3 in psychomatrixData.ts):
// willpower=1,4,7 · energy=2,5,8 · stability=3,6,9 · purpose=1,2,3 ·
// family=4,5,6 · habits=7,8,9.
const sumPsychomatrixDigits = (c: Record<number, number>, digits: number[]) => digits.reduce((t, d) => t + (c[d] || 0), 0);

/** Numeric A−B difference per psychomatrix line (positive = A has more). */
export function psychomatrixLineDeltas(a: SoulVitals, b: SoulVitals) {
  const ac = a.psychomatrixCounts;
  const bc = b.psychomatrixCounts;
  const delta = (digits: number[]) => sumPsychomatrixDigits(ac, digits) - sumPsychomatrixDigits(bc, digits);
  return {
    willpower: delta([1, 4, 7]),
    energy: delta([2, 5, 8]),
    stability: delta([3, 6, 9]),
    purpose: delta([1, 2, 3]),
    family: delta([4, 5, 6]),
    habits: delta([7, 8, 9]),
  };
}

function comparePsychomatrixLines(a: SoulVitals, b: SoulVitals) {
  const ac = a.psychomatrixCounts;
  const bc = b.psychomatrixCounts;
  const sum = sumPsychomatrixDigits;
  const compare = (aVal: number, bVal: number, label: string): string => {
    const diff = aVal - bVal;
    if (Math.abs(diff) <= 1) return `${label}: Equal — shared ${label.toLowerCase()} intensity.`;
    const leader = diff > 0 ? a.name : b.name;
    const follower = diff > 0 ? b.name : a.name;
    return `${label}: ${leader} leads with ${Math.abs(diff)} more — ${follower} is supported.`;
  };
  return {
    willpower: compare(sum(ac, [1, 4, 7]), sum(bc, [1, 4, 7]), "Willpower"),
    energy: compare(sum(ac, [2, 5, 8]), sum(bc, [2, 5, 8]), "Energy"),
    stability: compare(sum(ac, [3, 6, 9]), sum(bc, [3, 6, 9]), "Stability"),
    purpose: compare(sum(ac, [1, 2, 3]), sum(bc, [1, 2, 3]), "Purpose"),
    family: compare(sum(ac, [4, 5, 6]), sum(bc, [4, 5, 6]), "Family/Health"),
    habits: compare(sum(ac, [7, 8, 9]), sum(bc, [7, 8, 9]), "Habits/Talent"),
  };
}
 
export function getFamousTwins(a: SoulVitals, b: SoulVitals): Array<{ name: string; sharedTrait: string }> {
  const twins: Array<{ name: string; sharedTrait: string }> = [];
  const isSelf = (p: FamousPerson, s: SoulVitals) => p.day === s.day && p.month === s.month && p.year === s.year;
  const sameDay = famousBirthdays.filter((p) => p.day === a.day && p.month === a.month && !isSelf(p, a) && !isSelf(p, b));
  sameDay.slice(0, 3).forEach((p) => twins.push({ name: p.name, sharedTrait: `Born ${a.day}/${a.month} — shares your birth day` }));
  const sameAnimal = famousBirthdays.filter((p) => getChineseZodiacSign(p.day, p.month, p.year).sign === a.zodiacAnimal && !isSelf(p, a) && !isSelf(p, b));
  sameAnimal.slice(0, 3).forEach((p) => twins.push({ name: p.name, sharedTrait: `Chinese ${a.zodiacAnimal} — same zodiac animal` }));
  return twins.slice(0, 5);
}
 
// ---------------------------------------------------------------------
// Personal Year interaction: how two people's current-cycle personal
// years collide or harmonize, with explicit karmic-debt / master-number
// awareness (previously absent from the relationship engine entirely).
// ---------------------------------------------------------------------
 
function pyInteractionNarrative(aName: string, aArch: PYArchetype, bName: string, bArch: PYArchetype): string {
  if (aArch === bArch) {
    return `${aName} and ${bName} are both moving as ${aArch.label} this year — energizing when your aims align, competitive when you both insist on setting the pace.`;
  }
  return `${aName} is moving as ${aArch.label} this year (${aArch.verb}), while ${bName} is moving as ${bArch.label} (${bArch.verb}). The pairing works best when each role is consciously divided rather than silently assumed.`;
}
 
export function analyzePYInteraction(a: SoulVitals, b: SoulVitals, targetYear = new Date().getFullYear()): PYInteractionAnalysis {
  const aDirect = buildPYReading(computeRawPersonalYear(a.day, a.month, targetYear));
  const aClassic = buildPYReading(computeRawPersonalYearClassic(a.day, a.month, targetYear));
  const bDirect = buildPYReading(computeRawPersonalYear(b.day, b.month, targetYear));
  const bClassic = buildPYReading(computeRawPersonalYearClassic(b.day, b.month, targetYear));
 
  const aArch = archetypeFor(aDirect.reduced);
  const bArch = archetypeFor(bDirect.reduced);
  const narrative = pyInteractionNarrative(a.name, aArch, b.name, bArch);
 
  const karmicHits = [aDirect, aClassic, bDirect, bClassic].filter((r) => r.isKarmicDebt);
  const masterHits = [aDirect, aClassic, bDirect, bClassic].filter((r) => r.isMasterNumber);
 
  let interactionType: PYInteractionAnalysis["interactionType"];
  let warning: string | null = null;
  let opportunity: string | null = null;
 
  if (karmicHits.length > 0) {
    interactionType = "karmic-tension";
    warning = `${karmicHits.length > 1 ? "Both of you carry" : "One of you carries"} a karmic-debt personal year this cycle (${karmicHits.map((r) => `${r.raw}/${r.reduced}`).join(", ")}). Old, unfinished patterns are likely to resurface in this relationship until they are consciously addressed rather than avoided.`;
  } else if (masterHits.length > 0) {
    interactionType = "master-amplification";
    opportunity = `${masterHits.length > 1 ? "Both of you carry" : "One of you carries"} a master-number personal year this cycle (${masterHits.map((r) => r.reduced).join(", ")}). Anything you build together now has higher-than-usual potential to become significant, provided it is backed by real follow-through rather than only inspiration.`;
  } else {
    const aBase = reduceToSingleDigit(aDirect.reduced);
    const bBase = reduceToSingleDigit(bDirect.reduced);
    const distance = Math.abs(aBase - bBase);
    if (distance <= 2) interactionType = "harmonious";
    else if (distance >= 6) interactionType = "challenging";
    else interactionType = "neutral";
  }
 
  if (interactionType === "challenging") {
    warning = `${a.name} is running a ${aDirect.raw}/${aDirect.reduced} year while ${b.name} is running a ${bDirect.raw}/${bDirect.reduced} year — the two rhythms are pulling in fairly different directions this cycle, so timing and pacing need to be discussed openly rather than assumed.`;
  }
  if (interactionType === "harmonious") {
    opportunity = `${a.name}'s ${aDirect.raw}/${aDirect.reduced} year and ${b.name}'s ${bDirect.raw}/${bDirect.reduced} year are moving in a compatible rhythm this cycle, which makes shared plans easier to time well.`;
  }
 
  return { aDirect, aClassic, bDirect, bClassic, interactionType, narrative, warning, opportunity };
}
 
// ---------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------
 
// ---------------------------------------------------------------------
// Codify Suzanne White: parse the compatibilities paragraph to detect
// whether a partner's actual Western sign and Chinese animal appear in
// the positive (appreciation) or negative (dissatisfaction/avoidance)
// portion of the text.
//
// Classification model (single source of truth for every Suzanne White
// indicator in the app — the Compatibility Outlook badges AND the
// suzanneWhiteScore lens in engagement-tools.tsx must both go through
// classifySuzanneWhiteMentions so they can never contradict each other):
//
//   1. Split the paragraph into sentences.
//   2. Find every positive-marker and avoid-marker position in the
//      sentence (POSITIVE_OVERRIDE_PATTERN / CLEAR_AVOID_PATTERN).
//   3. For each sign mention in the sentence, the verdict is decided by
//      the NEAREST marker (by character distance; ties prefer positive).
//      This correctly handles sentences that mix both verdicts, e.g.
//      "Erase Horses from your mind altogether, and prefer the solid
//      Aries/Ox", and list sentences like
//      "No Virgo/Rats or Virgo/Roosters for you." where the only marker
//      ("No …") is at the start of the sentence.
//   4. Aggregate across sentences: positive-only => positive,
//      avoid-only => avoid, both => mixed, neither => unstated.
//
// The pattern sets below were validated against all 144 combined-sign
// compatibilities paragraphs in lib/new-astrology (see the regression
// script in the project notes: validate-compat). Do not edit the text
// data or these patterns without re-running that validation.

// Phase 1 — unmistakably POSITIVE phrases (override any negation words)
const POSITIVE_OVERRIDE_PATTERN = /can\u2019t go wrong|can't go wrong|won\u2019t be disappointed|won't be disappointed|won\u2019t regret|won't regret|won\u2019t have any trouble|won't have any trouble|particularly happy|you\u2019ll find a good|you'll find a good|you\u2019ll find happiness|you'll find happiness|best bet|ideal match|great couple|perfect mate|blissfully|harmonious|recommended match|advised to seek|i see you with|you get on with|you get on especially well|you get along with|normally you get along with|should be compatible|good match|fine mate|happy alliance|harmony incarnate|sound love|durable|solid relationship|enduring love|great passion|not to be excluded|can\u2019t resist|can't resist|you\u2019ll be particularly|you'll be particularly|won\u2019t have any trouble cohabiting|won't have any trouble cohabiting|excellent|will be happy|in your future|make sure you choose|prefer the solid|why not invite|will enhance your existence|crushes on|will make you laugh|pep up your|stay close to|don\u2019t hesitate to choose|don't hesitate to choose|don\u2019t forget that|don't forget that|who adore you|don\u2019t be surprised if|don't be surprised if|you\u2019re fond of|you're fond of|fond of|you\u2019ll fall for|you'll fall for|fall for|work well|winner mates|swell bedfellows|bedfellows|are cute|cute, too|excite you|attract you|stand by you|please you|confront well|for your pleasure|advise you to look into|bring you joy|bring you their|make you happy, too|a wide choice/gi;

// Phase 2 — unmistakably NEGATIVE phrases: imperative commands AND
// descriptive disdain characterizations, including the corpus structures
// the old classifier missed ("No X or Y for you.", "Nor do I suggest X",
// "Erase X from your mind", "give up on", "nix on", "don't hang around
// with", "less compatible are", "too X" for a fixed list of negative
// adjectives, etc.). The "too X" list is explicit on purpose: a generic
// "too <any word>" rule would also fire on praise such as "too good to miss".
// Includes both curly (U+2019) and straight (U+0027) apostrophe variants.
const CLEAR_AVOID_PATTERN = /stay away|avoid|shun|steer clear|steer around|give wide berth|wide berth|flee|poison|disastrous|don\u2019t pick|don't pick|don\u2019t marry|don't marry|don\u2019t go getting|don't go getting|don\u2019t bother with|don't bother with|don\u2019t go getting yourself involved|don't go getting yourself involved|refrain|leave.*alone|leave.*if you can|too like you.*too.*different|worse than.*bark|bite is worse|won\u2019t last|won't last|won\u2019t work|won't work|won\u2019t work for|won't work for|don\u2019t work for|don't work for|never work|dissonance|ugly duo|no marriage|not for you|not really suited|ill-suited|don\u2019t see eye to eye|don't see eye to eye|polarized outlooks|too cool to keep.*fascinated|exasperate you|unnerve you|unnerve.*the most|annoy you|frustrate you|irritat|you.*hate|they.*hate|hate inertia|disappointments aplenty|disappointment.*await|too.*different.*other|not much love|boredom|stodgy|gloomy|killjoy|beware|watch out for|^no\b|^nor\b|^not so\b|nix\b|except,? perhaps|erase .* from your mind|forget about|give up on|get on your nerves|never get on with|never ideal|don\u2019t make it for you|don't make it for you|don\u2019t get along with|don't get along with|do not get along|don\u2019t get on with|don't get on with|don\u2019t get much out of|don't get much out of|don\u2019t have much affinity|don't have much affinity|don\u2019t hang around with|don't hang around with|don\u2019t be led down the aisle by|don't be led down the aisle by|don\u2019t be flattered by|don't be flattered by|don\u2019t trifle with|don't trifle with|don\u2019t set your heart on|don't set your heart on|don\u2019t try coupling with|don't try coupling with|don\u2019t take up with|don't take up with|don\u2019t be in a hurry to marry|don't be in a hurry to marry|don\u2019t promote any long-standing relationships with|don't promote any long-standing relationships with|don\u2019t even think about marrying|don't even think about marrying|don\u2019t even entertain the thought|don't even entertain the thought|don\u2019t get caught up in|don't get caught up in|don\u2019t get involved with|don't get involved with|don\u2019t get mixed up with|don't get mixed up with|don\u2019t chase after|don't chase after|don\u2019t go getting involved with|don't go getting involved with|don\u2019t get tangled up in|don't get tangled up in|don\u2019t bank on|don't bank on|i don\u2019t advise|i don't advise|i don\u2019t vote for|i don't vote for|i don\u2019t see you taking up with|i don't see you taking up with|i don\u2019t believe you can be happy forever with|i don't believe you can be happy forever with|i\u2019d leave|i'd leave|i would leave|you are advised to forget|incompatible signs|don\u2019t always have .* best interests|don't always have .* best interests|stay clear|stay out of the way of|you clash with|clash with your own|you don\u2019t seem to think alike|you don't seem to think alike|less compatible|i warn you|make yourself scarce|give you trouble|overpower you|drive you mad|drive you crazy|demand too much|demand far too much|far too much stability|too much of a challenge|too tightly|for the pig\u2019s own good|not funky enough|too harsh|too\s+(?:aggressive|bossy|businesslike|chaotic|cocky|competitive|complex|controlling|critical|cunning|cynical|domineering|egocentric|elastic|emotional|fearful|fervent|fiery|flashy|flighty|harsh|hasty|heady|impetuous|indecisive|intense|manipulative|moody|possessive|practical|presumptuous|pushy|restless|rigid|scatty|self-absorbed|sensitive|serious|slippery|speedy|stodgy|stubborn|unadventurous|unpredictable|whimsical|wishy-washy)(?![a-z-])/gi;

export type SuzanneWhiteVerdict = "positive" | "avoid" | "mixed" | "unstated";

export interface SuzanneWhiteMentionVerdicts {
  combined: SuzanneWhiteVerdict;
  western: SuzanneWhiteVerdict;
  animal: SuzanneWhiteVerdict;
  details: {
    combined: string;
    western: string;
    animal: string;
  };
}

function markerIndices(re: RegExp, sentence: string): number[] {
  re.lastIndex = 0;
  const out: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(sentence)) !== null) {
    out.push(m.index);
    if (m.index === re.lastIndex) re.lastIndex++;
  }
  return out;
}

const SW_WESTERN = "aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces";
const SW_ANIMALS = "rat|ox|tiger|rabbit|dragon|snake|horse|goat|monkey|rooster|dog|pig";

/**
 * Lower-cases and writes every combined sign one way, "western/animal", so
 * "Leo Dogs", "Leo-Dog", "Leo / Dog" and "Leo the Dog" all match "leo/dog".
 */
export function normalizeSuzanneWhiteText(text: string): string {
  return text
    .toLowerCase()
    .replace(new RegExp(`\\b(${SW_WESTERN})(?:\\s*[/-]\\s*|\\s+)(?:the\\s+)?(${SW_ANIMALS})`, "g"), "$1/$2");
}

/**
 * Every position where `token` appears as a word. Plural and demonym forms
 * count ("oxen", "librans", "piggies"); words that merely contain the token
 * do not ("frustrate", "admiration", "diaries", "library").
 */
function tokenOccurrences(sentence: string, token: string): number[] {
  const escaped = token.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
  const re = new RegExp(`(?<![a-z])${escaped}(?:s|es|en|n|ns|gy|gies)?(?![a-z])`, "g");
  const out: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(sentence)) !== null) out.push(m.index);
  return out;
}

/** Verdict for one mention position: nearest marker wins; ties prefer positive. */
/**
 * A verdict marker governs the sign that FOLLOWS it ("avoid Leo/Dogs",
 * "you'll find happiness with Leo/Dogs"), so each mention takes the closest
 * marker that starts before it. Only when no marker precedes it does it fall
 * back to the closest marker after it ("Leo/Dogs are best avoided").
 * Ties go to "avoid" (a caution outranks a compliment).
 */
function nearestMarkerVerdict(at: number, posIdx: number[], avoidIdx: number[]): "positive" | "avoid" | null {
  const pick = (candidates: Array<[number, "positive" | "avoid"]>): "positive" | "avoid" | null => {
    let verdict: "positive" | "avoid" | null = null;
    let bestD = Number.POSITIVE_INFINITY;
    for (const [d, v] of candidates) {
      if (d < bestD || (d === bestD && v === "avoid")) {
        bestD = d;
        verdict = v;
      }
    }
    return verdict;
  };
  const all: Array<[number, "positive" | "avoid"]> = [
    ...posIdx.map((p) => [p, "positive"] as [number, "positive"]),
    ...avoidIdx.map((a) => [a, "avoid"] as [number, "avoid"]),
  ];
  const before = all.filter(([idx]) => idx <= at).map(([idx, v]) => [at - idx, v] as [number, "positive" | "avoid"]);
  if (before.length) return pick(before);
  return pick(all.map(([idx, v]) => [idx - at, v] as [number, "positive" | "avoid"]));
}

/**
 * Verdicts for EVERY mention of `token` in one sentence (the old version
 * only looked at the first mention, so "prefer X … but avoid X" lost the
 * second verdict).
 */
function sentenceMentionVerdicts(sentence: string, token: string): { positive: boolean; avoid: boolean } {
  const result = { positive: false, avoid: false };
  const hits = tokenOccurrences(sentence, token);
  if (hits.length === 0) return result;
  const posIdx = markerIndices(POSITIVE_OVERRIDE_PATTERN, sentence);
  const avoidIdx = markerIndices(CLEAR_AVOID_PATTERN, sentence);
  for (const at of hits) {
    const v = nearestMarkerVerdict(at, posIdx, avoidIdx);
    if (v === "positive") result.positive = true;
    else if (v === "avoid") result.avoid = true;
  }
  return result;
}

/**
 * Single source of truth for Suzanne White (New Astrology) compatibility
 * classification. Returns per-dimension verdicts (combined sign, Western
 * sign alone, Chinese animal alone) plus human-readable evidence details.
 */
export function classifySuzanneWhiteMentions(
  sourceText: string,
  partnerCombinedSign: string,
  partnerWestern: string,
  partnerAnimal: string,
): SuzanneWhiteMentionVerdicts {
  const lower = normalizeSuzanneWhiteText(sourceText);
  const lowerCombined = normalizeSuzanneWhiteText(partnerCombinedSign);
  const lowerWestern = partnerWestern.toLowerCase();
  const lowerAnimal = partnerAnimal.toLowerCase();
  const sentences = (lower.match(/[^.!?]+[.!?]+/g) || [lower]).map((s) => s.trim());

  let cPos = false;
  let cAvoid = false;
  let wPos = false;
  let wAvoid = false;
  let aPos = false;
  let aAvoid = false;
  const cPositive: string[] = [];
  const cNegative: string[] = [];
  const wPositive: string[] = [];
  const wNegative: string[] = [];
  const aPositive: string[] = [];
  const aNegative: string[] = [];

  for (const s of sentences) {
    const jc = sentenceMentionVerdicts(s, lowerCombined);
    const jw = sentenceMentionVerdicts(s, lowerWestern);
    const ja = sentenceMentionVerdicts(s, lowerAnimal);

    if (jc.positive) {
      cPos = true;
      cPositive.push(`${partnerCombinedSign} is recommended (\"${s.slice(0, 80)}…\")`);
    }
    if (jc.avoid) {
      cAvoid = true;
      cNegative.push(`${partnerCombinedSign} is cautioned against (\"${s.slice(0, 80)}…\")`);
    }
    if (jw.positive) {
      wPos = true;
      wPositive.push(`${partnerWestern} appears in a recommendation (\"${s.slice(0, 80)}…\")`);
    }
    if (jw.avoid) {
      wAvoid = true;
      wNegative.push(`${partnerWestern} appears in a caution (\"${s.slice(0, 80)}…\")`);
    }
    if (ja.positive) {
      aPos = true;
      aPositive.push(`${partnerAnimal} appears in a recommendation (\"${s.slice(0, 80)}…\")`);
    }
    if (ja.avoid) {
      aAvoid = true;
      aNegative.push(`${partnerAnimal} appears in a caution (\"${s.slice(0, 80)}…\")`);
    }
  }

  const reduce = (pos: boolean, avoid: boolean): SuzanneWhiteVerdict =>
    pos && avoid ? "mixed" : pos ? "positive" : avoid ? "avoid" : "unstated";

  return {
    combined: reduce(cPos, cAvoid),
    western: reduce(wPos, wAvoid),
    animal: reduce(aPos, aAvoid),
    details: {
      combined:
        cPositive.concat(cNegative).join("; ") ||
        `No explicit mention of ${partnerCombinedSign} found`,
      western:
        wPositive.concat(wNegative).join("; ") ||
        `No explicit mention of ${partnerWestern} found`,
      animal:
        aPositive.concat(aNegative).join("; ") ||
        `No explicit mention of ${partnerAnimal} found`,
    },
  };
}

function codifySuzanneWhite(
  sourceText: string,
  partnerCombinedSign: string,
  partnerWestern: string,
  partnerAnimal: string,
): {
  appreciation: { westernSignMatch: boolean; chineseAnimalMatch: boolean; combinedSignMatch: boolean; details: string };
  dissatisfaction: { westernSignMatch: boolean; chineseAnimalMatch: boolean; combinedSignMatch: boolean; details: string };
} {
  const v = classifySuzanneWhiteMentions(sourceText, partnerCombinedSign, partnerWestern, partnerAnimal);

  const isAppreciated = (verdict: SuzanneWhiteVerdict) =>
    verdict === "positive" || verdict === "mixed";
  const isCautioned = (verdict: SuzanneWhiteVerdict) =>
    verdict === "avoid" || verdict === "mixed";

  return {
    appreciation: {
      westernSignMatch: isAppreciated(v.western),
      chineseAnimalMatch: isAppreciated(v.animal),
      combinedSignMatch: isAppreciated(v.combined),
      details: [v.details.western, v.details.animal, v.details.combined].join("; "),
    },
    dissatisfaction: {
      westernSignMatch: isCautioned(v.western),
      chineseAnimalMatch: isCautioned(v.animal),
      combinedSignMatch: isCautioned(v.combined),
      details: [v.details.western, v.details.animal, v.details.combined].join("; "),
    },
  };
}

export function generateSoulResonance(a: SoulVitals, b: SoulVitals, targetYear = new Date().getFullYear()): SoulResonanceReport {
  const psychicHarmony = cheiroHarmony(a.psychic, b.psychic);
  const destinyHarmony = cheiroHarmony(a.destiny, b.destiny);
  const lifePathHarmony = cheiroHarmony(a.lifePath, b.lifePath);
  const johari = johariRelation(a.psychic, b.psychic);
  const chinese = chineseZodiacRelation(a.zodiacAnimal, b.zodiacAnimal);
  const loShu = analyzeLoShuOverlay(a, b);
  const psychoCompare = comparePsychomatrixLines(a, b);
  const pyInteraction = analyzePYInteraction(a, b, targetYear);

  // ── Johari rich compatibility (new) ────────────────────────────────
  const johariCompat = (() => {
    const profileA = JOHARI_PSYCHIC_PROFILES[reduceSingle(a.psychic)];
    const profileB = JOHARI_PSYCHIC_PROFILES[reduceSingle(b.psychic)];
    if (!profileA || !profileB) return undefined;

    // Multi-dimensional friend/enemy analysis (psychic, destiny, life path)
    const aPsyViewBPsy = johariViewOf(reduceSingle(a.psychic), reduceSingle(b.psychic));
    const bPsyViewAPsy = johariViewOf(reduceSingle(b.psychic), reduceSingle(a.psychic));
    const aDestViewBDest = johariViewOf(reduceSingle(a.destiny), reduceSingle(b.destiny));
    const bDestViewADest = johariViewOf(reduceSingle(b.destiny), reduceSingle(a.destiny));
    const aLPViewBLP = johariViewOf(reduceSingle(a.lifePath), reduceSingle(b.lifePath));
    const bLPViewALP = johariViewOf(reduceSingle(b.lifePath), reduceSingle(a.lifePath));

    // Composite verdict: count friendly vs enemy across all 6 directional views
    const allViews = [aPsyViewBPsy, bPsyViewAPsy, aDestViewBDest, bDestViewADest, aLPViewBLP, bLPViewALP];
    const friendlyCount = allViews.filter(v => v === "Friendly").length;
    const enemyCount = allViews.filter(v => v === "Enemy").length;
    const neutralCount = allViews.filter(v => v === "Neutral").length;

    let compositeVerdict: "Strongly Friendly" | "Generally Friendly" | "Mixed" | "Generally Tense" | "Strongly Tense";
    let compositeExplanation: string;

    if (friendlyCount >= 5) {
      compositeVerdict = "Strongly Friendly";
      compositeExplanation = `${friendlyCount} of 6 number dimensions show mutual friendliness — ${profileA.planet} (${a.psychic}/${a.destiny}/${a.lifePath}) and ${profileB.planet} (${b.psychic}/${b.destiny}/${b.lifePath}) are naturally drawn to each other across almost every dimension. A deeply supportive bond.`;
    } else if (friendlyCount >= 3 && enemyCount <= 1) {
      compositeVerdict = "Generally Friendly";
      compositeExplanation = `${friendlyCount} friendly, ${neutralCount} neutral, ${enemyCount} tense dimensions. The bond has a natural warmth in most areas, with only minor friction points that conscious effort can smooth over.`;
    } else if (enemyCount >= 5) {
      compositeVerdict = "Strongly Tense";
      compositeExplanation = `${enemyCount} of 6 number dimensions show mutual tension — ${profileA.planet} and ${profileB.planet} energies clash across psychic, destiny and life path. This demands significant awareness and compromise to sustain.`;
    } else if (enemyCount >= 3) {
      compositeVerdict = "Generally Tense";
      compositeExplanation = `${enemyCount} tense, ${neutralCount} neutral, ${friendlyCount} friendly dimensions. The relationship encounters structural resistance in key areas. Areas of friendliness exist but need active cultivation.`;
    } else {
      compositeVerdict = "Mixed";
      compositeExplanation = `${friendlyCount} friendly, ${neutralCount} neutral, ${enemyCount} tense dimensions across psychic (${aPsyViewBPsy}/${bPsyViewAPsy}), destiny (${aDestViewBDest}/${bDestViewADest}) and life path (${aLPViewBLP}/${bLPViewALP}). Neither naturally harmonious nor inherently hostile — the outcome depends on conscious effort and mutual respect.`;
    }

    return {
      profileA,
      profileB,
      psychicPair: getJohariPairCompatibility(a.psychic, b.psychic),
      destinyPair: getJohariPairCompatibility(a.destiny, b.destiny),
      crossPairAB: getJohariPairCompatibility(a.psychic, b.destiny),
      crossPairBA: getJohariPairCompatibility(b.psychic, a.destiny),
      aPsychicViewOfBPsychic: aPsyViewBPsy,
      aDestinyViewOfBDestiny: aDestViewBDest,
      aLifePathViewOfBLifePath: aLPViewBLP,
      bPsychicViewOfAPsychic: bPsyViewAPsy,
      bDestinyViewOfADestiny: bDestViewADest,
      bLifePathViewOfALifePath: bLPViewALP,
      compositeVerdict,
      compositeExplanation,
      // Legacy fields for backward compatibility
      aViewOfB: aPsyViewBPsy,
      bViewOfA: bPsyViewAPsy,
    };
  })();

  // ── Combined Soul Weather (new) ─────────────────────────────────────
  const aPY = reduceNum(computeRawPersonalYear(a.day, a.month, targetYear));
  const bPY = reduceNum(computeRawPersonalYear(b.day, b.month, targetYear));
  const combinedWeather = generateCombinedWeather(aPY, bPY);
 
  // Each domain's weights sum to 1.00 and match the domainWeights shown on
  // the layers below. Romance used to count psychic harmony twice
  // (0.30 + 0.10); the 0.10 slot is destiny harmony, as the layer table says.
  const romanceScore = Math.round(
    psychicHarmony.score * 0.30 + loShu.voidFill.score * 0.25 + chinese.score * 0.20 + johari.score * 0.15 + destinyHarmony.score * 0.10,
  );
  // Willpower complementarity: a clear lead (difference of 2+ marks on the
  // 1-4-7 line) gives defined roles (75); near-equal willpower scores 65.
  // Uses the numeric delta, not a search for "leads" in the display text.
  const willpowerScore = Math.abs(psychomatrixLineDeltas(a, b).willpower) > 1 ? 75 : 65;
  const partnershipScore = Math.round(
    destinyHarmony.score * 0.30 + willpowerScore * 0.20 + chinese.score * 0.15 + lifePathHarmony.score * 0.20 + loShu.amplification.score * 0.15,
  );
  const friendshipScore = Math.round(
    johari.score * 0.30 + lifePathHarmony.score * 0.20 + (a.combinedSign === b.combinedSign ? 90 : 60) * 0.15 + psychicHarmony.score * 0.15 + loShu.voidFill.score * 0.20,
  );
  const overall = Math.round((romanceScore + partnershipScore + friendshipScore) / 3);
 
  const layers: ResonanceLayer[] = [
    { label: "Psychic Vibration", score: psychicHarmony.score, verdict: psychicHarmony.label, detail: `Birth-day resonance: ${a.psychic} and ${b.psychic} — ${psychicHarmony.label}.`, domainWeights: { romance: 30, partnership: 0, friendship: 15 } },
    { label: "Destiny Vibration", score: destinyHarmony.score, verdict: destinyHarmony.label, detail: `Life-purpose resonance: ${a.destiny} and ${b.destiny} — ${destinyHarmony.label}.`, domainWeights: { romance: 10, partnership: 30, friendship: 0 } },
    { label: "Life Path", score: lifePathHarmony.score, verdict: lifePathHarmony.label, detail: `Journey resonance: ${a.lifePath} and ${b.lifePath}.`, domainWeights: { romance: 0, partnership: 20, friendship: 20 } },
    { label: "Vedic Johari", score: johari.score, verdict: johari.label, detail: johari.note, domainWeights: { romance: 15, partnership: 0, friendship: 30 } },
    { label: "Chinese Zodiac", score: chinese.score, verdict: chinese.relation, detail: chinese.note, domainWeights: { romance: 20, partnership: 15, friendship: 0 } },
    { label: "Lo Shu Void Fill", score: loShu.voidFill.score, verdict: loShu.voidFill.numbers.length > 0 ? "karmic completion" : "self-contained", detail: loShu.voidFill.narrative, domainWeights: { romance: 25, partnership: 0, friendship: 20 } },
    { label: "Lo Shu Amplification", score: loShu.amplification.score, verdict: loShu.amplification.numbers.length > 0 ? "shared power" : "complementary", detail: loShu.amplification.narrative, domainWeights: { romance: 0, partnership: 15, friendship: 0 } },
  ];
 
  const parts: string[] = [];
  parts.push(`Overall Resonance: ${overall}/100.`);
  parts.push(
    romanceScore >= 80 ? "Romance carries strong voltage — the psychic numbers harmonize and the zodiac supports attraction." : romanceScore >= 60 ? "Romance is present but needs cultivation — the foundation exists." : "Romantic friction is significant; this needs conscious work and clear agreements.",
  );
  parts.push(
    partnershipScore >= 80 ? "Excellent business pairing — complementary destinies and aligned willpower create productive synergy." : partnershipScore >= 60 ? "A workable partnership with defined roles; clarify who leads which domain." : "Partnership faces structural tension — consider advisory roles rather than co-leadership.",
  );
  parts.push(
    friendshipScore >= 80 ? "Natural friendship — shared rhythms and easy trust." : friendshipScore >= 60 ? "Friendship grows with shared experience; not instant, but durable." : "Friendship needs active maintenance — different wavelengths that can harmonize with effort.",
  );
  parts.push(loShu.voidFill.narrative);
  parts.push(loShu.amplification.narrative);
  parts.push(pyInteraction.narrative);
  if (pyInteraction.warning) parts.push(pyInteraction.warning);
  if (pyInteraction.opportunity) parts.push(pyInteraction.opportunity);
 
  return {
    soulA: a, soulB: b, overall,
    domains: { romance: romanceScore, partnership: partnershipScore, friendship: friendshipScore },
    layers,
    chineseZodiac: chinese,
    loShuOverlay: { voidFill: loShu.voidFill, amplification: loShu.amplification },
    psychomatrixComparison: psychoCompare,
    famousTwins: getFamousTwins(a, b),
    reading: parts.join(" "),
    pyInteraction,
    johariCompatibility: johariCompat,
    combinedWeather,
    // ── Chinese Zodiac Compatibility Text (verbatim) ────────────────
    chineseZodiacCompatText:
      zodiacData[a.zodiacAnimal]?.compatibilities?.[b.zodiacAnimal] ||
      zodiacData[b.zodiacAnimal]?.compatibilities?.[a.zodiacAnimal] ||
      "",
    // ── New Astrology Codified Compatibility ─────────────────────────
    newAstrologyCompat: (() => {
      const aText = NEW_ASTROLOGY_DATA[a.combinedSign]?.compatibilities || "";
      const bText = NEW_ASTROLOGY_DATA[b.combinedSign]?.compatibilities || "";
      if (!aText && !bText) return undefined;
      const aCodify = codifySuzanneWhite(aText, b.combinedSign, b.westernSign, b.zodiacAnimal);
      const bCodify = codifySuzanneWhite(bText, a.combinedSign, a.westernSign, a.zodiacAnimal);
      return {
        aCompatText: aText,
        bCompatText: bText,
        aAppreciationOfB: aCodify.appreciation,
        aDissatisfactionWithB: aCodify.dissatisfaction,
        bAppreciationOfA: bCodify.appreciation,
        bDissatisfactionWithA: bCodify.dissatisfaction,
      };
    })(),
  };
}
 
// ---------------------------------------------------------------------
// Famous-person birthday bank integration
// ---------------------------------------------------------------------
 
export interface FamousSoulVitals extends SoulVitals {
  id: string;
  tags: string[];
  source: "famous-birthdays";
}
 
export interface FamousPersonalYearMatch {
  soul: FamousSoulVitals;
  score: number;
  reasons: string[];
  directRaw: number;
  directReduced: number;
  classicRaw: number;
  classicReduced: number;
  directName: string;
  classicName: string;
}
 
function famousId(p: FamousPerson): string {
  return `famous:${p.name}:${p.day}-${p.month}-${p.year}`;
}
 
// Lazily built + memoized: buildSoulVitals() runs a Lo Shu grid pass and a
// psychomatrix pass per person, so eagerly mapping this over the full
// ~1,650-entry famous-birthdays bank at module-import time would spend that
// cost on every screen that merely imports this module, even ones that
// never touch the famous-birthday features. Computing it once, on first
// actual use, keeps import-time cost at zero while still only paying the
// full cost a single time for the lifetime of the session.
let famousSoulCache: FamousSoulVitals[] | null = null;
 
export function getFamousSoulBank(): FamousSoulVitals[] {
  if (!famousSoulCache) {
    famousSoulCache = famousBirthdays.map((p) => ({
      ...buildSoulVitals({ name: p.name, day: p.day, month: p.month, year: p.year, gender: p.gender }),
      id: famousId(p),
      tags: p.tags || [],
      source: "famous-birthdays" as const,
    }));
  }
  return famousSoulCache;
}
 
function compoundLabel(raw: number): string {
  const c = lookupCompound(raw);
  const reduced = reduceNum(raw);
  return c ? `${raw}/${reduced} ${c.name}` : `${raw}/${reduced}`;
}
 
export function getFamousPersonalYearMatches(
  subject: { day: number; month: number; year: number; name?: string },
  targetYear = new Date().getFullYear(),
  limit = 12,
): FamousPersonalYearMatch[] {
  const directRaw = computeRawPersonalYear(subject.day, subject.month, targetYear);
  const classicRaw = computeRawPersonalYearClassic(subject.day, subject.month, targetYear);
  const directReduced = reduceNum(directRaw);
  const classicReduced = reduceNum(classicRaw);
  const subjectLifePath = getLifePathNumber(subject.day, subject.month, subject.year).number;
  const subjectAnimal = getChineseZodiacSign(subject.day, subject.month, subject.year).sign;
  const subjectWestern = getWesternZodiacSign(subject.day, subject.month, subject.year);
 
  return getFamousSoulBank().map((s) => {
    const fDirectRaw = computeRawPersonalYear(s.day, s.month, targetYear);
    const fClassicRaw = computeRawPersonalYearClassic(s.day, s.month, targetYear);
    const fDirectReduced = reduceNum(fDirectRaw);
    const fClassicReduced = reduceNum(fClassicRaw);
    const reasons: string[] = [];
    let score = 0;
    if (fDirectRaw === directRaw) { score += 34; reasons.push(`same Direct personal-year compound ${compoundLabel(directRaw)}`); }
    if (fClassicRaw === classicRaw) { score += 34; reasons.push(`same Classic personal-year compound ${compoundLabel(classicRaw)}`); }
    if (fDirectReduced === directReduced) { score += 8; reasons.push(`same Direct root ${directReduced}`); }
    if (fClassicReduced === classicReduced) { score += 8; reasons.push(`same Classic root ${classicReduced}`); }
    if (s.lifePath === subjectLifePath) { score += 5; reasons.push(`same life path ${subjectLifePath}`); }
    if (s.zodiacAnimal === subjectAnimal) { score += 4; reasons.push(`same Chinese animal ${subjectAnimal}`); }
    if (s.westernSign === subjectWestern) { score += 3; reasons.push(`same Western sign ${subjectWestern}`); }
    if (s.day === subject.day && s.month === subject.month) { score += 6; reasons.push("same birthday"); }
    return {
      soul: s,
      score: Math.min(100, score),
      reasons,
      directRaw: fDirectRaw,
      directReduced: fDirectReduced,
      classicRaw: fClassicRaw,
      classicReduced: fClassicReduced,
      directName: compoundLabel(fDirectRaw),
      classicName: compoundLabel(fClassicRaw),
    };
  })
    .filter((m) => m.score >= 34)
    .sort((a, b) => b.score - a.score || a.soul.name.localeCompare(b.soul.name))
    .slice(0, limit);
}
 
export function getFamousSoulWeather(
  subject: { day: number; month: number; year: number; name?: string },
  targetYear = new Date().getFullYear(),
  limit = 8,
): FamousPersonalYearMatch[] {
  return getFamousPersonalYearMatches(subject, targetYear, limit);
}
 
// ---------------------------------------------------------------------
// Soul Weather report: turns the raw PY numbers into a full forecast with
// compound naming, karmic/master alerts, age band, and famous year-mates —
// so the dashboard has something richer than "PY {number}" to render.
// ---------------------------------------------------------------------
 
export function buildSoulWeatherReport(soul: SoulVitals, targetYear = new Date().getFullYear()): SoulWeatherReport {
  const direct = buildPYReading(computeRawPersonalYear(soul.day, soul.month, targetYear));
  const classic = buildPYReading(computeRawPersonalYearClassic(soul.day, soul.month, targetYear));
  const age = typeof soul.year === "number" && !Number.isNaN(soul.year) ? targetYear - soul.year : null;
  const band = ageBandFor(age);
  const karmicAlert = karmicAlertText(direct, `${soul.name}'s Direct`) ?? karmicAlertText(classic, `${soul.name}'s Classic`);
  const masterAlert = masterAlertText(direct, `${soul.name}'s Direct`) ?? masterAlertText(classic, `${soul.name}'s Classic`);
  const famousMatches = getFamousPersonalYearMatches({ day: soul.day, month: soul.month, year: soul.year, name: soul.name }, targetYear, 5)
    .map((m) => ({ name: m.soul.name, score: m.score, reasons: m.reasons }));
 
  const forecast = [
    `${soul.name}'s ${targetYear} personal year runs ${direct.raw}/${direct.reduced}${direct.compoundName ? ` (${direct.compoundName})` : ""} on the surface and ${classic.raw}/${classic.reduced}${classic.compoundName ? ` (${classic.compoundName})` : ""} underneath, in the ${band}.`,
    direct.thesis,
    karmicAlert ?? "",
    masterAlert ?? "",
  ].filter(Boolean).join(" ");
 
  return {
    soul,
    targetYear,
    direct,
    classic,
    age,
    ageBand: band,
    karmicAlert,
    masterAlert,
    famousMatches,
    forecast,
  };
}
 
export function getCosmicTwinsForSoul(soul: SoulVitals, limit = 10): Array<{ name: string; born: string; score: number; sharedTrait: string; tags: string[] }> {
  return getFamousSoulBank()
    .filter((p) => !(p.day === soul.day && p.month === soul.month && p.year === soul.year))
    .map((p) => {
      let score = 0;
      const reasons: string[] = [];
      if (p.day === soul.day && p.month === soul.month) { score += 55; reasons.push("same birthday"); }
      if (p.lifePath === soul.lifePath) { score += 18; reasons.push(`same life path ${soul.lifePath}`); }
      if (p.psychic === soul.psychic) { score += 12; reasons.push(`same psychic ${soul.psychic}`); }
      if (p.zodiacAnimal === soul.zodiacAnimal) { score += 10; reasons.push(`same Chinese ${soul.zodiacAnimal}`); }
      if (p.westernSign === soul.westernSign) { score += 7; reasons.push(`same ${soul.westernSign}`); }
      if (p.destiny === soul.destiny) { score += 8; reasons.push(`same destiny ${soul.destiny}`); }
      return { name: p.name, born: `${p.day}/${p.month}/${p.year}`, score: Math.min(100, score), sharedTrait: reasons.join(" · "), tags: p.tags };
    })
    .filter((p) => p.score >= 20)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit);
}