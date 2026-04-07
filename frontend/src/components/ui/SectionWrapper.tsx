import React from 'react';

interface SectionWrapperProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    className?: string;
}

export function SectionWrapper({ 
    children, 
    title, 
    description, 
    className = '' 
}: SectionWrapperProps) {
    return (
        <section className={`space-y-6 py-6 ${className}`}>
            {(title || description) && (
                <div className="space-y-1 pb-2 border-b border-gray-100">
                    {title && (
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                            {title}
                        </h2>
                    )}
                    {description && (
                        <p className="text-sm text-gray-500 font-medium">
                            {description}
                        </p>
                    )}
                </div>
            )}
            <div className="w-full">
                {children}
            </div>
        </section>
    );
}
