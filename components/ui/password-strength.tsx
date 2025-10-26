"use client"

import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Check, X } from "lucide-react"

export interface PasswordStrength {
  score: number // 0-4
  label: string
  color: string
  percentage: number
  checks: {
    length: boolean
    lowercase: boolean
    uppercase: boolean
    number: boolean
    special: boolean
  }
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  }

  const passedChecks = Object.values(checks).filter(Boolean).length

  let score = 0
  let label = "Très faible"
  let color = "red"
  let percentage = 0

  if (passedChecks === 0 || password.length < 6) {
    score = 0
    label = "Très faible"
    color = "red"
    percentage = 10
  } else if (passedChecks <= 2) {
    score = 1
    label = "Faible"
    color = "orange"
    percentage = 30
  } else if (passedChecks === 3) {
    score = 2
    label = "Moyen"
    color = "yellow"
    percentage = 60
  } else if (passedChecks === 4) {
    score = 3
    label = "Bon"
    color = "green"
    percentage = 80
  } else if (passedChecks === 5) {
    score = 4
    label = "Très bon"
    color = "emerald"
    percentage = 100
  }

  return { score, label, color, percentage, checks }
}

interface PasswordStrengthIndicatorProps {
  password: string
  showDetails?: boolean
}

export function PasswordStrengthIndicator({
  password,
  showDetails = true
}: PasswordStrengthIndicatorProps) {
  const strength = calculatePasswordStrength(password)

  if (!password) return null

  const colorClasses = {
    red: "bg-red-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    emerald: "bg-emerald-500"
  }

  const textColorClasses = {
    red: "text-red-600",
    orange: "text-orange-600",
    yellow: "text-yellow-600",
    green: "text-green-600",
    emerald: "text-emerald-600"
  }

  return (
    <div className="space-y-2">
      {/* Barre de progression */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Force du mot de passe</span>
          <span className={cn("text-xs font-medium", textColorClasses[strength.color as keyof typeof textColorClasses])}>
            {strength.label}
          </span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              colorClasses[strength.color as keyof typeof colorClasses]
            )}
            style={{ width: `${strength.percentage}%` }}
          />
        </div>
      </div>

      {/* Détails des critères */}
      {showDetails && (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            {strength.checks.length ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <X className="w-3 h-3 text-gray-400" />
            )}
            <span className={strength.checks.length ? "text-green-600" : "text-gray-500"}>
              Au moins 8 caractères
            </span>
          </div>
          <div className="flex items-center gap-2">
            {strength.checks.uppercase ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <X className="w-3 h-3 text-gray-400" />
            )}
            <span className={strength.checks.uppercase ? "text-green-600" : "text-gray-500"}>
              Une lettre majuscule
            </span>
          </div>
          <div className="flex items-center gap-2">
            {strength.checks.lowercase ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <X className="w-3 h-3 text-gray-400" />
            )}
            <span className={strength.checks.lowercase ? "text-green-600" : "text-gray-500"}>
              Une lettre minuscule
            </span>
          </div>
          <div className="flex items-center gap-2">
            {strength.checks.number ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <X className="w-3 h-3 text-gray-400" />
            )}
            <span className={strength.checks.number ? "text-green-600" : "text-gray-500"}>
              Un chiffre
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
