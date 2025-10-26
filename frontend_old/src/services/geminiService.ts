// FIX: Populated the full content of services/geminiService.ts
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { ImageData, PitchDeckAnalysis, ScoreWeightings } from '../types';

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        executiveSummary: {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING, description: "A concise executive summary of the business and investment opportunity." },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key strengths of the startup." },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key weaknesses or areas of concern." },
            },
            required: ['summary', 'strengths', 'weaknesses']
        },
        riskAssessment: {
            type: Type.OBJECT,
            properties: {
                risks: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            risk: { type: Type.STRING, description: "A specific identified risk." },
                            severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'], description: "The severity of the risk (Low, Medium, or High)." },
                            mitigation: { type: Type.STRING, description: "A potential strategy to mitigate this risk." },
                        },
                        required: ['risk', 'severity', 'mitigation']
                    }
                }
            },
            required: ['risks']
        },
        industryAnalysis: {
            type: Type.OBJECT,
            properties: {
                benchmarking: { type: Type.STRING, description: "How the company compares to industry benchmarks and trends." },
                competitors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of key competitors." },
            },
            required: ['benchmarking', 'competitors']
        },
        financialAnalysis: {
            type: Type.OBJECT,
            properties: {
                keyMetrics: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "The name of the financial metric (e.g., ARR, CAC, LTV)." },
                            value: { type: Type.STRING, description: "The value of the metric." },
                        },
                        required: ['name', 'value']
                    },
                    description: "Key financial metrics mentioned in the deck."
                },
                fundingRequest: { type: Type.STRING, description: "The amount of funding requested and the stated use of funds." },
                projections: { type: Type.STRING, description: "An analysis of the financial projections provided." },
            },
            required: ['keyMetrics', 'fundingRequest', 'projections']
        },
        followUpQuestions: {
            type: Type.OBJECT,
            properties: {
                questions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-5 critical follow-up questions for the founders." },
                founderEmail: { type: Type.STRING, description: "The contact email address for the founders, if found in the deck. Otherwise, return an empty string." },
            },
            required: ['questions', 'founderEmail']
        }
    },
    required: ['executiveSummary', 'riskAssessment', 'industryAnalysis', 'financialAnalysis', 'followUpQuestions']
};

const getSystemInstruction = (persona: string, customPersona?: ScoreWeightings) => {
    let instruction = `You are a world-class startup analyst. Your task is to meticulously analyze the provided pitch deck slides and produce a structured investment analysis. Adhere strictly to the JSON schema provided. Be critical, insightful, and objective. Identify both the good and the bad. If information for a field is not present in the deck, state that explicitly in the analysis for that field (e.g., "Financial projections were not detailed in the provided slides."). Do not make up data.`;

    if (persona === 'Custom' && customPersona) {
        instruction += `\n\nYou MUST tailor your analysis and risk assessment based on the following factor weightings. These percentages reflect the importance I place on each category:\n`
        instruction += `- Team Strength: ${customPersona.teamStrength}%\n`;
        instruction += `- Traction: ${customPersona.traction}%\n`;
        instruction += `- Financial Health: ${customPersona.financialHealth}%\n`;
        instruction += `- Market Opportunity: ${customPersona.marketOpportunity}%\n`;
        instruction += `- Claim Credibility: ${customPersona.claimCredibility}%\n`;
        instruction += `Your final summary and the severity of identified risks should heavily reflect this custom weighting.`;
    } else {
        instruction += `\nYou are acting with the persona of a ${persona}. Tailor your focus accordingly. For example, a SaaS VC would focus heavily on metrics like ARR and churn, while a Deep Tech VC would focus on IP and technical defensibility.`;
    }
    return instruction;
}

export const analyzePitchDeck = async (
    images: ImageData[],
    persona: string,
    customPersona?: ScoreWeightings,
): Promise<Omit<PitchDeckAnalysis, 'id' | 'fileName' | 'persona' | 'customPersona' | 'founderResponses'>> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const imageParts = images.map(img => ({
        inlineData: {
            mimeType: img.mimeType,
            data: img.data,
        },
    }));

    const contents = [{ parts: [...imageParts] }];

    const systemInstruction = getSystemInstruction(persona, customPersona);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const cleanedJson = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
        const analysisResult = JSON.parse(cleanedJson) as Omit<PitchDeckAnalysis, 'id' | 'fileName' | 'persona' | 'customPersona' | 'founderResponses'>;

        return analysisResult;

    } catch (error) {
        console.error("Error analyzing pitch deck:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during pitch deck analysis.");
    }
};

export const createChatSession = (analysis: PitchDeckAnalysis): Chat => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let personaContext = `I am a ${analysis.persona}.`;
    if (analysis.persona === 'Custom' && analysis.customPersona) {
        personaContext = `I am analyzing this deck with a custom focus, weighted as follows: Team Strength: ${analysis.customPersona.teamStrength}%, Traction: ${analysis.customPersona.traction}%, Financial Health: ${analysis.customPersona.financialHealth}%, Market Opportunity: ${analysis.customPersona.marketOpportunity}%, Claim Credibility: ${analysis.customPersona.claimCredibility}%.`;
    }


    const history = [
        {
            role: "user",
            parts: [{ text: `${personaContext} Here is the analysis of a pitch deck I just reviewed. I'm going to ask you some questions about it. \n\nANALYSIS:\n${JSON.stringify(analysis, null, 2)}` }]
        },
        {
            role: "model",
            parts: [{ text: "Understood. I have reviewed the analysis of the pitch deck. I am ready to answer your questions from the perspective of a helpful AI analyst assistant. How can I help you?" }]
        }
    ];

    if (analysis.founderResponses && analysis.founderResponses.length > 0) {
        history[0].parts[0].text += `\n\nI also have responses from the founder:\n${JSON.stringify(analysis.founderResponses, null, 2)}`;
    }

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
        config: {
            systemInstruction: `You are an expert AI assistant for a startup analyst. Your role is to answer questions based *only* on the provided pitch deck analysis and founder responses. Do not hallucinate or invent information not present in the provided context. Be concise and helpful.`,
        },
    });

    return chat;
}