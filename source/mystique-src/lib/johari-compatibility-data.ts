/**
 * MYSTIQUE COMPASS — Johari Compatibility Data
 *
 * Source: Harish Johari — "Numerology with Tantra, Ayurveda, and Astrology"
 *
 * Contains:
 *  1. Full psychic-number profiles (all 9 numbers) with planet, element,
 *     nature paragraph, strengths/weaknesses, body governance, best days,
 *     and Johari's own friendly/enemy/neutral number lists.
 *  2. All 45 unique number-pair compatibility entries (1-1 through 9-9)
 *     with a 1-10 rating, a nature paragraph, and concrete advice.
 *  3. generateCombinedWeather() — the Soul Weather paired-year analysis
 *     that produces synchronicity labels, challenges, opportunities, and
 *     specific pair insights for every meaningful combination.
 *
 * INTEGRATION NOTE
 * ----------------
 * This file is additive. Import it alongside the existing
 * `compatibility-engine.ts`; it does not replace any existing function.
 *
 * Quick usage:
 *   import {
 *     JOHARI_PSYCHIC_PROFILES,
 *     getJohariPairCompatibility,
 *     generateCombinedWeather,
 *   } from "@/lib/johari-compatibility-data";
 *
 *   const profile = JOHARI_PSYCHIC_PROFILES[5];       // Psychic number 5
 *   const compat  = getJohariPairCompatibility(3, 9); // 3↔9 pair
 *   const weather = generateCombinedWeather(4, 7);    // PY 4 vs PY 7
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. JOHARI PSYCHIC PROFILES
// ─────────────────────────────────────────────────────────────────────────────

export interface JohariPsychicProfile {
  number: number;
  planet: string;
  element: string;
  /** Verbatim nature paragraph from Johari's text */
  nature: string;
  strengths: string[];
  weaknesses: string[];
  bodyGoverns: string;
  bestDays: string[];
  friendlyNumbers: number[];
  neutralNumbers: number[];
  enemyNumbers: number[];
}

export const JOHARI_PSYCHIC_PROFILES: Record<number, JohariPsychicProfile> = {
  1: {
    number: 1,
    planet: "Sun",
    element: "Fire",
    nature:
      "The leader, the individual. Ones are ambitious, active, and seek to be independent. They are inventive, creative, and strongly individual. They have a clear sense of self and are determined to make their own way. They are pioneers who do not like to be restricted. They can be domineering, egotistical, and aggressive when unbalanced. Their key drive is self-expression and originality.",
    strengths: [
      "Leadership",
      "Independence",
      "Creativity",
      "Determination",
      "Originality",
      "Courage",
    ],
    weaknesses: [
      "Egotism",
      "Domination",
      "Stubbornness",
      "Impatience",
      "Aggression",
    ],
    bodyGoverns:
      "Heart, back, right eye in males, left eye in females",
    bestDays: ["Sunday", "Monday"],
    friendlyNumbers: [1, 2, 3, 9],
    neutralNumbers: [4, 5, 7],
    enemyNumbers: [6, 8],
  },

  2: {
    number: 2,
    planet: "Moon",
    element: "Water",
    nature:
      "The diplomat, the peacemaker. Twos are gentle, imaginative, artistic, and romantic. They are lovers of peace and harmony. They are sensitive, intuitive, and often psychic. They love beauty, nature, and cleanliness. They are changeable like the moon—their moods wax and wane. They lack self-confidence and need encouragement. They are not as forceful in carrying out their ideas as Ones.",
    strengths: [
      "Intuition",
      "Diplomacy",
      "Sensitivity",
      "Imagination",
      "Adaptability",
      "Cooperation",
    ],
    weaknesses: [
      "Indecision",
      "Oversensitivity",
      "Mood swings",
      "Lack of confidence",
      "Depression",
    ],
    bodyGoverns:
      "Stomach, digestive system, left eye in males, right eye in females",
    bestDays: ["Monday", "Sunday"],
    friendlyNumbers: [1, 2, 3],
    neutralNumbers: [6, 7, 8, 9],
    enemyNumbers: [4, 5],
  },

  3: {
    number: 3,
    planet: "Jupiter",
    element: "Fire/Ether",
    nature:
      "The teacher, the optimist. Threes are ambitious, disciplined, and hardworking. They love order, discipline, and obey commands willingly. They are independent, bold, and active. They are always busy and seek higher knowledge. They are fond of their families. They want everything around them clean and orderly. They can be dictatorial, proud, and jealous of those who stand in their way.",
    strengths: [
      "Ambition",
      "Discipline",
      "Optimism",
      "Knowledge-seeking",
      "Independence",
      "Generosity",
    ],
    weaknesses: [
      "Pride",
      "Dictatorship",
      "Overambition",
      "Jealousy",
      "Extravagance",
    ],
    bodyGoverns: "Liver, hips, thighs, arteries, nervous system",
    bestDays: ["Thursday", "Tuesday"],
    friendlyNumbers: [1, 2, 3, 9],
    neutralNumbers: [4, 7, 8],
    enemyNumbers: [5, 6],
  },

  4: {
    number: 4,
    planet: "Rahu (North Node)",
    element: "Earth/Air",
    nature:
      "The rebel, the unconventional. Fours are practical, steady, and uninspired by sudden change. They see everything from the opposite angle. They are rebels who naturally go against the mainstream. They feel lonely and neglected. They face delays and obstacles in everything. They are secretive and introverted. Despite constant obstacles, they achieve success through persistence and hard work late in life.",
    strengths: [
      "Persistence",
      "Practicality",
      "Stability",
      "Hard work",
      "Reliability",
      "Endurance",
    ],
    weaknesses: [
      "Stubbornness",
      "Rebelliousness",
      "Secrecy",
      "Loneliness",
      "Pessimism",
      "Rigidity",
    ],
    bodyGoverns: "Chest, lungs, mental disorders",
    bestDays: ["Saturday", "Sunday", "Monday"],
    friendlyNumbers: [1, 2, 7],
    neutralNumbers: [3, 5, 6],
    enemyNumbers: [8, 9],
  },

  5: {
    number: 5,
    planet: "Mercury",
    element: "Earth",
    nature:
      "The communicator, the merchant. Fives are soft-spoken, fragile, and youthful in appearance. They love entertainment, new ideas, and change. They are quick thinkers and make friends easily. They are resilient—they bounce back from any blow like a rubber ball. They love travel, business, and speculation. They are masters of communication and commerce. Their nervous energy keeps them always active.",
    strengths: [
      "Communication",
      "Adaptability",
      "Quick thinking",
      "Resilience",
      "Versatility",
      "Youthfulness",
    ],
    weaknesses: [
      "Restlessness",
      "Nervousness",
      "Inconsistency",
      "Gambling tendency",
      "Superficiality",
    ],
    bodyGoverns: "Nervous system, arms, hands, skin",
    bestDays: ["Wednesday", "Friday"],
    friendlyNumbers: [1, 2, 5],
    neutralNumbers: [3, 4, 7, 8, 9],
    enemyNumbers: [6],
  },

  6: {
    number: 6,
    planet: "Venus",
    element: "Water/Earth",
    nature:
      "The lover, the artist. Sixes are magnetic, youthful, gentle, soft-spoken, and luxury-loving. They are artistic, fond of beautiful things, good clothes, perfumes, and jewelry. They love travel, visiting foreign countries, and spending lavishly. They are secretive and do not like interference. They are attracted to the opposite sex early in life. They are universal friends and make anyone feel comfortable.",
    strengths: [
      "Charm",
      "Artistic ability",
      "Magnetism",
      "Diplomacy",
      "Love of beauty",
      "Devotion",
    ],
    weaknesses: [
      "Extravagance",
      "Vanity",
      "Laziness",
      "Jealousy",
      "Possessiveness",
      "Secretiveness",
    ],
    bodyGoverns: "Throat, kidneys, reproductive organs, lower back",
    bestDays: ["Friday", "Wednesday"],
    friendlyNumbers: [3, 6, 9],
    neutralNumbers: [4, 5, 7, 8],
    enemyNumbers: [1, 2],
  },

  7: {
    number: 7,
    planet: "Ketu (South Node)",
    element: "Water",
    nature:
      "The mystic, the seeker. Sevens are spiritual, restless, and changeable. They are original thinkers with a strong inclination toward occult sciences. They are intuitive, dreamy, and have remarkable psychic abilities. They travel extensively and love the sea. They are often ahead of their time. They are independent and not easily influenced by others. They have magnetic personalities but find relationships difficult.",
    strengths: [
      "Intuition",
      "Spirituality",
      "Originality",
      "Independence",
      "Psychic ability",
      "Analytical mind",
    ],
    weaknesses: [
      "Restlessness",
      "Indecision",
      "Aloofness",
      "Anxiety",
      "Difficulty in relationships",
      "Mood swings",
    ],
    bodyGoverns: "Skin diseases, digestive disorders, psychosomatic ailments",
    bestDays: ["Monday", "Sunday"],
    friendlyNumbers: [1, 2, 4],
    neutralNumbers: [3, 5, 6],
    enemyNumbers: [8, 9],
  },

  8: {
    number: 8,
    planet: "Saturn",
    element: "Earth/Air",
    nature:
      "The powerhouse, the karmic enforcer. Eights are lonely, misunderstood, and burdened with responsibilities. They are deep thinkers and philosophers. They have great organizational ability and are extremely hardworking. They face more obstacles than any other number. They are either great successes or great failures—there is no middle path. They have a strong sense of justice but appear cold and unemotional externally, while inside they are warm and generous.",
    strengths: [
      "Discipline",
      "Organization",
      "Endurance",
      "Wisdom",
      "Justice",
      "Material mastery",
    ],
    weaknesses: [
      "Loneliness",
      "Rigidity",
      "Pessimism",
      "Vindictiveness",
      "Depression",
      "Emotional suppression",
    ],
    bodyGoverns: "Bones, teeth, joints, chronic ailments, paralysis",
    bestDays: ["Saturday", "Wednesday"],
    friendlyNumbers: [3, 5, 6],
    neutralNumbers: [],
    enemyNumbers: [1, 2, 4, 7, 9],
  },

  9: {
    number: 9,
    planet: "Mars",
    element: "Fire",
    nature:
      "The warrior, the humanitarian. Nines are fighters who face opposition bravely. They are courageous, strong-willed, and determined. They love sports, physical activity, and competition. They are quick to anger but also quick to forgive. They are impulsive and act first, think later. They are generous and humanitarian, always ready to help others even at personal cost. They love adventure and cannot sit still.",
    strengths: [
      "Courage",
      "Energy",
      "Determination",
      "Generosity",
      "Humanitarianism",
      "Leadership",
    ],
    weaknesses: [
      "Aggression",
      "Impulsiveness",
      "Hot temper",
      "Impatience",
      "Domineering nature",
      "Accident-prone",
    ],
    bodyGoverns: "Head, blood, muscles, marrow, reproductive system",
    bestDays: ["Tuesday", "Thursday"],
    friendlyNumbers: [1, 2, 3, 6, 9],
    neutralNumbers: [5],
    enemyNumbers: [4, 7, 8],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. JOHARI 45-PAIR COMPATIBILITY TABLE
// ─────────────────────────────────────────────────────────────────────────────

export interface JohariPairCompat {
  /** 1–10 */
  rating: number;
  /** Multi-sentence nature paragraph from Johari's framework */
  nature: string;
  /** One concrete piece of relationship advice */
  advice: string;
}

/** All 45 unique unordered pairs. Key format: "min-max", e.g. "1-3", "3-9". */
const JOHARI_PAIRS: Record<string, JohariPairCompat> = {
  "1-1": {
    rating: 7,
    nature:
      "Two Suns together create intense heat. Both want to lead, both want to be first. If one can accept a supporting role, this works brilliantly—their combined energy is unstoppable. But if both insist on leading, clashes of ego will destroy the bond. The friendship is natural, the power struggle is inevitable.",
    advice:
      "One must learn to lead in certain areas while the other leads in others. Division of territory is essential.",
  },
  "1-2": {
    rating: 9,
    nature:
      "Sun and Moon—the most natural pairing in numerology. The One leads, the Two supports and nurtures. The Two's sensitivity softens the One's harshness. The One's decisiveness steadies the Two's indecision. They complement each other like day and night. The Two is devoted and the One is protective. This is one of the best combinations.",
    advice:
      "The One must be careful not to dominate or dismiss the Two's feelings. The Two must not become overly dependent.",
  },
  "1-3": {
    rating: 8,
    nature:
      "Sun and Jupiter are natural friends. Both are ambitious, driven, and hardworking. They inspire each other toward greater achievements. The Three brings wisdom, knowledge, and expansion. The One brings originality and drive. Together they can achieve great things in the material world. Both love independence and respect each other's space.",
    advice:
      "Both can become so focused on achievement they forget emotional connection. Make time for the heart, not just ambition.",
  },
  "1-4": {
    rating: 5,
    nature:
      "Sun and Rahu have a complex relationship. The Four sees everything differently from the One, creating misunderstandings. The Four's rebellious nature clashes with the One's desire for order. However, the Four secretly admires the One's decisiveness. This combination requires patience and understanding from both sides.",
    advice:
      "The One must be patient with the Four's unconventional approach. The Four must try to be more direct and less contrary.",
  },
  "1-5": {
    rating: 7,
    nature:
      "Sun and Mercury make a good commercial and social partnership. The Five's communication skills complement the One's leadership. Both are active and hate sitting still. They stimulate each other intellectually. The Five adapts easily to the One's plans. However, the Five's changeability can frustrate the One's fixed purpose.",
    advice:
      "The Five should try to be more consistent. The One should allow the Five freedom to explore and experiment.",
  },
  "1-6": {
    rating: 4,
    nature:
      "Sun and Venus are not natural friends. The Six's love of luxury and pleasure seems frivolous to the hardworking One. The One's bluntness hurts the Six's sensitive ego. The Six finds the One too domineering and harsh. Despite mutual attraction, this combination creates friction in daily life. The Six spends what the One earns.",
    advice:
      "Both need to appreciate what the other brings. The One brings drive, the Six brings beauty and harmony. Respect differences.",
  },
  "1-7": {
    rating: 6,
    nature:
      "Sun and Ketu have a spiritual connection. The Seven's mystical nature intrigues the practical One. The One provides grounding for the Seven's dreamy nature. Both are independent and respect each other's autonomy. However, the Seven's unpredictability and mood swings can frustrate the One's straightforward nature.",
    advice:
      "The One must allow the Seven space for solitude and spiritual exploration. The Seven must try to be more present and grounded.",
  },
  "1-8": {
    rating: 3,
    nature:
      "Sun and Saturn are natural opposites. This is one of the most difficult combinations. The Eight feels restricted by the One's confidence and brightness. The One feels burdened by the Eight's heaviness and pessimism. Both are strong-willed, creating deadlock. Yet if they can overcome their differences, they create an unshakable foundation of power.",
    advice:
      "Both must let go of the need to control. This requires enormous mutual respect and patience. Professional success is more likely than emotional harmony.",
  },
  "1-9": {
    rating: 8,
    nature:
      "Sun and Mars are natural allies. Both are fiery, courageous, and action-oriented. The Nine's fearless energy matches the One's pioneering spirit. They push each other to greatness. Both are generous and big-hearted. The danger is too much fire—arguments can be explosive but are quickly forgotten. This is a dynamic, powerful combination.",
    advice:
      "Channel the combined fire energy into constructive projects. Both must learn to cool down before speaking in anger.",
  },
  "2-2": {
    rating: 6,
    nature:
      "Two Moons together create deep emotional sensitivity but also extreme mood swings. Both are intuitive and understand each other's feelings without words. However, neither provides the stability or decisiveness the other needs. They can become lost in emotion and indecision. Beautiful for artistic collaboration, challenging for practical matters.",
    advice:
      "One must develop more firmness and decisiveness. They need external structure and routine to stay grounded.",
  },
  "2-3": {
    rating: 8,
    nature:
      "Moon and Jupiter are excellent friends. The Three provides the confidence and direction the Two lacks. The Two provides the emotional support and devotion the Three needs. The Three inspires the Two, and the Two softens the Three. This is a harmonious combination with natural understanding and mutual benefit.",
    advice:
      "The Three should be careful not to become too authoritarian. The Two should express needs openly rather than sulking.",
  },
  "2-4": {
    rating: 5,
    nature:
      "Moon and Rahu create an emotionally turbulent combination. The Four's rebellious and secretive nature confuses the Two's need for emotional clarity. Both are prone to mood swings and worry. However, they share a deep understanding of loneliness and can provide comfort to each other when the world does not understand them.",
    advice:
      "Both need to communicate feelings directly rather than withdrawing. Create emotional safety through honesty.",
  },
  "2-5": {
    rating: 5,
    nature:
      "Moon and Mercury are not naturally harmonious. The Five's constant need for change and stimulation exhausts the Two's need for peace and emotional stability. The Five finds the Two too sensitive and moody. However, both are adaptable, and if they find common ground in creative or commercial pursuits, they can work together.",
    advice:
      "The Five must slow down and attend to emotional needs. The Two must not take the Five's restlessness personally.",
  },
  "2-6": {
    rating: 7,
    nature:
      "Moon and Venus share a love of beauty, art, and harmony. Both are gentle, refined, and romantic. The Six's charm enchants the Two, and the Two's devotion delights the Six. They create a beautiful, aesthetic world together. The danger is that neither is very practical, and both can be passive when action is needed.",
    advice:
      "Someone needs to handle practical matters. Don't let the relationship become so comfortable that growth stops.",
  },
  "2-7": {
    rating: 8,
    nature:
      "Moon and Ketu share deep psychic and spiritual connection. Both are intuitive, dreamy, and drawn to the mystical. The Seven's independence is balanced by the Two's devotion. They understand each other's inner worlds naturally. The Two provides the emotional warmth the Seven secretly craves. This is a soulful, karmic connection.",
    advice:
      "Stay grounded in the material world. Don't lose yourselves entirely in the spiritual or emotional realm.",
  },
  "2-8": {
    rating: 4,
    nature:
      "Moon and Saturn create a heavy emotional atmosphere. The Eight's coldness and emotional suppression hurts the Two's sensitive heart. The Two's emotional needs feel overwhelming to the Eight. Both can fall into depression and pessimism when together. However, the Eight provides material security the Two needs, and the Two provides the warmth the Eight secretly desires.",
    advice:
      "The Eight must learn to express emotions. The Two must develop emotional independence and not take the Eight's reserve as rejection.",
  },
  "2-9": {
    rating: 7,
    nature:
      "Moon and Mars create an interesting tension. The Nine's fire warms the Two's water nature. The Two's gentleness cools the Nine's aggression. The Nine protects the Two, and the Two nurtures the Nine. However, the Nine's bluntness can deeply wound the Two's sensitivity. When balanced, this is a passionate and devoted combination.",
    advice:
      "The Nine must be mindful of words—they cut the Two deeply. The Two must not try to dampen the Nine's fire.",
  },
  "3-3": {
    rating: 6,
    nature:
      "Two Jupiters together create great ambition and knowledge but also a power struggle. Both want to teach, both want to be the authority. Competition can override cooperation. However, their shared love of learning, discipline, and growth means they can achieve extraordinary things if they divide their kingdoms wisely.",
    advice:
      "Define separate domains of expertise. Compete with the world, not with each other.",
  },
  "3-4": {
    rating: 5,
    nature:
      "Jupiter and Rahu are not natural allies. The Three's love of order clashes with the Four's rebellious nature. The Three sees the Four as unnecessarily difficult. The Four sees the Three as rigid and conventional. However, the Four's unconventional perspectives can broaden the Three's understanding, and the Three's stability can anchor the Four.",
    advice:
      "The Three must be open to unconventional ideas. The Four must appreciate the Three's discipline and order.",
  },
  "3-5": {
    rating: 5,
    nature:
      "Jupiter and Mercury are not enemies but not natural friends either. The Five's superficiality bothers the Three's depth. The Three's seriousness bores the Five. However, in business and education, this combination can work well—the Three provides knowledge and the Five provides communication skills.",
    advice:
      "Focus on shared intellectual interests. Don't expect the other to change their fundamental nature.",
  },
  "3-6": {
    rating: 4,
    nature:
      "Jupiter and Venus are considered enemies in Vedic tradition. The Three's disciplined austerity conflicts with the Six's love of pleasure and luxury. The Six finds the Three too rigid and moralistic. The Three finds the Six too indulgent and superficial. Despite attraction, fundamental values differ significantly.",
    advice:
      "Find middle ground between discipline and pleasure. Both approaches to life have validity.",
  },
  "3-7": {
    rating: 6,
    nature:
      "Jupiter and Ketu share spiritual interests. The Three's organized approach to knowledge complements the Seven's intuitive wisdom. Both seek truth, though through different paths—the Three through study and teaching, the Seven through direct experience and intuition. They can learn much from each other.",
    advice:
      "Respect each other's path to truth. The Three should not try to systematize the Seven's intuitive process.",
  },
  "3-8": {
    rating: 6,
    nature:
      "Jupiter and Saturn have a teacher-student relationship. The Three can help the Eight understand the purpose behind suffering. The Eight's discipline and endurance impresses the Three. Together they can build lasting structures. However, both can be rigid and authoritarian, creating coldness if not balanced with warmth.",
    advice:
      "Bring warmth and humor into the relationship. Don't let it become all duty and discipline.",
  },
  "3-9": {
    rating: 9,
    nature:
      "Jupiter and Mars are the best of friends. The Three's wisdom guides the Nine's energy. The Nine's courage inspires the Three to act on their knowledge. Both are generous, independent, and action-oriented. They share idealism and humanitarian values. This is one of the most powerful and harmonious combinations in numerology.",
    advice:
      "Channel your combined power toward a meaningful cause. You are stronger together than apart.",
  },
  "4-4": {
    rating: 5,
    nature:
      "Two Rahus together understand each other's isolation and struggle. They share a bond of understanding that others cannot provide. However, both bring obstacles and delays, and together the burden doubles. Both tend toward pessimism and rebellion, which can create a cycle of negativity. They need external positive influences.",
    advice:
      "Actively cultivate optimism. Seek out positive, uplifting people and activities together. Don't isolate as a pair.",
  },
  "4-5": {
    rating: 6,
    nature:
      "Rahu and Mercury create an unusual but workable combination. The Five's adaptability helps navigate the Four's obstacles. The Four's depth grounds the Five's superficiality. Both are unconventional in their own ways. The Five brings lightness to the Four's heaviness. However, the Four may find the Five unreliable.",
    advice:
      "The Five's flexibility is a gift to the rigid Four. The Four's stability is a gift to the scattered Five. Value these differences.",
  },
  "4-6": {
    rating: 6,
    nature:
      "Rahu and Venus create an interesting combination. The Six's charm and beauty attracts the lonely Four. The Four's depth and mystery intrigues the Six. The Six can bring pleasure and beauty into the Four's difficult life. However, the Four's pessimism can dampen the Six's joy, and the Six's superficiality can frustrate the Four.",
    advice:
      "The Six teaches the Four about beauty and enjoyment. The Four teaches the Six about depth and persistence.",
  },
  "4-7": {
    rating: 7,
    nature:
      "Rahu and Ketu are natural partners in Vedic astrology—two ends of the lunar axis. Both are unconventional, both feel misunderstood, and both have powerful intuition. They understand each other's otherness in a way no other number can. This is a deeply karmic connection, often feeling fated. Both are introspective and capable of profound spiritual insight.",
    advice:
      "Channel the combined energy into spiritual or creative work. Both must resist the tendency to become too isolated from the world.",
  },
  "4-8": {
    rating: 4,
    nature:
      "Rahu and Saturn both carry heavy karmic burdens. Both face obstacles, delays, and isolation. When together, these burdens compound rather than lighten. Both can become deeply pessimistic and fatalistic. Yet if they can support each other through difficulties, they create a bond forged in the fires of shared struggle that can be unbreakable.",
    advice:
      "Focus on practical solutions rather than dwelling on problems. Seek external joy and positivity to counterbalance the heaviness.",
  },
  "4-9": {
    rating: 3,
    nature:
      "Rahu and Mars are natural enemies. The Nine's direct, aggressive energy clashes with the Four's indirect, rebellious nature. The Nine finds the Four frustrating and unnecessarily difficult. The Four finds the Nine too aggressive and confrontational. This is one of the more challenging combinations, requiring significant mutual respect.",
    advice:
      "The Nine must slow down and not force their pace onto the Four. The Four must try to be more direct in communicating needs.",
  },
  "5-5": {
    rating: 7,
    nature:
      "Two Mercuries together create a relationship full of movement, change, communication, and excitement. Both are adaptable, clever, and youthful. They understand each other's need for variety and stimulation. However, neither provides the stability the other needs. The relationship can be wonderfully alive but also unstable.",
    advice:
      "Create shared routines and anchors to prevent both of you from spinning off in different directions.",
  },
  "5-6": {
    rating: 4,
    nature:
      "Mercury and Venus are enemies in Vedic tradition. The Five's restlessness and love of change clashes with the Six's desire for security and luxury. The Six finds the Five too unreliable and changeable. The Five finds the Six too possessive and demanding. Despite initial attraction, they want fundamentally different things from life.",
    advice:
      "The Five must honor the Six's need for security. The Six must allow the Five freedom without clinging.",
  },
  "5-7": {
    rating: 6,
    nature:
      "Mercury and Ketu create an intellectually stimulating combination. Both are curious, unconventional, and interested in hidden knowledge. The Five's quick mind and the Seven's depth can create fascinating conversations. However, the Seven needs solitude while the Five needs social stimulation, creating tension around time and energy.",
    advice:
      "Respect the Seven's need for alone time. The Five should find other outlets for social energy.",
  },
  "5-8": {
    rating: 6,
    nature:
      "Mercury and Saturn create an interesting dynamic. The Five's flexibility can help navigate around the Eight's rigid structures. The Eight's discipline can give direction to the Five's scattered energy. Both are capable of great commercial success when working together. However, the Eight may try to control the Five's freedom.",
    advice:
      "The Eight should allow the Five creative latitude. The Five should respect the Eight's need for structure and reliability.",
  },
  "5-9": {
    rating: 7,
    nature:
      "Mercury and Mars create an energetic, dynamic combination. Both are active, enthusiastic, and love life. The Five's communication skills and the Nine's leadership create a powerful team. Both can be impulsive but are resilient. The Nine's energy motivates the Five, and the Five's adaptability helps the Nine navigate changing circumstances.",
    advice:
      "Channel the combined energy into productive ventures. Both must avoid impulsiveness in major decisions.",
  },
  "6-6": {
    rating: 7,
    nature:
      "Two Venuses together create a beautiful, harmonious, and artistic world. Both love beauty, luxury, and pleasure. The relationship is warm, affectionate, and aesthetically refined. However, both tend toward laziness and neither takes practical responsibility easily. Financial problems and indulgence can become issues.",
    advice:
      "Establish clear practical roles. Beauty requires a foundation—someone must handle the material world.",
  },
  "6-7": {
    rating: 5,
    nature:
      "Venus and Ketu make an unusual pairing. The Six's warmth and sociability contrasts with the Seven's need for solitude. The Six wants parties and social connection; the Seven wants meditation and books. Yet both appreciate beauty and depth, and when they find common ground in art or spirituality, they can complement each other.",
    advice:
      "The Six must give the Seven solitude without taking it as rejection. The Seven should make effort to engage socially occasionally.",
  },
  "6-8": {
    rating: 5,
    nature:
      "Venus and Saturn create a tension between pleasure and duty. The Six loves luxury and ease; the Eight insists on hard work and discipline. The Six's spending can alarm the Eight's need for financial control. However, the Eight provides the material security the Six craves, and the Six provides warmth for the Eight's cold exterior.",
    advice:
      "Agree on financial matters early. The Eight provides structure, the Six provides joy—both are needed.",
  },
  "6-9": {
    rating: 8,
    nature:
      "Venus and Mars create a naturally passionate and complementary pairing. The Six's love and beauty harmonizes with the Nine's fire and courage. The Nine protects and provides; the Six loves and beautifies. Both are generous and humanitarian. The Nine's directness is softened by the Six's charm. This is a warm, giving combination.",
    advice:
      "The Nine's aggression can wound the Six. The Nine must temper directness with the Six's love of harmony.",
  },
  "7-7": {
    rating: 6,
    nature:
      "Two Ketus together create a deeply spiritual and introspective relationship. Both are psychic, intuitive, and drawn to the mystical. They understand each other's need for solitude and inner exploration. However, neither provides the practical grounding both need, and the relationship can become too otherworldly. Both may retreat to their inner worlds simultaneously.",
    advice:
      "Maintain connection to the practical world. Create social networks outside the relationship to prevent isolation.",
  },
  "7-8": {
    rating: 3,
    nature:
      "Ketu and Saturn are natural enemies. Both carry heaviness—Ketu through mysticism and isolation, Saturn through karma and restriction. Both can be cold and withdrawn, creating emotional distance. The Eight's materialism conflicts with the Seven's spirituality. This is one of the more challenging combinations, often bringing depression and isolation.",
    advice:
      "Both must make conscious effort to connect emotionally and engage with life. Seek joy actively—it will not come naturally in this combination.",
  },
  "7-9": {
    rating: 4,
    nature:
      "Ketu and Mars are not natural allies. The Nine's aggressive, direct energy unsettles the Seven's need for peace and reflection. The Seven's aloofness frustrates the Nine's desire for engagement and response. The Nine moves too fast for the Seven; the Seven moves too slowly for the Nine. Despite potential spiritual connection, daily life is difficult.",
    advice:
      "The Nine must slow down and give the Seven space. The Seven must make effort to engage with the Nine's energy rather than withdrawing.",
  },
  "8-8": {
    rating: 6,
    nature:
      "Two Saturns together create a relationship of immense discipline, hard work, and material achievement. Both understand suffering, responsibility, and karma. They respect each other's endurance. However, two Saturns can become very heavy together—neither lightens the other's load. Depression and emotional suppression can become entrenched.",
    advice:
      "Actively cultivate joy, laughter, and lightness. Schedule pleasurable activities even when it seems unnecessary.",
  },
  "8-9": {
    rating: 4,
    nature:
      "Saturn and Mars are natural enemies in Vedic astrology. The Eight's slowness and caution clashes with the Nine's speed and impulsiveness. The Nine finds the Eight too heavy and restrictive. The Eight finds the Nine reckless and exhausting. Both are strong, and both can be domineering, creating a relationship of constant friction. Great mutual respect is possible but rarely peace.",
    advice:
      "Find shared projects that channel the Nine's energy within the Eight's structure. Agree that conflict is acceptable and develop conflict-resolution practices.",
  },
  "9-9": {
    rating: 7,
    nature:
      "Two Marses together create a passionate, energetic, and courageous relationship. Both are fighters who face life head-on. They understand each other's fire, impulsiveness, and need for action. The relationship is exciting and intense. However, two Nines together can create explosive conflict—both have fierce tempers that feed on each other.",
    advice:
      "Learn to let one of you lead in a given situation. Two commanders in a battle creates confusion. Take turns.",
  },
};

/**
 * Look up the Johari pair compatibility for two psychic/destiny numbers.
 * Always pass numbers 1-9; the function normalises the key (min-max).
 */
export function getJohariPairCompatibility(
  a: number,
  b: number,
): JohariPairCompat | null {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  return JOHARI_PAIRS[`${lo}-${hi}`] ?? null;
}

/**
 * Look up how one number views another through Johari's friend/enemy lens.
 * Returns "Friendly", "Neutral", or "Enemy".
 */
export function johariViewOf(
  psychic: number,
  target: number,
): "Friendly" | "Neutral" | "Enemy" {
  const profile = JOHARI_PSYCHIC_PROFILES[psychic];
  if (!profile) return "Neutral";
  if (profile.friendlyNumbers.includes(target)) return "Friendly";
  if (profile.enemyNumbers.includes(target)) return "Enemy";
  return "Neutral";
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SOUL WEATHER — COMBINED PERSONAL-YEAR ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────

export interface CombinedWeatherReport {
  /** E.g. "Perfect Synchronization", "Adjacent Cycles", "Opposing Cycles" */
  synchronicity: string;
  /** What is hard when both people are in these years simultaneously */
  challenges: string;
  /** What becomes possible when both are in these years simultaneously */
  opportunities: string;
  /**
   * A pair-specific insight (e.g. "1-9: One begins while the other ends…").
   * Falls back to a generic description when no specific entry exists.
   */
  specificInsight: string;
  /** The first person's personal year number */
  person1Year: number;
  /** The second person's personal year number */
  person2Year: number;
  /** Sum of both personal years (raw numerological reference) */
  combinedEnergy: number;
  /** |year1 - year2| */
  cycleDifference: number;
}

/** Pair-specific insights keyed by "min-max" personal year strings. */
const COMBO_PAIR_INSIGHTS: Record<string, string> = {
  "1-9":
    "One begins while the other ends. This is a powerful transition year. The Nine releases what the One is ready to create. Perfect for passing the torch — what is being cleared away creates space for the new seed.",
  "1-5":
    "Both crave change and action. An exciting but potentially unstable year. Both want to move — make sure you're moving in the same direction rather than centrifuging away from each other.",
  "2-8":
    "Patience meets power. The Two nurtures what the Eight builds. Excellent for business partnerships and long-term projects. The Two must not be overwhelmed by the Eight's intensity or sense of urgency.",
  "3-6":
    "Creativity meets responsibility. The Three wants to play and create while the Six focuses on duty and family. Both need to honor the other's current priorities without dismissing them.",
  "4-7":
    "Hard work meets contemplation. The Four builds while the Seven reflects. They can feel disconnected — one is very busy while the other is very inward. Regular check-ins matter enormously this year.",
  "1-1":
    "Double new beginnings. An incredibly powerful year for launching joint ventures. Both are energized, bold, and ready for action. The risk is two captains on one ship — divide leadership clearly.",
  "5-5":
    "Maximum change and instability. Thrilling but chaotic. Both are restless — the relationship itself may undergo dramatic transformation. Create anchors: one reliable routine per week.",
  "9-9":
    "Double ending. A year of massive release and letting go together. What isn't working will be cleared. Emotionally intense but ultimately liberating — trust the process.",
  "7-7":
    "Double introspection. A deeply spiritual but potentially very isolated year. Both go inward simultaneously — maintain conscious connection through scheduled time together.",
  "4-4":
    "Double foundation building. Hard work intensifies. Results are slow but extremely solid. Not exciting but deeply productive — the roots growing this year will feed the next cycle.",
  "2-6":
    "Love meets love. Both years focus on relationships and nurturing. Beautiful for deepening emotional bonds. Guard against codependency and the temptation to avoid hard conversations.",
  "3-3":
    "Double creativity and joy. Fun, social, and expressive. Great for collaborative creative projects. Guard against scattered energy and the trap of all talk, no follow-through.",
  "8-8":
    "Double power. Material success and recognition amplified. Risk of becoming so focused on achievement that emotional connection is neglected — schedule intimacy as deliberately as you schedule work.",
  "1-2":
    "Initiator meets nurturer. The One launches while the Two refines. Natural division of labor — the One starts, the Two develops. Avoid the One steamrolling the Two's careful pace.",
  "1-3":
    "Action meets expression. A year of bold new ideas and creative momentum. Both have energy but in different modes — One drives the engine, Three lights the interior. Combine well for creative launches.",
  "1-4":
    "Initiative meets consolidation. The One wants to begin; the Four wants to build what already started. Friction is likely but productive — the Four's insistence on foundation keeps the One's ideas alive.",
  "1-6":
    "Freedom meets duty. The One pushes outward into new territory while the Six turns toward home, family, and responsibility. Temporary divergence of focus — name it directly.",
  "1-7":
    "Action meets withdrawal. The One moves; the Seven retreats. This can feel like one is being left behind. Schedule shared time explicitly — the Seven needs solitude but the One needs engagement.",
  "1-8":
    "Launch meets harvest. The One plants fresh seeds while the Eight reaps previous cycles. Different time horizons — the One is thinking about what's next, the Eight is evaluating what has been.",
  "2-3":
    "Cooperation meets expression. A social, warm, and creatively generative year. The Two provides emotional intelligence; the Three provides enthusiasm and output. Natural partnership energy.",
  "2-4":
    "Sensitivity meets foundation. The Two's emotional attunement supports the Four's grind. The Four's stability provides the Two with a secure base. Slower-paced but deeply nourishing.",
  "2-5":
    "Patience meets restlessness. The Two steadies while the Five roams. The Two may feel abandoned; the Five may feel anchored. Agree on how much freedom and how much togetherness is needed.",
  "2-7":
    "Devotion meets retreat. Both are turning inward — the Two emotionally, the Seven spiritually. A quiet, introspective year for the relationship. Depth over breadth.",
  "2-9":
    "Nurturing meets completion. The Two tends the fire while the Nine burns through what remains. Emotionally complex — the Nine's releases may unsettle the Two's desire for stability.",
  "3-4":
    "Joy meets discipline. The Three wants to play; the Four is working. Creative frustration unless roles are clearly divided — let the Three inspire and the Four implement.",
  "3-5":
    "Expression meets freedom. Two social, lively energies. Exciting and fun but very scattered. Ground the energy with one shared goal so the vitality doesn't dissipate.",
  "3-7":
    "Performance meets wisdom. The Three's social brightness can energize the Seven's usually solitary path. The Seven's depth can add meaning to the Three's expression. Uncommon but interesting pairing.",
  "3-8":
    "Joy meets power. The Three adds lightness to the Eight's serious harvest energy. The Eight adds weight and direction to the Three's exuberance. Useful balance — don't let the Eight suppress the Three.",
  "3-9":
    "Creation meets completion. The Three creates; the Nine completes and releases. A transitional year where something new is being born as something old ends. Honor both processes.",
  "4-5":
    "Foundation meets freedom. The Four digs in; the Five wants to fly. Maximum tension but also maximum complementarity — the Four's stability catches what the Five discovers.",
  "4-6":
    "Building meets loving. Both are deeply concerned with security — the Four with material, the Six with relational. A year for consolidating the structures that support intimacy.",
  "4-8":
    "Double consolidation. The Four builds; the Eight harvests what was built. Efficient and serious. Risk of becoming all work and no play — schedule enjoyment deliberately.",
  "4-9":
    "Foundation meets release. Paradoxical: one builds as the other clears. The Nine's letting-go may feel threatening to the Four's need to solidify. Name the tension; it's temporary.",
  "5-6":
    "Change meets duty. The Five wants new experiences; the Six wants to strengthen the nest. Negotiate consciously — the Five needs freedom, the Six needs presence.",
  "5-7":
    "Movement meets stillness. The Five rushes forward; the Seven wants to go inward. Different rhythms this year — both valid, both necessary. Respect the difference rather than trying to convert.",
  "5-8":
    "Freedom meets harvest. The Five shakes things up as the Eight tries to consolidate gains. Creative tension — the Five opens new doors just as the Eight is counting what's in the vault.",
  "5-9":
    "Change meets completion. Two major clearing energies. A year of significant transition for the relationship — old forms fall away, new ones have not yet arrived. Trust the liminal space.",
  "6-7":
    "Love meets solitude. The Six wants closeness; the Seven needs space. More negotiation required this year than most. The Six must not interpret the Seven's withdrawal as rejection.",
  "6-8":
    "Responsibility meets power. Both are consolidating — the Six around love and home, the Eight around career and resources. Strong year for building a shared life with a clear material foundation.",
  "6-9":
    "Nurturing meets release. The Six clings; the Nine releases. What the Six has been tending may be what the Nine needs to let go. Tenderness is required around loss.",
  "7-8":
    "Reflection meets ambition. The Seven goes inward; the Eight pushes outward for material achievement. Significant divergence. The Eight should not pull the Seven out of needed retreat; the Seven should not guilt the Eight for ambition.",
  "7-9":
    "Wisdom meets completion. Both are in ending energies — the Seven through spiritual emptying, the Nine through cycle completion. A profoundly transitional year. Honor what is passing.",
  "8-9":
    "Harvest meets release. The Eight counts gains as the Nine clears the field. What the Eight values may be what the Nine releases. Significant but manageable tension around what to keep.",
};

/**
 * Generate a combined Soul Weather report for two people in specific
 * personal-year numbers. The report describes how both cycles interact.
 *
 * @param year1 – Personal year number for person 1 (1–9, or 11/22)
 * @param year2 – Personal year number for person 2 (1–9, or 11/22)
 */
export function generateCombinedWeather(
  year1: number,
  year2: number,
): CombinedWeatherReport {
  const diff = Math.abs(year1 - year2);
  const sum = year1 + year2;

  let synchronicity: string;
  let challenges: string;
  let opportunities: string;

  if (year1 === year2) {
    synchronicity = "Perfect Synchronization";
    challenges =
      "You are both experiencing the same life theme simultaneously. This creates deep understanding but also means you face the same challenges at the same time with no one to provide a different perspective.";
    opportunities =
      "Use this rare alignment to pursue shared goals with double the energy. You intuitively understand what the other is going through because you're living it too.";
  } else if (diff === 1) {
    synchronicity = "Adjacent Cycles";
    challenges =
      "You are one step apart in your personal cycles. One is slightly ahead, having just completed what the other is beginning. This can create a sense that one person is 'further along.'";
    opportunities =
      "The one who just completed this phase can guide and support the other through it. Share your recent experience as wisdom.";
  } else if (diff <= 3) {
    synchronicity = "Complementary Phases";
    challenges =
      "You are in different life phases, which means your priorities and energy levels differ. What feels urgent to one may seem irrelevant to the other.";
    opportunities =
      "Your different phases provide balance — when one is in a difficult year, the other may be in a lighter one and can provide support.";
  } else if (diff <= 5) {
    synchronicity = "Contrasting Seasons";
    challenges =
      "You are in significantly different life seasons. Communication about current needs and priorities is essential because you cannot assume the other understands your current focus.";
    opportunities =
      "Maximum growth potential. You bring very different energies to the relationship, preventing stagnation and providing constant new perspectives.";
  } else {
    synchronicity = "Opposing Cycles";
    challenges =
      "You are in nearly opposite life phases. This creates maximum tension but also maximum learning. What one needs, the other may find irrelevant or burdensome.";
    opportunities =
      "The greatest teacher is the one most different from you. This year tests your ability to support someone whose needs differ completely from yours.";
  }

  // Pair-specific insight: try the normalised key then flip
  const lo = Math.min(year1, year2);
  const hi = Math.max(year1, year2);
  const specificInsight =
    COMBO_PAIR_INSIGHTS[`${lo}-${hi}`] ??
    `Year ${year1} and Year ${year2} bring their individual themes into the relationship. Review each year's meaning separately to understand the current dynamic between you.`;

  return {
    synchronicity,
    challenges,
    opportunities,
    specificInsight,
    person1Year: year1,
    person2Year: year2,
    combinedEnergy: sum,
    cycleDifference: diff,
  };
}