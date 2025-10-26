import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json({
        success: false,
        error: 'Username paramètre requis'
      }, { status: 400 })
    }

    // Validation basique
    if (username.length < 3) {
      return NextResponse.json({
        success: false,
        available: false,
        message: 'Le pseudo doit contenir au moins 3 caractères'
      })
    }

    if (username.length > 20) {
      return NextResponse.json({
        success: false,
        available: false,
        message: 'Le pseudo ne peut pas dépasser 20 caractères'
      })
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({
        success: false,
        available: false,
        message: 'Le pseudo ne peut contenir que des lettres, chiffres et underscore'
      })
    }

    // Vérifier si le username existe déjà
    const existingProfile = await prisma.userProfile.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive' // Case-insensitive
        }
      }
    })

    return NextResponse.json({
      success: true,
      available: !existingProfile,
      message: existingProfile
        ? 'Ce pseudo est déjà utilisé'
        : 'Ce pseudo est disponible'
    })

  } catch (error) {
    console.error('Erreur vérification username:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur lors de la vérification'
    }, { status: 500 })
  }
}
