/**
 * MYSTIQUE COMPASS — Birth Day of Week
 *
 * The day of the week you were born carries a distinct planetary
 * and numerological signature that colors your entire life path.
 *
 * ALL TEXT IS VERBATIM. DO NOT SUMMARIZE OR TRUNCATE.
 */

import { historicalWeekday } from './chinese-calendar-math';

export interface DayOfWeekResult {
  dayName: string;
  planet: string;
  number: number;
  title: string;
  interpretation: string;
}

const DAY_DATA: Record<number, DayOfWeekResult> = {
  0: { // Sunday
    dayName: 'Sunday', planet: 'Sun', number: 1,
    title: 'Child of the Sun — The Radiant',
    interpretation: `BORN ON SUNDAY — Child of the Sun

Those born on Sunday carry the solar vibration — the energy of the Sun at its most direct and unmediated. Sunday's children are marked by a natural radiance, a quality of presence that draws attention without demanding it. The Sun governs the essential self, the core identity, the "I am" that precedes all other considerations. Sunday-born individuals are here to SHINE — not necessarily in the sense of fame or public recognition, but in the deeper sense of fully inhabiting their authentic self and allowing that self to be seen.

THE LIGHT: Sunday-born individuals possess a natural confidence that, when healthy, is neither arrogance nor performance but a simple, grounded self-acceptance. They do not need to prove themselves because their sense of worth is intrinsic rather than earned. This gives them a remarkable resilience — criticism wounds them less than it wounds others because their self-assessment is internally referenced. They are natural leaders not by ambition but by constitutional design — people gravitate toward their warmth and certainty. In relationships, they are generous and protective, though they require space for their own pursuits.

THE SHADOW: The Sunday shadow is the inflation of the solar ego — the slide from confidence into arrogance, from self-acceptance into self-absorption, from radiance into the demand that all light must emanate from oneself. The Sunday-born may become blind to others' contributions, dismissive of perspectives that do not align with their own, and incapable of the genuine receptivity that relationships require. Their need for recognition can become a hunger that is never satisfied, driving them to ever more performative displays of selfhood that paradoxically distance them from the authentic self they seek to express.

THE PRESCRIPTION: Practice deliberate receptivity. The Sun gives light; it does not receive it. The Sunday-born must consciously cultivate the capacity to listen, to learn, to be influenced — not as weakness but as the completion of their solar nature. The Sun that refuses to set is not powerful; it is monstrous. The Sun that sets and rises again is the source of all life.`,
  },
  1: { // Monday
    dayName: 'Monday', planet: 'Moon', number: 2,
    title: 'Child of the Moon — The Sensitive',
    interpretation: `BORN ON MONDAY — Child of the Moon

Those born on Monday carry the lunar vibration — the energy of the Moon at its most potent. Monday's children are marked by exceptional sensitivity, emotional depth, and a connection to the unconscious realms that other days' children may access only through effort. The Moon governs emotion, intuition, memory, and the maternal principle. Monday-born individuals are here to FEEL — to experience the full spectrum of human emotion and to develop the wisdom that only emotional depth can provide.

THE LIGHT: Monday-born individuals possess an emotional intelligence that is constitutional rather than learned. They read rooms, sense unspoken tensions, and pick up on emotional undercurrents that more solar personalities miss entirely. Their intuition is remarkably acute — they "know" things about people and situations without being able to trace the knowing to specific evidence. They are natural nurturers, creating emotional safety for others through the simple quality of their presence. In relationships, they are deeply devoted, sometimes to a fault, and their emotional memory is extraordinary — they remember not just what happened but how it FELT.

THE SHADOW: The Monday shadow is emotional inundation — the lunar sensitivity becoming so acute that the individual cannot distinguish between their own emotions and those they are absorbing from others. This leads to mood swings that seem unprovoked (because the trigger was someone else's unexpressed feeling), to exhaustion in social situations, and to a tendency to withdraw into solitude not from preference but from self-protection. A subtler shadow is emotional manipulation — using the acute perception of others' feelings to influence their behavior, consciously or unconsciously.

THE PRESCRIPTION: Develop emotional boundaries. The Moon reflects light; it is not the source of light. The Monday-born must learn to distinguish between "I feel this" and "I am picking up that someone else feels this." Regular solitude is not avoidance but essential maintenance — time away from others' emotional fields allows the Monday-born to recalibrate to their own emotional baseline.`,
  },
  2: { // Tuesday
    dayName: 'Tuesday', planet: 'Mars', number: 9,
    title: 'Child of Mars — The Warrior',
    interpretation: `BORN ON TUESDAY — Child of Mars

Those born on Tuesday carry the martial vibration — the energy of Mars, the planet of action, courage, desire, and conflict. Tuesday's children are marked by an innate drive, a forward momentum that resists stagnation and demands engagement with life on active terms. Mars governs the will expressed through action — not the will that contemplates but the will that MOVES. Tuesday-born individuals are here to ACT — to engage the world directly, to pursue what they desire, and to develop the courage that only confrontation with difficulty can forge.

THE LIGHT: Tuesday-born individuals possess remarkable courage and decisiveness. Where others hesitate, they act. Where others deliberate, they decide. This is not recklessness (though it can become that) but a constitutional orientation toward engagement — the Tuesday-born soul learns through DOING rather than through contemplating. Their energy is contagious; they inspire action in others simply by being in motion themselves. They are natural protectors, advocates, and champions of causes, possessing a righteous anger that, when properly directed, fuels positive change.

THE SHADOW: The Tuesday shadow is the corruption of courage into aggression — the martial drive becoming destructive rather than constructive. The Tuesday-born may escalate conflicts that could have been resolved peacefully, dominate situations that called for collaboration, and leave a trail of collateral damage in their wake. A subtler shadow is the inability to be still — the martial energy becomes an addiction to activity, and inactivity feels like death. The deepest wound is the equation of conflict with intimacy — the Tuesday-born may only feel truly connected to others when they are fighting with or against them.

THE PRESCRIPTION: Cultivate the warrior's highest virtue: discernment. Not every battle is yours to fight. Not every opponent is an enemy. Not every situation requires force. The Mars energy is a sword; a sword in the hand of a wise warrior protects the innocent. A sword in the hand of a fool wounds everyone, including the fool. Learn when to sheathe.`,
  },
  3: { // Wednesday
    dayName: 'Wednesday', planet: 'Mercury', number: 5,
    title: 'Child of Mercury — The Messenger',
    interpretation: `BORN ON WEDNESDAY — Child of Mercury

Those born on Wednesday carry the mercurial vibration — the energy of Mercury, the planet of communication, intellect, travel, and commerce. Wednesday's children are marked by quick minds, agile tongues, and a restlessness that drives them to constant learning and movement. Mercury governs the bridge between minds — the transmission of information, the exchange of ideas, the commerce (literal and metaphorical) that connects human beings. Wednesday-born individuals are here to COMMUNICATE — to serve as channels through which knowledge, ideas, and understanding flow between people.

THE LIGHT: Wednesday-born individuals possess rapid intelligence and verbal facility. They learn quickly, adapt easily, and can hold their own in virtually any conversation. Their curiosity is genuine and wide-ranging — they are interested in everything, specialists in nothing, and their value lies precisely in this breadth. They are natural mediators, translators (of language and of perspective), and connectors — the people who know everyone and can introduce anyone to anyone. In professional life, they excel in communication, commerce, education, and any field where information must be gathered, processed, and redistributed.

THE SHADOW: The Wednesday shadow is the slide from versatility into superficiality — knowing a little about everything but not enough about anything to contribute genuine depth. The mercurial mind, unchecked, becomes a hummingbird that visits a thousand flowers but pollinates none. A subtler shadow is the use of verbal skill to evade rather than engage — the Wednesday-born may talk their way out of accountability, charm their way past substance, and use wit as a shield against vulnerability. The deepest wound is the loneliness of the perpetual intermediary — always connecting others, never feeling fully connected oneself.

THE PRESCRIPTION: Choose depth in at least one domain. The Mercury energy is a network; networks require nodes, not just connections. Be a node — a point where information is not merely passed through but integrated, synthesized, and transformed. Your gift is communication; your curriculum is discovering something worth communicating.`,
  },
  4: { // Thursday
    dayName: 'Thursday', planet: 'Jupiter', number: 3,
    title: 'Child of Jupiter — The Beneficent',
    interpretation: `BORN ON THURSDAY — Child of Jupiter

Those born on Thursday carry the jovial vibration — the energy of Jupiter, the planet of expansion, abundance, wisdom, and good fortune. Thursday's children are marked by optimism, generosity, and a quality of natural luck that others may attribute to chance but which is, in fact, constitutional. Jupiter governs growth — the expansion of understanding, the accumulation of wisdom, the increase of resources. Thursday-born individuals are here to EXPAND — to grow beyond their current limits and to help others do the same.

THE LIGHT: Thursday-born individuals possess a natural buoyancy that carries them through difficulties that would sink others. Their optimism is not naive but generative — they expect good outcomes and, through the mysterious operation of expectation on reality, good outcomes tend to arrive. They are generous with their resources, their time, and their wisdom — Jupiter's abundance flows through them rather than accumulating in them. They make excellent teachers, mentors, and leaders whose authority comes from genuine knowledge rather than mere position.

THE SHADOW: The Thursday shadow is the corruption of expansion into excess — the jovial appetite becoming gluttony, the generosity becoming waste, the optimism becoming denial of genuine problems. The Thursday-born may over-promise and under-deliver, their natural confidence outstripping their actual capacity. A subtler shadow is the assumption of perpetual expansion — Jupiter's energy can create a blindness to cycles of contraction, leaving the Thursday-born unprepared when fortune temporarily withdraws. The deepest wound is the fear that without the perpetual flow of abundance, they would be nothing — that their worth is tied entirely to what they can provide.

THE PRESCRIPTION: Cultivate gratitude as a discipline, not just a feeling. Jupiter's abundance is most stable when it is consciously appreciated — the energy of "I have enough" attracts more than the energy of "more, more, more." Prepare for contraction during expansion, and remember that the truest wisdom is knowing that all cycles turn.`,
  },
  5: { // Friday
    dayName: 'Friday', planet: 'Venus', number: 6,
    title: 'Child of Venus — The Lover',
    interpretation: `BORN ON FRIDAY — Child of Venus

Those born on Friday carry the venusian vibration — the energy of Venus, the planet of love, beauty, harmony, and value. Friday's children are marked by an innate appreciation for aesthetics, a deep need for harmonious relationships, and a capacity for love that extends beyond the romantic into a general orientation of care toward the world. Venus governs attraction — not just romantic attraction but the magnetic quality that draws people, beauty, and pleasant circumstances toward certain individuals. Friday-born individuals are here to LOVE — to experience and express love in its many forms and to create beauty in their environment and relationships.

THE LIGHT: Friday-born individuals possess a natural charm and grace that makes them welcome in virtually any social context. They are the peacemakers, the harmonizers, the ones who notice when a room's energy is discordant and instinctively work to restore balance. Their aesthetic sense is pronounced — they create beauty around them as naturally as breathing, in their homes, their appearance, and their work. In relationships, they are warm, affectionate, and genuinely invested in their partner's well-being. Professionally, they excel in arts, design, hospitality, counseling, and any field where the product is beauty, comfort, or harmony.

THE SHADOW: The Friday shadow is the over-identification with harmony — the venusian need for pleasant relations becoming a terror of conflict that prevents necessary confrontations. The Friday-born may stay in relationships, jobs, and situations long past their expiration dates because ending them would create disharmony. A subtler shadow is the confusion of love with pleasure — seeking the feeling of love without the substance, accumulating romantic experiences without developing the capacity for sustained intimacy. The deepest wound is the equation of lovability with appearance — the fear that without beauty, charm, and pleasantness, one would be unlovable.

THE PRESCRIPTION: Learn to distinguish between genuine harmony and conflict avoidance. True harmony sometimes requires the temporary discord of honest conversation. The Venus energy is a garden; a garden requires weeding, pruning, and the occasional removal of plants that have died. These acts are not violations of the garden's beauty — they are the conditions of its continued flourishing.`,
  },
  6: { // Saturday
    dayName: 'Saturday', planet: 'Saturn', number: 8,
    title: 'Child of Saturn — The Elder',
    interpretation: `BORN ON SATURDAY — Child of Saturn

Those born on Saturday carry the saturnine vibration — the energy of Saturn, the planet of discipline, structure, karma, and wisdom earned through difficulty. Saturday's children are marked by a seriousness that may be mistaken for coldness, a depth that may be mistaken for distance, and a wisdom that is hard-won rather than gifted. Saturn governs limits — the boundaries that define identity, the constraints that build character, the consequences that teach responsibility. Saturday-born individuals are here to BUILD — to construct lives, works, and legacies that endure beyond the moment of their creation.

THE LIGHT: Saturday-born individuals possess extraordinary discipline and persistence. Where others falter, they continue. Where others take shortcuts, they take the long way — and arrive with a foundation that shortcuts cannot provide. Their wisdom is genuine because it has been tested; they do not believe things because they were told but because they have verified them through experience. They are natural elders — regardless of chronological age, they carry a gravity that others respect and seek out for counsel. Professionally, they excel in fields requiring sustained effort, deep expertise, and the willingness to delay gratification.

THE SHADOW: The Saturday shadow is the slide from discipline into rigidity — the saturnine structure becoming a prison, the wisdom becoming dogma, the patience becoming passivity. The Saturday-born may become so identified with difficulty that they cannot accept ease, so accustomed to earning that they cannot receive, so focused on the long term that they miss the joy available in the present moment. A subtler shadow is the belief that suffering is inherently virtuous — that things must be hard to be valuable. The deepest wound is the loneliness of the elder — carrying wisdom that few are ready to receive.

THE PRESCRIPTION: Learn to receive joy without suspicion. Saturn's gifts are real but they are not the ONLY gifts. The discipline that builds cathedrals is noble; the ability to dance in the cathedral once it is built is equally essential. Your wisdom is needed, but it is best transmitted through presence, not pronouncement. Be with others, not above them.`,
  },
};

export function getBirthDayOfWeek(day: number, month: number, year: number): DayOfWeekResult {
  // Calendar arithmetic instead of `new Date(...)`, which maps years 0–99 to
  // the 1900s and applies the Gregorian calendar to Julian-era dates
  // (Shakespeare, Galileo, Elizabeth I and every BCE figure came out wrong).
  return DAY_DATA[historicalWeekday(day, month, year)]; // 0=Sun, 1=Mon, ...
}
