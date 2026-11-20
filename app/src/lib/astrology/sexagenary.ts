/**
 * MYSTIQUE COMPASS — Chinese Zodiac Element System (Sexagenary Cycle)
 *
 * Heavenly Stems (10) + Earthly Branches (12) = 60-year Sexagenary cycle.
 * For a birth year: computes Stem, Branch, compound Stem-Branch meaning,
 * and verbatim interpretations for each possible combination.
 *
 * ALL TEXT IS VERBATIM.
 */

import { chineseZodiacYear, stemBranchIndex } from './chinese-calendar-math';

export interface HeavenlyStemResult {
  stem: number;
  element: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
  polarity: 'Yang' | 'Yin';
  title: string;
  interpretation: string;
}

export interface EarthlyBranchResult {
  branch: number;
  animal: string;
  animalChinese: string;
  element: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
  hour: string;
  direction: string;
  season: string;
  interpretation: string;
}

export interface StemBranchResult {
  name: string;
  stem: HeavenlyStemResult;
  branch: EarthlyBranchResult;
  interpretation: string;
}

const HEAVENLY_STEMS = [
  { element: 'Wood' as const, polarity: 'Yang' as const, title: 'Yang Wood — Giant Tree' },
  { element: 'Wood' as const, polarity: 'Yin' as const, title: 'Yin Wood — Flowering Grass' },
  { element: 'Fire' as const, polarity: 'Yang' as const, title: 'Yang Fire — Blazing Sun' },
  { element: 'Fire' as const, polarity: 'Yin' as const, title: 'Yin Fire — Candle Flame' },
  { element: 'Earth' as const, polarity: 'Yang' as const, title: 'Yang Earth — Great Mountain' },
  { element: 'Earth' as const, polarity: 'Yin' as const, title: 'Yin Earth — Fertile Soil' },
  { element: 'Metal' as const, polarity: 'Yang' as const, title: 'Yang Metal — Forged Steel' },
  { element: 'Metal' as const, polarity: 'Yin' as const, title: 'Yin Metal — Jewelry Gold' },
  { element: 'Water' as const, polarity: 'Yang' as const, title: 'Yang Water — Ocean Wave' },
  { element: 'Water' as const, polarity: 'Yin' as const, title: 'Yin Water — Morning Dew' },
];

const EARTHLY_BRANCHES = [
  { animal: 'Rat', animalChinese: '子', element: 'Water' as const, hour: '23:00-01:00', direction: 'North', season: 'Deep Winter' },
  { animal: 'Ox', animalChinese: '丑', element: 'Earth' as const, hour: '01:00-03:00', direction: 'North-Northeast', season: 'Late Winter' },
  { animal: 'Tiger', animalChinese: '寅', element: 'Wood' as const, hour: '03:00-05:00', direction: 'East-Northeast', season: 'Early Spring' },
  { animal: 'Rabbit', animalChinese: '卯', element: 'Wood' as const, hour: '05:00-07:00', direction: 'East', season: 'Spring' },
  { animal: 'Dragon', animalChinese: '辰', element: 'Earth' as const, hour: '07:00-09:00', direction: 'East-Southeast', season: 'Late Spring' },
  { animal: 'Snake', animalChinese: '巳', element: 'Fire' as const, hour: '09:00-11:00', direction: 'South-Southeast', season: 'Early Summer' },
  { animal: 'Horse', animalChinese: '午', element: 'Fire' as const, hour: '11:00-13:00', direction: 'South', season: 'Summer' },
  { animal: 'Goat', animalChinese: '未', element: 'Earth' as const, hour: '13:00-15:00', direction: 'South-Southwest', season: 'Late Summer' },
  { animal: 'Monkey', animalChinese: '申', element: 'Metal' as const, hour: '15:00-17:00', direction: 'West-Southwest', season: 'Early Autumn' },
  { animal: 'Rooster', animalChinese: '酉', element: 'Metal' as const, hour: '17:00-19:00', direction: 'West', season: 'Autumn' },
  { animal: 'Dog', animalChinese: '戌', element: 'Earth' as const, hour: '19:00-21:00', direction: 'West-Northwest', season: 'Late Autumn' },
  { animal: 'Pig', animalChinese: '亥', element: 'Water' as const, hour: '21:00-23:00', direction: 'North-Northwest', season: 'Early Winter' },
];

const BRANCH_INTERPRETATIONS: Record<number, string> = {
  0: `EARTHLY BRANCH 子 (Zǐ) — THE RAT

The Rat is the first branch of the Chinese zodiac — the seed, the beginning, the spark of life that emerges from the darkness of winter. The Rat's element is Water, and its nature is YANG — active, penetrating, and endlessly resourceful. Rats are driven by survival intelligence and social instinct, possessing an almost preternatural ability to sense opportunity and danger before others perceive them.

The Rat individual is a strategist whose mind never stops calculating. They are charming, witty, and genuinely sociable, but beneath the charm operates a survival engine that has been millennia in the making. The Rat's gift is the ability to thrive in conditions that would defeat more noble but less adaptable creatures. The Rat's challenge is to use their considerable intelligence for purposes beyond mere survival — to transform the hoarding instinct into genuine generosity, the strategic mind into actual wisdom.

In the Chinese cosmic order, the Rat governs the hour of the Rat (23:00-01:00), the direction North, and the season of deep winter. These associations point to the Rat's role as the initiator of cycles — the darkness that precedes the dawn, the stillness that precedes the movement. The Rat is not merely cunning; the Rat is the PRIMAL INTELLIGENCE that ensures the continuation of life.`,

  1: `EARTHLY BRANCH 丑 (Chǒu) — THE OX

The Ox is the second branch — the steady worker who transforms the Rat's inspirations into enduring realities. The Ox's element is Earth, and its nature is YIN — receptive, enduring, drawing power from stillness rather than motion. Oxen are driven by duty, loyalty, and a commitment to completion that other signs find almost incomprehensible.

The Ox individual is a builder whose power lies not in speed but in that quality the Chinese most revere: persistence. The Ox does not dazzle; the Ox endures. They work steadily toward goals that others abandon when the initial excitement fades. Their word is their bond; their commitments are absolute. The Ox's gift is the capacity to create stability in a chaotic world. The Ox's challenge is rigidity — the same quality that enables them to persist through difficulty can harden into stubbornness that resists necessary change.

In the Chinese cosmic order, the Ox governs the hours 01:00-03:00, the direction North-Northeast, and the season of late winter. These associations point to the Ox's role as the EARTH that receives and transforms — the dark soil in which seeds germinate unseen, preparing for their eventual emergence.`,

  2: `EARTHLY BRANCH 寅 (Yín) — THE TIGER

The Tiger is the third branch — the warrior, the rebel, the fierce protector whose courage terrifies evil and inspires the timid. The Tiger's element is Wood, and its nature is YANG — expansive, bold, and driven by a life force that cannot be contained. Tigers are driven by passion, principle, and an innate nobility that manifests as both authority and generosity.

The Tiger individual is a force of nature whose presence changes any room they enter. They lead through charisma and courage, not through careful planning. Their decisions are instinctive, and their instincts — when trusted — are remarkably accurate. The Tiger's gift is the capacity to inspire action in others through the sheer power of example. The Tiger's challenge is impulsiveness — the courage that charges into battle can become recklessness that charges off cliffs.

In the Chinese cosmic order, the Tiger governs the hours 03:00-05:00, the direction East-Northeast, and the season of early spring. These associations point to the Tiger's role as the AWAKENER — the first stirring of spring, the first light before dawn, the courage that births new cycles.`,

  3: `EARTHLY BRANCH 卯 (Mǎo) — THE RABBIT

The Rabbit is the fourth branch — the diplomat, the aesthete, the gentle presence whose sensitivity is not weakness but a refined form of strength. The Rabbit's element is Wood, and its nature is YIN — receptive, graceful, drawing power from harmony rather than conflict. Rabbits are driven by beauty, peace, and the cultivation of environments where life can flourish gently.

The Rabbit individual possesses a refined sensitivity that borders on the psychic. They sense the emotional atmosphere of any situation with an accuracy that more aggressive types cannot achieve. Their diplomacy is not cowardice but a genuine preference for solutions that preserve relationship. The Rabbit's gift is the capacity to create conditions in which others can thrive — not through command but through cultivation. The Rabbit's challenge is avoidance — the same sensitivity that enables harmony can become a retreat from necessary confrontation.

In the Chinese cosmic order, the Rabbit governs the hours 05:00-07:00, the direction East, and the season of spring. These associations point to the Rabbit's role as the GENTLE FORCE — the spring breeze that awakens flowers, the soft influence that achieves what force cannot.`,

  4: `EARTHLY BRANCH 辰 (Chén) — THE DRAGON

The Dragon is the fifth branch — the only mythical creature in the zodiac, the embodiment of power, majesty, and the divine right to lead. The Dragon's element is Earth, and its nature is YANG — commanding, magnetic, and driven by a destiny that transcends personal ambition. Dragons are driven by greatness itself — not for ego but because they genuinely cannot be small.

The Dragon individual is a natural leader whose authority others recognize instinctively. There is something larger-than-life about Dragons — not because they perform it but because they ARE it. Their energy is expansive, their generosity legendary, and their capacity to inspire devotion from others is unmatched. The Dragon's gift is the capacity to envision and achieve what others consider impossible. The Dragon's challenge is arrogance — the same confidence that enables great achievement can blind them to their own limitations.

In the Chinese cosmic order, the Dragon governs the hours 07:00-09:00, the direction East-Southeast, and the season of late spring. These associations point to the Dragon's role as the THRESHOLD GUARDIAN — positioned between spring's ascent and summer's fullness, between earth and heaven, between what is and what could be.`,

  5: `EARTHLY BRANCH 巳 (Sì) — THE SNAKE

The Snake is the sixth branch — the mystic, the philosopher, the keeper of secrets whose wisdom runs deeper than words can express. The Snake's element is Fire, and its nature is YIN — the fire that burns within rather than flames that consume without. Snakes are driven by understanding — not knowledge for its own sake but the kind of knowing that transforms the knower.

The Snake individual possesses an inner depth that others sense but cannot fully access. There is a quality of mystery about Snakes — not because they cultivate it but because their inner life is genuinely profound and not all of it can be shared. Their intuition is extraordinarily accurate; their judgments, once formed, are rarely wrong. The Snake's gift is the capacity to perceive patterns that others miss, to see the structures beneath the surface. The Snake's challenge is suspicion — the same perceptiveness that enables deep understanding can curdle into distrust.

In the Chinese cosmic order, the Snake governs the hours 09:00-11:00, the direction South-Southeast, and the season of early summer. These associations point to the Snake's role as the INNER FIRE — the heat that transforms from within, the wisdom that ripens in silence.`,

  6: `EARTHLY BRANCH 午 (Wǔ) — THE HORSE

The Horse is the seventh branch — the adventurer, the free spirit, the passionate heart whose love of motion and freedom defines their existence. The Horse's element is Fire, and its nature is YANG — the fire that blazes openly, warming all who approach. Horses are driven by freedom, passion, and an instinctive rejection of anything that restrains their natural movement.

The Horse individual is an energetic presence whose enthusiasm is genuinely contagious. They move through life at speed — making decisions quickly, forming connections rapidly, and needing constant forward motion. Their passion is not drama but genuine investment in whatever captures their attention. The Horse's gift is the capacity to energize others, to bring life and movement to stagnant situations. The Horse's challenge is inconsistency — the same love of freedom that enables adventure can become an inability to commit, to stay, to finish.

In the Chinese cosmic order, the Horse governs the hours 11:00-13:00, the direction South, and the season of summer. These associations point to the Horse's role as the MIDDAY BLAZE — the light at its fullest, the heat at its peak, the passion that defines life at its most intense.`,

  7: `EARTHLY BRANCH 未 (Wèi) — THE GOAT

The Goat is the eighth branch — the artist, the nurturer, the gentle soul whose creativity flourishes in environments of peace and beauty. The Goat's element is Earth, and its nature is YIN — the earth that nurtures rather than the earth that commands. Goats are driven by beauty, harmony, and the creation of things that make life more gentle.

The Goat individual possesses a creative sensitivity that requires the right conditions to flourish. In harsh environments, Goats may appear fragile; in supportive ones, they produce work of extraordinary beauty and emotional depth. Their gentleness is not weakness but the expression of a nature attuned to dimensions of experience that more aggressive types cannot access. The Goat's gift is the capacity to create beauty that genuinely nourishes others. The Goat's challenge is dependency — the same sensitivity that enables creation can become a reliance on others for emotional stability.

In the Chinese cosmic order, the Goat governs the hours 13:00-15:00, the direction South-Southwest, and the season of late summer. These associations point to the Goat's role as the RIPENING EARTH — the moment when summer's heat mellows toward autumn, when creation reaches completion, when what has been nurtured begins to bear fruit.`,

  8: `EARTHLY BRANCH 申 (Shēn) — THE MONKEY

The Monkey is the ninth branch — the trickster, the genius, the improviser whose mental agility and social intelligence make them the zodiac's most adaptable problem-solver. The Monkey's element is Metal, and its nature is YANG — the metal that is shaped by intelligence into tools of extraordinary precision. Monkeys are driven by curiosity, competence, and the sheer pleasure of figuring things out.

The Monkey individual possesses a mind that never stops — combining, recombining, finding patterns, inventing solutions. They are the person you want in a crisis because they will find a way out that no one else saw. Their social intelligence is equally formidable; they navigate human relationships with the same improvisational genius they bring to practical problems. The Monkey's gift is the capacity to solve unsolvable problems through lateral thinking and sheer mental agility. The Monkey's challenge is depth — the same versatility that enables brilliance can become a resistance to the sustained focus that certain problems demand.

In the Chinese cosmic order, the Monkey governs the hours 15:00-17:00, the direction West-Southwest, and the season of early autumn. These associations point to the Monkey's role as the HARVEST MIND — the intelligence that knows when fruit is ripe for picking, the cunning that turns nature's bounty into human sustenance, the wit that transforms raw experience into useful wisdom.`,

  9: `EARTHLY BRANCH 酉 (Yǒu) — THE ROOSTER

The Rooster is the tenth branch — the organizer, the precisionist, the proud soul whose standards and discipline make them the zodiac's most reliable executor. The Rooster's element is Metal, and its nature is YIN — the metal that has been refined, polished, and shaped into something precise and beautiful. Roosters are driven by excellence, integrity, and the conviction that things should be done properly.

The Rooster individual possesses a quality control instinct that borders on the compulsive. They notice what others overlook, remember what others forget, and insist on standards that others find exhausting but secretly admire. Their pride is not vanity but a genuine investment in doing things well. The Rooster's gift is the capacity to bring order to chaos, precision to the imprecise, and completion to the unfinished. The Rooster's challenge is rigidity — the same commitment to standards can become an intolerance of the imperfect, including the imperfections in themselves and others.

In the Chinese cosmic order, the Rooster governs the hours 17:00-19:00, the direction West, and the season of autumn. These associations point to the Rooster's role as the HARVEST IMPLEMENT — the tool that separates wheat from chaff, the discerning eye that evaluates, the voice that announces the dawn of understanding.`,

  10: `EARTHLY BRANCH 戌 (Xū) — THE DOG

The Dog is the eleventh branch — the guardian, the loyal heart, the steadfast protector whose devotion and sense of justice make them the zodiac's moral compass. The Dog's element is Earth, and its nature is YANG — the earth that guards, the mountain that shelters. Dogs are driven by loyalty, justice, and an instinctive commitment to protecting what they love.

The Dog individual possesses a moral clarity that other signs may find simplistic but that proves remarkably reliable in practice. They know what is right — not through abstract reasoning but through a kind of moral instinct that has been refined over millennia. Their loyalty, once given, is absolute. The Dog's gift is the capacity to create safety — environments where others feel protected enough to be vulnerable. The Dog's challenge is anxiety — the same vigilance that enables protection can exhaust them and, in its shadow form, manifest as chronic worry about threats real and imagined.

In the Chinese cosmic order, the Dog governs the hours 19:00-21:00, the direction West-Northwest, and the season of late autumn. These associations point to the Dog's role as the WATCHMAN — the guardian at the gate between day and night, between autumn and winter, between the known and the unknown.`,

  11: `EARTHLY BRANCH 亥 (Hài) — THE PIG

The Pig is the twelfth branch — the completer, the sensualist, the generous soul whose love of life's pleasures and capacity for genuine care make them the zodiac's most benevolent presence. The Pig's element is Water, and its nature is YIN — the water that nourishes, the rain that falls gently on all things without discrimination. Pigs are driven by pleasure, generosity, and a love of life that is so genuine it disarms cynicism.

The Pig individual possesses a goodness that is not innocence but a kind of mature benevolence — they have seen the world's harshness and chosen nonetheless to be gentle. Their generosity is genuine, not performative; they give because giving is their nature, not because they expect return. The Pig's gift is the capacity to enjoy life fully and to share that enjoyment freely. The Pig's challenge is excess — the same love of pleasure can become indulgence, and the same generosity can become exploitation by those who take without giving.

In the Chinese cosmic order, the Pig governs the hours 21:00-23:00, the direction North-Northwest, and the season of early winter. These associations point to the Pig's role as the COMPLETER OF CYCLES — the last branch before the return to the Rat, the final harvest before winter's sleep, the soul that has experienced all twelve stages and emerged with the wisdom that love is what matters.`,
};

// Keyed `${stemIdx}_${branchIdx}` (0-based). Only these 12 of the 60 pairs have
// hand-written text; the rest use the generated fallback. Six entries used to
// sit on impossible or wrong keys (e.g. "Yang Fire Horse" on Metal Horse years,
// '10_10' and '11_11' could never occur); they are now on their real years.
const STEM_BRANCH_COMBINED: Record<string, { name: string; interpretation: string }> = {
  '0_0': { name: 'Yang Wood Rat', interpretation: `YANG WOOD RAT — The Tree Seed\n\nThe Yang Wood Rat is the giant tree's first seed — immense potential compressed into a tiny, resourceful form. The Wood element (growth, vision, expansion) combines with the Rat's water intelligence to create a personality of formidable strategic capacity and long-term vision. These individuals think in decades where others think in days. The Yang Wood Rat is the strategist who sees the forest while navigating the thickest undergrowth. Their gift: the capacity to plan for growth at a scale others cannot conceive. Their challenge: impatience with the slow pace of manifestation.` },
  '1_1': { name: 'Yin Wood Ox', interpretation: `YIN WOOD OX — The Tended Garden\n\nThe Yin Wood Ox is the flowering garden cultivated through seasons of patient labor. The Yin Wood's delicate beauty combines with the Ox's steadfast endurance to create an individual who builds beauty through persistence rather than brilliance. These are the artists who work for decades before being discovered, the gardeners whose paradise was thirty years in the making. Their gift: the capacity to create lasting beauty through sustained, loving attention. Their challenge: being taken for granted by those who benefit from their quiet labor.` },
  '2_2': { name: 'Yang Fire Tiger', interpretation: `YANG FIRE TIGER — The Sunlit Warrior\n\nThe Yang Fire Tiger is the blazing sun striking the forest king — a double dose of Yang intensity that produces one of the most formidable personalities in the zodiac. Fire's passion and the Tiger's courage combine explosively; these individuals are natural protectors, revolutionaries, and inspirers whose presence alone can catalyze change. Their gift: the courage to lead where others fear to tread. Their challenge: burning out from the intensity of their own nature.` },
  '3_3': { name: 'Yin Fire Rabbit', interpretation: `YIN FIRE RABBIT — The Candle in the Sanctuary\n\nThe Yin Fire Rabbit is the candle flame illuminating a space of quiet beauty — warmth without aggression, light without glare. The Rabbit's refinement tempers Fire's passion into something sustainable and gentle. These individuals create environments of extraordinary aesthetic and emotional quality through subtle influence rather than direct action. Their gift: the capacity to transform atmospheres through presence alone. Their challenge: being underestimated by those who mistake gentleness for weakness.` },
  '4_4': { name: 'Yang Earth Dragon', interpretation: `YANG EARTH DRAGON — The Mountain Throne\n\nThe Yang Earth Dragon is the mountain that the dragon claims as its throne — the most commanding combination in the entire zodiac. Earth's stability and the Dragon's majesty combine to produce natural sovereigns whose authority others recognize instinctively. These individuals were born to lead institutions, to build lasting empires, to create structures that define eras. Their gift: the capacity to command respect and resources on a scale others cannot approach. Their challenge: the loneliness that comes with genuine authority.` },
  '5_5': { name: 'Yin Earth Snake', interpretation: `YIN EARTH SNAKE — The Secret Garden\n\nThe Yin Earth Snake is the fertile soil that nurtures the serpent's hidden wisdom — depth upon depth, with treasures buried where only the patient will find them. Earth's groundedness and the Snake's mysticism combine to produce individuals of formidable spiritual and intellectual depth whose true nature is revealed only to those who earn their trust. Their gift: wisdom that grows richer with age, like wine in a cellar. Their challenge: isolation through excessive privacy.` },
  '2_6': { name: 'Yang Fire Horse', interpretation: `YANG FIRE HORSE — The Wildfire Stallion\n\nThe Yang Fire Horse is the blazing sun upon the galloping steed — pure, undiluted Yang energy that produces the zodiac's most dynamic and freedom-loving personality. Fire's passion and the Horse's need for motion combine explosively; these individuals cannot be contained, tamed, or predicted. Their gift: the capacity to inspire through boundless energy and authentic passion. Their challenge: leaving a trail of unfinished projects and relationships in their wake.` },
  '5_7': { name: 'Yin Earth Goat', interpretation: `YIN EARTH GOAT — The Peaceful Pasture\n\nThe Yin Earth Goat is the fertile meadow where the goat grazes in peace — a combination of extraordinary creative potential that requires the right conditions to flourish. Earth's nurturing and the Goat's artistry combine to produce individuals of profound aesthetic and emotional sensitivity whose best work emerges in environments of harmony and support. Their gift: the capacity to create beauty that nourishes the human soul. Their challenge: vulnerability to harsh environments and unsympathetic criticism.` },
  '6_8': { name: 'Yang Metal Monkey', interpretation: `YANG METAL MONKEY — The Forged Puzzle\n\nThe Yang Metal Monkey is forged steel in the hands of a master mechanic — the combination of Metal's precision and the Monkey's ingenuity produces the zodiac's most formidable problem-solver. These individuals see solutions where others see dead ends, find patterns where others see chaos, and improvise tools where others see useless materials. Their gift: creative intelligence of the highest order. Their challenge: the temptation to use their gifts for manipulation rather than genuine contribution.` },
  '7_9': { name: 'Yin Metal Rooster', interpretation: `YIN METAL ROOSTER — The Gold Standard\n\nThe Yin Metal Rooster is refined gold examined by the most discerning eye — a combination of extraordinary standards and the capacity to meet them. Metal's precision and the Rooster's quality control produce individuals of formidable professional competence and aesthetic judgment. These are the experts whose opinions define fields, the craftspeople whose work sets the standard. Their gift: the capacity to achieve excellence that becomes the benchmark for others. Their challenge: the isolation that comes from standards few others can meet.` },
  '4_10': { name: 'Yang Earth Dog', interpretation: `YANG EARTH DOG — The Mountain Guardian\n\nThe Yang Earth Dog is the mountain that watches over the valley — steadfast protection rooted in unwavering moral conviction. Earth's stability and the Dog's loyalty combine to produce individuals of formidable reliability and ethical clarity. These are the guardians of communities, the defenders of principles, the ones who stand firm when others flee. Their gift: the capacity to create safety through sheer, immovable presence. Their challenge: the exhaustion that comes from perpetual vigilance.` },
  '9_11': { name: 'Yin Water Pig', interpretation: `YIN WATER PIG — The Gentle Rain\n\nThe Yin Water Pig is soft rain falling on fertile ground — the purest expression of Water's nurturing and the Pig's generosity. This double Yin Water combination produces the zodiac's most benevolent and emotionally intelligent personality. These individuals give without calculation, love without condition, and create abundance through the simple act of caring generously for all who enter their sphere. Their gift: the capacity to nourish others in ways that enable genuine flourishing. Their challenge: depletion through giving without receiving, and the risk of exploitation by those who mistake generosity for weakness.` },
};

/**
 * The stem-branch year follows the zodiac card: it changes at Lunar New Year,
 * so pass the birth month and day when you have them. Without them the
 * Gregorian year is used, which is wrong for most January/early-February births.
 */
function cycleYear(birthYear: number, birthMonth?: number, birthDay?: number): number {
  return birthMonth && birthDay ? chineseZodiacYear(birthDay, birthMonth, birthYear) : birthYear;
}

export function getHeavenlyStem(birthYear: number, birthMonth?: number, birthDay?: number): HeavenlyStemResult {
  // 4 CE was Jia Zi (Stem 0, Branch 0) — year 1 of the 60-year cycle
  const stemIdx = stemBranchIndex(cycleYear(birthYear, birthMonth, birthDay)).stem;
  const hs = HEAVENLY_STEMS[stemIdx];
  return {
    stem: stemIdx + 1,
    ...hs,
    interpretation: `HEAVENLY STEM ${stemIdx + 1} — ${hs.title}\n\nYou were born under the ${stemIdx + 1}${['st','nd','rd','th','th','th','th','th','th','th'][stemIdx] || 'th'} Heavenly Stem: ${hs.title}. As ${hs.polarity} ${hs.element}, your Stem represents your CELESTIAL INFLUENCE — the energy you receive from heaven, the gift you bring into incarnation, the innate quality that defines your approach to the material world (represented by your Earthly Branch).\n\n${hs.polarity === 'Yang' ? `${hs.element} in its Yang expression is outward, expansive, and active. You express your ${hs.element} nature through direct action, visible presence, and the courage to initiate.` : `${hs.element} in its Yin expression is inward, receptive, and reflective. You express your ${hs.element} nature through subtle influence, patient accumulation, and the wisdom to receive.`}\n\nThe ${hs.element} element governs specific organs, emotions, directions, seasons, and life phases. Understanding your Heavenly Stem is the first step toward understanding your place in the cosmic order.`,
  };
}

export function getEarthlyBranch(birthYear: number, birthMonth?: number, birthDay?: number): EarthlyBranchResult {
  const branchIdx = stemBranchIndex(cycleYear(birthYear, birthMonth, birthDay)).branch;
  const eb = EARTHLY_BRANCHES[branchIdx];
  return {
    branch: branchIdx + 1,
    ...eb,
    interpretation: BRANCH_INTERPRETATIONS[branchIdx] || `Earthly Branch for ${eb.animal}.`,
  };
}

export function getSexagenaryAnalysis(birthYear: number, birthMonth?: number, birthDay?: number): StemBranchResult {
  const { stem: stemIdx, branch: branchIdx } = stemBranchIndex(cycleYear(birthYear, birthMonth, birthDay));

  const stem: HeavenlyStemResult = {
    stem: stemIdx + 1,
    ...HEAVENLY_STEMS[stemIdx],
    interpretation: '', // use getHeavenlyStem for full text
  };

  const branch: EarthlyBranchResult = {
    branch: branchIdx + 1,
    ...EARTHLY_BRANCHES[branchIdx],
    interpretation: '', // use getEarthlyBranch for full text
  };

  const key = `${stemIdx}_${branchIdx}`;
  const combined = STEM_BRANCH_COMBINED[key] || { name: `${stem.element} ${branch.animal}`, interpretation: `The combination of ${stem.element} (${stem.polarity}) with the ${branch.animal} creates a unique energetic signature within the 60-year cycle.` };

  return {
    name: combined.name,
    stem,
    branch,
    interpretation: `SEXAGENARY COMBINATION — ${combined.name}\n\n${combined.interpretation}\n\nThis is your complete Stem-Branch signature within the 60-year Sexagenary cycle. The Heavenly Stem (${stem.title}) represents your celestial nature, while the Earthly Branch (${branch.animal}, ${branch.element}) represents your earthly manifestation. Together they form a unique pattern that occurs only once every 60 years.\n\nYOUR ELEMENT DYNAMICS:\n- Heavenly Element: ${stem.element} (${stem.polarity})\n- Earthly Element: ${branch.element}\n- ${stem.element} ${STEM_BRANCH_ELEMENT_INTERACTIONS[stem.element]?.[branch.element] || 'These elements interact in ways that define your core energetic signature.'}`,
  };
}

const STEM_BRANCH_ELEMENT_INTERACTIONS: Record<string, Record<string, string>> = {
  Wood: {
    Wood: 'Wood feeds Wood — your celestial and earthly natures amplify each other, creating a powerful growth-oriented personality with strong creative and visionary capacities.',
    Fire: 'Wood feeds Fire — your celestial nature (Wood) fuels your earthly expression (Fire), creating a dynamic where your visions naturally manifest as passionate action.',
    Earth: 'Wood controls Earth — your celestial Wood energy naturally organizes and shapes your earthly Earth nature, creating a productive tension between vision and practicality.',
    Metal: 'Metal controls Wood — your earthly Metal nature may feel restrictive to your celestial Wood energy, creating a dynamic where discipline (Metal) shapes vision (Wood) into sustainable forms.',
    Water: 'Water feeds Wood — your earthly Water nature nourishes your celestial Wood energy, creating a powerful growth dynamic where emotional intelligence supports visionary capacity.',
  },
  Fire: {
    Wood: 'Wood feeds Fire — your earthly Wood nature fuels your celestial Fire energy, creating a dynamic where practical growth supports passionate expression.',
    Fire: 'Fire amplifies Fire — your celestial and earthly natures reinforce each other, creating an intensely passionate personality with powerful transformative capacities.',
    Earth: 'Fire creates Earth — your celestial Fire transforms into earthly Earth, creating a dynamic where passion naturally manifests as practical, grounded achievement.',
    Metal: 'Fire controls Metal — your celestial Fire energy shapes and tempers your earthly Metal nature, creating a dynamic where passion refines precision.',
    Water: 'Water controls Fire — your earthly Water nature may feel like it dampens your celestial Fire energy, creating a dynamic where emotional depth (Water) tempers passion (Fire) into sustainable warmth.',
  },
  Earth: {
    Wood: 'Wood controls Earth — your earthly Wood nature may challenge your celestial Earth energy, creating a dynamic where growth (Wood) pushes stability (Earth) to evolve.',
    Fire: 'Fire creates Earth — your earthly Fire nature feeds your celestial Earth energy, creating a dynamic where passion supports grounded, practical achievement.',
    Earth: 'Earth amplifies Earth — your celestial and earthly natures reinforce each other, creating profound stability and the capacity for monumental, lasting achievement.',
    Metal: 'Earth creates Metal — your celestial Earth transforms into earthly Metal, creating a dynamic where stability naturally manifests as precision and quality.',
    Water: 'Earth controls Water — your celestial Earth energy contains and channels your earthly Water nature, creating a dynamic where stability gives form to emotional depth.',
  },
  Metal: {
    Wood: 'Metal controls Wood — your earthly Wood nature may feel constrained by your celestial Metal energy, creating a dynamic where growth is disciplined into precise, sustainable forms.',
    Fire: 'Fire controls Metal — your earthly Fire nature may challenge your celestial Metal energy, creating a dynamic where passion tests and tempers your precision.',
    Earth: 'Earth creates Metal — your earthly Earth nature supports your celestial Metal energy, creating a dynamic where stability naturally produces precision and refinement.',
    Metal: 'Metal amplifies Metal — your celestial and earthly natures reinforce each other, creating formidable discipline, precision, and the capacity for sustained excellence.',
    Water: 'Metal creates Water — your celestial Metal transforms into earthly Water, creating a dynamic where precision and discipline naturally produce emotional depth.',
  },
  Water: {
    Wood: 'Water feeds Wood — your earthly Wood nature draws on your celestial Water energy, creating a dynamic where emotional depth supports organic growth and vision.',
    Fire: 'Water controls Fire — your earthly Fire nature may feel challenged by your celestial Water energy, creating a dynamic where passion is deepened and cooled into wisdom.',
    Earth: 'Earth controls Water — your earthly Earth nature may feel like it contains your celestial Water energy, creating a dynamic where practicality gives form to emotional depth.',
    Metal: 'Metal creates Water — your earthly Metal nature supports your celestial Water energy, creating a dynamic where precision and discipline naturally produce emotional wisdom.',
    Water: 'Water amplifies Water — your celestial and earthly natures reinforce each other, creating profound emotional intelligence, intuition, and spiritual depth.',
  },
};
