import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api/auth-helpers'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  // ✅ OPTIMISÉ : 1 requête au lieu de 2 + cache 2min
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    // Construire les conditions de recherche
    const whereConditions: any = {}

    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status !== 'all') {
      whereConditions.status = status.toUpperCase()
    }

    // Récupérer les tontines avec créateur et statistiques
    const tontines = await prisma.tontine.findMany({
      where: whereConditions,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
                profileImageUrl: true
              }
            }
          }
        },
        participants: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            participants: true,
            rounds: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    // Calculer le total pour la pagination
    const total = await prisma.tontine.count({ where: whereConditions })

    // Formater les données
    const formattedTontines = tontines.map(tontine => ({
      id: tontine.id,
      name: tontine.name,
      description: tontine.description,
      amount: tontine.amountPerRound.toString(),
      frequency: tontine.frequencyType,
      status: tontine.status,
      maxParticipants: tontine.maxParticipants || 0,
      currentRound: tontine._count.rounds,
      totalRounds: tontine._count.rounds,
      startDate: tontine.startDate?.toISOString() || new Date().toISOString(),
      endDate: tontine.endDate?.toISOString() || null,
      createdAt: tontine.createdAt.toISOString(),
      creator: {
        id: tontine.creator.id,
        name: tontine.creator.name,
        email: tontine.creator.email,
        avatar: tontine.creator.profile?.avatarUrl || tontine.creator.profile?.profileImageUrl || "/avatars/avatar-portrait-svgrepo-com.svg"
      },
      stats: {
        participantCount: tontine._count.participants,
        paymentCount: tontine._count.rounds, // Utilise le nombre de rounds comme proxy
        completionRate: 0 // À calculer basé sur les rounds complétés si nécessaire
      }
    }))

    return NextResponse.json({
      tontines: formattedTontines,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Erreur récupération tontines admin:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des tontines' },
      { status: 500 }
    )
  }
}

// Endpoint pour mettre à jour le statut d'une tontine
export async function PATCH(request: NextRequest) {
  // ✅ OPTIMISÉ : 1 requête au lieu de 2 + cache 2min
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const { tontineId, action } = await request.json()

    if (!tontineId || !action) {
      return NextResponse.json(
        { error: 'ID tontine et action requis' },
        { status: 400 }
      )
    }

    let updateData: any = {}

    switch (action) {
      case 'activate':
        updateData.status = 'ACTIVE'
        break
      case 'suspend':
        updateData.status = 'SUSPENDED'
        break
      case 'complete':
        updateData.status = 'COMPLETED'
        break
      default:
        return NextResponse.json(
          { error: 'Action non valide' },
          { status: 400 }
        )
    }

    const updatedTontine = await prisma.tontine.update({
      where: { id: tontineId },
      data: updateData,
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Tontine mise à jour avec succès',
      tontine: {
        id: updatedTontine.id,
        name: updatedTontine.name,
        status: updatedTontine.status,
        creator: updatedTontine.creator
      }
    })

  } catch (error) {
    console.error('Erreur mise à jour tontine admin:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour de la tontine' },
      { status: 500 }
    )
  }
}