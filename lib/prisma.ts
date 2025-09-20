import { PrismaClient } from "./generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

// Vérifier que nous sommes côté serveur
if (typeof window !== 'undefined') {
  throw new Error('Prisma Client ne peut pas être utilisé côté client')
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// Éviter l'instanciation pendant le build
const createPrismaClient = () => {
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    console.warn('DATABASE_URL manquant en production')
    return null
  }

  try {
    return new PrismaClient().$extends(withAccelerate());
  } catch (error) {
    console.warn('Impossible de se connecter à la base de données:', error)
    return null
  }
}

const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

export { prisma };