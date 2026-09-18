/**
 * MYSTIQUE COMPASS — Premium Results Display
 */
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type {
  AstroInsightOutput,
  NumerologyData,
  AstroInsightInput,
} from "./types";
import { AstroDisplay } from "./astro-display";
import { NumerologyDisplay } from "./numerology-display";
import { CosmicFateMap } from "./cosmic-fate-map";
import {
  TemporalPredictionDisplay,
  TemporalPredictionPanel,
} from "./temporal-prediction-display";
import { PsychomatrixDisplay } from "./psychomatrix-display";
import {
  SynthesisAstroSections,
  SynthesisAstroMoreSections,
  SynthesisNumerologySections,
  SynthesisPsychomatrixSections,
  SynthesisFourPlanesSections,
  SynthesisCellPairsSections,
  NumberMeaningsSection,
  useSynthesis,
} from "./synthesis-sections";
import {
  ArrowLeft,
  History,
  Heart,
  Home,
  Users,
  Briefcase,
  AlertTriangle,
  Brain,
  ChevronDown,
  BookUser,
  Sparkles,
  Info,
  AlertOctagon,
  Star,
  ChevronUp,
  Download,
  FileText,
  BookOpen,
  X,
  CalendarDays,
  Bell,
} from "lucide-react";
import { AccordionContentWithPlayer } from "./accordion-content-with-player";
import InstallButton from "../InstallButton";
import { ZOO } from "@/lib/cosmic-fate/zoo";
import { buildCosmicProfile } from "@/lib/cosmic-synthesizer";
import {
  computePersonalYearNumber,
  reduceNum,
} from "@/lib/numerology/personal-year-full";
import { cheiroPsychicNumbers } from "@/lib/numerology/cheiro-psychic-numbers";
import { useToast } from "@/hooks/use-toast";
import {
  CosmicTwinsPanel,
  ShareReadingButton,
  SoulWeatherDashboard,
  SoulResonancePanel,
  type StoredSoul,
} from "./engagement-tools";
import {
  generateDailyForecast,
  generateNotificationBatch,
} from "@/lib/temporal-prediction-engine-v2";
// ── helpers ───────────────────────────────────────────────────────────────────
/** Single-digit reduction only — no master numbers — for Cheiro psychic work */
function reducePsychic(n: number): number {
  let val = Math.abs(n);
  while (val > 9)
    val = String(val)
      .split("")
      .reduce((a, d) => a + +d, 0);
  return val || 9;
}
function getPersonalYear(d: number, m: number): number {
  return computePersonalYearNumber(d, m, new Date().getFullYear());
}
function getPersonalMonth(py: number): number {
  return reduceNum(py + (new Date().getMonth() + 1));
}
function ordinal(n: number): string {
  if (n > 3 && n < 21) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}
// ── Cheiro Alert Engine ───────────────────────────────────────────────────────
/**
 * Climacteric year reducers per Cheiro.
 * Climacteric ages are those whose digit-sum equals the psychic number
 * or its primary interchangeable number (the karmic twin).
 */
const CLIMACTERIC_REDUCERS: Record<number, number[]> = {
  1: [1, 4], // Sun ↔ Uranus (written 4-1 in occultism)
  2: [2, 7], // Moon ↔ Neptune
  3: [3, 6, 9], // Jupiter — full 3/6/9 trinity
  4: [4, 1], // Uranus ↔ Sun
  5: [5], // Mercury — stands alone
  6: [6, 3, 9], // Venus — full 3/6/9 trinity
  7: [7, 2], // Neptune ↔ Moon
  8: [8, 4], // Saturn ↔ Uranus (explicit in Cheiro text)
  9: [9, 3, 6], // Mars — full 3/6/9 trinity
};
interface DateRange {
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  label: string;
}
/** Cheiro's zodiacal strong periods per psychic number */
const STRONG_PERIODS: Record<number, DateRange[]> = {
  1: [
    {
      startMonth: 7,
      startDay: 21,
      endMonth: 8,
      endDay: 28,
      label: "House of the Sun",
    },
    {
      startMonth: 3,
      startDay: 21,
      endMonth: 4,
      endDay: 28,
      label: "Vernal Equinox",
    },
  ],
  2: [
    {
      startMonth: 6,
      startDay: 20,
      endMonth: 7,
      endDay: 27,
      label: "House of the Moon",
    },
  ],
  3: [
    {
      startMonth: 2,
      startDay: 19,
      endMonth: 3,
      endDay: 27,
      label: "House of Jupiter (Neg.)",
    },
    {
      startMonth: 11,
      startDay: 21,
      endMonth: 12,
      endDay: 27,
      label: "House of Jupiter (Pos.)",
    },
  ],
  4: [
    {
      startMonth: 6,
      startDay: 21,
      endMonth: 7,
      endDay: 27,
      label: "Moon Period",
    },
    {
      startMonth: 7,
      startDay: 22,
      endMonth: 8,
      endDay: 31,
      label: "Sun Period",
    },
  ],
  5: [
    {
      startMonth: 5,
      startDay: 21,
      endMonth: 6,
      endDay: 27,
      label: "House of Mercury (Pos.)",
    },
    {
      startMonth: 8,
      startDay: 21,
      endMonth: 9,
      endDay: 27,
      label: "House of Mercury (Neg.)",
    },
  ],
  6: [
    {
      startMonth: 4,
      startDay: 20,
      endMonth: 5,
      endDay: 27,
      label: "House of Venus (Pos.)",
    },
    {
      startMonth: 9,
      startDay: 21,
      endMonth: 10,
      endDay: 27,
      label: "House of Venus (Neg.)",
    },
  ],
  7: [
    {
      startMonth: 6,
      startDay: 21,
      endMonth: 7,
      endDay: 27,
      label: "House of the Moon",
    },
  ],
  8: [
    {
      startMonth: 12,
      startDay: 21,
      endMonth: 1,
      endDay: 26,
      label: "House of Saturn (Pos.)",
    },
    {
      startMonth: 1,
      startDay: 26,
      endMonth: 2,
      endDay: 26,
      label: "House of Saturn (Neg.)",
    },
  ],
  9: [
    {
      startMonth: 3,
      startDay: 21,
      endMonth: 4,
      endDay: 26,
      label: "House of Mars (Pos.)",
    },
    {
      startMonth: 10,
      startDay: 21,
      endMonth: 11,
      endDay: 27,
      label: "House of Mars (Neg.)",
    },
  ],
};
function isInStrongPeriod(
  psychicNum: number,
  month: number,
  day: number,
): DateRange | null {
  const periods = STRONG_PERIODS[psychicNum] || [];
  for (const p of periods) {
    if (p.startMonth <= p.endMonth) {
      // Standard range (no year wrap)
      if (month < p.startMonth || month > p.endMonth) continue;
      if (month === p.startMonth && day < p.startDay) continue;
      if (month === p.endMonth && day > p.endDay) continue;
      return p;
    } else {
      // Year-wrap range (e.g. Dec → Jan)
      if (month === p.startMonth && day >= p.startDay) return p;
      if (month === p.endMonth && day <= p.endDay) return p;
      if (month > p.startMonth || month < p.endMonth) return p;
    }
  }
  return null;
}
// ── Alert types ───────────────────────────────────────────────────────────────
interface CosmicAlert {
  id: string;
  severity: "warning" | "caution" | "opportunity" | "info";
  title: string;
  message: string;
}
const SEVERITY_ORDER: Record<CosmicAlert["severity"], number> = {
  warning: 0,
  caution: 1,
  opportunity: 2,
  info: 3,
};
function generateAlerts(numerology: NumerologyData): CosmicAlert[] {
  const alerts: CosmicAlert[] = [];
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth() + 1;
  const todayDay = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][today.getDay()];
  const py = getPersonalYear(numerology.birthDay, numerology.birthMonth);
  const pm = getPersonalMonth(py);
  const psychicNum = reducePsychic(numerology.birthDay);
  const cheiro = cheiroPsychicNumbers[psychicNum];
  // ── Current age ────────────────────────────────────────────────────────────
  const birthThisYear = new Date(
    today.getFullYear(),
    numerology.birthMonth - 1,
    numerology.birthDay,
  );
  const hadBirthday = today >= birthThisYear;
  const currentAge =
    today.getFullYear() -
    (numerology.birthYear ?? 1900) -
    (hadBirthday ? 0 : 1);
  const nextAge = currentAge + 1;
  // ── 1. Personal Year ───────────────────────────────────────────────────────
  if (py === 4) {
    alerts.push({
      id: "py4",
      severity: "warning",
      title: "Personal Year 4 — Foundation Cycle",
      message:
        "The Consolidation Cycle demands patience and structural work. Restriction and forced slowing are the hallmarks of this year. Prioritise foundations, practical systems, and long-term building over ambition and outward expansion. Great effort now is the seed of Year 5 freedom.",
    });
  }
  if (py === 7) {
    alerts.push({
      id: "py7",
      severity: "warning",
      title: "Personal Year 7 — Retreat & Sacrifice",
      message:
        "An inward, spiritual year of deep reflection and solitude. Avoid major financial or relational decisions — the cosmos requests retreat, not expansion. Trust that inner development now yields substantial outer rewards in the powerful Year 8 that follows.",
    });
  }
  if (py === 9) {
    alerts.push({
      id: "py9",
      severity: "caution",
      title: "Personal Year 9 — Great Completion",
      message:
        "The Great Completion cycle brings endings, release, and culmination. Resist clinging to what is already departing from your life. Radical release this year clears the path and unlocks the full creative power of the incoming Year 1 cycle.",
    });
  }
  // ── 2. Personal Month ──────────────────────────────────────────────────────
  if (pm === 4 && py !== 4) {
    alerts.push({
      id: "pm4",
      severity: "caution",
      title: `Personal Month 4 — Consolidation Phase`,
      message: `This month carries the restrictive vibration of the 4. Slow down, review your structures, and avoid impulsive commitments. Discipline and methodical groundwork will bring the greatest returns during this concentrated window.`,
    });
  }
  if (pm === 7) {
    alerts.push({
      id: "pm7",
      severity: "caution",
      title: `Personal Month 7 — Reflection Required`,
      message: `Personal Month 7 calls for quiet discernment over outward action. Decisions made in haste this month may need revisiting. Reserve energy for inner clarity, solitude, and deeper self-understanding.`,
    });
  }
  if (pm === 1) {
    alerts.push({
      id: "pm1",
      severity: "opportunity",
      title: `Personal Month 1 — New Beginnings Open`,
      message: `This is a prime month to launch initiatives, make key decisions, and assert your direction. The number 1 brings fresh starts and elevated personal magnetism. The seeds planted now carry long-cycle momentum.`,
    });
  }
  // ── 3. Missing 8 vulnerability ─────────────────────────────────────────────
  const missing8 =
    !numerology.numberCounts?.[String(8)] ||
    numerology.numberCounts[String(8)] === 0;
  if (missing8 && (py === 2 || py === 4)) {
    alerts.push({
      id: "missing8",
      severity: "warning",
      title: "Financial Karma Active — Missing 8",
      message: `The absent 8 in your Lo Shu Grid creates a material blind spot — difficulty assessing true value, contracts, and financial risk. Combined with Personal Year ${py}, this opens a particularly vulnerable window. Exercise heightened caution with investments, business agreements, and major material commitments.`,
    });
  }
  // ── Cheiro-specific alerts (require cheiro data) ───────────────────────────
  if (cheiro) {
    const climReducers = CLIMACTERIC_REDUCERS[psychicNum] || [psychicNum];
    // ── 4. Climacteric years ────────────────────────────────────────────────
    const isCurrentClimax =
      currentAge > 5 && climReducers.includes(reducePsychic(currentAge));
    const isNextClimax =
      nextAge > 5 && climReducers.includes(reducePsychic(nextAge));
    if (isCurrentClimax) {
      alerts.push({
        id: "climax-current",
        severity: "opportunity",
        title: `Age ${currentAge} — Climacteric Year Active`,
        message: `Your ${ordinal(currentAge)} year is one of the most pivotal of your life. Your Psychic number ${psychicNum} (${cheiro.planet}) reaches a climacteric peak — decisions and events now carry amplified karmic weight and long-lasting consequence. Act on your most important plans, especially on your power days: ${cheiro.luckyDays.primary.join(" and ")}.`,
      });
    } else if (isNextClimax) {
      alerts.push({
        id: "climax-next",
        severity: "info",
        title: `Age ${nextAge} — Climacteric Year Approaching`,
        message: `Your next birthday initiates a climacteric year governed by your Psychic number ${psychicNum} (${cheiro.planet}). Prepare the ground now — significant life chapters open and close in these pivotal cycles. Align your foundations before the window opens. Your ${cheiro.luckyDays.primary.join(" and ")} power days will be especially potent that year.`,
      });
    }
    // ── 5. Strong Cheiro period ─────────────────────────────────────────────
    const activePeriod = isInStrongPeriod(psychicNum, todayMonth, todayDate);
    if (activePeriod) {
      const colorHint = cheiro.luckyColors
        ? `Amplify your magnetism with your colours: ${cheiro.luckyColors.split(".")[0].replace(/^All shades of /i, "")}.`
        : "";
      alerts.push({
        id: "strong-period",
        severity: "opportunity",
        title: `You Are in Your Power Period — ${activePeriod.label}`,
        message: `The cosmos is currently aligned with your Psychic number ${psychicNum} (${cheiro.planet}). This is one of your strongest zodiacal windows of the entire year — your natural magnetism, fortune, and influence are heightened. Push forward on important plans. ${colorHint}`,
      });
    }
    // ── 6. Lucky day & date alignment ──────────────────────────────────────
    const isLuckyDay = cheiro.luckyDays.primary.includes(todayDay);
    const todayReduced = reducePsychic(todayDate);
    const isLuckyDate = climReducers.includes(todayReduced);
    if (isLuckyDay && isLuckyDate) {
      alerts.push({
        id: "double-power",
        severity: "opportunity",
        title: `Double Power Day — Act Now`,
        message: `Today is both a lucky day (${todayDay}) and a lucky date (${ordinal(todayDate)}) for your Psychic number ${psychicNum} (${cheiro.planet}). Carry out the most important plans of your life on days when both the day and date vibrate in harmony with your number. This is a rare and amplified window of fortune.`,
      });
    } else if (isLuckyDay) {
      alerts.push({
        id: "lucky-day",
        severity: "info",
        title: `Today Is a Favourable Day — ${todayDay}`,
        message: `${todayDay} is one of the most fortunate days of the week for your Psychic number ${psychicNum} (${cheiro.planet}). Act on meaningful plans and important decisions today with confidence. ${cheiro.luckyJewels ? `Wear your lucky jewel for added force: ${cheiro.luckyJewels.split(".")[0]}.` : ""}`,
      });
    }
    // ── 7. Upcoming power dates this month ─────────────────────────────────
    const allLuckyDates: number[] = [];
    for (let d = 1; d <= 31; d++) {
      if (climReducers.includes(reducePsychic(d))) allLuckyDates.push(d);
    }
    const upcomingDates = allLuckyDates
      .filter((d) => d > todayDate + 1)
      .slice(0, 4);
    if (upcomingDates.length > 0) {
      const dateList = upcomingDates.map(ordinal).join(", ");
      alerts.push({
        id: "lucky-dates",
        severity: "info",
        title: `Power Dates This Month`,
        message: `Your most important upcoming dates this month are the ${dateList}. Channel key efforts — signings, meetings, launches, and major decisions — onto dates that vibrate with your Psychic number ${psychicNum} (${cheiro.planet}). Especially potent when these fall on your lucky day${cheiro.luckyDays.primary.length > 1 ? "s" : ""}: ${cheiro.luckyDays.primary.join(" or ")}.`,
      });
    }
  }
  // Sort by severity: warning → caution → opportunity → info
  alerts.sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );
  return alerts;
}
// ── Alert config ──────────────────────────────────────────────────────────────
const ALERT_CONFIG: Record<
  CosmicAlert["severity"],
  {
    bg: string;
    borderColor: string;
    icon: string;
    badgeBg: string;
    badgeColor: string;
    textColor: string;
  }
> = {
  warning: {
    bg: "linear-gradient(135deg, rgba(17,4,4,0.96) 0%, rgba(30,8,8,0.96) 100%)",
    borderColor: "rgba(239,68,68,0.35)",
    icon: "⚠️",
    badgeBg: "rgba(239,68,68,0.18)",
    badgeColor: "#f87171",
    textColor: "rgba(254,202,202,0.85)",
  },
  caution: {
    bg: "linear-gradient(135deg, rgba(17,10,2,0.96) 0%, rgba(30,18,4,0.96) 100%)",
    borderColor: "rgba(251,146,60,0.3)",
    icon: "◈",
    badgeBg: "rgba(251,146,60,0.18)",
    badgeColor: "#fb923c",
    textColor: "rgba(254,215,170,0.85)",
  },
  opportunity: {
    bg: "linear-gradient(135deg, rgba(2,17,10,0.96) 0%, rgba(4,28,16,0.96) 100%)",
    borderColor: "rgba(52,211,153,0.28)",
    icon: "✦",
    badgeBg: "rgba(52,211,153,0.15)",
    badgeColor: "#34d399",
    textColor: "rgba(167,243,208,0.85)",
  },
  info: {
    bg: "linear-gradient(135deg, rgba(8,8,20,0.96) 0%, rgba(14,10,30,0.96) 100%)",
    borderColor: "rgba(167,139,250,0.25)",
    icon: "✧",
    badgeBg: "rgba(167,139,250,0.15)",
    badgeColor: "#a78bfa",
    textColor: "rgba(221,214,254,0.85)",
  },
};
// ── Single Alert Card ─────────────────────────────────────────────────────────
// ── Alert Toast + Archive System ──────────────────────────────────────────────
// Toasts drip-feed one at a time; each dismissed alert moves into a
// persistent collapsible archive the user can re-read at any time.
const ALERT_DISPLAY_DELAY = 2200;
const ALERT_AUTO_DISMISS = 7000;
const ALERT_STAGGER = 400;
// ── Single Toast popup ────────────────────────────────────────────────────────
function CosmicToast({
  alert,
  onDismiss,
}: {
  alert: CosmicAlert;
  onDismiss: () => void;
}) {
  const cfg = ALERT_CONFIG[alert.severity];
  React.useEffect(() => {
    const timer = setTimeout(onDismiss, ALERT_AUTO_DISMISS);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.94 }}
      transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
      style={{
        width: "100%",
        maxWidth: 360,
        padding: "0.65rem 0.8rem",
        borderRadius: "0.75rem",
        background: cfg.bg,
        border: `1px solid ${cfg.borderColor}`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px ${cfg.borderColor}`,
        display: "flex",
        gap: "0.65rem",
        alignItems: "flex-start",
        pointerEvents: "all",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      onClick={onDismiss}
      role="alert"
    >
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: ALERT_AUTO_DISMISS / 1000, ease: "linear" }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: cfg.badgeColor,
          opacity: 0.45,
          transformOrigin: "left",
        }}
      />
      <span
        style={{
          fontSize: "1rem",
          flexShrink: 0,
          lineHeight: 1.3,
          filter: "drop-shadow(0 0 4px currentColor)",
        }}
      >
        {cfg.icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: "0 0 0.2rem",
            fontSize: "0.58rem",
            fontFamily: "\'Cinzel\',serif",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: cfg.badgeColor,
          }}
        >
          {alert.title}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.65rem",
            color: cfg.textColor,
            lineHeight: 1.55,
            fontFamily: "\'Cormorant Garamond\',serif",
          }}
        >
          {alert.message}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        style={{
          background: "none",
          border: "none",
          padding: "0.1rem",
          cursor: "pointer",
          color: cfg.badgeColor,
          opacity: 0.5,
          fontSize: "0.9rem",
          lineHeight: 1,
          flexShrink: 0,
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </motion.div>
  );
}
// ── Archive panel — collapsible list of all alerts that have been shown ────────
function CosmicAlertsArchive({
  seen,
  birthDay,
  birthMonth,
  birthYear,
}: {
  seen: CosmicAlert[];
  birthDay?: number;
  birthMonth?: number;
  birthYear?: number;
}) {
  const [open, setOpen] = React.useState(false);
  const hasCompass = !!(birthDay && birthMonth);
  if (seen.length === 0 && !hasCompass) return null;
  const BADGE_LABELS: Record<CosmicAlert["severity"], string> = {
    warning: "Warning",
    caution: "Caution",
    opportunity: "Opportunity",
    info: "Info",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      style={{
        borderRadius: "1rem",
        overflow: "hidden",
        border: "1px solid rgba(212,175,55,0.18)",
        background: "rgba(10,4,28,0.96)",
        marginBottom: "1rem",
      }}
    >
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)",
        }}
      />
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.8rem 1rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          gap: "0.6rem",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
            {seen.map((a) => (
              <span
                key={a.id}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: ALERT_CONFIG[a.severity].badgeColor,
                  boxShadow: `0 0 5px ${ALERT_CONFIG[a.severity].badgeColor}88`,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
          <div>
            <div
              style={{
                fontFamily: "\'Cinzel\',serif",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(212,175,55,0.88)",
              }}
            >
              Cosmic Alerts
            </div>
            <div
              style={{
                fontSize: "0.55rem",
                color: "rgba(200,180,240,0.4)",
                fontStyle: "italic",
                marginTop: "0.08rem",
              }}
            >
              {seen.length > 0
                ? `${seen.length} signal${seen.length !== 1 ? "s" : ""}${hasCompass ? " · today's compass" : ""} · tap to read`
                : "today's compass · tap to read"}
            </div>
          </div>
        </div>
        <ChevronDown
          style={{
            color: "rgba(212,175,55,0.4)",
            width: 15,
            height: 15,
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.3s",
          }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
            style={{ padding: "0 0.85rem 0.85rem" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.55rem",
              }}
            >
              {seen.map((a) => {
                const cfg = ALERT_CONFIG[a.severity];
                return (
                  <div
                    key={a.id}
                    style={{
                      padding: "0.65rem 0.8rem",
                      borderRadius: "0.7rem",
                      background: cfg.bg,
                      border: `1px solid ${cfg.borderColor}`,
                      display: "flex",
                      gap: "0.6rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.95rem",
                        flexShrink: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {cfg.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          marginBottom: "0.25rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.45rem",
                            fontFamily: "\'Cinzel\',serif",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            padding: "1px 6px",
                            borderRadius: 999,
                            background: `${cfg.badgeColor}20`,
                            color: cfg.badgeColor,
                            border: `1px solid ${cfg.badgeColor}40`,
                          }}
                        >
                          {BADGE_LABELS[a.severity]}
                        </span>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.6rem",
                            fontFamily: "\'Cinzel\',serif",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: cfg.badgeColor,
                          }}
                        >
                          {a.title}
                        </p>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.67rem",
                          color: cfg.textColor,
                          lineHeight: 1.62,
                          fontFamily: "\'Cormorant Garamond\',serif",
                        }}
                      >
                        {a.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            {hasCompass && (
              <>
                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg,transparent,rgba(212,175,55,0.22),transparent)",
                    margin: "0.75rem 0 0.6rem",
                  }}
                />
                <div
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(212,175,55,0.7)",
                    marginBottom: "0.55rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <CalendarDays size={12} />
                  Today's Compass
                </div>
                <TodayCompassInline
                  birthDay={birthDay!}
                  birthMonth={birthMonth!}
                  birthYear={birthYear ?? new Date().getFullYear() - 30}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
// ── Combined component: runs toasts + feeds archive ───────────────────────────
function PersonalizedAlerts({
  alerts,
  birthDay,
  birthMonth,
  birthYear,
}: {
  alerts: CosmicAlert[];
  birthDay?: number;
  birthMonth?: number;
  birthYear?: number;
}) {
  const [queue, setQueue] = React.useState<CosmicAlert[]>([]);
  const [visible, setVisible] = React.useState<CosmicAlert | null>(null);
  const [seen, setSeen] = React.useState<CosmicAlert[]>([]);
  const [started, setStarted] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    // Reset all state whenever a new profile's alerts arrive, so previous
    // profile's alerts are fully cleared before the new sequence begins.
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(null);
    setSeen([]);
    setQueue([]);
    setStarted(false);
    const t = setTimeout(() => {
      setStarted(true);
      setQueue([...alerts]);
    }, ALERT_DISPLAY_DELAY);
    return () => clearTimeout(t);
  }, [alerts]);
  React.useEffect(() => {
    if (!started || visible !== null || queue.length === 0) return;
    timerRef.current = setTimeout(() => {
      setVisible(queue[0]);
    }, ALERT_STAGGER);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [started, visible, queue]);
  const dismissCurrent = React.useCallback(() => {
    setVisible((prev) => {
      if (prev) setSeen((s) => [...s, prev]);
      return null;
    });
    setQueue((prev) => prev.slice(1));
  }, []);
  return (
    <>
      <CosmicAlertsArchive seen={seen} birthDay={birthDay} birthMonth={birthMonth} birthYear={birthYear} />
      <div
        style={{
          position: "fixed",
          bottom: "5.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 2rem)",
          maxWidth: 400,
          zIndex: 200,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          {visible && (
            <CosmicToast
              key={visible.id}
              alert={visible}
              onDismiss={dismissCurrent}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
function ConstellationReveal({ onDone }: { onDone: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);
  const lines = [
    [60, 80, 140, 50],
    [140, 50, 200, 90],
    [200, 90, 280, 60],
    [280, 60, 340, 100],
    [60, 160, 140, 140],
    [140, 140, 200, 90],
    [200, 90, 260, 170],
    [200, 90, 260, 170],
    [260, 170, 340, 150],
  ];
  const dots = [
    [60, 80],
    [140, 50],
    [200, 90],
    [280, 60],
    [340, 100],
    [60, 160],
    [140, 140],
    [260, 170],
    [340, 150],
  ];
  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(5,1,18,0.95)",
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 1.3 }}
    >
      <svg
        viewBox="0 0 400 220"
        style={{ width: "100%", maxWidth: "22rem", opacity: 0.8 }}
      >
        <defs>
          <filter id="cr-glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {lines.map(([x1, y1, x2, y2], i) => (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(212,175,55,0.6)"
            strokeWidth="0.8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          />
        ))}
        {dots.map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={i === 2 ? 4 : 2.5}
            fill={i === 2 ? "#d4af37" : "rgba(212,175,55,0.7)"}
            filter="url(#cr-glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: i * 0.09 + 0.2,
              duration: 0.3,
              type: "spring",
            }}
          />
        ))}
      </svg>
    </motion.div>
  );
}
// ── Rules-Based Cosmic Profiler ───────────────────────────────────────────────
function CosmicProfilerPanel({
  insight,
  numerology,
}: {
  insight: AstroInsightOutput;
  numerology: NumerologyData;
}) {
  const [revealed, setRevealed] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const profile = React.useMemo(
    () => buildCosmicProfile(insight, numerology),
    [insight, numerology],
  );
  return (
    <div
      style={{
        borderRadius: "1.1rem",
        overflow: "hidden",
        border: "1px solid rgba(212,175,55,0.22)",
        background: "rgba(15,5,40,0.95)",
        marginBottom: "1.25rem",
      }}
    >
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)",
          marginBottom: "0.25rem",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.25rem",
          cursor: revealed ? "pointer" : "default",
          gap: "0.75rem",
        }}
        onClick={() => revealed && setOpen((o) => !o)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Brain style={{ color: "#d4af37", width: 20, height: 20 }} />
          <div>
            <div
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(212,175,55,0.85)",
              }}
            >
              Cosmic Profile Synthesis
            </div>
            <div
              style={{
                fontSize: "0.6rem",
                color: "rgba(200,180,240,0.4)",
                fontStyle: "italic",
              }}
            >
              Field-strict character analysis with Speech
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {!revealed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRevealed(true);
                setOpen(true);
              }}
              style={{
                background: "linear-gradient(135deg,#5b21b6,#d4af37,#7c3aed)",
                backgroundSize: "200%",
                border: "none",
                borderRadius: "0.65rem",
                padding: "0.45rem 1rem",
                fontFamily: "'Cinzel',serif",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#1a0a2e",
                cursor: "pointer",
                boxShadow: "0 4px 18px rgba(212,175,55,0.25)",
                transition: "box-shadow 0.3s",
              }}
            >
              Reveal
            </button>
          )}
          {revealed && (
            <ChevronDown
              style={{
                color: "rgba(212,175,55,0.4)",
                width: 16,
                height: 16,
                transform: open ? "rotate(180deg)" : "none",
                transition: "transform 0.3s",
              }}
            />
          )}
        </div>
      </div>
      <AnimatePresence>
        {open && revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            style={{ padding: "0 1.25rem 1.25rem" }}
          >
            <AccordionContentWithPlayer text={profile} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// ── Animated Tab ──────────────────────────────────────────────────────────────
function AnimatedTab({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="animated-border">
      <button
        onClick={onClick}
        className={`w-full h-full rounded-lg py-2 px-4 text-[0.65rem] font-cinzel tracking-widest font-medium cursor-pointer transition-colors duration-300 relative uppercase ${isActive ? "text-yellow-300" : "text-white/70"}`}
      >
        {children}
      </button>
    </div>
  );
}
// ── New Astro Layer ───────────────────────────────────────────────────────────
function NewAstroLayer({
  layerNum,
  title,
  icon,
  content,
  badgeColor,
  isOpen,
  onToggle,
}: {
  layerNum: number;
  title: string;
  icon: React.ReactNode;
  content: string | undefined;
  badgeColor: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  if (!content) return null;
  return (
    <div style={{ borderTop: "1px solid #2a2340" }}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          padding: "14px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              padding: "2px 7px",
              borderRadius: 20,
              border: "1px solid",
              background: `${badgeColor}22`,
              color: badgeColor,
              borderColor: `${badgeColor}55`,
              fontFamily: "'Cinzel',serif",
            }}
          >
            Layer {layerNum}
          </span>
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              letterSpacing: "0.03em",
              color: "#c4b8e8",
              fontFamily: "'Cinzel',serif",
            }}
          >
            {title}
          </span>
        </div>
        <span
          style={{
            fontSize: 18,
            color: "#7a6fa0",
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "none",
            lineHeight: 1,
          }}
        >
          ▾
        </span>
      </button>
      {isOpen && (
        <div style={{ padding: "4px 0 18px", animation: "naFadeIn 0.2s ease" }}>
          <style>{`@keyframes naFadeIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}`}</style>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              borderLeft: `3px solid ${badgeColor}`,
              borderRadius: "0 10px 10px 0",
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              {icon}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: badgeColor,
                }}
              >
                {title} Analysis
              </span>
            </div>
            <AccordionContentWithPlayer text={content} />
          </div>
        </div>
      )}
    </div>
  );
}
function NewAstroSignDetails({
  sign,
  signData,
}: {
  sign: string;
  signData: AstroInsightOutput["signData"];
}) {
  const [openLayer, setOpenLayer] = React.useState<number | null>(1);
  const animalName = sign.split("/")[1]?.trim();
  const animalEmoji = ZOO[animalName]?.e || "";
  const toggle = (num: number) => setOpenLayer(openLayer === num ? null : num);
  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <h2 className="font-decorative text-xl text-primary flex items-center justify-center gap-3">
          <span>{animalEmoji}</span>
          {sign}
          <span>{animalEmoji}</span>
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
      <div className="flex flex-col">
        <NewAstroLayer
          layerNum={1}
          title="Psychological Profile"
          icon={<BookUser className="h-4 w-4" />}
          content={signData.description}
          badgeColor="#9b8ec4"
          isOpen={openLayer === 1}
          onToggle={() => toggle(1)}
        />
        <NewAstroLayer
          layerNum={2}
          title="Romantic Blueprint"
          icon={<Heart className="h-4 w-4" />}
          content={signData.love}
          badgeColor="#3a8ee0"
          isOpen={openLayer === 2}
          onToggle={() => toggle(2)}
        />
        <NewAstroLayer
          layerNum={3}
          title="Domestic Sphere"
          icon={<Home className="h-4 w-4" />}
          content={signData.homeAndFamily}
          badgeColor="#4caf7d"
          isOpen={openLayer === 3}
          onToggle={() => toggle(3)}
        />
        <NewAstroLayer
          layerNum={4}
          title="Social Resonance"
          icon={<Users className="h-4 w-4" />}
          content={signData.compatibilities}
          badgeColor="#e0a83a"
          isOpen={openLayer === 4}
          onToggle={() => toggle(4)}
        />
        <NewAstroLayer
          layerNum={5}
          title="Professional Path"
          icon={<Briefcase className="h-4 w-4" />}
          content={signData.profession}
          badgeColor="#de78a0"
          isOpen={openLayer === 5}
          onToggle={() => toggle(5)}
        />
      </div>
    </div>
  );
}
// ── Results Header ────────────────────────────────────────────────────────────
function ResultsHeader({
  name,
  newAstroSign,
  birthDate,
  onTabClick,
  activeTab,
}: {
  name: string;
  newAstroSign: string;
  birthDate: string;
  onTabClick: (t: string) => void;
  activeTab: string;
}) {
  const animalName = newAstroSign.split("/")[1]?.trim();
  const animalEmoji = ZOO[animalName]?.e || "";
  return (
    <div className="flex flex-col items-center justify-center mb-6 p-4 rounded-xl w-full">
      <motion.h1
        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-purple-300 to-pink-400 tracking-wider text-center font-decorative mb-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      >
        {name}
      </motion.h1>
      <p className="text-[0.7rem] text-white/50 mt-1 font-cinzel uppercase tracking-[0.2em]">
        {birthDate}
      </p>
      <div className="w-full max-w-sm mx-auto mt-8 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <AnimatedTab
            isActive={activeTab === "new-astro"}
            onClick={() => onTabClick("new-astro")}
          >
            {animalEmoji} {newAstroSign} {animalEmoji}
          </AnimatedTab>
          <AnimatedTab
            isActive={activeTab === "astro"}
            onClick={() => onTabClick("astro")}
          >
            Astrology
          </AnimatedTab>
        </div>
        <div className="w-full">
          <AnimatedTab
            isActive={activeTab === "numerology"}
            onClick={() => onTabClick("numerology")}
          >
            Numerology
          </AnimatedTab>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <AnimatedTab
            isActive={activeTab === "psychomatrix"}
            onClick={() => onTabClick("psychomatrix")}
          >
            Psychomatrix
          </AnimatedTab>
          <AnimatedTab
            isActive={activeTab === "cosmic-fate"}
            onClick={() => onTabClick("cosmic-fate")}
          >
            🌌 Fate Map
          </AnimatedTab>
        </div>
      </div>
    </div>
  );
}
// ── Export FAB — single button above History, opens PDF / EPUB choice ─────────
function ExportFab({
  insight,
  numerology,
}: {
  insight: AstroInsightOutput;
  numerology: NumerologyData;
}) {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState<"pdf" | "epub" | null>(null);
  const { toast } = useToast();
  const runPdf = async () => {
    setOpen(false);
    setBusy("pdf");
    try {
      const { generatePdf } = await import("./pdf-export");
      await generatePdf(insight, numerology);
    } catch (err) {
      console.error("PDF export failed", err);
      toast({
        variant: "destructive",
        title: "PDF Export Failed",
        description: "Could not generate the PDF. Please try again.",
      });
    } finally {
      setBusy(null);
    }
  };
  const runEpub = async () => {
    setOpen(false);
    setBusy("epub");
    try {
      const { generateEpub } = await import("./epub-export");
      await generateEpub(insight, numerology);
    } catch (err) {
      console.error("EPUB export failed", err);
      toast({
        variant: "destructive",
        title: "EPUB Export Failed",
        description: "Could not generate the EPUB. Please try again.",
      });
    } finally {
      setBusy(null);
    }
  };
  const isLoading = busy !== null;
  return (
    <>
      {open && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 48 }}
          onClick={() => setOpen(false)}
        />
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: "fixed",
              bottom: "108px",
              right: "16px",
              zIndex: 49,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "flex-end",
            }}
          >
            <button
              onClick={runEpub}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(9,16,35,0.97)",
                border: "1px solid rgba(52,211,153,0.4)",
                borderRadius: "12px",
                padding: "10px 16px",
                color: "#34d399",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                whiteSpace: "nowrap",
              }}
            >
              <BookOpen size={13} />
              Save Full EPUB
            </button>
            <button
              onClick={runPdf}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(9,16,35,0.97)",
                border: "1px solid rgba(212,175,55,0.4)",
                borderRadius: "12px",
                padding: "10px 16px",
                color: "#d4af37",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                whiteSpace: "nowrap",
              }}
            >
              <FileText size={13} />
              Save Full PDF
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="fixed z-50 pointer-events-auto"
        style={{ bottom: "68px", right: "24px" }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => !isLoading && setOpen((o) => !o)}
          disabled={isLoading}
          className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
          title="Export Profile"
        >
          {isLoading ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ animation: "spin 1s linear infinite" }}
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          ) : open ? (
            <X className="h-5 w-5" />
          ) : (
            <Download className="h-5 w-5" />
          )}
        </Button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}
// ── Floating Nav ──────────────────────────────────────────────────────────────
function FloatingNavigation({
  onReset,
  onHistoryOpen,
  insight,
  numerology,
}: {
  onReset: () => void;
  onHistoryOpen: () => void;
  insight: AstroInsightOutput;
  numerology: NumerologyData;
}) {
  return (
    <>
      <div className="fixed bottom-6 left-6 z-50 pointer-events-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <InstallButton minimal />
      </div>
      <ExportFab insight={insight} numerology={numerology} />
      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={onHistoryOpen}
          className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <History className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
// ── Collapsible section wrapper (matches Temporal segment style) ──────────────
function CollapsibleSection({
  title,
  subtitle,
  icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      style={{
        borderRadius: "1rem",
        overflow: "hidden",
        border: "1px solid rgba(212,175,55,0.18)",
        background: "rgba(10,4,28,0.96)",
        marginBottom: "1rem",
      }}
    >
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)",
        }}
      />
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.8rem 1rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          gap: "0.6rem",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
          {icon && (
            <div style={{ color: "#d4af37", display: "flex" }}>{icon}</div>
          )}
          <div>
            <div
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(212,175,55,0.88)",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontSize: "0.55rem",
                  color: "rgba(200,180,240,0.4)",
                  fontStyle: "italic",
                  marginTop: "0.08rem",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
        </div>
        <ChevronDown
          style={{
            color: "rgba(212,175,55,0.4)",
            width: 15,
            height: 15,
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.3s",
          }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
            style={{ padding: "0 0.85rem 0.85rem" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
// ── Today's Compass inline (for cosmic-fate tab) ──────────────────────────────
function TodayCompassInline({
  birthDay,
  birthMonth,
  birthYear,
}: {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}) {
  const today = React.useMemo(
    () => generateDailyForecast(birthDay, birthMonth, birthYear),
    [birthDay, birthMonth, birthYear],
  );
  const batch = React.useMemo(
    () => generateNotificationBatch(birthDay, birthMonth, birthYear, 14),
    [birthDay, birthMonth, birthYear],
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0,1fr))",
          gap: "0.5rem",
        }}
      >
        {[
          { label: "Personal Day", value: today.personalDay },
          { label: "Universal Day", value: today.universalDay },
          {
            label: "Power",
            value: today.isPowerWindow
              ? "YES"
              : today.isLuckyDay || today.isLuckyDate
                ? "OPEN"
                : "—",
          },
        ].map(({ label, value }) => (
          <div
            key={label}
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
        ))}
      </div>
      <p
        style={{
          color: "rgba(231,221,255,0.82)",
          fontSize: "0.86rem",
          lineHeight: 1.68,
          margin: 0,
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
      {batch.length > 0 && (
        <>
          <div
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "0.6rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(212,175,55,0.6)",
              marginTop: "0.25rem",
            }}
          >
            Upcoming 14-Day Alerts
          </div>
          <div style={{ display: "grid", gap: "0.5rem" }}>
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
        </>
      )}
    </div>
  );
}
// ── Main Export ───────────────────────────────────────────────────────────────
export function ResultsDisplay({
  insight,
  numerology,
  history = [],
  onReset,
  onHistoryOpen,
}: {
  insight: AstroInsightOutput;
  numerology: NumerologyData;
  history?: StoredSoul[];
  onReset: () => void;
  onHistoryOpen: () => void;
}) {
  const [activeTab, setActiveTab] = React.useState("astro");
  const [showReveal, setShowReveal] = React.useState(true);
  const alerts = React.useMemo(() => generateAlerts(numerology), [numerology]);
  const synthesis = useSynthesis(insight, numerology);
  React.useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis?.speaking)
        window.speechSynthesis.cancel();
    };
  }, [activeTab]);
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  const formatDate = () => {
    const { birthDay } = numerology;
    const { month, year } = insight;
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `Born ${birthDay}${getOrdinalSuffix(birthDay)} ${months[month - 1]} ${year}`;
  };
  return (
    <>
      <AnimatePresence>
        {showReveal && (
          <ConstellationReveal onDone={() => setShowReveal(false)} />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="results-background w-full min-h-screen flex flex-col p-4"
      >
        <div className="w-full max-w-4xl mx-auto flex-grow">
          <ResultsHeader
            name={insight.name}
            newAstroSign={insight.new_astrology_sign}
            birthDate={formatDate()}
            onTabClick={setActiveTab}
            activeTab={activeTab}
          />
          {/* ── Cosmic Alerts + Today's Compass (permanent, above all tabs) ── */}
          <PersonalizedAlerts
            key={`${insight.name}-${numerology.birthDay}-${numerology.birthMonth}-${numerology.birthYear}`}
            alerts={alerts}
            birthDay={numerology.birthDay}
            birthMonth={numerology.birthMonth}
            birthYear={numerology.birthYear}
          />
          {/* ── Temporal Prediction Engine (permanent, above all tabs) ── */}
          <TemporalPredictionPanel
            birthDay={numerology.birthDay}
            birthMonth={numerology.birthMonth}
            birthYear={numerology.birthYear || new Date().getFullYear() - 30}
          />
          {/* ── Soul Resonance (permanent, above all tabs) ── */}
          {history.length >= 2 && (
            <CollapsibleSection
              title="Soul Resonance"
              subtitle="Compatibility via Cheiro harmony, Lo Shu, personal-year sync & zodiac rhythm"
              icon={<Users size={16} />}
            >
              <SoulResonancePanel history={history} />
            </CollapsibleSection>
          )}
          {/* ── Share Reading (centered, above all tabs) ── */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.9rem" }}>
            <ShareReadingButton insight={insight} numerology={numerology} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            >
              {activeTab === "astro" && (
                <>
                  <AstroDisplay insight={insight} />
                  {synthesis && (
                    <>
                      <SynthesisAstroSections
                        synthesis={synthesis}
                        insight={insight}
                      />
                      <SynthesisAstroMoreSections synthesis={synthesis} />
                    </>
                  )}
                  <CollapsibleSection
                    title="Cosmic Profile Synthesis"
                    subtitle="Field-strict character analysis with Speech"
                    icon={<Brain size={16} />}
                  >
                    <CosmicProfilerPanel insight={insight} numerology={numerology} />
                  </CollapsibleSection>
                  <CollapsibleSection
                    title="Cosmic Twins"
                    subtitle="Famous lives sharing birthday, life-path or zodiac resonance"
                    icon={<Star size={16} />}
                  >
                    <CosmicTwinsPanel insight={insight} numerology={numerology} />
                  </CollapsibleSection>
                </>
              )}
              {activeTab === "numerology" && (
                <>
                  <NumerologyDisplay numerology={numerology} />
                  {synthesis && numerology && (
                    <SynthesisNumerologySections
                      synthesis={synthesis}
                      numerology={numerology}
                    />
                  )}
                  <NumberMeaningsSection />
                </>
              )}
              {activeTab === "new-astro" && (
                <NewAstroSignDetails
                  sign={insight.new_astrology_sign}
                  signData={insight.signData}
                />
              )}
              {activeTab === "psychomatrix" && (
                <>
                  <PsychomatrixDisplay
                    day={numerology.birthDay}
                    month={numerology.birthMonth}
                    year={numerology.birthYear}
                    gender={insight.gender}
                    name={insight.name}
                  />
                  {synthesis && numerology && (
                    <SynthesisPsychomatrixSections
                      synthesis={synthesis}
                      numerology={numerology}
                    />
                  )}
                  {synthesis && (
                    <SynthesisCellPairsSections synthesis={synthesis} />
                  )}
                  {synthesis && (
                    <SynthesisFourPlanesSections synthesis={synthesis} />
                  )}
                </>
              )}
              {activeTab === "cosmic-fate" && (
                <CosmicFateMap
                  birthDay={numerology.birthDay}
                  birthMonth={numerology.birthMonth}
                  birthYear={numerology.birthYear}
                />
              )}
            </motion.div>
          </AnimatePresence>
          {/* ── Soul Weather (permanent, below all tabs) ── */}
          {history.length >= 1 && (
            <CollapsibleSection
              title="Soul Weather"
              subtitle="Current personal-year climate for saved souls"
              icon={<Star size={16} />}
            >
              <SoulWeatherDashboard history={history} onLoad={() => {}} />
            </CollapsibleSection>
          )}
        </div>
        <footer className="text-center p-4 pb-24 text-white/50 text-[0.65rem] whitespace-pre-line font-body italic leading-relaxed">
          {
            "He who knows others is learned;\nHe who knows himself is wise.\n— Lao Tzu, Dao De Jing"
          }
        </footer>
      </motion.div>
      <FloatingNavigation
        onReset={onReset}
        onHistoryOpen={onHistoryOpen}
        insight={insight}
        numerology={numerology}
      />
    </>
  );
}
