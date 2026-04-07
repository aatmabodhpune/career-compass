import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '../store/assessmentStore';
import { useAuthStore } from '../store/authStore';
import { questions } from '../data/questions';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

export default function TestAptitude() {
    const navigate = useNavigate();
    const { submitTestSection, submitAssessment } = useAssessmentStore();
    const { token } = useAuthStore();
    const [submitting, setSubmitting] = useState(false);
    
    const testQuestions = questions.filter(q => q.id.startsWith('a'));
    const [currentIndex, setCurrentIndex] = useState(0);
    const question = testQuestions[currentIndex];

    const handleNext = async () => {
        if (submitting) return;
        if (currentIndex < testQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setSubmitting(true);
            try {
                await submitTestSection('aptitude');
                if (token) {
                    await submitAssessment(token);
                }
                navigate("/dashboard");
            } catch (error) {
                console.error(error);
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
            <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 py-8">
                <div>
                    <ProgressBar current={currentIndex + 1} total={testQuestions.length} />
                </div>
                
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            ← Back
                        </button>
                        <span className="text-xs text-gray-400">
                            Question {currentIndex + 1}
                        </span>
                    </div>
                    
                    <QuestionCard
                        question={question}
                        onAnswer={handleNext}
                    />
                </div>

                <div className="flex justify-between gap-4 mt-4">
                    <Button variant="secondary" onClick={handlePrevious} disabled={submitting}>
                        Previous
                    </Button>
                    <Button onClick={handleNext} disabled={submitting}>
                        {submitting ? 'Saving...' : currentIndex === testQuestions.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </div>
            </div>
        </Container>
    );
}
