'use server';

/**
 * @fileOverview A pitch deck analysis AI agent.
 *
 * - analyzePitchDeck - A function that handles the pitch deck analysis process.
 * - AnalyzePitchDeckInput - The input type for the analyzePitchDeck function.
 * - AnalyzePitchDeckOutput - The return type for the analyzePitchDeck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePitchDeckInputSchema = z.object({
  inputContent: z.string().describe('The content of the pitch deck, either as text, or a data URI for a PDF or audio file.'),
  inputType: z.enum(['pdf', 'email', 'audio']).describe('The format of the input content.'),
  persona: z.enum(['SaaS VC', 'Deep Tech VC', 'Fintech VC', 'Custom']).describe('The investment persona to use for the analysis.'),
  teamStrengthWeight: z.number().min(0).max(100).optional().describe('Weighting for team strength in custom analysis (0-100).'),
  tractionWeight: z.number().min(0).max(100).optional().describe('Weighting for traction in custom analysis (0-100).'),
  financialHealthWeight: z.number().min(0).max(100).optional().describe('Weighting for financial health in custom analysis (0-100).'),
  marketOpportunityWeight: z.number().min(0).max(100).optional().describe('Weighting for market opportunity in custom analysis (0-100).'),
  claimCredibilityWeight: z.number().min(0).max(100).optional().describe('Weighting for claim credibility in custom analysis (0-100).'),
});

export type AnalyzePitchDeckInput = z.infer<typeof AnalyzePitchDeckInputSchema>;

const AnalyzePitchDeckOutputSchema = z.object({
  executiveSummary: z.object({
    summary: z.string().describe('A brief executive summary of the pitch deck.'),
    strengths: z.array(z.string()).describe('A list of strengths identified in the pitch deck.'),
    weaknesses: z.array(z.string()).describe('A list of weaknesses identified in the pitch deck.'),
  }).describe('Executive Summary'),
  riskAssessment: z.object({
    risks: z.array(z.object({
      title: z.string().describe('Title of the risk'),
      description: z.string().describe('A detailed description of the risk.'),
      mitigationStrategy: z.string().describe('A strategy to mitigate the risk.'),
      severity: z.enum(['Low', 'Medium', 'High']).describe('The severity of the risk.'),
    })).describe('A list of identified risks.'),
    riskSummaryChart: z.string().describe('Summary of the risks in a donut chart'),
  }).describe('Risk Assessment'),
  industryAnalysis: z.object({
    industryBenchmarking: z.string().describe('Industry Benchmarking'),
    competitors: z.array(z.string()).describe('A list of competitors.'),
  }).describe('Industry Analysis'),
  financials: z.object({
    keyMetrics: z.array(z.string()).describe('Key Metrics'),
    fundingRequest: z.string().describe('Funding Request'),
    projectionsAnalysis: z.string().describe('Projections Analysis.'),
  }).describe('Financials'),
  founderConnectQA: z.object({
    followUpQuestions: z.array(z.string()).describe('AI-generated follow-up questions for the founder.'),
  }).describe('Founder Connect & Q&A'),
});

export type AnalyzePitchDeckOutput = z.infer<typeof AnalyzePitchDeckOutputSchema>;

export async function analyzePitchDeck(input: AnalyzePitchDeckInput): Promise<AnalyzePitchDeckOutput> {
  return analyzePitchDeckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePitchDeckPrompt',
  input: {schema: AnalyzePitchDeckInputSchema},
  output: {schema: AnalyzePitchDeckOutputSchema},
  prompt: `You are a world-class startup analyst. Analyze the following pitch deck content from the perspective of a {{persona}}.\n\n{{#if (eq persona \"Custom\")}}You MUST tailor your analysis and risk assessment based on the following factor weightings:\nTeam Strength: {{teamStrengthWeight}}%\nTraction: {{tractionWeight}}%\nFinancial Health: {{financialHealthWeight}}%\nMarket Opportunity: {{marketOpportunityWeight}}%\nClaim Credibility: {{claimCredibilityWeight}}%{{/if}}\n\nContent: {{{inputContent}}}\n\nConsider the input type: {{inputType}}\n\nOutput a JSON object that contains all the data needed to populate every tab of the analysis view (Executive Summary, Risks, Financials, etc.).  Include the riskSummaryChart as a textual description of a donut chart.
`,
  config: {
    googleSearch: true,
  },
});

const analyzePitchDeckFlow = ai.defineFlow(
  {
    name: 'analyzePitchDeckFlow',
    inputSchema: AnalyzePitchDeckInputSchema,
    outputSchema: AnalyzePitchDeckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
