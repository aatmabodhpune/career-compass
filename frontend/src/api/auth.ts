import type { AuthResponse } from '../types/auth';
import { env } from '../config/env';

export async function loginWithToken(rawToken: string): Promise<AuthResponse> {
    const token = rawToken.trim();
    if (!token) throw new Error('Token is required');

    // Safety guard protecting network calls
    if (!env.supabaseAnonKey) {
        throw new Error('Authentication misconfigured: Missing API key');
    }

    try {
        const response = await fetch('https://peadrroqdtvysvdhgdrf.supabase.co/functions/v1/auth-token-logic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': env.supabaseAnonKey,
                'Authorization': `Bearer ${env.supabaseAnonKey}`,
            },
            body: JSON.stringify({ token }),
        });

        if (!response.ok) {
            let errorMsg = `Server error: ${response.status} ${response.statusText}`;
            try {
                // Attempt to parse formal backend error messages
                const errorBody = await response.json();
                if (errorBody && errorBody.error) {
                    errorMsg = errorBody.error;
                }
            } catch (e) {
                // Fallback to standard HTTP status if non-JSON backend error
            }
            throw new Error(errorMsg);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected network error occurred');
    }
}
