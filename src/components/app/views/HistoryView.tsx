'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { ToolIcon } from '@/components/landing/ToolIcon'
import { Markdown } from '@/components/app/shared/Markdown'
import { ExportButtons } from '@/components/app/shared/ExportButtons'
import { SEOScoreBadge } from '@/components/app/shared/SEOScoreRing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Search, Star, Trash2, Clock, FileText, Eye, ChevronLeft, ChevronRight,
  History as HistoryIcon, Filter,
} from 'lucide-react'
import { toast } from 'sonner'
import { TOOLS } from '@/lib/constants'

const PAGE_SIZE = 8

export function HistoryView() {
  const contents = useAppStore((s) => s.contents)
  const deleteContent = useAppStore((s) => s.deleteContent)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [favOnly, setFavOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = contents
    if (search) {
      list = list.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.content.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (typeFilter !== 'all') {
      list = list.filter((c) => c.type === typeFilter)
    }
    if (favOnly) {
      list = list.filter((c) => c.isFavorite)
    }
    return list
  }, [contents, search, typeFilter, favOnly])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const selectedContent = contents.find((c) => c.id === selected)

  const types = ['all', ...Array.from(new Set(contents.map((c) => c.type)))]

  const typeLabel = (type: string) => {
    const tool = TOOLS.find((t) => t.type === type)
    return tool?.name || type
  }
  const typeIcon = (type: string) => {
    const tool = TOOLS.find((t) => t.type === type)
    return tool?.icon || 'FileText'
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Historique</h2>
          <p className="text-muted-foreground">{contents.length} contenu(s) sauvegardé(s)</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans l'historique..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1) }}>
            <SelectTrigger className="sm:w-48">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {types.map((t) => (
                <SelectItem key={t} value={t}>
                  {t === 'all' ? 'Tous les types' : typeLabel(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={favOnly ? 'default' : 'outline'}
            onClick={() => { setFavOnly(!favOnly); setPage(1) }}
            className="gap-1.5"
          >
            <Star className={`w-4 h-4 ${favOnly ? 'fill-current' : ''}`} />
            Favoris
          </Button>
        </div>
      </Card>

      {/* Content grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4">
            <HistoryIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">Aucun contenu trouvé</h3>
          <p className="text-sm text-muted-foreground">
            {contents.length === 0
              ? 'Générez du contenu pour le retrouver ici.'
              : 'Aucun résultat ne correspond à vos filtres.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map((content) => (
              <motion.div
                key={content.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="p-4 hover:shadow-card-hover transition-all cursor-pointer h-full flex flex-col" >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <ToolIcon name={typeIcon(content.type)} className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(content.id) }}
                        className="p-1 rounded hover:bg-muted transition-colors"
                      >
                        <Star className={`w-4 h-4 ${content.isFavorite ? 'text-chart-4 fill-chart-4' : 'text-muted-foreground'}`} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteContent(content.id); toast.success('Supprimé') }}
                        className="p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div onClick={() => setSelected(content.id)} className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                        {typeLabel(content.type)}
                      </span>
                      {content.keyword && (
                        <span className="text-xs text-muted-foreground">· {content.keyword}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-1">{content.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
                      {content.content.replace(/[#*`]/g, '').slice(0, 120)}...
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <SEOScoreBadge score={content.seoScore} />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{content.wordCount} mots</span>
                      <span>·</span>
                      <Clock className="w-3 h-3" />
                      <span>{new Date(content.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setPage(i + 1)}
                  className="w-9 h-9"
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl border shadow-xl max-w-3xl w-full max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <ToolIcon name={typeIcon(selectedContent.type)} className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{selectedContent.title}</h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      {typeLabel(selectedContent.type)} · {selectedContent.wordCount} mots · {selectedContent.language}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
                  <Eye className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <div className="flex items-center gap-2 mb-4">
                  <SEOScoreBadge score={selectedContent.seoScore} />
                  <span className="text-xs text-muted-foreground">
                    {new Date(selectedContent.createdAt).toLocaleString('fr-FR')}
                  </span>
                </div>
                <Markdown content={selectedContent.content} />
              </div>

              <div className="flex items-center justify-between p-5 border-t">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  {selectedContent.wordCount} mots générés
                </div>
                <ExportButtons content={selectedContent.content} title={selectedContent.title} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
