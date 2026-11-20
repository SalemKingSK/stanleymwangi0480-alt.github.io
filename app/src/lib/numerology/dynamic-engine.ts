/**
 * @fileoverview MYSTIQUE COMPASS — Dynamic Matrix Potentials Engine
 * 
 * Logic to calculate "creatable" numbers based on the birth year's 
 * Millennium Period threshold and the strength of lines in the matrix.
 */

export interface DynamicMatrixResult {
  hasDynamicNumbers: boolean;
  creatableNumbers: number[];
  interpretation: string;
  thresholdUsed: number;
}

interface MatrixLine {
  name: string;
  digits: number[];
}

export function calculateDynamicPotentials(birthYear: number, baseMatrix: Record<number, number>): DynamicMatrixResult {
  // 1. Determine the 200-year period threshold
  const threshold = getThresholdForYear(birthYear);
  
  // 2. Define the lines of the Psychomatrix
  const lines: MatrixLine[] = [
    { name: "1st Row (Purpose/Will)", digits: [1, 4, 7] },
    { name: "2nd Row (Family/Bioenergy)", digits: [2, 5, 8] },
    { name: "3rd Row (Habits/Stability)", digits: [3, 6, 9] },
    { name: "1st Column (Self-Esteem)", digits: [1, 2, 3] },
    { name: "2nd Column (Making a Living)", digits: [4, 5, 6] },
    { name: "3rd Column (Talent/Destiny)", digits: [7, 8, 9] },
    { name: "Spiritual Diagonal", digits: [1, 5, 9] },
    { name: "Carnal/Temperament Diagonal", digits: [3, 5, 7] },
  ];

  const dynamicallyCreatedDigits = new Set<number>();
  const sourcesOfCreation: Record<number, string[]> = {};

  // 3. Scan lines against the threshold
  for (const line of lines) {
    let lineStrength = 0;
    const missingInThisLine: number[] = [];

    // Calculate total strength and identify missing digits in this specific line
    for (const digit of line.digits) {
      const count = baseMatrix[digit] || 0;
      lineStrength += count;
      if (count === 0) {
        missingInThisLine.push(digit);
      }
    }

    // If the line meets the period's threshold, it can create its missing numbers
    if (lineStrength >= threshold && missingInThisLine.length > 0) {
      for (const missingDigit of missingInThisLine) {
        dynamicallyCreatedDigits.add(missingDigit);
        
        if (!sourcesOfCreation[missingDigit]) {
          sourcesOfCreation[missingDigit] = [];
        }
        sourcesOfCreation[missingDigit].push(line.name);
      }
    }
  }

  const sortedCreated = Array.from(dynamicallyCreatedDigits).sort((a, b) => a - b);
  const ruleApplies = sortedCreated.length > 0;
  let interpretationText = "";

  if (ruleApplies) {
    interpretationText = buildInterpretationText(sortedCreated, sourcesOfCreation);
  }

  return {
    hasDynamicNumbers: ruleApplies,
    creatableNumbers: sortedCreated,
    interpretation: interpretationText,
    thresholdUsed: threshold,
  };
}

function getThresholdForYear(year: number): number {
  if (year >= 1800 && year <= 1999) {
    return 5; // 5th Period: Requires 5 digits in a line
  } else if (year >= 2000 && year <= 2199) {
    return 1; // 1st Period: Requires 1 digit in a line
  } else if (year >= 2200 && year <= 2399) {
    return 2; // 2nd Period: Requires 2 digits in a line
  } else if (year >= 2400 && year <= 2599) {
    return 3; // 3rd Period: Requires 3 digits in a line
  } else if (year >= 2600 && year <= 2799) {
    return 4; // 4th Period: Requires 4 digits in a line
  }
  return 5; // Fallback
}

function buildInterpretationText(createdNumbers: number[], sources: Record<number, string[]>): string {
  const fullMeanings: Record<number, string> = {
    1: "Willpower & Leadership (1): You can dynamically generate willpower, assertiveness, and leadership qualities. When required by the situation, you can switch from being passive to taking absolute control and defending your boundaries.",
    2: "Bioenergy & Partnership (2): You can summon the physical and social energy needed to connect with others. You can adapt to team environments and manifest the drive required to push through exhaustion.",
    3: "Temperament & Knowledge (3): You can instantly manifest a deep interest in new subjects, technical learning, or physical intimacy. You can adapt your temperament to match the enthusiasm of those around you.",
    4: "Health & Discipline (4): You have the latent ability to physically endure harsh conditions and manifest strict personal discipline. Your body and mind can temporarily harden to withstand immense stress or physical demands.",
    5: "Logic & Intuition (5): You can pull logic and spatial awareness seemingly out of nowhere. In chaotic situations, you can dynamically generate the intuition needed to assess your environment, make calculated decisions, and adapt to rapidly changing circumstances.",
    6: "Craftsmanship & Grounding (6): You can dynamically generate a powerful work ethic. Even if you prefer intellectual pursuits, you can switch into a state of intense physical labor, craftsmanship, or routine execution when the job absolutely must get done.",
    7: "Talent & Luck (7): You can manufacture your own luck. By utilizing the energy of your strong lines, you can manifest sudden bursts of talent or find fortunate escapes during critical, high-risk moments in your life.",
    8: "Duty & Tolerance (8): You can temporarily manifest a profound sense of duty, patience, and obligation to others. You can bear burdens for your family or society without complaint when the environment demands sacrifice.",
    9: "Intellect & Memory (9): You can dynamically enhance your analytical capabilities. When faced with complex problems, you can manifest the necessary memory recall, spiritual insight, and mental clarity to find the solution."
  };

  let text = "According to the Digital Analysis of Millennium Periods, your base matrix contains open potentials. Because of the generation you were born into, the strength of specific lines in your chart allows you to consciously manifest numbers that are technically 'missing' from your birth date. These are not permanent traits, but highly adaptable abilities you can call upon when life demands them.\n\n";

  for (const number of createdNumbers) {
    text += fullMeanings[number] + "\n";
    text += "Powered by: " + sources[number].join(" and ") + "\n\n";
  }

  return text.trim();
}
