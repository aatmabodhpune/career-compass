import React from 'react';

interface LikertScaleProps {
    options: (number | string)[];
    selectedValue?: number | string;
    onChange: (value: number | string) => void;
}

export default function LikertScale({ options, selectedValue, onChange }: LikertScaleProps) {
    return (
        <div className="flex flex-col items-center gap-3">
            <div className="flex justify-between w-full max-w-md text-xs text-gray-500">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
                {options.map((option) => {
                    const isSelected = selectedValue === option;
                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => onChange(option)}
                            className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-medium transition-colors
                            ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                            aria-label={`Select option ${option}`}
                            aria-pressed={isSelected}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
