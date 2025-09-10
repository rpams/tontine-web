# Tontine - Application de gestion des tontines

Une application moderne de gestion de tontines construite avec Next.js 15, Prisma, Better-auth et Tailwind CSS.

## 🚀 Déploiement sur Vercel

### Prérequis
- Une base de données PostgreSQL (Supabase, Neon, ou autre)
- Un compte Vercel
- Variables d'environnement configurées

### 1. Préparer la base de données

```bash
# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Migrer la base de données
npx prisma migrate deploy

# (Optionnel) Seed des données
npm run db:seed
```

### 2. Variables d'environnement Vercel

Configurer ces variables dans le dashboard Vercel :

```env
# Base de données
DATABASE_URL="postgresql://username:password@host:port/database"

# Better Auth
BETTER_AUTH_SECRET="votre-clé-secrète-au-moins-32-caractères"
BETTER_AUTH_URL="https://votre-app.vercel.app"
NEXT_PUBLIC_BETTER_AUTH_URL="https://votre-app.vercel.app"

# OAuth (optionnel)
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"

# Production
NODE_ENV="production"
```

### 3. Déployer

```bash
# Méthode 1: Via Vercel CLI
npm i -g vercel
vercel --prod

# Méthode 2: Via GitHub
# 1. Push sur GitHub
# 2. Connecter repo à Vercel
# 3. Auto-deploy activé
```

### 4. Après déploiement

```bash
# Migrer la base de données de production
npx prisma migrate deploy --env=production

# Vérifier les migrations
npx prisma migrate status --env=production
```

## 🛠 Scripts disponibles

```bash
npm run dev          # Développement local
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification ESLint
npm run db:migrate   # Migration base de données
npm run db:push      # Push schema vers DB
npm run db:seed      # Seed données exemple
```

## 📦 Structure du projet

```
tontine/
├── app/                    # App Router Next.js 15
│   ├── dashboard/         # Pages dashboard
│   ├── api/              # API Routes
│   └── ...
├── components/            # Composants réutilisables
├── lib/                  # Utilitaires et configs
├── prisma/               # Schema et migrations
├── public/               # Assets statiques
└── ...
```

## 🔧 Configuration Prisma

Le client Prisma est généré dans `lib/generated/prisma` pour éviter les conflits.

## 🔐 Authentification

Utilise Better-auth avec support :
- Email/mot de passe
- OAuth Google (configurable)
- Sessions sécurisées

## 📱 Features

- ✅ Dashboard responsive
- ✅ Gestion des tontines
- ✅ Suivi des paiements
- ✅ Profil utilisateur
- ✅ Authentification sécurisée
- ✅ Base de données PostgreSQL
- ✅ Déploiement Vercel optimisé

## 🐛 Troubleshooting

### Erreurs Prisma
```bash
# Régénérer le client
npx prisma generate

# Reset complet
npx prisma migrate reset
```

### Erreurs build Vercel
- Vérifier les variables d'environnement
- S'assurer que `DATABASE_URL` est valide
- Vérifier les permissions de la base de données

## Getting Started (Développement local)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
