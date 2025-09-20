"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types pour les tontines
export interface TontineParticipant {
  id: string
  userId: string
  name: string
  email: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  sharesCount: number
  totalCommitted: number
  isActive: boolean
  joinedAt: string
}

export interface TontineRound {
  id: string
  roundNumber: number
  expectedAmount: number
  collectedAmount: number
  dueDate: string
  status: string
  daysUntil: number
}

export interface Tontine {
  id: string
  name: string
  description: string | null
  amountPerRound: number
  totalAmountPerRound: number
  status: string
  startDate: string | null
  endDate: string | null
  maxParticipants: number | null
  frequencyType: string
  frequencyValue: number
  createdAt: string
  updatedAt: string

  // Informations utilisateur
  isOwner: boolean
  userRole: 'owner' | 'participant'
  userShares: number

  // Participants
  participantCount: number
  participants: TontineParticipant[]

  // Prochain round
  nextRound: TontineRound | null

  // Statistiques
  totalRounds: number

  // Créateur
  creator: {
    id: string
    name: string
    email: string
  }
}

// Interface pour les détails complets d'une tontine
export interface TontineDetail extends Omit<Tontine, 'participants' | 'nextRound'> {
  allowMultipleShares: boolean
  maxSharesPerUser: number | null
  inviteCode: string
  completedRounds: number
  completionPercentage: number

  // Participants avec statistiques détaillées
  participants: TontineParticipantDetail[]

  // Rounds avec détails complets
  rounds: TontineRoundDetail[]

  // Prochain round avec détails
  nextRound: TontineRoundDetail | null
}

export interface TontineParticipantDetail extends TontineParticipant {
  firstName?: string
  lastName?: string

  // Statistiques de paiement
  totalPayments: number
  paidPayments: number
  pendingPayments: number
  isUpToDate: boolean

  // Rounds gagnés
  wonRounds: TontineRoundDetail[]
}

export interface TontineRoundDetail extends TontineRound {
  distributedAmount: number
  collectionStartDate: string
  completedAt: string | null
  createdAt: string
  updatedAt: string

  // Détails du gagnant
  winner: {
    id: string
    userId: string
    name: string
    email: string
    firstName?: string
    lastName?: string
    avatarUrl?: string
  } | null

  // Statistiques des paiements
  totalExpected: number
  totalCollected: number
  paymentsReceived: number
  totalParticipants: number
  isFullyPaid: boolean

  // Détails des paiements pour ce round
  payments: {
    id: string
    amount: number
    status: string
    paidAt: string | null
    user: {
      id: string
      name: string
    }
  }[]
}

export interface TontinesResponse {
  tontines: Tontine[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

export interface TontinesFilters {
  search: string
  status: string[]
  role: string[]
  limit: number
  offset: number
}

// Hook pour récupérer les tontines avec filtres
export function useTontines(filters: TontinesFilters) {
  const queryParams = new URLSearchParams()

  if (filters.search) queryParams.set('search', filters.search)
  if (filters.status.length > 0) queryParams.set('status', filters.status.join(','))
  if (filters.role.length > 0) queryParams.set('role', filters.role.join(','))
  queryParams.set('limit', filters.limit.toString())
  queryParams.set('offset', filters.offset.toString())

  return useQuery<TontinesResponse>({
    queryKey: ['tontines', filters],
    queryFn: async () => {
      const response = await fetch(`/api/tontines?${queryParams.toString()}`, {
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

// Hook pour créer une nouvelle tontine
export function useCreateTontine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (tontineData: {
      name: string
      description?: string
      amountPerRound: number
      frequencyType: string
      frequencyValue?: number
      maxParticipants: number
      allowMultipleShares?: boolean
      maxSharesPerUser?: number
      startDate?: string
    }) => {
      const response = await fetch('/api/tontines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(tontineData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la création de la tontine')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalider les caches des tontines
      queryClient.invalidateQueries({ queryKey: ['tontines'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}

// Hook pour une tontine spécifique avec détails complets
export function useTontine(tontineId: string) {
  return useQuery<{ tontine: TontineDetail }>({
    queryKey: ['tontines', tontineId],
    queryFn: async () => {
      const response = await fetch(`/api/tontines/${tontineId}`, {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la tontine')
      }
      return response.json()
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!tontineId
  })
}

// Hook pour mettre à jour une tontine
export function useUpdateTontine(tontineId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<Tontine>) => {
      const response = await fetch(`/api/tontines/${tontineId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la mise à jour de la tontine')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tontines', tontineId] })
      queryClient.invalidateQueries({ queryKey: ['tontines'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}

// Hook pour supprimer une tontine
export function useDeleteTontine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (tontineId: string) => {
      const response = await fetch(`/api/tontines/${tontineId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la suppression de la tontine')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tontines'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}