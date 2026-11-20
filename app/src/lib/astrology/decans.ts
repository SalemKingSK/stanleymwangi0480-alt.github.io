// src/lib/astrology/decans.ts
// Western Zodiac Decan System — Traditional Chaldean Order
// Each of 12 signs has 3 decans (~10° each), each with a ruling planet,
// date range, title, and verbatim interpretation (200-400 words).

export interface DecanData {
  /** The zodiac sign this decan belongs to */
  sign: string;
  /** Decan number (1, 2, or 3) */
  decanNumber: number;
  /** Ruling planet of this decan (traditional Chaldean order) */
  rulingPlanet: string;
  /** Approximate date range for this decan */
  dateRange: string;
  /** Name/title of this decan */
  title: string;
  /** Full verbatim interpretation (light and shadow) */
  interpretation: string;
}

export interface DecanResult {
  sign: string;
  decanNumber: number;
  rulingPlanet: string;
  dateRange: string;
  title: string;
  interpretation: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ZODIAC SIGN & DECAN DATE TABLE
// ─────────────────────────────────────────────────────────────────────────────

interface SignBoundary {
  sign: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

const SIGN_BOUNDARIES: SignBoundary[] = [
  { sign: 'Aries',       startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { sign: 'Taurus',      startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { sign: 'Gemini',      startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { sign: 'Cancer',      startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { sign: 'Leo',         startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { sign: 'Virgo',       startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { sign: 'Libra',       startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { sign: 'Scorpio',     startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { sign: 'Sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  { sign: 'Capricorn',   startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { sign: 'Aquarius',    startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { sign: 'Pisces',      startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE DECAN DATA
// ─────────────────────────────────────────────────────────────────────────────

const DECAN_DATA: DecanData[] = [
  // ── ARIES ──────────────────────────────────────────────────────────────────
  {
    sign: 'Aries', decanNumber: 1, rulingPlanet: 'Mars',
    dateRange: 'Mar 21 – Mar 30',
    title: 'The Warrior\'s Spark',
    interpretation: `This is Aries in its most undiluted form — raw, incandescent Mars energy poured directly into the vessel of a newborn soul. The Warrior's Spark is the ignition point of the entire zodiacal cycle, the cosmic flint strike that sets all subsequent motion into being. Born under this decan, you carry the archetype of the pioneer in its most immaculate state: unhesitant, uncompromised, and utterly convinced that forward is the only legitimate direction. Your presence in any room is kinetic; you do not enter so much as you arrive, and the air shifts perceptibly around you before a single word is spoken.

The light of this decan is breathtaking courage. You possess the rare gift of acting before fear can properly register in the nervous system — a kind of instinctive bravery that others spend lifetimes trying to cultivate. Where the rest of the zodiac hesitates, analyzes, or defers, you leap. And because you leap, you learn faster than anyone. Your first instincts are uncannily accurate, and your willingness to trust them gives you a decisive advantage in crisis, competition, and creative breakthrough. You are the person others call when something feels impossible, because you haven't yet learned to believe in impossibility.

The shadow is equally Mars-ruled and equally fierce. Your inability to perceive your own momentum means you often crash through boundaries that others needed you to respect — emotional, relational, professional ones. You wound without noticing, then grow genuinely confused when the wounded react with pain rather than applause for your boldness. Impulse control is a foreign language to you; you experience desire as an emergency that demands immediate resolution, and patience feels like a slow death. The Warrior's Spark, untempered, burns bridges faster than it can build them. You may find yourself chronically restarting — new jobs, new relationships, new cities — because the initial blaze is always more thrilling than the steady warmth required to sustain anything. The lesson of this decan is the hardest one for pure Mars to learn: that some fires are meant to be banked, tended, and kept alive through the long night, not just ignited and abandoned for the next bright flash.`,
  },
  {
    sign: 'Aries', decanNumber: 2, rulingPlanet: 'Sun',
    dateRange: 'Mar 31 – Apr 9',
    title: 'The Golden Sovereign',
    interpretation: `When the Sun rules the second decan of Aries, the warrior is crowned. The Golden Sovereign is Aries elevated from soldier to king — all the martial drive remains, but it is now illuminated by solar consciousness, which brings warmth, visibility, and the weight of genuine authority. You do not merely fight; you lead. You do not merely act; you inspire action in others. Your natural charisma is not the performative kind that requires effort; it is the kind that radiates outward whether you intend it or not, drawing people into your orbit with a gravitational pull that feels almost preordained.

The light of this decan is the capacity for benevolent sovereignty. You possess an innate understanding of power — not power as domination, but power as the ability to set a direction and have others willingly follow. Your courage is not the reckless, self-immolating courage of the first decan; it is seasoned with genuine dignity and a sense of noble purpose. You want victory, yes, but you want it to mean something. You want your achievements to be witnessed, acknowledged, and to contribute to something larger than your own ego satisfaction. This makes you a natural protector of the vulnerable, a champion of the underdog, and someone whose anger, when finally ignited, is terrifying precisely because it is so rare and so righteous.

The shadow of solar Aries is the subtle corruption that power brings to the unexamined soul. The Sun illuminates everything — including your own self-importance. Under this decan, the ego can swell to monarchical proportions, and you may find yourself developing an unconscious expectation of deference. You may begin to interpret disagreement as disloyalty and criticism as treason. Your natural warmth can curdle into condescension; your confidence can harden into arrogance; your desire to lead can mutate into a need to control. The Golden Sovereign who loses touch with their Mars root becomes a tyrant in a golden mask — all the pomp of authority with none of the authentic courage that earned it. The shadow also carries a peculiar vulnerability: because you are so accustomed to being seen and admired, you may be secretly terrified of obscurity. The prospect of being ordinary, of blending in, of not mattering — this is the one dragon even the Golden Sovereign cannot easily slay.`,
  },
  {
    sign: 'Aries', decanNumber: 3, rulingPlanet: 'Jupiter',
    dateRange: 'Apr 10 – Apr 19',
    title: 'The Expansive Pioneer',
    interpretation: `Jupiter ruling the third decan of Aries produces a fascinating hybrid: the warrior-philosopher, the adventurer who fights not for conquest but for revelation. The Expansive Pioneer carries the Aries impulse to break new ground, but enlarges it with Jupiterian vision — you are not content merely to go first; you want to go farthest, highest, and into territories that exist only in the imagination. Your mind naturally operates at the scale of grand synthesis, seeking to connect your individual actions to universal principles. You are the Aries most likely to be found at the intersection of physical daring and intellectual exploration — the mountaineer who writes poetry, the entrepreneur who reads theology, the soldier who studies strategy as a branch of philosophy.

The light of this decan is an almost mystical faith in possibility. Jupiter endows you with an optimism that is not naive but visionary — you genuinely believe the world can be enlarged, improved, and transformed through bold action guided by wisdom. Your generosity is legendary; you give not just money but opportunity, mentorship, and the kind of expansive encouragement that makes others believe they too can exceed their perceived limits. You are the least egocentric of the Aries decans because Jupiterian consciousness naturally orients toward the collective — your victories feel incomplete unless they open doors for others. This makes you an extraordinary teacher, coach, and founder, someone whose legacy is measured not in personal trophies but in the movements you catalyze.

The shadow of Jupiterian Aries is the inflationary principle applied to the warrior ego. Your reach can permanently exceed your grasp, and you may become so enamored of the grand vision that you neglect the gritty, unglamorous work of execution. Jupiter's expansiveness, when married to Aries impulsiveness, can produce a kind of reckless grandiosity — the founder who overpromises, the adventurer who underestimates risk, the philosopher-warrior who mistakes enthusiasm for expertise. You may also struggle with a peculiar form of restlessness that is subtler and more dangerous than the simple impatience of decan one: a persistent conviction that the real action, the true meaning, the ultimate adventure is always elsewhere — over the next ridge, in the next venture, with the next group of people. This can make you a serial abandoner, leaving behind a trail of half-built empires and bewildered collaborators who thought you were in it for the long haul. The Expansive Pioneer's deepest task is to learn that expansion without integration is dispersion, and that the most courageous act of all is sometimes the decision to stay.`,
  },

  // ── TAURUS ─────────────────────────────────────────────────────────────────
  {
    sign: 'Taurus', decanNumber: 1, rulingPlanet: 'Venus',
    dateRange: 'Apr 20 – Apr 29',
    title: 'The Earthly Sensualist',
    interpretation: `This is Venus in her most grounded, tactile, and immanent expression — not the airy Venus of romantic abstraction, but Venus as the goddess of the actual: of touch, taste, texture, and the deep bodily knowing that precedes all thought. The Earthly Sensualist experiences the world through the senses as a primary language, and your nervous system is exquisitely attuned to the subtleties of physical experience — the exact weight of a fabric, the precise temperature of a room, the micro-expressions that betray a person's true emotional state before they speak. You do not merely appreciate beauty; you metabolize it. It is as essential to your wellbeing as food, and deprivation of aesthetic nourishment can produce a malaise as real as any vitamin deficiency.

The light of this decan is the capacity to create sanctuary. You understand, perhaps better than any other decan in the zodiac, that the physical environment shapes consciousness, and you possess an almost architectural instinct for comfort, beauty, and functional elegance. Your presence is grounding; people feel calmer, safer, and more embodied in your company because you model a relationship with the material world that is reverent rather than exploitative. Your patience is not passive but active — a deliberate, willed stillness that allows things to ripen, seasons to turn, and processes to complete themselves in their own time. This makes you an extraordinary builder, whether of gardens, businesses, relationships, or works of art. What you create endures because you refuse to rush it.

The shadow of Venus-ruled Taurus is the slow calcification of comfort into stagnation. Your love of the sensuous can degrade into mere sensuality without soul — an endless, compulsive pursuit of pleasant sensations that never quite satisfies because pleasure without meaning is a closed loop. Your famous patience can become inertia; your stability can become rigidity; your attachment to the familiar can become a prison whose walls you have decorated so beautifully that you no longer recognize them as bars. The Earthly Sensualist at their worst becomes a collector rather than a creator, a connoisseur rather than a participant, someone who mistakes the accumulation of beautiful objects for the cultivation of a beautiful life. You may also struggle with a quiet terror of scarcity that contradicts your outward abundance — a fear that if you stop producing, stop accumulating, stop securing, everything you love will be taken from you. This is the decan's deepest spiritual challenge: to trust that enough is actually enough, and that the most valuable things in life cannot be possessed at all.`,
  },
  {
    sign: 'Taurus', decanNumber: 2, rulingPlanet: 'Mercury',
    dateRange: 'Apr 30 – May 9',
    title: 'The Practical Mind',
    interpretation: `When Mercury governs the second decan of Taurus, the bull gains wings — but wings that fly close to the ground, practical and functional rather than ethereal. The Practical Mind is a rare and undervalued configuration: an intellect that is entirely tethered to the real, a thinking apparatus designed not for abstraction but for application. You possess the cognitive equivalent of skilled hands — your mind works with ideas the way a master carpenter works with wood, feeling for grain, testing for integrity, shaping toward utility. You are not interested in theories that cannot be tested, philosophies that cannot be lived, or knowledge that cannot be applied. Your genius lies in the middle realm between concept and execution, the space where ideas become tools, processes, and systems that actually function in the physical world.

The light of this decan is profound reliability. Your thought processes are methodical, sequential, and thorough in a way that makes you invaluable in any collaborative endeavor. You are the person who spots the flaw in the plan that everyone else missed, not because you are more intelligent than they are, but because you are more patient — you are willing to trace each thread to its conclusion before declaring the tapestry finished. Mercury in Taurus endows your communication with unusual weight; your words land with physical impact because they are chosen carefully and delivered with conviction. You do not speak to fill silence but to build understanding, and when you finally do express an opinion, people listen because they know it has been earned through genuine reflection rather than reflexive reaction.

The shadow of Mercurial Taurus is a peculiar kind of intellectual stubbornness. Your mind, once settled on a conclusion — especially a conclusion that has proven practically useful — becomes nearly immovable. You may dismiss ideas that challenge your established mental frameworks, not through active hostility, but through a kind of passive resistance that is even more frustrating to encounter: a placid, immovable certainty that what you already know is sufficient and that further inquiry is unnecessary. Your preference for the practical can also become a limitation, blinding you to possibilities that are real but not yet tangible — innovations, paradigm shifts, and creative leaps that require temporarily abandoning the ground of the known for the vertigo of the unknown. The Practical Mind at its most shadowed becomes the Closed Mind, mistaking its own mental habits for universal laws, and treating the familiar as though it were synonymous with the true.`,
  },
  {
    sign: 'Taurus', decanNumber: 3, rulingPlanet: 'Saturn',
    dateRange: 'May 10 – May 20',
    title: 'The Builder',
    interpretation: `When Saturn rules the third decan of Taurus, we encounter the zodiac's most formidable capacity for sustained, disciplined creation. The Builder is Taurus stripped of its legendary indolence and armed instead with Saturnian grit — all the bull's immense stamina, but now channeled through a framework of purpose, structure, and long-term vision. You are not merely patient; you are strategic in your patience, willing to invest years in projects that will not bear fruit for a decade. You understand, at a cellular level, that anything worth building must be built slowly, layer upon layer, with each course of stone leveled and tested before the next is laid. This is not ambition in the flashy, Aries sense of the word; this is ambition as geological process — slow, inexorable, and ultimately irresistible.

The light of this decan is the capacity to create legacy. You are one of the rare souls who genuinely thinks in terms of what will remain after you are gone — the institution, the body of work, the land, the family line, the tradition that will outlast your individual lifetime. This gives your life a gravitas and a moral seriousness that others find both admirable and slightly intimidating. You hold yourself to exacting standards not because you fear judgment but because you feel a genuine responsibility to the future you are building. Your loyalty is absolute; once you commit to a person, a cause, or a project, you do not withdraw. You are the partner who stays through the hard decades, the founder who rebuilds after the crash, the artist who refines a single technique over a lifetime until it transcends craft and becomes wisdom.

The shadow of Saturnian Taurus is the dark side of permanence: rigidity, fear of change, and the gradual ossification of the living into the merely durable. Your devotion to the long-term can become a kind of temporal myopia in which the present moment is perpetually sacrificed to a future that never quite arrives. You may postpone joy, defer intimacy, and delay satisfaction indefinitely, always waiting for the structure to be complete, the security to be absolute, the foundation to be unshakeable — conditions that, in a living universe, can never be fully met. The Builder at their most shadowed becomes the Prisoner of Their Own Fortress, living behind walls so thick that nothing can get in, but also nothing can get out. Your capacity for discipline can harden into a grim, life-denying austerity; your patience can become a refusal to act when action is urgently needed. The deepest task of this decan is to learn that the most enduring structures are not those built to resist all change, but those built with the flexibility to adapt — and that a legacy without love is just a monument in a desert.`,
  },

  // ── GEMINI ─────────────────────────────────────────────────────────────────
  {
    sign: 'Gemini', decanNumber: 1, rulingPlanet: 'Mercury',
    dateRange: 'May 21 – May 31',
    title: 'The Silver-Tongued',
    interpretation: `This is Mercury in its most pristine, undiluted expression within a mutable air sign — the pure, quicksilver intelligence that seems to operate at a frequency slightly faster than the rest of the world. The Silver-Tongued decan produces individuals for whom language is not merely a tool but a primary mode of being. You think, feel, and even exist through words; verbal expression is so natural to you that you are often articulating thoughts before you have consciously decided to have them. Your mind is a ceaselessly generating engine of connections, associations, and insights, leaping across categories and domains with an agility that can leave others dizzy and struggling to keep pace. You are the person who can make any conversation interesting, any idea accessible, and any room feel more alive simply by entering it and beginning to speak.

The light of this decan is the gift of translation — not just between languages, but between worlds. You can bridge the gap between the expert and the novice, the intellectual and the practical, the esoteric and the mundane, because you genuinely understand both sides and can find the metaphors, analogies, and explanations that make the unfamiliar familiar. Your curiosity is voracious and indiscriminate — you are as interested in what the taxi driver thinks about politics as you are in what the professor published in their latest paper. This makes you an extraordinary connector, networker, and catalyst, someone whose value lies not in depth of a single expertise but in breadth of comprehension and the ability to synthesize insight across fields.

The shadow of pure Mercurial Gemini is the restlessness of a mind that has never learned to land. Your intellectual energy, untethered from any deeper commitment, can become a kind of cognitive consumerism — sampling ideas, discarding them, and moving on before any genuine integration can occur. You may accumulate information as a hedge against the discomfort of genuine unknowing, mistaking the possession of facts for the possession of wisdom. The Silver-Tongued at their most shadowed becomes the Merely Glib — a brilliant conversationalist who leaves no trace, a dazzling intellect that produces nothing enduring, a promise of depth that evaporates the moment you try to hold it. Your very verbal fluency can become a defense against intimacy, a way of talking around emotional truths without ever landing on them. The deepest challenge of this decan is to learn that the point of language is not merely expression but connection — and that sometimes the most profound communication happens in silence.`,
  },
  {
    sign: 'Gemini', decanNumber: 2, rulingPlanet: 'Venus',
    dateRange: 'Jun 1 – Jun 10',
    title: 'The Charming Dualist',
    interpretation: `When Venus governs the second decan of Gemini, the mercurial intellect acquires a social grace that makes it not merely intriguing but irresistible. The Charming Dualist wields language as a tool of connection, beauty, and seduction rather than mere information exchange. You possess an almost supernatural ability to read a room, calibrate your tone, and make every person you speak with feel uniquely seen, understood, and valued. This is not manipulation — or at least, it need not be — but genuine relational intelligence expressed through the Gemini gift for adaptability. You can be five different people in five different conversations and remain, somehow, authentically yourself in each one, because your sense of self is broad enough to contain multitudes.

The light of this decan is the capacity to create beauty through relationship. You understand, intuitively, that the most profound art is not made in isolation but in the charged space between people — in conversation, collaboration, and the shared exploration of ideas. Your Venusian influence brings aesthetic refinement to the Gemini intellect; you have an eye for elegance in thought, a distaste for the crass or clumsy, and a genuine appreciation for the craft of communication. You are the host who makes every guest feel like the guest of honor, the mediator who finds the elegant solution, the friend who somehow always knows exactly the right thing to say. Your charm is not a superficial gloss but an expression of genuine attunement to others.

The shadow of Venusian Gemini is the subtle erosion of integrity that comes from excessive adaptability. When you can charm anyone, you may lose track of who you actually are beneath the charm; when you can find merit in every perspective, you may lose the capacity to take a stand. The Charming Dualist at their most shadowed becomes the Eternal Pleaser — someone whose identity shifts so fluidly to meet the expectations of others that no stable self remains. You may also struggle with a particular kind of intellectual dilettantism that is more aesthetic than substantive — a tendency to prefer ideas that are beautiful over ideas that are true, and to avoid the hard work of genuine mastery because it requires narrowing, focusing, and saying no to the infinite possibilities that tempt your mercurial nature. The deepest task of this decan is to discover that genuine charm is not the ability to be all things to all people, but the courage to be one real thing to a few.`,
  },
  {
    sign: 'Gemini', decanNumber: 3, rulingPlanet: 'Uranus',
    dateRange: 'Jun 11 – Jun 20',
    title: 'The Electric Mind',
    interpretation: `When Uranus rules the third decan of Gemini, the mercurial intellect is supercharged with transpersonal voltage. The Electric Mind operates on a frequency that is not merely fast but discontinuous — your thoughts do not flow in linear sequences so much as they arrive in sudden, complete packages, fully formed insights that seem to come from nowhere and everywhere simultaneously. You are the person who intuits the solution before anyone has properly understood the problem, who sees the pattern while others are still counting the pieces, who experiences creative breakthroughs as lightning strikes rather than gradual realizations. Your mind is not merely intelligent; it is inspired in the most literal sense — breathed into by something larger than your individual consciousness.

The light of this decan is the capacity for genuine innovation. You do not merely learn existing knowledge; you reorganize it, invert it, cross-fertilize it across domains that have never been in conversation before, and produce genuinely novel syntheses. Your Uranian influence gives you a natural iconoclasm — you are constitutionally incapable of accepting something as true merely because it is traditional, established, or widely believed. This makes you a natural disruptor in whatever field you enter, someone whose presence inevitably challenges comfortable assumptions and stimulates creative evolution. Your humor is sharp, unexpected, and often ahead of its time; you find connections that others miss, and your laughter is as much an expression of intellectual delight as social bonding.

The shadow of Uranian Gemini is the instability that comes from a mind that cannot ground itself. Your neural architecture, so exquisitely tuned to novelty, can become addicted to disruption for its own sake — you may find yourself generating chaos not because it serves any purpose but because stillness feels intolerable and the familiar feels like death. Your insights, arriving as they do in flashes rather than through patient construction, may lack the infrastructure to be effectively communicated or implemented; you may be the archetypal misunderstood genius, brilliant but isolated, unable to translate your vision into terms others can comprehend. The Electric Mind at its most shadowed becomes the Unstable Generator — a source of immense creative energy that cannot be safely harnessed, dazzling and dangerous in equal measure. The deepest challenge of this decan is to learn that the most radical innovation requires the most disciplined grounding — that lightning, to be useful, must be captured, stored, and distributed, not merely admired for its brilliance.`,
  },

  // ── CANCER ─────────────────────────────────────────────────────────────────
  {
    sign: 'Cancer', decanNumber: 1, rulingPlanet: 'Moon',
    dateRange: 'Jun 21 – Jul 1',
    title: 'The Nurturer',
    interpretation: `This is the Moon in its most archetypally pure expression — Cancer's first decan, ruled by the Moon itself, is the cosmic mother, the primal container, the womb of consciousness made manifest in human form. The Nurturer experiences reality primarily through the emotional body; your feelings are not secondary reactions to events but your primary organ of perception. You know things before you can articulate how you know them, because your knowing operates at a frequency below language — through mood, atmosphere, and the subtle energetic signatures that others either ignore or cannot perceive. You are the person who walks into a room and immediately senses what is unspoken, who holds a crying child and knows without being told what the tears are really about, who understands the emotional weather of any situation before the first rational word has been exchanged.

The light of this decan is the capacity to create genuine emotional safety. You possess a maternal warmth — regardless of gender — that makes others feel held, accepted, and permitted to be vulnerable in your presence. Your empathy is not the performative sympathy of polite society but a genuine, visceral attunement to the emotional states of others that compels you to respond with care. You are the keeper of memory, the preserver of tradition, the guardian of family stories and ancestral connections that would otherwise be lost. Your loyalty to those you love is absolute; once someone enters your inner circle, they are family for life, and you will defend them with a ferocity that belies your gentle exterior.

The shadow of lunar Cancer is the undertow of emotional identification so complete that boundaries dissolve entirely. You may struggle to distinguish between your own feelings and those you absorb from others, leading to the kind of emotional exhaustion that comes from living as an unprotected nerve ending in a world full of sharp edges. Your nurturing instinct can become possessive love — a need to be needed that keeps others dependent, a care that is more about your own emotional security than their genuine flourishing. The Nurturer at their most shadowed becomes the Devourer — the mother who cannot let go, the partner whose love is a cage, the friend whose support comes with unspoken invoices of perpetual loyalty. You may also struggle with a powerful undertow of nostalgia that keeps you oriented toward the past — toward what was lost, what might have been, what can never be recovered — at the expense of engaging fully with the present. The deepest task of this decan is to learn that the most profound nurturing is that which makes itself eventually unnecessary, and that genuine love is not holding on but learning when to release.`,
  },
  {
    sign: 'Cancer', decanNumber: 2, rulingPlanet: 'Mars',
    dateRange: 'Jul 2 – Jul 12',
    title: 'The Protective Warrior',
    interpretation: `When Mars rules the second decan of Cancer, the soft lunar shell is reinforced with iron. The Protective Warrior is Cancer transformed from passive nurturer into active defender — all the fierce loyalty of the crab, but now armed and mobilized. Your emotional sensitivity, far from being a vulnerability, becomes the wellspring of a formidable protective instinct. You love so deeply that you will fight for what you love with a ferocity that surprises everyone, including yourself. Where the first Cancer decan absorbs and contains, you project and defend; your empathy does not dissolve you but galvanizes you into action on behalf of those you have taken under your emotional wing.

The light of this decan is the courage that arises from love rather than aggression. Your Mars energy is not the impersonal, competitive drive of Aries but a deeply personal, emotionally charged force that is awakened only when something — or someone — you care about is threatened. This makes you an extraordinary advocate, protector, and champion of the vulnerable. You are the friend who shows up at 3 AM without being asked, the parent who becomes a force of nature when their child is in danger, the partner who fights for the relationship when everyone else has given up. Your emotional intelligence, combined with Martian decisiveness, gives you an unusual capacity to navigate high-stakes interpersonal situations with both tactical precision and genuine heart.

The shadow of Martian Cancer is the dangerous combination of emotional reactivity and combative impulse. When you feel threatened — and your sensitive emotional body can perceive threat where none was intended — your Mars response can be disproportionate and devastating. You may lash out from a place of deep hurt, using your intimate knowledge of others' vulnerabilities as weapons, and then retreat into your shell, leaving the wounded party confused about what just happened. Your protective instinct can also curdle into possessiveness and control — the conviction that you are fighting for someone when you are actually fighting to keep them, that your defense of the relationship is actually a defense of your own emotional monopoly on the person. The Protective Warrior at their most shadowed becomes the Emotional Berserker — someone whose love is so intense and so armed that it becomes a liability to those it purports to protect. The deepest challenge of this decan is to learn that the strongest armor is sometimes the willingness to remain vulnerable, and that not every perceived attack requires a counter-offensive.`,
  },
  {
    sign: 'Cancer', decanNumber: 3, rulingPlanet: 'Neptune',
    dateRange: 'Jul 13 – Jul 22',
    title: 'The Mystic Feeler',
    interpretation: `When Neptune governs the third decan of Cancer, the lunar emotional body dissolves into something oceanic and transpersonal. The Mystic Feeler is Cancer with its boundaries permeable not just to the feelings of family and intimates but to the emotional undercurrents of the collective itself. Your sensitivity is so profound that it extends beyond the personal entirely — you feel the grief of strangers, the anxiety of crowds, the joy of celebrations happening on the other side of the world. You are a natural psychic sponge, absorbing emotional information from the environment with a receptivity that can be as disorienting as it is revelatory. Your inner life is not a private garden but an ocean — vast, deep, and connected to all other waters.

The light of this decan is the capacity for transcendent compassion. Because your emotional range includes not just personal feelings but archetypal ones, you can understand and hold space for experiences you have never personally had. Your empathy is not learned but constitutional — you cannot not feel what others feel, and this makes you an extraordinary healer, artist, counselor, or spiritual companion. Your imagination is vast and mythic; you perceive the symbolic dimension of ordinary events, finding meaning and connection where others see only randomness. You are the person who can sit with someone in their darkest night of the soul and not flinch, because you are already intimately acquainted with those depths yourself.

The shadow of Neptunian Cancer is the dissolution of the self into the emotional field. Without strong boundaries, you may lose the ability to distinguish between your own emotional experience and that of others, leading to confusion, exhaustion, and a chronic sense of being overwhelmed by input you cannot filter. Your longing for fusion — for a return to the oceanic state of pre-birth undifferentiation — can express itself through escapism, addiction, or the kind of codependent relationships in which you dissolve into another person entirely, losing your own identity in the process. The Mystic Feeler at their most shadowed becomes the Drowned One — a soul so open to the emotional sea that it has forgotten how to return to shore. You may also struggle with a particular kind of spiritual bypass that uses transcendent feeling to avoid the ordinary, difficult work of human relationship — preferring the abstract love of "all beings" to the messy, demanding love of actual individuals. The deepest task of this decan is to learn that the ocean is most powerful when it has shores — that transcendence without grounding is just drifting, and that the most profound mysticism is practiced in the kitchen, the nursery, and the ordinary intimacy of daily life.`,
  },

  // ── LEO ────────────────────────────────────────────────────────────────────
  {
    sign: 'Leo', decanNumber: 1, rulingPlanet: 'Sun',
    dateRange: 'Jul 23 – Aug 1',
    title: 'The Radiant King',
    interpretation: `This is the Sun in its domicile, Leo's first decan, ruled by the Sun itself — the most concentrated expression of solar consciousness in the entire zodiac. The Radiant King is born with an innate sense of centrality that is neither arrogance nor delusion but something more fundamental: a constitutional knowing that you are meant to shine, that your presence matters, and that the world is somehow more alive when you are fully present in it. Your energy is naturally generative rather than extractive; you do not take attention so much as you radiate a quality of aliveness that draws attention toward you as naturally as flowers turn toward light. You are not performing when you command a room; you are simply being yourself at full wattage, and that self happens to be luminous.

The light of this decan is the gift of creative self-expression in its most generous form. You possess an almost childlike capacity for joy, play, and spontaneous delight that reminds others of what it felt like to be fully alive before the world taught them to dim their light. Your warmth is genuine, not strategic; you genuinely want others to shine alongside you, because a king whose court is full of brilliance is more magnificent than a king who surrounds himself with shadows. You are naturally suited for roles of leadership, performance, mentorship, or any position in which your visibility can serve as an invitation for others to become more visible themselves. Your courage is solar — steady, life-affirming, and unwavering, the kind that does not need to prove itself because it knows itself.

The shadow of solar Leo is the slow corruption of centrality into entitlement. When the Sun is not balanced by reflective self-awareness, its warmth can become a scorching demand for worship. You may begin to interpret the natural flow of attention toward you as evidence of your inherent superiority, and grow restless or even hostile when the spotlight shifts elsewhere. The Radiant King at their most shadowed becomes the Tyrant Infant — a soul so accustomed to being the center that they experience the mere existence of others' needs as an affront. Your generosity can become patronizing; your warmth can become theatrical; your confidence can become an armor so thick that no genuine vulnerability — and therefore no genuine intimacy — can penetrate it. You may also struggle with a terror of being ordinary that drives you to exhaust yourself performing extraordinariness, never realizing that the most radiant souls are those who have integrated, rather than fled from, their own humanity.`,
  },
  {
    sign: 'Leo', decanNumber: 2, rulingPlanet: 'Jupiter',
    dateRange: 'Aug 2 – Aug 12',
    title: 'The Benevolent Monarch',
    interpretation: `When Jupiter rules the second decan of Leo, the solar fire expands into something majestic, generous, and genuinely magnanimous. The Benevolent Monarch is Leo elevated from personal radiance to transpersonal vision — all the warmth and charisma of the lion, but now oriented toward something larger than personal glory. You possess an innate understanding of the relationship between power and responsibility; your natural authority is inseparable from a genuine desire to use that authority for the benefit of others. Where the first Leo decan shines for the sheer joy of shining, you shine in order to illuminate — to reveal possibilities, to inspire greatness, to call others into their own fullness.

The light of this decan is the capacity for visionary leadership. You do not merely want to be in charge; you want to lead people somewhere worth going. Your Jupiterian expansiveness gives you a philosophical and even spiritual dimension that is less pronounced in other Leo decans — you think in terms of legacy, meaning, and cultural contribution rather than mere acclaim. Your generosity is legendary and genuine; you give not to be seen giving but because abundance is your natural state and sharing it feels as natural as breathing. You are the mentor who opens doors, the patron who funds dreams, the leader whose vision is so compelling that others volunteer their best selves to its realization without being asked.

The shadow of Jupiterian Leo is the inflationary ego that mistakes expansion for validation. Your grandiosity, when unchecked, can become a kind of benevolent tyranny — the conviction that you know what is best for everyone, and that your generosity entitles you to control. You may give with invisible strings attached, accumulating emotional debts that you will call in when your authority is questioned. Your optimism can become denial; your largesse can become waste; your visionary scope can become an excuse for neglecting the humble, unglamorous details that sustain any genuine enterprise. The Benevolent Monarch at their most shadowed becomes the Bloated Sovereign — all pomp and magnanimity on the surface, but hollow at the center, sustained by the devotion of followers who will eventually realize they have been serving a beautiful fiction. The deepest challenge of this decan is to learn that true sovereignty requires not only the capacity to expand but the willingness to be humbled, and that the greatest leaders are those who serve something larger than their own self-image.`,
  },
  {
    sign: 'Leo', decanNumber: 3, rulingPlanet: 'Mars',
    dateRange: 'Aug 13 – Aug 22',
    title: 'The Conqueror',
    interpretation: `When Mars rules the third decan of Leo, the lion becomes a warrior — all the solar fire of Leo now channeled through the martial discipline of combat and conquest. The Conqueror is Leo in its most dynamic, assertive, and physically potent expression. You do not merely shine; you advance. You do not merely command; you fight. Your presence carries an edge that the other Leo decans lack — a quality of contained violence, of power held in reserve, of the capacity to unleash tremendous force should circumstances require it. This is the decan of the warrior-king, the champion, the leader who leads from the front rather than the throne.

The light of this decan is the capacity to translate vision into victory. Your courage is not merely the radiant warmth of the first decan or the expansive confidence of the second — it is battle-tested, physical, and expressed through action rather than presence alone. You possess an extraordinary combination of charismatic leadership and tactical competence; you can inspire a team and then lead them through the actual, grueling work of execution. Your competitive drive is fierce but not petty; you want to win, yes, but you want to win against worthy opponents in meaningful contests. You are the person who thrives under pressure, who becomes more focused and more effective as the stakes rise, and who has the rare ability to maintain morale in a group facing genuine adversity.

The shadow of Martian Leo is the dangerous fusion of ego and aggression. Your need to win can become pathological — a compulsion that transforms every interaction into a contest and every relationship into a hierarchy. You may struggle to distinguish between situations that call for conquest and those that call for collaboration, because your default orientation is toward dominance. The Conqueror at their most shadowed becomes the Bully King — someone whose power is expressed through intimidation rather than inspiration, whose "victories" are hollow because they leave a trail of resentment and broken spirits. Your passion, so magnificent when channeled constructively, can also express as rage — a solar-Mars fury that burns hot, fast, and indiscriminately, leaving damage that takes years to repair. The deepest challenge of this decan is to learn that the most difficult conquest is the conquest of one's own compulsion to conquer, and that the truest strength is the strength to lay down arms.`,
  },

  // ── VIRGO ──────────────────────────────────────────────────────────────────
  {
    sign: 'Virgo', decanNumber: 1, rulingPlanet: 'Mercury',
    dateRange: 'Aug 23 – Sep 2',
    title: 'The Analyst',
    interpretation: `This is Mercury in its most precise, discriminating, and analytically potent expression — Virgo's first decan, where the mercurial intellect is grounded in earth rather than diffused in air. The Analyst does not merely think; they dissect, examine, and refine. Your mind operates like a finely calibrated instrument designed to detect error, inconsistency, and imperfection — not because you are negative by nature, but because you are constitutionally oriented toward improvement. You see what could be better the way an artist sees light, the way a musician hears intervals: it is not a choice but a mode of perception. This makes you extraordinarily valuable in any system that benefits from optimization, quality control, or the patient unraveling of complexity.

The light of this decan is the gift of genuine service. Your analytical precision, when harnessed to a purpose larger than critique, becomes a form of love — the meticulous care you bring to your work, your relationships, and your craft is a kind of devotion, an offering of your finest attention to whatever has earned your commitment. You possess an unusual humility for a Mercury-ruled sign; you are less interested in being recognized for your intelligence than in seeing your intelligence produce tangible improvement in the world. This makes you an extraordinary healer, editor, engineer, craftsman, or any role that requires the patient, loving application of skill to the refinement of raw material. Your standards are high, but you hold yourself to them before anyone else.

The shadow of Mercurial Virgo is the paralysis that perfectionism produces when it loses its connection to purpose. Your capacity for critique, unmoored from the love of improvement, can curdle into a sour hypercriticism that finds fault with everything and celebrates nothing. You may project your own unrelenting inner standards onto others, becoming the kind of person whose "feedback" is really just a laundry list of deficiencies delivered without warmth or context. The Analyst at their most shadowed becomes the Eternal Fault-Finder — someone who has mistaken the map for the territory, the critique for the creation, and the process of refinement for the point of existence. You may also struggle with a profound difficulty accepting your own imperfection, to the point where you withhold yourself from life — from love, from creative risk, from genuine vulnerability — because you are waiting to be "ready," to be "finished," to be perfect enough to deserve participation. The deepest task of this decan is to learn that analysis is preparation, not purpose, and that the point of seeing what is wrong is not to punish but to heal.`,
  },
  {
    sign: 'Virgo', decanNumber: 2, rulingPlanet: 'Saturn',
    dateRange: 'Sep 3 – Sep 12',
    title: 'The Architect',
    interpretation: `When Saturn rules the second decan of Virgo, the mercurial impulse toward refinement is disciplined into something structural, enduring, and genuinely monumental. The Architect is Virgo transformed from analyst into builder — all the precision and discernment of the sign, but now operating at the scale of systems, institutions, and frameworks designed to last. You are not content merely to identify flaws; you must construct the corrected version, and your corrections are never quick fixes but comprehensive solutions — foundations that can support the weight of what must be built upon them for generations. Your mind is not merely sharp but deep; you think in terms of architecture, infrastructure, and the kind of patient, layered construction that produces things of genuine permanence.

The light of this decan is the capacity to create order from chaos through sustained, disciplined effort. You possess an almost monastic devotion to craft — a willingness to do the unglamorous, repetitive work that genuine mastery requires, long after others have lost interest or moved on to the next novelty. Your Saturnian influence gives you a natural gravitas that is rare in Mercury-ruled signs; your words carry weight, your commitments are absolute, and your presence communicates reliability without needing to advertise it. You are the late bloomer par excellence — not because you are slow, but because you are thorough, building your competence layer by tested layer until, sometime in your middle years, you emerge as a genuine authority whose foundations cannot be shaken.

The shadow of Saturnian Virgo is the dark side of discipline: austerity, rigidity, and the gradual calcification of discernment into judgment. Your standards, so admirable in their precision, can become a prison — for yourself and for those who live within the structures you create. You may confuse "order" with "control" and "improvement" with the relentless elimination of anything spontaneous, messy, or unpredictable. The Architect at their most shadowed becomes the Cold Perfectionist — someone whose structures are flawless but lifeless, whose discipline has become a rejection of the body, whose discernment has hardened into contempt for human frailty. You may also struggle with a profound loneliness that arises from your own exacting standards; you find it difficult to let others close because they are, inevitably, imperfect, and you have not yet learned that imperfection is not a design flaw but the signature of the living. The deepest challenge of this decan is to learn that the finest architecture makes space for growth, and that a structure too rigid to accommodate change is a tomb, not a home.`,
  },
  {
    sign: 'Virgo', decanNumber: 3, rulingPlanet: 'Venus',
    dateRange: 'Sep 13 – Sep 22',
    title: 'The Refined Critic',
    interpretation: `When Venus governs the third decan of Virgo, the analytical mind is softened, beautified, and oriented toward harmony rather than mere correction. The Refined Critic is Virgo with taste — all the discernment of the sign, but now operating in service of beauty, elegance, and relational grace rather than pure functional optimization. You possess an eye for aesthetic detail that rivals the finest artists, combined with the Virgo capacity for systematic refinement. Your criticism, when offered, is delivered with genuine care for the recipient; you understand that the purpose of feedback is not to demonstrate superiority but to help something become more fully itself.

The light of this decan is the capacity to elevate the ordinary through attention and care. Your Venusian influence brings warmth, charm, and genuine relational intelligence to the Virgo temperament; you are the rare Virgo who can critique without wounding, refine without rejecting, and improve without diminishing. Your aesthetic sense is refined but not precious — you find beauty in simplicity, elegance in function, and grace in the modest details others overlook. This makes you an extraordinary designer, stylist, editor, or any role that requires the marriage of analytical precision with aesthetic judgment. Your relationships benefit from your willingness to work at them — not in the grim, dutiful sense, but in the sense of attending to the small gestures, the thoughtful words, the consistent kindness that keeps love alive.

The shadow of Venusian Virgo is the fusion of aesthetic judgment with moral judgment. Your refined taste can become a form of snobbery — the conviction that your preferences are not merely preferences but evidence of superior sensibility, and that those who do not share them are somehow deficient. You may become so focused on surface refinement — the right words, the right presentation, the right appearance — that you neglect the deeper, messier work of genuine intimacy and self-confrontation. The Refined Critic at their most shadowed becomes the Aesthetic Judge — someone whose kindness is a form of social positioning, whose charm is strategic, and whose "refinement" is a defense against the vulnerability of being seen without polish. The deepest challenge of this decan is to learn that true refinement is not the elimination of rawness but the integration of it — and that the most beautiful things in life often emerge from the very imperfection your Virgo eye is trained to detect.`,
  },

  // ── LIBRA ──────────────────────────────────────────────────────────────────
  {
    sign: 'Libra', decanNumber: 1, rulingPlanet: 'Venus',
    dateRange: 'Sep 23 – Oct 2',
    title: 'The Diplomat',
    interpretation: `This is Venus in its airy, relational, and harmonizing expression — Libra's first decan, where the goddess of love operates not through sensuality (as in Taurus) but through social intelligence, aesthetic grace, and the delicate art of bringing disparate elements into balance. The Diplomat possesses an almost preternatural sensitivity to relationship dynamics; you perceive the subtle tensions, unspoken agreements, and emotional undercurrents that govern human interaction with the same clarity that others perceive physical objects. Your primary drive is toward harmony — not as an abstract ideal but as a living, breathing quality that must be constantly tended, adjusted, and restored.

The light of this decan is the gift of genuine mediation. You can hold opposing perspectives in your mind simultaneously without needing to immediately resolve them into a single truth, and this makes you an extraordinary bridge-builder, peacemaker, and consensus-creator. Your charm is not superficial but structural — it arises from your genuine interest in others and your capacity to make each person feel heard, understood, and valued. You possess an innate sense of fairness that transcends mere rule-following; you understand that justice is not about equality of treatment but about proportionality, context, and the restoration of balance. This makes you valuable in any situation that requires negotiation, diplomacy, or the delicate navigation of competing interests.

The shadow of Venusian Libra is the paralysis that arises from excessive identification with the relational field. Your need for harmony can become a terror of conflict so profound that you sacrifice your own truth, your own boundaries, and ultimately your own self to maintain a false peace. You may become so adept at seeing every perspective that you lose the capacity to hold a perspective of your own — a kind of relational chameleon who disappears into whatever relationship they are currently navigating. The Diplomat at their most shadowed becomes the Appeaser — someone whose "fairness" is actually a sophisticated avoidance of the vulnerability that comes with taking an unambiguous stand. You may also struggle with a persistent, low-grade anxiety about being liked — a dependency on external validation that makes genuine intimacy impossible because you are always performing, always calibrating, always managing impression rather than showing up as your authentic, imperfect, occasionally disagreeable self. The deepest task of this decan is to learn that genuine harmony is not the absence of conflict but the capacity to navigate conflict with love, and that the most important relationship to tend is the one with your own truth.`,
  },
  {
    sign: 'Libra', decanNumber: 2, rulingPlanet: 'Saturn',
    dateRange: 'Oct 3 – Oct 12',
    title: 'The Judge',
    interpretation: `When Saturn rules the second decan of Libra, the Venusian impulse toward harmony is given weight, structure, and moral seriousness. The Judge is Libra transformed from diplomat into arbiter — all the fairness and relational intelligence of the sign, but now operating within a framework of principle, precedent, and genuine accountability. You are not content merely to mediate; you must determine what is right, and your determination carries the force of genuine moral conviction. Your sense of justice is not the abstract idealism of untested youth but the earned wisdom of someone who has wrestled seriously with ethical complexity and accepted the burden of making difficult judgments.

The light of this decan is the capacity to bring genuine justice into human affairs. You understand, at a level that transcends theory, that fairness is not a feeling but a discipline — a practice that requires the willingness to make unpopular decisions, to enforce boundaries, and to accept the loneliness that genuine judgment often entails. Your Saturnian influence gives you a gravitas that distinguishes you from other Libran expressions; you are less concerned with being liked than with being right, less attached to superficial harmony than to structural integrity. You are the judge who weighs evidence carefully, the partner who holds the relationship accountable to its promises, the leader who refuses to sacrifice principle on the altar of popularity.

The shadow of Saturnian Libra is the dark side of judgment: coldness, rigidity, and the gradual replacement of compassion with condemnation. Your commitment to principle can become a kind of legalism that values the letter of the law over the spirit, the rule over the relationship, the abstract standard over the concrete human being standing before you. You may become so identified with the role of judge that you forget you are also a participant — a fellow flawed human rather than a detached arbiter of others' failings. The Judge at their most shadowed becomes the Hanging Judge — someone whose "justice" is really an expression of unexamined anger, whose standards are applied more harshly to others than to themselves, and whose moral clarity is a defense against the terrifying ambiguity of genuine ethical engagement. The deepest challenge of this decan is to learn that the highest form of justice is always tempered by mercy, and that the most important person to hold accountable is oneself.`,
  },
  {
    sign: 'Libra', decanNumber: 3, rulingPlanet: 'Jupiter',
    dateRange: 'Oct 13 – Oct 22',
    title: 'The Philosopher of Balance',
    interpretation: `When Jupiter governs the third decan of Libra, the scales expand to encompass not just personal relationships but cosmic principles. The Philosopher of Balance is Libra elevated from the interpersonal to the metaphysical — your concern with harmony extends beyond the dinner table and the boardroom to the fundamental structures of reality itself. You possess an intuitive grasp of the dialectical nature of existence: that opposites are not enemies but complements, that tension is not a problem to be solved but a dynamic to be honored, and that genuine wisdom resides not in choosing between poles but in holding them both in creative tension. Your mind naturally gravitates toward synthesis, integration, and the discovery of unity beneath apparent opposition.

The light of this decan is the capacity to articulate a vision of justice that is genuinely universal. Your Jupiterian expansiveness gives you access to philosophical, spiritual, and cultural perspectives that transcend the parochial concerns of your immediate environment. You are a natural teacher of wisdom traditions, an interpreter of symbols, a bridge between worldviews that seem incommensurable. Your optimism is not naive but earned — it arises from a genuine experience of the way apparent contradictions resolve into higher unities when viewed from a sufficiently elevated perspective. You are the mediator not just between individuals but between cultures, paradigms, and historical epochs, carrying the capacity to translate across difference in ways that create genuine understanding rather than superficial compromise.

The shadow of Jupiterian Libra is the inflation of the harmonizing function into a kind of spiritual bypass. Your love of synthesis can become an avoidance of the genuinely irreconcilable — a premature rush to resolution that short-circuits the necessary work of sitting with tension, conflict, and the possibility that some differences may be real and irreconcilable. Your philosophical scope can become a refuge from the mundane demands of actual relationship — it is easier to love humanity in the abstract than to be kind to the difficult person sitting across from you at breakfast. The Philosopher of Balance at their most shadowed becomes the Ivory Tower Diplomat — someone whose "wisdom" is untethered from practice, whose "fairness" is theoretical, and whose expansive vision serves as an elegant excuse for avoiding the messy, particular, and often intractable conflicts of actual human life. The deepest challenge of this decan is to learn that the most profound philosophy is validated not by its elegance but by its capacity to guide action in the concrete, and that the truest balance is not a static equilibrium but a dynamic dance.`,
  },

  // ── SCORPIO ────────────────────────────────────────────────────────────────
  {
    sign: 'Scorpio', decanNumber: 1, rulingPlanet: 'Mars',
    dateRange: 'Oct 23 – Nov 1',
    title: 'The Intense',
    interpretation: `This is Mars in its most concentrated, penetrating, and psychologically acute expression — Scorpio's first decan, where the warrior impulse is turned inward, downward, into the depths of the psyche and the shadow. The Intense is not satisfied with surface explanations, casual connections, or comfortable truths. You need to know what is really going on — beneath the social performance, beneath the polite fiction, beneath the stories people tell themselves to avoid confronting their own darkness. Your perception is not broad but deep; you may not notice everything, but what you do notice, you see all the way through to its hidden core. This makes you an extraordinary investigator — whether of crime scenes, psychological patterns, or the hidden dynamics of power that structure human institutions.

The light of this decan is the capacity to transform through penetration. You possess a kind of psychological courage that is rarer and more demanding than physical bravery: the willingness to look directly at what is ugly, shameful, or terrifying, in yourself and in others, without flinching or looking away. Your honesty is not the social performance of "being real" but a genuine commitment to truth that is willing to sacrifice comfort, reputation, and even relationship to see clearly. This gives you an extraordinary capacity for healing — your willingness to go into the darkness makes you a safe companion for others who need to go there too. You do not reassure; you accompany. You do not comfort; you witness. And in your witnessing, transformation becomes possible.

The shadow of Martian Scorpio is the seductive pull of the very darkness you seek to understand. Your fascination with the hidden, the taboo, and the powerful can become a kind of magnetic attraction that draws you into dynamics of control, manipulation, and emotional violence — first as observer, then as participant. You may discover that your "investigation" of power is really a quest for it, and that your penetrating insight has become a weapon rather than a tool for healing. The Intense at their most shadowed becomes the Emotional Predator — someone who uses their psychological acuity to dominate, to manipulate, to find and press the hidden buttons that give them leverage over others. You may also struggle with an inability to let things be light, to accept the surface of life as sufficient, to trust that not everything needs to be dissected to its core. The deepest challenge of this decan is to learn that the most profound penetration is always accompanied by love, and that the scorpion who cannot control its own sting eventually poisons only itself.`,
  },
  {
    sign: 'Scorpio', decanNumber: 2, rulingPlanet: 'Sun',
    dateRange: 'Nov 2 – Nov 11',
    title: 'The Alchemist',
    interpretation: `When the Sun rules the second decan of Scorpio, the Plutonian darkness is illuminated from within. The Alchemist is Scorpio with the solar capacity to not merely investigate the shadow but to transform it — to take the raw, dangerous material of the unconscious and, through the conscious application of fire and will, transmute it into gold. You do not merely survive your encounters with darkness; you metabolize them, extracting wisdom, power, and even beauty from experiences that would destroy or embitter others. Your life follows the alchemical pattern of solve et coagula — dissolve and recombine — and you are perpetually in the process of dying to what you were in order to become what you are becoming.

The light of this decan is the capacity for genuine regeneration. Your solar consciousness, operating within the Plutonian depths, gives you access to a source of power that is not personal but archetypal — the phoenix energy that rises from its own ashes, again and again, in ever more refined forms. You possess an extraordinary resilience that is not denial or suppression but genuine transformation; you do not "bounce back" from crisis so much as you are remade by it into something more integrated and more powerful. This makes you an extraordinary healer, therapist, or spiritual guide — not because you have avoided suffering but because you have learned to use it as raw material for growth. Your presence carries the authority of someone who has been through the fire and emerged not merely intact but enhanced.

The shadow of solar Scorpio is the dangerous intoxication of power. Your capacity for transformation, when separated from humility and service, can curdle into a kind of megalomania — the conviction that you are entitled to manipulate, control, and "transform" others according to your vision of what they should become. The Alchemist at their most shadowed becomes the Dark Magician — someone who uses their genuine gifts for domination rather than liberation, whose "transformation" of others is really a colonization of their autonomy. You may also struggle with a profound terror of your own vulnerability that drives you to maintain control at all costs — needing to be the one who knows, the one who sees, the one who holds the power in every interaction. The deepest challenge of this decan is to learn that the greatest alchemical achievement is not the transmutation of lead into gold but the transmutation of the will to power into the will to love.`,
  },
  {
    sign: 'Scorpio', decanNumber: 3, rulingPlanet: 'Moon',
    dateRange: 'Nov 12 – Nov 21',
    title: 'The Seer',
    interpretation: `When the Moon governs the third decan of Scorpio, the Plutonian intensity is channeled through the lunar portal of intuition, dreams, and deep emotional knowing. The Seer is Scorpio with the psychic aperture wide open — your penetration is not primarily intellectual or will-driven but receptive, intuitive, and attuned to frequencies that others cannot perceive. You know things you have no rational basis for knowing; you feel the emotional truth of a situation before a single fact has been established; you receive information through dreams, synchronicities, and the subtle signals that the rational mind dismisses as coincidence. Your inner world is not a private space but a receiver, constantly picking up transmissions from the collective unconscious and the emotional field of everyone around you.

The light of this decan is the gift of genuine clairvoyance — not necessarily in the theatrical sense of predicting lottery numbers, but in the deeper sense of perceiving the hidden emotional architecture of any situation. You can feel what is unspoken, sense what is suppressed, and intuit the trajectory of relationships and institutions before their collapse or transformation becomes visible to others. Your lunar-Scorpio sensitivity makes you an extraordinary poet, artist, therapist, or spiritual practitioner — anyone whose work requires the ability to navigate the invisible dimensions of human experience. You are the keeper of ancestral wisdom, the channel for what wants to be born, the midwife of emergent consciousness.

The shadow of lunar Scorpio is the overwhelming intensity of an unprotected psychic life. Your receptivity, without strong boundaries, can become a curse — you are bombarded by emotional information you cannot filter, drowning in feelings that are not your own, unable to distinguish between your authentic emotional experience and the collective atmosphere you are perpetually absorbing. The Seer at their most shadowed becomes the Emotional Vortex — someone whose powerful intuition has degenerated into paranoia, whose "insights" are projections, and whose profound sensitivity has become a justification for manipulative emotional drama. You may also struggle with a kind of emotional vampirism — a hunger for intensity that drives you to provoke crisis in otherwise stable situations because the calm feels like death and only the storm feels alive. The deepest challenge of this decan is to learn that the greatest psychic gift is not the ability to perceive everything but the wisdom to know what to let in and what to keep out, and that the most powerful seer is one who has learned to close their eyes.`,
  },

  // ── SAGITTARIUS ────────────────────────────────────────────────────────────
  {
    sign: 'Sagittarius', decanNumber: 1, rulingPlanet: 'Jupiter',
    dateRange: 'Nov 22 – Dec 1',
    title: 'The Explorer',
    interpretation: `This is Jupiter in its most expansive, adventurous, and freedom-oriented expression — Sagittarius' first decan, where the planetary impulse toward growth, meaning, and exploration operates without constraint. The Explorer is constitutionally oriented toward the horizon; you experience the unknown not as threat but as invitation, and your fundamental relationship to life is one of forward motion. You are the archer with the arrow already loosed — your orientation is toward what is coming, what is possible, what lies just beyond the edge of the currently known. This gives you a quality of perpetual youthfulness, a freshness of perspective that resists cynicism, and a resilience that comes from genuine faith in the fundamental benevolence of the unfolding universe.

The light of this decan is the gift of inspired vision. You can see possibility where others see only constraint, meaning where others see only chaos, and opportunity where others see only risk. Your optimism is not a personality trait but a metaphysical orientation — you genuinely believe, at a level deeper than conscious philosophy, that life is fundamentally meaningful and that the journey is as important as the destination. This makes you an extraordinary teacher, storyteller, entrepreneur, or explorer — anyone whose work requires the ability to inspire others with a vision of what could be. Your enthusiasm is contagious; your faith in the future is not naive but generative, actually creating the conditions it believes in through the sheer force of its conviction.

The shadow of Jupiterian Sagittarius is the shadow side of expansion: excess, overreach, and the flight from commitment that masquerades as freedom. Your love of the horizon can become an inability to inhabit the present — an addiction to anticipation that prevents you from ever truly arriving anywhere. You may accumulate experiences the way others accumulate possessions, mistaking movement for growth and novelty for wisdom. The Explorer at their most shadowed becomes the Eternal Runaway — someone whose "freedom" is really an avoidance of the demands that genuine intimacy, genuine mastery, and genuine rootedness inevitably make. Your famous honesty can become a kind of brutality; your "truth-telling" may be less about truth than about the thrill of transgression, and your bluntness may leave wounds that your own forward momentum prevents you from ever stopping to acknowledge. The deepest challenge of this decan is to learn that the most profound exploration is not horizontal but vertical — not the accumulation of external experiences but the deepening of internal presence, and that the most exciting horizon is the one you discover inside yourself when you finally stop running.`,
  },
  {
    sign: 'Sagittarius', decanNumber: 2, rulingPlanet: 'Mars',
    dateRange: 'Dec 2 – Dec 11',
    title: 'The Warrior-Sage',
    interpretation: `When Mars rules the second decan of Sagittarius, the philosophical archer becomes a crusader. The Warrior-Sage is Sagittarius with its convictions armed and mobilized — your beliefs are not abstract propositions to be debated in comfortable seminar rooms but living truths for which you are willing to fight, sacrifice, and if necessary, die. You possess an unusual combination of intellectual conviction and physical courage that makes you a formidable advocate for whatever cause or vision has claimed your allegiance. Your passion is not merely emotional but ideological; you are animated by ideas the way others are animated by personal desire, and your energy in service of your beliefs is nothing short of extraordinary.

The light of this decan is the capacity to translate wisdom into action. You do not merely understand; you enact. Your Martian influence gives you the decisiveness and courage that pure Jupiter sometimes lacks — the willingness to stop contemplating the map and start moving through the territory, to risk error in the service of truth, to accept that an imperfect action in the right direction is better than a perfect theory that never leaves the page. This makes you an extraordinary activist, missionary, reformer, or champion of justice — anyone whose work requires the marriage of philosophical clarity with the willingness to fight for its realization in the face of genuine opposition.

The shadow of Martian Sagittarius is the dangerous fusion of conviction and aggression. Your certainty, when untempered by humility, can become fanaticism — the kind of righteous fury that justifies any means in service of the end, that dehumanizes opponents as obstacles to be eliminated rather than fellow travelers with their own legitimate perspectives. The Warrior-Sage at their most shadowed becomes the Zealot — someone whose "truth" has become a weapon, whose passion has curdled into intolerance, and whose martial energy serves not wisdom but the ego's need to be right at any cost. You may also struggle with a kind of intellectual arrogance that dismisses complexity in favor of clean, actionable, and ultimately reductive narratives — preferring the satisfying clash of certainties to the patient, ambiguous work of genuine understanding. The deepest challenge of this decan is to learn that the most important battle is always the one within, and that the warrior who has not first conquered their own dogmatism is merely a soldier for their own unconscious.`,
  },
  {
    sign: 'Sagittarius', decanNumber: 3, rulingPlanet: 'Sun',
    dateRange: 'Dec 12 – Dec 21',
    title: 'The Illuminator',
    interpretation: `When the Sun rules the third decan of Sagittarius, the Jupiterian quest for meaning is crowned with solar radiance. The Illuminator is Sagittarius elevated from seeker to source — you do not merely pursue wisdom; you embody it in such a way that your very presence illuminates the path for others. Your understanding is not theoretical but lived; you have integrated your knowledge so thoroughly that it shines through you as a quality of being rather than a collection of propositions. You are the teacher who transforms through presence rather than pedagogy, the guide whose own journey has become a light for those who follow, the philosopher whose life is the most compelling argument for their philosophy.

The light of this decan is the capacity to inspire genuine awakening in others. Your solar consciousness, operating through the Jupiterian lens of meaning and purpose, gives you access to a kind of spiritual authority that is not claimed but recognized. You do not need to convince anyone of anything; your own alignment with truth is so palpable that it becomes an invitation for others to find their own alignment. You possess an extraordinary generosity of spirit — your wisdom is not hoarded but shared, your light is not focused on yourself but radiated outward to illuminate whatever you touch. This makes you a natural spiritual teacher, mentor, cultural leader, or anyone whose role is to help others discover their own sovereignty.

The shadow of solar Sagittarius is the subtle inflation of the teacher archetype into the guru complex. Your genuine radiance can, without vigilant self-examination, curdle into a conviction of your own specialness — the belief that you are not merely a conduit for wisdom but its source, not merely a light but the light. The Illuminator at their most shadowed becomes the False Prophet — someone whose charisma creates dependency rather than liberation, whose "teachings" are designed to aggrandize the teacher rather than empower the student, and whose spiritual authority is exercised as control rather than invitation. You may also struggle with a kind of spiritual restlessness that prevents you from ever settling into genuine depth — always seeking the next revelation, the next teaching, the next peak experience, never integrating what you have already received. The deepest challenge of this decan is to learn that the greatest illumination is that which reveals itself as one light among many, and that the truest teacher is one who leads others not to their own feet but to their own inner authority.`,
  },

  // ── CAPRICORN ──────────────────────────────────────────────────────────────
  {
    sign: 'Capricorn', decanNumber: 1, rulingPlanet: 'Saturn',
    dateRange: 'Dec 22 – Dec 31',
    title: 'The Climber',
    interpretation: `This is Saturn in its most concentrated, disciplined, and achievement-oriented expression — Capricorn's first decan, where the planetary impulse toward structure, mastery, and long-term accomplishment operates at full intensity. The Climber is constitutionally oriented toward the summit; you perceive life as a mountain to be ascended, and your fundamental relationship to time is one of patient, strategic investment. You understand, at a level that others often cannot grasp, that anything worth achieving requires sustained effort over periods measured in years and decades, not weeks and months. Your ambition is not flashy but geological — slow, inexorable, and ultimately irresistible.

The light of this decan is the capacity for genuine mastery. You possess an almost monastic devotion to discipline — a willingness to do the unglamorous, repetitive work that genuine excellence requires, long after the initial excitement has faded and the audience has gone home. Your patience is not passive but active; you are not waiting but building, and every moment of apparent stillness is actually accumulation — of skill, of knowledge, of the structural integrity that will eventually support the weight of your ambitions. This makes you an extraordinary builder of institutions, a reliable steward of resources, and a leader whose authority is earned through demonstrated competence rather than charisma alone.

The shadow of Saturnian Capricorn is the dark side of ambition: the gradual sacrifice of the living to the durable, the present to the future, the warm to the merely respectable. Your discipline can become a prison; your patience can become a refusal to live; your strategic orientation can become an inability to experience joy, spontaneity, or the kind of aimless presence that is the soil in which love and creativity grow. The Climber at their most shadowed becomes the Hollow Achiever — someone who reaches the summit only to discover that the view is empty, that the sacrifices made along the way have cost everything that would have made the achievement meaningful. You may also struggle with a profound fear of failure that masquerades as diligence — a terror that if you stop climbing, even for a moment, you will fall not just from the mountain but from your own worthiness to exist. The deepest challenge of this decan is to learn that the mountain is not the point — the climber is — and that a life spent reaching the top is wasted if you forgot to live on the way up.`,
  },
  {
    sign: 'Capricorn', decanNumber: 2, rulingPlanet: 'Venus',
    dateRange: 'Jan 1 – Jan 10',
    title: 'The Statesman',
    interpretation: `When Venus governs the second decan of Capricorn, the Saturnian drive for achievement is softened, socialized, and directed toward the cultivation of genuine influence rather than mere position. The Statesman is Capricorn with charm — all the ambition and discipline of the sign, but now operating through relationship, diplomacy, and the elegant exercise of power rather than solitary grinding. You understand that the most effective authority is not the kind that is imposed but the kind that is granted — that people follow those they trust, respect, and genuinely like, and that likability is a form of power that must be cultivated with the same discipline as any other skill.

The light of this decan is the capacity to build consensus and wield authority with grace. Your Venusian influence brings warmth, social intelligence, and genuine relational skill to the Capricorn temperament; you are the rare climber who ascends without leaving a trail of resentful rivals, the rare authority figure who commands respect without demanding it. You possess an instinct for the aesthetics of power — the way environments, presentations, and interpersonal rituals shape perception and influence outcomes. This makes you an extraordinary diplomat, executive, politician, or any role that requires the marriage of strategic vision with the ability to bring diverse stakeholders into alignment. Your leadership style is not command-and-control but invitation-and-inspiration, and your legacy is built through relationships as much as through achievements.

The shadow of Venusian Capricorn is the subtle corruption of social grace into manipulation. Your relational intelligence, when separated from genuine care, can become a sophisticated instrument of control — the charm that disarms, the warmth that extracts, the friendship that is always, at some level, strategic. The Statesman at their most shadowed becomes the Courtier — someone whose entire identity is a performance calibrated to gain advantage, whose "relationships" are transactions, and whose soul has been hollowed out by the perpetual calculation of social positioning. You may also struggle with a kind of emotional austerity that uses charm as a substitute for genuine vulnerability — you know how to be liked but not how to be intimate, how to network but not how to love. The deepest challenge of this decan is to learn that the most durable influence is built on authenticity rather than impression management, and that the statesman who has lost their own heart cannot truly lead anyone anywhere worth going.`,
  },
  {
    sign: 'Capricorn', decanNumber: 3, rulingPlanet: 'Mercury',
    dateRange: 'Jan 11 – Jan 19',
    title: 'The Strategist',
    interpretation: `When Mercury governs the third decan of Capricorn, the Saturnian mountain is ascended through intellect rather than sheer endurance. The Strategist is Capricorn with cunning — all the patience and discipline of the sign, but now deployed through mental agility, tactical thinking, and the ability to see several moves ahead on the chessboard of life. Your ambition is filtered through a mind that is precise, analytical, and extraordinarily practical; you do not merely want to succeed, you want to understand the mechanics of success so thoroughly that your ascent is not a gamble but an inevitability. You possess the rare ability to think in systems — to perceive the hidden architecture of institutions, markets, and social structures, and to navigate them with the precision of an engineer.

The light of this decan is the capacity for genuine strategic brilliance. Your Mercurial influence brings intellectual flexibility to the Capricorn temperament — you are not rigid in your methods, only in your commitment to results. You can adapt your approach without abandoning your goals; you can learn from failure because your identity is not tied to being right in every tactical decision. This makes you an extraordinary planner, organizer, systems architect, or anyone whose work requires the ability to translate long-term vision into effective daily action. Your mind is a powerful instrument — disciplined enough to stay focused on distant objectives, flexible enough to pivot when circumstances change, and sharp enough to identify the leverage points that others overlook.

The shadow of Mercurial Capricorn is the reduction of life to a strategy game. Your tactical intelligence, when disconnected from deeper values, can become a kind of cold pragmatism that views people as pieces to be positioned rather than souls to be encountered. Your capacity for long-term thinking can degenerate into a Machiavellian manipulation that subordinates all human considerations — love, loyalty, compassion — to the logic of advantage. The Strategist at their most shadowed becomes the Chess Master — someone who has won every game but lost every genuine connection, who has outmaneuvered everyone but is ultimately alone in an elegantly constructed fortress of their own making. You may also struggle with a kind of mental overactivity that prevents you from resting in the simplicity of being — always planning, always optimizing, always three moves ahead, never present to the moment that is actually here. The deepest challenge of this decan is to learn that the most important strategy is the one that preserves your humanity, and that winning at the cost of your soul is the only loss from which there is no recovery.`,
  },

  // ── AQUARIUS ───────────────────────────────────────────────────────────────
  {
    sign: 'Aquarius', decanNumber: 1, rulingPlanet: 'Uranus',
    dateRange: 'Jan 20 – Jan 29',
    title: 'The Visionary',
    interpretation: `This is Uranus in its most radical, innovative, and paradigm-shattering expression — Aquarius' first decan, where the planetary impulse toward awakening, liberation, and the overthrow of obsolete structures operates at maximum voltage. The Visionary perceives reality not as it is but as it could be; your consciousness is tuned to the frequency of the emergent, the potential, the not-yet-born. You do not accept the world as given; you experience it as a rough draft, an approximation, a temporary arrangement that is perpetually on the verge of its next evolutionary leap. Your mind operates discontinuously — not in linear chains of reasoning but in quantum leaps that arrive fully formed, insights that seem to come from the future rather than the past.

The light of this decan is the capacity to catalyze genuine transformation. You are not merely a dreamer but a disruptor — your vision is not passive fantasy but active intervention, and your presence in any system is inherently destabilizing to its obsolete elements. You possess an intuitive grasp of the direction of history; you can feel what wants to emerge, what structures are ready to collapse, what innovations are ripe for manifestation. This makes you an extraordinary inventor, reformer, futurist, or revolutionary — anyone whose work requires the ability to perceive possibilities that do not yet exist and to midwife them into being against the resistance of entrenched interests.

The shadow of Uranian Aquarius is the dark side of radical vision: detachment, unpredictability, and the kind of revolutionary fervor that sacrifices human relationship on the altar of ideological purity. Your distance from convention can become a distance from humanity itself; your vision of a better future can become a justification for treating present people as disposable. The Visionary at their most shadowed becomes the Cold Utopian — someone whose love for humanity in the abstract coexists with a profound inability to love actual humans in the particular, whose brilliant ideas serve to aggrandize their own sense of specialness rather than to liberate anyone, and whose radicalism is more about rebellion against authority than genuine service to the collective. You may also struggle with a kind of spiritual vertigo — a disconnection from the body, from emotion, from the grounded ordinariness of human life that leaves you brilliant but untethered, a satellite in permanent orbit, transmitting signals that no one on the ground can decode. The deepest challenge of this decan is to learn that the most radical vision is one that includes the heart, and that the future worth building is one in which everyone, including you, is permitted to be fully human.`,
  },
  {
    sign: 'Aquarius', decanNumber: 2, rulingPlanet: 'Mercury',
    dateRange: 'Jan 30 – Feb 8',
    title: 'The Innovator\'s Voice',
    interpretation: `When Mercury governs the second decan of Aquarius, the Uranian lightning is given language — the visionary impulse is translated into communication, systems of thought, and the concrete articulation of what the first decan merely intuits. The Innovator's Voice is Aquarius with the gift of expression; your radical insights do not remain locked in your own mind but are transmitted, taught, and propagated through the mercurial channels of language, writing, teaching, and networking. You are the rare visionary who can actually explain what you see — who can build the intellectual bridges that allow others to cross from the old paradigm into the new one without feeling disoriented or left behind.

The light of this decan is the capacity to democratize innovation. Your Mercurial influence gives you the communication skills to make complex, futuristic, or counterintuitive ideas accessible to a broad audience. You are a natural educator of the avant-garde, a popularizer of the cutting edge, a translator between the visionary fringe and the mainstream. Your mind is extraordinarily agile — capable of holding the big picture and the granular detail simultaneously, of moving between abstract theory and concrete application with fluid grace. This makes you an extraordinary writer, speaker, teacher, or community organizer — anyone whose work requires the ability to articulate a compelling vision of the future in terms that inspire action in the present.

The shadow of Mercurial Aquarius is the reduction of radical vision to intellectual fashion. Your gift for articulation can become a kind of verbal facility that substitutes for genuine depth — the ability to sound brilliant without necessarily being profound, to impress without necessarily illuminating. Your love of ideas can become a collecting habit, accumulating concepts the way others accumulate possessions, mistaking the possession of novel information for the cultivation of wisdom. The Innovator's Voice at their most shadowed becomes the Intellectual Dandy — someone whose "radicalism" is a performance, a costume, a social signal rather than a lived commitment, and whose dazzling conversation leaves no trace because it was never rooted in anything deeper than the desire to be seen as interesting. You may also struggle with a kind of mental restlessness that prevents you from committing to any single line of inquiry long enough to bear genuine fruit — always moving to the next idea, the next paradigm, the next intellectual thrill. The deepest challenge of this decan is to learn that the most innovative communication is that which changes not just minds but hearts, and that the true measure of intellectual brilliance is not its novelty but its capacity to serve life.`,
  },
  {
    sign: 'Aquarius', decanNumber: 3, rulingPlanet: 'Venus',
    dateRange: 'Feb 9 – Feb 18',
    title: 'The Humanitarian Artist',
    interpretation: `When Venus governs the third decan of Aquarius, the Uranian impulse toward collective liberation is sweetened, humanized, and expressed through beauty, relationship, and the arts of the heart. The Humanitarian Artist is Aquarius with soul — the radical vision of the sign, but now grounded in love, empathy, and a genuine delight in the particularity of individual human beings. You do not merely want to change the world; you want to make it more beautiful, more kind, and more hospitable to the full range of human experience. Your idealism is not abstract but embodied; it expresses itself through the quality of your relationships, the aesthetics of your environment, and the care with which you treat everyone you encounter, regardless of their status or significance.

The light of this decan is the capacity to create beauty in service of liberation. Your Venusian influence brings warmth, charm, and genuine relational skill to the Aquarian temperament; you are the rare revolutionary who is also delightful company, the rare visionary who remembers that the revolution must include pleasure, art, and the cultivation of joy. You possess an unusual aesthetic sensibility that is both avant-garde and humane — drawn to the new but never at the expense of the tender, the intimate, or the genuinely caring. This makes you an extraordinary artist, community builder, healer, or cultural innovator — anyone whose work requires the marriage of progressive vision with genuine love for the people that vision is meant to serve.

The shadow of Venusian Aquarius is the subtle substitution of aesthetic radicalism for genuine transformation. Your love of beauty can become a way of decorating the cage rather than dismantling it — creating lovely alternative spaces that feel revolutionary but never actually challenge the structures of power in any meaningful way. Your charm can become a form of avoidance — the ability to make everyone feel good in the moment without ever having the difficult conversations that genuine change requires. The Humanitarian Artist at their most shadowed becomes the Boutique Revolutionary — someone whose "activism" is expressed through consumer choices and Instagram aesthetics, whose "community" is a carefully curated network of like-minded aesthetes, and whose radical vision has been safely contained within the boundaries of cultural consumption. You may also struggle with a kind of emotional promiscuity that mistakes friendliness for friendship and charm for intimacy — spreading your relational energy so thin that no single connection receives the depth it deserves. The deepest challenge of this decan is to learn that the most beautiful revolution is the one that transforms not just structures but souls, and that genuine humanitarianism requires not just love for humanity but the hard, unglamorous work of loving specific, difficult, imperfect individuals.`,
  },

  // ── PISCES ─────────────────────────────────────────────────────────────────
  {
    sign: 'Pisces', decanNumber: 1, rulingPlanet: 'Neptune',
    dateRange: 'Feb 19 – Feb 29',
    title: 'The Dreamer',
    interpretation: `This is Neptune in its most oceanic, transcendent, and boundary-dissolving expression — Pisces' first decan, where the planetary impulse toward unity consciousness, mystical perception, and the dissolution of the ego operates at full intensity. The Dreamer experiences reality as fundamentally fluid, porous, and interconnected; your consciousness does not respect the conventional boundaries between self and other, inner and outer, real and imagined. You live with one foot perpetually in the invisible world — the realm of dreams, symbols, archetypes, and the subtle currents of collective emotion that most people only access in sleep or altered states. Your sensitivity is not a trait but a condition; you cannot not feel what is happening in the collective field, and the distinction between your own emotions and the emotions of the world around you is, at best, approximate.

The light of this decan is the capacity for genuine mystical perception and transcendent creativity. Your access to the imaginal realm — the source from which all art, myth, and spiritual vision arises — is unusually direct and unfiltered. You do not need to learn to be creative; creativity is your native state, as natural to you as breathing, because the barrier between your individual consciousness and the collective unconscious is thinner than it is for most people. This makes you an extraordinary artist, mystic, healer, or spiritual guide — anyone whose work requires the ability to perceive and transmit realities that exist beyond the reach of the rational mind. Your compassion is not learned but constitutional; you literally feel what others feel, and this makes cruelty nearly impossible and indifference a constant struggle.

The shadow of Neptunian Pisces is the dissolution of the self into the oceanic field. Your boundarylessness, without strong containment, can become a kind of psychic drowning — the inability to distinguish between inspiration and delusion, between genuine spiritual experience and wishful fantasy, between empathic attunement and emotional enmeshment. The Dreamer at their most shadowed becomes the Lost Soul — someone so open to the invisible that they have lost the ability to navigate the visible, so attuned to the transcendent that they cannot manage the mundane, so empathetic that they have no self left to do the empathizing. You may also struggle with a powerful undertow toward escapism in all its forms — substances, fantasies, relationships that promise fusion, spiritual bypasses that offer transcendence without the hard work of integration. The deepest challenge of this decan is to learn that the most profound mysticism is practiced with feet on the ground, and that the dreamer who cannot wake up is not enlightened but merely lost.`,
  },
  {
    sign: 'Pisces', decanNumber: 2, rulingPlanet: 'Moon',
    dateRange: 'Mar 1 – Mar 10',
    title: 'The Empath',
    interpretation: `When the Moon governs the second decan of Pisces, the Neptunian ocean is given emotional structure, maternal warmth, and the capacity to hold rather than merely dissolve. The Empath is Pisces with a container — the oceanic sensitivity of the sign, but now grounded in the lunar principle of nurturing, protection, and the creation of emotional safety. Your empathy is not the abstract, impersonal compassion of pure Neptune but the warm, specific, motherly care of the Moon — you do not merely feel what others feel; you are moved to respond, to comfort, to feed, to shelter. Your sensitivity is directed toward the vulnerable, the wounded, and the in-need with a particularity and a tenderness that makes you a natural healer of hearts.

The light of this decan is the capacity to create genuine emotional sanctuary. Your lunar-Pisces sensitivity gives you an almost supernatural ability to perceive the unspoken emotional needs of others and to respond with exactly the kind of care that is most needed — a word, a touch, a silence, a meal, a presence that communicates safety without requiring explanation. You are the person others come to when they are broken, the ear that listens without judgment, the arms that hold without demand. Your creativity is nourished by the lunar realms of dream, memory, and the domestic — you may find that your deepest artistic or spiritual work emerges from the simple, sacred acts of caring for home, family, and the small daily rituals that sustain the soul.

The shadow of lunar Pisces is the drowning of the self in the needs of others. Your nurturing instinct, so beautiful in its genuine care, can become a kind of emotional caretaking that erases your own boundaries, your own needs, and ultimately your own identity. You may become so attuned to the suffering of others that you lose the capacity to experience joy; so responsive to the demands of care that you forget you are also someone who deserves to be cared for. The Empath at their most shadowed becomes the Emotional Sponge — someone who absorbs the pain of everyone around them until they are saturated with sorrow that is not even their own, who gives and gives until there is nothing left, and who mistakes self-erasure for saintliness. You may also struggle with a kind of emotional regression — a longing to be the cared-for rather than the carer, a secret resentment of the very people you serve, a passive-aggressive communication style that reveals the anger you cannot consciously acknowledge. The deepest challenge of this decan is to learn that the most profound empathy includes empathy for oneself, and that the nurturer who does not also nurture their own soul is pouring from an empty cup.`,
  },
  {
    sign: 'Pisces', decanNumber: 3, rulingPlanet: 'Mars',
    dateRange: 'Mar 11 – Mar 20',
    title: 'The Warrior Mystic',
    interpretation: `When Mars governs the third decan of Pisces, we encounter one of the zodiac's most paradoxical and potent configurations — the mystic with a sword, the dreamer who fights, the sensitive soul armed with the will to act. The Warrior Mystic is Pisces with spine; all the oceanic sensitivity of the sign, but now channeled through the martial discipline of courage, action, and the willingness to engage with the world rather than merely transcend it. You are not content merely to perceive the invisible; you must bring it into manifestation, fight for its realization, and protect what is sacred with the ferocity of a spiritual warrior. Your empathy does not make you passive; it makes you fierce in defense of the vulnerable.

The light of this decan is the capacity to act as a bridge between the spiritual and the material. Your Martian influence gives you the courage that pure Neptune often lacks — the willingness to incarnate your visions, to take risks in service of your ideals, to enter the messy, conflictual arena of human affairs without losing your connection to the transcendent source. This makes you an extraordinary spiritual activist, a defender of the marginalized, an artist whose work challenges rather than merely soothes, or anyone whose path requires the marriage of mystical depth with worldly courage. You are the Bodhisattva who returns to the marketplace, the prophet who speaks truth to power, the healer who enters the wound rather than merely observing it from a safe distance.

The shadow of Martian Pisces is the dangerous contamination of spiritual aspiration with the will to power. Your Mars energy, operating within the Neptunian field, can express as a kind of spiritualized aggression — the crusader who kills in the name of love, the mystic whose "truth" justifies coercion, the sensitive soul whose woundedness becomes a weapon. The Warrior Mystic at their most shadowed becomes the Fanatic Dreamer — someone whose genuine spiritual sensitivity has been hijacked by the Martian impulse to dominate, whose fight for justice has become indistinguishable from the lust for conquest, and whose sword serves not liberation but the ego's need to be righteous. You may also struggle with a kind of spiritual exhaustion that comes from the attempt to hold both the infinite and the finite simultaneously — a burnout born of trying to be both the ocean and the wave, the transcendent and the engaged, the saint and the soldier. The deepest challenge of this decan is to learn that the truest spiritual warrior fights not against enemies but against illusion, and that the sword is most powerful when it is wielded in service of the very compassion that made you pick it up.`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Determine zodiac sign from day/month
// ─────────────────────────────────────────────────────────────────────────────

function getZodiacSign(day: number, month: number): string {
  for (const boundary of SIGN_BOUNDARIES) {
    if (boundary.startMonth === 12 && boundary.endMonth === 1) {
      // Capricorn wraps the year boundary
      if (
        (month === 12 && day >= boundary.startDay) ||
        (month === 1 && day <= boundary.endDay)
      ) {
        return boundary.sign;
      }
    } else if (
      (month === boundary.startMonth && day >= boundary.startDay) ||
      (month === boundary.endMonth && day <= boundary.endDay)
    ) {
      return boundary.sign;
    }
  }
  return 'Capricorn'; // default fallback
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Determine decan number from day, month, and zodiac sign
// ─────────────────────────────────────────────────────────────────────────────

function getDecanNumber(day: number, month: number, sign: string): number {
  switch (sign) {
    case 'Aries':
      if (month === 3 && day >= 21 && day <= 30) return 1;
      if (month === 3 && day === 31) return 2;
      if (month === 4 && day <= 9) return 2;
      if (month === 4 && day >= 10) return 3;
      break;
    case 'Taurus':
      if (month === 4 && day >= 20 && day <= 29) return 1;
      if (month === 4 && day === 30) return 2;
      if (month === 5 && day <= 9) return 2;
      if (month === 5 && day >= 10) return 3;
      break;
    case 'Gemini':
      if (month === 5 && day >= 21 && day <= 31) return 1;
      if (month === 6 && day <= 10) return 2;
      if (month === 6 && day >= 11) return 3;
      break;
    case 'Cancer':
      if (month === 6 && day >= 21 && day <= 30) return 1;
      if (month === 7 && day <= 1) return 1;
      if (month === 7 && day >= 2 && day <= 12) return 2;
      if (month === 7 && day >= 13) return 3;
      break;
    case 'Leo':
      if (month === 7 && day >= 23 && day <= 31) return 1;
      if (month === 8 && day <= 1) return 1;
      if (month === 8 && day >= 2 && day <= 12) return 2;
      if (month === 8 && day >= 13) return 3;
      break;
    case 'Virgo':
      if (month === 8 && day >= 23 && day <= 31) return 1;
      if (month === 9 && day <= 2) return 1;
      if (month === 9 && day >= 3 && day <= 12) return 2;
      if (month === 9 && day >= 13) return 3;
      break;
    case 'Libra':
      if (month === 9 && day >= 23 && day <= 30) return 1;
      if (month === 10 && day <= 2) return 1;
      if (month === 10 && day >= 3 && day <= 12) return 2;
      if (month === 10 && day >= 13) return 3;
      break;
    case 'Scorpio':
      if (month === 10 && day >= 23 && day <= 31) return 1;
      if (month === 11 && day <= 1) return 1;
      if (month === 11 && day >= 2 && day <= 11) return 2;
      if (month === 11 && day >= 12) return 3;
      break;
    case 'Sagittarius':
      if (month === 11 && day >= 22 && day <= 30) return 1;
      if (month === 12 && day <= 1) return 1;
      if (month === 12 && day >= 2 && day <= 11) return 2;
      if (month === 12 && day >= 12) return 3;
      break;
    case 'Capricorn':
      if (month === 12 && day >= 22 && day <= 31) return 1;
      if (month === 1 && day <= 10) return 2;
      if (month === 1 && day >= 11) return 3;
      break;
    case 'Aquarius':
      if (month === 1 && day >= 20 && day <= 29) return 1;
      if (month === 1 && day >= 30) return 2;
      if (month === 2 && day <= 8) return 2;
      if (month === 2 && day >= 9) return 3;
      break;
    case 'Pisces':
      if (month === 2 && day >= 19 && day <= 29) return 1;
      if (month === 3 && day <= 10) return 2;
      if (month === 3 && day >= 11) return 3;
      break;
  }
  return 1; // default fallback
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the decan data for a given birth day and month.
 * The decan includes the ruling planet, date range, title, and
 * a full verbatim interpretation (200-400 words) covering both
 * light and shadow aspects, as well as how the decan modifies
 * the base zodiac sign's expression.
 *
 * @param day - Birth day (1-31)
 * @param month - Birth month (1-12)
 * @returns DecanResult with full verbatim interpretation
 */
export function getDecan(day: number, month: number): DecanResult {
  const sign = getZodiacSign(day, month);
  const decanNumber = getDecanNumber(day, month, sign);

  const decanEntry = DECAN_DATA.find(
    d => d.sign === sign && d.decanNumber === decanNumber
  );

  if (!decanEntry) {
    // Fallback — should not happen with valid inputs
    return {
      sign,
      decanNumber,
      rulingPlanet: 'Unknown',
      dateRange: 'Unknown',
      title: 'Unknown Decan',
      interpretation: 'No interpretation available for this date.',
    };
  }

  return {
    sign: decanEntry.sign,
    decanNumber: decanEntry.decanNumber,
    rulingPlanet: decanEntry.rulingPlanet,
    dateRange: decanEntry.dateRange,
    title: decanEntry.title,
    interpretation: decanEntry.interpretation,
  };
}
