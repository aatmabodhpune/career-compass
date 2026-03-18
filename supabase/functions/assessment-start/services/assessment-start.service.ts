import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateToken } from "../utils/auth.util.ts";

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

export async function startAssessment(token: string) {
    if (!token) return { data: null, error: "Token is required" };

    const student = await validateToken(token);
    if (!student) return { data: null, error: "Invalid token" };

    // TODO: Enforce RLS using school_id
    const { id: student_id, school_id } = student;

    // Check existing session
    const { data: existingSession, error: checkErr } = await supabase
        .from("assessment_sessions")
        .select("id")
        .eq("student_id", student_id)
        .eq("school_id", school_id)
        .eq("status", "in_progress")
        .maybeSingle();

    if (checkErr) return { data: null, error: "Database error checking session" };

    if (existingSession) {
        return { data: { session_id: existingSession.id }, error: null };
    }

    // Create new session
    const { data: newSession, error: insertErr } = await supabase
        .from("assessment_sessions")
        .insert({
            student_id,
            school_id,
            status: "in_progress",
            started_at: new Date().toISOString()
        })
        .select("id")
        .single();

    if (insertErr || !newSession) return { data: null, error: "Failed to create session" };

    return { data: { session_id: newSession.id }, error: null };
}
