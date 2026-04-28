import { create } from 'zustand';
import type { AlignmentResponse, CareerScore, CareerDetail } from '../types/alignment';
import { fetchAlignmentResults } from '../api/alignment';
import { fetchCareerMap } from '../api/careers';

// ── Enrichment helpers (add career_name from map, fallback to career_id) ─────

function enrichScores(scores: CareerScore[], map: Record<string, string>): CareerScore[] {
    return scores.map((item) => ({
        ...item,
        career_name: map[item.career_id] || item.career_id,
    }));
}

function enrichResults(data: AlignmentResponse, map: Record<string, string>): AlignmentResponse {
    return {
        ...data,
        careers: enrichScores(data.careers ?? [], map),
        personality_alignment: enrichScores(data.personality_alignment ?? [], map),
        interest_alignment: enrichScores(data.interest_alignment ?? [], map),
        aptitude_alignment: enrichScores(data.aptitude_alignment ?? [], map),
    };
}

// ── Store ────────────────────────────────────────────────────────────────────

interface AlignmentState {
    results: AlignmentResponse | null;
    careerMap: Record<string, string>;
    loading: boolean;
    error: string | null;
    fetchResults: (session_id: string) => Promise<void>;
    reset: () => void;
}

export const useAlignmentStore = create<AlignmentState>()((set) => ({
    results: null,
    careerMap: {},
    loading: false,
    error: null,

    fetchResults: async (session_id: string) => {
        console.log("ALIGNMENT SESSION:", session_id);
        set({ loading: true, error: null });

        // Fetch alignment results and career map in parallel
        const [alignmentResult, careerMapResult] = await Promise.all([
            fetchAlignmentResults(session_id),
            fetchCareerMap(),
        ]);

        if (alignmentResult.error || !alignmentResult.data) {
            set({
                results: null,
                error: alignmentResult.error ?? 'Unknown error',
                loading: false,
            });
            return;
        }

        const map = careerMapResult.data ?? {};

        // Enrich results with career_name before storing
        const enriched = enrichResults(alignmentResult.data, map);

        set({ results: enriched, careerMap: map, error: null, loading: false });
    },

    reset: () => set({ results: null, careerMap: {}, loading: false, error: null }),
}));
