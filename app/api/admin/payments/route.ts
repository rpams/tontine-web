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
    const status = searchParams.get('status') || 'all'
    const tontineId = searchParams.get('tontineId')

    // Construire les conditions de recherche
    const whereConditions: any = {}

    if (status !== 'all') {
      whereConditions.status = status.toUpperCase()
    }

    if (tontineId) {
      whereConditions.round = {
        tontineId: tontineId
      }
    }

    // Récupérer les paiements avec utilisateur, round et tontine
    const payments = await prisma.payment.findMany({
      where: whereConditions,
      include: {
        user: {
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
        round: {
          select: {
            id: true,
            roundNumber: true,
            tontine: {
              select: {
                id: true,
                name: true,
                status: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    // Calculer le total pour la pagination
    const total = await prisma.payment.count({ where: whereConditions })

    // Formater les données
    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      amount: payment.amount.toString(),
      status: payment.status,
      dueDate: payment.dueDate.toISOString(),
      paidAt: payment.paidAt?.toISOString() || null,
      createdAt: payment.createdAt.toISOString(),
      round: payment.round.roundNumber,
      user: {
        id: payment.user.id,
        name: payment.user.name,
        email: payment.user.email,
        avatar: payment.user.profile?.avatarUrl || payment.user.profile?.profileImageUrl || "/avatars/avatar-portrait-svgrepo-com.svg"
      },
      tontine: {
        id: payment.round.tontine.id,
        name: payment.round.tontine.name,
        status: payment.round.tontine.status
      }
    }))

    return NextResponse.json({
      payments: formattedPayments,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Erreur récupération paiements admin:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des paiements' },
      { status: 500 }
    )
  }
}

// Endpoint pour mettre à jour le statut d'un paiement
export async function PATCH(request: NextRequest) {
  // ✅ OPTIMISÉ : 1 requête au lieu de 2 + cache 2min
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const { paymentId, action } = await request.json()

    if (!paymentId || !action) {
      return NextResponse.json(
        { error: 'ID paiement et action requis' },
        { status: 400 }
      )
    }

    let updateData: any = {}

    switch (action) {
      case 'approve':
        updateData.status = 'PAID'
        updateData.paidAt = new Date()
        break
      case 'reject':
        updateData.status = 'FAILED'
        break
      case 'reset':
        updateData.status = 'PENDING'
        updateData.paidAt = null
        break
      default:
        return NextResponse.json(
          { error: 'Action non valide' },
          { status: 400 }
        )
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: updateData,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        round: {
          select: {
            tontine: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Paiement mis à jour avec succès',
      payment: {
        id: updatedPayment.id,
        status: updatedPayment.status,
        amount: updatedPayment.amount.toString(),
        user: updatedPayment.user,
        tontine: updatedPayment.round.tontine
      }
    })

  } catch (error) {
    console.error('Erreur mise à jour paiement admin:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour du paiement' },
      { status: 500 }
    )
  }
}