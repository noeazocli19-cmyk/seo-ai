# 🚀 Déploiement Vercel — SEO AI Writer

> Guide complet pour déployer ton SaaS sur Vercel avec l'IA Z.ai.

---

## ⚠️ ÉTAPE 0 — Recharge ton compte Z.ai (OBLIGATOIRE)

Ton API key Z.ai fonctionne, mais ton compte n'a **plus de crédits**. Tu dois recharger.

### Comment recharger :

1. Va sur **https://open.bigmodel.cn**
2. Connecte-toi avec ton compte
3. Clique sur ton profil (en haut à droite) → **"Account"** ou **"账户"**
4. Va dans **"Balance"** ou **"余额"** → **"Recharge"** ou **"充值"**
5. Ajoute du crédit (10¥ ≈ 1500 FCFA, soit ~2€)

> 💡 Avec 10¥, tu as largement de quoi tester (glm-4.5-air coûte ~0.5¥ / million de tokens)

### Vérifie que ça marche :

Une fois rechargé, va dans ton terminal et teste :

```bash
curl -X POST https://open.bigmodel.cn/api/paas/v4/chat/completions ^
  -H "Authorization: Bearer TA_CLE_API" ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"glm-4.5-air\",\"messages\":[{\"role\":\"user\",\"content\":\"hi\"}]}"
```

Tu dois recevoir une vraie réponse JSON avec `"choices"`, pas une erreur.

---

## 🔑 ÉTAPE 1 — Re-génère ta clé API (OBLIGATOIRE)

⚠️ **Tu as partagé ta clé API publiquement dans le chat**. Par sécurité, tu dois la révoquer et en créer une nouvelle.

1. Va sur **https://open.bigmodel.cn/usercenter/apikeys**
2. **Supprime** l'ancienne clé (`f5aec73d...`)
3. Clique sur **"Add API Key"**
4. Copie la **nouvelle** clé (format `xxxxxxxx.yyyyyyyyyy`)

---

## 💻 ÉTAPE 2 — Préparer le projet pour Vercel

### 2.1 — Télécharge le nouveau zip

Télécharge **`seo-ai-writer.zip`** (le fichier zip à jour).

Remplace ton dossier `seo-ai-writer` actuel par la nouvelle version :

1. Supprime le contenu de `C:\Users\COACH\Downloads\seo-ai-writer\seo-ai-writer`
2. Décompresse le nouveau zip à la place
3. Ouvre le dossier dans VS Code

### 2.2 — Installe les dépendances

Dans le terminal PowerShell :

```powershell
pnpm install
```

### 2.3 — Crée le fichier `.env` à la racine du projet

```env
# Base de données (voir étape 3 pour Neon)
DATABASE_URL="file:./db/custom.db"

# Better Auth (génère un secret avec: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
BETTER_AUTH_SECRET=TON_SECRET_DE_32_CARACTERES_MINIMUM
BETTER_AUTH_URL=http://localhost:3000

# Resend (emails - optionnel en dev)
RESEND_API_KEY=
RESEND_FROM_EMAIL=SEO AI Writer <noreply@ton-domaine.com>

# App
APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# IA Z.ai (OBLIGATOIRE)
ZAI_API_KEY=TA_NOUVELLE_CLE_API
ZAI_BASE_URL=https://open.bigmodel.cn/api/paas/v4
```

### 2.4 — Teste en local

```powershell
pnpm run db:push
pnpm run dev
```

Ouvre **http://localhost:3000** → Chat IA → envoie un message → l'IA doit répondre ! ✅

> ⚠️ Si tu as encore l'erreur "余额不足" (solde insuffisant), retourne à l'étape 0 et recharge ton compte.

---

## 🗄️ ÉTAPE 3 — Configurer Neon PostgreSQL

Vercel ne supporte pas SQLite. Tu dois utiliser **Neon PostgreSQL** (gratuit).

### 3.1 — Créer la base Neon

1. Va sur **https://neon.tech**
2. Crée un compte gratuit (connexion GitHub/Google)
3. **"New Project"** → nomme-le `seo-ai-writer`
4. Région : **Frankfurt** (Europe, le plus proche du Bénin)
5. Copie le **"Connection string"** :
   ```
   postgresql://USER:PASSWORD@ep-XXX-pooler.REGION.aws.neon.tech/seoaiwriter?sslmode=require
   ```

### 3.2 — Remplacer le schéma Prisma

Dans VS Code, dans le terminal :

```powershell
# Sur Windows PowerShell:
Copy-Item -Path prisma\schema.neon.prisma -Destination prisma\schema.prisma -Force
```

> Ou manuellement : ouvre `prisma/schema.neon.prisma`, copie tout le contenu, ouvre `prisma/schema.prisma`, remplace tout par ce que tu viens de copier.

### 3.3 — Mettre à jour `.env`

Dans `.env`, remplace la ligne SQLite par Neon :

```env
# SQLite (dev) — commenter:
# DATABASE_URL="file:./db/custom.db"

# Neon (prod) — décommenter et adapter:
DATABASE_URL="postgresql://USER:PASSWORD@ep-XXX-pooler.REGION.aws.neon.tech/seoaiwriter?sslmode=require&connect_timeout=15"
```

### 3.4 — Pousser le schéma vers Neon

```powershell
pnpm run db:push
```

Tu dois voir :
```
🚀 Your database is now in sync with your Prisma schema.
```

### 3.5 — Tester en local avec Neon

```powershell
pnpm run dev
```

Crée un compte → vérifie dans le dashboard Neon → **"Tables"** → une ligne `User` doit apparaître.

---

## 🌐 ÉTAPE 4 — Déployer sur Vercel

### 4.1 — Pousser le projet sur GitHub

Dans le terminal VS Code :

```powershell
git init
git add .
git commit -m "SEO AI Writer — production ready"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/seo-ai-writer.git
git push -u origin main
```

> ⚠️ **Important** : vérifie que `.gitignore` contient bien `.env` et `.z-ai-config` (sinon ta clé API va fuir sur GitHub !)

### 4.2 — Connecter à Vercel

1. Va sur **https://vercel.com**
2. **"Sign Up"** / **"Log In"** avec GitHub
3. Clique sur **"Add New"** → **"Project"**
4. Importe ton repo `seo-ai-writer`

### 4.3 — Configurer les variables d'environnement sur Vercel

Dans la page de configuration Vercel, trouve **"Environment Variables"** et ajoute **TOUTES** ces variables :

| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgresql://USER:PASSWORD@ep-XXX.neon.tech/seoaiwriter?sslmode=require&connect_timeout=15` |
| `BETTER_AUTH_SECRET` | (ton secret de 32+ caractères) |
| `BETTER_AUTH_URL` | `https://ton-projet.vercel.app` (ton URL Vercel finale) |
| `RESEND_API_KEY` | `re_xxx` (ta clé Resend, optionnel) |
| `RESEND_FROM_EMAIL` | `SEO AI Writer <noreply@ton-domaine.com>` |
| `APP_URL` | `https://ton-projet.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | `https://ton-projet.vercel.app` |
| `ZAI_API_KEY` | `TA_CLE_API_ZAI` |
| `ZAI_BASE_URL` | `https://open.bigmodel.cn/api/paas/v4` |

### 4.4 — Déployer

1. Clique sur **"Deploy"**
2. Attends 2-3 minutes (Vercel build le projet)
3. Une fois terminé, tu reçois l'URL : `https://seo-ai-writer-xxx.vercel.app`

### 4.5 — Configurer BETTER_AUTH_URL

⚠️ **Étape critique** : retourne dans Vercel → **Settings** → **Environment Variables** → modifie :

- `BETTER_AUTH_URL` = ton URL Vercel finale (ex: `https://seo-ai-writer.vercel.app`)
- `APP_URL` = même valeur
- `NEXT_PUBLIC_APP_URL` = même valeur

**Redéploie** (Settings → Deployments → "Redeploy")

### 4.6 — Tester la prod

Ouvre ton URL Vercel :
- Landing page s'affiche ✅
- Crée un compte → vérifie dans Neon qu'un user est créé ✅
- Chat IA → envoie un message → l'IA répond ✅

---

## 📧 ÉTAPE 5 — Configurer Resend (emails réels)

Pour que les emails (bienvenue, reset mot de passe) partent vraiment :

1. Va sur **https://resend.com**
2. Crée un compte gratuit (3000 emails/mois gratuits)
3. Va dans **"API Keys"** → **"Create API Key"** → copie la clé `re_xxx`
4. Ajoute et vérifie ton domaine dans **"Domains"** (ou utilise `onboarding@resend.dev` pour tester)
5. Sur Vercel, mets à jour :
   - `RESEND_API_KEY` = `re_xxx`
   - `RESEND_FROM_EMAIL` = `SEO AI Writer <noreply@ton-domaine-verifié.com>`
6. Redéploie

---

## 🎉 ÉTAPE 6 — Configurer un domaine personnalisé (optionnel)

Dans Vercel :
1. **Settings** → **Domains**
2. Ajoute ton domaine (ex: `seoaiwriter.bj`)
3. Chez ton registrar, configure les DNS :
   - `A` record → pointe vers Vercel
   - `CNAME` pour `www` → `cname.vercel-dns.com`
4. Une fois vérifié, mets à jour :
   - `BETTER_AUTH_URL` = `https://seoaiwriter.bj`
   - `APP_URL` = `https://seoaiwriter.bj`
   - `NEXT_PUBLIC_APP_URL` = `https://seoaiwriter.bj`
   - `RESEND_FROM_EMAIL` = `SEO AI Writer <noreply@seoaiwriter.bj>`
5. Redéploie

---

## 🆘 Dépannage Vercel

### Erreur "500 Internal Server Error" sur le chat

1. Va sur Vercel → **"Functions"** → **"Logs"**
2. Regarde l'erreur exacte
3. Causes possibles :
   - `ZAI_API_KEY` manquant dans Vercel env vars
   - Compte Z.ai sans crédits (recharge sur open.bigmodel.cn)
   - `BETTER_AUTH_URL` incorrect

### Erreur "Database connection failed"

- Vérifie que `DATABASE_URL` est bien l'URL Neon (pas SQLite)
- Vérifie `?sslmode=require` à la fin
- Neon met en sommeil les DB inactives — le 1er appel peut prendre 2-3s

### Erreur d'authentification "redirect loop"

- `BETTER_AUTH_URL` doit correspondre **exactement** à ton URL Vercel
- Pas de slash `/` à la fin

### Les emails ne partent pas

- Vérifie `RESEND_API_KEY` (commence par `re_`)
- Vérifie que le domaine dans `RESEND_FROM_EMAIL` est vérifié dans Resend
- Regarde les logs Vercel pour les erreurs Resend

---

## ✅ Checklist finale de production

Avant de dire "c'est en prod", vérifie :

- [ ] Compte Z.ai rechargé (10¥ minimum)
- [ ] Nouvelle clé API Z.ai générée (l'ancienne révoquée)
- [ ] Base Neon créée et schéma poussé
- [ ] Toutes les variables d'env configurées sur Vercel
- [ ] `BETTER_AUTH_URL` = URL Vercel finale
- [ ] Inscription fonctionne en prod
- [ ] Chat IA répond en prod
- [ ] Outils SEO génèrent du contenu en prod
- [ ] Mots-clés retournent des résultats en prod
- [ ] Réécriture fonctionne en prod
- [ ] Mode sombre marche
- [ ] Responsive mobile
- [ ] Resend configuré (optionnel mais recommandé)

---

## 📊 Coûts estimés (pour 1000 utilisateurs actifs/mois)

| Service | Coût mensuel estimé |
|---------|---------------------|
| Vercel (Hobby plan) | **0€** (gratuit jusqu'à 100GB bande passante) |
| Neon (Free plan) | **0€** (0.1 GB stockage, 100h compute/mois) |
| Z.ai (glm-4.5-air) | **~2-5€** (selon usage) |
| Resend (Free plan) | **0€** (3000 emails/mois) |
| **TOTAL** | **~2-5€ / mois** |

Pour passer à l'échelle supérieure :
- Vercel Pro : 20$/mois
- Neon Launch : 19$/mois
- Resend Pro : 20$/mois

**Fait au Bénin 🇧🇯 · 2026**
