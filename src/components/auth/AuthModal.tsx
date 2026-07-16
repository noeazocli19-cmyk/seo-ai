'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { useAuth } from '@/hooks/use-auth'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Sparkles, Mail, Lock, User, Phone, Loader2, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export function AuthModal() {
  const authModalView = useAppStore((s) => s.authModalView)
  const resetToken = useAppStore((s) => s.resetToken)
  const setAuthModal = useAppStore((s) => s.setAuthModal)

  const open = authModalView !== null
  const close = () => setAuthModal(null)

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0" aria-describedby={undefined}>
        {/* Visually hidden title/description for screen reader accessibility */}
        <DialogTitle className="sr-only">{getTitle(authModalView)}</DialogTitle>
        <DialogDescription className="sr-only">{getSubtitle(authModalView)}</DialogDescription>
        {/* Header with gradient */}
        <div className="gradient-brand p-6 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold">{getTitle(authModalView)}</h2>
            <p className="text-white/80 text-sm mt-1">{getSubtitle(authModalView)}</p>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {authModalView === 'login' && (
              <LoginForm key="login" onDone={close} />
            )}
            {authModalView === 'register' && (
              <RegisterForm key="register" onDone={close} />
            )}
            {authModalView === 'forgot' && (
              <ForgotForm key="forgot" />
            )}
            {authModalView === 'reset' && (
              <ResetForm key="reset" resetToken={resetToken} />
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function LoginForm({ onDone }: { onDone: () => void }) {
  const setAuthModal = useAppStore((s) => s.setAuthModal)
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    setLoading(true)
    const { error } = await signIn(email.trim(), password)
    setLoading(false)
    if (error) {
      toast.error(error)
      return
    }
    toast.success('Connexion réussie ! Bienvenue')
    onDone()
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Field icon={Mail} label="Email" type="email" placeholder="votre@email.com" value={email} onChange={setEmail} required />
      <div>
        <Label className="text-sm font-medium">Mot de passe</Label>
        <div className="relative mt-1.5">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setAuthModal('forgot')}
          className="text-xs text-primary hover:underline"
        >
          Mot de passe oublié ?
        </button>
      </div>

      <Button type="submit" disabled={loading} className="w-full gap-2 h-11">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        {loading ? 'Connexion...' : 'Se connecter'}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{' '}
        <button type="button" onClick={() => setAuthModal('register')} className="text-primary font-medium hover:underline">
          Créer un compte
        </button>
      </div>
    </motion.form>
  )
}

function RegisterForm({ onDone }: { onDone: () => void }) {
  const setAuthModal = useAppStore((s) => s.setAuthModal)
  const { signUp } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('+229 ')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }
    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    setLoading(true)
    const { error } = await signUp({
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim() || undefined,
    })
    setLoading(false)
    if (error) {
      toast.error(error)
      return
    }
    toast.success('Compte créé avec succès ! Bienvenue')
    onDone()
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Field icon={User} label="Nom complet" placeholder="Ex: Koffi Adjoua" value={name} onChange={setName} required />
      <Field icon={Mail} label="Email" type="email" placeholder="votre@email.com" value={email} onChange={setEmail} required />
      <Field icon={Phone} label="Téléphone (Bénin)" type="tel" placeholder="+229 XX XX XX XX" value={phone} onChange={setPhone} />
      <div>
        <Label className="text-sm font-medium">Mot de passe</Label>
        <div className="relative mt-1.5">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 caractères"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <Field icon={Lock} label="Confirmer le mot de passe" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={confirmPassword} onChange={setConfirmPassword} required />

      <Button type="submit" disabled={loading} className="w-full gap-2 h-11">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {loading ? 'Création...' : 'Créer mon compte'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
      </p>

      <div className="text-center text-sm text-muted-foreground">
        Déjà un compte ?{' '}
        <button type="button" onClick={() => setAuthModal('login')} className="text-primary font-medium hover:underline">
          Se connecter
        </button>
      </div>
    </motion.form>
  )
}

function ForgotForm() {
  const setAuthModal = useAppStore((s) => s.setAuthModal)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Veuillez entrer votre email')
      return
    }
    setLoading(true)
    const { error } = await authClient.requestPasswordReset({ email: email.trim(), redirectTo: '/' })
    setLoading(false)
    if (error) {
      toast.error(translateAuthError(error.message))
      return
    }
    setEmailSent(true)
    toast.success('Email de réinitialisation envoyé !')
  }

  if (emailSent) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-6"
      >
        <div className="w-14 h-14 rounded-2xl bg-chart-5/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-chart-5" />
        </div>
        <h3 className="font-semibold mb-2">Email envoyé !</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Vérifiez votre boîte de réception ({email}) et cliquez sur le lien pour réinitialiser votre mot de passe.
        </p>
        <Button onClick={() => setAuthModal('login')} className="w-full gap-2 h-11">
          Retour à la connexion
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Field icon={Mail} label="Email" type="email" placeholder="votre@email.com" value={email} onChange={setEmail} required />
      <p className="text-xs text-muted-foreground">
        Nous vous enverrons un email avec un lien sécurisé pour réinitialiser votre mot de passe.
      </p>
      <Button type="submit" disabled={loading} className="w-full gap-2 h-11">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
        {loading ? 'Envoi...' : 'Envoyer l\'email'}
      </Button>
      <button
        type="button"
        onClick={() => setAuthModal('login')}
        className="w-full flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Retour à la connexion
      </button>
    </motion.form>
  )
}

function ResetForm({ resetToken }: { resetToken: string | null }) {
  const setAuthModal = useAppStore((s) => s.setAuthModal)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    if (!resetToken) {
      toast.error('Token de réinitialisation manquant. Veuillez utiliser le lien dans l\'email.')
      return
    }
    setLoading(true)
    const { error } = await authClient.resetPassword({ newPassword: password, token: resetToken })
    setLoading(false)
    if (error) {
      toast.error(translateAuthError(error.message))
      return
    }
    toast.success('Mot de passe réinitialisé ! Vous pouvez vous connecter.')
    setAuthModal('login')
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <Label className="text-sm font-medium">Nouveau mot de passe</Label>
        <div className="relative mt-1.5">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 caractères"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <Field icon={Lock} label="Confirmer le mot de passe" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={confirmPassword} onChange={setConfirmPassword} required />
      <Button type="submit" disabled={loading} className="w-full gap-2 h-11">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
        {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
      </Button>
    </motion.form>
  )
}

function Field({
  icon: Icon, label, type = 'text', placeholder, value, onChange, required,
}: {
  icon: React.ElementType
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="relative mt-1.5">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
          required={required}
        />
      </div>
    </div>
  )
}

function getTitle(view: string | null): string {
  switch (view) {
    case 'login': return 'Connexion'
    case 'register': return 'Créer un compte'
    case 'forgot': return 'Mot de passe oublié'
    case 'reset': return 'Nouveau mot de passe'
    default: return ''
  }
}

function getSubtitle(view: string | null): string {
  switch (view) {
    case 'login': return 'Connectez-vous à votre compte SEO AI Writer'
    case 'register': return 'Rejoignez 15 000+ créateurs de contenu'
    case 'forgot': return 'Récupérez l\'accès à votre compte'
    case 'reset': return 'Définissez un nouveau mot de passe sécurisé'
    default: return ''
  }
}

function translateAuthError(message?: string): string {
  if (!message || typeof message !== 'string') {
    return 'Une erreur est survenue'
  }

  const map: Record<string, string> = {
    'User not found': 'Aucun compte trouvé avec cet email',
    'INVALID_PASSWORD': 'Mot de passe invalide',
    'rate limit': 'Trop de tentatives. Réessayez dans un instant.',
  }
  for (const [key, val] of Object.entries(map)) {
    if (message.toLowerCase().includes(key.toLowerCase())) return val
  }
  return message
}
