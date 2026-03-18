import { useAuthStore } from "../store/authStore";

export default function Dashboard() {
    const { student, logout } = useAuthStore();

    if (!student) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome, {student.name}!</h1>

                <div className="space-y-3 mb-8 text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p><span className="font-semibold text-gray-800">Grade:</span> {student.grade}</p>
                    <p><span className="font-semibold text-gray-800">School:</span> {student.school_name || 'School not available'}</p>
                </div>

                <button
                    onClick={logout}
                    className="w-full bg-red-50 text-red-600 border border-red-200 rounded py-2 hover:bg-red-100 transition-colors font-medium"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
