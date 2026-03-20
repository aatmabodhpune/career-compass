import React from 'react';
import type { Question } from '../data/questions';
import LikertScale from './LikertScale';
import MCQOptions from './MCQOptions';
import { useAssessmentStore } from '../store/assessmentStore';
import { Card } from './ui/Card';

interface QuestionCardProps {
    question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
    const responses = useAssessmentStore((state) => state.responses);
    const updateResponse = useAssessmentStore((state) => state.updateResponse);

    const selectedValue = responses[question.id];

    const handleChange = (value: number | string) => {
        updateResponse(question.id, value);
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <div className="mb-6 text-center flex flex-col items-center gap-4">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold tracking-widest rounded-md uppercase">
                    {question.section}
                </span>
                <h2 className="text-2xl font-bold text-gray-900">
                    {question.question}
                </h2>
                {question.image && (
                    <div className="w-full max-w-sm h-40 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
                        <span className="text-sm text-gray-500">
                            [Visual: {question.image}]
                        </span>
                    </div>
                )}
            </div>
            <div className="mt-6">
                {question.type === 'likert' ? (
                    <LikertScale
                        options={question.options}
                        selectedValue={selectedValue}
                        onChange={handleChange}
                    />
                ) : (
                    <MCQOptions
                        options={question.options}
                        selectedValue={selectedValue}
                        onChange={handleChange}
                    />
                )}
            </div>
        </Card>
    );
}
