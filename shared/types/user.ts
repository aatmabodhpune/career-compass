export interface User {
    id: string;
    email: string;
    role: 'student' | 'admin';
    organizationId?: string;
    createdAt: Date;
}
