"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { useUser } from "@/lib/store/user-store"
import AdminSkeleton from "@/components/skeletons/AdminSkeleton"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isLoading } = useAuth()
  const { isAdmin } = useUser()
  const router = useRouter()

  useEffect(() => {
    // Si pas en cours de chargement et pas admin, rediriger vers dashboard
    if (!isLoading && !isAdmin) {
      router.push("/dashboard")
      return
    }
  }, [isLoading, isAdmin, router])

  // Afficher skeleton pendant le chargement
  if (isLoading) {
    return <AdminSkeleton />
  }

  // Si pas admin, ne rien afficher (redirection en cours)
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
          <p className="text-gray-600 mb-4">Vous devez être administrateur pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  // Admin valide, afficher le contenu
  return <>{children}</>
}