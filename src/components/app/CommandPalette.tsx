'use client'

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { NAV_ITEMS, TOOLS } from '@/lib/constants'
import { useAppStore } from '@/lib/store'
import { ToolIcon } from '@/components/landing/ToolIcon'
import { useRouter } from 'next/navigation'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const setView = useAppStore((s) => s.setView)

  const go = (view: string) => {
    setView(view as never)
    onOpenChange(false)
  }

  const goTool = (toolType: string) => {
    setView('tools')
    // Store selected tool in localStorage for tools view to pick up
    localStorage.setItem('selected-tool', toolType)
    setTimeout(() => localStorage.removeItem('selected-tool'), 1000)
    onOpenChange(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Rechercher une action, un outil..." />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {NAV_ITEMS.map((item) => (
            <CommandItem key={item.id} onSelect={() => go(item.id)} className="gap-2">
              <ToolIcon name={item.icon} className="w-4 h-4 text-muted-foreground" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Outils SEO">
          {TOOLS.map((tool) => (
            <CommandItem key={tool.id} onSelect={() => goTool(tool.type)} className="gap-2">
              <ToolIcon name={tool.icon} className="w-4 h-4 text-muted-foreground" />
              <span>{tool.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{tool.description}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions rapides">
          <CommandItem onSelect={() => go('chat')} className="gap-2">
            <ToolIcon name="Plus" className="w-4 h-4 text-muted-foreground" />
            <span>Nouvelle conversation IA</span>
          </CommandItem>
          <CommandItem onSelect={() => go('tools')} className="gap-2">
            <ToolIcon name="Wand2" className="w-4 h-4 text-muted-foreground" />
            <span>Générer du contenu SEO</span>
          </CommandItem>
          <CommandItem onSelect={() => go('analysis')} className="gap-2">
            <ToolIcon name="Gauge" className="w-4 h-4 text-muted-foreground" />
            <span>Analyser un contenu SEO</span>
          </CommandItem>
          <CommandItem onSelect={() => go('keywords')} className="gap-2">
            <ToolIcon name="Search" className="w-4 h-4 text-muted-foreground" />
            <span>Rechercher des mots-clés</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
