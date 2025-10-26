import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, storeOTP } from '@/lib/services/otp';
import { sendOTPEmail } from '@/lib/services/email';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Ne pas révéler si l'utilisateur existe ou non
      return NextResponse.json(
        { success: false, error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Générer l'OTP
    const otp = generateOTP();

    // Stocker l'OTP (expire dans 3 minutes)
    await storeOTP(email, otp, 3);

    // Envoyer l'email
    const emailResult = await sendOTPEmail(email, otp);

    if (!emailResult.success) {
      console.error('Erreur envoi email OTP:', emailResult.error);
      return NextResponse.json(
        { success: false, error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Code OTP envoyé avec succès',
      // En mode développement, retourner le code pour les tests
      ...(process.env.NODE_ENV === 'development' && { devOtp: otp }),
    });

  } catch (error) {
    console.error('Erreur génération OTP:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
