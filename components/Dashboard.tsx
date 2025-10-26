import React, { FormEvent, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Dashboard: React.FC = () => {
    const {
        analyzeNewPitchDeck,
        addChatMessage,
        chatHistory,
        currentAnalysis,
        history,
        isAnalyzing,
        persona,
    } = useAppContext();
    const [fileName, setFileName] = useState('Series A Pitch Deck.pdf');
    const [founderNotes, setFounderNotes] = useState('');

    const handleAnalyze = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const analysis = await analyzeNewPitchDeck(fileName.trim() || 'Pitch Deck.pdf');
        if (analysis && founderNotes.trim()) {
            addChatMessage({ sender: 'user', text: `Founder notes: ${founderNotes.trim()}` });
            setFounderNotes('');
        }
    };

    return (
        <div className="mx-auto grid max-w-5xl gap-6 px-4 pb-12 pt-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Start a new analysis</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Provide a pitch deck file name and optional context. The workspace will generate a mock analysis tailored to
                    the <span className="font-medium text-slate-700">{persona}</span> persona.
                </p>
                <form onSubmit={handleAnalyze} className="mt-4 space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                        Pitch deck file
                        <input
                            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={fileName}
                            onChange={(event) => setFileName(event.target.value)}
                            placeholder="Acme_Co_Investor_Update.pdf"
                            required
                        />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                        Founder notes (optional)
                        <textarea
                            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            rows={3}
                            value={founderNotes}
                            onChange={(event) => setFounderNotes(event.target.value)}
                            placeholder="Key updates or questions for the investor analyst..."
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={isAnalyzing}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
                    >
                        {isAnalyzing ? 'Analyzing…' : 'Analyze pitch deck'}
                    </button>
                </form>
            </section>

            {currentAnalysis && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Latest analysis</h2>
                    <p className="mt-1 text-sm text-slate-500">Insights generated for {currentAnalysis.fileName}.</p>

                    <div className="mt-4 space-y-4 text-sm text-slate-700">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900">Executive summary</h3>
                            <p className="mt-1 leading-relaxed">{currentAnalysis.executiveSummary.summary}</p>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                                <div className="rounded-lg bg-emerald-50 p-3">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Strengths</p>
                                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-800">
                                        {currentAnalysis.executiveSummary.strengths.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="rounded-lg bg-rose-50 p-3">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">Weaknesses</p>
                                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-800">
                                        {currentAnalysis.executiveSummary.weaknesses.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900">Risk assessment</h3>
                            <ul className="mt-2 space-y-2">
                                {currentAnalysis.riskAssessment.risks.map((risk) => (
                                    <li key={risk.risk} className="rounded-lg border border-slate-200 p-3">
                                        <p className="font-medium text-slate-900">{risk.risk}</p>
                                        <p className="text-xs uppercase tracking-wide text-slate-500">Severity: {risk.severity}</p>
                                        <p className="mt-1 text-sm text-slate-600">Mitigation: {risk.mitigation}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">Industry snapshot</h3>
                                <p className="mt-1 text-sm text-slate-600">{currentAnalysis.industryAnalysis.benchmarking}</p>
                                <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">Key competitors</p>
                                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                                    {currentAnalysis.industryAnalysis.competitors.map((competitor) => (
                                        <li key={competitor}>{competitor}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">Financial highlights</h3>
                                <ul className="mt-1 space-y-1 text-sm text-slate-700">
                                    {currentAnalysis.financialAnalysis.keyMetrics.map((metric) => (
                                        <li key={metric.name} className="flex justify-between">
                                            <span className="font-medium">{metric.name}</span>
                                            <span>{metric.value}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-2 text-sm text-slate-600">{currentAnalysis.financialAnalysis.fundingRequest}</p>
                                <p className="mt-1 text-sm text-slate-600">{currentAnalysis.financialAnalysis.projections}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900">Follow-up questions</h3>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                                {currentAnalysis.followUpQuestions.questions.map((question) => (
                                    <li key={question}>{question}</li>
                                ))}
                            </ul>
                            <p className="mt-2 text-xs text-slate-500">Founder email: {currentAnalysis.followUpQuestions.founderEmail}</p>
                        </div>
                    </div>
                </section>
            )}

            <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Recent analyses</h2>
                    {history.length === 0 ? (
                        <p className="mt-2 text-sm text-slate-500">No pitch decks analyzed yet.</p>
                    ) : (
                        <ul className="mt-3 space-y-2 text-sm text-slate-700">
                            {history.map((item) => (
                                <li key={item.id} className="rounded-lg border border-slate-200 p-3">
                                    <p className="font-medium text-slate-900">{item.fileName}</p>
                                    <p className="text-xs text-slate-500">{new Date(item.date).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Chat history</h2>
                    {chatHistory.length === 0 ? (
                        <p className="mt-2 text-sm text-slate-500">Ask a question after running an analysis to see the assistant&apos;s responses.</p>
                    ) : (
                        <ul className="mt-3 space-y-2 text-sm text-slate-700">
                            {chatHistory.map((message, index) => (
                                <li key={`${message.sender}-${index}`} className="rounded-lg bg-slate-50 p-3">
                                    <p className="text-xs uppercase tracking-wide text-slate-500">{message.sender}</p>
                                    <p className="mt-1 text-slate-700">{message.text}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
