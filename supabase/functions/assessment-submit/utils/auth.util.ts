export async function validateToken(token: string, supabase: any) {
    if (!token) return null;
    const { data, error } = await supabase
        .from("students")
        .select("id, school_id")
        .eq("token", token.trim())
        .maybeSingle();

    if (error || !data) return null;
    return { id: data.id, school_id: data.school_id };
}
