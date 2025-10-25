import React from 'react';
// FIX: Corrected import path for AppContext
import { AppProvider, useAppContext } from './context/AppContext';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Loader from './components/Loader';

const AppContent: React.FC = () => {
    const { user, loadingMessage, error, clearError } = useAppContext();

    return (
        <div className="bg-zinc-50 text-stone-800 min-h-screen font-sans">
            {user && <Header />}
            <main className="container mx-auto p-4 md:p-8">
                {loadingMessage && <Loader message={loadingMessage} />}
                {error && (
                    <div className="bg-rose-100 border border-rose-300 text-rose-800 px-4 py-3 rounded-md relative mb-6" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={clearError}>
                            <svg className="fill-current h-6 w-6 text-rose-600" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                        </span>
                    </div>
                )}
                {user ? <Dashboard /> : <LoginPage />}
            </main>
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
