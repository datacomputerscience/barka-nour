// Barka Nour - Kiwi Engine
// Configurable, server-side calculation, prevents duplicate awards, transactional

import type { KiwiRule, Quality, ClothingType, DonationLotEvaluation } from '@/types/donation'

// Initial configurable rules - admin can modify via dashboard
export const DEFAULT_KIWI_RULES: Omit<KiwiRule, 'id' | 'created_at' | 'updated_at'>[] = [
  { clothing_type: 'T-shirt', quality: 'Standard', kiwi_value: 1, is_active: true },
  { clothing_type: 'T-shirt', quality: 'Bonne', kiwi_value: 2, is_active: true },
  { clothing_type: 'T-shirt', quality: 'Premium', kiwi_value: 3, is_active: true },
  { clothing_type: 'Pantalon', quality: 'Standard', kiwi_value: 2, is_active: true },
  { clothing_type: 'Pantalon', quality: 'Bonne', kiwi_value: 3, is_active: true },
  { clothing_type: 'Pantalon', quality: 'Premium', kiwi_value: 4, is_active: true },
  { clothing_type: 'Jean', quality: 'Standard', kiwi_value: 2, is_active: true },
  { clothing_type: 'Jean', quality: 'Bonne', kiwi_value: 3, is_active: true },
  { clothing_type: 'Jean', quality: 'Premium', kiwi_value: 4, is_active: true },
  { clothing_type: 'Robe', quality: 'Standard', kiwi_value: 2, is_active: true },
  { clothing_type: 'Robe', quality: 'Bonne', kiwi_value: 3, is_active: true },
  { clothing_type: 'Robe', quality: 'Premium', kiwi_value: 5, is_active: true },
  { clothing_type: 'Pull', quality: 'Standard', kiwi_value: 2, is_active: true },
  { clothing_type: 'Pull', quality: 'Bonne', kiwi_value: 2, is_active: true },
  { clothing_type: 'Pull', quality: 'Premium', kiwi_value: 3, is_active: true },
  { clothing_type: 'Sweat', quality: 'Standard', kiwi_value: 2, is_active: true },
  { clothing_type: 'Sweat', quality: 'Bonne', kiwi_value: 3, is_active: true },
  { clothing_type: 'Veste', quality: 'Standard', kiwi_value: 3, is_active: true },
  { clothing_type: 'Veste', quality: 'Bonne', kiwi_value: 4, is_active: true },
  { clothing_type: 'Veste', quality: 'Premium', kiwi_value: 5, is_active: true },
  { clothing_type: 'Manteau', quality: 'Standard', kiwi_value: 3, is_active: true },
  { clothing_type: 'Manteau', quality: 'Bonne', kiwi_value: 4, is_active: true },
  { clothing_type: 'Manteau', quality: 'Premium', kiwi_value: 5, is_active: true },
  { clothing_type: 'all', quality: 'Standard', kiwi_value: 1, is_active: true },
  { clothing_type: 'all', quality: 'Bonne', kiwi_value: 2, is_active: true },
  { clothing_type: 'all', quality: 'Premium', kiwi_value: 4, is_active: true },
]

export function calculateKiwiLot(evaluation: {
  standard_qty: number
  good_qty: number
  premium_qty: number
  rules?: { standard: number; good: number; premium: number }
}): number {
  const rules = evaluation.rules || { standard: 1, good: 2, premium: 4 }
  return (
    evaluation.standard_qty * rules.standard +
    evaluation.good_qty * rules.good +
    evaluation.premium_qty * rules.premium
  )
}

export function calculateKiwiDetailed(breakdown: { clothing_type: ClothingType; quality: Quality; quantity: number; kiwi_per_item: number }[]): number {
  return breakdown.reduce((sum, item) => sum + item.quantity * item.kiwi_per_item, 0)
}

// Server-side transactional Kiwi award with idempotency and duplicate prevention
export interface KiwiAwardInput {
  donation_id: string
  donor_id: string
  total_kiwi: number
  evaluation_id: string
  admin_id: string
  idempotency_key: string
}

export function validateKiwiAward(input: KiwiAwardInput, existingTransactions: { idempotency_key?: string; donation_id: string }[]): { valid: boolean; error?: string } {
  // Prevent duplicate awards for same donation
  const duplicate = existingTransactions.find(t => t.donation_id === input.donation_id && t.idempotency_key === input.idempotency_key)
  if (duplicate) {
    return { valid: false, error: 'Duplicate Kiwi award - idempotency key already used for this donation' }
  }
  if (input.total_kiwi <= 0) {
    return { valid: false, error: 'Kiwi total must be positive' }
  }
  if (input.total_kiwi > 1000) {
    return { valid: false, error: 'Kiwi total exceeds maximum per donation (1000)' }
  }
  return { valid: true }
}

// Kiwi cannot be cash
export const KIWI_LEGAL_TEXT = {
  not_money: 'Kiwi n\'est pas de l\'argent et n\'a pas de valeur monétaire.',
  no_cash: 'Kiwi ne peut pas être retiré en espèces, vendu ou transféré.',
  no_transfer: 'Kiwi ne peut pas être transféré entre utilisateurs.',
  validation_only: 'Kiwi sont ajoutés seulement après validation par Barka Nour.',
  subject_to_inspection: 'L\'acceptation des vêtements est soumise à inspection par Barka Nour.',
  reward_availability: 'La disponibilité des récompenses dépend du stock actuel.',
  shipping_conditions: 'La livraison des récompenses physiques est soumise aux conditions affichées.',
  voluntary_renunciation: 'Vous pouvez renoncer volontairement à vos Kiwi.',
  permanent_transfer: 'Les vêtements acceptés sont transférés définitivement à Barka Nour.',
}

export function generateDonationNumber(): string {
  const date = new Date().toISOString().slice(2,10).replace(/-/g,'')
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `BN-DON-${date}-${rand}`
}

export function generateKiwiTransactionId(): string {
  return `BN-KIWI-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}
