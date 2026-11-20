/**
 * Sun-sign by real solar longitude, for the rare days where the fixed
 * calendar table is wrong for a given year (e.g. 21 Jun 1903–1915: the
 * solstice fell on 22 Jun everywhere on Earth, so those births are Gemini).
 *
 * Low-precision solar coordinates (Meeus, Astronomical Algorithms ch. 25):
 * ≈0.01° (~15 min of time) — ample for a sign that changes once a month.
 * No Date objects: day/month/year → Julian Day by arithmetic, so the result
 * never depends on the visitor's timezone.
 */

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] as const;
const rad = Math.PI / 180;

/** Julian Day at 0h UT of a Gregorian calendar date. */
function jd0(day: number, month: number, year: number): number {
  const a = Math.floor((14 - month) / 12), y = year + 4800 - a, m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  return jdn - 0.5;
}

/** Apparent geocentric ecliptic longitude of the Sun, degrees [0, 360). */
export function sunLongitude(jd: number): number {
  const T = (jd - 2451545) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * rad;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) + (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
  const omega = (125.04 - 1934.136 * T) * rad;
  const lon = L0 + C - 0.00569 - 0.00478 * Math.sin(omega);
  return ((lon % 360) + 360) % 360;
}

const signAtJd = (jd: number) => SIGNS[Math.floor(sunLongitude(jd) / 30)];

/**
 * Signs the Sun occupied at some moment of this calendar date in ANY time
 * zone (local midnight at UTC+14 to local 23:59 at UTC−12). One entry = the
 * sign is certain without a birth time; two = a cusp day.
 */
export function sunSignsOnDate(day: number, month: number, year: number): string[] {
  const start = jd0(day, month, year) - 14 / 24;
  const end = jd0(day, month, year) + 36 / 24 - 1 / 1440;
  return [...new Set([signAtJd(start), signAtJd(end)])];
}
