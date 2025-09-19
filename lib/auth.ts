import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Désactivé pour le développement
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  trustedOrigins: ["http://localhost:3000"],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Check if this is a sign-up request
      if (ctx.path.startsWith("/sign-up")) {
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