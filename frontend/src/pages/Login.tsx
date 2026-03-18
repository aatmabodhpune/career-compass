import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { loginWithToken } from "../api/auth";

export default function Login() {
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setStudent = useAuthStore((state) => state.setStudent);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token.trim()) {
            setError("Token is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await loginWithToken(token);

            if (data.error) {
                setError(data.error);
            } else {
                setStudent(data.data);
                navigate("/dashboard", { replace: true });
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to connect. Please check your network.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full">
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Career Compass</h1>
                <p className="text-center text-gray-500 mb-6">Enter your access token</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Enter token"
                            disabled={loading}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Loading..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
}
