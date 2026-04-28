import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Container } from '../layout/Container';

interface TestIntroProps {
    title: string;
    description: string;
    totalQuestions?: number;
    onStart: () => void;
}

export function TestIntro({
    title,
    description,
    totalQuestions,
    onStart
}: TestIntroProps) {
    return (
        <Container className="py-12 flex items-center justify-center min-h-[80vh] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="max-w-2xl w-full p-8 md:p-12 shadow-xl border border-gray-100">
                <SectionWrapper className="space-y-8">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 rounded-2xl mb-2 text-teal-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                            {title}
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed font-medium">
                            {description}
                        </p>
                    </div>

                    <div className="py-6 border-y border-gray-50">
                        <div className="text-center space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Questions</p>
                            <p className="text-3xl font-bold text-teal-600">{totalQuestions || 0}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            onClick={onStart}
                            className="w-full justify-center h-14 text-lg font-black tracking-wide"
                            size="lg"
                        >
                            Start Test
                        </Button>
                    </div>
                </SectionWrapper>
            </Card>
        </Container>
    );
}
