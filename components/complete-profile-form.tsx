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
  User,
  MapPin,
  Phone,
  Camera,
  UserCircle2,
  Check,
  Users
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUser } from "@/lib/store/user-store"
import { ErrorAlert } from "@/components/ui/error-alert"
import { z } from "zod"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const completeProfileSchema = z.object({
  username: z.string()
    .min(3, "Le pseudo doit contenir au moins 3 caractères")
    .max(20, "Le pseudo ne peut pas dépasser 20 caractères")
    .regex(/^[a-zA-Z0-9_]+$/, "Le pseudo ne peut contenir que des lettres, chiffres et underscore"),
  gender: z.enum(["male", "female"], {
    required_error: "Veuillez sélectionner votre sexe",
  }),
  address: z.string().optional(),
  phone: z.string().optional(),
})

type CompleteProfileFormData = z.infer<typeof completeProfileSchema>

const avatarOptions = [
  "/avatars/avatar-1.svg",
  "/avatars/avatar-2.svg",
  "/avatars/avatar-3.svg",
  "/avatars/avatar-4.svg",
  "/avatars/avatar-5.svg",
  "/avatars/avatar-6.svg",
  "/avatars/avatar-7.svg",
  "/avatars/avatar-8.svg"
]

export function CompleteProfileForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [customProfileImage, setCustomProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showUsernameByDefault, setShowUsernameByDefault] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Store utilisateur
  const { updateProfile } = useUser()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      gender: undefined,
      address: "",
      phone: "",
    },
  })

  const username = watch("username")

  // Fonction helper pour upload de fichiers (images de profil uniquement)
  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'profile')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur de connexion lors de l\'upload'
      }
    }
  }

  // Fonction pour déterminer si l'avatar est prédéfini ou uploadé
  const isPredefindAvatar = (avatarUrl: string) => {
    return avatarOptions.includes(avatarUrl)
  }

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCustomProfileImage(file)
      setSelectedAvatar(null)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }


  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar)
    setCustomProfileImage(null)
    setProfileImagePreview(null)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Supprimer tous les caractères non numériques
    const numbersOnly = value.replace(/\D/g, '')
    
    // Limiter à 10 chiffres maximum (01 + 8 chiffres)
    const limitedNumbers = numbersOnly.slice(0, 10)
    
    // Assurer que ça commence par 01 si l'utilisateur tape quelque chose
    if (limitedNumbers.length > 0) {
      if (!limitedNumbers.startsWith('01')) {
        // Si ça ne commence pas par 01, forcer 01 au début
        if (limitedNumbers.length === 1 && limitedNumbers !== '0') {
          setPhoneNumber('01' + limitedNumbers)
        } else if (limitedNumbers.startsWith('0') && limitedNumbers.charAt(1) !== '1') {
          setPhoneNumber('01' + limitedNumbers.slice(1))
        } else if (!limitedNumbers.startsWith('0')) {
          setPhoneNumber('01' + limitedNumbers)
        } else {
          setPhoneNumber(limitedNumbers)
        }
      } else {
        setPhoneNumber(limitedNumbers)
      }
    } else {
      setPhoneNumber('')
    }
  }

  const onSubmit = async (data: CompleteProfileFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Préparer les données pour l'API
      const profileData = {
        username: data.username,
        gender: data.gender,
        address: data.address || "",
        phone: phoneNumber ? `+229${phoneNumber}` : "",
        avatarUrl: selectedAvatar || "",
        showUsernameByDefault
      }

      console.log("Envoi des données profil:", profileData)

      // Gérer l'upload d'image en premier si nécessaire
      let finalAvatarUrl = profileData.avatarUrl

      if (customProfileImage) {
        console.log("📤 Upload de l'image de profil personnalisée...")
        try {
          const uploadResult = await uploadFile(customProfileImage)
          if (uploadResult.success) {
            finalAvatarUrl = uploadResult.url
            console.log("✅ Image de profil uploadée:", uploadResult.url)
          } else {
            setError(uploadResult.error || 'Erreur lors de l\'upload de l\'image')
            return // Arrêter l'exécution
          }
        } catch (uploadError) {
          console.error('Erreur upload:', uploadError)
          setError(`Upload d'image échoué: ${uploadError instanceof Error ? uploadError.message : 'Erreur inconnue'}`)
          return // Arrêter l'exécution
        }
      } else if (selectedAvatar && isPredefindAvatar(selectedAvatar)) {
        console.log("✅ Avatar prédéfini sélectionné:", selectedAvatar)
        finalAvatarUrl = selectedAvatar
      }

      // Appel API pour compléter le profil avec l'avatar final
      const response = await fetch('/api/profile/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profileData,
          avatarUrl: finalAvatarUrl
        })
      })

      const result = await response.json()

      if (!response.ok) {
        // Utiliser le message d'erreur du serveur ou un message par défaut
        const errorMessage = result?.error || `Erreur ${response.status}: ${response.statusText}`
        setError(errorMessage)
        return // Arrêter l'exécution sans lever d'exception
      }

      console.log("✅ Profil complété avec succès:", result)

      // Mettre à jour le store avec les nouvelles données
      updateProfile({
        username: data.username,
        gender: data.gender,
        address: data.address || "",
        phoneNumber: phoneNumber ? `+229${phoneNumber}` : "",
        avatarUrl: finalAvatarUrl,
        showUsernameByDefault,
        isProfileComplete: true
      })

      // Afficher le message de succès
      setSuccess("Profil complété avec succès ! Redirection vers le tableau de bord...")

      // Redirection vers le dashboard après un court délai pour voir le succès
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 2000)

    } catch (error) {
      console.error('❌ Erreur inattendue lors de la completion du profil:', error)

      // Gérer les erreurs réseau ou inattendues qui n'ont pas été capturées
      let errorMessage = 'Une erreur inattendue est survenue'

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }

      setError(errorMessage)

    } finally {
      setIsLoading(false)
    }
  }

  const currentProfileImage = profileImagePreview || selectedAvatar
  
  // Vérifier si le pseudo est valide (selon le schéma de validation)
  const isUsernameValid = username && username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="backdrop-blur-sm bg-white/98 dark:bg-gray-950/95 shadow-2xl">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-3">
            <UserCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            Compléter votre profil
          </CardTitle>
          <CardDescription className="text-sm">
            Ces informations nous aideront à personnaliser votre expérience et à sécuriser votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form id="complete-profile-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:gap-5">
              
              {/* Photo de profil section */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Photo de profil</Label>
                
                {/* Preview et avatars sur la même ligne */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Preview */}
                  <div className="flex items-center gap-3 sm:w-auto">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={currentProfileImage || ""} />
                      <AvatarFallback>
                        <User className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="sm:hidden">
                      <p className="text-sm text-muted-foreground">
                        Choisissez un avatar ou uploadez une photo
                      </p>
                    </div>
                  </div>

                  {/* Avatars et upload sur la droite */}
                  <div className="flex-1 space-y-3">
                    <div className="hidden sm:block">
                      <p className="text-sm text-muted-foreground mb-2">
                        Choisissez un avatar ou uploadez une photo
                      </p>
                    </div>
                    
                    {/* Avatars prédéfinis */}
                    <div className="flex flex-wrap gap-2 justify-start">
                      {avatarOptions.map((avatar, index) => {
                        const borderColors = [
                          'border-blue-500', 'border-green-500', 'border-purple-500', 'border-orange-500',
                          'border-pink-500', 'border-indigo-500', 'border-red-500', 'border-teal-500'
                        ];
                        const bgColors = [
                          'bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-orange-50',
                          'bg-pink-50', 'bg-indigo-50', 'bg-red-50', 'bg-teal-50'
                        ];
                        
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleAvatarSelect(avatar)}
                            className="relative transition-all hover:scale-105"
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                              selectedAvatar === avatar 
                                ? `${borderColors[index]} ${bgColors[index]} shadow-lg` 
                                : `${borderColors[index]} bg-white hover:${bgColors[index]}`
                            )}>
                              <div className="w-8 h-8 rounded-full overflow-hidden">
                                <img 
                                  src={avatar} 
                                  alt={`Avatar ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            {selectedAvatar === avatar && (
                              <div className="absolute -top-0.5 -right-1 h-3 w-3 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                                <Check className="h-1.5 w-1.5 text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Upload photo personnalisée - compact */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                      <Input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                      <Label
                        htmlFor="profile-image"
                        className="flex items-center gap-2 cursor-pointer px-3 py-1.5 text-sm rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors w-full sm:w-auto justify-center sm:justify-start"
                      >
                        <Camera className="w-3 h-3" />
                        Upload photo
                      </Label>
                      {customProfileImage && (
                        <span className="text-xs text-muted-foreground truncate text-center sm:text-left">
                          {customProfileImage.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations personnelles - Grid optimisé */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pseudo */}
                <div className="space-y-2">
                  <Label htmlFor="username">Pseudo *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="votre_pseudo"
                      className={cn("pl-10", errors.username && "border-red-500")}
                      {...register("username")}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Lettres, chiffres et _ (3-20 car.)
                  </p>
                  {errors.username && (
                    <p className="text-xs text-red-600">{errors.username.message}</p>
                  )}
                </div>

                {/* Sexe */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Sexe *</Label>
                  <Select onValueChange={(value) => setValue("gender", value as "male" | "female")}>
                    <SelectTrigger className={cn("pl-10", errors.gender && "border-red-500")}>
                      <Users className="text-muted-foreground w-4 h-4" />
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Homme</SelectItem>
                      <SelectItem value="female">Femme</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-xs text-red-600">{errors.gender.message}</p>
                  )}
                </div>

                {/* Adresse */}
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="address"
                      placeholder="Votre adresse..."
                      className="pl-10"
                      {...register("address")}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Optionnel
                  </p>
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                    <div className="flex">
                      <span className="inline-flex items-center pl-10 pr-3 py-2 rounded-l-md border border-r-0 border-input bg-background text-foreground text-sm font-medium h-10">
                        +229
                      </span>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="01 XX XX XX XX"
                        className="rounded-l-none border-l-0 h-10 flex-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Optionnel - Format: 01XXXXXXXX
                  </p>
                </div>
              </div>

              {/* Switch pour afficher le pseudo par défaut - Plus compact */}
              {isUsernameValid && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 p-3 sm:p-2 bg-green-50 border border-green-300 rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-green-800 break-words">
                        Afficher "{username}" par défaut
                      </p>
                      <p className="text-xs text-green-600">
                        Sinon le nom complet sera affiché
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end sm:justify-start">
                    <Switch
                      checked={showUsernameByDefault}
                      onCheckedChange={setShowUsernameByDefault}
                    />
                  </div>
                </div>
              )}

              {/* Affichage des erreurs */}
              {error && (
                <ErrorAlert
                  title="Erreur lors de la sauvegarde"
                  message={error}
                  onDismiss={() => setError(null)}
                  variant="error"
                />
              )}

              {/* Affichage du succès */}
              {success && (
                <ErrorAlert
                  title="Succès"
                  message={success}
                  onDismiss={() => setSuccess(null)}
                  variant="info"
                />
              )}

              {/* Bouton de soumission */}
              <Button
                type="submit"
                disabled={isLoading || !!success}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sauvegarde en cours...</span>
                  </div>
                ) : success ? (
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Profil complété !</span>
                  </div>
                ) : (
                  "Terminer et accéder au dashboard"
                )}
              </Button>

              {/* Note d'information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Vos données sont sécurisées</p>
                    <p>Toutes les informations sont cryptées et stockées de manière sécurisée. Vous pourrez modifier ces informations à tout moment dans vos paramètres.</p>
                    <p className="mt-2 text-xs">
                      <strong>Prochaine étape :</strong> Vous pourrez vérifier votre identité depuis le tableau de bord pour augmenter vos limites de transaction.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}