import { AssessmentResponses, NormalizedScores } from './types.ts';

export function normalizePersonality(data: Record<string, any>): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [trait, rawValue] of Object.entries(data)) {
        // Coerce to array — DB may send plain number or array
        const scores: number[] = Array.isArray(rawValue) ? rawValue : [rawValue];
        if (scores.length === 0 || typeof scores[0] !== 'number') {
            console.error(`Personality trait ${trait} has invalid value:`, rawValue);
            continue;
        }
        const sum = scores.reduce((acc, val) => acc + val, 0);
        const avg = sum / scores.length;
        // LOCKED FORMULA: ((avg - 1) / 4) * 100
        result[trait] = ((avg - 1) / 4) * 100;
    }
    return result;
}

export function normalizeInterest(data: Record<string, any>): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [trait, rawValue] of Object.entries(data)) {
        // Coerce to array — DB may send plain number or array
        const scores: number[] = Array.isArray(rawValue) ? rawValue : [rawValue];
        if (scores.length === 0 || typeof scores[0] !== 'number') {
            console.error(`Interest trait ${trait} has invalid value:`, rawValue);
            continue;
        }
        const sum = scores.reduce((acc, val) => acc + val, 0);
        const avg = sum / scores.length;
        // LOCKED FORMULA: ((avg - 1) / 4) * 100
        result[trait] = ((avg - 1) / 4) * 100;
    }
    return result;
}

export function normalizeAptitude(aptitudeResponses: Record<string, any>): Record<string, number> {
    const correctAnswers: Record<string, string> = {
        a1: "C",
        a2: "B",
        a3: "A",
        a4: "D",
        a5: "B"
    };

    let correctCount = 0;
    let total = 0;

    for (const key in aptitudeResponses) {
        const userAnswer = aptitudeResponses[key];

        if (!userAnswer) continue;

        if (userAnswer === correctAnswers[key]) {
            correctCount++;
        }

        total++;
    }

    const aptitudeScore = total > 0
        ? (correctCount / total) * 100
        : 0;

    console.log("APTITUDE INPUT:", aptitudeResponses);
    console.log("APTITUDE SCORE:", aptitudeScore);

    return { a1: aptitudeScore };
}

export function normalizeAll(responses: AssessmentResponses): NormalizedScores {
    return {
        personality: normalizePersonality(responses.personality),
        interest: normalizeInterest(responses.interest),
        aptitude: normalizeAptitude(responses.aptitude)
    };
}
