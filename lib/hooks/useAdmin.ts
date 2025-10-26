"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types pour les données admin
export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalTontines: number
  activeTontines: number
  totalTransactions: number
  totalRevenue: string
  pendingVerifications: number
  newUsersThisWeek: number
}

export interface AdminUser {
  id: string
  name: string
  email: string
  status: 'active' | 'suspended'
  verified: boolean
  joinDate: string
  avatar: string
  role: string
  lastLoginAt: string | null
  identityVerificationStatus: 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
  stats: {
    ownedTontines: number
    participantTontines: number
    totalPayments: number
  }
}

export interface AdminTontine {
  id: string
  name: string
  description: string | null
  amount: string
  frequency: string
  status: string
  maxParticipants: number
  currentRound: number
  totalRounds: number
  startDate: string
  endDate: string | null
  createdAt: string
  creator: {
    id: string
    name: string
    email: string
    avatar: string
  }
  stats: {
    participantCount: number
    paymentCount: number
    completionRate: number
  }
}

export interface AdminPayment {
  id: string
  amount: string
  status: string
  dueDate: string
  paidAt: string | null
  createdAt: string
  round: number
  user: {
    id: string
    name: string
    email: string
    avatar: string
  }
  tontine: {
    id: string
    name: string
    status: string
  }
}

export interface PaginationParams {
  limit?: number
  offset?: number
  search?: string
  status?: string
}

export interface PaginatedResponse<T> {
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

// Hook pour les statistiques admin
export function useAdminStats() {
  return useQuery<{ stats: AdminStats }>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques admin')
      }
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook pour les utilisateurs admin
export function useAdminUsers(params: PaginationParams = {}) {
  const { limit = 20, offset = 0, search = '', status = 'all' } = params

  return useQuery<{ users: AdminUser[] } & PaginatedResponse<AdminUser>>({
    queryKey: ['admin', 'users', limit, offset, search, status],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        search,
        status
      })

      const response = await fetch(`/api/admin/users?${searchParams}`, {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs')
      }
      return response.json()
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
  })
}

// Hook pour les tontines admin
export function useAdminTontines(params: PaginationParams = {}) {
  const { limit = 20, offset = 0, search = '', status = 'all' } = params

  return useQuery<{ tontines: AdminTontine[] } & PaginatedResponse<AdminTontine>>({
    queryKey: ['admin', 'tontines', limit, offset, search, status],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        search,
        status
      })

      const response = await fetch(`/api/admin/tontines?${searchParams}`, {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des tontines')
      }
      return response.json()
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
  })
}

// Hook pour les paiements admin
export function useAdminPayments(params: PaginationParams & { tontineId?: string } = {}) {
  const { limit = 20, offset = 0, status = 'all', tontineId } = params

  return useQuery<{ payments: AdminPayment[] } & PaginatedResponse<AdminPayment>>({
    queryKey: ['admin', 'payments', limit, offset, status, tontineId],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        status
      })

      if (tontineId) {
        searchParams.append('tontineId', tontineId)
      }

      const response = await fetch(`/api/admin/payments?${searchParams}`, {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des paiements')
      }
      return response.json()
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Mutations pour les actions admin
export function useUpdateUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, action }: { userId: string, action: 'activate' | 'suspend' | 'verify' }) => {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId, action })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la mise à jour')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalider les requêtes des utilisateurs et stats
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    }
  })
}

export function useUpdateTontineStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ tontineId, action }: { tontineId: string, action: 'activate' | 'suspend' | 'complete' }) => {
      const response = await fetch('/api/admin/tontines', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ tontineId, action })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la mise à jour')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalider les requêtes des tontines et stats
      queryClient.invalidateQueries({ queryKey: ['admin', 'tontines'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    }
  })
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ paymentId, action }: { paymentId: string, action: 'approve' | 'reject' | 'reset' }) => {
      const response = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ paymentId, action })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la mise à jour')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalider les requêtes des paiements et stats
      queryClient.invalidateQueries({ queryKey: ['admin', 'payments'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    }
  })
}

// Hook pour les validations en attente
export interface PendingValidation {
  id: string
  name: string
  email: string
  date: string
  avatar: string
  telephone: string | null
  address: string | null
  emailStatus: 'verified' | 'pending'
  documentStatus: 'verified' | 'submitted' | 'pending' | 'rejected'
  identityVerification: {
    id: string
    status: string
    documentType: string | null
    firstName: string | null
    lastName: string | null
    documentFrontUrl: string | null
    documentBackUrl: string | null
    submittedAt: string | null
  } | null
}

export function useAdminPendingValidations() {
  return useQuery<{ validations: PendingValidation[] }>({
    queryKey: ['admin', 'pending-validations'],
    queryFn: async () => {
      const response = await fetch('/api/admin/pending-validations', {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des validations en attente')
      }
      return response.json()
    },
    staleTime: 30 * 1000, // 30 secondes - réduit pour rafraîchir plus vite après validation
    refetchOnWindowFocus: true, // Refetch quand l'utilisateur revient sur l'onglet
  })
}

export function useReviewIdentityVerification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ verificationId, action, message }: {
      verificationId: string
      action: 'approve' | 'reject'
      message?: string
    }) => {
      const response = await fetch('/api/admin/identity-verification/review', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ verificationId, action, message })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la révision')
      }

      return response.json()
    },
    onMutate: async ({ verificationId }) => {
      // Annuler les refetch en cours pour éviter qu'ils n'écrasent notre mise à jour optimiste
      await queryClient.cancelQueries({ queryKey: ['admin', 'pending-validations'] })

      // Sauvegarder l'état précédent pour un éventuel rollback
      const previousValidations = queryClient.getQueryData(['admin', 'pending-validations'])

      // Mettre à jour optimistiquement le cache en retirant l'utilisateur validé
      queryClient.setQueryData(['admin', 'pending-validations'], (old: any) => {
        if (!old?.validations) return old
        return {
          ...old,
          validations: old.validations.filter(
            (validation: PendingValidation) => validation.identityVerification?.id !== verificationId
          )
        }
      })

      return { previousValidations }
    },
    onError: (_err, _variables, context) => {
      // En cas d'erreur, restaurer l'état précédent
      if (context?.previousValidations) {
        queryClient.setQueryData(['admin', 'pending-validations'], context.previousValidations)
      }
    },
    onSuccess: async () => {
      // Invalider et refetch immédiatement les requêtes des validations en attente
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'pending-validations'],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'stats'],
        refetchType: 'active'
      })
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'users'],
        refetchType: 'active'
      })
    }
  })
}

// Hook pour récupérer les détails d'un utilisateur
export function useAdminUserDetails(userId: string | null) {
  return useQuery({
    queryKey: ['admin', 'user-details', userId],
    queryFn: async () => {
      if (!userId) return null

      const response = await fetch(`/api/admin/users/${userId}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des détails de l\'utilisateur')
      }

      return response.json()
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}