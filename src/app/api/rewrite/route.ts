/**
 * POST /api/rewrite — AI content rewriting endpoint.
 */
import { NextRequest, NextResponse } from 'next/server'
import { generateCompletion } from '@/lib/ai/client'
import { buildRewritePrompt } from '@/lib/prompts'
import { analyzeSEO } from '@/lib/seo'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { operation, text, options } = (await req.json()) as {
      operation: string
      text: string
      options?: { language?: string; tone?: string }
    }

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const { system, user } = buildRewritePrompt(operation, text, options)
    const rewritten = await generateCompletion(
      [{ role: 'user', content: user }],
      { system }
    )

    const beforeAnalysis = analyzeSEO(text)
    const afterAnalysis = analyzeSEO(rewritten)

    return NextResponse.json({
      original: text,
      rewritten,
      beforeScore: beforeAnalysis.score,
      afterScore: afterAnalysis.score,
      beforeWords: beforeAnalysis.wordCount,
      afterWords: afterAnalysis.wordCount,
      analysis: afterAnalysis,
    })
  } catch (error) {
    console.error('[REWRITE API ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
