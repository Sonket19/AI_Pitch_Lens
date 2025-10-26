import React, { useState, useEffect, useRef } from 'react';
// FIX: Corrected import path
import { PitchDeckAnalysis } from '../types';
import { GoogleGenAI } from '@google/genai';

interface Props {
    analysis: PitchDeckAnalysis;
    onClose: () => void;
}

const InvestmentMemoModal: React.FC<Props> = ({ analysis, onClose }) => {
    const [memo, setMemo] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    // Close modal on escape key press or outside click
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    useEffect(() => {
        const generateMemo = async () => {
            setIsLoading(true);
            setError('');
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                
                const prompt = `Based on the following pitch deck analysis, which was conducted from the perspective of a ${analysis.persona}, write a formal investment memo. The memo should be well-structured, clear, and concise. It should include sections for: 1. Executive Summary, 2. Problem & Solution, 3. Market Opportunity, 4. Team, 5. Financials, 6. Risks, and 7. Recommendation. Format the output in Markdown.

                Analysis Data:
                ${JSON.stringify(analysis, null, 2)}
                `;

                // FIX: Updated to correctly handle streaming response chunks
                const responseStream = await ai.models.generateContentStream({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });

                let fullResponse = '';
                for await (const chunk of responseStream) {
                    fullResponse += chunk.text;
                    setMemo(fullResponse);
                }
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
                setError(`Failed to generate memo: ${errorMessage}`);
            } finally {
                setIsLoading(false);
            }
        };

        generateMemo();
    }, [analysis]);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(memo);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-5 border-b border-stone-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-stone-800">Investment Memo</h2>
                    <button onClick={onClose} className="text-stone-500 hover:text-stone-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 prose prose-stone max-w-none">
                    {isLoading && <p className="animate-pulse">Generating memo...</p>}
                    {error && <p className="text-rose-600">{error}</p>}
                    {!isLoading && !error && (
                        <pre className="whitespace-pre-wrap font-sans text-stone-700 bg-transparent p-0 m-0">{memo}</pre>
                    )}
                </div>
                <div className="p-4 bg-zinc-50 border-t border-stone-200 flex justify-between items-center">
                     <button onClick={handleCopy} className="py-2 px-4 font-semibold text-white bg-stone-700 rounded-md hover:bg-stone-800 transition-colors disabled:bg-stone-400" disabled={isLoading || !!error}>
                        {isCopied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                    <button onClick={onClose} className="py-2 px-4 font-semibold text-stone-700 bg-white border border-stone-300 rounded-md hover:bg-zinc-100 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvestmentMemoModal;
