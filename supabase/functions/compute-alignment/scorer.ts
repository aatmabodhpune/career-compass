import { NormalizedScores, CareerBenchmark, CareerScore } from './types.ts';
import { QUESTION_BANK } from '../../../alignment-engine/config/questionBank.ts';

export function computeAllScores(normalized: NormalizedScores, benchmarks: CareerBenchmark[]): CareerScore[] {
    try {
        const scores: CareerScore[] = [];

        // Pre-map question bank for faster lookup
        const answerKey = new Map(QUESTION_BANK.map(q => [q.id, q.correct_answer]));

        for (const benchmark of (benchmarks || [])) {
            const career_id = benchmark.career_id;

            // --- Personality ---
            let p_sum = 0;
            let p_count = 0;
            for (const [key, userVal] of Object.entries(normalized.personality || {})) {
                const bVal = benchmark.personality?.[key];
                if (bVal !== undefined) {
                    const similarity = 1 - Math.abs(Number(userVal) - Number(bVal)) / 4;
                    p_sum += similarity;
                    p_count++;
                }
            }
            const personality_score = p_count > 0 ? p_sum / p_count : 0;

            // --- Interest ---
            let i_sum = 0;
            let i_count = 0;
            for (const [key, userVal] of Object.entries(normalized.interest || {})) {
                const bVal = benchmark.interest?.[key];
                if (bVal !== undefined) {
                    const similarity = 1 - Math.abs(Number(userVal) - Number(bVal)) / 4;
                    i_sum += similarity;
                    i_count++;
                }
            }
            const interest_score = i_count > 0 ? i_sum / i_count : 0;

            // --- Aptitude ---
            let earned_weight = 0;
            let total_weight = 0;

            const aptitude_benchmarks = benchmark.aptitude || {};
            const user_aptitude_responses = normalized.aptitude || {};

            for (const [question_id, weight] of Object.entries(aptitude_benchmarks)) {
                const user_answer = user_aptitude_responses[question_id];
                const expected_answer = answerKey.get(question_id);

                if (expected_answer === undefined) {
                    console.log("MISSING QUESTION_BANK ENTRY", question_id);
                    continue;
                }

                // Normalize: string, trim, lowercase
                const user_val = String(user_answer || "").trim().toLowerCase();
                const expected_val = String(expected_answer).trim().toLowerCase();

                const is_correct = user_answer !== undefined && user_val === expected_val;
                const score = is_correct ? weight : 0;

                earned_weight += score;
                total_weight += weight;
            }

            const aptitude_score = total_weight > 0 ? earned_weight / total_weight : 0;

            // --- Final Score ---
            const final_score = (personality_score * 0.4) + (interest_score * 0.4) + (aptitude_score * 0.2);

            scores.push({
                career_id,
                personality_score,
                interest_score,
                aptitude_score,
                final_score
            });
        }

        // STEP 3 — RANKING
        scores.sort((a, b) => b.final_score - a.final_score);
        const topCareers = scores.slice(0, 10);

        return topCareers;

    } catch (e) {
        console.error("computeAllScores FAILED:", e);
        return [];
    }
}

