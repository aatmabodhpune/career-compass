import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    as?: React.ElementType;
    fullWidth?: boolean;
}

export function Container({ 
    children, 
    className = '', 
    as: Component = 'div',
    fullWidth = false 
}: ContainerProps) {
    return (
        <Component 
            className={`
                mx-auto px-4 sm:px-6 lg:px-8
                ${fullWidth ? 'max-w-full' : 'max-w-7xl'}
                ${className}
            `}
        >
            {children}
        </Component>
    );
}
