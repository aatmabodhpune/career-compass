export type ScoreKey = "personality" | "interest" | "aptitude";

export interface Scores {
    personality: number;
    interest: number;
    aptitude: number;
}

export interface Recommendation {
    area: string;
    suggestion: string;
}

export interface RecommendationResult {
    recommendations: Recommendation[];
}

function sanitizeScore(score: any): number {
    if (typeof score !== "number" || isNaN(score)) return 0;
    return Math.max(0, Math.min(100, score));
}

export function generateRecommendations(userScores: Scores, benchmarkScores: Scores): RecommendationResult {
    const sUser = {
        personality: sanitizeScore(userScores.personality),
        interest: sanitizeScore(userScores.interest),
        aptitude: sanitizeScore(userScores.aptitude)
    };
    
    const sBench = {
        personality: sanitizeScore(benchmarkScores.personality),
        interest: sanitizeScore(benchmarkScores.interest),
        aptitude: sanitizeScore(benchmarkScores.aptitude)
    };

    const suggestions: Record<ScoreKey, string> = {
        personality: "Work on communication, teamwork, and self-awareness.",
        interest: "Explore this field through projects, internships, or online content.",
        aptitude: "Practice logical reasoning, problem-solving, and analytical exercises."
    };

    const recommendations: Recommendation[] = [];

    for (const key of Object.keys(sUser) as ScoreKey[]) {
        if (sUser[key] < sBench[key]) {
            recommendations.push({
                area: key,
                suggestion: suggestions[key]
            });
        }
    }

    if (recommendations.length === 0) {
        return {
            recommendations: [
                {
                    area: "general",
                    suggestion: "You are well aligned. Continue building your strengths."
                }
            ]
        };
    }

    return { recommendations };
}

// 🧪 MANDATORY TEST CASES
export function runRecommendationTests() {
    console.log("--- RECOMMENDATION ENGINE TESTS ---");
    const benchmark = { personality: 70, interest: 70, aptitude: 70 };
    console.log("High:", generateRecommendations({ personality: 80, interest: 80, aptitude: 80 }, benchmark));
    console.log("Mixed:", generateRecommendations({ personality: 80, interest: 40, aptitude: 75 }, benchmark));
    console.log("Low:", generateRecommendations({ personality: 30, interest: 20, aptitude: 10 }, benchmark));
}
