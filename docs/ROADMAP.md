# Roadmap - Barka Nour

## Phase 1 - MVP Done (Current)

- [x] Scaffold vite react-ts tailwind shadcn
- [x] Theme bn-50..950 olive ink, fonts, gradients
- [x] Types single-store no tenant_id
- [x] MockDatabaseService abstraction
- [x] DeliveryProvider interface + Mock + 6 Tunisian providers list
- [x] Meta Pixel+CAPI event_id dedup + feed generator
- [x] i18n AR/FR/EN RTL
- [x] Layouts Storefront (banner COD, lang switcher, cart) + Admin (sidebar 280px)
- [x] Services product 5 objet-only, order 15-step validation idempotency snapshot
- [x] Storefront pages Home/Shop/Product/Cart/Checkout/Confirmation/About/Contact
- [x] Admin pages Dashboard/Products/Categories/Inventory/Orders/Customers/Coupons/Delivery/Meta/Analytics/Settings
- [x] App.tsx routing + CartContext localStorage
- [x] Database migration 20 tables UUID triggers prevent negative stock
- [x] Seeds demo data no-human
- [x] Build 1955 modules 0.46kB html 42kB css 606kB js success
- [x] Dev server 5174 running
- [x] Docs ARCHITECTURE/DATABASE/SECURITY/DEPLOYMENT/META/DELIVERY/ENV/API/ROADMAP
- [x] .env.example, manifest.json, _headers, _redirects, _routes.json, 404.html, wrangler.toml

## Phase 2 - Backend Real

- [ ] Supabase project + run migrations + seeds
- [ ] RLS policies (single-store simpler: enable RLS but allow anon read products/categories, authenticated write)
- [ ] Auth admin: SUPER_ADMIN/STORE_ADMIN/STORE_MANAGER/STORE_EDITOR, bcrypt, sessions httpOnly secure, audit_logs
- [ ] Server API routes: products, orders 15-step real DB, customers, coupons, delivery, meta CAPI, analytics, media
- [ ] Storage: Supabase Storage bucket barka-nour-media public read, optimized images WebP
- [ ] Rate limiting middleware
- [ ] Security headers CSP

## Phase 3 - Features

- [ ] CSV import/export products/categories/orders/customers/inventory validation
- [ ] Abandoned carts tracking + email recovery (if email provided)
- [ ] Landing page builder drag-drop hero/text/product/collection/banner/CTA/image/FAQ/benefits/countdown
- [ ] Store customization logo/favicon/colors/fonts/header/footer/sections live preview
- [ ] PWA manifest + service worker offline cart
- [ ] SEO sitemap.xml, robots.txt, structured data Product/Offer/BreadcrumbList
- [ ] Accessibility keyboard/labels/focus/contrast audit

## Phase 4 - Integrations Real

- [ ] MesColis API real adapter (need docs)
- [ ] Aramex real adapter
- [ ] First/Best/Navex/INTIGO adapters
- [ ] Meta CAPI real endpoint + test_event_code
- [ ] Product feed XML endpoint

## Phase 5 - Polish & Deploy

- [ ] Code splitting admin routes lazy
- [ ] Pagination products/orders
- [ ] Skeletons loading, error boundaries, 404 page
- [ ] Empty states no human illustrations (use Package icon)
- [ ] Testing: vitest for orderService 15-step, coupon validation, stock prevent negative, phone TN, governorate 24, idempotency, price snapshot
- [ ] Cloudflare Pages deploy barkanour.tn custom domain
- [ ] Analytics daily/weekly/monthly charts Recharts
- [ ] Documentation final README with live URL

## Future Considerations

- If need multi-tenant SaaS (like Barka SaaS), add tenant_id UUID FK to all tables + RLS + subdomain routing. But Barka Nour stays single-store per spec.
- Mobile app via Capacitor
- WhatsApp order notifications (Tunisia popular)
- SMS via Tunisian provider
