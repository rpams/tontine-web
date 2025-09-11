'use client'

import { CompleteProfileForm } from "@/components/complete-profile-form"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Skip } from "lucide-react"
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
      <div className="relative z-10 min-h-svh flex flex-col items-center justify-center gap-4 p-4 sm:p-6 md:p-10">
        {/* Header avec progress et skip */}
        <div className="flex w-full max-w-2xl items-center justify-between mb-3 ">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo.png"
              alt="Tontine"
              width={100}
              height={43}
              className="w-16 h-auto sm:w-20 drop-shadow-lg"
            />
            {/* <div className="text-white">
              <h2 className="text-lg sm:text-xl font-bold">Complétez votre profil</h2>
              <p className="text-sm text-white/70">Étape finale avant d'accéder au dashboard</p>
            </div> */}
          </div>
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            Passer
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex w-full max-w-2xl flex-col gap-4 sm:gap-6">
          <CompleteProfileForm />
          
          {/* Actions footer */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
              type="submit" 
              form="complete-profile-form"
              className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              Terminer et accéder au dashboard
            </Button>
            <Link 
              href="/dashboard"
              className="sm:w-auto w-full"
            >
              <Button 
                variant="outline" 
                className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30 py-4 rounded-xl font-medium transition-all"
              >
                Continuer plus tard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}