import { NormalizedScores, CareerBenchmark, CareerScore } from './types.ts';

export function computePersonalityScore(user: Record<string, number>, benchmark: Record<string, number>, weight: number): number {
    let score = 0;
    for (const [key, bValue] of Object.entries(benchmark)) {
        if (user[key] === undefined) {
            throw new Error(`Missing user key for personality: ${key}`);
        }
        score += (user[key] - bValue) * weight;
    }
    return score;
}

export function computeInterestScore(user: Record<string, number>, benchmark: Record<string, number>, weight: number): number {
    let score = 0;
    for (const [key, bValue] of Object.entries(benchmark)) {
        if (user[key] === undefined) {
            throw new Error(`Missing user key for interest: ${key}`);
        }
        score += (user[key] - bValue) * weight;
    }
    return score;
}

export function computeAptitudeScore(user: Record<string, number>, benchmark: Record<string, number>, weight: number): number {
    let score = 0;
    for (const [key, bValue] of Object.entries(benchmark)) {
        if (user[key] === undefined) {
            throw new Error(`Missing user key for aptitude: ${key}`);
        }
        score += (user[key] - bValue) * weight;
    }
    return score;
}

export function computeFinalScore(p: number, i: number, a: number): number {
    // LOCKED FORMULA: (p + i + a) / 3
    return (p + i + a) / 3;
}

export function computeAllScores(normalized: NormalizedScores, benchmarks: CareerBenchmark[]): CareerScore[] {
    const scores: CareerScore[] = [];

    for (const benchmark of benchmarks) {
        const personality_score = computePersonalityScore(
            normalized.personality, 
            benchmark.personality, 
            benchmark.weights.personality
        );
        
        const interest_score = computeInterestScore(
            normalized.interest, 
            benchmark.interest, 
            benchmark.weights.interest
        );
        
        const aptitude_score = computeAptitudeScore(
            normalized.aptitude, 
            benchmark.aptitude, 
            benchmark.weights.aptitude
        );
        
        const final_score = computeFinalScore(personality_score, interest_score, aptitude_score);

        scores.push({
            career_id: benchmark.career_id,
            personality_score,
            interest_score,
            aptitude_score,
            final_score
        });
    }

    return scores;
}
