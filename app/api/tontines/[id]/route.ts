import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = session.user.id
    const tontineId = params.id

    // Récupérer la tontine avec toutes les données détaillées
    const tontine = await prisma.tontine.findUnique({
      where: { id: tontineId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profile: {
                  select: {
                    avatarUrl: true,
                    profileImageUrl: true,
                    firstName: true,
                    lastName: true
                  }
                }
              }
            },
            payments: {
              select: {
                id: true,
                amount: true,
                status: true,
                paidAt: true,
                roundId: true
              }
            }
          },
          orderBy: { joinedAt: 'asc' }
        },
        rounds: {
          include: {
            winner: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    profile: {
                      select: {
                        avatarUrl: true,
                        firstName: true,
                        lastName: true
                      }
                    }
                  }
                }
              }
            },
            payments: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          },
          orderBy: { roundNumber: 'asc' }
        },
        _count: {
          select: {
            participants: true,
            rounds: true
          }
        }
      }
    })

    if (!tontine) {
      return NextResponse.json({ error: 'Tontine non trouvée' }, { status: 404 })
    }

    // Vérifier que l'utilisateur a accès à cette tontine
    const isOwner = tontine.creatorId === userId
    const isParticipant = tontine.participants.some(p => p.userId === userId)

    if (!isOwner && !isParticipant) {
      return NextResponse.json({ error: 'Accès non autorisé à cette tontine' }, { status: 403 })
    }

    // Trouver le prochain round
    const nextRound = tontine.rounds.find(round =>
      round.status === 'PENDING' || round.status === 'COLLECTING'
    )

    // Calculer les statistiques
    const completedRounds = tontine.rounds.filter(round => round.status === 'COMPLETED')
    const totalRounds = tontine.maxParticipants || tontine._count.participants
    const completionPercentage = totalRounds > 0 ? Math.round((completedRounds.length / totalRounds) * 100) : 0

    // Calculer les statistiques de paiement pour chaque participant
    const participantsWithStats = tontine.participants.map(participant => {
      const allPayments = participant.payments
      const paidPayments = allPayments.filter(p => p.status === 'PAID')
      const pendingPayments = allPayments.filter(p => p.status === 'PENDING')

      return {
        id: participant.id,
        userId: participant.user.id,
        name: participant.user.name,
        email: participant.user.email,
        firstName: participant.user.profile?.firstName,
        lastName: participant.user.profile?.lastName,
        avatarUrl: participant.user.profile?.avatarUrl || participant.user.profile?.profileImageUrl,
        sharesCount: participant.sharesCount,
        totalCommitted: participant.totalCommitted,
        isActive: participant.isActive,
        joinedAt: participant.joinedAt,

        // Statistiques de paiement
        totalPayments: allPayments.length,
        paidPayments: paidPayments.length,
        pendingPayments: pendingPayments.length,
        isUpToDate: pendingPayments.length === 0,

        // Vérifier s'il a gagné des rounds
        wonRounds: tontine.rounds.filter(round => round.winnerId === participant.id)
      }
    })

    // Formatage des rounds avec détails
    const roundsWithDetails = tontine.rounds.map(round => {
      const totalExpected = round.expectedAmount * tontine.participants.length
      const totalCollected = round.payments.reduce((sum, payment) =>
        payment.status === 'PAID' ? sum + payment.amount : sum, 0
      )
      const paymentsReceived = round.payments.filter(p => p.status === 'PAID').length
      const totalParticipants = tontine.participants.length

      return {
        id: round.id,
        roundNumber: round.roundNumber,
        expectedAmount: round.expectedAmount,
        collectedAmount: round.collectedAmount,
        distributedAmount: round.distributedAmount,
        dueDate: round.dueDate,
        collectionStartDate: round.collectionStartDate,
        completedAt: round.completedAt,
        status: round.status,
        createdAt: round.createdAt,
        updatedAt: round.updatedAt,

        // Détails du gagnant
        winner: round.winner ? {
          id: round.winner.id,
          userId: round.winner.user.id,
          name: round.winner.user.name,
          email: round.winner.user.email,
          firstName: round.winner.user.profile?.firstName,
          lastName: round.winner.user.profile?.lastName,
          avatarUrl: round.winner.user.profile?.avatarUrl
        } : null,

        // Statistiques des paiements pour ce round
        totalExpected,
        totalCollected,
        paymentsReceived,
        totalParticipants,
        isFullyPaid: paymentsReceived === totalParticipants,

        // Jours jusqu'à l'échéance
        daysUntil: Math.ceil((round.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),

        // Détails des paiements
        payments: round.payments.map(payment => ({
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          paidAt: payment.paidAt,
          user: payment.user
        }))
      }
    })

    // Données formatées pour le frontend
    const formattedTontine = {
      id: tontine.id,
      name: tontine.name,
      description: tontine.description,
      amountPerRound: tontine.amountPerRound,
      totalAmountPerRound: tontine.totalAmountPerRound,
      status: tontine.status,
      startDate: tontine.startDate,
      endDate: tontine.endDate,
      maxParticipants: tontine.maxParticipants,
      frequencyType: tontine.frequencyType,
      frequencyValue: tontine.frequencyValue,
      allowMultipleShares: tontine.allowMultipleShares,
      maxSharesPerUser: tontine.maxSharesPerUser,
      inviteCode: tontine.inviteCode,
      createdAt: tontine.createdAt,
      updatedAt: tontine.updatedAt,

      // Informations sur l'utilisateur
      isOwner,
      userRole: isOwner ? 'owner' : 'participant',

      // Créateur
      creator: tontine.creator,

      // Participants avec statistiques
      participants: participantsWithStats,
      participantCount: tontine._count.participants,

      // Rounds avec détails
      rounds: roundsWithDetails,
      totalRounds,
      completedRounds: completedRounds.length,
      completionPercentage,

      // Prochain round
      nextRound: nextRound ? {
        id: nextRound.id,
        roundNumber: nextRound.roundNumber,
        expectedAmount: nextRound.expectedAmount,
        collectedAmount: nextRound.collectedAmount,
        dueDate: nextRound.dueDate,
        status: nextRound.status,
        daysUntil: Math.ceil((nextRound.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        winner: nextRound.winner ? {
          id: nextRound.winner.id,
          userId: nextRound.winner.user.id,
          name: nextRound.winner.user.name,
          avatarUrl: nextRound.winner.user.profile?.avatarUrl
        } : null
      } : null
    }

    return NextResponse.json({ tontine: formattedTontine })

  } catch (error) {
    console.error('Erreur récupération détail tontine:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de la tontine' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}