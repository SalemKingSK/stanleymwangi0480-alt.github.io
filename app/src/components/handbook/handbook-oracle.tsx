/**
 * The user's handbook inside the Animal Oracle: the "Load my Handbook" card
 * and the passages of each section, word for word, each with its own Listen.
 * The text comes from the PDF the user loaded on this device (lib/handbook).
 */
import * as React from "react";
import { BookMarked, Loader2, Trash2, Upload } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AccordionContentWithPlayer } from "@/components/profile-generator/accordion-content-with-player";
import { ZOO } from "@/lib/cosmic-fate/zoo";
import { K } from "@/lib/curriculum/catalogue";
import { loadBookFile, removeBook, useHandbook, type BookKind } from "@/lib/handbook/store";
import { birthSeason, pairKey, type HbChapter, type HbItem, type HbSection, type Handbook } from "@/lib/handbook/types";

export const itemCls = "border-none bg-white/5 rounded-lg overflow-hidden px-3";
export const triggerCls = "hover:no-underline py-3";

export function Title({ children }: { children: React.ReactNode }) {
  return <span className="font-cinzel text-[0.7rem] uppercase tracking-widest text-primary flex items-center gap-2 text-left">{children}</span>;
}

export function BookTag({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-300/90 mt-2 mb-1 px-1">
      <BookMarked className="h-3.5 w-3.5" /> {children}
    </p>
  );
}

export function YoursBadge({ label = "Yours" }: { label?: string }) {
  return <span className="ml-1 rounded-full bg-amber-400/15 border border-amber-300/40 px-2 py-0.5 text-[9px] tracking-wider text-amber-200">{label}</span>;
}

/** Moves the user's own item to the front. */
export function yoursFirst<T extends { key: string }>(items: T[], key: string | undefined): T[] {
  if (!key) return items;
  const own = items.find((i) => i.key === key);
  return own ? [own, ...items.filter((i) => i !== own)] : items;
}

/** One collapsible passage with Listen. */
export function Passage({ value, title, text, field, variant, part, yours }: {
  value: string; title: React.ReactNode; text: string; field: string; variant: string; part?: string; yours?: boolean | string;
}) {
  if (!text) return null;
  return (
    <AccordionItem value={value} className={itemCls}>
      <AccordionTrigger className={triggerCls} data-study-open={`${field}|${variant}`}>
        <Title>{title}{yours ? <YoursBadge label={typeof yours === "string" ? yours : undefined} /> : null}</Title>
      </AccordionTrigger>
      <AccordionContent>
        <AccordionContentWithPlayer text={text} study={{ field, variant, part }} />
      </AccordionContent>
    </AccordionItem>
  );
}

// ── Load / status card ────────────────────────────────────────────────────

/** "My Books": load either book (it is recognised automatically), see what's loaded, remove. */
export function HandbookLoader({ compact = false }: { compact?: boolean }) {
  const hb = useHandbook();
  const input = React.useRef<HTMLInputElement>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setMessage(null);
    try {
      const r = await loadBookFile(file);
      setMessage(r.message);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e));
    } finally {
      if (input.current) input.current.value = "";
    }
  };

  const loading = hb.status === "loading";
  const loaded: { kind: BookKind; label: string; file: string }[] = [];
  if (hb.book) loaded.push({ kind: "handbook", label: "The Handbook", file: hb.book.meta.file });
  if (hb.zodiacs) loaded.push({ kind: "zodiacs", label: "Chinese Zodiacs", file: hb.zodiacs.meta.file });
  const missing = [!hb.book && "the Handbook", !hb.zodiacs && "Chinese Zodiacs"].filter(Boolean).join(" or ");
  return (
    <div className="rounded-xl border border-amber-300/25 bg-amber-300/[0.04] p-3 space-y-2" data-no-study-open>
      <div className="flex items-center gap-2">
        <BookMarked className="h-4 w-4 text-amber-300" />
        <span className="font-cinzel text-[0.7rem] uppercase tracking-[0.2em] text-amber-200">My Books</span>
      </div>
      {loaded.map((b) => (
        <div key={b.kind} className="flex items-center justify-between gap-2 text-[12px] text-slate-300">
          <span>
            <span className="text-amber-100 font-semibold">{b.label}</span> — loaded on this device{!compact && <> (<span className="text-slate-400">{b.file}</span>)</>}
          </span>
          {!loading && (
            <button
              type="button"
              aria-label={`Remove ${b.label} from this device`}
              onClick={() => { if (window.confirm(`Remove ${b.label} from this device?`)) void removeBook(b.kind).then(() => setMessage(`${b.label} removed from this device.`)); }}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/15 px-2 py-1 text-[11px] text-slate-300"
            >
              <Trash2 className="h-3 w-3" /> Remove
            </button>
          )}
        </div>
      ))}
      {!loaded.length && !compact && (
        <p className="text-[12px] text-slate-300">
          Pick your own copy of a book (PDF) once — the Handbook of Chinese Horoscopes or Chinese Zodiacs; the app recognises
          which it is. It is read and kept on this device only — nothing is uploaded — and each animal's sections then open in
          its Oracle, word for word.
        </p>
      )}
      {loading && (
        <p className="flex items-center gap-2 text-[12px] text-amber-200">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Reading the book{hb.progress?.total ? ` — page ${hb.progress.page} of ${hb.progress.total}` : "…"}
        </p>
      )}
      {message && <p className="text-[12px] text-slate-200" role="status">{message}</p>}
      <button
        type="button"
        disabled={loading}
        onClick={() => input.current?.click()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-[12px] font-semibold text-amber-100 disabled:opacity-50"
      >
        <Upload className="h-3.5 w-3.5" /> {loaded.length === 0 ? "Load my Handbook" : missing ? `Load ${missing}` : "Load a fresh copy"}
      </button>
      <input ref={input} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => void pick(e.target.files?.[0])} />
    </div>
  );
}

// ── Sections ──────────────────────────────────────────────────────────────

/** Layer 2: The Five Different [animals], the user's element first. */
export function HbFive({ ch, sign, element }: { ch: HbChapter; sign: string; element: string }) {
  const s = ch.five;
  if (!s?.items.length) return null;
  return (
    <div className="space-y-2" data-handbook="five">
      <BookTag>{s.heading}</BookTag>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {s.intro && <Passage value="intro" title={`${s.heading} — opening`} text={s.intro} field="astro.hb.five" variant={K.element(element, sign)} part="main" />}
        {yoursFirst(s.items, element).map((it) => (
          <Passage key={it.key} value={it.key} title={it.heading} text={it.text} field="astro.hb.five" variant={K.element(it.key, sign)} yours={it.key === element} />
        ))}
      </Accordion>
    </div>
  );
}

/** Layer 3 (per partner): Compatibility and Conflict entry + the "Rat + Ox" pairing. */
export function HbPartner({ book, sign, partner }: { book: Handbook; sign: string; partner: string }) {
  const ch = book.chapters[sign as keyof Handbook["chapters"]];
  const entry = ch?.compat?.items.find((i) => i.key === partner);
  const pair = book.pairs[pairKey(sign, partner)];
  if (!entry && !pair) return null;
  const variant = K.compat(sign, partner);
  return (
    <div className="space-y-3 pt-2" data-handbook="partner">
      {entry && (
        <div>
          <BookTag>{ch!.compat!.heading} — {entry.heading}</BookTag>
          <AccordionContentWithPlayer text={entry.text} study={{ field: "astro.hb.compat", variant, part: "conflict" }} />
        </div>
      )}
      {pair && (
        <div>
          <BookTag>{pair.heading}</BookTag>
          <AccordionContentWithPlayer text={pair.text} study={{ field: "astro.hb.compat", variant, part: "pair" }} />
        </div>
      )}
    </div>
  );
}

/** Layer 3 (top): the opening of Compatibility and Conflict. */
export function HbCompatIntro({ ch, sign }: { ch: HbChapter; sign: string }) {
  const s = ch.compat;
  if (!s?.intro) return null;
  return (
    <Accordion type="single" collapsible className="w-full space-y-2" data-handbook="compat-intro">
      <Passage value="intro" title={<><BookMarked className="h-3.5 w-3.5" /> {s.heading}</>} text={s.intro} field="astro.hb.intro" variant={K.sign(sign)} part="compat" />
    </Accordion>
  );
}

function SectionLayer({ section, sign, field, variantOf, partOf, yours, introPart, yoursLabel, render }: {
  section: HbSection | undefined;
  sign: string;
  field: string;
  variantOf: (key: string) => string;
  partOf?: (key: string) => string;
  yours?: string;
  introPart?: string;
  yoursLabel?: string;
  render?: (it: HbItem) => { title: React.ReactNode; text: string };
}) {
  if (!section) return <p className="text-[13px] italic text-slate-400 px-2">This section wasn't found in the loaded book.</p>;
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {section.intro && (
        <Passage value="intro" title={`${section.heading} — opening`} text={section.intro}
          field={introPart ? "astro.hb.intro" : field} variant={introPart ? K.sign(sign) : variantOf(yours ?? "")} part={introPart} />
      )}
      {yoursFirst(section.items, yours).map((it) => {
        const r = render ? render(it) : { title: it.heading, text: it.text };
        return <Passage key={it.key} value={it.key} title={r.title} text={r.text} field={field} variant={variantOf(it.key)} part={partOf?.(it.key)} yours={it.key === yours ? (yoursLabel ?? true) : false} />;
      })}
    </Accordion>
  );
}

/** Personality & Child. */
export function HbCharacter({ ch, sign }: { ch: HbChapter; sign: string }) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {ch.personality && <Passage value="personality" title={ch.personality.heading} text={ch.personality.intro} field="astro.hb.character" variant={K.sign(sign)} part="personality" />}
      {ch.child && <Passage value="child" title={ch.child.heading} text={ch.child.intro} field="astro.hb.character" variant={K.sign(sign)} part="child" />}
    </Accordion>
  );
}

/** Ascendants: one passage per two-hour period. */
export function HbAscendants({ ch, sign }: { ch: HbChapter; sign: string }) {
  return (
    <SectionLayer section={ch.ascendant} sign={sign} field="astro.hb.ascendant" introPart="ascendant"
      variantOf={(k) => K.hbAscendant(sign, k)}
      render={(it) => ({ title: <>{ZOO[it.key]?.e ?? "🕰"} {it.heading}</>, text: it.text })} />
  );
}

/** When Moon Signs Meet Sun Signs: the user's Western sign first. */
export function HbMoon({ ch, sign, western }: { ch: HbChapter; sign: string; western: string }) {
  return (
    <SectionLayer section={ch.moon} sign={sign} field="astro.hb.moon" introPart="moon" yours={western} yoursLabel="Your sun sign"
      variantOf={(k) => K.hbMoon(k, sign)}
      render={(it) => ({ title: it.heading, text: [it.formula, it.text].filter(Boolean).join("\n\n") })} />
  );
}

/** The Seasons: the user's birth season first. */
export function HbSeasons({ ch, sign, day, month }: { ch: HbChapter; sign: string; day?: number; month: number }) {
  const season = day ? birthSeason(day, month) : undefined;
  return (
    <SectionLayer section={ch.seasons} sign={sign} field="astro.hb.season" yours={season} yoursLabel="Your season"
      variantOf={(k) => K.hbSeason(k || season || "Spring", sign)} />
  );
}

/** Famous people, by element (the user's element first). */
export function HbFamous({ ch, sign, element }: { ch: HbChapter; sign: string; element: string }) {
  return (
    <SectionLayer section={ch.famous} sign={sign} field="astro.hb.famous" yours={element} yoursLabel="Your element"
      variantOf={() => K.sign(sign)} partOf={(k) => k.toLowerCase()}
      render={(it) => ({ title: it.heading, text: it.text.split("\n").map((n) => `• ${n}`).join("\n") })} />
  );
}
