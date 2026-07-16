'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { LANGUAGES } from '@/lib/constants'
import { ToolIcon } from '@/components/landing/ToolIcon'
import {
  Search, Loader2, Sparkles, Target, TrendingUp, HelpCircle, Lightbulb,
  Type, Hash, BarChart3, Copy, Check,
} from 'lucide-react'
import { toast } from 'sonner'
import type { KeywordResult } from '@/lib/types'

export function KeywordsView() {
  const [keyword, setKeyword] = useState('')
  const [language, setLanguage] = useState('français')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<KeywordResult | null>(null)
  const incrementApiCalls = useAppStore((s) => s.incrementApiCalls)

  const handleSearch = async () => {
    if (!keyword.trim()) {
      toast.error('Veuillez entrer un mot-clé')
      return
    }

    setLoading(true)
    setResult(null)
    incrementApiCalls()

    try {
      const res = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, language }),
      })

      if (!res.ok) throw new Error('Échec')

      const data = await res.json()
      setResult(data)
      toast.success('Analyse de mots-clés terminée')
    } catch {
      toast.error('Erreur lors de la recherche')
    } finally {
      setLoading(false)
    }
  }

  const copyList = (items: string[], label: string) => {
    navigator.clipboard.writeText(items.join('\n'))
    toast.success(`${label} copiés`)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Recherche de mots-clés IA</h2>
        <p className="text-muted-foreground">
          Générez une stratégie SEO complète : mots-clés secondaires, longue traîne, questions et idées d'articles.
        </p>
      </div>

      {/* Search bar */}
      <Card className="p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Label htmlFor="kw" className="text-sm font-medium">Mot-clé principal</Label>
            <div className="relative mt-1.5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="kw"
                placeholder="Ex: marketing digital, référencement..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <Label className="text-sm font-medium">Langue</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:self-end">
            <Button onClick={handleSearch} disabled={loading} className="w-full sm:w-auto gap-2 h-10" size="lg">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Analyse...' : 'Analyser'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {!result && !loading && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">Recherchez un mot-clé</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            L'IA analysera l'intention de recherche, la difficulté et générera une stratégie complète de mots-clés.
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">Gemini analyse votre mot-clé...</p>
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Overview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Intention</span>
              </div>
              <div className="text-xl font-bold capitalize">{result.searchIntent}</div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-chart-4/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-chart-4" />
                </div>
                <span className="text-sm text-muted-foreground">Difficulté</span>
              </div>
              <div className="text-xl font-bold">{result.difficulty}</div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-chart-5/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-chart-5" />
                </div>
                <span className="text-sm text-muted-foreground">Volume estimé</span>
              </div>
              <div className="text-xl font-bold">{result.estimatedVolume}</div>
            </Card>
          </div>

          {/* Secondary keywords */}
          <KeywordCard
            icon="Hash"
            title="Mots-clés secondaires"
            color="primary"
            items={result.secondaryKeywords}
            onCopy={() => copyList(result.secondaryKeywords, 'Mots-clés secondaires')}
          />

          {/* Long tail */}
          <KeywordCard
            icon="Type"
            title="Mots-clés longue traîne"
            color="chart-2"
            items={result.longTailKeywords}
            onCopy={() => copyList(result.longTailKeywords, 'Mots-clés longue traîne')}
          />

          {/* Questions */}
          <KeywordCard
            icon="HelpCircle"
            title="Questions fréquentes (People Also Ask)"
            color="chart-3"
            items={result.questions}
            onCopy={() => copyList(result.questions, 'Questions')}
          />

          {/* Content ideas */}
          <KeywordCard
            icon="Lightbulb"
            title="Idées d'articles"
            color="chart-4"
            items={result.contentIdeas}
            onCopy={() => copyList(result.contentIdeas, 'Idées d\'articles')}
          />

          {/* Title suggestions */}
          <KeywordCard
            icon="Type"
            title="Titres SEO suggérés"
            color="chart-5"
            items={result.titleSuggestions}
            onCopy={() => copyList(result.titleSuggestions, 'Titres SEO')}
          />
        </motion.div>
      )}
    </div>
  )
}

function KeywordCard({
  icon, title, color, items, onCopy,
}: {
  icon: string
  title: string
  color: string
  items: string[]
  onCopy: () => void
}) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg bg-${color}/10 flex items-center justify-center`}>
            <ToolIcon name={icon} className={`w-4.5 h-4.5 text-${color}`} />
          </div>
          <h3 className="font-semibold">{title}</h3>
          <span className="text-xs text-muted-foreground">({items.length})</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5">
          {copied ? <Check className="w-3.5 h-3.5 text-chart-5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copié' : 'Copier'}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="text-sm px-3 py-1.5 rounded-lg glass hover:bg-muted/60 transition-colors cursor-default"
          >
            {item}
          </motion.span>
        ))}
      </div>
    </Card>
  )
}
