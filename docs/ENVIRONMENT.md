# Environment Variables - Barka Nour

See `.env.example` for full list.

## Client (VITE_ prefix, safe to expose)

- VITE_SUPABASE_URL: https://xxx.supabase.co
- VITE_SUPABASE_ANON_KEY: anon key
- VITE_META_PIXEL_ID: 123456789...
- VITE_APP_NAME: Barka Nour
- VITE_APP_URL: https://barkanour.tn
- VITE_CURRENCY: TND
- VITE_DEFAULT_LANGUAGE: fr
- VITE_FREE_SHIPPING_THRESHOLD: 150
- VITE_STORAGE_BUCKET: barka-nour-media

## Server Only (never frontend)

- SUPABASE_SERVICE_ROLE_KEY: service_role, never VITE_
- DATABASE_URL: postgres connection string
- AUTH_SECRET: 32+ chars random
- META_CAPI_ACCESS_TOKEN: EAA...
- META_CAPI_TEST_EVENT_CODE: TEST...
- META_CATALOG_ID, META_APP_SECRET
- MESCOLIS_API_KEY, MESCOLIS_BASE_URL
- ARAMEX_USERNAME, PASSWORD, ACCOUNT_NUMBER, PIN
- FIRST_DELIVERY_TOKEN
- BEST_DELIVERY_API_KEY
- NAVEX_API_KEY
- INTIGO_API_KEY
- R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
- STORAGE_TYPE: supabase | r2 | local
- RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS, CORS_ORIGIN

## Cloudflare Pages

Set VITE_ vars in Pages dashboard > Settings > Environment variables. Server secrets if using Functions: set in same place but not prefixed VITE_.

## Local

cp .env.example .env.local and fill.
