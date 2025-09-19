import { prisma } from "@/lib/prisma"

export interface ProfileCompletionStatus {
  isComplete: boolean
  missingFields: string[]
  completionPercentage: number
}

export async function checkProfileCompletion(userId: string): Promise<ProfileCompletionStatus> {
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

export function shouldRedirectToCompleteProfile(completionStatus: ProfileCompletionStatus): boolean {
  // Rediriger si le profil est incomplet (moins de 50% complété)
  return completionStatus.completionPercentage < 50
}