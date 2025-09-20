import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = session.user.id

    // Récupérer les stats globales de l'utilisateur
    const [
      userTontines,
      userParticipations,
      totalContributions,
      nextRound,
      recentGains
    ] = await Promise.all([
      // Tontines créées par l'utilisateur
      prisma.tontine.findMany({
        where: { creatorId: userId },
        include: {
          participants: true,
          rounds: {
            orderBy: { roundNumber: 'asc' }
          }
        }
      }),

      // Participations de l'utilisateur
      prisma.tontineParticipant.findMany({
        where: { userId },
        include: {
          tontine: {
            include: {
              rounds: {
                orderBy: { roundNumber: 'asc' }
              }
            }
          },
          payments: true
        }
      }),

      // Total des contributions payées
      prisma.payment.aggregate({
        where: {
          userId,
          status: 'PAID'
        },
        _sum: {
          amount: true
        }
      }),

      // Prochain round à venir
      prisma.tontineRound.findFirst({
        where: {
          tontine: {
            participants: {
              some: { userId }
            }
          },
          status: {
            in: ['PENDING', 'COLLECTING']
          },
          dueDate: {
            gte: new Date()
          }
        },
        include: {
          tontine: true
        },
        orderBy: {
          dueDate: 'asc'
        }
      }),

      // Gains récents (rounds gagnés)
      prisma.tontineRound.findMany({
        where: {
          winner: {
            userId
          },
          status: 'COMPLETED'
        },
        include: {
          tontine: true
        },
        orderBy: {
          completedAt: 'desc'
        },
        take: 3
      })
    ])

    // Calculer les stats
    const totalTontines = userTontines.length + userParticipations.length
    const totalSaved = totalContributions._sum.amount || 0

    // Calculer le rendement moyen (simplifié)
    const completedRounds = recentGains.length
    const avgReturn = completedRounds > 0 ? 12.5 : 0 // Exemple de calcul

    // Prochain tour
    const nextTontine = nextRound ? {
      name: nextRound.tontine.name,
      daysUntil: Math.ceil((nextRound.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    } : null

    const stats = {
      totalSaved,
      totalTontines,
      nextTontine,
      avgReturn,
      recentActivity: {
        newTontinesThisMonth: userTontines.filter(t =>
          t.createdAt >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        ).length,
        completedRoundsThisMonth: recentGains.filter(r =>
          r.completedAt && r.completedAt >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        ).length
      }
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Erreur récupération stats dashboard:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des statistiques' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}