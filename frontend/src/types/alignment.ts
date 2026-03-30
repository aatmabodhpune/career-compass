export interface Recommendation {
    area: string;
    suggestion: string;
}

export interface Insights {
    strengths: string[];
    weaknesses: string[];
    recommendations: Recommendation[];
}

export interface CareerScore {
    career_id: string;
    personality_score: number;
    interest_score: number;
    aptitude_score: number;
    final_score: number;
}

export interface CareerDetail {
    career_id: string;
    score: number;
    explanation: string;
    strengths_used: string[];
    improvement_areas: string[];
}

export interface Report {
    url: string | null;
}

export interface AlignmentResponse {
    overall_top_10: CareerScore[];
    personality_top_10: CareerScore[];
    interest_top_10: CareerScore[];
    aptitude_top_10: CareerScore[];
    insights: Insights;
    career_details: CareerDetail[];
    report: Report;
}

export interface AlignmentApiResult {
    data: AlignmentResponse | null;
    error: string | null;
}
