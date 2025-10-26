import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * Type de l'utilisateur authentifié avec rôle inclus
 */
export type AuthUser = {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN' | 'MODERATOR'
  emailVerified: boolean
  isActive: boolean
}

/**
 * Cache en mémoire pour les rôles utilisateurs
 * TTL: 2 minutes (assez court pour rester cohérent)
 */
const userRoleCache = new Map<string, { role: string; isActive: boolean; cachedAt: number }>()
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes en millisecondes

/**
 * Nettoyer le cache périodiquement (toutes les 5 minutes)
 */
setInterval(() => {
  const now = Date.now()
  for (const [userId, cached] of userRoleCache.entries()) {
    if (now - cached.cachedAt > CACHE_TTL) {
      userRoleCache.delete(userId)
    }
  }
}, 5 * 60 * 1000)

/**
 * Récupère le rôle depuis le cache ou la DB
 * 🚀 ULTRA RAPIDE : 0ms si en cache, ~30ms si DB
 */
async function getUserRole(userId: string): Promise<{ role: string; isActive: boolean } | null> {
  // Vérifier le cache
  const cached = userRoleCache.get(userId)
  if (cached && (Date.now() - cached.cachedAt) < CACHE_TTL) {
    return { role: cached.role, isActive: cached.isActive }
  }

  // Sinon, requête DB
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, isActive: true }
  })

  if (!user) {
    return null
  }

  // Mettre en cache
  userRoleCache.set(userId, {
    role: user.role,
    isActive: user.isActive,
    cachedAt: Date.now()
  })

  return user
}

/**
 * Invalider le cache pour un utilisateur (à appeler lors du changement de rôle)
 */
export function invalidateUserCache(userId: string) {
  userRoleCache.delete(userId)
}

/**
 * Récupère la session de l'utilisateur avec rôle
 * ✅ Optimisé : cache en mémoire (2min TTL)
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return null
    }

    // Récupérer le rôle (depuis cache ou DB)
    const roleData = await getUserRole(session.user.id)

    if (!roleData) {
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: roleData.role as 'USER' | 'ADMIN' | 'MODERATOR',
      emailVerified: session.user.emailVerified,
      isActive: roleData.isActive
    }
  } catch (error) {
    console.error('Error getting auth user:', error)
    return null
  }
}

/**
 * Vérifie si l'utilisateur est authentifié
 * Retourne l'utilisateur ou une réponse d'erreur
 */
export async function requireAuth(request: NextRequest): Promise<
  { user: AuthUser } | { error: NextResponse }
> {
  const user = await getAuthUser(request)

  if (!user) {
    return {
      error: NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }
  }

  return { user }
}

/**
 * Vérifie si l'utilisateur est admin
 * Retourne l'utilisateur ou une réponse d'erreur
 */
export async function requireAdmin(request: NextRequest): Promise<
  { user: AuthUser } | { error: NextResponse }
> {
  const result = await requireAuth(request)

  if ('error' in result) {
    return result
  }

  if (result.user.role !== 'ADMIN') {
    return {
      error: NextResponse.json(
        { error: 'Accès administrateur requis' },
        { status: 403 }
      )
    }
  }

  return result
}

/**
 * Vérifie si l'utilisateur est modérateur ou admin
 * Retourne l'utilisateur ou une réponse d'erreur
 */
export async function requireModerator(request: NextRequest): Promise<
  { user: AuthUser } | { error: NextResponse }
> {
  const result = await requireAuth(request)

  if ('error' in result) {
    return result
  }

  if (result.user.role !== 'ADMIN' && result.user.role !== 'MODERATOR') {
    return {
      error: NextResponse.json(
        { error: 'Accès modérateur requis' },
        { status: 403 }
      )
    }
  }

  return result
}

/**
 * Vérifie si l'utilisateur a vérifié son email
 * Retourne l'utilisateur ou une réponse d'erreur
 */
export async function requireVerifiedEmail(request: NextRequest): Promise<
  { user: AuthUser } | { error: NextResponse }
> {
  const result = await requireAuth(request)

  if ('error' in result) {
    return result
  }

  if (!result.user.emailVerified) {
    return {
      error: NextResponse.json(
        { error: 'Email non vérifié. Veuillez vérifier votre email.' },
        { status: 403 }
      )
    }
  }

  return result
}

/**
 * Vérifie si l'utilisateur est actif
 * Retourne l'utilisateur ou une réponse d'erreur
 */
export async function requireActiveUser(request: NextRequest): Promise<
  { user: AuthUser } | { error: NextResponse }
> {
  const result = await requireAuth(request)

  if ('error' in result) {
    return result
  }

  if (!result.user.isActive) {
    return {
      error: NextResponse.json(
        { error: 'Compte désactivé. Contactez l\'administrateur.' },
        { status: 403 }
      )
    }
  }

  return result
}
