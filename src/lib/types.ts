/**
 * Shared TypeScript types for SEO AI Writer.
 */

export type { SEOAnalysis } from './seo'

export type ViewType =
  | 'landing'
  | 'dashboard'
  | 'chat'
  | 'tools'
  | 'analysis'
  | 'keywords'
  | 'rewrite'
  | 'history'
  | 'settings'

export interface Tool {
  id: string
  type: string
  name: string
  description: string
  icon: string
  category: 'seo' | 'social' | 'email' | 'ad' | 'rewrite'
  premium?: boolean
}

export interface ChatMessageData {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  streaming?: boolean
}

export interface ConversationData {
  id: string
  title: string
  pinned: boolean
  messages: ChatMessageData[]
  createdAt: string
  updatedAt: string
}

export interface ContentRecord {
  id: string
  title: string
  type: string
  subtype?: string
  content: string
  keyword?: string
  language: string
  wordCount: number
  seoScore: number
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface KeywordResult {
  primaryKeyword: string
  searchIntent: string
  difficulty: string
  secondaryKeywords: string[]
  longTailKeywords: string[]
  questions: string[]
  contentIdeas: string[]
  titleSuggestions: string[]
  estimatedVolume: string
}

export interface DashboardStats {
  conversations: number
  contentsGenerated: number
  wordsGenerated: number
  apiCalls: number
  avgSeoScore: number
  favoriteCount: number
}

export interface ActivityItem {
  id: string
  type: 'chat' | 'content' | 'keyword' | 'rewrite'
  title: string
  description: string
  timestamp: string
  icon: string
}
