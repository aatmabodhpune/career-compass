import React from 'react';

type CardVariant = 'default' | 'soft' | 'bordered';

interface CardProps {
    children: React.ReactNode;
    variant?: CardVariant;
    className?: string;
}

const baseClasses = 'rounded-2xl shadow-sm p-6 transition-all duration-200';

const variantClasses: Record<CardVariant, string> = {
    default: 'bg-white',
    soft: 'bg-gray-50',
    bordered: 'bg-white border border-gray-200 shadow-none',
};

export function Card({ 
    children, 
    variant = 'default', 
    className = '' 
}: CardProps) {
    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {children}
        </div>
    );
}

