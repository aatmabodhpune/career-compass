import { RequestPayload, AlignmentResult, CareerSummary } from './types.ts';
import { fetchAssessmentResponses, fetchCareerBenchmarks, storeResults } from './repository.ts';
import { normalizeAll } from './normalizer.ts';
import { computeAllScores } from './scorer.ts';
import { rankAll } from './ranker.ts';
import { classifyResponses } from '../../../alignment-engine/classifier.ts';

import { analyzeStrengths } from '../../../alignment-engine/insights/strengthAnalyzer.ts';
import { generateRecommendations } from '../../../alignment-engine/insights/recommendationEngine.ts';
import { generateCareerExplanation } from '../../../alignment-engine/insights/explanationEngine.ts';
import { buildCareerSummaries } from '../../../alignment-engine/insights/careerSummaryBuilder.ts';
import { generateReportPlaceholder } from '../../../alignment-engine/insights/reportGenerator.ts';

export async function computeAlignmentService(payload: RequestPayload): Promise<AlignmentResult> {
    console.log("🔥 SERVICE EXECUTION CONFIRMED");

    const responses = await fetchAssessmentResponses(payload.session_id);
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

    const finalResponse = {
        ...ranked,
        insights: insights || { strengths: [], weaknesses: [], recommendations: [] },
        career_details: career_details || [],
        report: generateReportPlaceholder()
    };

    // 6. DB Native Insertion (saving only ranking bounds avoiding DB schema mutations)
    await storeResults(payload.session_id, ranked);

    // 7. Push formatted explicitly natively.
    return finalResponse;
}
