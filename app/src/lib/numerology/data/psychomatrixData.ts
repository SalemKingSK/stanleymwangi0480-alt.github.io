
/**
 * @fileoverview ALEXANDROV'S PSYCHOMATRIX — Complete Verbatim Reference Data
 */

import { PSYCHOMATRIX_INTRO } from './psychomatrix/introduction';
import { PSYCHOMATRIX_MAIN_MEANINGS } from './psychomatrix/meanings';
import { PSYCHOMATRIX_DIFFICULTY } from './psychomatrix/difficulty';

export interface PsychomatrixCellMeaning {
  count: number;
  label: string;
  verbatim: string;
  scale: 'absent' | 'very-weak' | 'norm' | 'special' | 'strong' | 'dominant' | 'overload';
}

export interface PsychomatrixCellData {
  digit: number;
  cellName: string;
  intro: string;
  generalMeaning: string;
  lineContext: string;
  meanings: PsychomatrixCellMeaning[];
  difficultyVerbatim?: string;
}

export interface PsychomatrixResult {
  day: number;
  month: number;
  year: number;
  first: number;
  second: number;
  third: number;
  fourth: number;
  allDigits: number[];
  counts: Record<number, number>;
  grid: Array<Array<string | null>>;
  activeLines: string[];
  complementaryInsights: ComplementaryInsight[];
  cellReadings: CellReading[];
  zeroAnalysis: {
    hasAnyZero: boolean;
    interpretations: string[];
  };
}

export interface CellReading {
  digit: number;
  count: number;
  cellName: string;
  label: string;
  verbatim: string;
  scale: PsychomatrixCellMeaning['scale'];
  modifiers: string[];
  difficultyVerbatim?: string;
}

export interface ComplementaryInsight {
  digits: number[];
  title: string;
  insight: string;
  type: 'amplify' | 'tension' | 'transition' | 'synergy';
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA OBJECTS
// ─────────────────────────────────────────────────────────────────────────────

export const PSYCHOMATRIX_CELL_MEANINGS: Record<number, PsychomatrixCellData> = {};

// Reconstruct the record from the modularized files
for (let i = 1; i <= 9; i++) {
  const introData = PSYCHOMATRIX_INTRO[i];
  PSYCHOMATRIX_CELL_MEANINGS[i] = {
    digit: i,
    cellName: introData.cellName,
    intro: introData.intro,
    generalMeaning: introData.generalMeaning,
    lineContext: introData.lineContext,
    meanings: PSYCHOMATRIX_MAIN_MEANINGS[i],
    difficultyVerbatim: PSYCHOMATRIX_DIFFICULTY[i]
  };
}

export function calculateWorkingNumbers(day: number, month: number, year: number) {
  const allDigits = `${day}${month}${year}`.split('').map(Number);
  const first = allDigits.reduce((a, b) => a + b, 0);
  const second = String(first).split('').map(Number).reduce((a, b) => a + b, 0);
  const firstDigitOfDayActual = Number(String(day)[0]);
  const third = first - 2 * (firstDigitOfDayActual || Number(String(day)[1])); 
  const fourth = Math.abs(third) < 10 ? Math.abs(third) : String(Math.abs(third)).split('').map(Number).reduce((a, b) => a + b, 0);
  return { first, second, third, fourth };
}

export function analyzeZeros(rawBirthDate: string, workingNumbers: number[]) {
  const hasZeroInDate = rawBirthDate.includes('0');
  const firstWorkingStr = workingNumbers[0].toString();
  const secondWorkingStr = workingNumbers[1].toString();
  const thirdWorkingStr = workingNumbers[2].toString();
  const fourthWorkingStr = workingNumbers[3].toString();

  const hasZeroInFirstOrSecond = firstWorkingStr.includes('0') || secondWorkingStr.includes('0');
  const hasZeroInThirdOrFourth = thirdWorkingStr.includes('0') || fourthWorkingStr.includes('0');

  const hasAnyZero = hasZeroInDate || hasZeroInFirstOrSecond || hasZeroInThirdOrFourth;
  const interpretations: string[] = [];

  if (hasAnyZero) {
    interpretations.push(`Meanings of the number 0:
▸ absence;
▸ emptiness (meaning being unfilled);
▸ emptiness as the Great Void, used in Taoist philosophy.
To force an opponent into the Void means to create conditions in which their active actions (attack) will lead them into an unstable state, into uncertainty, a dead end, and the inability to act according to a pre-determined plan.
Other meanings of the number 0:
▸ truth as the primary authority underlying the universe;
▸ death or disappearance;
▸ loss (the emptiness of the lost).`.trim());
  }

  if (hasZeroInDate) {
    interpretations.push(`▸ A zero in the date of birth itself indicates the use of laws in everyday practice (law enforcement officer, prosecutor, police officer, civil engineer, or designer).`.trim());
  }

  if (hasZeroInFirstOrSecond) {
    interpretations.push(`▸ A zero in the first or second additional number may indicate a person's need to discover the law themselves and comprehend the truth.
However, never forget the negative interpretations of zero, when it can indicate an active escape from knowledge and truth, the possible danger of loss, and even death.`.trim());
  }

  if (hasZeroInThirdOrFourth) {
    interpretations.push(`▸ Zero in the third or fourth additional number indicates the presence of laws or truth at the basis of any actions, which may serve as an indication of the choice of a profession related to science or legislative activity (deputy, ruler, supreme court judge).`.trim());
  }

  return { hasAnyZero, interpretations };
}

export function calculatePsychomatrix(day: number, month: number, year: number): PsychomatrixResult {
  const { first, second, third, fourth } = calculateWorkingNumbers(day, month, year);
  const birthDigits = `${day}${month}${year}`.split('').map(Number);
  const workingDigits = [...String(first).split('').map(Number), ...String(second).split('').map(Number), ...String(Math.abs(third)).split('').map(Number), ...String(fourth).split('').map(Number)];
  const allDigits = [...birthDigits, ...workingDigits].filter(d => d !== 0);
  
  const counts: Record<number, number> = {};
  for (const d of allDigits) { if (d >= 1 && d <= 9) counts[d] = (counts[d] || 0) + 1; }
  
  const cell = (n: number) => counts[n] ? String(n).repeat(counts[n]) : null;
  const grid: Array<Array<string | null>> = [[cell(1), cell(4), cell(7)], [cell(2), cell(5), cell(8)], [cell(3), cell(6), cell(9)]];
  
  const lineDigitCounts = {
    row_1: (counts[1] || 0) + (counts[4] || 0) + (counts[7] || 0),
    row_2: (counts[2] || 0) + (counts[5] || 0) + (counts[8] || 0),
    row_3: (counts[3] || 0) + (counts[6] || 0) + (counts[9] || 0),
    col_1: (counts[1] || 0) + (counts[2] || 0) + (counts[3] || 0),
    col_2: (counts[4] || 0) + (counts[5] || 0) + (counts[6] || 0),
    col_3: (counts[7] || 0) + (counts[8] || 0) + (counts[9] || 0),
    diag_spirit: (counts[1] || 0) + (counts[5] || 0) + (counts[9] || 0),
    diag_carnal: (counts[3] || 0) + (counts[5] || 0) + (counts[7] || 0),
  };
  
  const activeLines = Object.entries(lineDigitCounts).filter(([_, total]) => total >= 3).map(([id]) => id);
  
  const cellReadings: CellReading[] = [];
  for (let digit = 1; digit <= 9; digit++) {
    const count = counts[digit] || 0;
    const cellDef = PSYCHOMATRIX_CELL_MEANINGS[digit];
    const meaning = getPsychomatrixCellMeaning(digit, count);
    cellReadings.push({ 
      digit, 
      count, 
      cellName: cellDef.cellName, 
      label: meaning.label, 
      verbatim: meaning.verbatim, 
      scale: meaning.scale, 
      modifiers: [],
      difficultyVerbatim: cellDef.difficultyVerbatim
    });
  }

  const rawBirthDate = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
  const zeroAnalysis = analyzeZeros(rawBirthDate, [first, second, third, fourth]);
  
  return { day, month, year, first, second, third, fourth, allDigits, counts, grid, activeLines, complementaryInsights: [], cellReadings, zeroAnalysis };
}

export function getPsychomatrixCellMeaning(digit: number, count: number): PsychomatrixCellMeaning {
  const cellDef = PSYCHOMATRIX_CELL_MEANINGS[digit];
  if (!cellDef) return { count: 0, label: 'Unknown', verbatim: '', scale: 'absent' };
  const cappedCount = Math.min(count, 6);
  return cellDef.meanings.find(m => m.count === cappedCount) || cellDef.meanings[cellDef.meanings.length - 1];
}

export const SCALE_LABELS: Record<PsychomatrixCellMeaning['scale'], string> = {
  'absent': 'Absent', 'very-weak': 'Awakening', 'norm': 'Balanced', 'special': 'Special Sign', 'strong': 'Strong', 'dominant': 'Dominant', 'overload': 'Overload'
};

export const SCALE_COLORS: Record<PsychomatrixCellMeaning['scale'], string> = {
  'absent': '#6b7280', 'very-weak': '#9ca3af', 'norm': '#c49a28', 'special': '#a78bfa', 'strong': '#34d399', 'dominant': '#f59e0b', 'overload': '#ef4444'
};
