import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type {
    AnalysisHistoryItem,
    ChatMessage,
    PitchDeckAnalysis,
    ScoreWeightings,
    User,
} from '../types';
import { ANALYST_PERSONAS, DUMMY_PASSWORD, DUMMY_USER } from '../constants';

interface AppContextValue {
    user: User | null;
    persona: string;
    customPersona: ScoreWeightings | null;
    loadingMessage: string | null;
    error: string | null;
    isAnalyzing: boolean;
    history: AnalysisHistoryItem[];
    currentAnalysis: PitchDeckAnalysis | null;
    chatHistory: ChatMessage[];
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    setPersona: (persona: string) => void;
    setCustomPersona: (weights: ScoreWeightings | null) => void;
    analyzeNewPitchDeck: (fileName: string) => Promise<PitchDeckAnalysis | null>;
    addChatMessage: (message: ChatMessage) => void;
    resetChat: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const createMockAnalysis = (
    fileName: string,
    persona: string,
    customPersona: ScoreWeightings | null,
): PitchDeckAnalysis => {
    const id = crypto.randomUUID();

    return {
        id,
        fileName,
        persona,
        customPersona: customPersona ?? undefined,
        executiveSummary: {
            summary: `High-level assessment of ${fileName} from the perspective of a ${persona} investor.`,
            strengths: [
                'Experienced founding team with complementary skill sets',
                'Clear go-to-market motion with early traction',
            ],
            weaknesses: [
                'Limited runway without new capital',
                'Product differentiation still being validated in market',
            ],
        },
        riskAssessment: {
            risks: [
                {
                    risk: 'Customer concentration risk',
                    severity: 'Medium',
                    mitigation: 'Expand acquisition channels and diversify customer base.',
                },
                {
                    risk: 'Competitive response from incumbents',
                    severity: 'High',
                    mitigation: 'Accelerate roadmap around defensible features and partnerships.',
                },
            ],
        },
        industryAnalysis: {
            benchmarking: 'The company is positioned among the top quartile of seed-stage startups in its sector.',
            competitors: ['Incumbent Corp', 'FastGrow Labs', 'StealthCo'],
        },
        financialAnalysis: {
            keyMetrics: [
                { name: 'ARR', value: '$1.2M' },
                { name: 'YoY Growth', value: '130%' },
                { name: 'Gross Margin', value: '68%' },
            ],
            fundingRequest: '$3M seed round to extend runway to 24 months.',
            projections: 'Targeting $4M ARR in 18 months with expansion into EU and APAC.',
        },
        followUpQuestions: {
            questions: [
                'What is the plan to reduce sales cycle length over the next two quarters?',
                'How will the team prioritize hiring across product and go-to-market?',
                'What milestones unlock the next round of capital?',
            ],
            founderEmail: 'founder@example.com',
        },
        founderResponses: undefined,
    };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [persona, setPersona] = useState<string>(ANALYST_PERSONAS[0]);
    const [customPersona, setCustomPersona] = useState<ScoreWeightings | null>(null);
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
    const [currentAnalysis, setCurrentAnalysis] = useState<PitchDeckAnalysis | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

    const login = useCallback(async (email: string, password: string) => {
        setError(null);
        if (email === DUMMY_USER.email && password === DUMMY_PASSWORD) {
            setUser(DUMMY_USER);
            return;
        }

        await new Promise((resolve) => setTimeout(resolve, 300));
        setError('Invalid credentials. Use the demo account to continue.');
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setCurrentAnalysis(null);
        setChatHistory([]);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const analyzeNewPitchDeck = useCallback(
        async (fileName: string) => {
            if (!user) {
                setError('Please log in to analyze a pitch deck.');
                return null;
            }

            setIsAnalyzing(true);
            setLoadingMessage('Analyzing pitch deck…');
            setError(null);

            try {
                await new Promise((resolve) => setTimeout(resolve, 800));
                const analysis = createMockAnalysis(fileName, persona, customPersona);
                const historyItem: AnalysisHistoryItem = {
                    id: analysis.id,
                    fileName: analysis.fileName,
                    date: new Date().toISOString(),
                };

                setCurrentAnalysis(analysis);
                setHistory((prev) => [historyItem, ...prev]);
                setChatHistory((prev) => [
                    ...prev,
                    {
                        sender: 'model',
                        text: `Analysis for ${analysis.fileName} is ready. Ask any follow-up questions!`,
                    },
                ]);
                return analysis;
            } catch (err) {
                console.error(err);
                setError('Something went wrong while analyzing the pitch deck. Please try again.');
                return null;
            } finally {
                setIsAnalyzing(false);
                setLoadingMessage(null);
            }
        },
        [user, persona, customPersona],
    );

    const addChatMessage = useCallback((message: ChatMessage) => {
        setChatHistory((prev) => [...prev, message]);
    }, []);

    const resetChat = useCallback(() => {
        setChatHistory([]);
    }, []);

    const value = useMemo<AppContextValue>(
        () => ({
            user,
            persona,
            customPersona,
            loadingMessage,
            error,
            isAnalyzing,
            history,
            currentAnalysis,
            chatHistory,
            login,
            logout,
            clearError,
            setPersona,
            setCustomPersona,
            analyzeNewPitchDeck,
            addChatMessage,
            resetChat,
        }),
        [
            user,
            persona,
            customPersona,
            loadingMessage,
            error,
            isAnalyzing,
            history,
            currentAnalysis,
            chatHistory,
            login,
            logout,
            clearError,
            setPersona,
            setCustomPersona,
            analyzeNewPitchDeck,
            addChatMessage,
            resetChat,
        ],
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextValue => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export default AppContext;
