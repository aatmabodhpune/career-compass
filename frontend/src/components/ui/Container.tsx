import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
    return (
        <div className={`min-h-screen bg-gray-50 px-4 py-8`}>
            <div className={`max-w-5xl mx-auto ${className}`}>
                {children}
            </div>
        </div>
    );
}

