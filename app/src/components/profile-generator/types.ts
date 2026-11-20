// src/components/profile-generator/types.ts
// This is the data that the user provides
export interface AstroInsightInput {
  name: string;
  day: number;
  month: number;
  year: number;
  gender: string;
}
export interface ZodiacData {
  introduction?: string;
  elements?: { [key: string]: string };
  compatibilities?: { [key: string]: string };
  futures?: {
    [key: string]: { year: string; element: string; prediction: string };
  };
}
// Data for the combined "New Astrology" signs
export interface AstroInsightOutput {
  name: string;
  western_sign: string;
  western_cusp?: string | null; // neighbouring sign when born within a day of a boundary
  sign: string; // e.g., "Pig"
  element: string; // e.g., "Wood"
  month: number;
  year: number;
  gender: string; // Added gender
  new_astrology_sign: string; // e.g. "Pisces/Snake"
  zodiacData: ZodiacData; // Holds all data for the Chinese sign
  signData: {
    description?: string;
    love?: string;
    compatibilities?: string;
    homeAndFamily?: string;
    profession?: string;
  };
}
// This is the data returned from the numerology calculation
export interface ArrowData {
  id: string;
  name: string;
  description: string;
  numbers: number[];
  category?: string;
  type?: "strength" | "weakness" | "shadow";
}
export interface PersonalYearData {
  year: number;
  pyn: number;
  power: number;
  meaning: string;
  compound?: number;
  compoundName?: string;
  compoundSymbolism?: string;
  compoundEssence?: string;
  compoundKarmic?: string;
  compoundManifestation?: string;
  compoundIsKarmicDebt?: boolean;
  compoundIsMasterNumber?: boolean;
  // ── Classic (pre-reduced-components) system — shown alongside the
  // direct/unreduced one above, not instead of it ──
  pynClassic: number;
  compoundClassic?: number;
  compoundClassicName?: string;
  compoundClassicSymbolism?: string;
  compoundClassicEssence?: string;
  compoundClassicKarmic?: string;
  compoundClassicManifestation?: string;
  compoundClassicIsKarmicDebt?: boolean;
  compoundClassicIsMasterNumber?: boolean;
  // Historical-calibrated dual essence for the Personal Year Wave cards.
  dualEssenceTitle?: string;
  dualEssenceSubtitle?: string;
  dualEssenceSynthesis?: string;
  dualEssenceIntensity?: number;
  dualEssencePolarity?: string;
  predictionFocusAreas?: string[];
  protectiveActions?: string[];
}
export interface NumerologyData {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  psycheNum: number;
  destinyNum: number;
  compoundNum: number | null;
  compoundMeaning: string | null;
  reducedCompoundNum: number | null;
  reducedCompoundMeaning: string | null;
  karmicFateNum: number | null;
  karmicFateMeaning: string | null;
  psychicMeaning: { title: string; description: string };
  specialTraitMeaning: string | null;
  destinyMeaning: { title: string; description: string };
  kuaNum: number;
  kuaAttributes: {
    element: string;
    group?: string;
    trigram?: string;
    lucky_colours?: string[];
    colors?: string;
    season?: string;
    directions: { [key: string]: string };
  };
  loShuGrid: (string | null)[][];
  numberCounts: { [key: string]: number };
  repeatedNumberMeanings: { [key: string]: string };
  arrowsOfStrength: ArrowData[];
  arrowsOfWeakness: ArrowData[];
  personalYears?: PersonalYearData[];
}
export interface FamousPerson {
  name: string;
  day: number;
  month: number;
  year: number;
  gender: "male" | "female" | "other";
  tags: string[];
}