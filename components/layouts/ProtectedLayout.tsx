"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { useAuth } from "@/lib/hooks/useAuth"
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { data: session, isPending: sessionLoading } = authClient.useSession()
  const { needsProfileCompletion, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Si pas en cours de chargement et pas de session, rediriger vers login
    if (!sessionLoading && !session) {
      router.push("/login")
      return
    }

    // Si session valide mais profil incomplet, rediriger vers complete-profile
    if (session && !authLoading && needsProfileCompletion && pathname !== "/complete-profile") {
      router.push("/complete-profile")
      return
    }
  }, [session, sessionLoading, authLoading, needsProfileCompletion, pathname, router])

  // Afficher un loader pendant la vérification
  if (sessionLoading || authLoading) {
    // Afficher le skeleton du dashboard si on est sur la page dashboard
    if (pathname === "/dashboard") {
      return <DashboardSkeleton />
    }

    // Sinon, afficher le loader générique
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Vérification de la session...</p>
        </div>
      </div>
    )
  }

  // Si pas de session, ne rien afficher (redirection en cours)
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Redirection vers la connexion...</p>
        </div>
      </div>
    )
  }

  // Session valide, afficher le contenu
  return <>{children}</>
}