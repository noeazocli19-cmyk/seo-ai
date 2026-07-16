'use client'

import { useState, useEffect, useCallback } from 'react'
import { authClient } from '@/lib/auth-client'
import { useAppStore } from '@/lib/store'

interface AuthUser {
  id: string
  email: string
  name: string
  image?: string | null
  phone?: string | null
  plan?: string
}

interface UseAuthReturn {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const storeLogin = useAppStore((s) => s.login)
  const storeLogout = useAppStore((s) => s.logout)

  const refresh = useCallback(async () => {
    try {
      const { data, error } = await authClient.getSession()
      if (error || !data?.user) {
        setUser(null)
        // If store thinks we're authenticated but session is gone, sync logout
        if (useAppStore.getState().isAuthenticated) {
          storeLogout()
        }
        return
      }
      const u = data.user as AuthUser
      setUser(u)
      // Sync with app store (keeps app gate consistent)
      storeLogin(u.email, u.name, u.id)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [storeLogin, storeLogout])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleSignIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await authClient.signIn.email({ email, password })
    if (error) return { error: translateError(error.message) }
    if (data?.user) {
      const u = data.user as AuthUser
      setUser(u)
      storeLogin(u.email, u.name, u.id)
    }
    return {}
  }, [storeLogin])

  const handleSignUp = useCallback(async (data: { name: string; email: string; password: string; phone?: string }) => {
    const { data: result, error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    })
    if (error) return { error: translateError(error.message) }
    if (result?.user) {
      const u = result.user as AuthUser
      setUser(u)
      storeLogin(u.email, u.name, u.id)
    }
    return {}
  }, [storeLogin])

  const handleSignOut = useCallback(async () => {
    await authClient.signOut()
    setUser(null)
    storeLogout()
  }, [storeLogout])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    refresh,
  }
}

function translateError(message?: string): string {
  if (!message || typeof message !== 'string') {
    return 'Une erreur est survenue'
  }

  const map: Record<string, string> = {
    'Invalid email or password': 'Email ou mot de passe incorrect',
    'User not found': 'Aucun compte trouvé avec cet email',
    'Password is too short': 'Le mot de passe est trop court (8 caractères minimum)',
    'Email already exists': 'Un compte existe déjà avec cet email',
    'email or password is invalid': 'Email ou mot de passe invalide',
    'INVALID_PASSWORD': 'Mot de passe invalide',
    'USER_NOT_FOUND': 'Utilisateur introuvable',
    'EMAIL_NOT_VERIFIED': 'Email non vérifié',
  }
  for (const [key, val] of Object.entries(map)) {
    if (message.toLowerCase().includes(key.toLowerCase())) return val
  }
  return message
}
