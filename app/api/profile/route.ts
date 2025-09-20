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

    // Récupérer l'utilisateur avec son profil
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        identityVerification: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Formatage des données pour le frontend
    const profileData = {
      id: user.id,
      name: user.name,
      email: user.email,
      telephone: user.telephone,
      address: user.address,
      createdAt: user.createdAt,

      // Données du profil
      firstName: user.profile?.firstName,
      lastName: user.profile?.lastName,
      username: user.profile?.username,
      gender: user.profile?.gender,
      dateOfBirth: user.profile?.dateOfBirth,
      nationality: user.profile?.nationality,
      profession: user.profile?.profession,
      phoneNumber: user.profile?.phoneNumber || user.telephone,
      city: user.profile?.city,
      country: user.profile?.country,
      postalCode: user.profile?.postalCode,
      avatarUrl: user.profile?.avatarUrl || user.profile?.profileImageUrl,
      preferredLanguage: user.profile?.preferredLanguage || 'fr',
      timezone: user.profile?.timezone || 'Africa/Dakar',
      isProfileComplete: user.profile?.isProfileComplete || false,

      // Statut de vérification
      isEmailVerified: user.emailVerified,
      isDocumentVerified: user.identityVerification?.status === 'APPROVED',
      verificationStatus: user.identityVerification?.status || 'NOT_STARTED',
      documentFrontUrl: user.identityVerification?.documentFrontUrl,
      documentBackUrl: user.identityVerification?.documentBackUrl
    }

    return NextResponse.json({ profile: profileData })

  } catch (error) {
    console.error('Erreur récupération profil:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du profil' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()

    const {
      name,
      telephone,
      address,
      firstName,
      lastName,
      username,
      gender,
      dateOfBirth,
      nationality,
      profession,
      phoneNumber,
      city,
      country,
      postalCode,
      avatarUrl,
      preferredLanguage,
      timezone
    } = body

    // Mise à jour en transaction pour assurer la cohérence
    const result = await prisma.$transaction(async (tx) => {
      // Mise à jour des données utilisateur principales
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(telephone && { telephone }),
          ...(address && { address })
        }
      })

      // Mise à jour ou création du profil utilisateur
      const updatedProfile = await tx.userProfile.upsert({
        where: { userId },
        update: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(username && { username }),
          ...(gender && { gender }),
          ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
          ...(nationality && { nationality }),
          ...(profession && { profession }),
          ...(phoneNumber && { phoneNumber }),
          ...(city && { city }),
          ...(country && { country }),
          ...(postalCode && { postalCode }),
          ...(avatarUrl !== undefined && { avatarUrl }),
          ...(preferredLanguage && { preferredLanguage }),
          ...(timezone && { timezone }),
          updatedAt: new Date()
        },
        create: {
          userId,
          firstName,
          lastName,
          username,
          gender,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          nationality,
          profession,
          phoneNumber,
          city,
          country,
          postalCode,
          avatarUrl,
          preferredLanguage: preferredLanguage || 'fr',
          timezone: timezone || 'Africa/Dakar'
        }
      })

      return { user: updatedUser, profile: updatedProfile }
    })

    return NextResponse.json({
      message: 'Profil mis à jour avec succès',
      profile: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        avatarUrl: result.profile.avatarUrl
      }
    })

  } catch (error) {
    console.error('Erreur mise à jour profil:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour du profil' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}