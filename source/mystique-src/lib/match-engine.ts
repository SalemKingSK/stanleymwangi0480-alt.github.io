/**
 * Match Oracle engine — the app-side port of the validated workspace tool
 * (tools/match-engine.mjs). Everything here is deterministic: the app's own
 * personal-year, compound and pinnacle libraries, no AI, no randomness.
 *
 * The engine produces a FIXTURE DOSSIER: every numerological layer for a date
 * and two ledger entities (nation or club), plus the relations between them.
 *
 * Honesty is part of the engine:
 *  • `SEASON_CONSTANT_WARNING` — the personal year cannot separate matches.
 *  • `CALIBRATION` — what 39,435 real international matches actually showed.
 *  • No probability is ever produced by this file. Readings only.
 */
import { famousBirthdays } from "@/lib/famous-birthdays";
import {
  computeRawPersonalYear,
  computeRawPersonalYearClassic,
  computePersonalYearNumber,
  computePersonalYearNumberClassic,
  reduceToSingleDigit,
  digitSumOnce,
} from "@/lib/numerology/personal-year-full";
import { lookupCompound } from "@/lib/numerology/chaldean-pyn-compounds";
import { PINNACLE_DESC, CHALLENGE_DESC } from "@/lib/cosmic-fate/pinnacles";
import { generateTemporalPrediction } from "@/lib/temporal-prediction-engine-v2";

/* ────────────────────────────────────────────────────────────────────────────
   Chaldean "friends / enemies of numbers" grid.
   Sources disagree on this grid (Cheiro-derived vs modern Indian schools), so it
   ships as DATA with the backtest as arbiter — never as doctrine.
   ──────────────────────────────────────────────────────────────────────────── */
export const FRIEND_GRID: Record<number, { friends: number[]; enemies: number[] }> = {
  1: { friends: [1, 2, 3, 5, 9], enemies: [4, 8] },
  2: { friends: [1, 2, 3], enemies: [4, 5, 8] },
  3: { friends: [1, 2, 3, 5, 9], enemies: [4, 8] },
  4: { friends: [1, 2, 5, 6, 7], enemies: [3, 8, 9] },
  5: { friends: [1, 3, 4, 8], enemies: [2, 7] },
  6: { friends: [4, 5, 6, 8], enemies: [1, 3, 9] },
  7: { friends: [4, 5, 6], enemies: [2, 9] },
  8: { friends: [1, 4, 5, 6], enemies: [3, 7] },
  9: { friends: [1, 2, 3, 6], enemies: [4, 5, 7] },
};

export type Relation = "same" | "friend" | "neutral" | "enemy";

export function relationOf(a: number, b: number, grid = FRIEND_GRID): Relation {
  if (a === b) return "same";
  const g = grid[a];
  if (!g) return "neutral";
  if (g.friends.includes(b)) return "friend";
  if (g.enemies.includes(b)) return "enemy";
  return "neutral";
}

/* ── Chaldean name numbers ─────────────────────────────────────────────────── */
export const CHALDEAN_VALUES: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:8,G:3,H:5,I:1,J:1,K:2,L:3,M:4,N:5,O:7,P:8,Q:1,R:2,S:3,T:4,U:6,V:6,W:6,X:5,Y:1,Z:7,
};

export function nameNumber(name: string) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, "");
  const total = [...letters].reduce((a, ch) => a + (CHALDEAN_VALUES[ch] || 0), 0);
  const compound = total >= 10 ? lookupCompound(total) : null;
  return {
    total,
    reduced: reduceToSingleDigit(total),
    compoundNumber: compound ? compound.compound : null,
    compoundName: compound ? compound.name : null,
    compoundSymbolism: compound ? compound.symbolism : null,
  };
}


/** Compound name for any number (used by the trend tables). */
export function lookupCompoundName(n: number): string | null {
  const c = n >= 10 ? lookupCompound(n) : null;
  return c ? c.name : null;
}

/* ── The entity ledger: every Entity row in the famous-birthdays bank ──────── */
export interface LedgerEntity {
  name: string;
  day: number;
  month: number;
  year: number;
  kind: "Football Club" | "Country" | "Other";
  tags: string[];
}

let ledgerCache: Map<string, LedgerEntity> | null = null;

export function entityLedger(): Map<string, LedgerEntity> {
  if (ledgerCache) return ledgerCache;
  const map = new Map<string, LedgerEntity>();
  for (const p of famousBirthdays) {
    const tags = p.tags || [];
    if (!tags.includes("Entity")) continue;
    const kind: LedgerEntity["kind"] = tags.includes("Football Club")
      ? "Football Club"
      : tags.includes("Country")
      ? "Country"
      : "Other";
    map.set(p.name, { name: p.name, day: p.day, month: p.month, year: p.year, kind, tags });
  }
  ledgerCache = map;
  return map;
}

/** Entities offered in the oracle: countries and football clubs first. */
export function oracleEntities(): LedgerEntity[] {
  const all = [...entityLedger().values()].filter((e) => e.kind !== "Other");
  const rank = (e: LedgerEntity) => (e.kind === "Football Club" ? 0 : 1);
  return all.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
}

export function findEntity(name: string): LedgerEntity | null {
  return entityLedger().get(name) || null;
}

/* ── Layers ────────────────────────────────────────────────────────────────── */
export interface TeamLayers {
  team: string;
  kind: LedgerEntity["kind"];
  foundedISO: string;
  age: number;
  /** whole-season letter — constant across the year; cannot separate matches */
  direct: { raw: number; compound: number | null; reduced: number; name: string; isRoyal: boolean; isKarmic: boolean };
  classic: { raw: number; compound: number | null; reduced: number; name: string };
  personalYear: number;
  personalYearClassic: number;
  /** layers that move daily */
  personalMonth: number;
  personalDay: number;
  /** the entity's fixed core numbers */
  foundingDayNumber: number;
  nameNumber: ReturnType<typeof nameNumber>;
}

export const ROYAL_STARS = new Set([17, 19, 21, 23, 24, 27, 37]);
export const KARMIC_DEBTS = new Set([13, 14, 16, 19]);

export function teamLayers(entity: LedgerEntity, dateISO: string): TeamLayers {
  const [Y, M, D] = dateISO.split("-").map(Number);
  const { day, month, year, name } = entity;

  const raw = computeRawPersonalYear(day, month, Y);
  const rawClassic = computeRawPersonalYearClassic(day, month, Y);
  const directCompound = raw >= 10 ? lookupCompound(raw) : null;
  const classicCompound = rawClassic >= 10 ? lookupCompound(rawClassic) : null;
  const personalYear = computePersonalYearNumber(day, month, Y);
  const personalYearClassic = computePersonalYearNumberClassic(day, month, Y);

  const personalMonth = reduceToSingleDigit(personalYear + reduceToSingleDigit(M));
  const personalDay = reduceToSingleDigit(personalMonth + reduceToSingleDigit(D));

  const directReduced = directCompound ? directCompound.reduced : reduceToSingleDigit(raw);
  const classicReduced = classicCompound ? classicCompound.reduced : reduceToSingleDigit(rawClassic);

  return {
    team: name,
    kind: entity.kind,
    foundedISO: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    age: Y - year,
    direct: {
      raw,
      compound: directCompound ? directCompound.compound : null,
      reduced: directReduced,
      name: directCompound ? `${directCompound.compound}/${directReduced} — ${directCompound.name}` : `Single digit ${directReduced}`,
      isRoyal: directCompound ? ROYAL_STARS.has(directCompound.compound) : false,
      isKarmic: directCompound ? KARMIC_DEBTS.has(directCompound.compound) : false,
    },
    classic: {
      raw: rawClassic,
      compound: classicCompound ? classicCompound.compound : null,
      reduced: classicReduced,
      name: classicCompound ? `${classicCompound.compound}/${classicReduced} — ${classicCompound.name}` : `Single digit ${classicReduced}`,
    },
    personalYear,
    personalYearClassic,
    personalMonth,
    personalDay,
    foundingDayNumber: reduceToSingleDigit(day),
    nameNumber: nameNumber(name),
  };
}

export interface DayLayers {
  iso: string;
  universalYear: { raw: number; reduced: number; name: string | null };
  universalMonth: number;
  universalDay: { raw: number; reduced: number; name: string | null };
  calendarDay: { raw: number; reduced: number; name: string | null };
  weekday: string;
}

export function dayLayers(dateISO: string): DayLayers {
  const [Y, M, D] = dateISO.split("-").map(Number);
  const uyRaw = digitSumOnce(Y);
  const umRaw = uyRaw + reduceToSingleDigit(M);
  const udRaw = umRaw + reduceToSingleDigit(D);
  const calRaw = digitSumOnce(Y * 10000 + M * 100 + D);
  const named = (n: number) => (n >= 10 ? lookupCompound(n)?.name ?? null : null);
  const dateObj = new Date(Date.UTC(Y, M - 1, D));
  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dateObj.getUTCDay()];
  return {
    iso: dateISO,
    universalYear: { raw: uyRaw, reduced: reduceToSingleDigit(uyRaw), name: named(uyRaw) },
    universalMonth: reduceToSingleDigit(umRaw),
    universalDay: { raw: udRaw, reduced: reduceToSingleDigit(udRaw), name: named(udRaw) },
    calendarDay: { raw: calRaw, reduced: reduceToSingleDigit(calRaw), name: named(calRaw) },
    weekday,
  };
}

/* ── The full dossier ──────────────────────────────────────────────────────── */
export interface FixtureDossier {
  date: string;
  day: DayLayers;
  home: TeamLayers;
  away: TeamLayers;
  era: {
    pinnacleNumber: number;
    pinnacleStage: number;
    pinnacleText: string;
    challengeNumber: number;
    challengeText: string;
  } | null;
  clash: {
    homeVsAway: Relation;
    awayVsHome: Relation;
    dayVsHome: Relation;
    dayVsAway: Relation;
    homeDayVsFoundingDay: Relation;
    awayDayVsFoundingDay: Relation;
    homeDayVsName: Relation;
    awayDayVsName: Relation;
  };
}

export function buildFixtureDossier(dateISO: string, homeName: string, awayName: string): FixtureDossier {
  const homeEntity = findEntity(homeName);
  const awayEntity = findEntity(awayName);
  if (!homeEntity) throw new Error(`No ledger founding date for "${homeName}"`);
  if (!awayEntity) throw new Error(`No ledger founding date for "${awayName}"`);

  const [Y] = dateISO.split("-").map(Number);
  const home = teamLayers(homeEntity, dateISO);
  const away = teamLayers(awayEntity, dateISO);
  const day = dayLayers(dateISO);

  let era: FixtureDossier["era"] = null;
  try {
    const tp = generateTemporalPrediction(homeEntity.day, homeEntity.month, homeEntity.year, Y);
    const pn = String(tp?.meta?.activePinnacleNumber ?? "");
    const cn = String(tp?.meta?.activeChallenge ?? "");
    if (pn) {
      era = {
        pinnacleNumber: Number(pn),
        pinnacleStage: tp.meta.activePinnacleStage,
        pinnacleText: PINNACLE_DESC[pn] || "",
        challengeNumber: Number(cn),
        challengeText: CHALLENGE_DESC[cn] || "",
      };
    }
  } catch {
    era = null;
  }

  return {
    date: dateISO,
    day,
    home,
    away,
    era,
    clash: {
      homeVsAway: relationOf(home.personalYear, away.personalYear),
      awayVsHome: relationOf(away.personalYear, home.personalYear),
      dayVsHome: relationOf(day.universalDay.reduced, home.personalYear),
      dayVsAway: relationOf(day.universalDay.reduced, away.personalYear),
      homeDayVsFoundingDay: relationOf(home.personalDay, home.foundingDayNumber),
      awayDayVsFoundingDay: relationOf(away.personalDay, away.foundingDayNumber),
      homeDayVsName: relationOf(home.personalDay, home.nameNumber.reduced),
      awayDayVsName: relationOf(away.personalDay, away.nameNumber.reduced),
    },
  };
}

/* ── Letter alignment — a reading, never a probability ─────────────────────── */
export interface AlignmentLine {
  side: "home" | "away" | "field";
  label: string;
  verdict: "favours" | "tests" | "neutral";
  detail: string;
}

const REL_TEXT: Record<Relation, { word: string; verdict: AlignmentLine["verdict"] }> = {
  same: { word: "echoes", verdict: "favours" },
  friend: { word: "is friendly to", verdict: "favours" },
  neutral: { word: "is neutral toward", verdict: "neutral" },
  enemy: { word: "is at odds with", verdict: "tests" },
};

export function letterAlignment(d: FixtureDossier): AlignmentLine[] {
  const lines: AlignmentLine[] = [];
  const rel = (r: Relation) => REL_TEXT[r];

  lines.push({
    side: "home",
    label: `${d.home.team} — today's letter vs its own founding day`,
    verdict: rel(d.clash.homeDayVsFoundingDay).verdict,
    detail: `Personal day ${d.home.personalDay} ${rel(d.clash.homeDayVsFoundingDay).word} the founding day ${d.home.foundingDayNumber}.`,
  });
  lines.push({
    side: "away",
    label: `${d.away.team} — today's letter vs its own founding day`,
    verdict: rel(d.clash.awayDayVsFoundingDay).verdict,
    detail: `Personal day ${d.away.personalDay} ${rel(d.clash.awayDayVsFoundingDay).word} the founding day ${d.away.foundingDayNumber}.`,
  });
  lines.push({
    side: "home",
    label: `${d.home.team} — today's letter vs its name number`,
    verdict: rel(d.clash.homeDayVsName).verdict,
    detail: `Personal day ${d.home.personalDay} ${rel(d.clash.homeDayVsName).word} name number ${d.home.nameNumber.total}→${d.home.nameNumber.reduced}.`,
  });
  lines.push({
    side: "away",
    label: `${d.away.team} — today's letter vs its name number`,
    verdict: rel(d.clash.awayDayVsName).verdict,
    detail: `Personal day ${d.away.personalDay} ${rel(d.clash.awayDayVsName).word} name number ${d.away.nameNumber.total}→${d.away.nameNumber.reduced}.`,
  });
  lines.push({
    side: "field",
    label: "The day both play on",
    verdict: "neutral",
    detail: `Universal day ${d.day.universalDay.raw}${d.day.universalDay.name ? ` (${d.day.universalDay.name})` : ""}, reduced ${d.day.universalDay.reduced}; calendar-day letter ${d.day.calendarDay.raw}${d.day.calendarDay.name ? ` (${d.day.calendarDay.name})` : ""}. Universal day ${rel(d.clash.dayVsHome).word} the home year and ${rel(d.clash.dayVsAway).word} the away year.`,
  });
  lines.push({
    side: "field",
    label: "Season letters (context only — identical in every match this year)",
    verdict: "neutral",
    detail: `${d.home.team} ${d.home.direct.name} · ${d.away.team} ${d.away.direct.name}. These are at-odds-ness: ${rel(d.clash.homeVsAway).word} / ${rel(d.clash.awayVsHome).word}.`,
  });
  return lines;
}

/** The two sides' own seasonal letters, so the panel can show them side by side. */
export function seasonLetters(d: FixtureDossier) {
  return {
    home: { direct: d.home.direct, classic: d.home.classic },
    away: { direct: d.away.direct, classic: d.away.classic },
  };
}

/* ── The honesty layer, shipped with the feature ──────────────────────────── */
export const SEASON_CONSTANT_WARNING =
  "A team's personal year is one letter held for twelve months — roughly 10-15 matches share it in a season, so it cannot separate one fixture from another. Match-level reading must use the layers that move daily: personal month, personal day, universal day, the calendar-day letter, and the relations to each team's fixed numbers. Even then, the measured answer is that these letters describe a day rather than predict its result.";

export const CALIBRATION = {
  studies: [
    {
      name: "International football",
      matches: 39435,
      span: "1950 → today, both teams carrying a settled founding date",
      trainN: 17368,
      testN: 22067,
      baseRates: { train: { home: 49.2, draw: 23.8, away: 27.0 }, test: { home: 48.0, draw: 24.1, away: 27.9 } },
      signaturesTested: 150,
      survivors: 0,
      headline: "Not one numerology signature replicated out of sample.",
      detail: [
        "The strongest training-era signature reached z 1.75 (a 1.1pp lift on 6,460 matches) and then went the other way on the held-out era (z −1.55).",
        "The royal-star candidate that once looked strong (train z 5.61) collapsed to z 1.32 once the engine call was corrected — it had been reading a constant per-team flag, which is team identity, not timing.",
        "Within-team control (91 teams, 200+ home matches each): royal-year win rate 53.0% against the same teams' overall 52.8% — a difference of 0.2pp, pooled z 0.25.",
        "Symmetry control: the away team's royal year must push the same result the other way; on the test era the mirror is +0.549 vs +0.518 goal difference — noise.",
        "Selective prediction gained nothing: speaking on the strongest signatures covered 36.9% of matches at 47.2% accuracy, against 48.0% for always predicting a home win.",
      ],
    },
    {
      name: "Club football (the deepest test)",
      matches: 34765,
      span: "1888 → today across 8 countries and 117 clubs, both clubs carrying a day-precision founding date",
      trainN: 23301,
      testN: 4559,
      baseRates: { train: { home: 51.4, draw: 23.0, away: 25.6 }, test: { home: 55.3, draw: 21.9, away: 22.8 } },
      signaturesTested: 122,
      survivors: 0,
      headline: "Club football says the same thing, with much greater power.",
      detail: [
        "Best training signature: z 2.64 (age-mod-10 = 0). Shuffling match dates produces a best z of 2.66 on average (95th percentile 2.86, max 3.07) — the real finding sits inside the noise band, below the shuffle average.",
        "Placebo test with random founding dates for every club produced best z up to 4.23 — random dates invent 'signals' larger than the real ones.",
        "A numerology-only logistic model scored AUC 0.500 on validation and 0.515 on test — a coin flip. Adding prior form (a non-numerology control) lifted AUC to 0.560/0.590, which is where the real information lives.",
        "Accuracy: numerology-only 47.6% on test, versus 55.3% for simply always predicting a home win.",
        "Confidence made it worse, not better: speaking only on the most confident 10% of fixtures gave 45.5% accuracy, and the most confident 1% gave 41.2%.",
        "The strongest signature flips sign across decades (z +2.63 in the 1920s, −0.90 in the 1940s, +3.29 in the 1990s, −0.39 in the 2000s), which is the signature of noise rather than of a law.",
      ],
    },
  ],
  gate: {
    rule: "The app only makes a match call when a numerology signal has passed a protocol: it must beat a permutation null, beat a placebo null on randomised founding dates, replicate on a held-out era, and come from a sample of at least 4,500 matches carrying that signature.",
    status: "SILENT",
    reason: "No signature has passed. 0 of 122 club signatures and 0 of 150 international signatures replicated, and the strongest candidates sit inside the null distributions. Until that changes, the Oracle describes and does not predict.",
    powerRule: "Detecting a genuine 3-point edge across this many signatures needs ≈4,500 matches per signature at 80% power; the strongest club candidate carried 311.",
  },
  failure: {
    definition: "A failure is a spoken call that goes the wrong way. 'Failure as an outlier' therefore means: speak rarely, only where the measured edge is real, and publish the cost of speaking.",
    measured: "At the best validation-selected confidence threshold the test era produced 0 spoken calls — the gate stayed shut by its own rule, so the failure rate is undefined rather than dressed up.",
    rolling: "Rolling 100-call accuracy windows, worst losing streaks and a flat-stake drawdown simulation are computed for every future dataset the app is built with; they are meaningless while the gate is closed, and the app says so instead of inventing numbers.",
  },
  correction: {
    note: "Correction published with this version: an earlier build of these studies passed the founding year into the engine where the match year belonged, freezing each team's personal year at its founding value. The app's own match engine had the same fault. It is fixed (three-argument engine calls), both studies were re-run from scratch, and the earlier 'royal star' finding is withdrawn — it was an artefact of the fault, not a discovery.",
  },
  conclusion:
    "The letters describe; they do not predict. Measured on 74,200 real matches across two independent datasets, numerology carried no match-level edge, so the app refuses to pretend otherwise — and shows you the full working.",
} as const;
