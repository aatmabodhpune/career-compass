interface MCQOptionsProps {
    options: (number | string)[];
    selectedValue?: number | string;
    onChange: (value: number | string) => void;
}

export default function MCQOptions({ options, selectedValue, onChange }: MCQOptionsProps) {
    return (
        <div className="flex flex-col gap-4 w-full">
            {options.map((option) => {
                const isSelected = selectedValue === option;
                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChange(option)}
                        className={`w-full text-left p-5 rounded-xl border-2 font-medium transition-all duration-200 shadow-sm hover:shadow
                        ${isSelected 
                            ? 'border-teal-600 bg-teal-50/80 text-teal-900 scale-[1.01]' 
                            : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300 hover:bg-gray-50'}`}
                        aria-pressed={isSelected}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    );
}
