"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types pour les paiements
export interface PaymentStats {
  totalPaid: number
  totalReceived: number
  pendingAmount: number
  thisMonthTransactions: number
}

export interface Payment {
  id: string
  amount: number
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED'
  dueDate: string
  paidAt: string | null
  paymentMethod: string | null
  transactionId: string | null
  notes: string | null
  sharesCount: number
  createdAt: string
  updatedAt: string
  type: 'CONTRIBUTION' | 'GAIN'

  // Relations
  tontine: {
    id: string
    name: string
    description: string | null
  }

  round: {
    id: string
    roundNumber: number
    dueDate: string
  }

  recipient: string
  reference: string
}

export interface PaymentsResponse {
  payments: Payment[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  stats: PaymentStats
}

export interface PaymentsFilters {
  search: string
  status: string[]
  type: string[]
  startDate?: string
  endDate?: string
  limit: number
  offset: number
}

// Hook pour récupérer les paiements avec filtres
export function usePayments(filters: PaymentsFilters) {
  const queryParams = new URLSearchParams()

  if (filters.search) queryParams.set('search', filters.search)
  if (filters.status.length > 0) queryParams.set('status', filters.status.join(','))
  if (filters.type.length > 0) queryParams.set('type', filters.type.join(','))
  if (filters.startDate) queryParams.set('startDate', filters.startDate)
  if (filters.endDate) queryParams.set('endDate', filters.endDate)
  queryParams.set('limit', filters.limit.toString())
  queryParams.set('offset', filters.offset.toString())

  return useQuery<PaymentsResponse>({
    queryKey: ['payments', filters],
    queryFn: async () => {
      const response = await fetch(`/api/payments?${queryParams.toString()}`, {
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

// Hook pour créer un nouveau paiement
export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (paymentData: {
      participantId: string
      roundId: string
      amount: number
      paymentMethod?: string
      transactionId?: string
      notes?: string
    }) => {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(paymentData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la création du paiement')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalider les caches des paiements
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}

// Hook pour un paiement spécifique
export function usePayment(paymentId: string) {
  return useQuery<Payment>({
    queryKey: ['payments', paymentId],
    queryFn: async () => {
      const response = await fetch(`/api/payments/${paymentId}`, {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du paiement')
      }
      return response.json()
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!paymentId
  })
}

// Hook pour mettre à jour un paiement
export function useUpdatePayment(paymentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<Payment>) => {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la mise à jour du paiement')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', paymentId] })
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}

// Hook pour marquer un paiement comme payé
export function useMarkPaymentPaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      paymentId: string
      transactionId?: string
      paymentMethod?: string
      notes?: string
    }) => {
      const response = await fetch(`/api/payments/${data.paymentId}/mark-paid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          transactionId: data.transactionId,
          paymentMethod: data.paymentMethod,
          notes: data.notes
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la confirmation du paiement')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}

// Hook pour les statistiques des paiements
export function usePaymentStats() {
  return useQuery<PaymentStats>({
    queryKey: ['payments', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/payments/stats', {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques')
      }
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}