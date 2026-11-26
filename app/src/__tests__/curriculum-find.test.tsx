// @vitest-environment happy-dom
import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { act, useState } from "react";
import { futureWindow, futureTexts, yearAnimal, yearElement } from "@/lib/zodiac/futures";
import { zodiacData } from "@/lib/zodiac";
import { K } from "@/lib/curriculum/catalogue";
import { syllabus } from "@/lib/curriculum/store";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const { openStudy } = await import("@/components/curriculum/study-focus");

describe("Temporal Trajectory window", () => {
  it("names the year animal and element correctly", () => {
    expect([2020, 2024, 2026, 2032, 2037].map(yearAnimal)).toEqual(["Rat", "Dragon", "Horse", "Rat", "Snake"]);
    expect(yearElement(2026)).toBe("Yang Fire");
    expect(yearElement(2025)).toBe("Yin Wood");
    expect(yearElement(2033)).toBe("Yin Water");
  });

  it("always shows twelve years from the year searched, for every sign", () => {
    for (const [sign, d] of Object.entries(zodiacData) as [string, any][]) {
      for (const from of [2026, 2031, 2040]) {
        const w = futureWindow(d.futures, from);
        expect(w.map((y) => y.year), sign).toEqual(Array.from({ length: 12 }, (_, i) => from + i));
        expect(new Set(w.map((y) => y.animal)).size).toBe(12);
      }
    }
  });

  it("has a distinct forecast for each of the twelve year animals of every sign", () => {
    for (const [sign, d] of Object.entries(zodiacData) as [string, any][]) {
      const texts = futureTexts(d.futures);
      expect(Object.keys(texts).length, sign).toBe(12);
      expect(new Set(Object.values(texts)).size, sign).toBe(12);
    }
  });

  it("no forecast is addressed to a different sign", () => {
    const rat = futureTexts((zodiacData as any).Snake.futures).Dragon;
    expect(rat).not.toMatch(/little Rat friend/);
    expect(futureTexts((zodiacData as any).Rat.futures).Dragon).toMatch(/little Rat friend/);
    expect(futureTexts((zodiacData as any).Tiger.futures).Horse).not.toMatch(/you Snakes/);
    expect(futureTexts((zodiacData as any).Ox.futures).Tiger).not.toMatch(/^This year is your year/);
  });

  it("carries old year-named progress over to the year animal", () => {
    localStorage.setItem(
      "mc.curriculum.v1",
      JSON.stringify({
        v: 1,
        started: 1,
        units: { "astro.future": { "Rooster · 2026": { main: { n: 2, first: 1, last: 5 } } } },
        log: [{ t: 5, f: "astro.future", v: "Rooster · 2026", p: "main", n: 2 }],
        starred: [],
        dailyGoal: 10,
      }),
    );
    syllabus._reload();
    expect(syllabus.get().units["astro.future"][K.future("Rooster", "Horse")].main.n).toBe(2);
    expect(syllabus.get().log[0].v).toBe("Rooster · Horse Year");
    localStorage.clear();
    syllabus._reload();
  });
});

// ── "Find & listen" ───────────────────────────────────────────────────────

const listen = vi.fn();

/** Run with React rendering as it does in the browser (not batched until the end, as act() does). */
async function live<T>(fn: () => Promise<T>): Promise<T> {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: false });
  try {
    return await fn();
  } finally {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  }
}

function Passage({ variant }: { variant: string }) {
  return (
    <div data-study-field="astro.future" data-study-variant={variant} data-tts-scope>
      <button aria-label="Listen: read this section aloud" onClick={() => listen(variant)}>
        Listen
      </button>
      <p>The forecast for {variant}.</p>
    </div>
  );
}

function Item({ animal }: { animal: string }) {
  const [open, setOpen] = useState(false);
  const v = K.future("Rooster", animal);
  return (
    <div>
      <button aria-expanded={open} data-study-open={`astro.future|${v}`} onClick={() => setOpen(!open)}>
        2026 - Year of the {animal}
      </button>
      {open && <Passage variant={v} />}
    </div>
  );
}

function Oracle() {
  const [layer, setLayer] = useState(0);
  return (
    <main>
      <div data-study-anchor="astro.oracle">
        <button aria-expanded={layer === 3} data-study-open="astro.compat" onClick={() => setLayer(layer === 3 ? 0 : 3)}>
          Layer 3 Compatibility Bonds
        </button>
        <button aria-expanded={layer === 4} data-study-open="astro.future" onClick={() => setLayer(layer === 4 ? 0 : 4)}>
          Layer 4 Temporal Trajectory
        </button>
        {layer === 4 && ["Horse", "Goat", "Monkey"].map((a) => <Item key={a} animal={a} />)}
      </div>
    </main>
  );
}

beforeAll(() => {
  // The test DOM has no layout: treat every connected element as on screen.
  Element.prototype.getClientRects = function () {
    return (this.isConnected ? [{ top: 0, left: 0, width: 10, height: 10 }] : []) as unknown as DOMRectList;
  };
  window.scrollBy = (() => {}) as typeof window.scrollBy;
});

beforeEach(() => {
  listen.mockClear();
  document.body.innerHTML = `<div id="app"></div>`;
});

describe("Find & listen", () => {
  it("opens the layer and the year, then starts that passage's Listen", async () => {
    const root = createRoot(document.getElementById("app")!);
    await act(async () => root.render(<Oracle />));
    const found = await live(() => openStudy("astro.future", K.future("Rooster", "Goat"), { play: true }));
    expect(found).toBe(true);
    expect(listen).toHaveBeenCalledWith(K.future("Rooster", "Goat"));
    // It went straight there: the other years stayed closed.
    expect(document.querySelectorAll("[data-study-field]")).toHaveLength(1);
    await act(async () => root.unmount());
  }, 20_000);

  it("finds by label when a collapsible carries no hint", async () => {
    function Plain() {
      const [open, setOpen] = useState(false);
      return (
        <main>
          <div data-study-anchor="astro.oracle">
            <button onClick={() => {}}>Share reading</button>
            <button aria-expanded={open} onClick={() => setOpen(!open)}>
              Layer 4 Temporal Trajectory
            </button>
            {open && <Passage variant={K.future("Rooster", "Monkey")} />}
          </div>
        </main>
      );
    }
    const root = createRoot(document.getElementById("app")!);
    await act(async () => root.render(<Plain />));
    await live(() => openStudy("astro.future", K.future("Rooster", "Monkey"), { play: true }));
    expect(listen).toHaveBeenCalledTimes(1);
    await act(async () => root.unmount());
  }, 20_000);
});

describe("Study banner", () => {
  it("offers Find & listen before, and Next lesson after, the lesson is studied", async () => {
    const { StudyBanner } = await import("@/components/curriculum/study-focus");
    const { studyNav } = await import("@/lib/curriculum/navigation");
    localStorage.clear();
    syllabus._reload();
    const root = createRoot(document.getElementById("app")!);
    await act(async () => root.render(<StudyBanner onBack={() => {}} />));
    const v = K.future("Rooster", "Horse");
    await act(async () => studyNav.request({ field: "astro.future", variant: v, play: false }));
    studyNav.take();
    const text = () => document.querySelector(".study-banner")?.textContent ?? "";
    expect(text()).toContain("Find & listen");
    expect(text()).not.toContain("Next lesson");
    await act(async () => {
      syllabus.credit("astro.future", v, "main");
    });
    expect(text()).toContain("Next lesson");
    expect(text()).toContain("Listen again");
    await act(async () => root.unmount());
    studyNav.clearBanner();
  });
});
