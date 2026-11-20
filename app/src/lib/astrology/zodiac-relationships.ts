/**
 * MYSTIQUE COMPASS — Chinese Zodiac Affinity Triangles & Relationships
 *
 * The 12 animals form 4 affinity triangles (three-harmony), 6 opposition pairs,
 * and secret friend pairings. All computed from birth year animal only.
 *
 * ALL TEXT IS VERBATIM.
 */

export interface AffinityTriangle {
  name: string;
  animals: string[];
  element: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
  interpretation: string;
}

export interface ZodiacRelationshipResult {
  animal: string;
  animalChinese: string;
  secretFriend: string;
  secretFriendChinese: string;
  astrologicalEnemy: string;
  enemyChinese: string;
  peachBlossom: string;
  peachBlossomChinese: string;
  triangle: AffinityTriangle;
  interpretation: string;
}

const ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
const ANIMALS_CH = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const TRIANGLES: AffinityTriangle[] = [
  { name: 'The Innovators', animals: ['Rat', 'Dragon', 'Monkey'], element: 'Water',
    interpretation: `THE INNOVATORS TRIANGLE — Rat, Dragon, Monkey\n\nThis is the most dynamic and strategically brilliant of the four affinity triangles. Rat, Dragon, and Monkey share a Yang Water foundation that manifests as restless intelligence, strategic vision, and the capacity to create opportunities where others see obstacles. These three form the engine of invention in the zodiac — each contributes a different dimension of the same fundamental impulse toward CHANGE.\n\nThe Rat provides the strategic mind that detects opportunity before others perceive it. The Dragon provides the visionary ambition that converts opportunity into destiny. The Monkey provides the improvisational genius that navigates obstacles the strategist and visionary did not foresee. Together they form an alliance capable of creating entirely new paradigms.\n\nROLE WITHIN THE TRIANGLE:\n• Rat and Monkey: An alliance of pure mental agility — these two share a wavelength that others cannot follow, finishing each other's thoughts and escalating each other's ideas into increasingly brilliant forms.\n• Dragon and Monkey: The visionary meets the implementor — Dragon provides the dream, Monkey provides the path, and between them the impossible becomes inevitable.\n• Dragon and Rat: A power alliance of strategic depth — the Dragon's authority combined with the Rat's intelligence creates leadership of formidable effectiveness.` },
  { name: 'The Guardians', animals: ['Ox', 'Snake', 'Rooster'], element: 'Metal',
    interpretation: `THE GUARDIANS TRIANGLE — Ox, Snake, Rooster\n\nThis is the most disciplined and precise of the four affinity triangles. Ox, Snake, and Rooster share a Metal foundation that manifests as exacting standards, unwavering commitment to quality, and the capacity to build structures that endure for generations. These three form the backbone of civilization — each contributes a different dimension of the same fundamental impulse toward PERFECTION.\n\nThe Ox provides the patient endurance that sees projects through decades of labor. The Snake provides the penetrating wisdom that ensures the right things are being built. The Rooster provides the quality control that refuses to accept anything less than excellence. Together they form an alliance capable of creating institutions that outlast their founders.\n\nROLE WITHIN THE TRIANGLE:\n• Ox and Rooster: A working alliance of extraordinary productivity — the Ox provides the power, the Rooster provides the precision, and together they achieve what faster signs only dream of.\n• Snake and Rooster: The thinker and the executor — Snake's strategic depth meets Rooster's commitment to correctness, producing work of extraordinary quality and integrity.\n• Snake and Ox: A partnership of depth and endurance — the Snake's wisdom guides the Ox's immense power, and the Ox's loyalty gives the Snake the security they need to open their heart.` },
  { name: 'The Visionaries', animals: ['Tiger', 'Horse', 'Dog'], element: 'Fire',
    interpretation: `THE VISIONARIES TRIANGLE — Tiger, Horse, Dog\n\nThis is the most passionate and idealistic of the four affinity triangles. Tiger, Horse, and Dog share a Fire foundation that manifests as fierce conviction, unwavering loyalty to principles, and the courage to act on behalf of what is right regardless of personal cost. These three form the conscience of the zodiac — each contributes a different dimension of the same fundamental impulse toward JUSTICE.\n\nThe Tiger provides the courage that charges into battle when principle demands action. The Horse provides the energy that sustains movements across years and decades. The Dog provides the moral clarity that ensures the battle is for the RIGHT cause, not merely an exciting one. Together they form an alliance capable of defending the vulnerable and transforming society.\n\nROLE WITHIN THE TRIANGLE:\n• Tiger and Dog: An alliance of courage and loyalty — these two recognize each other as kindred spirits, bound by a shared commitment to protecting what matters.\n• Horse and Dog: The adventurer and the guardian — the Horse's love of freedom meets the Dog's commitment to protection, creating a dynamic of exhilarating mutual trust.\n• Tiger and Horse: Two fires that burn brighter together — an alliance of pure passion that can achieve extraordinary things but must be directed toward clear objectives.` },
  { name: 'The Cultivators', animals: ['Rabbit', 'Goat', 'Pig'], element: 'Wood',
    interpretation: `THE CULTIVATORS TRIANGLE — Rabbit, Goat, Pig\n\nThis is the most gentle and aesthetically refined of the four affinity triangles. Rabbit, Goat, and Pig share a Wood foundation that manifests as creative sensitivity, nurturing love, and the capacity to create environments of extraordinary beauty and peace. These three form the heart of the zodiac — each contributes a different dimension of the same fundamental impulse toward HARMONY.\n\nThe Rabbit provides the diplomacy that resolves conflict before it escalates. The Goat provides the artistic sensitivity that creates beauty others merely consume. The Pig provides the unconditional generosity that nourishes all who enter their sphere. Together they form an alliance capable of creating paradises on earth — environments where life flourishes.\n\nROLE WITHIN THE TRIANGLE:\n• Rabbit and Pig: An alliance of pure benevolence — these two recognize in each other the gentleness the world so often fails to value, and together they create sanctuaries of peace.\n• Goat and Pig: The artist and the benefactor — the Goat's creativity meets the Pig's generosity, producing beauty that serves rather than merely impresses.\n• Rabbit and Goat: Two artists who understand each other's need for beauty and peace — an alliance of mutual appreciation that produces environments of extraordinary aesthetic quality.` },
];

const OPPOSITION_PAIRS: Record<string, { enemy: string; enemyCh: string }> = {
  'Rat': { enemy: 'Horse', enemyCh: '午' },
  'Horse': { enemy: 'Rat', enemyCh: '子' },
  'Ox': { enemy: 'Goat', enemyCh: '未' },
  'Goat': { enemy: 'Ox', enemyCh: '丑' },
  'Tiger': { enemy: 'Monkey', enemyCh: '申' },
  'Monkey': { enemy: 'Tiger', enemyCh: '寅' },
  'Rabbit': { enemy: 'Rooster', enemyCh: '酉' },
  'Rooster': { enemy: 'Rabbit', enemyCh: '卯' },
  'Dragon': { enemy: 'Dog', enemyCh: '戌' },
  'Dog': { enemy: 'Dragon', enemyCh: '辰' },
  'Snake': { enemy: 'Pig', enemyCh: '亥' },
  'Pig': { enemy: 'Snake', enemyCh: '巳' },
};

const SECRET_FRIENDS: Record<string, { friend: string; friendCh: string }> = {
  'Rat': { friend: 'Ox', friendCh: '丑' }, 'Ox': { friend: 'Rat', friendCh: '子' },
  'Tiger': { friend: 'Pig', friendCh: '亥' }, 'Pig': { friend: 'Tiger', friendCh: '寅' },
  'Rabbit': { friend: 'Dog', friendCh: '戌' }, 'Dog': { friend: 'Rabbit', friendCh: '卯' },
  'Dragon': { friend: 'Rooster', friendCh: '酉' }, 'Rooster': { friend: 'Dragon', friendCh: '辰' },
  'Snake': { friend: 'Monkey', friendCh: '申' }, 'Monkey': { friend: 'Snake', friendCh: '巳' },
  'Horse': { friend: 'Goat', friendCh: '未' }, 'Goat': { friend: 'Horse', friendCh: '午' },
};

const PEACH_BLOSSOMS: Record<string, { blossom: string; blossomCh: string }> = {
  'Rat': { blossom: 'Ox', blossomCh: '丑' }, 'Ox': { blossom: 'Rat', blossomCh: '子' },
  'Tiger': { blossom: 'Horse', blossomCh: '午' }, 'Horse': { blossom: 'Tiger', blossomCh: '寅' },
  'Rabbit': { blossom: 'Dragon', blossomCh: '辰' }, 'Dragon': { blossom: 'Rabbit', blossomCh: '卯' },
  'Snake': { blossom: 'Rooster', blossomCh: '酉' }, 'Rooster': { blossom: 'Snake', blossomCh: '巳' },
  'Monkey': { blossom: 'Rat', blossomCh: '子' }, 'Goat': { blossom: 'Pig', blossomCh: '亥' },
  'Dog': { blossom: 'Horse', blossomCh: '午' }, 'Pig': { blossom: 'Goat', blossomCh: '未' },
};

const TRIANGLE_BY_ANIMAL: Record<string, AffinityTriangle> = {};
for (const t of TRIANGLES) {
  for (const a of t.animals) TRIANGLE_BY_ANIMAL[a] = t;
}

export function getZodiacRelationships(birthYear: number): ZodiacRelationshipResult {
  const animalIdx = ((birthYear - 4) % 12 + 12) % 12;
  const animal = ANIMALS[animalIdx];
  const animalChinese = ANIMALS_CH[animalIdx];

  const sf = SECRET_FRIENDS[animal]!;
  const opp = OPPOSITION_PAIRS[animal]!;
  const pb = PEACH_BLOSSOMS[animal]!;
  const triangle = TRIANGLE_BY_ANIMAL[animal]!;

  const triangleAnimalsExcept = triangle.animals.filter(a => a !== animal);

  const interpretation = `YOUR ZODIAC RELATIONSHIPS — ${animal} (${animalChinese})

AFFINITY TRIANGLE: You belong to the ${triangle.name} Triangle (${triangle.element} element) alongside the ${triangleAnimalsExcept.join(' and ')}. ${triangle.interpretation.split('\n\n')[0].replace('THE ', '').replace(' TRIANGLE', '').split(':')[0]}: you share a fundamental energetic kinship with these two signs. Together you form a complete creative, protective, or transformative unit. The ${triangle.element} element is your shared foundation — it colors how you approach the world, what you value, and how you naturally express yourself.

YOUR SECRET FRIEND: The ${sf.friend} (${sf.friendCh}). The Secret Friend is the zodiac pairing of deepest, most natural compatibility — the sign with whom you can be entirely yourself without explanation. The ${animal} and ${sf.friend} share an unspoken understanding that transcends words. In a room of strangers, these two will find each other. In a lifetime of searching, the Secret Friend represents home. This pairing does not complete each other in the romantic sense but COMPLEMENTS each other in the cosmic sense — each provides what the other lacks, not as debt but as gift.

YOUR ASTROLOGICAL ENEMY: The ${opp.enemy} (${opp.enemyCh}). The Opposition Pair represents the sign whose fundamental nature is most DIFFERENT from yours — not necessarily hostile but operating from premises so opposite to your own that genuine conflict arises naturally unless conscious effort is made to bridge the gap. This is the 180-degree opposition on the zodiac wheel. Understanding this relationship is not about avoidance but about recognizing that this sign sees the world from a perspective you literally cannot access — and that learning from their perspective expands your own.

YOUR PEACH BLOSSOM: The ${pb.blossom} (${pb.blossomCh}). In Chinese astrology, the Peach Blossom represents ROMANTIC ATTRACTION and the capacity to charm. The Peach Blossom animal indicates the sign toward which you feel the strongest magnetic pull in romantic contexts — not necessarily the most compatible long-term partner, but the sign that activates your capacity for attraction, desire, and the experience of being swept away. Understanding your Peach Blossom helps you recognize when infatuation is genuine chemistry versus mere chemistry.`;

  return {
    animal, animalChinese,
    secretFriend: sf.friend, secretFriendChinese: sf.friendCh,
    astrologicalEnemy: opp.enemy, enemyChinese: opp.enemyCh,
    peachBlossom: pb.blossom, peachBlossomChinese: pb.blossomCh,
    triangle, interpretation,
  };
}

export { TRIANGLES, ANIMALS, ANIMALS_CH, OPPOSITION_PAIRS, SECRET_FRIENDS, PEACH_BLOSSOMS, TRIANGLE_BY_ANIMAL };
