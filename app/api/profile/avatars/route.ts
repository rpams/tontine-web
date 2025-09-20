import { NextRequest, NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import path from 'path'

// Endpoint pour lister les avatars prédéfinis disponibles
export async function GET(request: NextRequest) {
  try {
    const avatarsDir = path.join(process.cwd(), 'public', 'avatars')

    try {
      // Lire le contenu du dossier avatars
      const files = await readdir(avatarsDir)

      // Filtrer seulement les fichiers image
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.webp']
      const avatarFiles = files.filter(file =>
        imageExtensions.includes(path.extname(file).toLowerCase())
      )

      // Générer les URLs publiques
      const avatars = avatarFiles.map(file => ({
        name: file,
        url: `/avatars/${file}`,
        // Optionnel: générer des métadonnées comme la couleur de bordure
        id: file.replace(path.extname(file), '')
      }))

      return NextResponse.json({
        avatars,
        count: avatars.length
      })

    } catch (dirError) {
      // Si le dossier n'existe pas, retourner une liste vide
      console.warn('Dossier avatars non trouvé:', avatarsDir)
      return NextResponse.json({
        avatars: [],
        count: 0,
        message: 'Dossier avatars non trouvé'
      })
    }

  } catch (error) {
    console.error('Erreur récupération avatars:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des avatars' },
      { status: 500 }
    )
  }
}