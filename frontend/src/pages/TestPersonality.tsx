import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '../store/assessmentStore';
import { questions } from '../data/questions';
import QuestionCard from '../components/QuestionCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { TestIntro } from '../components/test/TestIntro';
import { PageHeader } from '../components/ui/PageHeader';

export default function TestPersonality() {
    const navigate = useNavigate();
    const { submitTestSection } = useAssessmentStore();
    const [submitting, setSubmitting] = useState(false);
    const [started, setStarted] = useState(false);
    
    const testQuestions = questions.filter(q => q.id.startsWith('p'));
    const [currentIndex, setCurrentIndex] = useState(0);
    const question = testQuestions[currentIndex];

    if (!started) {
        return (
            <TestIntro 
                title="Personality Assessment"
                description="Discover your unique traits and behavioral patterns. This helps us understand how you work and interact with others."
                duration="2-3 mins"
                totalQuestions={testQuestions.length}
                onStart={() => setStarted(true)}
            />
        );
    }

    const handleNext = async () => {
        if (submitting) return;
        if (currentIndex < testQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setSubmitting(true);
            try {
                await submitTestSection('personality');
                navigate("/dashboard");
            } catch (error) {
                setSubmitting(false);
            }
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            navigate("/dashboard");
        }
    };

    if (!question) return null;

    return (
        <Container>
            <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 py-8 animate-in fade-in duration-500">
                <PageHeader 
                    title="Personality Assessment"
                    subtitle={`Question ${currentIndex + 1} of ${testQuestions.length}`}
                />

                <div className="w-full mb-2">
                    <ProgressBar value={((currentIndex + 1) / testQuestions.length) * 100} showLabel />
                </div>
                
                <div className="mt-2">
                    <QuestionCard
                        question={question}
                        onAnswer={handleNext}
                    />
                </div>

                <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                    <Button size="lg" variant="outline" onClick={handlePrevious} disabled={submitting}>
                        Previous
                    </Button>
                    <Button size="lg" onClick={handleNext} disabled={submitting}>
                        {submitting ? 'Saving...' : currentIndex === testQuestions.length - 1 ? 'Finish Section' : 'Next Question'}
                    </Button>
                </div>
            </div>
        </Container>
    );
}
