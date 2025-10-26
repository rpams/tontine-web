"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Smartphone,
  ArrowLeft,
  RefreshCw,
  Check,
  AlertCircle,
  Clock
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { checkProfileCompletion, shouldRedirectToCompleteProfile } from "@/lib/utils/profile-checker"
import { getSession } from "@/lib/auth-client"

interface OtpFormProps {
  className?: string
  email?: string
  onBack?: () => void
  onComplete?: () => void
}

export function OtpForm({
  className,
  email,
  onBack,
  onComplete,
  ...props
}: OtpFormProps) {
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes (standard industrie)
  const [canResend, setCanResend] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  // Timer pour l'expiration du code
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  // Timer pour le cooldown de renvoi
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleChange = (element: HTMLInputElement, index: number) => {
    setError("")
    const value = element.value

    // Ne permettre que les chiffres
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    // Focus sur le champ suivant si une valeur est saisie
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    // Soumettre automatiquement si tous les champs sont remplis
    if (newOtp.every(digit => digit !== "") && value) {
      handleSubmit(newOtp.join(""))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Gérer la suppression (backspace)
    if (e.key === "Backspace") {
      e.preventDefault()
      const newOtp = [...otp]

      if (otp[index]) {
        // Supprimer le caractère actuel
        newOtp[index] = ""
      } else if (index > 0) {
        // Aller au champ précédent et supprimer
        newOtp[index - 1] = ""
        inputRefs.current[index - 1]?.focus()
      }

      setOtp(newOtp)
    }

    // Gérer les flèches
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain")
    const pastedDigits = pastedData.replace(/\D/g, "").slice(0, 4)

    if (pastedDigits.length > 0) {
      const newOtp = [...otp]
      for (let i = 0; i < pastedDigits.length && i < 4; i++) {
        newOtp[i] = pastedDigits[i]
      }
      setOtp(newOtp)

      // Focus sur le prochain champ vide ou le dernier
      const nextIndex = Math.min(pastedDigits.length, 3)
      inputRefs.current[nextIndex]?.focus()

      // Soumettre automatiquement si 4 chiffres sont collés
      if (pastedDigits.length === 4) {
        handleSubmit(pastedDigits)
      }
    }
  }

  const handleSubmit = async (otpCode?: string) => {
    const codeToVerify = otpCode || otp.join("")

    if (codeToVerify.length !== 4) {
      setError("Veuillez saisir le code à 4 chiffres complet")
      return
    }

    if (!email) {
      setError("Email manquant. Veuillez vous reconnecter.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Vérifier l'OTP via l'API
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: codeToVerify })
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Code OTP vérifié avec succès !")
        if (onComplete) {
          onComplete()
        } else {
          // Vérifier si le profil est complet avant de rediriger
          try {
            const session = await getSession()

            if (!session?.user?.id) {
              // Pas de session, rediriger vers login
              router.push("/login")
              return
            }

            const profileStatus = await checkProfileCompletion()

            if (shouldRedirectToCompleteProfile(profileStatus)) {
              toast.info("Veuillez compléter votre profil")
              router.push("/complete-profile")
            } else {
              router.push("/dashboard")
            }
          } catch (error) {
            console.error("Erreur vérification profil:", error)
            // En cas d'erreur, rediriger vers complete-profile par sécurité
            router.push("/complete-profile")
          }
        }
      } else {
        setError(result.error || "Code OTP invalide. Veuillez réessayer.")
        // Réinitialiser le formulaire
        setOtp(new Array(4).fill(""))
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      console.error("Erreur vérification OTP:", error)
      setError("Une erreur est survenue lors de la vérification")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError("Email manquant. Veuillez vous reconnecter.")
      return
    }

    setIsResending(true)
    setError("")

    try {
      // Appeler l'API pour renvoyer l'OTP
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Un nouveau code OTP a été envoyé à votre email")

        // Réinitialiser les timers
        setTimeLeft(180) // 3 minutes
        setCanResend(false)
        setResendCooldown(60) // 1 minute de cooldown

        // Réinitialiser le formulaire
        setOtp(new Array(4).fill(""))
        inputRefs.current[0]?.focus()
      } else {
        setError(result.error || "Impossible de renvoyer le code.")
      }

    } catch (error) {
      console.error("Erreur renvoi OTP:", error)
      setError("Impossible de renvoyer le code. Veuillez réessayer.")
    } finally {
      setIsResending(false)
    }
  }

  const isExpired = timeLeft === 0
  const isComplete = otp.every(digit => digit !== "")

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="backdrop-blur-sm bg-white/98 dark:bg-gray-950/95 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl">Vérification en deux étapes</CardTitle>
          <CardDescription className="text-center">
            Nous avons envoyé un code de vérification à 4 chiffres à<br />
            <span className="font-semibold text-gray-900">{email || "votre@email.com"}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Champs OTP */}
          <div className="space-y-4">
            <Label className="text-center block">Saisissez le code de vérification</Label>
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={cn(
                    "w-12 h-12 sm:w-14 sm:h-14 text-center text-lg font-semibold border-2 transition-all",
                    digit ? "border-blue-500 bg-blue-50" : "border-gray-300",
                    error && "border-red-500",
                    isExpired && "opacity-50"
                  )}
                  disabled={isLoading || isExpired}
                  autoComplete="one-time-code"
                />
              ))}
            </div>
          </div>

          {/* Timer et statut */}
          <div className="text-center space-y-2">
            {!isExpired ? (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Code expire dans {formatTime(timeLeft)}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>Le code a expiré</span>
              </div>
            )}
          </div>

          {/* Bouton de soumission */}
          <Button
            onClick={() => handleSubmit()}
            disabled={!isComplete || isLoading || isExpired}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Vérification...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Vérifier le code
              </>
            )}
          </Button>

          {/* Section renvoi */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">Vous n'avez pas reçu le code ?</p>

            <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
              {resendCooldown > 0 ? (
                <p className="text-sm text-gray-500">
                  Renvoyer dans {resendCooldown}s
                </p>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleResend}
                  disabled={isResending || (!canResend && !isExpired)}
                  className="w-full sm:w-auto"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4 mr-2" />
                      Renvoyer le code
                    </>
                  )}
                </Button>
              )}

              {/* Bouton pour passer l'OTP (développement uniquement) */}
              {process.env.NODE_ENV === 'development' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (onComplete) {
                      onComplete()
                    } else {
                      router.push("/dashboard")
                    }
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Passer l'OTP (dev)
                </Button>
              )}
            </div>

            {/* Code de test pour développement */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                <strong>Mode DEV :</strong> Le code OTP est {otp.join("") || "1234"}
              </div>
            )}
          </div>

          {/* Bouton retour */}
          {onBack && (
            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                onClick={onBack}
                className="w-full"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la connexion
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations de sécurité */}
      <div className="text-muted-foreground text-center text-xs text-balance">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-4 h-4" />
          <span className="font-medium">Connexion sécurisée</span>
        </div>
        <p>
          Ce code de vérification expire dans 3 minutes pour votre sécurité.
          Ne le partagez jamais avec personne.
        </p>
      </div>
    </div>
  )
}