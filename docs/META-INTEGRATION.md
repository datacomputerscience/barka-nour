# Meta Integration - Pixel + CAPI + Catalog

## Overview

- Pixel ID: client-side safe, exposed in frontend via VITE_META_PIXEL_ID
- CAPI Access Token: server-only, never frontend, env META_CAPI_ACCESS_TOKEN
- Catalog: product feed for Facebook Shop

## Events

PageView, ViewContent, Search, AddToCart, InitiateCheckout, AddPaymentInfo, Purchase, Lead

## Implementation

### Pixel (client)

```ts
trackPixelEvent(eventName, params, eventId)
- if window.fbq exists: fbq('track', eventName, params, {eventID: eventId})
- else console.log mock
```

Events with params:
- ViewContent: content_ids [product.id], content_type product, value, currency TND
- AddToCart: content_ids, content_type, value price*qty, currency, num_items
- InitiateCheckout: content_ids array, content_type product, value total, currency, num_items sum qty
- Purchase: content_ids, content_type, value total, currency, num_items

### CAPI (server)

```ts
hashSHA256(value): lowercased trimmed SHA256 hex
buildCAPIEvent({event_name, event_time, event_id, user_data: {email hashed, phone hashed, fbp, fbc, client_ip, client_user_agent}, custom_data: {content_ids, value, currency, num_items}, action_source: 'website'})
```

Server endpoint `/api/meta/capi` (future):
- Receives same event_id as Pixel
- Hashes PII server-side
- POST to https://graph.facebook.com/v19.0/{pixel_id}/events?access_token={token}
- Body: {data: [event], test_event_code optional}

### Deduplication

Same event_id for Pixel and CAPI same user action:
- Client generates eventId via generateEventId() = Date.now + random
- Client sends Pixel with eventId
- Server sends CAPI with same eventId
- Meta dedupes by event_id + event_name

### Feed

`generateProductFeed(products): MetaProductFeedItem[]`

Fields:
- id: product.id
- title: product.name
- description: product.description (no human images mention)
- availability: stock_quantity >0 ? 'in stock' : 'out of stock'
- condition: 'new'
- price: `${price} TND`
- link: `https://barkanour.tn/products/${slug}`
- image_link: first image url (object-only)
- brand: 'Barka Nour'
- google_product_category, fb_product_category
- quantity_to_sell_on_facebook: stock_quantity

Endpoint `/api/meta/feed` returns XML or CSV (future). Currently mock.

### Status

- not_configured: no pixel_id, no token
- configured: pixel_id + token present
- test: using test_event_code
- production: live events

Never expose token frontend. Label clearly in admin UI.

### No-Human Policy in Feed

All product images must be object-only, neutral background, no people. Feed image_link must respect policy.

### Example Purchase Event

```json
{
  "event_name": "Purchase",
  "event_time": 1726820000,
  "event_id": "evt_abc123",
  "user_data": {
    "em": ["hash email"],
    "ph": ["hash phone"],
    "client_ip_address": "1.2.3.4",
    "client_user_agent": "Mozilla..."
  },
  "custom_data": {
    "content_ids": ["prod_1", "prod_2"],
    "content_type": "product",
    "value": 299,
    "currency": "TND",
    "num_items": 1
  },
  "action_source": "website"
}
```
