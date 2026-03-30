import { ExplanationResult } from './explanationEngine.ts';
import { Recommendation } from './recommendationEngine.ts';

export interface CareerScoreData {
    career_id: string;
    score: number;
}

export interface CareerSummaryInput {
    careers: CareerScoreData[];
    explanations: ExplanationResult[];
    insights: {
        strengths: string[];
        weaknesses: string[];
        recommendations: Recommendation[];
    };
}

export interface CareerDetail {
    career_id: string;
    score: number;
    explanation: string;
    strengths_used: string[];
    improvement_areas: string[];
}

export interface CareerSummaryResult {
    career_details: CareerDetail[];
}

export function buildCareerSummaries(input: CareerSummaryInput): CareerSummaryResult {
    const { careers, explanations, insights } = input;

    const career_details: CareerDetail[] = careers.map(c => {
        // 1. Find matching explanation securely safely falling back implicitly dynamically
        const explanationMatch = explanations.find(e => e.career_id === c.career_id);
        const explanationText = explanationMatch 
            ? explanationMatch.explanation 
            : "This career aligns moderately with your profile.";

        // 2. Extract strictly correctly natively mapping nested structures deduplicating values natively.
        const improvement_areas = [...new Set(insights.recommendations && insights.recommendations.length > 0 
            ? insights.recommendations.map(r => r.area) 
            : [])];

        // 3. Compose standard output matching required shape dynamically avoiding side conditions completely efficiently.
        return {
            career_id: c.career_id,
            score: c.score,
            explanation: explanationText,
            strengths_used: insights.strengths || [],
            improvement_areas
        };
    });

    return { career_details };
}

// 🧪 MANDATORY TEST CASES
export function runSummaryTests() {
    console.log("--- CAREER SUMMARY BUILDER TESTS ---");

    const insights = {
        strengths: ["Personality traits", "Interest alignment"],
        weaknesses: ["Aptitude ability"],
        recommendations: [{ area: "aptitude", suggestion: "Practice logical reasoning." }]
    };

    // 1. Normal case (all data present)
    console.log("Normal:", buildCareerSummaries({
        careers: [{ career_id: "idx1", score: 85 }],
        explanations: [{ career_id: "idx1", explanation: "You are a great fit." }],
        insights
    }));

    // 2. Missing explanation case
    console.log("Missing Explanation:", buildCareerSummaries({
        careers: [{ career_id: "idx2", score: 62 }],
        explanations: [],
        insights
    }));

    // 3. Empty recommendations case
    console.log("Empty Recommendations:", buildCareerSummaries({
        careers: [{ career_id: "idx3", score: 95 }],
        explanations: [{ career_id: "idx3", explanation: "Strong alignment!" }],
        insights: {
            strengths: ["Personality traits", "Interest alignment"],
            weaknesses: ["Aptitude ability"],
            recommendations: []
        }
    }));
}
