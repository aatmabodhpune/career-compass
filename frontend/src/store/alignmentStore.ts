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

function enrichDetails(details: CareerDetail[], map: Record<string, string>): CareerDetail[] {
    const variationsGreat = [
        "You are a strong fit for {career}. ",
        "{career} aligns well with your strengths. ",
        "Your profile matches the demands of {career}. "
    ];
    const variationsPotential = [
        "You are a potential fit for {career}. ",
        "{career} could be a good match with some development. ",
        "Your profile shows potential for {career}. "
    ];

    return details.map((item, index) => {
        const careerName = map[item.career_id] || item.career_id;
        let explanation = item.explanation?.replace(item.career_id, careerName) || "";

        const greatPrefix = `You are a great fit for ${careerName}. `;
        const potentialPrefix = `You are a potential fit for ${careerName}. `;

        if (explanation.startsWith(greatPrefix)) {
            const newPrefix = variationsGreat[index % variationsGreat.length].replace("{career}", careerName);
            explanation = explanation.replace(greatPrefix, newPrefix);
        } else if (explanation.startsWith(potentialPrefix)) {
            const newPrefix = variationsPotential[index % variationsPotential.length].replace("{career}", careerName);
            explanation = explanation.replace(potentialPrefix, newPrefix);
        }

        return {
            ...item,
            career_name: careerName,
            explanation,
        };
    });
}

function enrichResults(data: AlignmentResponse, map: Record<string, string>): AlignmentResponse {
    return {
        ...data,
        overall_top_10: enrichScores(data.overall_top_10 ?? [], map),
        personality_top_10: enrichScores(data.personality_top_10 ?? [], map),
        interest_top_10: enrichScores(data.interest_top_10 ?? [], map),
        aptitude_top_10: enrichScores(data.aptitude_top_10 ?? [], map),
        career_details: enrichDetails(data.career_details ?? [], map),
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
