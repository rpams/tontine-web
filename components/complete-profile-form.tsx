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
import { Textarea } from "@/components/ui/textarea"
import { 
  User, 
  MapPin, 
  Phone, 
  Upload, 
  Camera,
  FileText,
  UserCircle2,
  Check
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const completeProfileSchema = z.object({
  username: z.string().min(3, "Le pseudo doit contenir au moins 3 caractères").max(20, "Le pseudo ne peut pas dépasser 20 caractères"),
  address: z.string().optional(),
  phone: z.string().optional(),
  profileImage: z.any().optional(),
  identityDocument: z.any().optional(),
})

type CompleteProfileFormData = z.infer<typeof completeProfileSchema>

const avatarOptions = [
  "/avatars/avatar-jjuoud.svg",
  "/avatars/avatar-jkjnlef.svg",
  "/avatars/avatar-kjhfefg.svg",
  "/avatars/avatar-kpdkoe.svg",
  "/avatars/avatar-azioce.svg",
  "/avatars/avatar-lnjhsze.svg",
  "/avatars/avatar-nbxed.svg",
  "/avatars/avatar-wvesouh.svg"
]

export function CompleteProfileForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [customProfileImage, setCustomProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [identityDocument, setIdentityDocument] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      address: "",
      phone: "",
    },
  })

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

  const handleIdentityDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIdentityDocument(file)
    }
  }

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar)
    setCustomProfileImage(null)
    setProfileImagePreview(null)
  }

  const onSubmit = async (data: CompleteProfileFormData) => {
    setIsLoading(true)
    
    // TODO: Implement profile completion logic
    console.log("Profile data:", {
      ...data,
      avatar: selectedAvatar,
      customProfileImage,
      identityDocument
    })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    
    // Redirect to dashboard
    window.location.href = "/dashboard"
  }

  const currentProfileImage = profileImagePreview || selectedAvatar

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="backdrop-blur-sm bg-white/98 dark:bg-gray-950/95 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-3">
            <UserCircle2 className="w-6 h-6 text-primary" />
            Compléter votre profil
          </CardTitle>
          <CardDescription>
            Ces informations nous aideront à personnaliser votre expérience et à sécuriser votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="complete-profile-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-5">
              
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
                    <div className="flex flex-wrap gap-2">
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
                    <div className="flex items-center gap-3">
                      <Input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                      <Label
                        htmlFor="profile-image"
                        className="flex items-center gap-2 cursor-pointer px-3 py-1.5 text-sm rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <Camera className="w-3 h-3" />
                        Upload photo
                      </Label>
                      {customProfileImage && (
                        <span className="text-xs text-muted-foreground truncate">
                          {customProfileImage.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

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
                  Votre pseudo sera visible par les autres membres des tontines
                </p>
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              {/* Informations optionnelles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Adresse */}
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="address"
                      placeholder="Votre adresse complète..."
                      className="pl-10"
                      {...register("address")}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Optionnel - Utile pour les tontines locales
                  </p>
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+225 XX XX XX XX XX"
                      className="pl-10"
                      {...register("phone")}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Optionnel - Pour les notifications importantes
                  </p>
                </div>
              </div>

              {/* Document d'identité */}
              <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Document d'identité
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Optionnel - Augmente la limite des transactions
                </p>
                
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors">
                  <Input
                    id="identity-document"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleIdentityDocumentChange}
                    className="hidden"
                  />
                  <Label 
                    htmlFor="identity-document"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Upload className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {identityDocument ? identityDocument.name : "Cliquez pour télécharger"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        CNI, Passeport, Permis (PDF/Image)
                      </p>
                    </div>
                  </Label>
                </div>
              </div>

              {/* Note de sécurité */}
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