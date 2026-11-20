/**
 * Calendar maths shared by every Chinese-astrology and weekday feature.
 *
 * The Chinese zodiac year starts at Lunar New Year (21 Jan – 20 Feb), and the
 * solar (BaZi / Feng Shui) year starts at Lichun (3–5 Feb). Before this module
 * the app used the Gregorian year in several places, so anyone born in
 * January or early February could see one animal on the zodiac card and
 * another on the sexagenary, relationships and BaZi cards.
 *
 * The tables cover 1800–2100 (Beijing time, UTC+8). They were generated with
 * lunar-javascript (Lunar New Year) and astronomy-engine (Lichun = solar
 * longitude 315°), and source/scripts/validate-celebrity-accuracy.ts checks
 * them against a separate fixture. Outside that range, 4 February is used:
 * it is the single date that is closest to both boundaries on average.
 *
 * Years are the app's historical numbering (-100 = 100 BC); there is no year 0.
 */

export const CHINESE_TABLE_FROM = 1800;
export const CHINESE_TABLE_TO = 2100;

// One character per year from 1800. Index in ALPHABET = days after 21 Jan
// (0–10 = 21–31 Jan, 11–30 = 1–20 Feb).
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef';
const LUNAR_NEW_YEAR =
  'EXNCVKcRHYOEXLATIaPFYNCVKcRGZOEXMeTIbPFYNCUJcRGZPDWLeSIbQFYN' +
  'CUJcSGZPEVKdTIbQFXMBUJcSHZODWKATJbQFXMBUKdSIaOEXMBUJcQFYNCVL' +
  'eSHaPDXMCUJbQFYODVKdSGZPEXMBUIbQGYNDWKcSHZPEXMATJbQGZNCVKcRH' +
  'aPEXMeTIbQGZOCUKdRHaPDWLBTIcRFYNCUKdSHaPEWLBUIbQFXNCVKdSHZOD' +
  'WLBUJbQFYMCVLdSHZODWMATIbPFYNCVKdRGZPDWMBTIbQFYNDUJcRGZPEWLA' +
  'T';

// One digit per year from 1800: the February day of Lichun.
const LICHUN =
  '444554455444544454445444544454445444544454444444444444444444' +
  '444444444444444443444344434443444344434444555455545554455445' +
  '544554455445544554455445544454445444544454445444544454445444' +
  '544444444444444444444444444444444444434443444344434443444344' +
  '434443444334433443344334433443344334433443334333433343334333' +
  '4';

export interface MonthDay { month: number; day: number }

const inTable = (year: number) => year >= CHINESE_TABLE_FROM && year <= CHINESE_TABLE_TO;
const isBefore = (month: number, day: number, b: MonthDay) => month < b.month || (month === b.month && day < b.day);

/** Gregorian date of Chinese New Year, or null outside 1800–2100. */
export function lunarNewYearDate(year: number): MonthDay | null {
  if (!inTable(year)) return null;
  const offset = ALPHABET.indexOf(LUNAR_NEW_YEAR[year - CHINESE_TABLE_FROM]);
  return offset <= 10 ? { month: 1, day: offset + 21 } : { month: 2, day: offset - 10 };
}

/** Gregorian date of Lichun (start of spring, solar year), or null outside 1800–2100. */
export function lichunDate(year: number): MonthDay | null {
  if (!inTable(year)) return null;
  return { month: 2, day: Number(LICHUN[year - CHINESE_TABLE_FROM]) };
}

const FALLBACK_BOUNDARY: MonthDay = { month: 2, day: 4 };

/** Year whose animal/element applies to a birth date (Lunar New Year boundary). */
export function chineseZodiacYear(day: number, month: number, year: number): number {
  const boundary = lunarNewYearDate(year) ?? FALLBACK_BOUNDARY;
  if (!isBefore(month, day, boundary)) return year;
  return year === 1 ? -1 : year - 1;
}

/** Solar year for BaZi pillars and Kua (Lichun boundary). */
export function solarTermYear(day: number, month: number, year: number): number {
  const boundary = lichunDate(year) ?? FALLBACK_BOUNDARY;
  if (!isBefore(month, day, boundary)) return year;
  return year === 1 ? -1 : year - 1;
}

/** Historical year (-100 = 100 BC) to astronomical year (-99). */
export const toAstronomicalYear = (year: number): number => (year < 0 ? year + 1 : year);

const mod = (a: number, n: number) => ((a % n) + n) % n;

export const ZODIAC_ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'] as const;
export const STEM_ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;

/** 0-based Heavenly Stem (0 = Jia) and Earthly Branch (0 = Zi / Rat) of a year. */
export function stemBranchIndex(year: number): { stem: number; branch: number } {
  const y = toAstronomicalYear(year);
  return { stem: mod(y - 4, 10), branch: mod(y - 4, 12) };
}

/** Animal and element shown on the zodiac card for a birth date. */
export function chineseSignFor(day: number, month: number, year: number): { sign: string; element: string; zodiacYear: number } {
  const zodiacYear = chineseZodiacYear(day, month, year);
  const { stem, branch } = stemBranchIndex(zodiacYear);
  return { sign: ZODIAC_ANIMALS[branch], element: STEM_ELEMENTS[Math.floor(stem / 2)], zodiacYear };
}

/**
 * Day of week (0 = Sunday) for a date as historians write it: Julian calendar
 * before 15 Oct 1582, Gregorian after, BCE years in historical numbering.
 * `new Date(y, m, d)` cannot do this: it maps years 0–99 to 1900–1999 and
 * treats every date as Gregorian.
 */
export function historicalWeekday(day: number, month: number, year: number): number {
  const y = toAstronomicalYear(year);
  const julian = y < 1582 || (y === 1582 && (month < 10 || (month === 10 && day < 15)));
  const a = Math.floor((14 - month) / 12);
  const Y = y + 4800 - a;
  const M = month + 12 * a - 3;
  const jdn = julian
    ? day + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - 32083
    : day + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045;
  return mod(jdn + 1, 7);
}
