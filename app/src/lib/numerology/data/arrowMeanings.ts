// src/lib/numerology/data/arrowMeanings.ts
//
// THE 3×3 GRID LAYOUT (row, col) — 0-indexed:
//   [4](0,0)  [9](0,1)  [2](0,2)
//   [3](1,0)  [5](1,1)  [7](1,2)
//   [8](2,0)  [1](2,1)  [6](2,2)
//
// STRAIGHT-LINE arrows (rows, columns, diagonals) — these get DRAWN on the grid:
//   Rows:        [4,9,2]  [3,5,7]  [8,1,6]
//   Columns:     [4,3,8]  [9,5,1]  [2,7,6]
//   Diagonals:   [4,5,6]  [2,5,8]   (top-left→bottom-right, top-right→bottom-left)
//
// NON-STRAIGHT 3-number combos — meanings shown at bottom only (no arrow drawn):
//   [3,6,9]  [7,8,9]  [1,4,7]  [1,2,3]  [1,5,9] (anti-diag of the *other* grid orientation)
//   Note: [1,5,9] IS the anti-diagonal (2,1)→(1,1)→(0,1) which is col 1 — actually that's
//   the center column [9,5,1]. [1,5,9] reversed is the same col. So [9,5,1] IS straight.
//   But [1,5,9] as a SEPARATE "indecision" empty arrow uses the same cells → same diagonal check.
//
// MINOR arrows (2-number bridges) — meanings shown at bottom only, NEVER drawn.

export interface ArrowMeaning {
  id: string;
  name: string;
  /** The grid numbers that make up this arrow (1–9). Order matters for direction. */
  numbers: number[];
  /**
   * Whether this arrow forms a straight line on the 3×3 grid and should be drawn.
   * true  → draw arrow on grid + show meaning card
   * false → meaning card only (shown in bottom section)
   */
  drawOnGrid: boolean;
  /** "full" = all numbers present (strength), "empty" = all numbers absent (weakness) */
  state: "full" | "empty";
  coreTrait: string;
  potentialTitle?: string;
  potentialBody?: string;
  shadowTitle: string;
  shadowBody: string;
  /** For display ordering */
  category: "primary" | "secondary" | "weakness" | "minor";
}

// ─────────────────────────────────────────────────────────────────────────────
// GRID POSITIONS for straight-line checking
// Grid:  [4](r0c0) [9](r0c1) [2](r0c2)
//        [3](r1c0) [5](r1c1) [7](r1c2)
//        [8](r2c0) [1](r2c1) [6](r2c2)
// ─────────────────────────────────────────────────────────────────────────────
export const GRID_STRAIGHT_LINE_SETS: number[][] = [
  [4, 9, 2], // row 0
  [3, 5, 7], // row 1
  [8, 1, 6], // row 2
  [4, 3, 8], // col 0
  [9, 5, 1], // col 1
  [2, 7, 6], // col 2
  [4, 5, 6], // diagonal TL→BR
  [2, 5, 8], // diagonal TR→BL
];

/** Returns true if the given number set (regardless of order) matches a straight grid line */
export function isStraightGridLine(numbers: number[]): boolean {
  const sorted = [...numbers].sort((a, b) => a - b).join(",");
  return GRID_STRAIGHT_LINE_SETS.some(
    (set) =>
      [...set].sort((a, b) => a - b).join(",") === sorted
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PART I — PRIMARY STRENGTH ARROWS (Full straight-line rows/columns/diagonals)
// These are drawn on the grid.
// ─────────────────────────────────────────────────────────────────────────────
export const PRIMARY_STRENGTH_ARROWS: ArrowMeaning[] = [
  // ── ROWS ──────────────────────────────────────────────────────────────────
  {
    id: "thought",
    name: "Arrow of the Mind",
    numbers: [4, 9, 2],
    drawOnGrid: true,
    state: "full",
    category: "primary",
    coreTrait: "Sharp, rapid-fire intellect and mental clarity.",
    potentialTitle: "The Visionary Intellectual",
    potentialBody:
      "Individuals with this plane are intellectual powerhouses. They possess the rare ability to bridge abstract vision (9) with analytical logic (4) and intuitive sensitivity (2), creating a mind that is both fast and deep.\n\nThe light side of this arrow is 'Clarity of Purpose.' These individuals can see through complexity to find the simplest, most effective solution. They have an exceptional capacity for memory and strategic foresight. Their gift is the ability to communicate high-level concepts in a way that is logical, systematic, and persuasive.",
    shadowTitle: "Intellectual Arrogance",
    shadowBody:
      "When this horizontal mental plane is full, the individual possesses a sharp, rapid-fire intellect. The shadow manifests as a 'God Complex' of the mind. They may become so detached from the physical world that they treat people as data points or chess pieces. The shadow side is a cold, clinical superiority where the person values logic over empathy, often leading to social isolation because they cannot tolerate 'intellectual inferiority' in others.",
  },
  {
    id: "spirituality",
    name: "Arrow of Spirituality / Heart",
    numbers: [3, 5, 7],
    drawOnGrid: true,
    state: "full",
    category: "primary",
    coreTrait: "Deep intuition and soulful awareness.",
    potentialTitle: "The Conscious Empath",
    potentialBody:
      "This plane indicates deep emotional and spiritual sensitivity. It is the signature of the 'Human Lie Detector' who moves through the world guided by an internal moral and intuitive compass.\n\nThe potential here is 'Sovereign Compassion.' These individuals are not just sensitive; they are spiritually resilient. They use their 5-center power to anchor their emotions, allowing them to provide a healing presence for others without being drained. They possess a natural wisdom regarding the 'unseen' laws of life and are often the spiritual anchors of their families.",
    shadowTitle: "The Martyr Complex",
    shadowBody:
      "This soul plane provides deep intuition, but its shadow is the 'Wounded Healer' who cannot heal themselves. This person may become addicted to emotional drama or spiritual 'highs,' losing touch with practical reality. They often suffer from a martyr complex, subconsciously seeking out suffering or 'broken' people to fix, which leads to chronic emotional exhaustion and a loss of personal identity.",
  },
  {
    id: "practicality",
    name: "Arrow of Practicality",
    numbers: [8, 1, 6],
    drawOnGrid: true,
    state: "full",
    category: "primary",
    coreTrait: "Builder energy — grounded, capable, and dependable.",
    potentialTitle: "The Master of Manifestation",
    potentialBody:
      "This indicates a person who is exceptionally grounded and capable in the material world. It is the signature of the Architect of Reality — one who turns abstract ideas into tangible, lasting wealth.\n\nThe light side is 'Physical Integrity.' These individuals understand the mechanics of the world perfectly. They possess the organizational grit to manage complex systems and the financial intelligence to ensure long-term stability. Their gift is the ability to create physical security and luxury that serves as a foundation for their higher goals.",
    shadowTitle: "Materialistic Myopia",
    shadowBody:
      "This physical plane is the mark of the builder, but its shadow is a soul-crushing obsession with the tangible. The individual may define their entire worth — and the worth of others — by bank accounts, titles, and possessions. They risk becoming a 'cog in the machine,' unable to appreciate anything that cannot be measured, weighed, or sold. This shadow manifests as a deep, underlying anxiety about poverty, even when they are wealthy.",
  },

  // ── COLUMNS ───────────────────────────────────────────────────────────────
  {
    id: "planning",
    name: "Arrow of the Planner",
    numbers: [4, 3, 8],
    drawOnGrid: true,
    state: "full",
    category: "primary",
    coreTrait: "Methodical planning, precision, and architectural strategy.",
    potentialTitle: "The Strategic Architect",
    potentialBody:
      "Known as the Golden Raj Yog of Thought, this combines the discipline of 4 and the creativity of 3 with the knowledge of 8. It represents the supreme ability to design a future before it happens.\n\nThe potential is 'Architectural Destiny.' These individuals do not live by chance; they live by design. They can see the structural weaknesses in any plan and have the mental stamina to build systems that endure. They are the master strategists who ensure that every action taken today serves a goal ten years in the future.",
    shadowTitle: "Analysis Paralysis",
    shadowBody:
      "This vertical line provides structural order, but its shadow is a paralyzing need for perfection. The person becomes so focused on the blueprint that they never start the construction. They can become pedantic, obsessing over minor details while the 'big picture' fades away. In a team setting, this shadow creates a micromanager who stifles creativity in the name of 'the right way.'",
  },
  {
    id: "willpower",
    name: "Arrow of Determination",
    numbers: [9, 5, 1],
    drawOnGrid: true,
    state: "full",
    category: "primary",
    coreTrait: "Ambitious, strong-willed, persistent, and resilient drive.",
    potentialTitle: "The Unstoppable Will",
    potentialBody:
      "This is the Central Pillar of the grid. It represents the backbone of character — an unstoppable drive fueled by ambition (9), central power (5), and self-identity (1).\n\nThe light side is 'Radiant Persistence.' This is the power to bounce back from any failure with more wisdom than before. These individuals possess a 'Quiet Authority' — they don't need to shout to be heard because their will is so concentrated. Their gift is the ability to see a project through to the very end, long after others have given up.",
    shadowTitle: "The Steamroller",
    shadowBody:
      "This central vertical line is the ultimate engine of drive, but its shadow is a ruthless disregard for the obstacles in its path — including other people. The willpower becomes so intense that it turns into tyranny. The person may find it impossible to pivot or admit a mistake, driving a failing project or a broken relationship into the ground simply because they refuse to 'lose.'",
  },
  {
    id: "action",
    name: "Arrow of Execution",
    numbers: [2, 7, 6],
    drawOnGrid: true,
    state: "full",
    category: "primary",
    coreTrait: "High capability to turn concepts into rapid, real-world deeds.",
    potentialTitle: "The Kinetic Genius",
    potentialBody:
      "This indicates a person of effective action. They possess 'Body Intelligence' — the ability to move from thought to deed with seamless precision and consideration for others.\n\nThe potential is 'Mastery of the Moment.' These are the 'Doers' who make difficult tasks look easy. They excel in environments where rapid, high-stakes decisions are required. Their gift is the ability to mobilize resources and people instantly, turning a stagnant situation into a thriving, active environment.",
    shadowTitle: "Chaotic Busywork",
    shadowBody:
      "This vertical line indicates the ability to execute, but its shadow is 'movement without progress.' The person feels a constant, itchy need to be doing something. They may burn through physical energy on low-value tasks just to avoid the discomfort of stillness or self-reflection. This shadow often leads to burnout and a life that looks productive on the outside but feels hollow on the inside.",
  },

  // ── DIAGONALS (straight-line, drawn on grid) ──────────────────────────────
  {
    id: "prosperity",
    name: "Arrow of Prosperity (Golden Yog)",
    numbers: [4, 5, 6],
    drawOnGrid: true,
    state: "full",
    category: "secondary",
    coreTrait:
      "The Golden Yog: a mark of rare alignment between discipline, internal power, and responsibility.",
    potentialTitle: "The Conscious Manifestor",
    potentialBody:
      "This diagonal represents a perfect alignment between discipline (4), adaptability (5), and the appreciation of quality (6). The potential here is the ability to generate abundance not through luck, but through a consistent 'flow state.' These individuals have a natural sense of 'divine timing' in business and personal growth.\n\nThis represents the perfect flow between the Wood (4), Earth (5), and Metal (6) elements. The potential is a life where material abundance serves a higher purpose. These individuals have a 'midas touch' because they understand that wealth is a tool for creating security and harmony for others.",
    shadowTitle: "The Ethical Shortcut",
    shadowBody:
      "While known as the 'Golden Yog,' the shadow manifests as a 'mercenary' soul. When this diagonal is heavily saturated, the individual treats life as a transaction where 'winning' is the only metric of value. They may become morally flexible, believing that the end justifies the means. The shadow side creates a person who achieves great wealth but finds themselves surrounded by people who only value them for their utility, leading to a profound sense of being a 'successful fraud.'",
  },
  {
    id: "stability-emotional",
    name: "Arrow of Emotional Stability (Silver Yog)",
    numbers: [2, 5, 8],
    drawOnGrid: true,
    state: "full",
    category: "secondary",
    coreTrait:
      "The Property Yog: provides a profound internal shock-absorber and Silver resonance.",
    potentialTitle: "The Anchor of Peace",
    potentialBody:
      "Connecting the heart (2), the center (5), and the ground (8), this arrow is the 'Master of Composure.' The light side is a profound emotional intelligence. These individuals possess an internal shock-absorber that allows them to remain calm during crises. They are the natural mediators of the world, capable of feeling deeply (2) without being swept away by the current.\n\nTheir presence is grounding to others. They possess a 'knowing' that life is cyclical, which grants them the patience to wait for the right moment to act.",
    shadowTitle: "The Impenetrable Ice",
    shadowBody:
      "This 'Silver Yog' can become a 'Silver Prison.' The shadow side is 'emotional bypassing' — using balance as a shield against intimacy. The person becomes so 'balanced' that they appear robotic or unfeeling. They may use logic or spiritual concepts to avoid the messiness of true human connection. This shadow creates a partner or friend who is 'perfect' on paper but impossible to reach emotionally; they offer a solution for every problem but never a shoulder to cry on.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PART II — WEAKNESS ARROWS (Empty — all three numbers absent from the chart)
// drawOnGrid = true for straight-line ones, false for non-straight.
// Weakness arrows that ARE straight lines get drawn (with dashed/red style).
// ─────────────────────────────────────────────────────────────────────────────
export const WEAKNESS_ARROWS: ArrowMeaning[] = [
  // ── STRAIGHT-LINE WEAKNESSES (drawn on grid) ──────────────────────────────
  {
    id: "frustration",
    name: "Arrow of Frustration",
    numbers: [4, 5, 6],
    drawOnGrid: true, // diagonal TL→BR
    state: "empty",
    category: "weakness",
    coreTrait:
      "Regular disappointment and depression. Hidden aggression when things don't go as planned.",
    shadowTitle: "Chronic Dissatisfaction",
    shadowBody:
      "When the central horizontal line is missing, the person feels a deep, soul-level 'itch' that they cannot scratch. No matter what they achieve, it feels insufficient. The shadow manifests as a tendency to blame the 'universe' or 'luck' for their unhappiness. They often feel like an outsider looking in, convinced that everyone else has the 'secret key' to happiness that they lack. This creates a 'structural leak' in fortune — the person may work harder than everyone else but feels like they are constantly fighting an invisible headwind.",
  },
  {
    id: "scepticism",
    name: "Arrow of Scepticism",
    numbers: [3, 5, 7],
    drawOnGrid: true, // row 1
    state: "empty",
    category: "weakness",
    coreTrait:
      "Deep lack of trust. Only accepts proven facts. Often cynical about the motives of others.",
    shadowTitle: "The Cynical Fortress",
    shadowBody:
      "Without the soul plane, the person struggles to trust anything they cannot see or touch. The shadow is a bitter cynicism. They may view love as a biological transaction and spirituality as a scam. This creates a 'fortress of one,' where the individual is safe from being fooled but is also entirely alone, unable to experience the 'magic' of the irrational or the unseen. This is an 'Island Personality' that suffers in absolute silence, viewing isolation as superiority.",
  },
  {
    id: "indecision",
    name: "Arrow of Indecision",
    numbers: [9, 5, 1],
    drawOnGrid: true, // col 1 (same cells as willpower)
    state: "empty",
    category: "weakness",
    coreTrait:
      "Lacks the 'killer instinct.' Tasks are left halfway. High potential for procrastination.",
    shadowTitle: "The Eternal Procrastinator",
    shadowBody:
      "The absence of this diagonal creates a 'vacuum of will.' The shadow side is a life lived in the waiting room. The person waits for the perfect sign, the perfect mood, or the perfect partner before they act. They may become 'professional students,' constantly collecting information but never applying it, leading to a profound sense of wasted potential.",
  },
  {
    id: "impracticality",
    name: "Arrow of Impracticality",
    numbers: [4, 3, 8],
    drawOnGrid: true, // col 0 (same cells as planning)
    state: "empty",
    category: "weakness",
    coreTrait:
      "Lives in a dream world. Too much logic or emotion without 'common sense.' Highly idealistic.",
    shadowTitle: "The Starving Artist",
    shadowBody:
      "Without the physical foundation, the person lives entirely in the 'clouds.' The shadow is a total inability to navigate the material world. They may be brilliant philosophers but cannot pay a utility bill on time. This leads to a life of dependency on others, which eventually turns into resentment, as they feel the 'world' doesn't appreciate their genius enough to take care of their mundane needs.",
  },
  {
    id: "emotional-instability",
    name: "Arrow of Emotional Instability",
    numbers: [2, 5, 8],
    drawOnGrid: true, // diagonal TR→BL
    state: "empty",
    category: "weakness",
    coreTrait:
      "Easily hurt and very shy. May develop an inferiority complex to hide deep sensitivity.",
    shadowTitle: "The Reactive Mirror",
    shadowBody:
      "Without the central vertical emotional column, there is no 'inner anchor.' The shadow is a person who is a slave to their environment. If the room is happy, they are happy; if the room is tense, they have a panic attack. They lack a stable sense of self, often 'shape-shifting' their personality to match whoever they are with, leading to a fragmented and exhausting existence. They are hyper-reactive to the moods of others.",
  },
  {
    id: "loss",
    name: "Arrow of Loss",
    numbers: [2, 7, 6],
    drawOnGrid: true, // col 2 (same cells as action)
    state: "empty",
    category: "weakness",
    coreTrait: "Potential for structural leaks in plans and legal boundaries.",
    shadowTitle: "The Leaky Vessel",
    shadowBody:
      "This configuration suggests a life where success 'slips through the fingers.' The shadow side is a subconscious pattern of self-sabotage. Just as they reach the pinnacle of a project, they may make a careless legal error or trust the wrong person, resulting in a total loss. It feels like 'fate,' but it is often an internal lack of boundaries.",
  },

  // ── NON-STRAIGHT WEAKNESSES (meaning shown at bottom only) ────────────────
  {
    id: "hesitation",
    name: "Arrow of Hesitation / Inactivity",
    numbers: [7, 8, 9],
    drawOnGrid: false,
    state: "empty",
    category: "weakness",
    coreTrait:
      "Lacks motivation. High 'talk' but very little 'walk.' Often fails to plan for the future.",
    shadowTitle: "Fear of the Finish Line",
    shadowBody:
      "When the bottom row is missing, the person starts with fire but ends with a whimper. The shadow is the '90% completion' curse. They abandon projects, relationships, and goals just as they are about to bear fruit. This is often a subconscious defense mechanism — if they never finish, they can never be judged as a failure.",
  },
  {
    id: "mental-fatigue",
    name: "Arrow of Mental Fatigue / Poor Memory",
    numbers: [3, 6, 9],
    drawOnGrid: false,
    state: "empty",
    category: "weakness",
    coreTrait:
      "Forgetful nature that worsens over time. Struggles to retain complex information.",
    shadowTitle: "Cognitive Avoidance",
    shadowBody:
      "When the top mental plane is empty, the person finds intellectual exertion painful or boring. The shadow side is a retreat into 'low-vibration' distractions. They may become addicted to mindless entertainment, scrolling, or gossip to avoid the 'heavy lifting' of critical thinking. This leads to a life of being easily manipulated by others' opinions because they haven't developed their own.",
  },
  {
    id: "delusion",
    name: "Arrow of Delusion",
    numbers: [8, 5, 2],
    drawOnGrid: false,
    state: "empty",
    category: "weakness",
    coreTrait: "Tendency to construct protective mental narratives.",
    shadowTitle: "The Hall of Mirrors",
    shadowBody:
      "Without the 'Silver Yog' (8-5-2), the person lacks an emotional anchor. The shadow is a tendency to lie to oneself to avoid pain. They construct elaborate fantasies and narratives to explain away their failures, eventually becoming unable to distinguish between the truth and the story they've told so often.",
  },
  {
    id: "theft-loss",
    name: "Arrow of Loss / Theft",
    numbers: [2, 4, 6],
    drawOnGrid: false,
    state: "empty",
    category: "weakness",
    coreTrait:
      "The lack of 2, 4, and 6 suggests a person who is prone to 'leaks' in their life — financial loss, stolen ideas, or misplaced trust.",
    shadowTitle: "The Leaky Vessel (Structural)",
    shadowBody:
      "This configuration suggests a life where success 'slips through the fingers.' The shadow side is a subconscious pattern of self-sabotage. Just as they reach the pinnacle of a project, they may make a careless legal error, leading to total loss. They feel cursed by fate, but it is an internal lack of boundaries.",
  },
  {
    id: "loneliness",
    name: "Arrow of Loneliness / Resignation",
    numbers: [3, 5, 7],
    drawOnGrid: false, // same cells as scepticism — separate card for this distinct meaning
    state: "empty",
    category: "weakness",
    coreTrait:
      "Beyond mere skepticism, the absence of the spiritual plane creates an 'Island Personality.'",
    shadowTitle: "The Island Personality",
    shadowBody:
      "These people often feel like they are fighting the world alone. They may become stoic to the point of coldness, resigning themselves to a life without deep emotional connection. They often suffer in silence, believing that no one can truly understand their inner depth.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PART III — NON-STRAIGHT STRENGTH ARROWS (meaning shown at bottom only)
// These do NOT form straight rows/columns/diagonals on the 3×3 grid.
// ─────────────────────────────────────────────────────────────────────────────
export const NONSTRAIGHT_STRENGTH_ARROWS: ArrowMeaning[] = [
  {
    id: "peace-of-mind",
    name: "Arrow of Peace of Mind",
    numbers: [3, 6, 9],
    drawOnGrid: false,
    state: "full",
    category: "secondary",
    coreTrait: "Serene, tranquil nature, and excellent mental retention.",
    potentialTitle: "Sublime Contentment",
    potentialBody:
      "These individuals possess a serene and tranquil nature. They are often satisfied with their lives and do not easily fall prey to anxiety or the 'rat race.' They have a clear conscience and a balanced approach to the past, present, and future. People with a full 3-6-9 line have an excellent capacity for memory and retention. They are often 'old souls' who find it easy to be happy with the simple things in life.",
    shadowTitle: "The Detached Observer",
    shadowBody:
      "The shadow side is a retreat into emotional numbness. The peace is maintained by refusing to engage with life's messy but necessary conflicts.",
  },
  {
    id: "vitality",
    name: "Arrow of Activity / Vitality",
    numbers: [7, 8, 9],
    drawOnGrid: false,
    state: "full",
    category: "secondary",
    coreTrait: "Physical robustness, high energy, and love for dynamic change.",
    potentialTitle: "Unstoppable Momentum",
    potentialBody:
      "This is the arrow of the high-energy individual. They are physically robust and usually have a high metabolism. They need to be 'on the move' to feel alive and are often found in sports, manual labor, or high-stakes travel. The presence of 7, 8, and 9 creates a person who is constantly seeking new experiences. They are not content with sitting behind a desk; they want to be where the action is.",
    shadowTitle: "Burnout Exhaustion",
    shadowBody:
      "The shadow side is 'Inactivity' when the tank runs dry. They push so hard that they eventually collapse, leading to long periods of forced rest and depression.",
  },
  {
    id: "intuition-experience",
    name: "Arrow of Intuition / Experience",
    numbers: [1, 4, 7],
    drawOnGrid: false,
    state: "full",
    category: "secondary",
    coreTrait: "Grounded intuition, mechanical aptitude, and hand-to-earth wisdom.",
    potentialTitle: "Pragmatic Mastery",
    potentialBody:
      "Individuals with this arrow prefer to learn by doing rather than by reading. They have a 'street smart' intuition that allows them to read a situation physically before they analyze it mentally. They are grounded and realistic. These people are often gifted with their hands. They understand the mechanics of the world and are very sensitive to the physical environment around them.",
    shadowTitle: "Materialistic Skepticism",
    shadowBody:
      "The shadow side is a refusal to believe in anything that cannot be touched or measured. They may dismiss spiritual or emotional intelligence as 'useless fluff.'",
  },
  {
    id: "art-science",
    name: "Arrow of Art / Science",
    numbers: [1, 2, 3],
    drawOnGrid: false,
    state: "full",
    category: "secondary",
    coreTrait: "Merges scientific precision with artistic flair.",
    potentialTitle: "The Aesthetic Visionary",
    potentialBody:
      "This combination links the Self (1), Intuition (2), and Creativity (3). It produces an individual who can merge scientific precision with artistic flair.\n\nThe potential is 'The Master Craftsman.' They find the symmetry in math and the logic in music. They are the ones who can build a machine that is also a work of art, or write code that is as elegant as a poem.",
    shadowTitle: "The Starving Perfectionist",
    shadowBody:
      "The conceptual 'Artistic Soul' bridge often suffers from 'The Execution Gap.' Because they have a deep need for symmetry and beauty, they may refuse to release any work that is less than perfect. The shadow is a life of unfinished masterpieces and 'what ifs,' as they are too afraid of being judged for their imperfections.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PART IV — MINOR ARROWS (2-number bridges)
// NEVER drawn on grid. Meanings shown at bottom only.
// ─────────────────────────────────────────────────────────────────────────────
export const MINOR_ARROWS: ArrowMeaning[] = [
  {
    id: "bridge-4-9",
    name: "The 4–9 Bridge",
    numbers: [4, 9],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Mental Intensity: Combines Wood's discipline with Fire's vision.",
    potentialTitle: "The High-Level Strategist",
    potentialBody:
      "This combines Wood's discipline with Fire's vision. The light side is the 'General's Mind.' They can see 10 steps ahead and have the organizational grit to ensure every step is executed. They excel at turning abstract concepts into institutional realities.",
    shadowTitle: "The Intellectual Tyrant",
    shadowBody:
      "When these two are active without the 2, the mind is a high-speed engine with no brakes. The shadow is a ruthless arrogance. This person doesn't just want to be right; they want to prove everyone else is wrong.",
  },
  {
    id: "bridge-9-2",
    name: "The 9–2 Bridge",
    numbers: [9, 2],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Performance Drama: Linking fame with sensitivity.",
    potentialTitle: "The Magnetic Influencer",
    potentialBody:
      "Linking fame with sensitivity. The potential here is 'Social Grace.' These individuals move through the world with an effortless charisma because they truly listen to the emotional undertones of a room.",
    shadowTitle: "The Professional Victim",
    shadowBody:
      "The shadow is the 'Performer of Pain.' The person may subconsciously exaggerate their problems or emotional state to gain attention or 'fame' within their social circle.",
  },
  {
    id: "bridge-3-5",
    name: "The 3–5 Bridge",
    numbers: [3, 5],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Impulsive Drive: Links the plan (3) with internal power (5).",
    potentialTitle: "The Courageous Creative",
    potentialBody:
      "This links the plan (3) with the internal power (5). The light side is 'Dynamic Innovation.' They have the guts to try ideas that others are afraid of. They are the pioneers who can build a bridge while they are walking on it.",
    shadowTitle: "The Scattered Fire",
    shadowBody:
      "The person starts brilliant projects but burns them down out of boredom or a sudden emotional whim. They are the 'eternal beginner' who has a drawer full of half-finished masterpieces but no completed work.",
  },
  {
    id: "bridge-5-7",
    name: "The 5–7 Bridge",
    numbers: [5, 7],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "The Restless Seeker: Linking centered power with the lessons of the 7.",
    potentialTitle: "The Intuitive Sage",
    potentialBody:
      "Linking centered power with the lessons of the 7. The potential is 'Wisdom through Experience.' These individuals process their challenges into profound insights. They have a 'built-in truth detector.'",
    shadowTitle: "The Spiritual Tourist",
    shadowBody:
      "The person moves from one philosophy, diet, or lifestyle to another, never staying long enough to gain true wisdom. They are searching for a 'magic bullet' to fix their internal discomfort.",
  },
  {
    id: "bridge-8-1",
    name: "The 8–1 Bridge",
    numbers: [8, 1],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Practical Start: Combining knowledge with career drive.",
    potentialTitle: "The Ethical Professional",
    potentialBody:
      "Combining knowledge with career drive. The light side is 'Integrity in Action.' These are the professionals who do the right thing when no one is watching. They have an immense capacity for detailed work.",
    shadowTitle: "The Workhorse Paradox",
    shadowBody:
      "The person is excellent at the physical logistics of starting a business or project but lacks the vision (9) to see where it should go. They become stuck in a loop of 'setting things up.'",
  },
  {
    id: "bridge-1-6",
    name: "The 1–6 Bridge",
    numbers: [1, 6],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Status Ambition: Linking career with home and duty.",
    potentialTitle: "The Harmonious Leader",
    potentialBody:
      "Linking career with the home / luxury of the 6. The potential is 'Empathetic Governance.' They view their professional team as a family. They create work environments that are beautiful, supportive, and highly functional.",
    shadowTitle: "The False Facade",
    shadowBody:
      "The person becomes obsessed with the image of success. They may live in a mansion they can barely afford or spend hours curating a social media profile that bears no resemblance to their real life.",
  },
  {
    id: "bridge-4-3",
    name: "The 4–3 Bridge",
    numbers: [4, 3],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Rigid Planning: The double-wood energy of discipline and planning.",
    potentialTitle: "The Master of Craft",
    potentialBody:
      "The double-wood energy of discipline and planning. The light side is 'Exceptional Precision.' Whether they are building a house or writing code, they possess a 'golden touch' for detail.",
    shadowTitle: "The Micromanager",
    shadowBody:
      "Because they have the wood energy of both discipline and planning, they can become terrified of chaos. They plan their vacations down to the minute and their relationships like business mergers.",
  },
  {
    id: "bridge-3-8",
    name: "The 3–8 Bridge",
    numbers: [3, 8],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Intellectual Stubbornness: Linking planning with earth energy.",
    potentialTitle: "The Scholar of Life",
    potentialBody:
      "Linking planning with the earth of 8. The light side is 'Structural Intellect.' They have a gift for taking complex systems of knowledge and organizing them so others can understand.",
    shadowTitle: "The Closed Circuit",
    shadowBody:
      "Once this person has learned something, they stop listening. They believe their knowledge is a finished product rather than a growing process, stuck in outdated ways of thinking.",
  },
  {
    id: "bridge-9-5",
    name: "The 9–5 Bridge",
    numbers: [9, 5],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Force over Flow: Fire of recognition meets the power of the center.",
    potentialTitle: "The Charismatic Authority",
    potentialBody:
      "The fire of recognition meets the power of the 5. The light side is 'Authentic Presence.' When they walk into a room, the energy shifts. They lead not through force, but through a radiant self-confidence.",
    shadowTitle: "Force over Flow",
    shadowBody:
      "The person believes that enough willpower can solve any problem. They don't negotiate; they overwhelm. In relationships, this manifests as a 'my way or the highway' attitude.",
  },
  {
    id: "bridge-5-1",
    name: "The 5–1 Bridge",
    numbers: [5, 1],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "The Drifter: Connecting the center to self-expression.",
    potentialTitle: "The Fluid Communicator",
    potentialBody:
      "Connecting the center to self-expression. The light side is 'Articulate Adaptability.' They can explain anything to anyone, shifting their communication style to meet the needs of their audience.",
    shadowTitle: "Identity Diffusion",
    shadowBody:
      "Without the fire of the 9 to give them direction, the 5-1 energy can become a person who just 'is.' They drift from job to job and partner to partner with no internal 'why.'",
  },
  {
    id: "bridge-2-7",
    name: "The 2–7 Bridge",
    numbers: [2, 7],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Compassionate Analyst: Intense, volatile emotional drives and analytical depth.",
    potentialTitle: "The Compassionate Analyst",
    potentialBody:
      "Linking sensitivity with the analysis of 7. The potential is 'Deep Insight.' They can look at a problem — or a person — and see the hidden patterns. They make excellent therapists, researchers, or investigators.",
    shadowTitle: "Resentful Sacrifice",
    shadowBody:
      "The shadow is the person who gives 'with a receipt.' They help others, sacrifice their time, and listen to problems — but they keep a secret tally. When they don't get the specific recognition they feel they've earned, they explode in a 'volcano of resentment.'",
  },
  {
    id: "bridge-7-6",
    name: "The 7–6 Bridge",
    numbers: [7, 6],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Creative Control: Linking spiritual analysis with domestic harmony.",
    potentialTitle: "The Aesthetic Refiner",
    potentialBody:
      "Linking spiritual analysis with domestic harmony. The light side is 'Sophisticated Grace.' They have a natural talent for making life beautiful. They are the curators of culture, creating homes and communities that act as 'sanctuaries' for the soul.",
    shadowTitle: "The Perfectionist Prison",
    shadowBody:
      "The person is so focused on the 'perfect' environment that no one is allowed to actually live in it. This shadow creates a spouse or parent who berates their family over a misplaced coaster, valuing 'order' more than the people the order was meant to serve.",
  },
  {
    id: "bridge-4-5",
    name: "The 4–5 Bridge",
    numbers: [4, 5],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Financial Hoarding: Linking wealth with central power.",
    potentialTitle: "The Grounded Expander",
    potentialBody:
      "Linking wealth with central power. The light side is 'Sustainable Growth.' They don't believe in 'get-rich-quick' schemes. They build their lives brick by brick, ensuring that every new level of success is supported by a solid foundation.",
    shadowTitle: "The Scarcity Mindset",
    shadowBody:
      "No matter how much money is in the bank, they feel poor. They may deprive themselves of joy or comfort to save for a 'rainy day' that never comes. This shadow is a life lived in fear of loss.",
  },
  {
    id: "bridge-5-6",
    name: "The 5–6 Bridge",
    numbers: [5, 6],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "The Smotherer: Linking central power with protection.",
    potentialTitle: "The Community Guardian",
    potentialBody:
      "Linking central power with the protection of the 6. The light side is 'The Protective Heart.' They use their strength to shield the vulnerable. They are often the 'glue' that holds a group together.",
    shadowTitle: "Enmeshed Protection",
    shadowBody:
      "The 6's focus on family and the 5's power create a person who cannot let go. They may use guilt or 'safety' as a way to control their children or partners, preventing them from growing.",
  },
  {
    id: "bridge-8-5",
    name: "The 8–5 Bridge",
    numbers: [8, 5],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "The Academic Elitist: Linking knowledge with centered stability.",
    potentialTitle: "The Practical Philosopher",
    potentialBody:
      "Linking knowledge with centered stability. The light side is 'Living Wisdom.' They don't just study concepts; they live them. They have a rare ability to apply high-level philosophy to mundane, everyday problems.",
    shadowTitle: "Dry Logic",
    shadowBody:
      "The shadow is a person who has 'all the facts and none of the truth.' They can explain the chemical composition of a rose but can't smell its beauty. They often treat emotions as 'errors in data.'",
  },
  {
    id: "bridge-5-2",
    name: "The 5–2 Bridge",
    numbers: [5, 2],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "The Illusionist: Link between the power center and high sensitivity.",
    potentialTitle: "The Intuitive Mirror",
    potentialBody:
      "The link between the power center and high sensitivity. The light side is 'Radiant Empathy.' They have the ability to reflect the best parts of others back to them. By being fully present, they help people see their own potential.",
    shadowTitle: "The Hall of Mirrors",
    shadowBody:
      "This person perceives slights where there are none and creates complex narratives about others' motivations that have no basis in reality. They live in a world of 'feelings as facts.'",
  },
  {
    id: "bridge-2-4",
    name: "The Arrow of Wisdom (2–4)",
    numbers: [2, 4],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Logic and intuition interacting to produce resourcefulness.",
    potentialTitle: "The Intuitive Logician",
    potentialBody:
      "Number 4 (logic) and Number 2 (intuition) interact to produce a rather smart and resourceful mind. You seem to breeze effortlessly through anything handed over to you. The potential is a 'double-check' system where the gut feeling is instantly verified by logic.",
    shadowTitle: "The Schemer",
    shadowBody:
      "When logic (4) and intuition (2) link without the grounding of the central plane, the mind becomes 'too smart for its own good.' The shadow manifests as the ability to exploit loopholes and manipulate systems.",
  },
  {
    id: "bridge-6-8",
    name: "The Arrow of Compassion (6–8)",
    numbers: [6, 8],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Strong tendency to pursue risks and protect others.",
    potentialTitle: "The Sincere Protector",
    potentialBody:
      "A strong tendency to pursue risks and protect others. You care deeply about what others feel and try your best to show sincerity and win trust. The potential is 'Servant Leadership.'",
    shadowTitle: "The Resentful Martyr",
    shadowBody:
      "The shadow is a 'transactional kindness.' They care for others and take risks to protect people, but they keep a secret tally. When the recognition they feel they've earned isn't provided, they collapse into a 'volcano of resentment.'",
  },
  {
    id: "bridge-4-8",
    name: "The Arrow of Stability (4–8)",
    numbers: [4, 8],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Combination of perseverance and persistence.",
    potentialTitle: "The Solid Foundation",
    potentialBody:
      "A combination of perseverance and persistence. You are absolutely trusted by friends. It represents strong stabilization of inner energy. The light side is 'The Unshakeable Spirit.'",
    shadowTitle: "The Rigidity Trap",
    shadowBody:
      "The combination of perseverance and logic creates a person who is terrified of change. They become so dependent on a fixed setting or routine that any disruption causes a total system crash.",
  },
  {
    id: "bridge-2-6",
    name: "The Arrow of Harmony (2–6)",
    numbers: [2, 6],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Gentle and generous personality.",
    potentialTitle: "The Approachable Diplomat",
    potentialBody:
      "A gentle and generous personality. You treat everyone equally and assist others easily. Approachable and kind. The gift is 'Social Lubrication' — the ability to bridge gaps between conflicting parties.",
    shadowTitle: "The Enabler",
    shadowBody:
      "The shadow of this gentle personality is 'peace at any price.' To maintain the appearance of harmony, they will suppress their own truth and enable the toxic behavior of others.",
  },
  {
    id: "bridge-1-2",
    name: "The Arrow of Detail (1–2)",
    numbers: [1, 2],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Intense focus on small facts and data.",
    potentialTitle: "The Precision Specialist",
    potentialBody:
      "Intense focus on small facts and data. It is the signature of the craftsman who understands that the whole is only as good as its smallest part. The potential is 'Excellence through Awareness.'",
    shadowTitle: "The Pedant",
    shadowBody:
      "The person loses the ability to see the 'Big Picture' because they are fixated on a single, trivial detail. In projects, they may stall an entire team's progress because one minor font or data point isn't 'correct.'",
  },
  {
    id: "bridge-3-9",
    name: "The Arrow of Curiosity (3–9)",
    numbers: [3, 9],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "A mind that never stops asking 'Why?'",
    potentialTitle: "The Eternal Questioner",
    potentialBody:
      "A mind that never stops asking 'Why?' This bridge ensures that the spirit remains young and the intellect remains sharp. The potential is 'Lifelong Growth.'",
    shadowTitle: "The Mental Drifter",
    shadowBody:
      "The mind that never stops asking 'Why?' can become a mind that never starts 'Doing.' They collect degrees, books, and facts like trophies but never apply them to build a life.",
  },
  {
    id: "bridge-5-9",
    name: "The Arrow of Courage (5–9)",
    numbers: [5, 9],
    drawOnGrid: false,
    state: "full",
    category: "minor",
    coreTrait: "Bravery in the face of physical and existential danger.",
    potentialTitle: "The Fearless Pioneer",
    potentialBody:
      "Bravery in the face of physical and existential danger. This bridge provides the 'Fire' needed to cross the unknown. The light side is 'Inspiring Initiative.'",
    shadowTitle: "The Reckless Gambler",
    shadowBody:
      "Their bravery is not calculated; it is impulsive. They take physical, financial, and emotional risks just to feel the 'rush' of the 5-9 energy, often leaving a trail of chaos for others to clean up.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MASTER EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_ARROWS: ArrowMeaning[] = [
  ...PRIMARY_STRENGTH_ARROWS,
  ...WEAKNESS_ARROWS,
  ...NONSTRAIGHT_STRENGTH_ARROWS,
  ...MINOR_ARROWS,
];

/** All arrows that should be drawn on the grid (full OR empty straight-line arrows) */
export const GRID_DRAWABLE_ARROWS: ArrowMeaning[] = ALL_ARROWS.filter(
  (a) => a.drawOnGrid
);

/** All arrows whose meanings are shown only in the bottom cards section */
export const BOTTOM_ONLY_ARROWS: ArrowMeaning[] = ALL_ARROWS.filter(
  (a) => !a.drawOnGrid
);