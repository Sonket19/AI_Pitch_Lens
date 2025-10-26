import React, { FormEvent, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { DUMMY_USER } from '../constants';

const LoginPage: React.FC = () => {
    const { login, isAnalyzing } = useAppContext();
    const [email, setEmail] = useState(DUMMY_USER.email);
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        try {
            await login(email.trim(), password);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center gap-6">
            <div className="rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Sign in with the demo credentials to explore the investor workspace.
                </p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                        Email
                        <input
                            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="email"
                            required
                        />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                        Password
                        <input
                            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                            placeholder="password123"
                            required
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={submitting || isAnalyzing}
                        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
                    >
                        {submitting ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
            </div>
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                <p className="font-medium text-slate-800">Demo account</p>
                <p className="mt-1">Email: {DUMMY_USER.email}</p>
                <p>Password: password123</p>
            </div>
        </div>
    );
};

export default LoginPage;
