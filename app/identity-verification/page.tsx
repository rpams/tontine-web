"use client"

import { IdentityVerification } from "@/components/identity-verification"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function IdentityVerificationPage() {
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
            firstName: "Jean",
            lastName: "Dupont",
            email: "jean.dupont@email.com"
          }}
        />
      </div>
    </div>
  )
}