'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'

interface AuthContextType {
  user: any
  profile: any
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isModerator: boolean
  hasRole: (role: string) => boolean
  canAccess: (roles: string[]) => boolean
  refetch: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}