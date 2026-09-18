"use client";
/**
 * MYSTIQUE COMPASS — Premium Numerology Display
 */
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoShuGrid from "@/components/lo-shu-grid";
import type { NumerologyData, PersonalYearData } from "./types";
import {
  BrainCircuit,
  Sparkles,
  Grid,
  Layers,
  Compass,
  Activity,
  ChevronRight,
  CalendarDays,
  Zap,
  Star,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  ChevronDown,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { AccordionContentWithPlayer } from "./accordion-content-with-player";
import { PersonalYearChart } from "./personal-year-chart";
import { PersonalYearTimeline } from "./personal-year-timeline";
import { ZodiacSection } from "./zodiac-section";
import LoshuArrowDetailPanel from "@/components/LoshuArrowDetailPanel";
import { FateChambers } from "./fate-chambers";
import { CoreVibrations } from "./core-vibrations";
import { PinnaclesSection } from "./pinnacles-section";
import { Button } from "@/components/ui/button";

function parseProbabilityItem(item: string): { label: string; percent: number } | null {
  const match = item.match(/^(.*?)\s+(\d{1,3})%$/);
  if (!match) return null;
  return { label: match[1].trim(), percent: Math.max(0, Math.min(100, Number(match[2]))) };
}

function PersonalYearProbabilityGraph({ items }: { items?: string[] }) {
  const rows = (items || []).map(parseProbabilityItem).filter(Boolean) as { label: string; percent: number }[];
  if (!rows.length) return null;
  return (
    <div
      style={{
        margin: "0.7rem 0 1rem",
        padding: "0.85rem",
        borderRadius: "1rem",
        background: "linear-gradient(135deg, rgba(15,12,35,0.92), rgba(88,28,135,0.28))",
        border: "1px solid rgba(167,139,250,0.18)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
      }}
    >
      <div
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: "0.62rem",
          letterSpacing: "0.13em",
          textTransform: "uppercase",
          color: "rgba(212,175,55,0.9)",
          marginBottom: "0.65rem",
        }}
      >
        Personal Year Probability Graph
      </div>
      {rows.map((row, index) => {
        const color = row.percent >= 85 ? "#f1d98a" : row.percent >= 70 ? "#86efac" : row.percent >= 50 ? "#67e8f9" : "#c4b5fd";
        return (
          <div key={`${row.label}-${index}`} style={{ marginBottom: index === rows.length - 1 ? 0 : "0.58rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.65rem", marginBottom: "0.25rem" }}>
              <span style={{ color: "rgba(231,221,255,0.86)", fontSize: "0.72rem", lineHeight: 1.25 }}>{row.label}</span>
              <span style={{ color, fontFamily: "'Cinzel',serif", fontSize: "0.68rem", fontWeight: 800 }}>{row.percent}%</span>
            </div>
            <div style={{ height: 9, borderRadius: 999, background: "rgba(8,7,20,0.9)", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ width: `${Math.max(3, row.percent)}%`, height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${color}, rgba(167,139,250,0.9))`, boxShadow: `0 0 14px ${color}66` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FocusChips({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  const hasPercent = items.some(i => /\d+%/.test(i));
  if (hasPercent) return <PersonalYearProbabilityGraph items={items} />;
  return (
    <div style={{ margin: "0.7rem 0 1rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
      {items.map((label, idx) => (
        <span
          key={`${label}-${idx}`}
          style={{
            fontSize: "0.65rem",
            lineHeight: 1.4,
            padding: "0.35rem 0.65rem",
            borderRadius: 999,
            background: "rgba(212,175,55,0.10)",
            border: "1px solid rgba(212,175,55,0.22)",
            color: "rgba(241,217,138,0.92)",
            fontFamily: "'Cinzel',serif",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

// ── helpers ──────────────────────────────────────────────────────────────────
function reduceNum(n: number): number {
  let val = Math.abs(n);
  // Master-number-safe: check for 11/22/33 at EVERY step of the loop,
  // not just on the original input — otherwise a value like 38
  // (3+8=11, then 1+1=2) blows straight through the master number
  // it passes through on its way down.
  while (val > 9 && val !== 11 && val !== 22 && val !== 33)
    val = String(val)
      .split("")
      .reduce((a, d) => a + +d, 0);
  return val; // ✅ FIX: was `return val || 9` — in JS, 0 is falsy so a valid
  // Challenge of 0 was incorrectly coerced to 9. Removed the fallback.
}
function personalYearNow(d: number, m: number) {
  const yr = new Date().getFullYear();
  const ySum = String(yr)
    .split("")
    .reduce((a, c) => a + +c, 0);
  // d and m go in AS-IS (unreduced) — see personal-year-full.ts's
  // computeRawPersonalYear for the shared canonical version.
  return reduceNum(d + m + ySum);
}
function calcPinnacles(lp: number, d: number, m: number, y: number) {
  const firstEnd = 36 - lp;
  const yearDigits = (yr: number) =>
    reduceNum(
      String(yr)
        .split("")
        .reduce((a, c) => a + +c, 0),
    );
  const p1 = reduceNum(reduceNum(d) + reduceNum(m));
  const p2 = reduceNum(reduceNum(d) + yearDigits(y));
  const p3 = reduceNum(p1 + p2);
  const p4 = reduceNum(reduceNum(m) + yearDigits(y));
  const c1 = reduceNum(Math.abs(reduceNum(d) - reduceNum(m)));
  const c2 = reduceNum(Math.abs(reduceNum(d) - yearDigits(y)));
  const c3 = reduceNum(Math.abs(c1 - c2));
  const c4 = reduceNum(Math.abs(reduceNum(m) - yearDigits(y)));
  const age = new Date().getFullYear() - y;
  return [
    {
      stage: 1,
      label: "First Pinnacle",
      ages: `0 – ${firstEnd}`,
      p: p1,
      c: c1,
      active: age < firstEnd,
    },
    {
      stage: 2,
      label: "Second Pinnacle",
      ages: `${firstEnd} – ${firstEnd + 9}`,
      p: p2,
      c: c2,
      active: age >= firstEnd && age < firstEnd + 9,
    },
    {
      stage: 3,
      label: "Third Pinnacle",
      ages: `${firstEnd + 9} – ${firstEnd + 18}`,
      p: p3,
      c: c3,
      active: age >= firstEnd + 9 && age < firstEnd + 18,
    },
    {
      stage: 4,
      label: "Fourth Pinnacle",
      ages: `${firstEnd + 18}+`,
      p: p4,
      c: c4,
      active: age >= firstEnd + 18,
    },
  ];
}
const YEAR_COLOUR: Record<number, string> = {
  1: "#ef4444",
  2: "#c084fc",
  3: "#fbbf24",
  4: "#34d399",
  5: "#60a5fa",
  6: "#f472b6",
  7: "#818cf8",
  8: "#f59e0b",
  9: "#a78bfa",
};
const YEAR_THEME: Record<
  number,
  { title: string; keyword: string; warning?: true }
> = {
  1: { title: "New Beginnings", keyword: "Independence & Initiative" },
  2: { title: "Cooperation", keyword: "Partnership & Patience" },
  3: { title: "Creative Bloom", keyword: "Expression & Joy" },
  4: { title: "Foundation", keyword: "Hard Work & Structure", warning: true },
  5: { title: "Freedom", keyword: "Change & Expansion" },
  6: { title: "Responsibility", keyword: "Home & Heart" },
  7: { title: "Reflection", keyword: "Inner Wisdom & Solitude", warning: true },
  8: { title: "Power", keyword: "Abundance & Authority" },
  9: {
    title: "Completion",
    keyword: "Release & Transformation",
    warning: true,
  },
};
const KUA_DATA_COMPASS: Record<
  number,
  {
    name: string;
    best: string[];
    avoid: string[];
    element: string;
    colour: string;
  }
> = {
  1: {
    name: "Water",
    best: ["SE", "E", "S", "N"],
    avoid: ["W", "NW", "NE", "SW"],
    element: "Water",
    colour: "#60a5fa",
  },
  2: {
    name: "Earth",
    best: ["NE", "W", "NW", "SW"],
    avoid: ["E", "SE", "S", "N"],
    element: "Earth",
    colour: "#fbbf24",
  },
  3: {
    name: "Thunder",
    best: ["S", "N", "SE", "E"],
    avoid: ["SW", "NE", "W", "NW"],
    element: "Wood",
    colour: "#34d399",
  },
  4: {
    name: "Wind",
    best: ["N", "S", "E", "SE"],
    avoid: ["NE", "NW", "SW", "W"],
    element: "Wood",
    colour: "#6ee7b7",
  },
  5: {
    name: "Earth",
    best: ["NE", "W", "NW", "SW"],
    avoid: ["E", "SE", "S", "N"],
    element: "Earth",
    colour: "#f59e0b",
  },
  6: {
    name: "Heaven",
    best: ["W", "NE", "SW", "NW"],
    avoid: ["E", "SE", "S", "N"],
    element: "Metal",
    colour: "#c0c0c0",
  },
  7: {
    name: "Lake",
    best: ["NW", "SW", "NE", "W"],
    avoid: ["N", "SE", "S", "E"],
    element: "Metal",
    colour: "#a78bfa",
  },
  8: {
    name: "Mountain",
    best: ["SW", "NW", "W", "NE"],
    avoid: ["SE", "S", "N", "E"],
    element: "Earth",
    colour: "#fb923c",
  },
  9: {
    name: "Fire",
    best: ["E", "SE", "N", "S"],
    avoid: ["W", "NW", "SW", "NE"],
    element: "Fire",
    colour: "#ef4444",
  },
};
const MISSING_ANALYSIS: Record<
  number,
  { title: string; layers: [string, string, string] }
> = {
  1: {
    title: "Self-Reliance",
    layers: [
      "Over-dependency on external approval — you seek validation before acting.",
      "Leadership is a skill, not a trait you were born lacking. This life teaches you to author yourself.",
      "Daily practice: Make one significant decision entirely without seeking consensus.",
    ],
  },
  2: {
    title: "Emotional Depth",
    layers: [
      "Emotional detachment or hypersensitivity used as armour against being truly known.",
      "Partnership is your greatest classroom — vulnerability is not weakness here, it's currency.",
      "Daily practice: Sit with one uncomfortable feeling for 60 seconds before reacting.",
    ],
  },
  3: {
    title: "Creative Voice",
    layers: [
      "Creative self-expression was suppressed early — possibly by perfectionism or criticism.",
      "Joy and play feel indulgent, yet they are the exact frequency your soul was encoded with.",
      "Daily practice: Create something daily — writing, doodle, hum — purely for yourself, unseen.",
    ],
  },
  4: {
    title: "Discipline",
    layers: [
      "Structures feel like traps. Routine triggers existential dread or resistance.",
      "You are not lazy — you are ancestrally wired against constraint that felt like oppression.",
      "Daily practice: Honour one micro-routine for 21 days without negotiating exceptions.",
    ],
  },
  5: {
    title: "Freedom",
    layers: [
      "You either cling to rigid routine or blow up your life seeking stimulation. No middle ground exists yet.",
      "The freedom you seek is internal — a state of radical adaptability, not external chaos.",
      "Daily practice: Deliberately change one comfortable habit each week.",
    ],
  },
  6: {
    title: "Nurturing",
    layers: [
      "Giving and receiving care triggers a complex tangle of obligation and resentment.",
      "You are learning the difference between sacred service and self-erasure.",
      "Daily practice: Cook or prepare something for someone — the ritual matters more than the gesture.",
    ],
  },
  7: {
    title: "Inner Wisdom",
    layers: [
      "Over-rationalisation blocks intuition. You dismiss the non-logical before it can inform you.",
      "Your spiritual bandwidth is vast but sealed — trauma or conditioning closed the channel.",
      "Daily practice: 5 minutes of unstructured silence every morning before any screen.",
    ],
  },
  8: {
    title: "Abundance",
    layers: [
      "Money and power carry unexamined ancestral fear — either chased desperately or sabotaged.",
      "Financial karma is highly active. Your relationship with resources mirrors your self-worth.",
      "Daily practice: Track every transaction this week without judgement. Awareness precedes shift.",
    ],
  },
  9: {
    title: "Completion",
    layers: [
      "You struggle to close chapters — people, roles, identities are clung to past their expiry.",
      "Old wounds orbit without resolution because forgiveness has been confused with condoning.",
      "Daily practice: Write a completion letter to one unresolved chapter. Sending is optional.",
    ],
  },
};
// ── Section Header ────────────────────────────────────────────────────────────
function SH({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      <h3 className="font-cinzel font-semibold text-[0.7rem] text-primary flex items-center gap-2 uppercase tracking-[0.28em]">
        {icon} {title}
      </h3>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
    </div>
  );
}
// ── InfoCard ─────────────────────────────────────────────────────────────────
const InfoCard = ({
  title,
  value,
  icon,
  onClick,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  onClick?: () => void;
}) => (
  <div
    className={`glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center aspect-square ${onClick ? "transition-all duration-300 hover:bg-purple-500/20 cursor-pointer" : ""}`}
    onClick={onClick}
  >
    <div className="flex items-center gap-2 text-purple-200/80">
      {icon}
      <p className="text-[0.6rem] font-cinzel uppercase tracking-widest">
        {title}
      </p>
    </div>
    <p className="text-5xl font-bold text-yellow-300 mt-2 font-decorative drop-shadow-lg">
      {value || ""}
    </p>
  </div>
);
// ── This Year Banner ──────────────────────────────────────────────────────────
function ThisYearBanner({
  birthDay,
  birthMonth,
}: {
  birthDay: number;
  birthMonth: number;
}) {
  const today = new Date();
  const py = personalYearNow(birthDay, birthMonth);
  const pm = reduceNum(py + today.getMonth() + 1);
  const pd = reduceNum(py + today.getDate() + today.getMonth() + 1);
  const col = YEAR_COLOUR[py] || "#d4af37";
  const theme = YEAR_THEME[py];
  const dateStr = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "1.1rem",
        border: `1px solid ${col}66`,
        background: `linear-gradient(145deg, rgba(20,5,50,0.95), rgba(10,2,30,0.97))`,
        padding: "1rem 1.25rem",
        marginBottom: "1.25rem",
        boxShadow: `0 0 0 1px ${col}26, 0 8px 40px ${col}2e, inset 0 1px 0 ${col}33`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: "1.5px",
          background: `linear-gradient(90deg,transparent,${col},transparent)`,
          borderRadius: 99,
        }}
      />
      <div
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: "0.55rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(212,175,55,0.5)",
          marginBottom: "0.6rem",
        }}
      >
        {dateStr}
      </div>
      <div style={{ display: "flex", marginBottom: "0.75rem" }}>
        {[
          ["Personal Year", py],
          ["Personal Month", pm],
          ["Personal Day", pd],
        ].map(([label, val], i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.2rem",
              padding: "0.5rem 0.25rem",
              borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <span
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: "0.5rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(200,180,240,0.45)",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: "'Cinzel Decorative',serif",
                fontSize: "2.2rem",
                fontWeight: 700,
                lineHeight: 1,
                color: col,
                textShadow: `0 0 28px ${col}99`,
              }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            background: `${col}2e`,
            border: `1px solid ${col}59`,
            borderRadius: 99,
            padding: "0.25rem 0.7rem",
            fontFamily: "'Cinzel',serif",
            fontSize: "0.58rem",
            fontWeight: 700,
            color: col,
            letterSpacing: "0.1em",
          }}
        >
          Year {py} · {theme?.title}
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            color: "rgba(210,195,240,0.65)",
            fontStyle: "italic",
          }}
        >
          {theme?.keyword}
        </span>
      </div>
      {theme?.warning && (
        <div
          style={{
            marginTop: "0.6rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "0.5rem",
            padding: "0.4rem 0.75rem",
            fontSize: "0.7rem",
            color: "#fca5a5",
          }}
        >
          <AlertTriangle
            style={{ width: 14, height: 14, color: "#ef4444", flexShrink: 0 }}
          />
          Challenging season ahead — heightened awareness recommended this
          cycle.
        </div>
      )}
    </motion.div>
  );
}
// ── Missing Numbers ───────────────────────────────────────────────────────────
function MissingNumbers({
  numberCounts,
}: {
  numberCounts: { [k: string]: number };
}) {
  const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
    (n) => !numberCounts[String(n)],
  );
  const [expanded, setExpanded] = React.useState<number | null>(null);
  const [tab, setTab] = React.useState(0);
  if (missing.length === 0)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "1.5rem",
          color: "rgba(212,175,55,0.5)",
          fontFamily: "'Cinzel',serif",
          fontSize: "0.72rem",
          letterSpacing: "0.15em",
        }}
      >
        ✦ Complete grid — no missing numbers detected
      </div>
    );
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: "0.75rem",
      }}
    >
      {missing.map((n) => {
        const info = MISSING_ANALYSIS[n];
        const isOpen = expanded === n;
        return (
          <motion.div
            key={n}
            layout
            onClick={() => {
              setExpanded(isOpen ? null : n);
              setTab(0);
            }}
            style={{
              cursor: "pointer",
              borderRadius: "1rem",
              border: isOpen
                ? "1px solid rgba(212,175,55,0.45)"
                : "1px solid rgba(124,58,237,0.2)",
              background: isOpen ? "rgba(20,5,50,0.9)" : "rgba(15,5,40,0.6)",
              overflow: "hidden",
              gridColumn: isOpen ? "1/-1" : undefined,
              transition: "border-color 0.3s, background 0.3s",
            }}
          >
            <div
              style={{
                padding: "0.8rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <div style={{ position: "relative", width: 52, height: 52 }}>
                <svg
                  viewBox="0 0 52 52"
                  style={{ position: "absolute", inset: 0 }}
                >
                  <defs>
                    <linearGradient
                      id={`mg${n}`}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
                      <stop
                        offset="100%"
                        stopColor="#d4af37"
                        stopOpacity="0.6"
                      />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="26"
                    cy="26"
                    r="24"
                    fill="rgba(15,5,40,0.8)"
                    stroke={`url(#mg${n})`}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  {isOpen && (
                    <circle
                      cx="26"
                      cy="26"
                      r="24"
                      fill="none"
                      stroke="#d4af37"
                      strokeWidth="1.5"
                      strokeOpacity="0.6"
                    >
                      <animate
                        attributeName="r"
                        values="22;26;22"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-opacity"
                        values="0.6;0;0.6"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Cinzel Decorative',serif",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "#d4af37",
                  }}
                >
                  {n}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: "0.55rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(200,180,240,0.55)",
                  textAlign: "center",
                }}
              >
                {info?.title}
              </div>
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  style={{ padding: "0 1rem 1rem" }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "0.4rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {["Shadow", "Soul Lesson", "Practice"].map((l, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTab(i);
                        }}
                        style={{
                          flex: 1,
                          padding: "0.3rem 0",
                          borderRadius: "0.4rem",
                          border:
                            tab === i
                              ? "1px solid rgba(212,175,55,0.3)"
                              : "1px solid transparent",
                          background:
                            tab === i
                              ? "rgba(212,175,55,0.12)"
                              : "rgba(255,255,255,0.04)",
                          fontFamily: "'Cinzel',serif",
                          fontSize: "0.52rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color:
                            tab === i ? "#d4af37" : "rgba(200,180,240,0.4)",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      lineHeight: 1.65,
                      color: "rgba(210,195,240,0.75)",
                      borderLeft: "2px solid rgba(212,175,55,0.3)",
                      paddingLeft: "0.75rem",
                      paddingTop: "0.25rem",
                      paddingBottom: "0.25rem",
                    }}
                  >
                    {info?.layers[tab]}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
// ── Main Export ───────────────────────────────────────────────────────────────
export function NumerologyDisplay({
  numerology,
}: {
  numerology: NumerologyData;
}) {
  const {
    birthDay,
    birthMonth,
    birthYear,
    psycheNum,
    destinyNum,
    kuaNum,
    loShuGrid,
    arrowsOfStrength,
    arrowsOfWeakness,
    kuaAttributes,
    compoundNum,
    compoundMeaning,
    reducedCompoundNum,
    reducedCompoundMeaning,
    karmicFateNum,
    karmicFateMeaning,
    numberCounts,
    repeatedNumberMeanings,
    psychicMeaning,
    specialTraitMeaning,
    destinyMeaning,
  } = numerology;
  const [selectedPersonalYear, setSelectedPersonalYear] =
    React.useState<PersonalYearData | null>(null);
  const [activePyTab, setActivePyTab] = React.useState<number>(0);
  const [personalYearAccordionValue, setPersonalYearAccordionValue] =
    React.useState("");
  const [activeCoreLayer, setActiveCoreLayer] = React.useState<string | null>(
    null,
  );
  const [activeFateLayer, setActiveFateLayer] = React.useState<number | null>(
    null,
  );
  const coreVibrationsRef = React.useRef<HTMLDivElement>(null);
  const fateChambersRef = React.useRef<HTMLDivElement>(null);
  const arrowsRef = React.useRef<HTMLDivElement>(null);
  const kuaRef = React.useRef<HTMLDivElement>(null);
  const pyDetailRef = React.useRef<HTMLDivElement>(null);
  const birthDate = `${birthDay}/${birthMonth}/${birthYear}`;
  const handleYearSelect = (data: PersonalYearData | null) => {
    if (data?.year !== selectedPersonalYear?.year) {
      setSelectedPersonalYear(data);
      // Year Theme is the default view; Synthesis remains available as its own tab.
      setActivePyTab(0);
      if (data) {
        setPersonalYearAccordionValue("personal-year-detail");
        setTimeout(
          () =>
            pyDetailRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            }),
          150,
        );
      } else setPersonalYearAccordionValue("");
    }
  };
  return (
    <div className="space-y-6">
      <ThisYearBanner birthDay={birthDay} birthMonth={birthMonth} />
      <div className="glass-card p-4">
        <SH icon={<Star className="h-4 w-4" />} title="Core Vibrations" />
        <div className="grid grid-cols-3 gap-3">
          <InfoCard
            title="Psyche"
            value={psycheNum}
            icon={<BrainCircuit className="h-3.5 w-3.5" />}
            onClick={() => {
              setActiveCoreLayer("psyche");
              setTimeout(
                () =>
                  coreVibrationsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  }),
                150,
              );
            }}
          />
          <InfoCard
            title="Destiny"
            value={destinyNum}
            icon={<Sparkles className="h-3.5 w-3.5" />}
            onClick={() => {
              setActiveCoreLayer("destiny");
              setTimeout(
                () =>
                  coreVibrationsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  }),
                150,
              );
            }}
          />
          <InfoCard
            title="Kua"
            value={kuaNum}
            icon={<Compass className="h-3.5 w-3.5" />}
            onClick={() =>
              kuaRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              })
            }
          />
        </div>
      </div>
      <CoreVibrations
        ref={coreVibrationsRef}
        psycheNum={psycheNum}
        psychicMeaning={psychicMeaning}
        destinyNum={destinyNum}
        destinyMeaning={destinyMeaning}
        birthDay={birthDay}
        birthMonth={birthMonth}
        specialTraitMeaning={specialTraitMeaning}
        activeLayer={activeCoreLayer}
        onLayerChange={setActiveCoreLayer}
      />
      <div className="glass-card p-4" id="loshu-grid">
        <SH icon={<Grid className="h-4 w-4" />} title="Lo Shu Grid" />
        <LoShuGrid
          grid={loShuGrid}
          numberCounts={numberCounts}
          arrows={[...arrowsOfStrength, ...arrowsOfWeakness] as any}
          birthDate={birthDate}
        />
      </div>
      <div className="glass-card p-4">
        <SH icon={<Zap className="h-4 w-4" />} title="Missing Numbers" />
        <MissingNumbers numberCounts={numberCounts} />
      </div>
      <div className="glass-card p-4">
        <SH
          icon={<Layers className="h-4 w-4" />}
          title="Pinnacles & Challenges"
        />
        <PinnaclesSection
          destinyNum={destinyNum}
          birthDay={birthDay}
          birthMonth={birthMonth}
          birthYear={birthYear}
        />
      </div>
      <FateChambers
        ref={fateChambersRef}
        compoundNum={compoundNum}
        compoundMeaning={compoundMeaning}
        reducedCompoundNum={reducedCompoundNum}
        reducedCompoundMeaning={reducedCompoundMeaning}
        karmicFateNum={karmicFateNum}
        karmicFateMeaning={karmicFateMeaning}
        activeLayer={activeFateLayer}
        onLayerChange={setActiveFateLayer}
      />
      <PersonalYearTimeline
        birthDay={birthDay}
        birthMonth={birthMonth}
        birthYear={birthYear}
      />
      <div className="glass-card p-4">
        <SH
          icon={<CalendarDays className="h-4 w-4" />}
          title="Personal Year Wave"
        />
        <PersonalYearChart
          birthDay={birthDay}
          birthMonth={birthMonth}
          birthYear={birthYear}
          onYearSelect={handleYearSelect}
        />
      </div>
      {selectedPersonalYear && (
        <Accordion
          type="single"
          collapsible
          value={personalYearAccordionValue}
          onValueChange={setPersonalYearAccordionValue}
          ref={pyDetailRef}
        >
          <AccordionItem value="personal-year-detail" className="border-none">
            <div className="glass-card p-4">
              <AccordionTrigger className="font-cinzel text-sm text-primary uppercase tracking-wider">
                Year {selectedPersonalYear.year} · Personal Year{" "}
                {selectedPersonalYear.pyn}
                {selectedPersonalYear.pynClassic !== selectedPersonalYear.pyn
                  ? ` (Classic: ${selectedPersonalYear.pynClassic})`
                  : ""}
              </AccordionTrigger>
              <AccordionContent>
                <div
                  style={{
                    display: "flex",
                    gap: "0.4rem",
                    marginBottom: "0.75rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {(
                    [
                      "Year Theme",
                      "Direct Essence",
                      "Classic Essence",
                      "Manifestation",
                      "Synthesis",
                    ] as const
                  ).map((l, i) => {
                    const disabled =
                      (i === 1 && !selectedPersonalYear.compound) ||
                      (i === 2 && !selectedPersonalYear.compoundClassic) ||
                      (i === 3 &&
                        !selectedPersonalYear.compound &&
                        !selectedPersonalYear.compoundClassic) ||
                      (i === 4 && !selectedPersonalYear.dualEssenceSynthesis);
                    return (
                      <button
                        key={i}
                        disabled={disabled}
                        onClick={() => setActivePyTab(i)}
                        style={{
                          flex: 1,
                          padding: "0.3rem 0",
                          borderRadius: "0.4rem",
                          border:
                            activePyTab === i
                              ? "1px solid rgba(212,175,55,0.3)"
                              : "1px solid transparent",
                          background:
                            activePyTab === i
                              ? "rgba(212,175,55,0.12)"
                              : "rgba(255,255,255,0.04)",
                          fontFamily: "'Cinzel',serif",
                          fontSize: "0.52rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: disabled
                            ? "rgba(200,180,240,0.2)"
                            : activePyTab === i
                              ? "#d4af37"
                              : "rgba(200,180,240,0.4)",
                          cursor: disabled ? "default" : "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {l}
                        {i === 1 && selectedPersonalYear.compound
                          ? ` · ${selectedPersonalYear.compound}/${selectedPersonalYear.pyn}`
                          : ""}
                        {i === 2 && selectedPersonalYear.compoundClassic
                          ? ` · ${selectedPersonalYear.compoundClassic}/${selectedPersonalYear.pynClassic}`
                          : ""}
                      </button>
                    );
                  })}
                </div>
                {activePyTab === 0 && (
                  <AccordionContentWithPlayer
                    text={selectedPersonalYear.meaning}
                  />
                )}
                {activePyTab === 4 &&
                  selectedPersonalYear.dualEssenceSynthesis && (
                    <div>
                      <p
                        style={{
                          fontFamily: "'Cinzel',serif",
                          fontSize: "0.75rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "rgba(212,175,55,0.9)",
                          marginBottom: "0.35rem",
                        }}
                      >
                        {selectedPersonalYear.dualEssenceTitle}
                      </p>
                      {selectedPersonalYear.dualEssenceSubtitle && (
                        <p
                          style={{
                            fontFamily: "'Cinzel',serif",
                            fontSize: "0.55rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "rgba(200,180,240,0.38)",
                            marginBottom: "0.55rem",
                          }}
                        >
                          {selectedPersonalYear.dualEssenceSubtitle}
                        </p>
                      )}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.35rem",
                          marginBottom: "0.8rem",
                        }}
                      >
                        {typeof selectedPersonalYear.dualEssenceIntensity ===
                          "number" && (
                          <span
                            style={{
                              fontSize: "0.55rem",
                              fontFamily: "'Cinzel',serif",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "0.25rem",
                              background: "rgba(212,175,55,0.12)",
                              border: "1px solid rgba(212,175,55,0.3)",
                              color: "rgba(212,175,55,0.9)",
                            }}
                          >
                            Intensity{" "}
                            {selectedPersonalYear.dualEssenceIntensity}/100
                          </span>
                        )}
                        {selectedPersonalYear.dualEssencePolarity && (
                          <span
                            style={{
                              fontSize: "0.55rem",
                              fontFamily: "'Cinzel',serif",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "0.25rem",
                              background: "rgba(139,92,246,0.12)",
                              border: "1px solid rgba(139,92,246,0.3)",
                              color: "rgba(210,195,255,0.9)",
                            }}
                          >
                            {selectedPersonalYear.dualEssencePolarity}
                          </span>
                        )}
                      </div>
                      <FocusChips items={selectedPersonalYear.predictionFocusAreas} />
                      <AccordionContentWithPlayer
                        text={selectedPersonalYear.dualEssenceSynthesis}
                      />
                    </div>
                  )}
                {activePyTab === 1 && selectedPersonalYear.compound && (
                  <div>
                    {(selectedPersonalYear.compoundIsKarmicDebt ||
                      selectedPersonalYear.compoundIsMasterNumber) && (
                      <div
                        style={{
                          display: "flex",
                          gap: "0.4rem",
                          marginBottom: "0.6rem",
                        }}
                      >
                        {selectedPersonalYear.compoundIsKarmicDebt && (
                          <span
                            style={{
                              fontSize: "0.55rem",
                              fontFamily: "'Cinzel',serif",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "0.25rem",
                              background: "rgba(220,80,80,0.15)",
                              border: "1px solid rgba(220,80,80,0.3)",
                              color: "rgba(220,130,130,0.9)",
                            }}
                          >
                            Karmic Debt
                          </span>
                        )}
                        {selectedPersonalYear.compoundIsMasterNumber && (
                          <span
                            style={{
                              fontSize: "0.55rem",
                              fontFamily: "'Cinzel',serif",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "0.25rem",
                              background: "rgba(212,175,55,0.12)",
                              border: "1px solid rgba(212,175,55,0.3)",
                              color: "rgba(212,175,55,0.9)",
                            }}
                          >
                            Master Number
                          </span>
                        )}
                      </div>
                    )}
                    {selectedPersonalYear.compoundName && (
                      <p
                        style={{
                          fontFamily: "'Cinzel',serif",
                          fontSize: "0.75rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "rgba(212,175,55,0.85)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {selectedPersonalYear.compoundName}
                      </p>
                    )}
                    {selectedPersonalYear.compoundSymbolism && (
                      <p
                        style={{
                          fontSize: "0.78rem",
                          lineHeight: 1.65,
                          color: "rgba(210,195,240,0.6)",
                          fontStyle: "italic",
                          marginBottom: "0.75rem",
                          borderLeft: "2px solid rgba(212,175,55,0.2)",
                          paddingLeft: "0.75rem",
                        }}
                      >
                        {selectedPersonalYear.compoundSymbolism}
                      </p>
                    )}
                    {selectedPersonalYear.compoundEssence && (
                      <AccordionContentWithPlayer
                        text={selectedPersonalYear.compoundEssence}
                      />
                    )}
                  </div>
                )}
                {activePyTab === 2 && selectedPersonalYear.compoundClassic && (
                  <div>
                    <p
                      style={{
                        fontSize: "0.65rem",
                        fontFamily: "'Cinzel',serif",
                        letterSpacing: "0.08em",
                        color: "rgba(200,180,240,0.45)",
                        marginBottom: "0.6rem",
                      }}
                    >
                      Classic system — birth day and month reduced to a single
                      digit before summing (the older Chaldean convention, shown
                      alongside the direct calculation above).
                    </p>
                    {(selectedPersonalYear.compoundClassicIsKarmicDebt ||
                      selectedPersonalYear.compoundClassicIsMasterNumber) && (
                      <div
                        style={{
                          display: "flex",
                          gap: "0.4rem",
                          marginBottom: "0.6rem",
                        }}
                      >
                        {selectedPersonalYear.compoundClassicIsKarmicDebt && (
                          <span
                            style={{
                              fontSize: "0.55rem",
                              fontFamily: "'Cinzel',serif",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "0.25rem",
                              background: "rgba(220,80,80,0.15)",
                              border: "1px solid rgba(220,80,80,0.3)",
                              color: "rgba(220,130,130,0.9)",
                            }}
                          >
                            Karmic Debt
                          </span>
                        )}
                        {selectedPersonalYear.compoundClassicIsMasterNumber && (
                          <span
                            style={{
                              fontSize: "0.55rem",
                              fontFamily: "'Cinzel',serif",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "0.25rem",
                              background: "rgba(212,175,55,0.12)",
                              border: "1px solid rgba(212,175,55,0.3)",
                              color: "rgba(212,175,55,0.9)",
                            }}
                          >
                            Master Number
                          </span>
                        )}
                      </div>
                    )}
                    {selectedPersonalYear.compoundClassicName && (
                      <p
                        style={{
                          fontFamily: "'Cinzel',serif",
                          fontSize: "0.75rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "rgba(212,175,55,0.85)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {selectedPersonalYear.compoundClassicName}
                      </p>
                    )}
                    {selectedPersonalYear.compoundClassicSymbolism && (
                      <p
                        style={{
                          fontSize: "0.78rem",
                          lineHeight: 1.65,
                          color: "rgba(210,195,240,0.6)",
                          fontStyle: "italic",
                          marginBottom: "0.75rem",
                          borderLeft: "2px solid rgba(212,175,55,0.2)",
                          paddingLeft: "0.75rem",
                        }}
                      >
                        {selectedPersonalYear.compoundClassicSymbolism}
                      </p>
                    )}
                    {selectedPersonalYear.compoundClassicEssence && (
                      <AccordionContentWithPlayer
                        text={selectedPersonalYear.compoundClassicEssence}
                      />
                    )}
                  </div>
                )}
                {activePyTab === 3 &&
                  (selectedPersonalYear.compound ||
                    selectedPersonalYear.compoundClassic) && (
                    <div>
                      {selectedPersonalYear.compoundKarmic && (
                        <div style={{ marginBottom: "0.9rem" }}>
                          <p
                            style={{
                              fontFamily: "'Cinzel',serif",
                              fontSize: "0.6rem",
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              color: "rgba(212,175,55,0.7)",
                              marginBottom: "0.4rem",
                            }}
                          >
                            Karmic Dynamics — Direct (
                            {selectedPersonalYear.compound}/
                            {selectedPersonalYear.pyn})
                          </p>
                          <AccordionContentWithPlayer
                            text={selectedPersonalYear.compoundKarmic}
                          />
                        </div>
                      )}
                      {selectedPersonalYear.compoundClassicKarmic && (
                        <div style={{ marginBottom: "0.9rem" }}>
                          <p
                            style={{
                              fontFamily: "'Cinzel',serif",
                              fontSize: "0.6rem",
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              color: "rgba(212,175,55,0.7)",
                              marginBottom: "0.4rem",
                            }}
                          >
                            Karmic Dynamics — Classic (
                            {selectedPersonalYear.compoundClassic}/
                            {selectedPersonalYear.pynClassic})
                          </p>
                          <AccordionContentWithPlayer
                            text={selectedPersonalYear.compoundClassicKarmic}
                          />
                        </div>
                      )}
                      {selectedPersonalYear.compoundManifestation && (
                        <div style={{ marginBottom: "0.9rem" }}>
                          <p
                            style={{
                              fontFamily: "'Cinzel',serif",
                              fontSize: "0.6rem",
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              color: "rgba(212,175,55,0.7)",
                              marginBottom: "0.4rem",
                            }}
                          >
                            Manifestation Patterns — Direct (
                            {selectedPersonalYear.compound}/
                            {selectedPersonalYear.pyn})
                          </p>
                          <AccordionContentWithPlayer
                            text={selectedPersonalYear.compoundManifestation}
                          />
                        </div>
                      )}
                      {selectedPersonalYear.compoundClassicManifestation && (
                        <div>
                          <p
                            style={{
                              fontFamily: "'Cinzel',serif",
                              fontSize: "0.6rem",
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              color: "rgba(212,175,55,0.7)",
                              marginBottom: "0.4rem",
                            }}
                          >
                            Manifestation Patterns — Classic (
                            {selectedPersonalYear.compoundClassic}/
                            {selectedPersonalYear.pynClassic})
                          </p>
                          <AccordionContentWithPlayer
                            text={
                              selectedPersonalYear.compoundClassicManifestation
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}
              </AccordionContent>
            </div>
          </AccordionItem>
        </Accordion>
      )}
      <ZodiacSection
        birthDay={birthDay}
        birthMonth={birthMonth}
        birthYear={birthYear}
      />
      <div className="glass-card p-4" ref={arrowsRef}>
        <SH icon={<Activity className="h-4 w-4" />} title="Arrows of Power" />
        <Accordion type="multiple" className="w-full">
          {[...arrowsOfStrength, ...arrowsOfWeakness].map((arrow) => {
            const isShadow =
              arrow.type === "shadow" || arrow.type === "weakness";
            return (
              <AccordionItem
                value={arrow.name}
                key={arrow.name}
                className="glass-card px-4 mb-1 border-l-[3px] border-l-[#c8a84b]/40"
              >
                <AccordionTrigger>
                  <span
                    className={`text-left font-cinzel text-[0.7rem] uppercase tracking-wider flex items-center gap-2 ${isShadow ? "text-rose-400" : "text-emerald-400"}`}
                  >
                    {isShadow ? (
                      <ChevronRight className="h-3 w-3 rotate-90" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                    {arrow.name} ({arrow.numbers.join("-")})
                  </span>
                </AccordionTrigger>
                <AccordionContent className="font-body text-base leading-relaxed">
                  <LoshuArrowDetailPanel
                    arrowId={arrow.id}
                    existingMeaning={arrow.description}
                    birthDate={birthDate}
                    externalCounts={numberCounts as any}
                  />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
      <div className="glass-card p-4" ref={kuaRef}>
        <SH icon={<Compass className="h-4 w-4" />} title="Lucky Compass" />
        <LuckyCompass kuaNum={kuaNum} kuaAttributes={kuaAttributes as any} />
      </div>
    </div>
  );
}
// ── Pinnacles & Challenges ───────────────────────────────────────────────────
// ── LuckyCompass ──────────────────────────────────────────────────────────────
function LuckyCompass({
  kuaNum,
  kuaAttributes,
}: {
  kuaNum: number;
  kuaAttributes: {
    directions?: Record<string, string>;
    element?: string;
    trigram?: string;
    lunarMansion?: string;
    color?: string;
  };
}) {
  if (!kuaAttributes) return null;
  const dirEntries = Object.entries(kuaAttributes.directions ?? {}).slice(0, 8);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 }}
      >
        {kuaAttributes.element && (
          <span
            style={{
              fontSize: "0.7rem",
              padding: "2px 10px",
              borderRadius: 99,
              background: "rgba(160,120,240,0.12)",
              border: "1px solid rgba(160,120,240,0.3)",
              color: "rgba(200,180,250,0.8)",
            }}
          >
            Element: {kuaAttributes.element}
          </span>
        )}
        {kuaAttributes.color && (
          <span
            style={{
              fontSize: "0.7rem",
              padding: "2px 10px",
              borderRadius: 99,
              background: "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.3)",
              color: "rgba(212,175,55,0.9)",
            }}
          >
            Color: {kuaAttributes.color}
          </span>
        )}
        {kuaAttributes.trigram && (
          <span
            style={{
              fontSize: "0.7rem",
              padding: "2px 10px",
              borderRadius: 99,
              background: "rgba(100,200,200,0.1)",
              border: "1px solid rgba(100,200,200,0.25)",
              color: "rgba(120,210,210,0.8)",
            }}
          >
            Trigram: {kuaAttributes.trigram}
          </span>
        )}
      </div>
      {dirEntries.length > 0 && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}
        >
          {dirEntries.map(([dir, desc]) => (
            <div
              key={dir}
              style={{
                borderRadius: 10,
                border: "1px solid rgba(160,120,240,0.18)",
                background: "rgba(160,120,240,0.06)",
                padding: "8px 10px",
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  fontFamily: "'Cinzel',serif",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(212,175,55,0.85)",
                  marginBottom: 2,
                }}
              >
                {dir}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "rgba(200,185,250,0.8)",
                  lineHeight: 1.4,
                }}
              >
                {desc}
              </div>
            </div>
          ))}
        </div>
      )}
      {!dirEntries.length && (
        <p
          style={{
            fontSize: "0.8rem",
            color: "rgba(180,165,230,0.6)",
            fontStyle: "italic",
          }}
        >
          Kua {kuaNum} — direction data not available.
        </p>
      )}
    </div>
  );
}