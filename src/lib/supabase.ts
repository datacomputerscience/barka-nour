import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key'
}

// Service layer abstraction for future migration
export interface DatabaseService {
  // Products
  getProducts(filters?: any): Promise<any[]>
  getProductBySlug(slug: string): Promise<any>
  createProduct(data: any): Promise<any>
  updateProduct(id: string, data: any): Promise<any>
  deleteProduct(id: string): Promise<void>
  
  // Orders
  createOrder(data: any): Promise<any>
  getOrders(filters?: any): Promise<any[]>
  updateOrderStatus(id: string, status: string): Promise<any>
  
  // Customers
  getCustomers(): Promise<any[]>
  createCustomer(data: any): Promise<any>
}

// Mock implementation for demo (real impl uses Supabase)
export class MockDatabaseService implements DatabaseService {
  async getProducts() {
    return []
  }
  async getProductBySlug() {
    return null
  }
  async createProduct(data: any) {
    return { id: 'mock-id', ...data }
  }
  async updateProduct(id: string, data: any) {
    return { id, ...data }
  }
  async deleteProduct() {}
  async createOrder(data: any) {
    return { id: 'mock-order-id', order_number: `BN-${Date.now()}`, ...data }
  }
  async getOrders() {
    return []
  }
  async updateOrderStatus(id: string, status: string) {
    return { id, status }
  }
  async getCustomers() {
    return []
  }
  async createCustomer(data: any) {
    return { id: 'mock-customer', ...data }
  }
}

export const dbService = new MockDatabaseService()
