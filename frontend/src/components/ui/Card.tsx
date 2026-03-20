import React from 'react';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'centered';
    className?: string;
}

export function Card({ children, variant = 'default', className = '' }: CardProps) {
    const base =
        'bg-white rounded-xl shadow-md p-6';

    const variants: Record<string, string> = {
        default: '',
        centered: 'max-w-md mx-auto text-center',
    };

    return (
        <div className={`${base} ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
}

