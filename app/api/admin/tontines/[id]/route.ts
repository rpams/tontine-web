import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api/auth-helpers'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const { id: tontineId } = await params

    // Récupérer la tontine avec toutes les données détaillées (admin peut tout voir)
    const tontine = await prisma.tontine.findUnique({
      where: { id: tontineId },
      include: {
        creator: {
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
            },
            wonRounds: {
              select: {
                id: true,
                roundNumber: true,
                status: true,
                dueDate: true,
                completedAt: true
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
                        profileImageUrl: true,
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

      const displayName = participant.user.profile?.firstName && participant.user.profile?.lastName
        ? `${participant.user.profile.firstName} ${participant.user.profile.lastName}`
        : participant.user.name

      return {
        id: participant.id,
        userId: participant.user.id,
        name: displayName,
        email: participant.user.email,
        firstName: participant.user.profile?.firstName,
        lastName: participant.user.profile?.lastName,
        avatarUrl: participant.user.profile?.avatarUrl || participant.user.profile?.profileImageUrl || '/avatars/avatar-portrait-svgrepo-com.svg',
        sharesCount: participant.sharesCount,
        totalCommitted: participant.totalCommitted,
        isActive: participant.isActive,
        joinedAt: participant.joinedAt,
        position: tontine.participants.indexOf(participant) + 1,

        // Statistiques de paiement
        totalPayments: allPayments.length,
        paidPayments: paidPayments.length,
        pendingPayments: pendingPayments.length,
        isUpToDate: pendingPayments.length === 0,

        // Rounds gagnés
        wonRounds: participant.wonRounds
      }
    })

    // Formatage des rounds avec détails
    const roundsWithDetails = tontine.rounds.map(round => {
      const paymentsReceived = round.payments.filter(p => p.status === 'PAID').length
      const totalParticipants = tontine.participants.length

      const winnerDisplayName = round.winner?.user.profile?.firstName && round.winner?.user.profile?.lastName
        ? `${round.winner.user.profile.firstName} ${round.winner.user.profile.lastName}`
        : round.winner?.user.name

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
          participantId: round.winner.id,
          userId: round.winner.user.id,
          name: winnerDisplayName,
          email: round.winner.user.email,
          firstName: round.winner.user.profile?.firstName,
          lastName: round.winner.user.profile?.lastName,
          avatarUrl: round.winner.user.profile?.avatarUrl || round.winner.user.profile?.profileImageUrl || '/avatars/avatar-portrait-svgrepo-com.svg'
        } : null,

        // Statistiques des paiements pour ce round
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

    // Ordre des gagnants (winners order)
    const winnersOrder = tontine.rounds.map(round => {
      const isCompleted = round.status === 'COMPLETED'
      const isCurrent = round.status === 'COLLECTING' || (round.status === 'PENDING' && round === nextRound)
      const isUpcoming = round.status === 'PENDING' && round !== nextRound

      const winnerDisplayName = round.winner?.user.profile?.firstName && round.winner?.user.profile?.lastName
        ? `${round.winner.user.profile.firstName} ${round.winner.user.profile.lastName}`
        : round.winner?.user.name

      return {
        position: round.roundNumber,
        participantId: round.winner?.id,
        userId: round.winner?.user.id,
        name: winnerDisplayName || 'Non assigné',
        avatarUrl: round.winner?.user.profile?.avatarUrl || round.winner?.user.profile?.profileImageUrl || '/avatars/avatar-portrait-svgrepo-com.svg',
        status: isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming'
      }
    })

    const creatorDisplayName = tontine.creator.profile?.firstName && tontine.creator.profile?.lastName
      ? `${tontine.creator.profile.firstName} ${tontine.creator.profile.lastName}`
      : tontine.creator.name

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

      // Créateur
      creator: {
        id: tontine.creator.id,
        name: creatorDisplayName,
        email: tontine.creator.email
      },

      // Participants avec statistiques
      participants: participantsWithStats,
      participantCount: tontine._count.participants,

      // Rounds avec détails
      rounds: roundsWithDetails,
      totalRounds,
      completedRounds: completedRounds.length,
      completionPercentage,

      // Ordre des gagnants
      winnersOrder,

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
          avatarUrl: nextRound.winner.user.profile?.avatarUrl || nextRound.winner.user.profile?.profileImageUrl
        } : null
      } : null
    }

    return NextResponse.json({ tontine: formattedTontine })

  } catch (error) {
    console.error('Erreur récupération détail tontine admin:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de la tontine' },
      { status: 500 }
    )
  }
}
