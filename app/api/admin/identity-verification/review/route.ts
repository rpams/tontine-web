import { NextRequest, NextResponse } from 'next/server'
import { requireModerator } from '@/lib/api/auth-helpers'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  // ✅ OPTIMISÉ : 1 requête au lieu de 2 + cache 2min
  const auth = await requireModerator(request)
  if ('error' in auth) return auth.error

  try {
    const { verificationId, action, message } = await request.json()

    if (!verificationId || !action) {
      return NextResponse.json(
        { success: false, error: 'verificationId et action sont requis' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Action invalide. Utilisez "approve" ou "reject"' },
        { status: 400 }
      )
    }

    // Récupérer la vérification
    const verification = await prisma.identityVerification.findUnique({
      where: { id: verificationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!verification) {
      return NextResponse.json(
        { success: false, error: 'Vérification non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que la vérification est en attente
    if (verification.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: 'Cette vérification a déjà été traitée' },
        { status: 400 }
      )
    }

    // Mettre à jour la vérification selon l'action
    const updateData: any = {
      reviewedAt: new Date(),
      reviewedById: auth.user.id
    }

    if (action === 'approve') {
      updateData.status = 'APPROVED'
      updateData.approvedAt = new Date()
      if (message) {
        updateData.adminNotes = message
      }
    } else {
      updateData.status = 'REJECTED'
      updateData.rejectionReason = message || 'Document non conforme'
    }

    const updatedVerification = await prisma.identityVerification.update({
      where: { id: verificationId },
      data: updateData
    })

    // TODO: Envoyer une notification à l'utilisateur
    // TODO: Envoyer un email à l'utilisateur

    return NextResponse.json({
      success: true,
      message: action === 'approve'
        ? 'Vérification approuvée avec succès'
        : 'Vérification rejetée',
      verification: {
        id: updatedVerification.id,
        status: updatedVerification.status,
        reviewedAt: updatedVerification.reviewedAt
      },
      user: {
        name: verification.user.name,
        email: verification.user.email
      }
    })

  } catch (error) {
    console.error('Erreur lors de la révision de la vérification:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
