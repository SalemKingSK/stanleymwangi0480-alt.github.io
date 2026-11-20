// src/lib/astrology/ba-zi-double-animal.ts
// Ba-Zi Double Animal Detection
// Detects when someone is born in the solar month of their Chinese zodiac year animal.
// A "double animal" configuration amplifies the animal's traits, creating intensified
// karmic resonance. Each of 12 combinations has a verbatim interpretation (200-400 words).
//
// Chinese solar months (approximate, for Ba-Zi earthly branch assignment):
// Rat: Dec 7 - Jan 5    |  Ox: Jan 6 - Feb 3    | Tiger: Feb 4 - Mar 5
// Rabbit: Mar 6 - Apr 4 | Dragon: Apr 5 - May 5  | Snake: May 6 - Jun 5
// Horse: Jun 6 - Jul 6  | Goat: Jul 7 - Aug 7    | Monkey: Aug 8 - Sep 7
// Rooster: Sep 8 - Oct 7| Dog: Oct 8 - Nov 6     | Pig: Nov 7 - Dec 6

import { solarTermYear, toAstronomicalYear } from './chinese-calendar-math';

export type ChineseAnimal =
  | 'Rat' | 'Ox' | 'Tiger' | 'Rabbit' | 'Dragon' | 'Snake'
  | 'Horse' | 'Goat' | 'Monkey' | 'Rooster' | 'Dog' | 'Pig';

export interface SolarMonthRange {
  animal: ChineseAnimal;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

export interface DoubleAnimalResult {
  /** Whether this is a double animal configuration */
  isDouble: boolean;
  /** The Chinese zodiac animal (same for both year and month) */
  animal: ChineseAnimal;
  /** Year of birth */
  year: number;
  /** The animal of the birth year */
  yearAnimal: ChineseAnimal;
  /** The animal of the solar birth month */
  monthAnimal: ChineseAnimal;
  /** Title for this double animal combo */
  title: string;
  /** Full verbatim interpretation of the double animal amplification */
  interpretation: string;
  /** Any additional notes */
  notes?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CHINESE SOLAR MONTHS (Ba-Zi Earthly Branch Approximations)
// ─────────────────────────────────────────────────────────────────────────────

const SOLAR_MONTHS: SolarMonthRange[] = [
  { animal: 'Rat',     startMonth: 12, startDay: 7,  endMonth: 1,  endDay: 5  },
  { animal: 'Ox',      startMonth: 1,  startDay: 6,  endMonth: 2,  endDay: 3  },
  { animal: 'Tiger',   startMonth: 2,  startDay: 4,  endMonth: 3,  endDay: 5  },
  { animal: 'Rabbit',  startMonth: 3,  startDay: 6,  endMonth: 4,  endDay: 4  },
  { animal: 'Dragon',  startMonth: 4,  startDay: 5,  endMonth: 5,  endDay: 5  },
  { animal: 'Snake',   startMonth: 5,  startDay: 6,  endMonth: 6,  endDay: 5  },
  { animal: 'Horse',   startMonth: 6,  startDay: 6,  endMonth: 7,  endDay: 6  },
  { animal: 'Goat',    startMonth: 7,  startDay: 7,  endMonth: 8,  endDay: 7  },
  { animal: 'Monkey',  startMonth: 8,  startDay: 8,  endMonth: 9,  endDay: 7  },
  { animal: 'Rooster', startMonth: 9,  startDay: 8,  endMonth: 10, endDay: 7  },
  { animal: 'Dog',     startMonth: 10, startDay: 8,  endMonth: 11, endDay: 6  },
  { animal: 'Pig',     startMonth: 11, startDay: 7,  endMonth: 12, endDay: 6  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CHINESE ZODIAC YEAR ANIMAL BY YEAR
// ─────────────────────────────────────────────────────────────────────────────

const ZODIAC_ANIMALS: ChineseAnimal[] = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig',
];

const stemBranchIndexYear = toAstronomicalYear;

function getYearAnimal(year: number): ChineseAnimal {
  // The Chinese zodiac cycle: Rat = 1900, 1912, 1924, etc.
  // (year - 4) % 12 maps to 0=Rat, 1=Ox, ... 11=Pig
  const index = ((year - 4) % 12 + 12) % 12;
  return ZODIAC_ANIMALS[index];
}

// ─────────────────────────────────────────────────────────────────────────────
// SOLAR MONTH ANIMAL DETECTION
// ─────────────────────────────────────────────────────────────────────────────

function getMonthAnimal(day: number, month: number): ChineseAnimal | null {
  for (const sm of SOLAR_MONTHS) {
    if (sm.startMonth === 12 && sm.endMonth === 1) {
      // Wraps across year boundary (Rat: Dec 7 - Jan 5)
      if (
        (month === 12 && day >= sm.startDay) ||
        (month === 1 && day <= sm.endDay)
      ) {
        return sm.animal;
      }
    } else if (
      (month === sm.startMonth && day >= sm.startDay) ||
      (month === sm.endMonth && day <= sm.endDay)
    ) {
      return sm.animal;
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// DOUBLE ANIMAL INTERPRETATIONS
// ─────────────────────────────────────────────────────────────────────────────

interface DoubleAnimalInterpretation {
  animal: ChineseAnimal;
  title: string;
  interpretation: string;
}

const DOUBLE_ANIMAL_DATA: DoubleAnimalInterpretation[] = [
  {
    animal: 'Rat',
    title: 'The Double Rat — The Amplified Strategist',
    interpretation: `When the Rat appears as both the year animal and the solar month animal, the clever, resourceful, and perpetually calculating nature of the Rat is amplified to extraordinary intensity. In Ba-Zi terms, this is the Rat squared — the earthly branch of Zi (子) doubled, creating a powerful water resonance that floods the entire chart with Rat consciousness. You are not merely clever; you are constitutively strategic, perceiving every situation through the lens of opportunity, leverage, and optimal outcome. Your mind operates like a chess engine running in the background of every social interaction, and you are often three moves ahead before anyone else has registered that the game has begun.

The light of the Double Rat is a nearly supernatural capacity for survival and resource maximization. You can walk into a room with nothing and walk out with exactly what you need, having identified the hidden resources, unspoken alliances, and exploitable inefficiencies that others overlooked. Your social intelligence is exquisite; you are the ultimate networker, the born diplomat, the person who always knows someone who knows someone. The spiritual meaning of the Double Rat is that you have incarnated with a surplus of the Rat's most essential gift: adaptability. In evolutionary terms, you are here to learn that intelligence without wisdom becomes cunning, and that the most strategic move is sometimes the one that appears least advantageous — the act of generosity with no visible return, the alliance with no obvious leverage, the trust extended without guarantee.

The shadow of this configuration is the danger of living entirely in the calculating mind. When the Rat overwhelms the chart, the heart can become an afterthought — a variable to be managed rather than a compass to be followed. You may find yourself treating relationships as transactions, people as resources, and intimacy as a vulnerability to be minimized. Your charm, so effective at opening doors, can become a mask behind which no one — perhaps not even you — knows who you truly are. The Double Rat at their most shadowed becomes the Manipulator: someone whose strategic brilliance has become an end in itself, who cannot stop calculating long enough to feel, and whose life, despite its external success, feels hollow at the center. The esoteric teaching of the Double Rat is that the water element, in excess, drowns fire — and without fire, there is no warmth, no passion, no genuine connection. The practical life implication is that you must consciously cultivate vulnerability, spontaneity, and the willingness to make "irrational" choices based on love rather than advantage. Your greatest growth edge is the discipline of not optimizing — of leaving some edges rough, some outcomes uncertain, and some doors unopened, so that mystery and intimacy have space to enter.`,
  },
  {
    animal: 'Ox',
    title: 'The Double Ox — The Unshakeable Pillar',
    interpretation: `When the Ox appears as both the year and month animal, the steadfast, methodical, and monumentally patient nature of the Ox is doubled — creating a presence of almost geological solidity. In Ba-Zi, the Ox (Chou, 丑) carries the hidden stems of earth (Ji), water (Gui), and metal (Xin) — and when doubled, this tripartite internal complexity becomes a reservoir of quiet power that few can match and fewer can truly understand. You are the immovable object in a world of unstoppable forces, and more often than not, it is the forces that yield, not you. Your patience is not passivity but accumulation; every moment of apparent stillness is the gathering of pressure that, when released, moves mountains slowly and permanently rather than dramatically and temporarily.

The light of the Double Ox is the capacity to build legacy through sheer persistence. You possess the rare ability to stay committed to a path long after excitement has faded, rewards have thinned, and companions have departed — not because you are stubborn (though you are), but because you understand, at a cellular level, that anything of genuine worth is grown slowly, like a tree, with seasons of invisible root development preceding any visible canopy. Your reliability is legendary; when you give your word, it is not a negotiation but a foundation, and others learn that depending on you is one of the safest investments they can make. Spiritually, the Double Ox represents the soul that has chosen an incarnation of steady refinement — you are here to learn that strength does not shout, that power does not posture, and that the most profound influence is exerted through consistent presence rather than dramatic intervention.

The shadow of this configuration is the dark side of immovability: rigidity, resistance to necessary change, and a kind of inertial stubbornness that can become indistinguishable from imprisonment. Your strength can become a refusal to adapt; your patience can become a tolerance for situations that should have been abandoned long ago; your loyalty can become a chain that binds you to people and structures that drain your life force without reciprocity. The Double Ox at their most shadowed becomes the Petrifact — someone who has hardened into a fixed form so thoroughly that growth is no longer possible, someone whose "principles" are really just habits, and whose "consistency" is really just fear of the unknown dressed in virtuous language. The esoteric teaching is that the earth element, in excess, becomes a tomb rather than a foundation. The practical life implication is that you must consciously schedule seasons of deliberate disruption — practices, travels, or relationships that shake your foundations not to destroy them but to prevent them from hardening into the brittleness that precedes collapse. The Double Ox must learn to bend not because bending is weakness, but because the rigid tree is the one that snaps in the storm.`,
  },
  {
    animal: 'Tiger',
    title: 'The Double Tiger — The Sovereign of Momentum',
    interpretation: `When the Tiger appears as both year and month animal, the bold, magnetic, and fiercely independent nature of the Tiger is doubled — creating a presence that commands attention without requesting it and generates momentum through sheer force of being. In Ba-Zi, the Tiger (Yin, 寅) carries the hidden stems of wood (Jia), fire (Bing), and earth (Wu) — a triple engine of initiation, passion, and manifestation. When doubled, this creates a personality that is constitutionally incapable of passivity; you do not wait for life to happen, you happen to life, and your default response to any obstacle is not retreat or negotiation but the immediate, instinctive lunge forward. You are the spark that becomes the blaze, the impulse that becomes the movement, the risk that becomes the revolution.

The light of the Double Tiger is a charisma that is not performed but radiated. Your presence is naturally centering; people organize themselves around you without being asked, and your confidence — which is not arrogance but a genuine, unexamined assumption of your own agency — inspires others to discover their own. You possess an extraordinary capacity for courageous action; where others hesitate, calculate, or defer, you act, and because you act, you learn, and because you learn, you outpace those who waited for certainty that never arrived. Spiritually, the Double Tiger represents a soul that has chosen an incarnation of leadership through example — you are here not to dominate but to demonstrate, through your own unfettered vitality, what a life lived without fear can look like. Your gift is initiation; you start things that others finish, generate visions that others build, and catalyze transformations that others sustain.

The shadow of the Double Tiger is the cost of unchecked momentum. Your relentless forward motion can become a flight from stillness, depth, and the kind of patient integration that genuine wisdom requires. You may consume experiences the way a fire consumes fuel — rapidly, brilliantly, and without remainder — never stopping long enough to digest what you have ingested. Your independence can become an inability to receive; your courage can become recklessness; your leadership can become a form of control that masquerades as inspiration. The Double Tiger at their most shadowed becomes the Unstoppable Force — someone whose momentum has become a prison, who cannot stop even when stopping is the only sane option, and who leaves a trail of exhausted collaborators and half-finished revolutions in their wake. The esoteric teaching is that the Tiger energy, in excess, burns not just obstacles but the Tiger itself. The practical life implication is that you must consciously cultivate the art of pausing — of sitting in the aftermath, of listening without preparing to respond, of allowing the silence to teach you what the action never can. The Double Tiger's deepest growth edge is the discovery that the most courageous act is sometimes the act of stillness.`,
  },
  {
    animal: 'Rabbit',
    title: 'The Double Rabbit — The Refined Observer',
    interpretation: `When the Rabbit appears as both year and month animal, the elegant, diplomatic, and exquisitely sensitive nature of the Rabbit is doubled — creating a personality of extraordinary refinement, perception, and social grace. In Ba-Zi, the Rabbit (Mao, 卯) is pure Yin Wood (Yi) — flexible, adaptive, growing toward the light with a quiet persistence that belies the strength of its roots. When doubled, this creates an individual whose antennae are perpetually extended, picking up on the subtlest emotional frequencies, aesthetic nuances, and social dynamics that others miss entirely. You do not merely notice things; you register them in your nervous system, and your responses are calibrated with a precision that can seem almost telepathic to those with coarser perceptual instruments.

The light of the Double Rabbit is the capacity to create beauty and harmony through presence alone. You possess an innate aesthetic intelligence that expresses itself not necessarily through formal art but through the quality of your environment, the grace of your interactions, and the care with which you treat every person and object in your sphere. Your diplomacy is not manipulation but genuine attunement — you can find the path through a social minefield that preserves everyone's dignity because you can actually feel, in your own body, what each person in the room is experiencing. Spiritually, the Double Rabbit represents a soul that has chosen an incarnation of peacemaking — you are here to demonstrate that gentleness is not weakness, that refinement is not superficiality, and that the most profound strength is the strength that does not need to advertise itself. Your gift is the cultivation of environments — physical, social, and emotional — in which others can flourish.

The shadow of the Double Rabbit is the cost of excessive attunement. Your sensitivity, so valuable in its refined perception, can become a liability when you cannot distinguish between your own needs and the emotional demands of your environment. You may find yourself perpetually accommodating, perpetually pleasant, perpetually smoothing over tensions that actually need to erupt, because conflict registers in your nervous system as physical pain. Your elegance can become a cage; your diplomacy can become a refusal to take the unpopular stand; your refinement can become a form of emotional bypass that keeps everything pleasant while real issues fester beneath the surface. The Double Rabbit at their most shadowed becomes the Vanishing Act — someone whose identity is so thoroughly merged with the expectations of others that no authentic self remains, someone who has been so busy being pleasing that they have forgotten what they themselves actually want, think, or feel. The esoteric teaching is that the Rabbit's flexibility, in excess, becomes formlessness. The practical life implication is that you must consciously cultivate the capacity to disappoint — to say no, to take up space, to be occasionally disagreeable, not for the sake of conflict but for the sake of your own soul's integrity. The Double Rabbit must learn that the most beautiful gardens are those with boundaries.`,
  },
  {
    animal: 'Dragon',
    title: 'The Double Dragon — The Architect of Destiny',
    interpretation: `When the Dragon appears as both year and month animal, the majestic, visionary, and cosmically self-assured nature of the Dragon is doubled — creating a presence of such magnitude that it seems almost mythological. In Ba-Zi, the Dragon (Chen, 辰) carries the hidden stems of earth (Wu), wood (Yi), and water (Gui) — a reservoir of creative potential that, when doubled, becomes a font of seemingly inexhaustible energy and vision. You do not merely have ambitions; you have a destiny, and you carry yourself with the unselfconscious authority of someone who has always known that their life will be significant. The Double Dragon walks into a room and the room reorganizes itself — not through any overt demand, but through the sheer gravitational pull of a presence that cannot be ignored.

The light of the Double Dragon is the capacity to manifest visions at a scale that others consider unrealistic. Your confidence is not bravado but a genuine, pre-reflective knowing that you are here to do something that matters. You possess an extraordinary combination of creative imagination and executive capacity — you can dream the impossible and then actually organize the resources, people, and systems to bring it into being. Your generosity is legendary; when the Dragon thrives, everyone in its orbit thrives, because the Dragon's abundance is naturally expansive rather than hoarding. Spiritually, the Double Dragon represents a soul that has chosen an incarnation of creative sovereignty — you are here to demonstrate that the universe is not a closed system of cause and effect but a living field that responds to vision, will, and alignment with purpose. Your gift is the capacity to call forth the latent potential in people and situations, to see the cathedral in the quarry and the masterpiece in the rough sketch.

The shadow of the Double Dragon is the subtle inflation of self-importance into grandiosity. Your sense of destiny can become a sense of entitlement; your confidence can harden into arrogance; your vision can become a demand that reality conform to your expectations, and a sense of betrayal when it does not. The Double Dragon at their most shadowed becomes the Tyrant of Destiny — someone whose magnificence has curdled into megalomania, whose "mission" justifies any collateral damage, and whose need for recognition has become an insatiable hunger that no amount of success can satisfy. You may also struggle with a peculiar kind of loneliness — the isolation of the peak, the solitude of being surrounded by admirers but bereft of equals. The esoteric teaching is that the Dragon, in excess, burns its own tail. The practical life implication is that you must consciously cultivate humility — not the performative modesty of the publicly self-deprecating, but the genuine, private acknowledgment that even the Dragon is a servant of forces larger than itself. The Double Dragon's deepest growth edge is the discovery that the truest power is power shared, and that a legacy built on the elevation of others outlasts any monument built to the self.`,
  },
  {
    animal: 'Snake',
    title: 'The Double Snake — The Deep Oracle',
    interpretation: `When the Snake appears as both year and month animal, the intuitive, mysterious, and profoundly perceptive nature of the Snake is doubled — creating an individual whose knowing operates at a depth that others cannot fathom and whose presence carries an almost hypnotic quality. In Ba-Zi, the Snake (Si, 巳) carries the hidden stems of fire (Bing), earth (Wu), and metal (Geng) — a tripartite alchemy of transformation, groundedness, and incisive clarity. When doubled, this creates a personality that processes reality primarily through intuitive channels; you understand things before you can explain how you understand them, and your judgments — which you often cannot articulate the basis for — prove correct with an unnerving frequency. You are the person others consult when logic has failed and only a deeper, more mysterious form of intelligence can illuminate the path.

The light of the Double Snake is the gift of profound insight. Your perception operates not through linear analysis but through a kind of holistic pattern recognition that takes in the entire gestalt of a situation — the unspoken tensions, the hidden motivations, the trajectories that extend into the future — and synthesizes them into a knowing that arrives as certainty rather than conclusion. You possess an extraordinary capacity for strategic patience; where others rush to action, you wait, observe, and allow the right moment to reveal itself. Your wisdom is not learned from books (though you may read voraciously) but distilled from the direct experience of life, processed through a contemplative depth that turns raw experience into refined understanding. Spiritually, the Double Snake represents a soul that has chosen an incarnation of deep seeing — you are here to demonstrate that the most profound intelligence is not analytical but intuitive, and that the greatest power is not the power to act but the power to know when to act.

The shadow of the Double Snake is the dark side of depth: suspicion, secrecy, and the gradual withdrawal from the surface of life into a labyrinth from which no one, including yourself, can find the exit. Your intuition, so valuable in its accuracy, can curdle into paranoia when you cannot distinguish between genuine insight and projected fear. Your patience can become passivity; your strategic reserve can become emotional unavailability; your depth can become a refusal to engage with the ordinary, the mundane, and the simply joyful dimensions of existence. The Double Snake at their most shadowed becomes the Hermetic Prisoner — someone who has retreated so far into their own interiority that they have lost the capacity for spontaneity, vulnerability, and the kind of uncalculated love that requires no strategic advantage. The esoteric teaching is that the Snake's wisdom, hoarded rather than shared, becomes poison. The practical life implication is that you must consciously cultivate transparency, lightness, and the willingness to be occasionally foolish — to share your process with others rather than presenting only finished conclusions, to allow yourself to be seen in your becoming rather than only in your perfected state. The Double Snake's deepest growth edge is the discovery that the most profound oracle is the one that speaks, not the one that hoards its visions in silence.`,
  },
  {
    animal: 'Horse',
    title: 'The Double Horse — The Untamed Heart',
    interpretation: `When the Horse appears as both year and month animal, the spirited, freedom-loving, and passionately engaged nature of the Horse is doubled — creating a personality of such vitality and charisma that it can feel like being in the presence of a force of nature. In Ba-Zi, the Horse (Wu, 午) carries the hidden stems of fire (Ding) and earth (Ji) — a combination of radiant warmth and grounded presence that, when doubled, creates an individual who lights up every room they enter and whose enthusiasm is genuinely infectious. You are not merely energetic; you are constitutionally alive in a way that reminds others of what it felt like to be fully present before the weight of adult responsibility taught them to dim their own brightness. Freedom is not a preference for you but a biological necessity — any situation that feels confining triggers a flight response that is as involuntary as breathing.

The light of the Double Horse is the gift of inspired action. You possess the rare ability to translate impulse into motion without the paralyzing interval of doubt that slows most people down. Your courage is not the calculated risk-taking of the strategist but the instinctive bravery of the creature that simply cannot conceive of not being free. You are the spark that ignites movements, the energy that galvanizes teams, the presence that transforms a dull gathering into an unforgettable event. Your passion is not compartmentalized but totalizing — when you love, you love completely; when you work, you work with your whole being; when you play, you play as though the universe were created for this single moment of joy. Spiritually, the Double Horse represents a soul that has chosen an incarnation of embodied aliveness — you are here to demonstrate that the body and its passions are not obstacles to spiritual development but vehicles for it, and that the most profound worship is the full-hearted embrace of existence.

The shadow of the Double Horse is the cost of unbridled momentum. Your need for freedom can become a flight from commitment; your passion can become impulsivity; your vitality can become an exhausting volatility that leaves both you and those around you perpetually destabilized. You may find yourself starting relationships, projects, and adventures with breathtaking intensity, only to lose interest the moment the initial fire subsides — mistaking the natural maturation of passion for its death. The Double Horse at their most shadowed becomes the Eternal Fugitive — someone whose "freedom" is really an inability to stay, whose "spontaneity" is really an avoidance of structure, and whose life is a series of spectacular beginnings with almost no completions. The esoteric teaching is that the Horse's fire, without containment, burns everything including its own source. The practical life implication is that you must consciously cultivate the discipline of staying — of remaining present when the excitement fades, of doing the unglamorous maintenance work that keeps love and creativity alive, and of learning that genuine freedom is not the absence of commitment but the capacity to choose your commitments consciously rather than being ruled by the impulse to flee.`,
  },
  {
    animal: 'Goat',
    title: 'The Double Goat — The Creative Soul',
    interpretation: `When the Goat appears as both year and month animal, the gentle, artistic, and deeply feeling nature of the Goat is doubled — creating a personality of such sensitivity and creative depth that it seems to operate on a different frequency than the more pragmatic souls surrounding it. In Ba-Zi, the Goat (Wei, 未) carries the hidden stems of earth (Ji), fire (Ding), and wood (Yi) — a combination of grounding, warmth, and organic creativity that, when doubled, produces an individual whose inner world is a lush, complex, and perpetually blossoming garden. You do not merely have feelings; you are constituted by feeling, and your emotional life is not a side effect of experience but the primary medium through which you encounter and understand reality. Your creativity is not a hobby but a necessity — without an outlet for expression, you wither the way a plant withers without light.

The light of the Double Goat is the capacity to create beauty that heals. Your sensitivity gives you access to emotional registers that others cannot reach, and your art — whether expressed through visual media, music, writing, or simply the aesthetic quality of your daily life — carries a healing vibration that soothes, restores, and reminds others of the beauty they have forgotten. You possess an extraordinary capacity for empathy that is not abstract but practical; you can actually feel what another person needs and respond with exactly the right gesture, word, or presence. Your gentleness is not weakness but a deliberate cultivation of the tender, the vulnerable, and the kind in a world that often rewards the opposite. Spiritually, the Double Goat represents a soul that has chosen an incarnation of creative healing — you are here to demonstrate that the purpose of art is not decoration but transformation, and that the most revolutionary act is the act of making something beautiful in a context of ugliness.

The shadow of the Double Goat is the vulnerability that comes with such profound sensitivity. Your emotional porousness, without strong ego boundaries, can become a kind of passive victimhood — you may feel buffeted by forces you cannot control, dependent on the emotional weather created by others, and unable to access your own agency when the environment turns hostile. Your need for beauty and harmony can become a need for constant reassurance; your creativity can become a refuge from the demands of practical life rather than a contribution to it. The Double Goat at their most shadowed becomes the Wounded Artist — someone whose sensitivity has become a permanent state of injury, whose creativity is fueled by pain but never transcends it, and whose dependence on others for emotional regulation has become a form of manipulation that exhausts everyone in their orbit. The esoteric teaching is that the Goat's gentleness, without the cultivation of inner steel, becomes helplessness. The practical life implication is that you must consciously cultivate the warrior within — not to suppress your sensitivity but to protect it, not to abandon your art but to give it a container strong enough to hold its power. The Double Goat must learn that the most beautiful flower is the one that has learned to grow in difficult soil.`,
  },
  {
    animal: 'Monkey',
    title: 'The Double Monkey — The Agile Genius',
    interpretation: `When the Monkey appears as both year and month animal, the clever, inventive, and endlessly adaptable nature of the Monkey is doubled — creating an intellect of such speed, flexibility, and creative resourcefulness that it can feel like being in the presence of a perpetual motion machine. In Ba-Zi, the Monkey (Shen, 申) carries the hidden stems of metal (Geng), water (Ren), and earth (Wu) — a combination of incisive clarity, fluid intelligence, and pragmatic grounding that, when doubled, produces an individual whose mind is a ceaseless generator of solutions, connections, and innovations. You do not merely solve problems; you dissolve them through lateral thinking that reframes the question so completely that the original problem ceases to exist. Your wit is not decorative but structural — humor is your primary mode of pattern recognition, and you perceive absurdity in rigid systems the way a musician perceives dissonance.

The light of the Double Monkey is the gift of ingenious adaptation. You possess the rare ability to thrive in environments that would paralyze less flexible minds — you can enter a foreign culture, a failing organization, or a chaotic crisis and, within a remarkably short time, have mapped the hidden logic of the system and identified the leverage points for transformation. Your creativity is not the introspective, emotional creativity of the Goat or the visionary sweep of the Dragon but the practical, hands-on ingenuity of the inventor — you see not just what is but what could be made from what is, and you possess the skill to actually make it. Spiritually, the Double Monkey represents a soul that has chosen an incarnation of playful mastery — you are here to demonstrate that the most profound intelligence is not solemn but joyful, and that the capacity to learn, unlearn, and relearn is the supreme adaptive advantage.

The shadow of the Double Monkey is the restlessness of a mind that cannot commit. Your intellectual agility, so dazzling in its speed, can become a kind of cognitive promiscuity — you sample ideas, skills, and relationships with voracious enthusiasm but abandon them the moment they require the patient, repetitive work of genuine depth. Your humor can become a defense against sincerity; your adaptability can become a lack of core identity; your cleverness can become a substitute for wisdom. The Double Monkey at their most shadowed becomes the Trickster — someone whose brilliance serves only to manipulate, whose charm is a tool of deception, and whose life, despite its entertaining surface, lacks any genuine center of gravity. The esoteric teaching is that the Monkey's cleverness, without the cultivation of heart, becomes mere cunning. The practical life implication is that you must consciously cultivate depth over breadth, commitment over novelty, and the discipline of staying with a single path long enough to discover what lies beyond the initial plateau. The Double Monkey's deepest growth edge is the discovery that the most ingenious trick of all is the one you play on your own restlessness.`,
  },
  {
    animal: 'Rooster',
    title: 'The Double Rooster — The Radiant Arbiter',
    interpretation: `When the Rooster appears as both year and month animal, the proud, discerning, and impeccably principled nature of the Rooster is doubled — creating a personality of such clarity, precision, and moral seriousness that it can feel like standing before a tribunal of one. In Ba-Zi, the Rooster (You, 酉) is pure Yin Metal (Xin) — the element of refinement, discrimination, and the capacity to separate the pure from the impure. When doubled, this creates an individual whose perception is calibrated like a precision instrument, capable of detecting falsehood, inconsistency, and aesthetic failure at distances that leave others bewildered. You do not merely have opinions; you have standards, and those standards are not arbitrary preferences but the expression of a deeply internalized sense of how things ought to be.

The light of the Double Rooster is the capacity to elevate everything you touch through the application of discernment and care. You possess an extraordinary eye for detail, a refined aesthetic sensibility, and a genuine commitment to excellence that makes you invaluable in any context where quality matters — which is to say, every context worth participating in. Your honesty is not brutal but surgical; you can identify what is wrong without condemning the person responsible, and your feedback, though exacting, is delivered with the genuine intention of improvement rather than destruction. Spiritually, the Double Rooster represents a soul that has chosen an incarnation of refinement — you are here to demonstrate that discrimination is not judgment but love in its most precise form, and that the willingness to say "this is not yet good enough" is the engine of all genuine progress.

The shadow of the Double Rooster is the dark side of discernment: harshness, pride, and the gradual replacement of compassion with critique. Your standards can become a cudgel that you wield against yourself and others with equal ferocity, leaving a trail of wounded souls who could never quite measure up to expectations that were, in truth, designed to be unmet. Your pride can become impenetrable; your insistence on being right can become a refusal to learn; your moral clarity can become a form of self-righteousness that alienates everyone whose complexity does not fit your categories. The Double Rooster at their most shadowed becomes the Inquisitor — someone whose "integrity" is really a defense against vulnerability, whose "standards" are really a way of keeping others at a safe distance, and whose loneliness is the inevitable consequence of having judged everyone, including themselves, as perpetually wanting. The esoteric teaching is that the Rooster's metal, unsoftened by water, becomes a blade that cuts everyone including its wielder. The practical life implication is that you must consciously cultivate mercy — not as an abandonment of standards but as an acknowledgment that the most important standard is love, and that a flawless work of art created at the cost of every human connection is not a triumph but a tragedy.`,
  },
  {
    animal: 'Dog',
    title: 'The Double Dog — The Guardian of Righteousness',
    interpretation: `When the Dog appears as both year and month animal, the loyal, protective, and morally serious nature of the Dog is doubled — creating a personality of such integrity and commitment that it becomes a living anchor of righteousness in a world of shifting values. In Ba-Zi, the Dog (Xu, 戌) carries the hidden stems of earth (Wu), metal (Xin), and fire (Ding) — a combination of grounded stability, incisive discernment, and the warmth of genuine care. When doubled, this creates an individual whose moral compass is not a set of abstract principles but a visceral, embodied orientation toward justice that they feel in their bones before they can articulate it in words. You do not merely believe in fairness; you are fair, in your instincts, your reactions, and your most unguarded moments, in a way that cannot be faked or learned.

The light of the Double Dog is the gift of unwavering loyalty and protective love. Your commitment to those under your care — whether family, friends, colleagues, or causes — is absolute and does not waver with circumstance, convenience, or the shifting winds of public opinion. You possess an extraordinary capacity for service that is not servile but noble; you understand that genuine nobility expresses itself not in being served but in serving, and that the highest form of honor is the honor of being someone others can count on. Your courage is not the flashy courage of the warrior seeking glory but the quiet, consistent courage of the guardian who stands watch through the long night, asking for nothing but the safety of those they protect. Spiritually, the Double Dog represents a soul that has chosen an incarnation of faithful stewardship — you are here to demonstrate that the most profound spiritual practice is the practice of showing up, day after day, for the people and principles you have pledged yourself to.

The shadow of the Double Dog is the dark side of loyalty: anxiety, self-righteousness, and the kind of paranoid vigilance that sees threat everywhere and trust nowhere. Your protective instinct can become a suffocating control; your commitment to justice can become a bitter, relentless crusade against perceived wrongs that leaves you exhausted and isolated; your loyalty can become a refusal to acknowledge when the person or cause you have pledged yourself to has become unworthy of that pledge. The Double Dog at their most shadowed becomes the Bitter Sentinel — someone whose righteousness has curdled into resentment, whose vigilance has become the inability to rest, and whose fierce love has been twisted by disappointment into a permanent state of grievance against a world that failed to live up to their exacting standards. The esoteric teaching is that the Dog's guardianship, without the cultivation of trust, becomes a prison. The practical life implication is that you must consciously cultivate faith — not necessarily religious faith, but the faith that not everything depends on you, that the universe is not entirely corrupt, and that allowing yourself to relax does not mean abandoning your values. The Double Dog's deepest growth edge is learning that the truest loyalty is the loyalty that liberates rather than binds.`,
  },
  {
    animal: 'Pig',
    title: 'The Double Pig — The Abundant Heart',
    interpretation: `When the Pig appears as both year and month animal, the generous, sincere, and sensually alive nature of the Pig is doubled — creating a personality of such warmth, openness, and genuine goodwill that being in their presence feels like being welcomed home. In Ba-Zi, the Pig (Hai, 亥) carries the hidden stems of water (Ren) and wood (Jia) — a combination of emotional depth and organic growth that, when doubled, produces an individual whose heart is not merely open but oceanic, capable of holding vast amounts of love without depletion. You do not merely like people; you are fundamentally oriented toward the goodness in others, and your default assumption — which experience often confirms — is that people are worthy of trust, kindness, and the benefit of the doubt. Your generosity is not strategic or performative but the natural overflow of an inner abundance that seems to replenish itself through the very act of giving.

The light of the Double Pig is the gift of creating abundance through presence. You possess an extraordinary capacity for hospitality — not merely in the domestic sense (though your home is likely a sanctuary of comfort and welcome) but in the existential sense of creating space for others to be fully themselves, without judgment or demand. Your sensuality is healthy and integrated; you understand that the pleasures of the body, the table, and the senses are not obstacles to spiritual development but expressions of it, and you model a relationship with material abundance that is joyful without being grasping. Spiritually, the Double Pig represents a soul that has chosen an incarnation of embodied generosity — you are here to demonstrate that the universe is fundamentally abundant, that giving and receiving are the same motion seen from different angles, and that the most radical spiritual practice is the practice of trust in the fundamental benevolence of existence.

The shadow of the Double Pig is the vulnerability of excessive openness. Your trust can become naiveté; your generosity can attract those who take without giving; your desire to see the good in everyone can become a refusal to acknowledge when someone is genuinely harmful. You may find yourself repeatedly exploited, not because you lack intelligence, but because your instinct toward connection overrides your capacity for self-protective discernment. The Double Pig at their most shadowed becomes the Exploited Saint — someone whose goodness has become a magnet for predation, whose abundance has been drained by those who recognized the absence of boundaries, and whose sweetness has curdled, in moments of exhausted clarity, into a bitterness that surprises even themselves. The esoteric teaching is that the Pig's openness, without the cultivation of discernment, becomes self-abandonment. The practical life implication is that you must consciously cultivate the wisdom of the closed door — learning that not everyone deserves access to your inner sanctuary, that "no" is a complete sentence, and that the most generous act is sometimes the act of refusing to enable someone else's dysfunction. The Double Pig's deepest growth edge is the discovery that true abundance includes the abundance of healthy boundaries.`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detects whether someone was born in the solar month of their Chinese zodiac
 * year animal — a "double animal" configuration that amplifies the animal's
 * traits. Returns the full verbatim interpretation if a double animal is found.
 *
 * Also detects whether the birth falls within the year-month boundary where
 * the Chinese solar year and month share the same earthly branch.
 *
 * @param day - Birth day (1-31)
 * @param month - Birth month (1-12)
 * @param year - Birth year (e.g. 1990)
 * @returns DoubleAnimalResult with full verbatim interpretation if double animal found
 */
export function getDoubleAnimal(
  day: number,
  month: number,
  year: number
): DoubleAnimalResult {
  // Ba-Zi year pillar changes at Lichun (≈4 Feb), the same boundary as the
  // solar months below. With the Gregorian year, every Ox-month birth
  // (6 Jan – 3 Feb) was paired with the wrong year animal.
  const yearAnimal = getYearAnimal(stemBranchIndexYear(solarTermYear(day, month, year)));
  const monthAnimal = getMonthAnimal(day, month);
  const isDouble = monthAnimal !== null && monthAnimal === yearAnimal;

  if (!isDouble) {
    return {
      isDouble: false,
      animal: yearAnimal,
      year,
      yearAnimal,
      monthAnimal: monthAnimal || 'Rat', // fallback
      title: 'No Double Animal',
      interpretation: `You were born in a ${yearAnimal} year but not in the ${yearAnimal} solar month. Your Chinese zodiac year animal (${yearAnimal}) and month animal (${monthAnimal || 'unknown'}) are different, so you do not carry the Double Animal configuration. This is the case for most people — the Double Animal is a relatively rare configuration that intensifies and amplifies the animal's inherent traits. Without this doubling, your ${yearAnimal} nature expresses in its standard modality, shaped and modified by other elements in your Ba-Zi chart.`,
    };
  }

  const entry = DOUBLE_ANIMAL_DATA.find(d => d.animal === yearAnimal);

  if (!entry) {
    return {
      isDouble: true,
      animal: yearAnimal,
      year,
      yearAnimal,
      monthAnimal,
      title: `Double ${yearAnimal}`,
      interpretation: `You carry the rare Double ${yearAnimal} configuration — born in a ${yearAnimal} year during the ${yearAnimal} solar month. This doubling amplifies the ${yearAnimal}'s natural traits significantly.`,
    };
  }

  return {
    isDouble: true,
    animal: yearAnimal,
    year,
    yearAnimal,
    monthAnimal,
    title: `The Double ${yearAnimal} — ${entry.title.split(' — ')[1] || entry.title}`,
    interpretation: entry.interpretation,
    notes: `The Double ${yearAnimal} is a powerful configuration in Ba-Zi. When the year pillar and month pillar share the same earthly branch (${yearAnimal}), the qualities of that animal are amplified and intensified. This creates a life path deeply colored by the animal's archetypal energy — both its gifts and its challenges are magnified.`,
  };
}
