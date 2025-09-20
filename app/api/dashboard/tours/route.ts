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
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'gains' ou 'contributions'

    if (type === 'gains') {
      // Tours où l'utilisateur est désigné gagnant
      const upcomingGains = await prisma.tontineRound.findMany({
        where: {
          winner: {
            userId
          },
          status: {
            in: ['PENDING', 'COLLECTING']
          },
          dueDate: {
            gte: new Date()
          }
        },
        include: {
          tontine: true,
          winner: true
        },
        orderBy: {
          dueDate: 'asc'
        }
      })

      const formattedGains = upcomingGains.map(round => ({
        id: round.id,
        tontineName: round.tontine.name,
        roundNumber: round.roundNumber,
        amount: round.expectedAmount,
        dueDate: round.dueDate,
        status: round.status,
        daysUntil: Math.ceil((round.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        isConfirmed: round.status === 'COLLECTING'
      }))

      return NextResponse.json({ gains: formattedGains })

    } else if (type === 'contributions') {
      // Paiements à venir pour l'utilisateur
      const upcomingPayments = await prisma.payment.findMany({
        where: {
          userId,
          status: 'PENDING',
          dueDate: {
            gte: new Date()
          }
        },
        include: {
          round: {
            include: {
              tontine: true
            }
          },
          participant: true
        },
        orderBy: {
          dueDate: 'asc'
        }
      })

      const formattedContributions = upcomingPayments.map(payment => ({
        id: payment.id,
        tontineName: payment.round.tontine.name,
        roundNumber: payment.round.roundNumber,
        amount: payment.amount,
        dueDate: payment.dueDate,
        status: payment.status,
        daysUntil: Math.ceil((payment.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        isConfirmed: payment.status === 'PAID'
      }))

      return NextResponse.json({ contributions: formattedContributions })

    } else {
      // Récupérer les deux types
      const [gainsResponse, contributionsResponse] = await Promise.all([
        fetch(`${request.url.split('?')[0]}?type=gains`),
        fetch(`${request.url.split('?')[0]}?type=contributions`)
      ])

      // Récupération simplifiée
      const [upcomingGains, upcomingPayments] = await Promise.all([
        prisma.tontineRound.findMany({
          where: {
            winner: {
              userId
            },
            status: {
              in: ['PENDING', 'COLLECTING']
            },
            dueDate: {
              gte: new Date()
            }
          },
          include: {
            tontine: true,
            winner: true
          },
          orderBy: {
            dueDate: 'asc'
          },
          take: 5
        }),

        prisma.payment.findMany({
          where: {
            userId,
            status: 'PENDING',
            dueDate: {
              gte: new Date()
            }
          },
          include: {
            round: {
              include: {
                tontine: true
              }
            },
            participant: true
          },
          orderBy: {
            dueDate: 'asc'
          },
          take: 5
        })
      ])

      const gains = upcomingGains.map(round => ({
        id: round.id,
        tontineName: round.tontine.name,
        roundNumber: round.roundNumber,
        amount: round.expectedAmount,
        dueDate: round.dueDate,
        status: round.status,
        daysUntil: Math.ceil((round.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        isConfirmed: round.status === 'COLLECTING'
      }))

      const contributions = upcomingPayments.map(payment => ({
        id: payment.id,
        tontineName: payment.round.tontine.name,
        roundNumber: payment.round.roundNumber,
        amount: payment.amount,
        dueDate: payment.dueDate,
        status: payment.status,
        daysUntil: Math.ceil((payment.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        isConfirmed: payment.status === 'PAID'
      }))

      return NextResponse.json({ gains, contributions })
    }

  } catch (error) {
    console.error('Erreur récupération tours dashboard:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des tours' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}