export interface ProfileCompletionStatus {
  isComplete: boolean
  missingFields: string[]
  completionPercentage: number
}

// Fonction côté client pour récupérer le statut de completion du profil
export async function checkProfileCompletion(): Promise<ProfileCompletionStatus> {
  try {
    const response = await fetch('/api/profile/check-completion')
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Erreur de récupération')
    }

    return result.data
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