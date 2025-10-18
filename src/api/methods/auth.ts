'use client';

import { useAuthStore } from '@/store/useAuthStore';
import api from '@/api/api';

// Types
interface LoginPayload {
  email: string;
  password: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
}

interface LoginResponse {
  token?: string;
  data?: UserData;
  message?: string;
}

interface LogoutResponse {
  message?: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/admin/auth/login', payload);

  return data;
}

export async function logout(): Promise<LogoutResponse> {
  const { data } = await api.post<LogoutResponse>('/admin/auth/logout');

  localStorage.removeItem('token');
  localStorage.removeItem('user');
  useAuthStore.getState().clearAuth();

  return data;
}
