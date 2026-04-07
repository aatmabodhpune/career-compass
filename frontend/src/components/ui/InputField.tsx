import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

export function InputField({ 
    label, 
    error, 
    helperText, 
    id, 
    className = '', 
    ...props 
}: InputFieldProps) {
    return (
        <div className="space-y-1.5 w-full">
            <label 
                htmlFor={id} 
                className="block text-sm font-medium text-gray-700 ml-1"
            >
                {label}
            </label>
            <input
                id={id}
                className={`
                    w-full px-5 py-2.5 
                    bg-gray-50 border-2 border-transparent
                    rounded-full text-gray-900 placeholder-gray-400
                    transition-all duration-200
                    focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${error ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10' : ''}
                    ${className}
                `}
                {...props}
            />
            {error ? (
                <p className="text-xs text-red-500 ml-4 font-medium italic">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-gray-500 ml-4">{helperText}</p>
            ) : null}
        </div>
    );
}
