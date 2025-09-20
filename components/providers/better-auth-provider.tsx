"use client"

import { createContext, useContext, ReactNode } from "react"
import { authClient } from "@/lib/auth-client"

interface BetterAuthProviderProps {
  children: ReactNode
}

// Créer un contexte pour partager authClient si nécessaire
const AuthClientContext = createContext(authClient)

export function BetterAuthProvider({ children }: BetterAuthProviderProps) {
  return (
    <AuthClientContext.Provider value={authClient}>
      {children}
    </AuthClientContext.Provider>
  )
}

export function useAuthClient() {
  return useContext(AuthClientContext)
}