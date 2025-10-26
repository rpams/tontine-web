import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé. Veuillez vous connecter.' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const { tontineId } = await request.json()

    if (!tontineId) {
      return NextResponse.json(
        { success: false, error: 'ID de tontine requis' },
        { status: 400 }
      )
    }

    // Vérifier que la tontine existe
    const tontine = await prisma.tontine.findUnique({
      where: { id: tontineId },
      include: {
        _count: {
          select: {
            participants: true
          }
        },
        participants: {
          where: { userId }
        }
      }
    })

    if (!tontine) {
      return NextResponse.json(
        { success: false, error: 'Tontine non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier si l'utilisateur est déjà participant
    if (tontine.participants.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Vous êtes déjà membre de cette tontine' },
        { status: 400 }
      )
    }

    // Vérifier le statut de la tontine
    if (tontine.status === 'COMPLETED' || tontine.status === 'CANCELLED') {
      return NextResponse.json(
        { success: false, error: 'Cette tontine n\'accepte plus de nouveaux participants' },
        { status: 400 }
      )
    }

    // Vérifier si la tontine est pleine
    if (tontine.maxParticipants && tontine._count.participants >= tontine.maxParticipants) {
      return NextResponse.json(
        { success: false, error: 'Cette tontine a atteint le nombre maximum de participants' },
        { status: 400 }
      )
    }

    // Ajouter l'utilisateur comme participant
    const participant = await prisma.tontineParticipant.create({
      data: {
        userId,
        tontineId,
        sharesCount: 1,
        totalCommitted: tontine.amountPerRound * (tontine.maxParticipants || 12), // Estimation
        isActive: true,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Vous avez rejoint la tontine avec succès',
      participant: {
        id: participant.id,
        tontineId: participant.tontineId
      }
    })

  } catch (error) {
    console.error('Erreur lors de la participation à la tontine:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la participation' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
