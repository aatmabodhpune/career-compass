import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Student } from '../types/auth';

interface AuthState {
    student: Student | null;
    token: string | null;
    session_id: string | null;
    jwt: string | null;
    isAuthenticated: boolean;
    isHydrated: boolean;
    setStudent: (student: Student | null) => void;
    setAuth: (auth: { token: string; session_id: string; jwt: string }) => void;
    logout: () => void;
    setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            student: null,
            token: null,
            session_id: null,
            jwt: null,
            isAuthenticated: false,
            isHydrated: false,
            setStudent: (student) => set({ student, isAuthenticated: !!student }),
            setAuth: ({ token, session_id, jwt }) =>
                set({
                    token,
                    session_id,
                    jwt,
                    isAuthenticated: true,
                }),
            logout: () => {
                set({ student: null, token: null, session_id: null, jwt: null, isAuthenticated: false });
                try {
                    localStorage.removeItem('auth-storage');
                } catch {
                    // ignore storage errors (e.g., SSR or privacy mode)
                }
            },
            setHydrated: () =>
                set((state) => ({
                    isHydrated: true,
                    isAuthenticated: !!state.token && !!state.session_id && !!state.jwt,
                })),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                session_id: state.session_id,
                jwt: state.jwt,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated();
            },
        }
    )
);
