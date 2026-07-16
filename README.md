# SEO AI Writer

> Le meilleur assistant IA pour créer du contenu optimisé pour Google.
> Propulsé par Gemini 2.5 Flash. Fait au Bénin 🇧🇯

SaaS IA professionnel de génération, optimisation et analyse de contenu SEO.

## ✨ Fonctionnalités

- **Chat IA** (ChatGPT-like) avec streaming, historique, favoris
- **15+ outils SEO** : articles, landing pages, descriptions produits, méta-données, FAQ, publications sociales, emails marketing, Google Ads
- **Analyse SEO temps réel** : score sur 100, E-E-A-T, lisibilité, densité de mots-clés, recommandations
- **Recherche de mots-clés IA** : intentions, longue traîne, questions, idées d'articles
- **Réécriture intelligente** : réécrire, corriger, résumer, développer, simplifier, humaniser, optimiser SEO
- **Historique** avec recherche, filtres, favoris, pagination
- **Export** multi-format : PDF, DOCX, Markdown, TXT
- **Authentification** Better Auth (inscription, connexion, mot de passe oublié)
- **Emails** via Resend (bienvenue, reset mot de passe, newsletter)
- **Mode sombre** + design premium (glassmorphism, animations Motion)
- **Command Palette** (Ctrl+K)
- **Tarifs en FCFA** adaptés au marché béninois

## 🛠️ Stack technique

| Domaine | Technologie |
|---------|-------------|
| Framework | Next.js 16 (App Router) |
| Langage | TypeScript 5 strict |
| Style | Tailwind CSS v4 + shadcn/ui |
| Base de données | PostgreSQL (Neon) / SQLite (dev) |
| ORM | Prisma |
| Auth | Better Auth |
| Emails | Resend |
| IA | z-ai-web-dev-sdk (Gemini 2.5 Flash) |
| État | Zustand |
| Graphiques | Recharts |
| Animations | Motion (Framer Motion) |
| Icônes | Lucide React |

## 🚀 Installation

### 1. Cloner et installer

```bash
bun install
```

### 2. Configurer l'environnement

Copiez `.env.example` en `.env` et remplissez :

```bash
# Base de données Neon (PostgreSQL)
DATABASE_URL=postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/seoaiwriter?sslmode=require&connect_timeout=15

# Better Auth
BETTER_AUTH_SECRET=openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000

# Resend (emails)
RESEND_API_KEY=re_votre_cle_api
RESEND_FROM_EMAIL=SEO AI Writer <noreply@votredomaine.com>

# App
APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configurer Neon PostgreSQL

1. Créez un compte gratuit sur [neon.tech](https://neon.tech)
2. Créez un nouveau projet
3. Copiez l'URL de connexion (format : `postgresql://...`)
4. Remplacez `DATABASE_URL` dans `.env`
5. Remplacez le contenu de `prisma/schema.prisma` par `prisma/schema.neon.prisma`
6. Poussez le schéma :

```bash
bun run db:push
```

### 4. Configurer Resend (emails)

1. Créez un compte sur [resend.com](https://resend.com)
2. Vérifiez votre domaine (ou utilisez `onboarding@resend.dev` pour les tests)
3. Copiez votre clé API (`re_xxx`)
4. Remplacez `RESEND_API_KEY` dans `.env`

> Sans clé Resend, les emails sont affichés dans la console serveur (mode dev).

### 5. Démarrer

```bash
bun run dev
```

L'application est disponible sur `http://localhost:3000`

## 📁 Structure du projet

> **La structure complète et détaillée** est dans [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md).

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/     # Better Auth handler
│   │   ├── chat/              # Chat IA streaming
│   │   ├── generate/          # Génération de contenu (streaming SSE)
│   │   ├── analyze/           # Analyse SEO
│   │   ├── keywords/          # Recherche de mots-clés
│   │   └── rewrite/           # Réécriture IA
│   ├── globals.css            # Design system
│   ├── layout.tsx             # Layout + metadata SEO
│   └── page.tsx               # Route unique (SPA)
├── components/
│   ├── auth/                  # AuthModal (login/register/forgot/reset)
│   ├── app/                   # AppShell, views, command palette
│   ├── landing/               # Landing page sections
│   └── ui/                    # shadcn/ui components (50+)
├── hooks/
│   └── use-auth.ts            # Hook Better Auth
├── lib/
│   ├── ai/client.ts           # Couche d'abstraction IA
│   ├── prompts/index.ts       # Bibliothèque de prompts
│   ├── auth.ts                # Config Better Auth (serveur)
│   ├── auth-client.ts         # Client Better Auth
│   ├── db.ts                  # Prisma client
│   ├── email.ts               # Service Resend
│   ├── seo.ts                 # Moteur d'analyse SEO
│   ├── store.ts               # Zustand store
│   ├── types.ts               # Types TypeScript
│   └── constants.ts           # Constantes (outils, tarifs, etc.)
prisma/
├── schema.prisma              # Schéma SQLite (dev)
└── schema.neon.prisma         # Schéma PostgreSQL (Neon production)
```

## 🔐 Authentification (Better Auth)

- **Inscription** : email + mot de passe + nom + téléphone (+229 Bénin)
- **Connexion** : email + mot de passe
- **Mot de passe oublié** : email de reset via Resend
- **Réinitialisation** : lien sécurisé avec token (expire en 1h)
- **Sessions** : cookies persistants (7 jours)

Tous les utilisateurs doivent s'inscrire ou se connecter pour accéder au dashboard.

## 📧 Emails (Resend)

| Email | Trigger |
|-------|---------|
| Bienvenue | Après inscription |
| Reset mot de passe | Demande de reset |
| Newsletter | Inscription newsletter |

## 💰 Tarifs (FCFA)

| Plan | Prix | Fonctionnalités |
|------|------|-----------------|
| Découverte | 0 FCFA | 20 générations/mois, chat basique |
| Pro | 15 000 FCFA/mois | Générations illimitées, tous les outils |
| Entreprise | 50 000 FCFA/mois | Multi-utilisateurs, API, marque blanche |

Paiement Mobile Money (MTN, Moov) ou carte bancaire.

## 🎨 Design

- Palette bleu premium (#2563EB, #1D4ED8, #DBEAFE)
- Mode clair / mode sombre
- Glassmorphism léger
- Animations fluides (Motion)
- Responsive (mobile, tablette, desktop)
- Accessible (WCAG, ARIA, navigation clavier)

## 📊 Scripts

```bash
bun run dev        # Démarrer en dev
bun run build      # Build de production
bun run start      # Démarrer en production
bun run lint       # Vérifier le code
bun run db:push    # Pousser le schéma Prisma
bun run db:generate # Générer le client Prisma
```

## 🌍 Localisation Bénin

- Interface en français
- Prix en FCFA (XOF)
- Téléphone au format +229
- Témoignages de clients béninois (Cotonou, Porto-Novo, Parakou)
- Paiement Mobile Money

## 📄 Licence

© 2025 SEO AI Writer — Cotonou, Bénin. Tous droits réservés.
