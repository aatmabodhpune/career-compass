export const formatScore = (score: number): number => {
    const safeScore = Number.isFinite(score) ? score : 0;
    return Math.round(Math.max(0, safeScore) * 100);
};
