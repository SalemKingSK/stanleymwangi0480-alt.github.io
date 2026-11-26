/**
 * Reference data for the Foundations readings — Yang and Yin, the five
 * elements, their cycles, planets and correspondences, the animal moons and
 * hours. Written for this app (traditional Chinese correspondences: the Five
 * Phases / Wu Xing tables, the Heavenly Stems, the Earthly Branches).
 */

export type Element = "Wood" | "Fire" | "Earth" | "Metal" | "Water";
export type Polarity = "Yang" | "Yin";

export const ELEMENT_ORDER: Element[] = ["Wood", "Fire", "Earth", "Metal", "Water"];
export const ANIMALS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"] as const;
export type Animal = (typeof ANIMALS)[number];

/** Creation (generating) cycle: each element feeds the next. */
export const FEEDS: Record<Element, Element> = { Wood: "Fire", Fire: "Earth", Earth: "Metal", Metal: "Water", Water: "Wood" };
/** Destruction (controlling) cycle: each element overcomes another. */
export const CONTROLS: Record<Element, Element> = { Wood: "Earth", Earth: "Water", Water: "Fire", Fire: "Metal", Metal: "Wood" };
export const FED_BY = Object.fromEntries(ELEMENT_ORDER.map((e) => [FEEDS[e], e])) as Record<Element, Element>;
export const CONTROLLED_BY = Object.fromEntries(ELEMENT_ORDER.map((e) => [CONTROLS[e], e])) as Record<Element, Element>;

/** How the controlling element acts on the one it overcomes. */
export const CONTROL_IMAGE: Record<Element, string> = {
  Wood: "roots that break up and drain the soil",
  Earth: "banks of earth that dam and muddy the water",
  Water: "water that puts out the flame",
  Fire: "heat that melts the metal",
  Metal: "the axe that fells the tree",
};
/** How an element gives birth to the next. */
export const FEED_IMAGE: Record<Element, string> = {
  Wood: "wood is the fuel that lets fire burn",
  Fire: "fire burns down to ash, which becomes earth",
  Earth: "deep in the earth, ores and metals form",
  Metal: "metal gathers dew and, melted, runs like water",
  Water: "water rises through the roots and grows the wood",
};

export interface ElementInfo {
  season: string;
  direction: string;
  colors: string;
  shape: string;
  climate: string;
  organs: string;
  sense: string;
  taste: string;
  emotion: string;
  virtue: string;
  numbers: string;
  planet: string;
  planetChinese: string;
  guardian: string;
  time: string;
  stage: string;
  gifts: string;
  shadow: string;
  careers: string;
  home: string;
  balance: string;
}

export const ELEMENTS: Record<Element, ElementInfo> = {
  Wood: {
    season: "spring", direction: "east", colors: "green, teal and leafy browns", shape: "tall, upright and rectangular — columns, stripes, standing plants",
    climate: "wind", organs: "liver and gall bladder", sense: "the eyes", taste: "sour", emotion: "anger and frustration when blocked; kindness when flowing",
    virtue: "benevolence (rén) — the urge to help things grow", numbers: "3 and 8", planet: "Jupiter", planetChinese: "Mùxīng, the Wood Star",
    guardian: "the Azure Dragon of the East", time: "early morning", stage: "birth and growth — the shoot breaking through the soil",
    gifts: "vision, idealism, a strong moral compass, the drive to learn, teach and improve things",
    shadow: "impatience, rigidity about principles, and anger when progress is blocked",
    careers: "teaching, writing and publishing, law, medicine and healing, design, environmental and social work",
    home: "healthy upright plants, bamboo, wooden furniture, green textiles and an east-facing spot to work or study",
    balance: "time outdoors in the morning, stretching and walking, setting goals you can see growing, and saying what frustrates you before it turns to anger",
  },
  Fire: {
    season: "summer", direction: "south", colors: "red, orange, pink and purple", shape: "pointed and triangular — peaks, flames, star shapes",
    climate: "heat", organs: "heart and small intestine", sense: "the tongue and speech", taste: "bitter", emotion: "joy — and, overdone, restlessness and over-excitement",
    virtue: "propriety and courtesy (lǐ) — warmth that knows its form", numbers: "2 and 7", planet: "Mars", planetChinese: "Huǒxīng, the Fire Star",
    guardian: "the Vermilion Bird of the South", time: "midday", stage: "full bloom — the plant at its height in the summer sun",
    gifts: "charisma, enthusiasm, courage, quick minds and the power to inspire and rally people",
    shadow: "impulsiveness, a short fuse, burning out, and needing an audience",
    careers: "media, performing and the arts, marketing and sales, leadership roles, cooking, energy and lighting",
    home: "good light, candles, red or warm accents, images of the sun or of people you love, and a south-facing seat",
    balance: "pacing yourself, real rest after bursts of effort, calm evenings, and friendships that are not a performance",
  },
  Earth: {
    season: "the turning points between the seasons (and late summer)", direction: "the centre", colors: "yellow, ochre, sand, terracotta and beige", shape: "square, flat and low — tables, tiles, broad bases",
    climate: "damp", organs: "spleen and stomach", sense: "the mouth", taste: "sweet", emotion: "worry and over-thinking; sympathy when balanced",
    virtue: "faithfulness and trust (xìn) — being someone others can count on", numbers: "5 and 10", planet: "Saturn", planetChinese: "Tǔxīng, the Earth Star",
    guardian: "the Yellow Dragon of the Centre", time: "afternoon", stage: "ripening — the harvest gathered and stored",
    gifts: "stability, patience, practical sense, loyalty and the gift of holding a family or a team together",
    shadow: "worry, stubbornness, resisting change and taking on everyone else's burdens",
    careers: "property and building, farming and food, finance and administration, human resources, counselling, care work",
    home: "ceramics, stones and crystals, square rugs, earthy colours and a tidy, settled centre to the home",
    balance: "regular meals, routines that ground you, gardening or cooking, and letting others carry their own loads",
  },
  Metal: {
    season: "autumn", direction: "west", colors: "white, silver, gold, grey and metallic tones", shape: "round, oval and domed — circles, arches, coins",
    climate: "dryness", organs: "lungs and large intestine", sense: "the nose and skin", taste: "pungent and spicy", emotion: "grief and letting go; courage when balanced",
    virtue: "righteousness (yì) — doing what is right even when it costs you", numbers: "4 and 9", planet: "Venus", planetChinese: "Jīnxīng, the Metal Star",
    guardian: "the White Tiger of the West", time: "evening", stage: "harvest and refinement — cutting back to what is essential",
    gifts: "discipline, precision, strength of will, high standards, loyalty and a sense of justice",
    shadow: "rigidity, perfectionism, a cutting tongue, and holding on to grief or grudges",
    careers: "finance and banking, law and enforcement, engineering, technology and machinery, surgery, jewellery and fine crafts",
    home: "metal bowls and frames, round objects, white or metallic accents, a wind chime, and clear, uncluttered surfaces",
    balance: "deep breathing and fresh air, decluttering, finishing what you start, and letting go of what is over",
  },
  Water: {
    season: "winter", direction: "north", colors: "black, deep blue and navy", shape: "wavy and irregular — flowing lines, curves, glass",
    climate: "cold", organs: "kidneys and bladder", sense: "the ears", taste: "salty", emotion: "fear and caution; quiet wisdom when balanced",
    virtue: "wisdom (zhì) — knowing when to flow and when to wait", numbers: "1 and 6", planet: "Mercury", planetChinese: "Shuǐxīng, the Water Star",
    guardian: "the Black Tortoise of the North", time: "night", stage: "rest and storage — the seed waiting under the snow",
    gifts: "intuition, diplomacy, adaptability, depth of thought and persuasive communication",
    shadow: "fearfulness, secrecy, drifting without direction, and going with the flow too far",
    careers: "communication and media, travel and trade, shipping and logistics, research and philosophy, psychology, the drinks trade",
    home: "a small fountain or aquarium, glass and mirrors, flowing lines, dark blue accents and a calm north-facing corner",
    balance: "enough sleep and warmth, quiet time alone, swimming or time near water, and turning plans into one concrete step at a time",
  },
};

/** The ten Heavenly Stems: the element of a year with its polarity. */
export interface StemInfo {
  pinyin: string;
  chinese: string;
  image: string;
  nature: string;
  watch: string;
}
export const STEMS: Record<string, StemInfo> = {
  "Yang Wood": { pinyin: "Jiǎ", chinese: "甲", image: "the great tree", nature: "straight, principled and pioneering — you grow towards the light and give shelter to others, and people lean on your steadiness", watch: "a tall tree cannot bend; when you are sure you are right, you may snap rather than sway" },
  "Yin Wood": { pinyin: "Yǐ", chinese: "乙", image: "the vine and the flower", nature: "supple, sociable and resourceful — you find your way round obstacles, connect people, and keep growing where sturdier plants give up", watch: "a vine needs a trellis; choose carefully whom you lean on, and keep some roots of your own" },
  "Yang Fire": { pinyin: "Bǐng", chinese: "丙", image: "the sun", nature: "radiant, generous and open — you warm everyone in the room at once and you are at your best when you are seen and sharing", watch: "the sun shines on everyone; it can scorch, and it can forget that others also need shade" },
  "Yin Fire": { pinyin: "Dīng", chinese: "丁", image: "the candle and the lamp", nature: "focused, thoughtful warmth — you light up one person or one problem at a time, and you see clearly what others miss in the dark", watch: "a flame flickers in a draught; guard your moods and your energy from people who drain them" },
  "Yang Earth": { pinyin: "Wù", chinese: "戊", image: "the mountain", nature: "solid, protective and dependable — you are the fixed point others steer by, and you can hold your ground under pressure", watch: "mountains do not move; stubbornness and slowness to change can leave you standing still while the world goes past" },
  "Yin Earth": { pinyin: "Jǐ", chinese: "己", image: "the garden soil", nature: "nurturing, practical and versatile — you cultivate people and projects, and things grow where you tend them", watch: "soil gives everything away; worry and over-giving can exhaust you, so feed yourself too" },
  "Yang Metal": { pinyin: "Gēng", chinese: "庚", image: "the axe and the raw ore", nature: "decisive, tough and just — you cut through confusion, act when others hesitate, and keep your word", watch: "an axe is blunt; your honesty can wound, and force is not always the fastest way through" },
  "Yin Metal": { pinyin: "Xīn", chinese: "辛", image: "the jewel and the fine blade", nature: "refined, precise and discerning — you value quality, beauty and getting things exactly right, and you shine when polished by challenge", watch: "jewels scratch; pride and perfectionism make you sensitive to criticism and hard on yourself" },
  "Yang Water": { pinyin: "Rén", chinese: "壬", image: "the ocean and the great river", nature: "expansive, visionary and freedom-loving — you think big, move fast and carry others along with your energy", watch: "a flood has no banks; restlessness and excess can overwhelm the people and plans around you" },
  "Yin Water": { pinyin: "Guǐ", chinese: "癸", image: "the rain and the morning dew", nature: "intuitive, gentle and imaginative — you nourish quietly, sense what is unspoken, and influence things without forcing them", watch: "mist hides the path; secrecy and anxiety can cloud your own direction" },
};

/** Animals: fixed (natural) element, the polarity of their years, short nature. */
export const ANIMAL_INFO: Record<Animal, { fixed: Element; polarity: Polarity; branch: string; nature: string; season: string; direction: string }> = {
  Rat: { fixed: "Water", polarity: "Yang", branch: "Zǐ 子", nature: "quick-witted, resourceful and charming", season: "midwinter", direction: "north" },
  Ox: { fixed: "Earth", polarity: "Yin", branch: "Chǒu 丑", nature: "patient, dependable and determined", season: "late winter", direction: "north-north-east" },
  Tiger: { fixed: "Wood", polarity: "Yang", branch: "Yín 寅", nature: "bold, passionate and protective", season: "early spring", direction: "east-north-east" },
  Rabbit: { fixed: "Wood", polarity: "Yin", branch: "Mǎo 卯", nature: "gentle, tactful and refined", season: "mid-spring", direction: "east" },
  Dragon: { fixed: "Earth", polarity: "Yang", branch: "Chén 辰", nature: "magnetic, ambitious and larger than life", season: "late spring", direction: "east-south-east" },
  Snake: { fixed: "Fire", polarity: "Yin", branch: "Sì 巳", nature: "wise, intuitive and composed", season: "early summer", direction: "south-south-east" },
  Horse: { fixed: "Fire", polarity: "Yang", branch: "Wǔ 午", nature: "free-spirited, energetic and warm", season: "midsummer", direction: "south" },
  Goat: { fixed: "Earth", polarity: "Yin", branch: "Wèi 未", nature: "kind, artistic and gentle", season: "late summer", direction: "south-south-west" },
  Monkey: { fixed: "Metal", polarity: "Yang", branch: "Shēn 申", nature: "clever, inventive and playful", season: "early autumn", direction: "west-south-west" },
  Rooster: { fixed: "Metal", polarity: "Yin", branch: "Yǒu 酉", nature: "observant, hard-working and candid", season: "mid-autumn", direction: "west" },
  Dog: { fixed: "Earth", polarity: "Yang", branch: "Xū 戌", nature: "loyal, honest and fair-minded", season: "late autumn", direction: "west-north-west" },
  Pig: { fixed: "Water", polarity: "Yin", branch: "Hài 亥", nature: "generous, sincere and pleasure-loving", season: "early winter", direction: "north-north-west" },
};

/** The animal moon: the inner, emotional nature (paired with the Western sun sign). */
export const MOON_SIGN: Record<string, Animal> = {
  Sagittarius: "Rat", Capricorn: "Ox", Aquarius: "Tiger", Pisces: "Rabbit", Aries: "Dragon", Taurus: "Snake",
  Gemini: "Horse", Cancer: "Goat", Leo: "Monkey", Virgo: "Rooster", Libra: "Dog", Scorpio: "Pig",
};
export const MOON_NATURE: Record<Animal, string> = {
  Rat: "Your feelings work fast and practically. You feel safest when you have planned ahead and put something by, and you show love by looking after people's needs before they ask. Worry comes out as restlessness; a secure base settles you.",
  Ox: "Your heart opens slowly and then stays open. You need routine, reliability and time to trust, and you show love through steady, practical acts rather than words. Once hurt, you remember for a long time.",
  Tiger: "You feel things intensely and bravely. You need freedom and a cause worth caring about; when you feel caged or controlled, you rebel. Your moods are strong but honest, and you defend the people you love fiercely.",
  Rabbit: "Your emotional life is gentle and sensitive. You need peace, beauty and kindness around you, sense atmospheres instantly and will go a long way to avoid a scene. Harsh people bruise you; calm and comfort restore you.",
  Dragon: "You have big feelings and big hopes. You need to be admired and to have something grand to aim for. Your temper flares quickly and passes just as fast, and your loyalty and enthusiasm lift everyone around you.",
  Snake: "You feel deeply and privately. You read people well, need complete trust before you let anyone in, and can be possessive of those you love. A calm surface hides strong currents.",
  Horse: "Your heart needs room to run. You fall for people and ideas quickly, need variety and movement, and are honest about how you feel. Being fenced in makes you bolt; freedom brings you back.",
  Goat: "You are tender, caring and easily moved. You need comfort, belonging and a home that feels safe, and you feel the mood of a room before anyone speaks. Creative work and kindness heal you.",
  Monkey: "You meet your feelings with curiosity and humour. You need stimulation and play, and you tend to solve emotional problems like puzzles — sometimes joking your way past what you really feel.",
  Rooster: "Your heart likes order. You need to feel useful, respected and in control of the details, and you show care by improving things. Criticism stings more than you let on, and honesty matters deeply to you.",
  Dog: "You love loyally and worry protectively. You need fairness, trust and a cause or a person to stand by. Injustice upsets you deeply, and you are steadiest when you know where you stand.",
  Pig: "You are warm, generous and sincere. You need affection, pleasure and peace, give your trust easily and love wholeheartedly. Betrayal wounds you, but you forgive more readily than most.",
};

/** Birth hours (local solar time): the outer temperament and the face shown to others. */
export const HOURS: { animal: Animal; from: string; to: string; face: string }[] = [
  { animal: "Rat", from: "11 pm", to: "1 am", face: "alert, sociable and quick to spot an opening; people see someone sharp and charming" },
  { animal: "Ox", from: "1 am", to: "3 am", face: "calm, methodical and dependable; people see someone solid who will not be rushed" },
  { animal: "Tiger", from: "3 am", to: "5 am", face: "bold, lively and direct; people see someone daring who takes the lead" },
  { animal: "Rabbit", from: "5 am", to: "7 am", face: "polite, gentle and diplomatic; people see someone graceful and easy to be around" },
  { animal: "Dragon", from: "7 am", to: "9 am", face: "confident, energetic and visionary; people see someone with presence" },
  { animal: "Snake", from: "9 am", to: "11 am", face: "composed, discreet and perceptive; people see someone wise and a little mysterious" },
  { animal: "Horse", from: "11 am", to: "1 pm", face: "cheerful, active and outspoken; people see someone free-spirited and warm" },
  { animal: "Goat", from: "1 pm", to: "3 pm", face: "kind, artistic and easy-going; people see someone gentle and approachable" },
  { animal: "Monkey", from: "3 pm", to: "5 pm", face: "witty, inventive and adaptable; people see someone entertaining and clever" },
  { animal: "Rooster", from: "5 pm", to: "7 pm", face: "neat, frank and organised; people see someone capable who notices everything" },
  { animal: "Dog", from: "7 pm", to: "9 pm", face: "honest, loyal and watchful; people see someone trustworthy and fair" },
  { animal: "Pig", from: "9 pm", to: "11 pm", face: "relaxed, generous and good-humoured; people see someone warm and sincere" },
];

/** Western signs: ruling planet(s), Western element and polarity. */
export const WESTERN: Record<string, { ruler: string; modern?: string; element: string; polarity: Polarity }> = {
  Aries: { ruler: "Mars", element: "Fire", polarity: "Yang" },
  Taurus: { ruler: "Venus", element: "Earth", polarity: "Yin" },
  Gemini: { ruler: "Mercury", element: "Air", polarity: "Yang" },
  Cancer: { ruler: "the Moon", element: "Water", polarity: "Yin" },
  Leo: { ruler: "the Sun", element: "Fire", polarity: "Yang" },
  Virgo: { ruler: "Mercury", element: "Earth", polarity: "Yin" },
  Libra: { ruler: "Venus", element: "Air", polarity: "Yang" },
  Scorpio: { ruler: "Mars", modern: "Pluto", element: "Water", polarity: "Yin" },
  Sagittarius: { ruler: "Jupiter", element: "Fire", polarity: "Yang" },
  Capricorn: { ruler: "Saturn", element: "Earth", polarity: "Yin" },
  Aquarius: { ruler: "Saturn", modern: "Uranus", element: "Air", polarity: "Yang" },
  Pisces: { ruler: "Jupiter", modern: "Neptune", element: "Water", polarity: "Yin" },
};
/** Planet → Chinese element (the five visible planets). */
export const PLANET_ELEMENT: Record<string, Element> = { Jupiter: "Wood", Mars: "Fire", Saturn: "Earth", Venus: "Metal", Mercury: "Water" };

export const POLARITY: Record<Polarity, { words: string; strengths: string; pitfalls: string; balance: string; images: string }> = {
  Yang: {
    words: "active, outgoing, initiating and expressive",
    images: "day, sun, summer, heat, movement, the mountain's sunny slope",
    strengths: "you start things, speak up, take risks and push through obstacles; energy, courage and enthusiasm come naturally",
    pitfalls: "impatience, acting before thinking, pushing too hard and running out of steam",
    balance: "build in Yin: rest before you are exhausted, listen longer than you speak, finish before you start the next thing, and let quieter people set the pace sometimes",
  },
  Yin: {
    words: "receptive, reflective, patient and sustaining",
    images: "night, moon, winter, coolness, stillness, the mountain's shady slope",
    strengths: "you notice, absorb, endure and complete; patience, subtlety, loyalty and a talent for nurturing and finishing come naturally",
    pitfalls: "holding back, brooding, giving way too easily and sinking into low moods when life is hard",
    balance: "build in Yang: move your body every day, say what you want out loud, start one small thing without waiting until it is perfect, and spend time in sunlight and lively company",
  },
};
