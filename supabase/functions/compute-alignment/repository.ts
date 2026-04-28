import { AssessmentResponses, CareerBenchmark, RankedResults } from './types.ts';

// Replaced unstructured classification logic permanently in favor of explicit dimensional mapping.

export const getAssessmentBySessionId = async (session_id: string, supabase: any) => {
    const { data, error } = await supabase
        .from("assessment_responses")
        .select("responses")
        .eq("session_id", session_id)
        .single();

    if (error || !data || !data.responses) {
        throw new Error("No assessment responses");
    }

    console.log("DB FETCH RESULT:", data);
    return data;
};

export async function verifyAssessmentSession(session_id: string, supabase: any): Promise<void> {
    
    const { data: session, error } = await supabase
        .from('assessment_sessions')
        .select('status')
        .eq('id', session_id)
        .single();
        
    if (error || !session) {
        throw new Error("Session not found");
    }
    
    if (session.status !== "completed") {
        const assessment = await getAssessmentBySessionId(session_id, supabase);

        // Account for double-nesting if responses is stored recursively in DB
        const raw = assessment?.responses;
        const responses = raw?.responses ? raw.responses : (raw || {});
        
        const personalityAnswers = responses.personality || {};
        const interestAnswers = responses.interest || {};
        const aptitudeAnswers = responses.aptitude || {};

        const pCount = Object.keys(personalityAnswers).length;
        const iCount = Object.keys(interestAnswers).length;
        const aCount = Object.keys(aptitudeAnswers).length;

        const IS_TEST_MODE = true;

        const MIN_REQUIRED = IS_TEST_MODE
            ? { personality: 5, interest: 5, aptitude: 5 }
            : { personality: 20, interest: 30, aptitude: 15 };

        const isCompleted =
            pCount >= MIN_REQUIRED.personality &&
            iCount >= MIN_REQUIRED.interest &&
            aCount >= MIN_REQUIRED.aptitude;

        if (!isCompleted) {
            throw new Error("Assessment not completed");
        }
    }
}

export async function fetchCareerBenchmarks(supabase: any): Promise<CareerBenchmark[]> {
    
    // Fetch active benchmarks mapping strict JSONB structures returning exactly specific parameters internally
    const { data, error } = await supabase
        .from('career_benchmarks')
        .select('id, benchmark_scores')
        .eq('active', true);

    if (error) {
        throw new Error(`Error fetching career benchmarks: ${error.message}`);
    }

    if (!data || data.length === 0) {
        throw new Error("No active career benchmarks found.");
    }

    console.log("BENCHMARKS:", data);

    return data.map((row: any) => {
        if (!row.benchmark_scores) {
            console.error("Invalid benchmark_scores for row:", row.id);
            throw new Error(`Invalid benchmark_scores for ID: ${row.id}`);
        }

        const bs = row.benchmark_scores;

        const normalizeTo5 = (obj: Record<string, number> | undefined) => {
            if (!obj) return {};
            const res: Record<string, number> = {};
            for (const [k, v] of Object.entries(obj)) {
                // Deterministic 0-100 to 1-5 scaling
                res[k] = (v / 100) * 4 + 1;
            }
            return res;
        };

        return {
            career_id: row.id,
            personality: normalizeTo5(bs.personality),
            interest: normalizeTo5(bs.interest),
            aptitude: bs.aptitude, 
            weights: bs.weights
        };
    }) as CareerBenchmark[];
}

export async function storeResults(session_id: string, results: RankedResults, supabase: any): Promise<void> {
    
    // Exact schema mappings excluding structural modifications directly syncing mapped ranking constants
    const { error } = await supabase
        .from('alignment_results')
        .insert({
            session_id,
            results_json: results,
            top_careers: results.overall_top_10
        });

    // Rigid rejection if DB commit hooks fail 
    if (error) {
        throw new Error(`Error storing career recommendations: ${error.message}`);
    }
}
