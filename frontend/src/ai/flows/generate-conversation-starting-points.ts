'use server';
/**
 * @fileOverview Generates conversation starting points for a founder Q&A session.
 *
 * - generateConversationStartingPoints - A function that generates conversation starting points.
 * - GenerateConversationStartingPointsInput - The input type for the generateConversationStartingPoints function.
 * - GenerateConversationStartingPointsOutput - The return type for the generateConversationStartingPoints function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateConversationStartingPointsInputSchema = z.object({
  pitchDeckAnalysis: z
    .string()
    .describe('The pitch deck analysis as a JSON string.'),
  persona: z.string().describe('The persona used for the analysis.'),
});
export type GenerateConversationStartingPointsInput = z.infer<
  typeof GenerateConversationStartingPointsInputSchema
>;

const GenerateConversationStartingPointsOutputSchema = z.object({
  questions: z.array(z.string()).describe('A list of suggested questions.'),
});
export type GenerateConversationStartingPointsOutput = z.infer<
  typeof GenerateConversationStartingPointsOutputSchema
>;

export async function generateConversationStartingPoints(
  input: GenerateConversationStartingPointsInput
): Promise<GenerateConversationStartingPointsOutput> {
  return generateConversationStartingPointsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConversationStartingPointsPrompt',
  input: {
    schema: GenerateConversationStartingPointsInputSchema,
  },
  output: {
    schema: GenerateConversationStartingPointsOutputSchema,
  },
  prompt: `You are an AI assistant helping an investor prepare for a Q&A session with a startup founder.\nBased on the pitch deck analysis, suggest relevant and insightful conversation starting points.

Analysis: {{{pitchDeckAnalysis}}}
Persona: {{{persona}}}

Format the output as a JSON object with a "questions" field, which is an array of strings.\nEach string should be a question.

Example:
{
  "questions": [
    "What are your key metrics for customer acquisition?",
    "Can you elaborate on your competitive advantages?",
    "What are your plans for scaling the team?"
  ]
}
`,
});

const generateConversationStartingPointsFlow = ai.defineFlow(
  {
    name: 'generateConversationStartingPointsFlow',
    inputSchema: GenerateConversationStartingPointsInputSchema,
    outputSchema: GenerateConversationStartingPointsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
