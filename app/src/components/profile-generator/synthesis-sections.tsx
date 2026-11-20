"use client";
/**
 * MYSTIQUE COMPASS — Synthesis Sections
 * Deep cross-module insights rendered as subsections under existing tabs.
 */
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  Layers,
  AlertTriangle,
  Compass,
  Zap,
  Star,
  ShieldAlert,
  Heart,
  Target,
  Eye,
  CalendarDays,
  Sun,
  Moon,
  Clock,
  History,
  Sprout,
  Gem,
  Globe,
  Flame,
  Waves,
  Mountain,
  Wind,
  BookOpen,
  Lightbulb,
  DollarSign,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { AccordionContentWithPlayer } from "./accordion-content-with-player";
import type { SynthesisResult } from "@/lib/numerology/synthesis";
import type { AstroInsightOutput, NumerologyData } from "./types";
import { computeSynthesis } from "@/lib/numerology/synthesis";
import { getNumberMeanings } from "@/lib/numerology/number-meanings";
import { detectContradictions } from "@/lib/numerology/synthesis/contradiction-engine";
import type { Contradiction } from "@/lib/numerology/synthesis/contradiction-engine";
import { generateRecommendations } from "@/lib/numerology/synthesis/recommendation-engine";
import type { Recommendation } from "@/lib/numerology/synthesis/recommendation-engine";
import { detectDominanceHierarchy } from "@/lib/numerology/synthesis/dominance-hierarchy-engine";
import {
  getDomainNarrative,
  ALL_DOMAIN_BANKS,
} from "@/lib/numerology/synthesis/life-domain-narrative-banks";
import { calculatePsychomatrix } from "@/lib/numerology/data/psychomatrixData";
import { createPersonalizedPsychomatrixReport } from "@/lib/numerology/psychomatrix-synthesis";
import type { PersonalizedPsychomatrixReport } from "@/lib/numerology/psychomatrix-synthesis";
import { FourPlanesChart } from "./four-planes-chart";
function SH({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      <h3 className="font-cinzel font-semibold text-[0.7rem] text-amber-400 flex items-center gap-2 uppercase tracking-[0.28em]">
        {icon} {title}
      </h3>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
    </div>
  );
}
function SynthesisBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.7rem] font-cinzel uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 text-amber-400/80">
      <Sparkles className="w-2.5 h-2.5" /> Deep Synthesis
    </span>
  );
}
// ═══════════════════════════════════════════════════════════════════════════════
// ASTROLOGY SYNTHESIS (under Astrology tab)
// ═══════════════════════════════════════════════════════════════════════════════
export function SynthesisAstroSections({
  synthesis,
  insight,
}: {
  synthesis: SynthesisResult;
  insight: AstroInsightOutput;
}) {
  const { decan, doubleAnimal, sexagenary, heavenlyStem, earthlyBranch } =
    synthesis;
  if (
    !decan &&
    (!doubleAnimal || !doubleAnimal.isDouble) &&
    !sexagenary &&
    !heavenlyStem &&
    !earthlyBranch
  )
    return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-2"
    >
      <SH icon={<Compass className="w-3.5 h-3.5" />} title="Deep Synthesis" />
      <Accordion type="single" collapsible className="w-full space-y-2">
        {decan && (
          <AccordionItem
            value="decan"
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(212,175,55,0.1)" }}
                >
                  <Target className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-amber-300">
                      {decan.title}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    {insight.western_sign}
                    {insight.western_cusp ? ` (cusp of ${insight.western_cusp})` : ""} • Decan {decan.decanNumber} • Ruled
                    by {decan.rulingPlanet} • {decan.dateRange}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer text={decan.interpretation} />
            </AccordionContent>
          </AccordionItem>
        )}
        {doubleAnimal && doubleAnimal.isDouble && (
          <AccordionItem
            value="double-animal"
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(168,85,247,0.1)" }}
                >
                  <Layers className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-purple-300">
                      Double {doubleAnimal.animal}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    {doubleAnimal.title}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer text={doubleAnimal.interpretation} />
            </AccordionContent>
          </AccordionItem>
        )}
        {sexagenary && (
          <AccordionItem
            value="sexagenary"
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(212,175,55,0.18)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(212,175,55,0.12)" }}
                >
                  <Mountain className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-amber-300">
                      Sexagenary: {sexagenary.name}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    {heavenlyStem.element} ({heavenlyStem.polarity}) ×{" "}
                    {earthlyBranch.element} ({earthlyBranch.animal})
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer text={sexagenary.interpretation} />
            </AccordionContent>
          </AccordionItem>
        )}
        {heavenlyStem && (
          <AccordionItem
            value="heavenly-stem"
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(250,204,21,0.08)" }}
                >
                  <Flame className="w-4 h-4 text-yellow-400/70" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-yellow-300/80">
                      Heavenly Stem {heavenlyStem.stem}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    {heavenlyStem.title} • {heavenlyStem.element} •{" "}
                    {heavenlyStem.polarity}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer text={heavenlyStem.interpretation} />
            </AccordionContent>
          </AccordionItem>
        )}
        {earthlyBranch && (
          <AccordionItem
            value="earthly-branch"
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(14,165,233,0.08)" }}
                >
                  <Waves className="w-4 h-4 text-sky-400/70" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-sky-300/80">
                      Earthly Branch: {earthlyBranch.animal} (
                      {earthlyBranch.animalChinese})
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    {earthlyBranch.element} • {earthlyBranch.direction} •{" "}
                    {earthlyBranch.season}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer text={earthlyBranch.interpretation} />
            </AccordionContent>
          </AccordionItem>
        )}
        {synthesis.zodiacRelationships && (
          <AccordionItem
            value="zodiac-relationships"
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(236,72,153,0.12)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(236,72,153,0.1)" }}
                >
                  <Sparkles className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-pink-300">
                      Zodiac Relationships:{" "}
                      {synthesis.zodiacRelationships.animal}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    Secret Friend: {synthesis.zodiacRelationships.secretFriend}{" "}
                    • Enemy: {synthesis.zodiacRelationships.astrologicalEnemy} •
                    Peach Blossom: {synthesis.zodiacRelationships.peachBlossom}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer
                text={synthesis.zodiacRelationships.interpretation}
              />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </motion.div>
  );
}
// ═══════════════════════════════════════════════════════════════════════════════
// ASTRO MORE (birth day of week)
// ═══════════════════════════════════════════════════════════════════════════════
export function SynthesisAstroMoreSections({
  synthesis,
}: {
  synthesis: SynthesisResult;
}) {
  const { birthDayOfWeek } = synthesis;
  if (!birthDayOfWeek) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-2"
    >
      <Accordion type="single" collapsible className="w-full space-y-2">
        <AccordionItem
          value="day-of-week"
          className="rounded-xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline group">
            <div className="flex items-center gap-3 text-left">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(251,191,36,0.1)" }}
              >
                <Sun className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-cinzel text-[0.75rem] text-yellow-300">
                    Born on {birthDayOfWeek.dayName}
                  </span>
                  <SynthesisBadge />
                </div>
                <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                  {birthDayOfWeek.planet} • {birthDayOfWeek.title}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <AccordionContentWithPlayer text={birthDayOfWeek.interpretation} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
export function SynthesisNumerologySections({
  synthesis,
  numerology,
}: {
  synthesis: SynthesisResult;
  numerology: NumerologyData;
}) {
  const {
    combinedAbsences,
    karmicFateNullMeaning,
    compoundPersonalizedInsight,
    personalYearCustomized,
  } = synthesis;
  const absPatterns = combinedAbsences?.patterns || [];
  const {
    birthDayAnalysis,
    challenges,
    masterNumbers,
    maturityNumber,
    birthDayOfWeek,
  } = synthesis;
  const {
    lifePath,
    lifePathPeriods,
    karmicDebts,
    personalMonth,
    birthMonthAnalysis,
  } = synthesis;
  const hasAny =
    absPatterns.length > 0 ||
    !!karmicFateNullMeaning ||
    !!compoundPersonalizedInsight ||
    !!personalYearCustomized ||
    !!birthDayAnalysis ||
    !!challenges ||
    masterNumbers.length > 0 ||
    !!maturityNumber ||
    !!lifePath ||
    !!lifePathPeriods ||
    karmicDebts.length > 0 ||
    !!personalMonth ||
    !!birthMonthAnalysis ||
    !!synthesis.personalYearAnalysis ||
    !!synthesis.universalYear ||
    !!synthesis.karmicLessons;
  if (!hasAny) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-2"
    >
      <SH icon={<Brain className="w-3.5 h-3.5" />} title="Deep Synthesis" />
      <Accordion type="single" collapsible className="w-full space-y-2">
        {birthDayAnalysis && (
          <AccordionItem
            value="birth-day"
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(52,211,153,0.1)" }}
                >
                  <CalendarDays className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-emerald-300">
                      Birth Day {birthDayAnalysis.day}: {birthDayAnalysis.title}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    Ruling Number {birthDayAnalysis.rulingNumber} •{" "}
                    {birthDayAnalysis.keywords}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer
                text={birthDayAnalysis.interpretation}
              />
            </AccordionContent>
          </AccordionItem>
        )}
        {challenges &&
          challenges.challenges.map((c) => (
            <AccordionItem
              key={`challenge-${c.stage}`}
              value={`challenge-${c.stage}`}
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.015)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline group">
                <div className="flex items-center gap-3 text-left">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(239,68,68,0.08)" }}
                  >
                    <ShieldAlert className="w-4 h-4 text-orange-400/70" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel text-[0.75rem] text-orange-300/80">
                        Challenge {c.stage}: {c.title}
                      </span>
                      <SynthesisBadge />
                    </div>
                    <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                      {c.label} • Ages {c.ages} • Challenge Number {c.number}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <AccordionContentWithPlayer text={c.interpretation} />
              </AccordionContent>
            </AccordionItem>
          ))}
        {masterNumbers.map((m) => (
          <AccordionItem
            key={`master-${m.number}`}
            value={`master-${m.number}`}
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(200,168,75,0.15)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(212,175,55,0.15)" }}
                >
                  <Star className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-amber-300">
                      Master Number {m.number}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    {m.title}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer text={m.interpretation} />
            </AccordionContent>
          </AccordionItem>
        ))}
        {maturityNumber && (
          <AccordionItem
            value="maturity"
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(168,85,247,0.1)" }}
                >
                  <Moon className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-purple-300">
                      Maturity Number {maturityNumber.number}
                      {maturityNumber.isMaster ? " ★" : ""}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    {maturityNumber.title}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer
                text={maturityNumber.interpretation}
              />
            </AccordionContent>
          </AccordionItem>
        )}
        {lifePath && (
          <AccordionItem
            value="life-path"
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(168,85,247,0.15)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(168,85,247,0.1)" }}
                >
                  <Compass className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-purple-300">
                      Life Path {lifePath.number}: {lifePath.title}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    Your Soul's Core Curriculum
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer text={lifePath.interpretation} />
            </AccordionContent>
          </AccordionItem>
        )}
        {lifePathPeriods &&
          lifePathPeriods.periods.map((p) => (
            <AccordionItem
              key={`period-${p.period}`}
              value={`period-${p.period}`}
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.015)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline group">
                <div className="flex items-center gap-3 text-left">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(16,185,129,0.08)" }}
                  >
                    <Sprout className="w-4 h-4 text-emerald-400/70" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel text-[0.75rem] text-emerald-300/80">
                        {p.period} Period — Number {p.number}
                      </span>
                      <SynthesisBadge />
                    </div>
                    <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                      Ages {p.ages}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <AccordionContentWithPlayer text={p.interpretation} />
              </AccordionContent>
            </AccordionItem>
          ))}
        {birthMonthAnalysis && (
          <AccordionItem
            value="birth-month"
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(139,92,246,0.08)" }}
                >
                  <Gem className="w-4 h-4 text-violet-400/70" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-violet-300/80">
                      Born in {birthMonthAnalysis.monthName}:{" "}
                      {birthMonthAnalysis.title}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    Birth Month Number {birthMonthAnalysis.number}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer
                text={birthMonthAnalysis.interpretation}
              />
            </AccordionContent>
          </AccordionItem>
        )}
        {personalMonth && (
          <AccordionItem
            value="personal-month"
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(34,211,238,0.12)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(34,211,238,0.08)" }}
                >
                  <Clock className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-cyan-300">
                      Personal Month {personalMonth.personalMonth}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    {personalMonth.title} • Personal Year{" "}
                    {personalMonth.personalYear}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer text={personalMonth.interpretation} />
            </AccordionContent>
          </AccordionItem>
        )}
        {karmicDebts.map((kd) => (
          <AccordionItem
            key={`karmic-${kd.number}-${kd.foundIn}`}
            value={`karmic-${kd.number}-${kd.foundIn}`}
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.12)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.08)" }}
                >
                  <AlertTriangle className="w-4 h-4 text-red-400/70" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-red-300/80">
                      Karmic Debt {kd.number} — Found in {kd.foundIn}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    {kd.title}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer text={kd.interpretation} />
            </AccordionContent>
          </AccordionItem>
        ))}
        {synthesis.karmicLessons && (
          <>
            <AccordionItem
              value="karmic-lessons-summary"
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(168,85,247,0.06)",
                border: "1px solid rgba(168,85,247,0.15)",
              }}
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline group">
                <div className="flex items-center gap-3 text-left">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(168,85,247,0.1)" }}
                  >
                    <Compass className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel text-[0.75rem] text-purple-300">
                        Karmic Lessons
                      </span>
                      <SynthesisBadge />
                    </div>
                    <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                      {
                        synthesis.karmicLessons.lessons.filter(
                          (l) => !l.present,
                        ).length
                      }{" "}
                      Missing Numbers · Soul Curriculum
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <AccordionContentWithPlayer
                  text={synthesis.karmicLessons.summary}
                />
              </AccordionContent>
            </AccordionItem>
            {synthesis.karmicLessons.lessons
              .filter((l) => !l.present)
              .map((l) => (
                <AccordionItem
                  key={`karmic-lesson-${l.number}`}
                  value={`karmic-lesson-${l.number}`}
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline group">
                    <div className="flex items-center gap-3 text-left">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(168,85,247,0.06)" }}
                      >
                        <Sparkles className="w-4 h-4 text-purple-400/60" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-cinzel text-[0.75rem] text-purple-300/70">
                            Missing Number {l.number}
                          </span>
                          <SynthesisBadge />
                        </div>
                        <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                          {l.title}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <AccordionContentWithPlayer text={l.interpretation} />
                  </AccordionContent>
                </AccordionItem>
              ))}
          </>
        )}
        {absPatterns.map((p) => (
          <AccordionItem
            key={p.id}
            value={`abs-${p.id}`}
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.08)" }}
                >
                  <AlertTriangle className="w-4 h-4 text-red-400/70" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-red-300/80">
                      {p.name}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    Missing: {p.missingNumbers.join(", ")} • {p.severity}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer text={p.interpretation} />
            </AccordionContent>
          </AccordionItem>
        ))}
        {karmicFateNullMeaning && (
          <AccordionItem
            value="karmic-null"
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(168,85,247,0.1)" }}
                >
                  <Star className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-purple-300">
                      Karmic Fate: Fresh Slate
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    No predetermined karmic debt number
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer text={karmicFateNullMeaning} />
            </AccordionContent>
          </AccordionItem>
        )}
        {compoundPersonalizedInsight && (
          <AccordionItem
            value="compound-pers"
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(251,191,36,0.1)" }}
                >
                  <Layers className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-yellow-300">
                      Compound Number — Personalized
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    How your compound interacts with your number matrix
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer text={compoundPersonalizedInsight} />
            </AccordionContent>
          </AccordionItem>
        )}
        {personalYearCustomized && (
          <AccordionItem
            value="py-cust"
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(96,165,250,0.1)" }}
                >
                  <Eye className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-blue-300">
                      Personal Year — Customized
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    Number-matrix-modified year energy
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer
                text={
                  personalYearCustomized + (synthesis.compoundEnrichedPY || "")
                }
              />
            </AccordionContent>
          </AccordionItem>
        )}
        {synthesis.personalYearAnalysis && (
          <AccordionItem
            value="personal-year"
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.15)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(139,92,246,0.12)" }}
                >
                  <Target className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-violet-300">
                      Personal Year{" "}
                      {synthesis.personalYearAnalysis.rawYear ===
                      synthesis.personalYearAnalysis.year
                        ? synthesis.personalYearAnalysis.year
                        : `${synthesis.personalYearAnalysis.rawYear}/${synthesis.personalYearAnalysis.year}`}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    {synthesis.personalYearAnalysis.title}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {synthesis.personalYearAnalysis.dualEssenceSynthesis && (
                <div
                  className="mb-4 p-4 rounded-xl"
                  style={{
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.18)",
                  }}
                >
                  <p className="text-[0.7rem] text-amber-300 font-cinzel uppercase tracking-wider mb-1">
                    Historical-Calibrated Dual Essence —{" "}
                    {synthesis.personalYearAnalysis.dualEssenceTitle}
                  </p>
                  <p className="text-[0.7rem] text-slate-500 mb-2">
                    Direct essence = visible manifestation field. Classic
                    essence = karmic storyline. Intensity{" "}
                    {synthesis.personalYearAnalysis.intensityScore}/100 ·{" "}
                    {synthesis.personalYearAnalysis.polarity}.
                  </p>
                  <AccordionContentWithPlayer
                    text={synthesis.personalYearAnalysis.dualEssenceSynthesis}
                  />
                </div>
              )}
              <AccordionContentWithPlayer
                text={synthesis.personalYearAnalysis.interpretation}
              />
              {synthesis.personalYearAnalysis.rawYearClassic !==
                synthesis.personalYearAnalysis.rawYear && (
                <div
                  className="mt-4 pt-4"
                  style={{ borderTop: "1px solid rgba(139,92,246,0.15)" }}
                >
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mb-1">
                    Classic System —{" "}
                    {synthesis.personalYearAnalysis.rawYearClassic}/
                    {synthesis.personalYearAnalysis.yearClassic}
                    {synthesis.personalYearAnalysis.titleClassic
                      ? ` — ${synthesis.personalYearAnalysis.titleClassic.split("—").slice(1).join("—").trim()}`
                      : ""}
                  </p>
                  <p className="text-[0.7rem] text-slate-600 mb-2">
                    Birth day and month reduced to a single digit before summing
                    — the older Chaldean convention, shown alongside the direct
                    calculation above.
                  </p>
                  <AccordionContentWithPlayer
                    text={synthesis.personalYearAnalysis.interpretationClassic}
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}
        {synthesis.universalYear && (
          <AccordionItem
            value="universal-year"
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(34,211,238,0.12)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(34,211,238,0.08)" }}
                >
                  <Globe className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-cyan-300">
                      {synthesis.universalYear.title}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    The Collective Vibration of{" "}
                    {synthesis.universalYear.calendarYear}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer
                text={synthesis.universalYear.interpretation}
              />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </motion.div>
  );
}
// ═══════════════════════════════════════════════════════════════════════════════
// PSYCHOMATRIX SYNTHESIS (under Psychomatrix tab)
// ═══════════════════════════════════════════════════════════════════════════════
const DOMAIN_META_PS: Record<
  string,
  { label: string; colorClass: string; accent: string }
> = {
  career: {
    label: "Career",
    colorClass: "text-sky-300",
    accent: "rgba(56,189,248,0.10)",
  },
  relationships: {
    label: "Relationships",
    colorClass: "text-rose-300",
    accent: "rgba(251,113,133,0.10)",
  },
  money: {
    label: "Money",
    colorClass: "text-emerald-300",
    accent: "rgba(52,211,153,0.10)",
  },
  health: {
    label: "Health",
    colorClass: "text-orange-300",
    accent: "rgba(251,146,60,0.10)",
  },
  spirituality: {
    label: "Spirituality",
    colorClass: "text-violet-300",
    accent: "rgba(167,139,250,0.10)",
  },
  identity: {
    label: "Identity",
    colorClass: "text-amber-300",
    accent: "rgba(212,175,55,0.10)",
  },
  multi: {
    label: "Multi-Domain",
    colorClass: "text-purple-300",
    accent: "rgba(192,132,252,0.10)",
  },
  leadership: {
    label: "Leadership",
    colorClass: "text-cyan-300",
    accent: "rgba(103,232,249,0.10)",
  },
  stress: {
    label: "Stress",
    colorClass: "text-red-300",
    accent: "rgba(252,165,165,0.10)",
  },
};
function PSBadge({ domain }: { domain: string }) {
  const m = DOMAIN_META_PS[domain] || DOMAIN_META_PS.identity;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.7rem] font-cinzel uppercase tracking-widest border ${m.colorClass}`}
      style={{
        background: m.accent,
        borderColor: m.accent.replace("0.10)", "0.28)"),
      }}
    >
      {m.label}
    </span>
  );
}
function ContradictionAccordionCard({
  c,
  index,
}: {
  c: Contradiction;
  index: number;
}) {
  const m = DOMAIN_META_PS[c.domain] || DOMAIN_META_PS.identity;
  const hasManifestations =
    c.lifeManifestations && Object.keys(c.lifeManifestations).length > 0;
  return (
    <AccordionItem
      value={`psc-${index}`}
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.015)",
        border: `1px solid ${m.accent.replace("0.10)", "0.22)")}`,
      }}
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-start gap-3 text-left w-full">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: m.accent }}
          >
            <AlertTriangle className={`w-4 h-4 ${m.colorClass}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`font-cinzel text-[0.73rem] ${m.colorClass}`}>
                {c.name}
              </span>
              <PSBadge domain={c.domain} />
              <SynthesisBadge />
            </div>
            <p className="text-[0.7rem] text-slate-400 font-light leading-relaxed">
              {c.description}
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-3">
          <div
            className="rounded-lg px-3 py-2 border"
            style={{
              background: "rgba(212,175,55,0.05)",
              borderColor: "rgba(212,175,55,0.15)",
            }}
          >
            <p className="text-[0.7rem] font-cinzel uppercase tracking-widest text-amber-500/60 mb-1">
              Grid Pattern
            </p>
            <p className="text-[0.7rem] text-amber-300/80 font-light">
              {c.pattern}
            </p>
          </div>
          <AccordionContentWithPlayer text={c.deepReading} />
          {hasManifestations && (
            <div className="space-y-1.5">
              <p className="text-[0.7rem] font-cinzel uppercase tracking-widest text-slate-500">
                How This Manifests
              </p>
              {Object.entries(c.lifeManifestations).map(([dom, text]) => {
                const dm = DOMAIN_META_PS[dom] || DOMAIN_META_PS.identity;
                return (
                  <div
                    key={dom}
                    className="rounded-lg px-3 py-2 border"
                    style={{
                      background: dm.accent,
                      borderColor: dm.accent.replace("0.10)", "0.2)"),
                    }}
                  >
                    <p
                      className={`text-[0.7rem] font-cinzel uppercase tracking-widest mb-0.5 ${dm.colorClass}`}
                    >
                      {dm.label}
                    </p>
                    <p className="text-[0.7rem] text-slate-300 font-light leading-relaxed">
                      {text}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          <div
            className="rounded-lg px-3 py-2.5 border"
            style={{
              background: "rgba(52,211,153,0.05)",
              borderColor: "rgba(52,211,153,0.18)",
            }}
          >
            <p className="text-[0.7rem] font-cinzel uppercase tracking-widest text-emerald-400/70 mb-1.5">
              Resolution Path
            </p>
            <p className="text-[0.7rem] text-emerald-200/90 font-light leading-relaxed">
              {c.resolution}
            </p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
function RecommendationAccordionCard({
  r,
  index,
}: {
  r: Recommendation;
  index: number;
}) {
  const m = DOMAIN_META_PS[r.domain] || DOMAIN_META_PS.identity;
  return (
    <AccordionItem
      value={`psr-${index}`}
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.015)",
        border: `1px solid ${m.accent.replace("0.10)", "0.18)")}`,
      }}
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-start gap-3 text-left w-full">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: m.accent }}
          >
            <Sparkles className={`w-4 h-4 ${m.colorClass}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`font-cinzel text-[0.7rem] ${m.colorClass}`}>
                {r.title}
              </span>
              <PSBadge domain={r.domain} />
            </div>
            <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider">
              {r.gridBasis}
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-3">
          <AccordionContentWithPlayer text={r.text} />
          <div
            className="rounded-lg px-3 py-2.5 border"
            style={{
              background: "rgba(212,175,55,0.06)",
              borderColor: "rgba(212,175,55,0.2)",
            }}
          >
            <p className="text-[0.7rem] font-cinzel uppercase tracking-widest text-amber-400/70 mb-1.5">
              30-Day Practice
            </p>
            <AccordionContentWithPlayer text={r.practice} />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
export function SynthesisPsychomatrixSections({
  synthesis,
  numerology,
}: {
  synthesis: SynthesisResult;
  numerology: NumerologyData;
}) {
  const { lineIntersections } = synthesis;
  const patterns = lineIntersections?.patterns || [];
  const psychomatrixReport =
    React.useMemo<PersonalizedPsychomatrixReport | null>(() => {
      if (
        !numerology?.birthDay ||
        !numerology?.birthMonth ||
        !numerology?.birthYear
      )
        return null;
      try {
        const pmx = calculatePsychomatrix(
          numerology.birthDay,
          numerology.birthMonth,
          numerology.birthYear,
        );
        return createPersonalizedPsychomatrixReport(pmx);
      } catch {
        return null;
      }
    }, [numerology?.birthDay, numerology?.birthMonth, numerology?.birthYear]);
  const contradictions = React.useMemo(() => {
    if (!psychomatrixReport) return [];
    return detectContradictions(
      psychomatrixReport.lines,
      psychomatrixReport.intersections,
    );
  }, [psychomatrixReport]);
  const recommendations = React.useMemo(() => {
    if (!psychomatrixReport) return [];
    return generateRecommendations(
      psychomatrixReport,
      numerology,
      contradictions,
    );
  }, [psychomatrixReport, numerology, contradictions]);
  const dominance = React.useMemo(() => {
    if (!psychomatrixReport) return null;
    return detectDominanceHierarchy(psychomatrixReport.lines);
  }, [psychomatrixReport]);
  const [activeDomain, setActiveDomain] = React.useState<string>("career");
  const [showAllC, setShowAllC] = React.useState(false);
  const [showAllR, setShowAllR] = React.useState(false);
  const [cFilter, setCFilter] = React.useState<string | null>(null);
  const [rFilter, setRFilter] = React.useState<string | null>(null);
  const filteredC = cFilter
    ? contradictions.filter((c) => c.domain === cFilter)
    : contradictions;
  const filteredR = rFilter
    ? recommendations.filter((r) => r.domain === rFilter)
    : recommendations;
  const visibleC = showAllC ? filteredC : filteredC.slice(0, 4);
  const visibleR = showAllR ? filteredR : filteredR.slice(0, 5);
  const hasAnything =
    patterns.length > 0 ||
    contradictions.length > 0 ||
    recommendations.length > 0;
  if (!hasAnything) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-2"
    >
      {/* ── EXISTING: Line Intersection Synthesis ──────────────────────────── */}
      {patterns.length > 0 && (
        <>
          <SH
            icon={<ShieldAlert className="w-3.5 h-3.5" />}
            title="Line Intersection Synthesis"
          />
          <Accordion type="single" collapsible className="w-full space-y-2">
            {patterns.map((p) => (
              <AccordionItem
                key={p.id}
                value={`line-${p.id}`}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline group">
                  <div className="flex items-center gap-3 text-left">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(244,114,182,0.1)" }}
                    >
                      <Heart className="w-4 h-4 text-pink-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-cinzel text-[0.75rem] text-pink-300">
                          {p.name}
                        </span>
                        <SynthesisBadge />
                      </div>
                      <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                        {p.condition}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <AccordionContentWithPlayer text={p.interpretation} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
      {/* ── NEW: Priority Ranking ──────────────────────────────────────────── */}
      {dominance &&
        dominance.top3.length > 0 &&
        (() => {
          const RANK_COLORS = [
            {
              bg: "rgba(212,175,55,0.07)",
              border: "rgba(212,175,55,0.28)",
              badgeBg: "rgba(212,175,55,0.18)",
              badgeColor: "#d4af37",
              titleClass: "text-amber-300",
              numColor: "#d4af37",
            },
            {
              bg: "rgba(148,163,184,0.04)",
              border: "rgba(148,163,184,0.18)",
              badgeBg: "rgba(148,163,184,0.1)",
              badgeColor: "#94a3b8",
              titleClass: "text-slate-300",
              numColor: "#94a3b8",
            },
            {
              bg: "rgba(120,113,108,0.04)",
              border: "rgba(120,113,108,0.15)",
              badgeBg: "rgba(120,113,108,0.1)",
              badgeColor: "#78716c",
              titleClass: "text-stone-400",
              numColor: "#78716c",
            },
          ];
          const DOMINANT_DEEP_READINGS: Record<string, string> = {
            "Purpose / Will Engine":
              "The Purpose / Will Engine being your dominant force means your life is organised — often unconsciously — around the question of direction. You do not simply react to circumstances; you orient toward missions. The number 1-4-7 vertical column carries more total digits than any other line in your grid, which numerologically encodes a heightened drive to know why you are here and to move toward it. The shadow of a dominant Will Engine is tunnel vision: the capacity to pursue becomes the compulsion to pursue, filtering out signals that suggest rest, revision, or relationship. Your leverage point is deliberate deceleration — choosing when to pause the directional drive rather than being swept by it.",
            "Family / Attachment Field":
              "The Family / Attachment Field being your dominant force means your nervous system is calibrated to relational data above all else. You read rooms, sense unspoken dynamics, and carry others' emotional states more completely than most people realise. The 2-5-8 horizontal row dominance indicates that belonging, loyalty, and emotional attunement are not preferences but organisational principles. The shadow: over-identification with the relational field means the self can dissolve into the needs of others. Your growth edge is learning to experience your own emotional states without immediately triangulating them through others' responses.",
            "Stability / Habits Foundation":
              "The Stability / Habits Foundation being your dominant force encodes an unusually high capacity for endurance, routine, and structural consistency. The 3-6-9 row dominance means the cells that govern material-world habits, domestic rhythms, and long-haul maintenance are your strongest. You finish what you start — not always with elegance, but with persistence. The shadow is rigidity: when the foundation becomes the ceiling, the capacity for stability becomes resistance to necessary change. Your leverage is conscious periodicity — deliberately scheduling disruption so the Foundation force remains generative rather than calcified.",
            "Self-Esteem Core":
              'The Self-Esteem Core being your dominant force means identity and confidence architecture are central to how you process every experience. Column 1 (cells 1-2-3) dominance encodes a psyche that returns constantly to questions of worth, permission, and self-definition. At its best, this produces an unusual degree of self-knowledge and authentic expression. The shadow is self-referential processing: all external events get run first through the lens of "what does this mean about me?" before any other analysis. Your growth work is practicing evaluation without self-evaluation — learning to assess situations as systems rather than as mirrors.',
            "Work / Money Drive":
              "The Work / Money Drive being your dominant force means execution and material translation are your primary modalities. Column 2 (cells 4-5-6) dominance encodes a psyche organised around output: converting intention into product, effort into result, vision into concrete form. You are likely more comfortable doing than reflecting, and more comfortable with measurable outcomes than ambiguous processes. The shadow is output-addiction: the drive to produce can crowd out recovery, relationship, and the slower work of meaning-making. Your leverage is deliberately scheduling non-productive time and resisting the identity threat that accompanies stillness.",
            "Talent / Gifts Channel":
              "The Talent / Gifts Channel being your dominant force means your psyche's primary energy runs through natural abilities and signature contributions. Column 3 (cells 7-8-9) dominance encodes gifts that are often visible to others before they are claimed by the self. The tension specific to this configuration: you may consistently undercharge, undervalue, or underpromote your abilities because they feel effortless — and the culture equates value with effort. Your work is learning to treat your gifts as assets rather than accidents, and to actively place them in contexts where they can generate their full return.",
            "Spiritual / Intuitive Diagonal":
              'The Spiritual / Intuitive Diagonal being your dominant force means the cells 1-5-9 carry your highest digit concentration, encoding a psyche that naturally operates in the register of pattern, meaning, and non-linear knowing. You likely perceive connections others miss and arrive at accurate conclusions through processes you cannot fully articulate. The shadow: intuitive dominance can create difficulty operating in purely procedural or empirical environments where the "knowing without knowing why" is not trusted as valid data. Your leverage is developing a translation language — converting intuitive knowing into forms that procedural systems can receive and act on.',
            "Temperament / Magnetism Diagonal":
              "The Temperament / Magnetism Diagonal being your dominant force means the cells 3-5-7 carry your highest digit concentration, encoding physical intelligence, instinctual responsiveness, and embodied charisma. You likely communicate more through presence than language and have an unusual capacity to affect the energy of physical spaces and social groupings. The shadow: magnetism can become manipulation when the instinctual intelligence is not paired with ethical deliberateness. Your growth edge is moving from operating instinctually — which you do naturally and often brilliantly — to operating deliberately, with conscious awareness of the effect your presence has on others.",
          };
          const SUPPRESSED_READINGS: Record<string, string> = {
            "Purpose / Will Engine":
              "The Purpose / Will Engine being suppressed means the 1-4-7 column carries minimal digit energy. Sustained direction and mission-orientation require conscious cultivation here — they do not arise automatically. This is not a character flaw; it is a wiring configuration. The corrective is external anchoring: written goals, regular review rhythms, and accountability structures that supply the directional hold your matrix does not generate organically.",
            "Family / Attachment Field":
              "The Family / Attachment Field being suppressed means relational attunement and belonging-sensitivity require deliberate effort. You may process interpersonal dynamics more cognitively than emotionally, which reads as detachment to feeling-dominant types. The corrective is not to become more emotional but to develop an explicit relational practice: scheduling connection, asking questions about others' internal states, and treating emotional data as information rather than noise.",
            "Stability / Habits Foundation":
              "The Stability / Habits Foundation being suppressed means sustained routine and structural consistency are not your defaults. You are likely better at beginning than maintaining, at vision than follow-through, at inspiration than infrastructure. The corrective is systematic scaffolding: external systems (accountability partners, scheduled reviews, automated reminders) that perform the Foundation function your matrix does not generate naturally.",
            "Self-Esteem Core":
              "The Self-Esteem Core being suppressed means identity confidence is not a given — it must be built deliberately and protected consciously. You may be more vulnerable than average to external evaluation, requiring others' approval to stabilise an internal sense of worth. The corrective is creating a stable self-assessment practice that operates independently of feedback: written affirmations of your own evidence, not others' opinions.",
            "Work / Money Drive":
              "The Work / Money Drive being suppressed means execution and material output require conscious activation. The gap between intention and completed work is wider for you than for people with strong column 2 energy. This is not laziness — it is a wiring configuration where the translation layer from planning to doing is thinner. External commitments, deadlines with real consequences, and breaking work into the smallest possible executable steps are your corrective tools.",
            "Talent / Gifts Channel":
              "The Talent / Gifts Channel being suppressed means natural gifts are either underdeveloped or under-expressed. This configuration often manifests as persistent underestimation of one's own capabilities — not false modesty but genuine uncertainty about what one does well. The corrective is systematic evidence-gathering: keeping a record of tasks that felt easy to you but produced disproportionate results for others. Your gifts are present; the channel needs deliberate opening.",
            "Spiritual / Intuitive Diagonal":
              "The Spiritual / Intuitive Diagonal being suppressed means the 1-5-9 connection carries minimal energy, indicating that intuitive, non-linear, and meaning-oriented processing must be consciously cultivated. You may find spiritual frameworks abstract and prefer concrete, empirical approaches. The corrective is not to force spiritual experience but to develop a practice of reflective pause — building in deliberate moments of open-ended inquiry before closing on conclusions.",
            "Temperament / Magnetism Diagonal":
              "The Temperament / Magnetism Diagonal being suppressed means embodied presence and instinctual social intelligence require deliberate development. You may rely more heavily on words and explicit communication than on presence, and may underestimate the degree to which physical environment, tone, and non-verbal signals shape outcomes. The corrective is somatic awareness practice — deliberately noticing what your body is communicating in social situations before verbal exchange begins.",
          };
          return (
            <div className="mt-6">
              <SH
                icon={<Star className="w-3.5 h-3.5" />}
                title="Psychic Architecture — Priority Ranking"
              />
              <p className="text-[0.7rem] text-slate-400 font-light leading-relaxed px-1 mb-3">
                The forces ranked by actual influence on your life, from
                dominant engine to suppressed frontier. Tap any force to read
                its deep meaning for your configuration.
              </p>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {dominance.top3.map((entry, i) => {
                  const rc = RANK_COLORS[i];
                  const deepText =
                    DOMINANT_DEEP_READINGS[entry.element] || entry.description;
                  return (
                    <AccordionItem
                      key={entry.element}
                      value={`rank-${i}`}
                      className="rounded-xl overflow-hidden"
                      style={{
                        background: rc.bg,
                        border: `1px solid ${rc.border}`,
                      }}
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center gap-3 text-left w-full">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-cinzel text-[0.7rem] font-bold"
                            style={{
                              background: rc.badgeBg,
                              color: rc.numColor,
                            }}
                          >
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-cinzel text-[0.7rem] ${rc.titleClass}`}
                            >
                              {entry.element}
                            </p>
                            <p className="text-[0.7rem] text-slate-500 mt-0.5">
                              {entry.description}
                            </p>
                          </div>
                          <span
                            className="text-[0.62rem] font-cinzel px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                            style={{
                              background: rc.badgeBg,
                              color: rc.badgeColor,
                              border: `1px solid ${rc.border}`,
                            }}
                          >
                            {entry.score}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <AccordionContentWithPlayer text={deepText} />
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
              {dominance.rankedElements.slice(-2).length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-[0.7rem] font-cinzel uppercase tracking-widest text-slate-600 px-1 mb-1">
                    Suppressed / Frontier (require deliberate cultivation)
                  </p>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-2"
                  >
                    {dominance.rankedElements.slice(-2).map((entry) => {
                      const deepText =
                        SUPPRESSED_READINGS[entry.element] || entry.description;
                      return (
                        <AccordionItem
                          key={entry.element}
                          value={`supp-${entry.element}`}
                          className="rounded-xl overflow-hidden"
                          style={{
                            background: "rgba(255,255,255,0.01)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <AccordionTrigger className="px-4 py-2.5 hover:no-underline">
                            <div className="flex items-center gap-3 text-left w-full">
                              <div className="w-2 h-2 rounded-full bg-slate-700 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="font-cinzel text-[0.7rem] text-slate-500">
                                  {entry.element}
                                </p>
                                <p className="text-[0.7rem] text-slate-600">
                                  {entry.description}
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <AccordionContentWithPlayer text={deepText} />
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              )}
            </div>
          );
        })()}
      {/* ── NEW: Life-Domain Grid Profile ─────────────────────────────────── */}
      {psychomatrixReport && (
        <div className="mt-6">
          <SH
            icon={<BookOpen className="w-3.5 h-3.5" />}
            title="Life-Domain Grid Profile"
          />
          <p className="text-[0.7rem] text-slate-400 font-light leading-relaxed px-1 mb-3">
            How your exact digit configuration speaks into each life area — from
            the grid up.
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {[
              "career",
              "money",
              "relationships",
              "health",
              "spirituality",
              "leadership",
              "stress",
            ].map((d) => {
              const m = DOMAIN_META_PS[d];
              return (
                <button
                  key={d}
                  onClick={() => setActiveDomain(d)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.7rem] font-cinzel uppercase tracking-wider border transition-all ${
                    activeDomain === d
                      ? `border-current ${m.colorClass} bg-white/5`
                      : "bg-transparent border-white/10 text-slate-600 hover:text-slate-400 hover:border-white/15"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDomain}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {(() => {
                const m = DOMAIN_META_PS[activeDomain];
                const narratives: string[] = [];
                for (const line of psychomatrixReport.lines) {
                  const n = getDomainNarrative(
                    line.id,
                    line.strengthCategory,
                    activeDomain,
                    ALL_DOMAIN_BANKS,
                  );
                  if (n) narratives.push(n);
                }
                if (narratives.length === 0)
                  return (
                    <p className="text-[0.7rem] text-slate-600 px-1 py-3 text-center font-cinzel">
                      No specific grid narrative for this domain.
                    </p>
                  );
                const combinedNarrative = narratives.join("\n\n");
                return (
                  <div
                    className="rounded-xl px-4 py-4 border"
                    style={{
                      background: m.accent,
                      borderColor: m.accent.replace("0.10)", "0.22)"),
                    }}
                  >
                    <p
                      className={`font-cinzel text-[0.7rem] uppercase tracking-wider mb-3 ${m.colorClass}`}
                    >
                      {m.label} — Grid-Derived Reading
                    </p>
                    <AccordionContentWithPlayer text={combinedNarrative} />
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      {/* ── NEW: Contradictions ────────────────────────────────────────────── */}
      {contradictions.length > 0 && (
        <div className="mt-6">
          <SH
            icon={<AlertTriangle className="w-3.5 h-3.5" />}
            title={`Creative Tensions · ${contradictions.length}`}
          />
          <p className="text-[0.7rem] text-slate-400 font-light leading-relaxed px-1 mb-3">
            Structural tensions unique to your grid — not flaws, but the
            friction that produces growth when named correctly.
          </p>
          {[...new Set(contradictions.map((c) => c.domain))].length > 1 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                onClick={() => setCFilter(null)}
                className={`px-2.5 py-1 rounded-full text-[0.7rem] font-cinzel uppercase tracking-wider border transition-all ${!cFilter ? "bg-amber-500/15 border-amber-500/35 text-amber-300" : "border-white/10 text-slate-600 hover:text-slate-400"}`}
              >
                All
              </button>
              {[...new Set(contradictions.map((c) => c.domain))].map((d) => (
                <button
                  key={d}
                  onClick={() => setCFilter(cFilter === d ? null : d)}
                  className={`px-2.5 py-1 rounded-full text-[0.7rem] font-cinzel uppercase tracking-wider border transition-all ${cFilter === d ? `border-current ${DOMAIN_META_PS[d]?.colorClass} bg-white/5` : "border-white/10 text-slate-600 hover:text-slate-400"}`}
                >
                  {DOMAIN_META_PS[d]?.label || d}
                </button>
              ))}
            </div>
          )}
          <Accordion type="single" collapsible className="w-full space-y-2">
            {visibleC.map((c, i) => (
              <ContradictionAccordionCard
                key={`${c.name}-${i}`}
                c={c}
                index={i}
              />
            ))}
          </Accordion>
          {filteredC.length > 4 && (
            <button
              onClick={() => setShowAllC((v) => !v)}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[0.7rem] font-cinzel uppercase tracking-widest text-amber-400/55 border border-amber-500/10 hover:border-amber-500/22 hover:text-amber-400 transition-all"
            >
              {showAllC
                ? "Show fewer"
                : `Show all ${filteredC.length} tensions`}
            </button>
          )}
        </div>
      )}
      {/* ── NEW: Recommendations ───────────────────────────────────────────── */}
      {recommendations.length > 0 && (
        <div className="mt-6">
          <SH
            icon={<Sparkles className="w-3.5 h-3.5" />}
            title={`Consultant Recommendations · ${recommendations.length}`}
          />
          <p className="text-[0.7rem] text-slate-400 font-light leading-relaxed px-1 mb-3">
            Every recommendation traces to a specific digit count. Every 30-day
            practice is calibrated to your exact grid — not a generic template.
          </p>
          {[...new Set(recommendations.map((r) => r.domain))].length > 1 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                onClick={() => setRFilter(null)}
                className={`px-2.5 py-1 rounded-full text-[0.7rem] font-cinzel uppercase tracking-wider border transition-all ${!rFilter ? "bg-amber-500/15 border-amber-500/35 text-amber-300" : "border-white/10 text-slate-600 hover:text-slate-400"}`}
              >
                All
              </button>
              {[...new Set(recommendations.map((r) => r.domain))].map((d) => (
                <button
                  key={d}
                  onClick={() => setRFilter(rFilter === d ? null : d)}
                  className={`px-2.5 py-1 rounded-full text-[0.7rem] font-cinzel uppercase tracking-wider border transition-all ${rFilter === d ? `border-current ${DOMAIN_META_PS[d]?.colorClass} bg-white/5` : "border-white/10 text-slate-600 hover:text-slate-400"}`}
                >
                  {DOMAIN_META_PS[d]?.label || d}
                </button>
              ))}
            </div>
          )}
          <Accordion type="single" collapsible className="w-full space-y-2">
            {visibleR.map((r, i) => (
              <RecommendationAccordionCard
                key={`${r.title}-${i}`}
                r={r}
                index={i}
              />
            ))}
          </Accordion>
          {filteredR.length > 5 && (
            <button
              onClick={() => setShowAllR((v) => !v)}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[0.7rem] font-cinzel uppercase tracking-widest text-amber-400/55 border border-amber-500/10 hover:border-amber-500/22 hover:text-amber-400 transition-all"
            >
              {showAllR
                ? "Show fewer"
                : `Show all ${filteredR.length} recommendations`}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
// ═══════════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
// CELL PAIR INTERACTIONS (under Psychomatrix tab)
// ═══════════════════════════════════════════════════════════════════════════════
export function SynthesisCellPairsSections({
  synthesis,
}: {
  synthesis: SynthesisResult;
}) {
  const cellPatterns = synthesis.cellPairs?.patterns || [];
  const [showAll, setShowAll] = React.useState(false);
  if (cellPatterns.length === 0) return null;
  const INITIAL_SHOW = 5;
  const visible = showAll ? cellPatterns : cellPatterns.slice(0, INITIAL_SHOW);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-2"
    >
      <SH
        icon={<Zap className="w-3.5 h-3.5" />}
        title="Cross-Cell Interactions"
      />
      <Accordion type="single" collapsible className="w-full space-y-2">
        {visible.map((p) => (
          <AccordionItem
            key={p.id}
            value={`cell-${p.id}`}
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(52,211,153,0.1)" }}
                >
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-emerald-300">
                      {p.name}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    Cells: {p.involvedCells.join(", ")} • {p.polarity}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer text={p.interpretation} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {cellPatterns.length > INITIAL_SHOW && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[0.7rem] font-cinzel uppercase tracking-widest text-emerald-400/55 border border-emerald-500/10 hover:border-emerald-500/22 hover:text-emerald-400 transition-all"
        >
          {showAll
            ? "Show fewer"
            : `Show all ${cellPatterns.length} interactions`}
        </button>
      )}
    </motion.div>
  );
}
// ═══════════════════════════════════════════════════════════════════════════════
// FOUR PLANES OF EXPRESSION (under Numerology tab)
// ═══════════════════════════════════════════════════════════════════════════════
export function SynthesisFourPlanesSections({
  synthesis,
}: {
  synthesis: SynthesisResult;
}) {
  const { planeAnalysis } = synthesis;
  if (!planeAnalysis) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-2"
    >
      <SH
        icon={<Layers className="w-3.5 h-3.5" />}
        title="Four Planes of Expression"
      />
      <Accordion type="single" collapsible className="w-full space-y-2">
        <AccordionItem
          value="plane-analysis"
          className="rounded-xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(139,92,246,0.15)",
          }}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline group">
            <div className="flex items-center gap-3 text-left">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(139,92,246,0.1)" }}
              >
                <Layers className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-cinzel text-[0.75rem] text-violet-300">
                    Four Planes of Expression
                  </span>
                  <SynthesisBadge />
                </div>
                <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                  Dominant: {planeAnalysis.dominantPlane} • Weakest:{" "}
                  {planeAnalysis.weakestPlane}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <AccordionContentWithPlayer text={planeAnalysis.synthesis} />
          </AccordionContent>
        </AccordionItem>
        {/* Graph view — visualizes the same percentages shown per-plane below */}
        <FourPlanesChart
          planes={[
            {
              key: "mental",
              label: "Mental",
              plane: planeAnalysis.mental,
              color: "#818cf8",
            },
            {
              key: "physical",
              label: "Physical",
              plane: planeAnalysis.physical,
              color: "#fbbf24",
            },
            {
              key: "emotional",
              label: "Emotional",
              plane: planeAnalysis.emotional,
              color: "#fb7185",
            },
            {
              key: "intuitive",
              label: "Intuitive",
              plane: planeAnalysis.intuitive,
              color: "#22d3ee",
            },
          ]}
        />
        {[
          {
            p: planeAnalysis.mental,
            icon: <Brain className="w-4 h-4 text-indigo-400" />,
            bg: "rgba(99,102,241,0.1)",
            tc: "text-indigo-300",
          },
          {
            p: planeAnalysis.physical,
            icon: <Zap className="w-4 h-4 text-amber-400" />,
            bg: "rgba(251,191,36,0.1)",
            tc: "text-amber-300",
          },
          {
            p: planeAnalysis.emotional,
            icon: <Heart className="w-4 h-4 text-rose-400" />,
            bg: "rgba(251,113,133,0.1)",
            tc: "text-rose-300",
          },
          {
            p: planeAnalysis.intuitive,
            icon: <Eye className="w-4 h-4 text-cyan-400" />,
            bg: "rgba(34,211,238,0.1)",
            tc: "text-cyan-300",
          },
        ].map(({ p, icon, bg, tc }) => (
          <AccordionItem
            key={`plane-${p.name}`}
            value={`plane-${p.name}`}
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: bg }}
                >
                  {icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-cinzel text-[0.75rem] ${tc}`}>
                      {p.name} Plane — {p.level}
                    </span>
                    <SynthesisBadge />
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    Score {p.score} ({p.percentage}%) • Cells{" "}
                    {p.cells.map((cell, ci) => (
                      <React.Fragment key={cell}>
                        {ci > 0 && <span className="text-slate-600">-</span>}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const el =
                              document.getElementById("psychomatrix-grid");
                            if (el)
                              el.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                          }}
                          className="text-violet-400 hover:text-violet-300 underline underline-offset-2 decoration-dotted transition-colors cursor-pointer font-bold"
                          title={`Tap to jump to Psychomatrix — cell ${cell}`}
                        >
                          {cell}
                        </button>
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer text={p.interpretation} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
}
export function useSynthesis(
  insight: AstroInsightOutput | null,
  numerology: NumerologyData | null,
): SynthesisResult | null {
  return React.useMemo(() => {
    if (!insight || !numerology) return null;
    return computeSynthesis(numerology, insight);
  }, [insight, numerology]);
}
export function NumberMeaningsSection() {
  const meanings = React.useMemo(() => getNumberMeanings(), []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mt-2"
    >
      <SH
        icon={<BookOpen className="w-3.5 h-3.5" />}
        title="Number Meanings Reference"
      />
      <Accordion type="single" collapsible className="w-full space-y-2">
        {meanings.map((m) => (
          <AccordionItem
            key={`meaning-${m.number}`}
            value={`meaning-${m.number}`}
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-cinzel text-lg"
                  style={{
                    background: "rgba(212,175,55,0.1)",
                    color: "#d4af37",
                  }}
                >
                  {m.number}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[0.75rem] text-amber-200">
                      {m.title}
                    </span>
                  </div>
                  <p className="text-[0.7rem] text-slate-500 font-cinzel uppercase tracking-wider mt-0.5">
                    {m.planet} • {m.tarot} • {m.element} • {m.keywords}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccordionContentWithPlayer text={m.interpretation} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
}