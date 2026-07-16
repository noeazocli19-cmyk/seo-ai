/**
 * POST /api/analyze — SEO analysis endpoint.
 * Returns comprehensive SEO metrics for given content.
 */
import { NextRequest, NextResponse } from 'next/server'
import { analyzeSEO } from '@/lib/seo'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { content, keyword } = (await req.json()) as {
      content: string
      keyword?: string
    }

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const analysis = analyzeSEO(content, keyword)
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('[ANALYZE API ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
