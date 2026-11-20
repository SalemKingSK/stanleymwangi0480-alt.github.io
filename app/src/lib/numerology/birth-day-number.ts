/**
 * MYSTIQUE COMPASS — Birth Day Number Analysis
 *
 * The day of the month you were born (1-31) carries its own distinct
 * numerological signature independent of the Psychic Number. Each day
 * reveals specific talents, challenges, and karmic undertones.
 *
 * ALL TEXT IS VERBATIM. DO NOT SUMMARIZE OR TRUNCATE.
 */

export interface BirthDayResult {
  day: number;
  title: string;
  rulingNumber: number;
  keywords: string;
  interpretation: string;
}

const BIRTH_DAY_DATA: Record<number, BirthDayResult> = {
  1: {
    day: 1, title: 'The Pioneer', rulingNumber: 1,
    keywords: 'Leadership, independence, originality, initiative, willpower',
    interpretation: `BIRTH DAY 1 — The Pioneer

Those born on the 1st day of any month are marked by the pure, undiluted vibration of the number 1 — the Sun, the source, the origin point. This is the number of the self discovering itself through action. Birth Day 1 individuals are natural initiators — they do not wait for permission, they do not seek consensus before moving, and they possess an innate confidence that can appear either inspiring or intimidating, depending on the observer's disposition.

THE LIGHT: The Birth Day 1 person is the one who starts things. Projects, movements, conversations, revolutions — wherever something new is emerging, a Day 1 soul is likely at its origin. They possess a remarkable capacity for independent thought, uncolored by the opinions of others. Their originality is not studied or affected; it flows naturally from a psyche that simply does not process "what everyone else is doing" as relevant input. They are leaders not because they seek power but because they are constitutionally incapable of following. In relationships, they are loyal but require space — the 1 vibration suffocates without autonomy. Professionally, they excel in entrepreneurial, creative, and pioneering roles where convention is an obstacle rather than a guide.

THE SHADOW: The Day 1 shadow is isolation masquerading as independence. Because they so rarely seek input, they can become trapped in their own perspective, mistaking stubbornness for conviction and loneliness for self-sufficiency. The line between confidence and arrogance is thin and frequently crossed. They may dominate conversations, dismiss feedback as interference, and alienate collaborators who feel unheard. The deepest wound of the Day 1 is the fear of dependence — the terror that needing others is weakness. This fear can prevent the very intimacy and collaboration that would amplify their gifts beyond what solitary effort can achieve.

THE PRESCRIPTION: Learn the difference between independence and isolation. The strongest leaders are those who can stand alone WHEN NECESSARY, not those who must stand alone ALWAYS. Practice active receptivity — deliberately seeking and genuinely considering perspectives that challenge your own. The 1 vibration is a fire; it burns brightest when fed by diverse fuels, not when sealed in a vacuum.`,
  },
  2: {
    day: 2, title: 'The Diplomat', rulingNumber: 2,
    keywords: 'Cooperation, sensitivity, balance, intuition, partnership',
    interpretation: `BIRTH DAY 2 — The Diplomat

Those born on the 2nd day carry the vibration of the Moon — receptive, reflective, relational. The Day 2 soul does not impose itself upon the world; it responds to the world, mirroring and harmonizing. This is the number of the mediator, the counselor, the one who senses the unspoken tension in a room and instinctively works to resolve it. Day 2 individuals are exquisitely sensitive — not in the fragile sense, but in the instrumental sense: they are finely calibrated instruments that register emotional frequencies others miss entirely.

THE LIGHT: The Day 2 gift is the capacity for genuine partnership. Unlike the solitary 1, the 2 soul understands instinctively that the whole is greater than the sum of its parts, and they devote themselves to creating conditions in which collaboration flourishes. They are natural diplomats, able to see both sides of any conflict and articulate each perspective with empathy. Their intuition is remarkably acute — they "know" things about people and situations without being able to trace the knowing to specific evidence. In relationships, they are deeply devoted, sometimes to a fault. In professional life, they excel in roles requiring emotional intelligence, mediation, counseling, and any form of collaborative creation.

THE SHADOW: The Day 2 shadow is self-erasure through over-accommodation. Because they feel others' emotions so acutely, they may lose the boundary between "your feeling" and "my feeling," absorbing the emotional states of those around them until they no longer know what they themselves actually feel. This leads to indecisiveness — when every option is felt from every angle, choosing one feels like betrayal of the others. They may avoid conflict to the point of dishonesty, agreeing outwardly while resenting inwardly, accumulating a secret ledger of unexpressed grievances that eventually explodes. The deepest wound of the Day 2 is the belief that their value lies entirely in their usefulness to others — that they have no inherent worth beyond what they provide.

THE PRESCRIPTION: Develop what might be called "permeable boundaries" — the capacity to feel others' emotions WITHOUT becoming responsible for them. Your sensitivity is a gift, not an obligation. Practice stating preferences without justification: "I prefer this" is a complete sentence that requires no defense. The 2 vibration is water; it nourishes everything it touches, but it must be contained or it dissipates into the ground.`,
  },
  3: {
    day: 3, title: 'The Communicator', rulingNumber: 3,
    keywords: 'Expression, creativity, joy, sociability, optimism',
    interpretation: `BIRTH DAY 3 — The Communicator

Those born on the 3rd day carry Jupiter's expansive, generous vibration. The Day 3 soul is here to express — through words, art, performance, or simply through the infectious quality of their presence. These are the people who light up rooms, who make others feel more alive simply by being near them, whose laughter is remembered long after their words are forgotten. The 3 vibration is fundamentally creative; it cannot help but generate — ideas, connections, beauty, joy.

THE LIGHT: The Day 3 gift is the power of upliftment. These individuals possess a natural optimism that is not naive but generative — they do not ignore darkness; they illuminate it. Their creativity is versatile and prolific; they may express through multiple media, often switching between them as the spirit moves. Socially, they are magnetic — not through intensity (that is the 8 or 1) but through sheer delight. People leave interactions with Day 3 individuals feeling better than they arrived. Professionally, they excel in communication, arts, entertainment, teaching, and any role that involves bringing ideas to life in forms others can receive.

THE SHADOW: The Day 3 shadow is dispersion. Because the 3 vibration generates so abundantly, it can scatter its energy across too many expressions, leaving a trail of half-finished projects and half-kept promises. The line between versatile and scattered is crossed when output replaces depth — when the joy of starting eclipses the discipline of finishing. A subtler shadow is emotional superficiality: the Day 3's natural buoyancy can become a defense against genuine feeling, using humor and brightness to avoid the depths where real transformation occurs. The deepest wound is the fear that without the performance — the wit, the charm, the creativity — they are nothing.

THE PRESCRIPTION: Choose depth over breadth in at least ONE area of expression. The 3 vibration is a fountain; left un-channeled, it sprays everywhere and nourishes nothing. Directed through a single conduit, it can move mountains. Practice sitting with difficult emotions without immediately transmuting them into art or humor — some things must be felt before they can be expressed.`,
  },
  4: {
    day: 4, title: 'The Builder', rulingNumber: 4,
    keywords: 'Stability, discipline, practicality, order, endurance',
    interpretation: `BIRTH DAY 4 — The Builder

Those born on the 4th day carry the vibration of Saturn (or Uranus in some systems) — the energy of structure, foundation, and the patient accumulation of value over time. The Day 4 soul is not flashy. It does not seek the spotlight. It builds. Quietly, methodically, relentlessly, it constructs the frameworks upon which others later stand. These are the architects of reality — the ones who translate vision into blueprint and blueprint into brick.

THE LIGHT: The Day 4 gift is the capacity for sustained effort. Where others burn out, the 4 persists. Where others cut corners, the 4 reinforces. These individuals possess a relationship with time that is almost architectural — they understand that lasting things are built incrementally, that foundations matter more than facades, that the work done when no one is watching determines the integrity of what everyone will eventually see. They are reliable in a way that is increasingly rare — when a Day 4 person commits, the commitment is kept. Professionally, they excel in engineering, finance, construction, administration, and any field where systems, structures, and sustained discipline produce results.

THE SHADOW: The Day 4 shadow is rigidity. The same commitment to structure that enables great building can become a prison — an inflexibility that resists necessary change, a dogmatism that mistakes established method for revealed truth. The Day 4 individual may become the obstacle to the very progress they once enabled, defending old systems against new necessities. A subtler shadow is joylessness: the relentless focus on work and duty can crowd out spontaneity, pleasure, and the unproductive moments that feed the soul. The deepest wound is the belief that value is earned exclusively through effort — that rest is weakness and ease is suspect.

THE PRESCRIPTION: Build rest INTO the structure. The 4 vibration is an architect; let it design not only work systems but recovery systems. Schedule unstructured time as rigorously as you schedule productive time — paradoxically, this makes both more effective. Remember that the strongest structures are not the most rigid but the most resilient — trees that bend in storms survive; trees that refuse to bend break.`,
  },
  5: {
    day: 5, title: 'The Liberator', rulingNumber: 5,
    keywords: 'Freedom, change, adventure, versatility, sensuality',
    interpretation: `BIRTH DAY 5 — The Liberator

Those born on the 5th day carry Mercury's quicksilver vibration — the energy of change, movement, and the restless intelligence that cannot be contained. The Day 5 soul is constitutionally incapable of staying still. Not physically (though often that too), but psychically — the 5 vibration demands novelty, variety, and the perpetual expansion of experience. These are the explorers, the questioners, the ones who try everything at least once — not from recklessness but from a genuine, insatiable curiosity about what life offers.

THE LIGHT: The Day 5 gift is adaptability. These individuals thrive in conditions that paralyze others — uncertainty, rapid change, unfamiliar environments. Their versatility is remarkable: they can move between social circles, professional domains, and cultural contexts with an ease that seems almost chameleonic. They are natural communicators, able to translate between perspectives and find common ground across divides. Their sensuality is pronounced — they experience life through all five senses with unusual intensity, making them connoisseurs of food, music, touch, beauty, and experience itself. Professionally, they excel in travel, sales, media, entrepreneurship, and any role requiring rapid adaptation and broad rather than deep expertise.

THE SHADOW: The Day 5 shadow is the inability to commit. The same versatility that enables adaptation can become a flight from depth — leaving relationships, jobs, and projects the moment they require sustained investment or become predictable. The 5's pursuit of freedom can paradoxically become its own prison: the inability to stay anywhere long enough to build anything lasting. A subtler shadow is excess — the 5's sensory intensity can slide into addiction, whether to substances, experiences, or simply the adrenaline of perpetual novelty. The deepest wound is the terror of being trapped — of waking up one day to discover that choices have been made, paths have been closed, and the infinite possibility of youth has contracted into the finite reality of a committed life.

THE PRESCRIPTION: Distinguish between freedom FROM and freedom TO. Running from commitment is not freedom; it is fear disguised as liberation. True freedom is the capacity to CHOOSE commitment — to stay not because you must but because you have decided to. Choose one area of life where depth will be cultivated over years, not months. The 5 vibration is wind; it can lift others and carry seeds to fertile ground, or it can blow endlessly across empty plains, touching everything and holding nothing.`,
  },
  6: {
    day: 6, title: 'The Nurturer', rulingNumber: 6,
    keywords: 'Responsibility, love, service, harmony, beauty',
    interpretation: `BIRTH DAY 6 — The Nurturer

Those born on the 6th day carry Venus's harmonizing vibration — the energy of love made manifest through service, beauty, and the care of others. The Day 6 soul is the one others turn to in crisis, the one who instinctively knows what is needed and provides it without being asked. This is the number of the parent, the healer, the artist whose medium is not paint or sound but the well-being of those within their sphere of influence.

THE LIGHT: The Day 6 gift is the capacity for genuine, sustaining care. Unlike performative nurturance (which seeks recognition), the 6's care is structural — it builds environments in which others can thrive. These individuals create beauty as naturally as breathing — their homes, their work, their relationships all bear the unmistakable signature of someone who sees the potential harmony in every situation and instinctively moves toward it. They are the glue of families, communities, and organizations — not always visible, not always acknowledged, but utterly essential. Professionally, they excel in healthcare, education, counseling, hospitality, design, and any field where the well-being of others is the primary product.

THE SHADOW: The Day 6 shadow is the martyr complex — the transformation of care from gift to obligation, from freely given to resentfully demanded (by the self, if not by others). The 6 may give until there is nothing left, then feel betrayed when no one replenishes them — failing to recognize that they never asked and may have actively refused help. A subtler shadow is control disguised as care: "I'm only doing this because I love you" becomes a weapon, and the recipient's autonomy is quietly eroded under the guise of nurturance. The deepest wound is the belief that love must be EARNED through service — that without constant giving, the 6 has no claim on being loved in return.

THE PRESCRIPTION: Learn to receive. The 6 vibration is a vessel; it can pour out indefinitely only if it is also filled. Practice accepting help, compliments, and care without immediately reciprocating — let yourself be held sometimes. Distinguish between service that genuinely helps and service that merely maintains your self-image as a helper. The healthiest 6s give from overflow, not depletion.`,
  },
  7: {
    day: 7, title: 'The Seeker', rulingNumber: 7,
    keywords: 'Analysis, spirituality, solitude, wisdom, perfection',
    interpretation: `BIRTH DAY 7 — The Seeker

Those born on the 7th day carry the vibration of Neptune (or Ketu in Vedic systems) — the energy of the mystic, the philosopher, the one who is not satisfied with surfaces and demands to know what lies beneath. The Day 7 soul is the questioner who will not accept easy answers, the researcher who reads not to confirm but to discover, the spiritual seeker for whom inherited faith is never enough — only direct experience will satisfy.

THE LIGHT: The Day 7 gift is the capacity for depth. Where others skim, the 7 dives. Where others accept, the 7 interrogates. This is not cynicism but genuine intellectual and spiritual hunger — a refusal to be satisfied with the apparent when the actual remains unexplored. These individuals possess remarkable analytical abilities, able to deconstruct complex systems and perceive the principles underlying surface phenomena. Their spiritual orientation, whether expressed through organized religion or solitary practice, is authentic rather than performative — they seek truth, not comfort. Professionally, they excel in research, science, philosophy, spirituality, investigation, and any field requiring sustained, solitary focus.

THE SHADOW: The Day 7 shadow is isolation through superiority. The same analytical depth that enables insight can curdle into contempt for those who do not share it — the 7 may withdraw from social life not because they prefer solitude but because they have concluded (often incorrectly) that others cannot understand them. A subtler shadow is paralysis through perfectionism: the 7's high standards can prevent them from sharing work until it is "ready," which it never is. The deepest wound is the loneliness of the perpetual outsider — the sense of watching life from behind glass, understanding everything but participating in nothing.

THE PRESCRIPTION: Bridge the gap between insight and expression. The 7 vibration is a telescope; it sees far, but it must REPORT what it sees or the vision benefits no one. Practice sharing incomplete thoughts, tentative conclusions, works in progress. The spiritual path of the 7 is not to transcend the world but to bring wisdom BACK to it — to descend from the mountain and share what was seen.`,
  },
  8: {
    day: 8, title: 'The Executive', rulingNumber: 8,
    keywords: 'Power, authority, material mastery, ambition, judgment',
    interpretation: `BIRTH DAY 8 — The Executive

Those born on the 8th day carry Saturn's karmic vibration — the energy of material power, authority, and the consequences of how power is wielded. The Day 8 soul is here to master the material realm — not merely to accumulate but to understand the principles by which resources are generated, managed, and distributed. This is not greed; it is a curriculum. The 8 is learning the physics of power: that force has direction, that leverage has limits, that every material achievement carries a corresponding responsibility.

THE LIGHT: The Day 8 gift is executive capacity — the ability to see large-scale systems, to manage complex operations, to make decisions that affect many people, and to bear the weight of those decisions without crumbling. These individuals possess natural authority; they do not need to demand respect because their presence commands it. Their relationship with money is unusually developed — they understand that currency is a form of energy, not an end in itself, and they can generate, multiply, and direct financial resources with remarkable skill. Professionally, they excel in business, finance, law, management, and any role requiring the orchestration of resources toward defined objectives.

THE SHADOW: The Day 8 shadow is the corruption of power. The same executive capacity that can build enterprises and create value can, when untethered from ethics, become exploitation. The 8 may use people as instruments, viewing relationships through the lens of utility. A subtler shadow is the inability to rest: because the 8's identity is fused with achievement, periods of non-productivity feel like existential threat. The deepest wound is the fear of powerlessness — the terror of being at the mercy of forces one cannot control, which drives the endless accumulation of resources as an unconscious insurance policy against vulnerability.

THE PRESCRIPTION: Distinguish between power OVER and power WITH. The 8 vibration is a lever; it can move objects many times its own weight, but the DIRECTION it moves them is a moral choice. Practice generosity that truly costs something — not the donation of surplus but the sacrifice of security. The karmic law of the 8 is absolute: what you do with power returns to you multiplied. Use it to lift others, and you will be lifted. Use it to dominate others, and you will eventually be dominated by the very systems you built.`,
  },
  9: {
    day: 9, title: 'The Humanitarian', rulingNumber: 9,
    keywords: 'Compassion, universality, completion, wisdom, letting go',
    interpretation: `BIRTH DAY 9 — The Humanitarian

Those born on the 9th day carry Mars's (or the higher octave of) vibration — the energy of completion, universal love, and the wisdom that comes only from having experienced and released. The Day 9 soul is here to learn the hardest lesson: letting go. Not from indifference but from understanding that attachment to what has completed its cycle prevents the next cycle from beginning. This is the number of the old soul — not necessarily chronologically aged but spiritually mature, carrying a depth of perspective that comes from having seen many things end and many things begin.

THE LIGHT: The Day 9 gift is universal compassion. Unlike the 6's personal, face-to-face care, the 9's compassion is impersonal in the highest sense — it extends to people the 9 has never met, to causes that will not benefit them personally, to principles of justice and mercy that transcend individual relationships. These individuals possess a natural wisdom that others recognize and seek out — they are the elders of every group, regardless of age. Their creativity is often channeled into forms that serve collective rather than personal ends — art that heals, teaching that liberates, leadership that empowers rather than controls. Professionally, they excel in humanitarian work, the arts, education, healing, and any field where personal benefit is secondary to collective good.

THE SHADOW: The Day 9 shadow is the inability to receive. Because the 9 is so oriented toward giving and completion, they may struggle to accept help, love, or resources — feeling unworthy or believing that accepting would compromise their identity as a giver. A subtler shadow is the premature release of what has not yet been fully lived — the 9 may end relationships, projects, or phases before their lessons are complete, mistaking avoidance for transcendence. The deepest wound is the grief accumulated from many endings — the 9 has learned to let go but may not have learned to mourn, carrying unprocessed loss beneath a serene surface.

THE PRESCRIPTION: Learn to receive as generously as you give. The 9 vibration is a river that flows to the ocean; it gives all its water away, but it is constantly replenished by tributaries. Allowing yourself to be replenished is not selfishness; it is the maintenance of the channel through which your gifts flow. Practice staying through difficulty — not everything that is hard is meant to be released. Some things are meant to be transformed.`,
  },
  10: {
    day: 10, title: 'The Wheel of Fortune', rulingNumber: 1,
    keywords: 'Cycles, independence, new beginnings, originality, determination',
    interpretation: `BIRTH DAY 10 — The Wheel of Fortune

The 10th day carries a dual vibration: the 1 (the Sun, initiation, selfhood) and the 0 (the Void, the unmanifest, infinite potential). Unlike the pure Day 1, the Day 10 soul does not simply initiate — it initiates from a place of having touched emptiness and returned. The 0 behind the 1 gives this birth day a quality of fatefulness — a sense that this individual's life is marked by significant cycles, unexpected turns, and the mysterious operation of fortune that seems to both bless and test in equal measure.

THE LIGHT: The Day 10 gift is the capacity to begin again — and again, and again, without bitterness. These individuals possess a resilience that seems almost magical; they can lose everything and rebuild, fail spectacularly and return undiminished. The 0 gives them access to a deeper well of renewal than the pure 1 possesses. Their independence, like the Day 1's, is pronounced, but it is tempered by an awareness (conscious or unconscious) that the self is not the whole story — that forces beyond the ego are always at play. Professionally, they often experience dramatic reversals of fortune that, in retrospect, reveal themselves as necessary course corrections.

THE SHADOW: The Day 10 shadow is the danger of the wheel's downward turn. The same fortune that elevates can cast down, and the Day 10 individual may experience cycles of success and failure that feel outside their control. A subtler shadow is the misuse of the 0's void energy — periods of emptiness that are meant for renewal but are instead filled with anxiety, substance, or destructive relationships because the individual cannot tolerate the unmanifest state. The deepest wound is the fear that the wheel will turn again — that whatever has been built will be taken, as it has been before.

THE PRESCRIPTION: Learn to recognize the wheel's phases. When fortune favors you, build with humility, knowing the cycle will turn. When fortune tests you, rest in the knowledge that this too is temporary. The 10 vibration is the ouroboros — the serpent eating its own tail. Every ending is a beginning seen from a different angle.`,
  },
  11: {
    day: 11, title: 'The Illuminated', rulingNumber: 11,
    keywords: 'Intuition, inspiration, spiritual messenger, nervous sensitivity, vision',
    interpretation: `BIRTH DAY 11 — The Illuminated

Those born on the 11th day carry the Master Number 11 — the most intuitive of all vibrations, the number of the spiritual messenger, the visionary who sees what others cannot and feels what others do not. The Day 11 soul operates on a higher frequency than most — their nervous system is more sensitive, their perception more acute, their connection to the invisible realm more direct. This is not metaphor; those who live and work with 11s consistently report experiences that defy rational explanation.

THE LIGHT: The Day 11 gift is inspired insight — the capacity to receive knowledge directly, without the intermediary of logical deduction. These individuals "know" things. They receive downloads. They see solutions to problems that have stumped experts for years. Their intuition, when trusted, is remarkably accurate. They are natural channels for creative and spiritual energy — the artist whose work seems to come through them rather than from them, the teacher whose words resonate at a level beyond their apparent meaning. Professionally, they excel as artists, spiritual teachers, intuitives, inventors, and in any role where the product is inspiration rather than perspiration.

THE SHADOW: The Day 11 shadow is nervous system overload. The same sensitivity that enables extraordinary perception makes the 11 vulnerable to overwhelm — crowds, noise, conflict, and emotional intensity that others process easily can be debilitating. Without proper grounding, the 11 may develop anxiety disorders, phobias, or addictive patterns as unconscious attempts to dull the relentless input. A subtler shadow is the gap between vision and execution — the 11 sees clearly what COULD be but may lack the practical capacity to bring it into being, leading to a life of brilliant unrealized potential. The deepest wound is the loneliness of seeing what others cannot — of knowing things you cannot prove and sensing things you cannot explain.

THE PRESCRIPTION: Ground, ground, ground. The 11 vibration is a lightning rod; without a ground wire, the electricity has nowhere safe to go. Physical practices — exercise, manual work, time in nature — are not optional luxuries but essential maintenance. Develop a relationship with your intuition that includes DISCERNMENT — not every impulse is divine guidance, and learning to distinguish between authentic insight and anxious projection is the 11's primary curriculum.`,
  },
  12: {
    day: 12, title: 'The Creative Sacrifice', rulingNumber: 3,
    keywords: 'Expression, sensitivity, cycles, creativity, completion',
    interpretation: `BIRTH DAY 12 — The Creative Sacrifice

The 12th day carries the 3 vibration (1+2=3) filtered through the tension of its component digits: the 1 (self) and the 2 (other). This is the number of the artist who must navigate between solitary creation and collaborative expression, between the vision that arrives in private and the communication that reaches an audience. The Day 12 soul experiences life as a series of creative cycles — periods of intense output followed by necessary fallow, the rhythm of expression and retreat.

THE LIGHT: The Day 12 gift is the capacity to translate private vision into public form. Unlike the pure 3's free-flowing expression, the 12's creativity is more structured, more considered — it passes through the filter of the 1's individuality and the 2's sensitivity before emerging. The result is art, teaching, or communication that feels both deeply personal AND universally resonant. These individuals make excellent teachers, counselors, artists, and communicators whose work bridges the gap between self-expression and service to others.

THE SHADOW: The Day 12 shadow is the anxiety of the middle ground — neither fully independent (1) nor fully relational (2), the 12 may feel torn between solitude and company, never entirely comfortable in either. A subtler shadow is the tendency to sacrifice creative vision for approval — the 2's sensitivity to others' reactions can override the 1's authentic impulse. The deepest wound is the fear that one's creative output will be rejected — a fear that can prevent the expression from ever reaching completion.

THE PRESCRIPTION: Honor the cycle. The 12 vibration is the clock face — twelve hours, twelve months, the wheel of creative seasons. There is a time to create in solitude (1) and a time to share with others (2). Neither phase is more valid; both are necessary.`,
  },
  13: {
    day: 13, title: 'The Transformer', rulingNumber: 4,
    keywords: 'Change, regeneration, discipline, structure, rebirth',
    interpretation: `BIRTH DAY 13 — The Transformer

The 13th day carries the 4 vibration (1+3=4) but with an entirely different quality than the pure Day 4. Where the 4 builds, the 13 tears down and rebuilds. Where the 4 maintains, the 13 transforms. The number 13 has been feared across cultures not because it is evil but because it is POWERFUL — it represents death and rebirth, the destruction of what has outlived its purpose so that what is genuinely needed can emerge. The Day 13 soul is here to be an agent of necessary change.

THE LIGHT: The Day 13 gift is the capacity to facilitate transformation — in themselves, in others, in systems and structures that have become stagnant. These individuals possess an unusual tolerance for chaos and uncertainty; where others panic at the collapse of the familiar, the 13 recognizes the collapse as the necessary precondition for renewal. They are natural change agents, crisis managers, and healers who understand that genuine healing often requires things to get worse before they get better. Professionally, they excel in transformation-oriented roles: turnaround specialists, therapists, organizers, revolutionaries of various kinds.

THE SHADOW: The Day 13 shadow is the temptation to destroy what merely needs repair. Not every structure that shows cracks requires demolition; some need reinforcement. The 13's comfort with destruction can become a reflex, tearing down relationships, careers, and communities that could have been healed with patience rather than fire. A subtler shadow is identification with the "outcast" role — the 13 may embrace their feared status to the point of sabotaging acceptance when it is offered. The deepest wound is the accumulated grief of many endings — the 13 may witness more destruction than they can emotionally process.

THE PRESCRIPTION: Learn surgical precision. The 13 vibration is a scalpel, not a sledgehammer — it can remove what is diseased while preserving what is healthy. Before initiating change, ask: "What specifically needs to end, and what specifically needs to be preserved?" Not everything must burn for something new to grow.`,
  },
  14: {
    day: 14, title: 'The Communicator of Freedom', rulingNumber: 5,
    keywords: 'Movement, media, expression, independence, adaptability',
    interpretation: `BIRTH DAY 14 — The Communicator of Freedom

The 14th day carries the 5 vibration (1+4=5) with a distinctive emphasis on communication as the vehicle of liberation. The 1 (self) + 4 (structure) combine to produce a 5 (freedom) that is more deliberate than the pure Day 5 — freedom here is not just experienced but ARTICULATED. The Day 14 soul does not merely seek liberty; they communicate about it, teach it, advocate for it, and build structures (4) that preserve it for others.

THE LIGHT: The Day 14 gift is the power of the word in service of liberation. These individuals are natural communicators — writers, speakers, journalists, teachers — whose work consistently circles back to themes of freedom, movement, and the expansion of human possibility. They possess the 5's versatility and adaptability but channel it through more structured forms than the pure 5. Their charisma is verbal — they win people not through presence alone but through what they say and how they say it. Professionally, they excel in media, publishing, law, advocacy, and any field where communication drives change.

THE SHADOW: The Day 14 shadow is the misuse of communicative power — the capacity to persuade becoming manipulation, the gift of expression becoming propaganda. A subtler shadow is restlessness disguised as principle — the 14 may leave situations claiming the need for freedom when the real need is simply for novelty, causing harm to those who depended on their presence. The deepest wound, shared with the 5, is the terror of entrapment — but for the 14, this terror specifically manifests around being silenced, censored, or prevented from expressing.

THE PRESCRIPTION: Use your words to build bridges, not merely to burn them. The 14 vibration is a printing press — it can disseminate liberation or propaganda with equal efficiency. Choose your message consciously, and remember that the freedom to speak does not exempt you from responsibility for what you say.`,
  },
  15: {
    day: 15, title: 'The Magnetic Alchemist', rulingNumber: 6,
    keywords: 'Charisma, harmony, material magic, prosperity, love',
    interpretation: `BIRTH DAY 15 — The Magnetic Alchemist

The 15th day carries the 6 vibration (1+5=6) with a distinctive material and magnetic quality. The 1 (self) + 5 (freedom, sensuality) combine to produce a 6 (harmony, love, responsibility) that is unusually adept at manifesting material well-being. The Day 15 soul possesses what ancient texts called "the Midas touch" — an almost alchemical capacity to attract resources, opportunities, and favorable circumstances.

THE LIGHT: The Day 15 gift is material manifestation in service of love. These individuals can generate prosperity not through grinding effort but through the magnetic quality of their presence and the genuine care they invest in their endeavors. They are naturally attractive — not merely physically, but energetically; people and resources gravitate toward them. Their homes are beautiful, their relationships are warm, their professional lives tend to prosper. They are the friends who always seem to land on their feet, the colleagues whose projects somehow always work out. Professionally, they excel in fields involving beauty, hospitality, finance, and any form of service that generates tangible rewards.

THE SHADOW: The Day 15 shadow is the seduction of the material. The same magnetic capacity that attracts prosperity can become an addiction to acquisition — the 15 may accumulate without ever feeling satisfied, chasing the next manifestation before appreciating the current one. A subtler shadow is the confusion of love with luxury — believing that beautiful things and comfortable circumstances are substitutes for genuine emotional intimacy. The deepest wound is the fear that without the material trappings — the money, the beauty, the charm — they would be unlovable.

THE PRESCRIPTION: Practice gratitude for what has already manifested. The 15 vibration is a magnet; it works best when it is not desperate. The energy of "I have enough" attracts more than the energy of "I need more." Remember that the material realm is a reflection of the spiritual, not a replacement for it.`,
  },
  16: {
    day: 16, title: 'The Shattered Tower', rulingNumber: 7,
    keywords: 'Awakening, destruction of ego, spiritual crisis, rebirth, wisdom',
    interpretation: `BIRTH DAY 16 — The Shattered Tower

The 16th day carries the 7 vibration (1+6=7) through the most intense portal — the number 16 in esoteric numerology represents the Tower card in the Tarot: the sudden collapse of structures built on false foundations, the lightning strike that reveals what was hidden, the crisis that forces awakening. The Day 16 soul does not learn gently; they learn through falling and rising, through the demolition of what they thought they knew, through experiences that would break a less resilient spirit.

THE LIGHT: The Day 16 gift is profound wisdom earned through authentic experience. These individuals do not theorize about transformation; they have LIVED it, often multiple times. Their understanding of spiritual truth is not borrowed from books but forged in the fire of personal crisis. They make extraordinary healers, counselors, and spiritual teachers precisely because they have walked through the darkness they now help others navigate. Their ego, repeatedly shattered and rebuilt, becomes more transparent with each cycle — less a barrier between self and truth, more a clear window.

THE SHADOW: The Day 16 shadow is the repetition of the fall. Some 16 souls become addicted to crisis — unconsciously recreating the conditions of collapse because crisis has become their only familiar mode of transformation. A subtler shadow is pride in suffering — the 16 may develop a spiritual ego around their wounds, believing their pain makes them superior to those who have not suffered similarly. The deepest wound is the exhaustion of perpetual rebuilding — the 16 may eventually stop trying, settling into cynicism or despair because the cycle of destruction and renewal has worn them thin.

THE PRESCRIPTION: Learn the lesson so the tower does not need to fall again. The 16 vibration is an emergency alarm — it sounds until the fire is addressed. Once a pattern is genuinely understood and integrated, the crisis around that pattern will cease. Your suffering is not your identity; it is your curriculum. Graduate.`,
  },
  17: {
    day: 17, title: 'The Star', rulingNumber: 8,
    keywords: 'Hope, inspiration, material-spiritual bridge, longevity, fame',
    interpretation: `BIRTH DAY 17 — The Star

The 17th day carries the 8 vibration (1+7=8) through the most elevated portal — the number 17 represents the Star card in the Tarot: hope after devastation, inspiration that descends from above, the promise that follows the storm. The Day 17 soul carries a particular light — not the harsh glare of ego but the steady luminescence of someone who has survived darkness and emerged with something to share.

THE LIGHT: The Day 17 gift is the capacity to inspire after difficulty. These individuals possess a natural hopefulness that is not naive but hard-won — they have seen the worst and chosen to believe in the best anyway. Their material success (the 8 vibration) tends to come through spiritual or creative channels rather than purely commercial ones — they prosper by bringing inspiration into form. They often achieve recognition later in life, after a period of obscurity or struggle, and their fame (when it comes) is more enduring than the flashier success of others. Professionally, they excel as artists, spiritual leaders, innovators, and public figures whose message carries genuine uplift.

THE SHADOW: The Day 17 shadow is the expectation that inspiration alone is sufficient — neglecting the practical, material work (the 8 component) required to bring vision into reality. A subtler shadow is the "savior complex" — the 17 may position themselves as the rescuer of others, creating dependent relationships that ultimately harm both parties. The deepest wound is disillusionment — when the Star's hope is repeatedly disappointed, the 17 may swing to bitter cynicism, the light extinguished by accumulated grief.

THE PRESCRIPTION: Balance inspiration with implementation. The 17 vibration is a lighthouse — it guides ships to safety, but only because someone built the tower, maintained the light, and ensured the mechanism works. Vision without structure is hallucination. Structure without vision is prison.`,
  },
  18: {
    day: 18, title: 'The Material-Spiritual Warrior', rulingNumber: 9,
    keywords: 'Conflict, resolution, service, material mastery, spiritual testing',
    interpretation: `BIRTH DAY 18 — The Material-Spiritual Warrior

The 18th day carries the 9 vibration (1+8=9) through the portal of conflict and resolution. The 1 (self) + 8 (power, karma) combine to produce a 9 (completion, humanitarianism) that is forged through struggle. The Day 18 soul is a warrior — not necessarily in the literal sense, but in the sense of someone whose spiritual growth occurs THROUGH confrontation with material and interpersonal challenges.

THE LIGHT: The Day 18 gift is the capacity to navigate conflict constructively. These individuals do not avoid confrontation; they engage it, learn from it, and emerge stronger. Their material mastery (8) is directed toward humanitarian ends (9) — they can generate resources specifically to redistribute them, build power structures specifically to empower others. They possess a peculiar form of integrity that comes from having been tested repeatedly and having chosen principle over convenience each time. Professionally, they excel in law, advocacy, military service, organizational leadership, and any role where principled confrontation produces positive change.

THE SHADOW: The Day 18 shadow is conflict addiction — the 18 may unconsciously generate drama and opposition because struggle has become their primary mode of engagement with life. Peace feels boring; harmony feels suspicious. A subtler shadow is self-righteousness — the 18's principled stands can curdle into moral superiority, alienating potential allies and hardening opposition. The deepest wound is battle fatigue — the 18 may eventually exhaust themselves fighting battles that no longer need to be fought.

THE PRESCRIPTION: Learn to distinguish between necessary conflict and habitual conflict. The 18 vibration is a sword; it can defend the vulnerable or wound the innocent, depending entirely on the discernment of the hand that wields it. Some battles are worth fighting. Many are not. Wisdom is knowing the difference.`,
  },
  19: {
    day: 19, title: 'The Prince of Heaven', rulingNumber: 1,
    keywords: 'Leadership, spiritual authority, independence, originality, karmic completion',
    interpretation: `BIRTH DAY 19 — The Prince of Heaven

The 19th day carries the 1 vibration (1+9=10→1) through the portal of karmic completion. The 1 (self) + 9 (completion, universal love) combine to produce a 1 that has been tempered by the wisdom of the 9 — this is not the raw, untested independence of the Day 1, but an independence earned through having completed significant cycles. The Day 19 soul often feels "old" — not in energy but in perspective, as though they have lived many lives and carry the distilled wisdom of those lives into the present.

THE LIGHT: The Day 19 gift is spiritualized leadership — the capacity to lead not from ego but from an authentic connection to something larger than the self. These individuals possess the 1's initiative and originality, but it is infused with the 9's compassion and universal perspective. Their independence serves not just themselves but the collective. They are natural elders of their communities, regardless of chronological age — people seek their counsel, trust their judgment, and follow their lead because it feels genuinely earned rather than asserted. Professionally, they excel in roles that combine authority with service.

THE SHADOW: The Day 19 shadow is the burden of premature wisdom — knowing too much too early and becoming alienated from peers who are still learning lessons the 19 has already internalized. A subtler shadow is the temptation to bypass the mundane — the 19 may struggle with ordinary life tasks that feel beneath their spiritual maturity, creating practical chaos despite profound insight. The deepest wound is the loneliness of the old soul in a young world — the sense of speaking a language few others understand.

THE PRESCRIPTION: Remember that wisdom is meant to be shared, not hoarded. The 19 vibration is a library; its value is not in its collection but in its accessibility. Translate your insight into forms that others can receive, and remember that spiritual maturity includes patience with those who are earlier on the path you have already walked.`,
  },
  20: {
    day: 20, title: 'The Awakening Moon', rulingNumber: 2,
    keywords: 'Intuition, sensitivity, receptivity, spiritual awakening, cycles',
    interpretation: `BIRTH DAY 20 — The Awakening Moon

The 20th day carries the 2 vibration through the portal of the 0 — the void, the unmanifest, the space from which all creation emerges. The Day 20 soul possesses an unusual degree of RECEPTIVITY — not passivity, but the active capacity to receive, to listen, to wait, and to respond rather than react. The 2's natural sensitivity is amplified by the 0's emptiness, creating an individual who is less a transmitter and more a receiver — picking up signals, frequencies, and information that more active personalities miss entirely.

THE LIGHT: The Day 20 gift is intuitive receptivity of extraordinary range. These individuals "pick up" on things — not through effort but through a natural porousness that allows information to enter their awareness without the usual filters. They make exceptional counselors, mediators, artists, and healers whose primary skill is not doing but BEING — creating a space in which others feel safe enough to reveal themselves. Their patience is remarkable; they can wait through long periods of uncertainty without forcing premature resolution.

THE SHADOW: The Day 20 shadow is the loss of self in receptivity — becoming so open to others' energies that one's own identity dissolves. The 0's void can become a vacuum that sucks in whatever is nearest, leaving the 20 uncertain of who they actually are when alone. A subtler shadow is passivity disguised as patience — waiting when action is required, receiving when assertion is needed. The deepest wound is the fear of having no self — of being merely a mirror for others, with no original reflection of one's own.

THE PRESCRIPTION: Develop the active counterpart to your receptivity. The 20 vibration is a satellite dish — it can receive signals from vast distances, but it must also TRANSMIT. Your insights are not complete until they are expressed. Your patience is not virtuous until it is accompanied by discernment about when waiting has served its purpose and action must begin.`,
  },
  21: {
    day: 21, title: 'The Crown of the Magi', rulingNumber: 3,
    keywords: 'Creative mastery, expression, completion, universal communication, joy',
    interpretation: `BIRTH DAY 21 — The Crown of the Magi

The 21st day carries the 3 vibration (2+1=3) through the portal of mastery and completion. The 2 (receptivity, partnership) + 1 (initiative, self) combine to produce a 3 (creativity, expression) that represents the successful integration of receiving (2) and acting (1) into a unified creative flow. The Day 21 soul has, in esoteric terms, "completed the circuit" — they can receive inspiration AND act on it, listen AND speak, absorb AND express, in a balanced, sustainable rhythm.

THE LIGHT: The Day 21 gift is integrated creative expression. These individuals experience less of the internal conflict that characterizes many creative types — the war between solitude and collaboration, between receiving inspiration and executing it, between self-doubt and self-expression. They have somehow resolved these tensions, and their creativity flows with unusual ease and consistency. Their communication carries a quality of authority that comes not from dominance but from wholeness. Professionally, they excel in any creative or communicative field, often achieving recognition that endures rather than flares.

THE SHADOW: The Day 21 shadow is the temptation to rest on natural gifts — because creativity flows easily, the 21 may never develop the discipline that sustains output when inspiration wanes. A subtler shadow is the assumption that integration is permanent — the 21 may be blindsided when old conflicts resurface, having believed they were permanently resolved. The deepest wound is the pressure of apparent perfection — others may project onto the 21 an expectation of constant harmony, making it difficult to admit struggle or seek help.

THE PRESCRIPTION: Maintain the practices that produced your integration. The 21 vibration is a garden that has flourished; it still requires watering, weeding, and seasonal rest. Do not mistake the harvest for permanent abundance. The cycle continues.`,
  },
  22: {
    day: 22, title: 'The Master Builder', rulingNumber: 22,
    keywords: 'Mastery, manifestation, large-scale vision, service, architecture',
    interpretation: `BIRTH DAY 22 — The Master Builder

Those born on the 22nd day carry the Master Number 22 — the most powerful material vibration in numerology, often called the "Master Builder." While the 11 sees the vision, the 22 BUILDS it. This is the number of the architect who can translate spiritual insight into material form at the largest possible scale — institutions, movements, infrastructures that serve humanity for generations. The Day 22 soul carries an extraordinary responsibility: the capacity to manifest at a level that affects thousands or millions.

THE LIGHT: The Day 22 gift is large-scale material manifestation in service of collective good. These individuals can conceive and execute projects of a scope that intimidates others — building organizations, creating systems, establishing institutions that endure beyond their own lifetime. Their vision is not merely ambitious; it is PRACTICAL. They see not only what could be but exactly how to build it, step by step, brick by brick. When operating at their full capacity, they are among the most impactful individuals in human society — the founders of lasting enterprises, the architects of social change, the builders of bridges (literal and metaphorical) between what is and what could be. Professionally, they excel as founders, architects, engineers, diplomats, and leaders of large-scale initiatives.

THE SHADOW: The Day 22 shadow is the crushing weight of unrealized potential. The 22 vibration is so high that many born under it cannot sustain it, operating instead at the reduced vibration of 4 (2+2=4) — building competently but at a fraction of their capacity, haunted by the sense that they are meant for something larger. A subtler shadow is grandiosity without foundation — the 22 may dream of building empires while neglecting to lay the first brick. The deepest wound is the gap between vision and execution — seeing clearly what COULD be built while lacking (or not yet having developed) the skills to build it.

THE PRESCRIPTION: Begin where you are. The 22 vibration is a skyscraper; it requires a foundation as deep as the building is tall. Do not despise the years of underground work that precede visible achievement. Master the 4 vibration (discipline, structure, patient effort) before attempting to operate at the 22. When the foundation is adequate, the building will rise.`,
  },
  23: {
    day: 23, title: 'The Royal Star', rulingNumber: 5,
    keywords: 'Charisma, versatility, protection, communication, magnetism',
    interpretation: `BIRTH DAY 23 — The Royal Star

The 23rd day carries the 5 vibration (2+3=5) through a particularly charismatic and protected portal. The number 23 has been called the "Royal Star of Leo" in ancient Chaldean numerology — it promises protection, success through personal charm, and the capacity to attract helpful people and favorable circumstances. The Day 23 soul carries a natural magnetism that opens doors and attracts allies.

THE LIGHT: The Day 23 gift is social magnetism combined with genuine versatility. These individuals thrive in diverse environments, adapt to changing circumstances with remarkable speed, and attract mentors, supporters, and opportunities that accelerate their progress. Their communication skills are exceptional — they can speak to anyone, in any context, and be heard. They possess the 5's love of freedom but channel it more constructively than the pure 5, building networks of relationships that support rather than constrain their independence. Professionally, they excel in media, entertainment, sales, diplomacy, and any role where personal presence and communication skill determine success.

THE SHADOW: The Day 23 shadow is the temptation to coast on charm — relying on magnetism to open doors without developing the substance to stay in the room once entered. A subtler shadow is the accumulation of superficial relationships — many acquaintances, few intimates, a social life that is wide but not deep. The deepest wound mirrors the 5's: the terror of being trapped, but for the 23, this specifically manifests as the fear of being seen through — of others discovering that the charisma masks uncertainty and the confidence conceals doubt.

THE PRESCRIPTION: Develop depth alongside breadth. The 23 vibration is a star — it shines brightly and attracts attention, but stars that burn only on the surface eventually collapse. Build a core of genuine mastery in at least one area. Let your relationships include a few people who know you without the charm — who have seen behind the performance and chosen to stay.`,
  },
  24: {
    day: 24, title: 'The Harmonious Builder', rulingNumber: 6,
    keywords: 'Harmony, structure, love, responsibility, beauty in form',
    interpretation: `BIRTH DAY 24 — The Harmonious Builder

The 24th day carries the 6 vibration (2+4=6) through a portal that combines partnership (2) with structure (4) to produce a particularly grounded form of love and service. The Day 24 soul does not merely feel love; they BUILD it — into relationships, homes, communities, and institutions. This is the number of the person who creates environments where others can flourish, who understands that love without structure is sentiment and structure without love is oppression.

THE LIGHT: The Day 24 gift is the capacity to create harmonious structures. These individuals are natural homemakers in the deepest sense — whether their "home" is a household, an organization, or a community, they know how to arrange the elements so that people feel safe, supported, and able to thrive. Their love is practical — it shows up as meals prepared, schedules organized, needs anticipated. They possess the 6's nurturing instinct backed by the 4's discipline, making their care unusually reliable. Professionally, they excel in hospitality, education, human resources, community organizing, and any role involving the creation and maintenance of supportive environments.

THE SHADOW: The Day 24 shadow is the conflation of structure with control. The same capacity to create harmonious environments can become an insistence that environments conform to the 24's vision of harmony — leaving little room for others' needs and preferences that differ from their own. A subtler shadow is the exhaustion of perpetual care — the 24 may give so consistently that they deplete themselves, having built structures of support for everyone but themselves. The deepest wound is the belief that their value is entirely in what they provide — that without their structural role, they would be unnecessary.

THE PRESCRIPTION: Build structures that function WITHOUT your constant presence. The 24 vibration is an architect, not a support beam — design systems that others can maintain, relationships that are mutually sustaining rather than dependent. Your value extends beyond your utility.`,
  },
  25: {
    day: 25, title: 'The Spiritual Discerner', rulingNumber: 7,
    keywords: 'Intuition, wisdom, analysis, spiritual depth, experience-based knowledge',
    interpretation: `BIRTH DAY 25 — The Spiritual Discerner

The 25th day carries the 7 vibration (2+5=7) through a portal that combines receptivity (2) with change (5) to produce a particularly experiential form of wisdom. The Day 25 soul does not learn from books or teachers alone; they learn from LIVING — from the full immersion in experience that the 2 and 5 together demand, and the subsequent analysis and integration that the 7 provides.

THE LIGHT: The Day 25 gift is wisdom extracted from direct experience. These individuals have a remarkable capacity to learn from everything that happens to them — to extract principles from events, to find meaning in apparent chaos, to distill life into understanding. Their intuition is developed not through practice but through the accumulation of processed experience — they have been through enough to recognize patterns that others miss. Professionally, they excel as counselors, analysts, researchers, spiritual directors, and in any role where the product is not action but understanding.

THE SHADOW: The Day 25 shadow is the accumulation of unprocessed experience — the 2's receptivity and the 5's appetite for novelty can combine to create a life of constant input without adequate integration time. The 7's analytical capacity becomes overwhelmed, and wisdom is replaced by mere information. A subtler shadow is spiritual arrogance — the 25 may dismiss the insights of those who have "merely studied" while they have "lived," failing to recognize that both paths produce valid knowledge. The deepest wound is the exhaustion of the perpetual student — learning so much that the learning itself becomes a burden.

THE PRESCRIPTION: Balance experience with integration. The 25 vibration is a library that acquires books faster than it can catalog them — eventually, the uncatalogued books become inaccessible. Schedule regular periods of withdrawal and reflection. Not every experience needs to be had. Some wisdom can be inherited.`,
  },
  26: {
    day: 26, title: 'The Karmic Partner', rulingNumber: 8,
    keywords: 'Partnership, material karma, responsibility, business, duty',
    interpretation: `BIRTH DAY 26 — The Karmic Partner

The 26th day carries the 8 vibration (2+6=8) through a portal that emphasizes partnership (2) and responsibility (6) as the primary vehicles of karmic learning. The Day 26 soul's material and spiritual lessons are learned THROUGH relationships — through the challenges and rewards of partnership, the demands of care, the karmic exchanges that occur whenever two people commit to shared endeavor.

THE LIGHT: The Day 26 gift is the capacity for productive partnership. These individuals thrive in collaboration — not as followers but as co-creators who understand that certain achievements are only possible through combined effort. Their business instincts (8) are unusually ethical, tempered by the 6's sense of responsibility to others. They make excellent business partners, spouses (in the deepest sense of partnership), and collaborators who bring out the best in those they work with. Professionally, they excel in partnership-based enterprises, family businesses, and any role where shared responsibility produces results.

THE SHADOW: The Day 26 shadow is the entanglement of partnership with karma — attracting relationships that replay unresolved patterns, repeating dynamics that should have been learned from and released. A subtler shadow is the imbalance of giving and receiving in partnership — the 26 may give more than they receive, accumulating unconscious resentment that eventually poisons the relationship. The deepest wound is the fear that partnership inevitably means loss of self — that to truly collaborate is to be absorbed.

THE PRESCRIPTION: Choose partners consciously. The 26 vibration is a joint venture; the choice of partner determines the venture's success more than any other factor. Before committing, ask: "Does this person's karma complement or complicate mine?" Not all attractions are meant to become commitments.`,
  },
  27: {
    day: 27, title: 'The Scepter of Authority', rulingNumber: 9,
    keywords: 'Leadership, spiritual authority, humanitarianism, completion, wisdom',
    interpretation: `BIRTH DAY 27 — The Scepter of Authority

The 27th day carries the 9 vibration (2+7=9) through a portal of natural authority and humanitarian leadership. The 2 (partnership) + 7 (wisdom, spirituality) combine to produce a 9 (completion, universal love) that possesses a distinctive quality of EARNED authority — leadership that flows not from ambition but from the accumulated weight of insight and the demonstrated capacity to serve.

THE LIGHT: The Day 27 gift is natural, unforced leadership. These individuals do not campaign for authority; they are given it because others recognize their wisdom and trust their judgment. Their counsel is sought; their presence is calming; their decisions tend to be sound. They combine the intellectual depth of the 7 with the relational sensitivity of the 2, producing a leadership style that is both principled and compassionate. Professionally, they excel as judges, counselors, spiritual leaders, organizational heads, and in any role where authority must be exercised with wisdom.

THE SHADOW: The Day 27 shadow is the isolation of authority — the loneliness of being the one others turn to while having few to turn to oneself. A subtler shadow is the weight of expectation — others' trust can become a burden, and the fear of disappointing those who depend on one's judgment can lead to paralysis. The deepest wound is the knowledge that authority, however wisely exercised, cannot solve every problem or save every person.

THE PRESCRIPTION: Cultivate your own sources of support. The 27 vibration is a mountain that others climb for perspective; mountains need foundations too. Maintain relationships in which you are NOT the authority — where you can be uncertain, seek guidance, and receive rather than give.`,
  },
  28: {
    day: 28, title: 'The Bold Initiator', rulingNumber: 1,
    keywords: 'Leadership, initiative, originality, determination, paradox',
    interpretation: `BIRTH DAY 28 — The Bold Initiator

The 28th day carries the 1 vibration (2+8=10→1) through a portal of paradoxical energy — the 2 (partnership, receptivity) combined with the 8 (power, material mastery). This creates a 1 (leadership, initiative) that is more complex than the pure Day 1 — an initiator who understands partnership and power, who leads not from naivety but from a sophisticated grasp of how authority operates.

THE LIGHT: The Day 28 gift is leadership informed by an understanding of both collaboration (2) and power (8). These individuals can initiate projects, movements, and enterprises with a clear-eyed assessment of the relational and material dynamics involved. They are not the impulsive starters that pure 1s can be; they calculate, strategize, and build alliances before they move. Their originality is tempered by practicality. Professionally, they excel in entrepreneurial ventures, organizational leadership, and any role requiring both vision and execution.

THE SHADOW: The Day 28 shadow is the conflict between the 2's desire for harmony and the 8's drive for power — the 28 may swing between accommodation and domination, never finding a stable equilibrium. A subtler shadow is the paralysis of over-analysis — understanding the dynamics so thoroughly that action is perpetually deferred. The deepest wound is the belief that power and love are incompatible — that to lead is necessarily to dominate, and to love is necessarily to submit.

THE PRESCRIPTION: Integrate power and partnership. The 28 vibration is a general who fights alongside their troops — authority and camaraderie are not opposites but complements. Your leadership can be both decisive AND collaborative, both powerful AND relational.`,
  },
  29: {
    day: 29, title: 'The Grace of Illumination', rulingNumber: 11,
    keywords: 'Intuition, spiritual mastery, sensitivity, grace, higher calling',
    interpretation: `BIRTH DAY 29 — The Grace of Illumination

The 29th day carries the Master Number 11 vibration (2+9=11) through a portal that is considered the most spiritually elevated of all birth days. The 2 (receptivity, partnership) + 9 (completion, universal love) produce an 11 (illumination, spiritual messenger) that is characterized by GRACE — a quality of ease, flow, and unforced wisdom that distinguishes it from the more intense, nervous 11 of the Day 11.

THE LIGHT: The Day 29 gift is spiritual illumination expressed through grace rather than intensity. These individuals possess the 11's intuitive gifts — the capacity to receive insight directly, to perceive beyond the surface, to serve as channels for higher wisdom — but they carry these gifts with a lightness that makes them accessible to others. They are the spiritual teachers who do not need to declare themselves teachers, the healers whose presence alone is healing, the artists whose work seems to emerge from a place of profound peace. Professionally, they excel in spiritual direction, healing arts, creative expression, and any role involving the transmission of subtle wisdom.

THE SHADOW: The Day 29 shadow is the temptation to bypass earthly responsibilities — the 9's completion energy combined with the 11's spiritual attunement can create a person who feels "done" with material existence while still having material obligations to fulfill. A subtler shadow is spiritual passivity — waiting for illumination to arrive rather than actively seeking it. The deepest wound is the loneliness of the highly evolved soul — the sense of having outgrown the very human connections that sustain life.

THE PRESCRIPTION: Ground your illumination in service. The 29 vibration is a lighthouse on a hill — it guides ships to safety, but someone still needs to maintain the lighthouse. Your spiritual gifts are not an escape from earthly responsibility but a mandate for it.`,
  },
  30: {
    day: 30, title: 'The Expressive Channel', rulingNumber: 3,
    keywords: 'Communication, creativity, spiritual expression, joy, upliftment',
    interpretation: `BIRTH DAY 30 — The Expressive Channel

The 30th day carries the 3 vibration (3+0=3) through the portal of the 0 — the void, the unmanifest. This gives the Day 30 soul's creativity a distinctive quality: their expression seems to come FROM SOMEWHERE ELSE, channeled through them rather than generated by them. The 3's natural creativity is infused with the 0's mysterious emptiness, producing art, communication, and presence that feels both grounded and otherworldly.

THE LIGHT: The Day 30 gift is inspired expression — creativity that flows from a source beyond the personal ego. These individuals often describe their best work as "coming through" them rather than being consciously produced. They are natural channels for creative and communicative energy, able to access states of flow that others struggle to achieve. Their optimism (3) is tempered by the depth of the 0, making it more resilient than the sometimes superficial cheerfulness of pure 3s. Professionally, they excel in arts, media, teaching, and any role where expression is the primary medium.

THE SHADOW: The Day 30 shadow is creative dependency — relying on inspiration to strike rather than developing the discipline to create regardless of mood. The 0's emptiness can become a void that swallows motivation during dry periods. A subtler shadow is the confusion of channel with self — believing that their value is entirely in what comes through them, with no inherent worth in the vessel itself. The deepest wound is creative block — when the channel seems to close, the 30 may experience existential crisis, uncertain of who they are without the flow.

THE PRESCRIPTION: Develop creative discipline alongside creative inspiration. The 30 vibration is a river; it flows naturally, but channels can be dug, dams can be built, and irrigation systems can ensure that water reaches the fields even during dry seasons. Your creativity is not just a gift you receive; it is a practice you maintain.`,
  },
  31: {
    day: 31, title: 'The Practical Visionary', rulingNumber: 4,
    keywords: 'Organization, vision, practicality, communication, service',
    interpretation: `BIRTH DAY 31 — The Practical Visionary

The 31st day carries the 4 vibration (3+1=4) through a portal that combines creativity and communication (3) with initiative and selfhood (1) to produce a 4 (structure, discipline) that is unusually dynamic. The Day 31 soul is a builder — but a builder who understands that structures serve vision, that systems exist for people (not the reverse), and that the most enduring foundations are those laid with creativity and heart.

THE LIGHT: The Day 31 gift is visionary practicality — the capacity to conceive of improved systems AND implement them. These individuals do not merely dream; they build. They do not merely criticize existing structures; they design better ones. Their communication skills (3) serve their organizational abilities (4), enabling them to articulate vision clearly and enroll others in its execution. They possess the 1's initiative and the 4's discipline, making them unusually effective at translating intention into result. Professionally, they excel in management, engineering, design, entrepreneurship, and any role requiring both vision and execution.

THE SHADOW: The Day 31 shadow is the conflict between creative impulse (3) and structural necessity (4) — the 31 may feel torn between the desire to innovate and the demand to maintain, between starting new projects and finishing existing ones. A subtler shadow is perfectionism — the 4's high standards, combined with the 3's expressive sensitivity, can create a paralyzing fear of producing work that is "not good enough." The deepest wound is the exhaustion of perpetual building — always constructing, never resting in what has been built.

THE PRESCRIPTION: Celebrate completion. The 31 vibration is an architect who moves from project to project without ever inhabiting the buildings they have designed. Take time to dwell in your creations — to experience the structures you have built not as a builder but as an occupant. What you have made is worthy of your presence, not just your effort.`,
  },
};

export function getBirthDayAnalysis(day: number): BirthDayResult {
  return BIRTH_DAY_DATA[day] || {
    day,
    title: `Day ${day}`,
    rulingNumber: day <= 9 ? day : (day % 9 || 9),
    keywords: 'Individual expression',
    interpretation: `BIRTH DAY ${day} — The individual born on the ${day}${getOrdinal(day)} day of the month carries a unique vibrational signature. The digits ${String(day).split('').join(' and ')} combine to create a distinctive numerological fingerprint that colors the personality, life path, and karmic curriculum of this individual. The specific interpretation of this birth day draws upon the combined qualities of its component digits and their reduced sum.`,
  };
}

function getOrdinal(n: number): string {
  if (n > 3 && n < 21) return 'th';
  switch (n % 10) { case 1: return 'st'; case 2: return 'nd'; case 3: return 'rd'; default: return 'th'; }
}
