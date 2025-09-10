"use server"

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { z } from "zod"

const signUpSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

export async function signUpAction(formData: FormData) {
  try {
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }

    const validatedData = signUpSchema.parse(data)

    const result = await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
      },
    })

    if (result.error) {
      return { 
        error: result.error.message || "Erreur lors de l'inscription"
      }
    }

    redirect("/dashboard")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.errors[0].message
      }
    }
    
    return {
      error: "Une erreur est survenue lors de l'inscription"
    }
  }
}