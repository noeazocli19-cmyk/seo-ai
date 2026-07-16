/**
 * AI Client Abstraction Layer
 * Supports OpenAI and Google Gemini with a local dev mock fallback.
 *
 * CONFIGURATION :
 *   OPENAI_API_KEY=sk-...  (OpenAI API key)
 *   GEMINI_API_KEY=AIza...  (Google Gemini API key)
 *   DEV_USE_MOCK_AI=true   (use mock responses during development)
 *
 * For OpenAI, create a key on: https://platform.openai.com/account/api-keys
 * For Google Gemini, create a key on: https://aistudio.google.com/apikey
 */
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  role: ChatRole
  content: string
}

const GEMINI_MODEL_NAME = 'gemini-2.5-pro'
const OPENAI_MODEL_NAME = 'gpt-3.5-turbo'

let geminiClient: GoogleGenerativeAI | null = null
let openAIClient: OpenAI | null = null

type OpenAIChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

function getGeminiClient(): GoogleGenerativeAI {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    throw new Error(
      '❌ GEMINI_API_KEY manquant dans .env\n\n' +
      'Obtiens ta clé gratuite sur : https://aistudio.google.com/apikey\n' +
      'Puis ajoute dans .env : GEMINI_API_KEY=AIza...'
    )
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(key)
  }
  return geminiClient
}

function getOpenAIClient(): OpenAI {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    throw new Error(
      '❌ OPENAI_API_KEY manquant dans .env\n\n' +
      'Obtiens ta clé sur : https://platform.openai.com/account/api-keys\n' +
      'Puis ajoute dans .env : OPENAI_API_KEY=sk-...'
    )
  }
  if (!openAIClient) {
    openAIClient = new OpenAI({ apiKey: key })
  }
  return openAIClient
}

function toGeminiContents(messages: ChatMessage[]) {
  return messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
}

function toOpenAIMessages(messages: ChatMessage[]) {
  return messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))
}

/**
 * Generate a chat completion with optional system prompt.
 */
export async function generateCompletion(
  messages: ChatMessage[],
  options?: { system?: string; temperature?: number }
): Promise<string> {
  const useMock = process.env.DEV_USE_MOCK_AI === 'true'
  if (useMock) {
    // Simple mock for development: concatenate user messages and return a canned reply
    const joined = messages.map((m) => m.content).join(' ')
    await new Promise((r) => setTimeout(r, 200))
    return `Réponse mock (dev) : ${joined} — contenu factice pour le développement.`
  }

  const userMessages = messages.filter((m, i) => {
    if (i === 0 && m.role === 'assistant' && !options?.system) return false
    return true
  })

  let result
  const openAIKey = process.env.OPENAI_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY

  try {
    if (openAIKey) {
      const client = getOpenAIClient()
      const messages: OpenAIChatMessage[] = [
        ...(options?.system ? [{ role: 'system' as const, content: options.system }] : []),
        ...toOpenAIMessages(userMessages),
      ]

      const response = await client.chat.completions.create({
        model: OPENAI_MODEL_NAME,
        messages,
        temperature: options?.temperature ?? 0.7,
      })

      const content = response.choices?.[0]?.message?.content ?? ''
      if (!content || content.trim().length === 0) {
        throw new Error('❌ Le modèle OpenAI a retourné une réponse vide.')
      }
      return content
    }

    if (geminiKey) {
      const client = getGeminiClient()
      const model = client.getGenerativeModel({
        model: GEMINI_MODEL_NAME,
        systemInstruction: options?.system,
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
        },
      })

      result = await model.generateContent({
        contents: toGeminiContents(userMessages),
      })
      const content = result.response.text()
      if (!content || content.trim().length === 0) {
        throw new Error('❌ Le modèle Gemini a retourné une réponse vide.')
      }
      return content
    }

    throw new Error(
      '❌ Aucune clé AI configurée. Ajoute OPENAI_API_KEY ou GEMINI_API_KEY dans .env'
    )
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)

    // Erreur de quota
    if (msg.includes('429') || msg.includes('quota')) {
      throw new Error(
        '❌ Quota dépassé ou compte non configuré.\n\n' +
        'Solutions :\n' +
        '  1. Active la facturation sur Google Cloud ou OpenAI.\n' +
        '  2. Vérifie que ta clé API est valide et non restreinte.\n' +
        '  3. OU déploie sur Vercel (serveurs US/EU) si tu utilises Gemini.\n\n' +
        'Free tier : 15 req/min, 1500 req/jour — largement suffisant.'
      )
    }

    // Erreur de localisation Gemini
    if (msg.includes('location') || msg.includes('FAILED_PRECONDITION')) {
      throw new Error(
        '❌ Google Gemini ne fonctionne pas depuis ta localisation actuelle.\n\n' +
        'SOLUTION : Déploie le projet sur Vercel.\n' +
        'Les serveurs Vercel (US/EU) supportent Gemini parfaitement.\n' +
        '→ https://vercel.com'
      )
    }

    // Erreur de clé API
    if (msg.includes('API_KEY_INVALID') || msg.includes('403')) {
      throw new Error(
        '❌ Clé API invalide.\n\n' +
        'Vérifie ta clé OpenAI dans OPENAI_API_KEY ou ta clé Gemini dans GEMINI_API_KEY.'
      )
    }

    throw new Error(msg)
  }
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
  if (process.env.OPENAI_API_KEY) return OPENAI_MODEL_NAME
  if (process.env.GEMINI_API_KEY) return GEMINI_MODEL_NAME
  return 'none'
}
