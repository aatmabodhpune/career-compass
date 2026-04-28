import { env } from '../config/env';
import { useAuthStore } from '../store/authStore';

export async function fetchQuestions() {
  const { jwt } = useAuthStore.getState();
  
  const res = await fetch(
    `${env.supabaseUrl}/functions/v1/compute-alignment`,
    {
      headers: {
        "apikey": env.supabaseAnonKey,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`
      },
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      console.error("CRITICAL: Unauthorized access to questions. Token might be invalid or expired.");
      throw new Error("Unauthorized: Please log in again to continue the assessment.");
    }
    
    console.error("Question fetch failed", res.status);
    return [];
  }

  const data = await res.json();
  return data.questions || [];
}
