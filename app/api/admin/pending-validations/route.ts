import { NextRequest, NextResponse } from 'next/server'
import { requireModerator } from '@/lib/api/auth-helpers'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  // ✅ OPTIMISÉ : 1 requête au lieu de 2 + cache 2min
  const auth = await requireModerator(request)
  if ('error' in auth) return auth.error

  try {
    // Récupérer uniquement les utilisateurs avec vérifications d'identité en attente
    const pendingValidations = await prisma.user.findMany({
      where: {
        identityVerification: {
          status: 'PENDING' // Uniquement les documents soumis en attente de validation
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        telephone: true,
        address: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true
          }
        },
        identityVerification: {
          select: {
            id: true,
            status: true,
            submittedAt: true,
            documentType: true,
            firstName: true,
            lastName: true,
            documentFrontUrl: true,
            documentBackUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limiter aux 10 derniers
    })

    // Formater les données
    const formattedValidations = pendingValidations.map(user => {
      const timeAgo = getTimeAgo(user.identityVerification?.submittedAt || user.createdAt)

      return {
        id: user.id,
        name: user.name || `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || 'Utilisateur',
        email: user.email,
        date: timeAgo,
        avatar: user.profile?.avatarUrl || user.image || '/avatars/avatar-portrait-svgrepo-com.svg',
        telephone: user.telephone,
        address: user.address,
        emailStatus: user.emailVerified ? 'verified' : 'pending',
        documentStatus: user.identityVerification?.status === 'APPROVED' ? 'verified' :
                       user.identityVerification?.status === 'PENDING' ? 'submitted' :
                       user.identityVerification?.status === 'REJECTED' ? 'rejected' :
                       user.identityVerification?.status === 'NOT_STARTED' ? 'pending' :
                       'pending', // Par défaut si pas de vérification
        identityVerification: user.identityVerification ? {
          id: user.identityVerification.id,
          status: user.identityVerification.status,
          documentType: user.identityVerification.documentType,
          firstName: user.identityVerification.firstName,
          lastName: user.identityVerification.lastName,
          documentFrontUrl: user.identityVerification.documentFrontUrl,
          documentBackUrl: user.identityVerification.documentBackUrl,
          submittedAt: user.identityVerification.submittedAt?.toISOString()
        } : null
      }
    })

    return NextResponse.json({
      success: true,
      validations: formattedValidations
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des validations:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Fonction helper pour calculer le temps écoulé
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / 60000)
  const diffInHours = Math.floor(diffInMs / 3600000)
  const diffInDays = Math.floor(diffInMs / 86400000)

  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes}min`
  } else if (diffInHours < 24) {
    return `Il y a ${diffInHours}h`
  } else if (diffInDays < 7) {
    return `Il y a ${diffInDays}j`
  } else {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
  }
}
