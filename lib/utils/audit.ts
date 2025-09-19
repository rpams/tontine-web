import { AuditAction } from "@prisma/client"

export interface AuditContext {
  userId?: string
  adminId?: string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
}

export function createAuditLog(
  action: AuditAction,
  tableName?: string,
  recordId?: string,
  oldValues?: Record<string, any>,
  newValues?: Record<string, any>,
  context?: AuditContext
) {
  return {
    action,
    tableName,
    recordId,
    oldValues,
    newValues,
    userId: context?.userId,
    adminId: context?.adminId,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
    metadata: context?.metadata,
  }
}

export function getAuditActionLabel(action: AuditAction): string {
  const labels: Record<AuditAction, string> = {
    USER_CREATED: "Utilisateur créé",
    USER_UPDATED: "Utilisateur modifié",
    USER_DELETED: "Utilisateur supprimé",
    USER_VERIFIED: "Utilisateur vérifié",
    TONTINE_CREATED: "Tontine créée",
    TONTINE_UPDATED: "Tontine modifiée",
    TONTINE_DELETED: "Tontine supprimée",
    PAYMENT_CREATED: "Paiement créé",
    PAYMENT_APPROVED: "Paiement approuvé",
    ADMIN_LOGIN: "Connexion admin",
    SETTINGS_CHANGED: "Paramètres modifiés"
  }

  return labels[action] || action
}

export function getAuditActionColor(action: AuditAction): string {
  const colors: Record<AuditAction, string> = {
    USER_CREATED: "bg-green-100 text-green-800",
    USER_UPDATED: "bg-blue-100 text-blue-800",
    USER_DELETED: "bg-red-100 text-red-800",
    USER_VERIFIED: "bg-purple-100 text-purple-800",
    TONTINE_CREATED: "bg-green-100 text-green-800",
    TONTINE_UPDATED: "bg-blue-100 text-blue-800",
    TONTINE_DELETED: "bg-red-100 text-red-800",
    PAYMENT_CREATED: "bg-yellow-100 text-yellow-800",
    PAYMENT_APPROVED: "bg-green-100 text-green-800",
    ADMIN_LOGIN: "bg-gray-100 text-gray-800",
    SETTINGS_CHANGED: "bg-orange-100 text-orange-800"
  }

  return colors[action] || "bg-gray-100 text-gray-800"
}

export function formatAuditLogChanges(
  oldValues?: Record<string, any>,
  newValues?: Record<string, any>
): Array<{ field: string; oldValue: any; newValue: any }> {
  if (!oldValues && !newValues) return []

  const changes: Array<{ field: string; oldValue: any; newValue: any }> = []
  const allFields = new Set([
    ...Object.keys(oldValues || {}),
    ...Object.keys(newValues || {})
  ])

  allFields.forEach(field => {
    const oldValue = oldValues?.[field]
    const newValue = newValues?.[field]

    if (oldValue !== newValue) {
      changes.push({
        field,
        oldValue: oldValue ?? null,
        newValue: newValue ?? null
      })
    }
  })

  return changes
}