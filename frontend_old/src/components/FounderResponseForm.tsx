import React, { useState } from 'react';
// FIX: Corrected import path
import { FounderResponse } from '../types';

interface Props {
    questions: string[];
    onSubmit: (responses: FounderResponse[]) => void;
    onClose: () => void;
}

const FounderResponseForm: React.FC<Props> = ({ questions, onSubmit, onClose }) => {
    const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const responses: FounderResponse[] = questions.map((question, index) => ({
            question,
            answer: answers[index],
        })).filter(r => r.answer.trim() !== ''); // Only submit non-empty answers
        onSubmit(responses);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-800">Input Founder's Answers</h2>
                    <p className="text-sm text-stone-500 mt-1">Provide the answers to update the AI's context.</p>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
                    {questions.map((q, index) => (
                        <div key={index}>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                               {index + 1}. {q}
                            </label>
                            <textarea
                                value={answers[index]}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                rows={3}
                                className="w-full bg-zinc-100 text-stone-900 rounded-md px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-500 placeholder-stone-500"
                                placeholder="Enter the founder's answer here..."
                            />
                        </div>
                    ))}
                </form>
                <div className="p-6 bg-zinc-50 border-t border-stone-200 flex justify-end items-center space-x-4">
                     <button onClick={onClose} type="button" className="py-2 px-4 font-semibold text-stone-700 bg-white border border-stone-300 rounded-md hover:bg-zinc-100 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} type="submit" className="py-2 px-4 font-semibold text-white bg-stone-700 rounded-md hover:bg-stone-800 transition-colors">
                        Submit Answers
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FounderResponseForm;
