import { create } from 'zustand';
import { fetchAlignmentResults } from '../api/alignment';

export type AlignmentResult = {
    overall_top_10?: any[];
    personality_top_10?: any[];
    interest_top_10?: any[];
    aptitude_top_10?: any[];
} | any;

export interface AlignmentState {
    results: AlignmentResult | null;
    loading: boolean;
    error: string | null;
    fetchResults: (session_id: string) => Promise<void>;
}

export const useAlignmentStore = create<AlignmentState>((set) => ({
    results: null,
    loading: false,
    error: null,

    fetchResults: async (session_id: string) => {
        set({ loading: true, error: null });

        const { data, error } = await fetchAlignmentResults(session_id);

        if (error) {
            set({
                error: error,
                loading: false
            });
        } else {
            set({
                results: data,
                loading: false,
                error: null
            });
        }
    }
}));
