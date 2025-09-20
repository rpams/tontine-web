import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    return NextResponse.json({
      success: true,
      session
    })
  } catch (error) {
    console.error('Erreur récupération session:', error)
    return NextResponse.json({
      success: false,
      session: null
    })
  }
}