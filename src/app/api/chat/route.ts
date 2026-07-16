/**
 * POST /api/chat — Streaming AI chat endpoint.
 * Streams the AI response as Server-Sent Events-like text chunks.
 */
import { NextRequest } from 'next/server'
import { generateCompletion, type ChatMessage } from '@/lib/ai/client'
import { SYSTEM_PROMPTS } from '@/lib/prompts'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, system } = body as {
      messages: ChatMessage[]
      system?: string
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const fullContent = await generateCompletion(messages, {
      system: system || SYSTEM_PROMPTS.chat,
    })

    if (!fullContent) {
      return new Response(JSON.stringify({ error: 'Empty response' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Stream the content word-by-word for a typing effect.
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const words = fullContent.split(/(\s+)/) // keep whitespace tokens
        for (let i = 0; i < words.length; i++) {
          controller.enqueue(encoder.encode(words[i]))
          // Small delay for typing effect (faster for spaces)
          const isSpace = /^\s+$/.test(words[i])
          await new Promise((r) => setTimeout(r, isSpace ? 8 : 18))
        }
        controller.enqueue(encoder.encode('[DONE]'))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    console.error('[CHAT API ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
