import React, { useState, useEffect, useRef } from 'react';
// FIX: Corrected import path
import { useAppContext } from '../../context/AppContext';

const ChatbotTab: React.FC = () => {
    const { 
        chatSession, 
        chatMessages, 
        isChatLoading, 
        sendChatMessage 
    } = useAppContext();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [chatMessages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        
        sendChatMessage(input);
        setInput('');
    };
    
    if (!chatSession) {
        return (
            <div className="flex items-center justify-center h-full text-stone-500">
                <p>Chat session not available. This can happen for older history items.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[60vh] animate-fade-in">
            <h3 className="text-2xl font-semibold text-stone-800 mb-4">Chat with AI Analyst</h3>
            <div className="flex-grow overflow-y-auto pr-4 space-y-4">
                {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xl px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-stone-700 text-white' : 'bg-zinc-200 text-stone-800'}`}>
                           {msg.text}
                        </div>
                    </div>
                ))}
                 {isChatLoading && chatMessages[chatMessages.length - 1]?.sender === 'user' && (
                    <div className="flex justify-start">
                        <div className="max-w-xl px-4 py-2 rounded-lg bg-zinc-200 text-stone-800">
                           <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about the pitch deck..."
                    className="flex-grow bg-white text-stone-900 rounded-l-md px-4 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-500"
                    disabled={isChatLoading}
                />
                <button type="submit" className="bg-stone-700 text-white font-semibold py-2 px-4 rounded-r-md hover:bg-stone-800 transition-colors disabled:bg-stone-400" disabled={isChatLoading}>
                    {isChatLoading ? '...' : 'Send'}
                </button>
            </form>
        </div>
    );
};

export default ChatbotTab;
