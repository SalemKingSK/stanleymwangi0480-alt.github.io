/**
 * MYSTIQUE COMPASS — Karmic Debt Numbers & Life Path Analysis
 *
 * Detects Karmic Debt Numbers (13, 14, 16, 19) anywhere in the chart
 * and provides dedicated Life Path Number analysis.
 *
 * ALL TEXT IS VERBATIM.
 */
export interface KarmicDebtResult {
  number: 13 | 14 | 16 | 19;
  foundIn: string;
  title: string;
  interpretation: string;
  /** Optional source labels used by export templates when available. */
  sources?: string[];
}
export interface LifePathResult {
  number: number;
  title: string;
  interpretation: string;
}
export interface LifePathPeriod {
  period: string;
  ages: string;
  number: number;
  title: string;
  interpretation: string;
}
export interface LifePathPeriodResult {
  lifePath: number;
  periods: LifePathPeriod[];
}
const KARMIC_DEBT_MEANINGS: Record<
  number,
  { title: string; interpretation: string }
> = {
  13: {
    title: "Karmic Debt 13 — The Debt of Laziness",
    interpretation: `KARMIC DEBT NUMBER 13 — The Debt of Laziness
The Karmic Debt Number 13 indicates that in a past incarnation, the soul avoided hard work, took shortcuts, exploited the labour of others, or otherwise failed to carry its fair share of the collective burden. The number 13 reduces to 4 (1+3=4), and the 4 vibration — discipline, structure, sustained effort — is precisely what the 13 debtor must now master.
THE KARMIC CURRICULUM: This lifetime demands the development of genuine work ethic. The individual with Karmic Debt 13 will find that shortcuts consistently backfire, that easy paths lead to dead ends, and that anything worth having requires sustained, disciplined effort. This is not punishment; it is remedial education. The soul that avoided work must now learn to EMBRACE it — not as drudgery but as the primary vehicle of spiritual growth.
THE MANIFESTATION: The 13 debtor often experiences early-life frustration — a sense of being blocked, of efforts not yielding proportional results. This is the karmic friction: the old pattern of avoidance is being systematically dismantled by circumstances that make avoidance impossible. The 13 debtor may try many paths before committing to one, experiencing each abandoned attempt as "bad luck" when it is actually the karmic mechanism ensuring that only sustained, committed effort will succeed.
THE RESOLUTION: The 13 debt is paid through CONSISTENCY. Not through heroic bursts of effort followed by collapse, but through the steady, daily application of disciplined work toward a clearly defined goal. The 13 debtor who maintains a practice — any practice — for years rather than months will find that the karmic friction gradually diminishes, replaced by the genuine satisfaction of earned achievement. The debt is considered paid when the individual can work steadily without resentment, finding meaning in the work itself rather than only in its rewards.`,
  },
  14: {
    title: "Karmic Debt 14 — The Debt of Misused Freedom",
    interpretation: `KARMIC DEBT NUMBER 14 — The Debt of Misused Freedom
The Karmic Debt Number 14 indicates that in a past incarnation, the soul abused freedom — using personal liberty to exploit others, abandoning responsibilities in pursuit of pleasure, or otherwise exercising freedom without the corresponding discipline that genuine freedom requires. The number 14 reduces to 5 (1+4=5), and the 5 vibration — freedom, change, adaptability — is precisely the arena in which the 14 debtor must now demonstrate mastery.
THE KARMIC CURRICULUM: This lifetime demands the development of DISCIPLINED FREEDOM. The individual with Karmic Debt 14 will find that their natural desire for freedom, variety, and new experiences is constantly being tested by circumstances that demand commitment, stability, and follow-through. The universe is not denying them freedom; it is teaching them that genuine freedom is not the absence of commitment but the capacity to CHOOSE commitment consciously.
THE MANIFESTATION: The 14 debtor often experiences a pattern of exciting beginnings followed by chaotic endings — relationships that start passionately and dissolve acrimoniously, careers that launch with promise and crash unpredictably, projects that generate enormous initial enthusiasm and are abandoned before completion. The karmic mechanism creates instability not to punish but to FORCE the development of internal stability — when external circumstances refuse to provide consistency, the individual must develop it within themselves.
THE RESOLUTION: The 14 debt is paid through MODERATION. Not through the suppression of the desire for freedom and variety, but through the channeling of that desire into sustainable forms. The 14 debtor who learns to experience novelty WITHIN commitment — who finds that a long-term relationship contains infinite variety, that a sustained career offers endless opportunities for growth — has paid the debt. The key is to stop fleeing when things become predictable and to discover that predictability, properly understood, is the foundation upon which genuine adventure is built.`,
  },
  16: {
    title: "Karmic Debt 16 — The Debt of Misused Love",
    interpretation: `KARMIC DEBT NUMBER 16 — The Debt of Misused Love
The Karmic Debt Number 16 is considered the most difficult of the four karmic debts. It indicates that in a past incarnation, the soul misused love — betrayed those who trusted them, used intimacy as a weapon, abandoned dependents, or otherwise corrupted the sacred bond of love into an instrument of ego. The number 16 reduces to 7 (1+6=7), and the 7 vibration — spiritual wisdom, introspection, the pursuit of truth — is the arena in which the 16 debtor must now seek redemption.
THE KARMIC CURRICULUM: This lifetime demands the purification of the ego through repeated experiences of loss, disillusionment, and the collapse of structures built on false foundations. The 16 debtor will experience their external life being systematically dismantled — not once but repeatedly — until they learn to build on a foundation of genuine spiritual truth rather than ego, appearances, or manipulation. This is the "Tower" card in the Tarot: the lightning strike that reveals what was hidden.
THE MANIFESTATION: The 16 debtor often experiences dramatic reversals — sudden falls from positions of security, relationships that collapse when hidden truths emerge, careers that implode when the gap between image and reality becomes unsustainable. These are not random misfortunes; they are the karmic mechanism systematically exposing and destroying the false structures the ego has built. The process is painful, sometimes devastating, but it is also PURIFYING — each collapse removes another layer of inauthenticity.
THE RESOLUTION: The 16 debt is paid through HUMILITY and the genuine pursuit of spiritual truth. The 16 debtor must stop trying to maintain appearances and instead commit to radical honesty — with themselves first, and then with others. The ego that needed to be special, to be admired, to be above others, must be surrendered. In its place, a quieter but infinitely more stable self can emerge — one that does not need to build towers because it has learned to dwell on solid ground. The debt is paid when the individual can experience loss without devastation, knowing that what is truly real cannot be taken.`,
  },
  19: {
    title: "Karmic Debt 19 — The Debt of Misused Power",
    interpretation: `KARMIC DEBT NUMBER 19 — The Debt of Misused Power
The Karmic Debt Number 19 indicates that in a past incarnation, the soul abused power — dominated others, used authority for selfish ends, or otherwise exercised power without the corresponding wisdom and compassion that legitimate authority requires. The number 19 reduces to 1 (1+9=10→1), and the 1 vibration — leadership, independence, selfhood — is precisely the arena in which the 19 debtor must now demonstrate correct use.
THE KARMIC CURRICULUM: This lifetime demands the development of HUMBLE LEADERSHIP. The individual with Karmic Debt 19 will find themselves placed in positions of authority — often despite their resistance — and tested on how they wield that authority. The karmic mechanism is elegant: the soul that abused power in the past must now learn to use it in service of others, and will be given power specifically to test whether the lesson has been learned.
THE MANIFESTATION: The 19 debtor often experiences a paradoxical relationship with leadership — they may resist taking authority while simultaneously being thrust into positions that demand it. Their early attempts at leadership may backfire, as the old karmic pattern of domination attempts to reassert itself. They may swing between aggressive assertion (the old pattern) and complete abdication (overcorrection), neither of which resolves the debt. The karmic mechanism ensures that they cannot avoid leadership and cannot dominate through it — they must find the middle path of service-oriented authority.
THE RESOLUTION: The 19 debt is paid through SERVICE-ORIENTED LEADERSHIP. The 19 debtor must learn to lead not for personal glory but for collective benefit — to use authority as a tool for empowering others rather than controlling them. When power is offered, they must accept it (refusing is another form of avoidance) but wield it with conscious attention to its effects on those subject to it. The debt is paid when the individual can hold authority without being corrupted by it, and when those they lead report feeling empowered rather than dominated.`,
  },
};
function reduceNum(n: number): number {
  let val = Math.abs(n);
  while (val > 9 && val !== 11 && val !== 22 && val !== 33)
    val = String(val)
      .split("")
      .reduce((a: number, d: string) => a + +d, 0);
  return val;
}
function reduceStrict(n: number): number {
  let val = Math.abs(n);
  while (val > 9)
    val = String(val)
      .split("")
      .reduce((a: number, d: string) => a + +d, 0);
  return val;
}
export function detectKarmicDebts(
  psycheNum: number,
  destinyNum: number,
  lifePath: number,
  compoundNum: number | null,
  reducedCompoundNum: number | null,
  pinnacleNumbers: number[],
  challengeNumbers: number[],
): KarmicDebtResult[] {
  const results: KarmicDebtResult[] = [];
  const debts = [13, 14, 16, 19];
  const check = (value: number | null, label: string) => {
    if (value === null) return;
    if (debts.includes(value)) {
      results.push({
        number: value as 13 | 14 | 16 | 19,
        foundIn: label,
        ...KARMIC_DEBT_MEANINGS[value],
      });
    }
  };
  check(psycheNum, "Psychic Number");
  check(destinyNum, "Destiny Number");
  check(lifePath, "Life Path Number");
  check(compoundNum, "Compound Number");
  check(reducedCompoundNum, "Reduced Compound Number");
  for (let i = 0; i < pinnacleNumbers.length; i++) {
    const label =
      [
        "First Pinnacle",
        "Second Pinnacle",
        "Third Pinnacle",
        "Fourth Pinnacle",
      ][i] || `Pinnacle ${i + 1}`;
    check(pinnacleNumbers[i], label);
  }
  for (let i = 0; i < challengeNumbers.length; i++) {
    const label =
      [
        "First Challenge",
        "Second Challenge",
        "Third Challenge",
        "Fourth Challenge",
      ][i] || `Challenge ${i + 1}`;
    check(challengeNumbers[i], label);
  }
  return results;
}
const LIFE_PATH_MEANINGS: Record<
  number,
  { title: string; interpretation: string }
> = {
  1: {
    title: "The Pioneer",
    interpretation: `LIFE PATH 1 — The Pioneer\n\nThe Life Path 1 individual is here to develop independence, originality, and the courage to stand alone. This path demands that the individual learn to lead — not through domination but through the authentic expression of their unique vision. The curriculum includes: learning to trust one's own judgment, developing the capacity to initiate without external validation, and discovering that true leadership serves others rather than the ego. The shadow: isolation through excessive self-reliance, arrogance through unexamined confidence. The gift: the capacity to originate what has never existed before.`,
  },
  2: {
    title: "The Diplomat",
    interpretation: `LIFE PATH 2 — The Diplomat\n\nThe Life Path 2 individual is here to develop partnership, patience, and the capacity for genuine emotional connection. This path demands that the individual learn to collaborate without losing themselves, to feel deeply without being overwhelmed, and to mediate conflicts that others cannot resolve. The curriculum includes: developing emotional intelligence, learning the art of timing and patience, and discovering that strength and sensitivity are not opposites but complements. The shadow: self-erasure through over-accommodation, resentment through unexpressed needs. The gift: the capacity to create harmony where there was discord.`,
  },
  3: {
    title: "The Communicator",
    interpretation: `LIFE PATH 3 — The Communicator\n\nThe Life Path 3 individual is here to develop creative self-expression and the capacity to communicate in ways that uplift and transform. This path demands that the individual learn to express authentically — not for approval but because expression is the fundamental nature of their soul. The curriculum includes: developing creative discipline, learning to channel joy without escaping depth, and discovering that genuine communication heals both speaker and listener. The shadow: dispersion through scattered focus, superficiality through avoidance of depth. The gift: the capacity to bring beauty and meaning into form.`,
  },
  4: {
    title: "The Builder",
    interpretation: `LIFE PATH 4 — The Builder\n\nThe Life Path 4 individual is here to develop discipline, structure, and the capacity for sustained, methodical effort. This path demands that the individual learn to build — systems, institutions, foundations — that endure beyond their own lifetime. The curriculum includes: developing patience, learning to value process over outcome, and discovering that freedom and structure are not enemies but necessary partners. The shadow: rigidity through excessive control, joylessness through neglect of spontaneity. The gift: the capacity to create structures that serve humanity for generations.`,
  },
  5: {
    title: "The Liberator",
    interpretation: `LIFE PATH 5 — The Liberator\n\nThe Life Path 5 individual is here to develop freedom, adaptability, and the courage to embrace change as the fundamental nature of existence. This path demands that the individual learn to be free — not by avoiding commitment but by choosing it consciously, not by fleeing stability but by discovering that genuine freedom is internal. The curriculum includes: developing flexibility without losing center, learning to embrace uncertainty as opportunity, and discovering that the greatest adventure is the authentic life. The shadow: chaos through excessive change, rootlessness through fear of commitment. The gift: the capacity to adapt and thrive in any circumstance.`,
  },
  6: {
    title: "The Nurturer",
    interpretation: `LIFE PATH 6 — The Nurturer\n\nThe Life Path 6 individual is here to develop love, responsibility, and the capacity for genuine service. This path demands that the individual learn to care — not as martyrdom but as the natural expression of a loving heart, not as obligation but as the overflow of genuine abundance. The curriculum includes: developing the capacity to receive as well as give, learning to distinguish between sacred service and self-erasure, and discovering that the deepest service is presence. The shadow: martyrdom through excessive giving, control through disguised care. The gift: the capacity to create environments where others flourish.`,
  },
  7: {
    title: "The Seeker",
    interpretation: `LIFE PATH 7 — The Seeker\n\nThe Life Path 7 individual is here to develop wisdom, spiritual depth, and the capacity for genuine understanding. This path demands that the individual learn to seek — not for answers that close questions but for questions that open understanding, not for certainty that eliminates doubt but for faith that encompasses doubt. The curriculum includes: developing the capacity for solitude without isolation, learning to trust inner guidance over external authority, and discovering that the deepest wisdom is lived, not merely known. The shadow: isolation through superiority, paralysis through perfectionism. The gift: the capacity to perceive truth that others overlook.`,
  },
  8: {
    title: "The Executive",
    interpretation: `LIFE PATH 8 — The Executive\n\nThe Life Path 8 individual is here to develop power, material mastery, and the capacity to direct resources toward meaningful ends. This path demands that the individual learn to wield authority — not for personal aggrandizement but for collective benefit, not through domination but through empowered delegation. The curriculum includes: developing ethical relationship with money and power, learning to balance material and spiritual values, and discovering that the truest wealth is what you enable others to create. The shadow: corruption through unchecked power, emptiness through material obsession. The gift: the capacity to manifest abundance and direct it toward worthy purposes.`,
  },
  9: {
    title: "The Humanitarian",
    interpretation: `LIFE PATH 9 — The Humanitarian\n\nThe Life Path 9 individual is here to develop universal compassion, completion, and the capacity to release what has finished its cycle. This path demands that the individual learn to let go — of attachments, identities, and possessions that no longer serve, not from indifference but from understanding that clinging prevents new growth. The curriculum includes: developing impersonal love that extends to all beings, learning to complete cycles gracefully, and discovering that the end of one chapter is the beginning of another. The shadow: loss through premature release, grief through unprocessed endings. The gift: the capacity to love without possession and to complete without regret.`,
  },
};
export function getLifePathNumber(
  day: number,
  month: number,
  year: number,
): LifePathResult {
  const raw =
    reduceNum(day) +
    reduceNum(month) +
    String(year)
      .split("")
      .reduce((a: number, d: string) => a + +d, 0);
  const num = reduceStrict(raw);
  return {
    number: num,
    ...(LIFE_PATH_MEANINGS[num] || {
      title: `Life Path ${num}`,
      interpretation: `Life Path ${num} carries its own unique vibration and curriculum, combining elements of its component digits.`,
    }),
  };
}
export function calculateLifePathPeriods(
  day: number,
  month: number,
  year: number,
): LifePathPeriodResult {
  const lp = reduceStrict(
    reduceNum(day) +
      reduceNum(month) +
      String(year)
        .split("")
        .reduce((a: number, d: string) => a + +d, 0),
  );
  const firstEnd = 36 - lp;
  const p1 = reduceNum(month);
  const p2 = reduceNum(day);
  const p3 = reduceStrict(
    String(year)
      .split("")
      .reduce((a: number, d: string) => a + +d, 0),
  );
  const PERIOD_MEANINGS: Record<number, string> = {
    1: "A period of independence, initiative, and self-discovery. The individual learns to stand alone, to originate, to lead. The shadow is isolation; the gift is authentic selfhood.",
    2: "A period of partnership, patience, and emotional development. The individual learns to collaborate, to feel deeply, to mediate. The shadow is self-erasure; the gift is genuine connection.",
    3: "A period of creative expression, joy, and communication. The individual learns to express authentically, to find and share their voice. The shadow is dispersion; the gift is inspired creation.",
    4: "A period of discipline, structure, and foundation-building. The individual learns to work steadily, to build enduring structures. The shadow is rigidity; the gift is reliable achievement.",
    5: "A period of freedom, change, and expansion. The individual learns to adapt, to embrace uncertainty, to explore. The shadow is chaos; the gift is liberated growth.",
    6: "A period of responsibility, love, and service. The individual learns to care for others, to create harmony. The shadow is martyrdom; the gift is nurturing love.",
    7: "A period of introspection, study, and spiritual seeking. The individual learns to trust inner guidance, to seek truth. The shadow is isolation; the gift is profound wisdom.",
    8: "A period of power, material mastery, and authority. The individual learns to direct resources, to lead with integrity. The shadow is corruption; the gift is empowered service.",
    9: "A period of completion, release, and universal love. The individual learns to let go, to serve humanity. The shadow is loss; the gift is transcendent compassion.",
  };
  const periods: LifePathPeriod[] = [
    {
      period: "Formative",
      ages: `0 – ${firstEnd}`,
      number: p1,
      title: `Formative Period — Number ${p1}`,
      interpretation: `FORMATIVE PERIOD (Ages 0-${firstEnd}) — Number ${p1}\n\n${PERIOD_MEANINGS[p1] || ""}\n\nThis is the period of foundation — when the core patterns of the life are established. The Number ${p1} vibration colors childhood, education, and early adulthood. During this period, the individual is primarily RECEIVING — absorbing the influences that will shape their later development.`,
    },
    {
      period: "Productive",
      ages: `${firstEnd} – ${firstEnd + 27}`,
      number: p2,
      title: `Productive Period — Number ${p2}`,
      interpretation: `PRODUCTIVE PERIOD (Ages ${firstEnd}-${firstEnd + 27}) — Number ${p2}\n\n${PERIOD_MEANINGS[p2] || ""}\n\nThis is the period of maximum output — when the foundation laid in the Formative years bears fruit. The Number ${p2} vibration colors career, relationships, and the primary contributions of the life. During this period, the individual is primarily GIVING — expressing their developed capacities in the world.`,
    },
    {
      period: "Harvest",
      ages: `${firstEnd + 27}+`,
      number: p3,
      title: `Harvest Period — Number ${p3}`,
      interpretation: `HARVEST PERIOD (Ages ${firstEnd + 27}+) — Number ${p3}\n\n${PERIOD_MEANINGS[p3] || ""}\n\nThis is the period of integration — when the experiences of the first two periods are synthesized into wisdom. The Number ${p3} vibration colors the later years, retirement, and the transmission of accumulated insight to younger generations. During this period, the individual is primarily TRANSMITTING — sharing what has been learned.`,
    },
  ];
  return { lifePath: lp, periods };
}