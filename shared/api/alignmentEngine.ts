import { Result } from '../types/result';

export interface AlignmentEngineRequest {
    assessmentId: string;
    rawData: any;
}

export interface AlignmentEngineResponse {
    result: Result;
}
