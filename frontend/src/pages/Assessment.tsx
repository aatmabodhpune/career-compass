import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';
import { useAssessmentStore } from '../store/assessmentStore';
import {
    personalityQuestions,
    interestQuestions,
    aptitudeQuestions,
    TOTAL_QUESTIONS
} from '../data/questions';

import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

export default function Assessment() {
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);

    const {
        session_id,
        status,
        section,
        currentQuestionIndex,
        startSession,
        submitAssessment,
        setSection,
        setCurrentQuestionIndex
    } = useAssessmentStore();

    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. On Mount - Fire Session Restore strictly relying on explicit token
    useEffect(() => {
        if (token && !session_id && status !== 'completed') {
            startSession(token);
        }
    }, [token, session_id, status, startSession]);

    // Handle Loading Wait
    if (!session_id && status !== 'completed') {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // 3. Section Logic - Read derived arrays locally ensuring UI maps exclusively
    let currentArray = personalityQuestions;
    if (section === 'interest') currentArray = interestQuestions;
    if (section === 'aptitude') currentArray = aptitudeQuestions;

    const question = currentArray[currentQuestionIndex];

    // 5. Progress Calculate Global Position
    let globalPosition = currentQuestionIndex + 1;
    if (section === 'interest') {
        globalPosition += personalityQuestions.length;
    } else if (section === 'aptitude') {
        globalPosition += personalityQuestions.length + interestQuestions.length;
    }

    // Edge Bounds
    const isFirstQuestion = section === 'personality' && currentQuestionIndex === 0;
    const isLastQuestion = section === 'aptitude' && currentQuestionIndex === aptitudeQuestions.length - 1;
    const isCompleted = status === 'completed';

    // 4. Navigation Handlers
    const handleNext = () => {
        if (section === 'personality') {
            if (currentQuestionIndex < personalityQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setSection('interest');
                setCurrentQuestionIndex(0);
            }
        } else if (section === 'interest') {
            if (currentQuestionIndex < interestQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setSection('aptitude');
                setCurrentQuestionIndex(0);
            }
        } else if (section === 'aptitude') {
            if (currentQuestionIndex < aptitudeQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else {
            if (section === 'aptitude') {
                setSection('interest');
                setCurrentQuestionIndex(interestQuestions.length - 1);
            } else if (section === 'interest') {
                setSection('personality');
                setCurrentQuestionIndex(personalityQuestions.length - 1);
            }
        }
    };

    // 7. Submit Flow
    const handleSubmit = async () => {
        if (!token) return;
        setIsSubmitting(true);
        await submitAssessment(token);
        setIsSubmitting(false);
        navigate('/results');
    };

    return (
        <Container>
            <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
                <div>
                    <ProgressBar current={globalPosition} total={TOTAL_QUESTIONS} />
                </div>

                {question && (
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
                                ← Back
                            </button>
                            <span className="text-xs text-gray-400">
                                Question {globalPosition}
                            </span>
                        </div>
                        <QuestionCard
                            question={question}
                            onAnswer={isLastQuestion ? undefined : handleNext}
                        />
                    </div>
                )}

                <div className="flex flex-wrap justify-between gap-4 mt-4">
                    <Button
                        type="button"
                        variant="secondary"
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
            {/* Confirmation Modal */}
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
                                variant="secondary"
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
