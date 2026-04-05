import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { draft, purpose, purposeSub, audience, tone, dreamCustomer, insight } = await req.json()

    const systemPrompt = `Du är en expert på innehållsstrategi för LinkedIn och sociala medier.
Du analyserar inlägg mot deras syfte och målgrupp och ger konstruktiv, konkret feedback på svenska.
Var direkt, specifik och positiv. Max 3 förbättringsförslag.`

    const userPrompt = `Analysera detta LinkedIn-inlägg:

INLÄGG:
${draft}

SYFTE: ${purpose}${purposeSub ? ` — ${purposeSub}` : ''}
MÅLGRUPP: ${audience}
TONLÄGE: ${tone}
${insight ? `NYCKELINSIKT: ${insight}` : ''}
${dreamCustomer ? `DRÖMKUND: ${JSON.stringify(dreamCustomer)}` : ''}

Ge feedback i detta JSON-format:
{
  "score": <1-10>,
  "summary": "<en mening om inläggets styrka>",
  "strengths": ["<styrka 1>", "<styrka 2>"],
  "improvements": ["<förslag 1>", "<förslag 2>", "<förslag 3>"],
  "hookStrength": <1-10>,
  "ctaPresent": <true/false>,
  "audienceMatch": <1-10>
}`

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    let analysis
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Kunde inte analysera' }
    } catch {
      analysis = { error: 'Parsningsfel', raw: text }
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
