interface EnvConfig {
    supabaseAnonKey: string;
}

const getEnvVar = (key: string): string => {
    const value = import.meta.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

export const env: EnvConfig = {
    // Evaluated at module load (application startup)
    supabaseAnonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
};
