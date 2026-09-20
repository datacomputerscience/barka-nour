/**
 * Barka Nour - Delivery Provider Abstraction
 * Single-store, extensible for Tunisian providers
 */

export type ShipmentStatus = 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned' | 'cancelled'

export interface ShipmentData {
  order_id: string
  recipient_name: string
  recipient_phone: string
  governorate: string
  city: string
  address: string
  cod_amount: number
  delivery_fee: number
  weight?: number
}

export interface DeliveryProvider {
  name: string
  displayName: string
  createShipment(data: ShipmentData): Promise<{ tracking_number: string; response: any }>
  getShipment(tracking_number: string): Promise<any>
  trackShipment(tracking_number: string): Promise<{ status: ShipmentStatus; history: any[] }>
  cancelShipment(tracking_number: string): Promise<boolean>
  calculateDeliveryFee(governorate: string, city?: string, weight?: number): Promise<number>
  validateCredentials(credentials: Record<string, string>): Promise<boolean>
}

export class MockDeliveryProvider implements DeliveryProvider {
  name = 'mock'
  displayName = 'Mock Provider (Test)'

  async createShipment(data: ShipmentData) {
    await new Promise(r => setTimeout(r, 300))
    return {
      tracking_number: `BN-MOCK-${Date.now()}-${Math.random().toString(36).substr(2,4).toUpperCase()}`,
      response: { mock: true, ...data, created_at: new Date().toISOString() }
    }
  }

  async getShipment(tracking_number: string) {
    return {
      tracking_number,
      status: 'in_transit' as ShipmentStatus,
      provider: 'mock',
    }
  }

  async trackShipment(_tracking_number: string) {
    return {
      status: 'in_transit' as ShipmentStatus,
      history: [
        { status: 'pending', timestamp: new Date(Date.now() - 86400000).toISOString(), location: 'Barka Nour Warehouse' },
        { status: 'picked_up', timestamp: new Date(Date.now() - 43200000).toISOString(), location: 'Tunis Hub' },
        { status: 'in_transit', timestamp: new Date().toISOString(), location: 'En route to customer' },
      ]
    }
  }

  async cancelShipment() {
    return true
  }

  async calculateDeliveryFee(governorate: string) {
    const fees: Record<string, number> = {
      'Tunis': 7, 'Ariana': 7, 'Ben Arous': 7, 'Manouba': 7.5,
      'Nabeul': 8, 'Bizerte': 8.5, 'Sousse': 8, 'Sfax': 9,
      'default': 10
    }
    return fees[governorate] || fees.default
  }

  async validateCredentials() {
    return true
  }
}

export const TUNISIAN_PROVIDERS = [
  { id: 'mock', name: 'Mock Provider (Test)', description: 'For development - no real API', requiresCredentials: false, status: 'active' as const },
  { id: 'mescolis', name: 'MesColis', description: 'Tunisian delivery - requires API credentials', requiresCredentials: true, status: 'not_configured' as const, docsUrl: 'https://mescolis.tn' },
  { id: 'aramex', name: 'Aramex Tunisia', description: 'International & local', requiresCredentials: true, status: 'not_configured' as const },
  { id: 'first_delivery', name: 'First Delivery', description: 'Tunisian delivery', requiresCredentials: true, status: 'not_configured' as const },
  { id: 'best_delivery', name: 'Best Delivery', description: 'Tunisian delivery', requiresCredentials: true, status: 'not_configured' as const },
  { id: 'navex', name: 'Navex', description: 'Tunisian logistics', requiresCredentials: true, status: 'not_configured' as const },
  { id: 'intigo', name: 'INTIGO', description: 'Tunisian delivery platform', requiresCredentials: true, status: 'not_configured' as const },
]

export function getDeliveryProvider(providerId: string = 'mock'): DeliveryProvider {
  if (providerId !== 'mock') {
    console.warn(`Provider ${providerId} requires real API credentials. Using MockDeliveryProvider.`)
  }
  return new MockDeliveryProvider()
}
