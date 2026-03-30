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

// Replaced unstructured classification logic permanently in favor of explicit dimensional mapping.

export async function fetchAssessmentResponses(session_id: string): Promise<any> {
    console.log("STEP 1: FETCH START", session_id);
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
        .from('assessment_responses')
        .select('responses')
        .eq('session_id', session_id);

    console.log("STEP 2: DB RESULT:", data);
    console.log("STEP 2: DB ERROR:", error);

    if (error) {
        throw new Error(`Error fetching assessment responses: ${error.message}`);
    }

    if (!data || data.length === 0) {
        throw new Error("No responses found for session");
    }

    const raw = data[0].responses;

    // Handle double-nested case: { responses: { p1: 3 } } vs { p1: 3 }
    const responses = raw?.responses ? raw.responses : raw;

    console.log("STEP 3: RETURN VALUE:", responses);
    return responses;
}

export async function verifyAssessmentSession(session_id: string): Promise<void> {
    const supabase = getSupabaseClient();
    
    const { data: session, error } = await supabase
        .from('assessment_sessions')
        .select('status')
        .eq('id', session_id)
        .single();
        
    if (error || !session) {
        throw new Error("Session not found");
    }
    
    if (session.status !== "completed") {
        throw new Error("Assessment not completed");
    }
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

    console.log("BENCHMARKS:", data);

    return data.map((row: any) => {
        if (!row.benchmark_scores) {
            console.error("Invalid benchmark_scores for row:", row.id);
            throw new Error(`Invalid benchmark_scores for ID: ${row.id}`);
        }

        const bs = row.benchmark_scores;

        return {
            career_id: row.id,
            personality: bs.personality,
            interest: bs.interest,
            aptitude: bs.aptitude,
            weights: bs.weights
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
