/**
 * Dumps the full Suzanne White verdict matrix (144 subject texts × 144 partner
 * combined signs) produced by the app's real classifier, as JSON to stdout.
 * Used to diff classifier changes: `npx tsx scripts/snapshot-sw-matrix.ts > a.json`.
 */
import { NEW_ASTROLOGY_DATA } from "../src/lib/new-astrology";
import { classifySuzanneWhiteMentions } from "../src/lib/compatibility-engine";
const W = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const A = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
const out: Record<string, string> = {};
for (const subject of Object.keys(NEW_ASTROLOGY_DATA).sort()) {
  const text = (NEW_ASTROLOGY_DATA as Record<string, { compatibilities?: string }>)[subject].compatibilities ?? "";
  for (const w of W) for (const a of A) {
    const v = classifySuzanneWhiteMentions(text, `${w}/${a}`, w, a);
    out[`${subject} x ${w}/${a}`] = `${v.combined[0]}${v.western[0]}${v.animal[0]}`;
  }
}
console.log(JSON.stringify(out));
