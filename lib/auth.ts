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
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    }
  },
  plugins: [nextCookies(), admin()],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Vérifier si c'est une inscription par email
      if (ctx.path === "/sign-up/email") {
        const newSession = ctx.context.newSession;

        if (newSession) {
          // Créer automatiquement un profil minimal après l'inscription
          try {
            await prisma.userProfile.create({
              data: {
                userId: newSession.user.id,
                // Profil minimal - sera complété dans complete-profile
                firstName: newSession.user.name?.split(' ')[0] || null,
                lastName: newSession.user.name?.split(' ').slice(1).join(' ') || null,
                preferredLanguage: 'fr',
                timezone: 'Africa/Dakar'
              }
            })

            console.log(`✅ Profil minimal créé pour ${newSession.user.email}`)
          } catch (error) {
            console.error('❌ Erreur création profil:', error)
          }
        }
      }
    })
  }
});