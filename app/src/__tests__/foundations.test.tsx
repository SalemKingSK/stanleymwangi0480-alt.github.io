// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from "vitest";
import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";

vi.mock("framer-motion", () => ({
  motion: new Proxy({}, { get: () => (p: { children?: React.ReactNode }) => React.createElement("div", null, p.children) }),
  AnimatePresence: (p: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, p.children),
}));

import { foundationsFor, foundationVariants, relation, yearPillar } from "@/lib/foundations/practice";
import { chineseSignFor } from "@/lib/astrology/chinese-calendar-math";

function reading(d: number, m: number, y: number, western: string, hour: string | null = null) {
  const c = chineseSignFor(d, m, y);
  return foundationsFor({ day: d, month: m, year: y, sign: c.sign, element: c.element, western, hour: hour as never });
}

describe("Foundations read for a birthday", () => {
  it("reads a Yin Metal Rooster born in Virgo at midday", () => {
    const r = reading(12, 9, 1981, "Virgo", "Horse");
    expect(r.horoscope.badge).toBe("Yin Metal Rooster · Moon of the Rooster");
    expect(r.horoscope.text).toContain("Hour of the Horse");
    expect(r.horoscope.text).toContain("double Rooster");
    expect(r.yinyang.badge).toBe("You: Yin");
    expect(r.yinyang.text).toContain("leaning Yin (3 to 1)");
    expect(r.elements.text).toContain("1980 opened the Metal pair and 1981 closed it");
    expect(r.elements.text).toContain("next in 2041");
    // No year-by-year good/bad verdicts anywhere in the Foundations.
    for (const sec of Object.values(r)) expect(sec.text).not.toMatch(/years ahead|handle with care|favour you|years ask more/);
    expect(r.planets.text).toContain("Venus");
    expect(r.planets.text).toContain("Mercury is the Water Star. Metal feeds Water");
    expect(r.creation.badge).toBe("Earth → Metal → Water");
    expect(r.destruction.badge).toBe("Fire ⟶ Metal ⟶ Wood");
    expect(r.destruction.text).toContain("**Earth** (Fire feeds Earth, which feeds Metal)");
    expect(r.natural.badge).toBe("Rooster: Yin · Metal");
    expect(r.natural.text).toContain("\"pure\" Metal Rooster");
    expect(r.meanings.text).toContain("Xīn (辛)");
  });

  it("handles a birthday before the lunar new year and a controlling fixed element", () => {
    // 20 Jan 1990 is still the Earth Snake year (new year: 27 Jan 1990).
    const r = reading(20, 1, 1990, "Capricorn");
    expect(r.horoscope.badge).toBe("Yin Earth Snake · Moon of the Ox");
    expect(r.horoscope.text).toContain("before it puts you in the previous year");
    // The Snake's natural Fire feeds the year's Earth.
    expect(r.natural.text).toContain("Fire feeds Earth");
    expect(r.planets.text).toContain("Saturn");
    expect(r.planets.text).toContain("That is your Chinese planet as well");
  });

  it("knows how elements stand to each other and each year's pillar", () => {
    expect(relation("Metal", "Earth")).toBe("feeds-you");
    expect(relation("Metal", "Water")).toBe("you-feed");
    expect(relation("Metal", "Wood")).toBe("you-control");
    expect(relation("Metal", "Fire")).toBe("controls-you");
    expect(yearPillar(2026)).toEqual({ element: "Fire", polarity: "Yang", animal: "Horse" });
  });

  it("gives every section a curriculum variant", () => {
    const c = chineseSignFor(12, 9, 1981);
    expect(foundationVariants({ day: 12, month: 9, year: 1981, sign: c.sign, element: c.element, western: "Virgo" })).toEqual({
      horoscope: "Moon of the Rooster", yinyang: "Yin year · Yin moon", elements: "Yin Metal", planets: "Metal · Mercury",
      creation: "Metal", destruction: "Metal", natural: "Metal Rooster", meanings: "Yin Metal",
    });
  });

  it("never quotes the book (no book phrases in the built-in readings)", () => {
    const all = Object.values(reading(1, 3, 1975, "Pisces")).map((x) => x.text).join("\n");
    for (const phrase of ["Agents of Change", "Wood exhausts Earth", "Earth pollutes Water", "Water douses Fire", "Metal chops Wood"]) expect(all).not.toContain(phrase);
  });
});

describe("Foundations layer", () => {
  beforeEach(() => localStorage.clear());

  it("is always in the Oracle, with a field per section and the birth hour remembered", async () => {
    const { AstroDisplay } = await import("@/components/profile-generator/astro-display");
    const { FIELD_BY_ID, fieldAvailable } = await import("@/lib/curriculum/catalogue");
    for (const k of ["horoscope", "yinyang", "elements", "planets", "creation", "destruction", "natural", "meanings"]) {
      const f = FIELD_BY_ID.get(`astro.found.${k}`)!;
      expect(f).toBeTruthy();
      expect(fieldAvailable(f)).toBe(true);
    }
    const div = document.createElement("div");
    document.body.appendChild(div);
    const root = createRoot(div);
    const insight = {
      name: "T", western_sign: "Virgo", sign: "Rooster", element: "Metal", day: 12, month: 9, year: 1981, gender: "female",
      new_astrology_sign: "Virgo/Rooster", zodiacData: { introduction: "Intro", elements: {}, compatibilities: {}, futures: {} }, signData: {},
    };
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    await act(async () => root.render(<AstroDisplay insight={insight as never} />));
    const layer = Array.from(div.querySelectorAll<HTMLButtonElement>(".astro-acc-header")).find((h) => h.textContent!.includes("Foundations"))!;
    expect(layer.textContent).toContain("Layer 5");
    await act(async () => layer.click());
    const sections = Array.from(div.querySelectorAll<HTMLElement>("[data-foundation]"));
    expect(sections.map((s) => s.dataset.foundation)).toEqual(["horoscope", "yinyang", "elements", "planets", "creation", "destruction", "natural", "meanings"]);
    expect(div.textContent).toContain("You: Yin");
    expect(div.textContent).toContain("Rooster: Yin · Metal");
    const trig = sections[0].querySelector<HTMLElement>("[data-study-open]")!;
    expect(trig.getAttribute("data-study-open")).toBe("astro.found.horoscope|Moon of the Rooster");
    await act(async () => trig.click());
    const select = sections[0].querySelector<HTMLSelectElement>("select")!;
    await act(async () => {
      select.value = "Horse";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(sections[0].textContent).toContain("Hour of the Horse");
    expect(localStorage.getItem("mc-birth-hour:12-9-1981")).toBe("Horse");
    await act(async () => root.unmount());
  });
});
