import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    await auth.api.signOut({
      headers: await headers()
    })

    return NextResponse.json({
      success: true,
      message: 'Déconnexion réussie'
    })
  } catch (error) {
    console.error('Erreur déconnexion:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    )
  }
}