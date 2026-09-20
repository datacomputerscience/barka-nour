# API - Barka Nour Single-Store

## Products

- GET /api/products - list active, filters ?category, ?search, ?featured, ?status, pagination ?page & ?limit
- GET /api/products/:slug - detail
- POST /api/products - create (admin), body: name, slug, sku, price, stock, images object-only, status, featured, meta
- PUT /api/products/:id - update
- DELETE /api/products/:id - soft or hard
- POST /api/products/:id/stock - adjust stock, body: quantity_change, reason, notes

## Categories

- GET /api/categories - list parent/child tree
- POST /api/categories - create
- PUT /api/categories/:id

## Orders (secure 15-step)

- POST /api/orders - create order secure, body: customer_name, phone TN, email opt, governorate 24, city, address, postal, notes, items [{product_id, variant_id?, qty}], coupon_code?, idempotency_key, payment_method cod
- Server recalculates all totals, never trust client
- GET /api/orders - admin list, filters status, governorate, pagination
- GET /api/orders/:order_number - detail with items snapshot + status history
- PUT /api/orders/:id/status - update status, body: to_status, notes, creates history
- POST /api/orders/:id/ship - create shipment via DeliveryProvider

## Customers

- GET /api/customers - list, search by phone
- GET /api/customers/:id - detail with orders
- POST /api/customers - findOrCreate by phone

## Coupons

- GET /api/coupons
- POST /api/coupons - code, type percentage/fixed, value, min_order, usage_limit, expires_at
- POST /api/coupons/validate - body: code, subtotal -> returns discount

## Delivery

- GET /api/delivery/providers - list with status configured/not_configured/mock/test/production
- POST /api/delivery/calculate - body: governorate, city, subtotal -> fee
- POST /api/delivery/shipments - create shipment
- GET /api/delivery/shipments/:id/track

## Meta

- GET /api/meta/feed - product feed XML/CSV Meta-compatible
- POST /api/meta/capi - proxy CAPI event server-side (event_name, event_id, user_data hashed, custom_data)
- GET /api/meta/events - logs

## Analytics

- POST /api/analytics/events - track event: event_name, event_id unique, properties
- GET /api/analytics/revenue?period=daily|weekly|monthly
- GET /api/analytics/funnel - PageView -> ViewContent -> AddToCart -> Checkout -> Purchase conversion

## Media

- POST /api/media/upload - multipart, returns url, optimized
- GET /api/media - list
- DELETE /api/media/:id

## Store

- GET /api/store/settings - single row
- PUT /api/store/settings - admin
- GET /api/store/theme
- PUT /api/store/theme

## Auth

- POST /api/auth/login - email, password -> session cookie httpOnly secure
- POST /api/auth/logout
- GET /api/auth/me

## Security

- All POST/PUT require auth except /api/orders (public checkout) + /api/coupons/validate + /api/delivery/calculate + /api/analytics/events
- Rate limit: 100/15min IP, 10 for auth
- Validation: Zod schemas, server-side price recalc, stock check, phone TN, governorate 24, coupon server
- Idempotency: header X-Idempotency-Key or body idempotency_key for orders
