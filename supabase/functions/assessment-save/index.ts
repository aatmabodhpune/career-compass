import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { saveAssessment } from "./services/assessment-save.service.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return new Response(JSON.stringify({ data: null, error: "Method Not Allowed" }), { status: 405, headers: corsHeaders });
    }

    try {
        const body = await req.json();
        const result = await saveAssessment(body);

        return new Response(JSON.stringify(result), {
            status: result.error ? 400 : 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    } catch (err: any) {
        return new Response(
            JSON.stringify({ data: null, error: err.message || "Invalid JSON" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
