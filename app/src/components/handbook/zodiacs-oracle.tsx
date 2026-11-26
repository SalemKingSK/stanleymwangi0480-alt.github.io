/**
 * "Chinese Zodiacs" (the user's second book, read on the device) inside the
 * Animal Oracle: the Foundations (the twelve animals, your horoscope, Yang and
 * Yin, the Elements with the Creation and Destruction Cycles, the animals'
 * natural elements, the meanings of the elements) and each animal's chapter.
 * Every passage is word for word, with its own Listen.
 */
import * as React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AccordionContentWithPlayer } from "@/components/profile-generator/accordion-content-with-player";
import { K } from "@/lib/curriculum/catalogue";
import type { HbAnimal } from "@/lib/handbook/types";
import { animalMoon, animalPolarity, type ZgChapter, type Zodiacs } from "@/lib/handbook/zodiacs";
import { BookTag, Passage, Title, YoursBadge, itemCls, triggerCls, yoursFirst } from "./handbook-oracle";

const TAG = "Chinese Zodiacs";

// ── The elements wheel ────────────────────────────────────────────────────

const WHEEL: string[] = ["Wood", "Fire", "Earth", "Metal", "Water"];
const COLORS: Record<string, string> = { Wood: "#4caf7d", Fire: "#e0603a", Earth: "#c9a14a", Metal: "#c8d0dc", Water: "#3a8ee0" };
const CREATES: Record<string, string> = { Wood: "Fire", Fire: "Earth", Earth: "Metal", Metal: "Water", Water: "Wood" };
const DESTROYS: Record<string, string> = { Wood: "Earth", Earth: "Water", Water: "Fire", Fire: "Metal", Metal: "Wood" };

/**
 * The five elements in their Creation order around a circle; `mode` draws the
 * Creation Cycle (round the rim) or the Destruction Cycle (the star inside).
 * The reader's own element is ringed.
 */
export function ElementsWheel({ mode, element }: { mode: "creation" | "destruction"; element?: string }) {
  const R = 74, C = 100;
  const pos = (i: number) => {
    const a = (-90 + i * 72) * (Math.PI / 180);
    return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
  };
  const pairs = WHEEL.map((e) => [e, mode === "creation" ? CREATES[e] : DESTROYS[e]] as const);
  const stroke = mode === "creation" ? "#4caf7d" : "#e0603a";
  const id = `mc-arrow-${mode}`;
  return (
    <figure className="flex flex-col items-center gap-1 my-2" aria-label={mode === "creation" ? "The Creation Cycle" : "The Destruction Cycle"}>
      <svg viewBox="0 0 200 200" className="w-52 h-52" role="img">
        <defs>
          <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={stroke} />
          </marker>
        </defs>
        <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(255,255,255,0.08)" />
        {pairs.map(([a, b]) => {
          const p = pos(WHEEL.indexOf(a)), q = pos(WHEEL.indexOf(b));
          const dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy);
          const sx = p.x + (dx / len) * 20, sy = p.y + (dy / len) * 20, ex = q.x - (dx / len) * 22, ey = q.y - (dy / len) * 22;
          const mine = element === a || element === b;
          return (
            <line key={a} x1={sx} y1={sy} x2={ex} y2={ey} stroke={stroke} strokeOpacity={mine ? 1 : 0.45} strokeWidth={mine ? 2.4 : 1.4}
              strokeDasharray={mode === "destruction" ? "4 3" : undefined} markerEnd={`url(#${id})`} />
          );
        })}
        {WHEEL.map((e, i) => {
          const p = pos(i);
          const mine = e === element;
          return (
            <g key={e}>
              <circle cx={p.x} cy={p.y} r={18} fill={`${COLORS[e]}33`} stroke={COLORS[e]} strokeWidth={mine ? 3 : 1.2} />
              <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize="9.5" fontWeight={mine ? 800 : 600} fill="#e8e6f0">{e}</text>
            </g>
          );
        })}
      </svg>
      {element && (
        <figcaption className="text-[11px] text-slate-400 text-center px-2">
          {mode === "creation"
            ? `Your ${element} is fed by ${WHEEL.find((e) => CREATES[e] === element)} and feeds ${CREATES[element]}.`
            : `Your ${element} overcomes ${DESTROYS[element]} and is overcome by ${WHEEL.find((e) => DESTROYS[e] === element)}.`}
        </figcaption>
      )}
    </figure>
  );
}

// ── Foundations layer ─────────────────────────────────────────────────────

const FOUND = "astro.zg.found";

export function ZgFoundations({ z, sign, element, western }: { z: Zodiacs; sign: string; element: string; western: string }) {
  const polarity = animalPolarity(sign);
  const moon = animalMoon(western);
  const natural = z.natural[sign as HbAnimal];
  const yours: Record<string, string | undefined> = {
    "Yang and Yin": `You: ${polarity}`,
    "The Natural Elements of the Animals": natural ? `${sign}: ${natural.polarity} · ${natural.element}` : undefined,
  };
  return (
    <div className="space-y-3" data-handbook="foundations">
      <div className="rounded-lg bg-white/5 px-3 py-2 text-[12px] text-slate-300">
        Your chart in the book's terms: <span className="text-amber-100 font-semibold">{polarity} {element} {sign}</span>
        {moon && <> in the <span className="text-amber-100 font-semibold">Moon of the {moon === "Rabbit" ? "Hare" : moon}</span> ({western})</>}.
      </div>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {z.foundations.map((f) => {
          if (f.key === "Meanings of the Elements") return null;
          const diagram = f.key === "The Creation Cycle" ? "creation" : f.key === "The Destruction Cycle" ? "destruction" : null;
          return (
            <AccordionItem key={f.key} value={f.key} className={itemCls}>
              <AccordionTrigger className={triggerCls} data-study-open={`${FOUND}|${f.key}`}>
                <Title>{f.heading}{yours[f.key] ? <YoursBadge label={yours[f.key]} /> : null}</Title>
              </AccordionTrigger>
              <AccordionContent>
                {diagram && <ElementsWheel mode={diagram} element={element} />}
                <AccordionContentWithPlayer text={f.text} study={{ field: FOUND, variant: f.key }} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
        {z.meanings && (
          <AccordionItem value="meanings" className={itemCls}>
            <AccordionTrigger className={triggerCls} data-study-open={`${FOUND}|Meanings of the Elements`}>
              <Title>{z.meanings.heading}<YoursBadge label={`You: ${polarity} ${element}`} /></Title>
            </AccordionTrigger>
            <AccordionContent>
              {z.meanings.intro && <AccordionContentWithPlayer text={z.meanings.intro} study={{ field: FOUND, variant: "Meanings of the Elements" }} />}
              <Accordion type="single" collapsible className="w-full space-y-2 mt-3">
                {yoursFirst(z.meanings.items, element).map((m) => {
                  const variant = K.zgElementPeople(m.key);
                  return (
                    <AccordionItem key={m.key} value={m.key} className={itemCls}>
                      <AccordionTrigger className={triggerCls} data-study-open={`${FOUND}|${variant}`}>
                        <Title>
                          <span style={{ color: COLORS[m.key] }}>●</span> {m.heading}{m.key === element ? <YoursBadge label="Your element" /> : null}
                        </Title>
                      </AccordionTrigger>
                      <AccordionContent>
                        <AccordionContentWithPlayer text={m.text} study={{ field: FOUND, variant, part: "main" }} />
                        <Accordion type="single" collapsible className="w-full space-y-2 mt-3">
                          {(polarity === "Yin" ? [["yin", m.yin], ["yang", m.yang]] as const : [["yang", m.yang], ["yin", m.yin]] as const).map(([part, p]) =>
                            p ? (
                              <Passage key={part} value={part} title={p.heading} text={p.text} field={FOUND} variant={variant} part={part}
                                yours={m.key === element && part === polarity.toLowerCase() ? "You" : false} />
                            ) : null,
                          )}
                        </Accordion>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}

// ── An animal's chapter ───────────────────────────────────────────────────

/** Opening, Virtues, Vices and Personality (the Personality layer). */
export function ZgCharacter({ ch, sign }: { ch: ZgChapter; sign: string }) {
  const v = K.sign(sign);
  const f = "astro.zg.character";
  const opening = [ch.years, ch.opening].filter(Boolean).join("\n\n");
  return (
    <div className="space-y-2" data-handbook="zg-character">
      <BookTag>{TAG} · {ch.title}</BookTag>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {opening && <Passage value="zg-opening" title={ch.title} text={opening} field={f} variant={v} part="opening" />}
        {ch.virtues && <Passage value="zg-virtues" title={ch.virtues.heading} text={ch.virtues.text} field={f} variant={v} part="virtues" />}
        {ch.vices && <Passage value="zg-vices" title={ch.vices.heading} text={ch.vices.text} field={f} variant={v} part="vices" />}
        {ch.personality && <Passage value="zg-personality" title={ch.personality.heading} text={ch.personality.text} field={f} variant={v} part="personality" />}
      </Accordion>
    </div>
  );
}

/** In Love (with lovers, friends and enemies) and Career. */
export function ZgLoveCareer({ ch, sign }: { ch: ZgChapter; sign: string }) {
  const v = K.sign(sign);
  return (
    <Accordion type="single" collapsible className="w-full space-y-2" data-handbook="zg-love">
      {ch.love && <Passage value="love" title={ch.love.heading} text={ch.love.text} field="astro.zg.love" variant={v} part="love" />}
      {ch.career && <Passage value="career" title={ch.career.heading} text={ch.career.text} field="astro.zg.love" variant={v} part="career" />}
    </Accordion>
  );
}

/** "The Rat and the Five Elements" in the Element layer, the reader's element first. */
export function ZgFive({ ch, sign, element }: { ch: ZgChapter; sign: string; element: string }) {
  const s = ch.five;
  if (!s?.items.length) return null;
  return (
    <div className="space-y-2" data-handbook="zg-five">
      <BookTag>{TAG} · {s.heading}</BookTag>
      {s.intro && <AccordionContentWithPlayer text={s.intro} study={{ field: "astro.zg.five", variant: K.element(element, sign), part: "intro" }} />}
      <Accordion type="single" collapsible className="w-full space-y-2">
        {yoursFirst(s.items, element).map((it) => (
          <Passage key={it.key} value={`zg-${it.key}`} title={it.heading} text={it.text} field="astro.zg.five" variant={K.element(it.key, sign)} yours={it.key === element} />
        ))}
      </Accordion>
    </div>
  );
}

/** "The Year of the Rat", at the top of the Temporal Trajectory. */
export function ZgYear({ ch, sign }: { ch: ZgChapter; sign: string }) {
  if (!ch.year?.text) return null;
  return (
    <Accordion type="single" collapsible className="w-full space-y-2" data-handbook="zg-year">
      <Passage value="zg-year" title={<>📖 {ch.year.heading}</>} text={ch.year.text} field="astro.zg.year" variant={K.sign(sign)} />
    </Accordion>
  );
}

/** "The Rat in the Ox Year", inside that year of the Temporal Trajectory. */
export function ZgFortune({ ch, sign, animal }: { ch: ZgChapter; sign: string; animal: string }) {
  const it = ch.fortunes?.items.find((i) => i.key === animal);
  if (!it) return null;
  return (
    <div className="pt-2" data-handbook="zg-fortune">
      <BookTag>{TAG} · {ch.fortunes!.heading}</BookTag>
      <AccordionContentWithPlayer text={`**${it.heading}:** ${it.text}`} study={{ field: "astro.zg.fortune", variant: K.future(sign, animal) }} />
    </div>
  );
}
