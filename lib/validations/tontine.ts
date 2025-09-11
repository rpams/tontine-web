import * as z from "zod";

export const createTontineSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  amountPerRound: z.number().min(1000, "Le montant minimum est de 1000 FCFA"),
  frequencyType: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
  frequencyValue: z.number().min(1, "La fréquence doit être d'au moins 1"),
  startDate: z.date({
    required_error: "La date de début est requise",
  }),
  maxParticipants: z.number().min(2, "Il faut au moins 2 participants").max(50, "Maximum 50 participants").optional(),
  allowMultipleShares: z.boolean().default(true),
});

export type CreateTontineFormData = z.infer<typeof createTontineSchema>;

export const frequencyOptions = [
  { value: "DAILY" as const, label: "Quotidienne" },
  { value: "WEEKLY" as const, label: "Hebdomadaire" },
  { value: "MONTHLY" as const, label: "Mensuelle" },
  { value: "YEARLY" as const, label: "Annuelle" },
];