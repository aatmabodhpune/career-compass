import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateToken } from "../utils/auth.util.ts";

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

export async function submitAssessment(token: string, session_id: string) {
    if (!token || !session_id) return { data: null, error: "Token and session_id are required" };

    const student = await validateToken(token);
    if (!student) return { data: null, error: "Invalid token" };

    // TODO: Enforce RLS using school_id
    const { id: student_id, school_id } = student;

    const { data: session, error: sessErr } = await supabase
        .from("assessment_sessions")
        .select("status")
        .eq("id", session_id)
        .eq("student_id", student_id)
        .eq("school_id", school_id)
        .maybeSingle();

    if (sessErr || !session) return { data: null, error: "Invalid session ownership" };
    if (session.status === "completed") return { data: null, error: "Assessment already submitted" };

    const { error: updateErr } = await supabase
        .from("assessment_sessions")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", session_id);

    if (updateErr) return { data: null, error: "Failed to close session" };

    return { data: { success: true }, error: null };
}
