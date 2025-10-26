import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { inviteCode } = await request.json()

    if (!inviteCode) {
      return NextResponse.json(
        { success: false, error: 'Code d\'invitation requis' },
        { status: 400 }
      )
    }

    // Rechercher la tontine par code d'invitation
    const tontine = await prisma.tontine.findUnique({
      where: {
        inviteCode: inviteCode.toUpperCase().trim()
      },
      include: {
        _count: {
          select: {
            participants: true
          }
        }
      }
    })

    if (!tontine) {
      return NextResponse.json(
        { success: false, error: 'Code d\'invitation invalide. Vérifiez et réessayez.' },
        { status: 404 }
      )
    }

    // Vérifier si la tontine est encore ouverte aux nouveaux participants
    if (tontine.status === 'COMPLETED' || tontine.status === 'CANCELLED') {
      return NextResponse.json(
        { success: false, error: 'Cette tontine n\'accepte plus de nouveaux participants.' },
        { status: 400 }
      )
    }

    // Vérifier si la tontine est pleine
    if (tontine.maxParticipants && tontine._count.participants >= tontine.maxParticipants) {
      return NextResponse.json(
        { success: false, error: 'Cette tontine a atteint le nombre maximum de participants.' },
        { status: 400 }
      )
    }

    // Retourner les détails de la tontine
    return NextResponse.json({
      success: true,
      tontine: {
        id: tontine.id,
        name: tontine.name,
        description: tontine.description,
        participants: tontine._count.participants,
        maxParticipants: tontine.maxParticipants,
        amountPerRound: tontine.amountPerRound,
        frequencyType: tontine.frequencyType,
        status: tontine.status
      }
    })

  } catch (error) {
    console.error('Erreur vérification code tontine:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la vérification du code' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
