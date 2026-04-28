export async function submitAssessment(payload: any, supabase: any) {
    // 1. Verify payload shape
    const { session_id } = payload;
    
    if (!session_id) {
        const reason = "Missing session_id in payload";
        console.error("SUBMIT FAILURE REASON:", reason);
        return { data: null, error: reason };
    }

    // 2. Verify session exists
    const { data: sessionData, error: sessErr } = await supabase
        .from("assessment_sessions")
        .select("student_id, school_id, status")
        .eq("id", session_id)
        .maybeSingle();

    console.log("SESSION LOOKUP:", session_id, sessionData);

    if (sessErr || !sessionData) {
        const reason = "Session not found or invalid ownership";
        console.error("SUBMIT FAILURE REASON:", reason);
        return { data: null, error: "Invalid session ownership" };
    }

    if (sessionData.status === "completed") {
        const reason = "Session is already marked as completed";
        console.error("SUBMIT FAILURE REASON:", reason);
        return { data: null, error: "Assessment already submitted" };
    }

    // 3. Verify responses retrieval
    const { data: responseRecord, error: respErr } = await supabase
        .from("assessment_responses")
        .select("responses")
        .eq("session_id", session_id)
        .maybeSingle();

    if (respErr || !responseRecord) {
        const reason = "No responses found in database to submit";
        console.error("SUBMIT FAILURE REASON:", reason);
        return { data: null, error: "No responses found to submit" };
    }

    const responses = responseRecord.responses || {};
    console.log("RESPONSES FROM DB:", responses);

    // 4. Validate response structure compatibility
    const isNested = responses.personality || responses.interest || responses.aptitude;

    let pCount = 0;
    let iCount = 0;
    let aCount = 0;

    if (isNested) {
        pCount = Object.keys(responses.personality || {}).length;
        iCount = Object.keys(responses.interest || {}).length;
        aCount = Object.keys(responses.aptitude || {}).length;
    } else {
        const keys = Object.keys(responses || {});
        pCount = keys.filter(k => k.startsWith("p")).length;
        iCount = keys.filter(k => k.startsWith("i")).length;
        aCount = keys.filter(k => k.startsWith("a")).length;
    }

    // 5. Log validation counts
    console.log("VALIDATION COUNTS:", { pCount, iCount, aCount, required: { personality: 5, interest: 5, aptitude: 5 } });

    // Validate minimum thresholds
    if (pCount < 5 || iCount < 5 || aCount < 5) {
        const reason = `Assessment not completed. Short of required counts.`;
        console.error("SUBMIT FAILURE REASON:", reason);
        return { data: null, error: "Assessment not completed" };
    }

    // Update status to completed
    const { error: updateErr } = await supabase
        .from("assessment_sessions")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", session_id);

    if (updateErr) {
        const reason = "Failed to update session status to completed: " + updateErr.message;
        console.error("SUBMIT FAILURE REASON:", reason);
        return { data: null, error: "Failed to close session" };
    }

    return { data: { session_id }, error: null };
}
