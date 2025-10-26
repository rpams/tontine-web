// Utilitaires pour la gestion des erreurs d'authentification

export interface AuthError {
  code: string
  message: string
  type?: string
}

export function getAuthErrorMessage(error: any): string {
  const errorCode = error?.code || error?.type || error?.message

  switch (errorCode) {
    case 'INVALID_EMAIL':
      return "Format d'email invalide."

    case 'INVALID_PASSWORD':
    case 'INVALID_CREDENTIALS':
    case 'CREDENTIAL_SIGNIN_ERROR':
      return "Email ou mot de passe incorrect."

    case 'USER_NOT_FOUND':
      // Message générique pour éviter l'énumération d'emails
      return "Email ou mot de passe incorrect."

    case 'PASSWORD_TOO_WEAK':
      return "Le mot de passe doit contenir au moins 8 caractères."

    case 'EMAIL_NOT_VERIFIED':
      return "Veuillez vérifier votre adresse email avant de vous connecter."

    case 'ACCOUNT_LOCKED':
    case 'ACCOUNT_DISABLED':
      return "Votre compte a été temporairement verrouillé. Contactez le support."

    case 'TOO_MANY_REQUESTS':
    case 'RATE_LIMIT_EXCEEDED':
      return "Trop de tentatives de connexion. Veuillez attendre quelques minutes."

    case 'SERVER_ERROR':
    case 'INTERNAL_SERVER_ERROR':
      return "Erreur serveur. Veuillez réessayer dans quelques instants."

    case 'DATABASE_CONNECTION_ERROR':
    case 'DATABASE_ERROR':
      return "Problème de base de données. Nos équipes techniques ont été notifiées."

    case 'TIMEOUT':
    case 'REQUEST_TIMEOUT':
      return "La demande a expiré. Vérifiez votre connexion et réessayez."

    case 'NETWORK_ERROR':
      return "Problème de connexion réseau. Vérifiez votre connexion internet."

    case 'EMAIL_ALREADY_EXISTS':
    case 'USER_ALREADY_EXISTS':
      return "Un compte existe déjà avec cette adresse email."

    case 'INVALID_TOKEN':
    case 'TOKEN_EXPIRED':
      return "Le lien a expiré. Veuillez demander un nouveau lien."

    case 'VERIFICATION_FAILED':
      return "Échec de la vérification. Veuillez réessayer."

    default:
      // Essayer de récupérer le message d'erreur original
      if (error?.message) {
        return error.message
      }

      return "Erreur de connexion. Veuillez vérifier vos identifiants."
  }
}

export function getNetworkErrorMessage(error: any): string {
  if (error?.name === 'NetworkError' || error?.code === 'NETWORK_ERROR') {
    return "Problème de connexion réseau. Vérifiez votre connexion internet."
  }

  if (error?.message?.includes('fetch')) {
    return "Impossible de contacter le serveur. Veuillez réessayer."
  }

  if (error?.message?.includes('timeout')) {
    return "La connexion a expiré. Veuillez réessayer."
  }

  if (error?.code === 'ECONNREFUSED') {
    return "Impossible de se connecter au serveur. Le service est peut-être temporairement indisponible."
  }

  return "Une erreur inattendue s'est produite. Veuillez réessayer."
}

export function isNetworkError(error: any): boolean {
  return !!(
    error?.name === 'NetworkError' ||
    error?.code === 'NETWORK_ERROR' ||
    error?.code === 'ECONNREFUSED' ||
    error?.message?.includes('fetch') ||
    error?.message?.includes('timeout')
  )
}