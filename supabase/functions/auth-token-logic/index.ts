import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// ✅ CORS HEADERS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request): Promise<Response> => {
  // ✅ HANDLE PREFLIGHT
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // ❌ METHOD VALIDATION
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ data: null, error: "Method Not Allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // ✅ PARSE BODY
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = body?.token;

    // ❌ VALIDATE TOKEN
    if (!token || typeof token !== "string" || token.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Token is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ✅ CALL SERVICE
    const authToken = token.trim();
    const { data: student, error } = await getStudentByToken(supabase, authToken);

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Database query failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!student) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const student_id = student.id;
    const school_id = student.school_id;

    if (!student_id) {
      return new Response(
        JSON.stringify({ error: "Student record is malformed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ✅ CHECK EXISTING SESSION
    const { data: existing, error: existingError } = await supabase
      .from("assessment_sessions")
      .select("id")
      .eq("student_id", student_id)
      .eq("status", "in_progress")
      .maybeSingle();

    if (existingError) {
      console.error("EXISTING SESSION CHECK ERROR:", existingError);
    }

    let session: { id: string };

    if (existing) {
      session = existing;
      console.log("REUSING EXISTING SESSION:", session.id);
    } else {
      // ✅ CREATE NEW SESSION
      const { data: newSession, error: sessionError } = await supabase
        .from("assessment_sessions")
        .insert({
          student_id,
          school_id,
          status: "in_progress",
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      console.log("SESSION INSERT RESULT:", newSession, sessionError);

      if (sessionError || !newSession) {
        return new Response(
          JSON.stringify({
            error: sessionError?.message || "Failed to initialize assessment session",
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      session = newSession;
    }

    // ✅ GENERATE JWT
    const { data: jwtData, error: jwtError } =
      await supabase.auth.signInAnonymously();

    if (jwtError) {
      console.error("ANON AUTH ERROR:", jwtError);
    }

    if (!jwtData?.session?.access_token) {
      console.error("JWT DATA MISSING:", jwtData);

      return new Response(
        JSON.stringify({
          error: "JWT generation failed",
          details: jwtError?.message || "No session returned",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const jwt = jwtData.session.access_token;

    return new Response(
      JSON.stringify({
        data: {
          id: student.id,
          name: student.name,
          grade: student.grade,
          school_id: student.school_id,
          session_id: session.id,
          token: jwt,
        },
        error: null,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Critical function error:", err);

    return new Response(
      JSON.stringify({ error: "An unexpected internal error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// ✅ HELPER
async function getStudentByToken(supabase: any, token: string) {
  const { data, error } = await supabase
    .from("students")
    .select("id, name, grade, school_id")
    .eq("token", token)
    .maybeSingle();

  return { data, error };
}