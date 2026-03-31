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

// ── Sprint 5: Global career name mapping ─────────────────────────────────────

interface CareerMapResult {
    data: Record<string, string> | null;
    error: string | null;
}

export async function fetchCareerMap(): Promise<CareerMapResult> {
    try {
        const { data, error } = await supabase
            .from('career_benchmarks')
            .select('id, career_name');

        if (error) {
            return { data: null, error: error.message };
        }

        if (!data || data.length === 0) {
            return { data: {}, error: null };
        }

        const map: Record<string, string> = {};
        for (const row of data) {
            if (row.id && row.career_name) {
                map[row.id] = row.career_name;
            }
        }

        return { data: map, error: null };
    } catch (err) {
        if (err instanceof Error) {
            return { data: null, error: err.message };
        }
        return { data: null, error: 'Unexpected error fetching career map' };
    }
}