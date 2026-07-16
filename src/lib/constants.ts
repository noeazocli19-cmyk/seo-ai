/**
 * App constants: tools, templates, navigation, testimonials, FAQ.
 */
import type { Tool } from './types'

export const TOOLS: Tool[] = [
  { id: 'article', type: 'article', name: 'Article SEO', description: 'Article complet optimisé pour Google', icon: 'FileText', category: 'seo' },
  { id: 'blog', type: 'blog', name: 'Article de Blog', description: 'Article de blog engageant et SEO', icon: 'Newspaper', category: 'seo' },
  { id: 'landing', type: 'landing', name: 'Landing Page', description: 'Page de conversion optimisée', icon: 'LayoutTemplate', category: 'seo' },
  { id: 'product', type: 'product', name: 'Description Produit', description: 'Description e-commerce qui vend', icon: 'ShoppingBag', category: 'seo' },
  { id: 'meta-title', type: 'meta-title', name: 'Meta Title', description: 'Titres optimisés (50-60 chars)', icon: 'Heading', category: 'seo' },
  { id: 'meta-desc', type: 'meta-desc', name: 'Meta Description', description: 'Descriptions (150-160 chars)', icon: 'AlignLeft', category: 'seo' },
  { id: 'slug', type: 'slug', name: 'Slug SEO', description: 'URLs optimisées et lisibles', icon: 'Link', category: 'seo' },
  { id: 'faq', type: 'faq', name: 'FAQ', description: 'FAQ optimisée Featured Snippets', icon: 'HelpCircle', category: 'seo' },
  { id: 'email', type: 'email', name: 'Email Marketing', description: 'Emails qui convertissent', icon: 'Mail', category: 'email' },
  { id: 'facebook', type: 'facebook', name: 'Facebook', description: 'Publications Facebook engageantes', icon: 'Facebook', category: 'social' },
  { id: 'instagram', type: 'instagram', name: 'Instagram', description: 'Posts Instagram avec hashtags', icon: 'Instagram', category: 'social' },
  { id: 'linkedin', type: 'linkedin', name: 'LinkedIn', description: 'Posts professionnels LinkedIn', icon: 'Linkedin', category: 'social' },
  { id: 'twitter', type: 'twitter', name: 'X (Twitter)', description: 'Tweets percutants (< 280 chars)', icon: 'Twitter', category: 'social' },
  { id: 'youtube', type: 'youtube', name: 'YouTube', description: 'Descriptions YouTube optimisées', icon: 'Youtube', category: 'social' },
  { id: 'ad', type: 'ad', name: 'Google Ads', description: 'Annonces Google Ads optimisées', icon: 'Megaphone', category: 'ad', premium: true },
]

export const TONES = [
  { value: 'professionnel', label: 'Professionnel' },
  { value: 'convivial', label: 'Convivial' },
  { value: 'persuasif', label: 'Persuasif' },
  { value: 'informatif', label: 'Informatif' },
  { value: 'humoristique', label: 'Humoristique' },
  { value: 'inspirant', label: 'Inspirant' },
  { value: 'technique', label: 'Technique' },
  { value: 'autoritaire', label: 'Autoritaire' },
]

export const LANGUAGES = [
  { value: 'français', label: 'Français' },
  { value: 'anglais', label: 'Anglais' },
  { value: 'espagnol', label: 'Espagnol' },
  { value: 'allemand', label: 'Allemand' },
  { value: 'italien', label: 'Italien' },
  { value: 'portugais', label: 'Portugais' },
  { value: 'néerlandais', label: 'Néerlandais' },
]

export const LENGTHS = [
  { value: 'court', label: 'Court (~300 mots)' },
  { value: 'moyen', label: 'Moyen (~600 mots)' },
  { value: 'long', label: 'Long (~1200 mots)' },
  { value: 'très long', label: 'Très long (~2000 mots)' },
]

export const REWRITE_OPERATIONS = [
  { value: 'rewrite', label: 'Réécrire', icon: 'RefreshCw', description: 'Réécrire avec un style amélioré' },
  { value: 'correct', label: 'Corriger', icon: 'CheckCheck', description: 'Corriger fautes et syntaxe' },
  { value: 'summarize', label: 'Résumer', icon: 'Minimize2', description: 'Résumer en gardant l\'essentiel' },
  { value: 'expand', label: 'Développer', icon: 'Maximize2', description: 'Enrichir et détailler' },
  { value: 'simplify', label: 'Simplifier', icon: 'Feather', description: 'Simplifier pour tout le monde' },
  { value: 'professionalize', label: 'Professionnaliser', icon: 'Briefcase', description: 'Rendre plus formel' },
  { value: 'humanize', label: 'Humaniser', icon: 'Smile', description: 'Rendre plus naturel et humain' },
  { value: 'seo', label: 'Optimiser SEO', icon: 'Search', description: 'Optimiser pour le référencement' },
]

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'chat', label: 'Chat IA', icon: 'MessageSquare' },
  { id: 'tools', label: 'Outils SEO', icon: 'Wand2' },
  { id: 'analysis', label: 'Analyse SEO', icon: 'Gauge' },
  { id: 'keywords', label: 'Mots-clés', icon: 'Search' },
  { id: 'rewrite', label: 'Réécriture', icon: 'RefreshCw' },
  { id: 'history', label: 'Historique', icon: 'History' },
  { id: 'settings', label: 'Paramètres', icon: 'Settings' },
] as const

export const TESTIMONIALS = [
  {
    name: 'Koffi Adjoua',
    role: 'Responsable SEO, Agence Digital Cotonou',
    avatar: 'KA',
    content: 'SEO AI Writer a transformé notre production de contenu. Nous avons gagné 15h par semaine et nos articles rankent en première page Google. Un outil indispensable pour les agences au Bénin.',
    rating: 5,
  },
  {
    name: 'Mariam Touré',
    role: 'Freelance SEO, Porto-Novo',
    avatar: 'MT',
    content: 'L\'analyse SEO en temps réel est bluffante. Le score et les suggestions m\'aident à optimiser chaque article avant publication. Mes clients sont ravis.',
    rating: 5,
  },
  {
    name: 'Emmanuel Hounkpatin',
    role: 'Content Manager, Startup Parakou',
    avatar: 'EH',
    content: 'Le chat IA est incroyablement pertinent. C\'est comme avoir un expert SEO disponible 24/7. Indispensable pour toute équipe content.',
    rating: 5,
  },
  {
    name: 'Bénédicte Akpovi',
    role: 'Fondatrice, E-commerce Cotonou',
    avatar: 'BA',
    content: 'Les descriptions produits générées ont boosté notre taux de conversion de 32%. L\'investissement rentabilisé dès le premier mois en FCFA.',
    rating: 5,
  },
  {
    name: 'Ibrahim Sourou',
    role: 'Marketing Manager, Abomey-Calavi',
    avatar: 'IS',
    content: 'La génération multicanal (réseaux sociaux, email, ads) dans une seule plateforme nous fait gagner un temps fou. Outil incontournable.',
    rating: 5,
  },
  {
    name: 'Rachelle Dossou',
    role: 'Consultante SEO Senior, Cotonou',
    avatar: 'RD',
    content: 'La recherche de mots-clés avec intentions et longue traîne rivalise avec les meilleurs outils du marché. Un vrai game-changer pour le marché ouest-africain.',
    rating: 5,
  },
]

export const FAQ_ITEMS = [
  {
    question: 'Qu\'est-ce que SEO AI Writer ?',
    answer: 'SEO AI Writer est un SaaS IA propulsé par Gemini 2.5 Flash qui permet de générer, optimiser et analyser du contenu SEO de qualité professionnelle. Il combine chat IA, génération de contenu multicanal et analyse SEO en temps réel.',
  },
  {
    question: 'Comment fonctionne l\'IA ?',
    answer: 'Notre IA utilise Google Gemini 2.5 Flash, l\'un des modèles les plus avancés au monde. Elle a été spécialisée avec des prompts SEO expert pour produire du contenu optimisé pour le référencement Google.',
  },
  {
    question: 'Quels types de contenu puis-je générer ?',
    answer: 'Articles SEO, landing pages, descriptions produits, meta titles/descriptions, slugs, FAQ, publications pour Facebook/Instagram/LinkedIn/Twitter/YouTube, emails marketing et annonces Google Ads.',
  },
  {
    question: 'L\'analyse SEO est-elle en temps réel ?',
    answer: 'Oui. Après chaque génération, l\'analyse SEO calcule instantanément le score sur 100, la lisibilité, la densité de mots-clés, l\'analyse E-E-A-T, la structure et des recommandations d\'amélioration.',
  },
  {
    question: 'Mes données sont-elles sauvegardées ?',
    answer: 'Absolument. Toutes vos conversations, contenus générés et favoris sont sauvegardés dans votre historique personnel. Vous pouvez les rechercher, filtrer et exporter à tout moment.',
  },
  {
    question: 'Puis-je utiliser l\'outil en plusieurs langues ?',
    answer: 'Oui, SEO AI Writer supporte la génération multilingue : français, anglais, espagnol, allemand, italien, portugais et néerlandais. Idéal pour une stratégie SEO internationale.',
  },
  {
    question: 'Comment exporter mon contenu ?',
    answer: 'Chaque contenu peut être exporté en PDF, DOCX, Markdown ou TXT. Vous pouvez aussi copier directement dans le presse-papiers ou régénérer une nouvelle version.',
  },
  {
    question: 'Y a-t-il une version gratuite ?',
    answer: 'Oui, le plan gratuit inclut le chat IA, la génération de contenu de base et l\'analyse SEO. Les fonctionnalités premium (Google Ads, export avancé, volume illimité) sont disponibles dans les plans supérieurs.',
  },
]

export const STATS_HIGHLIGHTS = [
  { value: '15K+', label: 'Utilisateurs actifs' },
  { value: '2.5M+', label: 'Contenus générés' },
  { value: '95%', label: 'Score Lighthouse' },
  { value: '4.9/5', label: 'Satisfaction client' },
]

export const PRICING_PLANS = [
  {
    name: 'Découverte',
    price: '0',
    currency: 'FCFA',
    period: '/mois',
    description: 'Pour découvrir la puissance de l\'IA SEO',
    features: [
      '20 générations par mois',
      'Chat IA basique',
      'Analyse SEO temps réel',
      '3 langues supportées',
      'Export Markdown & TXT',
    ],
    cta: 'Commencer gratuitement',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '15 000',
    currency: 'FCFA',
    period: '/mois',
    description: 'Pour les créateurs et freelances',
    features: [
      'Générations illimitées',
      'Chat IA streaming avancé',
      '15+ outils SEO complets',
      'Recherche de mots-clés IA',
      'Réécriture intelligente',
      '7 langues supportées',
      'Export PDF, DOCX, MD, TXT',
      'Historique & favoris illimités',
      'Support prioritaire',
    ],
    cta: 'Choisir Pro',
    highlight: true,
  },
  {
    name: 'Entreprise',
    price: '50 000',
    currency: 'FCFA',
    period: '/mois',
    description: 'Pour les agences et équipes marketing',
    features: [
      'Tout du plan Pro',
      'Google Ads & Email Marketing',
      'Multi-utilisateurs (5 sièges)',
      'API & Webhooks',
      'Templates personnalisés',
      'Marque blanche',
      'Account manager dédié',
      'Formation équipe incluse',
    ],
    cta: 'Contacter l\'équipe',
    highlight: false,
  },
]

export const FEATURES = [
  {
    icon: 'MessageSquare',
    title: 'Chat IA SEO Expert',
    description: 'Discutez avec un assistant IA spécialisé SEO. Streaming en temps réel, markdown, historique complet et recherche de conversations.',
  },
  {
    icon: 'Wand2',
    title: 'Génération multicanal',
    description: '15+ outils : articles, landing pages, descriptions produits, méta-données, FAQ, réseaux sociaux, emails marketing et Google Ads.',
  },
  {
    icon: 'Gauge',
    title: 'Analyse SEO temps réel',
    description: 'Score SEO sur 100, lisibilité, densité de mots-clés, analyse E-E-A-T, structure et recommandations d\'amélioration automatiques.',
  },
  {
    icon: 'Search',
    title: 'Recherche de mots-clés',
    description: 'Générez mots-clés secondaires, longue traîne, intentions de recherche, questions fréquentes et idées d\'articles en un clic.',
  },
  {
    icon: 'RefreshCw',
    title: 'Réécriture intelligente',
    description: 'Réécrivez, corrigez, résumez, développez, simplifiez, professionnalisez, humanisez ou optimisez SEO votre contenu existant.',
  },
  {
    icon: 'History',
    title: 'Historique & Favoris',
    description: 'Toutes vos conversations et contenus sont sauvegardés. Recherche, filtres, pagination et système de favoris intégrés.',
  },
  {
    icon: 'Download',
    title: 'Export multi-format',
    description: 'Exportez en PDF, DOCX, Markdown ou TXT. Copiez dans le presse-papiers ou régénérez une nouvelle version en un clic.',
  },
  {
    icon: 'Moon',
    title: 'Mode sombre & Premium',
    description: 'Interface élégante en mode clair/sombre, command palette (Ctrl+K), animations fluides et design digne des meilleurs SaaS.',
  },
]

export const HOW_IT_WORKS = [
  {
    step: '01',
    icon: 'MessageSquare',
    title: 'Décrivez votre besoin',
    description: 'Choisissez un outil ou discutez avec le chat IA. Indiquez votre mot-clé, votre ton et votre audience cible.',
  },
  {
    step: '02',
    icon: 'Sparkles',
    title: 'L\'IA génère le contenu',
    description: 'Gemini 2.5 Flash produit un contenu optimisé SEO, structuré en markdown, prêt à publier en quelques secondes.',
  },
  {
    step: '03',
    icon: 'Gauge',
    title: 'Analysez le score SEO',
    description: 'L\'analyse automatique calcule le score, la lisibilité, les mots-clés et vous donne des recommandations.',
  },
  {
    step: '04',
    icon: 'Download',
    title: 'Exportez & publiez',
    description: 'Exportez en PDF, DOCX, Markdown ou TXT. Copiez ou régénérez. Le contenu est sauvegardé dans votre historique.',
  },
]
