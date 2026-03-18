import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Student } from '../types/auth';

interface AuthState {
    student: Student | null;
    isAuthenticated: boolean;
    _hasHydrated: boolean;
    setStudent: (student: Student | null) => void;
    logout: () => void;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            student: null,
            isAuthenticated: false,
            _hasHydrated: false,
            setStudent: (student) => set({ student, isAuthenticated: !!student }),
            logout: () => set({ student: null, isAuthenticated: false }),
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
