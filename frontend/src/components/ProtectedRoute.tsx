import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAssessmentStore } from '../store/assessmentStore';

export default function ProtectedRoute() {
    const session_id = useAuthStore((s) => s.session_id);
    const isHydrated = useAuthStore((s) => s.isHydrated);
    const { status, completedCount } = useAssessmentStore();
    const location = useLocation();

    if (!isHydrated) return null;

    if (!session_id) {
        return <Navigate to="/login" replace />;
    }

    // ✅ CRITICAL FIX: Only block results if not fully completed
    const isAtResults = location.pathname.startsWith('/results');
    if (isAtResults && completedCount !== 3) {
        console.log("BLOCKING RESULTS: progress incomplete", completedCount);
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
