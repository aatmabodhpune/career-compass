import LikertScale from './LikertScale';
import MCQOptions from './MCQOptions';
import { useAssessmentStore } from '../store/assessmentStore';
import { Card } from './ui/Card';

type Question = {
    id: string;
    type: "personality" | "interest" | "aptitude";
    question: string;
    options?: (string | number | { id: string; image_url?: string })[];
    image_url?: string;
    correct_answer?: string;
    section?: string;
    image?: string;
};


interface QuestionCardProps {
    question: Question;
    onAnswer?: () => void;
}

const isValidImage = (src?: string) =>
    typeof src === "string" && src.trim() !== "" && src.startsWith("http");

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
    if (!question) return null;

    const responses = useAssessmentStore((state) => state.responses);
    const updateResponse = useAssessmentStore((state) => state.updateResponse);

    const selectedValue = responses[question.type]?.[question.id];

    const handleChange = (value: number | string) => {
        updateResponse(question.id, value);
        if (onAnswer) {
            onAnswer();
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto p-8 md:p-10 shadow-sm space-y-8">
            <div className="text-center space-y-4">
                <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold tracking-widest rounded-full uppercase border border-teal-100/50">
                    {question.section}
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                    {question.question || (question as any).text}
                </h2>
                {isValidImage(question.image_url) && (
                    <img
                        src={question.image_url}
                        loading="lazy"
                        decoding="async"
                        className="max-w-[200px] max-h-[200px] object-contain mx-auto mb-4 rounded-xl shadow-sm"
                    />
                )}
                {question.image && !question.image_url && (
                    <div className="w-full max-w-sm mx-auto h-48 bg-gray-50/50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200 p-6 text-center mt-6">
                        <span className="text-sm font-medium text-gray-400 italic">
                            [Visual Reference: {question.image}]
                        </span>
                    </div>
                )}
            </div>
            <div className="pt-4 flex justify-center w-full">
                {question.type === "personality" || question.type === "interest" ? (
                    <LikertScale
                        selectedValue={selectedValue}
                        onChange={handleChange}
                    />
                ) : question.type === "aptitude" ? (
                    <MCQOptions
                        options={question.options || []}
                        selectedValue={selectedValue}
                        onChange={handleChange}
                    />
                ) : null}
            </div>
        </Card>
    );
}
