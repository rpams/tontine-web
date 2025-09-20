import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { PrismaClient } from "@/lib/generated/prisma";
import { admin } from "better-auth/plugins";

const prisma = new PrismaClient();

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
  plugins: [nextCookies(), admin()],
  hooks: {
    after: [
      {
        matcher(context) {
          return context.path === "/sign-up/email";
        },
        handler: async (ctx) => {
          const session = ctx.context.session;

          if (session) {
            // Créer automatiquement un profil minimal après l'inscription
            try {
              await prisma.userProfile.create({
                data: {
                  userId: session.user.id,
                  // Profil minimal - sera complété dans complete-profile
                  firstName: session.user.name?.split(' ')[0] || null,
                  lastName: session.user.name?.split(' ').slice(1).join(' ') || null,
                  preferredLanguage: 'fr',
                  timezone: 'Africa/Dakar'
                }
              })

              console.log(`✅ Profil minimal créé pour ${session.user.email}`)
            } catch (error) {
              console.error('❌ Erreur création profil:', error)
            }
          }
        }
      }
    ]
  }
});