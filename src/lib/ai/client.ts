/**
 * AI Client Abstraction Layer
 * Uses Groq (fast, generous free tier) with a local dev mock fallback.
 *
 * CONFIGURATION :
 *   GROQ_API_KEY=gsk_...    (Groq API key)
 *   DEV_USE_MOCK_AI=true    (use mock responses during development)
 *
 * Create a key on: https://console.groq.com/keys
 */
import Groq from 'groq-sdk'

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  role: ChatRole
  content: string
}

// Llama 3.3 70B: bon compromis qualité/vitesse, tier gratuit généreux
const GROQ_MODEL_NAME = 'llama-3.3-70b-versatile'

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1500

let groqClient: Groq | null = null

function getGroqClient(): Groq {
  const key = process.env.GROQ_API_KEY
  if (!key) {
    throw new Error(
      '❌ GROQ_API_KEY manquant dans .env\n\n' +
      'Obtiens ta clé gratuite sur : https://console.groq.com/keys\n' +
      'Puis ajoute dans .env : GROQ_API_KEY=gsk_...'
    )
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey: key })
  }
  return groqClient
}

type GroqChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

function toGroqMessages(messages: ChatMessage[]) {
  return messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generate a chat completion with optional system prompt.
 * Retries automatically on transient errors (rate limit / server overload).
 */
export async function generateCompletion(
  messages: ChatMessage[],
  options?: { system?: string; temperature?: number }
): Promise<string> {
  const useMock = process.env.DEV_USE_MOCK_AI === 'true'
  if (useMock) {
    const joined = messages.map((m) => m.content).join(' ')
    await new Promise((r) => setTimeout(r, 200))
    return `Réponse mock (dev) : ${joined} — contenu factice pour le développement.`
  }

  const userMessages = messages.filter((m, i) => {
    if (i === 0 && m.role === 'assistant' && !options?.system) return false
    return true
  })

  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey) {
    throw new Error('❌ Aucune clé AI configurée. Ajoute GROQ_API_KEY dans .env')
  }

  const client = getGroqClient()
  const groqMessages: GroqChatMessage[] = [
    ...(options?.system ? [{ role: 'system' as const, content: options.system }] : []),
    ...toGroqMessages(userMessages),
  ]

  let lastError: unknown = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: GROQ_MODEL_NAME,
        messages: groqMessages,
        temperature: options?.temperature ?? 0.7,
      })

      const content = response.choices?.[0]?.message?.content ?? ''
      if (!content || content.trim().length === 0) {
        throw new Error('❌ Le modèle a retourné une réponse vide.')
      }
      return content
    } catch (error) {
      lastError = error
      const msg = error instanceof Error ? error.message : String(error)
      const status = (error as { status?: number })?.status

      // Erreurs transitoires : on retente avec un délai croissant
      const isRetryable = status === 429 || status === 503 || msg.includes('429') || msg.includes('503')
      if (isRetryable && attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt)
        continue
      }

      // Erreur de clé invalide
      if (status === 401 || msg.includes('401') || msg.includes('invalid_api_key')) {
        throw new Error(
          '❌ Clé API Groq invalide.\n\n' +
          'Vérifie ta clé sur https://console.groq.com/keys et mets-la à jour dans GROQ_API_KEY.'
        )
      }

      // Quota / limite atteinte après tous les essais
      if (isRetryable) {
        throw new Error(
          '❌ Service temporairement surchargé ou quota atteint après plusieurs tentatives.\n\n' +
          'Réessaie dans quelques instants. Si ça persiste, vérifie tes limites sur ' +
          'https://console.groq.com/settings/limits'
        )
      }

      throw new Error(msg)
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}

/**
 * Generate a structured JSON response.
 */
export async function generateJSON<T = unknown>(
  prompt: string,
  system: string
): Promise<T> {
  const raw = await generateCompletion(
    [{ role: 'user', content: prompt }],
    {
      system: `${system}\n\nIMPORTANT: Respond with valid JSON only. No markdown, no code fences, no explanation.`,
      temperature: 0.4,
    }
  )

  let cleaned = raw.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*\n?/, '')
      .replace(/\n?```\s*$/, '')
  }

  try {
    return JSON.parse(cleaned) as T
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
    if (match) {
      return JSON.parse(match[0]) as T
    }
    throw new Error('Failed to parse AI response as JSON')
  }
}

/**
 * Retourne le nom du modèle actif (pour debug).
 */
export function getCurrentModel(): string {
  if (process.env.GROQ_API_KEY) return GROQ_MODEL_NAME
  return 'none'
}