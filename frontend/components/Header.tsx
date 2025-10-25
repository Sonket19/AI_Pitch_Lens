import React from 'react';
// FIX: Corrected import path for AppContext
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
    const { user, logout } = useAppContext();

    return (
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-stone-200">
            <div className="container mx-auto flex justify-between items-center p-4">
                <h1 className="text-2xl font-bold text-stone-700">PitchDeck AI</h1>
                {user && (
                    <div className="flex items-center space-x-4">
                        <span className="text-stone-600 hidden sm:block">{user.name}</span>
                        <button
                            onClick={logout}
                            className="bg-stone-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-stone-800 transition-colors text-sm"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
