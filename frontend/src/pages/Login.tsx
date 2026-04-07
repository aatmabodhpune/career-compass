import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { loginWithToken } from "../api/auth";
import { Container } from "../components/layout/Container";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { InputField } from "../components/ui/InputField";
import { PageHeader } from "../components/ui/PageHeader";
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
        <Container className="min-h-screen flex items-center justify-center bg-gray-50/50">
            <Card className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center">
                    <PageHeader 
                        title="Career Compass" 
                        subtitle="Enter your access token to begin your journey."
                        className="text-center sm:items-center sm:justify-center p-0"
                    />
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField
                        label="Access Token"
                        id="token"
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="e.g. COMPASS-XXXX-XXXX"
                        disabled={loading}
                        error={error || undefined}
                        helperText="Your unique identifier provided by your institution."
                    />
                    
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                        size="lg"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Authenticating...
                            </span>
                        ) : "Get Started"}
                    </Button>
                </form>
            </Card>
        </Container>
    );
}
