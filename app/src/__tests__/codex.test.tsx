// @vitest-environment happy-dom
import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import data from "@/lib/codex/codex-data.json";
import {
  CODEX_ANIMALS,
  CODEX_NUMBERS,
  codexAnimal,
  codexAnimalKey,
  codexDayNumbers,
  codexLifePath,
  codexNumber,
  codexNumbersFor,
  enemyOf,
  trineOf,
} from "@/lib/codex";
import { FIELD_BY_ID, K } from "@/lib/curriculum/catalogue";
import plan from "@/lib/curriculum/plan.json";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

// The test DOM can't run web animations: render framer-motion as plain elements.
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const strip = ({ variants, initial, animate, exit, transition, layout, whileHover, whileTap, ...rest }: Record<string, unknown>) => {
    void variants; void initial; void animate; void exit; void transition; void layout; void whileHover; void whileTap;
    return rest;
  };
  const motion = new Proxy({}, { get: (_t, tag: string) => (p: Record<string, unknown>) => React.createElement(tag, strip(p)) });
  return { motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children) };
});

describe("Codex data", () => {
  it("never names its source publicly", () => {
    const blob = JSON.stringify(data);
    expect(blob).not.toMatch(/GG33|Gary|Numbers Guy/i);
    expect(blob).not.toMatch(/\bsources?\b/i);
    expect(blob).not.toMatch(/Would you like|Studio panel|Here is (everything|the complete)/);
    expect(blob).not.toMatch(/\\\(|\\rightarrow|=====PAGE/);
  });

  it("holds every number and animal, each opening with At a Glance", () => {
    for (const n of CODEX_NUMBERS) {
      const e = codexNumber(n)!;
      expect(e, `number ${n}`).toBeTruthy();
      expect(e.layers[0].title).toBe("At a Glance");
      expect(e.layers.length).toBeGreaterThanOrEqual(5);
      expect(new Set(e.layers.map((l) => l.id)).size).toBe(e.layers.length);
      for (const l of e.layers) expect(l.text.length, `${n} ${l.title}`).toBeGreaterThan(80);
    }
    for (const a of CODEX_ANIMALS) {
      const e = codexAnimal(a)!;
      expect(e.layers[0].title).toBe("At a Glance");
      expect(e.layers.at(-1)!.matrix).toBe(true);
    }
  });

  it("keeps both complete readings of the 7 and of the Ox", () => {
    for (const e of [codexNumber(7)!, codexAnimal("Ox")!]) {
      expect(e.layers.filter((l) => l.group === "Perspective I").length).toBeGreaterThanOrEqual(7);
      expect(e.layers.filter((l) => l.group === "Perspective II").length).toBeGreaterThanOrEqual(7);
    }
    expect(codexNumber(7)!.layers.some((l) => /Mindset & Bedtime Psychology/.test(l.title))).toBe(true);
  });

  it("carries passages verbatim, nested bullets and sub-headings included", () => {
    const one = codexNumber(1)!.layers.find((l) => l.title === "Compatibility & Enemy Dynamics")!.text;
    expect(one).toContain("• **Enemy Number — 9:**\n◦ **1 and 9 are direct enemy numbers**.");
    const eight = codexNumber(8)!.layers.map((l) => l.text).join("\n");
    expect(eight).toContain("#### Born on the 8th");
    expect(eight).toContain('#### The 28 / 28th Birthday "Matrix Hack"');
    expect(codexNumber(5)!.layers.map((l) => l.text).join("\n")).toContain("7 + 4 + 1 + 7 + 7 + 6 = 32 → 3 + 2 = 5");
  });

  it("builds the 33 from every passage about it, plus an expounded layer", () => {
    const t = codexNumber(33)!.layers;
    expect(t.map((l) => l.title)).toContain("The 33/6 Master Vibration");
    expect(t.map((l) => l.text).join("\n")).toContain("33 vertebrae");
    expect(t.some((l) => l.expounded)).toBe(true);
  });

  it("names the trines and enemies of the Strategic Matrix", () => {
    expect(trineOf("Rat")!.members).toEqual(["Rat", "Monkey", "Dragon"]);
    expect(trineOf("Cat")!.name).toBe("The Least Loyal Trine");
    expect(enemyOf("Snake")).toBe("Pig");
    expect(enemyOf("Rabbit")).toBe("Rooster");
    expect(codexAnimalKey("Sheep")).toBe("Goat");
  });
});

describe("Codex numbers for a birthday", () => {
  it("counts the life path this system's way, keeping 11, 22 and 33", () => {
    expect(codexLifePath(4, 7, 1776)).toBe(5);
    expect(codexLifePath(7, 1, 1978)).toBe(33);
    expect(codexLifePath(24, 8, 1945)).toBe(33);
    expect(codexLifePath(30, 12, 1984)).toBe(1); // LeBron James, a 1 Life Path
  });

  it("reads the birth day as its energy (11th & 29th → 11, 22nd → 22, 28th also 8)", () => {
    expect(codexDayNumbers(16)).toEqual([7]);
    expect(codexDayNumbers(29)).toEqual([11]);
    expect(codexDayNumbers(22)).toEqual([22]);
    expect(codexDayNumbers(28)).toEqual([1, 8]);
    expect(codexNumbersFor(7, 1, 1978).map((x) => x.n)).toEqual([33, 7]);
  });
});

describe("Codex in the Curriculum", () => {
  it("is a field in both modules, one passage per layer", () => {
    const num = FIELD_BY_ID.get("num.codex")!;
    const astro = FIELD_BY_ID.get("astro.codex")!;
    expect(num.module).toBe("numerology");
    expect(astro.module).toBe("astro");
    const parts = typeof num.parts === "function" ? num.parts(K.codexNumber(7)) : [];
    expect(parts.length).toBe(codexNumber(7)!.layers.length);
    const cat = typeof astro.parts === "function" ? astro.parts(K.codexAnimal("Rabbit")) : [];
    expect(cat.length).toBe(codexAnimal("Rabbit")!.layers.length);
  });

  it("has case studies for all twelve numbers and twelve animals", () => {
    const fields = (plan as { fields: Record<string, Record<string, unknown>> }).fields;
    expect(Object.keys(fields["num.codex"]).sort()).toEqual(CODEX_NUMBERS.map(K.codexNumber).sort());
    expect(Object.keys(fields["astro.codex"]).sort()).toEqual(CODEX_ANIMALS.map(K.codexAnimal).sort());
  });
});

// ── The panels ─────────────────────────────────────────────────────────────

async function live<T>(fn: () => Promise<T>): Promise<T> {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: false });
  try {
    return await fn();
  } finally {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  }
}

beforeAll(() => {
  Element.prototype.getClientRects = function () {
    return (this.isConnected ? [{ top: 0, left: 0, width: 10, height: 10 }] : []) as unknown as DOMRectList;
  };
  window.scrollBy = (() => {}) as typeof window.scrollBy;
});

beforeEach(() => {
  document.body.innerHTML = `<div id="app"></div>`;
});

describe("Codex panels", () => {
  it("shows the reading's numbers as layers, each tagged for study", async () => {
    const { NumberCodexPanel } = await import("@/components/codex/codex-panel");
    const root = createRoot(document.getElementById("app")!);
    await act(async () => root.render(<NumberCodexPanel birthDay={7} birthMonth={1} birthYear={1978} />));
    const text = document.body.textContent ?? "";
    expect(text).toContain("Master Number 33");
    expect(text).toContain("Life Path");
    const layers = Array.from(document.querySelectorAll<HTMLButtonElement>("button[aria-expanded][data-study-open]"));
    expect(layers[0].textContent).toContain("Layer 1");
    expect(layers[0].dataset.studyOpen).toBe(`num.codex|${K.codexNumber(33)}`);
    const passage = document.querySelector<HTMLElement>("[data-study-field='num.codex']")!;
    expect(passage.dataset.studyVariant).toBe(K.codexNumber(33));
    expect(passage.dataset.studyPart).toBe("l1");
    await act(async () => layers[1].click());
    expect(document.querySelector<HTMLElement>("[data-study-field='num.codex']")!.dataset.studyPart).toBe("l2");
    await act(async () => root.unmount());
  });

  it("Find & listen switches to the right number and opens its passage", async () => {
    const { NumberCodexPanel } = await import("@/components/codex/codex-panel");
    const { openStudy } = await import("@/components/curriculum/study-focus");
    const root = createRoot(document.getElementById("app")!);
    await act(async () =>
      root.render(
        <main>
          <div data-study-anchor="num.codex">
            <NumberCodexPanel birthDay={28} birthMonth={2} birthYear={1990} />
          </div>
        </main>,
      ),
    );
    const found = await live(() => openStudy("num.codex", K.codexNumber(8)));
    expect(found).toBe(true);
    expect(document.querySelector<HTMLElement>("[data-study-field='num.codex']")!.dataset.studyVariant).toBe(K.codexNumber(8));
    await act(async () => root.unmount());
  }, 20_000);

  it("the Animal Codex calls the Rabbit the Cat and draws the Strategic Matrix", async () => {
    const { AnimalCodexPanel } = await import("@/components/codex/codex-panel");
    const root = createRoot(document.getElementById("app")!);
    await act(async () => root.render(<AnimalCodexPanel sign="Rabbit" />));
    expect(document.body.textContent).toContain("Cat (Rabbit)");
    const layers = Array.from(document.querySelectorAll<HTMLButtonElement>("button[aria-expanded][data-study-open]"));
    await act(async () => layers.at(-1)!.click());
    const matrix = document.querySelector("[aria-label='The Strategic Matrix']")!;
    expect(matrix.textContent).toContain("The Least Loyal Trine");
    expect(matrix.textContent).toContain("Rooster · your enemy");
    await act(async () => root.unmount());
  });
});
