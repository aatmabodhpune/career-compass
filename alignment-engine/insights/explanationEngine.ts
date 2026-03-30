export type ScoreKey = "personality" | "interest" | "aptitude";

export interface Career {
    id: string;
    name: string;
}

export interface Scores {
    personality: number;
    interest: number;
    aptitude: number;
}

export interface ExplanationResult {
    career_id: string;
    explanation: string;
}

function sanitizeScore(score: any): number {
    if (typeof score !== "number" || isNaN(score)) return 0;
    return Math.max(0, Math.min(100, score));
}

function getLevel(score: number): 'strong' | 'moderate' | 'weak' {
    if (score > 70) return 'strong';
    if (score >= 40) return 'moderate';
    return 'weak';
}

export function generateCareerExplanation(career: Career, scores: Scores): ExplanationResult {
    const p = sanitizeScore(scores.personality);
    const i = sanitizeScore(scores.interest);
    const a = sanitizeScore(scores.aptitude);

    const pLevel = getLevel(p);
    const iLevel = getLevel(i);
    const aLevel = getLevel(a);

    let explanation = `You are a ${pLevel === 'strong' && iLevel === 'strong' ? 'great' : 'potential'} fit for ${career.name}. `;

    if (pLevel === 'strong') explanation += `Your strong analytical and communication potential aligns closely with this field. `;
    else if (pLevel === 'moderate') explanation += `You possess a moderate personality alignment suitable for routine responsibilities. `;
    else explanation += `Adapting your traits may be necessary to excel here. `;

    if (iLevel === 'strong') explanation += `Additionally, your high interest indicates you would find the core activities highly engaging. `;
    else if (iLevel === 'moderate') explanation += `You have a baseline interest in the core responsibilities. `;
    else explanation += `Your current interests do not heavily map to the daily tasks. `;

    if (aLevel === 'strong') explanation += `Furthermore, your aptitude skills demonstrate a rock-solid foundational capability.`;
    else if (aLevel === 'moderate') explanation += `Your current aptitude demonstrates you are capable of developing the required skills.`;
    else explanation += `Consider focusing on foundational skill development to fully execute the role.`;

    return {
        career_id: career.id,
        explanation: explanation.trim()
    };
}

// 🧪 MANDATORY TEST CASES
export function runExplanationTests() {
    console.log("--- EXPLANATION ENGINE TESTS ---");
    const career = { id: "c1", name: "Software Engineer" };
    console.log("High:", generateCareerExplanation(career, { personality: 85, interest: 90, aptitude: 75 }).explanation);
    console.log("Mixed:", generateCareerExplanation(career, { personality: 45, interest: 80, aptitude: 30 }).explanation);
    console.log("Low:", generateCareerExplanation(career, { personality: 20, interest: 30, aptitude: 15 }).explanation);
}
