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

    startSession: (token: string) => Promise<void>;
    updateResponse: (questionId: string, value: string | number) => void;
    submitAssessment: (token: string) => Promise<void>;
    setSection: (section: 'personality' | 'interest' | 'aptitude') => void;
    setCurrentQuestionIndex: (index: number) => void;
    resetAssessment: () => void;
}

// Track debouncer externally to store state tree to prevent re-renders on timer updates
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
    session_id: null,
    status: 'idle',
    section: 'personality',
    currentQuestionIndex: 0,
    responses: {},
    isSubmitting: false,

    setSection: (section) => set({ section }),
    setCurrentQuestionIndex: (currentQuestionIndex) => set({ currentQuestionIndex }),

    resetAssessment: () => {
        if (saveTimeout !== null) {
            clearTimeout(saveTimeout);
            saveTimeout = null;
        }
        set({
            session_id: null,
            status: 'idle',
            section: 'personality',
            currentQuestionIndex: 0,
            responses: {},
            isSubmitting: false,
        });
    },

    startSession: async (token) => {
        if (!token) {
            console.error("startSession called without token");
            return;
        }
        try {
            const res = await assessmentApi.startSession(token);

            // 3. COMPLETED SESSION CHECK (CRITICAL)
            // Lock UI completely if session was returned as completed
            if (res.data?.status === 'completed' || res.data?.session?.status === 'completed') {
                set({
                    session_id: res.data.session_id || res.data.session.id,
                    status: 'completed',
                    responses: res.data.responses || {}
                });
                return;
            }

            set({
                session_id: res.data?.session_id || res.data?.session?.id,
                status: 'in_progress',
                responses: res.data?.responses || {}
            });
        } catch (err) {
            console.error("Start Session Error:", err);
            set({ status: 'error' });
        }
    },

    updateResponse: (questionId, value) => {
        const { status } = get();

        // Prevent UI responses if completed
        if (status === 'completed') return;

        console.log("Updating:", questionId, value);

        set((state) => ({
            responses: {
                ...state.responses,
                [questionId]: value,
            },
        }));

        // Always read latest Zustand state for the debounced payload.
        const latestResponses = get().responses;

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

                console.log("Saving responses:", currentState.responses);
                // Use latest responses from Zustand to avoid stale payloads.
                await assessmentApi.saveResponses(currentToken, currentState.session_id, currentState.responses);
            } catch (err) {
                console.error("Autosave Error:", err);
            }
        }, 1000);
    },

    submitAssessment: async (token) => {
        const state = get();

        // 1. PREVENT DOUBLE SUBMIT (CRITICAL)
        if (state.isSubmitting) return;

        set({ isSubmitting: true });

        // 2. CANCEL AUTOSAVE ON SUBMIT (CRITICAL)
        if (saveTimeout !== null) {
            clearTimeout(saveTimeout);
            saveTimeout = null;
        }

        try {
            if (!state.session_id) throw new Error("No active session to submit");
            console.log("Submitting session:", state.session_id);
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

