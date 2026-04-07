import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useAssessmentStore } from "../store/assessmentStore";
import { Container } from "../components/layout/Container";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";

export default function Dashboard() {
    const navigate = useNavigate();
    const { student, logout } = useAuthStore();
    const { personality_done, interest_done, aptitude_done, responses } = useAssessmentStore();
    
    const allTestsDone = personality_done && interest_done && aptitude_done;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const getStatusInfo = (isDone: boolean, section: string) => {
        const inProgress = Object.keys(responses || {}).some(k => k && k.startsWith(section[0].toLowerCase()));

        if (isDone) return { label: 'Completed', color: 'bg-green-100 text-green-800' };
        if (inProgress) return { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' };
        return { label: 'Not Started', color: 'bg-gray-100 text-gray-800' };
    };

    const getBtnText = (isDone: boolean, section: string) => {
        const inProgress = Object.keys(responses || {}).some(k => k && k.startsWith(section[0].toLowerCase()));
        if (isDone) return "Retake";
        return inProgress ? "Continue" : "Start";
    };

    return (
        <Container className="py-8 space-y-8 animate-in fade-in duration-700 max-w-4xl">
            <PageHeader 
                title={`Welcome, ${student?.name || "Student"}!`}
                subtitle={student?.school_name || undefined}
                rightContent={
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => navigate("/profile")}>Profile</Button>
                        <Button variant="outline" onClick={handleLogout}>Logout</Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="flex flex-col h-full justify-between p-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Personality Test</h2>
                        <p className="text-sm text-gray-600 mb-4">Discover your core traits and behaviors.</p>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-6 ${getStatusInfo(personality_done, 'personality').color}`}>
                            {getStatusInfo(personality_done, 'personality').label}
                        </span>
                    </div>
                    <Button onClick={() => navigate("/test/personality")} className="w-full justify-center">
                        {getBtnText(personality_done, 'personality')}
                    </Button>
                </Card>

                <Card className="flex flex-col h-full justify-between p-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Interest Test</h2>
                        <p className="text-sm text-gray-600 mb-4">Identify what careers excite you.</p>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-6 ${getStatusInfo(interest_done, 'interest').color}`}>
                            {getStatusInfo(interest_done, 'interest').label}
                        </span>
                    </div>
                    <Button onClick={() => navigate("/test/interest")} className="w-full justify-center">
                        {getBtnText(interest_done, 'interest')}
                    </Button>
                </Card>

                <Card className="flex flex-col h-full justify-between p-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Aptitude Test</h2>
                        <p className="text-sm text-gray-600 mb-4">Measure your natural abilities.</p>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-6 ${getStatusInfo(aptitude_done, 'aptitude').color}`}>
                            {getStatusInfo(aptitude_done, 'aptitude').label}
                        </span>
                    </div>
                    <Button onClick={() => navigate("/test/aptitude")} className="w-full justify-center">
                        {getBtnText(aptitude_done, 'aptitude')}
                    </Button>
                </Card>
            </div>

            <div className="mt-8 flex justify-center">
                <Button 
                    disabled={!allTestsDone} 
                    onClick={() => navigate("/profile")}
                    className="w-full max-w-md"
                    size="lg"
                >
                    View Profile
                </Button>
            </div>
        </Container>
    );
}
