import { env } from '../config/env';

/** 4. API TIMEOUT HANDLING */
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        return response;
    } catch (err: any) {
        if (err.name === 'AbortError') {
            console.error(`Request timed out after ${timeoutMs}ms`);
            throw new Error(`Request timed out after ${timeoutMs}ms`);
        }
        throw err;
    } finally {
        clearTimeout(id);
    }
}

export const assessmentApi = {
    startSession: async (token: string) => {
        const res = await fetchWithTimeout(`${env.supabaseUrl}/functions/v1/assessment-start`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": env.supabaseAnonKey,
                "Authorization": `Bearer ${env.supabaseAnonKey}`
            },
            body: JSON.stringify({ token })
        });
        if (!res.ok) {
            throw new Error(`assessment-start failed with status ${res.status} ${res.statusText}`);
        }
        return res.json();
    },

    saveResponses: async (token: string, session_id: string, responses: any) => {
        // Retry Logic (Only for Save Responses per Requirements)
        let retries = 1;
        while (retries >= 0) {
            try {
                const res = await fetchWithTimeout(`${env.supabaseUrl}/functions/v1/assessment-save`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": env.supabaseAnonKey,
                        "Authorization": `Bearer ${env.supabaseAnonKey}`
                    },
                    body: JSON.stringify({ token, session_id, responses })
                });
                if (!res.ok) {
                    throw new Error(`assessment-save failed with status ${res.status} ${res.statusText}`);
                }
                return res.json();
            } catch (err) {
                if (retries === 0) throw err;
                console.warn("Retrying saveResponses after explicit timeout or network error...");
                retries--;
            }
        }
    },

    submitAssessment: async (token: string, session_id: string) => {
        const res = await fetchWithTimeout(`${env.supabaseUrl}/functions/v1/assessment-submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": env.supabaseAnonKey,
                "Authorization": `Bearer ${env.supabaseAnonKey}`
            },
            body: JSON.stringify({ token, session_id })
        });
        if (!res.ok) {
            throw new Error(`assessment-submit failed with status ${res.status} ${res.statusText}`);
        }
        return res.json();
    }
};
