import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAssessmentStore } from '../store/assessmentStore';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Home() {
    const navigate = useNavigate();
    // Safe bounds relying explicitly against standard token mapping
    const { token, logout } = useAuthStore();
    const { session_id, status, startSession, resetAssessment } = useAssessmentStore();
    const hasStarted = useRef(false);

    useEffect(() => {
        if (token && !hasStarted.current && status !== "completed") {
            hasStarted.current = true;
            console.log("startSession triggered ONCE");
            startSession(token);
        }
    }, [token]);

    const handleActionClick = () => {
        if (status === 'completed') {
            navigate('/results');
        } else {
            navigate('/assessment');
        }
    };

    const handleLogout = () => {
        // Clear assessment state when user logs out to avoid leaking sessions
        resetAssessment();
        logout();
        navigate('/login');
    };

    const getButtonText = () => {
        if (status === 'completed') return 'View Results';
        if (status === 'in_progress') return 'Continue Assessment';
        return 'Start Assessment';
    };

    const isCheckingSession = !session_id && status !== 'completed' && status !== 'error' && status !== 'idle';

    return (
        <Container>
            <div className="relative flex flex-col items-center justify-center min-h-[60vh]">
                <div className="absolute top-0 right-0">
                    <Button
                        variant="secondary"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </div>
                <Card variant="centered" className="space-y-6">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Career Compass</h1>
                        <p className="text-gray-600 text-base">
                            Discover your potential through a personality, interest, and aptitude assessment.
                        </p>
                    </div>
                    <Button
                        onClick={handleActionClick}
                        disabled={isCheckingSession || status === 'error'}
                        className="w-full justify-center"
                    >
                        {isCheckingSession ? 'Checking session...' : getButtonText()}
                    </Button>
                    {status === 'error' && (
                        <p className="text-sm text-red-500 text-center">Failed to connect to assessment services.</p>
                    )}
                </Card>
            </div>
        </Container>
    );
}

