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
    career_name: string;
    personality_score: number;
    interest_score: number;
    aptitude_score: number;
    final_score: number;
}

export interface CareerDetail {
    career_id: string;
    career_name: string;
    score: number;
    explanation: string;
    strengths_used: string[];
    improvement_areas: string[];
}

export interface Report {
    url: string | null;
}

export interface AlignmentResponse {
    careers: CareerScore[];
    personality_alignment: CareerScore[];
    interest_alignment: CareerScore[];
    aptitude_alignment: CareerScore[];
    strengths: string[];
    improvements: string[];
    recommendations: string[];
}

export interface AlignmentApiResult {
    data: AlignmentResponse | null;
    error: string | null;
}
