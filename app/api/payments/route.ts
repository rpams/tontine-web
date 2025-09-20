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

    // Paramètres de requête
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')?.split(',').filter(Boolean) || []
    const type = searchParams.get('type')?.split(',').filter(Boolean) || []
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Construction des filtres pour les paiements de l'utilisateur
    const whereConditions: any = {
      userId // Paiements de l'utilisateur connecté
    }

    // Filtre par statut
    if (status.length > 0) {
      whereConditions.status = { in: status }
    }

    // Filtre par période
    if (startDate || endDate) {
      whereConditions.createdAt = {}
      if (startDate) {
        whereConditions.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        whereConditions.createdAt.lte = new Date(endDate)
      }
    }

    // Récupérer les paiements avec toutes les données nécessaires
    const [payments, totalCount] = await Promise.all([
      prisma.payment.findMany({
        where: whereConditions,
        include: {
          participant: {
            include: {
              tontine: {
                select: {
                  id: true,
                  name: true,
                  description: true
                }
              }
            }
          },
          round: {
            select: {
              id: true,
              roundNumber: true,
              dueDate: true,
              winner: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true
                    }
                  }
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),

      // Compte total pour la pagination
      prisma.payment.count({
        where: whereConditions
      })
    ])

    // Filtrage côté application pour la recherche et le type
    let filteredPayments = payments

    if (search) {
      const query = search.toLowerCase()
      filteredPayments = payments.filter(payment =>
        payment.participant.tontine.name.toLowerCase().includes(query) ||
        payment.transactionId?.toLowerCase().includes(query) ||
        payment.notes?.toLowerCase().includes(query) ||
        payment.round.winner?.user.name.toLowerCase().includes(query)
      )
    }

    if (type.length > 0) {
      filteredPayments = payments.filter(payment => {
        // Détermine le type basé sur si c'est le gagnant du round
        const isGain = payment.round.winner?.userId === userId
        const paymentType = isGain ? 'GAIN' : 'CONTRIBUTION'
        return type.includes(paymentType)
      })
    }

    // Formatage des données pour le frontend
    const formattedPayments = filteredPayments.map(payment => {
      const isGain = payment.round.winner?.userId === userId
      const recipient = isGain ? 'Vous' : (payment.round.winner?.user.name || 'En attente')

      return {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        dueDate: payment.dueDate,
        paidAt: payment.paidAt,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        notes: payment.notes,
        sharesCount: payment.sharesCount,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,

        // Type de transaction
        type: isGain ? 'GAIN' : 'CONTRIBUTION',

        // Informations sur la tontine
        tontine: {
          id: payment.participant.tontine.id,
          name: payment.participant.tontine.name,
          description: payment.participant.tontine.description
        },

        // Informations sur le round
        round: {
          id: payment.round.id,
          roundNumber: payment.round.roundNumber,
          dueDate: payment.round.dueDate
        },

        // Bénéficiaire
        recipient,

        // Référence générée
        reference: `${payment.participant.tontine.name.substring(0, 2).toUpperCase()}${payment.round.roundNumber.toString().padStart(2, '0')}${payment.id.substring(0, 6).toUpperCase()}`
      }
    })

    // Calcul des statistiques
    const stats = await calculatePaymentStats(userId)

    return NextResponse.json({
      payments: formattedPayments,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      stats
    })

  } catch (error) {
    console.error('Erreur récupération paiements:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des paiements' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Fonction pour calculer les statistiques des paiements
async function calculatePaymentStats(userId: string) {
  try {
    // Récupérer tous les paiements de l'utilisateur
    const allPayments = await prisma.payment.findMany({
      where: { userId },
      include: {
        round: {
          include: {
            winner: true
          }
        }
      }
    })

    // Calculs
    const totalPaid = allPayments
      .filter(p => p.round.winner?.userId !== userId && p.status === 'PAID')
      .reduce((sum, p) => sum + p.amount, 0)

    const totalReceived = allPayments
      .filter(p => p.round.winner?.userId === userId && p.status === 'PAID')
      .reduce((sum, p) => sum + p.amount, 0)

    const pendingAmount = allPayments
      .filter(p => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0)

    const thisMonthTransactions = allPayments
      .filter(p => {
        const paymentDate = new Date(p.createdAt)
        const now = new Date()
        return paymentDate.getMonth() === now.getMonth() &&
               paymentDate.getFullYear() === now.getFullYear()
      }).length

    return {
      totalPaid,
      totalReceived,
      pendingAmount,
      thisMonthTransactions
    }

  } catch (error) {
    console.error('Erreur calcul statistiques:', error)
    return {
      totalPaid: 0,
      totalReceived: 0,
      pendingAmount: 0,
      thisMonthTransactions: 0
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()

    // Validation des données requises
    const {
      participantId,
      roundId,
      amount,
      paymentMethod,
      transactionId,
      notes
    } = body

    if (!participantId || !roundId || !amount) {
      return NextResponse.json(
        { error: 'Données manquantes: participantId, roundId et amount sont requis' },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur est bien participant à cette tontine
    const participant = await prisma.tontineParticipant.findFirst({
      where: {
        id: participantId,
        userId
      },
      include: {
        tontine: true
      }
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant non trouvé ou non autorisé' },
        { status: 403 }
      )
    }

    // Vérifier que le round existe
    const round = await prisma.tontineRound.findUnique({
      where: { id: roundId }
    })

    if (!round) {
      return NextResponse.json(
        { error: 'Round non trouvé' },
        { status: 404 }
      )
    }

    // Créer le paiement
    const newPayment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        status: 'PENDING',
        dueDate: round.dueDate,
        paymentMethod,
        transactionId,
        notes,
        userId,
        participantId,
        roundId,
        sharesCount: participant.sharesCount
      },
      include: {
        participant: {
          include: {
            tontine: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        round: {
          select: {
            roundNumber: true
          }
        }
      }
    })

    return NextResponse.json({
      payment: {
        id: newPayment.id,
        amount: newPayment.amount,
        status: newPayment.status,
        createdAt: newPayment.createdAt,
        tontineName: newPayment.participant.tontine.name,
        roundNumber: newPayment.round.roundNumber
      }
    })

  } catch (error) {
    console.error('Erreur création paiement:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création du paiement' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}