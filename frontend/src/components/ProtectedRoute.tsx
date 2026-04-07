import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAssessmentStore } from '../store/assessmentStore';

export default function ProtectedRoute() {
    const { _hasHydrated } = useAuthStore();
    const { session_id, status } = useAssessmentStore();
    const location = useLocation();

    if (!_hasHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // 🧩 FIX: session_id is the single source of truth for access
    if (!session_id) {
        return <Navigate to="/login" replace />;
    }

    // Group 5: Session Guard for assessment-specific routes
    const restrictedPaths = ['/dashboard', '/test/', '/profile', '/results'];
    const isRestricted = restrictedPaths.some(path => location.pathname.startsWith(path));

    if (isRestricted && !session_id && status !== 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-500 font-medium tracking-tight">Redirecting...</div>
                <Navigate to="/" replace />
            </div>
        );
    }

    return <Outlet />;
}
