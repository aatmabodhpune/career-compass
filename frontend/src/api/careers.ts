import { supabase } from '../lib/supabaseClient';

export async function fetchCareersMap(): Promise<Record<string, string>> {
    try {
        console.log("CAREERS API EXECUTED");
        const { data, error } = await supabase
            .from("career_benchmarks")
            .select("id, career_name");

        if (error) {
            console.error("Error fetching careers:", error);
            return {};
        }

        const map: Record<string, string> = {};
        if (data) {
            data.forEach((item: any) => {
                if (!map[item.id]) {
                    map[item.id] = item.career_name;
                }
            });
        }

        return map;
    } catch (err) {
        console.error("Unexpected error fetching careers:", err);
        return {};
    }
}