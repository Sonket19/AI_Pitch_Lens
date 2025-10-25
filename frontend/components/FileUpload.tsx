// FIX: Populated the full content of components/FileUpload.tsx
import React, { useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { ANALYST_PERSONAS } from '../constants';
import { useDropzone } from 'react-dropzone';
import { ScoreWeightings } from '../types';
import CustomizePersonaModal from './CustomizePersonaModal';

const FileUpload: React.FC = () => {
    const { analyzeNewPitchDeck } = useAppContext();
    const [file, setFile] = useState<File | null>(null);
    const [persona, setPersona] = useState(ANALYST_PERSONAS[0]);
    const [customPersona, setCustomPersona] = useState<ScoreWeightings | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            if (selectedFile.type !== 'application/pdf') {
                setError('Only PDF files are accepted.');
                setFile(null);
            } else {
                setError('');
                setFile(selectedFile);
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const handlePersonaSelect = (p: string) => {
        setPersona(p);
        if (p === 'Custom') {
            setIsModalOpen(true);
        } else {
            setCustomPersona(null);
        }
    };
    
    const handleSaveCustomPersona = (weights: ScoreWeightings) => {
        setCustomPersona(weights);
        setIsModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
             setError('Please select a PDF file.');
             return;
        }
        if (persona === 'Custom' && !customPersona) {
            setError('Please configure your custom persona or select a preset.');
            return;
        }
        analyzeNewPitchDeck(file, persona, customPersona || undefined);
    };
    
    const removeFile = () => {
        setFile(null);
    }

    return (
        <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-stone-800 mb-2">Upload Pitch Deck</h2>
            <p className="text-stone-500 mb-8">Select your analysis persona and upload a PDF to begin.</p>
            <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-lg border border-stone-200 space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-stone-700 mb-3 text-left">
                        Analyze as a...
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {ANALYST_PERSONAS.map(p => (
                            <button
                                type="button"
                                key={p}
                                onClick={() => handlePersonaSelect(p)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${persona === p ? 'bg-stone-700 text-white' : 'bg-zinc-100 text-stone-600 hover:bg-zinc-200'}`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => handlePersonaSelect('Custom')}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors flex items-center ${persona === 'Custom' ? 'bg-stone-700 text-white' : 'bg-zinc-100 text-stone-600 hover:bg-zinc-200'}`}
                        >
                            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v2.252a1 1 0 00.342.743l1.158 1.158a1 1 0 001.414 0l1.158-1.158A1 1 0 007 6.252V4zM5 10a1 1 0 00-2 0v2.252a1 1 0 00.342.743l1.158 1.158a1 1 0 001.414 0l1.158-1.158A1 1 0 007 12.252V10zM10 4a1 1 0 00-2 0v2.252a1 1 0 00.342.743l1.158 1.158a1 1 0 001.414 0l1.158-1.158A1 1 0 0012 6.252V4zM10 10a1 1 0 00-2 0v2.252a1 1 0 00.342.743l1.158 1.158a1 1 0 001.414 0l1.158-1.158a1 1 0 00-.707-1.707V10zM15 4a1 1 0 00-2 0v2.252a1 1 0 00.342.743l1.158 1.158a1 1 0 001.414 0l1.158-1.158A1 1 0 0017 6.252V4zM15 10a1 1 0 00-2 0v2.252a1 1 0 00.342.743l1.158 1.158a1 1 0 001.414 0l1.158-1.158a1 1 0 00-.707-1.707V10z" /></svg>
                            Custom...
                        </button>
                    </div>
                </div>
                
                <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-stone-500 bg-zinc-100' : 'border-stone-300 hover:border-stone-400'}`}>
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center text-stone-500">
                         <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        {isDragActive ?
                            <p>Drop the file here...</p> :
                            <p>Drag 'n' drop a PDF here, or click to select</p>
                        }
                    </div>
                </div>

                {file && (
                    <div className="flex items-center justify-between bg-zinc-100 text-stone-700 p-3 rounded-md border border-stone-200">
                        <span className="font-mono text-sm">{file.name}</span>
                        <button onClick={removeFile} type="button" className="text-rose-500 hover:text-rose-700">&times;</button>
                    </div>
                )}
                
                {error && <p className="text-sm text-rose-600">{error}</p>}
                
                <button 
                    type="submit" 
                    className="w-full py-3 px-4 font-semibold text-white bg-stone-700 rounded-md hover:bg-stone-800 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed"
                >
                    Analyze Deck
                </button>
            </form>
            {isModalOpen && (
                <CustomizePersonaModal 
                    initialWeightings={customPersona}
                    onSave={handleSaveCustomPersona}
                    onClose={() => {
                        setIsModalOpen(false);
                        // If user closes without saving, revert to a default persona
                        if (persona === 'Custom' && !customPersona) {
                            setPersona(ANALYST_PERSONAS[0]);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default FileUpload;