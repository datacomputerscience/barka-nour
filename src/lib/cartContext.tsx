import React, { createContext, useContext, useState, useEffect } from 'react'
import { CartItem } from '@/pages/storefront/CartPage'
import { mockProducts } from '@/services/productService'

interface CartContextType {
  items: CartItem[]
  count: number
  subtotal: number
  addItem: (productId: string, qty?: number, variant?: string) => void
  updateQty: (itemId: string, qty: number) => void
  removeItem: (itemId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('bn_cart')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('bn_cart', JSON.stringify(items))
  }, [items])

  const addItem = (productId: string, qty = 1, variant?: string) => {
    const product = mockProducts.find(p => p.id === productId)
    if (!product) return
    setItems(prev => {
      const existing = prev.find(i => i.product_id === productId && i.variant === variant)
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: Math.min(i.stock, i.quantity + qty) } : i)
      }
      return [...prev, {
        id: `${productId}-${variant || 'base'}-${Date.now()}`,
        product_id: productId,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        price: product.price,
        quantity: qty,
        stock: product.stock_quantity,
        variant,
      }]
    })
  }

  const updateQty = (itemId: string, qty: number) => {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: Math.max(1, Math.min(i.stock, qty)) } : i))
  }

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId))
  }

  const clear = () => setItems([])

  const count = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, count, subtotal, addItem, updateQty, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
