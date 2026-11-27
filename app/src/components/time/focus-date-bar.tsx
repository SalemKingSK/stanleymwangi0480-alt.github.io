/**
 * The Focus Date bar: read the whole reading as of another day — back into the
 * past or ahead into the future — or go back to today.
 */
import * as React from "react";
import { appNow, setFocusDay, shiftFocus, useFocusKey } from "@/lib/time/focus";

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function FocusDateBar() {
  const key = useFocusKey();
  const focused = key !== "";
  const now = appNow();
  const [input, setInput] = React.useState(iso(now));
  React.useEffect(() => setInput(iso(appNow())), [key]);

  const apply = (v: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    if (!m) return;
    const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
    if (y < 1800 || y > 2099) return;
    setFocusDay({ year: y, month: mo, day: d });
  };
  const label = now.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  const tense = !focused ? "" : now.getTime() < Date.now() ? "Looking back" : "Looking ahead";
  const btn =
    "h-8 min-w-8 rounded-md border px-2 text-[11px] font-bold uppercase tracking-wider transition-colors hover:bg-amber-300/10";
  const tone = focused ? "border-amber-300/50 text-amber-200" : "border-primary/25 text-primary/80";

  return (
    <div
      className={`mb-3 rounded-xl border px-3 py-2 ${focused ? "border-amber-300/45 bg-amber-300/[0.07]" : "border-primary/20 bg-slate-950/50"}`}
      data-no-study-open
      data-focus-date={key || "today"}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary/75">🗓 Focus Date</span>
        <button type="button" className={`${btn} ${tone}`} onClick={() => shiftFocus({ years: -1 })} aria-label="Back one year" title="Back one year">«</button>
        <button type="button" className={`${btn} ${tone}`} onClick={() => shiftFocus({ days: -1 })} aria-label="Back one day" title="Back one day">‹</button>
        <input
          type="date"
          value={input}
          min="1800-01-01"
          max="2099-12-31"
          onChange={(e) => {
            setInput(e.target.value);
            apply(e.target.value);
          }}
          aria-label="Focus date"
          className="h-8 rounded-md border border-primary/25 bg-black/40 px-2 text-[12px] font-bold text-white [color-scheme:dark]"
        />
        <button type="button" className={`${btn} ${tone}`} onClick={() => shiftFocus({ days: 1 })} aria-label="Forward one day" title="Forward one day">›</button>
        <button type="button" className={`${btn} ${tone}`} onClick={() => shiftFocus({ years: 1 })} aria-label="Forward one year" title="Forward one year">»</button>
        {focused && (
          <button type="button" className={`${btn} border-emerald-300/50 text-emerald-200`} onClick={() => setFocusDay(null)}>
            Today
          </button>
        )}
      </div>
      <p className="mt-1 text-[11px] leading-snug text-slate-400">
        {focused ? (
          <>
            <span className="font-semibold text-amber-200">{tense}: the whole reading is set to {label}.</span> Every result that normally uses
            today or this year — the alerts, numerology, astrology and the Fate Map — now assumes this date (today is {new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}).
          </>
        ) : (
          <>Reading as of today, {label}. Choose another day or year to look back or ahead across the whole app.</>
        )}
      </p>
    </div>
  );
}
