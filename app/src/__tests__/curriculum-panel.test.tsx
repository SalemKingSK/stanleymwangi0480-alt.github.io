// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { syllabus } from "@/lib/curriculum/store";
import { studyNav } from "@/lib/curriculum/navigation";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const { default: CurriculumPanel } = await import("@/components/curriculum/curriculum-panel");

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function until(check: () => boolean, ms = 8000) {
  const end = Date.now() + ms;
  while (!check() && Date.now() < end) await act(async () => wait(40));
}
function click(el: Element | null | undefined) {
  if (!el) throw new Error("missing element");
  return act(async () => (el as HTMLElement).click());
}
const button = (text: string) => Array.from(document.querySelectorAll("button")).find((b) => b.textContent?.includes(text));

beforeEach(() => {
  localStorage.clear();
  syllabus._reload();
  document.body.innerHTML = `<div id="app"></div>`;
});

describe("Curriculum panel", () => {
  it("shows the syllabus, case studies and progress, and live-updates when something is studied", async () => {
    const root = createRoot(document.getElementById("app")!);
    await act(async () => root.render(<CurriculumPanel />));
    await until(() => !!document.body.textContent?.includes("The Curriculum"));
    const text = () => document.body.textContent ?? "";
    expect(text()).toContain("Family & Friends");
    expect(text()).toMatch(/Studied\s*0\//);

    // Study Path offers the first Family & Friends case study.
    expect(text()).toContain("Next case study: Jomo Kenyatta");

    // Syllabus lists every module.
    await click(button("Syllabus Scheme"));
    for (const m of ["Astrology", "New Astrology", "Numerology", "Psychomatrix", "Cosmic Fate Map", "Timing Engine"]) expect(text()).toContain(m);

    // A listen elsewhere in the app updates the panel straight away.
    await act(async () => {
      syllabus.credit("astro.totem", "Rat", "main", "Stanley");
    });
    expect(text()).toMatch(/Studied\s*1\//);

    // Case studies list the family archive first.
    await click(button("Case Studies"));
    expect(text()).toContain("Stanley Macharia Mwangi");

    // "Open" sends a study request for that birthday.
    let requested: unknown = null;
    const off = studyNav.onOpen((input) => (requested = input));
    await click(Array.from(document.querySelectorAll("button")).find((b) => b.textContent === "Open"));
    expect(requested).toMatchObject({ name: "Jomo Kenyatta", day: 20, month: 10, year: 1897 });
    off();

    await click(button("Progress"));
    expect(text()).toContain("Mastery ladder");
    expect(text()).toContain("Export progress");
    await act(async () => root.unmount());
  }, 20_000);
});
