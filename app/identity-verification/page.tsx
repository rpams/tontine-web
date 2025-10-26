"use client"

import { IdentityVerification } from "@/components/identity-verification"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function IdentityVerificationPage() {
  const { user, profile, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [profileData, setProfileData] = useState<{
    firstName?: string
    lastName?: string
    email?: string
    telephone?: string
    address?: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user) {
        // Pas authentifié, rediriger vers login
        router.push("/login")
        return
      }

      try {
        // Utiliser les données du profile déjà chargé par useAuth
        if (profile) {
          setProfileData({
            firstName: profile.firstName || user.name?.split(' ')[0],
            lastName: profile.lastName || user.name?.split(' ').slice(1).join(' '),
            email: user.email,
            telephone: user.telephone || profile.phoneNumber || '',
            address: user.address || profile.address || ''
          })
        } else {
          // Fallback sur les données utilisateur
          setProfileData({
            firstName: user.name?.split(' ')[0],
            lastName: user.name?.split(' ').slice(1).join(' '),
            email: user.email,
            telephone: user.telephone || '',
            address: user.address || ''
          })
        }
      } catch (error) {
        console.error("Erreur récupération profil:", error)
        // Fallback sur les données utilisateur
        if (user) {
          setProfileData({
            firstName: user.name?.split(' ')[0],
            lastName: user.name?.split(' ').slice(1).join(' '),
            email: user.email,
            telephone: user.telephone || '',
            address: user.address || ''
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      fetchProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isAuthenticated, authLoading])

  // Afficher un loader pendant le chargement
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-stone-100/90 py-4 sm:py-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">Chargement de vos informations...</p>
        </div>
      </div>
    )
  }

  // Si pas de données après chargement, rediriger
  if (!profileData) {
    return null
  }

  return (
    <div className="min-h-screen bg-stone-100/90 py-4 sm:py-8" style={{
      backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)',
      backgroundSize: '16px 16px'
    }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation de retour */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour au tableau de bord</span>
            <span className="sm:hidden">Retour</span>
          </Link>
        </div>

        {/* Composant de vérification */}
        <IdentityVerification
          userData={{
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
            telephone: profileData.telephone,
            address: profileData.address
          }}
        />
      </div>
    </div>
  )
}