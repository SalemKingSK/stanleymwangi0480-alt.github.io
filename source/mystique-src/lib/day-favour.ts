import {
  buildSoulVitals,
  generateSoulResonance,
  type SoulResonanceReport,
} from "@/lib/compatibility-engine";
import { lookupCompound } from "@/lib/numerology/chaldean-pyn-compounds";
import { computeRawPersonalYear } from "@/lib/numerology/personal-year-full";
import { reduceToSingleDigit } from "@/lib/numerology/personal-year-full";

/**
 * DAY FAVOURABILITY — the three methods the reading was asked for, applied to a fixture.
 *
 * ── Method 1 · Soul Resonance relationships, exactly as used in that section ──
 * The same functions, the same weights, the same layers: Psychic Vibration, Destiny Vibration,
 * Life Path, Vedic Johari, Chinese Zodiac, Lo Shu Void Fill, Lo Shu Amplification — plus the
 * six directional Johari views and the personal-year interaction. Nothing here is re-derived;
 * `buildSoulVitals` and `generateSoulResonance` are imported and called directly.
 *
 * The section reads two PEOPLE. A fixture has three parties: the home club, the away club, and
 * the day. So the same measures are run twice per side — club against club (the contest's
 * temperament) and club against the day (whether the day itself favours that side) — and the
 * difference between the two sides' day-resonance is what leans the reading.
 *
 * Note, plainly: that section's Lo Shu layer reads the NAME. It is used that way here because
 * the instruction was to use the measures exactly as they are used there; the per-method
 * breakdown below reports the resonance both with and without the Lo Shu layers, so the
 * name-dependent part can be read separately from the rest.
 *
 * ── Method 2 · Cheiro's "lucky day" — the birth-number series ──
 * Cheiro: a person born on the 1st finds "all dates making the Number one series, such as the
 * 1st, 10th, 19th, or 28th" of equal importance. Each club's founding day number belongs to a
 * series; a match day is favourable for that club when the day of the month falls in the same
 * series. This is Cheiro's own rule for continual action, and it uses no name.
 *
 * ── Method 3 · Cheiro's compound-date rule ──
 * Cheiro's "John Smith" example: add the number of the name to the single number of the date and
 * to the birth number, then read the symbolism of the compound total — 15 there meant "for
 * obtaining money gifts and favors from others it is a fortunate number", which is what made the
 * date favourable for the request. Here the founding-day number stands where the birth number
 * stands; the name number is included as well where a name number exists, and both variants are
 * reported, because name-spelling analysis was withdrawn from the team reading and the honest
 * thing is to show the difference rather than assume it.
 *
 * Every method returns a signed lean for each side. Nothing here is called a prediction; the
 * measurement of what these three methods actually achieve on 128,727 real matches is reported
 * by tools/favour-model.mjs and printed in the panel.
 */

export type Lean = "favours" | "tests" | "neutral";

export interface MethodReading {
  method: string;
  home: Lean;
  away: Lean;
  homeDetail: string;
  awayDetail: string;
  score: number;          // + favours home, − favours away, 0 neutral field
}

export interface Suitability {
  home: number;
  away: number;
  gap: number;
  suited: "home" | "away" | "neither";
  homeWhy: string[];
  awayWhy: string[];
}

export interface DayFavour {
  date: string;
  methods: MethodReading[];
  resonance: {
    overall: number;
    layers: { label: string; score: number; verdict: string }[];
    withoutLoShu: number;
    chinese: { relation: string; note: string; score: number };
    johari: { verdict: string; explanation: string } | null;
    report: SoulResonanceReport;
  };
  series: { home: number; away: number; homeDate: string; awayDate: string };
  /** the transparent version of the comparison: count the day's favourable signals per side */
  suitability: Suitability;
  compound: { home: number | null; away: number | null; homeName: string; awayName: string; text: string };
  /** + favours the home side, − favours the away side, 0 = the day takes no side */
  combined: number;
  verdict: string;
}

/* ── the number series, per Cheiro ─────────────────────────────────────────── */
export function cheiroSeries(dayNumber: number): number[] {
  const root = reduceToSingleDigit(dayNumber) || 9;
  const out: number[] = [];
  for (let d = root; d <= 31; d += 9) out.push(d);
  return out;
}
export function inSeries(dayOfMonth: number, foundingDay: number): boolean {
  return cheiroSeries(foundingDay).includes(dayOfMonth);
}

/* ── the compound reading, per Cheiro's worked example ─────────────────────── */
export function compoundReading(dayOfMonth: number, month: number, foundingDay: number, nameNumber?: number | null) {
  const dateNumber = reduceToSingleDigit(dayOfMonth);
  const parts = [foundingDay, dateNumber];
  if (nameNumber) parts.push(nameNumber);
  const total = parts.reduce((a, b) => a + b, 0);
  const compound = lookupCompound(total);
  const text = compound
    ? `${parts.join(" + ")} = ${total} → ${compound.compound} ${compound.name}: ${compound.symbolism}`
    : `${parts.join(" + ")} = ${total} → no compound reading (under 10)`;
  const symbolism = (compound?.symbolism || "").toLowerCase();
  const adverse = /unfortunate|danger|loss|misfortune|sacrifice|deception|treachery|karmic|debt|warning|betray/.test(symbolism);
  const fortunate = /fortunate|favour|success|good|peace|love|reward|honour|gift|blessing|wisdom|power/.test(symbolism);
  const lean: Lean = adverse && !fortunate ? "tests" : fortunate && !adverse ? "favours" : "neutral";
  return { total, compound: compound?.compound ?? null, name: compound?.name ?? null, text, lean };
}

/* ── resonance between an entity and the day itself ───────────────────────── */
function vitalsFor(name: string, d: number, m: number, y: number) {
  return buildSoulVitals({ name, day: d, month: m, year: y, gender: "male" });
}

export function dayFavour(
  dateISO: string,
  home: { name: string; day: number; month: number; year: number },
  away: { name: string; day: number; month: number; year: number },
  homeNameNumber?: number | null,
  awayNameNumber?: number | null,
): DayFavour | null {
  const [Y, M, D] = dateISO.split("-").map(Number);
  if (!Y || !M || !D) return null;

  const dayEntity = { name: `The day ${dateISO}`, day: D, month: M, year: Y };

  // ── method 1: the Soul Resonance measures, used exactly as the section uses them ──
  const clubA = vitalsFor(home.name, home.day, home.month, home.year);
  const clubB = vitalsFor(away.name, away.day, away.month, away.year);
  const dayV = vitalsFor(dayEntity.name, D, M, Y);

  const pairReport = generateSoulResonance(clubA, clubB, Y);
  const homeDayReport = generateSoulResonance(clubA, dayV, Y);
  const awayDayReport = generateSoulResonance(clubB, dayV, Y);

  const homeRes = homeDayReport.overall, awayRes = awayDayReport.overall;
  const diff = homeRes - awayRes;
  const leanFromDiff = (x: number): Lean => (x >= 3 ? "favours" : x <= -3 ? "tests" : "neutral");

  // the same measures without the two Lo Shu layers, so the name-dependent part is separable
  const noLoShu = (r: SoulResonanceReport) => {
    const keep = r.layers.filter((l) => !l.label.startsWith("Lo Shu"));
    return keep.length ? Math.round(keep.reduce((a, l) => a + l.score, 0) / keep.length) : 0;
  };

  const method1: MethodReading = {
    method: "1 · Soul Resonance relationships (as in that section)",
    home: leanFromDiff(diff),
    away: leanFromDiff(-diff),
    homeDetail: `${home.name} against the day: ${homeRes}/100 overall resonance (${noLoShu(homeDayReport)}/100 without the Lo Shu layers). Against ${away.name}: ${pairReport.overall}/100.`,
    awayDetail: `${away.name} against the day: ${awayRes}/100 overall resonance (${noLoShu(awayDayReport)}/100 without the Lo Shu layers). Against ${home.name}: ${pairReport.overall}/100.`,
    score: diff,
  };

  // ── method 2: Cheiro's series rule ──
  const homeIn = inSeries(D, home.day), awayIn = inSeries(D, away.day);
  const method2: MethodReading = {
    method: "2 · Cheiro's lucky day — the birth-number series",
    home: homeIn ? "favours" : "neutral",
    away: awayIn ? "favours" : "neutral",
    homeDetail: `Founding day ${home.day} → series ${cheiroSeries(home.day).join(", ")}. The ${D}th ${homeIn ? "falls in it — a favourable date for this club" : "is not in it"}.`,
    awayDetail: `Founding day ${away.day} → series ${cheiroSeries(away.day).join(", ")}. The ${D}th ${awayIn ? "falls in it — a favourable date for this club" : "is not in it"}.`,
    score: (homeIn ? 1 : 0) - (awayIn ? 1 : 0),
  };

  // ── method 3: Cheiro's compound-date rule ──
  const ch = compoundReading(D, M, home.day, homeNameNumber ?? undefined);
  const ca = compoundReading(D, M, away.day, awayNameNumber ?? undefined);
  const cmp = (l: Lean) => (l === "favours" ? 1 : l === "tests" ? -1 : 0);
  const method3: MethodReading = {
    method: "3 · Cheiro's compound-date rule",
    home: ch.lean,
    away: ca.lean,
    homeDetail: ch.text,
    awayDetail: ca.text,
    score: cmp(ch.lean) - cmp(ca.lean),
  };

  /* ── the comparison, in its plainest form ────────────────────────────────────
     For each side: does the match day fall in this club's Cheiro founding series, does the
     personal day harmonise with or oppose the founding day, and is the season compound a royal
     star or a karmic debt? +1 for each favourable, −1 for each adverse. The gap is the verdict
     of the comparison — and the panel prints what that gap has been worth on real matches. */
  const ROYALS = new Set([17, 19, 21, 23, 24, 27, 37]);
  const KARMICS = new Set([13, 14, 16, 19]);
  const scoreOne = (e: { day: number; month: number; year: number }, pd: number, fdv: number, compound: number | null) => {
    let s = 0; const why: string[] = [];
    if (cheiroSeries(e.day).includes(D)) { s += 1; why.push(`the ${D}th falls in its founding series (${cheiroSeries(e.day).join("/")})`); }
    else why.push(`the ${D}th is outside its founding series (${cheiroSeries(e.day).join("/")})`);
    if (fdv === 0 || fdv === 1) { s += 1; why.push("its personal day harmonises with its founding day"); }
    else if (fdv === 3) { s -= 1; why.push("its personal day opposes its founding day"); }
    else why.push("its personal day sits neutral against its founding day");
    if (compound && ROYALS.has(compound)) { s += 1; why.push(`royal-star compound ${compound} this season`); }
    if (compound && KARMICS.has(compound)) { s -= 1; why.push(`karmic compound ${compound} this season`); }
    return { s, why };
  };
  // personal day per side: reduce(personalYear + month + day) — the same chain the corpus uses
  const FR: Record<number, number[]> = { 1: [1,2,3,5,9], 2: [1,2,3], 3: [1,2,3,5,9], 4: [1,2,5,6,7],
    5: [1,3,4,8], 6: [4,5,6,8], 7: [4,5,6], 8: [1,4,5,6], 9: [1,2,3,6] };
  const relTo = (a: number, b: number) => (a === b ? 0 : (FR[a] || []).includes(b) || (FR[b] || []).includes(a) ? 1 : 3);
  const pdOf = (e: { day: number; month: number; year: number }) => {
    const py = reduceToSingleDigit(computeRawPersonalYear(e.day, e.month, Y));
    const pm = reduceToSingleDigit(py + reduceToSingleDigit(M));
    return reduceToSingleDigit(pm + reduceToSingleDigit(D));
  };
  const compOf = (e: { day: number; month: number; year: number }) => {
    const raw = computeRawPersonalYear(e.day, e.month, Y);
    const c = raw >= 10 ? lookupCompound(raw) : null;
    return c ? c.compound : null;
  };
  const pdH = pdOf(home), pdA = pdOf(away);
  const sh = scoreOne(home, pdH, relTo(pdH, reduceToSingleDigit(home.day)), compOf(home));
  const sa = scoreOne(away, pdA, relTo(pdA, reduceToSingleDigit(away.day)), compOf(away));
  const gap = sh.s - sa.s;

  const combined = method1.score + method2.score * 12 + method3.score * 12;   // methods 2 & 3 are ±1 steps; scale to the resonance's ±points
  const verdict = combined >= 12
    ? `The day leans to ${home.name}`
    : combined <= -12
    ? `The day leans to ${away.name}`
    : "The day takes no side";

  return {
    date: dateISO,
    methods: [method1, method2, method3],
    resonance: {
      overall: pairReport.overall,
      layers: pairReport.layers.map((l) => ({ label: l.label, score: l.score, verdict: l.verdict })),
      withoutLoShu: noLoShu(pairReport),
      chinese: { relation: pairReport.chineseZodiac.relation, note: pairReport.chineseZodiac.note, score: pairReport.chineseZodiac.score },
      johari: pairReport.johariCompatibility
        ? { verdict: pairReport.johariCompatibility.compositeVerdict, explanation: pairReport.johariCompatibility.compositeExplanation }
        : null,
      report: pairReport,
    },
    series: { home: home.day, away: away.day, homeDate: `${D}${homeIn ? " ✓" : ""}`, awayDate: `${D}${awayIn ? " ✓" : ""}` },
    suitability: { home: sh.s, away: sa.s, gap, suited: gap > 0 ? "home" : gap < 0 ? "away" : "neither",
                   homeWhy: sh.why, awayWhy: sa.why },
    compound: { home: ch.compound, away: ca.compound, homeName: ch.name || "", awayName: ca.name || "", text: `${home.name}: ${ch.text}  |  ${away.name}: ${ca.text}` },
    combined,
    verdict,
  };
}
