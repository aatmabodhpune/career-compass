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
import { getCareerDetails } from '../../../alignment-engine/enrichment/getCareerDetails.ts';

export const computeAlignmentService = async (
    payload: RequestPayload,
    supabase: any
): Promise<AlignmentResult> => {
    const session_id = payload.session_id;

    if (!session_id) {
        throw new Error("Session ID missing");
    }

    const assessment = await getAssessmentBySessionId(session_id, supabase);

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
    // 🔍 Detect structure
    const isNested =
        responses.personality || responses.interest || responses.aptitude;

    let pCount = 0;
    let iCount = 0;
    let aCount = 0;

    if (isNested) {
        // ✅ NEW STRUCTURE
        pCount = Object.keys(responses.personality || {}).length;
        iCount = Object.keys(responses.interest || {}).length;
        aCount = Object.keys(responses.aptitude || {}).length;
    } else {
        // ✅ LEGACY STRUCTURE
        const keys = Object.keys(responses || {});
        pCount = keys.filter(k => k.startsWith("p")).length;
        iCount = keys.filter(k => k.startsWith("i")).length;
        aCount = keys.filter(k => k.startsWith("a")).length;
    }

    // 🔥 REQUIRED DEBUG LOG (DO NOT REMOVE)
    console.log("VALIDATION COUNTS:", {
        isNested: !!isNested,
        pCount,
        iCount,
        aCount,
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

    const benchmarks = await fetchCareerBenchmarks(supabase);
    
    // STEP 3 — BUILD STRUCTURED INPUT (CRITICAL FIX)
    const structuredInput: any = {
        personality: {},
        interest: {},
        aptitude: {}
    };

    if (Array.isArray(responses)) {
        // CASE B — MULTIPLE ROWS
        responses.forEach((r: any) => {
            if (r.section === "personality") structuredInput.personality = r.responses || {};
            if (r.section === "interest") structuredInput.interest = r.responses || {};
            if (r.section === "aptitude") structuredInput.aptitude = r.responses || {};
        });
    } else if (responses.personality || responses.interest || responses.aptitude) {
        // CASE A — NESTED FORMAT
        structuredInput.personality = responses.personality || {};
        structuredInput.interest = responses.interest || {};
        structuredInput.aptitude = responses.aptitude || {};
    } else {
        // CASE C — FLAT FORMAT (LEGACY)
        const flat = responses || {};
        Object.entries(flat).forEach(([key, val]) => {
            if (key.startsWith("p")) structuredInput.personality[key] = val;
            if (key.startsWith("i")) structuredInput.interest[key] = val;
            if (key.startsWith("a")) structuredInput.aptitude[key] = val;
        });
    }

    // Apply normalizer to convert raw DB scores into proper scoring weights
    const normalized = normalizeAll(structuredInput);

    // STEP 5 — PASS THIS OBJECT INTO SCORER
    const scores = computeAllScores(normalized, benchmarks);

    const ranked = rankAll(scores);

    // 5.1 PREPARE SCORES
    const getAvg = (rec: Record<string, number>) => {
        const vals = Object.values(rec);
        return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    };
    
    const userScores = {
        personality: getAvg(normalized.personality),
        interest: getAvg(normalized.interest),
        aptitude: 0
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

    // DB Native Insertion (saving only ranking bounds avoiding DB schema mutations)
    await storeResults(payload.session_id, ranked, supabase);

    // Ensure scoring outputs exist
    const careers = ranked.overall_top_10 || [];
    const personality_alignment = ranked.personality_top_10 || {};
    const interest_alignment = ranked.interest_top_10 || {};
    const aptitude_alignment = ranked.aptitude_top_10 || {};

    // Temporary safe insights (MVP)
    const strengths = [
        "Strong personality alignment",
        "Consistent interest patterns"
    ];

    const improvements = [
        "Improve aptitude performance"
    ];

    const recommendations = [
        "Explore careers through projects and internships",
        "Practice logical reasoning and problem solving"
    ];

    // STEP 1 — Extract IDs
    const topCareerIds = careers.map((c: any) => c.career_id);

    // STEP 2 — Fetch details
    const careerDetails = await getCareerDetails(supabase, topCareerIds);

    // Final response object (CRITICAL)
    const finalResult = {
        careers,
        personality_alignment: ranked.personality_top_10 || [],
        interest_alignment: ranked.interest_top_10 || [],
        aptitude_alignment: ranked.aptitude_top_10 || [],
        strengths,
        improvements,
        recommendations,
        career_details: careerDetails
    };

    return {
        data: finalResult,
        error: null
    };
};
