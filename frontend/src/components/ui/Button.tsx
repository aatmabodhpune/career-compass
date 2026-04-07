import React from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

const baseClasses =
    'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-full';

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm hover:shadow active:scale-[0.98]',
    outline: 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50 active:scale-[0.98]',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:scale-[0.98]',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
};

export function Button({ 
    variant = 'primary', 
    size = 'md',
    className = '', 
    ...props 
}: ButtonProps) {
    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        />
    );
}

