import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

export async function validateToken(token: string) {
    if (!token) return null;
    const { data, error } = await supabase
        .from("students")
        .select("id, school_id")
        .eq("token", token.trim())
        .maybeSingle();

    if (error || !data) return null;
    return { id: data.id, school_id: data.school_id };
}
