import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

/**
 * Génère un code OTP à 4 chiffres
 */
export function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Stocke un OTP dans la base de données
 */
export async function storeOTP(email: string, otp: string, expiresInMinutes: number = 3): Promise<void> {
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  // Supprimer les anciens OTPs pour cet email
  await prisma.verification.deleteMany({
    where: {
      identifier: email,
    },
  });

  // Créer le nouveau OTP
  await prisma.verification.create({
    data: {
      id: `otp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      identifier: email,
      value: otp,
      expiresAt,
    },
  });
}

/**
 * Vérifie un OTP
 */
export async function verifyOTP(email: string, otp: string): Promise<{ valid: boolean; message: string }> {
  const verification = await prisma.verification.findFirst({
    where: {
      identifier: email,
      value: otp,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!verification) {
    return {
      valid: false,
      message: "Code OTP invalide ou expiré.",
    };
  }

  // Vérifier l'expiration
  if (new Date() > verification.expiresAt) {
    // Supprimer l'OTP expiré
    await prisma.verification.delete({
      where: { id: verification.id },
    });

    return {
      valid: false,
      message: "Le code OTP a expiré.",
    };
  }

  // OTP valide, le supprimer pour éviter la réutilisation
  await prisma.verification.delete({
    where: { id: verification.id },
  });

  return {
    valid: true,
    message: "Code OTP vérifié avec succès.",
  };
}

/**
 * Nettoie les OTPs expirés (à appeler périodiquement)
 */
export async function cleanupExpiredOTPs(): Promise<number> {
  const result = await prisma.verification.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return result.count;
}
