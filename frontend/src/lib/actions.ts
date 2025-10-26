'use server';

import { analyzePitchDeck, AnalyzePitchDeckInput } from '@/ai/flows/analyze-pitch-deck';
import { getInvestmentAdvice, InvestmentAdviceInput } from '@/ai/flows/ai-chatbot-for-investment-advice';

export async function analyzePitchDeckAction(input: AnalyzePitchDeckInput) {
  try {
    const result = await analyzePitchDeck(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error analyzing pitch deck:', error);
    return { success: false, error: 'Failed to analyze the pitch deck.' };
  }
}

export async function getChatbotResponseAction(input: InvestmentAdviceInput) {
   try {
    const result = await getInvestmentAdvice(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    return { success: false, error: 'Failed to get a response from the AI.' };
  }
}

export async function generateMemoAction(analysis: string, persona: string) {
    const input: InvestmentAdviceInput = {
        analysis,
        persona,
        question: `Based on the provided pitch deck analysis, which was conducted from the perspective of a ${persona}, write a formal investment memo. The memo should be well-structured, clear, and concise. It should include sections for: 1. Executive Summary, 2. Problem &amp; Solution, 3. Market Opportunity, 4. Team, 5. Financials, 6. Risks, and 7. Recommendation. Format the output in Markdown.`,
    };

    try {
        const result = await getInvestmentAdvice(input);
        return { success: true, data: result.advice };
    } catch (error) {
        console.error('Error generating memo:', error);
        return { success: false, error: 'Failed to generate the investment memo.' };
    }
}
