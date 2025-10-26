"use client"

import { OtpForm } from "@/components/otp-form"
import { AuthStepper } from "@/components/ui/auth-stepper"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function OtpVerificationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const devOtp = searchParams.get('devOtp')
  const redirect = searchParams.get('redirect')

  const handleBack = () => {
    router.push('/login')
  }

  const handleComplete = () => {
    // Si une URL de redirection est fournie, l'utiliser
    // Sinon, aller vers le dashboard par défaut
    if (redirect) {
      router.push(redirect)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      {/* <a href="#" className="items-center gap-2 self-center font-medium">
        <Image
          src="/images/logo.png"
          alt="Tontine"
          width={100}
          height={43}
          className="drop-shadow-lg"
        />
      </a> */}

      {/* Stepper */}
      <div className="mx-auto">
        <AuthStepper currentStep={1} />
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <OtpForm
            email={email || ''}
            initialDevOtp={devOtp || undefined}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  )
}

export default function OtpVerificationPage() {

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
      <div className="relative z-10 min-h-svh flex flex-col items-center justify-center gap-4 p-6 md:p-10">
        <Suspense fallback={
          <div className="flex w-full max-w-3xl flex-col gap-4">
            <div className="items-center gap-2 self-center">
              <Image
                src="/images/logo.png"
                alt="Tontine"
                width={100}
                height={43}
                className="drop-shadow-lg"
              />
            </div>
            <AuthStepper currentStep={1} />
            <div className="flex justify-center">
              <div className="animate-pulse bg-white/20 rounded-lg h-64 w-full max-w-sm"></div>
            </div>
          </div>
        }>
          <OtpVerificationContent />
        </Suspense>
      </div>
    </div>
  )
}