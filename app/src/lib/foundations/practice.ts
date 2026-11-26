/**
 * Foundations in practice: each section of the Foundations — your horoscope,
 * Yang and Yin, the elements, the planets, the Creation and Destruction Cycles,
 * the animals' natural elements and the meanings of the elements — worked out
 * for one birthday, in plain words.
 */
import { chineseZodiacYear, lunarNewYearDate, solarTermYear, stemBranchIndex, ZODIAC_ANIMALS, STEM_ELEMENTS } from "@/lib/astrology/chinese-calendar-math";
import {
  ANIMAL_INFO, CONTROLLED_BY, CONTROLS, CONTROL_IMAGE, ELEMENTS, ELEMENT_ORDER, FED_BY, FEEDS, FEED_IMAGE, HOURS, MOON_NATURE, MOON_SIGN,
  PLANET_ELEMENT, POLARITY, STEMS, WESTERN, type Animal, type Element, type Polarity,
} from "./data";

export interface Birth {
  day: number;
  month: number;
  year: number;
  sign: string;
  element: string;
  western: string;
  /** Animal of the birth hour, when the reader has chosen it. */
  hour?: Animal | null;
}

export type SectionKey = "horoscope" | "yinyang" | "elements" | "planets" | "creation" | "destruction" | "natural" | "meanings";

export interface Reading {
  key: SectionKey;
  title: string;
  /** Short personal label shown on the section ("You: Yin"). */
  badge: string;
  /** Curriculum variant. */
  variant: string;
  text: string;
}

/** Curriculum variant for the planets section (element · Western ruler). */
export const K_PLANET = (el: string, ruler?: string) => `${el} · ${(ruler ?? "—").replace(/^the /, "")}`;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const shown = (a: string) => (a === "Rabbit" ? "Rabbit (Hare)" : a);
const lc = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const an = (w: string) => (/^[AEIOU]/.test(w) ? `an ${w}` : `a ${w}`);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function polarityOf(sign: string): Polarity {
  return ANIMAL_INFO[sign as Animal]?.polarity ?? "Yang";
}

export function animalMoonOf(western: string): Animal | null {
  return MOON_SIGN[western] ?? null;
}

/** Element and polarity of a Chinese year (from its Heavenly Stem). */
export function yearPillar(year: number): { element: Element; polarity: Polarity; animal: Animal } {
  const { stem, branch } = stemBranchIndex(year);
  return { element: STEM_ELEMENTS[Math.floor(stem / 2)] as Element, polarity: stem % 2 === 0 ? "Yang" : "Yin", animal: ZODIAC_ANIMALS[branch] as Animal };
}

export type Relation = "same" | "feeds-you" | "you-feed" | "you-control" | "controls-you";
/** How element `other` stands to element `mine`. */
export function relation(mine: Element, other: Element): Relation {
  if (mine === other) return "same";
  if (FEEDS[other] === mine) return "feeds-you";
  if (FEEDS[mine] === other) return "you-feed";
  if (CONTROLS[mine] === other) return "you-control";
  return "controls-you";
}
const REL_LABEL: Record<Relation, string> = {
  same: "your own element — lucky and familiar",
  "feeds-you": "it feeds you — supportive",
  "you-feed": "you feed it — productive, but it draws on your energy",
  "you-control": "you overcome it — rewards come, but only through effort",
  "controls-you": "it overcomes you — pressure and tests",
};
/** The traditional verdict on a year for a person of `mine`: own, mother and child years favour you; the two destruction links do not. */
export const favourable = (r: Relation) => r === "same" || r === "feeds-you" || r === "you-feed";

/** Element of the "go-between": it is fed by the controller and feeds the controlled, so it turns conflict into flow. */
export const mediator = (controller: Element): Element => FEEDS[controller];

function listAnd(xs: string[]): string {
  return xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
}

function animalsWithFixed(el: Element): Animal[] {
  return (Object.keys(ANIMAL_INFO) as Animal[]).filter((a) => ANIMAL_INFO[a].fixed === el);
}

// ── Sections ──────────────────────────────────────────────────────────────

function horoscope(b: Birth, el: Element, pol: Polarity): Reading {
  const moon = animalMoonOf(b.western);
  const zy = chineseZodiacYear(b.day, b.month, b.year);
  const lny = lunarNewYearDate(b.year);
  const out: string[] = [];
  out.push(`Your Chinese horoscope has layers, like a house with a front door, rooms inside and a private study. Here are yours.`);
  out.push(`### The year: ${pol} ${el} ${shown(b.sign)}`);
  out.push(`Your year of birth gives the animal people meet first — your public character and the life you build in the world. You are ${b.sign === "Ox" ? "an" : "a"} **${shown(b.sign)}**: ${ANIMAL_INFO[b.sign as Animal]?.nature}. The year also carries an element, **${el}**, and a polarity, **${pol}**, which colour that animal: the same ${b.sign} in another element would act quite differently.`);
  if (lny && (b.month === 1 || b.month === 2)) {
    const lnyStr = `${MONTHS[lny.month - 1]} ${lny.day}`;
    const before = zy !== b.year;
    const days = Math.round((Date.UTC(b.year, b.month - 1, b.day) - Date.UTC(b.year, lny.month - 1, lny.day)) / 86400000);
    if (Math.abs(days) <= 21) {
      out.push(`You were born close to the Chinese New Year, which in ${b.year} fell on **${lnyStr}**. Being born ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ${before ? "before" : "after"} it puts you in the ${before ? "previous" : "new"} year — ${before ? `the year that began in ${zy}` : `the year of ${b.year}`}. Cusp-born people often recognise something of the neighbouring sign in themselves; it is worth reading both.`);
    }
    const solar = solarTermYear(b.day, b.month, b.year);
    if (solar !== zy) {
      const alt = yearPillar(solar);
      out.push(`Some astrologers start the year at Lìchūn, the beginning of spring (about February 4), instead of the lunar new year. By that rule you would be a **${alt.polarity} ${alt.element} ${shown(alt.animal)}** — a second voice in your chart.`);
    }
  }
  out.push(`### The moon: ${moon ? `Moon of the ${shown(moon)}` : "your animal moon"}`);
  if (moon) {
    out.push(`Your month of birth gives your **animal moon**, which describes your inner, emotional nature — how you feel rather than how you appear. Your Western sign, ${b.western}, falls in the **Moon of the ${shown(moon)}**.`);
    out.push(MOON_NATURE[moon]);
    if (moon === b.sign) out.push(`Your year and your moon are the same animal, so what people see is very much what they get: a "double ${b.sign}", with that animal's gifts and blind spots both strengthened.`);
    else out.push(`Outwardly ${an(b.sign)}, inwardly ${an(moon)}: when the two seem to pull in different directions, the ${b.sign} is usually how you act and the ${moon} how you feel about it.`);
  }
  out.push(`### The hour: ${b.hour ? `Hour of the ${shown(b.hour)}` : "your animal hour"}`);
  if (b.hour) {
    const h = HOURS.find((x) => x.animal === b.hour)!;
    out.push(`Born between ${h.from} and ${h.to}, you were born in the **Hour of the ${shown(h.animal)}**. The hour animal shapes your temperament and the face you show the world: ${h.face}.`);
    if (h.animal === b.sign) out.push(`Your hour matches your year, so this animal is doubly yours — strong, unmistakable and hard to hide.`);
  } else {
    out.push(`Every two hours of the day belongs to one animal, and your birth hour shapes your temperament and the face you show to the world. Choose your birth time below to add it. (Use local time where you were born; if summer time was in force, take one hour off.)`);
  }
  out.push(`### In practice`);
  out.push(`• Year (${b.sign}) — how you live, work and are seen.\n• Element (${pol} ${el}) — the manner and energy you bring to everything.\n• Moon (${moon ?? "—"}) — what you need to feel safe and loved.${b.hour ? `\n• Hour (${b.hour}) — your first impression and natural temperament.` : ""}`);
  return { key: "horoscope", title: "Your Chinese Horoscope", badge: `${pol} ${el} ${b.sign}${moon ? ` · Moon of the ${moon === "Rabbit" ? "Hare" : moon}` : ""}`, variant: moon ? `Moon of the ${moon}` : b.sign, text: out.join("\n\n") };
}

function yinyang(b: Birth, pol: Polarity): Reading {
  const p = POLARITY[pol];
  const moon = animalMoonOf(b.western);
  const moonPol = moon ? ANIMAL_INFO[moon].polarity : null;
  const west = WESTERN[b.western];
  const parts: { label: string; pol: Polarity }[] = [{ label: `year (${b.sign})`, pol }];
  if (moon && moonPol) parts.push({ label: `moon (${moon})`, pol: moonPol });
  if (b.hour) parts.push({ label: `hour (${b.hour})`, pol: ANIMAL_INFO[b.hour].polarity });
  if (west) parts.push({ label: `Western sign (${b.western}, ${west.element})`, pol: west.polarity });
  const yang = parts.filter((x) => x.pol === "Yang").length;
  const yin = parts.length - yang;
  const out: string[] = [];
  out.push(`Yang and Yin are the two halves of every whole — not good and bad, but day and night, breathing out and breathing in. Your year makes you **${pol}** at heart: ${p.words}. Think of ${p.images}.`);
  out.push(`### What it means for you`);
  out.push(`${cap(p.strengths)}.`);
  out.push(`The flip side: ${p.pitfalls}.`);
  out.push(`### Your balance`);
  out.push(parts.map((x) => `• Your ${x.label}: ${x.pol}`).join("\n"));
  const lean = yang === yin ? "evenly balanced between Yang and Yin" : yang > yin ? `leaning Yang (${yang} to ${yin})` : `leaning Yin (${yin} to ${yang})`;
  out.push(`Taken together your chart is **${lean}**. ${yang === yin ? "You can switch between action and reflection more easily than most — use whichever the moment calls for." : yang > yin ? "Drive and initiative come easily; it is calm, patience and rest you have to plan for." : "Depth, patience and staying power come easily; it is speaking up, starting and moving you have to plan for."}`);
  if (moonPol && moonPol !== pol) out.push(`Your moon is ${moonPol} while your year is ${pol}, so ${pol === "Yang" ? "behind an outgoing manner sits a more private, reflective heart" : "behind a quiet manner sits a heart that wants action and adventure"}.`);
  out.push(`### In practice`);
  out.push(`To stay balanced, ${p.balance}.`);
  return { key: "yinyang", title: "Yang and Yin", badge: `You: ${pol}`, variant: `${pol} year${moonPol ? ` · ${moonPol} moon` : ""}`, text: out.join("\n\n") };
}

function elements(b: Birth, el: Element, pol: Polarity, now: Date): Reading {
  const zy = chineseZodiacYear(b.day, b.month, b.year);
  const first = pol === "Yang";
  const out: string[] = [];
  out.push(`The five elements — Wood, Fire, Earth, Metal and Water — are better thought of as five phases of change than five substances. Each element rules two years in a row, first in its Yang form and then in its Yin form, so the full round of twelve animals and five elements takes sixty years.`);
  out.push(`### Your element: ${pol} ${el}`);
  out.push(`You were born in ${first ? "the first (Yang) year" : "the second (Yin) year"} of ${el}: ${first ? `${zy} opened the ${el} pair and ${zy + 1} closed it` : `${zy - 1} opened the ${el} pair and ${zy} closed it`}. So whatever animal sits on top, underneath you are a **${el} person**.`);
  out.push(`Your exact combination, the ${pol} ${el} ${b.sign}, comes round once every sixty years: before you in ${zy - 60}, and next in ${zy + 60}.`);
  const sameAnimal = [-24, -12, 12, 24, 36].map((d) => zy + d).map((y) => ({ y, ...yearPillar(y) }));
  out.push(`Other ${b.sign} years carry other elements, which is why ${b.sign}s differ so much from one another: ${sameAnimal.map((x) => `${x.y} ${x.element}`).join(", ")}.`);
  out.push(`### Your element years ahead`);
  out.push(`Each year has its own element too, and how it meets yours sets the tone of the year. Traditionally your own element, the one that feeds you and the one you feed are the kind years; the element that overcomes you and the one you overcome are the testing ones.`);
  const cur = chineseZodiacYear(now.getDate(), now.getMonth() + 1, now.getFullYear());
  const rows: string[] = [];
  for (let y = cur; y < cur + 10; y++) {
    const yp = yearPillar(y);
    const r = relation(el, yp.element);
    rows.push(`• ${y} — ${yp.polarity} ${yp.element} ${yp.animal}: ${REL_LABEL[r]}${favourable(r) ? "" : " ⚠"}`);
  }
  out.push(rows.join("\n"));
  const good = ELEMENT_ORDER.filter((e) => favourable(relation(el, e)));
  const hard = ELEMENT_ORDER.filter((e) => !favourable(relation(el, e)));
  out.push(`In short: ${listAnd(good)} years favour you; ${listAnd(hard)} years ask more of you. A testing element can still bring a good year if the animal of the year is a friend of the ${b.sign}, and a kind element softens a difficult animal year.`);
  return { key: "elements", title: "The Elements", badge: `${pol} ${el}`, variant: `${pol} ${el}`, text: out.join("\n\n") };
}

function planets(b: Birth, el: Element): Reading {
  const info = ELEMENTS[el];
  const west = WESTERN[b.western];
  const out: string[] = [];
  out.push(`In China the five planets visible to the naked eye were named after the five elements: Jupiter is the Wood Star, Mars the Fire Star, Saturn the Earth Star, Venus the Metal Star and Mercury the Water Star. The Sun and the Moon stand apart as the Great Yang and the Great Yin.`);
  out.push(`### Your planet: ${info.planet}`);
  out.push(`As ${an(el)} person your planet is **${info.planet}** — in Chinese, ${info.planetChinese}.`);
  const planetNotes: Record<string, string> = {
    Jupiter: "Jupiter takes about twelve years to circle the sky, one year in each of twelve stations, and Chinese astronomers called it the Year Star (Suìxīng). Its twelve-year round is closely tied to the twelve-year cycle of the animals — one station of the sky, one animal, one year at a time. Its energy is growth, generosity and looking ahead.",
    Mars: "Mars moves erratically, sometimes seeming to stop and turn back, and Chinese astronomers watched it as a sign of upheaval and courage. Its energy is heat, drive and daring.",
    Saturn: "Saturn is the slowest of the five, taking about twenty-eight years to circle the sky, and was linked with the centre, the earth and the lasting order of things. Its energy is patience, structure and endurance.",
    Venus: "Venus, the brightest of the planets, shines at dawn and dusk and was linked with the west, autumn and the military — the gleam of metal. Its energy is clarity, refinement and resolve.",
    Mercury: "Mercury never strays far from the Sun and is glimpsed only briefly at twilight, which suited Water's quick, hidden nature. Its energy is communication, adaptability and thought.",
  };
  out.push(planetNotes[info.planet]);
  if (west) {
    const ruler = west.ruler;
    const rulerEl = PLANET_ELEMENT[ruler];
    out.push(`### Meeting your Western sign`);
    out.push(`In Western astrology your sun sign, ${b.western}, is ruled by **${ruler}**${west.modern ? ` (and, in modern astrology, ${west.modern})` : ""}.`);
    if (ruler === "the Sun" || ruler === "the Moon") {
      out.push(`${cap(ruler)} is the ${ruler === "the Sun" ? "Great Yang" : "Great Yin"} in Chinese thought — the source of all ${ruler === "the Sun" ? "Yang" : "Yin"} — so your Western sign adds a strong ${ruler === "the Sun" ? "Yang, radiant" : "Yin, reflective"} note to your ${el} nature.`);
    } else if (rulerEl === el) {
      out.push(`That is your Chinese planet as well — East and West point to the same star. ${info.planet}'s qualities are doubled in you.`);
    } else if (rulerEl) {
      const r = relation(el, rulerEl);
      const why: Record<Relation, string> = {
        same: "",
        "feeds-you": `${rulerEl} feeds ${el}, so your Western ruler quietly strengthens your Chinese element.`,
        "you-feed": `${el} feeds ${rulerEl}, so your Chinese nature pours itself into what your Western sign wants to do.`,
        "you-control": `${el} overcomes ${rulerEl}, so you tend to master and shape the ${ruler} side of you — at the cost of some effort.`,
        "controls-you": `${rulerEl} overcomes ${el}, so the ${ruler} side of you can press hard on your ${el} nature; the go-between element, ${mediator(rulerEl)}, helps the two work together.`,
      };
      out.push(`In Chinese terms ${ruler} is the ${rulerEl} Star. ${why[r]}`);
    }
  }
  out.push(`### In practice`);
  out.push(`Watch your planet: when ${info.planet} is bright in the night sky, ${el} people often feel more themselves. Your element's numbers are ${info.numbers}, its direction is the ${info.direction} and its time of day is ${info.time}.`);
  return { key: "planets", title: "Elements and the Planets", badge: `${info.planet}${west ? ` · ${b.western}: ${west.ruler}` : ""}`, variant: K_PLANET(el, west?.ruler), text: out.join("\n\n") };
}

function creation(b: Birth, el: Element): Reading {
  const mother = FED_BY[el], child = FEEDS[el];
  const out: string[] = [];
  out.push(`The Creation Cycle is the order in which the elements give birth to one another: ${FEED_IMAGE.Wood}; ${FEED_IMAGE.Fire}; ${FEED_IMAGE.Earth}; ${FEED_IMAGE.Metal}; ${FEED_IMAGE.Water}. Every element therefore has a "mother" that feeds it and a "child" that it feeds.`);
  out.push(`### Your place in the cycle`);
  out.push(`• Your element: **${el}**\n• Your mother element: **${mother}** — ${FEED_IMAGE[mother]}.\n• Your child element: **${child}** — ${FEED_IMAGE[el]}.`);
  out.push(`### Who feeds you`);
  out.push(`People born in ${mother} years, and the animals whose natural element is ${mother} (${listAnd(animalsWithFixed(mother))}), tend to support and encourage you. ${mother} years — and things of ${mother} around you (${ELEMENTS[mother].colors}; ${ELEMENTS[mother].shape.split(" — ")[0]} shapes) — recharge you when you feel depleted.`);
  out.push(`### Whom you feed`);
  out.push(`You naturally nourish ${child} people and the animals of ${child} (${listAnd(animalsWithFixed(child))}). These relationships bring out your generosity and can be very productive, but they draw on your energy — make sure someone is feeding you too.`);
  out.push(`### In a partnership`);
  out.push(`With another ${el} person you understand each other instantly. With ${an(mother)} partner you are looked after; with ${an(child)} partner you do the looking after. This works alongside the animal compatibilities: a good animal match is made better still when the elements run in the creation order.`);
  out.push(`### In practice`);
  out.push(`When you need strength, turn to ${mother}: ${ELEMENTS[mother].balance}. When you want to create and give, express yourself through ${child}: ${lc(ELEMENTS[child].gifts)}.`);
  return { key: "creation", title: "The Creation Cycle", badge: `${mother} → ${el} → ${child}`, variant: el, text: out.join("\n\n") };
}

function destruction(b: Birth, el: Element, now: Date): Reading {
  const over = CONTROLS[el], by = CONTROLLED_BY[el];
  const out: string[] = [];
  out.push(`The Destruction Cycle is the order in which the elements overcome one another: Wood drains Earth, Earth dams Water, Water puts out Fire, Fire melts Metal and Metal cuts Wood. It is not evil — it is the check that stops any one element from running riot — but it explains friction in people and in years.`);
  out.push(`### Your place in the cycle`);
  out.push(`• You overcome **${over}** — like ${CONTROL_IMAGE[el]}. You can master ${over} situations and people, but it takes effort, and you may wear them down without meaning to.\n• You are overcome by **${by}** — like ${CONTROL_IMAGE[by]}. ${by} people and ${by} years can press on you, dampen your style or set you hard tests.`);
  out.push(`### The go-between`);
  out.push(`Chinese tradition softens a destructive pair by adding the element that sits between them in the Creation Cycle. Between ${by} and you that is **${mediator(by)}** (${by} feeds ${mediator(by)}, which feeds ${el}). Between you and ${over} it is **${mediator(el)}**. Bringing that element in — a person, a colour, an activity — turns a clash into a flow.`);
  out.push(`### Years to handle with care`);
  const cur = chineseZodiacYear(now.getDate(), now.getMonth() + 1, now.getFullYear());
  const hard: string[] = [];
  for (let y = cur; y < cur + 12; y++) {
    const yp = yearPillar(y);
    if (yp.element === by) hard.push(`${y} (${yp.element} ${yp.animal}) — it overcomes you`);
    else if (yp.element === over) hard.push(`${y} (${yp.element} ${yp.animal}) — you overcome it: success, but hard-won`);
  }
  out.push(hard.map((h) => `• ${h}`).join("\n"));
  out.push(`In those years use the go-between: ${mediator(by)} for ${by} years (${ELEMENTS[mediator(by)].balance}).`);
  out.push(`### In relationships`);
  out.push(`With ${an(by)} partner you may feel controlled or held back; with ${an(over)} partner you may be the one who dominates. Neither has to fail — knowing the pattern, and inviting ${mediator(by)} or ${mediator(el)} into shared life, keeps the balance. As ${an(b.sign)}, weigh this together with your animal's friends and rivals.`);
  return { key: "destruction", title: "The Destruction Cycle", badge: `${by} ⟶ ${el} ⟶ ${over}`, variant: el, text: out.join("\n\n") };
}

function natural(b: Birth, el: Element, pol: Polarity): Reading {
  const a = ANIMAL_INFO[b.sign as Animal];
  const fixed = a.fixed;
  const r = relation(el, fixed);
  const out: string[] = [];
  out.push(`Besides the element of the year, every animal has a natural element of its own that never changes — tied to its month, its season and its compass point. The ${shown(b.sign)} (${a.branch}) belongs to ${a.season} and the ${a.direction}, and its natural element is **${fixed}**, with **${a.polarity}** polarity.`);
  out.push(`### Your two elements`);
  out.push(`You carry two elements at once: the ${b.sign}'s fixed **${fixed}**, which is the animal's character, and your year's **${el}**, which is the manner in which you live it out.`);
  const text: Record<Relation, string> = {
    same: `They are the same element. You are a "pure" ${el} ${b.sign} — the animal at its most typical and concentrated, with its strengths and its blind spots both turned up.`,
    "feeds-you": `${fixed} feeds ${el} (${FEED_IMAGE[fixed]}): the animal's nature pours energy into your year's element, so your ${b.sign} qualities come out easily and generously.`,
    "you-feed": `${el} feeds ${fixed} (${FEED_IMAGE[el]}): your year's element strengthens the animal inside you, making you an especially strong, well-supported ${b.sign}.`,
    "you-control": `${el} overcomes ${fixed} (${CONTROL_IMAGE[el]}): your year's element keeps the animal's nature in check. You are a more restrained, disciplined ${b.sign} than most — the typical ${b.sign} traits are there, but tempered.`,
    "controls-you": `${fixed} overcomes ${el} (${CONTROL_IMAGE[fixed]}): the animal's nature presses on your year's element. There can be an inner tug-of-war between what the ${b.sign} wants and how your ${el} wants to go about it; ${mediator(fixed)} is the element that reconciles the two.`,
  };
  out.push(text[r]);
  out.push(`Polarity always agrees: ${b.sign} years are always ${a.polarity} years, so your ${pol} year and your animal's ${a.polarity} nature point the same way.`);
  out.push(`### Kindred animals`);
  const kin = animalsWithFixed(fixed).filter((x) => x !== b.sign);
  out.push(`${kin.length ? `The ${listAnd(kin)} share${kin.length === 1 ? "s" : ""} your animal's ${fixed} nature and tend${kin.length === 1 ? "s" : ""} to understand your instincts. ` : ""}Animals whose natural element is ${FED_BY[fixed]} (${listAnd(animalsWithFixed(FED_BY[fixed]))}) feed your animal's ${fixed}; those of ${CONTROLLED_BY[fixed]} (${listAnd(animalsWithFixed(CONTROLLED_BY[fixed]))}) can challenge it.`);
  out.push(`### In practice`);
  out.push(`To feel most like yourself, honour both elements: the ${fixed} of your animal — ${ELEMENTS[fixed].home} — and the ${el} of your year.`);
  return { key: "natural", title: "The Natural Elements of the Animals", badge: `${b.sign}: ${a.polarity} · ${fixed}`, variant: `${el} ${b.sign}`, text: out.join("\n\n") };
}

function meanings(b: Birth, el: Element, pol: Polarity): Reading {
  const info = ELEMENTS[el];
  const stem = STEMS[`${pol} ${el}`];
  const out: string[] = [];
  out.push(`### You are ${pol} ${el}: ${stem.image}`);
  out.push(`In the ten Heavenly Stems your year is **${stem.pinyin} (${stem.chinese})**, ${pol} ${el} — ${stem.image}. You are ${stem.nature}. Watch for this: ${stem.watch}.`);
  out.push(`### What ${el} gives you`);
  out.push(`${cap(info.gifts)}. Its virtue is ${info.virtue}. Its shadow side is ${info.shadow}.`);
  out.push(`### Your correspondences`);
  out.push([
    `• Season: ${info.season}`,
    `• Direction: ${info.direction}`,
    `• Colours: ${info.colors}`,
    `• Shapes: ${info.shape}`,
    `• Climate: ${info.climate}`,
    `• Time of day: ${info.time}`,
    `• Numbers: ${info.numbers}`,
    `• Planet: ${info.planet}`,
    `• Guardian: ${info.guardian}`,
    `• Body: ${info.organs}; sense: ${info.sense}; taste: ${info.taste}`,
    `• Emotion: ${info.emotion}`,
  ].join("\n"));
  out.push(`### In practice`);
  out.push(`• At home and work: ${info.home}.\n• Careers that suit ${el}: ${info.careers}.\n• To stay balanced: ${info.balance}.\n• Lucky support: add a touch of ${FED_BY[el]} (${ELEMENTS[FED_BY[el]].colors}) when you need a lift; go easy on ${CONTROLLED_BY[el]} (${ELEMENTS[CONTROLLED_BY[el]].colors}) when you are under strain.`);
  out.push(`(Traditional correspondences are a guide to balance, not medical advice.)`);
  return { key: "meanings", title: "Meanings of the Elements", badge: `${pol} ${el} · ${stem.image}`, variant: `${pol} ${el}`, text: out.join("\n\n") };
}

/** Every Foundations reading for a birthday. */
export function foundationsFor(b: Birth, opts: { now?: Date } = {}): Record<SectionKey, Reading> {
  const now = opts.now ?? new Date();
  const el = (ELEMENT_ORDER.includes(b.element as Element) ? b.element : "Wood") as Element;
  const pol = polarityOf(b.sign);
  return {
    horoscope: horoscope(b, el, pol),
    yinyang: yinyang(b, pol),
    elements: elements(b, el, pol, now),
    planets: planets(b, el),
    creation: creation(b, el),
    destruction: destruction(b, el, now),
    natural: natural(b, el, pol),
    meanings: meanings(b, el, pol),
  };
}

/** Curriculum variants (no birth hour). */
export function foundationVariants(b: Birth, now = new Date()): Record<SectionKey, string> {
  const r = foundationsFor({ ...b, hour: null }, { now });
  return Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v.variant])) as Record<SectionKey, string>;
}

/** The book section each reading sits with (FOUNDATION_KEYS). */
export const SECTION_BOOK_KEY: Record<SectionKey, string> = {
  horoscope: "Your Chinese Horoscope",
  yinyang: "Yang and Yin",
  elements: "The Elements",
  planets: "Elements and the Planets",
  creation: "The Creation Cycle",
  destruction: "The Destruction Cycle",
  natural: "The Natural Elements of the Animals",
  meanings: "Meanings of the Elements",
};
export const SECTION_ORDER: SectionKey[] = ["horoscope", "yinyang", "elements", "planets", "creation", "destruction", "natural", "meanings"];
