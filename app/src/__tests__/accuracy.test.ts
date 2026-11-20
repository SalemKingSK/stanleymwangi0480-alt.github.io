import { describe, it, expect } from 'vitest';
import { getChineseZodiacSign, getWesternZodiacSign, getWesternCusp } from '@/lib/astrology';
import { calculateKua } from '@/lib/numerology';
import { getSexagenaryAnalysis } from '@/lib/astrology/sexagenary';
import { getBirthDayOfWeek } from '@/lib/astrology/birth-day-of-week';
import { getDoubleAnimal } from '@/lib/astrology/ba-zi-double-animal';

// Real people, checked against published Lunar New Year / Li Chun tables,
// solar ingress times and the Julian calendar. The full sweep (1,320 people,
// every Jan/Feb day 1800–2099) is `npm run validate:accuracy`.
describe('celebrity accuracy regressions', () => {
  it('Chinese sign changes at Lunar New Year, also outside 1915–2036', () => {
    expect(getChineseZodiacSign(12, 2, 1809)).toEqual({ sign: 'Dragon', element: 'Earth' }); // Darwin & Lincoln (LNY 14 Feb 1809)
    expect(getChineseZodiacSign(30, 1, 1882).sign).toBe('Snake'); // FDR (LNY 18 Feb 1882)
  });
  it('stem-branch year follows the Chinese year', () => {
    expect(getSexagenaryAnalysis(1945, 1, 7).name).toBe('Wood Monkey'); // Raila Odinga
  });
  it('Ba-Zi year animal changes at Li Chun', () => {
    expect(getDoubleAnimal(20, 1, 1985).yearAnimal).toBe('Rat');
  });
  it('Kua is right before 1900', () => {
    expect(calculateKua(1879, 3, 14, 'male')).toBe(4); // Einstein
  });
  it('weekday uses the Julian calendar before 1582', () => {
    expect(getBirthDayOfWeek(15, 2, 1564).dayName).toBe('Tuesday'); // Galileo
  });
  it('sun sign uses the real solstice when the year is known', () => {
    expect(getWesternZodiacSign(21, 6, 1907)).toBe('Gemini'); // solstice fell on 22 Jun everywhere
    expect(getWesternZodiacSign(21, 6)).toBe('Cancer');
    expect(getWesternCusp(8, 9, 1993)).toBeNull();
  });
});
