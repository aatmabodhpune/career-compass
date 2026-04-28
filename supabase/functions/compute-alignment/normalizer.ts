import { AssessmentResponses, NormalizedScores } from './types.ts';

const pMap: Record<string, string> = { openness: "p1", conscientiousness: "p2", extraversion: "p3", agreeableness: "p4", neuroticism: "p5" };
const iMap: Record<string, string> = { realistic: "i1", investigative: "i2", artistic: "i3", social: "i4", enterprising: "i5", conventional: "i6" };
const aMap: Record<string, string> = { verbal: "a1", numerical: "a2", logical: "a3" };

export function normalizePersonality(data: Record<string, any>): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [trait, rawValue] of Object.entries(data || {})) {
        const key = pMap[trait] || trait; // Map trait name or pass-through
        const scores: number[] = Array.isArray(rawValue) ? rawValue : [rawValue];
        
        if (scores.length === 0 || typeof scores[0] !== 'number') continue;
        
        const sum = scores.reduce((acc, val) => acc + val, 0);
        let avg = sum / scores.length;
        
        // Ensure 1-5 scale. If > 5, assume 0-100 and downscale.
        if (avg > 5) {
            avg = (avg / 100) * 4 + 1;
        }
        
        result[key] = avg;
    }
    return result;
}

export function normalizeInterest(data: Record<string, any>): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [trait, rawValue] of Object.entries(data || {})) {
        const key = iMap[trait] || trait;
        const scores: number[] = Array.isArray(rawValue) ? rawValue : [rawValue];
        
        if (scores.length === 0 || typeof scores[0] !== 'number') continue;
        
        const sum = scores.reduce((acc, val) => acc + val, 0);
        let avg = sum / scores.length;
        
        // Ensure 1-5 scale. If > 5, assume 0-100 and downscale.
        if (avg > 5) {
            avg = (avg / 100) * 4 + 1;
        }
        
        result[key] = avg;
    }
    return result;
}

export function normalizeAptitude(data: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [trait, rawValue] of Object.entries(data || {})) {
        const key = aMap[trait] || trait;
        // Pass the raw string/number answer without grading
        result[key] = rawValue;
    }
    return result;
}

export function normalizeAll(responses: AssessmentResponses): NormalizedScores {
    return {
        personality: normalizePersonality(responses.personality || {}),
        interest: normalizeInterest(responses.interest || {}),
        aptitude: normalizeAptitude(responses.aptitude || {})
    };
}
