import { z } from "zod"

export const createNotificationSchema = z.object({
  userId: z.string().min(1, "L'ID utilisateur est requis"),
  type: z.enum([
    "TONTINE_INVITATION",
    "PAYMENT_DUE",
    "PAYMENT_RECEIVED",
    "ROUND_COMPLETED",
    "TONTINE_STARTED",
    "IDENTITY_VERIFIED",
    "SYSTEM_ANNOUNCEMENT"
  ], {
    required_error: "Le type de notification est requis",
  }),
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),
  message: z
    .string()
    .min(1, "Le message est requis")
    .max(500, "Le message ne peut pas dépasser 500 caractères"),
  actionUrl: z
    .string()
    .url("URL d'action invalide")
    .optional(),
  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .default("MEDIUM"),
  tontineId: z.string().optional(),
  roundId: z.string().optional(),
  paymentId: z.string().optional(),
  emailSent: z.boolean().default(false),
  smsSent: z.boolean().default(false),
})

export const updateNotificationSchema = z.object({
  isRead: z.boolean().optional(),
  readAt: z.date().optional(),
})

export type CreateNotificationFormData = z.infer<typeof createNotificationSchema>
export type UpdateNotificationFormData = z.infer<typeof updateNotificationSchema>