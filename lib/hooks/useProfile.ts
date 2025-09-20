"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUser } from '@/lib/store/user-store'

// Types pour les avatars
export interface AvailableAvatar {
  name: string
  url: string
  id: string
}

export interface AvatarsResponse {
  avatars: AvailableAvatar[]
  count: number
  message?: string
}

// Hook pour récupérer les avatars disponibles
export function useAvailableAvatars() {
  return useQuery<AvatarsResponse>({
    queryKey: ['avatars', 'available'],
    queryFn: async () => {
      const response = await fetch('/api/profile/avatars', {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des avatars')
      }
      return response.json()
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (les avatars changent rarement)
  })
}

// Hook pour mettre à jour l'avatar (prédéfini)
export function useUpdateAvatar() {
  const { updateProfile } = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (avatarUrl: string) => {
      const response = await fetch('/api/profile/avatar', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ avatarUrl })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la mise à jour de l\'avatar')
      }

      return response.json()
    },
    onSuccess: (data) => {
      // Mettre à jour le store utilisateur local
      updateProfile({ avatarUrl: data.avatarUrl })

      // Invalider les caches si nécessaire
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}

// Hook pour uploader un avatar personnalisé
export function useUploadAvatar() {
  const { updateProfile } = useUser()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      // Validation côté client
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('Le fichier est trop volumineux. Maximum 5MB autorisé.')
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Type de fichier non autorisé. Utilisez JPG, PNG ou WebP.')
      }

      // Création du FormData
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de l\'upload de l\'avatar')
      }

      return response.json()
    },
    onSuccess: (data) => {
      // Mettre à jour le store utilisateur local
      updateProfile({ avatarUrl: data.avatarUrl })

      // Invalider les caches si nécessaire
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}