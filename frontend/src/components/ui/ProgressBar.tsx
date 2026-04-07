interface ProgressBarProps {
    value: number; // 0 to 100
    className?: string;
    showLabel?: boolean;
}

export function ProgressBar({ 
    value, 
    className = '', 
    showLabel = false 
}: ProgressBarProps) {
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
        <div className={`w-full space-y-2 ${className}`}>
            {showLabel && (
                <div className="flex justify-between items-center px-1">
                    <span className="text-sm font-semibold text-gray-700">Progress</span>
                    <span className="text-sm font-bold text-teal-600">{clampedValue}%</span>
                </div>
            )}
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div 
                    className="h-full bg-teal-600 transition-all duration-500 ease-out rounded-full shadow-sm"
                    style={{ width: `${clampedValue}%` }}
                />
            </div>
        </div>
    );
}
