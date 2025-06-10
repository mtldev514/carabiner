import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    const prompt = `Voici une image représentant un événement culturel (flyer, story, capture d\'écran).\nAnalyse-la et renvoie les informations suivantes sous forme de JSON :\n- title\n- date\n- start_time\n- end_time (si présent)\n- city\n- address (si présente)\n- price\n- organizer_name (si présent)\n- external_link (si visible)\n\nSi une information n’est pas visible, retourne \`null\` pour ce champ.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: `data:${file.type};base64,${base64}`,
              },
            ],
          },
        ],
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      console.error('OpenAI error', await response.text())
      return NextResponse.json({ error: 'OpenAI request failed' }, { status: 500 })
    }

    const result = await response.json()
    const text = result.choices?.[0]?.message?.content || ''
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      return NextResponse.json({ error: 'Invalid AI response', text }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (e: any) {
    console.error('Analyze error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
