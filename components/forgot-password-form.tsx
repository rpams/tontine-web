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
  Mail,
  ArrowLeft,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

const emailSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
})

type EmailFormData = z.infer<typeof emailSchema>

interface ForgotPasswordFormProps {
  className?: string
  onBack?: () => void
  onEmailSent?: (email: string) => void
}

export function ForgotPasswordForm({
  className,
  onBack,
  onEmailSent,
  ...props
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState("")
  const [sentEmail, setSentEmail] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  })

  const email = watch("email")

  const onSubmit = async (data: EmailFormData) => {
    setIsLoading(true)
    setError("")

    try {
      // Simuler l'envoi d'email de récupération
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simuler une vérification d'email (en vrai, ça viendrait de votre API)
      const emailExists = true // En vrai, vous vérifieriez dans votre base de données

      if (emailExists) {
        setIsEmailSent(true)
        setSentEmail(data.email)
        toast.success("Email de récupération envoyé !")

        if (onEmailSent) {
          onEmailSent(data.email)
        }
      } else {
        setError("Aucun compte associé à cette adresse email")
      }
    } catch (error) {
      setError("Une erreur est survenue lors de l'envoi")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setIsLoading(true)
    setError("")

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success("Email renvoyé avec succès !")
    } catch (error) {
      setError("Impossible de renvoyer l'email")
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="backdrop-blur-sm bg-white/98 dark:bg-gray-950/95 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-xl">Email envoyé !</CardTitle>
            <CardDescription className="text-center">
              Nous avons envoyé un lien de récupération à<br />
              <span className="font-semibold text-gray-900">{sentEmail}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Vérifiez votre boîte mail</p>
                  <div className="text-xs space-y-1">
                    <p>• Cliquez sur le lien dans l'email reçu</p>
                    <p>• Le lien expire dans 15 minutes</p>
                    <p>• Vérifiez aussi vos spams/courriers indésirables</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">Vous n'avez pas reçu l'email ?</p>
              <Button
                variant="outline"
                onClick={handleResendEmail}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Renvoyer l'email
                  </>
                )}
              </Button>
            </div>

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

        <div className="text-muted-foreground text-center text-xs text-balance">
          <p>
            Pour des raisons de sécurité, nous envoyons cet email même si l'adresse
            n'est pas associée à un compte.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="backdrop-blur-sm bg-white/98 dark:bg-gray-950/95 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-orange-600" />
          </div>
          <CardTitle className="text-xl">Mot de passe oublié ?</CardTitle>
          <CardDescription className="text-center">
            Pas de problème ! Saisissez votre adresse email et nous vous
            enverrons un lien pour réinitialiser votre mot de passe.
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
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    className={cn("pl-10", errors.email && "border-red-500")}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Saisissez l'email associé à votre compte
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!isValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer le lien de récupération
                  </>
                )}
              </Button>

              {onBack && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onBack}
                  className="w-full"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à la connexion
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs text-balance">
        <p>
          Vous vous souvenez de votre mot de passe ?{" "}
          <button
            onClick={onBack}
            className="underline underline-offset-4 hover:text-primary"
          >
            Retour à la connexion
          </button>
        </p>
      </div>
    </div>
  )
}