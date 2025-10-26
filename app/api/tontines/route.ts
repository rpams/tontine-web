import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@/lib/generated/prisma'
import { generateInviteCode } from '@/lib/utils/invite-code'

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
    const role = searchParams.get('role')?.split(',').filter(Boolean) || []

    // Construction des filtres
    const whereConditions: any = {
      OR: [
        { creatorId: userId }, // Tontines créées par l'utilisateur
        {
          participants: {
            some: { userId } // Tontines où l'utilisateur participe
          }
        }
      ]
    }

    // Filtre par recherche (nom et description)
    if (search) {
      whereConditions.AND = whereConditions.AND || []
      whereConditions.AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    // Filtre par statut
    if (status.length > 0) {
      whereConditions.AND = whereConditions.AND || []
      whereConditions.AND.push({
        status: { in: status }
      })
    }

    // Récupérer les tontines avec toutes les données nécessaires
    const [tontines, totalCount] = await Promise.all([
      prisma.tontine.findMany({
        where: whereConditions,
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
              }
            }
          },
          rounds: {
            where: {
              status: {
                in: ['PENDING', 'COLLECTING']
              }
            },
            orderBy: { dueDate: 'asc' },
            take: 1
          },
          _count: {
            select: {
              participants: true,
              rounds: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),

      // Compte total pour la pagination
      prisma.tontine.count({
        where: whereConditions
      })
    ])

    // Filtrage côté application pour le rôle (plus efficace que plusieurs requêtes)
    let filteredTontines = tontines

    if (role.length > 0) {
      filteredTontines = tontines.filter(tontine => {
        const isOwner = tontine.creatorId === userId
        const isParticipant = tontine.participants.some(p => p.userId === userId && !isOwner)

        return (
          (role.includes('owner') && isOwner) ||
          (role.includes('participant') && isParticipant)
        )
      })
    }

    // Formatage des données pour le frontend
    const formattedTontines = filteredTontines.map(tontine => {
      const isOwner = tontine.creatorId === userId
      const userParticipation = tontine.participants.find(p => p.userId === userId)
      const nextRound = tontine.rounds[0]

      return {
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
        createdAt: tontine.createdAt,
        updatedAt: tontine.updatedAt,

        // Informations sur l'utilisateur
        isOwner,
        userRole: isOwner ? 'owner' : 'participant',
        userShares: userParticipation?.sharesCount || 0,

        // Informations sur les participants
        participantCount: tontine._count.participants,
        participants: tontine.participants.map(p => ({
          id: p.id,
          userId: p.user.id,
          name: p.user.name,
          email: p.user.email,
          firstName: p.user.profile?.firstName,
          lastName: p.user.profile?.lastName,
          avatarUrl: p.user.profile?.avatarUrl || p.user.profile?.profileImageUrl,
          sharesCount: p.sharesCount,
          totalCommitted: p.totalCommitted,
          isActive: p.isActive,
          joinedAt: p.joinedAt
        })),

        // Informations sur le prochain round
        nextRound: nextRound ? {
          id: nextRound.id,
          roundNumber: nextRound.roundNumber,
          expectedAmount: nextRound.expectedAmount,
          collectedAmount: nextRound.collectedAmount,
          dueDate: nextRound.dueDate,
          status: nextRound.status,
          daysUntil: Math.ceil((nextRound.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        } : null,

        // Statistiques
        totalRounds: tontine._count.rounds,

        // Créateur
        creator: {
          id: tontine.creator.id,
          name: tontine.creator.name,
          email: tontine.creator.email
        }
      }
    })

    return NextResponse.json({
      tontines: formattedTontines,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error('Erreur récupération tontines:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des tontines' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
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
      name,
      description,
      amountPerRound,
      frequencyType,
      frequencyValue = 1,
      maxParticipants,
      allowMultipleShares = true,
      maxSharesPerUser = 3,
      startDate
    } = body

    if (!name || !amountPerRound || !frequencyType || !maxParticipants) {
      return NextResponse.json(
        { error: 'Données manquantes: name, amountPerRound, frequencyType et maxParticipants sont requis' },
        { status: 400 }
      )
    }

    // Générer un code d'invitation unique
    let inviteCode = generateInviteCode()
    let attempts = 0
    const maxAttempts = 10

    // Vérifier que le code est unique, sinon régénérer
    while (attempts < maxAttempts) {
      const existing = await prisma.tontine.findUnique({
        where: { inviteCode }
      })

      if (!existing) break

      inviteCode = generateInviteCode()
      attempts++
    }

    if (attempts === maxAttempts) {
      return NextResponse.json(
        { error: 'Impossible de générer un code d\'invitation unique. Veuillez réessayer.' },
        { status: 500 }
      )
    }

    // Créer la tontine
    const newTontine = await prisma.tontine.create({
      data: {
        name,
        description,
        amountPerRound: parseFloat(amountPerRound),
        totalAmountPerRound: parseFloat(amountPerRound) * maxParticipants,
        frequencyType,
        frequencyValue,
        maxParticipants: parseInt(maxParticipants),
        allowMultipleShares,
        maxSharesPerUser: parseInt(maxSharesPerUser),
        startDate: startDate ? new Date(startDate) : null,
        inviteCode,
        creatorId: userId,
        status: 'DRAFT'
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            participants: true
          }
        }
      }
    })

    return NextResponse.json({
      tontine: {
        id: newTontine.id,
        name: newTontine.name,
        description: newTontine.description,
        amountPerRound: newTontine.amountPerRound,
        inviteCode: newTontine.inviteCode,
        status: newTontine.status,
        createdAt: newTontine.createdAt,
        isOwner: true,
        participantCount: 0,
        creator: newTontine.creator
      }
    })

  } catch (error) {
    console.error('Erreur création tontine:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de la tontine' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}