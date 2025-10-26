'use server';

/**
 * @fileOverview A risk assessment AI agent.
 *
 * - intelligentRiskAssessment - A function that handles the risk assessment process.
 * - IntelligentRiskAssessmentInput - The input type for the intelligentRiskAssessment function.
 * - IntelligentRiskAssessmentOutput - The return type for the intelligentRiskAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentRiskAssessmentInputSchema = z.object({
  pitchDeckText: z
    .string()
    .describe('The text content of the pitch deck to be analyzed.'),
  persona: z.string().describe('The persona of the VC analyzing the deck.'),
});
export type IntelligentRiskAssessmentInput = z.infer<
  typeof IntelligentRiskAssessmentInputSchema
>;

const RiskSchema = z.object({
  title: z.string().describe('The title of the risk.'),
  description: z.string().describe('A detailed description of the risk.'),
  mitigationStrategy: z
    .string()
    .describe('A strategy to mitigate the risk.'),
  severity: z
    .enum(['Low', 'Medium', 'High'])
    .describe('The severity of the risk.'),
});

const IntelligentRiskAssessmentOutputSchema = z.object({
  risks: z.array(RiskSchema).describe('A list of identified risks.'),
});
export type IntelligentRiskAssessmentOutput = z.infer<
  typeof IntelligentRiskAssessmentOutputSchema
>;

export async function intelligentRiskAssessment(
  input: IntelligentRiskAssessmentInput
): Promise<IntelligentRiskAssessmentOutput> {
  return intelligentRiskAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentRiskAssessmentPrompt',
  input: {schema: IntelligentRiskAssessmentInputSchema},
  output: {schema: IntelligentRiskAssessmentOutputSchema},
  prompt: `You are an expert risk assessment analyst specializing in analyzing startup pitch decks from the perspective of a venture capitalist.

You will analyze the pitch deck and identify potential risks, describe them in detail, and suggest mitigation strategies. You will also rate the severity of each risk as Low, Medium, or High.

Analyze the following pitch deck from the perspective of a {{persona}}:

{{pitchDeckText}}`,
});

const intelligentRiskAssessmentFlow = ai.defineFlow(
  {
    name: 'intelligentRiskAssessmentFlow',
    inputSchema: IntelligentRiskAssessmentInputSchema,
    outputSchema: IntelligentRiskAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
