import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { PrismaClient } from "@/lib/generated/prisma";
import { admin } from "better-auth/plugins";
import { createAuthMiddleware } from "better-auth/api";

// Instance Prisma dédiée pour l'auth (côté serveur uniquement)
const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Désactivé pour le développement
    minPasswordLength: 6, // Minimum 6 caractères
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        transform: {
          input: (value: string) => value.toUpperCase(),
          output: (value: string) => value.toLowerCase()
        }
      }
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  trustedOrigins: ["http://localhost:3000"],
  session: {
    // Activer refresh tokens pour meilleure sécurité
    freshAge: 60 * 60 * 24, // 1 jour - après ça, refresh est requis
    expiresIn: 60 * 60 * 24 * 7, // 7 jours - durée totale max
  },
  plugins: [
    nextCookies(),
    admin(),
    // TODO: Ajouter rate limiting avec @upstash/ratelimit ou similaire
    // Pour protéger contre les attaques brute-force
  ],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Vérifier si c'est une inscription par email
      if (ctx.path === "/sign-up/email") {
        const newSession = ctx.context.newSession;

        if (newSession) {
          // Créer automatiquement un profil minimal après l'inscription
          try {
            // Vérifier si le profil existe déjà (au cas où)
            const existingProfile = await prisma.userProfile.findUnique({
              where: { userId: newSession.user.id }
            })

            if (!existingProfile) {
              await prisma.userProfile.create({
                data: {
                  userId: newSession.user.id,
                  // Profil minimal - sera complété dans complete-profile
                  firstName: newSession.user.name?.split(' ')[0] || null,
                  lastName: newSession.user.name?.split(' ').slice(1).join(' ') || null,
                  preferredLanguage: 'fr',
                  timezone: 'Africa/Dakar',
                  isProfileComplete: false
                }
              })

              console.log(`✅ Profil minimal créé pour ${newSession.user.email}`)
            } else {
              console.log(`ℹ️ Profil déjà existant pour ${newSession.user.email}`)
            }
          } catch (error) {
            console.error('❌ Erreur création profil:', error)
            // En cas d'erreur, supprimer l'utilisateur créé pour éviter état incohérent
            try {
              await prisma.user.delete({
                where: { id: newSession.user.id }
              })
              console.log(`🔄 Utilisateur ${newSession.user.email} supprimé suite à l'erreur`)
            } catch (deleteError) {
              console.error('❌ Erreur lors du rollback:', deleteError)
            }
            // Propager l'erreur pour informer l'utilisateur
            throw new Error("Erreur lors de la création du profil. Veuillez réessayer.")
          }
        }
      }
    })
  }
});