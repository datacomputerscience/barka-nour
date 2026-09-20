# Architecture Barka Nour - Single-Store

## Principes

- **Single-store**: une seule boutique Barka Nour, pas de tenant_id, pas de RLS multi-tenant complexe, simplification. Si besoin future multi, migration via ajout tenant_id nullable.
- **Modulaire maintenable**: features/products/categories/cart/checkout/orders/customers/inventory/coupons/analytics/marketing/delivery/meta/hooks/services/lib/types/utils/i18n/admin/storefront/server/api/services/repositories/middleware/auth/integrations/database/migrations/seeds/public/icons/assets/docs/tests/
- **Service/Repository abstraction**: MockDatabaseService pour dev local sans Supabase, switchable vers Supabase réel si VITE_SUPABASE_URL configuré. Cloudflare-compatible (pas de Node fs dans client).
- **Free-first**: Supabase Free (500MB DB, 1GB storage) + Cloudflare Pages Free (unlimited bandwidth) + Tailwind + shadcn free. Upgrade path: Supabase Pro, R2, Workers.

## Frontend

- Vite + React 18 + TS + Tailwind v4 (@tailwindcss/vite) + shadcn/ui (badge/button/card/dialog/input/label/select/switch/tabs/textarea)
- React Router DOM: StorefrontRoutes /* + AdminRoutes /admin/*
- CartContext: localStorage bn_cart, count, subtotal, addItem(productId, qty, variant), updateQty, removeItem, clear
- i18n: AR/FR/EN, RTL dir attribute, translations object
- Layouts: StorefrontLayout (banner Truck COD, header lang switcher, search, cartCount, mobile menu, footer no-human policy) + AdminLayout (sidebar 280px, navigation 17 items, single-store badge, header breadcrumb)

## Backend Logic (client-side mock + server abstraction)

- productService.ts: mockProducts 5 objet-only, methods getProducts/getBySlug/create/update/delete/stock validation prevent negative
- orderService.ts: mockOrders 2, 15-step server validation (voir SECURITY), idempotencyKeys Set, price snapshot, inventory decrement, shipment creation
- lib/delivery.ts: DeliveryProvider interface + MockDeliveryProvider + TUNISIAN_PROVIDERS list (MesColis, Aramex, First, Best, Navex, INTIGO, Mock) + getDeliveryProvider factory + calculateDeliveryFeeByGovernorate (Tunis 7, other 10, free >=150)
- lib/meta.ts: trackPixelEvent (client), hashSHA256 (server), buildCAPIEvent (event_name, event_time, event_id dedup, user_data hashed, custom_data, action_source), generateProductFeed (Meta-compatible)
- lib/supabase.ts: createClient, isSupabaseConfigured, MockDatabaseService abstraction
- server/services/orderService.server.ts: createOrderSecure 15 steps detailed

## Database

20 tables: store_settings, store_theme, admin_users (roles SUPER_ADMIN/STORE_ADMIN/STORE_MANAGER/STORE_EDITOR), categories (parent_id), products (price TND 3 decimals, stock >=0 check, status, featured, images JSONB), product_variants (SKU unique, attributes JSONB), product_categories M2M, inventory_movements (quantity_change, reason enum), customers (phone unique, governorate), orders (order_number unique, subtotal/shipping/discount/total, idempotency_key unique, status enum 9 values), order_items (price snapshot), order_status_history, coupons (percentage/fixed, usage_limit), coupon_usages, abandoned_carts (session_id, items JSONB), analytics_events (event_id unique), delivery_configs (provider, status enum), shipments, meta_integrations, landing_pages (blocks JSONB hero/text/product/collection/banner/CTA/image/FAQ/benefits/countdown), media, audit_logs

Indexes: slug, sku, phone, status, created_at DESC, etc.

Triggers: update_updated_at for 14 tables, prevent_negative_stock for products/variants.

## Security

- Server-side validation: never trust client totals, recalc, price fresh fetch
- Idempotency: idempotency_key unique, return existing if duplicate
- Inventory: check stock before decrement, prevent negative via DB check + app
- Auth: admin_users password_hash bcrypt, role enum, is_active, last_login, secure cookies, sessions, audit_logs
- Rate limiting: middleware (future), headers X-Frame-Options DENY, etc.
- Sanitization: zod validation (future), SQLi via Supabase parameterized, XSS via React escaping

## Deployment

- Cloudflare Pages: npm run build -> dist/, _headers (security + cache), _redirects (API passthrough), 404.html SPA fallback, _routes.json
- Env: .env.example with DATABASE_URL, AUTH_SECRET, STORAGE, META_*, DELIVERY_*
- wrangler.toml: pages_build_output_dir dist

## Performance

- Code splitting: lazy import for admin routes (future), pagination for products/orders
- Images: optimized via Supabase Storage (future), object-only neutral background
- CSS: Tailwind 42kB, JS 606kB (1955 modules) - can split vendor chunk

## No-Human Policy Enforcement

- Code review checklist: hero, banners, product pages, marketing, dashboard empty states, help, demo store
- AI prompts: must include NO PEOPLE, NO HUMANS, NO FACES, NO SILHOUETTES, NO MODELS, NO CHILDREN, NO WOMEN, NO MEN, OBJECT ONLY, NEUTRAL BACKGROUND, PACKAGING, PARCEL, BAG, BOX, ABSTRACT GEOMETRIC, ICONS, MAPS, ARCHITECTURE WITHOUT PEOPLE
- Approved: products, packages, delivery boxes, carts, smartphones, laptops, e-commerce interfaces, abstract geometric, icons, tech illustrations, maps, Tunisian architecture/landscapes without people, storefronts/warehouses/vehicles without visible people
