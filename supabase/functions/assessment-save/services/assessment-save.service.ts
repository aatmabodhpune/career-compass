import { validateToken } from "../utils/auth.util.ts";

export async function saveAssessment(payload: any, supabase: any) {
    const { session_id, section, responses: incomingResponses } = payload;

    if (!session_id || !section || !incomingResponses || typeof incomingResponses !== "object") {
        return { data: null, error: "Invalid payload structure: missing required fields or invalid responses format" };
    }

    // Resolve student context from session_id (authority)
    const { data: session, error: sessErr } = await supabase
        .from("assessment_sessions")
        .select("student_id, school_id")
        .eq("id", session_id)
        .single();

    if (sessErr || !session) {
        console.error("SESSION RECOVERY ERROR:", sessErr);
        return { data: null, error: "Invalid session or session not found" };
    }

    const { student_id, school_id } = session;

    // 1. Fetch existing record
    const { data: existingRecord, error: fetchErr } = await supabase
        .from("assessment_responses")
        .select("responses")
        .eq("session_id", session_id)
        .maybeSingle();

    if (fetchErr) return { data: null, error: "Failed to fetch existing responses" };

    // 2-3. Merge existing + new responses (Safe Section Merge)
    const existingResponses = existingRecord?.responses || {};

    const mergedResponses = {
        ...existingResponses,
        [section]: {
            ...(existingResponses[section] || {}),
            ...incomingResponses
        }
    };

    // 4. Upsert session_id + full context + merged JSON
    const { error: upsertErr } = await supabase
        .from("assessment_responses")
        .upsert(
            {
                session_id,
                student_id,
                school_id,
                responses: mergedResponses,
                updated_at: new Date().toISOString()
            },
            { onConflict: "session_id" }
        );

    if (upsertErr) return { data: null, error: upsertErr?.message || "Unknown error" };
    
    console.log("UPSERT ERROR:", upsertErr);
    
    return { data: { success: true }, error: null };
}
