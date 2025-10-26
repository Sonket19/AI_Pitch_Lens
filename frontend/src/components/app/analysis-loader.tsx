'use client';

import { useState, useEffect } from 'react';

const loadingMessages = [
  'Converting PDF to images...',
  'Analyzing pages with AI...',
  'Evaluating team strength...',
  'Assessing market opportunities...',
  'Analyzing financial projections...',
  'Identifying potential risks...',
  'Verifying claims with real-time search...',
  'Finalizing analysis...',
];

function ChessPuzzle() {
    return (
        <div className="p-4 bg-slate-200 rounded-lg shadow-inner">
            <h4 className="text-lg font-semibold text-center text-slate-800 mb-2">White to move, Mate in 2</h4>
            <svg width="240" height="240" viewBox="0 0 8 8" className="mx-auto rounded-md overflow-hidden">
                {/* Board */}
                {[...Array(8)].map((_, r) =>
                    [...Array(8)].map((_, c) => (
                        <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill={(r + c) % 2 === 0 ? '#f0d9b5' : '#b58863'} />
                    ))
                )}
                 {/* Pieces - Forsyth-Edwards Notation: 8/8/8/2k5/8/8/5R2/K1R5 w - - 0 1 */}
                <text x="0.15" y="7.8" fontSize="0.8" className="fill-black">♚</text> {/* a1 */}
                <text x="2.15" y="7.8" fontSize="0.8" className="fill-black">♜</text> {/* c1 */}
                <text x="5.15" y="6.8" fontSize="0.8" className="fill-white">♔</text> {/* c5 */}
                <text x="2.15" y="3.8" fontSize="0.8" className="fill-white">♔</text> {/* c5 */}
            </svg>
        </div>
    );
}

export function AnalysisLoader() {
  const [message, setMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setMessage(loadingMessages[index]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-card shadow-2xl">
            <div className="flex items-center gap-4">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-xl font-medium text-foreground">{message}</p>
            </div>
            <div className="mt-4">
                <ChessPuzzle />
            </div>
        </div>
    </div>
  );
}
