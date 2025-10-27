import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api/auth-helpers'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {
    const { tontineId, winnersOrder } = await request.json()

    if (!tontineId || !winnersOrder || !Array.isArray(winnersOrder)) {
      return NextResponse.json(
        { error: 'ID tontine et ordre des gagnants requis' },
        { status: 400 }
      )
    }

    // Vérifier que la tontine existe
    const tontine = await prisma.tontine.findUnique({
      where: { id: tontineId },
      include: {
        rounds: {
          where: {
            status: {
              not: 'COMPLETED' // Tous les rounds qui ne sont pas complétés
            }
          },
          orderBy: {
            roundNumber: 'asc'
          }
        }
      }
    })

    if (!tontine) {
      return NextResponse.json(
        { error: 'Tontine non trouvée' },
        { status: 404 }
      )
    }

    console.log(`Mise à jour de l'ordre pour ${winnersOrder.length} gagnants dans ${tontine.rounds.length} rounds`)

    // Mettre à jour l'ordre des gagnants pour les rounds à venir
    // winnersOrder est un tableau avec des objets contenant : { participantId, position }
    const updatePromises = winnersOrder.map(async (winner: { participantId: string; position?: number }, index: number) => {
      // Trouver le round correspondant à cette position
      // Les rounds qui ne sont pas current devraient être modifiables
      if (index < tontine.rounds.length) {
        const round = tontine.rounds[index]

        console.log(`Mise à jour du round ${round.roundNumber}: winnerId = ${winner.participantId}`)

        return prisma.tontineRound.update({
          where: { id: round.id },
          data: {
            winnerId: winner.participantId
          }
        })
      }
      return null
    })

    const results = await Promise.all(updatePromises.filter(p => p !== null))
    console.log(`${results.length} rounds mis à jour avec succès`)

    return NextResponse.json({
      success: true,
      message: 'Ordre des gagnants mis à jour avec succès'
    })

  } catch (error) {
    console.error('Erreur mise à jour ordre des gagnants:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour de l\'ordre' },
      { status: 500 }
    )
  }
}
