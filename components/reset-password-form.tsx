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
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Shield,
  Check
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"),
  confirmPassword: z
    .string()
    .min(1, "La confirmation du mot de passe est requise"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

interface ResetPasswordFormProps {
  className?: string
  email?: string
  token?: string
  onSuccess?: () => void
}

export function ResetPasswordForm({
  className,
  email,
  token,
  onSuccess,
  ...props
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const password = watch("password")

  // Critères de validation du mot de passe
  const passwordCriteria = [
    {
      label: "Au moins 8 caractères",
      met: password.length >= 8,
    },
    {
      label: "Une majuscule (A-Z)",
      met: /[A-Z]/.test(password),
    },
    {
      label: "Une minuscule (a-z)",
      met: /[a-z]/.test(password),
    },
    {
      label: "Un chiffre (0-9)",
      met: /\d/.test(password),
    },
  ]

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    setError("")

    try {
      // Simuler la réinitialisation du mot de passe
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simuler une vérification du token (en vrai, ça viendrait de votre API)
      const isValidToken = true // En vrai, vous vérifieriez le token

      if (isValidToken) {
        setIsSuccess(true)
        toast.success("Mot de passe réinitialisé avec succès !")

        // Rediriger vers la page de connexion après quelques secondes
        setTimeout(() => {
          if (onSuccess) {
            onSuccess()
          }
        }, 3000)
      } else {
        setError("Le lien de réinitialisation est invalide ou a expiré")
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la réinitialisation")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="backdrop-blur-sm bg-white/98 dark:bg-gray-950/95 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-xl">Mot de passe réinitialisé !</CardTitle>
            <CardDescription className="text-center">
              Votre mot de passe a été modifié avec succès.
              <br />Vous allez être redirigé vers la page de connexion.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Sécurité renforcée</p>
                  <p className="text-xs">
                    Votre compte est maintenant sécurisé avec votre nouveau mot de passe.
                    Vous pouvez vous connecter dès maintenant.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="backdrop-blur-sm bg-white/98 dark:bg-gray-950/95 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl">Nouveau mot de passe</CardTitle>
          <CardDescription className="text-center">
            Définissez un nouveau mot de passe sécurisé pour votre compte
            {email && (
              <>
                <br />
                <span className="font-semibold text-gray-900">{email}</span>
              </>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Nouveau mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={cn("pl-10 pr-10", errors.password && "border-red-500")}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Critères de validation */}
                {password && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Critères requis :</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {passwordCriteria.map((criterion, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex items-center gap-2 text-xs",
                            criterion.met ? "text-green-600" : "text-gray-500"
                          )}
                        >
                          <div className={cn(
                            "w-3 h-3 rounded-full flex items-center justify-center",
                            criterion.met ? "bg-green-100" : "bg-gray-100"
                          )}>
                            {criterion.met && <Check className="w-2 h-2 text-green-600" />}
                          </div>
                          <span>{criterion.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Confirmation du mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={cn("pl-10 pr-10", errors.confirmPassword && "border-red-500")}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!isValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Réinitialisation...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Réinitialiser le mot de passe
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs text-balance">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-4 h-4" />
          <span className="font-medium">Connexion sécurisée</span>
        </div>
        <p>
          Votre mot de passe est chiffré et stocké en toute sécurité.
          Nous ne pourrons jamais voir votre mot de passe.
        </p>
      </div>
    </div>
  )
}