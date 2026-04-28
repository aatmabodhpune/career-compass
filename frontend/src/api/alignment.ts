import type { AlignmentApiResult } from '../types/alignment';
import { env } from '../config/env';
import { useAuthStore } from '../store/authStore';

export async function fetchAlignmentResults(
    session_id: string
): Promise<AlignmentApiResult> {
    if (!session_id) {
        return { data: null, error: 'Invalid input: session_id is required' };
    }

    try {
        const { jwt } = useAuthStore.getState();
        if (!jwt) {
            return { data: null, error: 'JWT missing: please log in again' };
        }

        const response = await fetch(`${env.supabaseUrl}/functions/v1/compute-alignment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': env.supabaseAnonKey,
                'Authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify({ session_id }),
        });

        const json = await response.json();

        if (!response.ok) {
            const errorMsg = json?.error ?? `Server error: ${response.status} ${response.statusText}`;
            return { data: null, error: errorMsg };
        }

        // Return raw API response — no transformation, no sorting
        return { data: json.data ?? null, error: json.error ?? null };

    } catch (error) {
        if (error instanceof Error) {
            return { data: null, error: error.message };
        }
        return { data: null, error: 'An unexpected network error occurred' };
    }
}
