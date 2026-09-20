/**
 * Barka Nour - Meta Integration
 * Pixel + Conversions API + Product Feed
 * Single-store architecture
 */

export type MetaEventName = 'PageView' | 'ViewContent' | 'Search' | 'AddToCart' | 'InitiateCheckout' | 'Purchase' | 'AddPaymentInfo' | 'Lead' | 'CompleteRegistration'

export interface MetaUserData {
  em?: string
  ph?: string
  fn?: string
  ln?: string
  ct?: string
  st?: string
  country?: string
  external_id?: string
  client_ip_address?: string
  client_user_agent?: string
  fbc?: string
  fbp?: string
}

export interface MetaCustomData {
  value?: number
  currency?: string
  content_ids?: string[]
  content_type?: string
  content_name?: string
  content_category?: string
  contents?: Array<{ id: string; quantity: number; item_price?: number }>
  num_items?: number
  search_string?: string
}

export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
}

export function trackPixelEvent(eventName: MetaEventName, customData?: MetaCustomData, eventId?: string) {
  if (typeof window === 'undefined') return
  const fbq = (window as any).fbq
  if (!fbq) {
    console.warn('[Barka Nour Meta] Pixel not loaded:', eventName)
    return
  }
  const eid = eventId || generateEventId()
  try {
    fbq('track', eventName, customData || {}, { eventID: eid })
    console.log(`[Barka Nour Meta] Pixel: ${eventName}`, { eventId: eid, customData })
    return eid
  } catch (e) {
    console.error('[Barka Nour Meta] Error', e)
    return eid
  }
}

export async function hashSHA256(value: string): Promise<string> {
  const normalized = value.trim().toLowerCase()
  const encoder = new TextEncoder()
  const data = encoder.encode(normalized)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function buildCAPIEvent(params: {
  event_name: MetaEventName
  event_id: string
  event_source_url: string
  user_data: MetaUserData
  custom_data?: MetaCustomData
  test_event_code?: string
}) {
  return {
    data: [{
      event_name: params.event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: params.event_id,
      event_source_url: params.event_source_url,
      action_source: 'website',
      user_data: params.user_data,
      custom_data: params.custom_data,
    }],
    test_event_code: params.test_event_code,
  }
}

export interface MetaProductFeedItem {
  id: string
  title: string
  description: string
  availability: 'in stock' | 'out of stock' | 'preorder' | 'available for order' | 'discontinued'
  condition: 'new' | 'refurbished' | 'used'
  price: string
  link: string
  image_link: string
  brand: string
  sku?: string
  product_type?: string
  sale_price?: string
}

export function generateProductFeed(products: Array<{
  id: string
  name: string
  description: string | null
  price: number
  compare_at_price: number | null
  stock_quantity: number
  images: string[]
  slug: string
  sku: string
}>, domain: string): MetaProductFeedItem[] {
  return products.map(p => ({
    id: p.id,
    title: p.name,
    description: p.description || p.name,
    availability: p.stock_quantity > 0 ? 'in stock' : 'out of stock',
    condition: 'new',
    price: `${p.price.toFixed(3)} TND`,
    link: `https://${domain}/products/${p.slug}`,
    image_link: p.images[0] || `https://${domain}/placeholder.png`,
    brand: 'Barka Nour',
    sku: p.sku,
    sale_price: p.compare_at_price && p.compare_at_price > p.price ? `${p.price.toFixed(3)} TND` : undefined,
  }))
}

declare global {
  interface Window {
    fbq?: any
  }
}
