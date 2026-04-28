interface MCQOptionsProps {
    options: (string | number | { id: string; image_url?: string })[];
    selectedValue?: number | string;
    onChange: (value: number | string) => void;
}

const isValidImage = (src?: string) =>
    typeof src === "string" && src.trim() !== "" && src.startsWith("http");

export default function MCQOptions({ options, selectedValue, onChange }: MCQOptionsProps) {
    const handleSelect = (value: number | string) => {
        onChange(value);
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {options?.map((opt, index) => {
                if (!opt) return null;

                const isString = typeof opt === "string" || typeof opt === "number";
                const optKey = isString ? String(opt) : (opt as any).id || `opt-${index}`;
                const isSelected = selectedValue === optKey;

                // Case 1: Simple text option
                if (isString) {
                    return (
                        <button
                            key={optKey}
                            type="button"
                            onClick={() => handleSelect(opt)}
                            className={`w-full text-left p-5 rounded-xl border-2 font-medium transition-all duration-200 shadow-sm hover:shadow
                            ${isSelected 
                                ? 'border-teal-600 bg-teal-50/80 text-teal-900 scale-[1.01]' 
                                : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300 hover:bg-gray-50'}`}
                            aria-pressed={isSelected}
                        >
                            {opt}
                        </button>
                    );
                }

                // Case 2: Object with image_url
                const src = (opt as any).image_url;
                if (isValidImage(src)) {
                    return (
                        <button
                            key={optKey}
                            type="button"
                            onClick={() => handleSelect((opt as any).id)}
                            className={`overflow-hidden rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow
                            ${isSelected 
                                ? 'border-teal-600 scale-[1.01] ring-2 ring-teal-500/20' 
                                : 'border-gray-200 bg-white hover:border-teal-300'}`}
                            aria-pressed={isSelected}
                        >
                            <img 
                                src={src} 
                                loading="lazy"
                                decoding="async"
                                className="max-w-[150px] max-h-[150px] object-contain mx-auto" 
                            />
                        </button>
                    );
                }

                // Fallback for invalid image objects: render the ID as text
                return (
                    <button
                        key={optKey}
                        type="button"
                        onClick={() => handleSelect((opt as any).id)}
                        className={`w-full text-left p-5 rounded-xl border-2 font-medium transition-all duration-200 shadow-sm hover:shadow
                        ${isSelected 
                            ? 'border-teal-600 bg-teal-50/80 text-teal-900 scale-[1.01]' 
                            : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300 hover:bg-gray-50'}`}
                        aria-pressed={isSelected}
                    >
                        {(opt as any).id}
                    </button>
                );
            })}
        </div>
    );
}
