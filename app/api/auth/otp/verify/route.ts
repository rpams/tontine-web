import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/services/otp';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email et code OTP requis' },
        { status: 400 }
      );
    }

    // Vérifier l'OTP
    const result = await verifyOTP(email, otp);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });

  } catch (error) {
    console.error('Erreur vérification OTP:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
