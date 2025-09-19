"use client"

import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { OtpForm } from "@/components/otp-form"
import { ResetPasswordForm } from "@/components/reset-password-form"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"

type RecoveryStep = 'email' | 'otp' | 'reset' | 'success'

function ForgotPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState<RecoveryStep>('email')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')

  // Vérifier si on arrive avec un token (lien dans l'email)
  useEffect(() => {
    const tokenParam = searchParams.get('token')
    const emailParam = searchParams.get('email')

    if (tokenParam && emailParam) {
      setToken(tokenParam)
      setEmail(emailParam)
      setCurrentStep('reset')
    }
  }, [searchParams])

  const handleEmailSent = (sentEmail: string) => {
    setEmail(sentEmail)
    setCurrentStep('otp')
  }

  const handleOtpComplete = () => {
    setCurrentStep('reset')
  }

  const handlePasswordReset = () => {
    setCurrentStep('success')
    // Rediriger vers login après 3 secondes
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  }

  const handleBackToLogin = () => {
    router.push('/login')
  }

  const handleBackToEmail = () => {
    setCurrentStep('email')
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'email':
        return (
          <ForgotPasswordForm
            onBack={handleBackToLogin}
            onEmailSent={handleEmailSent}
          />
        )

      case 'otp':
        return (
          <OtpForm
            email={email}
            onBack={handleBackToEmail}
            onComplete={handleOtpComplete}
          />
        )

      case 'reset':
        return (
          <ResetPasswordForm
            email={email}
            token={token}
            onSuccess={handlePasswordReset}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <a href="#" className="items-center gap-2 self-center font-medium">
        <Image
          src="/images/logo.png"
          alt="Tontine"
          width={120}
          height={52}
          className="drop-shadow-lg"
        />
      </a>

      {renderCurrentStep()}
    </div>
  )
}

export default function ForgotPasswordPage() {
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
      <div className="relative z-10 min-h-svh flex flex-col items-center justify-center gap-6 p-6 md:p-10">
        <Suspense fallback={
          <div className="flex w-full max-w-sm flex-col gap-4">
            <div className="items-center gap-2 self-center">
              <Image
                src="/images/logo.png"
                alt="Tontine"
                width={120}
                height={52}
                className="drop-shadow-lg"
              />
            </div>
            <div className="animate-pulse bg-white/20 rounded-lg h-64"></div>
          </div>
        }>
          <ForgotPasswordContent />
        </Suspense>
      </div>
    </div>
  )
}