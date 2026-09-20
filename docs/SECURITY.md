# Security - Barka Nour Single-Store

## Order Security 15-Step (server-side)

1. Validate required fields (fullName, phone, governorate 24, city, address)
2. Validate phone Tunisian format: +216 + 8 digits regex
3. Validate governorate in 24 list (Tunis, Ariana, Ben Arous, Manouba, Nabeul, Zaghouan, Bizerte, Béja, Jendouba, Le Kef, Siliana, Kairouan, Kasserine, Sidi Bouzid, Sousse, Monastir, Mahdia, Sfax, Gabès, Medenine, Tataouine, Gafsa, Tozeur, Kebili)
4. Fetch fresh product prices from server DB (never trust client)
5. Check stock real & prevent negative (stock_quantity >= quantity, DB check constraint)
6. Recalculate subtotal server-side (sum price * qty)
7. Validate coupon server-side: exists, active, not expired, usage_limit not reached, min_order_amount satisfied, calculate discount (percentage/fixed, min(subtotal))
8. Calculate delivery fee by governorate: Tunis 7 TND, other 10 TND
9. Free shipping if (subtotal - discount) >=150 TND
10. Calculate total server-side: subtotal - discount + shipping
11. Idempotency key check: if exists return existing order, prevent duplicate charges
12. Find/create customer by phone (unique phone): if not exists create, else update
13. Create order + order_items with price snapshot (product_name, sku, price at time) + order_status_history (pending)
14. Decrement inventory + create inventory_movements (reason order, reference order.id, quantity_change negative)
15. Create shipment via DeliveryProvider abstraction + emit Meta Pixel+CAPI Purchase event with same event_id for dedup

## Auth

- admin_users table: email unique, password_hash bcrypt (cost 12), role enum SUPER_ADMIN/STORE_ADMIN/STORE_MANAGER/STORE_EDITOR, is_active boolean, last_login_at
- Never store passwords manually, never expose service-role key frontend
- Secure cookies: httpOnly, secure (prod), sameSite strict, path /
- Sessions: JWT or Supabase Auth (future), hashing, audit_logs (admin_user_id, action, entity_type, entity_id, details JSONB, ip)
- Protected routes: /admin/* requires auth, redirect to /auth/login if not

## Validation & Sanitization

- Zod schemas for all inputs (product, order, coupon, customer)
- SQLi: Supabase parameterized queries, never string concat
- XSS: React auto-escapes, sanitize HTML if rich text (future DOMPurify)
- CSRF: SameSite cookies + CSRF token for forms (future)
- Rate limiting: 100 req / 15min per IP for API, 10 for auth, via middleware

## Headers

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://connect.facebook.net; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://graph.facebook.com;
```

## Secrets

- Never expose META_CAPI_ACCESS_TOKEN, SUPABASE_SERVICE_ROLE_KEY, DELIVERY API keys in frontend
- VITE_ prefix only for client-safe vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_META_PIXEL_ID)
- Server env: DATABASE_URL, AUTH_SECRET, META_CAPI_TOKEN, DELIVERY keys

## Inventory

- Prevent negative stock: DB CHECK stock_quantity >=0 + trigger prevent_negative_stock() + app validation before decrement
- Low-stock threshold: product.low_stock_threshold, alert if stock <= threshold
- Movements: inventory_movements table tracks all changes, reason enum, reference_id (order id), created_by admin

## Coupons

- Validation server-side: active, not expired, usage_limit, min_order_amount, type percentage/fixed, value >0
- coupon_usages table: track usage per customer/order, discount_amount snapshot
- Never trust client discount, recalc server

## Delivery

- Abstraction: DeliveryProvider interface, adapters for 6 Tunisian providers, mock if no docs
- No fake integration: if API docs unavailable, use MockDeliveryProvider and document credential requirement, status not_configured
- Statuses: configured/not_configured/mock/test/production label clearly

## Meta

- Pixel ID client safe, CAPI token server only
- event_id dedup: same ID for Pixel and CAPI same event, Meta dedupes
- hashSHA256 for PII (email, phone) server-side, never log plain
- Feed: generateProductFeed returns Meta-compatible fields, no human images
