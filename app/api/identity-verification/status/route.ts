import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer la vérification d'identité
    const verification = await prisma.identityVerification.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        status: true,
        submittedAt: true,
        reviewedAt: true,
        approvedAt: true,
        documentType: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!verification) {
      return NextResponse.json({
        success: true,
        verification: null,
        hasVerification: false
      })
    }

    return NextResponse.json({
      success: true,
      verification,
      hasVerification: true
    })

  } catch (error) {
    console.error('Erreur lors de la récupération du statut:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
