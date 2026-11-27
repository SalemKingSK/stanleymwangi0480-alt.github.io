// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from "vitest";
import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";

vi.mock("framer-motion", () => ({
  motion: new Proxy({}, { get: () => (p: { children?: React.ReactNode }) => React.createElement("div", null, p.children) }),
  AnimatePresence: (p: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, p.children),
}));

import { foundationsFor, foundationVariants, relation, favourable, yearPillar } from "@/lib/foundations/practice";
import { chineseSignFor } from "@/lib/astrology/chinese-calendar-math";
import { currentAndNext, animalBond } from "@/lib/foundations/year";

const NOW = new Date(2026, 10, 20);
function reading(d: number, m: number, y: number, western: string, hour: string | null = null) {
  const c = chineseSignFor(d, m, y);
  return foundationsFor({ day: d, month: m, year: y, sign: c.sign, element: c.element, western, hour: hour as never }, { now: NOW });
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
    expect(r.elements.text).toContain("2026 — Yang Fire Horse: it overcomes you");
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

  it("follows the traditional lucky and unlucky element years", () => {
    const good = (el: string) => ["Wood", "Fire", "Earth", "Metal", "Water"].filter((e) => favourable(relation(el as never, e as never)));
    expect(good("Wood")).toEqual(["Wood", "Fire", "Water"]);
    expect(good("Fire")).toEqual(["Wood", "Fire", "Earth"]);
    expect(good("Earth")).toEqual(["Fire", "Earth", "Metal"]);
    expect(good("Metal")).toEqual(["Earth", "Metal", "Water"]);
    expect(good("Water")).toEqual(["Wood", "Metal", "Water"]);
    expect(yearPillar(2026)).toEqual({ element: "Fire", polarity: "Yang", animal: "Horse" });
  });

  it("gives every section a curriculum variant", () => {
    const c = chineseSignFor(12, 9, 1981);
    expect(foundationVariants({ day: 12, month: 9, year: 1981, sign: c.sign, element: c.element, western: "Virgo" }, NOW)).toEqual({
      thisyear: "Metal person · Fire year", horoscope: "Moon of the Rooster", yinyang: "Yin year · Yin moon", elements: "Yin Metal", planets: "Metal · Mercury",
      creation: "Metal", destruction: "Metal", natural: "Metal Rooster", meanings: "Yin Metal",
    });
  });

  it("never quotes the book (no book phrases in the built-in readings)", () => {
    const all = Object.values(reading(1, 3, 1975, "Pisces")).map((x) => x.text).join("\n");
    for (const phrase of ["Agents of Change", "Wood exhausts Earth", "Earth pollutes Water", "Water douses Fire", "Metal chops Wood"]) expect(all).not.toContain(phrase);
  });
});

describe("The current year read for a birthday", () => {
  const birth = (d: number, m: number, y: number, western: string) => {
    const c = chineseSignFor(d, m, y);
    return { day: d, month: m, year: y, sign: c.sign, element: c.element, western };
  };

  it("gives a Metal person a clear warning in a Fire year, with the go-between and the months ahead", () => {
    const { current, next } = currentAndNext(birth(12, 9, 1981, "Virgo"), NOW);
    expect(current.year).toBe(2026);
    expect(current.name).toBe("Yang Fire Horse");
    expect(current.starts).toBe("February 17, 2026");
    expect(current.ends).toBe("February 5, 2027");
    expect(current.elementGood).toBe(false);
    expect(current.rating).toBe("testing");
    expect(current.headline).toBe("2026 · Yang Fire Horse — a testing year for you");
    expect(current.summary).toContain("one of your harder element years (Fire overcomes Metal)");
    expect(current.text).toContain("your kind years are those of Metal (your own element), Earth (which feeds you) and Water (which you feed)");
    expect(current.text).toContain("Fire feeds Earth, and Earth feeds Metal");
    expect(current.sections.destruction).toContain("wrong side of the Destruction Cycle");
    expect(current.sections.meanings).toContain("five classic unions");
    expect(current.text).toContain("• Pig month (Nov 7, 2026 – Dec 6) — Water: draws on you, productive ← now");
    expect(next.name).toBe("Yin Fire Goat");
  });

  it("follows the book's kind and hard years for each element, moderated by the animal", () => {
    // Wood Tiger in a Fire Horse year: Fire is a kind year for Wood, and the Horse is a Tiger ally.
    expect(currentAndNext(birth(10, 10, 1974, "Libra"), NOW).current.rating).toBe("very favourable");
    // Earth Goat: Fire feeds Earth, and the Horse is the Goat's secret friend.
    expect(currentAndNext(birth(10, 10, 1979, "Libra"), NOW).current.rating).toBe("very favourable");
    // Wood Rat: a kind element, but the Horse clashes with the Rat.
    const rat = currentAndNext(birth(3, 3, 1984, "Pisces"), NOW).current;
    expect(rat.elementGood).toBe(true);
    expect(rat.bond).toBe("clash");
    expect(rat.rating).toBe("testing");
    // Metal Horse: its own year, and Fire overcomes Metal.
    expect(currentAndNext(birth(10, 10, 1990, "Libra"), NOW).current.bond).toBe("own");
    expect(animalBond("Rooster", "Rabbit")).toBe("clash");
  });

  it("ends every Foundations reading with what the year means for it", () => {
    const r = reading(12, 9, 1981, "Virgo");
    for (const k of ["horoscope", "yinyang", "elements", "planets", "creation", "destruction", "natural", "meanings"] as const) {
      expect(r[k].text).toContain("### In 2026: the Yang Fire Horse year");
    }
    expect(r.thisyear.title).toBe("Your Year: 2026 · Yang Fire Horse");
    expect(r.thisyear.badge).toBe("Testing ★★");
    expect(r.thisyear.text).toContain("### Looking ahead: 2027, the Yin Fire Goat year");
  });
});

describe("Temporal Focus on the Foundations", () => {
  it("reads every section for a chosen past or future year", () => {
    const c = chineseSignFor(12, 9, 1981);
    const b = { day: 12, month: 9, year: 1981, sign: c.sign, element: c.element, western: "Virgo" };
    const past = foundationsFor(b, { now: NOW, year: 2019 });
    expect(past.thisyear.title).toBe("Your Year: 2019 · Yin Earth Pig (looking back)");
    expect(past.thisyear.text).toContain("You are looking back at 2019");
    expect(past.thisyear.text).toContain("the twelve months of 2019 met your Metal");
    expect(past.thisyear.text).toContain("### The year after: 2020, the Yang Metal Rat year");
    expect(past.elements.text).toContain("### Your element years from 2019");
    expect(past.destruction.text).toContain("### Years to handle with care from 2019");
    expect(past.creation.text).toContain("In 2019: the Yin Earth Pig year (looking back)");
    // Earth feeds Metal: a kind year.
    expect(past.thisyear.text).toContain("Earth feeds Metal: a nourishing year");
    const future = foundationsFor(b, { now: NOW, year: 2030 });
    expect(future.thisyear.text).toContain("You are looking ahead to 2030");
    expect(foundationsFor(b, { now: NOW }).thisyear.title).toBe("Your Year: 2026 · Yang Fire Horse");
  });
});

describe("Foundations layer", () => {
  beforeEach(() => localStorage.clear());

  it("is always in the Oracle, with a field per section and the birth hour remembered", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
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
    expect(sections.map((s) => s.dataset.foundation)).toEqual(["thisyear", "horoscope", "yinyang", "elements", "planets", "creation", "destruction", "natural", "meanings"]);
    expect(div.textContent).toContain("You: Yin");
    expect(div.textContent).toContain("Rooster: Yin · Metal");
    // The current year's verdict sits above the sections.
    expect(div.querySelector("[data-year-verdict]")!.getAttribute("data-year-verdict")).toBe("testing");
    expect(sections[0].querySelector("[data-study-open]")!.getAttribute("data-study-open")).toBe("astro.found.thisyear|Metal person · Fire year");
    const trig = sections[1].querySelector<HTMLElement>("[data-study-open]")!;
    expect(trig.getAttribute("data-study-open")).toBe("astro.found.horoscope|Moon of the Rooster");
    await act(async () => trig.click());
    const select = sections[1].querySelector<HTMLSelectElement>("select")!;
    await act(async () => {
      select.value = "Horse";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(sections[1].textContent).toContain("Hour of the Horse");
    expect(localStorage.getItem("mc-birth-hour:12-9-1981")).toBe("Horse");

    // Temporal Focus: every section follows the chosen year; Today brings it back.
    const focus = div.querySelector<HTMLElement>("[data-temporal-focus]")!;
    expect(focus.textContent).toContain("This year: every section below is read for 2026 · Yang Fire Horse");
    const yearInput = focus.querySelector<HTMLInputElement>("input")!;
    await act(async () => {
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      set.call(yearInput, "2030");
      yearInput.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => Array.from(focus.querySelectorAll("button")).find((b) => b.textContent === "Cast")!.click());
    expect(focus.textContent).toContain("Looking ahead: every section below is read for 2030 · Yang Metal Dog");
    // The verdict banner follows the chosen year.
    expect(div.querySelector("[data-year-verdict]")!.textContent).toContain("2030 · Yang Metal Dog (looking ahead)");
    expect(sections[1].textContent).toContain("In 2030: the Yang Metal Dog year (looking ahead)");
    await act(async () => focus.querySelector<HTMLButtonElement>("[aria-label='Previous year']")!.click());
    expect(focus.textContent).toContain("2029 · Yin Earth Rooster");
    await act(async () => Array.from(focus.querySelectorAll("button")).find((b) => b.textContent === "Today")!.click());
    expect(focus.textContent).toContain("read for 2026 · Yang Fire Horse");
    await act(async () => root.unmount());
    vi.useRealTimers();
  });
});

describe("The year verdict in the Cosmic Alerts", () => {
  it("leads the alerts with the element-year verdict and opens the full reading with Listen", async () => {
    const { generateAlerts, elementYearOf, ElementYearAlert } = await import("@/components/profile-generator/results-display");
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    const numerology = { birthDay: 12, birthMonth: 9, birthYear: 1981, numberCounts: { "8": 1 } };
    const insight = { sign: "Rooster", element: "Metal", western_sign: "Virgo" };
    const fy = elementYearOf(insight as never, numerology as never)!;
    expect(fy.rating).toBe("testing");
    const alert = generateAlerts(numerology as never, fy).find((a) => a.id === "element-year")!;
    expect(alert.severity).toBe("caution");
    expect(alert.title).toBe("2026 Yang Fire Horse — Testing Year");
    expect(alert.message).toContain("Fire overcomes Metal");

    const div = document.createElement("div");
    document.body.appendChild(div);
    const root = createRoot(div);
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    await act(async () => root.render(<ElementYearAlert forecast={fy} />));
    expect(div.textContent).toContain("Your Year in the Five Elements · 2026 Yang Fire Horse");
    expect(div.textContent).toContain("Testing ★★☆☆☆");
    await act(async () => div.querySelector<HTMLButtonElement>("[data-study-open]")!.click());
    expect(div.textContent).toContain("Month by month");
    expect(div.querySelector("[data-tts-scope]")).toBeTruthy();
    await act(async () => root.unmount());
    vi.useRealTimers();
  });
});
