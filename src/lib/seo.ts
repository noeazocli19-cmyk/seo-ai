/**
 * SEO Analysis Engine
 * Computes real-time SEO metrics from content.
 * No AI required — pure deterministic analysis.
 */

export interface SEOAnalysis {
  score: number
  readability: number
  wordCount: number
  charCount: number
  sentenceCount: number
  paragraphCount: number
  avgWordsPerSentence: number
  readingTime: number // minutes
  h1Count: number
  h2Count: number
  h3Count: number
  linkCount: number
  imageCount: number
  metaTitleLength: number
  metaDescLength: number
  primaryKeyword: string
  keywordDensity: number
  secondaryKeywords: string[]
  suggestions: SEOSuggestion[]
  eeat: EEATScore
  structure: StructureAnalysis
}

export interface SEOSuggestion {
  type: 'success' | 'warning' | 'error'
  category: string
  message: string
  impact: 'high' | 'medium' | 'low'
}

export interface EEATScore {
  experience: number
  expertise: number
  authoritativeness: number
  trustworthiness: number
  total: number
}

export interface StructureAnalysis {
  hasIntroduction: boolean
  hasConclusion: boolean
  hasList: boolean
  hasImage: boolean
  hasInternalLink: boolean
  headingHierarchy: boolean
  shortParagraphs: boolean
}

const STOP_WORDS = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'mais', 'donc',
  'or', 'ni', 'car', 'que', 'qui', 'quoi', 'dont', 'où', 'à', 'au', 'aux', 'ce',
  'cet', 'cette', 'ces', 'son', 'sa', 'ses', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes',
  'notre', 'nos', 'votre', 'vos', 'leur', 'leurs', 'je', 'tu', 'il', 'elle', 'on',
  'nous', 'vous', 'ils', 'elles', 'me', 'te', 'se', 'lui', 'en', 'y', 'pour', 'par',
  'avec', 'sans', 'sous', 'sur', 'dans', 'vers', 'chez', 'entre', 'pendant', 'depuis',
  'est', 'sont', 'être', 'avoir', 'fait', 'faites', 'comme', 'plus', 'moins', 'très',
  'trop', 'aussi', 'encore', 'déjà', 'bien', 'mal', 'tout', 'tous', 'toute', 'toutes',
  'rien', 'quelque', 'quelques', 'autre', 'autres', 'même', 'mêmes', 'the', 'a', 'an',
  'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'to', 'of', 'in',
  'for', 'on', 'at', 'by', 'with', 'from', 'as', 'this', 'that', 'these', 'those',
])

/**
 * Analyze content and return comprehensive SEO metrics.
 */
export function analyzeSEO(content: string, keyword?: string): SEOAnalysis {
  const text = content || ''
  const plainText = stripMarkdown(text)

  // Counts
  const words = plainText.split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const charCount = plainText.length
  const sentences = plainText.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const sentenceCount = sentences.length
  const paragraphs = plainText.split(/\n\n+/).filter((p) => p.trim().length > 0)
  const paragraphCount = paragraphs.length
  const avgWordsPerSentence = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  // Headings
  const h1Count = (text.match(/^#\s+.+$/gm) || []).length
  const h2Count = (text.match(/^##\s+.+$/gm) || []).length
  const h3Count = (text.match(/^###\s+.+$/gm) || []).length

  // Links and images
  const linkCount = (text.match(/\[.+?\]\(.+?\)/g) || []).length
  const imageCount = (text.match(/!\[.*?\]\(.+?\)/g) || []).length

  // Meta extraction (from markdown meta blocks or inline)
  const metaTitleMatch = text.match(/(?:^|\n)(?:#|Meta Title:?)\s*(.+?)(?:\n|$)/i)
  const metaTitleLength = metaTitleMatch ? metaTitleMatch[1].trim().length : 0

  const metaDescMatch = text.match(/Meta Description:?\s*(.+?)(?:\n|$)/i)
  const metaDescLength = metaDescMatch ? metaDescMatch[1].trim().length : 0

  // Keyword analysis
  const primaryKeyword = detectPrimaryKeyword(text, keyword)
  const keywordDensity = calculateKeywordDensity(plainText, primaryKeyword)
  const secondaryKeywords = findSecondaryKeywords(plainText, primaryKeyword)

  // Structure analysis
  const structure: StructureAnalysis = {
    hasIntroduction: paragraphs.length > 0,
    hasConclusion: /conclusion|pour conclure|en résumé|en conclusion/i.test(plainText),
    hasList: /^\s*[-*+]\s/m.test(text) || /^\s*\d+\.\s/m.test(text),
    hasImage: imageCount > 0,
    hasInternalLink: linkCount > 0,
    headingHierarchy: h1Count > 0 && (h2Count > 0 || h3Count > 0),
    shortParagraphs: paragraphs.every((p) => p.split(/\s+/).length < 100),
  }

  // E-E-A-T scoring (heuristic)
  const eeat = calculateEEAT(text, wordCount, structure)

  // Readability (simplified Flesch-like for French)
  const readability = calculateReadability(wordCount, sentenceCount, avgWordsPerSentence)

  // Suggestions
  const suggestions = generateSuggestions({
    wordCount,
    h1Count,
    h2Count,
    h3Count,
    metaTitleLength,
    metaDescLength,
    keywordDensity,
    primaryKeyword,
    linkCount,
    imageCount,
    structure,
    readingTime,
  })

  // Overall score
  const score = calculateOverallScore({
    wordCount,
    h1Count,
    h2Count,
    metaTitleLength,
    metaDescLength,
    keywordDensity,
    readability,
    structure,
    suggestions,
  })

  return {
    score,
    readability,
    wordCount,
    charCount,
    sentenceCount,
    paragraphCount,
    avgWordsPerSentence,
    readingTime,
    h1Count,
    h2Count,
    h3Count,
    linkCount,
    imageCount,
    metaTitleLength,
    metaDescLength,
    primaryKeyword,
    keywordDensity,
    secondaryKeywords,
    suggestions,
    eeat,
    structure,
  }
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/!\[.*?\]\(.+?\)/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^\s*[-*+]\s/gm, '')
    .replace(/^\s*\d+\.\s/gm, '')
    .replace(/^>\s+/gm, '')
    .trim()
}

function detectPrimaryKeyword(text: string, hint?: string): string {
  if (hint && hint.trim()) return hint.trim().toLowerCase()

  const words = stripMarkdown(text)
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w))

  const freq: Record<string, number> = {}
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1
  }

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1])
  return sorted[0]?.[0] || ''
}

function calculateKeywordDensity(text: string, keyword: string): number {
  if (!keyword) return 0
  const words = text.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return 0

  const keywordWords = keyword.toLowerCase().split(/\s+/)
  let count = 0

  if (keywordWords.length === 1) {
    count = words.filter((w) => w === keywordWords[0]).length
  } else {
    const text = words.join(' ')
    const regex = new RegExp(keywordWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+'), 'gi')
    count = (text.match(regex) || []).length
  }

  return Math.round((count / words.length) * 1000) / 10
}

function findSecondaryKeywords(text: string, primary: string): string[] {
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOP_WORDS.has(w) && w !== primary)

  const freq: Record<string, number> = {}
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1
  }

  return Object.entries(freq)
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w)
}

function calculateReadability(wordCount: number, sentenceCount: number, avgWords: number): number {
  if (sentenceCount === 0 || wordCount === 0) return 0
  // Simplified: lower avg words per sentence = higher readability
  const base = 100 - Math.min(100, (avgWords - 12) * 5)
  return Math.max(0, Math.min(100, base))
}

function calculateEEAT(text: string, wordCount: number, structure: StructureAnalysis): EEATScore {
  const lower = text.toLowerCase()
  const experience = Math.min(100, (lower.match(/(expérience|j'ai|nous avons|selon notre|dans notre)/g) || []).length * 20 + (wordCount > 600 ? 40 : 20))
  const expertise = Math.min(100, (structure.headingHierarchy ? 30 : 0) + (wordCount > 800 ? 30 : 15) + (lower.match(/(expert|spécialiste|étude|recherche|données)/g) || []).length * 15 + 25)
  const authoritativeness = Math.min(100, (lower.match(/(source|selon|référence|citations?)/g) || []).length * 20 + (structure.hasInternalLink ? 30 : 10) + 30)
  const trustworthiness = Math.min(100, (structure.hasConclusion ? 25 : 0) + (wordCount > 500 ? 25 : 10) + (lower.match(/(fiable|vérifié|confiance|garantie)/g) || []).length * 15 + 30)

  const total = Math.round((experience + expertise + authoritativeness + trustworthiness) / 4)
  return { experience, expertise, authoritativeness, trustworthiness, total }
}

interface SuggestionInput {
  wordCount: number
  h1Count: number
  h2Count: number
  h3Count: number
  metaTitleLength: number
  metaDescLength: number
  keywordDensity: number
  primaryKeyword: string
  linkCount: number
  imageCount: number
  structure: StructureAnalysis
  readingTime: number
}

function generateSuggestions(s: SuggestionInput): SEOSuggestion[] {
  const out: SEOSuggestion[] = []

  // Word count
  if (s.wordCount < 300) {
    out.push({ type: 'error', category: 'Contenu', message: `Le contenu est trop court (${s.wordCount} mots). Visez au moins 600 mots pour un bon référencement.`, impact: 'high' })
  } else if (s.wordCount < 600) {
    out.push({ type: 'warning', category: 'Contenu', message: `Le contenu pourrait être plus long (${s.wordCount} mots). 600-1500 mots est idéal pour la plupart des articles.`, impact: 'medium' })
  } else {
    out.push({ type: 'success', category: 'Contenu', message: `Longueur de contenu optimale (${s.wordCount} mots).`, impact: 'low' })
  }

  // H1
  if (s.h1Count === 0) {
    out.push({ type: 'error', category: 'Structure', message: 'Aucun titre H1 détecté. Ajoutez un H1 contenant votre mot-clé principal.', impact: 'high' })
  } else if (s.h1Count > 1) {
    out.push({ type: 'warning', category: 'Structure', message: `${s.h1Count} titres H1 détectés. Un seul H1 est recommandé par page.`, impact: 'medium' })
  } else {
    out.push({ type: 'success', category: 'Structure', message: 'Titre H1 unique et présent.', impact: 'low' })
  }

  // H2/H3
  if (s.h2Count < 2) {
    out.push({ type: 'warning', category: 'Structure', message: 'Ajoutez plus de sous-titres H2 pour structurer le contenu (minimum 2-3).', impact: 'medium' })
  } else {
    out.push({ type: 'success', category: 'Structure', message: `${s.h2Count} sous-titres H2 bien structurés.`, impact: 'low' })
  }

  // Keyword density
  if (s.keywordDensity === 0) {
    out.push({ type: 'warning', category: 'Mots-clés', message: 'Aucun mot-clé principal détecté. Définissez un mot-clé cible.', impact: 'high' })
  } else if (s.keywordDensity < 0.5) {
    out.push({ type: 'warning', category: 'Mots-clés', message: `Densité du mot-clé faible (${s.keywordDensity}%). Visez 1-2%.`, impact: 'medium' })
  } else if (s.keywordDensity > 3) {
    out.push({ type: 'error', category: 'Mots-clés', message: `Sur-optimisation détectée (${s.keywordDensity}%). Réduisez l'usage du mot-clé pour éviter le keyword stuffing.`, impact: 'high' })
  } else {
    out.push({ type: 'success', category: 'Mots-clés', message: `Densité du mot-clé optimale (${s.keywordDensity}%).`, impact: 'low' })
  }

  // Meta title
  if (s.metaTitleLength === 0) {
    out.push({ type: 'warning', category: 'Méta', message: 'Aucune meta title détectée.', impact: 'medium' })
  } else if (s.metaTitleLength < 30 || s.metaTitleLength > 60) {
    out.push({ type: 'warning', category: 'Méta', message: `Meta title hors plage (${s.metaTitleLength} chars). Visez 50-60 caractères.`, impact: 'medium' })
  } else {
    out.push({ type: 'success', category: 'Méta', message: `Meta title bien dimensionnée (${s.metaTitleLength} chars).`, impact: 'low' })
  }

  // Links
  if (s.linkCount === 0) {
    out.push({ type: 'warning', category: 'Liens', message: 'Aucun lien détecté. Ajoutez des liens internes et externes pertinents.', impact: 'medium' })
  } else {
    out.push({ type: 'success', category: 'Liens', message: `${s.linkCount} lien(s) présent(s).`, impact: 'low' })
  }

  // Images
  if (s.imageCount === 0) {
    out.push({ type: 'warning', category: 'Médias', message: 'Aucune image détectée. Ajoutez des images avec attributs alt.', impact: 'low' })
  } else {
    out.push({ type: 'success', category: 'Médias', message: `${s.imageCount} image(s) présente(s).`, impact: 'low' })
  }

  // Reading time
  if (s.readingTime >= 3) {
    out.push({ type: 'success', category: 'Lecture', message: `Temps de lecture de ${s.readingTime} min — bon pour l'engagement.`, impact: 'low' })
  }

  return out
}

function calculateOverallScore(data: {
  wordCount: number
  h1Count: number
  h2Count: number
  metaTitleLength: number
  metaDescLength: number
  keywordDensity: number
  readability: number
  structure: StructureAnalysis
  suggestions: SEOSuggestion[]
}): number {
  let score = 40 // base

  // Content length
  if (data.wordCount >= 600) score += 15
  else if (data.wordCount >= 300) score += 8

  // Headings
  if (data.h1Count === 1) score += 10
  if (data.h2Count >= 2) score += 8

  // Keyword density
  if (data.keywordDensity >= 0.5 && data.keywordDensity <= 2.5) score += 12

  // Meta
  if (data.metaTitleLength >= 30 && data.metaTitleLength <= 60) score += 5

  // Structure
  if (data.structure.hasList) score += 4
  if (data.structure.shortParagraphs) score += 3
  if (data.structure.hasConclusion) score += 3

  // Readability
  score += Math.round(data.readability * 0.1)

  // Penalize errors
  const errors = data.suggestions.filter((s) => s.type === 'error').length
  score -= errors * 5

  return Math.max(0, Math.min(100, Math.round(score)))
}
