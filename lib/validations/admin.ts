import { z } from "zod"

export const auditLogSchema = z.object({
  action: z.enum([
    "USER_CREATED",
    "USER_UPDATED",
    "USER_DELETED",
    "USER_VERIFIED",
    "TONTINE_CREATED",
    "TONTINE_UPDATED",
    "TONTINE_DELETED",
    "PAYMENT_CREATED",
    "PAYMENT_APPROVED",
    "ADMIN_LOGIN",
    "SETTINGS_CHANGED"
  ]),
  tableName: z.string().optional(),
  recordId: z.string().optional(),
  userId: z.string().optional(),
  adminId: z.string().optional(),
  oldValues: z.record(z.any()).optional(),
  newValues: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
})

export const systemSettingsSchema = z.object({
  key: z
    .string()
    .min(1, "La clé est requise")
    .regex(/^[A-Z_]+$/, "La clé doit être en majuscules avec des underscores"),
  value: z
    .string()
    .min(1, "La valeur est requise"),
  description: z
    .string()
    .max(255, "La description ne peut pas dépasser 255 caractères")
    .optional(),
  category: z
    .string()
    .default("general"),
  isPublic: z
    .boolean()
    .default(false),
})

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
  role: z.enum(["USER", "ADMIN", "MODERATOR"]).optional(),
})

export const verificationReviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  rejectionReason: z
    .string()
    .min(10, "La raison du rejet doit contenir au moins 10 caractères")
    .optional(),
  adminNotes: z
    .string()
    .max(500, "Les notes ne peuvent pas dépasser 500 caractères")
    .optional(),
})

export type AuditLogFormData = z.infer<typeof auditLogSchema>
export type SystemSettingsFormData = z.infer<typeof systemSettingsSchema>
export type UpdateUserStatusFormData = z.infer<typeof updateUserStatusSchema>
export type VerificationReviewFormData = z.infer<typeof verificationReviewSchema>