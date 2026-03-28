import { CareerScore, RankedResults } from './types.ts';

export function rankOverall(scores: CareerScore[]): CareerScore[] {
    console.log("OVERALL BEFORE SORT", scores);
    const sorted = [...scores].slice().sort((a, b) => b.final_score - a.final_score);
    console.log("OVERALL AFTER SORT", sorted);
    return sorted.slice(0, 10);
}

export function rankPersonality(scores: CareerScore[]): CareerScore[] {
    return [...scores].sort((a, b) => b.personality_score - a.personality_score).slice(0, 10);
}

export function rankInterest(scores: CareerScore[]): CareerScore[] {
    return [...scores].sort((a, b) => b.interest_score - a.interest_score).slice(0, 10);
}

export function rankAptitude(scores: CareerScore[]): CareerScore[] {
    return [...scores].sort((a, b) => b.aptitude_score - a.aptitude_score).slice(0, 10);
}

export function rankAll(scores: CareerScore[]): RankedResults {
    const rawOverall = rankOverall(scores);
    console.log("OVERALL BEFORE SORT", rawOverall);

    const sortedOverall = [...rawOverall].sort((a, b) => b.final_score - a.final_score);
    console.log("OVERALL AFTER SORT", sortedOverall);
    console.log("🔥 NEW VERSION RUNNING - SORT FIX APPLIED");
    
    const personality_top_10 = rankPersonality(scores).slice().sort((a, b) => b.personality_score - a.personality_score);
    const interest_top_10 = rankInterest(scores).slice().sort((a, b) => b.interest_score - a.interest_score);
    const aptitude_top_10 = rankAptitude(scores).slice().sort((a, b) => b.aptitude_score - a.aptitude_score);

    return {
        overall_top_10: sortedOverall, // ✅ MUST use sorted
        personality_top_10,
        interest_top_10,
        aptitude_top_10
    };
}
