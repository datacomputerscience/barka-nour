// Barka Nour - Donation, Kiwi & Reward System Types
// Production-oriented, backend-agnostic, no human images

export type DonationCategory = 'Bébé' | 'Fille' | 'Garçon' | 'Femme' | 'Homme' | 'Mixte' | 'Autre'
export type DonationAge = '0–2 ans' | '3–5 ans' | '6–8 ans' | '9–12 ans' | '13–16 ans' | 'Adulte' | 'Autre'
export type ClothingType = 'T-shirt' | 'Pantalon' | 'Jean' | 'Robe' | 'Jupe' | 'Short' | 'Pull' | 'Sweat' | 'Veste' | 'Manteau' | 'Pyjama' | 'Jogging' | 'Chemise' | 'Autre'

export type DonationMethod = 'depot' | 'collecte'
export type DonationStatus = 
  | 'submitted'
  | 'under_review'
  | 'collection_requested'
  | 'collection_scheduled'
  | 'received'
  | 'sorting'
  | 'evaluated'
  | 'accepted'
  | 'partially_accepted'
  | 'rejected'
  | 'kiwi_validated'
  | 'completed'
  | 'cancelled'

export const DONATION_STATUSES: { value: DonationStatus; label: string; label_ar: string; color: string }[] = [
  { value: 'submitted', label: 'Soumise', label_ar: 'مقدمة', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'under_review', label: 'En examen', label_ar: 'قيد المراجعة', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'collection_requested', label: 'Collecte demandée', label_ar: 'طلب جمع', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'collection_scheduled', label: 'Collecte planifiée', label_ar: 'جمع مجدول', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { value: 'received', label: 'Reçue', label_ar: 'مستلمة', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { value: 'sorting', label: 'Tri', label_ar: 'فرز', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'evaluated', label: 'Évaluée', label_ar: 'مقيمة', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'accepted', label: 'Acceptée', label_ar: 'مقبولة', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { value: 'partially_accepted', label: 'Partiellement acceptée', label_ar: 'مقبولة جزئيا', color: 'bg-lime-100 text-lime-800 border-lime-200' },
  { value: 'rejected', label: 'Refusée', label_ar: 'مرفوضة', color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'kiwi_validated', label: 'Kiwi validés', label_ar: 'كيوي مصدق', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'completed', label: 'Terminée', label_ar: 'مكتملة', color: 'bg-ink-100 text-ink-800 border-ink-200' },
  { value: 'cancelled', label: 'Annulée', label_ar: 'ملغاة', color: 'bg-gray-100 text-gray-800 border-gray-200' },
]

export type Condition = 'Excellent' | 'Très bon état' | 'Bon état' | 'Non accepté'
export type Quality = 'Standard' | 'Bonne' | 'Premium'
export type Defect = 'Aucun' | 'Défaut léger' | 'Défaut important' | 'Non conforme'

export interface Donation {
  id: string
  donation_number: string // BN-DON-000125
  donor_name: string
  donor_phone: string
  donor_email?: string
  governorate: string
  city: string
  address?: string
  method: DonationMethod
  // Flexible donation info - all optional
  category?: DonationCategory
  age_range?: DonationAge
  clothing_types?: ClothingType[]
  approximate_pieces?: number
  description?: string
  photos?: string[]
  // Collection specific
  collection_date?: string
  collection_time?: string
  collection_fee?: number
  collection_approved?: boolean
  // System
  status: DonationStatus
  pieces_declared?: number
  pieces_received?: number
  pieces_accepted?: number
  pieces_rejected?: number
  kiwi_total?: number
  donor_id?: string
  idempotency_key?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface DonationLotEvaluation {
  id: string
  donation_id: string
  condition: Condition
  // Quantities - lot level
  standard_qty: number
  good_qty: number
  premium_qty: number
  rejected_qty: number
  // Optional breakdown by type
  breakdown?: {
    clothing_type: ClothingType
    quality: Quality
    quantity: number
    kiwi_per_item: number
  }[]
  total_kiwi: number
  evaluated_by?: string
  evaluated_at: string
  notes?: string
}

export interface DonationItem {
  id: string
  donation_id: string
  clothing_type: ClothingType
  category?: DonationCategory
  age_range?: DonationAge
  condition: Condition
  quality: Quality
  defect: Defect
  kiwi_value: number
  status: 'pending' | 'accepted' | 'rejected' | 'converted_to_product' | 'converted_to_pack'
  converted_product_id?: string
  converted_pack_id?: string
  created_at: string
}

export interface KiwiAccount {
  id: string
  donor_id: string
  donor_phone: string
  balance: number
  total_earned: number
  total_used: number
  total_renounced: number
  created_at: string
  updated_at: string
}

export type KiwiTransactionType = 
  | 'donation_reward'
  | 'reward_redemption'
  | 'kiwi_adjustment'
  | 'kiwi_cancellation'
  | 'voluntary_renunciation'
  | 'administrative_correction'

export interface KiwiTransaction {
  id: string
  donor_id: string
  donation_id?: string
  reward_redemption_id?: string
  type: KiwiTransactionType
  amount: number // positive = earned, negative = used/renounced
  balance_before: number
  balance_after: number
  reason: string
  admin_id?: string
  idempotency_key?: string
  created_at: string
}

export interface KiwiRule {
  id: string
  clothing_type: ClothingType | 'all'
  quality: Quality | 'all'
  condition?: Condition
  kiwi_value: number
  min_kiwi?: number
  max_kiwi?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Reward {
  id: string
  name: string
  description: string
  kiwi_cost: number
  category: 'physical' | 'discount' | 'delivery_benefit' | 'special'
  eligibility?: string
  stock?: number
  age_range?: DonationAge
  donation_category?: DonationCategory
  image_url?: string
  expiration_at?: string
  shipping_rule: 'with_order' | 'hold_until_order' | 'separate_configurable' | 'free' | 'donor_paid'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RewardRedemption {
  id: string
  donor_id: string
  reward_id: string
  kiwi_cost: number
  status: 'pending' | 'confirmed' | 'shipped_with_order' | 'shipped_separate' | 'held' | 'cancelled' | 'completed'
  shipping_method?: 'with_existing_order' | 'hold_until_next' | 'separate'
  existing_order_id?: string
  shipping_fee?: number
  tracking_number?: string
  notes?: string
  confirmed_at?: string
  created_at: string
  updated_at: string
}

export interface DonorPreference {
  id: string
  donor_id: string
  age_ranges?: DonationAge[]
  categories?: DonationCategory[]
  reward_types?: string[]
  notes?: string
  updated_at: string
}

export interface CollectionConfig {
  id: string
  is_active: boolean
  min_pieces?: number
  free_threshold?: number
  fee_amount?: number
  zones?: string[]
  grouped_days?: string[]
  methods: DonationMethod[]
  requires_approval: boolean
  created_at: string
  updated_at: string
}

export interface DonationStatusHistory {
  id: string
  donation_id: string
  from_status?: DonationStatus
  to_status: DonationStatus
  notes?: string
  created_by?: string
  created_at: string
}
