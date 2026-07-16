/**
 * POST /api/generate — Content generation endpoint.
 *
 * Streams the generated content word-by-word so the user sees progressive
 * output instead of a 30-60s blank spinner. The final SSE message carries
 * the SEO analysis metadata (score, word count, suggestions, etc.).
 *
 * Wire format (text/event-stream):
 *   data: {"delta":"..."}        — incremental text chunk
 *   data: {"done":true,...}      — final metadata (content, analysis, wordCount, seoScore)
 *   data: [DONE]                 — end of stream
 */
import { NextRequest, NextResponse } from 'next/server'
import { generateCompletion } from '@/lib/ai/client'
import { buildGenerationPrompt } from '@/lib/prompts'
import { analyzeSEO } from '@/lib/seo'

export const runtime = 'nodejs'
export const maxDuration = 120
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, params } = body as {
      type: string
      params: Record<string, string>
    }

    if (!type) {
      return NextResponse.json({ error: 'Tool type is required' }, { status: 400 })
    }

    const { system, user } = buildGenerationPrompt(type, params)

    const fullContent = await generateCompletion(
      [{ role: 'user', content: user }],
      { system, temperature: 0.7 }
    )

    if (!fullContent.trim()) {
      throw new Error('Réponse vide du modèle IA')
    }

    const analysis = analyzeSEO(fullContent, params.keyword)

    // Stream word-by-word for a typing effect, then send the metadata.
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const tokens = fullContent.split(/(\s+)/) // keep whitespace tokens
          for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i]
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ delta: token })}\n\n`)
            )
            // Faster for whitespace, slower for words (typing feel)
            const isSpace = /^\s+$/.test(token)
            await new Promise((r) => setTimeout(r, isSpace ? 6 : 14))
          }

          // Final metadata
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                content: fullContent,
                analysis,
                wordCount: analysis.wordCount,
                seoScore: analysis.score,
              })}\n\n`
            )
          )
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    console.error('[GENERATE API ERROR]', error)
    const message =
      error instanceof Error ? error.message : 'Erreur interne du serveur'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
