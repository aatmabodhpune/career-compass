import React from 'react';

interface MCQOptionsProps {
    options: (number | string)[];
    selectedValue?: number | string;
    onChange: (value: number | string) => void;
}

export default function MCQOptions({ options, selectedValue, onChange }: MCQOptionsProps) {
    return (
        <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
            {options.map((option) => {
                const isSelected = selectedValue === option;
                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChange(option)}
                        className={`w-full text-left p-4 rounded-lg border font-medium transition-all duration-150 ease-in-out
                        ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-[0.98] ring-2 ring-blue-300' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
                        aria-pressed={isSelected}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    );
}
