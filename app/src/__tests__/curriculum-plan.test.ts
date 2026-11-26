import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";
import plan from "@/lib/curriculum/plan.json";
import { FAMILY_EXCLUDED, caseId, caseInput, unitsOfCase, allUnits, type CurriculumPlan } from "@/lib/curriculum/plan";
import { FIELDS, FIELD_BY_ID, chartVariants } from "@/lib/curriculum/catalogue";
import { buildChart } from "@/lib/curriculum/chart";
import { famousBirthdays as FAMOUS_BIRTHDAYS } from "@/lib/famous-birthdays";

const P = plan as unknown as CurriculumPlan;

describe("Curriculum case-study plan", () => {
  it("includes the Family & Friends archive", () => {
    const src = readFileSync(resolve(__dirname, "../lib/famous-birthdays.ts"), "utf8");
    const start = src.indexOf("FAMILY & FRIENDS");
    const end = src.indexOf("GEOGRAPHIC ENTITIES", start);
    expect(start).toBeGreaterThan(0);
    const block = src.slice(start, end);
    const names = [...block.matchAll(/name:\s*(?:'([^']+)'|"([^"]+)")/g)].map((m) => m[1] ?? m[2]).filter((n) => !FAMILY_EXCLUDED.includes(n));
    expect(names.length).toBeGreaterThan(30);
    const inPlan = new Set(P.cases.map((c) => c.n));
    const missing = names.filter((n) => !inPlan.has(n));
    // "Almost all" — every one, in fact, bar the explicit exclusions.
    expect(missing).toEqual([]);
    expect(P.missingFamily).toEqual([]);
  });

  it("only uses real search-bank people for family and famous cases", () => {
    const bank = new Set(FAMOUS_BIRTHDAYS.map((p) => caseId({ n: p.name, d: p.day, m: p.month, y: p.year })));
    for (const c of P.cases) if (c.k !== "practice") expect(bank.has(caseId(c)), c.n).toBe(true);
    expect(new Set(P.cases.map(caseId)).size).toBe(P.cases.length);
  });

  it("only refers to known fields, and every unit has a case study", () => {
    for (const [fid, variants] of Object.entries(P.fields)) {
      expect(FIELD_BY_ID.has(fid), fid).toBe(true);
      for (const [v, idx] of Object.entries(variants)) {
        expect(idx.length, `${fid} · ${v}`).toBeGreaterThan(0);
        expect(idx.every((i) => i >= 0 && i < P.cases.length)).toBe(true);
      }
    }
    expect(allUnits(P).length).toBeGreaterThan(P.stats.units);
  });

  it("matches what the case studies' charts actually show", async () => {
    const now = new Date(P.planningYear, 5, 1);
    const sample = [0, 1, 7, 25, 48, 60, 100, P.cases.length - 1];
    for (const i of sample) {
      const chart = await buildChart(caseInput(P.cases[i]));
      const shown = new Set(
        FIELDS.filter((f) => f.kind === "chart").flatMap((f) => chartVariants(f, chart, now).map((v) => `${f.id}|${v}`)),
      );
      for (const u of unitsOfCase(P, i, now)) if (u.field.kind === "chart") expect(shown.has(`${u.field.id}|${u.variant}`), `${P.cases[i].n}: ${u.field.id}|${u.variant}`).toBe(true);
    }
  }, 60_000);
});
