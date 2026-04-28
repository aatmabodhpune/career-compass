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
    const [token, setInputToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { setStudent, setAuth } = useAuthStore();
    const { resetSession } = useAssessmentStore();
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
            console.log("LOGIN RESPONSE:", JSON.stringify(data));

            if (data.error) {
                setError(data.error);
                return;
            }

            const user = data.data;
            if (!user?.session_id || !user.token) {
                console.error("BACKEND RESPONSE:", data);
                throw new Error("AUTH DATA MISSING");
            }

            // Ensure previous assessment session state is fully cleared on new login
            resetSession();

            const inputToken = token.trim();

            setStudent({
                id: user.id,
                name: user.name,
                grade: user.grade,
                school_id: user.school_id,
            });
            setAuth({
                token: inputToken,
                session_id: user.session_id,
                jwt: user.token,
            });
            console.log("SESSION FROM BACKEND:", user.session_id);

            console.log("AUTH SETUP COMPLETE - Token type:", typeof inputToken, "SessionID:", user.session_id);

            if (!user.grade || !user.name) {
                navigate("/demographics", { replace: true });
            } else {
                navigate("/dashboard", { replace: true });
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Login failed";
            setError(message);
            throw err;
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
                        onChange={(e) => setInputToken(e.target.value)}
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
