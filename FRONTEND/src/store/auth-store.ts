import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { RoleEnum } from '@/types/roles';

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  role?: RoleEnum;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoggedIn: false,
      setAuth: (user, token, refreshToken) => set({ user, token, refreshToken, isLoggedIn: true }),
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
      logout: () => set({ user: null, token: null, refreshToken: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
