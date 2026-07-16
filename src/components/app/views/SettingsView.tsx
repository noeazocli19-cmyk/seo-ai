'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { LANGUAGES, TONES } from '@/lib/constants'
import { toast } from 'sonner'
import {
  User, Moon, Sun, Globe, Bell, Palette, Zap, Shield, LogOut,
  Crown, Mail, Settings as SettingsIcon, Trash2, Download,
} from 'lucide-react'

export function SettingsView() {
  const user = useAppStore((s) => s.user)
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const { signOut } = useAuth()
  const contents = useAppStore((s) => s.contents)
  const conversations = useAppStore((s) => s.conversations)

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [language, setLanguage] = useState('français')
  const [defaultTone, setDefaultTone] = useState('professionnel')
  const [notifications, setNotifications] = useState(true)

  const handleSave = () => {
    toast.success('Paramètres enregistrés')
  }

  const handleClearData = () => {
    if (confirm('Êtes-vous sûr ? Cette action supprimera toutes vos conversations et contenus.')) {
      localStorage.removeItem('seo-ai-writer-storage')
      toast.success('Données effacées. La page va se recharger.')
      setTimeout(() => window.location.reload(), 1500)
    }
  }

  const handleExportData = () => {
    const data = {
      user,
      conversations,
      contents,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'seo-ai-writer-data.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Données exportées')
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-1">Paramètres</h2>
        <p className="text-muted-foreground">Gérez votre compte, vos préférences et vos données.</p>
      </div>

      {/* Profile */}
      <Card className="p-5 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Profil</h3>
            <p className="text-xs text-muted-foreground">Vos informations personnelles</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-5 p-4 rounded-xl glass">
          <div className="w-16 h-16 rounded-full gradient-brand flex items-center justify-center text-white text-xl font-bold shrink-0">
            {name?.[0]?.toUpperCase() || 'D'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">{name || 'Démo Utilisateur'}</div>
            <div className="text-sm text-muted-foreground truncate">{email}</div>
            <span className="inline-flex items-center gap-1 mt-1 text-xs px-2 py-0.5 rounded-full bg-chart-4/10 text-chart-4 font-medium">
              <Crown className="w-3 h-3" /> Plan Pro
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">Nom</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="p-5 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-chart-3/10 flex items-center justify-center">
            <Palette className="w-5 h-5 text-chart-3" />
          </div>
          <div>
            <h3 className="font-semibold">Apparence</h3>
            <p className="text-xs text-muted-foreground">Personnalisez l'interface</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg glass">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-chart-4" />}
              <div>
                <div className="font-medium text-sm">Thème</div>
                <div className="text-xs text-muted-foreground">Basculez entre mode clair et sombre</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
                className="gap-1.5"
              >
                <Sun className="w-4 h-4" /> Clair
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
                className="gap-1.5"
              >
                <Moon className="w-4 h-4" /> Sombre
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg glass">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-chart-2" />
              <div>
                <div className="font-medium text-sm">Langue par défaut</div>
                <div className="text-xs text-muted-foreground">Langue de génération de contenu</div>
              </div>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg glass">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-chart-4" />
              <div>
                <div className="font-medium text-sm">Ton par défaut</div>
                <div className="text-xs text-muted-foreground">Ton de rédaction par défaut</div>
              </div>
            </div>
            <Select value={defaultTone} onValueChange={setDefaultTone}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TONES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-5 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-chart-5/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-chart-5" />
          </div>
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-xs text-muted-foreground">Gérez vos préférences</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg glass">
          <div>
            <div className="font-medium text-sm">Notifications push</div>
            <div className="text-xs text-muted-foreground">Recevoir des alertes en temps réel</div>
          </div>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </div>
      </Card>

      {/* Data management */}
      <Card className="p-5 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-chart-2/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-chart-2" />
          </div>
          <div>
            <h3 className="font-semibold">Données & confidentialité</h3>
            <p className="text-xs text-muted-foreground">Exportez ou supprimez vos données</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg glass">
            <div>
              <div className="font-medium text-sm">Exporter mes données</div>
              <div className="text-xs text-muted-foreground">Téléchargez toutes vos données en JSON</div>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData} className="gap-1.5">
              <Download className="w-4 h-4" /> Exporter
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg glass border-destructive/20">
            <div>
              <div className="font-medium text-sm text-destructive">Supprimer toutes les données</div>
              <div className="text-xs text-muted-foreground">Action irréversible</div>
            </div>
            <Button variant="outline" size="sm" onClick={handleClearData} className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" /> Supprimer
            </Button>
          </div>
        </div>
      </Card>

      {/* Save + Logout */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleSave} className="flex-1 gap-2 h-11">
          <SettingsIcon className="w-4 h-4" />
          Enregistrer les modifications
        </Button>
        <Button
          variant="outline"
          onClick={async () => { await signOut(); toast.success('Déconnexion réussie') }}
          className="gap-2 h-11"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </Button>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold gradient-text">{conversations.length}</div>
          <div className="text-xs text-muted-foreground">Conversations</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold gradient-text">{contents.length}</div>
          <div className="text-xs text-muted-foreground">Contenus</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold gradient-text">
            {contents.filter((c) => c.isFavorite).length}
          </div>
          <div className="text-xs text-muted-foreground">Favoris</div>
        </Card>
      </div>
    </div>
  )
}
