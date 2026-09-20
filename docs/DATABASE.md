# Database - Barka Nour Single-Store (20 tables)

## Schema Overview

No tenant_id - single store.

### Core

- **store_settings**: id, name, slug unique, description, email, phone, address, currency TND, language_default, logo_url, favicon_url, timestamps
- **store_theme**: primary_color #b8860b, secondary_color #1a1a1a, accent, font_heading Fraunces, font_body Geist, header/footer layout, custom_css

### Auth

- **admin_users**: id, email unique, password_hash, role enum SUPER_ADMIN/STORE_ADMIN/STORE_MANAGER/STORE_EDITOR, full_name, is_active, last_login_at

### Catalog

- **categories**: id, name, slug unique, description, parent_id self-ref, image_url, is_active, sort_order, meta_title/desc
- **products**: id, name, slug unique, sku unique, short_description, description, price decimal(10,3) >=0, compare_at_price, cost_price, stock_quantity int >=0, low_stock_threshold, weight, status enum active/draft/archived, featured bool, images JSONB array, meta_title/desc
- **product_variants**: id, product_id FK cascade, sku unique, name, price >=0, stock_quantity >=0, attributes JSONB, image_url, is_active
- **product_categories**: product_id, category_id PK composite M2M
- **inventory_movements**: id, product_id FK, variant_id nullable, quantity_change int (positive restock, negative order), reason enum order/restock/adjustment/return/initial, reference_id (order id), notes, created_by admin, created_at

### Customers & Orders

- **customers**: id, full_name, phone unique (Tunisian), email nullable, governorate, city, address, postal_code, total_orders, total_spent decimal, timestamps. Index phone, governorate
- **orders**: id, order_number unique BN-YYMMDD-RAND, customer_id nullable FK, customer_name, customer_phone, customer_email, governorate NOT NULL (24 list), city, address, postal_code, notes, subtotal, shipping_fee, discount_amount default 0, total, currency TND default, payment_method default cod, payment_status enum pending/paid/failed/refunded, status enum 9 values pending/confirmed/preparing/shipped/out_for_delivery/delivered/cancelled/returned/failed, coupon_id nullable, idempotency_key unique, timestamps. Indexes order_number, status, customer, created DESC
- **order_items**: id, order_id FK cascade, product_id nullable, variant_id nullable, product_name snapshot NOT NULL, product_sku snapshot, variant_name, quantity >0, price snapshot, total, created_at. Index order_id
- **order_status_history**: id, order_id FK cascade, from_status nullable, to_status NOT NULL, notes, created_by admin, created_at. Index order

### Marketing

- **coupons**: id, code unique, type enum percentage/fixed, value >0, min_order_amount default 0, usage_limit nullable, usage_count default 0, is_active, expires_at, timestamps. Index code
- **coupon_usages**: id, coupon_id FK cascade, customer_id nullable, order_id nullable, discount_amount, used_at
- **abandoned_carts**: id, customer_id nullable, session_id, items JSONB, subtotal, email, phone, recovered bool default false, timestamps
- **analytics_events**: id, event_name, event_id unique (for dedup), user_id nullable, session_id nullable, properties JSONB, created_at. Indexes name, created DESC

### Delivery

- **delivery_configs**: id, provider text (mescolis, aramex, first_delivery, best_delivery, navex, intigo, mock), is_active bool, is_default bool, config JSONB (api keys etc encrypted in prod), status enum configured/not_configured/mock/test/production
- **shipments**: id, order_id FK cascade, provider, tracking_number nullable, status default pending, fee decimal, provider_response JSONB, timestamps. Index order

### Integrations

- **meta_integrations**: id, pixel_id nullable, capi_token_encrypted nullable (server only), catalog_id nullable, is_active bool, status, last_sync_at, config JSONB (events list), timestamps

### Content

- **landing_pages**: id, title, slug unique, description, blocks JSONB (hero, text, product, collection, banner, CTA, image, FAQ, benefits, countdown), is_active, meta_title/desc
- **media**: id, filename, original_name, mime_type, size int, url, alt_text, created_at

### Audit

- **audit_logs**: id, admin_user_id nullable FK, action, entity_type, entity_id nullable, details JSONB, ip_address, created_at. Indexes entity, created DESC

## Triggers

- update_updated_at() for 14 tables: store_settings, store_theme, admin_users, categories, products, product_variants, customers, coupons, orders, abandoned_carts, delivery_configs, shipments, meta_integrations, landing_pages
- prevent_negative_stock() for products, product_variants: raise exception if stock_quantity <0

## Constraints

- UUID PK default gen_random_uuid()
- CHECK price >=0, stock >=0, quantity >0, value >0
- CHECK status enums
- UNIQUE slug, sku, phone, order_number, code, idempotency_key, event_id

## Indexes

- slug, sku, phone, order_number, code, event_id
- parent_id, product_id, order_id, customer_id, etc.
- created_at DESC for orders, inventory, analytics, audit

## Demo Data

See seeds/001_demo_data.sql: store_settings, store_theme, 5 categories, 5 products object-only (Tapis Berbère 299TND stock 3 low, Bocaux 59 stock 42, Tote 45 stock 28, Argan 35.5 stock 15, Support 29.9 stock 33), coupons BIENVENUE10 10% min 50 limit 100, LIVRAISONGRATUITE fixed 10 min 150, delivery_configs mock default active + mescolis/aramex/first not_configured, meta_integrations not_configured, landing page example blocks.

## Single-Store vs Multi-Tenant

This schema has NO tenant_id. For multi-tenant SaaS (Barka SaaS), add tenant_id UUID FK to all tables + RLS policies. Here simplification intentional per spec: "ONE merchant/store Barka Nour only, NOT multi-tenant SaaS".
