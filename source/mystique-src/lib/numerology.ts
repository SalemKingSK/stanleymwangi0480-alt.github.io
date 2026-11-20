// src/lib/numerology.ts
import type { AstroInsightInput, PersonalYearData } from '@/components/profile-generator/types';
import { 
  COMPOUND_NUMBER_MEANINGS, 
  DESTINY_NUMBER_MEANINGS, 
  KUA_DATA, 
  PSYCHIC_NUMBER_MEANINGS, 
  REPEATED_NUMBER_MEANINGS,
  lindaGoodmanMeanings
} from './numerology/data';
import { getActiveArrows } from './arrow-analysis';
import { solarTermYear } from './astrology/chinese-calendar-math';

// --- HELPER FUNCTIONS ---
// Sums only the actual digit characters (0-9) of a value, ignoring signs,
// decimals, or any other non-digit characters (e.g. the "-" in a BCE year
// like -551, or letters from a stray "NaN"/"Infinity"). This guarantees the
// result is always a finite, non-negative number, so callers below can never
// feed something back into themselves that fails to shrink.
const digitSum = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return String(Math.trunc(Math.abs(value)))
    .split('')
    .reduce((acc, ch) => {
      const d = ch.charCodeAt(0) - 48; // '0' === 48
      return d >= 0 && d <= 9 ? acc + d : acc;
    }, 0);
};

// Iterative (not recursive) so a bad input can never overflow the call stack -
// it just loops until it reaches a single digit or a safety cap is hit.
const reduceToSingleDigit = (n: number): number => {
  let value = digitSum(n);
  let guard = 0;
  while (value > 9 && guard < 1000) {
    value = digitSum(value);
    guard++;
  }
  return value;
};

const reduceOnce = (n: number): number => digitSum(n);

// --- CORE NUMBER CALCULATIONS ---
export const calculatePsyche = (day: number): number => {
    if (day > 9) {
         return reduceToSingleDigit(digitSum(day));
    }
    return day;
};

export const calculateDestiny = (day: number, month: number, year: number): number => {
  const sum = digitSum(day) + digitSum(month) + digitSum(year);
  return reduceToSingleDigit(sum);
};

/**
 * Kua number before the Rule of 5 is applied (1–9).
 *
 * The Feng Shui year starts at Lichun (3–5 Feb, from a 1800–2100 table), not
 * on a fixed 4 Feb. The year star cycles every 9 years for all centuries:
 *   male   = 11 − digital root of the year (mod 9, 0 → 9)
 *   female =  4 + digital root of the year (mod 9, 0 → 9)
 * This equals the familiar "last two digits" shortcut for 1900–2099 but stays
 * right for births before 1900 (the shortcut was wrong for e.g. Einstein, 1879).
 */
export const calculateRawKua = (year: number, month: number, day: number, gender: string): number => {
  const solarYear = solarTermYear(day, month, year);
  const root = reduceToSingleDigit(Math.abs(solarYear)) || 9;
  const raw = gender.toLowerCase() === 'male' ? (11 - root) % 9 : (4 + root) % 9;
  return raw <= 0 ? raw + 9 : raw;
};

/** Kua number with the Rule of 5 (male 5 → 2, female 5 → 8). */
export const calculateKua = (year: number, month: number, day: number, gender: string): number => {
  const raw = calculateRawKua(year, month, day, gender);
  if (raw !== 5) return raw;
  return gender.toLowerCase() === 'male' ? 2 : 8;
};

/**
 * KUA_DATA key for a birth: the Kua number, or '5_male' / '5_female' when the
 * raw Kua was 5. (The old check tested the digit sum of the calendar year, so
 * the two "5" readings could never appear.)
 */
export const getKuaLookupKey = (year: number, month: number, day: number, gender: string): string => {
  const raw = calculateRawKua(year, month, day, gender);
  if (raw === 5) return gender.toLowerCase() === 'male' ? '5_male' : '5_female';
  return String(raw);
};

// --- DATA INTERFACES ---
export interface ArrowData {
    id: string;
    name: string;
    description: string;
    numbers: number[];
    category?: string;
    type?: 'strength' | 'weakness' | 'shadow';
}

export interface NumerologyData {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  psycheNum: number;
  destinyNum: number;
  compoundNum: number | null;
  compoundMeaning: string | null;
  reducedCompoundNum: number | null;
  reducedCompoundMeaning: string | null;
  karmicFateNum: number | null;
  karmicFateMeaning: string | null;
  psychicMeaning: { title: string; description: string; };
  specialTraitMeaning: string | null;
  destinyMeaning: { title: string; description: string; };
  kuaNum: number;
  kuaAttributes: {
    element: string;
    group: string;
    trigram: string;
    lucky_colours: string[];
    directions: { [key: string]: string };
  };
  loShuGrid: (string | null)[][];
  numberCounts: { [key: string]: number };
  repeatedNumberMeanings: { [key: string]: string };
  arrowsOfStrength: ArrowData[];
  arrowsOfWeakness: ArrowData[];
  personalYears?: PersonalYearData[];
}

// --- MAIN GRID GENERATION FUNCTION ---
export const generateLoShuData = (input: AstroInsightInput): NumerologyData => {
  const { day, month, year, gender } = input;
  const psycheNum = calculatePsyche(day);
  const destinyNum = calculateDestiny(day, month, year);
  const kuaNum = calculateKua(year, month, day, gender);

  // --- LO SHU GRID COUNT CALCULATION ---
  // Layer 1: Birth digits (all non-zero digits from the full date string)
  const birthDigitsForGrid = (String(day) + String(month) + String(year))
    .split('')
    .map(d => parseInt(d, 10))
    .filter(d => d !== 0);

  // Layer 2: Main Compound Number digits only
  // Sum of all date digits. If 2-digit result, add each digit separately.
  // If 1-digit result, add it once.
  const birthDateSum = digitSum(day) + digitSum(month) + digitSum(year);
  const compoundDigitsForGrid = birthDateSum >= 10
    ? String(birthDateSum).split('').map(Number).filter(d => d !== 0)
    : birthDateSum > 0 ? [birthDateSum] : [];

  // Grid = birth digits + compound digits only
  // Psychic Number, Life Path, and Kua are intentionally excluded from grid display
  const allDigitsForGrid = [
    ...birthDigitsForGrid,    // Layer 1: raw birth digits
    ...compoundDigitsForGrid, // Layer 2: compound number digits (e.g. 17 → 1 and 7)
  ];

  const numberCounts: { [key: string]: number } = {};
  for (const digit of allDigitsForGrid) {
    if (digit > 0) numberCounts[digit] = (numberCounts[digit] || 0) + 1;
  }

  const gridContent: { [key: string]: string } = {};
  for (let i = 1; i <= 9; i++) {
    const digitStr = String(i);
    if (numberCounts[digitStr]) gridContent[digitStr] = digitStr.repeat(numberCounts[digitStr]);
  }

  const loShuGrid = [
    [gridContent['4'] || null, gridContent['9'] || null, gridContent['2'] || null],
    [gridContent['3'] || null, gridContent['5'] || null, gridContent['7'] || null],
    [gridContent['8'] || null, gridContent['1'] || null, gridContent['6'] || null],
  ];

  const compoundNum = (birthDateSum >= 10 && COMPOUND_NUMBER_MEANINGS[birthDateSum as keyof typeof COMPOUND_NUMBER_MEANINGS]) ? birthDateSum : null;
  const compoundMeaning = compoundNum ? COMPOUND_NUMBER_MEANINGS[compoundNum as keyof typeof COMPOUND_NUMBER_MEANINGS] : null;
  const firstReduction = reduceOnce(birthDateSum);
  let reducedCompoundNum: number | null = null;
  let reducedCompoundMeaning: string | null = null;
  if (firstReduction >= 10 && firstReduction !== birthDateSum && COMPOUND_NUMBER_MEANINGS[firstReduction as keyof typeof COMPOUND_NUMBER_MEANINGS]) {
      reducedCompoundNum = firstReduction;
      reducedCompoundMeaning = COMPOUND_NUMBER_MEANINGS[firstReduction as keyof typeof COMPOUND_NUMBER_MEANINGS];
  }

  const rawKarmicSum = day + month + year;
  const karmicCandidate = digitSum(rawKarmicSum);
  const karmicFateNum = (karmicCandidate >= 10 && lindaGoodmanMeanings[karmicCandidate]) ? karmicCandidate : null;
  const karmicFateMeaning = karmicFateNum ? lindaGoodmanMeanings[karmicFateNum] : null;

  const birthDateString = `${day}-${month}-${year}`;
  const allActiveArrows = getActiveArrows(birthDateString, numberCounts);

  const arrowsOfStrength: ArrowData[] = allActiveArrows
    .filter(s => s.definition.state === 'full')
    .map(s => ({
      id: s.definition.id,
      name: s.definition.name,
      description: s.definition.coreTrait,
      numbers: s.definition.numbers,
      category: s.definition.type === 'bridge' ? 'Minor Bridge' : s.definition.type === 'diagonal' && (s.definition.id === 'prosperity' || s.definition.id === 'stability-emotional') ? 'Secondary Plane' : 'Primary Plane',
      type: 'strength'
    }));

  const arrowsOfWeakness: ArrowData[] = allActiveArrows
    .filter(s => s.definition.state === 'empty')
    .map(s => ({
      id: s.definition.id,
      name: s.definition.name,
      description: s.definition.coreTrait,
      numbers: s.definition.numbers,
      category: 'Deficiency',
      type: 'shadow'
    }));

  const kuaLookupKey = getKuaLookupKey(year, month, day, gender);
  const kuaAttributes = KUA_DATA[kuaLookupKey] || {};
  const psychicMeaning = PSYCHIC_NUMBER_MEANINGS[psycheNum as keyof typeof PSYCHIC_NUMBER_MEANINGS] || { title: 'Unknown', description: 'No meaning available.'};
  const destinyMeaning = DESTINY_NUMBER_MEANINGS[destinyNum as keyof typeof DESTINY_NUMBER_MEANINGS] || { title: 'Unknown', description: 'No meaning available.'};
  const specialTraitMeaning = (day >= 10 && day <= 31) ? (COMPOUND_NUMBER_MEANINGS[day as keyof typeof COMPOUND_NUMBER_MEANINGS] || null) : null;

  return {
    birthDay: day,
    birthMonth: month,
    birthYear: year,
    psycheNum,
    destinyNum,
    kuaNum,
    loShuGrid,
    numberCounts,
    repeatedNumberMeanings: REPEATED_NUMBER_MEANINGS,
    compoundNum,
    compoundMeaning,
    reducedCompoundNum,
    reducedCompoundMeaning,
    karmicFateNum,
    karmicFateMeaning,
    psychicMeaning,
    specialTraitMeaning,
    destinyMeaning,
    arrowsOfStrength,
    arrowsOfWeakness,
    kuaAttributes: kuaAttributes || { directions: {} }
  };
};