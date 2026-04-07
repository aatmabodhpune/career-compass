interface LikertScaleProps {
    options: (number | string)[];
    selectedValue?: number | string;
    onChange: (value: number | string) => void;
}

export default function LikertScale({ options, selectedValue, onChange }: LikertScaleProps) {
    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex justify-between w-full max-w-[280px] sm:max-w-[360px] text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
            </div>
            <div className="flex justify-center items-center gap-3 sm:gap-6">
                {options.map((option) => {
                    const isSelected = selectedValue === option;
                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => onChange(option)}
                            className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold transition-all duration-200
                            ${isSelected 
                                ? 'bg-teal-600 text-white shadow-md scale-110 ring-4 ring-teal-50 border border-teal-600' 
                                : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200 hover:scale-105'}`}
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
