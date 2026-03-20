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
                        className={`w-full p-3 rounded-lg border text-left text-base font-medium transition-colors
                        ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                        aria-pressed={isSelected}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    );
}
