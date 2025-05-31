import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { token, ...formData } = body

  // Vérifie le token reCAPTCHA
  const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  })

  const data = await res.json()

  if (!data.success) {
    return NextResponse.json({ error: 'Failed reCAPTCHA' }, { status: 400 })
  }

  // Ici : insérer dans Supabase
  // TODO: ajouter le client Supabase si tu veux tout faire côté serveur

  return NextResponse.json({ success: true })
}
