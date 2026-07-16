'use client'

import { Sparkles, Twitter, Linkedin, Facebook, Instagram, Youtube } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function Footer() {
  const setAuthModal = useAppStore((s) => s.setAuthModal)

  const links = {
    Produit: [
      { label: 'Fonctionnalités', href: '#features' },
      { label: 'Templates', href: '#templates' },
      { label: 'Tarifs', href: '#pricing' },
      { label: 'Connexion', action: () => setAuthModal('login') },
    ],
    Ressources: [
      { label: 'Documentation', href: '#' },
      { label: 'Blog SEO', href: '#' },
      { label: 'Guides', href: '#' },
      { label: 'API', href: '#' },
    ],
    Entreprise: [
      { label: 'À propos', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Carrières', href: '#' },
      { label: 'Partenaires', href: '#' },
    ],
    Légal: [
      { label: 'Confidentialité', href: '#' },
      { label: 'Conditions', href: '#' },
      { label: 'Cookies', href: '#' },
      { label: 'RGPD', href: '#' },
    ],
  }

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="font-bold text-lg">
                SEO AI <span className="text-primary">Writer</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xs">
              Le meilleur assistant IA pour créer du contenu optimisé pour Google.
              Propulsé par Gemini 2.5 Flash. Fait au Bénin 🇧🇯
            </p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:gradient-brand hover:text-white transition-all"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    {item.action ? (
                      <button
                        onClick={item.action}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 SEO AI Writer. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-5 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-chart-5"></span>
            </span>
            Tous les systèmes opérationnels
          </div>
        </div>
      </div>
    </footer>
  )
}
