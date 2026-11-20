/**
 * MYSTIQUE COMPASS — Challenge Numbers
 *
 * Four Challenge Numbers derived from the birth date, representing
 * specific obstacles and growth opportunities in each life phase.
 * Unlike Pinnacles (which show the path), Challenges show what must
 * be overcome along the way.
 *
 * ALL TEXT IS VERBATIM. DO NOT SUMMARIZE OR TRUNCATE.
 */

export interface ChallengeData {
  stage: number;
  label: string;
  ages: string;
  number: number;
  title: string;
  interpretation: string;
}

export interface ChallengeResult {
  lifePath: number;
  challenges: ChallengeData[];
}

function reduceNum(n: number): number {
  let val = Math.abs(n);
  while (val > 9) val = String(val).split('').reduce((a, d) => a + +d, 0);
  return val;
}

function reduceDay(d: number): number { return reduceNum(d); }
function reduceMonth(m: number): number { return reduceNum(m); }
function reduceYear(y: number): number { return reduceNum(String(y).split('').reduce((a, d) => a + +d, 0)); }

const CHALLENGE_MEANINGS: Record<number, { title: string; interpretation: string }> = {
  0: {
    title: 'The Challenge of Choice',
    interpretation: `CHALLENGE NUMBER 0 — The Challenge of Choice

The Challenge Number 0 is unique among the challenges — it represents not a specific obstacle but the challenge of having NO predetermined obstacle. This is the challenge of pure free will. The individual with a 0 challenge in any life phase is being asked to CHOOSE their difficulty rather than having one assigned by fate.

THE NATURE OF THE 0 CHALLENGE: The number 0 represents the void, the unmanifest, infinite potential. As a challenge, it asks: "What will you make of this emptiness? Will you fill it with purpose or with distraction? Will you use this freedom to build or to drift?" The 0 challenge period is not characterized by a single recurring obstacle but by the recurring question of what the individual chooses to make of their circumstances. This can be more difficult than a defined challenge — a clear enemy is easier to fight than an undefined void.

THE OPPORTUNITY: The 0 challenge offers the maximum possible freedom for growth. The individual can choose any direction, develop any capacity, pursue any goal. The absence of a predetermined obstacle means the absence of predetermined limitations. This is the challenge of the artist facing a blank canvas, the writer facing an empty page — terrifying in its openness, exhilarating in its possibility.

THE PRESCRIPTION: During a 0 challenge period, impose STRUCTURE on yourself voluntarily. Choose a specific area of growth and pursue it as though it were assigned — because in a sense, by choosing it, you HAVE assigned it. The 0 challenge is passed not by waiting for direction but by creating it.`,
  },
  1: {
    title: 'The Challenge of Self-Assertion',
    interpretation: `CHALLENGE NUMBER 1 — The Challenge of Self-Assertion

The Challenge Number 1 requires the individual to develop independence, initiative, and the capacity to stand alone. During this challenge period, circumstances will consistently push the individual toward self-reliance — situations where they must act without support, decide without consensus, and take responsibility for outcomes that cannot be shared or delegated.

THE NATURE OF THE 1 CHALLENGE: This challenge often manifests as a pattern of being dominated by stronger personalities, of having one's opinions overridden, of feeling invisible or ineffectual. The universe is not punishing the individual; it is creating the CONDITIONS in which self-assertion becomes learnable. Each time the individual allows themselves to be dominated, the discomfort increases until assertiveness becomes less painful than submission. The challenge is completed when the individual can lead without aggression, stand alone without isolation, and assert their will without diminishing others.

THE SHADOW RESPONSE: The individual may overcompensate, becoming domineering, aggressive, or dismissive of others' input. This is not mastery of the 1 challenge but capitulation to its opposite extreme — trading submission for domination rather than finding the balanced middle of confident self-expression.

THE PRESCRIPTION: Practice assertiveness in low-stakes situations first. State preferences clearly. Make decisions independently in areas where the consequences of error are manageable. Build the muscle of self-trust through repeated, safe exercise. The 1 challenge is not about becoming a tyrant; it is about becoming someone who does not NEED a tyrant to give them direction.`,
  },
  2: {
    title: 'The Challenge of Sensitivity',
    interpretation: `CHALLENGE NUMBER 2 — The Challenge of Sensitivity

The Challenge Number 2 requires the individual to develop patience, diplomacy, and the capacity for genuine partnership. During this challenge period, circumstances will consistently push the individual toward collaboration — situations where going alone is impossible, where others' feelings must be considered, where the ego's desire for recognition must yield to the relationship's need for harmony.

THE NATURE OF THE 2 CHALLENGE: This challenge often manifests as hypersensitivity — taking things personally, reading criticism into neutral comments, feeling wounded by the ordinary friction of human interaction. Alternatively, it may manifest as the OPPOSITE — emotional numbness, an inability to connect, a preference for solitude that masks a fear of intimacy. In either case, the challenge is the same: to develop a calibrated sensitivity that allows for deep connection without being incapacitated by it.

THE SHADOW RESPONSE: The individual may withdraw entirely, avoiding all situations that demand emotional intelligence — or they may become emotionally manipulative, using their sensitivity as a weapon to control others' behavior ("You made me feel this way, so you must change").

THE PRESCRIPTION: Develop emotional granularity — the capacity to distinguish between different feelings and to articulate them precisely. "I feel bad" is not useful information. "I feel disappointed because I expected X and received Y" is. The 2 challenge is about transforming raw emotional reactivity into refined emotional intelligence — feeling deeply but responding deliberately.`,
  },
  3: {
    title: 'The Challenge of Expression',
    interpretation: `CHALLENGE NUMBER 3 — The Challenge of Expression

The Challenge Number 3 requires the individual to develop authentic self-expression — the capacity to communicate what they genuinely think, feel, and create, without the filtering that comes from fear of judgment. During this challenge period, circumstances will consistently push the individual toward expression — situations where silence is costly, where creativity is demanded, where the words not spoken become heavier than the words that could be.

THE NATURE OF THE 3 CHALLENGE: This challenge often manifests as creative inhibition — a sense that one has something to express but cannot find the form, the courage, or the audience. It may appear as a fear of public speaking, a block in artistic production, or a pattern of being talked over in social situations. The underlying issue is not talent (the 3 challenge-holder is often highly talented) but PERMISSION — the individual has not granted themselves the right to take up space with their expression.

THE SHADOW RESPONSE: The individual may overcompensate by becoming performatively expressive — talking too much, creating for attention rather than authenticity, filling silence with noise to avoid the vulnerability of genuine communication.

THE PRESCRIPTION: Begin with private expression — journals, art created for no audience, words spoken to empty rooms. Build the muscle of expression in conditions of complete safety before exercising it in public. The 3 challenge is not about becoming a performer; it is about removing the internal censor that prevents authentic expression from reaching the world.`,
  },
  4: {
    title: 'The Challenge of Discipline',
    interpretation: `CHALLENGE NUMBER 4 — The Challenge of Discipline

The Challenge Number 4 requires the individual to develop structure, discipline, and the capacity for sustained, methodical effort. During this challenge period, circumstances will consistently push the individual toward organization — situations where spontaneity fails, where shortcuts backfire, where the absence of systems and routines creates chaos that only discipline can resolve.

THE NATURE OF THE 4 CHALLENGE: This challenge often manifests as chronic disorganization — missed deadlines, chaotic environments, projects started with enthusiasm and abandoned when the initial excitement fades. The individual may feel allergic to routine, experiencing structure as oppression and discipline as death of the spirit. This is not laziness; it is a constitutional resistance to constraint that, while spiritually valid in some contexts, becomes self-defeating when it prevents the completion of anything meaningful.

THE SHADOW RESPONSE: The individual may swing to the opposite extreme — becoming rigidly organized, obsessively scheduled, intolerant of spontaneity in themselves and others. This is not mastery of the 4 challenge but flight into its opposite, trading chaos for prison.

THE PRESCRIPTION: Start with ONE structure. Not a complete life overhaul, but a single, small, non-negotiable routine — maintained for 30 days regardless of mood or circumstance. The 4 challenge is not about becoming a robot; it is about discovering that discipline, properly understood, is not the enemy of freedom but its foundation. The musician who has practiced scales can improvise with a freedom the untrained musician can only envy.`,
  },
  5: {
    title: 'The Challenge of Freedom',
    interpretation: `CHALLENGE NUMBER 5 — The Challenge of Freedom

The Challenge Number 5 requires the individual to develop adaptability, courage in the face of change, and the capacity to embrace uncertainty without being destroyed by it. During this challenge period, circumstances will consistently push the individual toward change — situations where stability is disrupted, where plans are overturned, where the familiar is stripped away to reveal what lies beneath.

THE NATURE OF THE 5 CHALLENGE: This challenge often manifests as a terror of change — clinging to jobs, relationships, and identities long past their expiration dates because anything new feels threatening. Alternatively, it may manifest as excessive change-seeking — a pattern of abandoning situations the moment they become stable, mistaking perpetual novelty for genuine freedom. In either case, the core issue is the same: an unresolved relationship with uncertainty.

THE SHADOW RESPONSE: The individual may become addicted to chaos, creating crises in otherwise stable situations because crisis is the only state they know how to navigate. Or they may ossify entirely, refusing even beneficial change because the devil they know is preferable to the angel they don't.

THE PRESCRIPTION: Practice deliberate, small changes. Alter your route to work. Try a food you have never eaten. Have a conversation about a topic you usually avoid. Build tolerance for novelty in the minor registers so that major changes do not overwhelm. The 5 challenge is not about embracing chaos but about developing the flexibility to bend without breaking.`,
  },
  6: {
    title: 'The Challenge of Service',
    interpretation: `CHALLENGE NUMBER 6 — The Challenge of Service

The Challenge Number 6 requires the individual to develop the capacity for genuine care — service that is given freely rather than extracted by guilt or offered in exchange for love. During this challenge period, circumstances will consistently push the individual toward responsibility for others — situations where selfishness is costly, where neglect causes visible harm, where the refusal to serve isolates the individual from the very connection they crave.

THE NATURE OF THE 6 CHALLENGE: This challenge often manifests as an aversion to responsibility — a pattern of avoiding commitments, fleeing relationships when they become demanding, and resenting the needs of others as impositions on personal freedom. Alternatively, it may manifest as over-responsibility — taking on burdens that are not one's own, confusing martyrdom with service, and giving until depleted as an unconscious strategy for avoiding one's own unmet needs.

THE SHADOW RESPONSE: The individual may become the perpetual victim — always giving, never receiving, accumulating resentment that poisons the very relationships they are ostensibly serving. Or they may become the perpetual child — refusing to grow into the responsibilities that adult life demands.

THE PRESCRIPTION: Distinguish between sacred service and self-erasure. Sacred service gives from overflow; self-erasure gives from depletion. Sacred service has boundaries; self-erasure has none. The 6 challenge is not about becoming a servant but about discovering that genuine care for others is not opposed to care for self — it is, in fact, impossible without it.`,
  },
  7: {
    title: 'The Challenge of Inner Wisdom',
    interpretation: `CHALLENGE NUMBER 7 — The Challenge of Inner Wisdom

The Challenge Number 7 requires the individual to develop trust in their own inner guidance — the capacity to hear the quiet voice of intuition beneath the loud demands of ego, society, and fear. During this challenge period, circumstances will consistently push the individual inward — situations where external answers fail, where experts disagree, where the only reliable compass is the one that points from within.

THE NATURE OF THE 7 CHALLENGE: This challenge often manifests as chronic doubt — a tendency to second-guess every decision, to seek endless external validation, to trust anyone's opinion more than one's own. The individual may accumulate credentials, consult multiple authorities, and gather endless data — all to avoid the terrifying moment of having to decide for themselves, from their own knowing, and accept the consequences.

THE SHADOW RESPONSE: The individual may develop false certainty — adopting rigid beliefs and dogmatic positions as a defense against the discomfort of genuine not-knowing. This is not wisdom but its counterfeit — the appearance of inner knowing without the substance.

THE PRESCRIPTION: Practice small acts of intuitive trust. Make one decision each day based solely on what feels right, without seeking external confirmation. Keep a record of outcomes. Over time, the evidence will accumulate that your inner guidance is more reliable than your doubt insists. The 7 challenge is not about becoming a mystic; it is about developing the ordinary courage to trust your own perception.`,
  },
  8: {
    title: 'The Challenge of Material Mastery',
    interpretation: `CHALLENGE NUMBER 8 — The Challenge of Material Mastery

The Challenge Number 8 requires the individual to develop a healthy relationship with power, money, and material resources. During this challenge period, circumstances will consistently push the individual toward material responsibility — situations where financial decisions have significant consequences, where the exercise of authority is unavoidable, where the refusal to engage with power is itself a use of power.

THE NATURE OF THE 8 CHALLENGE: This challenge often manifests as financial instability — a pattern of feast and famine, of money arriving and departing with equal speed, of never quite achieving the material security that seems to come easily to others. The underlying issue is not money itself but the individual's RELATIONSHIP with power — an unconscious belief that power is corrupting, that wealth is shameful, or conversely, that one's worth is measured entirely by material accumulation.

THE SHADOW RESPONSE: The individual may become obsessed with money and status, measuring all value in material terms and treating relationships as transactions. Or they may reject the material realm entirely, living in voluntary poverty while judging those who engage with it — both responses are evasions of the same challenge.

THE PRESCRIPTION: Develop financial literacy as a spiritual practice. The 8 challenge is not about becoming rich; it is about becoming RESPONSIBLE — for your resources, your decisions, and the effects of your power on others. Money is energy; the 8 challenge asks you to learn how energy flows, how it is directed, and how it can be used in service of genuine value rather than mere accumulation.`,
  },
};

export function calculateChallenges(day: number, month: number, year: number): ChallengeResult {
  const md = reduceDay(day);
  const mm = reduceMonth(month);
  const my = reduceYear(year);

  const lifePath = reduceNum(md + mm + my);

  const firstEnd = 36 - lifePath;

  // First Challenge: month - day (absolute)
  const c1 = Math.abs(mm - md);
  // Second Challenge: day - year (absolute)
  const c2 = Math.abs(md - my);
  // Third Challenge: c1 - c2 (absolute)
  const c3 = Math.abs(c1 - c2);
  // Fourth Challenge: month - year (absolute)
  const c4 = Math.abs(mm - my);

  const challenges: ChallengeData[] = [
    { stage: 1, label: 'First Challenge', ages: `0 – ${firstEnd}`, number: c1, ...CHALLENGE_MEANINGS[c1] },
    { stage: 2, label: 'Second Challenge', ages: `${firstEnd} – ${firstEnd + 9}`, number: c2, ...CHALLENGE_MEANINGS[c2] },
    { stage: 3, label: 'Third Challenge', ages: `${firstEnd + 9} – ${firstEnd + 18}`, number: c3, ...CHALLENGE_MEANINGS[c3] },
    { stage: 4, label: 'Fourth Challenge', ages: `${firstEnd + 18}+`, number: c4, ...CHALLENGE_MEANINGS[c4] },
  ];

  return { lifePath, challenges };
}
