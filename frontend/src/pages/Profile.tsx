import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '../store/assessmentStore';
import { useAuthStore } from '../store/authStore';
import { useAlignmentStore } from '../store/alignmentStore';

export default function Profile() {
    const navigate = useNavigate();
    const token = useAuthStore(state => state.token);
    const { personality_done, interest_done, aptitude_done, session_id } = useAssessmentStore();
    const { fetchResults } = useAlignmentStore();
    
    // Group 4: Completion Check Logic
    const allTestsDone = personality_done && interest_done && aptitude_done;
    
    // Prevent multiple calls guard
    const [alignmentLoaded, setAlignmentLoaded] = useState(false);
    const [alignmentData, setAlignmentData] = useState<boolean | null>(null);

    // Group 4: Profile Page Guard
    useEffect(() => {
        if (!allTestsDone) {
            navigate("/dashboard");
        }
    }, [allTestsDone, navigate]);

    // Group 4: Alignment Trigger Control
    useEffect(() => {
        if (!allTestsDone || alignmentLoaded) return;

        const run = async () => {
             if (!token || !session_id) return;
             try {
                 // Group 4 FIX: Use existing alignment flow trigger accurately 
                 console.log("PROFILE SESSION:", session_id);
                 await fetchResults(session_id);
                 setAlignmentData(true);
                 navigate('/results');
             } catch (error) {
                 // Error handled via UI state in Results
             }
        };

        run();
        setAlignmentLoaded(true);
    }, [allTestsDone, alignmentLoaded, fetchResults, session_id, token, navigate]);

    // Group 4: Loading State
    if (!alignmentData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-gray-600 font-medium">Loading results...</div>
            </div>
        );
    }
    
    return null;
}
