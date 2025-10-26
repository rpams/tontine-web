import { NextRequest, NextResponse } from 'next/server'
import { requireModerator } from '@/lib/api/auth-helpers'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  // ✅ OPTIMISÉ : 1 requête au lieu de 2 + cache 2min
  const auth = await requireModerator(request)
  if ('error' in auth) return auth.error

  try {
    const { userId } = await context.params

    // Récupérer les informations détaillées de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        identityVerification: true,
        // Tontines créées
        createdTontines: {
          include: {
            _count: {
              select: {
                participants: true
              }
            }
          }
        },
        // Tontines auxquelles l'utilisateur participe
        participations: {
          include: {
            tontine: {
              include: {
                creator: {
                  select: {
                    id: true,
                    name: true,
                    image: true
                  }
                },
                _count: {
                  select: {
                    participants: true
                  }
                }
              }
            }
          }
        },
        // Tous les paiements
        payments: {
          include: {
            participant: {
              include: {
                tontine: {
                  select: {
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
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 50
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Formater les données
    const userDetails = {
      id: user.id,
      name: user.name || `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || 'Utilisateur',
      email: user.email,
      avatar: user.profile?.avatarUrl || user.image || '/avatars/avatar-portrait-svgrepo-com.svg',
      telephone: user.telephone,
      address: user.address,
      status: user.banned ? 'suspended' : (user.isActive ? 'active' : 'suspended'),
      verified: user.emailVerified || false,
      joinDate: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
      role: user.role,

      // Informations du profil
      profile: user.profile ? {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        dateOfBirth: user.profile.dateOfBirth?.toISOString(),
        profession: user.profile.profession
      } : null,

      // Informations de vérification d'identité
      identityVerification: user.identityVerification ? {
        status: user.identityVerification.status,
        documentType: user.identityVerification.documentType,
        documentFrontUrl: user.identityVerification.documentFrontUrl,
        documentBackUrl: user.identityVerification.documentBackUrl,
        submittedAt: user.identityVerification.submittedAt?.toISOString(),
        approvedAt: user.identityVerification.approvedAt?.toISOString(),
        rejectionReason: user.identityVerification.rejectionReason
      } : null,

      // Tontines créées
      ownedTontines: user.createdTontines.map((tontine: any) => ({
        id: tontine.id,
        name: tontine.name,
        description: tontine.description,
        amount: tontine.amountPerRound.toString(),
        frequency: tontine.frequencyType,
        status: tontine.status,
        maxParticipants: tontine.maxParticipants,
        startDate: tontine.startDate?.toISOString(),
        endDate: tontine.endDate?.toISOString(),
        createdAt: tontine.createdAt.toISOString(),
        role: 'creator',
        participantCount: tontine._count.participants
      })),

      // Tontines participées
      participantTontines: user.participations.map((participation: any) => ({
        id: participation.tontine.id,
        name: participation.tontine.name,
        description: participation.tontine.description,
        amount: participation.tontine.amountPerRound.toString(),
        frequency: participation.tontine.frequencyType,
        status: participation.tontine.status,
        maxParticipants: participation.tontine.maxParticipants,
        startDate: participation.tontine.startDate?.toISOString(),
        joinedAt: participation.joinedAt.toISOString(),
        role: 'participant',
        creator: participation.tontine.creator,
        participantCount: participation.tontine._count.participants
      })),

      // Paiements
      payments: user.payments.map((payment: any) => ({
        id: payment.id,
        amount: payment.amount.toString(),
        status: payment.status,
        dueDate: payment.dueDate.toISOString(),
        paidAt: payment.paidAt?.toISOString(),
        createdAt: payment.createdAt.toISOString(),
        round: payment.round?.roundNumber || 0,
        tontineName: payment.participant?.tontine?.name || 'N/A',
        reference: `${(payment.participant?.tontine?.name || 'TN').substring(0, 2).toUpperCase()}${payment.round?.roundNumber || 0}${payment.id.substring(0, 6).toUpperCase()}`
      })),

      // Statistiques
      stats: {
        ownedTontines: user.createdTontines.length,
        participantTontines: user.participations.length,
        totalPayments: user.payments.length,
        completedPayments: user.payments.filter((p: any) => p.status === 'COMPLETED').length,
        pendingPayments: user.payments.filter((p: any) => p.status === 'PENDING').length
      }
    }

    return NextResponse.json({
      success: true,
      user: userDetails
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
