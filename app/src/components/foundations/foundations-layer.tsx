/**
 * The Foundations of Chinese astrology, read for this birthday: your horoscope
 * (year, moon and hour), Yang and Yin, the elements, the planets, the Creation
 * and Destruction Cycles, the animals' natural elements and the meanings of the
 * elements. Always shown; when the "Chinese Zodiacs" book is loaded on the
 * device, its own passage for each section follows the reading.
 */
import * as React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AccordionContentWithPlayer } from "@/components/profile-generator/accordion-content-with-player";
import { Passage, Title, YoursBadge, itemCls, triggerCls } from "@/components/handbook/handbook-oracle";
import { ElementsWheel, ELEMENT_COLORS, ZG_FOUND, ZgFoundationPassage, ZgMeanings } from "@/components/handbook/zodiacs-oracle";
import type { Zodiacs } from "@/lib/handbook/zodiacs";
import { HOURS, type Animal } from "@/lib/foundations/data";
import { chineseYearNow, yearPillarName } from "@/lib/foundations/year";
import { chineseZodiacYear } from "@/lib/astrology/chinese-calendar-math";
import { foundationsFor, SECTION_BOOK_KEY, SECTION_ORDER, type SectionKey } from "@/lib/foundations/practice";

/** Curriculum field of each section. */
export const FOUND_FIELD = (k: SectionKey) => `astro.found.${k}`;

const ICON: Record<SectionKey, string> = {
  thisyear: "📅", horoscope: "🧭", yinyang: "☯", elements: "✦", planets: "🪐", creation: "🌱", destruction: "⚔", natural: "🐾", meanings: "💎",
};

const hourKey = (d?: number, m?: number, y?: number) => `mc-birth-hour:${d ?? 0}-${m}-${y}`;
function readHour(key: string): Animal | null {
  try {
    const v = localStorage.getItem(key);
    return v && HOURS.some((h) => h.animal === v) ? (v as Animal) : null;
  } catch {
    return null;
  }
}

function HourPicker({ value, onChange }: { value: Animal | null; onChange: (a: Animal | null) => void }) {
  return (
    <label className="flex flex-wrap items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-[12px] text-slate-300" data-no-study-open>
      <span>Your birth time (for the animal hour):</span>
      <select
        className="rounded-md bg-slate-900/80 border border-white/15 px-2 py-1 text-[12px] text-amber-100"
        value={value ?? ""}
        onChange={(e) => onChange((e.target.value || null) as Animal | null)}
        aria-label="Birth time"
      >
        <option value="">Not known</option>
        {HOURS.map((h) => (
          <option key={h.animal} value={h.animal}>{h.from} – {h.to} · {h.animal === "Rabbit" ? "Hare" : h.animal}</option>
        ))}
      </select>
    </label>
  );
}

const RATING_COLOR: Record<string, string> = {
  "Very favourable": "#34d399", Favourable: "#86efac", Mixed: "#f1d98a", Testing: "#fb923c", Difficult: "#f87171",
};

/** The year's verdict at a glance, above the sections. */
function YearBanner({ reading }: { reading: { title: string; badge: string; text: string } }) {
  const rating = reading.badge.replace(/\s*★+$/, "");
  const stars = (reading.badge.match(/★/g) ?? []).length;
  const color = RATING_COLOR[rating] ?? "#f1d98a";
  const verdict = /\*\*Verdict:[^*]+\*\*[^—]*— (.+)/.exec(reading.text)?.[1] ?? "";
  return (
    <div className="rounded-xl px-3 py-2.5 border" style={{ borderColor: `${color}55`, background: `${color}12` }} data-year-verdict={rating.toLowerCase()}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-cinzel text-[0.72rem] uppercase tracking-widest" style={{ color }}>{reading.title.replace(/^Your Year: /, "")}</span>
        <span className="text-[12px] font-bold" style={{ color }} aria-label={`${rating}, ${stars} of 5`}>{rating} {"★".repeat(stars)}{"☆".repeat(5 - stars)}</span>
      </div>
      {verdict && <p className="mt-1 text-[12px] leading-relaxed text-slate-200">{verdict}</p>}
    </div>
  );
}

/** Pick the year the Foundations are read for: step, type, or go back to today. */
function TemporalFocus({ value, today, min, max, onChange }: { value: number; today: number; min: number; max: number; onChange: (y: number) => void }) {
  const [input, setInput] = React.useState(String(value));
  React.useEffect(() => setInput(String(value)), [value]);
  const clamp = (y: number) => Math.min(max, Math.max(min, y));
  const cast = () => {
    const y = parseInt(input, 10);
    if (Number.isFinite(y)) onChange(clamp(y));
    else setInput(String(value));
  };
  const btn = "h-8 rounded-md border border-primary/25 px-2 text-[11px] font-bold uppercase tracking-wider text-primary/85 hover:bg-primary/10 disabled:opacity-30";
  const when = value < today ? "Looking back" : value > today ? "Looking ahead" : "This year";
  return (
    <div className="rounded-lg bg-slate-950/60 border border-primary/20 px-3 py-2" data-no-study-open data-temporal-focus>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/70">🗓 Temporal Focus</span>
        <button type="button" className={btn} onClick={() => onChange(clamp(value - 1))} disabled={value <= min} aria-label="Previous year">◀</button>
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") cast(); }}
          onBlur={cast}
          aria-label="Year in focus"
          className="w-20 h-8 rounded-md bg-black/40 border border-primary/25 px-2 text-[13px] font-bold text-white"
        />
        <button type="button" className={btn} onClick={() => onChange(clamp(value + 1))} disabled={value >= max} aria-label="Next year">▶</button>
        <button type="button" className={btn} onClick={cast}>Cast</button>
        {value !== today && <button type="button" className={btn} onClick={() => onChange(today)}>Today</button>}
      </div>
      <p className="mt-1 text-[11px] text-slate-400">
        {when}: every section below is read for <span className="text-amber-100 font-semibold">{value} · {yearPillarName(value)}</span>
        {value === today ? " (the year in force today)." : ` — today's year is ${today}.`}
      </p>
    </div>
  );
}

export function FoundationsLayer({ sign, element, western, day, month, year, zodiacs }: {
  sign: string; element: string; western: string; day?: number; month: number; year: number; zodiacs?: Zodiacs | null;
}) {
  const key = hourKey(day, month, year);
  const [hour, setHour] = React.useState<Animal | null>(() => readHour(key));
  React.useEffect(() => setHour(readHour(key)), [key]);
  const pickHour = (a: Animal | null) => {
    setHour(a);
    try {
      if (a) localStorage.setItem(key, a);
      else localStorage.removeItem(key);
    } catch { /* private mode */ }
  };

  // Temporal Focus: the Chinese year every section is read for (the year in force today by default).
  const today = chineseYearNow();
  const minYear = chineseZodiacYear(day ?? 15, month, year);
  const [focus, setFocus] = React.useState(today);
  React.useEffect(() => setFocus(chineseYearNow()), [key]);

  // Older saved readings may lack the day: the middle of the month never falls on a new-year cusp.
  const readings = React.useMemo(
    () => foundationsFor({ day: day ?? 15, month, year, sign, element, western, hour }, { year: focus }),
    [day, month, year, sign, element, western, hour, focus],
  );
  const z = zodiacs ?? null;
  const twelve = z?.foundations.find((f) => f.key === "The Twelve Animals");

  return (
    <div className="space-y-3" data-foundations>
      <TemporalFocus value={focus} today={today} min={minYear} max={2099} onChange={setFocus} />
      <YearBanner reading={readings.thisyear} />
      <div className="rounded-lg bg-white/5 px-3 py-2 text-[12px] text-slate-300">
        Your foundations: <span className="font-semibold" style={{ color: ELEMENT_COLORS[element] ?? "#f1d98a" }}>{readings.horoscope.badge}</span>
        {western && <> ({western})</>}. Each section below is read for you{z ? ", with your book's own passage after it" : ""}.
      </div>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {twelve?.text && <Passage value="zg-twelve" title={<>📖 {twelve.heading}</>} text={twelve.text} field={ZG_FOUND} variant={twelve.key} />}
        {SECTION_ORDER.map((k) => {
          const r = readings[k];
          const field = FOUND_FIELD(k);
          const bookKey = SECTION_BOOK_KEY[k];
          const hasBook = !!z && !!bookKey && (k === "meanings" ? !!z.meanings : !!z.foundations.find((f) => f.key === bookKey)?.text);
          const open = [`${field}|${r.variant}`, hasBook && (k === "meanings" ? `${ZG_FOUND}|Meanings of the Elements` : `${ZG_FOUND}|${bookKey}`)].filter(Boolean).join(";");
          return (
            <AccordionItem key={k} value={k} className={itemCls} data-foundation={k}>
              <AccordionTrigger className={triggerCls} data-study-open={open}>
                <Title>{ICON[k]} {r.title}<YoursBadge label={r.badge} /></Title>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {k === "horoscope" && <HourPicker value={hour} onChange={pickHour} />}
                  {k === "creation" && <ElementsWheel mode="creation" element={element} />}
                  {k === "destruction" && <ElementsWheel mode="destruction" element={element} />}
                  <AccordionContentWithPlayer text={r.text} study={{ field, variant: r.variant }} />
                  {hasBook && (k === "meanings" ? <ZgMeanings z={z!} element={element} sign={sign} /> : <ZgFoundationPassage z={z!} fkey={bookKey!} />)}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
