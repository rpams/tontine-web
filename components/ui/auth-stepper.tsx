"use client"

import { cn } from "@/lib/utils"
import { LogIn, Shield, User, Home, Check } from "lucide-react"

export interface AuthStep {
  name: string
  description: string
  icon: typeof LogIn
}

export const AUTH_STEPS: AuthStep[] = [
  {
    name: "Connexion",
    description: "Email et mot de passe",
    icon: LogIn
  },
  {
    name: "Vérification",
    description: "Code de sécurité",
    icon: Shield
  },
  {
    name: "Profil",
    description: "Informations personnelles",
    icon: User
  },
  {
    name: "Dashboard",
    description: "Accès à votre espace",
    icon: Home
  }
]

interface AuthStepperProps {
  currentStep: number // 0-3
  className?: string
}

export function AuthStepper({ currentStep, className }: AuthStepperProps) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {/* Desktop Stepper - Version Compacte */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {AUTH_STEPS.map((step, index) => {
            const Icon = step.icon
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isFuture = index > currentStep

            return (
              <div key={index} className="flex items-center flex-1">
                {/* Step */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300",
                      isCompleted && "bg-green-500 border-green-500 text-white",
                      isCurrent && "bg-blue-500 border-blue-500 text-white ring-2 ring-blue-200",
                      isFuture && "bg-white/90 border-gray-300 text-gray-400"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="mt-1.5 text-center">
                    <div
                      className={cn(
                        "text-xs font-medium whitespace-nowrap",
                        isCompleted && "text-green-600",
                        isCurrent && "text-blue-600",
                        isFuture && "text-gray-400"
                      )}
                    >
                      {step.name}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < AUTH_STEPS.length - 1 && (
                  <div className="flex-1 mx-3 mb-6">
                    <div
                      className={cn(
                        "h-0.5 rounded-full transition-all duration-500",
                        index < currentStep ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Stepper - Version Minimaliste */}
      <div className="md:hidden">
        <div className="flex items-center justify-center space-x-1.5">
          {AUTH_STEPS.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep

            return (
              <div key={index} className="flex items-center">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    isCompleted && "bg-green-500 text-white",
                    isCurrent && "bg-blue-500 text-white ring-2 ring-blue-200",
                    !isCompleted && !isCurrent && "bg-white/80 text-gray-400 border border-gray-300"
                  )}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
                </div>
                {index < AUTH_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "w-6 h-0.5 mx-0.5 rounded-full",
                      index < currentStep ? "bg-green-500" : "bg-gray-300"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-2 text-center">
          <div className="text-xs font-medium text-white/90">
            {AUTH_STEPS[currentStep].name}
          </div>
        </div>
      </div>
    </div>
  )
}
