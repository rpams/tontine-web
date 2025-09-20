"use client"

import { useQuery } from '@tanstack/react-query'

// Types pour les données du dashboard
export interface DashboardStats {
  totalSaved: number
  totalTontines: number
  nextTontine: {
    name: string
    daysUntil: number
  } | null
  avgReturn: number
  recentActivity: {
    newTontinesThisMonth: number
    completedRoundsThisMonth: number
  }
}

export interface DashboardTontine {
  id: string
  name: string
  description: string | null
  amountPerRound: number
  status: string
  isOwner: boolean
  participantCount: number
  nextRound: {
    roundNumber: number
    dueDate: string
    status: string
    daysUntil: number
  } | null
  createdAt: string
}

export interface DashboardTour {
  id: string
  tontineName: string
  roundNumber: number
  amount: number
  dueDate: string
  status: string
  daysUntil: number
  isConfirmed: boolean
}

export interface DashboardToursData {
  gains: DashboardTour[]
  contributions: DashboardTour[]
}

// Hook pour les statistiques du dashboard
export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats', {
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

// Hook pour les tontines du dashboard
export function useDashboardTontines(limit: number = 10) {
  return useQuery<{ tontines: DashboardTontine[], total: number }>({
    queryKey: ['dashboard', 'tontines', limit],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/tontines?limit=${limit}`, {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des tontines')
      }
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook pour les tours à venir
export function useDashboardTours() {
  return useQuery<DashboardToursData>({
    queryKey: ['dashboard', 'tours'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/tours', {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des tours')
      }
      return response.json()
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (plus fréquent car données sensibles au temps)
  })
}

// Hook pour les gains à venir uniquement
export function useDashboardGains() {
  return useQuery<{ gains: DashboardTour[] }>({
    queryKey: ['dashboard', 'gains'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/tours?type=gains', {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des gains')
      }
      return response.json()
    },
    staleTime: 2 * 60 * 1000,
  })
}

// Hook pour les contributions à venir uniquement
export function useDashboardContributions() {
  return useQuery<{ contributions: DashboardTour[] }>({
    queryKey: ['dashboard', 'contributions'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/tours?type=contributions', {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des contributions')
      }
      return response.json()
    },
    staleTime: 2 * 60 * 1000,
  })
}