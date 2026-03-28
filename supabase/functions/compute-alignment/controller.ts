import { computeAlignmentService } from "./service.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export async function handleRequest(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders
    });
  }

  const body = await req.json();
  console.log("BODY:", body);
  
  const session_id = body?.session_id;
  console.log("SESSION_ID:", session_id);
  
  const school_id = body?.school_id;

  if (!session_id) {
    return new Response(
      JSON.stringify({ error: "Missing session_id", received: body }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  try {
    const result = await computeAlignmentService({ session_id, school_id });

    return new Response(
      JSON.stringify({ data: result, error: null }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ data: null, error: err.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
}
