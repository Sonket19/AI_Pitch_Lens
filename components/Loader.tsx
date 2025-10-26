import React from 'react';

interface LoaderProps {
    message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => (
    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700" role="status">
        <span className="font-medium">Just a moment… </span>
        {message}
    </div>
);

export default Loader;
