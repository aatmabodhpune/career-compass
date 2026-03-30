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
    console.log("🔥 computeAllScores called");

    // Trait name → benchmark key mappings (handles both named traits and raw p1/i1/a1 keys)
    const personalityMap: Record<string, string> = {
        openness: "p1", conscientiousness: "p2", extraversion: "p3",
        agreeableness: "p4", neuroticism: "p5",
        p1: "p1", p2: "p2", p3: "p3", p4: "p4", p5: "p5"
    };

    const interestMap: Record<string, string> = {
        realistic: "i1", investigative: "i2", artistic: "i3",
        social: "i4", enterprising: "i5", conventional: "i6",
        i1: "i1", i2: "i2", i3: "i3", i4: "i4", i5: "i5", i6: "i6"
    };

    const aptitudeMap: Record<string, string> = {
        verbal: "a1", numerical: "a2", logical: "a3",
        a1: "a1", a2: "a2", a3: "a3"
    };

    try {
        const scores: CareerScore[] = [];

        for (const benchmark of (benchmarks || [])) {
            console.log("Processing career:", benchmark.career_id);

            let personality_score = 0;
            for (const [trait, value] of Object.entries(normalized.personality)) {
                const key = personalityMap[trait];
                const benchmarkValue = benchmark.personality?.[key];
                if (benchmarkValue !== undefined) {
                    personality_score += value * benchmarkValue;
                }
            }

            let interest_score = 0;
            for (const [trait, value] of Object.entries(normalized.interest)) {
                const key = interestMap[trait];
                const benchmarkValue = benchmark.interest?.[key];
                if (benchmarkValue !== undefined) {
                    interest_score += value * benchmarkValue;
                }
            }

            let aptitude_score = 0;
            for (const [trait, value] of Object.entries(normalized.aptitude)) {
                const key = aptitudeMap[trait];
                const benchmarkValue = benchmark.aptitude?.[key];
                if (benchmarkValue !== undefined) {
                    aptitude_score += value * benchmarkValue;
                }
            }

            const final_score = (personality_score + interest_score + aptitude_score) / 3;

            scores.push({
                career_id: benchmark.career_id,
                personality_score,
                interest_score,
                aptitude_score,
                final_score
            });
        }

        console.log("FINAL SCORES:", scores);
        return scores;

    } catch (e) {
        console.error("computeAllScores FAILED:", e);
        return [];
    }
}

