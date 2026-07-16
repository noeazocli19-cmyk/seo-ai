'use client'

import { motion } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Veuillez entrer un email valide')
      return
    }
    setSubmitted(true)
    toast.success('Inscription réussie ! Bienvenue dans la communauté SEO AI Writer.')
    setEmail('')
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl gradient-brand p-8 sm:p-12 text-center text-white shadow-glow"
        >
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
              <Mail className="w-4 h-4" />
              Newsletter
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Recevez les meilleures astuces SEO
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Conseils SEO, nouveautés produit et prompts exclusifs. Rejoignez 15 000+ marketers.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-6 py-3 rounded-xl"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Merci ! Vous êtes inscrit.</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-12"
                />
                <Button type="submit" size="lg" variant="secondary" className="h-12 gap-2 whitespace-nowrap">
                  S'inscrire <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}

            <p className="text-white/70 text-xs mt-4">
              Pas de spam. Désinscription en un clic.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
