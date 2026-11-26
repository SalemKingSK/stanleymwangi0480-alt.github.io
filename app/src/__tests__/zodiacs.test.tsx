// @vitest-environment happy-dom
/**
 * The "Chinese Zodiacs" book, read on the device: the splitter (with made-up
 * lines laid out like the book's PDF — no book text in the repo), the
 * Foundations and the animal chapters in the Oracle, and the Curriculum fields.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { animalMoon, animalPolarity, looksLikeZodiacs, parseZodiacs, zodiacsSummary } from "@/lib/handbook/zodiacs";
import type { PdfLine } from "@/lib/handbook/types";

vi.mock("framer-motion", () => ({
  motion: new Proxy({}, { get: () => (p: { children?: React.ReactNode }) => React.createElement("div", null, p.children) }),
  AnimatePresence: (p: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, p.children),
}));

class Book {
  lines: PdfLine[] = [];
  page = 1;
  y = 800;
  private put(size: number, text: string, x1: number, gap: number, x0 = 50) {
    this.y -= gap;
    if (this.y < 40) { this.page++; this.y = 800; }
    this.lines.push({ page: this.page, y: this.y, x0, x1, size, text });
    this.y -= 16;
  }
  h(size: number, t: string) { this.put(size, t, 300, 22); }
  /** A paragraph: full lines, then a short last line. */
  p(...ls: string[]) { ls.forEach((l, i) => this.put(12, l, i === ls.length - 1 ? 260 : 540, i === 0 ? 6 : 0)); }
  /** Lines set one per line (a list), no gaps. */
  list(...ls: string[]) { ls.forEach((l) => this.put(12, l, 200, 0)); }
  bullet(t: string) { this.put(12, `• ${t}`, 400, 6, 70); }
}

const ANIMALS = ["Rat", "Ox", "Tiger", "Hare", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
const ELEMENTS = ["Wood", "Fire", "Earth", "Metal", "Water"];

function fake(): PdfLine[] {
  const b = new Book();
  b.h(22, "Contents");
  b.list("1 Your Chinese Horoscope", "3 The Elements");
  b.h(22, "An Introduction to the 12 Animals");
  b.p("Legend text runs over a line and", "ends here.");
  b.h(22, "1");
  b.h(22, "Your Chinese Horoscope");
  b.p("Horoscope opening.");
  b.h(18, "The Animal Moon");
  b.p("Moon text.");
  b.h(22, "2");
  b.h(22, "Yang and Yin");
  b.p("Yang Yin text.");
  b.h(22, "3");
  b.h(22, "The Elements");
  b.p("Elements opening.");
  b.h(18, "Elements and the Planets");
  b.p("Planets intro:");
  b.list("Planet one goes with Alpha", "Planet two goes with Beta");
  b.h(18, "The Creation Cycle");
  b.bullet("Made-up bullet about one element feeding the next.");
  b.h(18, "The Destruction Cycle");
  b.bullet("Alpha beats Beta");
  b.bullet("Beta beats Gamma");
  b.h(18, "The Natural Elements of the Animals");
  b.bullet("Rat naturally prefers Yin and the Metal element");
  b.bullet("Hare naturally prefers Yang and the Fire element");
  b.h(18, "Meanings of the Elements");
  b.p("Meanings intro.");
  for (const e of ELEMENTS) {
    b.h(16, `${e} People`);
    b.p(`${e} people text.`);
    b.h(14, `First ${e} Year—Yang: Known as “A”`);
    b.p(`${e} yang text.`);
    b.h(14, `Second ${e} Year—Yin: Known as “B”`);
    b.p(`${e} yin text.`);
  }
  ["Rat", "Hare"].forEach((name, n) => {
    b.h(22, String(n + 4));
    b.h(22, `The ${name}`);
    b.p("(1936, 1948, 1960)");
    b.p(`${name} opening.`);
    b.h(18, `The Virtues of the ${name}`);
    b.p("Word one, word two, word three,", "word four");
    b.h(18, `The Vices of the ${name}`);
    b.p("Fault one, fault two");
    b.h(18, `The ${name} Personality`);
    b.p(`${name} personality.`);
    b.h(18, `The ${name} in Love`);
    b.p(`${name} love.`);
    b.h(16, `The ${name}'s Circle`);
    b.p(`${name} friends.`);
    b.h(18, `The ${name} Career`);
    b.p(`${name} career.`);
    b.h(18, `The ${name} and the Five Elements`);
    b.p("Elements intro.");
    for (const e of ELEMENTS) { b.h(16, `The ${e} ${name} (1984)`); b.p(`${e} ${name} text.`); }
    b.h(18, `The Year of the ${name}`);
    b.p(`Year of the ${name} text.`);
    b.h(16, `The Fortunes of the ${name} Year by Year`);
    for (const a of ANIMALS) b.p(`The ${name} in the ${a === "Rooster" ? "Roster" : a} Year: ${name} meets ${a} and this runs`, "on.");
  });
  // Make the other ten chapters' virtues headings count for detection.
  for (const a of ANIMALS.slice(2, 8)) b.h(18, `The Virtues of the ${a}`);
  return b.lines;
}

describe("Chinese Zodiacs splitter", () => {
  const lines = fake();
  const z = parseZodiacs(lines, { file: "z.pdf", pages: 5 });

  it("recognises the book and reads the foundations in order", () => {
    expect(looksLikeZodiacs(lines)).toBe(true);
    expect(z.foundations.map((f) => f.key)).toEqual([
      "The Twelve Animals", "Your Chinese Horoscope", "Yang and Yin", "The Elements", "Elements and the Planets",
      "The Creation Cycle", "The Destruction Cycle", "The Natural Elements of the Animals", "Meanings of the Elements",
    ]);
    const f = Object.fromEntries(z.foundations.map((x) => [x.key, x.text]));
    expect(f["The Twelve Animals"]).toBe("Legend text runs over a line and ends here.");
    expect(f["Your Chinese Horoscope"]).toBe("Horoscope opening.\n\n### The Animal Moon\n\nMoon text.");
    // Lists set line by line stay one line each; bullets stay separate.
    expect(f["Elements and the Planets"]).toBe("Planets intro:\n\nPlanet one goes with Alpha\n\nPlanet two goes with Beta");
    expect(f["The Destruction Cycle"]).toBe("• Alpha beats Beta\n\n• Beta beats Gamma");
    expect(z.natural).toEqual({ Rat: { polarity: "Yin", element: "Metal" }, Rabbit: { polarity: "Yang", element: "Fire" } });
    expect(z.meanings!.items.map((m) => m.key)).toEqual(ELEMENTS);
    expect(z.meanings!.items[0]).toMatchObject({ heading: "Wood People", text: "Wood people text.", yang: { text: "Wood yang text." }, yin: { text: "Wood yin text." } });
  });

  it("reads each animal chapter, the Hare as the app's Rabbit", () => {
    expect(zodiacsSummary(z)).toEqual({ chapters: 2, complete: 2, foundations: 9 });
    const r = z.chapters.Rat!;
    expect(r.years).toBe("(1936, 1948, 1960)");
    expect(r.opening).toBe("Rat opening.");
    expect(r.virtues!.text).toBe("Word one, word two, word three, word four");
    expect(r.love!.text).toBe("Rat love.\n\n### The Rat's Circle\n\nRat friends.");
    expect(r.five!.items.map((i) => i.key)).toEqual(ELEMENTS);
    expect(r.year!.text).toBe("Year of the Rat text.");
    expect(r.fortunes!.items).toHaveLength(12);
    const rooster = r.fortunes!.items.find((i) => i.key === "Rooster")!;
    expect(rooster).toMatchObject({ heading: "The Rat in the Roster Year", text: "Rat meets Rooster and this runs on." });
    expect(z.chapters.Rabbit!.bookName).toBe("Hare");
  });

  it("knows the animal moons and polarities", () => {
    expect(animalMoon("Sagittarius")).toBe("Rat");
    expect(animalMoon("Virgo")).toBe("Rooster");
    expect(animalMoon("Gemini")).toBe("Horse");
    expect(animalPolarity("Rat")).toBe("Yang");
    expect(animalPolarity("Pig")).toBe("Yin");
  });
});

describe("Chinese Zodiacs in the Oracle and the Curriculum", () => {
  beforeEach(() => localStorage.clear());

  it("adds Foundations, Love & Career and fills the existing layers", async () => {
    const { AstroDisplay } = await import("@/components/profile-generator/astro-display");
    const { __setZodiacsForTest, __setHandbookForTest } = await import("@/lib/handbook/store");
    const { FIELD_BY_ID, fieldAvailable } = await import("@/lib/curriculum/catalogue");
    __setHandbookForTest(null);
    expect(fieldAvailable(FIELD_BY_ID.get("astro.zg.found")!)).toBe(false);
    __setZodiacsForTest(parseZodiacs(fake(), { file: "z.pdf", pages: 5 }));
    expect(fieldAvailable(FIELD_BY_ID.get("astro.zg.found")!)).toBe(true);
    expect(FIELD_BY_ID.get("astro.zg.found")!.library!()).toContain("Wood People");

    const div = document.createElement("div");
    document.body.appendChild(div);
    const root = createRoot(div);
    const insight = {
      name: "T", western_sign: "Virgo", sign: "Rat", element: "Fire", day: 1, month: 9, year: 1996, gender: "male",
      new_astrology_sign: "Virgo/Rat", zodiacData: { introduction: "Intro", elements: { Fire: "App fire" }, compatibilities: {}, futures: {} }, signData: {},
    };
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    await act(async () => root.render(<AstroDisplay insight={insight as never} />));
    const headers = Array.from(div.querySelectorAll<HTMLButtonElement>(".astro-acc-header"));
    expect(headers.map((h) => h.textContent!.replace(/▾/, ""))).toEqual([
      "Layer 1Animal Sign Totem", "Layer 2The Fire Influence", "Layer 3Compatibility Bonds", "Layer 4Temporal Trajectory",
      "Layer 5Foundations: Yang, Yin & the Elements", "Layer 6Virtues, Vices & Personality", "Layer 7Love & Career",
    ]);
    await act(async () => headers[1].click());
    expect(div.querySelector("[data-handbook='zg-five'] [data-study-open]")!.getAttribute("data-study-open")).toBe("astro.zg.five|Fire Rat");

    const found = () => Array.from(div.querySelectorAll<HTMLButtonElement>(".astro-acc-header")).find((h) => h.textContent!.includes("Foundations"))!;
    await act(async () => found().click());
    expect(div.textContent).toContain("Yang Fire Rat");
    expect(div.textContent).toContain("Moon of the Rooster");
    const creation = div.querySelector<HTMLElement>("[data-foundation='creation'] [data-study-open]")!;
    expect(creation.getAttribute("data-study-open")).toBe("astro.found.creation|Fire;astro.zg.found|The Creation Cycle");
    await act(async () => creation.click());
    expect(div.querySelector("figure[aria-label='The Creation Cycle'] figcaption")!.textContent).toBe("Your Fire is fed by Wood and feeds Earth.");
    // The personal reading first, then the book's own passage as a collapsible of its own.
    const body = div.querySelector<HTMLElement>("[data-foundation='creation']")!;
    expect(body.textContent).toContain("Your mother element: Wood");
    expect(body.querySelector("[data-handbook='foundation'] [data-study-open]")!.getAttribute("data-study-open")).toBe("astro.zg.found|The Creation Cycle");
    await act(async () => root.unmount());
    __setZodiacsForTest(null);
  });
});
