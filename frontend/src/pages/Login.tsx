import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { loginWithToken } from "../api/auth";
import { Container } from "../components/ui/Container";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAssessmentStore } from "../store/assessmentStore";

export default function Login() {
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { setStudent, setToken: setStoreToken } = useAuthStore();
    const { startSession, resetSession } = useAssessmentStore();
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
                return;
            }

            if (data.student) {
                setStudent(data.student);
            }

            // Ensure previous assessment session state is fully cleared on new login
            resetSession();
            setStoreToken(token);

            // ✅ FIX: Start session and redirect to demographics immediately
            try {
                await startSession(token);
                navigate("/demographics", { replace: true });
            } catch (err) {
                console.error("Failed to start session:", err);
                // Even on session failure, we navigate to let rehydration/App-level logic try again if appropriate
                navigate("/demographics", { replace: true });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card variant="centered" className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Career Compass</h1>
                        <p className="text-sm text-gray-500">Enter your access token to begin.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        <div className="space-y-1">
                            <label className="text-sm text-gray-500">Access token</label>
                            <input
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Enter token"
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-800"
                            />
                            {error && <p className="text-sm text-red-500">{error}</p>}
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full justify-center"
                        >
                            {loading ? "Loading..." : "Submit"}
                        </Button>
                    </form>
                </Card>
            </div>
        </Container>
    );
}
