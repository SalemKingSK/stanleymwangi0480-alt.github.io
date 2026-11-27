/**
 * The Foundations applied to a year: how a Chinese year (its element, polarity,
 * animal and Heavenly Stem) meets one birthday. Everything is worked out from
 * the Creation and Destruction Cycles, Yang and Yin, the animals' natural
 * elements and the animal relationships, then put into plain words with a clear
 * verdict: how favourable the year is, why, and what to do about it.
 */
import { chineseZodiacYear, lunarNewYearDate, stemBranchIndex } from "@/lib/astrology/chinese-calendar-math";
import {
  ANIMAL_INFO, MOON_SIGN, CONTROLLED_BY, CONTROLS, CONTROL_IMAGE, ELEMENTS, FED_BY, FEEDS, FEED_IMAGE, PLANET_ELEMENT, POLARITY, STEMS, WESTERN,
  type Animal, type Element, type Polarity,
} from "./data";
import { favourable, mediator, relation, yearPillar, type Birth, type Relation } from "./core";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const an = (w: string) => (/^[AEIOU]/.test(w) ? `an ${w}` : `a ${w}`);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const dirOf = (e: Element) => (ELEMENTS[e].direction.startsWith("the ") ? ELEMENTS[e].direction : `the ${ELEMENTS[e].direction}`);
const hare = (a: string) => (a === "Rabbit" ? "Rabbit (Hare)" : a);

// ── Animal relationships ──────────────────────────────────────────────────

const PAIRS = (list: [Animal, Animal][]) => (a: string, b: string) => list.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
const isClash = PAIRS([["Rat", "Horse"], ["Ox", "Goat"], ["Tiger", "Monkey"], ["Rabbit", "Rooster"], ["Dragon", "Dog"], ["Snake", "Pig"]]);
const isHarm = PAIRS([["Rat", "Goat"], ["Ox", "Horse"], ["Tiger", "Snake"], ["Rabbit", "Dragon"], ["Monkey", "Pig"], ["Rooster", "Dog"]]);
const isBreak = PAIRS([["Rat", "Rooster"], ["Ox", "Dragon"], ["Tiger", "Pig"], ["Rabbit", "Horse"], ["Goat", "Dog"], ["Monkey", "Snake"]]);
const isSecret = PAIRS([["Rat", "Ox"], ["Tiger", "Pig"], ["Rabbit", "Dog"], ["Dragon", "Rooster"], ["Snake", "Monkey"], ["Horse", "Goat"]]);
const TRINES: Animal[][] = [["Rat", "Dragon", "Monkey"], ["Ox", "Snake", "Rooster"], ["Tiger", "Horse", "Dog"], ["Rabbit", "Goat", "Pig"]];

export type AnimalBond = "own" | "trine" | "secret" | "clash" | "harm" | "break" | "neutral";
export function animalBond(mine: string, year: string): AnimalBond {
  if (mine === year) return "own";
  if (isClash(mine, year)) return "clash";
  if (TRINES.some((t) => t.includes(mine as Animal) && t.includes(year as Animal))) return "trine";
  if (isSecret(mine, year)) return "secret";
  if (isHarm(mine, year)) return "harm";
  if (isBreak(mine, year)) return "break";
  return "neutral";
}

// ── Heavenly Stems ────────────────────────────────────────────────────────

const STEM_KEYS = ["Yang Wood", "Yin Wood", "Yang Fire", "Yin Fire", "Yang Earth", "Yin Earth", "Yang Metal", "Yin Metal", "Yang Water", "Yin Water"];
/** The five stem unions (甲己, 乙庚, 丙辛, 丁壬, 戊癸) and the element each union produces. */
const UNION_ELEMENT: Element[] = ["Earth", "Metal", "Water", "Wood", "Fire"];
export function stemMeeting(mine: number, year: number): "same" | "union" | "clash" | "other" {
  if (mine === year) return "same";
  if (Math.abs(mine - year) === 5) return "union";
  // 甲庚, 乙辛, 丙壬, 丁癸: the same polarity, one element overcoming the other across the wheel.
  if (Math.abs(mine - year) === 6 && Math.min(mine, year) <= 3) return "clash";
  return "other";
}

// ── Solar months ──────────────────────────────────────────────────────────

/** The twelve solar months of a Chinese year (approximate start dates) and the natural element of each month's animal. */
const SOLAR_MONTHS: { animal: Animal; month: number; day: number }[] = [
  { animal: "Tiger", month: 2, day: 4 }, { animal: "Rabbit", month: 3, day: 6 }, { animal: "Dragon", month: 4, day: 5 },
  { animal: "Snake", month: 5, day: 6 }, { animal: "Horse", month: 6, day: 6 }, { animal: "Goat", month: 7, day: 7 },
  { animal: "Monkey", month: 8, day: 8 }, { animal: "Rooster", month: 9, day: 8 }, { animal: "Dog", month: 10, day: 8 },
  { animal: "Pig", month: 11, day: 7 }, { animal: "Rat", month: 12, day: 7 }, { animal: "Ox", month: 1, day: 6 },
];

export interface MonthNote { label: string; animal: Animal; element: Element; relation: Relation; now: boolean; past: boolean }
export function monthsOf(chineseYear: number, el: Element, now: Date): MonthNote[] {
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const startOf = (i: number) => {
    const m = SOLAR_MONTHS[i];
    return Date.UTC(m.month === 1 ? chineseYear + 1 : chineseYear, m.month - 1, m.day);
  };
  return SOLAR_MONTHS.map((m, i) => {
    const start = startOf(i);
    const end = i < 11 ? startOf(i + 1) : Date.UTC(chineseYear + 1, 1, 4);
    const element = ANIMAL_INFO[m.animal].fixed;
    const s0 = new Date(start), e0 = new Date(end - 86400000);
    return {
      label: `${MONTHS[s0.getUTCMonth()].slice(0, 3)} ${s0.getUTCDate()}, ${s0.getUTCFullYear()} – ${MONTHS[e0.getUTCMonth()].slice(0, 3)} ${e0.getUTCDate()}`,
      animal: m.animal, element, relation: relation(el, element), now: today >= start && today < end, past: today >= end,
    };
  });
}

/** The next twelve solar months from `now` (running on into the following Chinese year). */
export function nextTwelveMonths(chineseYear: number, el: Element, now: Date): MonthNote[] {
  return [...monthsOf(chineseYear, el, now), ...monthsOf(chineseYear + 1, el, now)].filter((m) => !m.past).slice(0, 12);
}

// ── The verdict ───────────────────────────────────────────────────────────

export type Rating = "very favourable" | "favourable" | "mixed" | "testing" | "difficult";
const ELEMENT_SCORE: Record<Relation, number> = { same: 2, "feeds-you": 2, "you-feed": 1, "you-control": -1, "controls-you": -2 };
const BOND_SCORE: Record<AnimalBond, number> = { own: -0.5, trine: 1.5, secret: 1.5, clash: -2, harm: -1, break: -1, neutral: 0 };

export interface YearForecast {
  year: number;
  pillar: { element: Element; polarity: Polarity; animal: Animal };
  /** "Yang Fire Horse". */
  name: string;
  starts: string;
  ends: string;
  element: Element;
  elementRelation: Relation;
  elementGood: boolean;
  bond: AnimalBond;
  score: number;
  stars: number;
  rating: Rating;
  /** One line: "2026 · Yang Fire Horse — a testing year for you". */
  headline: string;
  /** Two or three sentences for the alerts. */
  summary: string;
  /** The full reading. */
  text: string;
  /** "In 2026" paragraphs for each Foundations section. */
  sections: Record<"horoscope" | "yinyang" | "elements" | "planets" | "creation" | "destruction" | "natural" | "meanings", string>;
  months: MonthNote[];
  /** Whether the year is behind, in force on, or ahead of today. */
  when: "past" | "current" | "future";
  /** Curriculum variant: "Metal person · Fire year". */
  variant: string;
}

function ratingOf(score: number): { rating: Rating; stars: number } {
  if (score >= 3) return { rating: "very favourable", stars: 5 };
  if (score >= 1.5) return { rating: "favourable", stars: 4 };
  if (score >= -0.5) return { rating: "mixed", stars: 3 };
  if (score >= -2) return { rating: "testing", stars: 2 };
  return { rating: "difficult", stars: 1 };
}

/** What each element stands for in a life when it arrives as the year (the classic family of relations). */
const ROLE: Record<Relation, string> = {
  same: "the companion — friends, siblings, colleagues and rivals; your own kind of people and your own way of doing things",
  "feeds-you": "the resource — support, mentors, parents, learning, qualifications, rest and protection",
  "you-feed": "the output — self-expression, creativity, teaching, children, performance and new projects",
  "you-control": "wealth — money, possessions and the things you work to win and manage",
  "controls-you": "authority — bosses, rules, deadlines, status, reputation and pressure",
};

const ELEMENT_YEAR_WORDS: Record<Element, string> = {
  Wood: "growth, planting, learning and new starts",
  Fire: "speed, visibility, passion, publicity and heated tempers",
  Earth: "consolidation, property, family, patience and steady building",
  Metal: "decisions, cutting back, contracts, money and firm rules",
  Water: "communication, travel, ideas, networking and quiet planning",
};

function elementVerdict(el: Element, Y: Element, year: number, yName: string): string {
  const r = relation(el, Y);
  const m = mediator(Y);
  const goodList = [el, FED_BY[el], FEEDS[el]];
  const badList = [CONTROLLED_BY[el], CONTROLS[el]];
  const lines: string[] = [];
  lines.push(`As ${an(el)} person, your kind years are those of ${goodList[0]} (your own element), ${goodList[1]} (which feeds you) and ${goodList[2]} (which you feed). Your harder years are those of ${badList[0]} (which overcomes you) and ${badList[1]} (which you overcome). ${year} is ${an(Y)} year, so it falls among your ${favourable(r) ? "**kind**" : "**harder**"} years.`);
  switch (r) {
    case "same":
      lines.push(`**${Y} meets ${Y}: your own element comes home.** A year of your own element is traditionally one of the luckiest you can have. The world moves at your natural pace, and the things you are best at — ${ELEMENTS[el].gifts} — are exactly what the year asks for. People of your element are drawn to you, and plans that suit your temperament go ahead with less friction. The year's element stands for ${ROLE.same}: expect to work closely with peers, and to find allies who think as you do.`);
      lines.push(`The one risk is too much of a good thing. Your element doubled also doubles its shadow — ${ELEMENTS[el].shadow} — and competition can come from people very like you. Give the extra energy an outlet through ${FEEDS[el]}, the element you feed, so that it turns into results rather than stubbornness.`);
      break;
    case "feeds-you":
      lines.push(`**${Y} feeds ${el}: a nourishing year.** ${cap(FEED_IMAGE[Y])}, and in the same way this year pours energy into you. It is counted among your fortunate years: help tends to arrive when you need it, older or more experienced people take your side, and what you learn now pays you back for years. The year's element stands for ${ROLE["feeds-you"]}.`);
      lines.push(`Make use of it: ask for support rather than struggling alone, study, train, gain a qualification, mend your health and your home base. The only caution is complacency — a supportive year can make you passive, so pair the comfort with one clear goal of your own.`);
      break;
    case "you-feed":
      lines.push(`**${el} feeds ${Y}: a productive, generous year.** ${cap(FEED_IMAGE[el])} — you are the source and the year draws on you. It is still one of your good years, because what flows out of you now becomes visible: work you create, things you teach, children, projects and ideas you put into the world. The year's element stands for ${ROLE["you-feed"]}.`);
      lines.push(`The price is energy. A year that feeds on your element can leave you tired, over-committed or giving more than you get back. Pace yourself, choose fewer and better projects, and recharge with ${FED_BY[el]}, the element that feeds you (${ELEMENTS[FED_BY[el]].balance}).`);
      break;
    case "you-control":
      lines.push(`**${el} overcomes ${Y}: a year you must master.** Like ${CONTROL_IMAGE[el]}, you have the upper hand, but only through effort. Tradition counts this among your harder years because everything worth having must be worked for and defended. The element you overcome stands for ${ROLE["you-control"]} — so this can be a year of real gains, especially in money and possessions, for those who are prepared to graft.`);
      lines.push(`Expect a demanding workload, and do not spend faster than you earn — wealth years can also be years of big expenses. Keep your strength up: the go-between element ${mediator(el)} (${el} feeds ${mediator(el)}, which feeds ${Y}) turns hard labour into smooth flow, so bring in its colours (${ELEMENTS[mediator(el)].colors}) and its habits (${ELEMENTS[mediator(el)].balance}).`);
      break;
    case "controls-you":
      lines.push(`**${Y} overcomes ${el}: the most testing kind of year for you.** Like ${CONTROL_IMAGE[Y]}, a ${Y} year presses directly on a ${el} person. Plans can meet resistance, authority figures can be demanding, and your usual way of doing things may not work as well. The element that overcomes you stands for ${ROLE["controls-you"]}.`);
      lines.push(`It is a test, not a sentence. Pressure also shapes: people who keep their discipline in a year like this often gain rank, recognition or a hard-won skill. Avoid big gambles and confrontations, double-check contracts, and look after the parts of the body traditionally linked with ${el} (${ELEMENTS[el].organs}). Above all use the go-between: ${Y} feeds ${m}, and ${m} feeds ${el}, so ${m} turns the year's pressure into support. Wear or surround yourself with ${ELEMENTS[m].colors}, turn your desk or seat towards ${dirOf(m)} when you work, and lean on ${m} habits — ${ELEMENTS[m].balance}.`);
      break;
  }
  lines.push(`In general a ${Y} year brings ${ELEMENT_YEAR_WORDS[Y]} for everyone; for you it means ${({ same: "doing more of what you already do well", "feeds-you": "being carried forward by that energy", "you-feed": "putting your own energy into it", "you-control": "working hard to bring it under your control", "controls-you": "adapting to it instead of fighting it" } as Record<Relation, string>)[r]}. (${yName} runs from the lunar new year.)`);
  return lines.join("\n\n");
}

function bondText(sign: string, ya: Animal, year: number): string {
  const b = animalBond(sign, ya);
  const t: Record<AnimalBond, string> = {
    own: `${year} is your own animal's year. Chinese tradition is cautious about this: you are said to "meet the Grand Duke" (běn mìng nián), a year of change, exposure and unexpected turns rather than easy luck. Many people wear red for protection in their own year. It is a year to consolidate, keep a low profile in conflicts and be careful with health and money — and a good year to take stock of the last twelve.`,
    trine: `The ${ya} belongs to your own affinity group of three (the ${TRINES.find((t) => t.includes(ya))!.join(", ")}). Its year is a friendly one for the ${sign}: people cooperate, introductions lead somewhere and you feel in step with events.`,
    secret: `The ${ya} is the ${sign}'s secret friend — one of the closest pairings in the zodiac. Its year tends to bring quiet help, loyal partnerships and doors that open through personal connections.`,
    clash: `The ${ya} sits directly opposite the ${sign} on the zodiac wheel. Its year is a clash year for you (chōng): expect upheaval, moves, changes of job or relationship, and sudden decisions. Do not take big risks on impulse; if change is coming, steer it rather than resist it.`,
    harm: `The ${ya} and the ${sign} are a "harm" pair: the year can bring misunderstandings, petty rivalries and people who are not what they seem. Be clear in what you say, and keep your trust for those who have earned it.`,
    break: `The ${ya} and the ${sign} form a "break" pair: plans can be interrupted, agreements renegotiated and some things may need rebuilding. Leave room for delays.`,
    neutral: `The ${ya} is neither friend nor foe to the ${sign}, so the animal of the year neither adds to nor takes away from what the element promises.`,
  };
  return t[b];
}

/** How a Chinese year meets this birthday. */
export function yearForecast(b: Birth, year: number, now = new Date()): YearForecast {
  const el = b.element as Element;
  const sign = b.sign as Animal;
  const p = yearPillar(year);
  const name = `${p.polarity} ${p.element} ${p.animal}`;
  const myZy = chineseZodiacYear(b.day, b.month, b.year);
  const myStem = stemBranchIndex(myZy).stem;
  const yStem = stemBranchIndex(year).stem;
  const myPol: Polarity = myStem % 2 === 0 ? "Yang" : "Yin";
  const r = relation(el, p.element);
  const bond = animalBond(sign, p.animal);
  const fixed = ANIMAL_INFO[sign].fixed;
  const rFixed = relation(fixed, p.element);
  const yearAnimalFixed = ANIMAL_INFO[p.animal].fixed;
  const rYearAnimal = relation(el, yearAnimalFixed);
  const meet = stemMeeting(myStem, yStem);
  const score =
    ELEMENT_SCORE[r] + BOND_SCORE[bond] + (favourable(rFixed) ? 0.5 : rFixed === "controls-you" ? -0.5 : 0) +
    (meet === "union" ? 0.5 : meet === "clash" ? -0.5 : 0);
  const { rating, stars } = ratingOf(score);
  const lny = lunarNewYearDate(year), nxt = lunarNewYearDate(year + 1);
  const starts = lny ? `${MONTHS[lny.month - 1]} ${lny.day}, ${year}` : `early ${year}`;
  const endD = nxt ? new Date(Date.UTC(year + 1, nxt.month - 1, nxt.day) - 86400000) : null;
  const ends = endD ? `${MONTHS[endD.getUTCMonth()]} ${endD.getUTCDate()}, ${year + 1}` : `early ${year + 1}`;
  const cy = chineseZodiacYear(now.getDate(), now.getMonth() + 1, now.getFullYear());
  const when: YearForecast["when"] = year < cy ? "past" : year > cy ? "future" : "current";
  const months = monthsOf(year, el, now);
  // The year in force: the twelve months from today. Any other year: its own twelve months.
  const ahead = when === "current" ? nextTwelveMonths(year, el, now) : months.map((m) => ({ ...m, now: false, past: false }));
  const span = when === "current" ? "in the twelve ahead" : `of the ${year} year`;

  const headline = `${year} · ${name} — ${an(rating)} year for you`;
  const elWord = favourable(r) ? "one of your kind element years" : "one of your harder element years";
  const bondWord: Record<AnimalBond, string> = {
    own: "and it is your own animal's year, which asks for care",
    trine: `and the ${p.animal} is one of your allies`,
    secret: `and the ${p.animal} is your secret friend`,
    clash: `and the ${p.animal} clashes with your ${sign}`,
    harm: `and the ${p.animal} is an awkward match for your ${sign}`,
    break: `and the ${p.animal} tends to interrupt the ${sign}'s plans`,
    neutral: `while the ${p.animal} is neutral to your ${sign}`,
  };
  const advice: Record<Relation, string> = {
    same: `Lean into your strengths and give the extra energy an outlet in ${FEEDS[el]}.`,
    "feeds-you": "Accept help, learn and build — support is on your side.",
    "you-feed": `Create and give, but pace yourself and recharge with ${FED_BY[el]}.`,
    "you-control": `Gains come through hard work; keep strong with ${mediator(el)}.`,
    "controls-you": `Stay disciplined, avoid big gambles and bring in ${mediator(p.element)}, the element that softens ${p.element} for you.`,
  };
  const bondAdvice: Record<AnimalBond, string> = {
    own: " In your own animal's year keep a low profile in disputes and protect your health and savings.",
    trine: " Work with others — cooperation multiplies your luck.",
    secret: " Personal connections open the best doors.",
    clash: " Expect change — moves, new roles, endings and beginnings — and steer it rather than resist it.",
    harm: " Choose your confidants carefully and say exactly what you mean.",
    break: " Leave room for delays and renegotiations.",
    neutral: "",
  };
  const summary = `For ${an(el)} ${b.sign}, ${an(p.element)} year is ${elWord} (${p.element} ${({ same: "is your own element", "feeds-you": `feeds ${el}`, "you-feed": `draws on ${el}`, "you-control": `is overcome by ${el}`, "controls-you": `overcomes ${el}` } as Record<Relation, string>)[r]}), ${bondWord[bond]}. ${advice[r]}${bondAdvice[bond]}`;

  // ── Section paragraphs ──
  const sec = {} as YearForecast["sections"];
  const moonAnimal: Animal | undefined = MOON_SIGN[b.western];
  const hourBond = b.hour ? animalBond(b.hour, p.animal) : null;
  const moonBond = moonAnimal ? animalBond(moonAnimal, p.animal) : null;
  const bondShort: Record<AnimalBond, string> = { own: "is the same animal — a year of exposure and change", trine: "is an ally", secret: "is a secret friend", clash: "clashes with it", harm: "is an awkward match", break: "tends to interrupt it", neutral: "is neutral" };
  sec.horoscope = [
    `${year} is the year of the **${hare(p.animal)}** (${name}, ${starts} – ${ends}). ${bondText(sign, p.animal, year)}`,
    moonAnimal ? `Inwardly, your Moon of the ${moonAnimal === "Rabbit" ? "Hare" : moonAnimal}: the ${p.animal} ${bondShort[moonBond!]}${moonBond === "clash" ? ", so you may feel unsettled inside even when life looks calm" : moonBond === "trine" || moonBond === "secret" ? ", so emotionally the year feels easier than it may look" : ""}.` : "",
    b.hour ? `Your Hour of the ${b.hour}: the ${p.animal} ${bondShort[hourBond!]}. That colours the first impression you make on people this year.` : "",
  ].filter(Boolean).join("\n\n");

  const yPol = p.polarity;
  sec.yinyang = `${year} is a **${yPol}** year. ${yPol === myPol
    ? `It shares your ${myPol} polarity, so the mood of the year suits your nature: ${yPol === "Yang" ? "action is rewarded and you can push ahead" : "patience, planning and quiet work are rewarded"}. Guard against overdoing it — ${POLARITY[myPol].pitfalls}.`
    : `You are ${myPol}, so the year pulls you the other way: ${yPol === "Yang" ? "it asks you to be more visible, quicker and bolder than you naturally like. Step forward in small, deliberate moves rather than forcing yourself into a pace that is not yours, and protect quiet time to recover" : "it slows the world down around you, and pushing hard can meet a wall. Use the calmer energy to plan, deepen and finish, and save your big pushes for the moments that really count"}.`} Your ${sign} naturally prefers ${ANIMAL_INFO[sign].polarity}${ANIMAL_INFO[sign].polarity === yPol ? ", the same as the year" : `, while the year is ${yPol}`}.`;

  sec.elements = elementVerdict(el, p.element, year, `The ${name} year`);

  const yPlanet = ELEMENTS[p.element].planet;
  const west = WESTERN[b.western];
  const rulerEl = west ? PLANET_ELEMENT[west.ruler] : undefined;
  sec.planets = [
    `${year} is ${an(p.element)} year, so it is ruled by **${yPlanet}**, the ${p.element} Star — and your own element's planet is ${ELEMENTS[el].planet}. ${p.element === el ? `The year's planet is your own: ${yPlanet} is on your side all year.` : `${yPlanet} ${({ "feeds-you": `strengthens ${ELEMENTS[el].planet}'s influence in you`, "you-feed": `draws on ${ELEMENTS[el].planet}'s energy in you`, "you-control": `answers to ${ELEMENTS[el].planet} — you can bend the year to your will with effort`, "controls-you": `presses on ${ELEMENTS[el].planet} — the year's planet sets the terms`, same: "" } as Record<Relation, string>)[r]}.`}`,
    rulerEl ? `Your Western ruler, ${west!.ruler}, is ${an(rulerEl)} planet in Chinese terms: ${p.element} ${({ same: "is the same element, so your Western side feels at home this year", "feeds-you": `feeds it, so your ${b.western} side is boosted`, "you-feed": `draws on it, so your ${b.western} side spends a lot of energy`, "you-control": `is overcome by it, so your ${b.western} side can hold its own`, "controls-you": `overcomes it, so your ${b.western} side may feel held back` } as Record<Relation, string>)[relation(rulerEl, p.element)]}.` : west ? `Your Western ruler, ${west.ruler}, is ${west.ruler === "the Sun" ? "the Great Yang" : "the Great Yin"} — above the five elements, so the year's element does not weaken it.` : "",
  ].filter(Boolean).join("\n\n");

  const goodMonths = ahead.filter((m) => m.relation === "same" || m.relation === "feeds-you");
  const hardMonths = ahead.filter((m) => m.relation === "controls-you");
  const fmt = (ms: MonthNote[]) => ms.map((m) => `• ${m.animal} month (${m.label}) — ${m.element}${m.now ? " ← now" : ""}`).join("\n");
  sec.creation = [
    favourable(r) && r !== "same"
      ? r === "feeds-you" ? `In ${year} the Creation Cycle runs in your favour: the year's ${p.element} is your mother element and feeds you directly.` : `In ${year} the Creation Cycle runs through you: your ${el} feeds the year's ${p.element}, so it is a year of giving out and creating.`
      : r === "same" ? `In ${year} the year shares your element — you stand at the same point of the Creation Cycle as the year itself.` : `In ${year} the Creation Cycle is not directly on your side, so look for its help elsewhere: ${FED_BY[el]} feeds you, and you can find it in the months, people and surroundings of ${FED_BY[el]}.`,
    goodMonths.length ? `Your most supportive months ${span} (your own element, or the element that feeds you):\n${fmt(goodMonths)}` : "",
  ].filter(Boolean).join("\n\n");

  sec.destruction = [
    r === "controls-you"
      ? `**${year} puts you on the wrong side of the Destruction Cycle: ${p.element} overcomes ${el}.** This is the clearest warning in your chart for the year. Expect pressure and resistance, and meet it with the go-between ${mediator(p.element)} — ${p.element} feeds ${mediator(p.element)}, which feeds ${el}.`
      : r === "you-control"
        ? `**In ${year} you are the stronger side of the Destruction Cycle: ${el} overcomes ${p.element}.** You can win, but it costs effort; the go-between ${mediator(el)} keeps you from exhausting yourself.`
        : `**${year} does not set the Destruction Cycle against you**: ${p.element} neither overcomes your ${el} nor is overcome by it. The pressure, when it comes, comes from the months and people of ${CONTROLLED_BY[el]}.`,
    hardMonths.length ? `Months ${span} to handle with care (${CONTROLLED_BY[el]}, the element that overcomes you):\n${fmt(hardMonths)}\nIn those weeks avoid starting big ventures, signing in haste or picking fights, and lean on ${mediator(CONTROLLED_BY[el])}.` : "",
  ].filter(Boolean).join("\n\n");

  sec.natural = [
    `Your ${sign}'s natural element is ${fixed}. ${year}'s ${p.element} ${({ same: `is the same element, so the year suits your animal's instincts`, "feeds-you": `feeds it, so the ${sign} in you feels strengthened`, "you-feed": `draws on it, so the ${sign} in you gives a lot this year`, "you-control": `is overcome by it, so the ${sign} in you has the upper hand, with effort`, "controls-you": `overcomes it, so the ${sign} in you feels restrained` } as Record<Relation, string>)[rFixed]}.`,
    `The ${p.animal}, the animal of the year, has ${yearAnimalFixed} as its own natural element${yearAnimalFixed === p.element ? ` — the same as the year, so ${p.element} is especially strong in ${year}` : ""}. Against your ${el}, ${yearAnimalFixed} ${({ same: "is a match", "feeds-you": "is a support", "you-feed": "is a drain on your energy", "you-control": "is something you can master", "controls-you": "adds to the pressure" } as Record<Relation, string>)[rYearAnimal]}.`,
    `The ${sign} prefers ${ANIMAL_INFO[sign].polarity}; ${year} is ${yPol}. ${ANIMAL_INFO[sign].polarity === yPol ? "The year agrees with your animal's natural leaning." : "The year leans the other way, so give your animal time to adjust."}`,
  ].join("\n\n");

  const ms = STEMS[STEM_KEYS[myStem]], ys = STEMS[STEM_KEYS[yStem]];
  const meetText: Record<ReturnType<typeof stemMeeting>, string> = {
    same: `It is the same stem as yours, so the year speaks your language — ${ms.image} meeting ${ys.image}.`,
    union: `Your two stems form one of the five classic unions (${ms.chinese}${ys.chinese}), which together produce ${UNION_ELEMENT[Math.min(myStem, yStem) % 5]}. A union means attraction and partnership: the year tends to bring a bond, an offer or a meeting that matters.`,
    clash: `Your two stems are a classic clash (${ms.chinese}${ys.chinese}) — the same polarity, with one element overcoming the other. Expect strong opinions on both sides; diplomacy pays.`,
    other: `Picture ${ys.image} meeting ${ms.image}: ${({ same: "", "feeds-you": "the year's image nourishes yours", "you-feed": "your image spends itself on the year's", "you-control": "your image shapes the year's", "controls-you": "the year's image works on yours, testing and refining it" } as Record<Relation, string>)[r]}.`,
  };
  sec.meanings = `${year} is **${ys.pinyin} (${ys.chinese})**, ${STEM_KEYS[yStem]} — ${ys.image}; you are ${ms.pinyin} (${ms.chinese}), ${ms.image}. ${meetText[meet]}`;

  const text = [
    `### ${year}: the ${name} year (${starts} – ${ends})`,
    when === "past" ? `You are looking back at ${year}. Read this as how the year stood for you then: it can explain what happened, and the same pattern returns whenever ${an(p.element)} year or the ${p.animal} comes round again.` : "",
    when === "future" ? `You are looking ahead to ${year}. This is how the year is set to meet your chart, so you can plan for it well in advance.` : "",
    `**Verdict: ${rating}** ${"★".repeat(stars)}${"☆".repeat(5 - stars)} — ${summary}`,
    `### The elements: is ${year} kind to you?`,
    sec.elements,
    `### The animal of the year`,
    bondText(sign, p.animal, year),
    `### Yang and Yin`,
    sec.yinyang,
    `### Your animal's natural element`,
    sec.natural,
    `### Heavenly Stems`,
    sec.meanings,
    `### Month by month`,
    `Inside every Chinese year the solar months carry their own animals and elements, each starting around the beginning of a Western month. Here is how ${when === "current" ? "the next twelve months meet" : when === "past" ? `the twelve months of ${year} met` : `the twelve months of ${year} will meet`} your ${el}:`,
    ahead.map((m) => `• ${m.animal} month (${m.label}) — ${m.element}: ${({ same: "your own element, good", "feeds-you": "feeds you, good", "you-feed": "draws on you, productive", "you-control": "you overcome it, hard work", "controls-you": "overcomes you, take care" } as Record<Relation, string>)[m.relation]}${m.now ? " ← now" : ""}`).join("\n"),
  ].filter(Boolean).join("\n\n");

  return {
    year, pillar: p, name, starts, ends, element: p.element, elementRelation: r, elementGood: favourable(r), bond, score, stars, rating,
    headline, summary, text, sections: sec, months, when, variant: `${el} person · ${p.element} year`,
  };
}

/** "Yang Fire Horse" for a Chinese year. */
export function yearPillarName(year: number): string {
  const p = yearPillar(year);
  return `${p.polarity} ${p.element} ${p.animal}`;
}

/** The Chinese year in force on `now`. */
export function chineseYearNow(now = new Date()): number {
  return chineseZodiacYear(now.getDate(), now.getMonth() + 1, now.getFullYear());
}

/** The year in focus (default: the one in force on `now`) and the one after. */
export function focusAndNext(b: Birth, year: number | undefined, now = new Date()): { current: YearForecast; next: YearForecast } {
  const y = year ?? chineseYearNow(now);
  return { current: yearForecast(b, y, now), next: yearForecast(b, y + 1, now) };
}

/** The Chinese year in force on `now`, and the one after. */
export function currentAndNext(b: Birth, now = new Date()): { current: YearForecast; next: YearForecast } {
  const cy = chineseZodiacYear(now.getDate(), now.getMonth() + 1, now.getFullYear());
  return { current: yearForecast(b, cy, now), next: yearForecast(b, cy + 1, now) };
}
