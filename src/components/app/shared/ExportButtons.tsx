'use client'

import { useState } from 'react'
import { Download, Copy, FileText, FileType2, FileCode, RefreshCw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

interface ExportButtonsProps {
  content: string
  title?: string
  onRegenerate?: () => void
  regenerating?: boolean
}

export function ExportButtons({ content, title = 'contenu', onRegenerate, regenerating }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success('Copié dans le presse-papiers')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Échec de la copie')
    }
  }

  const downloadFile = (format: 'txt' | 'md' | 'html' | 'doc') => {
    let blob: Blob | null = null
    let filename = `${title.replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'contenu'}`

    if (format === 'txt') {
      blob = new Blob([stripMarkdown(content)], { type: 'text/plain;charset=utf-8' })
      filename += '.txt'
    } else if (format === 'md') {
      blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
      filename += '.md'
    } else if (format === 'html') {
      blob = new Blob([markdownToHtml(content)], { type: 'text/html;charset=utf-8' })
      filename += '.html'
    } else if (format === 'doc') {
      // Simple DOC format (HTML with Word header)
      const docContent = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${markdownToHtml(content)}</body></html>`
      blob = new Blob(['\ufeff', docContent], { type: 'application/msword' })
      filename += '.doc'
    }

    if (!blob) {
      toast.error('Format d’export invalide')
      return
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Exporté en ${format.toUpperCase()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={copyToClipboard}
        className="gap-1.5"
      >
        {copied ? <Check className="w-4 h-4 text-chart-5" /> : <Copy className="w-4 h-4" />}
        <span className="hidden sm:inline">{copied ? 'Copié' : 'Copier'}</span>
      </Button>

      {onRegenerate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRegenerate}
          disabled={regenerating}
          className="gap-1.5"
        >
          <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{regenerating ? 'Génération...' : 'Régénérer'}</span>
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => downloadFile('md')} className="gap-2">
            <FileCode className="w-4 h-4" /> Markdown (.md)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => downloadFile('txt')} className="gap-2">
            <FileText className="w-4 h-4" /> Texte (.txt)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => downloadFile('html')} className="gap-2">
            <FileCode className="w-4 h-4" /> HTML (.html)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => downloadFile('doc')} className="gap-2">
            <FileType2 className="w-4 h-4" /> Word (.doc)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/!\[.*?\]\(.+?\)/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^\s*[-*+]\s/gm, '• ')
    .replace(/^\s*\d+\.\s/gm, '')
    .trim()
}

function markdownToHtml(md: string): string {
  let html = md
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, __, code) => `<pre><code>${escapeHtml(code)}</code></pre>`)
    // Headings
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    // Images
    .replace(/!\[(.*?)\]\((.+?)\)/g, '<img src="$2" alt="$1" />')
    // Lists
    .replace(/^\s*[-*+]\s(.+)$/gm, '<li>$1</li>')
    .replace(/^\s*\d+\.\s(.+)$/gm, '<li>$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hlpui])(.+)$/gm, '<p>$1</p>')

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>)(?:\s*<li>[\s\S]*?<\/li>)*/g, (match) => `<ul>${match}</ul>`)

  return `<div class="prose">${html}</div>`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
