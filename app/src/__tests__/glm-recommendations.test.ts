import { describe, it, expect } from "vitest";
import {
  ZODIAC_SCALE,
  chineseZodiacRelation,
  johariRelation,
  classifySuzanneWhiteMentions,
  normalizeSuzanneWhiteText,
  buildSoulVitals,
  generateSoulResonance,
  psychomatrixLineDeltas,
} from "@/lib/compatibility-engine";
import { sanitizeBirthDate, hasCompleteBirthDate } from "@/lib/wikipedia-client";
import {
  buildPersonalYearDualEssenceSynthesis,
  determineShape,
  HISTORICAL_CASE_LIBRARY,
} from "@/lib/numerology/personal-year-synthesis";
import { computeRawPersonalYear, computeRawPersonalYearClassic } from "@/lib/numerology/personal-year-full";
import { lookupCompound } from "@/lib/numerology/chaldean-pyn-compounds";
import { NEW_ASTROLOGY_DATA } from "@/lib/new-astrology";

const ANIMALS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];

describe("Chinese zodiac relations", () => {
  const SECRET = ["Rat-Ox", "Tiger-Pig", "Rabbit-Dog", "Dragon-Rooster", "Snake-Monkey", "Horse-Goat"];
  const HARM = ["Rat-Goat", "Ox-Horse", "Tiger-Snake", "Rabbit-Dragon", "Monkey-Pig", "Rooster-Dog"];
  const key = (a: string, b: string) => [a, b].sort((x, y) => ANIMALS.indexOf(x) - ANIMALS.indexOf(y)).join("-");
  const canonical = (a: string, b: string) => {
    if (a === b) return "same";
    const d = (ANIMALS.indexOf(a) - ANIMALS.indexOf(b) + 12) % 12;
    if (SECRET.includes(key(a, b))) return "secret-friend";
    if (d === 4 || d === 8) return "trine";
    if (d === 6) return "six-clash";
    if (HARM.includes(key(a, b))) return "six-harm";
    return "neutral";
  };

  it("matches the canonical 六合 / 三合 / 六冲 / 相害 sets for all 144 pairs", () => {
    for (const a of ANIMALS) for (const b of ANIMALS) {
      expect(chineseZodiacRelation(a, b).relation, `${a}-${b}`).toBe(canonical(a, b));
    }
  });

  it("scores every pair from the shared scale, symmetrically", () => {
    for (const a of ANIMALS) for (const b of ANIMALS) {
      const r = chineseZodiacRelation(a, b);
      expect(r.score).toBe(ZODIAC_SCALE[r.relation]);
      expect(chineseZodiacRelation(b, a).score).toBe(r.score);
    }
    expect(chineseZodiacRelation("Snake", "Monkey").relation).toBe("secret-friend");
    expect(chineseZodiacRelation("Rat", "Pig").relation).toBe("neutral");
  });
});

describe("Johari relation", () => {
  it("never falls through to the unclassified branch for valid numbers", () => {
    for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) {
      expect(johariRelation(a, b).label).not.toBe("unclassified mixed field");
    }
  });
});

describe("Soul Resonance scoring", () => {
  const a = buildSoulVitals({ name: "A", day: 14, month: 3, year: 1990, gender: "female" });
  const b = buildSoulVitals({ name: "B", day: 2, month: 11, year: 1987, gender: "male" });

  it("romance uses destiny harmony (no double-counted psychic) and layer weights sum to 100", () => {
    const r = generateSoulResonance(a, b, 2026);
    const romanceTotal = r.layers.reduce((t, l) => t + l.domainWeights.romance, 0);
    expect(romanceTotal).toBe(100);
    const w = Object.fromEntries(r.layers.map((l) => [l.label, l.score]));
    const expected = Math.round(
      w["Psychic Vibration"] * 0.3 + w["Lo Shu Void Fill"] * 0.25 + w["Chinese Zodiac"] * 0.2 + w["Vedic Johari"] * 0.15 + w["Destiny Vibration"] * 0.1,
    );
    expect(r.domains.romance).toBe(expected);
  });

  it("willpower uses the numeric delta, not the display string", () => {
    const d = psychomatrixLineDeltas(a, b);
    expect(typeof d.willpower).toBe("number");
    expect(psychomatrixLineDeltas(b, a).willpower).toBe(-d.willpower);
  });

  it("fills famous twins inside the engine", () => {
    const r = generateSoulResonance(a, b, 2026);
    expect(Array.isArray(r.famousTwins)).toBe(true);
    expect(r.famousTwins.length).toBeGreaterThan(0);
  });
});

describe("Suzanne White classifier", () => {
  const text = (k: string) => (NEW_ASTROLOGY_DATA as Record<string, { compatibilities: string }>)[k].compatibilities;

  it("doesn't read 'Rat' inside exasperate / frustrate", () => {
    // "Goats in general exasperate you" — about Goats, not Rats.
    expect(classifySuzanneWhiteMentions(text("Cancer/Ox"), "Leo/Rat", "Leo", "Rat").animal).toBe("unstated");
    // "...Libra/Rabbits, as their reticence will frustrate you."
    expect(classifySuzanneWhiteMentions(text("Capricorn/Rooster"), "Leo/Rat", "Leo", "Rat").animal).toBe("unstated");
  });

  it("normalises 'Capricorn Roosters' to the combined sign", () => {
    expect(normalizeSuzanneWhiteText("or Capricorn Roosters (born")).toContain("capricorn/roosters");
    expect(normalizeSuzanneWhiteText("Leo-the Dog")).toBe("leo/dog");
    expect(classifySuzanneWhiteMentions(text("Libra/Rabbit"), "Capricorn/Rooster", "Capricorn", "Rooster").combined).toBe("avoid");
  });

  it("sees every mention in a sentence, not just the first", () => {
    for (const s of [
      "You get on especially well with Leo/Dogs and many others, but stay away from Leo/Dogs who gamble.",
      "You'll find happiness with Leo/Dogs; avoid Leo/Dogs who gamble.",
    ]) {
      expect(classifySuzanneWhiteMentions(s, "Leo/Dog", "Leo", "Dog").combined, s).toBe("mixed");
    }
    // a marker after the mention still counts when nothing precedes it
    expect(classifySuzanneWhiteMentions("Leo/Dogs are a good match for you.", "Leo/Dog", "Leo", "Dog").combined).toBe("positive");
  });

  it("doesn't treat a generic 'too <word>' as a caution", () => {
    const v = classifySuzanneWhiteMentions("Aries/Rats are too good to miss.", "Aries/Rat", "Aries", "Rat");
    expect(v.combined).toBe("unstated");
    const w = classifySuzanneWhiteMentions("Aries/Rats are too bossy for you.", "Aries/Rat", "Aries", "Rat");
    expect(w.combined).toBe("avoid");
  });
});

describe("Wikipedia birth dates", () => {
  it("never invents 1 January for year-only data", () => {
    expect(sanitizeBirthDate(1643, null, null)).toEqual({ year: 1643, month: null, day: null });
    expect(hasCompleteBirthDate({ found: true, birthYear: 1643, birthMonth: null, birthDay: null })).toBe(false);
    expect(hasCompleteBirthDate({ found: true, birthYear: 1643, birthMonth: 1, birthDay: 4 })).toBe(true);
  });

  it("rejects out-of-range values", () => {
    expect(sanitizeBirthDate(2001, 2, 29).day).toBeNull();
    expect(sanitizeBirthDate(2000, 2, 29).day).toBe(29);
    expect(sanitizeBirthDate(1990, 13, 1).month).toBeNull();
    expect(sanitizeBirthDate(3000, 1, 1).year).toBeNull();
  });
});

describe("Personal Year synthesis", () => {
  const red = (n: number) => {
    while (n > 9 && ![11, 22, 33].includes(n)) n = String(n).split("").reduce((t, d) => t + +d, 0);
    return n;
  };
  const build = (d: number, m: number, y: number) => {
    const dr = computeRawPersonalYear(d, m, y);
    const cr = computeRawPersonalYearClassic(d, m, y);
    return buildPersonalYearDualEssenceSynthesis({
      birthDay: d, birthMonth: m, birthYear: 1985, targetYear: y,
      directRaw: dr, directYear: red(dr), directCompound: lookupCompound(dr),
      classicRaw: cr, classicYear: red(cr), classicCompound: lookupCompound(cr),
    });
  };

  it("produces all four shapes and no fixed opener across a year of birthdays", () => {
    const shapes = new Set<string>();
    const openers = new Set<string>();
    for (let m = 1; m <= 12; m++) for (let d = 1; d <= 28; d += 3) {
      const r = build(d, m, 2026);
      shapes.add(r.shape);
      openers.add(r.wovenSynthesis.split("\n\n")[1]);
      expect(r.synthesisText).not.toMatch(/PROBABILITY MAP|outcome probability/);
    }
    expect([...shapes].sort()).toEqual(["coronation", "ordeal", "quiet", "threshold"]);
    expect(openers.size).toBeGreaterThan(20);
  });

  it("ledger lists exactly the cases it counts and reports a real base rate", () => {
    const r = build(6, 1, 2026);
    const L = r.precedentLedger;
    const counted = Object.values(L.outcomeCounts).reduce((t, n) => t + n, 0);
    expect(L.cases.length).toBe(counted);
    const exact = HISTORICAL_CASE_LIBRARY.filter((c) => c.direct === computeRawPersonalYear(6, 1, 2026) && c.classic === computeRawPersonalYearClassic(6, 1, 2026)).length;
    expect(L.exactPairCount).toBe(exact);
    expect(L.baseRate.birthdays).toBe(365);
    expect(L.baseRate.sharers).toBeGreaterThanOrEqual(1);
    expect(L.baseRate.oneIn).toBe(Math.round(365 / L.baseRate.sharers));
  });

  it("shape rule: dominance below 0.2 reads as quiet", () => {
    const flat = [0.5, 0.45, 0.42, 0.4].map((score) => ({ domain: "career" as const, score }));
    expect(determineShape("predominantly constructive", flat, "constructive")).toBe("quiet");
    const peaked = [0.9, 0.7, 0.6, 0.5].map((score) => ({ domain: "career" as const, score }));
    expect(determineShape("predominantly constructive", peaked, "constructive")).toBe("coronation");
    expect(determineShape("mixed ordeal-and-reward", peaked, "cautionary")).toBe("ordeal");
    expect(determineShape("threshold / transition", peaked, "threshold")).toBe("threshold");
  });
});
