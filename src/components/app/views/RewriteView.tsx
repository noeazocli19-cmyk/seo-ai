'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { REWRITE_OPERATIONS, TONES, LANGUAGES } from '@/lib/constants'
import { ToolIcon } from '@/components/landing/ToolIcon'
import { Markdown } from '@/components/app/shared/Markdown'
import { ExportButtons } from '@/components/app/shared/ExportButtons'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  RefreshCw, Loader2, ArrowRight, Sparkles, TrendingUp, TrendingDown,
  Type, Gauge,
} from 'lucide-react'
import { toast } from 'sonner'

interface RewriteResult {
  original: string
  rewritten: string
  beforeScore: number
  afterScore: number
  beforeWords: number
  afterWords: number
}

export function RewriteView() {
  const [operation, setOperation] = useState('rewrite')
  const [text, setText] = useState('')
  const [language, setLanguage] = useState('français')
  const [tone, setTone] = useState('professionnel')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RewriteResult | null>(null)
  const incrementApiCalls = useAppStore((s) => s.incrementApiCalls)

  const handleRewrite = async () => {
    if (!text.trim()) {
      toast.error('Veuillez entrer du texte à transformer')
      return
    }

    setLoading(true)
    setResult(null)
    incrementApiCalls()

    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, text, options: { language, tone } }),
      })

      if (!res.ok) throw new Error('Échec')

      const data = await res.json()
      setResult(data)
      toast.success('Transformation terminée')
    } catch {
      toast.error('Erreur lors de la réécriture')
    } finally {
      setLoading(false)
    }
  }

  const scoreDiff = result ? result.afterScore - result.beforeScore : 0
  const currentOp = REWRITE_OPERATIONS.find((o) => o.value === operation)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Réécriture intelligente</h2>
        <p className="text-muted-foreground">
          Réécrivez, corrigez, résumez, développez ou optimisez SEO votre contenu avec l'IA.
        </p>
      </div>

      {/* Operations */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {REWRITE_OPERATIONS.map((op) => (
          <button
            key={op.value}
            onClick={() => setOperation(op.value)}
            className={`group glass rounded-xl p-3 text-left transition-all ${
              operation === op.value ? 'ring-2 ring-primary shadow-glow' : 'hover:shadow-card-hover'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-all ${
              operation === op.value ? 'gradient-brand' : 'bg-primary/10 group-hover:gradient-brand'
            }`}>
              <ToolIcon name={op.icon} className={`w-4 h-4 ${operation === op.value ? 'text-white' : 'text-primary group-hover:text-white'}`} />
            </div>
            <div className="font-semibold text-sm">{op.label}</div>
            <div className="text-[11px] text-muted-foreground line-clamp-1">{op.description}</div>
          </button>
        ))}
      </div>

      {/* Options */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <Label className="text-sm font-medium">Opération sélectionnée</Label>
            <div className="mt-1.5 flex items-center gap-2 px-3 py-2 rounded-lg glass">
              <ToolIcon name={currentOp?.icon || 'RefreshCw'} className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{currentOp?.label}</span>
              <span className="text-xs text-muted-foreground">— {currentOp?.description}</span>
            </div>
          </div>
          <div className="sm:w-40">
            <Label className="text-sm font-medium">Langue</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:w-40">
            <Label className="text-sm font-medium">Ton</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TONES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Before / After */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before */}
        <Card className="p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Type className="w-4 h-4 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">Texte original</h3>
            </div>
            {result && (
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                Score: {result.beforeScore}/100 · {result.beforeWords} mots
              </span>
            )}
          </div>

          <Textarea
            placeholder="Collez votre texte ici..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 min-h-[300px] resize-none"
          />

          <Button
            onClick={handleRewrite}
            disabled={loading || !text.trim()}
            className="w-full mt-4 gap-2 h-11"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Transformation...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                {currentOp?.label} le texte
              </>
            )}
          </Button>
        </Card>

        {/* After */}
        <Card className="p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold">Résultat</h3>
            </div>
            {result && (
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  Score: {result.afterScore}/100 · {result.afterWords} mots
                </span>
                {scoreDiff !== 0 && (
                  <span className={`text-xs flex items-center gap-0.5 font-medium ${scoreDiff > 0 ? 'text-chart-5' : 'text-destructive'}`}>
                    {scoreDiff > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {scoreDiff > 0 ? '+' : ''}{scoreDiff}
                  </span>
                )}
              </div>
            )}
          </div>

          {!result && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
                <RefreshCw className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Le texte transformé apparaîtra ici après le traitement.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mb-4 animate-pulse-glow">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground">Gemini transforme votre texte...</p>
            </div>
          )}

          {result && (
            <>
              <div className="flex-1 overflow-y-auto -mr-2 pr-2">
                <div className="glass rounded-xl p-4">
                  <Markdown content={result.rewritten} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Gauge className="w-4 h-4" />
                  Amélioration: {scoreDiff > 0 ? '+' : ''}{scoreDiff} pts
                </div>
                <ExportButtons content={result.rewritten} title="texte-rewrité" onRegenerate={handleRewrite} regenerating={loading} />
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
