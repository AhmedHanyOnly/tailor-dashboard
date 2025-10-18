'use client'
import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

interface ProtectedRouteProps {
  children:ReactNode
}
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    const localToken = localStorage.getItem('token')
    if (!token && !localToken) router.push('/login')
    else if (!token && localToken) {
      useAuthStore.getState().setAuth(null, localToken)
    }
  }, [token, router])

  return <>{children}</>
}
