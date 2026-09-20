// Barka Nour - Single Store Types

export type ProductStatus = 'draft' | 'active' | 'out_of_stock' | 'archived'
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned' | 'failed'
export type PaymentMethod = 'cod'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type AdminRole = 'SUPER_ADMIN' | 'STORE_ADMIN' | 'STORE_MANAGER' | 'STORE_EDITOR'

export interface Product {
  id: string
  name: string
  slug: string
  short_description: string | null
  description: string | null
  sku: string
  price: number
  compare_at_price: number | null
  sale_price: number | null
  cost_price: number | null
  stock_quantity: number
  low_stock_threshold: number
  status: ProductStatus
  featured: boolean
  images: string[]
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
  categories?: Category[]
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  sku: string
  price: number | null
  stock_quantity: number
  attributes: Record<string, string> // { size: 'M', color: 'Beige' }
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  sort_order: number
  active: boolean
  product_count?: number
  children?: Category[]
  created_at: string
  updated_at: string
}

export interface InventoryMovement {
  id: string
  product_id: string
  variant_id: string | null
  quantity: number
  movement_type: 'in' | 'out' | 'adjustment' | 'reserved' | 'released' | 'return'
  reference: string | null
  reference_id: string | null
  created_by: string | null
  created_at: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string | null
  address: string | null
  governorate: string | null
  city: string | null
  postal_code: string | null
  notes: string | null
  total_orders: number
  total_spent: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_id: string | null
  customer_name: string
  customer_phone: string
  customer_email: string | null
  governorate: string
  city: string
  address: string
  postal_code: string | null
  status: OrderStatus
  subtotal: number
  discount: number
  delivery_fee: number
  total: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  customer_notes: string | null
  internal_notes: string | null
  coupon_code: string | null
  meta_event_id: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
  status_history?: OrderStatusHistory[]
  customer?: Customer
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string | null
  product_name: string
  product_sku: string
  quantity: number
  unit_price: number
  discount: number
  total: number
  created_at: string
}

export interface OrderStatusHistory {
  id: string
  order_id: string
  from_status: string | null
  to_status: string
  notes: string | null
  created_by: string | null
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  min_order_amount: number | null
  max_discount_amount: number | null
  usage_limit: number | null
  used_count: number
  per_customer_limit: number | null
  active: boolean
  starts_at: string | null
  expires_at: string | null
  created_at: string
  updated_at: string
}

export interface CartItem {
  product_id: string
  variant_id: string | null
  quantity: number
  product?: Product
  variant?: ProductVariant
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  discount: number
  delivery_fee: number
  total: number
  coupon_code: string | null
}

export interface DeliveryConfig {
  id: string
  governorate: string
  city: string | null
  fee: number
  free_threshold: number | null
  estimated_days: number
  active: boolean
}

export interface Shipment {
  id: string
  order_id: string
  provider: string
  tracking_number: string | null
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned' | 'cancelled'
  shipping_fee: number
  created_at: string
  updated_at: string
}

export interface MetaIntegration {
  id: string
  pixel_id: string | null
  dataset_id: string | null
  catalog_id: string | null
  access_token_encrypted: string | null
  test_event_code: string | null
  is_active: boolean
  events_enabled: string[]
}

export interface StoreSettings {
  id: string
  store_name: string
  logo_url: string | null
  favicon_url: string | null
  email: string | null
  phone: string | null
  address: string | null
  currency: string
  tax_rate: number
  low_stock_threshold: number
  free_delivery_threshold: number | null
  default_delivery_fee: number
  cod_enabled: boolean
  seo_title: string | null
  seo_description: string | null
  social_facebook: string | null
  social_instagram: string | null
  social_tiktok: string | null
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  active: boolean
  last_login: string | null
  created_at: string
}

export interface AnalyticsEvent {
  id: string
  event_type: 'page_view' | 'product_view' | 'search' | 'add_to_cart' | 'remove_from_cart' | 'initiate_checkout' | 'purchase' | 'abandoned_cart'
  product_id: string | null
  order_id: string | null
  customer_id: string | null
  session_id: string | null
  metadata: Record<string, any>
  created_at: string
}

export interface LandingPage {
  id: string
  slug: string
  title: string
  content: any
  seo_title: string | null
  seo_description: string | null
  published: boolean
  views_count: number
  created_at: string
  updated_at: string
}
