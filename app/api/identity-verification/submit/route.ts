import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const {
      documentType,
      firstName,
      lastName,
      telephone,
      address,
      email,
      frontDocumentUrl,
      backDocumentUrl
    } = data

    // Validation des champs obligatoires
    if (!documentType || !firstName || !lastName || !telephone || !address || !email || !frontDocumentUrl) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      )
    }

    // Vérification CNI: le verso est obligatoire
    if (documentType === 'CNI' && !backDocumentUrl) {
      return NextResponse.json(
        { success: false, error: 'Le verso de la CNI est obligatoire' },
        { status: 400 }
      )
    }

    // Mapper le documentType au format de l'enum Prisma
    const documentTypeMap: { [key: string]: 'CNI' | 'PASSPORT' | 'DRIVING_LICENSE' } = {
      'cni': 'CNI',
      'passport': 'PASSPORT',
      'driving_license': 'DRIVING_LICENSE'
    }

    const mappedDocumentType = documentTypeMap[documentType]
    if (!mappedDocumentType) {
      return NextResponse.json(
        { success: false, error: 'Type de document invalide' },
        { status: 400 }
      )
    }

    // Vérifier si une vérification existe déjà
    const existingVerification = await prisma.identityVerification.findUnique({
      where: { userId: session.user.id }
    })

    let verification

    if (existingVerification) {
      // Mettre à jour la vérification existante
      verification = await prisma.identityVerification.update({
        where: { userId: session.user.id },
        data: {
          documentType: mappedDocumentType,
          firstName,
          lastName,
          documentFrontUrl: frontDocumentUrl,
          documentBackUrl: backDocumentUrl || null,
          status: 'PENDING',
          submittedAt: new Date(),
          reviewedAt: null,
          approvedAt: null,
          rejectionReason: null,
          adminNotes: null
        }
      })
    } else {
      // Créer une nouvelle vérification
      verification = await prisma.identityVerification.create({
        data: {
          userId: session.user.id,
          documentType: mappedDocumentType,
          firstName,
          lastName,
          documentFrontUrl: frontDocumentUrl,
          documentBackUrl: backDocumentUrl || null,
          status: 'PENDING',
          submittedAt: new Date()
        }
      })
    }

    // Mettre à jour les informations de contact de l'utilisateur
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        telephone,
        address,
        email
      }
    })

    // TODO: Envoyer une notification à l'admin pour review
    // TODO: Envoyer un email de confirmation à l'utilisateur

    return NextResponse.json({
      success: true,
      message: 'Vérification d\'identité soumise avec succès',
      verification: {
        id: verification.id,
        status: verification.status,
        submittedAt: verification.submittedAt
      }
    })

  } catch (error) {
    console.error('Erreur lors de la soumission de la vérification:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
