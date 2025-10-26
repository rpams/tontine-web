/**
 * Génère un code d'invitation aléatoire de 6 caractères
 * Format: Lettres majuscules (A-Z) + Chiffres (0-9)
 * Exemple: ABC123, XY7Z9K, etc.
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    code += chars[randomIndex]
  }

  return code
}

/**
 * Valide un code d'invitation
 * Doit être exactement 6 caractères alphanumériques majuscules
 */
export function isValidInviteCode(code: string): boolean {
  const pattern = /^[A-Z0-9]{6}$/
  return pattern.test(code)
}

/**
 * Normalise un code d'invitation (trim + uppercase)
 */
export function normalizeInviteCode(code: string): string {
  return code.trim().toUpperCase()
}
