export interface Result {
    id: string;
    assessmentId: string;
    careerMatches: Array<{
        title: string;
        score: number;
    }>;
}
