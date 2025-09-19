import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

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

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const fileType: string = data.get('type') as string // 'profile' ou 'identity'

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Validation du type de fichier
    const allowedTypes = {
      profile: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      identity: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    }

    if (!allowedTypes[fileType as keyof typeof allowedTypes]?.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé' },
        { status: 400 }
      )
    }

    // Limiter la taille (5MB pour profil, 10MB pour identité)
    const maxSizes = {
      profile: 5 * 1024 * 1024, // 5MB
      identity: 10 * 1024 * 1024 // 10MB
    }

    if (file.size > maxSizes[fileType as keyof typeof maxSizes]) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Créer le nom de fichier unique
    const timestamp = Date.now()
    const extension = path.extname(file.name)
    const fileName = `${session.user.id}_${fileType}_${timestamp}${extension}`

    // Créer le dossier si nécessaire
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', fileType)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Sauvegarder le fichier
    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    // Retourner l'URL publique
    const publicUrl = `/uploads/${fileType}/${fileName}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    )
  }
}