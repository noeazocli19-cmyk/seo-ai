'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { useAuth } from '@/hooks/use-auth'
import { LandingPage } from '@/components/landing/LandingPage'
import { AppShell } from '@/components/app/AppShell'
import { AuthModal } from '@/components/auth/AuthModal'

export default function Home() {
  const view = useAppStore((s) => s.view)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const setAuthModal = useAppStore((s) => s.setAuthModal)
  const setView = useAppStore((s) => s.setView)
  const { loading } = useAuth()

  // Apply theme on mount + changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme, setTheme])

  // Detect password reset token in URL (?reset-token=xxx)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const token = params.get('reset-token')
    if (token) {
      setAuthModal('reset', token)
      // Clean URL
      const url = new URL(window.location.href)
      url.searchParams.delete('reset-token')
      window.history.replaceState({}, '', url.toString())
    }
  }, [setAuthModal])

  // If authenticated but on landing view, go to dashboard
  useEffect(() => {
    if (isAuthenticated && view === 'landing') {
      setView('dashboard')
    }
  }, [isAuthenticated, view, setView])

  // Show landing if not authenticated OR explicitly on landing view
  const showLanding = !isAuthenticated || view === 'landing'

  // Loading splash while checking session
  if (loading && view !== 'landing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center animate-pulse-glow">
            <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Chargement de votre session...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {showLanding ? <LandingPage /> : <AppShell />}
      <AuthModal />
    </>
  )
}
