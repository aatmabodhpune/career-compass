import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useAssessmentStore } from "../store/assessmentStore";
import { Container } from "../components/layout/Container";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";

type AssessmentSection = 'personality' | 'interest' | 'aptitude';

export default function Dashboard() {
    const navigate = useNavigate();
    const { student, logout } = useAuthStore();
    const { responses, status, setSection, setCurrentQuestionIndex } = useAssessmentStore();
    console.log("RESPONSES STATE:", responses);
    const isCompleted = status === 'completed';
    const isPersonalityComplete = Object.keys(responses?.personality || {}).length > 0;
    const isInterestComplete = Object.keys(responses?.interest || {}).length > 0;
    const isAptitudeComplete = Object.keys(responses?.aptitude || {}).length > 0;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const hasResponsesForSection = (section: AssessmentSection) =>
        Object.keys(responses?.[section] || {}).length > 0;

    const getStatusInfo = (isSectionComplete: boolean, section: AssessmentSection) => {
        if (isCompleted || isSectionComplete) return { label: 'Completed', color: 'bg-green-100 text-green-800' };

        const inProgress = hasResponsesForSection(section);
        if (inProgress) return { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' };
        
        return { label: 'Not Started', color: 'bg-gray-100 text-gray-800' };
    };

    const getBtnText = (section: AssessmentSection) => {
        if (isCompleted) return "View Results";
        
        const inProgress = hasResponsesForSection(section);
        return inProgress ? "Continue" : "Start";
    };

    const handleAction = (section: AssessmentSection) => {
        if (isCompleted) {
            console.log("Navigating to results");
            navigate("/results");
        } else {
            setSection(section);
            setCurrentQuestionIndex(0);
            navigate("/assessment", {
                state: {
                    section,
                    showIntro: !hasResponsesForSection(section)
                }
            });
        }
    };

    const allTestsDone = isPersonalityComplete && isInterestComplete && isAptitudeComplete;

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
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-6 ${getStatusInfo(isPersonalityComplete, 'personality').color}`}>
                            {getStatusInfo(isPersonalityComplete, 'personality').label}
                        </span>
                    </div>
                    {!isPersonalityComplete && (
                        <Button 
                            onClick={() => handleAction('personality')} 
                            className="w-full justify-center"
                        >
                            {getBtnText('personality')}
                        </Button>
                    )}
                </Card>

                <Card className="flex flex-col h-full justify-between p-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Interest Test</h2>
                        <p className="text-sm text-gray-600 mb-4">Identify what careers excite you.</p>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-6 ${getStatusInfo(isInterestComplete, 'interest').color}`}>
                            {getStatusInfo(isInterestComplete, 'interest').label}
                        </span>
                    </div>
                    {!isInterestComplete && (
                        <Button 
                            onClick={() => handleAction('interest')} 
                            className="w-full justify-center"
                        >
                            {getBtnText('interest')}
                        </Button>
                    )}
                </Card>

                <Card className="flex flex-col h-full justify-between p-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Aptitude Test</h2>
                        <p className="text-sm text-gray-600 mb-4">Measure your natural abilities.</p>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-6 ${getStatusInfo(isAptitudeComplete, 'aptitude').color}`}>
                            {getStatusInfo(isAptitudeComplete, 'aptitude').label}
                        </span>
                    </div>
                    {allTestsDone || isCompleted ? (
                        <Button 
                            onClick={() => {
                                console.log("CLICK RESULTS");
                                navigate("/results");
                            }} 
                            className="w-full justify-center"
                        >
                            View Results
                        </Button>
                    ) : (
                        !isAptitudeComplete && (
                            <Button 
                                onClick={() => handleAction('aptitude')} 
                                className="w-full justify-center"
                            >
                                {getBtnText('aptitude')}
                            </Button>
                        )
                    )}
                </Card>
            </div>
        </Container>
    );
}
