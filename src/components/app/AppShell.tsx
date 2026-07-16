'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { useAuth } from '@/hooks/use-auth'
import { NAV_ITEMS } from '@/lib/constants'
import { ToolIcon } from '@/components/landing/ToolIcon'
import { Button } from '@/components/ui/button'
import { CommandPalette } from './CommandPalette'
import { DashboardView } from '@/components/app/views/DashboardView'
import { ChatView } from '@/components/app/views/ChatView'
import { ToolsView } from '@/components/app/views/ToolsView'
import { AnalysisView } from '@/components/app/views/AnalysisView'
import { KeywordsView } from '@/components/app/views/KeywordsView'
import { RewriteView } from '@/components/app/views/RewriteView'
import { HistoryView } from '@/components/app/views/HistoryView'
import { SettingsView } from '@/components/app/views/SettingsView'
import {
  Sparkles, Moon, Sun, Search, Menu, X, LogOut, Plus,
  ChevronLeft, Command,
} from 'lucide-react'
import { toast } from 'sonner'

export function AppShell() {
  const view = useAppStore((s) => s.view)
  const setView = useAppStore((s) => s.setView)
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const user = useAppStore((s) => s.user)
  const { signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleLogout = async () => {
    await signOut()
    toast.success('Déconnexion réussie. À bientôt !')
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <DashboardView />
      case 'chat': return <ChatView />
      case 'tools': return <ToolsView />
      case 'analysis': return <AnalysisView />
      case 'keywords': return <KeywordsView />
      case 'rewrite': return <RewriteView />
      case 'history': return <HistoryView />
      case 'settings': return <SettingsView />
      default: return <DashboardView />
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 glass border-r z-50 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold tracking-tight">
              SEO AI <span className="text-primary">Writer</span>
            </span>
          </button>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New chat button */}
        <div className="p-3">
          <Button
            onClick={() => setView('chat')}
            className="w-full gap-2"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
            Nouvelle conversation
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                view === item.id
                  ? 'gradient-brand text-white shadow-glow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <ToolIcon name={item.icon} className="w-4.5 h-4.5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="p-3 border-t">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg mb-2">
            <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'D'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{user?.name || 'Démo'}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="flex-1 gap-1.5"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Clair' : 'Sombre'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 glass border-b flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-lg capitalize">
              {NAV_ITEMS.find((n) => n.id === view)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPaletteOpen(true)}
              className="gap-2 hidden sm:flex"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm text-muted-foreground">Rechercher...</span>
              <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs rounded bg-muted border">
                <Command className="w-3 h-3" />K
              </kbd>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPaletteOpen(true)}
              className="sm:hidden"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </header>

        {/* View content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  )
}
