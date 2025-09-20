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
    const limit = parseInt(searchParams.get('limit') || '10')

    // Récupérer les tontines de l'utilisateur (créées + participations)
    const [ownedTontines, participatedTontines] = await Promise.all([
      // Tontines créées par l'utilisateur
      prisma.tontine.findMany({
        where: { creatorId: userId },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
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
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      }),

      // Tontines où l'utilisateur participe
      prisma.tontineParticipant.findMany({
        where: {
          userId,
          tontine: {
            creatorId: { not: userId } // Exclure celles qu'il a créées
          }
        },
        include: {
          tontine: {
            include: {
              participants: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true
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
              }
            }
          }
        },
        orderBy: { joinedAt: 'desc' },
        take: limit
      })
    ])

    // Formater les données
    const formatTontine = (tontine: any, isOwner: boolean) => {
      const nextRound = tontine.rounds?.[0]
      const participantCount = tontine.participants?.length || 0

      return {
        id: tontine.id,
        name: tontine.name,
        description: tontine.description,
        amountPerRound: tontine.amountPerRound,
        status: tontine.status,
        isOwner,
        participantCount,
        nextRound: nextRound ? {
          roundNumber: nextRound.roundNumber,
          dueDate: nextRound.dueDate,
          status: nextRound.status,
          daysUntil: Math.ceil((nextRound.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        } : null,
        createdAt: tontine.createdAt
      }
    }

    const formattedOwnedTontines = ownedTontines.map(t => formatTontine(t, true))
    const formattedParticipatedTontines = participatedTontines.map(p => formatTontine(p.tontine, false))

    // Combiner et trier par date de création
    const allTontines = [
      ...formattedOwnedTontines,
      ...formattedParticipatedTontines
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      tontines: allTontines.slice(0, limit),
      total: allTontines.length
    })

  } catch (error) {
    console.error('Erreur récupération tontines dashboard:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des tontines' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}