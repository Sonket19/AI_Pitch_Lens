import React, { ChangeEvent } from 'react';
import { ANALYST_PERSONAS } from '../constants';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
    const { user, persona, setPersona, logout } = useAppContext();

    const handlePersonaChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setPersona(event.target.value);
    };

    if (!user) {
        return null;
    }

    return (
        <header className="bg-white shadow-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
                <div>
                    <p className="text-lg font-semibold text-slate-900">PitchLens AI</p>
                    <p className="text-sm text-slate-500">Investor workspace for evaluating pitch decks</p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="text-sm text-slate-600">
                        Persona
                        <select
                            className="ml-2 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800"
                            value={persona}
                            onChange={handlePersonaChange}
                        >
                            {ANALYST_PERSONAS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className="flex flex-col text-right">
                        <span className="text-sm font-medium text-slate-900">{user.name}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                    <button
                        type="button"
                        onClick={logout}
                        className="rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
