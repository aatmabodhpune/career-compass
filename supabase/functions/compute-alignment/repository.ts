import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { AssessmentResponses, CareerBenchmark, RankedResults } from './types.ts';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
    if (supabaseInstance) {
        return supabaseInstance;
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey);
    return supabaseInstance;
}

export function classifyResponses(responses: Record<string, any>): AssessmentResponses {
    const personality: Record<string, number[]> = {};
    const interest: Record<string, number[]> = {};
    const aptitude: Record<string, any> = {};

    let hasPersonality = false;
    let hasInterest = false;
    let hasAptitude = false;

    for (const [key, value] of Object.entries(responses)) {
        if (typeof key !== 'string') continue;
        
        if (key.startsWith('p')) {
            if (typeof value === 'number') {
                if (!personality[key]) personality[key] = [];
                personality[key].push(value);
                hasPersonality = true;
            }
        } else if (key.startsWith('i')) {
            if (typeof value === 'number') {
                if (!interest[key]) interest[key] = [];
                interest[key].push(value);
                hasInterest = true;
            }
        } else if (key.startsWith('a')) {
            aptitude[key] = value;
            hasAptitude = true;
        }
    }

    if (!hasPersonality && !hasInterest && !hasAptitude) {
        throw new Error("No recognized categorical keys (p/i/a) found in assessment responses.");
    }

    if (!hasPersonality || !hasInterest || !hasAptitude) {
        throw new Error("Missing one or more required categories (personality, interest, or aptitude).");
    }

    return { personality, interest, aptitude };
}

export async function fetchAssessmentResponses(session_id: string): Promise<AssessmentResponses> {
    const supabase = getSupabaseClient();
    
    // Explicit targeting avoiding rigid legacy `assessment_type` boundaries seamlessly combining generic unstructured JSONB outputs.
    const { data, error } = await supabase
        .from('assessment_responses')
        .select('responses')
        .eq('session_id', session_id);

    if (error) {
        throw new Error(`Error fetching assessment responses: ${error.message}`);
    }

    // Safely trap empty maps preventing silent fails downstream
    if (!data || data.length === 0) {
        throw new Error("No assessment responses found for the given session.");
    }

    const mergedResponses: Record<string, any> = {};
    for (const row of data) {
        if (row.responses && typeof row.responses === 'object') {
            Object.assign(mergedResponses, row.responses);
        }
    }

    return classifyResponses(mergedResponses);
}

export async function fetchCareerBenchmarks(): Promise<CareerBenchmark[]> {
    const supabase = getSupabaseClient();
    
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

    return data.map((row: any) => {
        const scores = row.benchmark_scores;
        
        if (!scores || !scores.personality || !scores.interest || !scores.aptitude || !scores.weights) {
            throw new Error(`Invalid benchmark_scores structure for ID: ${row.id}`);
        }

        return {
            career_id: row.id,
            personality: scores.personality,
            interest: scores.interest,
            aptitude: scores.aptitude,
            weights: scores.weights
        };
    }) as CareerBenchmark[];
}

export async function storeResults(session_id: string, results: RankedResults): Promise<void> {
    const supabase = getSupabaseClient();
    
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
