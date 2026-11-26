"use client";

/**
 * Pinnacles & Challenges — compound-number-aware section.
 * Raw unreduced digit sums are used to look up compound meanings before final
 * single-digit reduction.  "year" / "Personal Year" in compound text is replaced
 * with "period / pinnacle" at display time so the copy reads naturally.
 */

import { K } from "@/lib/curriculum/catalogue";
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
import { calcStages } from "@/lib/numerology/pinnacle-stages";

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
                <AccordionContentWithPlayer text={pinnacleBodyText} study={{ field: "num.pinnacle", variant: K.pinnacle(s.rawP, s.p) }} />
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
                <AccordionContentWithPlayer text={CHALLENGE_DESC[s.c] || ""} study={{ field: "num.challenge", variant: K.challenge(s.c) }} />
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        );
      })}
    </Accordion>
  );
}