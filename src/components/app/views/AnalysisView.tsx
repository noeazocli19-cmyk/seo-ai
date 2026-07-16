'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Markdown } from '@/components/app/shared/Markdown'
import { SEOScoreRing } from '@/components/app/shared/SEOScoreRing'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
  Gauge, Type, Clock, Hash, Heading, Link as LinkIcon, Image as ImageIcon,
  AlertCircle, CheckCircle2, AlertTriangle, Sparkles, Loader2, BookOpen,
} from 'lucide-react'
import { toast } from 'sonner'
import type { SEOAnalysis } from '@/lib/types'

export function AnalysisView() {
  const [content, setContent] = useState('')
  const [keyword, setKeyword] = useState('')
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const incrementApiCalls = useAppStore((s) => s.incrementApiCalls)

  // Debounced real-time analysis
  const analyze = useCallback(async (text: string, kw?: string) => {
    if (!text.trim()) {
      setAnalysis(null)
      return
    }
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, keyword: kw }),
      })
      if (res.ok) {
        const data = await res.json()
        setAnalysis(data)
      }
    } catch {
      // silent fail for real-time
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content.trim()) {
        analyze(content, keyword)
        incrementApiCalls()
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [content, keyword, analyze, incrementApiCalls])

  const handleAnalyzeNow = async () => {
    if (!content.trim()) {
      toast.error('Veuillez entrer du contenu à analyser')
      return
    }
    setLoading(true)
    await analyze(content, keyword)
    setLoading(false)
    toast.success('Analyse SEO terminée')
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Analyse SEO en temps réel</h2>
        <p className="text-muted-foreground">
          Collez votre contenu pour obtenir un score SEO, une analyse de lisibilité et des recommandations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
              <Gauge className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Contenu à analyser</h3>
              <p className="text-xs text-muted-foreground">Markdown supporté · analyse automatique</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="keyword" className="text-sm font-medium">Mot-clé cible (optionnel)</Label>
              <Input
                id="keyword"
                placeholder="Ex: référencement naturel"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="content" className="text-sm font-medium">Contenu</Label>
              <Textarea
                id="content"
                placeholder="Collez votre article, votre méta-description ou tout contenu à analyser..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1.5 min-h-[400px] font-mono text-sm"
              />
            </div>
            <Button onClick={handleAnalyzeNow} disabled={loading || !content.trim()} className="w-full gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Analyse...' : 'Analyser maintenant'}
            </Button>
          </div>
        </Card>

        {/* Results */}
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Résultats de l'analyse</h3>

          {!analysis ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
                <Gauge className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                L'analyse apparaîtra ici automatiquement.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Score ring */}
              <div className="flex items-center justify-center py-2">
                <SEOScoreRing score={analysis.score} size={140} />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <MetricCard icon="Type" label="Mots" value={analysis.wordCount} />
                <MetricCard icon="BookOpen" label="Caractères" value={analysis.charCount} />
                <MetricCard icon="Clock" label="Lecture" value={`${analysis.readingTime} min`} />
                <MetricCard icon="Heading" label="H1 / H2 / H3" value={`${analysis.h1Count} / ${analysis.h2Count} / ${analysis.h3Count}`} />
                <MetricCard icon="Link" label="Liens" value={analysis.linkCount} />
                <MetricCard icon="Image" label="Images" value={analysis.imageCount} />
              </div>

              {/* Keyword analysis */}
              <div className="glass rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-3">Analyse des mots-clés</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mot-clé principal</span>
                    <span className="font-medium">{analysis.primaryKeyword || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Densité</span>
                    <span className={`font-medium ${analysis.keywordDensity > 3 ? 'text-destructive' : analysis.keywordDensity >= 0.5 ? 'text-chart-5' : 'text-chart-4'}`}>
                      {analysis.keywordDensity}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Méta title</span>
                    <span className="font-medium">{analysis.metaTitleLength} chars</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Méta desc</span>
                    <span className="font-medium">{analysis.metaDescLength} chars</span>
                  </div>
                  {analysis.secondaryKeywords.length > 0 && (
                    <div className="pt-2 border-t">
                      <div className="text-muted-foreground mb-1.5">Mots-clés secondaires</div>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.secondaryKeywords.map((kw) => (
                          <span key={kw} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* E-E-A-T */}
              <div className="glass rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-3">Analyse E-E-A-T</h4>
                <div className="space-y-2.5">
                  <EEATBar label="Expérience" value={analysis.eeat.experience} />
                  <EEATBar label="Expertise" value={analysis.eeat.expertise} />
                  <EEATBar label="Autorité" value={analysis.eeat.authoritativeness} />
                  <EEATBar label="Confiance" value={analysis.eeat.trustworthiness} />
                </div>
              </div>

              {/* Readability */}
              <div className="glass rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-3">Lisibilité</h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.readability}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full gradient-brand rounded-full"
                    />
                  </div>
                  <span className="font-bold text-sm">{analysis.readability}/100</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-muted-foreground">
                  <div>Phrases: {analysis.sentenceCount}</div>
                  <div>Paragraphes: {analysis.paragraphCount}</div>
                  <div>Mots/phrase: {analysis.avgWordsPerSentence}</div>
                  <div>Structure: {analysis.structure.headingHierarchy ? '✓' : '✗'}</div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="glass rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-3">Recommandations ({analysis.suggestions.length})</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {analysis.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm">
                      {s.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-chart-5 shrink-0 mt-0.5" />
                      ) : s.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-chart-4 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="text-foreground">{s.message}</span>
                        <span className="text-xs text-muted-foreground ml-1.5">· {s.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  const icons: Record<string, typeof Type> = { Type, Clock, Heading, Link: LinkIcon, Image: ImageIcon, BookOpen }
  const Icon = icons[icon] || Type
  return (
    <div className="glass rounded-lg p-3">
      <Icon className="w-4 h-4 text-primary mb-1.5" />
      <div className="text-lg font-bold leading-tight">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  )
}

function EEATBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}/100</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8 }}
          className={`h-full rounded-full ${
            value >= 70 ? 'bg-chart-5' : value >= 40 ? 'bg-chart-4' : 'bg-destructive'
          }`}
        />
      </div>
    </div>
  )
}
