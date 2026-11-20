/**
 * MYSTIQUE COMPASS — Master Numbers & Maturity Number
 */

export interface MasterNumberResult {
  number: 11 | 22 | 33;
  title: string;
  present: boolean;
  interpretation: string;
}

export interface MaturityNumberResult {
  number: number;
  isMaster: boolean;
  title: string;
  interpretation: string;
}

function reduceNum(n: number): number {
  let val = Math.abs(n);
  while (val > 9) val = String(val).split('').reduce((a: number, d: string) => a + +d, 0);
  return val;
}

const MASTER_MEANINGS: Record<number, { title: string; interpretation: string }> = {
  11: {
    title: 'The Illuminated — Master Number 11',
    interpretation: `MASTER NUMBER 11 — The Illuminated

The Master Number 11 is the most intuitive of all vibrations — the number of the spiritual messenger, the visionary, the channel through which higher wisdom flows into the material world. Unlike the 2 (1+1=2) to which it reduces, the 11 does not primarily concern itself with partnership and diplomacy. Its domain is ILLUMINATION — the direct perception of truth that bypasses the ordinary processes of learning and reasoning.

Those carrying the 11 as a core number (Psychic, Destiny, or Life Path) possess a nervous system tuned to a higher frequency than most. They perceive what others miss, feel what others suppress, and know what others must study. This is not superiority but DIFFERENCE — the 11's gift is also its burden, as the sensitivity that enables extraordinary perception also makes ordinary life unusually demanding.

THE LIGHT: The 11 at its highest expression is the inspired teacher, the transformative artist, the spiritual leader whose words and presence shift consciousness in those who encounter them. Their intuition, when trusted, borders on prescience. Their creativity seems to come through them rather than from them. They serve as bridges between the seen and unseen worlds, translating subtle truth into forms the material mind can grasp.

THE SHADOW: The 11 at its lowest expression operates at the reduced vibration of 2 — living a life of quiet desperation, aware (however dimly) of capacities they are not using, haunted by the gap between what they sense is possible and what they are actually doing. The 11's sensitivity, unsupported, becomes anxiety. Their vision, unexpressed, becomes depression. Their intuition, untrusted, becomes chronic indecision. The 11 who does not answer the call of their master number lives not a neutral life but a diminished one — and they KNOW it, which is the cruelest part.

THE PRESCRIPTION: The 11 requires GROUNDING above all else. The lightning rod must be connected to earth or the electricity has nowhere safe to go. Physical practices — exercise, manual work, time in nature — are not optional for the 11. Develop a relationship with your intuition that includes discernment: not every impulse is divine guidance. Trust but verify. And most importantly: EXPRESS. The 11's insights are not meant to remain private. Find forms, however humble, through which your vision reaches others.`,
  },
  22: {
    title: 'The Master Builder — Master Number 22',
    interpretation: `MASTER NUMBER 22 — The Master Builder

The Master Number 22 is the most powerful material vibration in numerology — the number of the architect who can translate spiritual vision into physical form at the largest possible scale. If the 11 sees the vision, the 22 BUILDS it. This is the number of institutions, movements, and infrastructures that serve humanity for generations.

The 22 carries an extraordinary responsibility: the capacity to manifest at a level that affects thousands or millions. Those carrying the 22 as a core number are here to build something that outlasts them — not for personal glory but because the skill to build at this scale is too rare to waste on merely personal projects.

THE LIGHT: The 22 at its highest expression is the founder of lasting enterprises, the architect of social change, the builder of bridges between what is and what could be. Their vision is not merely grand but PRACTICAL — they see not only what should be built but exactly how to build it, step by step. They possess the rare combination of spiritual insight (the 11 component) and executive capacity (the 4 component: 2+2=4), enabling them to lead large-scale initiatives that require both inspiration and implementation.

THE SHADOW: The 22 at its lowest expression operates at the reduced vibration of 4 — building competently but at a fraction of their capacity, haunted by the sense that they are meant for something larger. The weight of unrealized potential is particularly heavy for the 22 because the potential is not abstract (as with the 11) but concrete — they can literally SEE what they could build and measure the gap between vision and reality. This can lead to depression, self-sabotage, or the channeling of their building capacity into destructive ends.

THE PRESCRIPTION: Begin where you are, with what you have. The 22 who waits for perfect conditions to begin building will never build. Master the 4 vibration first — discipline, structure, patient effort — and let the 22 emerge organically as your foundation deepens. The skyscraper requires a foundation as deep as the building is tall. Do not despise the years of underground work.`,
  },
  33: {
    title: 'The Master Teacher — Master Number 33',
    interpretation: `MASTER NUMBER 33 — The Master Teacher

The Master Number 33 is the rarest and most spiritually elevated of the master numbers — the number of the teacher whose wisdom transforms not just minds but souls. It combines the intuition of the 11 and the building capacity of the 22 with a devotion to SERVICE that transcends personal ambition entirely. The 33 is here not to achieve but to GIVE — to pour out wisdom, love, and guidance in forms that elevate humanity's collective consciousness.

Those carrying the 33 as a core number often resist their calling more fiercely than any other master number — because the 33's path requires a degree of selflessness that the ego experiences as annihilation. But the resistance is futile; the 33 who does not teach will find that life teaches THEM, through increasingly painful lessons, until they accept their role.

THE LIGHT: The 33 at its highest expression is the teacher whose students' lives are permanently altered, the healer whose presence alone catalyzes transformation, the artist whose work opens doorways in consciousness that did not previously exist. Their love is impersonal in the highest sense — not directed at specific individuals but radiating toward all beings equally. They do not seek students; students find them.

THE SHADOW: The 33 at its lowest expression operates at the reduced vibration of 6 — caring for others competently but within a limited sphere, never reaching the universal scale their soul intended. The 33's particular shadow is the temptation to sacrifice themselves entirely — to give until there is nothing left, to pour out until the vessel is empty and shattered. This is not service but self-destruction, and it ultimately serves no one.

THE PRESCRIPTION: The 33 must learn that self-care is not selfishness but the maintenance of the instrument through which their gift flows. A violin that is never restrung, never cleaned, never rested between performances will eventually produce no music. Your capacity to serve is directly proportional to your capacity to receive — to rest, to be cared for, to allow others to give to you. This is not a compromise of your calling; it is the condition of its sustainability.`,
  },
};

export function detectMasterNumbers(psycheNum: number, destinyNum: number, compoundNum: number | null, reducedCompoundNum: number | null): MasterNumberResult[] {
  const results: MasterNumberResult[] = [];
  const seen = new Set<number>();

  const check = (n: number, label: string) => {
    if ((n === 11 || n === 22 || n === 33) && !seen.has(n)) {
      seen.add(n);
      results.push({ number: n as 11 | 22 | 33, present: true, ...MASTER_MEANINGS[n] });
    }
  };

  check(psycheNum, 'Psychic');
  check(destinyNum, 'Destiny');
  if (compoundNum) check(compoundNum, 'Compound');
  if (reducedCompoundNum) check(reducedCompoundNum, 'Reduced Compound');

  return results;
}

export function calculateMaturityNumber(psycheNum: number, destinyNum: number): MaturityNumberResult {
  const raw = psycheNum + destinyNum;
  const num = reduceNum(raw);
  const isMaster = (raw === 11 || raw === 22 || raw === 33);

  const MATURITY_MEANINGS: Record<number, { title: string; interpretation: string }> = {
    1: { title: 'The Independent Sage', interpretation: `MATURITY NUMBER 1 — The Independent Sage\n\nIn the second half of life, the Maturity 1 individual grows into a powerful independence — not the raw, untested independence of youth but a seasoned self-reliance that has learned when to stand alone and when to collaborate. The later years bring increasing authority, originality, and the capacity to initiate projects and movements that reflect a lifetime of accumulated wisdom. The challenge is to lead without dominating — to use the hard-won authority for service rather than self-aggrandizement.` },
    2: { title: 'The Wise Diplomat', interpretation: `MATURITY NUMBER 2 — The Wise Diplomat\n\nThe Maturity 2 individual grows into a refined capacity for partnership and emotional intelligence. The later years bring deepening relationships, increasing intuitive accuracy, and the ability to mediate conflicts that younger souls find intractable. The challenge is to maintain boundaries while remaining open — to be sensitive without being porous.` },
    3: { title: 'The Expressive Elder', interpretation: `MATURITY NUMBER 3 — The Expressive Elder\n\nThe Maturity 3 individual grows into joyful, creative self-expression. The later years bring a flowering of artistic or communicative gifts that may have been suppressed during the career-building decades. The challenge is to express authentically rather than performatively — to create from joy rather than for approval.` },
    4: { title: 'The Master Organizer', interpretation: `MATURITY NUMBER 4 — The Master Organizer\n\nThe Maturity 4 individual grows into a formidable capacity for building and organizing. The later years bring the fruition of decades of disciplined effort — systems that work, structures that endure, legacies that outlast their creator. The challenge is to remain flexible — to allow the structures to serve life rather than constraining it.` },
    5: { title: 'The Liberated Wanderer', interpretation: `MATURITY NUMBER 5 — The Liberated Wanderer\n\nThe Maturity 5 individual grows into a remarkable freedom and adaptability. The later years bring unexpected adventures, dramatic changes of direction, and a willingness to reinvent the self that younger souls find inspiring and slightly alarming. The challenge is to embrace change without becoming unmoored — to be free without being lost.` },
    6: { title: 'The Beloved Nurturer', interpretation: `MATURITY NUMBER 6 — The Beloved Nurturer\n\nThe Maturity 6 individual grows into a deep capacity for love and service. The later years bring the harvest of relationships cultivated over decades — family, community, and chosen kin who surround the individual with the love they have spent a lifetime giving. The challenge is to receive as gracefully as one has given.` },
    7: { title: 'The Solitary Sage', interpretation: `MATURITY NUMBER 7 — The Solitary Sage\n\nThe Maturity 7 individual grows into profound wisdom and spiritual depth. The later years bring increasing solitude — not from loneliness but from a genuine preference for the company of one's own thoughts and the pursuit of understanding that requires quiet. The challenge is to share the wisdom rather than hoarding it — to descend from the mountain occasionally and tell others what was seen.` },
    8: { title: 'The Empowered Executive', interpretation: `MATURITY NUMBER 8 — The Empowered Executive\n\nThe Maturity 8 individual grows into substantial material and organizational authority. The later years bring the harvest of career-long efforts — financial security, institutional influence, and the capacity to direct resources toward causes that matter. The challenge is to wield power ethically — to use the accumulated authority for genuine good rather than mere accumulation.` },
    9: { title: 'The Universal Humanitarian', interpretation: `MATURITY NUMBER 9 — The Universal Humanitarian\n\nThe Maturity 9 individual grows into a transcendent compassion that extends beyond personal relationships to encompass humanity. The later years bring the completion of major life cycles and a natural turn toward service, philanthropy, and the transmission of wisdom to younger generations. The challenge is to complete without regret — to release what has finished without clinging to what was.` },
  };

  const result = MATURITY_MEANINGS[num] || { title: `Maturity Number ${num}`, interpretation: `The Maturity Number ${num} represents the integrated wisdom of the life's second half — the qualities that emerge as the Psychic Number (${psycheNum}) and Destiny Number (${destinyNum}) synthesize through decades of lived experience.` };

  return { number: num, isMaster, ...result };
}
