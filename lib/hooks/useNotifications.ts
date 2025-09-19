"use client"

import { useState, useEffect } from "react"
import { Notification, NotificationType, NotificationPriority } from "@prisma/client"

export interface NotificationWithMetadata extends Notification {
  icon?: string
  colorClass?: string
}

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<NotificationWithMetadata[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Simuler le chargement des notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true)
      try {
        // TODO: Remplacer par un vrai call API
        const mockNotifications: NotificationWithMetadata[] = [
          {
            id: "1",
            userId,
            type: "PAYMENT_DUE",
            title: "Paiement en attente",
            message: "Votre paiement de 50,000 FCFA pour Tontine Famille est dû demain",
            actionUrl: "/dashboard/payments",
            priority: "HIGH",
            isRead: false,
            readAt: null,
            tontineId: "tontine1",
            roundId: null,
            paymentId: null,
            emailSent: true,
            smsSent: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            icon: "⏰",
            colorClass: "bg-orange-100 text-orange-800"
          },
          {
            id: "2",
            userId,
            type: "IDENTITY_VERIFIED",
            title: "Identité vérifiée",
            message: "Votre identité a été vérifiée avec succès !",
            actionUrl: "/dashboard",
            priority: "HIGH",
            isRead: false,
            readAt: null,
            tontineId: null,
            roundId: null,
            paymentId: null,
            emailSent: true,
            smsSent: false,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            icon: "🛡️",
            colorClass: "bg-green-100 text-green-800"
          }
        ]

        setNotifications(mockNotifications)
        setUnreadCount(mockNotifications.filter(n => !n.isRead).length)
      } catch (error) {
        console.error("Erreur lors du chargement des notifications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchNotifications()
    }
  }, [userId])

  const markAsRead = async (notificationId: string) => {
    try {
      // TODO: Appel API pour marquer comme lu
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true, readAt: new Date() }
            : notification
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      // TODO: Appel API pour marquer toutes comme lues
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          isRead: true,
          readAt: new Date()
        }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error("Erreur lors du marquage de toutes comme lues:", error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      // TODO: Appel API pour supprimer
      const notificationToDelete = notifications.find(n => n.id === notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))

      if (notificationToDelete && !notificationToDelete.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: () => {
      // Re-trigger useEffect
      setIsLoading(true)
    }
  }
}