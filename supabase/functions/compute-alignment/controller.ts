import { computeAlignmentService } from "./service.ts";
import { verifyAssessmentSession } from "./repository.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export async function handleRequest(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ data: null, error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const cloned = req.clone();
  console.log("RAW:", await cloned.text());

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ data: null, error: "Invalid JSON body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  console.log("PARSED:", body);

  // ── Approved validation (session_id only) ──────────────────────────────────
  if (!body || typeof body !== "object") {
    console.log("VALIDATION FAIL: body is not an object:", body);
    return new Response(
      JSON.stringify({ data: null, error: "Invalid input" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { session_id } = body;

  if (!session_id || typeof session_id !== "string") {
    console.log("VALIDATION FAIL: missing or invalid session_id:", session_id);
    return new Response(
      JSON.stringify({ data: null, error: "Invalid session_id" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(session_id)) {
    console.log("VALIDATION FAIL: session_id is not a valid UUID:", session_id);
    return new Response(
      JSON.stringify({ data: null, error: "Invalid session_id format" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  // ──────────────────────────────────────────────────────────────────────────

  try {
    console.log("Compute alignment started for session:", session_id);

    // Verify session exists and is completed — user context derived internally from DB
    await verifyAssessmentSession(session_id);

    const result = await computeAlignmentService({ session_id });
    
    console.log("Compute alignment completed successfully for session:", session_id);

    return new Response(
      JSON.stringify({ data: result, error: null }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (err: any) {
    console.error("API Error:", err.message);
    const msg = err.message;

    if (msg === "Session not found" || msg === "Assessment not completed" || msg === "Invalid input" || msg.includes("No assessment responses")) {
      return new Response(
        JSON.stringify({ data: null, error: msg.includes("No assessment responses") ? "Invalid input" : msg }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (msg === "Unauthorized") {
      return new Response(
        JSON.stringify({ data: null, error: msg }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // 5. ERROR STANDARDIZATION
    return new Response(
      JSON.stringify({ data: null, error: err.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
}
