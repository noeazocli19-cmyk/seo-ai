/**
 * POST /api/keywords — AI keyword research endpoint.
 */
import { NextRequest, NextResponse } from 'next/server'
import { generateJSON } from '@/lib/ai/client'
import { buildKeywordPrompt } from '@/lib/prompts'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { keyword, language } = (await req.json()) as {
      keyword: string
      language?: string
    }

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 })
    }

    const { system, user } = buildKeywordPrompt(keyword, language || 'français')
    const result = await generateJSON(user, system)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[KEYWORDS API ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
