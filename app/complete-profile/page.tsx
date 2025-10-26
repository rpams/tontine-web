'use client'

import { CompleteProfileForm } from "@/components/complete-profile-form"
import { AuthStepper } from "@/components/ui/auth-stepper"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CompleteProfilePage() {
  return (
    <div className="relative min-h-svh">
      {/* Image de fond fixe */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Overlay pour assombrir */}
        <div className="absolute inset-0 bg-black/90"></div>
      </div>
      
      {/* Contenu scrollable par-dessus */}
      <div className="relative z-10 min-h-svh flex flex-col items-center justify-center gap-4 px-3 py-4 sm:p-6 md:p-10">
        <div className="flex w-full max-w-3xl flex-col gap-4">
          {/* Header avec logo et skip */}
          <div className="flex w-full items-center justify-between">
            <Image
              src="/images/logo.png"
              alt="Tontine"
              width={90}
              height={39}
              className="drop-shadow-lg"
            />
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-medium transition-colors"
            >
              Passer
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Stepper */}
          <AuthStepper currentStep={2} />

          <div className="flex w-full flex-col gap-4 sm:gap-6">
            <CompleteProfileForm />

            {/* Bouton "Continuer plus tard" */}
            <div className="flex justify-center">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30 py-3 px-6 rounded-xl font-medium transition-all"
                >
                  Continuer plus tard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}