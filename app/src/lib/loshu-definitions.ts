// ALL VERBATIM SOURCE CONTENT — Do not paraphrase or alter.
// This file contains Alexandrov psychomatrix count-based number detail layers (1-4 occurrences).
// HISTORICAL NOTE: The file retains the "loshu" name, but the classical Chinese Lo Shu
// is a 3×3 magic square (rows sum to 15). The count-based system here is from the
// Alexandrov school of numerology, adapted onto the 3×3 grid format.

export interface NumberCountMeaning {
  label: string;
  meaning: string;
}

export interface NumberDefinition {
  ruler: string;
  element: string;
  governs: string;
  counts: {
    1: NumberCountMeaning;
    2: NumberCountMeaning;
    3: NumberCountMeaning;
    4: NumberCountMeaning;
  };
  drownsNumbers?: number[]; // which numbers it drowns at saturation
}

export interface LifePathConflict {
  corePurpose: string;
  condition: string;
  psychodynamicResult: string;
}

export interface Remedy {
  missing: string;
  overloaded: string;
}

export const LOSHU_NUMBER_DEFINITIONS: Record<number, NumberDefinition> = {
  1: {
    ruler: "Sun",
    element: "Water",
    governs: "Career & Communication",
    counts: {
      1: {
        label: "Single 1",
        meaning: "Characterizes an introverted individual who finds it difficult to express their inner feelings, despite potentially having strong technical skills.",
      },
      2: {
        label: "Double 1",
        meaning: "Represents the ideal balance, allowing for fluent, effective, and impartial communication.",
      },
      3: {
        label: "Triple 1",
        meaning: "The energy becomes over-saturated, leading to a \"talkative\" persona often viewed as an entertainer. While seemingly outgoing, the triple 1 can drown out the 8 (knowledge) and 3 (planning), leading to speech that is performative rather than constructive.",
      },
      4: {
        label: "Quadruple 1",
        meaning: "Paradoxically, excessive 1s lead back to nonexpression. The person finds verbal communication so painful or difficult that they often retreat into writing, painting, or other non-oral mediums. At this level, the 1 \"drowns\" the 9 (fame), as the person's ego becomes so complex they cannot handle public recognition.",
      },
    },
    drownsNumbers: [8, 3],
  },
  2: {
    ruler: "Moon",
    element: "Earth",
    governs: "Intuition, Sensitivity & Partnerships",
    counts: {
      1: {
        label: "Single 2",
        meaning: "Indicates a highly sensitive and intuitive person who is easily hurt and may lack the ability to use their intuition to judge others effectively.",
      },
      2: {
        label: "Double 2",
        meaning: "Enhances the intellect and judgment power, allowing the individual to use their intuition for practical success.",
      },
      3: {
        label: "Triple 2",
        meaning: "This is the specific \"heavy emotional fog\" identified by experts. The triple 2 acts like an atmospheric saturation that douses the logic of the 9 (ambition) and the 4 (discipline). Decisions are made based on 100% feeling. The person becomes moody and over-sensitive, living in a world of their own emotional reactions that makes systematic thinking almost impossible.",
      },
      4: {
        label: "Quadruple 2",
        meaning: "The sensitivity reaches a point of total isolation. The individual becomes a \"loner,\" reacting with sudden anger or complete withdrawal when their emotional space is encroached upon. The 2 here completely douses the Fire of the 9, leading to a person who hides their talents due to fear of emotional exposure.",
      },
    },
    drownsNumbers: [9, 4],
  },
  3: {
    ruler: "Jupiter",
    element: "Wood",
    governs: "Intelligence, Planning & Creative Expression",
    counts: {
      1: {
        label: "Single 3",
        meaning: "Grants an excellent memory and strong communicative ability.",
      },
      2: {
        label: "Double 3",
        meaning: "Fosters significant creative potential, often channeled into writing or artistic pursuits.",
      },
      3: {
        label: "Triple 3",
        meaning: "Leads to \"over-imagining\". The person becomes a dreamer who constantly creates scenarios in their mind, distancing themselves from practical reality. This triple 3 \"drowns out\" the 4 (stability) and the 8 (discipline), making it hard for ideas to land.",
      },
      4: {
        label: "Quadruple 3",
        meaning: "The imagination becomes fearful. The person lives in an impractical world where the \"forest\" of ideas (Wood element) is so dense they cannot find the path to action. This configuration often indicates a fear of the very ideas the person generates, leading to a state of mental paralysis.",
      },
    },
    drownsNumbers: [4, 8],
  },
  4: {
    ruler: "Rahu",
    element: "Wood",
    governs: "Wealth, Stability & Physical Endurance",
    counts: {
      1: {
        label: "Single 4",
        meaning: "Indicates a practical, hardworking, and orderly life.",
      },
      2: {
        label: "Double 4",
        meaning: "Represents a person who is highly reliable and finishes every task assigned to them, reflecting creative discipline.",
      },
      3: {
        label: "Triple 4",
        meaning: "Hard work becomes obsessive. The person becomes so rigid in their point of view that they fail to understand others. The triple 4 \"drowns\" the 5 (adaptability) and the 6 (harmony), creating a personality that is reliable but strictly inflexible. They may feel that rest is \"unearned\" and become slaves to their own routines.",
      },
      4: {
        label: "Quadruple 4",
        meaning: "Leads to a life of extreme physical labor and \"ceaseless\" activity. The person becomes so pragmatic that they lose all sense of the spiritual (7) or the emotional (2). They are the builders who never live in the houses they construct.",
      },
    },
    drownsNumbers: [5, 6],
  },
  5: {
    ruler: "Mercury / Mars",
    element: "Earth",
    governs: "Balance, Adaptability & Emotional Stability",
    counts: {
      1: {
        label: "Single 5",
        meaning: "Symbolizes emotional stability, adaptability, and an affectionate personality that inspires others.",
      },
      2: {
        label: "Double 5",
        meaning: "Hardworking and self-confident but prone to sudden emotional spikes.",
      },
      3: {
        label: "Triple 5",
        meaning: "The energy becomes courageous but reckless. The person speaks and takes risks without thinking. This triple 5 \"drowns\" the 1 (career planning) and the 9 (recognition), as the person's impulsiveness destroys their professional reputation. They are highly inconsistent and prone to scattered rhythms in sleep and work.",
      },
      4: {
        label: "Quadruple 5",
        meaning: "Leads to extreme over-excitement and a high propensity for physical accidents. The person becomes so focused on freedom (Mars influence) that they cannot maintain any form of domestic stability (6). The central stability of the grid is replaced by a centrifugal force that pushes away all support.",
      },
    },
    drownsNumbers: [1, 9],
  },
  6: {
    ruler: "Venus",
    element: "Metal",
    governs: "Home, Family & Luxury",
    counts: {
      1: {
        label: "Single 6",
        meaning: "Indicates a good adviser and a person deeply attached to their family and domestic harmony.",
      },
      2: {
        label: "Double 6",
        meaning: "Enhances the love for beauty and creativity, often manifesting in a harmonious and artistic home environment.",
      },
      3: {
        label: "Triple 6",
        meaning: "The sense of responsibility becomes a source of chronic tension and stress. The person becomes \"high-tempered\" and gets angry easily when their domestic ideals are not met. The triple 6 \"drowns\" the 7 (inner peace) and the 2 (intuition), as the person's over-involvement in others' lives becomes a form of control.",
      },
      4: {
        label: "Quadruple 6",
        meaning: "While potentially excellent in creative activities, the person becomes emotionally weak. They are so consumed by the outward manifestation of care and luxury that they have no internal emotional reservoir. The Metal element here becomes a cage that locks them into a cycle of pleasing others at their own expense.",
      },
    },
    drownsNumbers: [7, 2],
  },
  7: {
    ruler: "Ketu",
    element: "Metal",
    governs: "Spirituality, Analysis & Lessons Through Loss",
    counts: {
      1: {
        label: "Single 7",
        meaning: "Represents a person who learns through standard life experiences and has a healthy quest for knowledge.",
      },
      2: {
        label: "Double 7",
        meaning: "Knowledge is gained specifically after suffering setbacks or losses.",
      },
      3: {
        label: "Triple 7",
        meaning: "Can lead to a life characterized by sadness and recurring disappointments. The person may withdraw into their own thoughts, becoming isolated. The triple 7 \"drowns\" the 3 (creativity) and the 5 (stability), as the person is so focused on the \"why\" of their suffering that they cannot plan for a better future or find emotional balance.",
      },
      4: {
        label: "Quadruple 7",
        meaning: "Faces significant challenges across all fronts — love, health, and finance. The search for inner wisdom becomes so heavy that the person loses touch with the material world (8) and the practical world (1). It is the mark of the ascetic who has found the truth but lost the ability to live in the world.",
      },
    },
    drownsNumbers: [3, 5],
  },
  8: {
    ruler: "Saturn",
    element: "Earth",
    governs: "Knowledge, Memory & Material Success",
    counts: {
      1: {
        label: "Single 8",
        meaning: "Characterizes a person who is scrupulous and detail-oriented, though their early life may be uncomfortable or challenging.",
      },
      2: {
        label: "Double 8",
        meaning: "The person becomes extremely stubborn and adamant. They learn lessons only from their own mistakes and find it impossible to change their mind.",
      },
      3: {
        label: "Triple 8",
        meaning: "Leads to an obsessive inclination toward materialistic pleasures. Growth often happens only after age 40. The triple 8 \"drowns\" the 5 (emotional balance) and the 2 (sensitivity). The person's self-worth is entirely tied to productivity, and they feel intense guilt when resting.",
      },
      4: {
        label: "Quadruple 8",
        meaning: "Paradoxically leads to fast progress in life but in a \"ceaseless\" and never-ending motion. The person is the ultimate \"achiever\" who is never satisfied. The leaden weight of Saturn (8) completely crushes the 9 (fame), as the person is too busy working to enjoy the recognition they have earned.",
      },
    },
    drownsNumbers: [5, 2],
  },
  9: {
    ruler: "Mars",
    element: "Fire",
    governs: "Fame, Energy & Humanitarianism",
    counts: {
      1: {
        label: "Single 9",
        meaning: "Indicates an intelligent, ambitious person striving for self-improvement.",
      },
      2: {
        label: "Double 9",
        meaning: "Represents a wise and clever person who may, however, always feel superior to others.",
      },
      3: {
        label: "Triple 9",
        meaning: "The person has a helping nature but gets irritated over minor issues. The Fire of the 9 is so intense it \"drowns\" the Water of the 1 (communication), leading to speech that is aggressive and critical rather than collaborative.",
      },
      4: {
        label: "Quadruple 9",
        meaning: "Indicates a highly intelligent person who finds it difficult to navigate the mundane lies of everyday life. They are \"too honest\" to the point of social destruction. The intensity of their ambition (Mars) completely overwhelms the stability of the 4 and the 2, leading to a person who burns through relationships and wealth in pursuit of a grand ideal.",
      },
    },
    drownsNumbers: [1],
  },
};

export const LIFE_PATH_CONFLICTS: Record<number, LifePathConflict> = {
  1: {
    corePurpose: "Leadership & Independence",
    condition: "Missing 1 or Triple 1",
    psychodynamicResult: "Struggling to find a voice or overwhelming others with ego.",
  },
  2: {
    corePurpose: "Partnership & Diplomacy",
    condition: "Triple 2 (Fog)",
    psychodynamicResult: "Destiny is harmony, but grid creates emotional chaos.",
  },
  3: {
    corePurpose: "Creativity & Vision",
    condition: "Missing 3 or Triple 3",
    psychodynamicResult: "Ideas that never land or an imagination that fears action.",
  },
  4: {
    corePurpose: "Stability & Order",
    condition: "Triple 4 (Rigidity)",
    psychodynamicResult: "Purpose is to build, but grid creates a cage of routine.",
  },
  5: {
    corePurpose: "Freedom & Change",
    condition: "Missing 5 or Triple 5",
    psychodynamicResult: "Seeking adventure but grid provides no internal anchor.",
  },
  6: {
    corePurpose: "Responsibility & Love",
    condition: "Triple 6 (Control)",
    psychodynamicResult: "Purpose is to nurture, but grid manifests as control.",
  },
  7: {
    corePurpose: "Seeking Knowledge",
    condition: "Triple 7 (Burden)",
    psychodynamicResult: "Searching for truth while grid brings constant setbacks.",
  },
  8: {
    corePurpose: "Material Success",
    condition: "Triple 8 (Leaden)",
    psychodynamicResult: "Destiny is abundance, but grid makes rest feel unearned.",
  },
  9: {
    corePurpose: "Universal Compassion",
    condition: "Triple 9 (Critical)",
    psychodynamicResult: "Aiming for selflessness while grid creates critical irritability.",
  },
};

export const REMEDIES: Record<number, Remedy> = {
  1: {
    missing: "Wear red ribbon; North: Fountain/Aquarium.",
    overloaded: "Practice silence; focus on written expression.",
  },
  2: {
    missing: "Use pearl malas; Southwest: Silver swan figures.",
    overloaded: "Grounding exercises; practice logic/math.",
  },
  3: {
    missing: "East: Green plants; use wooden decor.",
    overloaded: "Physical labor; focus on practical execution.",
  },
  4: {
    missing: "Southeast: Greenery; wear Tulsi mala.",
    overloaded: "Practice flexibility; allow for plan changes.",
  },
  5: {
    missing: "Center: Quartz crystals; keep clutter-free.",
    overloaded: "Meditation; focus on consistent work timings.",
  },
  6: {
    missing: "Northwest: Golden wind chimes; wear gold.",
    overloaded: "Practice detachment; delegate household duties.",
  },
  7: {
    missing: "Feed stray animals; West: Bright clothes.",
    overloaded: "Creative expression; avoid over-analysis.",
  },
  8: {
    missing: "Northeast: Donate salty meals; respect elders.",
    overloaded: "Mandatory rest days; focus on emotional hobbies.",
  },
  9: {
    missing: "South: Red candles; chant Hanuman Chalisa.",
    overloaded: "Practice humility; avoid criticizing others.",
  },
};

export const DROWNING_SECTION_INTRO = `In advanced Lo Shu analysis, the repetition of a number is not merely an amplification of its trait; it is a fundamental shift in the individual's energetic vibration. When a number appears three or more times, its energy becomes so "loud" that it begins to interfere with the harmonious functioning of the other numbers in the grid. This phenomenon, often referred to as "drowning," creates psychological states where logical filters are bypassed by visceral reactions.`;

export const HARDWARE_SOFTWARE_INTRO = `A critical layer of Lo Shu analysis is the interaction between the "Hardware" (the fixed birth grid) and the "Software" (the Life Path Number). While the grid represents the individual's default settings and inherent psychological traits, the Life Path Number represents the "curtain going up" — the potential and lessons the individual must fulfill.`;
