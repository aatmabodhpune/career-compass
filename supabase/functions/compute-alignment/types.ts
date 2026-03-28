export type RequestPayload = {
    session_id: string;
};

export type AssessmentResponses = {
    personality: Record<string, number[]>;
    interest: Record<string, number[]>;
    aptitude: Record<string, any>;
};

export type CareerBenchmark = {
    career_id: string;
    personality: Record<string, number>;
    interest: Record<string, number>;
    aptitude: Record<string, number>;
    weights: {
        personality: number;
        interest: number;
        aptitude: number;
    };
};

export type NormalizedScores = {
    personality: Record<string, number>;
    interest: Record<string, number>;
    aptitude: Record<string, number>;
};

export type CareerScore = {
    career_id: string;
    personality_score: number;
    interest_score: number;
    aptitude_score: number;
    final_score: number;
};

export type RankedResults = {
    overall_top_10: CareerScore[];
    personality_top_10: CareerScore[];
    interest_top_10: CareerScore[];
    aptitude_top_10: CareerScore[];
};

export type AlignmentResult = RankedResults;

export type ApiResponse<T = any> = {
    data: T | null;
    error: string | null;
};
