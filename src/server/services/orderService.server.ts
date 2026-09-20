/**
 * Server-side Order Service - 15-step secure validation
 * NEVER trust client totals - recalculate server-side
 * Single-store Barka Nour - no tenant_id
 */

import type { Order, OrderItem } from '@/types'

interface CreateOrderInput {
  customer_name: string
  customer_phone: string
  customer_email?: string
  governorate: string
  city: string
  address: string
  postal_code?: string
  notes?: string
  items: { product_id: string; variant_id?: string; quantity: number }[]
  coupon_code?: string
  idempotency_key: string
  payment_method?: string
}

const GOVERNORATES = [
  "Tunis","Ariana","Ben Arous","Manouba","Nabeul","Zaghouan","Bizerte","Béja","Jendouba","Le Kef","Siliana","Kairouan","Kasserine","Sidi Bouzid","Sousse","Monastir","Mahdia","Sfax","Gabès","Medenine","Tataouine","Gafsa","Tozeur","Kebili",
]

export function validatePhoneTN(phone: string): boolean {
  return /^(\+216)?[0-9]{8}$/.test(phone.replace(/\s/g, ''))
}

export async function createOrderSecure(input: CreateOrderInput, db: any) {
  // Step 1: Validate required fields
  if (!input.customer_name || !input.customer_phone || !input.governorate || !input.city || !input.address) {
    throw new Error('Missing required fields')
  }

  // Step 2: Validate phone TN format
  if (!validatePhoneTN(input.customer_phone)) {
    throw new Error('Invalid Tunisian phone format')
  }

  // Step 3: Validate governorate in 24 list
  if (!GOVERNORATES.includes(input.governorate)) {
    throw new Error(`Invalid governorate. Must be one of 24: ${GOVERNORATES.join(', ')}`)
  }

  // Step 4: Fetch fresh product prices from server (never trust client)
  const productIds = input.items.map(i => i.product_id)
  const products = await db.getProductsByIds(productIds)
  if (products.length !== productIds.length) {
    throw new Error('Some products not found')
  }

  // Step 5: Check stock real & prevent negative
  for (const item of input.items) {
    const product = products.find((p: any) => p.id === item.product_id)
    if (!product) throw new Error(`Product ${item.product_id} not found`)
    if (product.stock_quantity < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}: ${product.stock_quantity} available, ${item.quantity} requested`)
    }
  }

  // Step 6: Recalculate subtotal server-side
  let subtotal = 0
  for (const item of input.items) {
    const product = products.find((p: any) => p.id === item.product_id)
    subtotal += product.price * item.quantity
  }

  // Step 7: Validate coupon server-side
  let discount = 0
  let coupon = null
  if (input.coupon_code) {
    coupon = await db.getCouponByCode(input.coupon_code)
    if (!coupon || !coupon.is_active) throw new Error('Invalid coupon')
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) throw new Error('Coupon expired')
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) throw new Error('Coupon usage limit reached')
    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) throw new Error(`Min order ${coupon.min_order_amount} TND required for coupon`)
    
    discount = coupon.type === 'percentage' ? subtotal * (coupon.value / 100) : coupon.value
    discount = Math.min(discount, subtotal) // never exceed subtotal
  }

  // Step 8: Calculate delivery fee by governorate
  const deliveryFee = input.governorate === 'Tunis' ? 7 : 10

  // Step 9: Free shipping if >=150 TND
  const finalShipping = (subtotal - discount) >= 150 ? 0 : deliveryFee

  // Step 10: Calculate total server-side
  const total = subtotal - discount + finalShipping

  // Step 11: Idempotency key check
  const existing = await db.getOrderByIdempotencyKey(input.idempotency_key)
  if (existing) {
    return existing // return existing order, prevent duplicate
  }

  // Step 12: Find/create customer by phone
  let customer = await db.getCustomerByPhone(input.customer_phone)
  if (!customer) {
    customer = await db.createCustomer({
      full_name: input.customer_name,
      phone: input.customer_phone,
      email: input.customer_email,
      governorate: input.governorate,
      city: input.city,
      address: input.address,
    })
  }

  // Step 13: Create order + order_items price snapshot + order_status_history
  const orderNumber = `BN-${new Date().toISOString().slice(2,10).replace(/-/g,'')}-${Math.random().toString(36).substring(2,7).toUpperCase()}`
  const order = await db.createOrder({
    order_number: orderNumber,
    customer_id: customer.id,
    customer_name: input.customer_name,
    customer_phone: input.customer_phone,
    customer_email: input.customer_email,
    governorate: input.governorate,
    city: input.city,
    address: input.address,
    postal_code: input.postal_code,
    notes: input.notes,
    subtotal,
    shipping_fee: finalShipping,
    discount_amount: discount,
    total,
    currency: 'TND',
    payment_method: input.payment_method || 'cod',
    coupon_id: coupon?.id,
    idempotency_key: input.idempotency_key,
    status: 'pending',
  })

  for (const item of input.items) {
    const product = products.find((p: any) => p.id === item.product_id)
    await db.createOrderItem({
      order_id: order.id,
      product_id: product.id,
      variant_id: item.variant_id,
      product_name: product.name, // snapshot
      product_sku: product.sku, // snapshot
      quantity: item.quantity,
      price: product.price, // snapshot server price
      total: product.price * item.quantity,
    })
  }

  await db.createOrderStatusHistory({
    order_id: order.id,
    from_status: null,
    to_status: 'pending',
    notes: 'Order created via secure 15-step validation',
  })

  // Step 14: Decrement inventory + inventory_movements
  for (const item of input.items) {
    await db.decrementStock(item.product_id, item.quantity)
    await db.createInventoryMovement({
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity_change: -item.quantity,
      reason: 'order',
      reference_id: order.id,
      notes: `Order ${orderNumber}`,
    })
  }

  // Step 15: Create shipment + emit Meta events (handled by caller)
  // Shipment creation via DeliveryProvider abstraction
  // Meta Pixel+CAPI Purchase event with event_id dedup

  return order
}
