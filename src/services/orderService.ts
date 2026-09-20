// Barka Nour - Order Service - Single Store
// Real order processing with server-side validation

import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Order, OrderItem, Cart } from '@/types'
import { generateOrderNumber, generateEventId } from '@/lib/utils'
import { productService } from './productService'
import { getDeliveryProvider } from '@/lib/delivery'

const mockOrders: Order[] = [
  {
    id: '1',
    order_number: 'BN-240915-AB12C',
    customer_id: '1',
    customer_name: 'Amira Ben Ahmed',
    customer_phone: '+216 22 345 678',
    customer_email: 'amira@exemple.tn',
    governorate: 'Tunis',
    city: 'Tunis',
    address: 'Rue Habib Bourguiba, Immeuble 12, Apt 3',
    postal_code: '1000',
    status: 'pending',
    subtotal: 344.000,
    discount: 34.400,
    delivery_fee: 7.000,
    total: 316.600,
    payment_method: 'cod',
    payment_status: 'pending',
    customer_notes: 'Livraison après 17h svp',
    internal_notes: null,
    coupon_code: 'BIENVENUE10',
    meta_event_id: '1714829-abc123',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    order_number: 'BN-240914-XZ99Y',
    customer_id: '2',
    customer_name: 'Mohamed Trabelsi',
    customer_phone: '+216 98 123 456',
    customer_email: null,
    governorate: 'Sfax',
    city: 'Sfax',
    address: 'Avenue 14 Janvier, Sfax',
    postal_code: '3000',
    status: 'confirmed',
    subtotal: 89.000,
    discount: 0,
    delivery_fee: 9.000,
    total: 98.000,
    payment_method: 'cod',
    payment_status: 'pending',
    customer_notes: null,
    internal_notes: 'Client fidèle',
    coupon_code: null,
    meta_event_id: null,
    created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

class OrderService {
  // Idempotency: prevent duplicate orders from double-click
  private idempotencyKeys = new Set<string>()

  async createOrder(params: {
    cart: Cart
    customer: {
      name: string
      phone: string
      email?: string
      governorate: string
      city: string
      address: string
      postal_code?: string
      notes?: string
    }
    idempotencyKey?: string
  }): Promise<Order> {
    // Idempotency check
    if (params.idempotencyKey && this.idempotencyKeys.has(params.idempotencyKey)) {
      throw new Error('Duplicate order submission detected')
    }

    // 1. Validate cart not empty
    if (!params.cart.items.length) throw new Error('Cart is empty')

    // 2. Fetch products from DB and validate availability (NEVER trust client prices)
    let subtotal = 0
    const orderItemsData: Partial<OrderItem>[] = []

    for (const item of params.cart.items) {
      const product = await productService.getProductById(item.product_id)
      if (!product) throw new Error(`Product ${item.product_id} not found`)
      if (product.status !== 'active') throw new Error(`Product ${product.name} not available`)
      
      // Check stock
      const hasStock = await productService.checkStock(item.product_id, item.quantity)
      if (!hasStock) throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock_quantity}`)

      // Use server-side price
      const unitPrice = product.sale_price || product.price
      const itemTotal = unitPrice * item.quantity
      subtotal += itemTotal

      orderItemsData.push({
        product_id: product.id,
        variant_id: item.variant_id || null,
        product_name: product.name, // Snapshot
        product_sku: product.sku, // Snapshot
        quantity: item.quantity,
        unit_price: unitPrice,
        discount: 0,
        total: itemTotal,
      })
    }

    // 3. Validate coupon server-side
    let discount = 0
    if (params.cart.coupon_code) {
      // In real impl: query coupons table, check active, expiration, usage limit, min order
      // For demo: simple 10% if code BIENVENUE10
      if (params.cart.coupon_code === 'BIENVENUE10') {
        discount = subtotal * 0.1
      } else if (params.cart.coupon_code === 'LIVRAISON') {
        discount = 0 // free delivery handled in delivery fee
      }
    }

    // 4. Calculate delivery fee server-side (by governorate)
    const deliveryProvider = getDeliveryProvider('mock')
    let deliveryFee = await deliveryProvider.calculateDeliveryFee(params.customer.governorate, params.customer.city)
    
    // Free delivery threshold
    if (subtotal >= 150) deliveryFee = 0
    if (params.cart.coupon_code === 'LIVRAISON' && subtotal >= 100) deliveryFee = 0

    // 5. Calculate final total server-side
    const total = subtotal - discount + deliveryFee

    // 6. Create customer if not exists (or get existing by phone)
    let customerId: string | null = null
    if (!isSupabaseConfigured()) {
      customerId = `cust-${Date.now()}`
    } else {
      const { data: existing } = await supabase.from('customers').select('id').eq('phone', params.customer.phone).maybeSingle()
      if (existing) {
        customerId = existing.id
      } else {
        const { data: newCust, error } = await supabase.from('customers').insert({
          name: params.customer.name,
          phone: params.customer.phone,
          email: params.customer.email || null,
          governorate: params.customer.governorate,
          city: params.customer.city,
          address: params.customer.address,
          postal_code: params.customer.postal_code || null,
        }).select('id').single()
        if (!error && newCust) customerId = newCust.id
      }
    }

    // 7. Generate order number and event_id for Meta deduplication
    const orderNumber = generateOrderNumber()
    const eventId = generateEventId()

    // 8. Create order
    const orderData = {
      order_number: orderNumber,
      customer_id: customerId,
      customer_name: params.customer.name,
      customer_phone: params.customer.phone,
      customer_email: params.customer.email || null,
      governorate: params.customer.governorate,
      city: params.customer.city,
      address: params.customer.address,
      postal_code: params.customer.postal_code || null,
      status: 'pending' as const,
      subtotal,
      discount,
      delivery_fee: deliveryFee,
      total,
      payment_method: 'cod' as const,
      payment_status: 'pending' as const,
      customer_notes: params.customer.notes || null,
      coupon_code: params.cart.coupon_code || null,
      meta_event_id: eventId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    let order: Order
    if (!isSupabaseConfigured()) {
      order = { id: `order-${Date.now()}`, ...orderData } as Order
      mockOrders.unshift(order)
    } else {
      const { data, error } = await supabase.from('orders').insert(orderData).select().single()
      if (error) throw error
      order = data as Order
    }

    // 9. Create order items as price snapshots
    const itemsWithOrder = orderItemsData.map(item => ({
      ...item,
      order_id: order.id,
      created_at: new Date().toISOString(),
    }))

    if (!isSupabaseConfigured()) {
      // Mock: store in memory
    } else {
      const { error } = await supabase.from('order_items').insert(itemsWithOrder)
      if (error) throw error
    }

    // 10. Update inventory (decrement stock)
    for (const item of params.cart.items) {
      await productService.updateStock(item.product_id, item.quantity, 'out', `Order ${order.order_number}`)
    }

    // 11. Create status history
    if (!isSupabaseConfigured()) {
      // Mock
    } else {
      await supabase.from('order_status_history').insert({
        order_id: order.id,
        from_status: null,
        to_status: 'pending',
        notes: 'Order created via storefront',
      })
    }

    // 12. Record analytics event
    if (!isSupabaseConfigured()) {
      // Mock
    } else {
      await supabase.from('analytics_events').insert({
        event_type: 'purchase',
        order_id: order.id,
        customer_id: customerId,
        metadata: { total, subtotal, delivery_fee: deliveryFee, governorate: params.customer.governorate, items: params.cart.items.length },
      })
    }

    // 13. Trigger Meta Purchase event (via Edge Function in production)
    // In production: call meta-capi function with event_id for deduplication

    // 14. Create shipment (mock)
    try {
      const shipment = await deliveryProvider.createShipment({
        order_id: order.id,
        recipient_name: params.customer.name,
        recipient_phone: params.customer.phone,
        governorate: params.customer.governorate,
        city: params.customer.city,
        address: params.customer.address,
        cod_amount: total,
        delivery_fee: deliveryFee,
      })
      if (!isSupabaseConfigured()) {
        // Mock
      } else {
        await supabase.from('shipments').insert({
          order_id: order.id,
          provider: deliveryProvider.name,
          tracking_number: shipment.tracking_number,
          status: 'pending',
          shipping_fee: deliveryFee,
        })
      }
    } catch (e) {
      console.warn('Failed to create shipment', e)
    }

    // 15. Mark idempotency key as used
    if (params.idempotencyKey) {
      this.idempotencyKeys.add(params.idempotencyKey)
      // Clean up after 1 hour
      setTimeout(() => this.idempotencyKeys.delete(params.idempotencyKey!), 3600000)
    }

    return order
  }

  async getOrders(filters?: { status?: string, search?: string, limit?: number }) {
    if (!isSupabaseConfigured()) {
      let result = [...mockOrders]
      if (filters?.status) result = result.filter(o => o.status === filters.status)
      if (filters?.search) result = result.filter(o => o.order_number.includes(filters.search!) || o.customer_name.toLowerCase().includes(filters.search!.toLowerCase()))
      if (filters?.limit) result = result.slice(0, filters.limit)
      return result
    }

    let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (filters?.status) query = query.eq('status', filters.status)
    if (filters?.search) query = query.or(`order_number.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%`)
    if (filters?.limit) query = query.limit(filters.limit)
    
    const { data, error } = await query
    if (error) throw error
    return data
  }

  async getOrderById(id: string) {
    if (!isSupabaseConfigured()) {
      return mockOrders.find(o => o.id === id) || null
    }
    const { data, error } = await supabase.from('orders').select('*, order_items(*), order_status_history(*), customers(*)').eq('id', id).single()
    if (error) throw error
    return data
  }

  async updateOrderStatus(orderId: string, newStatus: string, notes?: string) {
    if (!isSupabaseConfigured()) {
      const order = mockOrders.find(o => o.id === orderId)
      if (order) {
        order.status = newStatus as any
        order.updated_at = new Date().toISOString()
      }
      return order
    }

    // Get current status for history
    const { data: current } = await supabase.from('orders').select('status').eq('id', orderId).single()
    
    const { data, error } = await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId).select().single()
    if (error) throw error

    // Create history
    await supabase.from('order_status_history').insert({
      order_id: orderId,
      from_status: current?.status || null,
      to_status: newStatus,
      notes: notes || null,
    })

    // If cancelled, restore inventory
    if (newStatus === 'cancelled' || newStatus === 'returned') {
      const { data: items } = await supabase.from('order_items').select('product_id, quantity').eq('order_id', orderId)
      if (items) {
        for (const item of items) {
          await productService.updateStock(item.product_id, item.quantity, 'in', `Order ${orderId} ${newStatus}`)
        }
      }
    }

    return data
  }

  async getOrderStats() {
    const orders = await this.getOrders()
    const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)
    const pending = orders.filter(o => o.status === 'pending').length
    const delivered = orders.filter(o => o.status === 'delivered').length
    
    return {
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders: pending,
      deliveredOrders: delivered,
      averageOrderValue: orders.length ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length : 0,
    }
  }
}

export const orderService = new OrderService()
export { mockOrders }
