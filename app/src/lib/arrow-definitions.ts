// src/lib/arrow-definitions.ts
// ALL VERBATIM — canonical potential and shadow meanings for all psychomatrix grid arrows.
// Incorporates Advanced Esoteric Numerology, Elemental Alchemy, and Karmic Contracts.

export type ArrowState = "full" | "empty";

export interface ArrowDefinition {
  id: string;
  name: string;
  numbers: number[];
  type: "horizontal" | "vertical" | "diagonal" | "bridge";
  state: ArrowState;
  coreTrait: string;
  potentialTitle?: string;
  potentialBody?: string;
  shadowTitle?: string;
  shadowBody?: string;
  desc?: string; // Added this field as per user's new content
  isPrimary?: boolean;
}

// ─── Part I: Major Arrows (Full — Primary Power Planes) ───────────────────────

export const FULL_ARROW_DEFINITIONS: ArrowDefinition[] = [
  {
    id: "thought",
    name: "Arrow of the Mind",
    numbers: [4, 9, 2],
    type: "horizontal",
    state: "full",
    isPrimary: true,
    coreTrait: `Sharp, rapid-fire intellect and mental clarity.`,
    potentialTitle: `The Visionary Intellectual`,
    potentialBody: `Individuals with this plane are intellectual powerhouses. They possess the rare ability to bridge abstract vision (9) with analytical logic (4) and intuitive sensitivity (2), creating a mind that is both fast and deep.

* **Elemental Alchemy**: This blends Wood (4), Fire (9), and Earth (2). Wood feeds the Fire of ambition, which settles into the Earth of intuition. It creates a mind that can 'burn' through complex problems and ground them into reality.
* **Deep Dive**: The light side of this arrow is 'Clarity of Purpose.' These individuals can see through complexity to find the simplest, most effective solution. They have an exceptional capacity for memory and strategic foresight.`,
    shadowTitle: `Cerebral Isolation`,
    shadowBody: `When this horizontal mental plane is full, the individual possesses a sharp, rapid-fire intellect. The shadow manifests as a "God Complex" of the mind. They may become so detached from the physical world that they treat people as data points or chess pieces. 

* **The Karmic Trap**: They suffer from "Mental Saturation," where they intellectualize their emotions instead of actually feeling them. This creates a cold, clinical superiority leading to profound social isolation because they cannot tolerate "intellectual inferiority" in others.`,
  },
  {
    id: "spirituality",
    name: "Arrow of Spirituality/Heart",
    numbers: [3, 5, 7],
    type: "horizontal",
    state: "full",
    isPrimary: true,
    coreTrait: `Deep intuition and soulful awareness.`,
    potentialTitle: `The Conscious Empath`,
    potentialBody: `This plane indicates deep emotional and spiritual sensitivity. It is the signature of the 'Human Lie Detector' who moves through the world guided by an internal moral and intuitive compass.

* **Elemental Alchemy**: Wood (3), Earth (5), and Metal (7). This represents the "Root to Sky" connection. The soul grows (Wood), anchors in the present (Earth), and extracts cosmic truth (Metal). 
* **Deep Dive**: The potential here is 'Sovereign Compassion.' These individuals are spiritually resilient. They use their 5-center power to anchor their emotions, allowing them to provide a healing presence for others without being drained.`,
    shadowTitle: `The Wounded Healer`,
    shadowBody: `This soul plane provides deep intuition, but its shadow is the "Martyr Complex." This person may become addicted to emotional drama or spiritual "highs," losing touch with practical reality. 

* **The Karmic Trap**: They suffer from "Psychic Sponging"—absorbing the trauma of the world due to a lack of energetic boundaries. They subconsciously seek out "broken" people to fix, which leads to chronic emotional exhaustion and a complete loss of their own identity.`,
  },
  {
    id: "practicality",
    name: "Arrow of Practicality",
    numbers: [8, 1, 6],
    type: "horizontal",
    state: "full",
    isPrimary: true,
    coreTrait: `Builder energy — grounded, capable, and dependable.`,
    potentialTitle: `The Master of Manifestation`,
    potentialBody: `This indicates a person who is exceptionally grounded and capable in the material world. It is the signature of the Architect of Reality—one who turns abstract ideas into tangible, lasting wealth.

* **Deep Dive**: The light side is 'Physical Integrity.' These individuals understand the mechanics of the world perfectly. They possess the organizational grit to manage complex systems and the financial intelligence to ensure long-term stability. Their gift is the ability to create physical security that serves as a foundation for their higher goals.`,
    shadowTitle: `Materialistic Myopia`,
    shadowBody: `This physical plane is the mark of the builder, but its shadow is a soul-crushing obsession with the tangible. The individual may define their entire worth by bank accounts, titles, and possessions. 

* **The Karmic Trap**: "Spiritual Starvation." They risk becoming a cog in the machine, unable to appreciate anything that cannot be measured or sold. This shadow manifests as a deep, underlying anxiety about poverty, even when they possess immense wealth.`,
  },
  {
    id: "planning",
    name: "Arrow of the Planner",
    numbers: [4, 3, 8],
    type: "vertical",
    state: "full",
    isPrimary: true,
    coreTrait: `Methodical planning, precision, and architectural strategy.`,
    potentialTitle: `The Strategic Architect`,
    potentialBody: `Known as the Golden Raj Yog of Thought, this combines the discipline of 4 and the creativity of 3 with the knowledge of 8. It represents the supreme ability to design a future before it happens.

* **Elemental Alchemy**: A heavy concentration of Wood (4, 3) rooted deeply into Earth (8). This creates a root system that cannot be easily moved or shaken by external forces.
* **Deep Dive**: The potential is 'Architectural Destiny.' These individuals do not live by chance; they live by design. They have the mental stamina to build systems that endure ten, twenty, or fifty years into the future.`,
    shadowTitle: `The Architect of Prisons`,
    shadowBody: `This vertical line provides structural order, but its shadow is a paralyzing need for perfection. The person becomes so focused on the blueprint that they never start the construction. 

* **The Karmic Trap**: They build routines so strict they suffocate their own joy. In a team setting, this shadow creates a micromanager who stifles creativity in the name of "the right way." It leads to a life where everything is perfectly planned, but nothing is actually experienced.`,
  },
  {
    id: "willpower",
    name: "Arrow of Determination",
    numbers: [9, 5, 1],
    type: "vertical",
    state: "full",
    isPrimary: true,
    coreTrait: `Ambitious, strong-willed, persistent, and resilient drive.`,
    potentialTitle: `The Unstoppable Will`,
    potentialBody: `This is the Central Pillar of the grid. It represents the backbone of character—an unstoppable drive fueled by ambition (9), central power (5), and self-identity (1).

* **Elemental Alchemy**: Water (1) flowing into Earth (5) and erupting as Fire (9). It is the energy of a geyser—immense pressure finding a powerful, singular release.
* **Deep Dive**: The light side is 'Radiant Persistence.' This is the power to bounce back from any failure with more wisdom than before. They possess a 'Quiet Authority' and the gift of seeing a project through to the very end, long after others have given up.`,
    shadowTitle: `The Relentless Steamroller`,
    shadowBody: `This central vertical line is the ultimate engine of drive, but its shadow is a ruthless disregard for the obstacles in its path — including other people. 

* **The Karmic Trap**: The willpower becomes so intense that it turns into tyranny. The person may find it impossible to pivot or admit a mistake, driving a failing project or a broken relationship into the ground simply because their ego refuses to "lose."`,
  },
  {
    id: "action",
    name: "Arrow of Execution",
    numbers: [2, 7, 6],
    type: "vertical",
    state: "full",
    isPrimary: true,
    coreTrait: `High capability to turn concepts into rapid, real-world deeds.`,
    potentialTitle: `The Kinetic Genius`,
    potentialBody: `This indicates a person of effective action. They possess 'Body Intelligence'—the ability to move from thought to deed with seamless precision and consideration for others.

* **Deep Dive**: The potential is 'Mastery of the Moment.' These are the 'Doers' who make difficult tasks look easy. They excel in environments where rapid, high-stakes decisions are required. Their gift is the ability to mobilize resources and people instantly, turning a stagnant situation into a thriving, active environment.`,
    shadowTitle: `Chaotic Busywork`,
    shadowBody: `This vertical line indicates the ability to execute, but its shadow is "movement without progress." The person feels a constant, itchy need to be doing something. 

* **The Karmic Trap**: They may burn through physical energy on low-value tasks just to avoid the discomfort of stillness or self-reflection. This shadow leads to burnout and a life that looks productive on the outside but feels entirely hollow on the inside.`,
  },
  {
    id: "peace-of-mind",
    name: "Arrow of Peace of Mind",
    numbers: [3, 6, 9],
    type: "horizontal",
    state: "full",
    isPrimary: true,
    coreTrait: `Serene, tranquil nature, and excellent mental retention.`,
    potentialTitle: `Sublime Contentment`,
    potentialBody: `These individuals possess a serene and tranquil nature. They are often satisfied with their lives and do not easily fall prey to anxiety or the 'rat race.' They have a clear conscience and a balanced approach to the past, present, and future. People with a full 3-6-9 line have an excellent capacity for memory and retention. They are often 'old souls' who find it easy to be happy with the simple things in life.

* **Elemental Alchemy**: Wood (3), Metal (6), Fire (9). This forms a stable, self-sustaining cycle where creativity (Wood) is refined (Metal) and then ignited (Fire) into purpose. It's the alchemy of inner peace leading to outward manifestation.
* **Deep Dive**: The light side is 'Unshakeable Equanimity.' These individuals are not passive; they are deeply centered. They possess the wisdom to discern what truly matters and the courage to let go of the rest. Their gift is the ability to create an internal sanctuary that remains untouched by external chaos.`,
    shadowTitle: `The Detached Observer`,
    shadowBody: `The shadow side is a retreat into emotional numbness. The peace is maintained by refusing to engage with life's messy but necessary conflicts.

* **The Karmic Trap**: They become so detached that they lose the capacity for empathy. They may intellectualize suffering, both their own and others', creating a sterile existence devoid of genuine connection. This leads to a profound sense of isolation, even when surrounded by people.`,
  },
  {
    id: "vitality",
    name: "Arrow of Activity / Vitality",
    numbers: [7, 8, 9],
    type: "horizontal",
    state: "full",
    isPrimary: true,
    coreTrait: `Physical robustness, high energy, and love for dynamic change.`,
    potentialTitle: `Unstoppable Momentum`,
    potentialBody: `This is the arrow of the high-energy individual. They are physically robust and usually have a high metabolism. They need to be 'on the move' to feel alive and are often found in sports, manual labor, or high-stakes travel. The presence of 7, 8, and 9 creates a person who is constantly seeking new experiences. They are not content with sitting behind a desk; they want to be where the action is.

* **Elemental Alchemy**: Metal (7), Earth (8), Fire (9). This is the alchemy of raw, untamed energy. Metal provides structure, Earth provides grounding, and Fire provides the spark. It's a dynamic combination that seeks constant expression.
* **Deep Dive**: The light side is 'Dynamic Resilience.' These individuals possess an innate ability to recover quickly from physical and mental exertion. They thrive on challenges and see obstacles as opportunities for growth. Their gift is the ability to inspire others with their boundless enthusiasm and zest for life.`,
    shadowTitle: `Burnout Exhaustion`,
    shadowBody: `The shadow side is 'Inactivity' when the tank runs dry. They push so hard that they eventually collapse, leading to long periods of forced rest and depression.

* **The Karmic Trap**: They become addicted to the 'high' of constant activity, using it to avoid deeper emotional or spiritual work. This leads to a cycle of intense activity followed by complete collapse, leaving them feeling perpetually unfulfilled and exhausted.`,
  },
  {
    id: "intuition-experience",
    name: "Arrow of Intuition / Experience",
    numbers: [1, 4, 7],
    type: "vertical",
    state: "full",
    isPrimary: true,
    coreTrait: `Grounded intuition, mechanical aptitude, and hand-to-earth wisdom.`,
    potentialTitle: `Pragmatic Mastery`,
    potentialBody: `Individuals with this arrow prefer to learn by doing rather than by reading. They have a 'street smart' intuition that allows them to read a situation physically before they analyze it mentally. They are grounded and realistic. These people are often gifted with their hands. They understand the mechanics of the world and are very sensitive to the physical environment around them.

* **Elemental Alchemy**: Water (1), Wood (4), Metal (7). This is the alchemy of practical wisdom. Water provides flow, Wood provides growth, and Metal provides precision. It's the ability to intuitively understand how things work and to apply that understanding in a tangible way.
* **Deep Dive**: The light side is 'Embodied Wisdom.' These individuals possess a deep, intuitive understanding of the physical world. They are natural problem-solvers who can quickly assess a situation and find practical solutions. Their gift is the ability to bridge the gap between abstract knowledge and real-world application.`,
    shadowTitle: `Materialistic Skepticism`,
    shadowBody: `The shadow side is a refusal to believe in anything that cannot be touched or measured. They may dismiss spiritual or emotional intelligence as 'useless fluff.'

* **The Karmic Trap**: They become so focused on the tangible that they lose touch with their own inner guidance. They may become overly cynical and dismissive of anything that doesn't fit their logical framework, leading to a narrow and uninspired existence.`,
  },
];

// ─── Part II: Empty Arrow Definitions (Weakness / Shadow Planes) ──────────────

export const EMPTY_ARROW_DEFINITIONS: ArrowDefinition[] = [
  {
    id: "frustration",
    name: "Arrow of Frustration",
    numbers: [4, 5, 6],
    type: "diagonal",
    state: "empty",
    coreTrait: `Regular disappointment and depression. Hidden aggression when things don't go as planned.`,
    shadowTitle: `The Sisyphus Trap`,
    shadowBody: `When the central horizontal line is missing, the person feels a deep, soul-level "itch" that they cannot scratch. No matter what they achieve, it feels insufficient. They often feel like an outsider looking in, convinced that everyone else has the "secret key" to happiness.

* **Karmic Insight**: This is not a punishment, but a spiritual redirect. They are karmically assigned to learn detachment from material outcomes. They work harder than everyone else but face an invisible headwind to force them to look inward for validation, rather than outward for success.`,
  },
  {
    id: "indecision",
    name: "Arrow of Indecision",
    numbers: [9, 5, 1],
    type: "vertical",
    state: "empty",
    coreTrait: `Lacks the 'killer instinct.' Tasks are left halfway. High potential for procrastination.`,
    shadowTitle: `The Identity Vacuum`,
    shadowBody: `The absence of this vertical line creates a "vacuum of will." The shadow side is a life lived in the waiting room. The person waits for the perfect sign, the perfect mood, or the perfect partner before they act. 

* **Karmic Insight**: Without the Water-Earth-Fire axis, they lack the elemental steam to push their own engine. They suffer from the "Chameleon Effect," adopting the goals of those around them. Their karmic lesson is 'The Power of the First Step'—learning to act with confidence before feeling fully ready.`,
  },
  {
    id: "scepticism-loneliness",
    name: "Arrow of the Cynical Fortress",
    numbers: [3, 5, 7],
    type: "horizontal",
    state: "empty",
    coreTrait: `Deep lack of trust. Only accepts proven facts. Stoic to the point of coldness.`,
    shadowTitle: `The Island Personality`,
    shadowBody: `This missing plane acts as a double-edged sword of Scepticism and Loneliness. Without the soul plane, the person struggles to trust anything they cannot see. They may view love as a biological transaction and spirituality as a scam. 

* **Karmic Insight**: The mind builds the cynical fortress to protect the heart from the agonizing pain of the island. They suffer in absolute silence, viewing their isolation as a mark of superiority. Their karmic assignment is to "leap without looking" and learn to trust the unseen and the irrational.`,
  },
  {
    id: "hesitation",
    name: "Arrow of Hesitation",
    numbers: [8, 1, 6],
    type: "horizontal",
    state: "empty",
    coreTrait: `Lacks motivation. High 'talk' but very little 'walk.' Often fails to plan for the future.`,
    shadowTitle: `Fear of the Finish Line`,
    shadowBody: `When the bottom row is missing, the person starts with fire but ends with a whimper. The shadow is the "90% completion" curse. They abandon projects, relationships, and goals just as they are about to bear fruit. 

* **Karmic Insight**: This is a profound subconscious defense mechanism. The ego calculates that if they never truly finish anything, they can never be judged as a failure. They must learn to tolerate the vulnerability of completion.`,
  },
  {
    id: "emotional-instability",
    name: "Arrow of Emotional Instability",
    numbers: [2, 5, 8],
    type: "diagonal",
    state: "empty",
    coreTrait: `Easily hurt and very shy. May develop an inferiority complex to hide deep sensitivity.`,
    shadowTitle: `The Reactive Mirror`,
    shadowBody: `Without the central vertical emotional column, there is no "inner anchor." The shadow is a person who is a slave to their environment. If the room is happy, they are happy; if the room is tense, they have a panic attack. 

* **Karmic Insight**: They suffer from "Boundary Dissolution." They merge completely with partners or friends, losing their own identity. Their life path requires them to forge an internal sense of self that does not rely on the emotional temperature of the people around them.`,
  },
  {
    id: "mental-fatigue",
    name: "Arrow of Poor Memory",
    numbers: [4, 9, 2],
    type: "horizontal",
    state: "empty",
    coreTrait: `Forgetful nature that worsens over time. Struggles to retain complex information.`,
    shadowTitle: `The Fractured Narrative`,
    shadowBody: `When the top mental plane is empty, the person finds intellectual exertion painful. The shadow side is a retreat into "low-vibration" distractions. 

* **Karmic Insight**: This creates "Emotional Amnesia." Because they avoid deep critical thinking, they fail to learn from their mistakes. The lesson doesn't stick. They find themselves repeating the exact same toxic cycles every few years, genuinely surprised each time the same negative result occurs.`,
  },
  {
    id: "disorganisation",
    name: "Arrow of Disorganisation",
    numbers: [4, 3, 8],
    type: "vertical",
    state: "empty",
    coreTrait: `Difficulty with structure, planning, and follow-through. Ideas rarely reach completion.`,
    shadowTitle: `The Unfinished Blueprint`,
    shadowBody: `When the left vertical column is absent, the individual lacks the architectural framework to bring their ideas into reality. They may conceive brilliant plans but find themselves unable to execute them in an orderly, sustained way. The gap between vision and reality feels like a constant fog.\n\n* **Karmic Insight**: Without Wood (4), Wood (3), and Earth (8), there is no root system to anchor creative impulse into the ground. The karmic lesson here is 'The Discipline of One Step.' These individuals are karmically assigned to master small, consistent action over grand, scattered effort. Structure is not their prison — it is their liberation.`,
  },
  {
    id: "loss",
    name: "Arrow of Loss & Theft",
    numbers: [2, 7, 6],
    type: "vertical",
    state: "empty",
    coreTrait: `Potential for structural leaks in plans and legal boundaries.`,
    shadowTitle: `The Leaky Vessel`,
    shadowBody: `This configuration suggests a life where success 'slips through the fingers.' Just as they reach the pinnacle of a project, they may make a careless legal error or trust the wrong person, resulting in a total loss. 

* **Karmic Insight**: Missing Earth, Metal, and Action creates a grid that cannot retain density. From an esoteric perspective, this represents a karmic debt of hoarding in a past life. In this life, money and people slip through their fingers to teach them the ultimate spiritual illusion of "ownership."`,
  },
  {
    id: "mental-chaos",
    name: "Arrow of Mental Chaos",
    numbers: [3, 6, 9],
    type: "horizontal",
    state: "empty",
    coreTrait: `Anxiety, overthinking, and difficulty focusing. Mind feels like a constant battlefield.`,
    shadowTitle: `The Inner Turmoil`,
    shadowBody: `When the 3-6-9 line is empty, the individual struggles with inner peace. The mind is a constant battlefield of racing thoughts, anxieties, and unresolved issues. 

* **Karmic Insight**: This creates "Spiritual Amnesia." They struggle to connect with their inner wisdom and find themselves constantly seeking external validation or solutions. Their karmic lesson is to cultivate inner stillness and trust their own intuition.`,
  },
  {
    id: "physical-inertia",
    name: "Arrow of Physical Inertia",
    numbers: [7, 8, 9],
    type: "horizontal",
    state: "empty",
    coreTrait: `Lack of physical energy, lethargy, and difficulty initiating action. Prone to procrastination.`,
    shadowTitle: `The Couch Potato`,
    shadowBody: `When the 7-8-9 line is empty, the individual struggles with physical vitality and motivation. They may feel constantly tired, lethargic, and find it difficult to initiate any form of physical activity. 

* **Karmic Insight**: This creates "Energetic Stagnation." They may have a deep-seated fear of failure or judgment, which prevents them from taking action. Their karmic lesson is to embrace movement and learn to trust their body's innate wisdom.`,
  },
  {
    id: "impracticality-empty",
    name: "Arrow of Impracticality",
    numbers: [1, 4, 7],
    type: "vertical",
    state: "empty",
    coreTrait: `Lives in a dream world. Too much logic or emotion without 'common sense.' Highly idealistic.`,
    shadowTitle: `The Starving Artist`,
    shadowBody: `Without the physical foundation, the person lives entirely in the "clouds." They may be brilliant conceptually but struggle to translate their ideas into tangible reality. 

* **Karmic Insight**: This creates "Grounding Deficit." They may have a karmic lesson to learn the value of practical application and to integrate their spiritual insights with the demands of the material world.`,
  },
];

// ─── Part III: Secondary (Diagonal) Arrows ────────────────────────────────────

export const SECONDARY_ARROW_DEFINITIONS: ArrowDefinition[] = [
  {
    id: "prosperity",
    name: "The Arrow of Prosperity",
    numbers: [4, 5, 6],
    type: "diagonal",
    state: "full",
    isPrimary: true,
    coreTrait: `The Golden Yog: rare alignment between discipline, internal power, and responsibility.`,
    potentialTitle: `The Conscious Manifestor`,
    potentialBody: `This diagonal represents a perfect alignment between discipline (4), adaptability (5), and the appreciation of quality (6). These individuals have a natural sense of 'divine timing' in business and personal growth.

* **Elemental Alchemy**: This connects Wood (4), Earth (5), and Metal (6). In nature, Metal chops Wood, but Earth mediates it. This grants them the alchemical power to seamlessly destroy broken systems and rebuild them stronger than before.
* **Deep Dive**: The potential is a life where material abundance serves a higher purpose. They have a 'midas touch' because they understand that wealth is a tool for creating security and harmony for others.`,
    shadowTitle: `The Ethical Shortcut`,
    shadowBody: `While known as the 'Golden Yog,' the shadow manifests as a 'mercenary' soul. When this diagonal is heavily saturated, the individual treats life as a transaction where 'winning' is the only metric of value. 

* **The Karmic Trap**: They become morally flexible, believing the end justifies the means. This creates a person who achieves great wealth but finds themselves surrounded by people who only value them for their utility, leading to a profound sense of being a 'successful fraud.'`,
  },
  {
    id: "stability-emotional",
    name: "The Arrow of Emotional Stability",
    numbers: [2, 5, 8],
    type: "diagonal",
    state: "full",
    isPrimary: true,
    coreTrait: `The Property Yog: provides a profound internal shock-absorber and Silver resonance.`,
    potentialTitle: `The Anchor of Peace`,
    potentialBody: `Connecting the heart (2), the center (5), and the ground (8), this arrow is the 'Master of Composure.' These individuals possess an internal shock-absorber that allows them to remain calm during crises. 

* **Deep Dive**: The light side is exceptional emotional intelligence (EQ). They are the natural mediators of the world, capable of feeling deeply (2) without being swept away by the current. They possess a 'knowing' that life is cyclical, granting them the patience to wait for the exact right moment to act.`,
    shadowTitle: `The Impenetrable Ice`,
    shadowBody: `This 'Silver Yog' can become a 'Silver Prison.' The shadow side is 'emotional bypassing'—using balance as a shield against intimacy. 

* **The Karmic Trap**: The person becomes so 'balanced' that they appear robotic or unfeeling. They use logic or spiritual concepts to avoid the messiness of true human connection. They offer a solution for every problem but never a shoulder to cry on, alienating those who love them most.`,
  },
];

// ─── Part IV: Minor Arrows (2-Digit Power Bridges) ───────────────────────────

export const MINOR_ARROW_DEFINITIONS: ArrowDefinition[] = [
  {
    id: "4-9-bridge",
    name: "The Arrow of the Strategist",
    numbers: [4, 9],
    type: "bridge",
    state: "full",
    coreTrait: `Mental Intensity: Combines Wood's discipline with Fire's vision.`,
    potentialTitle: `The High-Level Strategist`,
    potentialBody: `The light side is the 'General's Mind.' They can see 10 steps ahead and have the organizational grit to ensure every step is executed. They excel at turning abstract concepts into institutional realities.`,
    shadowTitle: `The Intellectual Tyrant`,
    shadowBody: `When these two are active without the 2, the mind is a high-speed engine with no brakes. The shadow is a ruthless arrogance. This person doesn't just want to be right; they want to prove everyone else is wrong, using intellect as a weapon.`,
  },
  {
    id: "1-2-3-bridge",
    name: "The Arrow of the Artisan",
    numbers: [1, 2, 3],
    type: "bridge",
    state: "full",
    coreTrait: `Merges scientific precision with artistic flair.`,
    potentialTitle: `The Aesthetic Visionary`,
    potentialBody: `This links the Self (1), Intuition (2), and Creativity (3). The potential is 'The Master Craftsman.' They find the symmetry in math and the logic in music, able to build a machine that is also a work of art.`,
    shadowTitle: `The Starving Perfectionist`,
    shadowBody: `They suffer from 'The Execution Gap.' Because they have a deep need for symmetry and beauty, they refuse to release any work that is less than perfect, leading to a life of unfinished masterpieces due to the fear of judgment.`,
  },
  {
    id: "courage-bridge",
    name: "Arrow of Courage",
    numbers: [5, 9],
    type: "bridge",
    state: "full",
    coreTrait: "Bravery in the face of physical or abstract danger.",
    potentialTitle: "The Fearless Advocate",
    potentialBody: "This bridge creates a conduit between the central power (5) and the vision (9). The individual doesn't just see the need for change; they have the internal fire to stand up for it regardless of the cost.",
    shadowTitle: "Reckless Aggression",
    shadowBody: "The shadow side is the tendency to pick fights that aren't theirs, using 'courage' as an excuse to impose their will on others.",
  },
  {
    id: "detail-bridge",
    name: "Arrow of Detail",
    numbers: [1, 2],
    type: "bridge",
    state: "full",
    coreTrait: "Intense focus on small facts and analytical data.",
    potentialTitle: "The Precision Specialist",
    potentialBody: "Links self-identity (1) to intuition (2). This is the master of data, someone who notices the micro-shifts in a conversation or a project that others completely overlook.",
  },
  {
    id: "curiosity-bridge",
    name: "Arrow of Curiosity",
    numbers: [3, 9],
    type: "bridge",
    state: "full",
    coreTrait: "A mind that never stops asking 'Why?'",
    potentialTitle: "The Infinite Learner",
    potentialBody: "The bridge between creativity (3) and vision (9). This individual is a lifelong student, constantly expanding their horizons because they find the world fundamentally fascinating.",
  },
  {
    id: "passion-bridge",
    name: "Arrow of Passion",
    numbers: [2, 7],
    type: "bridge",
    state: "full",
    coreTrait: "Deeply emotional and physically expressive energy.",
    potentialTitle: "The Heart-Led Actor",
    potentialBody: "Connects intuition (2) with spiritual insight (7). This is the signature of someone who lives through their feelings; they don't just think, they *feel* their way through life.",
  },
  {
    id: "King-arrow",
    name: "The King's Arrow / Avatar State",
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    type: "bridge",
    state: "full",
    coreTrait: "The Full Grid: Complete resonance and limitless capability.",
    potentialTitle: "The System Buster",
    potentialBody: "The rarest of all. You possess all elemental tools. Mastery over your own internal environment allows you to influence the external one with ease.",
  },
];

export const ALL_ARROW_DEFINITIONS: ArrowDefinition[] = [
  ...FULL_ARROW_DEFINITIONS,
  ...EMPTY_ARROW_DEFINITIONS,
  ...SECONDARY_ARROW_DEFINITIONS,
  ...MINOR_ARROW_DEFINITIONS,
];

export const SHADOW_PRESENCE_INTRO =
  "When these lines are completed, the energy is powerful but can become a \"runaway train\" if not balanced by other numbers.";
export const SHADOW_ABSENCE_INTRO =
  "These are the \"Karmic Potholes\" where the energy is missing, creating a void that the individual must consciously learn to bridge.";