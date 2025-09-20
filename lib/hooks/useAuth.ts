import { useEffect } from 'react'
import { useUser } from '@/lib/store/user-store'

// Hook pour gérer l'authentification et synchroniser avec le store
export const useAuth = () => {
  const {
    user,
    profile,
    isLoading,
    isAuthenticated,
    setUser,
    setProfile,
    setLoading,
    logout,
    isAdmin,
    isModerator,
    hasRole,
    canAccess,
  } = useUser()

  // Fonction pour récupérer les données utilisateur depuis l'API
  const fetchUserData = async () => {
    try {
      setLoading(true)

      // Récupérer la session via l'API route
      const sessionResponse = await fetch('/api/auth/session')

      if (!sessionResponse.ok) {
        logout()
        return null
      }

      const sessionData = await sessionResponse.json()

      if (!sessionData.session) {
        logout()
        return null
      }

      const session = sessionData.session

      // Récupérer les données utilisateur complètes (user + profile)
      const userResponse = await fetch('/api/profile/me')
      if (userResponse.ok) {
        const userData = await userResponse.json()

        // Synchroniser avec le store
        setUser({
          id: userData.user.id,
          email: userData.user.email,
          name: userData.user.name,
          role: userData.user.role || 'USER',
          image: userData.user.image || undefined,
          isActive: userData.user.isActive,
          emailVerified: userData.user.emailVerified,
          lastLoginAt: userData.user.lastLoginAt ? new Date(userData.user.lastLoginAt) : null,
          loginCount: userData.user.loginCount,
        })

        setProfile(userData.profile)
      } else {
        // Fallback avec les données de session
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: (session.user as any).role || 'USER',
          image: session.user.image || undefined,
          isActive: true,
          emailVerified: session.user.emailVerified || false,
          lastLoginAt: new Date(),
          loginCount: 0,
        })
      }

      return session

    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error)
      logout()
      return null
    } finally {
      setLoading(false)
    }
  }

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)

      const response = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error('Échec de la connexion')
      }

      // Récupérer les données après connexion
      await fetchUserData()

      return { success: true }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur de connexion'
      }
    } finally {
      setLoading(false)
    }
  }

  // Fonction de déconnexion
  const signOut = async () => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' })
      logout()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  // Auto-fetch des données au montage du hook
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      fetchUserData()
    }
  }, [])

  return {
    // État
    user,
    profile,
    isLoading,
    isAuthenticated,

    // Actions
    login,
    logout: signOut,
    refetch: fetchUserData,

    // Helpers de rôles
    isAdmin,
    isModerator,
    hasRole,
    canAccess,

    // Helpers de profil
    isProfileComplete: profile?.isProfileComplete || false,
    needsProfileCompletion: isAuthenticated && !profile?.isProfileComplete,
  }
}