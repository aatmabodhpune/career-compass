import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateToken } from "../utils/auth.util.ts";

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

export async function saveAssessment(payload: any) {
    const { token, session_id, responses } = payload;

    if (!token || !session_id || !responses || typeof responses !== "object") {
        return { data: null, error: "Missing required fields or invalid responses format" };
    }

    const student = await validateToken(token);
    if (!student) return { data: null, error: "Invalid token" };

    // TODO: Enforce RLS using school_id
    const { id: student_id, school_id } = student;

    // Validate session ownership
    const { data: session, error: sessErr } = await supabase
        .from("assessment_sessions")
        .select("id")
        .eq("id", session_id)
        .eq("student_id", student_id)
        .eq("school_id", school_id)
        .maybeSingle();

    if (sessErr || !session) return { data: null, error: "Invalid session ownership" };

    // 1. Fetch existing record
    const { data: existingRecord, error: fetchErr } = await supabase
        .from("assessment_responses")
        .select("responses")
        .eq("session_id", session_id)
        .maybeSingle();

    if (fetchErr) return { data: null, error: "Failed to fetch existing responses" };

    // 2-3. Merge existing + new responses
    const existingResponses = existingRecord?.responses || {};
    const mergedResponses = { ...existingResponses, ...responses };

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
