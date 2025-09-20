import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

export interface ProfileCompletionStatus {
  isComplete: boolean
  missingFields: string[]
  completionPercentage: number
}

async function checkProfileCompletion(userId: string): Promise<ProfileCompletionStatus> {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId }
    })

    if (!profile) {
      return {
        isComplete: false,
        missingFields: ['profile'],
        completionPercentage: 0
      }
    }

    // Champs obligatoires pour un profil complet
    const requiredFields = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      dateOfBirth: profile.dateOfBirth,
      phoneNumber: profile.phoneNumber,
      address: profile.address,
      city: profile.city,
      country: profile.country
    }

    // Champs manquants
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field)

    const totalFields = Object.keys(requiredFields).length
    const completedFields = totalFields - missingFields.length
    const completionPercentage = Math.round((completedFields / totalFields) * 100)

    return {
      isComplete: missingFields.length === 0,
      missingFields,
      completionPercentage
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du profil:', error)
    return {
      isComplete: false,
      missingFields: ['error'],
      completionPercentage: 0
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Non authentifié'
      }, { status: 401 })
    }

    const completionStatus = await checkProfileCompletion(session.user.id)

    return NextResponse.json({
      success: true,
      data: completionStatus
    })
  } catch (error) {
    console.error('Erreur API check-completion:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 })
  }
}