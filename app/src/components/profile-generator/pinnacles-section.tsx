"use client";

/**
 * Pinnacles & Challenges — compound-number-aware section.
 * Raw unreduced digit sums are used to look up compound meanings before final
 * single-digit reduction.  "year" / "Personal Year" in compound text is replaced
 * with "period / pinnacle" at display time so the copy reads naturally.
 */

import * as React from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShieldAlert, Sparkles } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "../ui/accordion";
import { AccordionContentWithPlayer } from "./accordion-content-with-player";
import { PINNACLE_DESC, CHALLENGE_DESC } from "@/lib/cosmic-fate/pinnacles";
import { lookupCompound } from "@/lib/numerology/chaldean-pyn-compounds";
import type { ChaldeanPYNCompound } from "@/lib/numerology/chaldean-pyn-compounds";

// ─── helpers ────────────────────────────────────────────────────────────────

function reduceNum(n: number): number {
  let val = Math.abs(n);
  // Check for a master number at EVERY step of the reduction, not just on the
  // original input — otherwise a value like 47 (4+7=11, then 1+1=2) blows
  // straight through the master number it passes through on its way down.
  // Standard practice: once an intermediate sum lands on 11, 22, or 33, the
  // reduction stops there.
  while (val > 9 && val !== 11 && val !== 22 && val !== 33) {
    val = String(val).split("").reduce((a, d) => a + +d, 0);
  }
  return val;
}

/** Strict single-digit reduction — never preserves master numbers.
 *  Used for challenge components so |diff| is always 0-9. */
function reduceStrict(n: number): number {
  let val = Math.abs(n);
  while (val > 9) val = String(val).split("").reduce((a, d) => a + +d, 0);
  return val;
}

/** One-pass digit sum — sums individual digits exactly once, no further reduction.
 *  e.g. 1970 → 17  (held at 17, never collapsed to 8)
 *       15   → 6   (single-pass, same as full reduce for two-digit numbers)
 */
function digitSumOnce(n: number): number {
  return String(Math.abs(n)).split("").reduce((a, c) => a + +c, 0);
}

function adaptForPinnacle(text: string): string {
  return text
    .replace(/Personal Year\b/g, "this pinnacle period")
    .replace(/personal year\b/g, "this pinnacle period")
    .replace(/\bthe year\b/g, "this period")
    .replace(/\bthis year\b/g, "this period")
    .replace(/\ba year\b/g, "a period");
}

function compoundText(c: ChaldeanPYNCompound, raw: number): string {
  const header = `${raw}/${c.reduced} — ${c.name}${c.isKarmicDebt ? " (Karmic Debt)" : c.isMasterNumber ? " (Master Number)" : ""}\n\n`;
  const sym = `Symbolism: ${c.symbolism}\n\n`;
  const ess = `Vibrational Essence:\n${adaptForPinnacle(c.vibrationalEssence)}\n\n`;
  const kar = c.karmicDynamics ? `Karmic Dynamics:\n${adaptForPinnacle(c.karmicDynamics)}\n\n` : "";
  const man = `Manifestation Patterns:\n${adaptForPinnacle(c.manifestationPatterns)}`;
  return header + sym + ess + kar + man;
}

// ─── Calculation ─────────────────────────────────────────────────────────────

interface Stage {
  stage: number;
  label: string;
  ages: string;
  p: number;    // final reduced pinnacle
  c: number;    // final reduced challenge
  rawP: number; // raw compound sum for pinnacle
  active: boolean;
}

function calcStages(lp: number, d: number, m: number, y: number): Stage[] {
  const firstEnd = 36 - lp;

  // Pure digit-by-digit component totals — one pass only, never over-reduced.
  // e.g. year 1970 → 1+9+7+0 = 17  (kept as 17, not collapsed to 8)
  //      day  15   → 1+5     =  6
  const M_total = digitSumOnce(m);
  const D_total = digitSumOnce(d);
  const Y_total = digitSumOnce(y);

  // Raw compound pinnacle sums — components added as-is, no pre-reduction
  const rawP1 = M_total + D_total;
  const rawP2 = D_total + Y_total;
  // P3: the Third Pinnacle is the 1st Pinnacle plus the 2nd Pinnacle, kept as
  // an unreduced compound sum — e.g. P1=17, P2=30 → 17+30=47 (NOT digit-summed
  // down to 8+3=11 first). The final single-digit/master-number value below
  // (p3 = reduceNum(47) = 11) still lands on the same master number as before;
  // only the *raw compound* shown to the person changes, from a bare "11" to
  // the correct "47/11".
  const rawP3 = rawP1 + rawP2;
  const rawP4 = M_total + Y_total;

  // Final master-number-aware single-digit values for description lookup
  const p1 = reduceNum(rawP1);
  const p2 = reduceNum(rawP2);
  const p3 = reduceNum(rawP3);
  const p4 = reduceNum(rawP4);

  // Challenges use strict single-digit reduction — master numbers (11,22,33)
  // are NOT preserved here, so absolute differences always stay 0–9.
  const dR = reduceStrict(D_total);
  const mR = reduceStrict(M_total);
  const yR = reduceStrict(Y_total);
  const c1 = Math.abs(dR - mR);
  const c2 = Math.abs(dR - yR);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(mR - yR);

  const age = new Date().getFullYear() - y;
  return [
    { stage: 1, label: "First Pinnacle",  ages: `0–${firstEnd}`,                 p: p1, c: c1, rawP: rawP1, active: age < firstEnd },
    { stage: 2, label: "Second Pinnacle", ages: `${firstEnd}–${firstEnd + 9}`,   p: p2, c: c2, rawP: rawP2, active: age >= firstEnd && age < firstEnd + 9 },
    { stage: 3, label: "Third Pinnacle",  ages: `${firstEnd+9}–${firstEnd + 18}`, p: p3, c: c3, rawP: rawP3, active: age >= firstEnd + 9 && age < firstEnd + 18 },
    { stage: 4, label: "Fourth Pinnacle", ages: `${firstEnd + 18}+`,              p: p4, c: c4, rawP: rawP4, active: age >= firstEnd + 18 },
  ];
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function PinnaclesSection({
  destinyNum, birthDay, birthMonth, birthYear,
}: {
  destinyNum: number;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}) {
  const stages = calcStages(destinyNum, birthDay, birthMonth, birthYear);

  return (
    <Accordion type="single" collapsible className="space-y-2">
      {stages.map((s) => {
        const compound: ChaldeanPYNCompound | null = lookupCompound(s.rawP);
        const isActive = s.active;
        const accentColor = isActive ? "#d4af37" : "#7c3aed";

        const pinnacleBodyText = compound
          ? compoundText(compound, s.rawP) + (PINNACLE_DESC[s.p] ? `\n\n---\nSingle-Digit Interpretation (${s.p}):\n${PINNACLE_DESC[s.p]}` : "")
          : (PINNACLE_DESC[s.p] || "");

        return (
          <motion.div
            key={s.stage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: s.stage * 0.07 }}
            className="space-y-1.5"
          >
            {/* ── Pinnacle ── */}
            <AccordionItem
              value={`p${s.stage}`}
              className="glass-card rounded-xl overflow-hidden border-0"
              style={{ border: `1px solid ${accentColor}${isActive ? "55" : "2a"}` }}
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-3 w-full text-left">
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{
                        fontFamily: "'Cinzel',serif",
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        color: "rgba(200,185,240,0.55)",
                      }}>
                        {s.label}
                      </span>
                      {isActive && (
                        <span style={{
                          fontSize: "0.7rem",
                          background: `${accentColor}25`,
                          border: `1px solid ${accentColor}60`,
                          borderRadius: 99,
                          padding: "0.1rem 0.45rem",
                          color: accentColor,
                          fontFamily: "'Cinzel',serif",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}>
                          Active Now
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span style={{
                        fontFamily: "'Cinzel Decorative',serif",
                        fontSize: "1.5rem",
                        color: accentColor,
                        fontWeight: 700,
                        lineHeight: 1.1,
                      }}>
                        {s.rawP === s.p ? s.p : s.rawP >= 10 ? `${s.rawP}/${s.p}` : s.p}
                      </span>
                      {compound && (
                        <span style={{ fontSize: "0.7rem", color: "rgba(210,195,250,0.7)", fontStyle: "italic" }}>
                          {compound.name}
                        </span>
                      )}
                    </div>
                    <span style={{
                      fontSize: "0.7rem",
                      color: "rgba(170,155,210,0.42)",
                      fontFamily: "'Cinzel',serif",
                    }}>
                      Ages {s.ages}
                    </span>
                  </div>
                  {isActive && <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: accentColor }} />}
                  {!isActive && <TrendingUp className="h-3.5 w-3.5 shrink-0" style={{ color: "rgba(160,140,220,0.4)" }} />}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <AccordionContentWithPlayer text={pinnacleBodyText} />
              </AccordionContent>
            </AccordionItem>

            {/* ── Challenge ── */}
            <AccordionItem
              value={`c${s.stage}`}
              className="glass-card rounded-xl overflow-hidden border-0"
              style={{ border: "1px solid rgba(239,68,68,0.18)" }}
            >
              <AccordionTrigger className="px-4 py-2.5 hover:no-underline">
                <div className="flex items-center gap-3 w-full text-left">
                  <div className="flex flex-col gap-0.5 flex-1">
                    <span style={{
                      fontFamily: "'Cinzel',serif",
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "rgba(200,140,140,0.5)",
                    }}>
                      Challenge {s.stage} · Ages {s.ages}
                    </span>
                    <span style={{
                      fontFamily: "'Cinzel Decorative',serif",
                      fontSize: "1.3rem",
                      color: "rgba(239,68,68,0.8)",
                      fontWeight: 700,
                      lineHeight: 1.1,
                    }}>
                      {s.c}
                    </span>
                  </div>
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0" style={{ color: "rgba(239,68,68,0.4)" }} />
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <AccordionContentWithPlayer text={CHALLENGE_DESC[s.c] || ""} />
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        );
      })}
    </Accordion>
  );
}