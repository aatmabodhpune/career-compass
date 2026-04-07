import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAssessmentStore } from '../store/assessmentStore';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Home() {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const { session_id, status, resetAssessment } = useAssessmentStore();

    const handleLogout = () => {
        resetAssessment();
        logout();
        navigate('/login');
    };

    const isCheckingSession = !session_id && status !== 'error' && status !== 'idle';

    return (
        <Container>
            <div className="relative flex flex-col items-center justify-center min-h-[60vh]">
                <div className="absolute top-0 right-0">
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </div>
                <Card className="w-full max-w-md space-y-6">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Career Compass</h1>
                        <p className="text-gray-600 text-base">
                            Discover your potential through a personality, interest, and aptitude assessment.
                        </p>
                    </div>
                    {isCheckingSession && (
                        <div className="flex flex-col items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-2"></div>
                            <p className="text-sm text-gray-500">Initializing your session...</p>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="text-center p-4">
                            <p className="text-sm text-red-500 mb-4">Failed to connect to assessment services.</p>
                            <Button onClick={() => window.location.reload()} variant="outline" className="w-full justify-center">Retry</Button>
                        </div>
                    )}
                </Card>
            </div>
        </Container>
    );
}

