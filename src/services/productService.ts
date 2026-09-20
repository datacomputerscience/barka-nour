// Barka Nour - Product Service - Single Store
// Real product management with inventory, variants, categories

import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Product, ProductVariant } from '@/types'
import { slugify, generateSKU } from '@/lib/utils'

// Mock data for demo (single-store, no tenant_id)
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Tapis Berbère - Laine naturelle - 120x180 - Écru',
    slug: 'tapis-berbere-laine-ecru',
    short_description: 'Tapis tissé main, laine naturelle, motif berbère authentique',
    description: 'Tapis berbère authentique tissé à la main en laine naturelle. Motif géométrique traditionnel, couleur écru naturel. Dimensions 120x180cm. Fabriqué par artisans de Kairouan. Photo: tapis posé sur sol bois clair, lumière naturelle, sans personnes.',
    sku: 'BN-TAPIS-001',
    price: 299.000,
    compare_at_price: 399.000,
    sale_price: 299.000,
    cost_price: 150.000,
    stock_quantity: 12,
    low_stock_threshold: 3,
    status: 'active',
    featured: true,
    images: [],
    seo_title: 'Tapis Berbère Laine Naturelle - Barka Nour',
    seo_description: 'Tapis berbère tissé main, laine naturelle, 120x180, écru..',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Set 3 Bocaux Verre Borosilicate - Cuisine - 500/750/1000ml',
    slug: 'set-bocaux-verre-borosilicate',
    short_description: 'Set bocaux verre borosilicate avec couvercle bambou',
    description: 'Set de 3 bocaux en verre borosilicate résistant, couvercles bambou naturel. Capacités 500, 750, 1000ml. Pour cuisine, rangement sec. Photo: bocaux alignés sur étagère bois clair, sans personnes.',
    sku: 'BN-BOCAUX-002',
    price: 59.000,
    compare_at_price: null,
    sale_price: null,
    cost_price: 28.000,
    stock_quantity: 34,
    low_stock_threshold: 5,
    status: 'active',
    featured: true,
    images: [],
    seo_title: 'Bocaux Verre Borosilicate - Barka Nour',
    seo_description: 'Set 3 bocaux verre borosilicate, couvercle bambou, cuisine.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Sac Tote Coton Bio - Naturel - 38x42cm',
    slug: 'sac-tote-coton-bio-naturel',
    short_description: 'Sac tote coton bio, naturel, anses longues',
    description: 'Sac tote en coton bio certifié, couleur naturel écru, dimensions 38x42cm, anses longues 65cm. Résistant, lavable. Photo: sac posé sur table bois clair, lumière naturelle, objet-only, sans modèle humain.',
    sku: 'BN-TOTE-003',
    price: 45.000,
    compare_at_price: 60.000,
    sale_price: 45.000,
    cost_price: 18.000,
    stock_quantity: 28,
    low_stock_threshold: 5,
    status: 'active',
    featured: true,
    images: [],
    seo_title: 'Sac Tote Coton Bio - Barka Nour',
    seo_description: 'Sac tote coton bio naturel, 38x42cm, anses longues.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Huile Argan Pure - Pressée à froid - 50ml - Flacon verre ambré',
    slug: 'huile-argan-pure-50ml',
    short_description: 'Huile argan pure, pressée à froid, 50ml',
    description: 'Huile d\'argan pure 100%, pressée à froid, 50ml, flacon verre ambré avec pipette. Pour visage, corps, cheveux. Origine Tunisie. Photo: flacon sur fond neutre beige, packaging, sans personnes.',
    sku: 'BN-ARGAN-004',
    price: 35.500,
    compare_at_price: null,
    sale_price: null,
    cost_price: 15.000,
    stock_quantity: 42,
    low_stock_threshold: 10,
    status: 'active',
    featured: true,
    images: [],
    seo_title: 'Huile Argan Pure 50ml - Barka Nour',
    seo_description: 'Huile argan pure pressée à froid, 50ml, flacon verre ambré.',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Support Smartphone Aluminium Pliable - Noir mat',
    slug: 'support-smartphone-alu-noir',
    short_description: 'Support smartphone aluminium pliable, noir mat',
    description: 'Support smartphone en aluminium, pliable, noir mat, angle réglable. Pour bureau. Photo: support sur bureau blanc avec smartphone, sans mains humaines.',
    sku: 'BN-TECH-005',
    price: 29.900,
    compare_at_price: null,
    sale_price: null,
    cost_price: 12.000,
    stock_quantity: 3,
    low_stock_threshold: 5,
    status: 'active',
    featured: false,
    images: [],
    seo_title: 'Support Smartphone Alu - Barka Nour',
    seo_description: 'Support smartphone aluminium pliable noir mat.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

class ProductService {
  // Get all products with filters
  async getProducts(filters?: { status?: string, featured?: boolean, search?: string, category?: string, limit?: number, offset?: number }) {
    if (!isSupabaseConfigured()) {
      let result = [...mockProducts]
      if (filters?.status) result = result.filter(p => p.status === filters.status)
      if (filters?.featured) result = result.filter(p => p.featured)
      if (filters?.search) result = result.filter(p => p.name.toLowerCase().includes(filters.search!.toLowerCase()))
      if (filters?.limit) result = result.slice(0, filters.limit)
      return result
    }

    let query = supabase.from('products').select('*')
    if (filters?.status) query = query.eq('status', filters.status)
    if (filters?.featured) query = query.eq('featured', true)
    if (filters?.search) query = query.ilike('name', `%${filters.search}%`)
    if (filters?.limit) query = query.limit(filters.limit)
    
    const { data, error } = await query
    if (error) throw error
    return data
  }

  async getProductBySlug(slug: string) {
    if (!isSupabaseConfigured()) {
      return mockProducts.find(p => p.slug === slug) || null
    }
    const { data, error } = await supabase.from('products').select('*, product_categories(category_id), product_variants(*)').eq('slug', slug).single()
    if (error) throw error
    return data
  }

  async getProductById(id: string) {
    if (!isSupabaseConfigured()) {
      return mockProducts.find(p => p.id === id) || null
    }
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
    if (error) throw error
    return data
  }

  async createProduct(data: Partial<Product>) {
    const productData = {
      ...data,
      slug: data.slug || slugify(data.name || ''),
      sku: data.sku || generateSKU('BN'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (!isSupabaseConfigured()) {
      const newProduct = { id: `mock-${Date.now()}`, ...productData } as Product
      mockProducts.unshift(newProduct)
      return newProduct
    }

    const { data: product, error } = await supabase.from('products').insert(productData).select().single()
    if (error) throw error
    return product
  }

  async updateProduct(id: string, data: Partial<Product>) {
    const updateData = { ...data, updated_at: new Date().toISOString() }
    
    if (!isSupabaseConfigured()) {
      const idx = mockProducts.findIndex(p => p.id === id)
      if (idx >= 0) {
        mockProducts[idx] = { ...mockProducts[idx], ...updateData } as Product
        return mockProducts[idx]
      }
      throw new Error('Product not found')
    }

    const { data: product, error } = await supabase.from('products').update(updateData).eq('id', id).select().single()
    if (error) throw error
    return product
  }

  async deleteProduct(id: string) {
    if (!isSupabaseConfigured()) {
      const idx = mockProducts.findIndex(p => p.id === id)
      if (idx >= 0) mockProducts.splice(idx, 1)
      return
    }
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
  }

  async getFeaturedProducts(limit = 6) {
    return this.getProducts({ featured: true, status: 'active', limit })
  }

  async getRelatedProducts(productId: string, category?: string, limit = 4) {
    let products = await this.getProducts({ status: 'active', limit: 10 })
    return products.filter(p => p.id !== productId).slice(0, limit)
  }

  // Inventory management
  async updateStock(productId: string, quantity: number, type: 'in' | 'out' | 'adjustment', reference?: string) {
    if (!isSupabaseConfigured()) {
      const product = mockProducts.find(p => p.id === productId)
      if (product) {
        if (type === 'out') {
          if (product.stock_quantity < quantity) throw new Error('Insufficient stock')
          product.stock_quantity -= quantity
        } else if (type === 'in') {
          product.stock_quantity += quantity
        } else {
          product.stock_quantity = quantity
        }
        product.updated_at = new Date().toISOString()
      }
      return
    }

    // Use RPC for safe stock update
    const { error } = await supabase.rpc('update_product_stock', {
      product_id: productId,
      qty: type === 'out' ? -quantity : quantity,
      movement_type: type,
      ref: reference,
    })
    if (error) throw error
  }

  async checkStock(productId: string, requestedQty: number): Promise<boolean> {
    const product = await this.getProductById(productId)
    if (!product) return false
    return product.stock_quantity >= requestedQty
  }
}

export const productService = new ProductService()
export { mockProducts }
