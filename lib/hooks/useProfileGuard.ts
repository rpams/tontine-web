"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { checkProfileCompletion, shouldRedirectToCompleteProfile } from "@/lib/utils/profile-checker"

export function useProfileGuard(redirectTo: string = "/complete-profile") {
  const { data: session, isLoading } = useSession()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [profileComplete, setProfileComplete] = useState(false)

  useEffect(() => {
    async function checkProfile() {
      if (isLoading) return

      if (!session?.user?.id) {
        router.push("/login")
        return
      }

      try {
        const profileStatus = await checkProfileCompletion()

        if (shouldRedirectToCompleteProfile(profileStatus)) {
          router.push(redirectTo)
          return
        }

        setProfileComplete(true)
      } catch (error) {
        console.error("Erreur lors de la vérification du profil:", error)
        router.push(redirectTo)
      } finally {
        setIsChecking(false)
      }
    }

    checkProfile()
  }, [session, isLoading, router, redirectTo])

  return {
    isChecking: isChecking || isLoading,
    profileComplete,
    user: session?.user
  }
}