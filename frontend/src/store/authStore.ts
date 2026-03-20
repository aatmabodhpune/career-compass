import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Student } from '../types/auth';

interface AuthState {
    student: Student | null;
    token: string | null;
    isAuthenticated: boolean;
    _hasHydrated: boolean;
    setStudent: (student: Student | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            student: null,
            token: null,
            isAuthenticated: false,
            _hasHydrated: false,
            setStudent: (student) => set({ student, isAuthenticated: !!student }),
            setToken: (token) => set({ token, isAuthenticated: !!token }),
            logout: () => {
                set({ student: null, token: null, isAuthenticated: false });
                try {
                    localStorage.removeItem('auth-storage');
                } catch {
                    // ignore storage errors (e.g., SSR or privacy mode)
                }
            },
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
