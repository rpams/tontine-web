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
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Upload,
  Check,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Shield,
  Camera,
  User,
  MapPin,
  Calendar,
  IdCard,
  CheckCircle2,
  Clock,
  X
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Schéma de validation pour la vérification d'identité
const identityVerificationSchema = z.object({
  documentType: z.enum(["cni", "passport", "driving_license"], {
    required_error: "Veuillez sélectionner le type de document",
  }),
  documentNumber: z.string()
    .min(1, "Le numéro de document est requis")
    .min(5, "Le numéro doit contenir au moins 5 caractères"),
  firstName: z.string()
    .min(1, "Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères"),
  dateOfBirth: z.string()
    .min(1, "La date de naissance est requise"),
  placeOfBirth: z.string()
    .min(1, "Le lieu de naissance est requis"),
  frontDocument: z.any().optional(),
  backDocument: z.any().optional(),
})

type IdentityVerificationFormData = z.infer<typeof identityVerificationSchema>

const VERIFICATION_STEPS = [
  {
    id: 1,
    title: "Type de document",
    description: "Sélectionnez votre document d'identité"
  },
  {
    id: 2,
    title: "Informations personnelles",
    description: "Saisissez vos informations"
  },
  {
    id: 3,
    title: "Photos du document",
    description: "Téléchargez les photos de votre document"
  },
  {
    id: 4,
    title: "Validation",
    description: "Vérifiez vos informations"
  }
]

const DOCUMENT_TYPES = [
  {
    id: "cni",
    title: "Carte Nationale d'Identité",
    description: "CNI ou CIP",
    icon: IdCard,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700"
  },
  {
    id: "passport",
    title: "Passeport",
    description: "Passeport béninois ou étranger",
    icon: FileText,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700"
  },
  {
    id: "driving_license",
    title: "Permis de conduire",
    description: "Permis de conduire valide",
    icon: User,
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700"
  }
]

interface IdentityVerificationProps {
  className?: string
  isOptional?: boolean
  onComplete?: () => void
  onSkip?: () => void
  userData?: {
    firstName?: string
    lastName?: string
    email?: string
  }
}

export function IdentityVerification({
  className,
  isOptional = true,
  onComplete,
  onSkip,
  userData,
  ...props
}: IdentityVerificationProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [frontDocumentFile, setFrontDocumentFile] = useState<File | null>(null)
  const [backDocumentFile, setBackDocumentFile] = useState<File | null>(null)
  const [frontDocumentPreview, setFrontDocumentPreview] = useState<string | null>(null)
  const [backDocumentPreview, setBackDocumentPreview] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger
  } = useForm<IdentityVerificationFormData>({
    resolver: zodResolver(identityVerificationSchema),
    mode: "onChange",
    defaultValues: {
      documentType: undefined,
      documentNumber: "",
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      dateOfBirth: "",
      placeOfBirth: "",
    },
  })

  const documentType = watch("documentType")
  const allFieldsCompleted = watch()

  const progress = (currentStep / VERIFICATION_STEPS.length) * 100

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'front' | 'back'
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB max
        toast.error("Le fichier est trop volumineux. Maximum 10MB autorisé.")
        return
      }

      if (type === 'front') {
        setFrontDocumentFile(file)
      } else {
        setBackDocumentFile(file)
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === 'front') {
          setFrontDocumentPreview(result)
        } else {
          setBackDocumentPreview(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const nextStep = async () => {
    if (currentStep < VERIFICATION_STEPS.length) {
      // Validation avant de passer à l'étape suivante
      let isStepValid = false

      switch (currentStep) {
        case 1:
          isStepValid = !!documentType
          break
        case 2:
          const fieldsToValidate = ["documentNumber", "firstName", "lastName", "dateOfBirth", "placeOfBirth"]
          const results = await Promise.all(fieldsToValidate.map(field => trigger(field as any)))
          isStepValid = results.every(result => result)
          break
        case 3:
          // Pour CNI : recto ET verso requis
          // Pour passeport et permis : recto seulement
          isStepValid = !!frontDocumentFile && (documentType !== 'cni' || !!backDocumentFile)
          break
        default:
          isStepValid = true
      }

      if (isStepValid) {
        setCurrentStep(currentStep + 1)
      } else {
        toast.error("Veuillez compléter toutes les informations de cette étape.")
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: IdentityVerificationFormData) => {
    setIsLoading(true)

    try {
      // Simulation de l'envoi des données
      console.log("Verification data:", {
        ...data,
        frontDocument: frontDocumentFile,
        backDocument: backDocumentFile,
      })

      // Simuler un délai d'upload
      await new Promise(resolve => setTimeout(resolve, 3000))

      toast.success("Vérification d'identité soumise avec succès !")

      if (onComplete) {
        onComplete()
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la soumission.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    if (onSkip) {
      onSkip()
    } else {
      router.push("/dashboard")
    }
  }

  const isStepCompleted = (stepId: number) => {
    switch (stepId) {
      case 1:
        return !!documentType
      case 2:
        return !!(allFieldsCompleted.documentNumber && allFieldsCompleted.firstName &&
                 allFieldsCompleted.lastName && allFieldsCompleted.dateOfBirth &&
                 allFieldsCompleted.placeOfBirth)
      case 3:
        return !!frontDocumentFile && (documentType !== 'cni' || !!backDocumentFile)
      case 4:
        return currentStep === 4
      default:
        return false
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 max-w-4xl mx-auto", className)} {...props}>
      <Card className="backdrop-blur-sm bg-white/98 dark:bg-gray-950/95 shadow-2xl">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1">
                <CardTitle className="text-lg sm:text-xl flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                    <span>Vérification d'identité</span>
                  </div>
                  {isOptional && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 w-fit">
                      Optionnel
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-sm mt-2">
                  Étape {currentStep} sur {VERIFICATION_STEPS.length}: {VERIFICATION_STEPS[currentStep - 1]?.description}
                </CardDescription>
              </div>
              {isOptional && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-500 hover:text-gray-700 self-start sm:self-center"
                >
                  Passer pour l'instant
                </Button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            {/* Version mobile - étapes simplifiées */}
            <div className="block sm:hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                    {currentStep}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {VERIFICATION_STEPS[currentStep - 1]?.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      Étape {currentStep} sur {VERIFICATION_STEPS.length}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round(progress)}%
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Version desktop - étapes complètes */}
            <div className="hidden sm:block">
              <div className="flex items-start justify-between mb-4">
                {VERIFICATION_STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                        currentStep > step.id ? "bg-green-500 text-white shadow-md" :
                        currentStep === step.id ? "bg-blue-500 text-white shadow-md" :
                        "bg-gray-200 text-gray-600"
                      )}>
                        {isStepCompleted(step.id) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <div className={cn(
                          "text-sm font-medium",
                          currentStep === step.id ? "text-blue-600" :
                          currentStep > step.id ? "text-green-600" : "text-gray-500"
                        )}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 max-w-[100px]">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {index < VERIFICATION_STEPS.length - 1 && (
                      <div className="flex-1 mx-4 mt-4">
                        <div className={cn(
                          "h-1 rounded-full transition-all",
                          currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                        )} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="min-h-[400px]">
              {/* Étape 1: Type de document */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Quel type de document d'identité possédez-vous ?
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {DOCUMENT_TYPES.map((doc) => {
                        const Icon = doc.icon
                        const isSelected = documentType === doc.id

                        return (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => setValue("documentType", doc.id as any)}
                            className={cn(
                              "p-4 rounded-lg border-2 transition-all hover:shadow-md text-left",
                              isSelected
                                ? `${doc.borderColor} ${doc.bgColor} shadow-lg`
                                : "border-gray-200 bg-white hover:border-gray-300"
                            )}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center",
                                isSelected ? doc.bgColor : "bg-gray-100"
                              )}>
                                <Icon className={cn(
                                  "w-5 h-5",
                                  isSelected ? doc.textColor : "text-gray-600"
                                )} />
                              </div>
                              <div className="flex-1">
                                <h3 className={cn(
                                  "font-medium text-sm",
                                  isSelected ? doc.textColor : "text-gray-900"
                                )}>
                                  {doc.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                  {doc.description}
                                </p>
                              </div>
                              {isSelected && (
                                <Check className={cn("w-4 h-4", doc.textColor)} />
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    {errors.documentType && (
                      <p className="text-sm text-red-600 mt-2">{errors.documentType.message}</p>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Pourquoi vérifier votre identité ?</p>
                        <ul className="text-xs space-y-1 list-disc list-inside">
                          <li>Augmente vos limites de transaction</li>
                          <li>Renforce la sécurité de votre compte</li>
                          <li>Accès à toutes les fonctionnalités</li>
                          <li>Conformité aux réglementations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 2: Informations personnelles */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Informations du document d'identité
                    </Label>
                    <p className="text-sm text-gray-600 mb-4">
                      Saisissez les informations exactement comme elles apparaissent sur votre document.
                    </p>
                    {(userData?.firstName || userData?.lastName) && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-green-800">
                            <p className="font-medium mb-1">Informations pré-remplies</p>
                            <p className="text-xs">
                              Nous avons pré-rempli votre nom et prénom depuis votre profil.
                              Vérifiez qu'ils correspondent exactement à votre document d'identité et modifiez si nécessaire.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="documentNumber">
                        Numéro du document *
                      </Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="documentNumber"
                          type="text"
                          placeholder="Ex: 12345678901234"
                          className={cn("pl-10", errors.documentNumber && "border-red-500")}
                          {...register("documentNumber")}
                        />
                      </div>
                      {errors.documentNumber && (
                        <p className="text-sm text-red-600">{errors.documentNumber.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date de naissance *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="dateOfBirth"
                          type="date"
                          className={cn("pl-10", errors.dateOfBirth && "border-red-500")}
                          {...register("dateOfBirth")}
                        />
                      </div>
                      {errors.dateOfBirth && (
                        <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        Prénom(s) *
                        {userData?.firstName && (
                          <span className="text-xs text-green-600 ml-2">✓ Pré-rempli depuis votre profil</span>
                        )}
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Prénom(s) tel(s) qu'écrit(s)"
                          className={cn(
                            "pl-10",
                            errors.firstName && "border-red-500",
                            userData?.firstName && "bg-green-50 border-green-200"
                          )}
                          {...register("firstName")}
                        />
                      </div>
                      {userData?.firstName && (
                        <p className="text-xs text-green-600">
                          Vérifiez que ce prénom correspond exactement à votre document d'identité
                        </p>
                      )}
                      {errors.firstName && (
                        <p className="text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Nom de famille *
                        {userData?.lastName && (
                          <span className="text-xs text-green-600 ml-2">✓ Pré-rempli depuis votre profil</span>
                        )}
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Nom de famille"
                          className={cn(
                            "pl-10",
                            errors.lastName && "border-red-500",
                            userData?.lastName && "bg-green-50 border-green-200"
                          )}
                          {...register("lastName")}
                        />
                      </div>
                      {userData?.lastName && (
                        <p className="text-xs text-green-600">
                          Vérifiez que ce nom correspond exactement à votre document d'identité
                        </p>
                      )}
                      {errors.lastName && (
                        <p className="text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="placeOfBirth">Lieu de naissance *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="placeOfBirth"
                          type="text"
                          placeholder="Ville, Pays"
                          className={cn("pl-10", errors.placeOfBirth && "border-red-500")}
                          {...register("placeOfBirth")}
                        />
                      </div>
                      {errors.placeOfBirth && (
                        <p className="text-sm text-red-600">{errors.placeOfBirth.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 3: Photos du document */}
              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-2 sm:mb-4 block">
                      Photos de votre document
                    </Label>
                    <p className="text-sm text-gray-600 mb-4 sm:mb-6">
                      {documentType === 'cni'
                        ? "Prenez des photos du recto et du verso de votre CNI. Le verso contient des informations importantes comme le numéro de document."
                        : documentType === 'passport'
                        ? "Prenez une photo de la page d'identité de votre passeport (avec votre photo)."
                        : "Prenez une photo du recto de votre permis de conduire."
                      }
                    </p>
                  </div>

                  <div className={`grid gap-4 sm:gap-6 ${documentType === 'cni' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-md mx-auto'}`}>
                    {/* Recto / Photo principale */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        {documentType === 'cni' ? 'Recto (côté photo) *' :
                         documentType === 'passport' ? 'Page d\'identité *' :
                         'Recto du permis *'}
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-center hover:border-gray-400 transition-colors">
                        {frontDocumentPreview ? (
                          <div className="space-y-3">
                            <img
                              src={frontDocumentPreview}
                              alt={documentType === 'cni' ? 'Recto CNI' : documentType === 'passport' ? 'Page identité passeport' : 'Recto permis'}
                              className="w-full h-32 sm:h-40 object-cover rounded border"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('front-document')?.click()}
                              className="text-xs sm:text-sm"
                            >
                              <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                              Remplacer
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                              <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                            </div>
                            <div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('front-document')?.click()}
                                className="text-xs sm:text-sm"
                              >
                                <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                Prendre une photo
                              </Button>
                              <p className="text-xs text-gray-500 mt-2">
                                PNG, JPG jusqu'à 10MB
                              </p>
                            </div>
                          </div>
                        )}
                        <Input
                          id="front-document"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'front')}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Verso (seulement pour CNI) */}
                    {documentType === 'cni' && (
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">
                          Verso (informations du document) *
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-center hover:border-gray-400 transition-colors">
                          {backDocumentPreview ? (
                            <div className="space-y-3">
                              <img
                                src={backDocumentPreview}
                                alt="Verso CNI"
                                className="w-full h-32 sm:h-40 object-cover rounded border"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('back-document')?.click()}
                                className="text-xs sm:text-sm"
                              >
                                <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                Remplacer
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                              </div>
                              <div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => document.getElementById('back-document')?.click()}
                                  className="text-xs sm:text-sm"
                                >
                                  <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                  Prendre une photo
                                </Button>
                                <p className="text-xs text-gray-500 mt-2">
                                  PNG, JPG jusqu'à 10MB
                                </p>
                              </div>
                            </div>
                          )}
                          <Input
                            id="back-document"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'back')}
                            className="hidden"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Informations spécifiques selon le document */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">
                          {documentType === 'cni' ? 'Important pour la CNI :' :
                           documentType === 'passport' ? 'Important pour le passeport :' :
                           'Important pour le permis :'}
                        </p>
                        <div className="text-xs space-y-1">
                          {documentType === 'cni' && (
                            <>
                              <p>• Recto : Photo, nom, prénom, date de naissance</p>
                              <p>• Verso : Numéro CNI, lieu de naissance, adresse</p>
                            </>
                          )}
                          {documentType === 'passport' && (
                            <p>• Une seule photo de la page d'identité suffit (toutes les infos sont dessus)</p>
                          )}
                          {documentType === 'driving_license' && (
                            <p>• Une photo du recto suffit (photo et informations principales)</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium mb-1">Conseils pour de bonnes photos :</p>
                        <ul className="text-xs space-y-1 list-disc list-inside">
                          <li>Évitez les reflets et les ombres</li>
                          <li>Assurez-vous que le texte est lisible</li>
                          <li>Photographiez sur un fond uni</li>
                          <li>Tenez votre téléphone à plat au-dessus du document</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 4: Validation */}
              {currentStep === 4 && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-2 sm:mb-4 block">
                      Vérifiez vos informations
                    </Label>
                    <p className="text-sm text-gray-600 mb-4 sm:mb-6">
                      Vérifiez attentivement toutes les informations avant de soumettre votre demande de vérification d'identité.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Résumé des informations */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">Informations du document</h3>
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                          <span className="text-sm text-gray-600">Type de document:</span>
                          <span className="text-sm font-medium">
                            {DOCUMENT_TYPES.find(doc => doc.id === documentType)?.title}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                          <span className="text-sm text-gray-600">Numéro:</span>
                          <span className="text-sm font-medium break-all">{watch("documentNumber")}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                          <span className="text-sm text-gray-600">Nom complet:</span>
                          <span className="text-sm font-medium">
                            {watch("firstName")} {watch("lastName")}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                          <span className="text-sm text-gray-600">Date de naissance:</span>
                          <span className="text-sm font-medium">{watch("dateOfBirth")}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                          <span className="text-sm text-gray-600">Lieu de naissance:</span>
                          <span className="text-sm font-medium">{watch("placeOfBirth")}</span>
                        </div>
                      </div>

                      {/* Bouton pour modifier */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentStep(2)}
                        className="w-full sm:w-auto text-xs"
                      >
                        Modifier les informations
                      </Button>
                    </div>

                    {/* Photos */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">Photos du document</h3>
                      <div className="space-y-3">
                        {frontDocumentPreview && (
                          <div>
                            <Label className="text-sm text-gray-600 mb-2 block">
                              {documentType === 'cni' ? 'Recto (côté photo)' :
                               documentType === 'passport' ? 'Page d\'identité' :
                               'Recto du permis'}
                            </Label>
                            <img
                              src={frontDocumentPreview}
                              alt="Document principal"
                              className="w-full h-24 sm:h-32 object-cover rounded border cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(frontDocumentPreview, '_blank')}
                            />
                          </div>
                        )}
                        {backDocumentPreview && documentType === 'cni' && (
                          <div>
                            <Label className="text-sm text-gray-600 mb-2 block">Verso (informations)</Label>
                            <img
                              src={backDocumentPreview}
                              alt="Verso CNI"
                              className="w-full h-24 sm:h-32 object-cover rounded border cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(backDocumentPreview, '_blank')}
                            />
                          </div>
                        )}
                      </div>

                      {/* Bouton pour modifier les photos */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentStep(3)}
                        className="w-full sm:w-auto text-xs"
                      >
                        <Camera className="w-3 h-3 mr-2" />
                        Modifier les photos
                      </Button>
                    </div>
                  </div>

                  {/* Avertissement important */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium mb-1">Attention !</p>
                        <p className="text-xs">
                          Assurez-vous que toutes les informations correspondent exactement à votre document d'identité.
                          Des informations erronées peuvent entraîner un rejet de votre demande.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informations sur le traitement */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Traitement de votre vérification</p>
                        <div className="text-xs space-y-1">
                          <p>• Délai de traitement : 24-48h ouvrables</p>
                          <p>• Notification par email dès validation</p>
                          <p>• Statut visible dans votre dashboard</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation finale */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-green-800">
                        <p className="font-medium mb-1">Prêt à soumettre ?</p>
                        <p className="text-xs">
                          En cliquant sur "Confirmer et soumettre", vous certifiez que toutes les informations
                          fournies sont exactes et correspondent à votre document d'identité officiel.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t">
              <div className="flex items-center gap-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Précédent
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {currentStep < VERIFICATION_STEPS.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 via-blue-600 to-green-700 hover:from-green-700 hover:via-blue-700 hover:to-green-800 text-white font-semibold px-6 py-2"
                  >
                    {isLoading ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        Soumission en cours...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Confirmer et soumettre
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}