import { ApiResponse } from './types.ts';

export function createResponse<T>(data: T | null, error: string | null = null): ApiResponse<T> {
    return {
        data,
        error
    };
}
