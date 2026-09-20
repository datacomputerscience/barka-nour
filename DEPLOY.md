# Barka Nour — Déploiement Indépendant

Ce projet est **100% indépendant de Barka SaaS**. Pas de code partagé runtime, pas de DB commune, pas de tenant.

## 1. Cloudflare Pages — Nouveau projet séparé

### Via Dashboard (recommandé)

1. Aller sur https://dash.cloudflare.com → Pages → Create project → Connect to Git
2. Sélectionner repo GitHub `barka-nour` (à créer ci-dessous)
3. Config:
   - Project name: `barka-nour`
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output: `dist`
   - Node version: 20
   - Root: `/`
4. Env vars (Settings → Environment variables):
   - `VITE_SUPABASE_URL` = https://xxx.supabase.co
   - `VITE_SUPABASE_ANON_KEY` = eyJ...
   - `VITE_META_PIXEL_ID` = (optionnel)
   - `VITE_APP_NAME` = Barka Nour
   - `VITE_CURRENCY` = TND
   - `VITE_FREE_SHIPPING_THRESHOLD` = 150
5. Deploy → URL: `https://barka-nour.pages.dev` (ou custom `barkanour.tn`)

### Via Wrangler CLI

```bash
npm run build
npx wrangler pages deploy dist --project-name=barka-nour
```

`wrangler.toml` déjà configuré:
```toml
name = "barka-nour"
compatibility_date = "2024-09-23"
pages_build_output_dir = "./dist"
```

Fichiers Cloudflare déjà présents:
- `public/_headers` → security + cache immutable
- `public/_redirects` → /api passthrough
- `public/_routes.json` → include /* exclude /assets/*
- `public/404.html` → SPA fallback
- `public/manifest.json` → PWA

## 2. GitHub — Repo séparé

```bash
cd /home/user/barka-nour
git init (déjà fait)
git branch -M main
# Créer repo vide sur GitHub: barka-nour (private ou public)
git remote add origin https://github.com/USERNAME/barka-nour.git
git push -u origin main
```

Le repo actuel est local avec 1 commit:
`dec424d feat: Barka Nour independent single-store - initial complete build 1955 modules, 20 tables, 15-step order security, no-human policy`

## 3. Supabase — DB séparée

1. Créer nouveau projet Supabase `barka-nour` (séparé de Barka SaaS)
2. SQL Editor → exécuter:
   - `src/database/migrations/001_initial_schema.sql` (20 tables, UUID, triggers)
   - `src/database/seeds/001_demo_data.sql` (5 produits objet-only, catégories, coupons, delivery mock)
3. Storage → créer bucket `barka-nour-media` public
4. Copier URL + anon key → `.env.local` + Cloudflare env vars

## 4. Variables d'environnement séparées

Voir `.env.example` complet. Jamais partager les clés entre Barka et Barka Nour.

Barka Nour utilise:
- `VITE_SUPABASE_URL` (son propre projet)
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `META_CAPI_ACCESS_TOKEN` (server only)
- Delivery keys (MesColis, Aramex, etc.) séparés

## 5. Domaines

- Barka SaaS: `barka-2uh.pages.dev` (ou `barka.tn`)
- Barka Nour: `barka-nour.pages.dev` (ou `barkanour.tn`) — **domaine différent**

## 6. Vérification indépendance

```bash
# Aucun tenant_id dans Barka Nour
grep -r "tenant_id" src/ --include="*.ts" --include="*.tsx" # doit être vide

# Barka SaaS a tenant_id partout
grep -r "tenant_id" /home/user/barka/src/ | wc -l # >0

# Build indépendant
cd /home/user/barka-nour && npm run build # 0.46kB html 42kB css 606kB js
cd /home/user/barka && npm run build # 1.32kB html 53kB css 1092kB js (différent)
```

## 7. Live URLs actuelles

- Barka SaaS: https://barka-2uh.pages.dev (LIVE)
- Barka Nour dev: https://5174-ibldg5m911625usdfnf41.e2b.app (dev server 5174, process barka-nour-store)
- Barka Nour prod: à déployer → `https://barka-nour.pages.dev` (suivre étapes ci-dessus)

## 8. Sécurité

- Barka Nour n'a PAS de multi-tenancy, pas de RLS complexe tenant, simplification single-store
- 15-step order validation serveur-side, jamais trust client totals
- No-human-images policy stricte partout
- Secrets server-only jamais frontend
