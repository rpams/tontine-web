import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@/lib/generated/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

// Endpoint pour mettre à jour l'avatar (prédéfini ou uploadé)
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
    const { avatarUrl } = body

    if (!avatarUrl) {
      return NextResponse.json(
        { error: 'URL de l\'avatar requise' },
        { status: 400 }
      )
    }

    // Mise à jour ou création du profil avec le nouvel avatar
    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        avatarUrl,
        updatedAt: new Date()
      },
      create: {
        userId,
        avatarUrl,
        preferredLanguage: 'fr',
        timezone: 'Africa/Dakar'
      }
    })

    return NextResponse.json({
      message: 'Avatar mis à jour avec succès',
      avatarUrl: updatedProfile.avatarUrl
    })

  } catch (error) {
    console.error('Erreur mise à jour avatar:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour de l\'avatar' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Endpoint pour uploader un avatar personnalisé
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = session.user.id
    const formData = await request.formData()
    const file = formData.get('avatar') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Validation du fichier
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux. Maximum 5MB autorisé.' },
        { status: 400 }
      )
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Utilisez JPG, PNG ou WebP.' },
        { status: 400 }
      )
    }

    // Génération d'un nom unique pour le fichier
    const fileExtension = path.extname(file.name) || '.jpg'
    const fileName = `avatar-${userId}-${uuidv4()}${fileExtension}`
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'avatars', fileName)

    // Créer le répertoire s'il n'existe pas
    const uploadDir = path.dirname(uploadPath)
    await mkdir(uploadDir, { recursive: true })

    // Sauvegarder le fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(uploadPath, buffer)

    // URL publique du fichier
    const avatarUrl = `/uploads/avatars/${fileName}`

    // Mise à jour ou création du profil avec le nouvel avatar
    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        avatarUrl,
        updatedAt: new Date()
      },
      create: {
        userId,
        avatarUrl,
        preferredLanguage: 'fr',
        timezone: 'Africa/Dakar'
      }
    })

    return NextResponse.json({
      message: 'Avatar uploadé avec succès',
      avatarUrl: updatedProfile.avatarUrl
    })

  } catch (error) {
    console.error('Erreur upload avatar:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'upload de l\'avatar' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}