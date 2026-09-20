# Barka Nour — Single-Store E-commerce Tunisien

**Boutique unique** Barka Nour, artisanat tunisien authentique. **PAS multi-tenant SaaS**. Une seule boutique, pas de tenant switching, pas de billing SaaS.

> **Politique stricte NO-HUMAN-IMAGES** : aucune image de personnes (homme/femme/enfant/visage/silhouette/modèle/avatar) partout : hero, banners, produits, marketing, dashboard empty states. Seulement produits, emballages, colis, sacs, géométrique abstrait, tech, boîtes livraison, icônes, cartes, architecture tunisienne sans personnes.

## Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui + React Router + Lucide
- **Backend abstraction**: Supabase (PostgreSQL) + MockDatabaseService (Cloudflare-compatible), service/repository pattern
- **Deploy**: Cloudflare Pages (`npm run build` → `dist/`), compatible Workers
- **Free-first**: Supabase Free + Cloudflare Free primary, upgradeable sans rewrite

## Démarrage rapide

```bash
git clone ...
cd barka-nour
npm install
cp .env.example .env.local
# remplir VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
npm run dev # http://localhost:5174
```

## Build Production

```bash
npm run build # dist/ 0.46kB html + 42kB css + 606kB js (1955 modules)
# Cloudflare Pages: Build command npm run build, Output dir dist
```

## Structure

```
src/
  components/ui/         shadcn badge/button/card/dialog/input/label/select/switch/tabs/textarea
  components/layout/     BarkaNourLogo (bn-gradient), StorefrontLayout (banner Truck COD, lang AR/FR/EN RTL, cart), AdminLayout (sidebar 280px, 17 nav)
  components/storefront/ (futur)
  lib/                   utils (formatTND, 24 gouvernorats, 9 order statuses), supabase (MockDatabaseService), delivery (DeliveryProvider interface + Mock + 6 providers), meta (Pixel+CAPI event_id dedup + feed), cartContext
  services/              productService (5 produits mock objet-only 29.9-299 TND), orderService (2 orders mock + 15-step validation)
  types/                 single-store types (Product, Variant, Category, Order, OrderItem price snapshot, Coupon, Cart, DeliveryConfig, Shipment, MetaIntegration, StoreSettings) - NO tenant_id
  i18n/                  AR/FR/EN translations, RTL handling
  pages/storefront/      Home (hero categories featured trust no-human), Shop (filtres, sort), Product (variantes, qty, AddToCart Pixel event), Cart (qty update, free shipping ≥150), Checkout (Tunisian fields: fullName, phone TN, email opt, 24 gov, city, address, postal, notes, COD), Confirmation, About, Contact
  pages/admin/           Dashboard (revenue, orders, customers, low-stock, conversion), Products (SKU/stock/featured), Categories (parent/child), Inventory (movements), Orders (15-step), Customers (by phone), Coupons, Delivery, Meta, Analytics, Settings
  database/migrations/   001_initial_schema.sql (20 tables UUID, triggers updated_at, prevent negative stock)
  database/seeds/        001_demo_data.sql (5 produits objet-only, catégories, coupons, delivery mock, landing blocks hero/text/product/collection/banner/CTA/image/FAQ/benefits/countdown)
  server/services/       orderService.server.ts (15-step secure)
```

## Fonctionnalités Clés

### Storefront
- Home / Shop / Product / Search / Cart / Checkout / Confirmation + About/Contact
- Checkout tunisien: nom complet, téléphone TN (+216), email optionnel, gouvernorat 24 list, ville, adresse, postal, notes, TND, COD first-class, mobile-friendly
- Panier localStorage, subtotal, livraison estimée 7-10 TND, gratuite ≥150 TND
- Lang AR/FR/EN avec RTL

### Admin (Single-Store)
- Sidebar: Dashboard / Products / Categories / Inventory / Orders / Customers / Coupons / Marketing / Landing / Delivery / Payments / Meta / Analytics / Media / Design / Settings / Logs
- Produits: simple+variable SKU/prix/stock/images objet-only/SEO/featured, prevent negative stock
- Catégories parent/child
- Inventaire: mouvements réels (order/restock/adjustment/return), low-stock alerts
- Commandes: statuts pending/confirmed/preparing/shipped/out_for_delivery/delivered/cancelled/returned/failed + history

### Sécurité Commande 15 Étapes (server-side)
1. Validation champs requis
2. Phone TN format
3. Gouvernorat 24 list
4. Fetch prix frais serveur (jamais trust client)
5. Stock réel check
6. Recalc subtotal serveur
7. Coupon validation serveur (expiration, usage, min)
8. Calcul livraison par gouvernorat
9. Free shipping si ≥150
10. Calcul total serveur
11. Idempotency key
12. Find/create customer by phone
13. Create order + items snapshot + status history
14. Decrement inventory + movements
15. Create shipment + Meta events

### Delivery Abstraction
```ts
interface DeliveryProvider {
  createShipment(order): Promise<Shipment>
  getShipment(id): Promise<Shipment>
  trackShipment(tracking): Promise<Tracking>
  cancelShipment(id): Promise<void>
  calculateDeliveryFee(gov, city): Promise<number>
}
```
Providers: MesColis, Aramex, First Delivery, Best Delivery, Navex, INTIGO. MockDeliveryProvider si docs indisponibles. Statuts: configured/not_configured/mock/test/production. **Jamais inventer API**.

### Meta Integration
- Pixel ID client safe, CAPI token server only jamais frontend
- Events: PageView, ViewContent, Search, AddToCart, InitiateCheckout, AddPaymentInfo, Purchase, Lead
- `event_id` dédup Pixel+CAPI même ID
- `hashSHA256` pour user_data email/phone
- Feed: id, title, description, availability, condition new, price TND, link, image_link, brand Barka Nour, quantity

### Base de Données (20 tables)
products, product_variants, categories, product_categories, inventory_movements, customers, orders, order_items (price snapshot), order_status_history, coupons, coupon_usages, abandoned_carts, analytics_events, delivery_configs, shipments, meta_integrations, landing_pages, media, store_settings, store_theme, admin_users, audit_logs

- UUID PK, created_at/updated_at triggers, FK, indexes, check constraints (stock >=0, price >=0, status enums)

### SEO & PWA
- Sémantique, Open Graph, sitemap, robots, structured data Product/Offer/BreadcrumbList (à compléter)
- manifest.json, icons, no-human policy

## ENV

Voir `.env.example` : SUPABASE, DATABASE_URL, AUTH_SECRET, STORAGE, META_*, DELIVERY_* (MesColis, Aramex, First, Best, Navex, INTIGO), CLOUDFLARE

## Docs

- `docs/ARCHITECTURE.md` : modular, service/repo, Cloudflare-compatible
- `docs/DATABASE.md` : schéma 20 tables
- `docs/SECURITY.md` : 15-step, hashing, rate limit, headers
- `docs/DEPLOYMENT.md` : Cloudflare Pages
- `docs/META-INTEGRATION.md` : Pixel+CAPI dedup
- `docs/DELIVERY-INTEGRATION.md` : abstraction + mock

## Testing

Critique: orderService 15-step, coupon validation, stock prevent negative, phone TN, governorate 24, idempotency, price snapshot.

## Roadmap

- Auth admin SUPER_ADMIN/STORE_ADMIN/STORE_MANAGER/STORE_EDITOR, hashing bcrypt, sessions secure cookies, audit_logs
- RLS Supabase (single-store simplification vs multi-tenant)
- Media optimized (Supabase Storage)
- CSV import/export products/categories/orders/customers/inventory validation
- Landing builder drag-drop
- PWA offline
- Analytics daily/weekly/monthly + abandoned carts

## No-Human Policy Checklist

- [x] Home hero: Package icon, not people
- [x] Product images: object-only descriptions "sans personnes" "sans modèle humain"
- [x] Demo data: 5 produits tous objet-only
- [x] Trust section: ShieldCheck/Truck icons, not lifestyle
- [x] Admin empty states: Package icon
- [x] Marketing: géométrique, tech illustrations
- [ ] AI prompts must include "NO PEOPLE, NO HUMANS, NO FACES, NO SILHOUETTES, NO MODELS, OBJECT ONLY, NEUTRAL BACKGROUND"

## Licence

Propriétaire Barka Nour - Marque tunisienne originale.
