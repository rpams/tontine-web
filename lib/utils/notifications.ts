import { NotificationType, NotificationPriority } from "@prisma/client"

export interface NotificationTemplate {
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  actionUrl?: string
}

export const notificationTemplates: Record<string, NotificationTemplate> = {
  TONTINE_INVITATION: {
    type: "TONTINE_INVITATION",
    title: "Invitation à rejoindre une tontine",
    message: "Vous avez été invité(e) à rejoindre la tontine {tontineName}",
    priority: "MEDIUM",
    actionUrl: "/tontines/{tontineId}"
  },
  PAYMENT_DUE: {
    type: "PAYMENT_DUE",
    title: "Paiement en attente",
    message: "Votre paiement de {amount} FCFA pour {tontineName} est dû le {dueDate}",
    priority: "HIGH",
    actionUrl: "/dashboard/payments"
  },
  PAYMENT_RECEIVED: {
    type: "PAYMENT_RECEIVED",
    title: "Paiement reçu",
    message: "Votre paiement de {amount} FCFA a été confirmé pour {tontineName}",
    priority: "LOW",
    actionUrl: "/dashboard/payments"
  },
  ROUND_COMPLETED: {
    type: "ROUND_COMPLETED",
    title: "Tour terminé",
    message: "Le tour {roundNumber} de {tontineName} est terminé. {winnerName} a reçu {amount} FCFA",
    priority: "MEDIUM",
    actionUrl: "/tontines/{tontineId}"
  },
  TONTINE_STARTED: {
    type: "TONTINE_STARTED",
    title: "Tontine démarrée",
    message: "La tontine {tontineName} a officiellement commencé !",
    priority: "MEDIUM",
    actionUrl: "/tontines/{tontineId}"
  },
  IDENTITY_VERIFIED: {
    type: "IDENTITY_VERIFIED",
    title: "Identité vérifiée",
    message: "Votre identité a été vérifiée avec succès. Vous avez maintenant accès à toutes les fonctionnalités.",
    priority: "HIGH",
    actionUrl: "/dashboard"
  },
  SYSTEM_ANNOUNCEMENT: {
    type: "SYSTEM_ANNOUNCEMENT",
    title: "Annonce système",
    message: "{customMessage}",
    priority: "MEDIUM"
  }
}

export function formatNotificationMessage(
  template: NotificationTemplate,
  variables: Record<string, string>
): { title: string; message: string; actionUrl?: string } {
  let title = template.title
  let message = template.message
  let actionUrl = template.actionUrl

  // Remplacer les variables dans le titre, message et URL
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{${key}}`
    title = title.replace(new RegExp(placeholder, 'g'), value)
    message = message.replace(new RegExp(placeholder, 'g'), value)
    if (actionUrl) {
      actionUrl = actionUrl.replace(new RegExp(placeholder, 'g'), value)
    }
  })

  return { title, message, actionUrl }
}

export function getNotificationIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    TONTINE_INVITATION: "👥",
    PAYMENT_DUE: "⏰",
    PAYMENT_RECEIVED: "✅",
    ROUND_COMPLETED: "🎉",
    TONTINE_STARTED: "🚀",
    IDENTITY_VERIFIED: "🛡️",
    SYSTEM_ANNOUNCEMENT: "📢"
  }

  return icons[type] || "📄"
}

export function getNotificationColor(priority: NotificationPriority): string {
  const colors: Record<NotificationPriority, string> = {
    LOW: "bg-gray-100 text-gray-800",
    MEDIUM: "bg-blue-100 text-blue-800",
    HIGH: "bg-orange-100 text-orange-800",
    URGENT: "bg-red-100 text-red-800"
  }

  return colors[priority]
}