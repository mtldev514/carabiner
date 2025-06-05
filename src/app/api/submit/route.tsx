import { NextRequest, NextResponse } from 'next/server'

const rateLimitMap = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT = 5

export async function POST(req: NextRequest) {
  const body = await req.json()

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const now = Date.now()
  const entry = rateLimitMap.get(ip) || { count: 0, timestamp: now }
  if (now - entry.timestamp > 60_000) {
    entry.count = 0
    entry.timestamp = now
  }
  entry.count += 1
  rateLimitMap.set(ip, entry)

  if (entry.count > RATE_LIMIT) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const formData = body

  if (formData.website) {
    return NextResponse.json({ error: 'Spam detected' }, { status: 400 })
  }

  // Ici : insérer dans Supabase
  // TODO: ajouter le client Supabase si tu veux tout faire côté serveur

  return NextResponse.json({ success: true })
}
