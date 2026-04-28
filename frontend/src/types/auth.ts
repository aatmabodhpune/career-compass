export interface Student {
    id?: string;
    name: string;
    grade: number;
    school_id?: string;
    school_name?: string | null;
}

export interface AuthResponse {
    student?: Student | null;
    data?: {
        id: string;
        name: string;
        grade: number;
        school_id: string;
        session_id: string;
        token: string;
    } | null;
    error?: string | null;
}
