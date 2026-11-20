import { describe, it, expect } from 'vitest';
import { calculatePsyche, calculateDestiny, calculateKua, calculateKuaRaw, generateLoShuData } from '@/lib/numerology';
import { getChineseZodiacSign, getWesternZodiacSign, getWesternCusp } from '@/lib/astrology';
import { personalNumbers } from '@/components/profile-generator/today-card';

describe('core numbers', () => {
  it('psychic number reduces the birth day', () => {
    expect(calculatePsyche(8)).toBe(8);
    expect(calculatePsyche(29)).toBe(2);
    expect(calculatePsyche(19)).toBe(1);
  });
  it('destiny (life path) sums all digits', () => {
    expect(calculateDestiny(8, 9, 1993)).toBe(3); // 8+9+1+9+9+3 = 39 -> 12 -> 3
    expect(calculateDestiny(1, 1, 2000)).toBe(4);
  });
});

describe('Kua', () => {
  it('uses the 4 Feb solar boundary', () => {
    expect(calculateKua(1990, 2, 3, 'male')).toBe(calculateKua(1989, 6, 1, 'male'));
  });
  it('applies the Rule of 5', () => {
    // male 1995: 10 - (9+5 -> 5) = 5 -> 2
    expect(calculateKuaRaw(1995, 6, 1, 'male')).toBe(5);
    expect(calculateKua(1995, 6, 1, 'male')).toBe(2);
  });
  it('post-2000 formulas', () => {
    expect(calculateKua(2001, 6, 1, 'male')).toBe(8); // 9 - 1
    expect(calculateKua(2001, 6, 1, 'female')).toBe(7); // 6 + 1
  });
  it('selects the special 5 attribute set when the raw Kua is 5', () => {
    const d = generateLoShuData({ name: 'X', day: 1, month: 6, year: 1995, gender: 'male' } as any);
    expect(d.kuaNum).toBe(2);
  });
});

describe('Lo Shu grid', () => {
  it('counts birth digits plus compound digits', () => {
    const d = generateLoShuData({ name: 'X', day: 8, month: 9, year: 1993, gender: 'male' } as any);
    // digits 8,9,1,9,9,3 + compound 39 -> 3,9
    expect(d.numberCounts['9']).toBe(4);
    expect(d.numberCounts['3']).toBe(2);
    expect(d.numberCounts['8']).toBe(1);
  });
});

describe('Chinese zodiac', () => {
  it('uses the lunar table on exact boundary days', () => {
    // 1990 Lunar New Year: 27 Jan 1990
    expect(getChineseZodiacSign(26, 1, 1990).sign).toBe('Snake');
    expect(getChineseZodiacSign(27, 1, 1990).sign).toBe('Horse');
    expect(getChineseZodiacSign(8, 9, 1993).sign).toBe('Rooster');
  });
  it('does not depend on the device time zone', () => {
    const tz = process.env.TZ;
    process.env.TZ = 'America/Los_Angeles';
    expect(getChineseZodiacSign(26, 1, 1990).sign).toBe('Snake');
    process.env.TZ = tz;
  });
  it('falls back to the solar new year outside the table', () => {
    expect(getChineseZodiacSign(15, 6, 1900).sign).toBe('Rat');
    expect(getChineseZodiacSign(15, 1, 1900).sign).toBe('Pig');
  });
});

describe('Western signs', () => {
  it('gets the sign and cusp', () => {
    expect(getWesternZodiacSign(8, 9)).toBe('Virgo');
    expect(getWesternCusp(8, 9)).toBeNull();
    expect(getWesternCusp(22, 9)).toBe('Libra');
    expect(getWesternCusp(23, 9)).toBe('Virgo');
  });
});

describe('Today card numbers', () => {
  it('matches the engine formula and keeps master numbers', () => {
    const n = personalNumbers(8, 9, new Date(2026, 9, 7));
    // PY = 8 + 9 + (2+0+2+6=10) = 27 -> 9; PM = 9+10 = 19 -> 10 -> 1; PD = 9+10+7 = 26 -> 8
    expect(n).toEqual({ personalYear: 9, personalMonth: 1, personalDay: 8 });
  });
});
