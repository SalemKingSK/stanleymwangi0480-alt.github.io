/**
 * MYSTIQUE COMPASS — Number Meanings 1-9 (Core Archives)
 *
 * The fundamental vibration of each single-digit number.
 * These are the root meanings from which all compound numbers derive.
 *
 * ALL TEXT IS VERBATIM.
 */

export interface NumberMeaning {
  number: number;
  title: string;
  planet: string;
  tarot: string;
  element: string;
  keywords: string;
  interpretation: string;
}

export type NumberMeaningsResult = NumberMeaning[];

const MEANINGS: NumberMeaning[] = [
  {
    number: 1,
    title: 'The Origin — Unity, Individuality, the Primal Impulse',
    planet: 'Sun',
    tarot: 'The Magician',
    element: 'Fire',
    keywords: 'Independence, leadership, originality, initiative, courage, willpower, selfhood',
    interpretation: `NUMBER 1 — The Origin

The number 1 is not merely "first" — it is the PRIMAL IMPULSE itself, the moment before which there was nothing and after which there was everything. In every cosmogony, the 1 appears as the first movement, the original vibration, the singular point from which all diversity emerges. To understand the 1 is to understand the mystery of BEGINNING.

THE ARCHETYPE: The Pioneer, the Leader, the Solitary Creator. The 1 energy is fundamentally MASCULINE in the cosmic sense — not in gender but in the principle of Yang: active, initiating, penetrating, outward-moving. The 1 does not wait; the 1 acts. The mind governed by the 1 asks: "What must begin? What must be originated? What has never existed before that I can bring into being?"

THE LIGHT: Courage, originality, and the capacity to stand alone. At its highest expression, the 1 produces individuals who are not merely independent but SOVEREIGN — they are the source of their own authority, the authors of their own lives, the originators of paths that did not exist before they walked them. The 1's gift is the capacity to BEGIN — not to follow, not to improve, but to initiate from pure creative will.

THE SHADOW: Isolation, arrogance, and the loneliness of the pioneer who has gone so far ahead that no one follows. The 1's shadow is the EGO that mistakes itself for the totality. At its lowest expression, the 1 becomes domineering, aggressively self-centered, and incapable of collaboration because it cannot recognize any authority but its own. The 1 who does not integrate the 2 (partnership, receptivity) becomes a brilliant failure — original but irrelevant, creative but disconnected.

THE LIFE CURRICULUM: To develop genuine independence without becoming isolated. To lead without dominating. To originate without needing to be the sole author of everything. The 1's journey is from the loneliness of ego-separation to the solitude of grounded selfhood — mature independence that can collaborate freely because it is not threatened by others' contributions.

RULED BY: The Sun. The 1 shares the Sun's quality of centrality — the sense, often unconscious, that the universe revolves around oneself. The light of awareness is the Sun's gift; the blindness of self-absorption is its risk.`,
  },
  {
    number: 2,
    title: 'The Mirror — Duality, Partnership, the Reflective Principle',
    planet: 'Moon',
    tarot: 'The High Priestess',
    element: 'Water',
    keywords: 'Cooperation, diplomacy, sensitivity, intuition, patience, receptivity, balance',
    interpretation: `NUMBER 2 — The Mirror

The number 2 is the first division of unity — the moment when ONE becomes TWO, when the solitary becomes relational, when the self discovers that it is not alone. The 2 introduces the fundamental principle of DUALITY: self/other, masculine/feminine, light/dark, conscious/unconscious. To understand the 2 is to understand the mystery of RELATIONSHIP.

THE ARCHETYPE: The Diplomat, the Mediator, the Sensitive Soul. The 2 energy is fundamentally FEMININE — Yin: receptive, responsive, inward-moving. The 2 does not initiate; it receives and responds. The mind governed by the 2 asks: "What is the other experiencing? What is the pattern beneath the surface? What harmony can I create?"

THE LIGHT: Sensitivity, diplomacy, and the capacity for genuine emotional attunement. At its highest expression, the 2 produces individuals of extraordinary emotional intelligence — they sense what others feel, mediate what others cannot resolve, and create harmony through presence alone. The 2's gift is the capacity to RELATE — to perceive the connection between things that appear separate.

THE SHADOW: Self-erasure, over-accommodation, and the loss of identity through excessive identification with others. The 2's shadow is the SELF that disappears into relationship — the diplomat who has no position of their own, the peacemaker who maintains peace at the cost of truth, the sensitive soul who is so attuned to others that they have forgotten how to attune to themselves. The 2 who does not integrate the 1 (independence, selfhood) becomes a chameleon — perfectly adapted to every environment but without any colors of their own.

THE LIFE CURRICULUM: To develop genuine partnership without losing the self. To be sensitive without being porous. To create harmony without suppressing truth. The 2's journey is from the dependency of self-erasure to the strength of mature interdependence — relationship between equals who remain distinct as they connect.

RULED BY: The Moon. The 2 shares the Moon's quality of reflection — the capacity to receive and return light rather than generating it. The Moon's phases mirror the 2's emotional cycles; its gravitational pull mirrors the 2's sensitivity to forces beyond the self.`,
  },
  {
    number: 3,
    title: 'The Expression — Creativity, Joy, the Generative Principle',
    planet: 'Jupiter',
    tarot: 'The Empress',
    element: 'Fire',
    keywords: 'Creativity, communication, optimism, sociability, inspiration, joy, self-expression',
    interpretation: `NUMBER 3 — The Expression

The number 3 is the first synthesis — the child of 1 and 2, the result of their union, the CREATION that emerges when the primal impulse meets the receptive field. The 3 introduces the fundamental principle of GENERATIVITY: the production of something new from the interaction of existing forces. To understand the 3 is to understand the mystery of CREATION.

THE ARCHETYPE: The Artist, the Communicator, the Joyful Creator. The 3 energy is fundamentally EXPANSIVE — it moves outward, it fills space, it brings color and sound and form into being. The 3 does not calculate; it creates. The mind governed by the 3 asks: "What can I express? What beauty can I bring into being? What joy can I share?"

THE LIGHT: Creativity, optimism, and the capacity for genuine self-expression. At its highest expression, the 3 produces individuals whose communication is not merely informative but TRANSFORMATIVE — their words, art, or presence genuinely uplifts those who encounter them. The 3's gift is the capacity to CREATE — to bring beauty, meaning, and joy into forms that others can experience.

THE SHADOW: Dispersion, superficiality, and the scattering of creative energy across too many projects. The 3's shadow is the BRILLIANCE that never focuses — the gifted communicator who talks endlessly without saying anything, the creative spirit who starts a hundred projects and finishes none, the social butterfly who is known by everyone and known by no one. The 3 who does not integrate the 4 (discipline, structure) becomes a flame that burns bright but leaves no warmth — all spark, no substance.

THE LIFE CURRICULUM: To develop creative expression with discipline. To communicate not merely to be heard but to be understood. To find the depth within joy rather than fleeing depth in favor of surface-level happiness. The 3's journey is from the dispersion of undisciplined creativity to the power of focused, joyful expression.

RULED BY: Jupiter. The 3 shares Jupiter's qualities of expansion, abundance, and joy. Jupiter's generosity of spirit manifests in the 3 as social warmth and creative fertility; its shadow of excess manifests as the 3's tendency toward dispersion and superficiality.`,
  },
  {
    number: 4,
    title: 'The Foundation — Structure, Discipline, the Material Principle',
    planet: 'Uranus (Shadow: Saturn)',
    tarot: 'The Emperor',
    element: 'Earth',
    keywords: 'Stability, discipline, order, reliability, hard work, building, foundation',
    interpretation: `NUMBER 4 — The Foundation

The number 4 introduces the principle of STRUCTURE — the creation of stable forms that can endure across time. If the 1 initiates, the 2 relates, and the 3 creates, then the 4 BUILDS — it takes the inspiration of the first three numbers and gives it walls, a roof, and a foundation deep enough to weather storms. To understand the 4 is to understand the mystery of ENDURANCE.

THE ARCHETYPE: The Builder, the Organizer, the Steadfast Worker. The 4 energy is fundamentally CONCRETE — it deals with the real, the measurable, the reliable. The 4 does not dream; it constructs. The mind governed by the 4 asks: "What is the plan? What are the steps? What systems will ensure this endures?"

THE LIGHT: Discipline, reliability, and the capacity for sustained, methodical effort. At its highest expression, the 4 produces individuals who build institutions, systems, and structures that serve humanity for generations. The 4's gift is the capacity to MANIFEST — to translate vision into form, intention into action, inspiration into enduring achievement.

THE SHADOW: Rigidity, workaholism, and the sacrifice of joy to the demands of duty. The 4's shadow is the STRUCTURE that becomes a prison — the builder who cannot rest, the organizer who cannot tolerate spontaneity, the reliable worker who has become so identified with work that they no longer remember how to play. The 4 who does not integrate the 5 (freedom, spontaneity) becomes a fortress — strong but isolated, enduring but joyless.

THE LIFE CURRICULUM: To develop discipline without rigidity. To build structures that serve life rather than constraining it. To work steadily while remaining open to the spontaneous and unexpected. The 4's journey is from the rigidity of excessive control to the strength of flexible discipline — structures that are strong enough to hold and flexible enough to breathe.

RULED BY: Uranus (in its higher octave) and Saturn (in its lower). The 4 shares Saturn's demand for discipline, structure, and patient labor. In its higher expression, the 4 accesses Uranus's capacity for breakthrough through sustained effort — the sudden insight that arrives after years of preparation.`,
  },
  {
    number: 5,
    title: 'The Liberator — Freedom, Change, the Dynamic Principle',
    planet: 'Mercury',
    tarot: 'The Hierophant',
    element: 'Air',
    keywords: 'Freedom, adventure, versatility, adaptability, sensuality, change, expansion',
    interpretation: `NUMBER 5 — The Liberator

The number 5 introduces the principle of CHANGE — the force that prevents structures from becoming prisons, that introduces novelty into repetition, that ensures life remains a verb rather than a noun. After the 4's stability, the 5 BREAKS — not to destroy but to liberate, to remind us that what has been built can also be rebuilt. To understand the 5 is to understand the mystery of FREEDOM.

THE ARCHETYPE: The Adventurer, the Free Spirit, the Agent of Change. The 5 energy is fundamentally DYNAMIC — it moves, it transforms, it refuses to be still. The 5 does not settle; it explores. The mind governed by the 5 asks: "What lies beyond? What would happen if I tried something different? What am I missing by staying where I am?"

THE LIGHT: Freedom, adaptability, and the courage to embrace uncertainty. At its highest expression, the 5 produces individuals who are genuinely free — not because they lack commitments but because they have learned that genuine freedom is internal. The 5's gift is the capacity to CHANGE — to adapt to circumstances, to reinvent the self, to find opportunity in what others perceive as chaos.

THE SHADOW: Chaos, recklessness, and the inability to commit to anything long enough for it to bear fruit. The 5's shadow is the FREEDOM that becomes escape — the traveller who is always moving because they cannot bear to arrive, the adventurer who consumes experiences without being changed by them, the free spirit who confuses liberation with the absence of responsibility. The 5 who does not integrate the 4 (discipline, commitment) becomes a leaf in the wind — constantly moving, never landing, and ultimately going nowhere.

THE LIFE CURRICULUM: To develop genuine freedom without becoming unmoored. To embrace change while maintaining a center. To experience novelty without losing the capacity for depth. The 5's journey is from the chaos of undisciplined freedom to the power of chosen commitment — freedom that is not the absence of constraints but the capacity to choose among them wisely.

RULED BY: Mercury. The 5 shares Mercury's qualities of speed, communication, and adaptability. Mercury's capacity to travel between worlds — gods and mortals, conscious and unconscious — mirrors the 5's role as the bridge between the stability of the 4 and the responsibility of the 6.`,
  },
  {
    number: 6,
    title: 'The Heart — Love, Responsibility, the Nurturing Principle',
    planet: 'Venus',
    tarot: 'The Lovers',
    element: 'Earth',
    keywords: 'Love, nurturing, responsibility, harmony, service, domesticity, beauty',
    interpretation: `NUMBER 6 — The Heart

The number 6 introduces the principle of LOVE — not romantic infatuation but the deeper, more demanding love that accepts responsibility for what it loves. After the 5's freedom, the 6 RETURNS — not from exhaustion but from the recognition that genuine freedom is empty without genuine connection. To understand the 6 is to understand the mystery of CARE.

THE ARCHETYPE: The Nurturer, the Caregiver, the Harmonizer. The 6 energy is fundamentally DEVOTIONAL — it serves, it protects, it beautifies. The 6 does not assert; it supports. The mind governed by the 6 asks: "Who needs care? What needs to be made beautiful? Where can I be of genuine service?"

THE LIGHT: Love, responsibility, and the capacity for genuine care. At its highest expression, the 6 produces individuals whose presence is healing — their homes are sanctuaries, their relationships are nurturing, and their care extends naturally to all who enter their sphere. The 6's gift is the capacity to LOVE — not as attachment but as the active commitment to another's flourishing.

THE SHADOW: Martyrdom, over-giving, and the sacrifice of self to the demands of care. The 6's shadow is the LOVE that devours the lover — the caregiver who has cared for everyone but themselves, the nurturer who is running on empty, the beautiful soul whose radiance has been dimmed by the endless demands of those they serve. The 6 who does not integrate the self-care principle becomes a martyr — loved by everyone, known by no one, and secretly resentful of the very people they have dedicated their life to serving.

THE LIFE CURRICULUM: To develop genuine love without self-erasure. To serve without becoming a martyr. To create harmony without suppressing the discord that sometimes signals necessary change. The 6's journey is from the depletion of over-giving to the abundance of balanced love — care that flows from fullness rather than drains from emptiness.

RULED BY: Venus. The 6 shares Venus's qualities of love, beauty, and harmony. Venus's gravitational pull toward relationship mirrors the 6's instinctive orientation toward care; its shadow of possessiveness mirrors the 6's tendency toward controlling love disguised as nurturing love.`,
  },
  {
    number: 7,
    title: 'The Seeker — Wisdom, Introspection, the Spiritual Principle',
    planet: 'Neptune (Shadow: Saturn)',
    tarot: 'The Chariot',
    element: 'Water',
    keywords: 'Wisdom, spirituality, analysis, introspection, solitude, research, depth',
    interpretation: `NUMBER 7 — The Seeker

The number 7 introduces the principle of WISDOM — knowledge that has been metabolized into understanding, understanding that has been deepened into insight, insight that has been integrated into being. After the 6's relational intensity, the 7 WITHDRAWS — not from rejection but from the recognition that certain truths can only be found in solitude. To understand the 7 is to understand the mystery of DEPTH.

THE ARCHETYPE: The Mystic, the Philosopher, the Solitary Sage. The 7 energy is fundamentally INTROSPECTIVE — it turns inward, it questions, it seeks the truth beneath the surface. The 7 does not socialize; it contemplates. The mind governed by the 7 asks: "What is really happening here? What is the truth beneath the appearance? What does this experience mean?"

THE LIGHT: Wisdom, spiritual depth, and the capacity for genuine understanding. At its highest expression, the 7 produces individuals whose wisdom is not merely known but LIVED — they are the sages whose presence alone shifts the consciousness of those around them. The 7's gift is the capacity to KNOW — not to accumulate information but to perceive the essential nature of things.

THE SHADOW: Isolation, intellectual arrogance, and the retreat from life disguised as spiritual seeking. The 7's shadow is the WISDOM that never descends from the mountain — the mystic who has lost the capacity for ordinary human connection, the philosopher who has no wisdom about how to live, the seeker who has been seeking so long they have forgotten what they were looking for. The 7 who does not integrate engagement with the world becomes a ghost — wise but irrelevant, profound but disconnected.

THE LIFE CURRICULUM: To develop genuine wisdom without becoming isolated. To seek truth while remaining engaged with life. To find the sacred in solitude and then bring it back to community. The 7's journey is from the isolation of spiritual pride to the integration of wisdom lived in the world.

RULED BY: Neptune (higher octave) and Saturn (lower). The 7 shares Neptune's capacity for spiritual perception and mystical insight; it shares Saturn's demand for solitude, discipline, and the patient pursuit of wisdom. The 7 who balances both accesses both the visionary and the analytical dimensions of knowing.`,
  },
  {
    number: 8,
    title: 'The Executive — Power, Abundance, the Material Principle',
    planet: 'Saturn',
    tarot: 'Strength',
    element: 'Earth',
    keywords: 'Power, authority, material mastery, ambition, leadership, executive ability, karmic justice',
    interpretation: `NUMBER 8 — The Executive

The number 8 introduces the principle of POWER — the capacity to direct energy, resources, and attention toward chosen ends. After the 7's introspection, the 8 ACTS at scale — not personal action but organizational, institutional, societal action. To understand the 8 is to understand the mystery of AUTHORITY.

THE ARCHETYPE: The Executive, the Builder of Empires, the Director of Resources. The 8 energy is fundamentally EFFECTIVE — it gets things done, it mobilizes resources, it commands attention and respect. The 8 does not merely intend; it achieves. The mind governed by the 8 asks: "How can this be scaled? How can resources be directed toward this goal? What is the most efficient path to the desired outcome?"

THE LIGHT: Authority, material mastery, and the capacity to direct resources toward meaningful ends. At its highest expression, the 8 produces individuals who build enterprises, lead organizations, and create wealth that serves purposes beyond personal enrichment. The 8's gift is the capacity to MANIFEST at scale — to translate vision into institutions, intention into infrastructure, and individual capability into collective achievement.

THE SHADOW: Greed, domination, and the corruption that power enables. The 8's shadow is the POWER that serves only itself — the executive who has forgotten what the organization was built to serve, the wealthy individual whose wealth enriches no one else, the authority figure whose authority has become an end rather than a means. The 8 who does not integrate the 9 (compassion, completion) becomes a tyrant — powerful but unloved, successful but meaningless, rich but impoverished in every dimension that matters.

THE LIFE CURRICULUM: To develop genuine power without being corrupted by it. To direct resources ethically. To lead without dominating. The 8's journey is from the emptiness of power-for-its-own-sake to the fulfillment of power-in-service-of-purpose.

RULED BY: Saturn. The 8 shares Saturn's concern with material structure, karma, and the consequences of action over time. Saturn teaches that power is a test, not a reward — and the 8 who fails this test loses everything the 8 gave them.`,
  },
  {
    number: 9,
    title: 'The Completion — Wisdom, Compassion, the Universal Principle',
    planet: 'Mars',
    tarot: 'The Hermit',
    element: 'Fire',
    keywords: 'Humanitarianism, completion, compassion, wisdom, release, universality, endings',
    interpretation: `NUMBER 9 — The Completion

The number 9 is the last of the single digits — the completion of one cycle and the preparation for the next. The 9 contains within it the wisdom of all the numbers that precede it: the 1's initiative, the 2's sensitivity, the 3's creativity, the 4's discipline, the 5's freedom, the 6's love, the 7's wisdom, and the 8's power — all synthesized into a vibration that is fundamentally about GIVING BACK. To understand the 9 is to understand the mystery of COMPLETION.

THE ARCHETYPE: The Humanitarian, the Wise Elder, the Completer of Cycles. The 9 energy is fundamentally TRANSCENDENT — it looks beyond the personal to the universal, beyond the self to humanity, beyond this moment to the full arc of time. The 9 does not accumulate; it releases. The mind governed by the 9 asks: "What can I give? What needs to be completed? What wisdom can I transmit before I go?"

THE LIGHT: Compassion, wisdom, and the capacity to love without possession. At its highest expression, the 9 produces individuals whose concern extends beyond personal relationships to encompass humanity — they are the philanthropists, the teachers, the elders whose presence alone transmits a lifetime of accumulated understanding. The 9's gift is the capacity to COMPLETE — to finish what was started, to release what no longer serves, and to prepare the space for what comes next.

THE SHADOW: Loss, grief, and the premature release of what still has value. The 9's shadow is the ENDING that comes too soon — the impulse to let go of everything when only some things have completed their cycle, the grief that refuses to process and therefore refuses to end, the wisdom that has become cynical rather than compassionate. The 9 who does not integrate the 1 (new beginnings) becomes a ghost — always completing, never beginning, perpetually at the end of something without the courage to start again.

THE LIFE CURRICULUM: To learn to release without regret. To complete cycles gracefully. To love without clinging and to grieve without becoming stuck. The 9's journey is from the melancholy of endings to the peace of completion — the recognition that every ending is simultaneously the clearing that makes a new beginning possible.

RULED BY: Mars. The 9 shares Mars's quality of active engagement — not aggressive but IMPASSIONED, driven by genuine care for the collective rather than personal desire. The 9's fire is humanitarian, warrior energy in service of love rather than conquest.`,
  },
];

export function getNumberMeanings(): NumberMeaningsResult {
  return MEANINGS;
}

export function getNumberMeaning(num: number): NumberMeaning | null {
  return MEANINGS.find(m => m.number === num) || null;
}
