export type ScoreKey = "personality" | "interest" | "aptitude";

export interface Scores {
    personality: number;
    interest: number;
    aptitude: number;
}

export interface StrengthsResult {
    strengths: string[];
    weaknesses: string[];
}

function sanitizeScore(score: any): number {
    if (typeof score !== "number" || isNaN(score)) return 0;
    return Math.max(0, Math.min(100, score));
}

export function analyzeStrengths(scores: Scores): StrengthsResult {
    const s = {
        personality: sanitizeScore(scores.personality),
        interest: sanitizeScore(scores.interest),
        aptitude: sanitizeScore(scores.aptitude)
    };

    const labels: Record<ScoreKey, string> = {
        personality: "Personality traits",
        interest: "Interest alignment",
        aptitude: "Aptitude ability"
    };

    const entries = Object.entries(s) as [ScoreKey, number][];
    entries.sort((a, b) => b[1] - a[1]);

    const strengths = entries.slice(0, 2).map(e => labels[e[0]]);
    const weaknesses = entries.slice(2).map(e => labels[e[0]]);

    return { strengths, weaknesses };
}

// 🧪 MANDATORY TEST CASES
export function runStrengthTests() {
    console.log("--- STRENGTH ANALYZER TESTS ---");
    console.log("Test 1:", analyzeStrengths({ personality: 40, interest: 90, aptitude: 85 }));
    console.log("Test 2:", analyzeStrengths({ personality: 95, interest: 80, aptitude: 30 }));
    console.log("Test 3:", analyzeStrengths({ personality: 20, interest: 10, aptitude: 30 }));
}
