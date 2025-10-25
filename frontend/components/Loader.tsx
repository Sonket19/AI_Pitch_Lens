import React from 'react';

interface Props {
    message: string;
}

const Loader: React.FC<Props> = ({ message }) => {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-t-stone-500 border-r-stone-500 border-b-stone-500 border-l-zinc-200 rounded-full animate-spin"></div>
            <p className="text-stone-600 mt-4 text-lg font-semibold">{message}</p>
        </div>
    );
};

export default Loader;