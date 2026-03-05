import { Assessment } from '../types/assessment';

export interface StartAssessmentRequest {
    userId: string;
}

export interface StartAssessmentResponse {
    assessment: Assessment;
}
