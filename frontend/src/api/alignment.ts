import type { AlignmentApiResult } from '../types/alignment';
import { env } from '../config/env';

const ALIGNMENT_URL = 'https://peadrroqdtvysvdhgdrf.supabase.co/functions/v1/compute-alignment';

export async function fetchAlignmentResults(
    session_id: string
): Promise<AlignmentApiResult> {
    if (!session_id) {
        return { data: null, error: 'Invalid input: session_id is required' };
    }

    try {
        const response = await fetch(ALIGNMENT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': env.supabaseAnonKey,
                'Authorization': `Bearer ${env.supabaseAnonKey}`,
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
