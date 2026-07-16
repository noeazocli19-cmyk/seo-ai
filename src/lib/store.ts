/**
 * Global app store (Zustand) with localStorage persistence.
 * Manages: current view, theme, conversations, content history, stats.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ViewType, ChatMessageData, ConversationData, ContentRecord, DashboardStats } from './types'

interface AppState {
  // Navigation
  view: ViewType
  setView: (v: ViewType) => void

  // Auth (Better Auth session synced here)
  user: { id: string; name: string; email: string; plan: string } | null
  isAuthenticated: boolean
  login: (email: string, name?: string, userId?: string) => void
  logout: () => void
  // Auth modal state
  authModalView: 'login' | 'register' | 'forgot' | 'reset' | null
  resetToken: string | null
  setAuthModal: (v: 'login' | 'register' | 'forgot' | 'reset' | null, token?: string | null) => void

  // Theme
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (t: 'light' | 'dark') => void

  // Chat
  conversations: ConversationData[]
  activeConversationId: string | null
  createConversation: () => string
  deleteConversation: (id: string) => void
  renameConversation: (id: string, title: string) => void
  togglePinConversation: (id: string) => void
  setActiveConversation: (id: string) => void
  addMessage: (conversationId: string, message: ChatMessageData) => void
  updateMessage: (conversationId: string, messageId: string, content: string) => void

  // Content history
  contents: ContentRecord[]
  addContent: (c: ContentRecord) => void
  deleteContent: (id: string) => void
  toggleFavorite: (id: string) => void

  // Stats
  stats: DashboardStats
  incrementApiCalls: () => void
  addWords: (n: number) => void
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: 'landing',
      setView: (v) => set({ view: v }),

      user: null,
      isAuthenticated: false,
      login: (email, name, userId) =>
        set((s) => ({
          isAuthenticated: true,
          user: {
            id: userId || generateId(),
            email,
            name: name || email.split('@')[0],
            plan: 'pro',
          },
          // Only jump to dashboard when coming from the landing page.
          // If the user is already in the app (e.g. on settings), keep their current view.
          view: s.view === 'landing' ? 'dashboard' : s.view,
          authModalView: null,
        })),
      logout: () => set({ isAuthenticated: false, user: null, view: 'landing', authModalView: null }),
      authModalView: null,
      resetToken: null,
      setAuthModal: (v, token) => set({ authModalView: v, resetToken: token ?? null }),

      theme: 'light',
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light'
        set({ theme: next })
        applyTheme(next)
      },
      setTheme: (t) => {
        set({ theme: t })
        applyTheme(t)
      },

      conversations: [],
      activeConversationId: null,
      createConversation: () => {
        const id = generateId()
        const now = new Date().toISOString()
        const conv: ConversationData = {
          id,
          title: 'Nouvelle conversation',
          pinned: false,
          messages: [],
          createdAt: now,
          updatedAt: now,
        }
        set((s) => ({
          conversations: [conv, ...s.conversations],
          activeConversationId: id,
        }))
        return id
      },
      deleteConversation: (id) =>
        set((s) => ({
          conversations: s.conversations.filter((c) => c.id !== id),
          activeConversationId: s.activeConversationId === id ? null : s.activeConversationId,
        })),
      renameConversation: (id, title) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, title, updatedAt: new Date().toISOString() } : c
          ),
        })),
      togglePinConversation: (id) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, pinned: !c.pinned } : c
          ),
        })),
      setActiveConversation: (id) => set({ activeConversationId: id }),
      addMessage: (conversationId, message) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                  updatedAt: new Date().toISOString(),
                  title:
                    c.messages.length === 0 && message.role === 'user'
                      ? message.content.slice(0, 40) + (message.content.length > 40 ? '...' : '')
                      : c.title,
                }
              : c
          ),
        })),
      updateMessage: (conversationId, messageId, content) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) => (m.id === messageId ? { ...m, content } : m)),
                }
              : c
          ),
        })),

      contents: [],
      addContent: (c) =>
        set((s) => ({
          contents: [c, ...s.contents],
          stats: {
            ...s.stats,
            contentsGenerated: s.stats.contentsGenerated + 1,
            wordsGenerated: s.stats.wordsGenerated + c.wordCount,
            favoriteCount: s.stats.favoriteCount + (c.isFavorite ? 1 : 0),
          },
        })),
      deleteContent: (id) =>
        set((s) => ({
          contents: s.contents.filter((c) => c.id !== id),
        })),
      toggleFavorite: (id) =>
        set((s) => ({
          contents: s.contents.map((c) =>
            c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
          ),
        })),

      stats: {
        conversations: 0,
        contentsGenerated: 0,
        wordsGenerated: 0,
        apiCalls: 0,
        avgSeoScore: 0,
        favoriteCount: 0,
      },
      incrementApiCalls: () =>
        set((s) => ({
          stats: {
            ...s.stats,
            apiCalls: s.stats.apiCalls + 1,
            conversations: s.conversations.length,
          },
        })),
      addWords: (n) =>
        set((s) => ({
          stats: { ...s.stats, wordsGenerated: s.stats.wordsGenerated + n },
        })),
    }),
    {
      name: 'seo-ai-writer-storage',
      partialize: (state) => ({
        view: state.view,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        conversations: state.conversations,
        contents: state.contents,
        stats: state.stats,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyTheme(state.theme)
        }
      },
    }
  )
)

function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}
