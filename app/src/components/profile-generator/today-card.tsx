import * as React from "react";
import { CalendarDays } from "lucide-react";
import type { AstroInsightInput } from "./types";
import type { StoredSoul } from "./archivum-ui";

// A small, dependency-free "Today for you" card for the landing screen.
// It reads the pinned (or most recent) soul from the Archivum and shows the
// Personal Year / Month / Day numbers with a one-line theme, so returning
// visitors get something new every day without loading the full engine.

// Same rules as the app's engines (temporal-prediction-engine-v2 /
// personal-year-full): master numbers 11/22/33 are kept at every step.
const digitSum = (n: number) =>
  String(Math.abs(Math.trunc(n))).split("").reduce((a, d) => a + Number(d), 0);
const reduceNum = (n: number): number => {
  let v = Math.abs(Math.trunc(n));
  while (v > 9 && v !== 11 && v !== 22 && v !== 33) v = digitSum(v);
  return v;
};

export function personalNumbers(day: number, month: number, date = new Date()) {
  const cm = date.getMonth() + 1;
  const personalYear = reduceNum(day + month + digitSum(date.getFullYear()));
  const personalMonth = reduceNum(personalYear + cm);
  const personalDay = reduceNum(personalYear + cm + date.getDate());
  return { personalYear, personalMonth, personalDay };
}

const DAY_THEMES: Record<number, string> = {
  1: "Start something. Make the first move instead of waiting for one.",
  2: "Listen and cooperate. Small, patient gestures carry weight today.",
  3: "Express yourself. Write, talk, create, and let some joy in.",
  4: "Build and organise. Steady work on the basics pays off.",
  5: "Expect change. Stay flexible and say yes to something new.",
  6: "Tend to home and the people who rely on you.",
  7: "Step back and reflect. Study, rest, and trust your intuition.",
  8: "Handle money, decisions, and responsibility with confidence.",
  9: "Finish and let go. Clear out what no longer fits.",
  11: "A master day: trust flashes of insight and inspire someone.",
  22: "A master day: think big and lay down something that lasts.",
  33: "A master day: lead with compassion and generosity.",
};

export function TodayCard({
  history,
  onOpen,
}: {
  history: StoredSoul[];
  onOpen: (s: AstroInsightInput) => void;
}) {
  const soul = React.useMemo(() => {
    if (!history.length) return null;
    return history.find((h) => h.pinned) || history[0];
  }, [history]);
  if (!soul) return null;

  const day = Number(soul.day);
  const month = Number(soul.month);
  const { personalYear, personalMonth, personalDay } = personalNumbers(day, month);
  const firstName = String(soul.name).trim().split(/\s+/)[0];
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <section
      aria-label="Today for you"
      style={{
        maxWidth: 520,
        margin: "1.25rem auto 0",
        padding: "1rem 1.1rem",
        borderRadius: 16,
        background: "linear-gradient(135deg, rgba(20,8,50,0.85), rgba(30,12,65,0.85))",
        border: "1px solid rgba(212,175,55,0.3)",
        color: "rgba(231,221,255,0.92)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#d4af37" }}>
        <CalendarDays size={16} aria-hidden="true" />
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.8rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Today for {firstName}
        </h2>
      </div>
      <p style={{ fontSize: "0.8rem", color: "rgba(210,195,250,0.75)", margin: "0.3rem 0 0.75rem" }}>
        {today}
      </p>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
        {[
          ["Year", personalYear],
          ["Month", personalMonth],
          ["Day", personalDay],
        ].map(([label, value]) => (
          <div
            key={label as string}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "0.5rem 0.25rem",
              borderRadius: 12,
              background: "rgba(212,175,55,0.08)",
              border: "1px solid rgba(212,175,55,0.2)",
            }}
          >
            <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "#f1d98a" }}>{value}</div>
            <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(210,195,250,0.7)" }}>
              Personal {label}
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: "0.95rem", lineHeight: 1.5, margin: "0 0 0.85rem" }}>{DAY_THEMES[personalDay] || DAY_THEMES[reduceNum(digitSum(personalDay))]}</p>
      <button
        type="button"
        onClick={() => onOpen(soul)}
        style={{
          width: "100%",
          padding: "0.6rem",
          borderRadius: 12,
          border: "none",
          background: "linear-gradient(135deg, #d4af37 0%, #a07820 100%)",
          color: "#04001a",
          fontFamily: "'Cinzel', serif",
          fontSize: "0.8rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          cursor: "pointer",
        }}
      >
        Open {firstName}'s full reading
      </button>
    </section>
  );
}
