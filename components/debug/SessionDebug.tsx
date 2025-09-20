"use client"

import { authClient } from "@/lib/auth-client"
import { useAuth } from "@/lib/hooks/useAuth"
import { useEffect, useState } from "react"

export default function SessionDebug() {
  const { data: session, isPending: sessionLoading } = authClient.useSession()
  const { user, profile, isLoading: authLoading, isAuthenticated } = useAuth()
  const [manualSessionCheck, setManualSessionCheck] = useState<any>(null)

  useEffect(() => {
    // Vérification manuelle de la session
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include'
        })
        const data = await response.json()
        setManualSessionCheck(data)
      } catch (error) {
        console.error('Error checking session:', error)
        setManualSessionCheck({ error: error.message })
      }
    }

    checkSession()
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-blue-500 rounded-lg p-4 max-w-md text-xs shadow-lg z-50">
      <h3 className="font-bold mb-2 text-blue-600">Session Debug</h3>

      <div className="space-y-2">
        <div>
          <strong>useSession:</strong>
          <br />
          Loading: {sessionLoading ? 'true' : 'false'}
          <br />
          Session: {session ? 'EXISTS' : 'NULL'}
          <br />
          User ID: {session?.user?.id || 'N/A'}
        </div>

        <div>
          <strong>useAuth:</strong>
          <br />
          Loading: {authLoading ? 'true' : 'false'}
          <br />
          Authenticated: {isAuthenticated ? 'true' : 'false'}
          <br />
          User: {user?.email || 'N/A'}
        </div>

        <div>
          <strong>Manual API Check:</strong>
          <br />
          <pre className="text-xs bg-gray-100 p-1 rounded">
            {JSON.stringify(manualSessionCheck, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}