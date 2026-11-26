// @vitest-environment happy-dom
/**
 * The on-device handbook: the splitter (with made-up lines laid out like the
 * book's PDF — no book text is kept in the repo) and the Oracle layers.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { parseHandbook, toParagraphs, handbookSummary } from "@/lib/handbook/parse";
import { itemsToLines } from "@/lib/handbook/extract";
import { appAnimal, birthSeason, pairKey, type PdfLine } from "@/lib/handbook/types";

vi.mock("framer-motion", () => ({
  motion: new Proxy({}, { get: () => (p: { children?: React.ReactNode }) => React.createElement("div", null, p.children) }),
  AnimatePresence: (p: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, p.children),
}));

// ── A fake book laid out like the real PDF ─────────────────────────────────
class Book {
  lines: PdfLine[] = [];
  page = 1;
  y = 800;
  private put(size: number, text: string, x1 = 570, gapBefore = 0) {
    this.y -= gapBefore;
    if (this.y < 30) { this.page++; this.y = 800; }
    this.lines.push({ page: this.page, y: this.y, x0: 15, x1, size, text });
    this.y -= size === 12 ? 21.5 : size * 1.6;
  }
  h1(t: string) { this.put(24, t, 300, 10); }
  h2(t: string) { this.put(18, t, 300, 30); }
  h3(t: string) { this.put(14, t, 200, 25); }
  /** A paragraph: full lines, then a short last line. */
  p(...lines: string[]) {
    lines.forEach((l, i) => this.put(12, l, i === lines.length - 1 ? 300 : 570, i === 0 ? 12 : 0));
  }
  raw(t: string, x0 = 57) { this.lines.push({ page: this.page, y: (this.y -= 30), x0, x1: 200, size: 12, text: t }); }
  newPage() { this.page++; this.y = 800; }
}

const ELEMENTS = ["Metal", "Water", "Wood", "Fire", "Earth"];
const BOOK_ANIMALS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Sheep", "Monkey", "Rooster", "Dog", "Boar"];
const WESTERN = ["Sagittarius", "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio"];

function fakeChapter(b: Book, n: number, name: string) {
  b.newPage();
  b.h1(String(n));
  b.h1(`The ${["First", "Second"][n - 1] ?? "Next"} Sign of the Lunar Cycle`);
  b.h1(`The ${name}`);
  b.raw(`c0${n}g002_calligraphy.tif`);
  b.p("Poem line that must be skipped.");
  b.h2(`The ${name} Personality`);
  b.p(`Personality one of ${name} runs over a full line and`, "ends here.");
  b.h2(`The ${name} Child`);
  b.p(`Child text of ${name}.`);
  b.h2(`The Five Different ${name}s`);
  for (const e of ELEMENTS) { b.h3(`${e} ${name}—1900, 1960, 2020`); b.p(`${e} text for the ${name} is a do-`, "gooder and magnanimous", "—sometimes."); }
  b.h2(`Compatibility and Conflict for the ${name}`);
  b.p(`Intro of compat for ${name}.`);
  b.raw("Triangle1.eps"); b.raw(`Triangle of Affinity for the ${name}`, 45);
  b.raw("CircleofConflict2010.eps"); b.raw("Circle of Conflict", 45);
  for (const a of BOOK_ANIMALS) { b.h3(a); b.p(`${name} with ${a} entry.`); }
  b.h2(`The ${name} and Its Ascendant Relationships`);
  b.p("Ascendant intro.");
  for (const a of BOOK_ANIMALS) { b.h3(`1 a.m. to 3 a.m. = Hours of the ${a}`); b.p(`${name} rising ${a}.`); }
  b.h2("When Moon Signs Meet Sun Signs");
  b.p("Moon intro.");
  for (const w of WESTERN) { b.h3(`${w}: November 22 to December 21`); b.p(`${w} ${name} = Fire + Positive Water`); b.p(`${w} meets ${name}.`); }
  b.h2(`The Seasons of the ${name}`);
  for (const s of ["Spring", "Summer", "Autumn", "Winter"]) { b.h3(s); b.p(`${s} ${name} text.`); }
  b.h2(`Famous People Born in the Year of the ${name}`);
  for (const e of ELEMENTS) { b.h3(e); b.p(`${e} Person A`); b.p(`${e} Person B`); }
}

function fakeBook(): PdfLine[] {
  const b = new Book();
  b.h1("CONTENTS");
  b.p("3. The Five Different Rats");
  b.p("5. The Rat and Its Ascendant Relationships");
  fakeChapter(b, 1, "Rat");
  fakeChapter(b, 2, "Sheep");
  b.newPage();
  b.h1("13");
  b.h1("Choosing Wedding Dates");
  b.p("Not part of any chapter.");
  b.newPage();
  b.h1("14");
  b.h1("Relationship Combinations");
  b.p("Relationship intro.");
  b.h2("The Rat’s Relationships");
  b.h3("Rat + Sheep");
  b.p("Rat and Sheep together.");
  b.h2("The Sheep’s Relationships");
  b.h3("Sheep + Rat");
  b.p("Sheep and Rat together.");
  b.newPage();
  b.h1("Index");
  b.p("Rat, 1, 2, 3");
  // Body lines dominate the real book; make the fake one look the same.
  return b.lines;
}

describe("handbook splitter", () => {
  const hb = parseHandbook(fakeBook(), { file: "my.pdf", pages: 9 });

  it("finds each animal chapter, mapping the book's names to the app's", () => {
    expect(Object.keys(hb.chapters).sort()).toEqual(["Goat", "Rat"]);
    expect(hb.chapters.Goat!.bookName).toBe("Sheep");
    expect(handbookSummary(hb)).toEqual({ chapters: 2, complete: 2, pairs: 2 });
  });

  it("skips the chapter opening and keeps each section verbatim", () => {
    const rat = hb.chapters.Rat!;
    expect(JSON.stringify(rat)).not.toContain("Poem line");
    expect(rat.personality!.intro).toBe("Personality one of Rat runs over a full line and ends here.");
    expect(rat.child!.intro).toBe("Child text of Rat.");
    expect(rat.five!.items.map((i) => i.key)).toEqual(ELEMENTS);
    expect(rat.five!.items[0].heading).toBe("Metal Rat—1900, 1960, 2020");
    // Line-end hyphens and dashes join without a space.
    expect(rat.five!.items[0].text).toBe("Metal text for the Rat is a do-gooder and magnanimous—sometimes.");
  });

  it("drops figure files and captions and keys partners by app name", () => {
    const c = hb.chapters.Rat!.compat!;
    expect(c.intro).toBe("Intro of compat for Rat.");
    expect(c.items).toHaveLength(12);
    expect(c.items.find((i) => i.key === "Goat")!.heading).toBe("Sheep");
    expect(c.items.find((i) => i.key === "Pig")!.text).toBe("Rat with Boar entry.");
    expect(JSON.stringify(c)).not.toMatch(/eps|Triangle of Affinity|Circle of Conflict/);
  });

  it("reads ascendants, moon signs (with their formula), seasons and famous people", () => {
    const rat = hb.chapters.Rat!;
    expect(rat.ascendant!.items.map((i) => i.key)).toContain("Pig");
    expect(rat.ascendant!.intro).toBe("Ascendant intro.");
    const sag = rat.moon!.items.find((i) => i.key === "Sagittarius")!;
    expect(sag.formula).toBe("Sagittarius Rat = Fire + Positive Water");
    expect(sag.text).toBe("Sagittarius meets Rat.");
    expect(rat.seasons!.items.map((i) => i.key)).toEqual(["Spring", "Summer", "Autumn", "Winter"]);
    expect(rat.famous!.items[0]).toMatchObject({ key: "Metal", text: "Metal Person A\nMetal Person B" });
  });

  it("reads the pairings from each side and stops at the index", () => {
    expect(hb.pairs[pairKey("Rat", "Goat")].text).toBe("Rat and Sheep together.");
    expect(hb.pairs[pairKey("Goat", "Rat")].text).toBe("Sheep and Rat together.");
    expect(JSON.stringify(hb)).not.toContain("Rat, 1, 2, 3");
  });

  it("joins a paragraph across a page break, but not a finished one", () => {
    const ctx = { level: () => 0 as const, lineGap: 21.5, right: 575, left: 15 };
    const L = (page: number, y: number, text: string, x1 = 570): PdfLine => ({ page, y, x0: 15, x1, size: 12, text });
    expect(toParagraphs([L(1, 40, "the end of a page that"), L(2, 800, "continues here.")], ctx)).toEqual(["the end of a page that continues here."]);
    expect(toParagraphs([L(1, 40, "A finished paragraph.", 200), L(2, 800, "New one.")], ctx)).toEqual(["A finished paragraph.", "New one."]);
    expect(toParagraphs([L(1, 100, "One."), L(1, 60, "Two.")], ctx)).toEqual(["One.", "Two."]);
  });
});

describe("handbook helpers", () => {
  it("maps names, seasons and pdf.js items", () => {
    expect(appAnimal("Boar")).toBe("Pig");
    expect(appAnimal("Oxen")).toBe("Ox");
    expect(appAnimal("Rats")).toBe("Rat");
    expect(appAnimal("Spring")).toBeNull();
    expect(birthSeason(3, 2)).toBe("Winter");
    expect(birthSeason(4, 2)).toBe("Spring");
    expect(birthSeason(15, 12)).toBe("Winter");
    expect(birthSeason(7, 8)).toBe("Autumn");
    const lines = itemsToLines(3, [
      { str: "Hello ", transform: [12, 0, 0, 12, 15, 500], width: 30, height: 12 },
      { str: "world", transform: [12, 0, 0, 12, 45, 500], width: 30, height: 12, hasEOL: true },
      { str: "", transform: [12, 0, 0, 12, 15, 480], width: 0, height: 12, hasEOL: true },
      { str: "Next", transform: [18, 0, 0, 18, 15, 450], width: 40, height: 18 },
    ]);
    expect(lines).toEqual([
      { page: 3, y: 500, x0: 15, x1: 75, size: 12, text: "Hello world" },
      { page: 3, y: 450, x0: 15, x1: 55, size: 18, text: "Next" },
    ]);
  });
});

describe("handbook in the Animal Oracle and the Curriculum", () => {
  beforeEach(() => localStorage.clear());

  it("hides handbook fields until a book is loaded", async () => {
    const { FIELD_BY_ID, fieldAvailable } = await import("@/lib/curriculum/catalogue");
    const { __setHandbookForTest } = await import("@/lib/handbook/store");
    const f = FIELD_BY_ID.get("astro.hb.moon")!;
    __setHandbookForTest(null);
    expect(fieldAvailable(f)).toBe(false);
    __setHandbookForTest(parseHandbook(fakeBook(), { file: "my.pdf", pages: 9 }));
    expect(fieldAvailable(f)).toBe(true);
    const chart = { day: 10, month: 12, year: 1984, insight: { sign: "Rat", element: "Wood", western_sign: "Sagittarius" } } as never;
    expect(f.variants!(chart)[0]).toBe("Sagittarius Rat");
    expect(FIELD_BY_ID.get("astro.hb.season")!.variants!(chart)[0]).toBe("Winter Rat");
    expect(FIELD_BY_ID.get("astro.hb.compat")!.variants!(chart)).toContain("Rat with Pig");
    __setHandbookForTest(null);
  });

  it("shows the handbook layers with the user's own items first", async () => {
    const { AstroDisplay } = await import("@/components/profile-generator/astro-display");
    const { __setHandbookForTest } = await import("@/lib/handbook/store");
    __setHandbookForTest(parseHandbook(fakeBook(), { file: "my.pdf", pages: 9 }));
    const div = document.createElement("div");
    document.body.appendChild(div);
    const root = createRoot(div);
    const insight = {
      name: "T", western_sign: "Aries", sign: "Rat", element: "Wood", day: 1, month: 4, year: 1984, gender: "female",
      new_astrology_sign: "Aries/Rat", zodiacData: { introduction: "Intro", elements: { Wood: "App wood text" }, compatibilities: { Ox: "App ox" }, futures: {} }, signData: {},
    };
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    await act(async () => root.render(<AstroDisplay insight={insight as never} />));
    expect(div.textContent).toContain("Moon Signs Meet Sun Signs");
    expect(div.textContent).toContain("Loaded on this device");

    const layer = (title: string) => Array.from(div.querySelectorAll<HTMLButtonElement>(".astro-acc-header")).find((b) => b.textContent!.includes(title))!;
    await act(async () => layer("Wood Influence").click());
    const five = div.querySelector('[data-handbook="five"]')!;
    const triggers = Array.from(five.querySelectorAll("[data-study-open]")).map((t) => t.getAttribute("data-study-open"));
    expect(triggers[0]).toBe("astro.hb.five|Wood Rat");

    await act(async () => layer("Moon Signs").click());
    const moonTriggers = Array.from(div.querySelectorAll("[data-study-open^='astro.hb.moon|']")).map((t) => t.getAttribute("data-study-open"));
    expect(moonTriggers[0]).toBe("astro.hb.moon|Aries Rat");
    expect(moonTriggers).toHaveLength(12);

    await act(async () => layer("Compatibility Bonds").click());
    expect(div.querySelector("[data-study-open*='astro.hb.compat|Rat with Ox']")).toBeTruthy();
    await act(async () => root.unmount());
    __setHandbookForTest(null);
  });

  it("offers only the loader when no book is loaded", async () => {
    const { AstroDisplay } = await import("@/components/profile-generator/astro-display");
    const div = document.createElement("div");
    const root = createRoot(div);
    const insight = { name: "T", western_sign: "Aries", sign: "Rat", element: "Wood", month: 4, year: 1984, gender: "female", new_astrology_sign: "Aries/Rat", zodiacData: {}, signData: {} };
    await act(async () => root.render(<AstroDisplay insight={insight as never} />));
    expect(div.textContent).toContain("Load my Handbook");
    expect(div.textContent).not.toContain("Layer 7");
    await act(async () => root.unmount());
  });
});
