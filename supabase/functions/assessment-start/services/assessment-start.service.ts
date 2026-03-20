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

    // Defensive session handling for legacy / inconsistent data.
    // Fetch ALL sessions for this student+school, then select/dedupe the latest valid in_progress.
    const { data: sessions, error: sessionsErr } = await supabase
        .from("assessment_sessions")
        .select("*")
        .eq("student_id", student_id)
        .eq("school_id", school_id);

    if (sessionsErr) return { data: null, error: "Database error fetching sessions" };

    const safeSessions = Array.isArray(sessions) ? sessions : [];

    console.log("Sessions found:", safeSessions.length);

    const inProgressSessions = safeSessions.filter((s: any) => s?.status === "in_progress");

    const validSessions = inProgressSessions.filter((s: any) => {
        return Boolean(s?.id) && Boolean(s?.school_id) && s.school_id === school_id;
    });

    const invalidSessions = inProgressSessions.filter((s: any) => !validSessions.some((vs: any) => vs?.id === s?.id));

    // If we found invalid in-progress sessions, delete them to prevent bad state.
    if (invalidSessions.length > 0) {
        const invalidIds = invalidSessions.map((s: any) => s?.id).filter(Boolean);
        if (invalidIds.length > 0) {
            const { error: delErr } = await supabase
                .from("assessment_sessions")
                .delete()
                .in("id", invalidIds);
            if (delErr) {
                console.error("Failed to delete invalid sessions:", delErr);
                return { data: null, error: "Database error deleting invalid sessions" };
            }
        }
    }

    console.log("Valid sessions:", validSessions.length);

    // Case D: invalid session (missing school_id / mismatch) -> create a fresh session
    if (invalidSessions.length > 0) {
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

        console.log("Using session:", newSession.id);
        return { data: { session_id: newSession.id }, error: null };
    }

    // Case A: no session (or no valid in-progress after cleanup) => create a new one
    if (validSessions.length === 0) {
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

        console.log("Using session:", newSession.id);
        return { data: { session_id: newSession.id }, error: null };
    }

    // Case B/C: one or multiple valid sessions => keep latest started_at, delete the rest
    const sorted = [...validSessions].sort((a: any, b: any) => {
        const aTime = a?.started_at ? new Date(a.started_at).getTime() : 0;
        const bTime = b?.started_at ? new Date(b.started_at).getTime() : 0;
        return bTime - aTime;
    });

    const session_id = sorted[0].id;

    const idsToDelete = sorted.slice(1).map((s: any) => s?.id).filter(Boolean);
    if (idsToDelete.length > 0) {
        const { error: delErr } = await supabase
            .from("assessment_sessions")
            .delete()
            .in("id", idsToDelete);
        if (delErr) {
            console.error("Failed to delete duplicate sessions:", delErr);
            return { data: null, error: "Database error deleting duplicate sessions" };
        }
    }

    console.log("Using session:", session_id);
    return { data: { session_id }, error: null };
}
