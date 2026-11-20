import { getAstroInsight } from './astrology';
import { generateLoShuData } from './numerology';
import type { AstroInsightInput } from '@/components/profile-generator/types';

export async function getAstroInsightAction(formData: AstroInsightInput) {
  try {
    if (!formData.name || !formData.day || !formData.month || !formData.year || !formData.gender) {
      return { success: false, error: 'Please fill out all fields.' };
    }

    const [insightResult, numerologyResult] = await Promise.all([
      getAstroInsight(formData),
      Promise.resolve(generateLoShuData(formData)),
    ]);

    return { success: true, insight: insightResult, numerology: numerologyResult };
  } catch (error) {
    console.error('Error getting insight:', error);
    return { success: false, error: 'An error occurred. Please try again.' };
  }
}
