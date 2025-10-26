import React, { useState, useEffect } from 'react';
// FIX: Corrected import paths
import { useAppContext } from '../../context/AppContext';
import FounderResponseForm from '../FounderResponseForm';
import { FounderResponse } from '../../types';

interface Props {
    questions: string[];
    email: string;
}

const ConnectTab: React.FC<Props> = ({ questions, email }) => {
    const { currentAnalysis, updateAnalysisWithFounderResponses } = useAppContext();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [founderEmail, setFounderEmail] = useState(email);

    useEffect(() => {
        setFounderEmail(email);
    }, [email]);

    const handleSubmitResponses = (responses: FounderResponse[]) => {
        updateAnalysisWithFounderResponses(responses);
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-2xl font-semibold text-stone-800 mb-3">AI-Generated Follow-up Questions</h3>
                    <p className="text-stone-600 mb-4 text-sm">
                        These are critical questions the AI recommends asking the founders to clarify key aspects of their business.
                    </p>
                    <ul className="space-y-3">
                        {questions.map((q, index) => (
                            <li key={index} className="flex items-start">
                                <svg className="flex-shrink-0 h-6 w-6 text-stone-600 mt-1 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-stone-700">{q}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-2xl font-semibold text-stone-800 mb-3">Founder Contact</h3>
                    <div className="bg-zinc-50 border border-stone-200 p-4 rounded-lg">
                        <label htmlFor="founder-email" className="block text-sm text-stone-600 mb-1">
                            Primary contact email:
                        </label>
                        <input
                            id="founder-email"
                            type="email"
                            value={founderEmail}
                            onChange={(e) => setFounderEmail(e.target.value)}
                            placeholder="Enter email address..."
                            className="w-full bg-white text-stone-700 font-mono text-lg rounded-md px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-500 placeholder-stone-500"
                        />
                        {!email && (
                            <p className="text-xs text-stone-500 mt-2">No email was found automatically. You can add one manually.</p>
                        )}
                    </div>

                    <div className="mt-6">
                        <h4 className="font-semibold text-stone-700 mb-2">Have answers from the founder?</h4>
                        <p className="text-stone-600 text-sm mb-3">
                            Integrate the founder's responses to these questions to get an updated analysis and context for the AI chat.
                        </p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="w-full bg-stone-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-stone-800 transition-colors"
                        >
                            Input Founder's Answers
                        </button>
                    </div>
                </div>
            </div>

            {currentAnalysis?.founderResponses && (
                <div className="mt-8 border-t border-stone-200 pt-6">
                    <h3 className="text-2xl font-semibold text-stone-800 mb-4">Founder's Responses</h3>
                     <div className="space-y-4 bg-zinc-50 border border-stone-200 p-4 rounded-lg">
                        {currentAnalysis.founderResponses.map((r, i) => (
                            <div key={i}>
                                <p className="font-semibold text-stone-700">Q: {r.question}</p>
                                <p className="text-stone-600 pl-4 border-l-2 border-stone-500 ml-2 mt-1">A: {r.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isFormOpen && (
                <FounderResponseForm 
                    questions={questions} 
                    onSubmit={handleSubmitResponses} 
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
};

export default ConnectTab;
