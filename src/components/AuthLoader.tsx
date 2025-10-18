'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthLoaderProps {
  children: React.ReactNode;
}

export default function AuthLoader({ children }: AuthLoaderProps) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null;

    if (token && user) {
      setAuth(user, token);
    } else {
      setLoading(false);
    }
  }, [setAuth, setLoading]);

  return <>{children}</>;
}
