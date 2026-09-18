import * as React from "react";
import {
  CalendarDays,
  Bell,
  Star,
  Users,
  Heart,
  Briefcase,
  Smile,
  Upload,
  Download,
  Pin,
  Trash2,
  Pencil,
  Share2,
} from "lucide-react";
import type {
  AstroInsightInput,
  AstroInsightOutput,
  NumerologyData,
} from "./types";
import { SpeechPlayer } from "./speech-player";
import type { DailyForecast } from "@/lib/temporal-prediction-engine-v2";
import {
  generateDailyForecast,
  generateNotificationBatch,
} from "@/lib/temporal-prediction-engine-v2";
import {
  computePersonalYearNumber,
  reduceNum,
} from "@/lib/numerology/personal-year-full";
import {
  getCompoundForPYN,
  getClassicCompoundForPYN,
} from "@/lib/numerology/chaldean-pyn-compounds";
import { NEW_ASTROLOGY_DATA } from "@/lib/new-astrology";
import { cheiroPsychicNumbers } from "@/lib/numerology/cheiro-psychic-numbers";
import {
  buildSoulVitals,
  generateSoulResonance,
  getFamousTwins,
  getFamousSoulBank,
  getFamousSoulWeather,
  getCosmicTwinsForSoul,
  type SoulResonanceReport,
  type ResonanceLayer,
  type DomainScore,
  type FamousSoulVitals,
} from "@/lib/compatibility-engine";
export type StoredSoul = AstroInsightInput & {
  id?: string;
  timestamp?: number;
  pinned?: boolean;
};
const HARMONY: Record<number, number[]> = {
  1: [1, 4],
  2: [2, 7],
  3: [3, 6, 9],
  4: [4, 1],
  5: [5],
  6: [6, 3, 9],
  7: [7, 2],
  8: [8, 4],
  9: [9, 3, 6],
  11: [2, 7, 11],
  22: [4, 1, 22],
  33: [6, 3, 9, 33],
};
function reduceSingle(n: number): number {
  let v = Math.abs(n);
  while (v > 9)
    v = String(v)
      .split("")
      .reduce((a, d) => a + Number(d), 0);
  return v || 9;
}
function lifePath(
  s: Pick<AstroInsightInput, "day" | "month" | "year">,
): number {
  return reduceNum(
    Number(s.day) +
      Number(s.month) +
      String(s.year)
        .split("")
        .reduce((a, d) => a + Number(d), 0),
  );
}
function psychic(s: Pick<AstroInsightInput, "day">): number {
  return reduceSingle(Number(s.day));
}
function digitsOf(
  s: Pick<AstroInsightInput, "day" | "month" | "year">,
): number[] {
  return `${s.day}${s.month}${s.year}`
    .split("")
    .map(Number)
    .filter((n) => n > 0);
}
function zodiacAnimal(year: number): string {
  const animals = [
    "Rat",
    "Ox",
    "Tiger",
    "Rabbit",
    "Dragon",
    "Snake",
    "Horse",
    "Goat",
    "Monkey",
    "Rooster",
    "Dog",
    "Pig",
  ];
  return animals[
    (Number(year) - 4) % 12 < 0
      ? ((Number(year) - 4) % 12) + 12
      : (Number(year) - 4) % 12
  ];
}
const WEEKDAY_BY_NUMBER: Record<number, string[]> = {
  1: ["Sunday", "Monday"],
  2: ["Monday", "Friday", "Sunday"],
  3: ["Thursday", "Tuesday", "Friday"],
  4: ["Sunday", "Monday", "Saturday"],
  5: ["Wednesday", "Friday"],
  6: ["Friday", "Tuesday", "Thursday"],
  7: ["Monday", "Sunday"],
  8: ["Saturday", "Sunday", "Monday"],
  9: ["Tuesday", "Thursday", "Friday"],
};
const JOHARI_RELATIONS: Record<
  number,
  {
    planet: string;
    friends: number[];
    neutrals: number[];
    growth: number[];
    note: string;
  }
> = {
  1: {
    planet: "Sun",
    friends: [1, 2, 3, 9],
    neutrals: [5],
    growth: [4, 6, 7, 8],
    note: "Sun numbers respond to clarity, authority and visible respect.",
  },
  2: {
    planet: "Moon",
    friends: [1, 2, 3],
    neutrals: [4, 6, 7, 8, 9],
    growth: [5],
    note: "Moon numbers need tenderness, rhythm and emotional safety.",
  },
  3: {
    planet: "Jupiter",
    friends: [1, 2, 3, 9],
    neutrals: [4, 7, 8],
    growth: [5, 6],
    note: "Jupiter numbers bond through ethics, knowledge and shared direction.",
  },
  4: {
    planet: "Rahu",
    friends: [4, 5, 6, 8],
    neutrals: [3, 7],
    growth: [1, 2, 9],
    note: "Rahu numbers activate unconventional ambition and expose hidden restlessness.",
  },
  5: {
    planet: "Mercury",
    friends: [1, 3, 5, 6, 9],
    neutrals: [8],
    growth: [2, 4, 7],
    note: "Mercury numbers need movement, wit, trade, speech and mental freedom.",
  },
  6: {
    planet: "Venus",
    friends: [4, 5, 6, 8],
    neutrals: [3, 7, 9],
    growth: [1, 2],
    note: "Venus numbers bond through beauty, affection, comfort and shared pleasure.",
  },
  7: {
    planet: "Ketu",
    friends: [1, 2, 4, 7],
    neutrals: [3, 5, 6, 8, 9],
    growth: [],
    note: "Ketu numbers require space, intuition and spiritual or intellectual privacy.",
  },
  8: {
    planet: "Saturn",
    friends: [4, 5, 6, 8],
    neutrals: [3, 7],
    growth: [1, 2, 9],
    note: "Saturn numbers test duty, endurance, money, law and long-range loyalty.",
  },
  9: {
    planet: "Mars",
    friends: [1, 2, 3, 9],
    neutrals: [6, 7],
    growth: [4, 5, 8],
    note: "Mars numbers bond through courage, direct action and shared struggle.",
  },
};
function johariRelation(
  a: number,
  b: number,
): { score: number; label: string; note: string } {
  const x = reduceSingle(a);
  const y = reduceSingle(b);
  const ax = JOHARI_RELATIONS[x];
  const by = JOHARI_RELATIONS[y];
  if (x === y)
    return {
      score: 86,
      label: "same-number mirror",
      note: `Johari lens: both carry ${ax.planet}. Similarity creates recognition and ease, but can become passive unless the pair keeps a shared aim.`,
    };
  const friend = ax.friends.includes(y) || by.friends.includes(x);
  const growth = ax.growth.includes(y) || by.growth.includes(x);
  const neutral = ax.neutrals.includes(y) || by.neutrals.includes(x);
  if (friend)
    return {
      score: 82,
      label: "friendly planets",
      note: `Johari lens: ${ax.planet} and ${by.planet} are friendly. This brings ease, affection and low friction; the caution is relaxation without progress.`,
    };
  if (growth)
    return {
      score: 74,
      label: "growth-producing tension",
      note: `Johari lens: ${ax.planet} and ${by.planet} create alertness. Johari treats enemy/tension numbers as useful for growth because they keep each other active, awake and improving.`,
    };
  if (neutral)
    return {
      score: 58,
      label: "neutral planets",
      note: `Johari lens: ${ax.planet} and ${by.planet} neither strongly feed nor strongly provoke one another. This is workable, but it needs conscious purpose.`,
    };
  return {
    score: 50,
    label: "unclassified mixed field",
    note: `Johari lens: this pair is mixed; judge by conduct, maturity and the rest of the chart.`,
  };
}
function westernSign(day: number, month: number): string {
  const md = month * 100 + day;
  if (md >= 321 && md <= 419) return "Aries";
  if (md >= 420 && md <= 520) return "Taurus";
  if (md >= 521 && md <= 620) return "Gemini";
  if (md >= 621 && md <= 722) return "Cancer";
  if (md >= 723 && md <= 822) return "Leo";
  if (md >= 823 && md <= 922) return "Virgo";
  if (md >= 923 && md <= 1022) return "Libra";
  if (md >= 1023 && md <= 1121) return "Scorpio";
  if (md >= 1122 && md <= 1221) return "Sagittarius";
  if (md >= 1222 || md <= 119) return "Capricorn";
  if (md >= 120 && md <= 218) return "Aquarius";
  return "Pisces";
}
function combinedSign(
  s: Pick<AstroInsightInput, "day" | "month" | "year">,
): string {
  return `${westernSign(Number(s.day), Number(s.month))}/${zodiacAnimal(Number(s.year))}`;
}
const SECRET_FRIENDS: Record<string, string> = {
  Rat: "Ox",
  Ox: "Rat",
  Tiger: "Pig",
  Pig: "Tiger",
  Rabbit: "Dog",
  Dog: "Rabbit",
  Dragon: "Rooster",
  Rooster: "Dragon",
  Snake: "Monkey",
  Monkey: "Snake",
  Horse: "Goat",
  Goat: "Horse",
};
const ENEMIES: Record<string, string> = {
  Rat: "Horse",
  Horse: "Rat",
  Ox: "Goat",
  Goat: "Ox",
  Tiger: "Monkey",
  Monkey: "Tiger",
  Rabbit: "Rooster",
  Rooster: "Rabbit",
  Dragon: "Dog",
  Dog: "Dragon",
  Snake: "Pig",
  Pig: "Snake",
};
const TRIANGLES = [
  new Set(["Rat", "Dragon", "Monkey"]),
  new Set(["Ox", "Snake", "Rooster"]),
  new Set(["Tiger", "Horse", "Dog"]),
  new Set(["Rabbit", "Goat", "Pig"]),
] as const;
function chineseZodiacScore(
  aAnimal: string,
  bAnimal: string,
): { score: number; label: string; note: string } {
  if (aAnimal === bAnimal)
    return {
      score: 72,
      label: "same animal",
      note: `Chinese zodiac: both are ${aAnimal}. They understand each other's rhythm, but may double the same blind spot.`,
    };
  if (SECRET_FRIENDS[aAnimal] === bAnimal)
    return {
      score: 94,
      label: "secret friends",
      note: `Chinese zodiac: ${aAnimal} and ${bAnimal} are secret friends, a private support bond with unusually natural trust.`,
    };
  if (ENEMIES[aAnimal] === bAnimal)
    return {
      score: 24,
      label: "opposition pair",
      note: `Chinese zodiac: ${aAnimal} and ${bAnimal} are opposition signs. Attraction may exist, but life rhythm and priorities clash unless both are mature.`,
    };
  if (TRIANGLES.some((t) => t.has(aAnimal) && t.has(bAnimal)))
    return {
      score: 86,
      label: "affinity triangle",
      note: `Chinese zodiac: ${aAnimal} and ${bAnimal} share an affinity triangle, giving common instinct and easier collaboration.`,
    };
  return {
    score: 55,
    label: "ordinary zodiac relation",
    note: `Chinese zodiac: no major secret-friend, triangle or opposition signature; judge by the numerology and lived behaviour.`,
  };
}
function suzanneWhiteScore(
  a: StoredSoul,
  b: StoredSoul,
): { score: number; label: string; note: string } {
  const aSign = combinedSign(a);
  const bSign = combinedSign(b);
  const reverseSign = combinedSign(b);
  const text = (NEW_ASTROLOGY_DATA[aSign]?.compatibilities || "").toLowerCase();
  const reverseText = (
    NEW_ASTROLOGY_DATA[reverseSign]?.compatibilities || ""
  ).toLowerCase();
  const bWestern = westernSign(b.day, b.month).toLowerCase();
  const bAnimal = zodiacAnimal(b.year).toLowerCase();
  const aWestern = westernSign(a.day, a.month).toLowerCase();
  const aAnimal = zodiacAnimal(a.year).toLowerCase();
  const evaluate = (
    source: string,
    targetCombined: string,
    targetWestern: string,
    targetAnimal: string,
  ) => {
    const lowerCombined = targetCombined.toLowerCase();
    const avoidIndex = source.search(
      /stay away|avoid|leave|wide berth|poison|don’t|don't/,
    );
    const positive = avoidIndex >= 0 ? source.slice(0, avoidIndex) : source;
    const negative = avoidIndex >= 0 ? source.slice(avoidIndex) : "";
    if (
      negative.includes(lowerCombined) ||
      (negative.includes(targetWestern) && negative.includes(targetAnimal))
    )
      return -38;
    if (positive.includes(lowerCombined)) return 46;
    let points = 0;
    if (positive.includes(targetWestern)) points += 18;
    if (positive.includes(targetAnimal)) points += 18;
    if (negative.includes(targetWestern) || negative.includes(targetAnimal))
      points -= 12;
    return points;
  };
  const raw =
    50 +
    evaluate(text, bSign, bWestern, bAnimal) +
    evaluate(reverseText, aSign, aWestern, aAnimal) / 2;
  const score = Math.max(15, Math.min(98, Math.round(raw)));
  const label =
    score >= 86
      ? "Suzanne White recommended match"
      : score <= 35
        ? "Suzanne White caution match"
        : "Suzanne White mixed/unstated match";
  const note = `Suzanne White lens: ${aSign} compared with ${bSign}. The app reads the sign's compatibility paragraph mechanically: named recommendations raise the score, named avoidances lower it, and unstated pairings remain moderate.`;
  return { score, label, note };
}
function numberSeries(num: number): number[] {
  const target = reduceSingle(num);
  return Array.from({ length: 31 }, (_, i) => i + 1).filter(
    (d) => reduceSingle(d) === target,
  );
}
export function buildTodayTimingGuidance(
  soul: Pick<AstroInsightInput, "day" | "month" | "year">,
) {
  const p = psychic({ day: Number(soul.day) });
  const d = lifePath(soul);
  const cheiro = cheiroPsychicNumbers[p];
  const johariPsychic = JOHARI_RELATIONS[p];
  const johariDestiny = JOHARI_RELATIONS[reduceSingle(d)];
  const today = new Date();
  const todayNum = reduceSingle(today.getDate());
  const currentAge =
    today.getFullYear() -
    Number(soul.year) -
    (today >=
    new Date(today.getFullYear(), Number(soul.month) - 1, Number(soul.day))
      ? 0
      : 1);
  const yearNum = reduceSingle(today.getFullYear());
  const ownDates = numberSeries(p);
  const destinyDates = numberSeries(d);
  const johariFriendDates = Array.from(
    new Set(johariPsychic.friends.flatMap(numberSeries)),
  )
    .filter((n) => n <= 31)
    .sort((a, b) => a - b);
  const johariGrowthDates = Array.from(
    new Set(johariPsychic.growth.flatMap(numberSeries)),
  )
    .filter((n) => n <= 31)
    .sort((a, b) => a - b);
  const cheiroCompatibleDates = Array.from(
    new Set([p, ...(cheiro?.compatibleNumbers || [])].flatMap(numberSeries)),
  )
    .filter((n) => n <= 31)
    .sort((a, b) => a - b);
  const upcomingOwnDates = ownDates
    .filter((n) => n >= today.getDate())
    .slice(0, 5);
  const johariToday =
    todayNum === p
      ? "own-number day"
      : johariPsychic.friends.includes(todayNum)
        ? "friendly day"
        : johariPsychic.growth.includes(todayNum)
          ? "growth-tension day"
          : "neutral day";
  const ageSignal =
    reduceSingle(currentAge) === p ||
    reduceSingle(currentAge) === reduceSingle(d)
      ? `Current age ${currentAge} resonates with a core number.`
      : `Current age ${currentAge} does not reduce to a core number.`;
  const yearSignal =
    yearNum === p || yearNum === reduceSingle(d)
      ? `Universal year digit ${yearNum} activates a core number.`
      : `Universal year digit ${yearNum} is a background influence.`;
  return {
    psychicNumber: p,
    destinyNumber: d,
    cheiroPlanet: cheiro?.planet || johariPsychic.planet,
    cheiroLuckyDays: cheiro?.luckyDays.primary || WEEKDAY_BY_NUMBER[p] || [],
    cheiroStrongPeriods: cheiro?.strongPeriods || [],
    cheiroOwnDates: ownDates,
    cheiroCompatibleDates,
    johariPlanet: johariPsychic.planet,
    johariDestinyPlanet: johariDestiny.planet,
    johariPowerWeekdays: Array.from(
      new Set([
        ...(WEEKDAY_BY_NUMBER[p] || []),
        ...(WEEKDAY_BY_NUMBER[reduceSingle(d)] || []),
      ]),
    ),
    johariFriendlyDates: johariFriendDates,
    johariGrowthDates,
    destinyDates,
    upcomingOwnDates,
    johariToday,
    ageSignal,
    yearSignal,
    summary: `Cheiro emphasizes ${cheiro?.planet || johariPsychic.planet} lucky days/dates and strong periods; Johari adds planetary friendship, neutral and growth-tension timing. Today is a ${johariToday}. ${ageSignal} ${yearSignal}`,
  };
}
function sameOrHarmonious(a: number, b: number): number {
  if (a === b) return 100;
  if ((HARMONY[a] || []).includes(b) || (HARMONY[b] || []).includes(a))
    return 82;
  if (reduceSingle(a) === reduceSingle(b)) return 72;
  return 42;
}
function barColor(score: number): string {
  if (score >= 85) return "#f1d98a";
  if (score >= 70) return "#86efac";
  if (score >= 55) return "#67e8f9";
  return "#c4b5fd";
}
function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = barColor(score);
  return (
    <div style={{ marginBottom: "0.55rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.75rem",
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: "0.68rem", color: "rgba(231,221,255,0.84)" }}>
          {label}
        </span>
        <span
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "0.66rem",
            color,
            fontWeight: 800,
          }}
        >
          {Math.round(score)}%
        </span>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 99,
          background: "rgba(8,7,20,0.95)",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.max(3, Math.min(100, score))}%`,
            borderRadius: 99,
            background: `linear-gradient(90deg, ${color}, rgba(167,139,250,0.9))`,
            boxShadow: `0 0 14px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}
function Panel({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        border: "1px solid rgba(212,175,55,0.18)",
        background:
          "linear-gradient(135deg, rgba(16,8,42,0.96), rgba(38,16,68,0.72))",
        borderRadius: "1.1rem",
        padding: "1rem",
        marginBottom: "1rem",
        boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          marginBottom: "0.8rem",
        }}
      >
        {icon && (
          <div style={{ color: "#d4af37", display: "flex" }}>{icon}</div>
        )}
        <div>
          <div
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#d4af37",
              fontWeight: 800,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: "0.62rem",
                color: "rgba(200,180,240,0.48)",
                marginTop: 2,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
function tinyButtonStyle(color = "#d4af37"): React.CSSProperties {
  return {
    border: `1px solid ${color}55`,
    color,
    background: `${color}14`,
    borderRadius: 10,
    padding: "0.42rem 0.6rem",
    fontFamily: "'Cinzel',serif",
    fontSize: "0.55rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
  };
}
export function TodaySurface({
  primarySoul,
  history,
  onLoad,
  onNewSoul,
  onOpenArchivum,
  onImportArchivum,
  onExportArchivum,
}: {
  primarySoul: StoredSoul | null;
  history: StoredSoul[];
  onLoad: (s: AstroInsightInput) => void;
  onNewSoul: () => void;
  onOpenArchivum: () => void;
  onImportArchivum: () => void;
  onExportArchivum: () => void;
}) {
  const today = React.useMemo(
    () =>
      primarySoul
        ? generateDailyForecast(
            primarySoul.day,
            primarySoul.month,
            primarySoul.year,
          )
        : null,
    [primarySoul],
  );
  const batch = React.useMemo(
    () =>
      primarySoul
        ? generateNotificationBatch(
            primarySoul.day,
            primarySoul.month,
            primarySoul.year,
            14,
          )
        : [],
    [primarySoul],
  );
  const year = new Date().getFullYear();
  const timing = React.useMemo(
    () => (primarySoul ? buildTodayTimingGuidance(primarySoul) : null),
    [primarySoul],
  );
  if (!primarySoul || !today || !timing) {
    return (
      <Panel
        title="Today"
        subtitle="Save or pin a soul to turn the app into a daily compass"
        icon={<CalendarDays size={18} />}
      >
        <p
          style={{
            color: "rgba(231,221,255,0.76)",
            fontSize: "0.84rem",
            lineHeight: 1.65,
            marginBottom: "0.9rem",
          }}
        >
          Generate a profile once, then pin it in the Archivum. The home screen
          will show the soul's personal day, lucky-day status, upcoming
          notification-worthy timing windows, and family/soul weather.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button style={tinyButtonStyle()} onClick={onNewSoul}>
            Generate Profile
          </button>
          <button style={tinyButtonStyle("#a78bfa")} onClick={onOpenArchivum}>
            Open Archivum
          </button>
          <button style={tinyButtonStyle("#67e8f9")} onClick={onImportArchivum}>
            Import
          </button>
        </div>
      </Panel>
    );
  }
  return (
    <>
      <Panel
        title="Today’s Compass"
        subtitle={`${primarySoul.name} · ${today.date} · Personal Year ${computePersonalYearNumber(primarySoul.day, primarySoul.month, year)}`}
        icon={<CalendarDays size={18} />}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: "0.55rem",
            marginBottom: "0.8rem",
          }}
        >
          <MiniStat label="Personal Day" value={today.personalDay} />
          <MiniStat label="Universal Day" value={today.universalDay} />
          <MiniStat
            label="Power"
            value={
              today.isPowerWindow
                ? "YES"
                : today.isLuckyDay || today.isLuckyDate
                  ? "OPEN"
                  : "—"
            }
          />
        </div>
        <p
          style={{
            color: "rgba(231,221,255,0.82)",
            fontSize: "0.86rem",
            lineHeight: 1.68,
            margin: "0 0 0.8rem",
          }}
        >
          <b style={{ color: "#f1d98a" }}>{today.focus}</b>
          <br />
          {today.shortNarrative}
        </p>
        {today.notificationAlert && (
          <div
            style={{
              padding: "0.72rem",
              borderRadius: 14,
              border: "1px solid rgba(251,191,36,0.25)",
              background: "rgba(251,191,36,0.08)",
              color: "rgba(254,243,199,0.92)",
              fontSize: "0.78rem",
              lineHeight: 1.55,
            }}
          >
            {today.notificationAlert}
          </div>
        )}
        <div
          style={{
            marginTop: "0.8rem",
            padding: "0.72rem",
            borderRadius: 14,
            background: "rgba(103,232,249,0.06)",
            border: "1px solid rgba(103,232,249,0.16)",
            color: "rgba(225,240,255,0.86)",
            fontSize: "0.74rem",
            lineHeight: 1.58,
          }}
        >
          <b style={{ color: "#67e8f9" }}>Cheiro + Johari timing:</b>{" "}
          {timing.summary}
          <div style={{ marginTop: "0.45rem" }}>
            <b>Cheiro lucky weekdays:</b>{" "}
            {timing.cheiroLuckyDays.join(", ") || "—"}
            <br />
            <b>Cheiro dates:</b> own {timing.cheiroOwnDates.join(", ")} ·
            compatible {timing.cheiroCompatibleDates.slice(0, 12).join(", ")}
            <br />
            <b>Cheiro strong periods:</b>{" "}
            {timing.cheiroStrongPeriods.join("; ") || "—"}
            <br />
            <b>Johari weekdays:</b>{" "}
            {timing.johariPowerWeekdays.join(", ") || "—"}
            <br />
            <b>Johari friendly dates:</b>{" "}
            {timing.johariFriendlyDates.slice(0, 14).join(", ") || "—"}
            <br />
            <b>Johari growth-tension dates:</b>{" "}
            {timing.johariGrowthDates.slice(0, 14).join(", ") || "—"}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginTop: "0.85rem",
          }}
        >
          <button style={tinyButtonStyle()} onClick={() => onLoad(primarySoul)}>
            Open Full Reading
          </button>
          <button style={tinyButtonStyle("#a78bfa")} onClick={onNewSoul}>
            New Soul
          </button>
          <button style={tinyButtonStyle("#67e8f9")} onClick={onExportArchivum}>
            Backup Archivum
          </button>
        </div>
      </Panel>
      {batch.length > 0 && (
        <Panel
          title="Upcoming Timing Alerts"
          subtitle="Next 14 days · generated locally/offline"
          icon={<Bell size={18} />}
        >
          <div style={{ display: "grid", gap: "0.55rem" }}>
            {batch.slice(0, 5).map((f) => (
              <div
                key={`${f.date}-${f.personalDay}`}
                style={{
                  padding: "0.65rem 0.7rem",
                  borderRadius: 13,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: "0.58rem",
                    letterSpacing: "0.1em",
                    color: "#d4af37",
                    textTransform: "uppercase",
                  }}
                >
                  {f.date} · PD {f.personalDay}
                </div>
                <div
                  style={{
                    color: "rgba(231,221,255,0.78)",
                    fontSize: "0.74rem",
                    lineHeight: 1.55,
                    marginTop: 3,
                  }}
                >
                  {f.notificationAlert}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
      {primarySoul && <FamousPersonalYearMirrors soul={primarySoul} />}
      {history.length > 0 && (
        <SoulWeatherDashboard history={history} onLoad={onLoad} />
      )}
      {history.length >= 1 && <SoulResonancePanel history={history} />}
    </>
  );
}
 
function FamousPersonalYearMirrors({ soul }: { soul: StoredSoul }) {
  const targetYear = new Date().getFullYear();
  const mirrors = React.useMemo(() => getFamousSoulWeather(soul, targetYear, 8), [soul, targetYear]);
  if (!mirrors.length) return null;
  return (
    <Panel
      title="Famous Personal-Year Mirrors"
      subtitle={`Famous-birthday bank · ${targetYear} · same current personal-year weather`}
      icon={<Star size={18} />}
    >
      <div style={{ display: "grid", gap: "0.55rem" }}>
        {mirrors.map((m) => (
          <div key={m.soul.id} style={{ padding: "0.65rem 0.7rem", borderRadius: 13, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem" }}>
              <b style={{ color: "rgba(248,250,252,0.92)", fontSize: "0.82rem" }}>{m.soul.name}</b>
              <span style={{ color: "#d4af37", fontFamily: "'Cinzel',serif", fontSize: "0.62rem" }}>{m.score}%</span>
            </div>
            <div style={{ color: "rgba(200,180,240,0.55)", fontSize: "0.64rem", marginTop: 3 }}>
              {m.directName} · Classic {m.classicName}
            </div>
            <div style={{ color: "rgba(231,221,255,0.72)", fontSize: "0.68rem", lineHeight: 1.55, marginTop: 4 }}>
              {m.reasons.join(" · ")}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid rgba(212,175,55,0.16)",
        background: "rgba(255,255,255,0.035)",
        borderRadius: 14,
        padding: "0.65rem 0.5rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "'Cinzel',serif",
          color: "#f1d98a",
          fontSize: "1rem",
          fontWeight: 800,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.52rem",
          color: "rgba(200,180,240,0.48)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
    </div>
  );
}
export function SoulWeatherDashboard({
  history,
  onLoad,
}: {
  history: StoredSoul[];
  onLoad: (s: AstroInsightInput) => void;
}) {
  const year = new Date().getFullYear();
  return (
    <Panel
      title="Soul Weather"
      subtitle="Current personal-year climate for saved souls"
      icon={<Star size={18} />}
    >
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {history.slice(0, 8).map((s) => (
          <button
            key={s.id || `${s.name}-${s.day}-${s.month}-${s.year}`}
            onClick={() => onLoad(s)}
            style={{
              width: "100%",
              textAlign: "left",
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.035)",
              borderRadius: 13,
              padding: "0.68rem 0.75rem",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    color: "rgba(248,250,252,0.92)",
                    fontWeight: 700,
                    fontSize: "0.84rem",
                  }}
                >
                  {s.pinned ? "★ " : ""}
                  {s.name}
                </div>
                <div
                  style={{
                    color: "rgba(200,180,240,0.45)",
                    fontSize: "0.62rem",
                  }}
                >
                  {s.day}/{s.month}/{s.year}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "'Cinzel',serif",
                  color: "#d4af37",
                  fontSize: "0.72rem",
                }}
              >
                PY {computePersonalYearNumber(s.day, s.month, year)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </Panel>
  );
}
type EvidencePolarity = "positive" | "negative" | "mixed";
type ResonanceDomain =
  | "emotional"
  | "mental"
  | "spiritual"
  | "material"
  | "growth"
  | "longevity"
  | "communication"
  | "trust"
  | "passion"
  | "timing"
  | "recovery"
  | "purpose"
  | "challenge";
interface ResonanceEvidence {
  polarity: EvidencePolarity;
  domain: ResonanceDomain;
  weight: number;
  title: string;
  detail: string;
  systems: string[];
}
interface RelationshipAnalysis {
  archetype: string;
  archetypeSubtitle: string;
  essence: string;
  confidence: "High" | "Medium" | "Low";
  evidence: ResonanceEvidence[];
  scores: Record<ResonanceDomain, number>;
  sections: {
    emotional: string;
    mental: string;
    purpose: string;
    conflict: string;
    hiddenStrength: string;
    missingEnergy: string;
    timing: string;
    future: string;
    advice: string;
    final: string;
  };
  timeline: Array<{
    title: string;
    text: string;
    tone: "gold" | "violet" | "green" | "rose";
  }>;
  aSign: string;
  bSign: string;
}
const ARROWS: Array<{ name: string; cells: number[]; theme: string }> = [
  {
    name: "Determination Arrow",
    cells: [1, 5, 9],
    theme: "will, persistence and spiritual stamina",
  },
  {
    name: "Planning Arrow",
    cells: [1, 2, 3],
    theme: "thinking, planning and communication",
  },
  {
    name: "Emotional Arrow",
    cells: [2, 5, 8],
    theme: "emotional exchange and relational sensitivity",
  },
  {
    name: "Practical Arrow",
    cells: [4, 5, 6],
    theme: "work, body, money and daily discipline",
  },
  {
    name: "Action Arrow",
    cells: [7, 8, 9],
    theme: "action, execution and outward push",
  },
  {
    name: "Spiritual Arrow",
    cells: [3, 5, 7],
    theme: "faith, inner perception and intuitive meaning",
  },
  {
    name: "Will Arrow",
    cells: [1, 4, 7],
    theme: "purpose, backbone and self-direction",
  },
  {
    name: "Talent Arrow",
    cells: [3, 6, 9],
    theme: "talent, memory and expressive gifts",
  },
];
function numberCounts(
  s: Pick<AstroInsightInput, "day" | "month" | "year">,
): Record<number, number> {
  const counts: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };
  digitsOf(s).forEach((n) => {
    counts[n] = (counts[n] || 0) + 1;
  });
  return counts;
}
function missingNumbers(
  s: Pick<AstroInsightInput, "day" | "month" | "year">,
): number[] {
  const c = numberCounts(s);
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !c[n]);
}
function dominantNumbers(
  s: Pick<AstroInsightInput, "day" | "month" | "year">,
): number[] {
  const c = numberCounts(s);
  return Object.entries(c)
    .filter(([, v]) => v >= 2)
    .map(([k]) => Number(k));
}
function arrowState(
  s: Pick<AstroInsightInput, "day" | "month" | "year">,
  arrow: { cells: number[] },
): "strength" | "void" | "partial" {
  const c = numberCounts(s);
  if (arrow.cells.every((n) => c[n] > 0)) return "strength";
  if (arrow.cells.every((n) => !c[n])) return "void";
  return "partial";
}
function qualitative(score: number): string {
  if (score >= 82) return "Very High";
  if (score >= 68) return "High";
  if (score >= 54) return "Moderate";
  if (score >= 40) return "Low";
  return "Fragile";
}
function confidenceFrom(
  evidence: ResonanceEvidence[],
  domains: ResonanceDomain[],
): "High" | "Medium" | "Low" {
  const systems = new Set(
    evidence
      .filter((e) => domains.includes(e.domain))
      .flatMap((e) => e.systems),
  );
  if (systems.size >= 5) return "High";
  if (systems.size >= 3) return "Medium";
  return "Low";
}
function addEvidence(evidence: ResonanceEvidence[], ev: ResonanceEvidence) {
  evidence.push(ev);
}
function clampScore(n: number): number {
  return Math.max(5, Math.min(98, Math.round(n)));
}
function applyEvidence(
  evidence: ResonanceEvidence[],
): Record<ResonanceDomain, number> {
  const scores: Record<ResonanceDomain, number> = {
    emotional: 50,
    mental: 50,
    spiritual: 50,
    material: 50,
    growth: 50,
    longevity: 50,
    communication: 50,
    trust: 50,
    passion: 50,
    timing: 50,
    recovery: 50,
    purpose: 50,
    challenge: 38,
  };
  evidence.forEach((ev) => {
    const direction =
      ev.polarity === "positive" ? 1 : ev.polarity === "negative" ? -1 : 0.35;
    scores[ev.domain] += direction * ev.weight;
    if (ev.polarity === "negative") scores.challenge += ev.weight * 0.55;
    if (ev.polarity === "mixed") {
      scores.growth += ev.weight * 0.35;
      scores.challenge += ev.weight * 0.25;
    }
  });
  (Object.keys(scores) as ResonanceDomain[]).forEach((k) => {
    scores[k] = clampScore(scores[k]);
  });
  return scores;
}
function relationshipSeason(
  py: number,
):
  | "launch"
  | "cooperation"
  | "expression"
  | "foundation"
  | "freedom"
  | "duty"
  | "retreat"
  | "harvest"
  | "completion" {
  const n = reduceSingle(py);
  return (
    {
      1: "launch",
      2: "cooperation",
      3: "expression",
      4: "foundation",
      5: "freedom",
      6: "duty",
      7: "retreat",
      8: "harvest",
      9: "completion",
    } as const
  )[n] ?? "launch";
}
function getCompoundTone(s: StoredSoul, year: number): string {
  const direct = getCompoundForPYN(s.day, s.month, year);
  const classic = getClassicCompoundForPYN(s.day, s.month, year);
  return (
    [
      direct ? `${direct.compound}/${direct.reduced} ${direct.name}` : "",
      classic ? `${classic.compound}/${classic.reduced} ${classic.name}` : "",
    ]
      .filter(Boolean)
      .join(" × ") || `PY ${computePersonalYearNumber(s.day, s.month, year)}`
  );
}
function buildRelationshipAnalysis(
  a: StoredSoul,
  b: StoredSoul,
): RelationshipAnalysis {
  const evidence: ResonanceEvidence[] = [];
  const aPsychic = psychic(a),
    bPsychic = psychic(b);
  const aDestiny = lifePath(a),
    bDestiny = lifePath(b);
  const aAnimal = zodiacAnimal(a.year),
    bAnimal = zodiacAnimal(b.year);
  const aPY = computePersonalYearNumber(
    a.day,
    a.month,
    new Date().getFullYear(),
  );
  const bPY = computePersonalYearNumber(
    b.day,
    b.month,
    new Date().getFullYear(),
  );
  const aNextPY = computePersonalYearNumber(
    a.day,
    a.month,
    new Date().getFullYear() + 1,
  );
  const bNextPY = computePersonalYearNumber(
    b.day,
    b.month,
    new Date().getFullYear() + 1,
  );
  const cheiroPsychic = sameOrHarmonious(aPsychic, bPsychic);
  const cheiroDestiny = sameOrHarmonious(aDestiny, bDestiny);
  const johariPsychic = johariRelation(aPsychic, bPsychic);
  const johariDestiny = johariRelation(aDestiny, bDestiny);
  const chinese = chineseZodiacScore(aAnimal, bAnimal);
  const suzanne = suzanneWhiteScore(a, b);
  if (cheiroPsychic >= 80)
    addEvidence(evidence, {
      polarity: "positive",
      domain: "emotional",
      weight: 12,
      title: "Natural psychic recognition",
      detail: `The psychic numbers ${aPsychic} and ${bPsychic} recognize one another easily. This gives instinctive rapport before either person explains themselves.`,
      systems: ["Cheiro Psychic"],
    });
  else if (cheiroPsychic < 55)
    addEvidence(evidence, {
      polarity: "mixed",
      domain: "emotional",
      weight: 9,
      title: "Different instinctive tempo",
      detail: `The psychic numbers ${aPsychic} and ${bPsychic} do not naturally relax into the same rhythm. Attraction can still exist, but patience must be learned.`,
      systems: ["Cheiro Psychic"],
    });
  if (johariPsychic.score >= 78)
    addEvidence(evidence, {
      polarity: "positive",
      domain: "communication",
      weight: 11,
      title: "Johari psychic support",
      detail: johariPsychic.note,
      systems: ["Harish Johari Psychic"],
    });
  else if (johariPsychic.label.includes("growth"))
    addEvidence(evidence, {
      polarity: "mixed",
      domain: "growth",
      weight: 12,
      title: "Growth-producing psychic tension",
      detail: johariPsychic.note,
      systems: ["Harish Johari Psychic"],
    });
  else if (johariPsychic.score < 55)
    addEvidence(evidence, {
      polarity: "negative",
      domain: "communication",
      weight: 9,
      title: "Psychic misread risk",
      detail: johariPsychic.note,
      systems: ["Harish Johari Psychic"],
    });
  if (cheiroDestiny >= 80 || johariDestiny.score >= 78)
    addEvidence(evidence, {
      polarity: "positive",
      domain: "purpose",
      weight: 12,
      title: "Long-range mission support",
      detail: `Destiny/life-path comparison shows the two missions can cooperate. ${johariDestiny.note}`,
      systems: ["Cheiro Destiny", "Harish Johari Destiny"],
    });
  else if (johariDestiny.label.includes("growth"))
    addEvidence(evidence, {
      polarity: "mixed",
      domain: "purpose",
      weight: 12,
      title: "Different missions, useful pressure",
      detail: `The long-range paths are not identical. ${johariDestiny.note}`,
      systems: ["Harish Johari Destiny"],
    });
  else if (cheiroDestiny < 55)
    addEvidence(evidence, {
      polarity: "negative",
      domain: "longevity",
      weight: 10,
      title: "Long-term direction mismatch",
      detail: `Life-path harmony is low, so the relationship needs a conscious shared mission rather than relying on chemistry.`,
      systems: ["Cheiro Destiny"],
    });
  if (suzanne.score >= 82)
    addEvidence(evidence, {
      polarity: "positive",
      domain: "passion",
      weight: 14,
      title: "Suzanne White attraction signature",
      detail: suzanne.note,
      systems: ["Suzanne White New Astrology"],
    });
  else if (suzanne.score <= 38)
    addEvidence(evidence, {
      polarity: "negative",
      domain: "passion",
      weight: 13,
      title: "Suzanne White caution signature",
      detail: suzanne.note,
      systems: ["Suzanne White New Astrology"],
    });
  else
    addEvidence(evidence, {
      polarity: "mixed",
      domain: "passion",
      weight: 6,
      title: "Suzanne White does not strongly bless or forbid",
      detail: suzanne.note,
      systems: ["Suzanne White New Astrology"],
    });
  if (chinese.score >= 84)
    addEvidence(evidence, {
      polarity: "positive",
      domain: "trust",
      weight: 12,
      title: "Chinese zodiac support",
      detail: chinese.note,
      systems: ["Chinese Zodiac"],
    });
  else if (chinese.score <= 35)
    addEvidence(evidence, {
      polarity: "negative",
      domain: "emotional",
      weight: 13,
      title: "Chinese zodiac conflict rhythm",
      detail: chinese.note,
      systems: ["Chinese Zodiac"],
    });
  else
    addEvidence(evidence, {
      polarity: "mixed",
      domain: "trust",
      weight: 5,
      title: "Chinese zodiac is moderate",
      detail: chinese.note,
      systems: ["Chinese Zodiac"],
    });
  const aMissing = missingNumbers(a),
    bMissing = missingNumbers(b);
  const aDigits = new Set(digitsOf(a)),
    bDigits = new Set(digitsOf(b));
  const aFilled = aMissing.filter((n) => bDigits.has(n));
  const bFilled = bMissing.filter((n) => aDigits.has(n));
  const sharedMissing = aMissing.filter((n) => bMissing.includes(n));
  if (aFilled.length || bFilled.length)
    addEvidence(evidence, {
      polarity: "positive",
      domain: "growth",
      weight: Math.min(16, 5 + aFilled.length + bFilled.length),
      title: "Missing-energy completion",
      detail: `${b.name} fills ${a.name}'s missing ${aFilled.join(", ") || "—"}; ${a.name} fills ${b.name}'s missing ${bFilled.join(", ") || "—"}. This creates the feeling of energetic completion.`,
      systems: ["Lo Shu Missing Numbers"],
    });
  if (sharedMissing.length >= 3)
    addEvidence(evidence, {
      polarity: "negative",
      domain: "material",
      weight: 12,
      title: "Shared missing-number blind spot",
      detail: `Both charts lack ${sharedMissing.join(", ")}. These themes are not naturally supplied by either person and must be built as habits.`,
      systems: ["Lo Shu Missing Numbers"],
    });
  const sharedDominants = dominantNumbers(a).filter((n) =>
    dominantNumbers(b).includes(n),
  );
  if (sharedDominants.length)
    addEvidence(evidence, {
      polarity: "mixed",
      domain: "challenge",
      weight: 8,
      title: "Dominant-vibration amplification",
      detail: `Both charts emphasize ${sharedDominants.join(", ")}. This can feel powerful, but it also doubles the same instinct and may create stubbornness.`,
      systems: ["Dominant Numbers"],
    });
  const sharedArrows: string[] = [];
  const mutualVoidArrows: string[] = [];
  const fillArrow: string[] = [];
  ARROWS.forEach((ar) => {
    const as = arrowState(a, ar),
      bs = arrowState(b, ar);
    if (as === "strength" && bs === "strength") sharedArrows.push(ar.name);
    if (as === "void" && bs === "void") mutualVoidArrows.push(ar.name);
    if (
      (as === "void" && bs === "strength") ||
      (bs === "void" && as === "strength")
    )
      fillArrow.push(ar.name);
  });
  if (sharedArrows.length)
    addEvidence(evidence, {
      polarity: "positive",
      domain: "mental",
      weight: 10,
      title: "Arrow reinforcement",
      detail: `Shared strength arrows: ${sharedArrows.join(", ")}. These are places where the two of you naturally understand the same mode of functioning.`,
      systems: ["Lo Shu Arrows"],
    });
  if (fillArrow.length)
    addEvidence(evidence, {
      polarity: "positive",
      domain: "growth",
      weight: 11,
      title: "Arrow completion",
      detail: `One chart supplies what the other lacks in ${fillArrow.join(", ")}. This can feel like mentoring, fascination, or relief.`,
      systems: ["Lo Shu Arrows"],
    });
  if (mutualVoidArrows.length)
    addEvidence(evidence, {
      polarity: "negative",
      domain: "recovery",
      weight: 9,
      title: "Shared arrow void",
      detail: `Both charts lack ${mutualVoidArrows.join(", ")}. Conflict recovery requires deliberate systems because neither person instinctively carries that line.`,
      systems: ["Lo Shu Arrows"],
    });
  const active = new Set(["launch", "expression", "freedom", "harvest"]);
  const inward = new Set([
    "cooperation",
    "foundation",
    "retreat",
    "completion",
  ]);
  const seasonA = relationshipSeason(aPY),
    seasonB = relationshipSeason(bPY);
  if (seasonA === seasonB)
    addEvidence(evidence, {
      polarity: "positive",
      domain: "timing",
      weight: 12,
      title: "Same personal-year climate",
      detail: `Both are in a ${seasonA} season. The relationship feels seasonally aligned because life is asking similar things from each person.`,
      systems: ["Personal Year"],
    });
  else if (
    (active.has(seasonA) && inward.has(seasonB)) ||
    (active.has(seasonB) && inward.has(seasonA))
  )
    addEvidence(evidence, {
      polarity: "mixed",
      domain: "timing",
      weight: 14,
      title: "Opposite personal-year seasons",
      detail: `${a.name} is in ${seasonA}; ${b.name} is in ${seasonB}. One person may push outward while the other simplifies, waits, heals or completes.`,
      systems: ["Personal Year"],
    });
  else
    addEvidence(evidence, {
      polarity: "mixed",
      domain: "timing",
      weight: 7,
      title: "Different but workable seasons",
      detail: `Current personal years differ: ${a.name} is in ${seasonA}, ${b.name} is in ${seasonB}.`,
      systems: ["Personal Year"],
    });
  const currentYear = new Date().getFullYear();
  const aComp = getCompoundTone(a, currentYear),
    bComp = getCompoundTone(b, currentYear);
  if (aComp && bComp)
    addEvidence(evidence, {
      polarity: "mixed",
      domain: "timing",
      weight: 6,
      title: "Compound-year weather",
      detail: `Current compound weather: ${a.name}: ${aComp}; ${b.name}: ${bComp}. This modifies the relationship season without overriding the core bond.`,
      systems: ["Compound Personal Year"],
    });
  const masters = [aPsychic, bPsychic, aDestiny, bDestiny, aPY, bPY].filter(
    (n) => [11, 22, 33].includes(n),
  );
  if (masters.length)
    addEvidence(evidence, {
      polarity: "mixed",
      domain: "spiritual",
      weight: 10,
      title: "Master-number voltage",
      detail: `Master numbers appear in the pair (${masters.join(", ")}). This makes the relationship feel more meaningful, but also more sensitive and demanding.`,
      systems: ["Master Numbers"],
    });
  const scores = applyEvidence(evidence);
  const archetype = chooseRelationshipArchetype(scores, evidence);
  const confidence = confidenceFrom(evidence, [
    "emotional",
    "purpose",
    "timing",
    "growth",
    "trust",
    "passion",
  ]);
  const positiveCount = evidence.filter(
    (e) => e.polarity === "positive",
  ).length;
  const negativeCount = evidence.filter(
    (e) => e.polarity === "negative",
  ).length;
  const mixedCount = evidence.filter((e) => e.polarity === "mixed").length;
  const essence = buildEssence(
    a,
    b,
    archetype,
    scores,
    positiveCount,
    negativeCount,
    mixedCount,
  );
  return {
    archetype: archetype.title,
    archetypeSubtitle: archetype.subtitle,
    essence,
    confidence,
    evidence,
    scores,
    sections: buildRelationshipSections(a, b, scores, evidence, {
      aPY,
      bPY,
      aNextPY,
      bNextPY,
      seasonA,
      seasonB,
      aComp,
      bComp,
    }),
    timeline: buildRelationshipTimeline(
      a,
      b,
      { aPY, bPY, aNextPY, bNextPY, seasonA, seasonB, aComp, bComp },
      scores,
    ),
    aSign: combinedSign(a),
    bSign: combinedSign(b),
  };
}
function chooseRelationshipArchetype(
  scores: Record<ResonanceDomain, number>,
  evidence: ResonanceEvidence[],
) {
  const highGrowth = scores.growth >= 72;
  const highConflict = scores.challenge >= 64;
  const highPurpose = scores.purpose >= 72;
  const highMaterial = scores.material >= 68;
  const highEmotional = scores.emotional >= 72;
  const highSpiritual = scores.spiritual >= 68;
  const highCommunication = scores.communication >= 70;
  const highPassion = scores.passion >= 72;
  const negative = evidence.filter((e) => e.polarity === "negative").length;
  if (highPurpose && highMaterial && scores.longevity >= 65)
    return {
      title: "Power Couple",
      subtitle:
        "purpose, ambition and practical building are the relationship's central engine",
    };
  if (highGrowth && highConflict)
    return {
      title: "Karmic Accelerators",
      subtitle:
        "the relationship wakes both people up through pressure, contrast and rapid growth",
    };
  if (highEmotional && scores.trust >= 68 && negative <= 1)
    return {
      title: "Natural Companions",
      subtitle:
        "ease, recognition and emotional familiarity are the foundation",
    };
  if (highSpiritual && highGrowth)
    return {
      title: "Sacred Teachers",
      subtitle:
        "the bond teaches through meaning, healing and spiritual correction",
    };
  if (highCommunication && highPurpose)
    return {
      title: "Twin Visionaries",
      subtitle:
        "shared ideas and future-building are stronger than ordinary chemistry",
    };
  if (highPassion && highConflict)
    return {
      title: "Fire and Water",
      subtitle: "the attraction is real, but emotional weather changes quickly",
    };
  if (highGrowth)
    return {
      title: "Soul Builders",
      subtitle:
        "each person fills missing energies and strengthens the other's unfinished structure",
    };
  if (negative >= 4)
    return {
      title: "Temporary Catalysts",
      subtitle:
        "the relationship may be most useful as a lesson, turning point or mirror",
    };
  return {
    title: "Catalytic Mirrors",
    subtitle:
      "the bond reflects hidden patterns while offering enough attraction to keep learning",
  };
}
function buildEssence(
  a: StoredSoul,
  b: StoredSoul,
  archetype: { title: string; subtitle: string },
  scores: Record<ResonanceDomain, number>,
  positive: number,
  negative: number,
  mixed: number,
): string {
  return `This relationship is fundamentally a ${archetype.title}: ${archetype.subtitle}. It is not defined by one system alone. ${positive} supportive signals, ${mixed} developmental signals and ${negative} caution signals combine into a bond whose strongest gifts are ${qualitative(scores.emotional).toLowerCase()} emotional recognition, ${qualitative(scores.growth).toLowerCase()} growth potential and ${qualitative(scores.purpose).toLowerCase()} purpose alignment. The relationship feels best when ${a.name} and ${b.name} treat tension as information rather than proof of incompatibility.`;
}
function evidenceTitles(
  evidence: ResonanceEvidence[],
  domain: ResonanceDomain,
  polarity?: EvidencePolarity,
) {
  return evidence
    .filter(
      (e) => e.domain === domain && (!polarity || e.polarity === polarity),
    )
    .map((e) => e.title)
    .slice(0, 3);
}
function buildRelationshipSections(
  a: StoredSoul,
  b: StoredSoul,
  scores: Record<ResonanceDomain, number>,
  evidence: ResonanceEvidence[],
  timing: any,
): RelationshipAnalysis["sections"] {
  const emotionalSupport = evidenceTitles(
    evidence,
    "emotional",
    "positive",
  ).concat(evidenceTitles(evidence, "trust", "positive"));
  const emotionalTension = evidenceTitles(
    evidence,
    "emotional",
    "negative",
  ).concat(evidenceTitles(evidence, "passion", "negative"));
  const purpose = evidenceTitles(evidence, "purpose").concat(
    evidenceTitles(evidence, "material"),
  );
  const growth = evidenceTitles(evidence, "growth").concat(
    evidenceTitles(evidence, "spiritual"),
  );
  const challenges = evidence
    .filter((e) => e.polarity === "negative" || e.domain === "challenge")
    .slice(0, 5);
  return {
    emotional: emotionalTension.length
      ? `The emotional chemistry is real but not always easy. Support comes through ${emotionalSupport.join(", ") || "basic recognition"}, while friction is most likely through ${emotionalTension.join(", ")}. The relationship needs emotional translation rather than emotional guessing.`
      : `The emotional field is comparatively smooth. ${a.name} and ${b.name} are likely to feel recognised without having to explain every instinct. The main task is not creating chemistry; it is keeping the ease active and purposeful.`,
    mental:
      scores.communication >= 68
        ? `Mental compatibility is one of the bond's strengths. The two can build language, plans and meaning together, especially when they give the conversation a shared objective.`
        : `The mental field requires patience. Misunderstandings are not necessarily lack of care; they come from different processing styles and different assumptions about timing.`,
    purpose: purpose.length
      ? `Purpose alignment is shaped by ${purpose.join(", ")}. This means the relationship becomes stronger when it has a project, family aim, shared discipline, business structure or spiritual assignment.`
      : `The long-term purpose is not automatic. If the bond is to last, the two people must decide what they are building together instead of relying on attraction alone.`,
    conflict: challenges.length
      ? challenges.map((ch) => `${ch.title}: ${ch.detail}`).join(" ")
      : `Conflict recovery is workable because no single system produces a severe repeated warning. Most disagreements should be solvable through timing, honesty and practical routines.`,
    hiddenStrength: growth.length
      ? `The hidden strength is that the relationship develops both people. ${growth.join(", ")} show that each person activates dormant material in the other.`
      : `The hidden strength is steadiness. The relationship may not always feel dramatic, but it can become reliable if both people keep choosing small acts of trust.`,
    missingEnergy:
      evidence.find((e) => e.title.includes("Missing-energy"))?.detail ||
      evidence.find((e) => e.title.includes("Shared missing"))?.detail ||
      `No severe missing-energy signature dominates. The pair is judged more by timing, purpose and emotional rhythm than by energetic incompletion.`,
    timing: `${a.name} is currently in a ${timing.seasonA} year (PY ${timing.aPY}); ${b.name} is in a ${timing.seasonB} year (PY ${timing.bPY}). Current compound weather: ${a.name}: ${timing.aComp}. ${b.name}: ${timing.bComp}. Timing explains seasonal fluctuations; it should not be mistaken for permanent compatibility or incompatibility.`,
    future: `Next year shifts to ${a.name} PY ${timing.aNextPY} and ${b.name} PY ${timing.bNextPY}. If one person moves into a more outward year while the other moves inward, plan for different speeds instead of interpreting distance as rejection.`,
    advice: `Treat the relationship as a living system. Use the high-harmony areas for bonding, use the friction areas for growth, and give the timing climate room to change. The most useful practice is a monthly check-in on communication, money, family pressure, body energy and shared plans.`,
    final: `The final judgment is not simply compatible or incompatible. This is a ${scores.growth >= 70 ? "developmental" : "stabilising"} bond with ${qualitative(scores.recovery).toLowerCase()} conflict-recovery capacity and ${qualitative(scores.longevity).toLowerCase()} longevity potential. It improves when both people consciously use the relationship's symbolic design instead of reacting blindly to its pressure points.`,
  };
}
function buildRelationshipTimeline(
  a: StoredSoul,
  b: StoredSoul,
  timing: any,
  scores: Record<ResonanceDomain, number>,
): RelationshipAnalysis["timeline"] {
  return [
    {
      title: "Foundation",
      tone: "gold",
      text: `The foundation is ${qualitative(scores.emotional).toLowerCase()} emotionally and ${qualitative(scores.purpose).toLowerCase()} in purpose. Early chemistry is less important than whether both people respect the same growth assignment.`,
    },
    {
      title: "Current Season",
      tone: "violet",
      text: `This year ${a.name} is in ${timing.seasonA}; ${b.name} is in ${timing.seasonB}. The bond may feel different from its baseline because timing is temporarily changing each person's needs.`,
    },
    {
      title: "Next Personal-Year Shift",
      tone: "green",
      text: `Next year the pattern moves to PY ${timing.aNextPY} for ${a.name} and PY ${timing.bNextPY} for ${b.name}. Prepare for the speed of the relationship to change rather than expecting this year's mood to remain fixed.`,
    },
    {
      title: "Long-Term Trajectory",
      tone: scores.challenge >= 65 ? "rose" : "green",
      text: `The long-term trajectory is ${qualitative(scores.longevity).toLowerCase()}. The relationship lasts best when conflict recovery becomes a ritual, not an emergency response.`,
    },
  ];
}
function Meter({ label, score }: { label: string; score: number }) {
  const color = barColor(score);
  return (
    <div style={{ marginBottom: "0.58rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.7rem",
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: "0.68rem", color: "rgba(231,221,255,0.84)" }}>
          {label}
        </span>
        <span
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "0.58rem",
            color,
            textTransform: "uppercase",
          }}
        >
          {qualitative(score)}
        </span>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 99,
          background: "rgba(8,7,20,0.95)",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.max(3, Math.min(100, score))}%`,
            borderRadius: 99,
            background: `linear-gradient(90deg, ${color}, rgba(167,139,250,0.9))`,
            boxShadow: `0 0 14px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}
function EvidenceList({ evidence }: { evidence: ResonanceEvidence[] }) {
  return (
    <details style={{ marginTop: "0.9rem" }}>
      <summary
        style={{
          cursor: "pointer",
          color: "#d4af37",
          fontFamily: "'Cinzel',serif",
          fontSize: "0.62rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Expandable Evidence
      </summary>
      <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.7rem" }}>
        {evidence.map((ev, i) => (
          <div
            key={`${ev.title}-${i}`}
            style={{
              padding: "0.65rem",
              borderRadius: 12,
              background:
                ev.polarity === "positive"
                  ? "rgba(34,197,94,0.08)"
                  : ev.polarity === "negative"
                    ? "rgba(244,63,94,0.08)"
                    : "rgba(167,139,250,0.08)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(231,221,255,0.82)",
              fontSize: "0.72rem",
              lineHeight: 1.55,
            }}
          >
            <b
              style={{
                color:
                  ev.polarity === "positive"
                    ? "#86efac"
                    : ev.polarity === "negative"
                      ? "#fb7185"
                      : "#c4b5fd",
              }}
            >
              {ev.title}
            </b>
            <br />
            {ev.detail}
            <br />
            <span style={{ opacity: 0.62 }}>
              Systems: {ev.systems.join(", ")}
            </span>
          </div>
        ))}
      </div>
    </details>
  );
}
export function SoulResonancePanel({ history }: { history: StoredSoul[] }) {
  const famousBank = React.useMemo(() => getFamousSoulBank(), []);
  const getId = React.useCallback((s: StoredSoul | FamousSoulVitals) => s.id || `${s.name}-${s.day}-${s.month}-${s.year}`, []);
  const options = React.useMemo(() => [...history, ...famousBank], [history, famousBank]);
  const [aId, setAId] = React.useState(history[0]?.id || `${history[0]?.name}-${history[0]?.day}`);
  const [bId, setBId] = React.useState(history[1]?.id || `${history[1]?.name}-${history[1]?.day}` || famousBank[0]?.id || "");
  React.useEffect(() => {
    if (history[0]) setAId(getId(history[0]));
    if (history[1]) setBId(getId(history[1]));
    else if (famousBank[0]) setBId(famousBank[0].id);
  }, [history.length, famousBank, getId]);
  const a = options.find((s) => getId(s) === aId) || history[0] || famousBank[0];
  const b = options.find((s) => getId(s) === bId) || options.find((s) => getId(s) !== getId(a));
  if (!a || !b || getId(a) === getId(b)) return null;
  const analysis = buildRelationshipAnalysis(a, b);
  // Not memoized: `a`/`b` are only resolved after the early-return checks
  // above, so a hook here would violate the Rules of Hooks. The underlying
  // computation is cheap arithmetic plus a filter over the famous-birthdays
  // list, so recomputing on each render of this panel is fine.
  const va = buildSoulVitals(a);
  const vb = buildSoulVitals(b);
  const resonance: SoulResonanceReport = generateSoulResonance(va, vb);
  resonance.famousTwins = getFamousTwins(va, vb);
  return (
    <Panel
      title="Soul Resonance"
      subtitle="A synthesized relationship analysis, not a simple compatibility calculator"
      icon={<Users size={18} />}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem",
          marginBottom: "0.85rem",
        }}
      >
        <select
          value={aId}
          onChange={(e) => setAId(e.target.value)}
          style={selectStyle}
        >
          <optgroup label="Saved Souls">
            {history.map((s) => (
              <option key={getId(s)} value={getId(s)}>
                {s.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Famous People Database">
            {famousBank.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </optgroup>
        </select>
        <select
          value={bId}
          onChange={(e) => setBId(e.target.value)}
          style={selectStyle}
        >
          <optgroup label="Saved Souls">
            {history.map((s) => (
              <option key={getId(s)} value={getId(s)}>
                {s.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Famous People Database">
            {famousBank.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
      <div
        style={{
          padding: "0.9rem",
          borderRadius: 16,
          background:
            "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(139,92,246,0.08))",
          border: "1px solid rgba(212,175,55,0.22)",
          marginBottom: "0.9rem",
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "0.86rem",
            color: "#f1d98a",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 800,
          }}
        >
          {analysis.archetype}
        </div>
        <div
          style={{
            fontSize: "0.68rem",
            color: "rgba(200,180,240,0.58)",
            marginTop: 3,
          }}
        >
          {analysis.archetypeSubtitle} · Confidence: {analysis.confidence}
        </div>
        <p
          style={{
            color: "rgba(231,221,255,0.86)",
            fontSize: "0.82rem",
            lineHeight: 1.7,
            margin: "0.75rem 0 0",
          }}
        >
          {analysis.essence}
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.7rem",
          marginBottom: "0.95rem",
        }}
      >
        <div
          style={{
            padding: "0.72rem",
            borderRadius: 14,
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Meter label="Emotional Harmony" score={analysis.scores.emotional} />
          <Meter label="Communication" score={analysis.scores.communication} />
          <Meter label="Trust" score={analysis.scores.trust} />
          <Meter label="Passion" score={analysis.scores.passion} />
        </div>
        <div
          style={{
            padding: "0.72rem",
            borderRadius: 14,
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Meter label="Purpose Alignment" score={analysis.scores.purpose} />
          <Meter label="Growth Potential" score={analysis.scores.growth} />
          <Meter label="Longevity" score={analysis.scores.longevity} />
          <Meter label="Conflict Recovery" score={analysis.scores.recovery} />
        </div>
      </div>
      <StoryCard title="Overall Essence" text={analysis.essence} />
      <StoryCard
        title="Emotional Chemistry"
        text={analysis.sections.emotional}
      />
      <StoryCard title="Mental Compatibility" text={analysis.sections.mental} />
      <StoryCard
        title="Life Purpose Alignment"
        text={analysis.sections.purpose}
      />
      <StoryCard
        title="Conflict Pattern"
        text={analysis.sections.conflict}
        tone="rose"
      />
      <StoryCard
        title="Missing Energy Completion"
        text={analysis.sections.missingEnergy}
      />
      <StoryCard
        title="Hidden Strengths"
        text={analysis.sections.hiddenStrength}
      />
      <StoryCard
        title="Current Personal-Year Climate"
        text={analysis.sections.timing}
        tone="violet"
      />
      <div style={{ margin: "0.9rem 0" }}>
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            color: "#d4af37",
            fontSize: "0.62rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "0.55rem",
          }}
        >
          Relationship Timeline
        </div>
        <div style={{ display: "grid", gap: "0.55rem" }}>
          {analysis.timeline.map((t) => (
            <div
              key={t.title}
              style={{
                display: "grid",
                gridTemplateColumns: "1.2rem 1fr",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  marginTop: 5,
                  background:
                    t.tone === "rose"
                      ? "#fb7185"
                      : t.tone === "green"
                        ? "#86efac"
                        : t.tone === "violet"
                          ? "#a78bfa"
                          : "#d4af37",
                  boxShadow: "0 0 12px currentColor",
                }}
              />
              <div
                style={{
                  padding: "0.62rem 0.7rem",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.035)",
                }}
              >
                <b
                  style={{
                    color: "rgba(248,250,252,0.9)",
                    fontSize: "0.76rem",
                  }}
                >
                  {t.title}
                </b>
                <p
                  style={{
                    margin: "0.25rem 0 0",
                    color: "rgba(231,221,255,0.76)",
                    fontSize: "0.72rem",
                    lineHeight: 1.55,
                  }}
                >
                  {t.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <StoryCard title="Future Evolution" text={analysis.sections.future} />
      <StoryCard title="Advice" text={analysis.sections.advice} tone="green" />
      <StoryCard title="Final Synthesis" text={analysis.sections.final} />
      <ExtendedResonanceLayers report={resonance} />
      <EvidenceList evidence={analysis.evidence} />
    </Panel>
  );
}
const ZODIAC_RELATION_LABELS: Record<string, string> = {
  same: "Same Animal",
  "secret-friend": "Secret Friends (六合)",
  trine: "Trine Allies (三合)",
  "six-clash": "Six Clash (六冲)",
  "six-harm": "Six Harms (相害)",
  neutral: "Neutral",
  unknown: "Unknown",
};
function ChineseZodiacCard({ report }: { report: SoulResonanceReport }) {
  const color = barColor(report.chineseZodiac.score);
  return (
    <div
      style={{
        padding: "0.72rem",
        borderRadius: 14,
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.07)",
        marginBottom: "0.62rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.6rem" }}>
        <div>
          <div
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "0.66rem",
              color: "#d4af37",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {report.soulA.zodiacAnimal} × {report.soulB.zodiacAnimal}
          </div>
          <div style={{ fontSize: "0.62rem", color: "rgba(200,180,240,0.58)", marginTop: 2 }}>
            {ZODIAC_RELATION_LABELS[report.chineseZodiac.relation] || report.chineseZodiac.relation}
          </div>
        </div>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: "1.1rem", fontWeight: 800, color }}>
          {report.chineseZodiac.score}
        </div>
      </div>
      <p style={{ fontSize: "0.72rem", color: "rgba(231,221,255,0.78)", marginTop: "0.5rem", lineHeight: 1.6 }}>
        {report.chineseZodiac.note}
      </p>
    </div>
  );
}
function LayerWeights({ weights }: { weights: DomainScore }) {
  return (
    <span style={{ display: "inline-flex", gap: "0.55rem", flexWrap: "wrap" }}>
      <span style={{ color: "rgba(251,113,133,0.8)", fontSize: "0.6rem" }}>♥ {weights.romance}%</span>
      <span style={{ color: "rgba(241,217,138,0.8)", fontSize: "0.6rem" }}>⚒ {weights.partnership}%</span>
      <span style={{ color: "rgba(103,232,249,0.8)", fontSize: "0.6rem" }}>☺ {weights.friendship}%</span>
    </span>
  );
}
function ResonanceLayerDetails({ layers }: { layers: ResonanceLayer[] }) {
  return (
    <details style={{ marginBottom: "0.7rem" }}>
      <summary
        style={{
          cursor: "pointer",
          color: "#d4af37",
          fontFamily: "'Cinzel',serif",
          fontSize: "0.62rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Resonance Layers ({layers.length})
      </summary>
      <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.7rem" }}>
        {layers.map((layer) => (
          <div
            key={layer.label}
            style={{
              padding: "0.65rem",
              borderRadius: 12,
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(231,221,255,0.82)",
              fontSize: "0.72rem",
              lineHeight: 1.55,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.4rem",
              }}
            >
              <b style={{ color: barColor(layer.score) }}>
                {layer.label} — {layer.score}
              </b>
              <LayerWeights weights={layer.domainWeights} />
            </div>
            <div style={{ marginTop: "0.35rem" }}>{layer.detail}</div>
            <div
              style={{
                marginTop: "0.3rem",
                opacity: 0.55,
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {layer.verdict}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
function JohariPairCard({
  label,
  compat,
  explanation,
}: {
  label: string;
  compat: { rating: number; nature: string; advice: string } | null;
  explanation?: string;
}) {
  if (!compat) return null;
  const color = barColor(compat.rating * 10);
  return (
    <div
      style={{
        padding: "0.72rem",
        borderRadius: 14,
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.07)",
        marginBottom: "0.62rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "0.45rem",
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "0.62rem",
            color: "#d4af37",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "1rem",
            fontWeight: 800,
            color,
          }}
        >
          {compat.rating}/10
        </div>
      </div>
      {explanation && (
        <p
          style={{
            fontSize: "0.64rem",
            color: "rgba(200,180,240,0.52)",
            margin: "0 0 0.42rem",
            lineHeight: 1.5,
          }}
        >
          {explanation}
        </p>
      )}
      <p style={{ fontSize: "0.73rem", color: "rgba(231,221,255,0.82)", lineHeight: 1.6, margin: "0 0 0.38rem" }}>
        {compat.nature}
      </p>
      <p
        style={{
          fontSize: "0.68rem",
          color: "rgba(200,180,240,0.65)",
          fontStyle: "italic",
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        Advice: {compat.advice}
      </p>
    </div>
  );
}

function JohariCompatibilitySection({ report }: { report: SoulResonanceReport }) {
  const jc = report.johariCompatibility;
  if (!jc) return null;

  const aName = report.soulA.name;
  const bName = report.soulB.name;
  const viewColor = (v: string) =>
    v === "Friendly" ? "#86efac" : v === "Enemy" ? "#fb7185" : "#c4b5fd";

  return (
    <details style={{ marginBottom: "0.9rem" }}>
      <summary
        style={{
          cursor: "pointer",
          color: "#d4af37",
          fontFamily: "'Cinzel',serif",
          fontSize: "0.62rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "0.55rem",
        }}
      >
        Johari Compatibility (Harish Johari)
      </summary>
      <div style={{ marginTop: "0.7rem" }}>
        {/* Profile pills */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.7rem" }}>
          {[
            { name: aName, profile: jc.profileA },
            { name: bName, profile: jc.profileB },
          ].map(({ name, profile }) => (
            <div
              key={name}
              style={{
                padding: "0.65rem",
                borderRadius: 13,
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(212,175,55,0.16)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: "0.64rem",
                  color: "#f1d98a",
                  marginBottom: "0.35rem",
                }}
              >
                {name} · {profile.planet}
              </div>
              <div
                style={{
                  fontSize: "0.64rem",
                  color: "rgba(200,180,240,0.55)",
                  marginBottom: "0.4rem",
                }}
              >
                {profile.element} · Best days: {profile.bestDays.join(", ")}
              </div>
              <p
                style={{
                  fontSize: "0.68rem",
                  color: "rgba(231,221,255,0.78)",
                  lineHeight: 1.55,
                  margin: "0 0 0.38rem",
                }}
              >
                {profile.nature}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.28rem",
                  marginTop: "0.4rem",
                }}
              >
                {profile.strengths.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: "0.55rem",
                      padding: "0.18rem 0.45rem",
                      borderRadius: 99,
                      background: "rgba(134,239,172,0.12)",
                      color: "#86efac",
                      border: "1px solid rgba(134,239,172,0.22)",
                    }}
                  >
                    {s}
                  </span>
                ))}
                {profile.weaknesses.slice(0, 3).map((w) => (
                  <span
                    key={w}
                    style={{
                      fontSize: "0.55rem",
                      padding: "0.18rem 0.45rem",
                      borderRadius: 99,
                      background: "rgba(251,113,133,0.1)",
                      color: "#fb7185",
                      border: "1px solid rgba(251,113,133,0.2)",
                    }}
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Friend/enemy view */}
        <div
          style={{
            padding: "0.62rem 0.7rem",
            borderRadius: 13,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            marginBottom: "0.62rem",
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "0.58rem",
              color: "#d4af37",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "0.42rem",
            }}
          >
            Friend / Enemy View
          </div>
          <p style={{ margin: "0.18rem 0", fontSize: "0.71rem", color: "rgba(231,221,255,0.8)" }}>
            {aName} sees {bName}:{" "}
            <b style={{ color: viewColor(jc.aViewOfB) }}>{jc.aViewOfB}</b>
          </p>
          <p style={{ margin: "0.18rem 0", fontSize: "0.71rem", color: "rgba(231,221,255,0.8)" }}>
            {bName} sees {aName}:{" "}
            <b style={{ color: viewColor(jc.bViewOfA) }}>{jc.bViewOfA}</b>
          </p>
          {jc.aViewOfB !== jc.bViewOfA && (
            <p
              style={{
                margin: "0.4rem 0 0",
                fontSize: "0.65rem",
                color: "rgba(200,180,240,0.55)",
                fontStyle: "italic",
              }}
            >
              Asymmetric perception — one sees friendship while the other feels tension. Worth naming openly.
            </p>
          )}
        </div>

        {/* Pair readings */}
        <JohariPairCard
          label={`Psychic ↔ Psychic  (${aName} ${report.soulA.psychic} · ${bName} ${report.soulB.psychic})`}
          compat={jc.psychicPair}
          explanation="The most immediately felt layer — how you interact day-to-day and instinctively."
        />
        <JohariPairCard
          label={`Destiny ↔ Destiny  (${aName} ${report.soulA.destiny} · ${bName} ${report.soulB.destiny})`}
          compat={jc.destinyPair}
          explanation="The karmic, long-range compatibility — the deeper spiritual purpose of the bond."
        />
        <JohariPairCard
          label={`${aName}'s Psychic ${report.soulA.psychic} ↔ ${bName}'s Destiny ${report.soulB.destiny}`}
          compat={jc.crossPairAB}
          explanation={`How ${aName}'s personality meets ${bName}'s life purpose.`}
        />
        <JohariPairCard
          label={`${bName}'s Psychic ${report.soulB.psychic} ↔ ${aName}'s Destiny ${report.soulA.destiny}`}
          compat={jc.crossPairBA}
          explanation={`How ${bName}'s personality meets ${aName}'s life purpose.`}
        />
      </div>
    </details>
  );
}

function CombinedWeatherCard({ report }: { report: SoulResonanceReport }) {
  const cw = report.combinedWeather;
  if (!cw) return null;
  const syncColor =
    cw.cycleDifference === 0
      ? "#f1d98a"
      : cw.cycleDifference <= 2
        ? "#86efac"
        : cw.cycleDifference <= 4
          ? "#67e8f9"
          : "#fb7185";
  return (
    <div
      style={{
        padding: "0.82rem",
        borderRadius: 14,
        background: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(15,52,96,0.22))",
        border: "1px solid rgba(212,175,55,0.18)",
        marginBottom: "0.7rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "0.55rem",
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "0.62rem",
            color: "#d4af37",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Combined Soul Weather
        </div>
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "0.72rem",
            fontWeight: 800,
            color: syncColor,
          }}
        >
          {cw.synchronicity}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.55rem",
          marginBottom: "0.62rem",
        }}
      >
        <div
          style={{
            padding: "0.52rem 0.6rem",
            borderRadius: 10,
            background: "rgba(244,63,94,0.07)",
            border: "1px solid rgba(244,63,94,0.15)",
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "0.54rem",
              color: "#fb7185",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "0.28rem",
            }}
          >
            Challenges
          </div>
          <p style={{ fontSize: "0.69rem", color: "rgba(231,221,255,0.78)", lineHeight: 1.55, margin: 0 }}>
            {cw.challenges}
          </p>
        </div>
        <div
          style={{
            padding: "0.52rem 0.6rem",
            borderRadius: 10,
            background: "rgba(134,239,172,0.07)",
            border: "1px solid rgba(134,239,172,0.15)",
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "0.54rem",
              color: "#86efac",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "0.28rem",
            }}
          >
            Opportunities
          </div>
          <p style={{ fontSize: "0.69rem", color: "rgba(231,221,255,0.78)", lineHeight: 1.55, margin: 0 }}>
            {cw.opportunities}
          </p>
        </div>
      </div>
      <p
        style={{
          fontSize: "0.72rem",
          color: "rgba(231,221,255,0.84)",
          lineHeight: 1.6,
          margin: 0,
          fontStyle: "italic",
        }}
      >
        {cw.specificInsight}
      </p>
      <div
        style={{
          marginTop: "0.5rem",
          display: "flex",
          gap: "0.7rem",
          fontSize: "0.6rem",
          color: "rgba(200,180,240,0.45)",
        }}
      >
        <span>PY {cw.person1Year} · PY {cw.person2Year}</span>
        <span>Δ {cw.cycleDifference}</span>
        <span>Combined {cw.combinedEnergy}</span>
      </div>
    </div>
  );
}

function ExtendedResonanceLayers({ report }: { report: SoulResonanceReport }) {
  const psycho = report.psychomatrixComparison;
  return (
    <div style={{ margin: "0.9rem 0" }}>
      <div
        style={{
          fontFamily: "'Cinzel',serif",
          color: "#d4af37",
          fontSize: "0.62rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "0.55rem",
        }}
      >
        Domain Resonance
      </div>
      <div
        style={{
          padding: "0.72rem",
          borderRadius: 14,
          background: "rgba(255,255,255,0.035)",
          border: "1px solid rgba(255,255,255,0.07)",
          marginBottom: "0.7rem",
        }}
      >
        <ScoreBar label="Romance" score={report.domains.romance} />
        <ScoreBar label="Partnership / Business" score={report.domains.partnership} />
        <ScoreBar label="Friendship" score={report.domains.friendship} />
      </div>
      <ResonanceLayerDetails layers={report.layers} />
      <ChineseZodiacCard report={report} />
      <StoryCard
        title="Lo Shu Karmic Overlay"
        text={`${report.loShuOverlay.voidFill.narrative} ${report.loShuOverlay.amplification.narrative}`}
        tone="violet"
      />
      <StoryCard
        title="Alexandrov Psychomatrix Comparison"
        text={[psycho.willpower, psycho.energy, psycho.stability, psycho.purpose, psycho.family, psycho.habits].join(" ")}
      />
      <JohariCompatibilitySection report={report} />
      <CombinedWeatherCard report={report} />
      {report.famousTwins.length > 0 && (
        <StoryCard
          title="Cosmic Twins"
          text={report.famousTwins.map((t) => `${t.name} — ${t.sharedTrait}`).join(" · ")}
          tone="green"
        />
      )}
    </div>
  );
}
function StoryCard({
  title,
  text,
  tone = "gold",
}: {
  title: string;
  text: string;
  tone?: "gold" | "violet" | "green" | "rose";
}) {
  const color =
    tone === "rose"
      ? "#fb7185"
      : tone === "green"
        ? "#86efac"
        : tone === "violet"
          ? "#c4b5fd"
          : "#f1d98a";
  // Same sentence-splitting convention used by AccordionContentWithPlayer /
  // ScrollableTextDisplay elsewhere in the app, so the read-aloud pacing and
  // punctuation handling stay consistent across the whole reading.
  const sentences = React.useMemo(() => {
    if (!text) return [""];
    const matches = text.match(/[^.!?\n]+[.!?\n]+/g);
    return matches || [text];
  }, [text]);
  const [, setActiveSentenceIndex] = React.useState(-1);
  return (
    <div
      style={{
        padding: "0.72rem 0.78rem",
        borderRadius: 14,
        border: `1px solid ${color}33`,
        background: `${color}10`,
        marginBottom: "0.62rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.5rem",
          marginBottom: "0.35rem",
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "0.58rem",
            color,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 800,
            paddingTop: "0.15rem",
          }}
        >
          {title}
        </div>
        {text ? (
          <SpeechPlayer
            text={text}
            sentences={sentences}
            onBoundary={setActiveSentenceIndex}
            onEnd={() => setActiveSentenceIndex(-1)}
          />
        ) : null}
      </div>
      <div
        style={{
          color: "rgba(231,221,255,0.82)",
          fontSize: "0.76rem",
          lineHeight: 1.65,
        }}
      >
        {text}
      </div>
    </div>
  );
}
const selectStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(10,4,28,0.96)",
  color: "#e9ddff",
  border: "1px solid rgba(167,139,250,0.22)",
  borderRadius: 12,
  padding: "0.65rem",
  fontSize: "0.76rem",
};
export function CosmicTwinsPanel({
  insight,
  numerology,
}: {
  insight: AstroInsightOutput;
  numerology: NumerologyData;
}) {
  const soul = React.useMemo(() => buildSoulVitals({ name: insight.name, day: numerology.birthDay, month: numerology.birthMonth, year: numerology.birthYear, gender: insight.gender || "male" }), [insight.name, insight.gender, numerology.birthDay, numerology.birthMonth, numerology.birthYear]);
  const matches = React.useMemo(() => getCosmicTwinsForSoul(soul, 10), [soul]);
  if (!matches.length) return null;
  return (
    <Panel
      title="Cosmic Twins"
      subtitle="Famous-birthday database: birthday, psychic, destiny, life-path and zodiac resonance"
      icon={<Star size={18} />}
    >
      <div style={{ display: "grid", gap: "0.55rem" }}>
        {matches.map((m) => (
          <div
            key={`${m.name}-${m.born}`}
            style={{
              padding: "0.65rem 0.7rem",
              borderRadius: 13,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "0.6rem",
              }}
            >
              <b
                style={{ color: "rgba(248,250,252,0.92)", fontSize: "0.82rem" }}
              >
                {m.name}
              </b>
              <span
                style={{
                  color: "#d4af37",
                  fontFamily: "'Cinzel',serif",
                  fontSize: "0.62rem",
                }}
              >
                {m.score}%
              </span>
            </div>
            <div
              style={{
                color: "rgba(200,180,240,0.5)",
                fontSize: "0.64rem",
                marginTop: 2,
              }}
            >
              Born {m.born} · {m.sharedTrait}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
export async function shareReadingCard(
  insight: AstroInsightOutput,
  numerology: NumerologyData,
): Promise<void> {
  const title = `${insight.name} — Mystique Compass`;
  const py = computePersonalYearNumber(
    numerology.birthDay,
    numerology.birthMonth,
    new Date().getFullYear(),
  );
  const text = `${title}\nBorn ${numerology.birthDay}/${numerology.birthMonth}/${numerology.birthYear}\nPersonal Year ${py} · ${insight.new_astrology_sign}\nGenerated mechanically by Mystique Compass.`;
  const params = new URLSearchParams({
    s: btoa(
      unescape(
        encodeURIComponent(
          JSON.stringify({
            name: insight.name,
            day: numerology.birthDay,
            month: numerology.birthMonth,
            year: numerology.birthYear,
            gender: insight.gender || "male",
          }),
        ),
      ),
    ),
  });
  const url = `${location.origin}${location.pathname}?${params.toString()}`;
  // navigator.share() rejects with an AbortError when the user simply closes
  // the native share sheet or taps Cancel — that's normal, expected behavior,
  // not a failure. Left uncaught, it becomes an unhandled promise rejection
  // that Vite's runtime-error overlay reports as "Share canceled". Mirrors
  // the same try/catch-then-clipboard-fallback pattern already used by
  // shareApp() in usage-tracker.ts.
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return;
    } catch (err) {
      // AbortError (user cancelled) or any other native share failure: fall
      // through to the clipboard fallback below instead of throwing.
    }
  }
  try {
    await navigator.clipboard?.writeText(`${text}\n${url}`);
    alert("Reading link copied to clipboard.");
  } catch {
    // Clipboard can also be denied/unavailable — fail silently rather than
    // let a second unhandled rejection reach the overlay.
  }
}
export function ShareReadingButton({
  insight,
  numerology,
}: {
  insight: AstroInsightOutput;
  numerology: NumerologyData;
}) {
  return (
    <button
      onClick={() => void shareReadingCard(insight, numerology)}
      style={tinyButtonStyle("#67e8f9")}
    >
      <Share2 size={12} style={{ display: "inline", marginRight: 6 }} />
      Share Reading
    </button>
  );
}
export function ArchivumActions({
  item,
  onLoad,
  onPin,
  onRename,
  onDelete,
}: {
  item: StoredSoul;
  onLoad: (s: AstroInsightInput) => void;
  onPin: (s: StoredSoul) => void;
  onRename: (s: StoredSoul) => void;
  onDelete: (s: StoredSoul) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.35rem",
        flexWrap: "wrap",
        marginTop: "0.65rem",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button style={tinyButtonStyle()} onClick={() => onLoad(item)}>
        Open
      </button>
      <button style={tinyButtonStyle("#f1d98a")} onClick={() => onPin(item)}>
        <Pin size={11} style={{ display: "inline", marginRight: 4 }} />
        Pin
      </button>
      <button style={tinyButtonStyle("#67e8f9")} onClick={() => onRename(item)}>
        <Pencil size={11} style={{ display: "inline", marginRight: 4 }} />
        Rename
      </button>
      <button style={tinyButtonStyle("#fb7185")} onClick={() => onDelete(item)}>
        <Trash2 size={11} style={{ display: "inline", marginRight: 4 }} />
        Delete
      </button>
    </div>
  );
}
export function ImportExportButtons({
  onImport,
  onExport,
}: {
  onImport: () => void;
  onExport: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.45rem",
        flexWrap: "wrap",
        marginTop: "0.75rem",
      }}
    >
      <button style={tinyButtonStyle("#67e8f9")} onClick={onImport}>
        <Upload size={12} style={{ display: "inline", marginRight: 5 }} />
        Import JSON
      </button>
      <button style={tinyButtonStyle("#86efac")} onClick={onExport}>
        <Download size={12} style={{ display: "inline", marginRight: 5 }} />
        Export JSON
      </button>
    </div>
  );
}