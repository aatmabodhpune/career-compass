export interface Assessment {
    id: string;
    userId: string;
    status: 'pending' | 'in_progress' | 'completed';
    startedAt: Date;
    completedAt?: Date;
}
