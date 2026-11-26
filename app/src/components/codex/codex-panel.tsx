"use client";

/**
 * The Codex panels — the Number Codex (numerology tab) and the Animal Codex
 * (astrology tab). Laid out like the Psychic Number panel: numbered layers,
 * one open at a time, each with its own Listen player and Curriculum tag.
 */
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { K } from "@/lib/curriculum/catalogue";
import {
  CODEX_ANIMALS,
  CODEX_NUMBERS,
  TRINES,
  animalName,
  codexAnimal,
  codexAnimalKey,
  codexNumber,
  codexNumbersFor,
  enemyOf,
  type CodexEntry,
  type CodexLayer,
} from "@/lib/codex";
import { AccordionContentWithPlayer } from "@/components/profile-generator/accordion-content-with-player";

const contentVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

// Full class strings so Tailwind keeps them.
const TONES = [
  { pill: "bg-purple-500/10 text-purple-400 border-purple-500/30", title: "text-purple-200 group-hover:text-purple-400", arrow: "text-purple-500/40", card: "bg-purple-950/10 border-purple-500/40" },
  { pill: "bg-amber-500/10 text-amber-400 border-amber-500/30", title: "text-amber-200 group-hover:text-amber-400", arrow: "text-amber-500/40", card: "bg-amber-950/10 border-amber-500/40" },
  { pill: "bg-teal-500/10 text-teal-400 border-teal-500/30", title: "text-teal-200 group-hover:text-teal-400", arrow: "text-teal-500/40", card: "bg-teal-950/10 border-teal-500/40" },
  { pill: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", title: "text-emerald-200 group-hover:text-emerald-400", arrow: "text-emerald-500/40", card: "bg-emerald-950/10 border-emerald-500/40" },
  { pill: "bg-rose-500/10 text-rose-400 border-rose-500/30", title: "text-rose-200 group-hover:text-rose-400", arrow: "text-rose-500/40", card: "bg-rose-950/10 border-rose-500/40" },
  { pill: "bg-sky-500/10 text-sky-400 border-sky-500/30", title: "text-sky-200 group-hover:text-sky-400", arrow: "text-sky-500/40", card: "bg-sky-950/10 border-sky-500/40" },
  { pill: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30", title: "text-indigo-200 group-hover:text-indigo-300", arrow: "text-indigo-500/40", card: "bg-indigo-950/10 border-indigo-500/40" },
  { pill: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30", title: "text-fuchsia-200 group-hover:text-fuchsia-400", arrow: "text-fuchsia-500/40", card: "bg-fuchsia-950/10 border-fuchsia-500/40" },
];

interface Choice {
  key: string;
  label: string;
  note?: string;
}

function Chip({ choice, active, hint, onPick }: { choice: Choice; active: boolean; hint: string; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={active}
      data-study-open={hint}
      className={`px-3 py-1.5 rounded-full border text-[11px] font-cinzel font-semibold tracking-wide transition-colors ${
        active ? "bg-amber-500/15 text-amber-300 border-amber-400/50" : "bg-white/[0.03] text-purple-200/80 border-white/10 hover:border-purple-400/40"
      }`}
    >
      {choice.label}
      {choice.note && <span className="ml-1.5 text-[10px] font-body font-normal opacity-70">· {choice.note}</span>}
    </button>
  );
}

function TrineMatrix({ animal }: { animal: string }) {
  const foe = enemyOf(animal);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4" aria-label="The Strategic Matrix">
      {TRINES.map((t) => {
        const mine = t.members.includes(animal);
        return (
          <div key={t.id} className={`p-3 rounded-xl border ${mine ? "border-amber-400/50 bg-amber-500/[0.07]" : "border-white/10 bg-slate-900/40"}`}>
            <div className={`font-cinzel text-[11px] font-bold uppercase tracking-widest ${mine ? "text-amber-300" : "text-purple-300/80"}`}>{t.name}</div>
            <div className="flex flex-wrap gap-1.5 my-2">
              {t.members.map((m) => (
                <span
                  key={m}
                  className={`px-2 py-0.5 rounded-md text-[11px] border ${
                    m === animal ? "border-amber-400/60 text-amber-200 bg-amber-500/10" : m === foe ? "border-rose-400/50 text-rose-200 bg-rose-500/10" : "border-white/10 text-stone-300"
                  }`}
                >
                  {animalName(m)}
                  {m === animal ? " · you" : m === foe ? " · your enemy" : ""}
                </span>
              ))}
            </div>
            <div className="text-[11.5px] leading-relaxed text-stone-400">{t.signature}</div>
          </div>
        );
      })}
    </div>
  );
}

function LayerList({ entry, field, variant, animal }: { entry: CodexEntry; field: string; variant: string; animal?: string }) {
  const [open, setOpen] = useState<string | null>(entry.layers[0]?.id ?? null);
  useEffect(() => setOpen(entry.layers[0]?.id ?? null), [entry]);
  let lastGroup: string | undefined;
  return (
    <div className="flex flex-col gap-0">
      {entry.layers.map((layer: CodexLayer, i) => {
        const tone = TONES[i % TONES.length];
        const isOpen = open === layer.id;
        const groupHead = layer.group && layer.group !== lastGroup ? layer.group : null;
        lastGroup = layer.group;
        return (
          <React.Fragment key={layer.id}>
            {groupHead && (
              <div className="flex items-center gap-3 mt-4 mb-1">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
                <span className="font-cinzel text-[10.5px] uppercase tracking-[0.25em] text-amber-300/80">{groupHead}</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
              </div>
            )}
            <div className="border-b border-white/5">
              <button
                type="button"
                className="w-full flex items-center justify-between py-3.5 group text-left gap-3"
                onClick={() => setOpen((p) => (p === layer.id ? null : layer.id))}
                aria-expanded={isOpen}
                data-study-open={`${field}|${variant}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full border font-cinzel ${tone.pill}`}>Layer {i + 1}</span>
                  <span className={`font-cinzel text-[13px] font-semibold transition-colors ${tone.title}`}>{layer.title}</span>
                  {layer.expounded && (
                    <span className="shrink-0 text-[9.5px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-sky-400/30 text-sky-300/80">Expounded</span>
                  )}
                </div>
                <span className={`shrink-0 transition-transform duration-200 ${tone.arrow} ${isOpen ? "rotate-180" : ""}`}>▾</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div key={layer.id} variants={contentVariants} initial="hidden" animate="visible" exit="exit" style={{ overflow: "hidden" }}>
                    <div className="pb-6">
                      <div className={`p-4 rounded-xl border-l-2 text-sm leading-relaxed text-stone-300 ${tone.card}`}>
                        {layer.matrix && animal && <TrineMatrix animal={animal} />}
                        <AccordionContentWithPlayer text={layer.text} study={{ field, variant, part: layer.id }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function PerspectiveNote({ entry, name }: { entry: CodexEntry; name: string }) {
  if (!entry.layers.some((l) => l.group)) return null;
  return (
    <p className="text-[11.5px] italic text-stone-400 mb-1">
      The {name} is held in two complete readings, kept side by side in full — Perspective I and Perspective II overlap in places and each adds what the other leaves out.
    </p>
  );
}

/** The Number Codex: the reading's Life Path and birth-day numbers first, any other number on request. */
export function NumberCodexPanel({ birthDay, birthMonth, birthYear }: { birthDay: number; birthMonth: number; birthYear: number }) {
  const mine = useMemo(() => codexNumbersFor(birthDay, birthMonth, birthYear), [birthDay, birthMonth, birthYear]);
  const [picked, setPicked] = useState<number>(mine[0]?.n ?? 1);
  useEffect(() => setPicked(mine[0]?.n ?? 1), [mine]);
  const [browse, setBrowse] = useState(false);
  const entry = codexNumber(picked);
  const field = "num.codex";
  const choice = (n: number, note?: string): Choice => ({ key: String(n), label: `${n > 9 ? "Master " : ""}Number ${n}`, note });
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {mine.map((m) => (
          <Chip key={m.n} choice={choice(m.n, m.why)} active={picked === m.n} hint={`${field}|${K.codexNumber(m.n)}`} onPick={() => setPicked(m.n)} />
        ))}
        <button
          type="button"
          data-no-study-open
          onClick={() => setBrowse((b) => !b)}
          aria-expanded={browse}
          className="px-3 py-1.5 rounded-full border border-dashed border-white/15 text-[11px] text-stone-400 hover:text-purple-200"
        >
          {browse ? "Hide other numbers" : "Explore every number"}
        </button>
      </div>
      {browse && (
        <div className="flex flex-wrap gap-1.5">
          {CODEX_NUMBERS.filter((n) => !mine.some((m) => m.n === n)).map((n) => (
            <Chip key={n} choice={choice(n)} active={picked === n} hint={`${field}|${K.codexNumber(n)}`} onPick={() => setPicked(n)} />
          ))}
        </div>
      )}
      {entry && (
        <div>
          <div className="mt-2 mb-1">
            <div className="font-cinzel text-[15px] font-bold text-amber-200">
              {picked > 9 ? "Master " : ""}Number {picked} — {entry.title}
            </div>
            {entry.subtitle && <div className="text-[11px] uppercase tracking-widest text-purple-300/70 mt-0.5">{entry.subtitle}</div>}
          </div>
          <PerspectiveNote entry={entry} name={`number ${picked}`} />
          <LayerList entry={entry} field={field} variant={K.codexNumber(picked)} />
        </div>
      )}
    </div>
  );
}

/** The Animal Codex: the reading's year animal first, any other animal on request. */
export function AnimalCodexPanel({ sign }: { sign: string }) {
  const own = codexAnimalKey(sign) ?? "Rat";
  const [picked, setPicked] = useState<string>(own);
  useEffect(() => setPicked(own), [own]);
  const [browse, setBrowse] = useState(false);
  const entry = codexAnimal(picked);
  const field = "astro.codex";
  const label = (a: string) => (a === "Rabbit" ? "Cat (Rabbit)" : a);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Chip choice={{ key: own, label: label(own), note: "your year animal" }} active={picked === own} hint={`${field}|${K.codexAnimal(own)}`} onPick={() => setPicked(own)} />
        <button
          type="button"
          data-no-study-open
          onClick={() => setBrowse((b) => !b)}
          aria-expanded={browse}
          className="px-3 py-1.5 rounded-full border border-dashed border-white/15 text-[11px] text-stone-400 hover:text-purple-200"
        >
          {browse ? "Hide other animals" : "Explore every animal"}
        </button>
      </div>
      {browse && (
        <div className="flex flex-wrap gap-1.5">
          {CODEX_ANIMALS.filter((a) => a !== own).map((a) => (
            <Chip key={a} choice={{ key: a, label: label(a) }} active={picked === a} hint={`${field}|${K.codexAnimal(a)}`} onPick={() => setPicked(a)} />
          ))}
        </div>
      )}
      {entry && (
        <div>
          <div className="mt-2 mb-1">
            <div className="font-cinzel text-[15px] font-bold text-amber-200">The {entry.title}</div>
            {picked === "Rabbit" && (
              <div className="text-[11px] uppercase tracking-widest text-purple-300/70 mt-0.5">This system reads the fourth sign as the Cat, not the Rabbit</div>
            )}
          </div>
          <PerspectiveNote entry={entry} name={animalName(picked)} />
          <LayerList entry={entry} field={field} variant={K.codexAnimal(picked)} animal={picked} />
        </div>
      )}
    </div>
  );
}
