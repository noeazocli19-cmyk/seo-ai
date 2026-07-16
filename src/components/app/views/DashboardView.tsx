'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { ToolIcon } from '@/components/landing/ToolIcon'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SEOScoreRing } from '@/components/app/shared/SEOScoreRing'
import {
  MessageSquare, FileText, Type, Zap, TrendingUp, Star,
  ArrowUpRight, Plus, Clock,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useMemo } from 'react'

export function DashboardView() {
  const stats = useAppStore((s) => s.stats)
  const contents = useAppStore((s) => s.contents)
  const conversations = useAppStore((s) => s.conversations)
  const setView = useAppStore((s) => s.setView)

  const avgSeoScore = useMemo(() => {
    if (contents.length === 0) return 0
    return Math.round(contents.reduce((sum, c) => sum + c.seoScore, 0) / contents.length)
  }, [contents])

  const dashboardStats = [
    {
      label: 'Conversations',
      value: conversations.length,
      icon: 'MessageSquare',
      color: 'text-primary',
      bg: 'bg-primary/10',
      change: '+12%',
    },
    {
      label: 'Contenus générés',
      value: contents.length,
      icon: 'FileText',
      color: 'text-chart-2',
      bg: 'bg-chart-2/10',
      change: '+24%',
    },
    {
      label: 'Mots générés',
      value: stats.wordsGenerated.toLocaleString('fr-FR'),
      icon: 'Type',
      color: 'text-chart-3',
      bg: 'bg-chart-3/10',
      change: '+38%',
    },
    {
      label: 'Appels API',
      value: stats.apiCalls,
      icon: 'Zap',
      color: 'text-chart-4',
      bg: 'bg-chart-4/10',
      change: '+15%',
    },
  ]

  // Simulated activity data for charts
  const activityData = useMemo(() => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    return days.map((day, i) => ({
      day,
      contenus: Math.floor(Math.random() * 8) + 1 + i,
      mots: Math.floor(Math.random() * 2000) + 500 + i * 200,
    }))
  }, [])

  const contentTypeData = useMemo(() => {
    const typeMap: Record<string, number> = {}
    contents.forEach((c) => {
      typeMap[c.type] = (typeMap[c.type] || 0) + 1
    })
    const colors = ['#2563eb', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444']
    const labels: Record<string, string> = {
      article: 'Articles', blog: 'Blogs', landing: 'Landing', product: 'Produits',
      'meta-title': 'Meta Title', 'meta-desc': 'Meta Desc', faq: 'FAQ',
      email: 'Emails', facebook: 'Facebook', instagram: 'Instagram',
      linkedin: 'LinkedIn', twitter: 'Twitter', youtube: 'YouTube', ad: 'Ads',
    }
    if (Object.keys(typeMap).length === 0) {
      return [
        { name: 'Articles', value: 12, color: colors[0] },
        { name: 'FAQ', value: 8, color: colors[2] },
        { name: 'Social', value: 15, color: colors[1] },
        { name: 'Emails', value: 5, color: colors[3] },
      ]
    }
    return Object.entries(typeMap).map(([type, count], i) => ({
      name: labels[type] || type,
      value: count,
      color: colors[i % colors.length],
    }))
  }, [contents])

  const recentContent = contents.slice(0, 5)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Bonjour, bienvenue 👋
        </h2>
        <p className="text-muted-foreground">
          Voici un aperçu de votre activité de création de contenu SEO.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {dashboardStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <ToolIcon name={stat.icon} className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-xs font-medium text-chart-5 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Activity chart */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Activité de la semaine</h3>
              <p className="text-sm text-muted-foreground">Contenus générés et mots produits</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorContenus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMots" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="day" className="text-xs" stroke="currentColor" />
              <YAxis className="text-xs" stroke="currentColor" />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '13px',
                }}
              />
              <Area type="monotone" dataKey="contenus" stroke="#2563eb" fillOpacity={1} fill="url(#colorContenus)" strokeWidth={2} />
              <Area type="monotone" dataKey="mots" stroke="#06b6d4" fillOpacity={1} fill="url(#colorMots)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* SEO Score + Content types */}
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Score SEO moyen</h3>
          <div className="flex flex-col items-center mb-4">
            <SEOScoreRing score={avgSeoScore || 78} size={130} />
            <p className="text-sm text-muted-foreground mt-2">
              {contents.length > 0 ? `Basé sur ${contents.length} contenu(s)` : 'Score de démonstration'}
            </p>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={contentTypeData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {contentTypeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '13px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {contentTypeData.slice(0, 4).map((entry) => (
              <div key={entry.name} className="flex items-center gap-1 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions + Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick actions */}
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Actions rapides</h3>
          <div className="space-y-2">
            {[
              { label: 'Nouveau chat IA', icon: 'MessageSquare', view: 'chat', desc: 'Discuter avec l\'IA' },
              { label: 'Générer un article', icon: 'FileText', view: 'tools', desc: 'Article SEO complet' },
              { label: 'Analyser un contenu', icon: 'Gauge', view: 'analysis', desc: 'Score SEO temps réel' },
              { label: 'Rechercher mots-clés', icon: 'Search', view: 'keywords', desc: 'Stratégie SEO' },
              { label: 'Réécrire un texte', icon: 'RefreshCw', view: 'rewrite', desc: 'Améliorer du contenu' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => setView(action.view as never)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors text-left group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:gradient-brand group-hover:text-white transition-all">
                  <ToolIcon name={action.icon} className="w-4.5 h-4.5 text-primary group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.desc}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </Card>

        {/* Recent content */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Contenu récent</h3>
            <Button variant="ghost" size="sm" onClick={() => setView('history')} className="gap-1">
              Voir tout <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </div>
          {recentContent.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">Aucun contenu généré pour l'instant</p>
              <Button size="sm" onClick={() => setView('tools')} className="gap-1.5">
                <Plus className="w-4 h-4" />
                Créer du contenu
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentContent.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
                  onClick={() => setView('history')}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <ToolIcon name="FileText" className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{content.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="capitalize">{content.type}</span>
                      <span>·</span>
                      <span>{content.wordCount} mots</span>
                      <span>·</span>
                      <Clock className="w-3 h-3" />
                      <span>{new Date(content.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-chart-5/10 text-chart-5 text-xs font-semibold">
                    {content.seoScore}
                  </div>
                  {content.isFavorite && <Star className="w-4 h-4 text-chart-4 fill-chart-4" />}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
