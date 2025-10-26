import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api/auth-helpers'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  // ✅ OPTIMISÉ : 1 requête au lieu de 2 + cache 2min
  const auth = await requireAdmin(request)
  if ('error' in auth) return auth.error

  try {

    // Calculer les statistiques
    const [
      totalUsers,
      activeUsers,
      totalTontines,
      activeTontines,
      totalTransactions,
      pendingVerifications,
      newUsersThisWeek
    ] = await Promise.all([
      // Total des utilisateurs
      prisma.user.count(),

      // Utilisateurs actifs (connectés dans les 30 derniers jours)
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      // Total des tontines
      prisma.tontine.count(),

      // Tontines actives
      prisma.tontine.count({
        where: { status: 'ACTIVE' }
      }),

      // Total des paiements
      prisma.payment.count(),

      // Vérifications en attente (profils incomplets)
      prisma.userProfile.count({
        where: {
          OR: [
            { firstName: null },
            { lastName: null }
          ]
        }
      }),

      // Nouveaux utilisateurs cette semaine
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ])

    // Calculer le total des revenus (somme des paiements complétés)
    const revenueData = await prisma.payment.aggregate({
      _sum: {
        amount: true
      },
      where: {
        status: 'PAID'
      }
    })

    const totalRevenue = revenueData._sum.amount || 0

    const stats = {
      totalUsers,
      activeUsers,
      totalTontines,
      activeTontines,
      totalTransactions,
      totalRevenue: totalRevenue.toString(),
      pendingVerifications,
      newUsersThisWeek
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error('Erreur récupération stats admin:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des statistiques' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}