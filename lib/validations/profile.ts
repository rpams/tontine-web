import { z } from "zod"

export const userProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  dateOfBirth: z
    .date({
      required_error: "La date de naissance est requise",
    })
    .refine((date) => {
      const age = new Date().getFullYear() - date.getFullYear()
      return age >= 18 && age <= 100
    }, "Vous devez avoir entre 18 et 100 ans"),
  nationality: z
    .string()
    .min(1, "La nationalité est requise")
    .optional(),
  profession: z
    .string()
    .min(1, "La profession est requise")
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^(\+?[1-9]\d{1,14})$/, "Format de téléphone invalide")
    .optional(),
  address: z
    .string()
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .optional(),
  city: z
    .string()
    .min(2, "La ville doit contenir au moins 2 caractères")
    .optional(),
  country: z
    .string()
    .min(2, "Le pays doit contenir au moins 2 caractères")
    .optional(),
  postalCode: z
    .string()
    .min(3, "Le code postal doit contenir au moins 3 caractères")
    .optional(),
  preferredLanguage: z
    .enum(["fr", "en", "es"], {
      required_error: "Veuillez sélectionner une langue",
    })
    .default("fr"),
  timezone: z
    .string()
    .default("Africa/Dakar"),
})

export const identityVerificationSchema = z.object({
  documentType: z.enum(["CNI", "PASSPORT", "DRIVING_LICENSE"], {
    required_error: "Veuillez sélectionner le type de document",
  }),
  documentNumber: z
    .string()
    .min(1, "Le numéro de document est requis")
    .min(5, "Le numéro doit contenir au moins 5 caractères"),
  firstName: z
    .string()
    .min(1, "Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères"),
  dateOfBirth: z
    .date({
      required_error: "La date de naissance est requise",
    }),
  documentFrontUrl: z
    .string()
    .url("URL invalide pour la photo du document")
    .optional(),
  documentBackUrl: z
    .string()
    .url("URL invalide pour la photo du verso")
    .optional(),
})

export type UserProfileFormData = z.infer<typeof userProfileSchema>
export type IdentityVerificationFormData = z.infer<typeof identityVerificationSchema>