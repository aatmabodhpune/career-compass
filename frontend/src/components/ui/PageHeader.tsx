import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    rightContent?: React.ReactNode;
    className?: string;
}

export function PageHeader({ 
    title, 
    subtitle, 
    rightContent, 
    className = '' 
}: PageHeaderProps) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 gap-4 ${className}`}>
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-base text-gray-500 font-medium">
                        {subtitle}
                    </p>
                )}
            </div>
            {rightContent && (
                <div className="flex items-center gap-3 shrink-0">
                    {rightContent}
                </div>
            )}
        </div>
    );
}
