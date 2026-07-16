'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles, ArrowRight } from 'lucide-react'
import { PRICING_PLANS } from '@/lib/constants'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function Pricing() {
  const setAuthModal = useAppStore((s) => s.setAuthModal)

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Tarifs
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Des prix adaptés au marché béninois
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Commencez gratuitement. Passez à un plan supérieur quand vous êtes prêt. Prix en FCFA, sans engagement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card
                className={`p-6 h-full flex flex-col relative ${
                  plan.highlight ? 'ring-2 ring-primary shadow-glow' : ''
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full gradient-brand text-white text-xs font-semibold">
                      <Sparkles className="w-3 h-3" /> Populaire
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                    <span className="text-lg text-muted-foreground font-medium">{plan.currency}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <Button
                  variant={plan.highlight ? 'default' : 'outline'}
                  className="w-full gap-2 mb-6"
                  onClick={() => setAuthModal(plan.price === '0' ? 'register' : 'register')}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <div className="shrink-0 w-5 h-5 rounded-full bg-chart-5/10 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-chart-5" />
                      </div>
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Paiement Mobile Money (MTN, Moov) ou carte bancaire · Facturation mensuelle · Annulez à tout moment
        </p>
      </div>
    </section>
  )
}
