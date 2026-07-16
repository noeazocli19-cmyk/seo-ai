# SEO AI Writer — Structure complète du projet

> **SaaS d'écriture SEO propulsé par IA** — Next.js 16, Better Auth, Resend, Neon PostgreSQL, Gemini 2.5 Flash.
> Conçu et développé au Bénin 🇧🇯 (Cotonou).

---

## 📁 Arborescence complète

```
seo-ai-writer/
├── .env.example                   # Variables d'environnement (modèle à copier vers .env)
├── .gitignore                     # Fichiers ignorés par Git
├── Caddyfile                      # Configuration du gateway Caddy (reverse proxy)
├── README.md                      # Documentation principale (installation, déploiement)
├── PROJECT_STRUCTURE.md           # CE FICHIER — arborescence détaillée
├── bun.lock                       # Lockfile Bun (versions exactes des dépendances)
├── components.json                # Config shadcn/ui (style New York, alias @/components)
├── eslint.config.mjs              # Configuration ESLint (Next.js + TypeScript)
├── next.config.ts                 # Configuration Next.js 16
├── package.json                   # Dépendances et scripts npm
├── postcss.config.mjs             # PostCSS (Tailwind v4)
├── tailwind.config.ts             # Tailwind CSS v4 (extensions de thème)
├── tsconfig.json                  # Configuration TypeScript (paths @/*, strict)
│
├── db/                            # Base de données SQLite (développement local)
│   └── .gitkeep                   # Le fichier custom.db est créé par prisma db:push
│
├── mini-services/                 # Services additionnels (websocket, etc.)
│   └── README.md                  # Instructions pour créer des mini-services
│
├── prisma/                        # Schéma Prisma ORM
│   ├── schema.prisma              # Schéma principal (SQLite sandbox + commentaires Neon)
│   └── schema.neon.prisma         # Variante PostgreSQL pour Neon (production)
│
├── public/                        # Assets statiques servis tels quels
│   ├── logo.svg                   # Logo SEO AI Writer
│   └── robots.txt                 # Directives pour les crawlers SEO
│
└── src/                           # Code source de l'application
    │
    ├── app/                       # App Router Next.js 16
    │   │
    │   ├── globals.css            # Design system : variables CSS, glassmorphism,
    │   │                          #   animations, markdown prose, scrollbar custom
    │   ├── layout.tsx             # Layout racine : fonts Geist, dark mode script,
    │   │                          #   Toaster + SonnerToaster, metadata SEO
    │   ├── page.tsx               # Route unique "/" : gate d'auth, landing/app shell,
    │   │                          #   détection du token de reset password, AuthModal
    │   │
    │   └── api/                   # API Routes (Route Handlers)
    │       ├── route.ts           # GET / — health check
    │       ├── auth/[...all]/route.ts   # Better Auth catch-all (sign-in, sign-up,
    │       │                            #   sign-out, reset-password, get-session)
    │       ├── chat/route.ts      # POST /api/chat — streaming chat IA (SSE)
    │       ├── generate/route.ts  # POST /api/generate — génération streaming + SEO
    │       ├── analyze/route.ts   # POST /api/analyze — analyse SEO déterministe
    │       ├── keywords/route.ts  # POST /api/keywords — recherche de mots-clés IA
    │       └── rewrite/route.ts   # POST /api/rewrite — réécriture (8 opérations)
    │
    ├── components/                # Composants React
    │   │
    │   ├── auth/
    │   │   └── AuthModal.tsx      # Modale d'auth unifiée (login, register, forgot,
    │   │                          #   reset) avec champ téléphone Bénin +229
    │   │
    │   ├── landing/               # Sections de la landing page
    │   │   ├── LandingPage.tsx    # Page d'accueil complète (navbar, hero, stats,
    │   │   │                      #   features, why-choose, how-it-works, templates,
    │   │   │                      #   testimonials, FAQ, newsletter, footer)
    │   │   ├── FAQ.tsx            # Accordion FAQ (8 questions)
    │   │   ├── Footer.tsx         # Footer avec liens, social, "Fait au Bénin"
    │   │   ├── Newsletter.tsx     # CTA newsletter avec input email
    │   │   ├── Pricing.tsx        # 3 plans en FCFA (Gratuit, Pro 15 000, Entreprise)
    │   │   └── ToolIcon.tsx       # Résolveur d'icône Lucide dynamique par nom
    │   │
    │   ├── app/                   # Shell de l'application (après login)
    │   │   ├── AppShell.tsx       # Layout app : sidebar, topbar, Cmd+K, routing views
    │   │   ├── CommandPalette.tsx # Palette de commandes Ctrl+K (navigation + outils)
    │   │   │
    │   │   ├── shared/            # Composants partagés entre les vues
    │   │   │   ├── ExportButtons.tsx  # Export MD/TXT/HTML/DOC + copier + régénérer
    │   │   │   ├── Markdown.tsx       # Renderer markdown (react-markdown + composants)
    │   │   │   └── SEOScoreRing.tsx   # Anneau SVG animé + SEOScoreBadge
    │   │   │
    │   │   └── views/             # 8 vues principales de l'app
    │   │       ├── DashboardView.tsx  # Tableau de bord (stats, charts Recharts,
    │   │       │                       #   actions rapides, contenu récent)
    │   │       ├── ChatView.tsx       # Chat IA streaming (sidebar conversations,
    │   │       │                       #   pin/rename/delete, suggestions, export)
    │   │       ├── ToolsView.tsx      # 15 outils SEO (catégories, params, génération
    │   │       │                       #   streaming, score SEO, recommandations)
    │   │       ├── AnalysisView.tsx   # Analyse SEO temps réel (debounce 600ms, score,
    │   │       │                       #   E-E-A-T, lisibilité, suggestions)
    │   │       ├── KeywordsView.tsx   # Recherche mots-clés IA (intent, difficulté,
    │   │       │                       #   volume, secondaires, long-tail, questions)
    │   │       ├── RewriteView.tsx    # Réécriture (8 opérations, comparaison
    │   │       │                       #   avant/après avec diff de score)
    │   │       ├── HistoryView.tsx    # Historique (recherche, filtres, favoris,
    │   │       │                       #   pagination 8/page, modal détail)
    │   │       └── SettingsView.tsx   # Paramètres (profil, thème, langue, ton,
    │   │                               #   notifications, export/delete data, logout)
    │   │
    │   └── ui/                    # shadcn/ui (50+ composants New York style)
    │       ├── accordion.tsx          ├── dialog.tsx          ├── pagination.tsx
    │       ├── alert-dialog.tsx       ├── drawer.tsx          ├── popover.tsx
    │       ├── alert.tsx              ├── dropdown-menu.tsx   ├── progress.tsx
    │       ├── aspect-ratio.tsx       ├── form.tsx            ├── radio-group.tsx
    │       ├── avatar.tsx             ├── hover-card.tsx      ├── resizable.tsx
    │       ├── badge.tsx              ├── input-otp.tsx       ├── scroll-area.tsx
    │       ├── breadcrumb.tsx         ├── input.tsx           ├── select.tsx
    │       ├── button.tsx             ├── label.tsx           ├── separator.tsx
    │       ├── calendar.tsx           ├── menubar.tsx         ├── sheet.tsx
    │       ├── card.tsx               ├── navigation-menu.tsx ├── sidebar.tsx
    │       ├── carousel.tsx           ├── slider.tsx          ├── skeleton.tsx
    │       ├── chart.tsx              ├── sonner.tsx          ├── switch.tsx
    │       ├── checkbox.tsx           ├── table.tsx           ├── tabs.tsx
    │       ├── collapsible.tsx        ├── textarea.tsx        ├── toast.tsx
    │       ├── command.tsx            ├── toaster.tsx         ├── toggle-group.tsx
    │       ├── context-menu.tsx       ├── toggle.tsx          └── tooltip.tsx
    │
    ├── hooks/                     # Hooks React personnalisés
    │   ├── use-auth.ts            # useAuth() : sync Better Auth session ↔ Zustand
    │   ├── use-mobile.ts          # useIsMobile() (breakpoint detection)
    │   └── use-toast.ts           # Wrapper shadcn pour useToast()
    │
    └── lib/                       # Logique métier et utilitaires
        ├── auth.ts                # Better Auth server config (Prisma adapter,
        │                          #   email/password, reset, sessions 7j, rate limit)
        ├── auth-client.ts         # Better Auth client SDK (signIn, signUp, signOut,
        │                          #   requestPasswordReset, resetPassword, useSession,
        │                          #   getServerSession)
        ├── db.ts                  # Instance Prisma Client singleton
        ├── email.ts               # Resend : welcome, password reset, newsletter
        │                          #   (fallback console en dev sans API key)
        ├── seo.ts                 # Moteur d'analyse SEO déterministe (score, E-E-A-T,
        │                          #   lisibilité Flesch, densité mot-clé, suggestions)
        ├── store.ts               # Zustand store (view, auth, theme, conversations,
        │                          #   messages, contents, stats, authModal, resetToken)
        ├── types.ts               # Types TypeScript (ViewType, Tool, ChatMessageData,
        │                          #   ConversationData, ContentRecord, KeywordResult,
        │                          #   DashboardStats, ActivityItem, SEOAnalysis)
        ├── constants.ts           # Constantes app (TOOLS[15], TONES, LANGUAGES,
        │                          #   LENGTHS, REWRITE_OPERATIONS, NAV_ITEMS,
        │                          #   TESTIMONIALS, FAQ_ITEMS, STATS_HIGHLIGHTS,
        │                          #   FEATURES, HOW_IT_WORKS)
        ├── utils.ts               # cn() (clsx + tailwind-merge)
        ├── ai/
        │   └── client.ts          # Abstraction z-ai-web-dev-sdk (Gemini 2.5 Flash) :
        │                          #   getAIClient(), generateCompletion(),
        │                          #   generateJSON()
        └── prompts/
            └── index.ts           # Bibliothèque de prompts (chat, article, meta,
                                  #   slug, faq, social, email, product, landing, ad,
                                  #   rewrite, keywords) + builders
```

---

## 📊 Statistiques du projet

| Métrique | Valeur |
|---|---|
| **Total fichiers source** | ~110 |
| **Composants React** | 65+ |
| **Composants shadcn/ui** | 50+ |
| **Vues applicatives** | 8 |
| **Routes API** | 7 |
| **Outils SEO** | 15 |
| **Modèles Prisma** | 12 |
| **Templates email** | 3 |
| **Langues UI** | Français (FR) |

---

## 🧱 Stack technique

### Frontend
- **Next.js 16.1+** (App Router, Turbopack)
- **React 19**
- **TypeScript 5** (strict mode)
- **Tailwind CSS v4** + **shadcn/ui** (style New York)
- **Framer Motion 12** (animations, transitions de vues)
- **Recharts 2** (graphiques dashboard)
- **react-markdown** (rendu chat et contenu)
- **Lucide React** (icônes)
- **Sonner** (toasts)
- **Zustand 5** (state client + localStorage)

### Backend
- **Route Handlers** Next.js (API)
- **Prisma ORM 6** (SQLite sandbox / Neon PostgreSQL prod)
- **Better Auth 1.6** (auth email/password, sessions, reset)
- **Resend 6** (emails transactionnels)
- **z-ai-web-dev-sdk** (abstraction IA Gemini 2.5 Flash)

### Infrastructure
- **Bun** (runtime + gestionnaire de paquets)
- **Caddy** (gateway reverse proxy, port unique)
- **ESLint 9** (qualité du code)

---

## 🔑 Configuration requise

### Variables d'environnement (`.env`)

```bash
# Base de données
DATABASE_URL="file:./db/custom.db"                              # SQLite sandbox
# DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require"  # Neon

# Better Auth
BETTER_AUTH_SECRET="generer-avec-openssl-rand-base64-32"
BETTER_AUTH_URL="http://localhost:3000"

# Resend (emails)
RESEND_API_KEY="re_xxx"
RESEND_FROM_EMAIL="SEO AI Writer <noreply@votre-domaine.bj>"

# App
APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🚀 Installation et démarrage

```bash
# 1. Installer les dépendances
bun install

# 2. Copier et remplir les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs (BETTER_AUTH_SECRET, RESEND_API_KEY, DATABASE_URL)

# 3. Pousser le schéma Prisma en base
bun run db:push

# 4. Lancer le serveur de développement
bun run dev
# → http://localhost:3000

# 5. (Production) Build
bun run build
bun run start
```

---

## 🌍 Migration vers Neon PostgreSQL

1. Créer une base gratuite sur https://neon.tech
2. Récupérer la chaîne de connexion `postgresql://...`
3. Dans `.env`, remplacer `DATABASE_URL` par la chaîne Neon
4. Dans `prisma/schema.prisma`, changer `provider = "sqlite"` → `provider = "postgresql"`
5. Lancer `bun run db:push`
6. (Optionnel) Utiliser directement `prisma/schema.neon.prisma`

---

## 📧 Configuration Resend

1. Créer un compte sur https://resend.com (3000 emails/mois gratuits)
2. Vérifier votre domaine (ou utiliser `onboarding@resend.dev` pour tester)
3. Copier la clé API `re_xxx` dans `.env` sous `RESEND_API_KEY`
4. Sans clé API, les emails sont affichés dans la console serveur (mode dev)

**Templates inclus :**
- `sendWelcomeEmail()` — bienvenue après inscription
- `sendPasswordResetEmail()` — lien de réinitialisation (1h de validité)
- `sendNewsletterWelcome()` — confirmation inscription newsletter

---

## 🔐 Authentification (Better Auth)

**Flows implémentés :**
- ✅ Inscription email/mot de passe (min 8 caractères)
- ✅ Connexion avec auto-sign-in
- ✅ Déconnexion (suppression session)
- ✅ Mot de passe oublié (envoi email avec token)
- ✅ Réinitialisation mot de passe (via lien email)
- ✅ Sessions persistantes (cookie 7 jours, cache 5 min)
- ✅ Rate limiting (20 req/min par IP)
- ✅ Champs additionnels : `phone` (+229 Bénin), `plan` (free/pro/enterprise)

**Routes API :**
- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-in/email`
- `POST /api/auth/sign-out`
- `POST /api/auth/forget-password`
- `POST /api/auth/reset-password`
- `GET  /api/auth/get-session`

---

## 🇧🇯 Localisation Bénin

- **Devise** : FCFA (Franc CFA) — plans à 0 / 15 000 / 50 000 FCFA
- **Téléphone** : format +229 XX XX XX XX
- **Témoignages** : Cotonou, Porto-Novo, Parakou
- **Paiement** : mention Mobile Money (MTN MoMo, Moov Money)
- **Emails** : signature "Cotonou, Bénin"

---

## 📂 Routes et navigation

L'application utilise une **route unique** `/` (contrainte sandbox) avec navigation par état Zustand :

```
/                        → Landing page (si non authentifié)
/                        → App Shell (si authentifié)
  ├─ Dashboard           → Vue par défaut après login
  ├─ Chat IA             → /api/chat (streaming)
  ├─ Outils SEO          → /api/generate (streaming) — 15 outils
  ├─ Analyse SEO         → /api/analyze (temps réel)
  ├─ Mots-clés           → /api/keywords (IA)
  ├─ Réécriture          → /api/rewrite (8 opérations)
  ├─ Historique          → Local (Zustand + localStorage)
  └─ Paramètres          → Local + Better Auth (logout)

/?reset-token=xxx        → Auto-ouvre la modale de reset password
```

---

## 🎨 Design system

- **Couleur primaire** : Bleu premium `#2563EB` (blue-600) → `#1D4ED8` (blue-700)
- **Glassmorphism** : `glass` utility (backdrop-blur + bg-white/60)
- **Gradients** : `gradient-brand` (blue-600 → blue-700), `gradient-text`
- **Animations** : float, pulse-glow, shimmer, blink, gradient-shift
- **Dark mode** : variables CSS + classe `.dark` sur `<html>`
- **Scrollbar** : custom styling (thin, rounded, semi-transparent)
- **Markdown** : classe `.prose-chat` pour le rendu chat/contenu

---

## ✅ Vérification end-to-end

Toutes les fonctionnalités ont été testées via Agent Browser :

| Fonctionnalité | Statut |
|---|---|
| Landing page (toutes sections) | ✅ |
| Inscription Better Auth | ✅ |
| Connexion Better Auth | ✅ |
| Mot de passe oublié (email) | ✅ |
| Reset password (lien email) | ✅ |
| Session persistante (reload) | ✅ |
| Déconnexion | ✅ |
| Dashboard (stats, charts) | ✅ |
| Chat IA streaming | ✅ |
| Génération contenu streaming | ✅ |
| Analyse SEO temps réel | ✅ |
| Recherche mots-clés IA | ✅ |
| Réécriture (8 opérations) | ✅ |
| Historique (filtres, favoris) | ✅ |
| Paramètres (thème, export) | ✅ |
| Dark mode | ✅ |
| Mobile responsive | ✅ |
| Footer sticky | ✅ |
| Lint (0 errors, 0 warnings) | ✅ |

---

## 📦 Livraison

Ce document décrit l'intégralité du dossier projet livré. Le code source complet est
disponible dans le zip `seo-ai-writer.zip`. Pour démarrer :

1. Extraire le zip
2. `bun install`
3. `cp .env.example .env` (et remplir les valeurs)
4. `bun run db:push`
5. `bun run dev`

**Fait au Bénin 🇧🇯 — Cotonou, 2025**
