import { env } from '../config/env';
import { useAuthStore } from '../store/authStore';

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

    saveResponses: async (session_id: string, responsesData: any) => {
        const { token, jwt, session_id: storedSessionId } = useAuthStore.getState();
        console.log("AUTH STORE AT SAVE:", { token, session_id: storedSessionId, jwt });
        console.log("TOKEN IN SAVE:", token);

        if (!jwt) {
            throw new Error("JWT MISSING IN SAVE");
        }

        const { section, responses } = responsesData;

        console.log("SESSION USED IN API:", session_id);
        const res = await fetchWithTimeout(`${env.supabaseUrl}/functions/v1/assessment-save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": env.supabaseAnonKey,
                "Authorization": `Bearer ${jwt}`
            },
            body: JSON.stringify({ session_id, section, responses })
        });
        if (!res.ok) {
            throw new Error(`assessment-save failed with status ${res.status} ${res.statusText}`);
        }
        return res.json();
    },

    submitAssessment: async (session_id: string) => {
        console.log("SESSION USED IN API:", session_id);
        const { token, jwt } = useAuthStore.getState();
        if (!jwt) {
            throw new Error("JWT MISSING IN SUBMIT");
        }
        const res = await fetchWithTimeout(`${env.supabaseUrl}/functions/v1/assessment-submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": env.supabaseAnonKey,
                "Authorization": `Bearer ${jwt}`
            },
            body: JSON.stringify({ token, session_id })
        });
        if (!res.ok) {
            throw new Error(`assessment-submit failed with status ${res.status} ${res.statusText}`);
        }
        return res.json();
    }
};
