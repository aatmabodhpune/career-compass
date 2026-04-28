import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';
import { useAssessmentStore } from '../store/assessmentStore';
import { fetchQuestions } from '../services/questionService';

import QuestionCard from '../components/QuestionCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { TestIntro } from '../components/test/TestIntro';

type AssessmentSection = 'personality' | 'interest' | 'aptitude';

export default function Assessment() {
    const navigate = useNavigate();
    const location = useLocation();
    const session_id = useAuthStore((s) => s.session_id);

    const status = useAssessmentStore((s) => s.status);
    const section = useAssessmentStore((s) => s.section);
    const responses = useAssessmentStore((s) => s.responses);
    const currentQuestionIndex = useAssessmentStore((s) => s.currentQuestionIndex);
    const submitAssessment = useAssessmentStore((s) => s.submitAssessment);
    const setSection = useAssessmentStore((s) => s.setSection);
    const setCurrentQuestionIndex = useAssessmentStore((s) => s.setCurrentQuestionIndex);
    const setQuestions = useAssessmentStore((s) => s.setQuestions);
    const questions = useAssessmentStore((s) => s.questions);
    const incrementCompleted = useAssessmentStore((s) => s.incrementCompleted);
    const routeState = location.state as { showIntro?: boolean; section?: AssessmentSection } | null;
    const requestedSection = routeState?.section;
    const activeSection = requestedSection ?? section;
    const hasExistingResponses = Object.keys(responses?.[activeSection] || {}).length > 0;

    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showIntro, setShowIntro] = useState<boolean>(() => {
        if (typeof routeState?.showIntro === 'boolean') {
            return routeState.showIntro;
        }

        return !hasExistingResponses;
    });

    useEffect(() => {
        if (!session_id && status !== 'completed') {
            navigate('/login');
        }
    }, [session_id, status, navigate]);

    useEffect(() => {
        if (requestedSection && requestedSection !== section) {
            setSection(requestedSection);
        }
    }, [requestedSection, section, setSection]);

    useEffect(() => {
        if (questions.length > 0) return;

        const load = async () => {
            const data = await fetchQuestions();
            setQuestions(data || []);
        };

        load();
    }, [questions, setQuestions]);

    const safeQuestions = Array.isArray(questions) ? questions : [];

    const filtered = useMemo(() => {
        return safeQuestions.filter((q: any) => q.type === activeSection);
    }, [safeQuestions, activeSection]);

    const safeIndex = Math.max(0, Math.min(currentQuestionIndex, Math.max(filtered.length - 1, 0)));
    const currentQuestion = filtered[safeIndex];

    useEffect(() => {
        const nextQuestion = filtered[currentQuestionIndex + 1];
        if (nextQuestion?.image_url) {
            const img = new Image();
            img.src = nextQuestion.image_url;
        }
    }, [currentQuestionIndex, filtered]);

    if (requestedSection && requestedSection !== section) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-teal-600 font-medium animate-pulse text-lg">Preparing test...</div>
            </div>
        );
    }

    if (!safeQuestions.length) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-teal-600 font-medium animate-pulse text-lg">Loading questions...</div>
            </div>
        );
    }

    if (!filtered.length) {
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <div className="text-gray-500 font-medium">No questions</div>
            </div>
        );
    }

    const progress = ((currentQuestionIndex + 1) / (filtered.length || 1)) * 100;
    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = activeSection === 'aptitude' && currentQuestionIndex === filtered.length - 1;
    const isCompleted = status === 'completed';

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            incrementCompleted();

            if (activeSection === 'aptitude') {
                const { session_id: activeSessionId } = useAuthStore.getState();
                if (!activeSessionId) {
                    throw new Error('SESSION_ID MISSING AT CALL SITE');
                }

                await submitAssessment(activeSessionId);
                useAssessmentStore.getState().setStatus('completed');
            }

            navigate('/dashboard');
        } catch (err) {
            console.error('Submit failed:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        setCurrentQuestionIndex((prev) => {
            const isLast = prev >= filtered.length - 1;

            if (isLast) {
                handleSubmit();
                return prev;
            }

            return prev + 1;
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        navigate('/dashboard');
    };

    const handleStart = () => {
        setShowIntro(false);
    };

    const descriptions: Record<string, string> = {
        personality: 'Understand your behavioral traits',
        interest: 'Identify what you enjoy doing',
        aptitude: 'Evaluate your problem-solving ability',
    };

    const titles: Record<string, string> = {
        personality: 'Personality',
        interest: 'Interest',
        aptitude: 'Aptitude',
    };

    if (showIntro) {
        return (
            <TestIntro
                title={titles[activeSection] || activeSection}
                description={descriptions[activeSection] || 'Assessment'}
                totalQuestions={filtered.length}
                onStart={handleStart}
            />
        );
    }

    return (
        <Container>
            <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
                <div>
                    <ProgressBar value={progress} showLabel />
                </div>

                {currentQuestion && (
                    <div
                        className={`transition-opacity duration-300 ${isCompleted || isSubmitting || showSubmitModal ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={isFirstQuestion || isCompleted || isSubmitting || showSubmitModal}
                                className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-colors"
                            >
                                Back
                            </button>
                            <span className="text-xs text-gray-400">
                                Question {currentQuestionIndex + 1} of {filtered.length}
                            </span>
                        </div>
                        <QuestionCard
                            question={currentQuestion}
                            onAnswer={handleNext}
                        />
                    </div>
                )}

                <div className="flex flex-wrap justify-between gap-4 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={isFirstQuestion || isCompleted || isSubmitting || showSubmitModal}
                    >
                        Previous
                    </Button>

                    {isLastQuestion ? (
                        <Button
                            type="button"
                            onClick={() => setShowSubmitModal(true)}
                            disabled={isCompleted || isSubmitting || showSubmitModal}
                        >
                            Review &amp; Submit
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={isCompleted || isSubmitting || showSubmitModal}
                        >
                            Next
                        </Button>
                    )}
                </div>
            </div>

            {showSubmitModal && !isCompleted && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100 transform transition-all">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Assessment?</h3>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            You are about to submit your full assessment. Please ensure your responses are final as they cannot be amended after submission.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                onClick={() => setShowSubmitModal(false)}
                                variant="outline"
                                disabled={isSubmitting}
                            >
                                Go Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full mr-2" />
                                        Submitting...
                                    </>
                                ) : 'Confirm Submission'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
}
