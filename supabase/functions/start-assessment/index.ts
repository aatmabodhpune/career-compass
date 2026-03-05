import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
    return new Response(
        JSON.stringify({ message: "start-assessment function placeholder" }),
        { headers: { "Content-Type": "application/json" } },
    );
});
