/**
 * The Curriculum's syllabus: every field of knowledge the app can read aloud,
 * grouped the way the app shows them (module = results tab, topic = section).
 *
 * A field has variants — the different texts the library holds for it (the
 * Destiny Path has one per destiny number, Compatibility Bonds one per pair of
 * signs, …). Each variant is a study unit; listening to it with read-aloud
 * marks it studied, and every further full listen adds to its count.
 *
 * Variant keys are readable strings built by the helpers in `K`, used both by
 * the sections (when tagging what they show) and by `variants(chart)` here, so
 * the two always agree.
 */
import type { Chart } from "./chart";
import { ALL_ARROW_DEFINITIONS } from "@/lib/arrow-definitions";
import { resolveMonthData } from "@/lib/numerology/monthly-profiles";
import { calcStages } from "@/lib/numerology/pinnacle-stages";
import { PSYCHOMATRIX_CELL_MEANINGS } from "@/lib/numerology/data/psychomatrixData";
import { PSYCHOMATRIX_LINE_INTERPRETATIONS, getLineLevel } from "@/lib/numerology/data/psychomatrixLineInterpretations";
import { getNumberMeanings } from "@/lib/numerology/number-meanings";
import { computePersonalYearNumber, computeRawPersonalYear } from "@/lib/numerology/personal-year-full";
import { chineseSignFor } from "@/lib/astrology/chinese-calendar-math";
import { INTERSECTION_SYNTHESIS } from "@/lib/cosmic-fate/intersections";
import { CONVERGENCE_CARDS } from "@/lib/cosmic-fate/convergence";
import { yearDiveOracle } from "@/lib/cosmic-fate/oracle";
import { analyzeNumber } from "@/lib/loshu-analysis";
import { COMPOUNDS as PYN_COMPOUNDS } from "@/lib/numerology/chaldean-pyn-compounds";
import { futureTexts } from "@/lib/zodiac/futures";
import { codexAnimal, codexAnimalKey, codexNumber, codexNumbersFor, animalName } from "@/lib/codex";
import { hasHandbook, hasZodiacs } from "@/lib/handbook/store";
import { FOUNDATION_KEYS } from "@/lib/handbook/zodiacs";
import { birthSeason, HB_ELEMENTS, HB_SEASONS, HB_WESTERN } from "@/lib/handbook/types";

// ── Modules (the five results tabs + the timing panels above them) ─────────

export type ModuleId = "astro" | "newastro" | "numerology" | "psychomatrix" | "fate" | "timing" | "resonance";
/** Results tab ids, as ResultsDisplay names them. */
export type TabId = "astro" | "new-astro" | "numerology" | "psychomatrix" | "cosmic-fate";

export interface ModuleDef {
  id: ModuleId;
  label: string;
  icon: string;
  /** Tab that shows it; null = above every tab. */
  tab: TabId | null;
  blurb: string;
}

export const MODULES: ModuleDef[] = [
  { id: "astro", label: "Astrology", icon: "☯", tab: "astro", blurb: "The Chinese animal oracle, decans, the sexagenary cycle and the relationships between signs." },
  { id: "newastro", label: "New Astrology", icon: "✶", tab: "new-astro", blurb: "The 144 Western × Chinese sign blends, five layers each." },
  { id: "numerology", label: "Numerology", icon: "∑", tab: "numerology", blurb: "Core vibrations, the Lo Shu grid, arrows, pinnacles, fate chambers, personal years and number lore." },
  { id: "psychomatrix", label: "Psychomatrix", icon: "▦", tab: "psychomatrix", blurb: "Alexandrov's matrix: cells, lines, planes, transitions and their syntheses." },
  { id: "fate", label: "Cosmic Fate Map", icon: "🌌", tab: "cosmic-fate", blurb: "Year oracles, critical intersections, Tai Sui years, pinnacles and enemy-year dynamics." },
  { id: "timing", label: "Timing Engine", icon: "⏳", tab: null, blurb: "The live forecasts above every tab: headline, arcs, windows, cautions and day intelligence." },
  { id: "resonance", label: "Soul Resonance", icon: "♡", tab: null, blurb: "Compatibility between two saved souls — appears above the tabs once two or more readings are saved in History." },
];

// ── Field definitions ──────────────────────────────────────────────────────

export type FieldKind =
  /** Each birthday shows its own variant(s); case studies are picked to cover them all. */
  | "chart"
  /** Every variant can be opened from any reading (reference texts, pickers). */
  | "library"
  /** Depends on today's date (personal years, months, intersections). */
  | "temporal"
  /** A personalised synthesis: one unit, mastered by studying it on many charts. */
  | "practice";

export interface PartDef {
  id: string;
  label: string;
  /** Not needed for the unit to count as studied. */
  optional?: boolean;
}

export interface FieldDef {
  id: string;
  module: ModuleId;
  topic: string;
  label: string;
  /** Where to find it in the app. */
  where: string;
  /** data-study-anchor of the section to scroll to. */
  anchor: string;
  /** Inner tab of the Cosmic Fate Map, when the field lives in one. */
  fateTab?: string;
  kind: FieldKind;
  blurb: string;
  /** Passages that make up one study of the field (default: one passage). */
  parts?: PartDef[] | ((variant: string) => PartDef[]);
  variants?: (c: Chart) => string[];
  library?: () => string[];
  temporal?: (b: { day: number; month: number; year: number }, now: Date) => string[];
  /** Every value a temporal field can take. */
  universe?: () => string[];
  /** Only offered once the user has loaded their handbook on this device. */
  requires?: "handbook" | "zodiacs";
}

/** Whether a field can be studied on this device (handbook fields need the book loaded). */
export function fieldAvailable(field: FieldDef): boolean {
  if (field.requires === "handbook") return hasHandbook();
  if (field.requires === "zodiacs") return hasZodiacs();
  return true;
}

export const PRACTICE = "Practice";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const ANIMALS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const uniq = (xs: (string | null | undefined | false)[]) => [...new Set(xs.filter(Boolean) as string[])];

/** The karmic lessons a chart actually carries (the numbers it lacks). */
export function missingLessons(c: Chart) {
  return (c.synthesis.karmicLessons?.lessons ?? []).filter((l) => !l.present);
}

/** Short names for the four "Great Void" (zero) readings. */
export function zeroLabel(text: string): string {
  if (/Meanings of the number 0/i.test(text)) return "What zero means";
  if (/date of birth itself/i.test(text)) return "Zero in the birth date";
  if (/first or second additional/i.test(text)) return "Zero in the 1st or 2nd additional number";
  if (/third or fourth additional/i.test(text)) return "Zero in the 3rd or 4th additional number";
  return snippet(text);
}

/** Short readable label for a long personalised text. */
export function snippet(text: string, max = 60): string {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 20))}…`;
}

// Tai Sui relations, as the Cosmic Fate Map and the Numerology zodiac section use them.
const PAIRS = (list: string[][]) => (a: string, b: string) => list.some((p) => (p[0] === a && p[1] === b) || (p[1] === a && p[0] === b));
const isClash = PAIRS([["Rat", "Horse"], ["Ox", "Goat"], ["Tiger", "Monkey"], ["Rabbit", "Rooster"], ["Dragon", "Dog"], ["Snake", "Pig"]]);
const isHarm = PAIRS([["Rat", "Goat"], ["Ox", "Horse"], ["Tiger", "Snake"], ["Rabbit", "Dragon"], ["Monkey", "Pig"], ["Rooster", "Dog"]]);
const isDestruction = PAIRS([["Rat", "Rooster"], ["Ox", "Dragon"], ["Tiger", "Pig"], ["Rabbit", "Horse"], ["Goat", "Dog"], ["Monkey", "Snake"]]);
const isLiuHe = PAIRS([["Rat", "Ox"], ["Tiger", "Pig"], ["Rabbit", "Dog"], ["Dragon", "Rooster"], ["Snake", "Monkey"], ["Horse", "Goat"]]);
const SAN_HE = [["Tiger", "Horse", "Dog"], ["Monkey", "Rat", "Dragon"], ["Pig", "Rabbit", "Goat"], ["Snake", "Rooster", "Ox"]];
export function taiSuiCategory(birthSign: string, yearSign: string): string {
  if (birthSign === yearSign) return "ben";
  if (isClash(birthSign, yearSign)) return "clash";
  if (isHarm(birthSign, yearSign)) return "harm";
  if (isDestruction(birthSign, yearSign)) return "destruction";
  if (SAN_HE.some((t) => t.includes(birthSign) && t.includes(yearSign))) return "alliance";
  if (isLiuHe(birthSign, yearSign)) return "alliance";
  return "neutral";
}
const CAT_LABEL: Record<string, string> = {
  ben: "Ben Ming Nian", clash: "Direct Clash", harm: "Harm Year", destruction: "Destruction Year", alliance: "Alliance Year", neutral: "Neutral Year",
};
const reduceMN = (n: number): number => {
  let s = Math.abs(n);
  while (s > 9 && s !== 11 && s !== 22 && s !== 33) s = String(s).split("").reduce((a, c) => a + +c, 0);
  return s;
};
const reduce1 = (n: number): number => {
  let s = Math.abs(n);
  while (s > 9) s = String(s).split("").reduce((a, c) => a + +c, 0);
  return s;
};
const yearAnimal = (y: number) => chineseSignFor(15, 6, y).sign;

/** Variant keys — shared by the sections and the syllabus. */
export const K = {
  sign: (s: string) => s,
  element: (el: string, sign: string) => `${el} ${sign}`,
  compat: (sign: string, partner: string) => `${sign} with ${partner}`,
  /** A sign's forecast for a year ruled by `animal` (the text repeats every 12 years). */
  future: (sign: string, animal: string) => `${sign} · ${animal} Year`,
  /** Handbook: a sign's passage for an ascendant (the two-hour period ruled by `hour`). */
  hbAscendant: (sign: string, hour: string) => `${sign} · ${hour} Hours`,
  /** Handbook: a Western sun sign meeting a Chinese sign ("Sagittarius Rat"). */
  hbMoon: (western: string, sign: string) => `${western} ${sign}`,
  /** Handbook: a sign born in a season ("Winter Rat"). */
  hbSeason: (season: string, sign: string) => `${season} ${sign}`,
  /** Chinese Zodiacs: "Meanings of the Elements" for one element ("Wood People"). */
  zgElementPeople: (el: string) => `${el} People`,
  decan: (sign: string, n: number) => `${sign} · Decan ${n}`,
  stem: (stem: number, polarity: string, element: string) => `Stem ${stem} · ${polarity} ${element}`,
  branch: (animal: string, chinese: string) => `${animal} (${chinese})`,
  psyche: (n: number) => `Psyche ${n}`,
  psycheMonth: (n: number, month: number) => `Psyche ${n} · ${MONTHS[month - 1]}`,
  day: (d: number) => `Day ${d}`,
  destiny: (n: number) => `Destiny ${n}`,
  loshu: (n: number, count: number) => (count > 0 ? `Number ${n} ×${Math.min(count, 4)}` : `Number ${n} · absent`),
  loshuLevel: (n: number, level: number) => `Number ${n} ×${level}`,
  number: (n: number) => `Number ${n}`,
  lessonCount: (n: number) =>
    n === 0 ? "All nine present" : n === 1 ? "One missing" : n === 2 ? "Two missing" : n <= 5 ? "Three to five missing" : "Six or more missing",
  loshuConflict: (n: number, lp: number) => `Number ${n} · Life Path ${lp}`,
  pinnacle: (rawP: number, p: number) => `Pinnacle ${rawP >= 10 && rawP !== p ? `${rawP}/${p}` : p}`,
  challenge: (c: number) => `Challenge ${c}`,
  personalYear: (n: number) => `Personal Year ${n}`,
  personalMonth: (n: number) => `Personal Month ${n}`,
  /** The Personal Year Wave's year theme (masters read as their base number). */
  pyTheme: (pyn: number) => `Personal Year ${pyn === 11 ? 2 : pyn === 22 ? 4 : pyn === 33 ? 6 : pyn}`,
  kua: (n: number) => `Kua ${n}`,
  compound: (n: number) => `Compound ${n}`,
  birthDay: (day: number, title: string) => `Day ${day}: ${title}`,
  challengeStage: (stage: number, n: number) => `Stage ${stage} · Challenge ${n}`,
  master: (n: number) => `Master ${n}`,
  maturity: (n: number) => `Maturity ${n}`,
  lifePath: (n: number) => `Life Path ${n}`,
  /** The Number Codex entry for a number (1–9, 11, 22, 33). */
  codexNumber: (n: number) => `Codex ${n}`,
  /** The Animal Codex entry for an animal (the Rabbit is read as the Cat). */
  codexAnimal: (animal: string) => `${animalName(animal)} Codex`,
  period: (period: string, n: number) => `${period} Period · ${n}`,
  karmicDebt: (n: number, foundIn: string) => `Debt ${n} in ${foundIn}`,
  missing: (n: number) => `Missing ${n}`,
  missingSet: (ns: number[]) => (ns.length ? `Missing ${ns.join(", ")}` : "No missing numbers"),
  cell: (digit: number, label: string) => `${digit} · ${label}`,
  plane: (name: string, level: string) => `${name} · ${level}`,
  intersection: (pyn: number, cat: string) =>
    INTERSECTION_SYNTHESIS[`${pyn}_${cat === "ben" ? "ben-ming" : cat}`] ? `PY ${pyn} × ${CAT_LABEL[cat] ?? cat}` : `PY ${pyn} × Neutral Year`,
  taiSui: (birthSign: string, cat: string) => `${birthSign} · ${CAT_LABEL[cat] ?? cat}`,
  category: (cat: string) => CAT_LABEL[cat] ?? cat,
  yearAnimal: (animal: string) => `${animal} Year`,
  fatePinnacle: (p: number, c: number) => `Pinnacle ${p} · Challenge ${c}`,
};

/** Pinnacles as the Cosmic Fate Map computes them (its own formula). */
function fateMapStages(day: number, month: number, year: number) {
  const yTotal = String(year).split("").reduce((a, c) => a + +c, 0);
  const p1 = reduceMN(month + day);
  const p2 = reduceMN(day + yTotal);
  const p3 = reduceMN(p1 + p2);
  const p4 = reduceMN(month + yTotal);
  const cMonth = reduce1(month);
  const cDay = reduce1(day);
  const cYear = reduceMN(year);
  const c1 = reduce1(cMonth - cDay);
  const c2 = reduce1(cDay - cYear);
  const c3 = reduce1(c1 - c2);
  const c4 = reduce1(cMonth - cYear);
  return [[p1, c1], [p2, c2], [p3, c3], [p4, c4]];
}

const MONTHLY_PARTS: [string, string, string][] = [
  ["influence", "General influence", "generalInfluence"],
  ["character", "Monthly character", "monthlyCharacter"],
  ["finance", "Financial outlook", "financialOutlook"],
  ["health", "Health cautions", "healthCautions"],
  ["lucky", "Lucky numbers", "luckyNumbers"],
  ["colours", "Colours", "colors"],
  ["jewels", "Jewels", "jewels"],
  ["climacteric", "Climacteric years", "climactericYears"],
  ["magnetic", "Magnetic attraction", "magneticAttraction"],
];

const ARROW_NAME = new Map(ALL_ARROW_DEFINITIONS.map((a) => [a.id, a.name]));
export const arrowName = (id: string) => ARROW_NAME.get(id) ?? id;

const DIVE_PARTS: PartDef[] = [
  { id: "ov", label: "Overview" },
  { id: "es", label: "Esoteric" },
  { id: "py", label: "Pythagorean" },
  { id: "ve", label: "Vedic" },
  { id: "ch", label: "Chinese" },
  { id: "ca", label: "Chaldean" },
  { id: "pr", label: "Practices", optional: true },
];

const TIMING_SECTIONS: [string, string, string][] = [
  ["climacteric", "Climacteric Year", "Shown in a climacteric year"],
  ["headline", "Temporal Headline", "The year in one paragraph"],
  ["today", "Today's Intelligence", "Personal and universal day forecast"],
  ["arc", "3-Year Arc", "This year, next year and the year after"],
  ["scores", "Probability Scores", "Five-domain confidence index"],
  ["domains", "Life Domain Forecasts", "Career, money, love, health, spirit"],
  ["monthly", "Monthly Rhythm", "Personal months across the year"],
  ["window", "Window of Opportunity", "The year's best months"],
  ["caution", "Caution Flag", "The year's main risk and its mitigation"],
  ["tension", "Tension Signature", "The two forces pulling against each other"],
  ["days", "Day Intelligence", "Lucky days, dates and power windows"],
  ["loshu", "Lo Shu Grid Activation", "How this year lights up your grid"],
  ["missing", "Missing Numbers Forecast", "What the missing numbers ask this year"],
  ["repeated", "Repeated Number Amplifier", "The dominant number's amplification"],
  ["karmic", "Karmic Debt Trigger", "Whether a karmic debt is active"],
  ["pinnacle-radar", "Pinnacle Transition Radar", "Approaching pinnacle changes"],
  ["contradictions", "Contradiction Engine", "Conflicting signals and their resolution"],
  ["pinnacle", "Pinnacle & Challenge", "The active pinnacle and challenge"],
  ["overview", "7-Year Overview", "Year scores across the near future"],
];
/** Temporal-section title → timing field id. */
export function timingFieldForTitle(title: string): string | null {
  const t = title.toLowerCase();
  const hit = TIMING_SECTIONS.find(([, label]) => t.startsWith(label.toLowerCase().replace(/ · .*$/, "")));
  return hit ? `time.${hit[0]}` : null;
}

const A: ModuleId = "astro", N: ModuleId = "numerology", P: ModuleId = "psychomatrix", F: ModuleId = "fate";

/** Every layer of a Codex entry is one passage of its study. */
function codexParts(entry: { layers: { id: string; title: string }[] } | null): PartDef[] {
  return (entry?.layers ?? []).map((l, i) => ({ id: l.id, label: `Layer ${i + 1} · ${l.title}` }));
}
const codexNumberOf = (v: string) => codexNumber(Number(/Codex (\d+)/.exec(v)?.[1] ?? 0));
const codexAnimalOf = (v: string) => codexAnimal(/^(\w+) Codex/.exec(v)?.[1] ?? "");

export const FIELDS: FieldDef[] = [
  // ── Astrology ────────────────────────────────────────────────────────────
  { id: "astro.totem", module: A, topic: "The Animal Oracle", label: "Animal Sign Totem", kind: "chart", anchor: "astro.oracle",
    where: "Astrology › The Animal Oracle › Layer 1", blurb: "The character of each of the twelve animals.",
    variants: (c) => [K.sign(c.insight.sign)] },
  { id: "astro.element", module: A, topic: "The Animal Oracle", label: "Element Influence", kind: "chart", anchor: "astro.oracle",
    where: "Astrology › The Animal Oracle › Layer 2", blurb: "How the five elements colour each animal — 60 blends.",
    variants: (c) => (c.insight.zodiacData?.elements?.[c.insight.element] ? [K.element(c.insight.element, c.insight.sign)] : []) },
  { id: "astro.compat", module: A, topic: "The Animal Oracle", label: "Compatibility Bonds", kind: "chart", anchor: "astro.oracle",
    where: "Astrology › The Animal Oracle › Layer 3 › With the …", blurb: "Every animal paired with every animal — 144 bonds.",
    variants: (c) => Object.keys(c.insight.zodiacData?.compatibilities ?? {}).map((p) => K.compat(c.insight.sign, p)) },
  { id: "astro.future", module: A, topic: "The Animal Oracle", label: "Temporal Trajectory", kind: "chart", anchor: "astro.oracle",
    where: "Astrology › The Animal Oracle › Layer 4 › Temporal Trajectory", blurb: "Each sign's forecast for each of the twelve year animals.",
    variants: (c) => Object.keys(futureTexts(c.insight.zodiacData?.futures)).map((animal) => K.future(c.insight.sign, animal)) },
  // The user's own handbook, loaded on the device (lib/handbook): word-for-word passages in the Oracle.
  { id: "astro.hb.five", module: A, topic: "My Handbook", label: "The Five Different Animals", kind: "chart", anchor: "astro.oracle", requires: "handbook",
    where: "Astrology › The Animal Oracle › Element layer › The Five Different …", blurb: "The handbook's portrait of each animal in each of the five elements — 60 passages.",
    variants: (c) => [K.element(c.insight.element, c.insight.sign)] },
  { id: "astro.hb.compat", module: A, topic: "My Handbook", label: "Compatibility, Conflict & Pairings", kind: "chart", anchor: "astro.oracle", requires: "handbook",
    where: "Astrology › The Animal Oracle › Layer 3 › With the …", blurb: "Each partner's Compatibility and Conflict entry together with the handbook's \"Rat + Ox\" pairing.",
    parts: [{ id: "conflict", label: "Compatibility and Conflict" }, { id: "pair", label: "The pairing" }],
    variants: (c) => ANIMALS.map((p) => K.compat(c.insight.sign, p)) },
  { id: "astro.hb.intro", module: A, topic: "My Handbook", label: "Section Openings", kind: "chart", anchor: "astro.oracle", requires: "handbook",
    where: "Astrology › The Animal Oracle › Compatibility Bonds, Ascendants, Moon Signs › opening", blurb: "The handbook's opening words on compatibility, ascendants and moon signs for each animal.",
    parts: [{ id: "compat", label: "Compatibility and Conflict" }, { id: "ascendant", label: "Ascendant Relationships" }, { id: "moon", label: "Moon Signs Meet Sun Signs" }],
    variants: (c) => [K.sign(c.insight.sign)] },
  { id: "astro.hb.character", module: A, topic: "My Handbook", label: "Personality & Child", kind: "chart", anchor: "astro.oracle", requires: "handbook",
    where: "Astrology › The Animal Oracle › Personality layer", blurb: "The handbook's Personality and Child chapters for each animal.",
    parts: [{ id: "personality", label: "Personality" }, { id: "child", label: "Child" }],
    variants: (c) => [K.sign(c.insight.sign)] },
  { id: "astro.hb.ascendant", module: A, topic: "My Handbook", label: "Ascendants", kind: "chart", anchor: "astro.oracle", requires: "handbook",
    where: "Astrology › The Animal Oracle › Ascendants", blurb: "Each animal with each of the twelve hour-animals rising — 144 passages.",
    variants: (c) => ANIMALS.map((h) => K.hbAscendant(c.insight.sign, h)) },
  { id: "astro.hb.moon", module: A, topic: "My Handbook", label: "Moon Signs Meet Sun Signs", kind: "chart", anchor: "astro.oracle", requires: "handbook",
    where: "Astrology › The Animal Oracle › Moon Signs Meet Sun Signs", blurb: "Each animal under each of the twelve Western sun signs — 144 passages.",
    variants: (c) => [c.insight.western_sign, ...HB_WESTERN.filter((w) => w !== c.insight.western_sign)].filter(Boolean).map((w) => K.hbMoon(w, c.insight.sign)) },
  { id: "astro.hb.season", module: A, topic: "My Handbook", label: "The Four Seasons", kind: "chart", anchor: "astro.oracle", requires: "handbook",
    where: "Astrology › The Animal Oracle › The Four Seasons", blurb: "Each animal born in spring, summer, autumn and winter.",
    variants: (c) => {
      const own = birthSeason(c.day, c.month);
      return [own, ...HB_SEASONS.filter((x) => x !== own)].map((x) => K.hbSeason(x, c.insight.sign));
    } },
  { id: "astro.hb.famous", module: A, topic: "My Handbook", label: "Famous People", kind: "chart", anchor: "astro.oracle", requires: "handbook",
    where: "Astrology › The Animal Oracle › Famous People", blurb: "The handbook's famous people of each animal, by element.",
    parts: HB_ELEMENTS.map((e) => ({ id: e.toLowerCase(), label: e })),
    variants: (c) => [K.sign(c.insight.sign)] },
  // The user's "Chinese Zodiacs" book, loaded on the device: Foundations and each animal's chapter.
  { id: "astro.zg.found", module: A, topic: "Chinese Zodiacs", label: "Foundations: Yang, Yin & the Elements", kind: "library", anchor: "astro.oracle", requires: "zodiacs",
    where: "Astrology › The Animal Oracle › Foundations", blurb: "The twelve animals, your horoscope, Yang and Yin, the elements, the Creation and Destruction Cycles and what each element means.",
    parts: (v) => (/ People$/.test(v) ? [{ id: "main", label: "The element" }, { id: "yang", label: "Yang year" }, { id: "yin", label: "Yin year" }] : [{ id: "main", label: "Reading" }]),
    library: () => [...FOUNDATION_KEYS, ...["Wood", "Fire", "Earth", "Metal", "Water"].map(K.zgElementPeople)] },
  { id: "astro.zg.character", module: A, topic: "Chinese Zodiacs", label: "Virtues, Vices & Personality", kind: "chart", anchor: "astro.oracle", requires: "zodiacs",
    where: "Astrology › The Animal Oracle › Personality layer", blurb: "Each animal's opening, virtues, vices and personality.",
    parts: [{ id: "opening", label: "Opening", optional: true }, { id: "virtues", label: "Virtues" }, { id: "vices", label: "Vices" }, { id: "personality", label: "Personality" }],
    variants: (c) => [K.sign(c.insight.sign)] },
  { id: "astro.zg.love", module: A, topic: "Chinese Zodiacs", label: "Love & Career", kind: "chart", anchor: "astro.oracle", requires: "zodiacs",
    where: "Astrology › The Animal Oracle › Love & Career", blurb: "Each animal in love — lovers, friends and enemies — and at work.",
    parts: [{ id: "love", label: "In Love" }, { id: "career", label: "Career" }],
    variants: (c) => [K.sign(c.insight.sign)] },
  { id: "astro.zg.five", module: A, topic: "Chinese Zodiacs", label: "The Animal and the Five Elements", kind: "chart", anchor: "astro.oracle", requires: "zodiacs",
    where: "Astrology › The Animal Oracle › Element layer › … and the Five Elements", blurb: "Each animal in each element — 60 portraits.",
    parts: [{ id: "main", label: "Reading" }, { id: "intro", label: "Opening", optional: true }],
    variants: (c) => [K.element(c.insight.element, c.insight.sign)] },
  { id: "astro.zg.year", module: A, topic: "Chinese Zodiacs", label: "The Year of the Animal", kind: "chart", anchor: "astro.oracle", requires: "zodiacs",
    where: "Astrology › The Animal Oracle › Temporal Trajectory › The Year of the …", blurb: "What each animal's year brings to everyone.",
    variants: (c) => [K.sign(c.insight.sign)] },
  { id: "astro.zg.fortune", module: A, topic: "Chinese Zodiacs", label: "Fortunes Year by Year", kind: "chart", anchor: "astro.oracle", requires: "zodiacs",
    where: "Astrology › The Animal Oracle › Temporal Trajectory › each year", blurb: "Each animal's fortunes in each of the twelve animal years — 144 passages.",
    variants: (c) => ANIMALS.map((a) => K.future(c.insight.sign, a)) },
  { id: "astro.codex", module: A, topic: "The Animal Codex", label: "Animal Codex", kind: "chart", anchor: "astro.codex",
    where: "Astrology › The Animal Codex › Layers", blurb: "Each of the twelve animals in layers — essence, trines, enemies, child-rearing, geopolitics and famous figures — with the trine alliances of the Strategic Matrix.",
    parts: (v) => codexParts(codexAnimalOf(v)),
    variants: (c) => {
      const k = codexAnimalKey(c.insight.sign);
      return k ? [K.codexAnimal(k)] : [];
    } },
  { id: "astro.decan", module: A, topic: "Deep Synthesis", label: "Decan", kind: "chart", anchor: "astro.synthesis",
    where: "Astrology › Deep Synthesis › decan card", blurb: "The 36 ten-degree decans of the Western zodiac.",
    variants: (c) => (c.synthesis.decan ? [K.decan(c.synthesis.decan.sign, c.synthesis.decan.decanNumber)] : []) },
  { id: "astro.double", module: A, topic: "Deep Synthesis", label: "Double Animal", kind: "chart", anchor: "astro.synthesis",
    where: "Astrology › Deep Synthesis › Double …", blurb: "When the year and day animals coincide.",
    variants: (c) => (c.synthesis.doubleAnimal?.isDouble ? [`Double ${c.synthesis.doubleAnimal.animal}`] : []) },
  { id: "astro.sexagenary", module: A, topic: "Deep Synthesis", label: "Sexagenary Cycle", kind: "chart", anchor: "astro.synthesis",
    where: "Astrology › Deep Synthesis › Sexagenary", blurb: "The sixty stem-branch years.",
    variants: (c) => uniq([(c.synthesis.sexagenary as { name?: string } | null)?.name]) },
  { id: "astro.stem", module: A, topic: "Deep Synthesis", label: "Heavenly Stem", kind: "chart", anchor: "astro.synthesis",
    where: "Astrology › Deep Synthesis › Heavenly Stem", blurb: "The ten heavenly stems.",
    variants: (c) => (c.synthesis.heavenlyStem ? [K.stem(c.synthesis.heavenlyStem.stem, c.synthesis.heavenlyStem.polarity, c.synthesis.heavenlyStem.element)] : []) },
  { id: "astro.branch", module: A, topic: "Deep Synthesis", label: "Earthly Branch", kind: "chart", anchor: "astro.synthesis",
    where: "Astrology › Deep Synthesis › Earthly Branch", blurb: "The twelve earthly branches.",
    variants: (c) => (c.synthesis.earthlyBranch ? [K.branch(c.synthesis.earthlyBranch.animal, c.synthesis.earthlyBranch.animalChinese)] : []) },
  { id: "astro.relations", module: A, topic: "Deep Synthesis", label: "Zodiac Relationships", kind: "chart", anchor: "astro.synthesis",
    where: "Astrology › Deep Synthesis › Zodiac Relationships", blurb: "Secret friends, enemies and peach blossoms.",
    variants: (c) => (c.synthesis.zodiacRelationships ? [K.sign(c.synthesis.zodiacRelationships.animal)] : []) },
  { id: "astro.weekday", module: A, topic: "Deep Synthesis", label: "Day of the Week", kind: "chart", anchor: "astro.more",
    where: "Astrology › Deep Synthesis › Born on …", blurb: "The seven birth weekdays.",
    variants: (c) => uniq([(c.synthesis.birthDayOfWeek as { dayName?: string } | null)?.dayName]) },
  { id: "astro.profiler", module: A, topic: "Profiles", label: "Cosmic Profile Synthesis", kind: "practice", anchor: "astro.profiler",
    where: "Astrology › Cosmic Profile Synthesis", blurb: "A whole-chart character analysis — study it on many people." },
  { id: "astro.twins", module: A, topic: "Profiles", label: "Cosmic Twins", kind: "practice", anchor: "astro.twins",
    where: "Astrology › Cosmic Twins", blurb: "Famous lives that share a birthday, life path or zodiac." },

  // ── New Astrology ────────────────────────────────────────────────────────
  ...([
    ["na.profile", "Psychological Profile", "description", 1],
    ["na.love", "Romantic Blueprint", "love", 2],
    ["na.home", "Domestic Sphere", "homeAndFamily", 3],
    ["na.social", "Social Resonance", "compatibilities", 4],
    ["na.career", "Professional Path", "profession", 5],
  ] as const).map(([id, label, key, n]): FieldDef => ({
    id, module: "newastro", topic: "Sign Layers", label, kind: "chart", anchor: "na.layers",
    where: `New Astrology › Layer ${n} · ${label}`, blurb: `The ${label.toLowerCase()} of all 144 sign blends.`,
    variants: (c) => ((c.insight.signData as Record<string, string | undefined>)?.[key] ? [c.insight.new_astrology_sign] : []),
  })),

  // ── Numerology ───────────────────────────────────────────────────────────
  { id: "num.psyche", module: N, topic: "Core Vibrations", label: "Psychic Essence", kind: "chart", anchor: "num.core",
    where: "Numerology › Triad of Core Vibrations › Chamber 1", blurb: "The psychic (birth-day) numbers 1–9 in the Vedic and Cheiro traditions.",
    parts: [{ id: "johari", label: "Vedic (Johari)" }, { id: "cheiro", label: "Cheiro" }],
    variants: (c) => [K.psyche(c.numerology.psycheNum)] },
  { id: "num.psyche-month", module: N, topic: "Core Vibrations", label: "Psychic Number × Birth Month", kind: "chart", anchor: "num.core",
    where: "Numerology › Core Vibrations › Chamber 1 › monthly layers", blurb: "The monthly chronicle for every psychic number in every month.",
    parts: (v) => {
      const m = /Psyche (\d+) · (\w+)/.exec(v);
      const data = m ? (resolveMonthData(MONTHS.indexOf(m[2]) + 1, Number(m[1])) as Record<string, unknown>) : {};
      return MONTHLY_PARTS.filter(([, , k]) => !m || String(data[k] ?? "").trim()).map(([id, label]) => ({ id, label }));
    },
    variants: (c) => [K.psycheMonth(c.numerology.psycheNum, c.month)] },
  { id: "num.day", module: N, topic: "Core Vibrations", label: "Day of Incarnation", kind: "chart", anchor: "num.core",
    where: "Numerology › Core Vibrations › Chamber 2", blurb: "The compound birth days 10–31.",
    variants: (c) => (c.numerology.specialTraitMeaning ? [K.day(c.day)] : []) },
  { id: "num.destiny", module: N, topic: "Core Vibrations", label: "Destiny Path", kind: "chart", anchor: "num.core",
    where: "Numerology › Core Vibrations › Chamber 3", blurb: "The destiny numbers.",
    variants: (c) => [K.destiny(c.numerology.destinyNum)] },
  { id: "num.codex", module: N, topic: "The Number Codex", label: "Number Codex", kind: "chart", anchor: "num.codex",
    where: "Numerology › The Number Codex › Layers", blurb: "The numbers 1–9 and the Master Numbers 11, 22 and 33 in layers — essence, letterology, enemies and friends, birthdays, cycles and famous figures — read for the Life Path and the birth-day energy.",
    parts: (v) => codexParts(codexNumberOf(v)),
    variants: (c) => codexNumbersFor(c.day, c.month, c.year).map((x) => K.codexNumber(x.n)) },
  { id: "num.loshu", module: N, topic: "Lo Shu Grid", label: "Lo Shu Number", kind: "chart", anchor: "num.loshu",
    where: "Numerology › Lo Shu Grid › tap a number", blurb: "Each grid number at each repetition.",
    parts: (v) => {
      if (v.endsWith("absent")) return [{ id: "meaning", label: "Grid meaning" }];
      const times = Number(v.match(/×(\d)/)?.[1] ?? 1);
      // Three or more repetitions also show the "drowning" (overload) reading.
      return [
        { id: "meaning", label: "Grid meaning" },
        { id: "intensity", label: "Intensity reading" },
        ...(times >= 3 ? [{ id: "drowning", label: "Overload reading", optional: true }] : []),
      ];
    },
    variants: (c) => range(1, 9).map((n) => K.loshu(n, c.numerology.numberCounts[String(n)] || 0)) },
  { id: "num.loshu-levels", module: N, topic: "Lo Shu Grid", label: "Intensity Spectrum", kind: "library", anchor: "num.loshu",
    where: "Numerology › Lo Shu Grid › a number › Layer 2 › View all intensity levels", blurb: "Single, double, triple and quadruple of every number.",
    library: () => range(1, 9).flatMap((n) => range(1, 4).map((l) => K.loshuLevel(n, l))) },
  { id: "num.loshu-remedy", module: N, topic: "Lo Shu Grid", label: "Remedies", kind: "library", anchor: "num.loshu",
    where: "Numerology › Lo Shu Grid › a number › Layer 4 › Remedies", blurb: "What to do when a number is missing or overloaded.",
    parts: [{ id: "missing", label: "If missing" }, { id: "overloaded", label: "If overloaded" }],
    library: () => range(1, 9).map(K.number) },
  { id: "num.loshu-conflict", module: N, topic: "Lo Shu Grid", label: "Hardware vs Software Conflict", kind: "chart", anchor: "num.loshu",
    where: "Numerology › Lo Shu Grid › a number › Layer 4", blurb: "When the life path drowns in its own grid number.",
    variants: (c) => {
      const out: string[] = [];
      const birth = `${c.day}/${c.month}/${c.year}`;
      for (const n of range(1, 9)) {
        const count = c.numerology.numberCounts[String(n)] || 0;
        if (count < 3) continue;
        const a = analyzeNumber(n, birth, count);
        if (a.lifePathConflict) out.push(K.loshuConflict(n, a.lifePath));
      }
      return out;
    } },
  { id: "num.concepts", module: N, topic: "Lo Shu Grid", label: "Grid Concepts", kind: "library", anchor: "num.loshu",
    where: "Numerology › Lo Shu Grid › a number › Layers 3–4", blurb: "The drowning effect and hardware-vs-software principles.",
    library: () => ["Drowning Effect", "Hardware vs Software"] },
  { id: "num.missing-quick", module: N, topic: "Lo Shu Grid", label: "Missing Number Quick Guide", kind: "chart", anchor: "num.missing",
    where: "Numerology › Missing Numbers › tap a number › Shadow / Soul Lesson / Practice", blurb: "The shadow, soul lesson and daily practice of each missing number.",
    parts: [{ id: "shadow", label: "Shadow" }, { id: "lesson", label: "Soul lesson" }, { id: "practice", label: "Practice" }],
    variants: (c) => range(1, 9).filter((n) => !c.numerology.numberCounts[String(n)]).map(K.missing) },
  { id: "num.kua", module: N, topic: "Lo Shu Grid", label: "Lucky Compass (Kua)", kind: "chart", anchor: "num.kua",
    where: "Numerology › Lucky Compass", blurb: "Each Kua number's element, trigram, colour and lucky directions.",
    variants: (c) => (c.numerology.kuaAttributes && c.numerology.kuaNum ? [K.kua(c.numerology.kuaNum)] : []) },
  { id: "num.arrow", module: N, topic: "Arrows of Power", label: "Arrow", kind: "chart", anchor: "num.arrows",
    where: "Numerology › Arrows of Power › an arrow", blurb: "The arrows of strength and weakness.",
    parts: [
      { id: "meaning", label: "Meaning" },
      { id: "anatomy", label: "Arrow anatomy" },
      { id: "activation", label: "Activation", optional: true },
      { id: "potential", label: "Potential" },
      { id: "shadow", label: "Shadow" },
    ],
    variants: (c) => uniq([...c.numerology.arrowsOfStrength, ...c.numerology.arrowsOfWeakness].map((a) => arrowName(a.id))) },
  { id: "num.pinnacle", module: N, topic: "Pinnacles & Challenges", label: "Pinnacle", kind: "chart", anchor: "num.pinnacles",
    where: "Numerology › Pinnacles & Challenges › a pinnacle", blurb: "The four life pinnacles, with their compound roots.",
    variants: (c) => uniq(calcStages(c.numerology.destinyNum, c.day, c.month, c.year).map((s) => K.pinnacle(s.rawP, s.p))) },
  { id: "num.challenge", module: N, topic: "Pinnacles & Challenges", label: "Challenge", kind: "chart", anchor: "num.pinnacles",
    where: "Numerology › Pinnacles & Challenges › a challenge", blurb: "The challenge numbers 0–8.",
    variants: (c) => uniq(calcStages(c.numerology.destinyNum, c.day, c.month, c.year).map((s) => K.challenge(s.c))) },
  { id: "num.compound", module: N, topic: "Chambers of Fate", label: "Compound Fate", kind: "chart", anchor: "num.chambers",
    where: "Numerology › Chambers of Fate › Chamber 1", blurb: "The compound fate numbers.",
    variants: (c) => (c.numerology.compoundMeaning && c.numerology.compoundNum ? [K.compound(c.numerology.compoundNum)] : []) },
  { id: "num.inherent", module: N, topic: "Chambers of Fate", label: "Inherent Fate", kind: "chart", anchor: "num.chambers",
    where: "Numerology › Chambers of Fate › Chamber 2", blurb: "The reduced compound (inherent fate) numbers.",
    variants: (c) => (c.numerology.reducedCompoundMeaning && c.numerology.reducedCompoundNum ? [`Inherent ${c.numerology.reducedCompoundNum}`] : []) },
  { id: "num.karmic-fate", module: N, topic: "Chambers of Fate", label: "Karmic Fate", kind: "chart", anchor: "num.chambers",
    where: "Numerology › Chambers of Fate › Chamber 3", blurb: "The karmic fate numbers.",
    variants: (c) => (c.numerology.karmicFateMeaning && c.numerology.karmicFateNum ? [`Karmic Fate ${c.numerology.karmicFateNum}`] : []) },
  { id: "num.py-timeline", module: N, topic: "Personal Years", label: "Personal Year Timeline", kind: "library", anchor: "num.py-timeline",
    where: "Numerology › Personal Year Timeline › tap a year", blurb: "The nine personal years, one by one.",
    library: () => range(1, 9).map(K.personalYear) },
  { id: "num.py-theme", module: N, topic: "Personal Years", label: "Year Theme", anchor: "num.py-wave",
    where: "Numerology › Personal Year Wave › tap a year › Year Theme", blurb: "The year theme for each personal year number.",
    kind: "library", library: () => range(1, 9).map(K.personalYear) },
  { id: "num.py-compound", module: N, topic: "Personal Years", label: "Year Compound", anchor: "num.py-wave",
    where: "Numerology › Personal Year Wave › tap a year › Direct / Classic / Manifestation", blurb: "The compound personal-year numbers: essence, karma and manifestation.",
    parts: [{ id: "essence", label: "Essence" }, { id: "karmic", label: "Karmic dynamics", optional: true }, { id: "manifestation", label: "Manifestation" }],
    kind: "library", library: () => Object.keys(PYN_COMPOUNDS).map(Number).filter((n) => PYN_COMPOUNDS[n]?.vibrationalEssence).sort((a, b) => a - b).map(K.compound) },
  { id: "num.py-dual", module: N, topic: "Personal Years", label: "Dual Essence", anchor: "num.py-wave",
    where: "Numerology › Personal Year Wave › tap a year › Synthesis", blurb: "The dual essence of the direct and classic year — different for every person and year, so it is mastered by studying it on many charts and years.",
    kind: "practice" },
  { id: "num.birthday", module: N, topic: "Deep Synthesis", label: "Birth Day", kind: "chart", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › Birth Day", blurb: "All 31 birth days.",
    variants: (c) => (c.synthesis.birthDayAnalysis ? [K.birthDay(c.synthesis.birthDayAnalysis.day, c.synthesis.birthDayAnalysis.title)] : []) },
  { id: "num.challenge-deep", module: N, topic: "Deep Synthesis", label: "Challenge (deep)", kind: "chart", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › Challenge", blurb: "Each challenge number at each life stage.",
    variants: (c) => (c.synthesis.challenges?.challenges ?? []).map((x) => K.challengeStage(x.stage, x.number)) },
  { id: "num.master", module: N, topic: "Deep Synthesis", label: "Master Number", kind: "chart", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › Master Number", blurb: "The master numbers 11, 22 and 33 and their kin.",
    variants: (c) => uniq((c.synthesis.masterNumbers ?? []).map((m) => K.master(m.number))) },
  { id: "num.maturity", module: N, topic: "Deep Synthesis", label: "Maturity Number", kind: "chart", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › Maturity Number", blurb: "The maturity numbers.",
    variants: (c) => (c.synthesis.maturityNumber ? [K.maturity(c.synthesis.maturityNumber.number)] : []) },
  { id: "num.lifepath", module: N, topic: "Deep Synthesis", label: "Life Path", kind: "chart", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › Life Path", blurb: "The life path numbers.",
    variants: (c) => (c.synthesis.lifePath ? [K.lifePath(c.synthesis.lifePath.number)] : []) },
  { id: "num.period", module: N, topic: "Deep Synthesis", label: "Life Path Period", kind: "chart", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › … Period", blurb: "The three life periods and their numbers.",
    variants: (c) => (c.synthesis.lifePathPeriods?.periods ?? []).map((p) => K.period(p.period, p.number)) },
  { id: "num.birthmonth", module: N, topic: "Deep Synthesis", label: "Birth Month", kind: "chart", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › Born in …", blurb: "The twelve birth months.",
    variants: (c) => uniq([(c.synthesis.birthMonthAnalysis as { monthName?: string } | null)?.monthName]) },
  { id: "num.karmic-debt", module: N, topic: "Deep Synthesis", label: "Karmic Debt", kind: "chart", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › Karmic Debt", blurb: "Karmic debts 13, 14, 16 and 19 wherever they appear.",
    variants: (c) => uniq((c.synthesis.karmicDebts ?? []).map((k) => K.karmicDebt(k.number, k.foundIn))) },
  { id: "num.karmic-lessons", module: N, topic: "Deep Synthesis", label: "Karmic Lessons Summary", kind: "chart", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › Karmic Lessons", blurb: "The overview of the numbers a chart lacks.",
    // The summary's wording changes only with how many numbers are missing (1 · 2 · 3–5 · 6+ · none).
    variants: (c) => {
      if (!c.synthesis.karmicLessons?.summary) return [];
      return [K.lessonCount(missingLessons(c).length)];
    },
    // (A birth date has at most eight digits, so "all nine present" can't occur.)
    universe: () => [1, 2, 3, 6].map(K.lessonCount) },
  { id: "num.karmic-lesson", module: N, topic: "Deep Synthesis", label: "Karmic Lesson", kind: "chart", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › Karmic Lessons › Missing Number", blurb: "The lesson of each missing number.",
    variants: (c) => uniq(missingLessons(c).map((l) => K.missing(l.number))) },
  { id: "num.absence", module: N, topic: "Deep Synthesis", label: "Combined Absence", kind: "chart", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › absence patterns", blurb: "Patterns made by numbers missing together.",
    variants: (c) => uniq((c.synthesis.combinedAbsences?.patterns ?? []).map((p) => p.name)) },
  { id: "num.karmic-null", module: N, topic: "Deep Synthesis", label: "Karmic Fate: Fresh Slate", kind: "chart", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › Karmic Fate: Fresh Slate", blurb: "Charts born without a karmic fate number.",
    variants: (c) => (c.synthesis.karmicFateNullMeaning ? ["Fresh Slate"] : []) },
  { id: "num.compound-insight", module: N, topic: "Deep Synthesis", label: "Compound — Personalized", kind: "chart", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › Compound Number — Personalized", blurb: "Each compound number set against the whole chart.",
    variants: (c) => (c.synthesis.compoundPersonalizedInsight && c.numerology.compoundNum ? [K.compound(c.numerology.compoundNum)] : []) },
  { id: "num.personal-month", module: N, topic: "Living Numbers", label: "Personal Month", kind: "temporal", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › Personal Month", blurb: "This month's personal month for each chart.",
    temporal: (b, now) => [K.personalMonth(reduceMN(computePersonalYearNumber(b.day, b.month, now.getFullYear()) + now.getMonth() + 1))],
    universe: () => [...range(1, 9), 11, 22, 33].map(K.personalMonth) },
  { id: "num.personal-year", module: N, topic: "Living Numbers", label: "Personal Year", kind: "temporal", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › Personal Year", blurb: "This year's personal year: interpretation, dual essence and the classic reckoning.",
    parts: [{ id: "main", label: "Interpretation" }, { id: "dual", label: "Dual essence", optional: true }, { id: "classic", label: "Classic system", optional: true }],
    temporal: (b, now) => [K.personalYear(computePersonalYearNumber(b.day, b.month, now.getFullYear()))],
    universe: () => [...range(1, 9), 11, 22, 33].map(K.personalYear) },
  { id: "num.py-custom", module: N, topic: "Living Numbers", label: "Personal Year — Customized", kind: "practice", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › Personal Year — Customized", blurb: "The personal year read through the whole matrix." },
  { id: "num.universal-year", module: N, topic: "Living Numbers", label: "Universal Year", kind: "temporal", anchor: "num.synthesis",
    where: "Numerology › Deep Synthesis › Universal Year", blurb: "The collective year everyone shares.",
    temporal: (_b, now) => [`Universal Year ${now.getFullYear()}`],
    universe: () => [`Universal Year ${new Date().getFullYear()}`] },
  { id: "num.precedent", module: N, topic: "Living Numbers", label: "Precedent Ledger", kind: "practice", anchor: "num.precedent",
    where: "Numerology › Precedent Ledger", blurb: "How this year's historical precedents actually turned out." },
  { id: "num.meanings", module: N, topic: "Number Lore", label: "Number Meanings Reference", kind: "library", anchor: "num.meanings",
    where: "Numerology › Number Meanings Reference", blurb: "The reference meaning of every number.",
    library: () => getNumberMeanings().map((m) => K.number(m.number)) },

  // ── Psychomatrix ─────────────────────────────────────────────────────────
  { id: "psy.zero", module: P, topic: "The Matrix", label: "The Great Void (0)", kind: "chart", anchor: "psy.matrix",
    where: "Psychomatrix › Matrix › Analysis of the Great Void", blurb: "What zeros in a birth date mean.",
    variants: (c) => (c.psy.zeroAnalysis?.hasAnyZero ? uniq(c.psy.zeroAnalysis.interpretations.map(zeroLabel)) : []) },
  { id: "psy.cell-meaning", module: P, topic: "Cells", label: "General Meaning of a Number", kind: "library", anchor: "psy.matrix",
    where: "Psychomatrix › Detail › pick a number", blurb: "What each of the nine cells governs.",
    library: () => range(1, 9).filter((d) => PSYCHOMATRIX_CELL_MEANINGS[d]?.generalMeaning).map(K.number) },
  { id: "psy.cell", module: P, topic: "Cells", label: "Cell Reading", kind: "library", anchor: "psy.matrix",
    where: "Psychomatrix › Detail › pick a number › its readings", blurb: "Every level of every cell, from absent to overload.",
    library: () => range(1, 9).flatMap((d) => (PSYCHOMATRIX_CELL_MEANINGS[d]?.meanings ?? []).map((m) => K.cell(d, m.label))) },
  { id: "psy.difficulty", module: P, topic: "Cells", label: "Difficulty in Interpreting", kind: "chart", anchor: "psy.matrix",
    where: "Psychomatrix › Detail › pick a number › Difficulty", blurb: "The interpretive pitfalls of each cell level.",
    variants: (c) => uniq(c.psy.cellReadings.filter((r) => r.difficultyVerbatim).map((r) => K.cell(r.digit, r.label))) },
  { id: "psy.line", module: P, topic: "Lines", label: "Line Meaning", kind: "library", anchor: "psy.matrix",
    where: "Psychomatrix › Lines › a line", blurb: "The eight lines: introductions, mechanics and the interpreter's note.",
    parts: [
      { id: "intro", label: "Introduction" },
      { id: "new-intro", label: "New introduction" },
      { id: "transmutation", label: "Transmutation" },
      { id: "mechanics", label: "Inner mechanics" },
      { id: "note", label: "Interpreter's note" },
    ],
    library: () => PSYCHOMATRIX_LINE_INTERPRETATIONS.map((l) => l.name) },
  { id: "psy.line-level", module: P, topic: "Lines", label: "Line Level", kind: "chart", anchor: "psy.matrix",
    where: "Psychomatrix › Lines › a line › Primary interpretation", blurb: "Each line at each strength.",
    parts: [{ id: "verbatim", label: "Primary interpretation" }, { id: "deep", label: "Deep dive" }],
    variants: (c) => PSYCHOMATRIX_LINE_INTERPRETATIONS.flatMap((line) => {
      const total = line.digits.reduce((s, d) => s + (c.psy.counts[d] || 0), 0);
      const level = getLineLevel(line.id, total);
      return level ? [`${line.name} · ${level.label}`] : [];
    }) },
  { id: "psy.dynamic", module: P, topic: "The Matrix", label: "Dynamic Matrix Potentials", kind: "practice", anchor: "psy.matrix",
    where: "Psychomatrix › Lines › Dynamic Matrix Potentials", blurb: "How the working numbers shift the matrix over time." },
  { id: "psy.transition", module: P, topic: "Synthesis", label: "Karmic Life Transition", kind: "chart", anchor: "psy.matrix",
    where: "Psychomatrix › Synthesis › Karmic Life Transitions", blurb: "Number-to-number transitions and their advisories.",
    variants: (c) => uniq(c.transitions.map((t) => t.name)) },
  { id: "psy.line-pattern", module: P, topic: "Synthesis", label: "Line Intersection", kind: "chart", anchor: "psy.synthesis",
    where: "Psychomatrix › Line Intersection Synthesis", blurb: "Patterns made where lines cross.",
    variants: (c) => uniq((c.synthesis.lineIntersections?.patterns ?? []).map((p) => p.name)) },
  { id: "psy.dominant", module: P, topic: "Psychic Architecture", label: "Dominant Force", kind: "chart", anchor: "psy.synthesis",
    where: "Psychomatrix › Psychic Architecture — Priority Ranking", blurb: "The forces that run a chart.",
    variants: (c) => uniq((c.dominance?.top3 ?? []).map((e) => e.element)) },
  { id: "psy.suppressed", module: P, topic: "Psychic Architecture", label: "Suppressed Frontier", kind: "chart", anchor: "psy.synthesis",
    where: "Psychomatrix › Psychic Architecture › suppressed", blurb: "The forces a chart keeps underground.",
    variants: (c) => uniq((c.dominance?.rankedElements ?? []).slice(-2).map((e) => e.element)) },
  { id: "psy.domain", module: P, topic: "Psychic Architecture", label: "Life-Domain Grid Profile", kind: "practice", anchor: "psy.synthesis",
    where: "Psychomatrix › Life-Domain Grid Profile", blurb: "Career, love, money, health and spirit read from the grid." },
  { id: "psy.contradiction", module: P, topic: "Psychic Architecture", label: "Creative Tension", kind: "chart", anchor: "psy.synthesis",
    where: "Psychomatrix › Creative Tensions", blurb: "Contradictions inside a matrix and how they play out.",
    variants: (c) => uniq(c.contradictions.map((x) => x.name)) },
  { id: "psy.recommendation", module: P, topic: "Psychic Architecture", label: "Consultant Recommendation", kind: "chart", anchor: "psy.synthesis",
    where: "Psychomatrix › Consultant Recommendations", blurb: "Advice and 30-day practices for each grid fact.",
    parts: [{ id: "main", label: "Recommendation" }, { id: "practice", label: "30-day practice" }],
    variants: (c) => uniq(c.recommendations.map((r) => r.title)) },
  { id: "psy.cellpair", module: P, topic: "Synthesis", label: "Cross-Cell Interaction", kind: "chart", anchor: "psy.cellpairs",
    where: "Psychomatrix › Cross-Cell Interactions", blurb: "Archetypal cell-pair patterns.",
    variants: (c) => uniq((c.synthesis.cellPairs?.patterns ?? []).map((p) => p.name)) },
  { id: "psy.planes", module: P, topic: "Four Planes", label: "Plane Synthesis", kind: "practice", anchor: "psy.planes",
    where: "Psychomatrix › Four Planes of Expression", blurb: "The balance of the four planes, read as one." },
  { id: "psy.plane", module: P, topic: "Four Planes", label: "Plane of Expression", kind: "chart", anchor: "psy.planes",
    where: "Psychomatrix › Four Planes of Expression › a plane", blurb: "Each plane at each level.",
    variants: (c) => {
      const pa = c.synthesis.planeAnalysis;
      return pa ? uniq([pa.mental, pa.physical, pa.emotional, pa.intuitive].filter(Boolean).map((p) => K.plane(p.name, p.level))) : [];
    } },

  // ── Cosmic Fate Map ──────────────────────────────────────────────────────
  { id: "fate.oracle", module: F, topic: "Year Oracle", label: "Your Year Reading", kind: "practice", anchor: "fate.root", fateTab: "synthesis",
    where: "Cosmic Fate Map › ✦ Oracle", blurb: "Every timing layer woven into one reading." },
  { id: "fate.dive", module: F, topic: "Year Oracle", label: "Year Deep Dive", kind: "library", anchor: "fate.root", fateTab: "yeardive",
    where: "Cosmic Fate Map › ☽ Dive (cast any year)", blurb: "Each personal year through six traditions.",
    parts: DIVE_PARTS,
    library: () => [...range(1, 9), 11, 22, 33].filter((n) => yearDiveOracle(n)).map(K.personalYear) },
  { id: "fate.intersection", module: F, topic: "Critical Years", label: "Critical Year Intersection", kind: "temporal", anchor: "fate.root", fateTab: "intersections",
    where: "Cosmic Fate Map › 🔥 Critical", blurb: "Personal years 4 and 7 meeting each Tai Sui relation.",
    temporal: (b, now) => {
      const sign = chineseSignFor(b.day, b.month, b.year).sign;
      const out: string[] = [];
      for (let y = now.getFullYear(); y <= now.getFullYear() + 30; y++) {
        const pyn = reduceMN(b.month + b.day + String(y).split("").reduce((a, c) => a + +c, 0));
        if (pyn === 4 || pyn === 7) out.push(K.intersection(pyn, taiSuiCategory(sign, yearAnimal(y))));
      }
      return uniq(out);
    },
    universe: () => uniq([4, 7].flatMap((p) => ["ben", "clash", "harm", "destruction", "alliance", "neutral"].map((c) => K.intersection(p, c)))) },
  { id: "fate.taisui-intro", module: F, topic: "Tai Sui", label: "Birth Sign Nature", kind: "chart", anchor: "fate.root", fateTab: "zodiac",
    where: "Cosmic Fate Map › ☯ Zodiac (also Numerology › zodiac)", blurb: "Element, polarity, organs and direction of each animal.",
    variants: (c) => [K.sign(chineseSignFor(c.day, c.month, c.year).sign)] },
  { id: "fate.taisui-relation", module: F, topic: "Tai Sui", label: "Your Sign in a Year", kind: "chart", anchor: "fate.root", fateTab: "zodiac",
    where: "Cosmic Fate Map › ☯ Zodiac › tap a year", blurb: "How each animal fares in clash, harm, alliance and other years.",
    variants: (c) => {
      const sign = chineseSignFor(c.day, c.month, c.year).sign;
      return uniq(ANIMALS.map((a) => K.taiSui(sign, taiSuiCategory(sign, a))));
    } },
  { id: "fate.taisui-category", module: F, topic: "Tai Sui", label: "Tai Sui Year Types", kind: "library", anchor: "fate.root", fateTab: "zodiac",
    where: "Cosmic Fate Map › ☯ Zodiac › tap a year", blurb: "What a Ben Ming, clash, harm, destruction or alliance year is.",
    library: () => ["ben", "clash", "harm", "destruction", "alliance"].map(K.category) },
  { id: "fate.year-animal", module: F, topic: "Tai Sui", label: "Year Animal Qualities", kind: "library", anchor: "fate.root", fateTab: "zodiac",
    where: "Cosmic Fate Map › ☯ Zodiac › tap a year", blurb: "The trait, organ and direction of each year animal.",
    library: () => ANIMALS.map(K.yearAnimal) },
  { id: "fate.pinnacle", module: F, topic: "Pinnacles", label: "Pinnacle & Challenge Pair", kind: "chart", anchor: "fate.root", fateTab: "pinnacles",
    where: "Cosmic Fate Map › ◈ Pinnacle", blurb: "Pinnacles read together with their challenges.",
    variants: (c) => uniq(fateMapStages(c.day, c.month, c.year).map(([p, ch]) => K.fatePinnacle(p, ch))) },
  { id: "fate.enemy", module: F, topic: "Enemy Years", label: "Enemy Year Dynamics", kind: "library", anchor: "fate.root", fateTab: "enemy",
    where: "Cosmic Fate Map › ⚠️ Enemy", blurb: "Personal years 4 and 7 in enemy years.",
    library: () => CONVERGENCE_CARDS.map((c) => c.title) },

  // ── Soul Resonance (needs two saved souls) ───────────────────────────────
  { id: "res.johari", module: "resonance", topic: "Soul Resonance", label: "Johari Pair Readings", kind: "practice", anchor: "res.panel",
    where: "Above the tabs › Soul Resonance › Johari compatibility", blurb: "Psychic and destiny numbers of two people read against each other.",
    parts: [{ id: "psychic", label: "Psychic ↔ Psychic" }, { id: "destiny", label: "Destiny ↔ Destiny" }, { id: "cross-ab", label: "Psychic ↔ Destiny", optional: true }, { id: "cross-ba", label: "Destiny ↔ Psychic", optional: true }] },
  { id: "res.chinese", module: "resonance", topic: "Soul Resonance", label: "Chinese Zodiac Bond", kind: "practice", anchor: "res.panel",
    where: "Above the tabs › Soul Resonance › Chinese zodiac compatibility", blurb: "Two animal signs read as a pair." },
  { id: "res.newastro", module: "resonance", topic: "Soul Resonance", label: "New Astrology Bond", kind: "practice", anchor: "res.panel",
    where: "Above the tabs › Soul Resonance › New Astrology compatibility", blurb: "Each person's sign blend read towards the other's.",
    parts: [{ id: "a", label: "First soul" }, { id: "b", label: "Second soul", optional: true }] },
  { id: "res.story", module: "resonance", topic: "Soul Resonance", label: "Resonance Stories", kind: "practice", anchor: "res.panel",
    where: "Above the tabs › Soul Resonance › extended layers", blurb: "The Lo Shu overlay, the psychomatrix comparison and shared cosmic twins.",
    parts: [{ id: "loshu", label: "Lo Shu karmic overlay" }, { id: "psycho", label: "Psychomatrix comparison" }, { id: "twins", label: "Cosmic twins", optional: true }] },

  // ── Timing Engine ────────────────────────────────────────────────────────
  ...TIMING_SECTIONS.map(([id, label, blurb]): FieldDef => ({
    id: `time.${id}`, module: "timing", topic: "Temporal Prediction", label, kind: "practice", anchor: "time.panel",
    where: `Above the tabs › ${label}`, blurb,
  })),
];

export const FIELD_BY_ID = new Map(FIELDS.map((f) => [f.id, f]));

export function partsOf(field: FieldDef, variant: string): PartDef[] {
  const p = typeof field.parts === "function" ? field.parts(variant) : field.parts;
  return p && p.length ? p : [{ id: "main", label: "Reading" }];
}

/** Variants a chart shows for a field ([] when the chart doesn't show it). */
export function chartVariants(field: FieldDef, chart: Chart, now = new Date(), opts: { all?: boolean } = {}): string[] {
  if (!opts.all && !fieldAvailable(field)) return [];
  try {
    if (field.kind === "practice") return [PRACTICE];
    if (field.kind === "library") return field.library?.() ?? [];
    if (field.kind === "temporal") return field.temporal?.(chart, now) ?? [];
    return field.variants?.(chart) ?? [];
  } catch {
    return [];
  }
}

/** Personal-year number used by the timing fields and suggestions. */
export function currentPersonalYear(day: number, month: number, now = new Date()): number {
  return computePersonalYearNumber(day, month, now.getFullYear());
}

export { computeRawPersonalYear, MONTHS, ANIMALS };
