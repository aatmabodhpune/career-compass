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

export const getAssessmentBySessionId = async (session_id: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from("assessment_responses")
        .select("responses")
        .eq("session_id", session_id)
        .maybeSingle();

    if (error) {
        console.error("DB ERROR:", error);
        throw new Error("Failed to fetch assessment");
    }

    console.log("DB FETCH RESULT:", data);

    return data;
};

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
        const assessment = await getAssessmentBySessionId(session_id);

        // Account for double-nesting if responses is stored recursively in DB
        const raw = assessment?.responses;
        const responses = raw?.responses ? raw.responses : (raw || {});
        
        const keys = Object.keys(responses);

        const pCount = keys.filter(k => k.startsWith("p")).length;
        const iCount = keys.filter(k => k.startsWith("i")).length;
        const aCount = keys.filter(k => k.startsWith("a")).length;

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
