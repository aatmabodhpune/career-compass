export type CareerDetail = {
    career_id: string;
    description: string;
    strengths: string[];
    improvements: string[];
};

export async function getCareerDetails(supabase: any, careerIds: string[]): Promise<CareerDetail[]> {
    if (!careerIds || careerIds.length === 0) return [];
    
    // ROOT CAUSE: Meta fields (description, strengths, improvements) are nested inside the benchmark_scores jsonb column.
    // We execute a targeted fetch on career_benchmarks using the primary ID.
    const { data, error } = await supabase
        .from('career_benchmarks')
        .select('id, benchmark_scores')
        .in('id', careerIds);

    // MANDATORY DEBUG LOG FOR PIPELINE VALIDATION
    console.log("RAW DB ROWS FROM ENRICHMENT QUERY:", data);

    if (error) {
        console.error("Error fetching career details in enrichment layer:", error);
    }

    const fetchedRows = data || [];
    const map = new Map(fetchedRows.map((r: any) => [r.id, r]));

    // Deterministic mapping to preserve array order
    return careerIds.map(id => {
        const row = map.get(id) || {};
        
        // Strict JSON path extraction as per architect rules
        const benchmark = row.benchmark_scores || {};
        const meta = benchmark.meta || {};

        return {
            career_id: id,
            description: typeof meta.description === 'string' ? meta.description : "",
            strengths: Array.isArray(meta.strengths) ? [...meta.strengths] : [],
            improvements: Array.isArray(meta.improvements) ? [...meta.improvements] : []
        };
    });
}
