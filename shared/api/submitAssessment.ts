export interface SubmitAssessmentRequest {
    assessmentId: string;
    answers: Array<{
        questionId: string;
        answerValue: number;
    }>;
}

export interface SubmitAssessmentResponse {
    success: boolean;
    message: string;
}
