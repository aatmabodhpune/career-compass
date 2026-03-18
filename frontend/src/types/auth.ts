export interface Student {
    name: string;
    grade: number;
    school_name?: string | null;
}

export interface AuthResponse {
    success: boolean;
    data: Student | null;
    error: string | null;
}
