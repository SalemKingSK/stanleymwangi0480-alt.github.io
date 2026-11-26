// src/lib/astrology.ts
import { chineseSignFor } from './astrology/chinese-calendar-math';
import { sunSignsOnDate } from './astrology/sun-sign';
import type { AstroInsightOutput } from '@/components/profile-generator/types';
import { zodiacData } from './zodiac';
import { NEW_ASTROLOGY_DATA } from './new-astrology';


/**
 * Western sun sign. The fixed table is right for >99.9% of dates; pass the
 * birth year and the Sun's real position overrides it on the few days where
 * the table is wrong for that year (21 Jun / 23 Oct in 1903–1915, etc.).
 * Days where the Sun changed sign during the day keep the table answer —
 * `getWesternCusp` tells you the other possible sign.
 */
export const getWesternZodiacSign = (day: number, month: number, year?: number): string => {
  const table = westernSignByTable(day, month);
  if (!year || year < 1 || !Number.isFinite(year)) return table;
  const real = sunSignsOnDate(day, month, year);
  return real.length === 1 ? real[0] : real.includes(table) ? table : real[0];
};

/**
 * The neighbouring sign when a birthday sits on a cusp, or null.
 * With the birth year: exact — the Sun really changed sign during that calendar
 * day somewhere on Earth, so a birth time is needed to be sure.
 * Without it: within one day of the usual boundary (boundaries drift ±1 day).
 */
export const getWesternCusp = (day: number, month: number, year?: number): string | null => {
  if (year && year >= 1 && Number.isFinite(year)) {
    const real = sunSignsOnDate(day, month, year);
    if (real.length < 2) return null;
    const sign = getWesternZodiacSign(day, month, year);
    return real.find(s => s !== sign) ?? null;
  }
  const sign = westernSignByTable(day, month);
  const prev = new Date(Date.UTC(2001, month - 1, day - 1));
  const next = new Date(Date.UTC(2001, month - 1, day + 1));
  const before = westernSignByTable(prev.getUTCDate(), prev.getUTCMonth() + 1);
  const after = westernSignByTable(next.getUTCDate(), next.getUTCMonth() + 1);
  if (before !== sign) return before;
  if (after !== sign) return after;
  return null;
};

const westernSignByTable = (day: number, month: number): string => {
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  return "Capricorn";
};

/**
 * Chinese zodiac animal + element for a birth date. The year changes at Lunar
 * New Year (table for 1800–2100; Li Chun, 4 Feb, outside it). Dates are
 * compared as numbers, never as Date objects, so the device time zone can't
 * move the boundary.
 */
export const getChineseZodiacSign = (day: number, month: number, year: number) => {
  const { sign, element } = chineseSignFor(day, month, year);
  return { sign, element };
};

export async function getAstroInsight(input: { name: string; day: number; month: number; year: number; gender: string }): Promise<AstroInsightOutput> {
    const { year, month, day, name, gender } = input;
    
    const western_sign = getWesternZodiacSign(day, month, year);
    const { sign, element } = getChineseZodiacSign(day, month, year);
    
    // Data for the Chinese Zodiac sub-tabs
    const signDataForZodiac = zodiacData[sign as keyof typeof zodiacData] || {};
    
    // Data for the "New Astrology" combined sign modal
    const newAstrologySignKey = `${western_sign}/${sign}`;
    const signDataForNewAstrology = NEW_ASTROLOGY_DATA[newAstrologySignKey as keyof typeof NEW_ASTROLOGY_DATA] || {};

    return {
        name,
        western_sign,
        western_cusp: getWesternCusp(day, month, year),
        sign,
        element,
        day,
        month,
        year,
        gender,
        new_astrology_sign: newAstrologySignKey,
        zodiacData: signDataForZodiac,
        signData: signDataForNewAstrology,
    };
}
