'use client'

import { GalleryVerticalEnd } from "lucide-react"
import { RegisterForm } from "@/components/register-form"
import Image from "next/image"

export default function RegisterPage() {
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
        <div className="flex w-full max-w-sm flex-col gap-4 sm:gap-6">
        <a href="#" className="items-center gap-2 self-center font-medium">
            <Image
              src="/images/logo.png"
              alt="Tontine"
              width={100}
              height={43}
              className="w-20 h-auto sm:w-[100px] md:w-[120px] drop-shadow-lg"
            />
          </a>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}