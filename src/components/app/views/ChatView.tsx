'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Markdown } from '@/components/app/shared/Markdown'
import { ExportButtons } from '@/components/app/shared/ExportButtons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Send, Plus, Search, MoreVertical, Trash2, Pencil, Pin, Copy,
  Check, MessageSquare, Sparkles, Loader2, Menu, X, RefreshCw, Bot,
} from 'lucide-react'
import { toast } from 'sonner'
import type { ChatMessageData } from '@/lib/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const SUGGESTIONS = [
  { icon: 'FileText', title: 'Rédiger un article SEO', prompt: 'Rédige un article SEO de 600 mots sur les meilleures pratiques de référencement naturel en 2025.' },
  { icon: 'Search', title: 'Analyser un mot-clé', prompt: 'Analyse le mot-clé "marketing digital" et donne-moi une stratégie SEO complète.' },
  { icon: 'HelpCircle', title: 'Créer une FAQ', prompt: 'Crée une FAQ optimisée pour Google sur le thème du e-commerce.' },
  { icon: 'Mail', title: 'Email marketing', prompt: 'Rédige un email marketing pour promouvoir un cours en ligne sur le SEO.' },
]

export function ChatView() {
  const conversations = useAppStore((s) => s.conversations)
  const activeConversationId = useAppStore((s) => s.activeConversationId)
  const createConversation = useAppStore((s) => s.createConversation)
  const deleteConversation = useAppStore((s) => s.deleteConversation)
  const renameConversation = useAppStore((s) => s.renameConversation)
  const togglePinConversation = useAppStore((s) => s.togglePinConversation)
  const setActiveConversation = useAppStore((s) => s.setActiveConversation)
  const addMessage = useAppStore((s) => s.addMessage)
  const updateMessage = useAppStore((s) => s.updateMessage)
  const incrementApiCalls = useAppStore((s) => s.incrementApiCalls)

  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const activeConversation = conversations.find((c) => c.id === activeConversationId)

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activeConversation?.messages])

  // Create a conversation if none active
  useEffect(() => {
    if (!activeConversationId && conversations.length === 0) {
      // Don't auto-create, show empty state
    } else if (!activeConversationId && conversations.length > 0) {
      setActiveConversation(conversations[0].id)
    }
  }, [activeConversationId, conversations, setActiveConversation])

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  const pinned = filteredConversations.filter((c) => c.pinned)
  const unpinned = filteredConversations.filter((c) => !c.pinned)

  const startNewConversation = () => {
    createConversation()
    setSidebarOpen(false)
  }

  const sendMessage = async (content: string, conversationId?: string) => {
    const text = content.trim()
    if (!text || isStreaming) return

    let convId = conversationId || activeConversationId
    if (!convId) {
      convId = createConversation()
    }

    const userMessage: ChatMessageData = {
      id: `${Date.now()}-u`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    }
    addMessage(convId, userMessage)
    setInput('')
    setIsStreaming(true)
    incrementApiCalls()

    // Add placeholder assistant message
    const assistantId = `${Date.now()}-a`
    const assistantMessage: ChatMessageData = {
      id: assistantId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      streaming: true,
    }
    addMessage(convId, assistantMessage)

    try {
      const messages = [
        ...(activeConversation?.messages.map((m) => ({ role: m.role, content: m.content })) || []),
        { role: 'user' as const, content: text },
      ]

      const controller = new AbortController()
      abortRef.current = controller

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      })

      if (!res.ok) {
        // Extract the real error message from the server response
        let serverError = 'Échec de la requête'
        try {
          const errorData = await res.json()
          serverError = errorData.error || errorData.message || serverError
        } catch {
          try {
            const text = await res.text()
            if (text) serverError = text
          } catch {
            /* keep default */
          }
        }
        throw new Error(serverError)
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          if (chunk.includes('[DONE]')) {
            accumulated += chunk.replace('[DONE]', '')
          } else {
            accumulated += chunk
          }

          updateMessage(convId, assistantId, accumulated)
        }
      }

      updateMessage(convId, assistantId, accumulated.replace('[DONE]', ''))
    } catch (error) {
      const isAbortError =
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        (error as { name?: unknown }).name === 'AbortError'

      if (isAbortError) {
        updateMessage(convId, assistantId, '[Génération interrompue]')
      } else {
        const errMsg =
          error instanceof Error
            ? error.message
            : typeof error === 'string'
            ? error
            : JSON.stringify(error) || 'Erreur inconnue'

        console.error('[CHAT ERROR]', errMsg)
        updateMessage(convId, assistantId, `❌ Erreur : ${errMsg}`)
        toast.error(`Erreur : ${errMsg}`)
      }
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }

  const handleStop = () => {
    abortRef.current?.abort()
    setIsStreaming(false)
  }

  const handleRegenerate = async (messageId: string) => {
    const conv = conversations.find((c) => c.id === activeConversationId)
    if (!conv) return

    const msgIndex = conv.messages.findIndex((m) => m.id === messageId)
    if (msgIndex === -1) return

    // Find the preceding user message
    let userMsg: ChatMessageData | undefined
    for (let i = msgIndex; i >= 0; i--) {
      if (conv.messages[i].role === 'user') {
        userMsg = conv.messages[i]
        break
      }
    }
    if (!userMsg) return

    // Reset the assistant message
    updateMessage(conv.id, messageId, '')
    setIsStreaming(true)
    incrementApiCalls()

    try {
      const messages = conv.messages
        .slice(0, msgIndex)
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      })

      if (!res.ok) throw new Error('Failed')

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          updateMessage(conv.id, messageId, accumulated.replace('[DONE]', ''))
        }
      }
    } catch {
      toast.error('Erreur lors de la régénération')
    } finally {
      setIsStreaming(false)
    }
  }

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content)
    toast.success('Réponse copiée')
  }

  const handleRename = (id: string, currentTitle: string) => {
    setEditingId(id)
    setEditTitle(currentTitle)
  }

  const saveRename = (id: string) => {
    if (editTitle.trim()) {
      renameConversation(id, editTitle.trim())
    }
    setEditingId(null)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversation sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-0 md:top-16 left-0 z-40 md:z-auto h-screen md:h-[calc(100vh-4rem)] w-72 glass border-r flex flex-col transition-transform duration-300`}>
        <div className="p-3 border-b">
          <Button onClick={startNewConversation} className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle conversation
          </Button>
        </div>

        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Aucune conversation</p>
              </div>
            ) : (
              <>
                {pinned.length > 0 && (
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Épinglées
                  </div>
                )}
                {pinned.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    active={conv.id === activeConversationId}
                    editing={editingId === conv.id}
                    editTitle={editTitle}
                    onSelect={() => { setActiveConversation(conv.id); setSidebarOpen(false) }}
                    onDelete={() => { deleteConversation(conv.id); toast.success('Conversation supprimée') }}
                    onRename={() => handleRename(conv.id, conv.title)}
                    onSaveRename={() => saveRename(conv.id)}
                    onEditTitleChange={setEditTitle}
                    onTogglePin={() => togglePinConversation(conv.id)}
                  />
                ))}

                {unpinned.length > 0 && pinned.length > 0 && (
                  <div className="px-2 py-1.5 mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Récentes
                  </div>
                )}
                {unpinned.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    active={conv.id === activeConversationId}
                    editing={editingId === conv.id}
                    editTitle={editTitle}
                    onSelect={() => { setActiveConversation(conv.id); setSidebarOpen(false) }}
                    onDelete={() => { deleteConversation(conv.id); toast.success('Conversation supprimée') }}
                    onRename={() => handleRename(conv.id, conv.title)}
                    onSaveRename={() => saveRename(conv.id)}
                    onEditTitleChange={setEditTitle}
                    onTogglePin={() => togglePinConversation(conv.id)}
                  />
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile toggle */}
        <div className="md:hidden p-2 border-b flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <span className="text-sm font-medium truncate">
            {activeConversation?.title || 'Chat IA'}
          </span>
        </div>

        {!activeConversation || activeConversation.messages.length === 0 ? (
          <EmptyChatState onSuggestion={(p) => sendMessage(p, activeConversationId || undefined)} />
        ) : (
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
              {activeConversation.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onCopy={() => handleCopy(message.content)}
                  onRegenerate={() => handleRegenerate(message.id)}
                  isLast={message.id === activeConversation.messages[activeConversation.messages.length - 1].id}
                  isStreaming={isStreaming}
                />
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="border-t glass p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage(input)
                    }
                  }}
                  placeholder="Écrivez votre message... (Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne)"
                  rows={1}
                  className="w-full resize-none rounded-2xl border bg-background px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 max-h-40 min-h-[48px]"
                  style={{ height: 'auto' }}
                  onInput={(e) => {
                    const t = e.target as HTMLTextAreaElement
                    t.style.height = 'auto'
                    t.style.height = Math.min(t.scrollHeight, 160) + 'px'
                  }}
                />
              </div>
              {isStreaming ? (
                <Button
                  onClick={handleStop}
                  size="icon"
                  variant="destructive"
                  className="rounded-full h-11 w-11 shrink-0"
                >
                  <span className="block w-3 h-3 bg-white rounded-sm" />
                </Button>
              ) : (
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  size="icon"
                  className="rounded-full h-11 w-11 shrink-0 shadow-glow"
                >
                  <Send className="w-4 h-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              SEO AI Writer peut faire des erreurs. Vérifiez les informations importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConversationItem({
  conv, active, editing, editTitle, onSelect, onDelete, onRename, onSaveRename, onEditTitleChange, onTogglePin,
}: {
  conv: { id: string; title: string; pinned: boolean; messages: ChatMessageData[] }
  active: boolean
  editing: boolean
  editTitle: string
  onSelect: () => void
  onDelete: () => void
  onRename: () => void
  onSaveRename: () => void
  onEditTitleChange: (v: string) => void
  onTogglePin: () => void
}) {
  return (
    <div
      className={`group flex items-center gap-1 rounded-lg px-2 py-2 cursor-pointer transition-colors ${
        active ? 'bg-primary/10 text-primary' : 'hover:bg-muted/60'
      }`}
      onClick={onSelect}
    >
      {editing ? (
        <input
          value={editTitle}
          onChange={(e) => onEditTitleChange(e.target.value)}
          onBlur={onSaveRename}
          onKeyDown={(e) => e.key === 'Enter' && onSaveRename()}
          autoFocus
          className="flex-1 bg-transparent border-b border-primary text-sm outline-none px-1"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="flex-1 text-sm truncate">{conv.title}</span>
      )}

      {conv.pinned && <Pin className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onClick={onTogglePin} className="gap-2">
            <Pin className="w-3.5 h-3.5" />
            {conv.pinned ? 'Désépingler' : 'Épingler'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onRename} className="gap-2">
            <Pencil className="w-3.5 h-3.5" />
            Renommer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="gap-2 text-destructive">
            <Trash2 className="w-3.5 h-3.5" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function MessageBubble({
  message, onCopy, onRegenerate, isLast, isStreaming,
}: {
  message: ChatMessageData
  onCopy: () => void
  onRegenerate: () => void
  isLast: boolean
  isStreaming: boolean
}) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const isEmpty = !message.content && message.streaming

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        isUser ? 'gradient-brand' : 'bg-muted border'
      }`}>
        {isUser ? (
          <span className="text-white text-xs font-bold">Vous</span>
        ) : (
          <Sparkles className="w-4 h-4 text-primary" />
        )}
      </div>

      <div className={`flex-1 min-w-0 max-w-[85%] ${isUser ? 'items-end' : ''}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? 'gradient-brand text-white'
            : 'glass border'
        }`}>
          {isEmpty ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">L'IA réfléchit...</span>
            </div>
          ) : isUser ? (
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <Markdown content={message.content} />
          )}
          {message.streaming && !isEmpty && (
            <span className="inline-block w-2 h-4 bg-primary animate-blink ml-0.5 rounded-sm" />
          )}
        </div>

        {!isUser && !message.streaming && message.content && (
          <div className="flex items-center gap-1 mt-2">
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 gap-1 text-xs">
              {copied ? <Check className="w-3 h-3 text-chart-5" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copié' : 'Copier'}
            </Button>
            {isLast && (
              <Button variant="ghost" size="sm" onClick={onRegenerate} disabled={isStreaming} className="h-7 gap-1 text-xs">
                <RefreshCw className="w-3 h-3" />
                Régénérer
              </Button>
            )}
            <ExportButtons content={message.content} title="reponse-ia" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

function EmptyChatState({ onSuggestion }: { onSuggestion: (prompt: string) => void }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-6 shadow-glow"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          Comment puis-je vous aider ?
        </h2>
        <p className="text-muted-foreground mb-8">
          Discutez avec l'IA experte SEO ou choisissez une suggestion ci-dessous.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUGGESTIONS.map((s, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSuggestion(s.prompt)}
              className="group text-left glass rounded-xl p-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:gradient-brand group-hover:text-white transition-all shrink-0">
                  <Bot className="w-4.5 h-4.5 text-primary group-hover:text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1">{s.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{s.prompt}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
