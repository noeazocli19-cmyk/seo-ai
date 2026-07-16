'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { TOOLS, TONES, LANGUAGES, LENGTHS } from '@/lib/constants'
import { ToolIcon } from '@/components/landing/ToolIcon'
import { Markdown } from '@/components/app/shared/Markdown'
import { ExportButtons } from '@/components/app/shared/ExportButtons'
import { SEOScoreRing, SEOScoreBadge } from '@/components/app/shared/SEOScoreRing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Sparkles, Loader2, Wand2, Star, Clock, Type, Gauge, Hash } from 'lucide-react'
import { toast } from 'sonner'
import type { SEOAnalysis, ContentRecord } from '@/lib/types'

export function ToolsView() {
  const [selectedTool, setSelectedTool] = useState(TOOLS[0])
  const [params, setParams] = useState<Record<string, string>>({
    keyword: '',
    language: 'français',
    tone: 'professionnel',
    length: 'moyen',
  })
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<string>('')
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
  const [category, setCategory] = useState<string>('all')

  const addContent = useAppStore((s) => s.addContent)
  const incrementApiCalls = useAppStore((s) => s.incrementApiCalls)

  // Check for selected tool from command palette
  useEffect(() => {
    const toolType = localStorage.getItem('selected-tool')
    if (toolType) {
      const tool = TOOLS.find((t) => t.type === toolType)
      if (tool) setSelectedTool(tool)
      localStorage.removeItem('selected-tool')
    }
  }, [])

  const categories = [
    { value: 'all', label: 'Tous' },
    { value: 'seo', label: 'SEO' },
    { value: 'social', label: 'Réseaux sociaux' },
    { value: 'email', label: 'Email' },
    { value: 'ad', label: 'Publicité' },
  ]

  const filteredTools = category === 'all' ? TOOLS : TOOLS.filter((t) => t.category === category)

  const handleGenerate = async () => {
    if (!params.keyword?.trim()) {
      toast.error('Veuillez entrer un mot-clé ou sujet')
      return
    }

    setGenerating(true)
    setResult('')
    setAnalysis(null)
    incrementApiCalls()

    let accumulated = ''
    let finalMeta: { content: string; analysis: SEOAnalysis; wordCount: number; seoScore: number } | null = null

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedTool.type, params }),
      })

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => '')
        let errMsg = `Échec de génération (HTTP ${res.status})`
        try {
          const errJson = JSON.parse(errText)
          if (errJson?.error) errMsg = errJson.error
        } catch {
          if (errText) errMsg = errText
        }
        throw new Error(errMsg)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        // Process SSE lines (separated by \n\n)
        const parts = buffer.split('\n\n')
        buffer = parts.pop() || ''

        for (const part of parts) {
          const line = part.trim()
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6).trim()
          if (payload === '[DONE]') continue
          try {
            const data = JSON.parse(payload)
            if (data.error) throw new Error(data.error)
            if (data.delta) {
              accumulated += data.delta
              setResult(accumulated)
            }
            if (data.done) {
              finalMeta = data
              setResult(data.content)
              setAnalysis(data.analysis)
            }
          } catch (parseErr) {
            // Re-throw real errors, ignore JSON parse noise
            if (parseErr instanceof Error && parseErr.message && !parseErr.message.includes('JSON')) {
              throw parseErr
            }
          }
        }
      }

      if (!finalMeta) {
        // Fallback: if streaming didn't deliver metadata, use accumulated content
        if (!accumulated.trim()) throw new Error('Réponse vide du modèle IA')
        // Run a client-side analysis fallback (score only, no server round-trip)
        const { analyzeSEO } = await import('@/lib/seo')
        const analysis = analyzeSEO(accumulated, params.keyword)
        finalMeta = {
          content: accumulated,
          analysis,
          wordCount: analysis.wordCount,
          seoScore: analysis.score,
        }
        setAnalysis(analysis)
      }

      // Save to history
      const record: ContentRecord = {
        id: `${Date.now()}`,
        title: params.keyword,
        type: selectedTool.type,
        subtype: selectedTool.category === 'social' ? selectedTool.type : undefined,
        content: finalMeta.content,
        keyword: params.keyword,
        language: params.language,
        wordCount: finalMeta.wordCount,
        seoScore: finalMeta.seoScore,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      addContent(record)
      toast.success('Contenu généré et sauvegardé !')
    } catch (error) {
      console.error('[GENERATE ERROR]', error)
      const msg = error instanceof Error ? error.message : 'Erreur inconnue'
      toast.error(`Échec de génération : ${msg}`)
    } finally {
      setGenerating(false)
    }
  }

  const needsProductField = selectedTool.type === 'product'

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Outils de génération SEO</h2>
        <p className="text-muted-foreground">Choisissez un outil et générez du contenu optimisé en quelques secondes.</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              category === cat.value
                ? 'gradient-brand text-white shadow-glow'
                : 'glass hover:bg-muted/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {filteredTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool)}
            className={`group glass rounded-xl p-4 text-left transition-all ${
              selectedTool.id === tool.id
                ? 'ring-2 ring-primary shadow-glow'
                : 'hover:shadow-card-hover hover:-translate-y-0.5'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2.5 transition-all ${
              selectedTool.id === tool.id ? 'gradient-brand' : 'bg-primary/10 group-hover:gradient-brand'
            }`}>
              <ToolIcon name={tool.icon} className={`w-5 h-5 ${selectedTool.id === tool.id ? 'text-white' : 'text-primary group-hover:text-white'}`} />
            </div>
            <div className="font-semibold text-sm mb-0.5">{tool.name}</div>
            <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{tool.description}</div>
            {tool.premium && (
              <span className="inline-block mt-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-chart-4/10 text-chart-4">
                PREMIUM
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
              <ToolIcon name={selectedTool.icon} className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{selectedTool.name}</h3>
              <p className="text-xs text-muted-foreground">{selectedTool.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="keyword" className="text-sm font-medium">
                {selectedTool.type === 'slug' ? 'Mot-clé ou titre à convertir' : 'Mot-clé principal / Sujet'}
              </Label>
              <Input
                id="keyword"
                placeholder="Ex: référencement naturel, marketing digital..."
                value={params.keyword}
                onChange={(e) => setParams({ ...params, keyword: e.target.value })}
                className="mt-1.5"
              />
            </div>

            {needsProductField && (
              <div>
                <Label htmlFor="productName" className="text-sm font-medium">Nom du produit</Label>
                <Input
                  id="productName"
                  placeholder="Ex: Montre Connectée Pro"
                  value={params.productName || ''}
                  onChange={(e) => setParams({ ...params, productName: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            )}

            <div>
              <Label htmlFor="audience" className="text-sm font-medium">Audience cible (optionnel)</Label>
              <Input
                id="audience"
                placeholder="Ex: débutants en SEO, e-commerçants..."
                value={params.audience || ''}
                onChange={(e) => setParams({ ...params, audience: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="context" className="text-sm font-medium">Contexte / Instructions (optionnel)</Label>
              <Textarea
                id="context"
                placeholder="Ajoutez des détails, des contraintes ou un angle éditorial..."
                value={params.context || ''}
                onChange={(e) => setParams({ ...params, context: e.target.value })}
                className="mt-1.5 min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-sm font-medium">Langue</Label>
                <Select value={params.language} onValueChange={(v) => setParams({ ...params, language: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Ton</Label>
                <Select value={params.tone} onValueChange={(v) => setParams({ ...params, tone: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Longueur</Label>
                <Select value={params.length} onValueChange={(v) => setParams({ ...params, length: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LENGTHS.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating || !params.keyword.trim()}
              className="w-full gap-2 h-11"
              size="lg"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Générer le contenu
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Result */}
        <Card className="p-5 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">Résultat</h3>
              {analysis && <SEOScoreBadge score={analysis.score} className="ml-2" />}
            </div>
            {result && (
              <ExportButtons
                content={result}
                title={params.keyword}
                onRegenerate={handleGenerate}
                regenerating={generating}
              />
            )}
          </div>

          {!result && !generating && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
                <Wand2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="font-semibold mb-1">Aucun résultat pour l'instant</h4>
              <p className="text-sm text-muted-foreground max-w-xs">
                Configurez les paramètres et cliquez sur "Générer le contenu" pour créer votre contenu SEO optimisé.
              </p>
            </div>
          )}

          {generating && !result && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mb-4 animate-pulse-glow">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground">Gemini 2.5 Flash génère votre contenu...</p>
            </div>
          )}

          {result && (
            <div className="flex-1 overflow-y-auto -mr-2 pr-2">
              {/* Quick stats */}
              {analysis && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <StatChip icon="Type" label="Mots" value={analysis.wordCount.toString()} />
                  <StatChip icon="Clock" label="Lecture" value={`${analysis.readingTime} min`} />
                  <StatChip icon="Hash" label="Densité" value={`${analysis.keywordDensity}%`} />
                  <StatChip icon="Gauge" label="Lisibilité" value={`${analysis.readability}/100`} />
                </div>
              )}

              <div className="glass rounded-xl p-4">
                <Markdown content={result} />
              </div>

              {analysis && analysis.suggestions.length > 0 && (
                <div className="mt-4 glass rounded-xl p-4">
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-primary" />
                    Recommandations SEO
                  </h4>
                  <div className="space-y-2">
                    {analysis.suggestions.slice(0, 5).map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          s.type === 'success' ? 'bg-chart-5/10 text-chart-5' :
                          s.type === 'warning' ? 'bg-chart-4/10 text-chart-4' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                          {s.type === 'success' ? '✓' : s.type === 'warning' ? '!' : '✗'}
                        </span>
                        <span className="text-muted-foreground">{s.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function StatChip({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="glass rounded-lg p-2.5 text-center">
      <ToolIcon name={icon} className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
      <div className="text-sm font-bold">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  )
}
