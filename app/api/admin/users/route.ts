import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, invalidateUserCache } from '@/lib/api/auth-helpers'
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
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status !== 'all') {
      whereConditions.isActive = status === 'active'
    }

    // Récupérer les utilisateurs avec profils et vérifications d'identité
    const users = await prisma.user.findMany({
      where: whereConditions,
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
            profileImageUrl: true
          }
        },
        identityVerification: {
          select: {
            status: true
          }
        },
        _count: {
          select: {
            createdTontines: true,
            participations: true,
            payments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    // Calculer le total pour la pagination
    const total = await prisma.user.count({ where: whereConditions })

    // Formater les données
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.isActive ? 'active' : 'suspended',
      verified: user.emailVerified || false,
      joinDate: user.createdAt.toISOString(),
      avatar: user.profile?.avatarUrl || user.profile?.profileImageUrl || "/avatars/avatar-portrait-svgrepo-com.svg",
      role: user.role,
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
      identityVerificationStatus: user.identityVerification?.status || 'NOT_STARTED',
      stats: {
        ownedTontines: user._count.createdTontines,
        participantTontines: user._count.participations,
        totalPayments: user._count.payments
      }
    }))

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Erreur récupération utilisateurs admin:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des utilisateurs' },
      { status: 500 }
    )
  }
}

// Endpoint pour mettre à jour le statut d'un utilisateur
export async function PATCH(request: NextRequest) {
  // ✅ OPTIMISÉ : 1 requête au lieu de 2 + cache 2min
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const { userId, action } = await request.json()

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'ID utilisateur et action requis' },
        { status: 400 }
      )
    }

    let updateData: any = {}

    switch (action) {
      case 'activate':
        updateData.isActive = true
        break
      case 'suspend':
        updateData.isActive = false
        break
      case 'verify':
        updateData.emailVerified = true
        break
      default:
        return NextResponse.json(
          { error: 'Action non valide' },
          { status: 400 }
        )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
            profileImageUrl: true
          }
        }
      }
    })

    // ✅ Invalider le cache après modification du statut
    invalidateUserCache(userId)

    return NextResponse.json({
      message: 'Utilisateur mis à jour avec succès',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        status: updatedUser.isActive ? 'active' : 'suspended',
        verified: updatedUser.emailVerified || false,
        avatar: updatedUser.profile?.avatarUrl || updatedUser.profile?.profileImageUrl || "/avatars/avatar-portrait-svgrepo-com.svg"
      }
    })

  } catch (error) {
    console.error('Erreur mise à jour utilisateur admin:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour de l\'utilisateur' },
      { status: 500 }
    )
  }
}