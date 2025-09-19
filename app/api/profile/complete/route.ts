import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      username,
      gender,
      address,
      phone,
      avatarUrl,
      showUsernameByDefault
    } = body

    // Vérifier si le username est unique (si fourni)
    if (username) {
      const existingProfile = await prisma.userProfile.findFirst({
        where: {
          username,
          userId: { not: session.user.id }
        }
      })

      if (existingProfile) {
        return NextResponse.json(
          { error: 'Ce pseudo est déjà utilisé' },
          { status: 400 }
        )
      }
    }

    // Valider l'avatar URL (doit être soit prédéfini soit uploadé)
    const predefinedAvatars = [
      "/avatars/avatar-1.svg",
      "/avatars/avatar-2.svg",
      "/avatars/avatar-3.svg",
      "/avatars/avatar-4.svg",
      "/avatars/avatar-5.svg",
      "/avatars/avatar-6.svg",
      "/avatars/avatar-7.svg",
      "/avatars/avatar-8.svg"
    ]

    const isValidAvatar = !avatarUrl ||
      predefinedAvatars.includes(avatarUrl) ||
      avatarUrl.startsWith('/uploads/profile/')

    if (avatarUrl && !isValidAvatar) {
      return NextResponse.json(
        { error: 'URL d\'avatar non valide' },
        { status: 400 }
      )
    }

    // Mettre à jour ou créer le profil
    const updatedProfile = await prisma.userProfile.upsert({
      where: {
        userId: session.user.id
      },
      update: {
        username,
        gender,
        address,
        phoneNumber: phone,
        avatarUrl,
        showUsernameByDefault: showUsernameByDefault || false,
        isProfileComplete: true,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        username,
        gender,
        address,
        phoneNumber: phone,
        avatarUrl,
        showUsernameByDefault: showUsernameByDefault || false,
        isProfileComplete: true,
        preferredLanguage: 'fr',
        timezone: 'Africa/Dakar'
      }
    })

    return NextResponse.json({
      success: true,
      profile: updatedProfile
    })

  } catch (error) {
    console.error('Erreur lors de la completion du profil:', error)

    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.message.includes('username')) {
        return NextResponse.json(
          { error: 'Erreur avec le pseudo' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}