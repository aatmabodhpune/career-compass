/// <reference lib="deno.ns" />

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
    const body = await req.json();
    const token = body?.token;

    // ❌ VALIDATE TOKEN
    if (!token || typeof token !== "string" || token.trim() === "") {
      return new Response(
        JSON.stringify({ data: null, error: "Token is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ✅ CALL SERVICE
    const { data, error } = await getStudentByToken(supabase, token.trim());

    if (error) {
      return new Response(
        JSON.stringify({ data: null, error: "Internal server error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!data) {
      return new Response(
        JSON.stringify({ data: null, error: "Invalid token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ✅ EXTRACT STUDENT CONTEXT
    const student_id = data.id;
    const school_id = data.school_id;

    // TODO: Enforce RLS using school_id for tenant isolation

    // ✅ SUCCESS
    return new Response(
      JSON.stringify({
        data: {
          id: data.id,
          name: data.name,
          grade: data.grade,
          school_id: data.school_id,
        },
        error: null,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ data: null, error: "Invalid JSON body" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// TODO: Move to separate service file when using Supabase CLI

async function getStudentByToken(supabase: any, token: string) {
  const { data, error } = await supabase
    .from("students")
    .select("id, name, grade, school_id")
    .eq("token", token)
    .maybeSingle();

  return { data, error };
}