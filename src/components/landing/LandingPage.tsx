'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Sparkles, ArrowRight, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import {
  FEATURES,
  HOW_IT_WORKS,
  TESTIMONIALS,
  FAQ_ITEMS,
  STATS_HIGHLIGHTS,
  TOOLS,
} from '@/lib/constants'
import { FAQ } from './FAQ'
import { Newsletter } from './Newsletter'
import { Footer } from './Footer'
import { Pricing } from './Pricing'
import { ToolIcon } from './ToolIcon'

export function LandingPage() {
  const setView = useAppStore((s) => s.setView)
  const setAuthModal = useAppStore((s) => s.setAuthModal)
  const [mobileOpen, setMobileOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  const launchApp = () => {
    setAuthModal('register')
  }

  const openLogin = () => {
    setAuthModal('login')
  }

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 glass border-b">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="font-bold text-lg tracking-tight">
              SEO AI <span className="text-primary">Writer</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Fonctionnalités
            </a>
            <a href="#how" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Comment ça marche
            </a>
            <a href="#templates" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Templates
            </a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Avis
            </a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={openLogin}>
              Connexion
            </Button>
            <Button size="sm" onClick={launchApp} className="gap-1.5">
              S'inscrire <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden border-t glass"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              <a href="#features" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">Fonctionnalités</a>
              <a href="#how" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">Comment ça marche</a>
              <a href="#templates" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">Templates</a>
              <a href="#testimonials" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">Avis</a>
              <a href="#faq" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">FAQ</a>
              <Button onClick={launchApp} className="w-full gap-1.5">
                S'inscrire gratuitement <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-chart-3/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border text-sm font-medium mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Propulsé par Gemini 2.5 Flash
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            Créez du contenu
            <br />
            <span className="gradient-text animate-gradient">optimisé pour Google</span>
            <br />
            avec l'IA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Le meilleur assistant IA pour générer, optimiser et analyser votre contenu SEO.
            Articles, méta-données, FAQ, réseaux sociaux — tout en un, en quelques secondes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" onClick={launchApp} className="gap-2 text-base h-12 px-8 shadow-glow">
              <Sparkles className="w-5 h-5" />
              Commencer gratuitement
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })} className="gap-2 text-base h-12 px-8">
              Voir la démo
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-4 text-sm text-muted-foreground"
          >
            Aucune carte requise · 15+ outils IA · Analyse SEO en temps réel
          </motion.p>
        </motion.div>

        {/* Hero stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS_HIGHLIGHTS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className="glass rounded-2xl p-4 text-center"
              >
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Fonctionnalités"
            title="Tout ce qu'il faut pour dominer Google"
            description="Une suite complète d'outils IA pour créer, optimiser et analyser votre contenu SEO."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
                className="group relative glass rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:gradient-brand group-hover:text-white transition-all duration-300">
                  <ToolIcon name={feature.icon} className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-20 sm:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Pourquoi SEO AI Writer ?
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                La plateforme IA la plus complète pour le <span className="gradient-text">SEO de contenu</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Contrairement aux outils génériques, SEO AI Writer est spécialisé dans le référencement.
                Chaque génération est optimisée selon les meilleures pratiques Google.
              </p>

              <div className="space-y-4">
                {[
                  { title: 'Spécialisé SEO', desc: 'Prompts expert conçus par des consultants SEO senior' },
                  { title: 'Analyse en temps réel', desc: 'Score SEO, lisibilité, E-E-A-T calculés instantanément' },
                  { title: 'Multicanal', desc: 'Articles, réseaux sociaux, emails, ads — un seul outil' },
                  { title: 'Multilingue', desc: '7 langues supportées pour une stratégie internationale' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="shrink-0 w-6 h-6 rounded-full gradient-brand flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="glass rounded-2xl p-6 shadow-card-hover">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-muted-foreground font-mono">analyse-seo.ts</span>
                </div>
                <div className="font-mono text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Score SEO:</span>
                    <span className="text-primary font-bold">94/100</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full gradient-brand rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Lisibilité:</span><span className="text-chart-5 font-bold">88/100</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Mots:</span><span className="text-foreground">1,247</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Densité mot-clé:</span><span className="text-chart-5">1.8%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">H2 / H3:</span><span className="text-foreground">5 / 3</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">E-E-A-T:</span><span className="text-primary font-bold">Excellent</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Temps lecture:</span><span className="text-foreground">6 min</span></div>
                  <div className="pt-2 border-t mt-3">
                    <div className="text-xs text-chart-5">✓ 8 recommandations SEO appliquées</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 gradient-brand rounded-2xl rotate-12 animate-float opacity-80 blur-sm" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-chart-3/30 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Comment ça marche"
            title="Du brief au contenu optimisé en 4 étapes"
            description="Un workflow simple et puissant pour produire du contenu SEO de qualité."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative"
              >
                <div className="text-5xl font-bold text-primary/10 absolute -top-4 -left-2">{step.step}</div>
                <div className="relative glass rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center mb-4 shadow-glow">
                    <ToolIcon name={step.icon} className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-20 sm:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Templates IA"
            title="15+ outils de génération de contenu"
            description="Des templates optimisés pour chaque besoin marketing et SEO."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-14">
            {TOOLS.map((tool, i) => (
              <motion.button
                key={tool.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 5) * 0.08 }}
                onClick={launchApp}
                className="group glass rounded-xl p-4 text-left hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:gradient-brand transition-all">
                  <ToolIcon name={tool.icon} className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="font-semibold text-sm mb-1">{tool.name}</div>
                <div className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{tool.description}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Avis clients"
            title="Ils dominent Google avec SEO AI Writer"
            description="Plus de 15 000 professionnels du contenu nous font confiance."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="glass rounded-2xl p-6 flex flex-col"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed flex-1 mb-5">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-semibold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <Pricing />

      {/* FAQ */}
      <FAQ items={FAQ_ITEMS} />

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  )
}

function SectionHeader({ badge, title, description }: { badge: string; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-2xl mx-auto"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
        {badge}
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{title}</h2>
      <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  )
}
