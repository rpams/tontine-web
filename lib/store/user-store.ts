import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  image?: string
  isActive: boolean
  emailVerified: boolean
  lastLoginAt?: Date
  loginCount: number
}

export interface UserProfile {
  id: string
  userId: string
  firstName?: string
  lastName?: string
  username?: string
  gender?: string
  phoneNumber?: string
  address?: string
  city?: string
  country?: string
  avatarUrl?: string
  profileImageUrl?: string
  preferredLanguage?: string
  timezone?: string
  showUsernameByDefault?: boolean
  isProfileComplete?: boolean
  createdAt: Date
  updatedAt: Date
}

interface UserState {
  // État utilisateur
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  setLoading: (loading: boolean) => void
  logout: () => void

  // Helpers pour les rôles
  isAdmin: () => boolean
  isModerator: () => boolean
  hasRole: (role: UserRole) => boolean
  canAccess: (requiredRoles: UserRole[]) => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // État initial
      user: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      setUser: (user) =>
        set((state) => ({
          user,
          isAuthenticated: !!user
        })),

      setProfile: (profile) =>
        set({ profile }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...updates }
            : null
        })),

      setLoading: (isLoading) =>
        set({ isLoading }),

      logout: () =>
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false
        }),

      // Helpers pour les rôles
      isAdmin: () => {
        const { user } = get()
        return user?.role === 'ADMIN'
      },

      isModerator: () => {
        const { user } = get()
        return user?.role === 'MODERATOR'
      },

      hasRole: (role) => {
        const { user } = get()
        return user?.role === role
      },

      canAccess: (requiredRoles) => {
        const { user } = get()
        if (!user) return false
        return requiredRoles.includes(user.role)
      },
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Hook personnalisé pour faciliter l'utilisation
export const useUser = () => {
  const store = useUserStore()

  return {
    // État
    user: store.user,
    profile: store.profile,
    isLoading: store.isLoading,
    isAuthenticated: store.isAuthenticated,

    // Actions
    setUser: store.setUser,
    setProfile: store.setProfile,
    updateProfile: store.updateProfile,
    setLoading: store.setLoading,
    logout: store.logout,

    // Helpers de rôles
    isAdmin: store.isAdmin(),
    isModerator: store.isModerator(),
    hasRole: store.hasRole,
    canAccess: store.canAccess,
  }
}