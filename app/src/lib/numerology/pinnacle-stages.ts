/**
 * Pinnacle & Challenge stages as the Numerology tab's "Pinnacles & Challenges"
 * section shows them (moved here so the Curriculum can list them too).
 */

function reduceNum(n: number): number {
  let val = Math.abs(n);
  // Check for a master number at EVERY step of the reduction, not just on the
  // original input — otherwise a value like 47 (4+7=11, then 1+1=2) blows
  // straight through the master number it passes through on its way down.
  // Standard practice: once an intermediate sum lands on 11, 22, or 33, the
  // reduction stops there.
  while (val > 9 && val !== 11 && val !== 22 && val !== 33) {
    val = String(val).split("").reduce((a, d) => a + +d, 0);
  }
  return val;
}

/** Strict single-digit reduction — never preserves master numbers.
 *  Used for challenge components so |diff| is always 0-9. */
function reduceStrict(n: number): number {
  let val = Math.abs(n);
  while (val > 9) val = String(val).split("").reduce((a, d) => a + +d, 0);
  return val;
}

/** One-pass digit sum — sums individual digits exactly once, no further reduction.
 *  e.g. 1970 → 17  (held at 17, never collapsed to 8)
 *       15   → 6   (single-pass, same as full reduce for two-digit numbers)
 */
function digitSumOnce(n: number): number {
  return String(Math.abs(n)).split("").reduce((a, c) => a + +c, 0);
}

// ─── Calculation ─────────────────────────────────────────────────────────────

export interface Stage {
  stage: number;
  label: string;
  ages: string;
  p: number;    // final reduced pinnacle
  c: number;    // final reduced challenge
  rawP: number; // raw compound sum for pinnacle
  active: boolean;
}

export function calcStages(lp: number, d: number, m: number, y: number): Stage[] {
  const firstEnd = 36 - lp;

  // Pure digit-by-digit component totals — one pass only, never over-reduced.
  // e.g. year 1970 → 1+9+7+0 = 17  (kept as 17, not collapsed to 8)
  //      day  15   → 1+5     =  6
  const M_total = digitSumOnce(m);
  const D_total = digitSumOnce(d);
  const Y_total = digitSumOnce(y);

  // Raw compound pinnacle sums — components added as-is, no pre-reduction
  const rawP1 = M_total + D_total;
  const rawP2 = D_total + Y_total;
  // P3: the Third Pinnacle is the 1st Pinnacle plus the 2nd Pinnacle, kept as
  // an unreduced compound sum — e.g. P1=17, P2=30 → 17+30=47 (NOT digit-summed
  // down to 8+3=11 first). The final single-digit/master-number value below
  // (p3 = reduceNum(47) = 11) still lands on the same master number as before;
  // only the *raw compound* shown to the person changes, from a bare "11" to
  // the correct "47/11".
  const rawP3 = rawP1 + rawP2;
  const rawP4 = M_total + Y_total;

  // Final master-number-aware single-digit values for description lookup
  const p1 = reduceNum(rawP1);
  const p2 = reduceNum(rawP2);
  const p3 = reduceNum(rawP3);
  const p4 = reduceNum(rawP4);

  // Challenges use strict single-digit reduction — master numbers (11,22,33)
  // are NOT preserved here, so absolute differences always stay 0–9.
  const dR = reduceStrict(D_total);
  const mR = reduceStrict(M_total);
  const yR = reduceStrict(Y_total);
  const c1 = Math.abs(dR - mR);
  const c2 = Math.abs(dR - yR);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(mR - yR);

  const age = new Date().getFullYear() - y;
  return [
    { stage: 1, label: "First Pinnacle",  ages: `0–${firstEnd}`,                 p: p1, c: c1, rawP: rawP1, active: age < firstEnd },
    { stage: 2, label: "Second Pinnacle", ages: `${firstEnd}–${firstEnd + 9}`,   p: p2, c: c2, rawP: rawP2, active: age >= firstEnd && age < firstEnd + 9 },
    { stage: 3, label: "Third Pinnacle",  ages: `${firstEnd+9}–${firstEnd + 18}`, p: p3, c: c3, rawP: rawP3, active: age >= firstEnd + 9 && age < firstEnd + 18 },
    { stage: 4, label: "Fourth Pinnacle", ages: `${firstEnd + 18}+`,              p: p4, c: c4, rawP: rawP4, active: age >= firstEnd + 18 },
  ];
}

