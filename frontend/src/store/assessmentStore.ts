import { create } from 'zustand';
import { assessmentApi } from '../api/assessment';
import { useAuthStore } from './authStore';

interface AssessmentState {
    session_id: string | null;
    status: 'idle' | 'in_progress' | 'completed' | 'error';
    section: 'personality' | 'interest' | 'aptitude';
    currentQuestionIndex: number;
    responses: Record<string, any>;
    isSubmitting: boolean;
    error: string | null;

    // Group 2 Split completion tracking
    personality_done: boolean;
    interest_done: boolean;
    aptitude_done: boolean;

    startSession: (token: string) => Promise<void>;
    initializeSession: () => Promise<void>;
    updateResponse: (questionId: string, value: string | number) => void;
    submitTestSection: (section: 'personality' | 'interest' | 'aptitude') => Promise<void>;
    submitAssessment: (token: string) => Promise<void>;
    setSection: (section: 'personality' | 'interest' | 'aptitude') => void;
    setCurrentQuestionIndex: (index: number) => void;
    
    setPersonalityDone: (value: boolean) => void;
    setInterestDone: (value: boolean) => void;
    setAptitudeDone: (value: boolean) => void;

    resetAssessment: () => void;
    resetSession: () => void;
}

// Track debouncer externally to store state tree to prevent re-renders on timer updates
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
    session_id: typeof window !== 'undefined' ? localStorage.getItem("career_compass_session_id") : null,
    status: 'idle',
    section: 'personality',
    currentQuestionIndex: 0,
    responses: {},
    isSubmitting: false,
    error: null,

    personality_done: false,
    interest_done: false,
    aptitude_done: false,

    setSection: (section) => set({ section }),
    setCurrentQuestionIndex: (currentQuestionIndex) => set({ currentQuestionIndex }),

    setPersonalityDone: (value) => set({ personality_done: value }),
    setInterestDone: (value) => set({ interest_done: value }),
    setAptitudeDone: (value) => set({ aptitude_done: value }),

    resetAssessment: () => {
        if (saveTimeout !== null) {
            clearTimeout(saveTimeout);
            saveTimeout = null;
        }
        localStorage.removeItem("career_compass_session_id");
        set({
            session_id: null,
            status: 'idle',
            section: 'personality',
            currentQuestionIndex: 0,
            responses: {},
            isSubmitting: false,
            error: null,
            personality_done: false,
            interest_done: false,
            aptitude_done: false,
        });
    },

    resetSession: () => {
        if (saveTimeout !== null) {
            clearTimeout(saveTimeout);
            saveTimeout = null;
        }
        localStorage.removeItem("career_compass_session_id");
        localStorage.removeItem("assessment-storage"); // Cleanup if any persistence was used
        set({
            session_id: null,
            status: 'idle',
            responses: {},
            personality_done: false,
            interest_done: false,
            aptitude_done: false,
            error: null
        });
    },

    startSession: async (token) => {
        if (!token) return;
        try {
            const res = await assessmentApi.startSession(token);
            const session_id = res.data?.session_id || res.data?.session?.id;
            const responses = res.data?.responses || {};

            // Group 5: Save for refresh rehydration
            if (session_id) {
                localStorage.setItem("career_compass_session_id", session_id);
            }

            // Group 5: Derive completion from DB truth
            const p_done = Object.keys(responses).some(k => k.startsWith('p'));
            const i_done = Object.keys(responses).some(k => k.startsWith('i'));
            const a_done = Object.keys(responses).some(k => k.startsWith('a'));

            // 3. COMPLETED SESSION CHECK
            if (res.data?.status === 'completed' || res.data?.session?.status === 'completed') {
                set({
                    session_id,
                    status: 'completed',
                    responses,
                    personality_done: true,
                    interest_done: true,
                    aptitude_done: true
                });
                return;
            }

            set({
                session_id,
                status: 'in_progress',
                responses,
                personality_done: p_done || get().personality_done,
                interest_done: i_done || get().interest_done,
                aptitude_done: a_done || get().aptitude_done
            });
        } catch (err) {
            set({ status: 'error' });
        }
    },

    initializeSession: async () => {
        const token = useAuthStore.getState().token;
        if (!token) return;

        const storedSessionId = localStorage.getItem("career_compass_session_id");
        if (storedSessionId) {
            set({ session_id: storedSessionId });
        }
        
        // Re-sync with DB to ensure progress is recovered accurately
        await get().startSession(token);
    },

    updateResponse: (questionId, value) => {
        const { status } = get();

        // Prevent UI responses if completed
        if (status === 'completed') return;

        // Extract strict mathematical integer conversions isolating specifically bounded Aptitude mapping logic natively preventing database format exceptions downstream cleanly.
        let finalValue = value;
        if (questionId.startsWith('a') && typeof value === 'string') {
            const map: Record<string, number> = { A: 1, B: 2, C: 3, D: 5 };
            finalValue = map[value.toUpperCase()] || value;
        }

        // No longer logging values for production stability
        set((state) => ({
            responses: {
                ...state.responses,
                [questionId]: finalValue,
            },
        }));

        // Always read latest Zustand state for the debounced payload.
        const token = useAuthStore.getState().token;
        const { session_id } = get();
        if (!token || !session_id) {
            console.warn("Autosave skipped: missing token or session_id", { tokenPresent: !!token, session_id });
            return;
        }

        // Handle autosave cancelling effectively resetting debounce timer
        if (saveTimeout !== null) {
            clearTimeout(saveTimeout);
        }

        // Debounce: wait for user to pause typing/selecting, then save.
        saveTimeout = setTimeout(async () => {
            try {
                const currentState = get();
                const currentToken = useAuthStore.getState().token;
                if (!currentToken || !currentState.session_id) return;

                // Syncing responses securely without console noise
                
                // FINAL SAFETY TRANSFORM (MANDATORY) ensuring backend strictly receives expected integers
                const transformedResponses: Record<string, any> = {};
                for (const key in currentState.responses) {
                    const value = currentState.responses[key];
                    if (key.startsWith("a") && typeof value === "string") {
                        const map: Record<string, number> = { A: 1, B: 2, C: 3, D: 5 };
                        transformedResponses[key] = map[value.toUpperCase()] || value;
                    } else {
                        transformedResponses[key] = value;
                    }
                }

                // Use strictly transformed parameters to avoid explicit database failure bounds globally
                await assessmentApi.saveResponses(currentToken, currentState.session_id, transformedResponses);
            } catch (err) {
                console.error("Autosave Error:", err);
            }
        }, 1000);
    },

    submitTestSection: async (section: 'personality' | 'interest' | 'aptitude') => {
        const state = get();
        const token = useAuthStore.getState().token;
        if (!token) throw new Error("No token available");

        try {
            const session_id = get().session_id;
            console.log("SESSION USED:", session_id);
            if (!session_id) throw new Error("No active session_id found in store");

            const existingResponses = get().responses || {};

            // Transform local responses for this section
            const localResponses: Record<string, any> = {};
            for (const key in state.responses) {
                const value = state.responses[key];
                // Only merge relevant keys for current section or keep all if simple
                // Requirement says: "Overwrite only current section, Support retakes"
                // Our current state.responses is cumulative, which is fine
                if (key.startsWith("a") && typeof value === "string") {
                    const map: Record<string, number> = { A: 1, B: 2, C: 3, D: 5 };
                    localResponses[key] = map[value.toUpperCase()] || value;
                } else {
                    localResponses[key] = value;
                }
            }

            // Group 3: Safe Merge logic (Preserve all previous data from DB)
            const mergedResponses = {
                ...existingResponses,
                ...localResponses 
            };

            // Update same row using SAME session_id
            await assessmentApi.saveResponses(token, session_id, mergedResponses);

            // Update local completion ONLY after success
            if (section === 'personality') get().setPersonalityDone(true);
            if (section === 'interest') get().setInterestDone(true);
            if (section === 'aptitude') get().setAptitudeDone(true);
            
            // Update the session_id in store if it was missing
            if (!state.session_id) set({ session_id });
            
        } catch (error) {
            console.error("Group 3 Submit Error:", error);
            throw error;
        }
    },

    submitAssessment: async (token) => {
        const state = get();

        // 1. PREVENT DOUBLE SUBMIT (CRITICAL)
        if (state.isSubmitting) return;

        // COUNT VALIDATION (MANDATORY)
        const REQUIRED = {
            personality: 5,
            interest: 5,
            aptitude: 5
        };

        const responses = state.responses;
        const personalityCount = Object.keys(responses).filter(k => k.startsWith("p")).length;
        const interestCount = Object.keys(responses).filter(k => k.startsWith("i")).length;
        const aptitudeCount = Object.keys(responses).filter(k => k.startsWith("a")).length;

        if (
            personalityCount < REQUIRED.personality ||
            interestCount < REQUIRED.interest ||
            aptitudeCount < REQUIRED.aptitude
        ) {
            set({
                error: "Please complete all questions before submitting."
            });
            return;
        }

        set({ isSubmitting: true, error: null });

        // 2. CANCEL AUTOSAVE ON SUBMIT (CRITICAL)
        if (saveTimeout !== null) {
            clearTimeout(saveTimeout);
            saveTimeout = null;
        }

        try {
            if (!state.session_id) throw new Error("No active session to submit");
            await assessmentApi.submitAssessment(token, state.session_id);
            set({
                status: 'completed',
                responses: {},
            }); // Enforces UI lock bounds cleanly and clears local responses
        } catch (err) {
            console.error("Submit Error:", err);
            set({ status: 'error' });
        } finally {
            set({ isSubmitting: false });
        }
    }
}));

