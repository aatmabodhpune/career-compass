import { RequestPayload, AlignmentResult, CareerSummary } from './types.ts';
import { getAssessmentBySessionId, fetchCareerBenchmarks, storeResults } from './repository.ts';
import { normalizeAll } from './normalizer.ts';
import { computeAllScores } from './scorer.ts';
import { rankAll } from './ranker.ts';
import { classifyResponses } from '../../../alignment-engine/classifier.ts';

import { analyzeStrengths } from '../../../alignment-engine/insights/strengthAnalyzer.ts';
import { generateRecommendations } from '../../../alignment-engine/insights/recommendationEngine.ts';
import { generateCareerExplanation } from '../../../alignment-engine/insights/explanationEngine.ts';
import { buildCareerSummaries } from '../../../alignment-engine/insights/careerSummaryBuilder.ts';
import { generateReportPlaceholder } from '../../../alignment-engine/insights/reportGenerator.ts';

export const computeAlignmentService = async (
    payload: RequestPayload
): Promise<AlignmentResult> => {
    console.log("SESSION RECEIVED:", payload.session_id);

    const session_id = payload.session_id;

    if (!session_id) {
        throw new Error("Session ID missing");
    }

    const assessment = await getAssessmentBySessionId(session_id);

    console.log("SESSION RECEIVED:", session_id);
    console.log("DB FETCH RESULT:", assessment);

    if (!assessment) {
        console.error("NO ROW FOUND FOR SESSION", session_id);
        throw new Error("Assessment not completed");
    }

    if (assessment && !assessment.responses) {
        console.error("NO RESPONSES FOUND", assessment);
        throw new Error("Assessment not completed");
    }

    const raw = assessment.responses;
    // Handle double-nested case: { responses: { p1: 3 } } vs { p1: 3 }
    const responses = raw?.responses ? raw.responses : raw;

    // TEMP: Reduced validation for testing/demo
    // MUST revert before production
    const IS_TEST_MODE = true;

    const FULL_REQUIREMENT = {
        personality: 20,
        interest: 30,
        aptitude: 15
    };

    const MIN_REQUIRED = IS_TEST_MODE
        ? {
            personality: 5,
            interest: 5,
            aptitude: 5
        }
        : FULL_REQUIREMENT;
    
    // ── CATEGORY-BASED COUNTING ──────────────────────────────────────────────
    const keys = Object.keys(responses);
    const pCount = keys.filter(k => k.startsWith("p")).length;
    const iCount = keys.filter(k => k.startsWith("i")).length;
    const aCount = keys.filter(k => k.startsWith("a")).length;

    console.log("VALIDATION COUNTS", {
        pCount,
        iCount,
        aCount,
        keys
    });

    if (
        pCount < MIN_REQUIRED.personality ||
        iCount < MIN_REQUIRED.interest ||
        aCount < MIN_REQUIRED.aptitude
    ) {
        console.error("VALIDATION FAILED", {
            pCount,
            iCount,
            aCount,
            required: MIN_REQUIRED
        });

        throw new Error("Assessment not completed");
    }
    // ──────────────────────────────────────────────────────────────────────────

    const benchmarks = await fetchCareerBenchmarks();
    
    console.log("RAW FROM DB:", responses);
    console.log("RAW FROM DB KEYS:", Object.keys(responses));

    // Classification: only apply if input is flat (p1, i1, a1 top-level keys)
    let structuredResponses = responses;

    const isFlat = Object.keys(responses).some(
        (key) => key.startsWith("p") || key.startsWith("i") || key.startsWith("a")
    );

    if (isFlat) {
        structuredResponses = classifyResponses(responses as any);
        console.log("CLASSIFIED (flat → structured):", structuredResponses);
    } else {
        console.log("ALREADY STRUCTURED:", structuredResponses);
    }

    console.log("BEFORE NORMALIZER:");
    console.log("PERSONALITY:", structuredResponses?.personality);
    console.log("INTEREST:", structuredResponses?.interest);
    console.log("APTITUDE:", structuredResponses?.aptitude);

    const normalized = normalizeAll(structuredResponses);
    console.log("NORMALIZED:", normalized);

    const scores = computeAllScores(normalized, benchmarks);
    console.log("TYPE OF SCORES:", typeof scores);
    console.log("IS ARRAY:", Array.isArray(scores));
    console.log("SCORES VALUE:", scores);

    console.log("APTITUDE CHECK:", {
        normalized: normalized.aptitude,
        scores: scores.map(s => s.aptitude_score)
    });

    const ranked = rankAll(scores);

    // 5.1 PREPARE SCORES
    const getAvg = (rec: Record<string, number>) => {
        const vals = Object.values(rec);
        return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    };
    
    const userScores = {
        personality: getAvg(normalized.personality),
        interest: getAvg(normalized.interest),
        aptitude: getAvg(normalized.aptitude)
    };

    let insights: any = null;
    let career_details: CareerSummary[] = [];

    try {
        const topCareerId = ranked.overall_top_10[0]?.career_id;
        const topBenchmark = benchmarks.find(b => b.career_id === topCareerId);
        
        const benchmarkScores = topBenchmark ? {
            personality: getAvg(topBenchmark.personality),
            interest: getAvg(topBenchmark.interest),
            aptitude: getAvg(topBenchmark.aptitude)
        } : { personality: 70, interest: 70, aptitude: 70 };

        const [strengthData, recommendationData] = await Promise.all([
            Promise.resolve(analyzeStrengths(userScores)),
            Promise.resolve(generateRecommendations(userScores, benchmarkScores))
        ]);

        const explanations = ranked.overall_top_10.map(c => {
            const career = { id: c.career_id, name: c.career_id };
            return generateCareerExplanation(career, userScores);
        });

        insights = {
            strengths: strengthData.strengths,
            weaknesses: strengthData.weaknesses,
            recommendations: recommendationData.recommendations
        };

        const summaries = buildCareerSummaries({
            careers: ranked.overall_top_10.map(c => ({ career_id: c.career_id, score: c.final_score })),
            explanations,
            insights
        });

        career_details = summaries.career_details;
    } catch (error) {
        console.error("Insight Engine Failure:", error);
    }

    // ── SORT ALL ARRAYS DESC (Sprint 5 — Data Preparation) ──
    ranked.overall_top_10.sort((a, b) => b.final_score - a.final_score);
    ranked.personality_top_10.sort((a, b) => b.personality_score - a.personality_score);
    ranked.interest_top_10.sort((a, b) => b.interest_score - a.interest_score);
    ranked.aptitude_top_10.sort((a, b) => b.aptitude_score - a.aptitude_score);

    const finalResponse = {
        ...ranked,
        overall_top_10: ranked.overall_top_10.map(c => ({
            ...c,
            aptitude_score: c.aptitude_score
        })),
        insights: insights || { strengths: [], weaknesses: [], recommendations: [] },
        career_details: career_details || [],
        report: generateReportPlaceholder()
    };

    // 6. DB Native Insertion (saving only ranking bounds avoiding DB schema mutations)
    await storeResults(payload.session_id, ranked);

    // 7. Push formatted explicitly natively.
    return finalResponse;
};
