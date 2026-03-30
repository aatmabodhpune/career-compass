import { create } from 'zustand';
import type { AlignmentResponse } from '../types/alignment';
import { fetchAlignmentResults } from '../api/alignment';

interface AlignmentState {
    results: AlignmentResponse | null;
    loading: boolean;
    error: string | null;
    fetchResults: (session_id: string) => Promise<void>;
    reset: () => void;
}

export const useAlignmentStore = create<AlignmentState>()((set) => ({
    results: null,
    loading: false,
    error: null,

    fetchResults: async (session_id: string) => {
        set({ loading: true, error: null });

        const { data, error } = await fetchAlignmentResults(session_id);

        if (error || !data) {
            set({ results: null, error: error ?? 'Unknown error', loading: false });
            return;
        }

        // Store raw API response — no transformation, no sorting
        set({ results: data, error: null, loading: false });
    },

    reset: () => set({ results: null, loading: false, error: null }),
}));
