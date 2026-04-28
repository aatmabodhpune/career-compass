import { create } from 'zustand';
import { assessmentApi } from '../api/assessment';
import { useAuthStore } from '@/store/authStore';

interface AssessmentState {
    status: 'idle' | 'in_progress' | 'completed' | 'error';
    section: 'personality' | 'interest' | 'aptitude';
    currentQuestionIndex: number;
    responses: Record<string, Record<string, any>>;
    isSubmitting: boolean;
    error: string | null;
    completedCount: number;

    questions: any[];
    setQuestions: (questions: any[]) => void;

    // Group 2 Split completion tracking
    personality_done: boolean;
    interest_done: boolean;
    aptitude_done: boolean;

    startSession: (token: string) => Promise<void>;
    initializeSession: () => Promise<void>;
    updateResponse: (questionId: string, value: string | number) => void;
    submitTestSection: (section: 'personality' | 'interest' | 'aptitude') => Promise<void>;
    submitAssessment: (session_id: string) => Promise<void>;
    setSection: (section: 'personality' | 'interest' | 'aptitude') => void;
    setCurrentQuestionIndex: (value: number | ((prev: number) => number)) => void;
    
    setPersonalityDone: (value: boolean) => void;
    setInterestDone: (value: boolean) => void;
    setAptitudeDone: (value: boolean) => void;
    setStatus: (status: 'idle' | 'in_progress' | 'completed' | 'error') => void;
    setSection: (section: 'personality' | 'interest' | 'aptitude') => void;
    setCurrentQuestionIndex: (value: number | ((prev: number) => number)) => void;
    
    setPersonalityDone: (value: boolean) => void;
    setInterestDone: (value: boolean) => void;
    setAptitudeDone: (value: boolean) => void;
    setStatus: (status: 'idle' | 'in_progress' | 'completed' | 'error') => void;
    incrementCompleted: () => void;

    resetAssessment: () => void;
    resetSession: () => void;
}

// Debounced saving completely removed. All persistence guaranteed by explicit Section actions and final Submit flush.

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
    status: 'idle',
    section: 'personality',
    currentQuestionIndex: 0,
    responses: {
        personality: {},
        interest: {},
        aptitude: {}
    },
    isSubmitting: false,
    error: null,
    completedCount: 0,

    questions: [],
    setQuestions: (questions) => set({ questions }),

    personality_done: false,
    interest_done: false,
    aptitude_done: false,

    setSection: (section) => set({ section }),
    setCurrentQuestionIndex: (value) =>
        set((state) => ({
            currentQuestionIndex:
                typeof value === "function"
                    ? value(state.currentQuestionIndex)
                    : value,
        })),

    setPersonalityDone: (value) => set({ personality_done: value }),
    setInterestDone: (value) => set({ interest_done: value }),
    setAptitudeDone: (value) => set({ aptitude_done: value }),
    setStatus: (status) => set({ status }),
    incrementCompleted: () =>
        set((state) => ({
            completedCount: Math.min(state.completedCount + 1, 3)
        })),

    resetAssessment: () => {
        localStorage.removeItem("career_compass_session_id");
        set({
            status: 'idle',
            section: 'personality',
            currentQuestionIndex: 0,
            responses: {
                personality: {},
                interest: {},
                aptitude: {}
            },
            isSubmitting: false,
            error: null,
            personality_done: false,
            interest_done: false,
            aptitude_done: false,
        });
    },

    resetSession: () => {
        localStorage.removeItem("career_compass_session_id");
        localStorage.removeItem("assessment-storage"); // Cleanup if any persistence was used
        set({
            status: 'idle',
            responses: {
                personality: {},
                interest: {},
                aptitude: {}
            },
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
            const session_id = res.data?.session_id;
            const rawResponses = res.data?.responses || {};

            // Partition flat responses into sections
            const partitioned: Record<string, Record<string, any>> = {
                personality: {},
                interest: {},
                aptitude: {}
            };

            Object.entries(rawResponses).forEach(([key, val]) => {
                if (key.startsWith('p')) partitioned.personality[key] = val;
                else if (key.startsWith('i')) partitioned.interest[key] = val;
                else if (key.startsWith('a')) partitioned.aptitude[key] = val;
            });

            const p_done = Object.keys(partitioned.personality).length > 0;
            const i_done = Object.keys(partitioned.interest).length > 0;
            const a_done = Object.keys(partitioned.aptitude).length > 0;

            if (res.data?.status === 'completed' || res.data?.session?.status === 'completed') {
                set({
                    status: 'completed',
                    responses: partitioned,
                    personality_done: true,
                    interest_done: true,
                    aptitude_done: true
                });
                return;
            }

            set({
                status: 'in_progress',
                responses: partitioned,
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
        
        await get().startSession(token);
    },

    updateResponse: (questionId, value) => {
        const { status, section } = get();
        if (status === 'completed') return;

        let finalValue = value;
        if (section === 'aptitude' && typeof value === 'string') {
            const map: Record<string, number> = { A: 1, B: 2, C: 3, D: 4, E: 5 };
            finalValue = map[value.toUpperCase()] || value;
        }

        const updatedResponses = {
            ...get().responses[section],
            [questionId]: finalValue,
        };
        console.log("SECTION BEING SAVED:", section);
        console.log("DATA:", updatedResponses);

        set((state) => ({
            responses: {
                ...state.responses,
                [section]: {
                    ...state.responses[section],
                    [questionId]: finalValue,
                }
            },
        }));
    },

    submitTestSection: async (section: 'personality' | 'interest' | 'aptitude') => {
        try {
            const session_id = useAuthStore.getState().session_id;
            if (!session_id) throw new Error("No active session_id found in store");

            const currentResponses = get().responses[section];

            // CRITICAL: Await direct save in submission flow instead of debouncing
            await assessmentApi.saveResponses(session_id, {
                section,
                responses: currentResponses
            });

            if (section === 'personality') get().setPersonalityDone(true);
            if (section === 'interest') get().setInterestDone(true);
            if (section === 'aptitude') get().setAptitudeDone(true);
            
        } catch (error) {
            throw error;
        }
    },

    submitAssessment: async (session_id) => {
        const state = get();
        if (state.isSubmitting) return;

        set({ isSubmitting: true, error: null });

        try {
            console.log("SUBMIT SESSION_ID:", session_id);

            if (!session_id) {
                throw new Error("SESSION_ID MISSING AT CALL SITE");
            }

            const jwt = useAuthStore.getState().jwt;
            if (!jwt) {
                throw new Error("JWT MISSING AT SUBMIT");
            }

            const { responses } = get();

            console.log("FINAL PAYLOAD BEFORE SUBMIT:", {
                personality: responses.personality,
                interest: responses.interest,
                aptitude: responses.aptitude,
            });

            // ✅ STEP 1: PERSONALITY
            const resP = await assessmentApi.saveResponses(session_id, {
                section: "personality",
                responses: responses.personality
            });
            if (resP?.error) throw new Error(`SAVE FAILED (Personality): ${resP.error}`);

            // ✅ STEP 2: INTEREST
            const resI = await assessmentApi.saveResponses(session_id, {
                section: "interest",
                responses: responses.interest
            });
            if (resI?.error) throw new Error(`SAVE FAILED (Interest): ${resI.error}`);

            // ✅ STEP 3: APTITUDE
            const resA = await assessmentApi.saveResponses(session_id, {
                section: "aptitude",
                responses: responses.aptitude
            });
            if (resA?.error) throw new Error(`SAVE FAILED (Aptitude): ${resA.error}`);

            // ✅ STEP 4: FINAL SUBMIT (MARK AS COMPLETED)
            await assessmentApi.submitAssessment(session_id);

            set({
                status: 'completed',
                responses: {
                    personality: {},
                    interest: {},
                    aptitude: {}
                },
            });
        } catch (err: any) {
            console.error("SUBMIT ASSESSMENT ERROR:", err);
            set({ error: err.message || "Failed to submit assessment" });
            throw err; // Re-throw to prevent navigation in UI
        } finally {
            set({ isSubmitting: false });
        }
    }
}));
