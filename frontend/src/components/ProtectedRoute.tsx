import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute() {
    const { student, _hasHydrated } = useAuthStore();

    if (!_hasHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 font-medium">Restoring session...</p>
            </div>
        );
    }

    if (!student) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
