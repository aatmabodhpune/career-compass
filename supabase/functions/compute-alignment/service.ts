import { RequestPayload, AlignmentResult } from './types.ts';
import { fetchAssessmentResponses, fetchCareerBenchmarks, storeResults } from './repository.ts';
import { normalizeAll } from './normalizer.ts';
import { computeAllScores } from './scorer.ts';
import { rankAll } from './ranker.ts';

export async function computeAlignmentService(payload: RequestPayload): Promise<AlignmentResult> {
    const responses = await fetchAssessmentResponses(payload.session_id);
    const benchmarks = await fetchCareerBenchmarks();
    
    // 3. Normalize pure fetch data into absolute structured 0-100 scales synchronously.
    const normalized = normalizeAll(responses);
    
    // 4. Compute Scores via strict formulas mapped against benchmarks
    const scores = computeAllScores(normalized, benchmarks);

    // 5. Rank globally executing slicing without implicit variable destruction
    const ranked = rankAll(scores);

    // 6. DB Native Insertion
    await storeResults(payload.session_id, ranked);

    // 7. Push formatted explicitly natively.
    return ranked;
}
