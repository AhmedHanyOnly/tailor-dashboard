'use client';
import { create } from 'zustand';

interface RoleProps {
  id: number;
  name: string;
}

interface UserProps {
  id: number;
  name: string;
  email: string;
  role: RoleProps;
}

interface AuthState {
  user: UserProps | null;
  token: string | null;
  isAuth: boolean;
  loading: boolean; // ← هنا
  setAuth: (user: UserProps, token: string | null) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuth: false,
  loading: true, // ← البداية true
  setAuth: (user, token) =>
    set({ user, token, isAuth: !!token, loading: false }),
  clearAuth: () => set({ user: null, token: null, isAuth: false, loading: false }),
  setLoading: (loading) => set({ loading }),
}));
