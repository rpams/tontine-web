"use client"

import { ResetPasswordForm } from "@/components/reset-password-form"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [isValidLink, setIsValidLink] = useState(true)

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    const emailParam = searchParams.get('email')

    if (tokenParam && emailParam) {
      setToken(tokenParam)
      setEmail(emailParam)
      // En vrai, vous vérifieriez la validité du token ici
      setIsValidLink(true)
    } else {
      setIsValidLink(false)
    }
  }, [searchParams])

  const handleSuccess = () => {
    // Rediriger vers login avec un message de succès
    router.push('/login?message=password-reset-success')
  }

  const handleBackToLogin = () => {
    router.push('/login')
  }

  if (!isValidLink) {
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

        {/* Contenu d'erreur */}
        <div className="relative z-10 min-h-svh flex flex-col items-center justify-center gap-6 p-6 md:p-10">
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

            <Card className="backdrop-blur-sm bg-white/98 dark:bg-gray-950/95 shadow-2xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Lien invalide</CardTitle>
                <CardDescription className="text-center">
                  Ce lien de réinitialisation est invalide ou a expiré.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-sm text-red-800">
                    <p className="font-medium mb-1">Que faire ?</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Vérifiez que vous avez cliqué sur le bon lien</li>
                      <li>Le lien expire après 15 minutes</li>
                      <li>Demandez un nouveau lien de réinitialisation</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button onClick={() => router.push('/forgot-password')}>
                    Demander un nouveau lien
                  </Button>
                  <Button variant="ghost" onClick={handleBackToLogin}>
                    Retour à la connexion
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

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

          <ResetPasswordForm
            email={email}
            token={token}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  )
}