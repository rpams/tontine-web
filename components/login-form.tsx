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
import { User, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { ErrorAlert } from "@/components/ui/error-alert"
import { signIn } from "@/lib/auth-client"
import { getAuthErrorMessage, getNetworkErrorMessage, isNetworkError } from "@/lib/utils/auth-errors"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
import Image from "next/image"

interface LoginFormProps extends React.ComponentProps<"div"> {
  redirectUrl?: string
}

export function LoginForm({
  className,
  redirectUrl,
  ...props
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const rememberMe = watch("rememberMe")

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      })

      if (result.error) {
        // Gestion des erreurs spécifiques de better-auth
        const errorMessage = getAuthErrorMessage(result.error)
        setError(errorMessage)
      } else {
        // Authentification réussie, générer et envoyer l'OTP
        try {
          const otpResponse = await fetch('/api/auth/otp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: data.email })
          })

          const otpResult = await otpResponse.json()

          if (!otpResult.success) {
            setError(otpResult.error || "Erreur lors de l'envoi du code OTP")
            return
          }

          // Rediriger vers la page OTP avec l'email en paramètre
          // En mode dev, passer aussi le code OTP pour faciliter les tests
          let otpUrl = `/otp-verification?email=${encodeURIComponent(data.email)}${
            otpResult.devOtp ? `&devOtp=${otpResult.devOtp}` : ''
          }`

          // Si une URL de redirection est fournie, la passer à la page OTP
          if (redirectUrl) {
            otpUrl += `&redirect=${encodeURIComponent(redirectUrl)}`
          }

          router.push(otpUrl)
        } catch (otpError) {
          console.error("Erreur génération OTP:", otpError)
          setError("Erreur lors de l'envoi du code de vérification")
        }
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error)

      // Gestion des erreurs réseau/serveur
      if (isNetworkError(error)) {
        setError(getNetworkErrorMessage(error))
      } else {
        // Utiliser la fonction de gestion d'erreur auth pour les autres erreurs
        setError(getAuthErrorMessage(error))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className=" backdrop-blur-sm bg-white/98 dark:bg-gray-950/95 shadow-2xl">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left">
          <Image
            src="/images/logo.png"
            alt="Tontine"
            width={100}
            height={43}
            className="h-12 sm:h-16 w-auto flex-shrink-0"
          />
          <div className="space-y-1">
            <CardTitle className="text-lg sm:text-xl font-semibold">Se connecter</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Entrez votre email ci-dessous pour vous connecter à votre compte
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4">
              <ErrorAlert
                title="Erreur de connexion"
                message={error}
                onDismiss={() => setError("")}
              />
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-3">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continuer avec Google
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-white/98 text-muted-foreground relative z-10 px-2">
                  Ou continuer avec
                </span>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="email">Adresse e-mail</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
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
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Mot de passe</Label>
                    <a
                      href="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
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
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    title="Rester connecté pendant 7 jours"
                  >
                    Se souvenir de moi 
                    {/* <span className="text-xs text-muted-foreground">(7 jours)</span> */}
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || !isValid}>
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Pas de compte ?{" "}
                <a href="/register" className="underline underline-offset-4">
                  S&apos;inscrire
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        En continuant, vous acceptez nos <a href="#">Conditions d&apos;utilisation</a>{" "}
        et notre <a href="#">Politique de confidentialité</a>.
      </div>
    </div>
  )
}
