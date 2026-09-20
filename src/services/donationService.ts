// Barka Nour - Donation Service - Mock with service/repository abstraction
// Production-oriented, lot evaluation default, idempotency, server-side Kiwi calc

import type { Donation, DonationLotEvaluation, DonationStatus, KiwiAccount, KiwiTransaction, Reward, RewardRedemption, DonorPreference } from '@/types/donation'
import { calculateKiwiLot, generateDonationNumber } from '@/lib/kiwiEngine'

export const mockDonations: Donation[] = [
  {
    id: 'don-001',
    donation_number: 'BN-DON-260920-A1B2',
    donor_name: 'Leila Ben Salah',
    donor_phone: '+216 20 123 456',
    donor_email: 'leila@example.tn',
    governorate: 'Tunis',
    city: 'Tunis',
    address: 'Rue Habib Bourguiba 12',
    method: 'collecte',
    category: 'Fille',
    age_range: '6–8 ans',
    clothing_types: ['T-shirt', 'Robe', 'Pantalon'],
    approximate_pieces: 15,
    description: 'Vêtements fille 6 ans, environ 15 pièces, principalement été.',
    pieces_declared: 15,
    pieces_received: 15,
    pieces_accepted: 12,
    pieces_rejected: 3,
    kiwi_total: 18,
    status: 'kiwi_validated',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'don-002',
    donation_number: 'BN-DON-260919-C3D4',
    donor_name: 'Mohamed Trabelsi',
    donor_phone: '+216 98 765 432',
    governorate: 'Sousse',
    city: 'Sousse',
    method: 'depot',
    category: 'Mixte',
    age_range: '3–5 ans',
    clothing_types: ['Pull', 'Jean', 'Pyjama'],
    approximate_pieces: 25,
    description: 'Lot mixte bébé 3-5 ans, 25 pièces',
    pieces_declared: 25,
    pieces_received: 25,
    pieces_accepted: 20,
    pieces_rejected: 5,
    kiwi_total: 28,
    status: 'completed',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockEvaluations: DonationLotEvaluation[] = [
  {
    id: 'eval-001',
    donation_id: 'don-001',
    condition: 'Très bon état',
    standard_qty: 8,
    good_qty: 3,
    premium_qty: 1,
    rejected_qty: 3,
    total_kiwi: 18,
    evaluated_at: new Date().toISOString(),
    notes: 'Lot fille 6 ans, bon état général',
  },
]

export const mockKiwiAccounts: KiwiAccount[] = [
  {
    id: 'kiwi-acc-001',
    donor_id: 'donor-001',
    donor_phone: '+216 20 123 456',
    balance: 18,
    total_earned: 18,
    total_used: 0,
    total_renounced: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'kiwi-acc-002',
    donor_id: 'donor-002',
    donor_phone: '+216 98 765 432',
    balance: 8,
    total_earned: 28,
    total_used: 20,
    total_renounced: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockKiwiTransactions: KiwiTransaction[] = [
  {
    id: 'txn-001',
    donor_id: 'donor-001',
    donation_id: 'don-001',
    type: 'donation_reward',
    amount: 18,
    balance_before: 0,
    balance_after: 18,
    reason: 'Donation BN-DON-260920-A1B2 évaluée: 8 Standard, 3 Bonne, 1 Premium',
    created_at: new Date().toISOString(),
  },
]

export const mockRewards: Reward[] = [
  {
    id: 'rew-001',
    name: 'Pièce Fille — 6 ans',
    description: 'Vêtement fille 6 ans sélectionné par Barka Nour selon disponibilité. Nous vous proposerons les récompenses disponibles correspondant à vos préférences.',
    kiwi_cost: 20,
    category: 'physical',
    age_range: '6–8 ans',
    donation_category: 'Fille',
    stock: 5,
    shipping_rule: 'with_order',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'rew-002',
    name: 'Pièce Garçon — 10 ans',
    description: 'Vêtement garçon 9-12 ans, qualité vérifiée.',
    kiwi_cost: 20,
    category: 'physical',
    age_range: '9–12 ans',
    donation_category: 'Garçon',
    stock: 3,
    shipping_rule: 'with_order',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'rew-003',
    name: 'Avantage client — 10% réduction',
    description: 'Réduction 10% sur votre prochaine commande éligible. Non cumulable, valable 30 jours.',
    kiwi_cost: 15,
    category: 'discount',
    shipping_rule: 'free',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'rew-004',
    name: 'Livraison offerte',
    description: 'Livraison gratuite pour votre prochaine commande.',
    kiwi_cost: 12,
    category: 'delivery_benefit',
    shipping_rule: 'free',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockRedemptions: RewardRedemption[] = [
  {
    id: 'red-001',
    donor_id: 'donor-002',
    reward_id: 'rew-003',
    kiwi_cost: 15,
    status: 'completed',
    shipping_method: 'with_existing_order',
    existing_order_id: 'order-001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

class DonationService {
  private donations = [...mockDonations]
  private evaluations = [...mockEvaluations]
  private kiwiAccounts = [...mockKiwiAccounts]
  private transactions = [...mockKiwiTransactions]
  private rewards = [...mockRewards]
  private redemptions = [...mockRedemptions]
  private idempotencyKeys = new Set<string>()

  // Donation submission - flexible, no individual item required
  async createDonation(input: Omit<Donation, 'id' | 'donation_number' | 'created_at' | 'updated_at' | 'status'> & { idempotency_key?: string }): Promise<Donation> {
    if (input.idempotency_key && this.idempotencyKeys.has(input.idempotency_key)) {
      const existing = this.donations.find(d => d.idempotency_key === input.idempotency_key)
      if (existing) return existing
    }

    const donation: Donation = {
      id: `don-${Date.now()}`,
      donation_number: generateDonationNumber(),
      status: 'submitted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...input,
    }

    if (input.idempotency_key) this.idempotencyKeys.add(input.idempotency_key)
    this.donations.push(donation)
    return donation
  }

  async getDonations(): Promise<Donation[]> {
    return [...this.donations].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  async getDonationById(id: string): Promise<Donation | null> {
    return this.donations.find(d => d.id === id) || null
  }

  async getDonationsByPhone(phone: string): Promise<Donation[]> {
    return this.donations.filter(d => d.donor_phone === phone)
  }

  // Lot evaluation - default, efficient
  async evaluateLot(donationId: string, evaluation: Omit<DonationLotEvaluation, 'id' | 'donation_id' | 'total_kiwi' | 'evaluated_at'>, adminId: string): Promise<DonationLotEvaluation> {
    const donation = this.donations.find(d => d.id === donationId)
    if (!donation) throw new Error('Donation not found')

    const total_kiwi = calculateKiwiLot({
      standard_qty: evaluation.standard_qty,
      good_qty: evaluation.good_qty,
      premium_qty: evaluation.premium_qty,
    })

    const evalRecord: DonationLotEvaluation = {
      id: `eval-${Date.now()}`,
      donation_id: donationId,
      total_kiwi,
      evaluated_at: new Date().toISOString(),
      evaluated_by: adminId,
      ...evaluation,
    }

    this.evaluations.push(evalRecord)

    // Update donation
    donation.pieces_received = evaluation.standard_qty + evaluation.good_qty + evaluation.premium_qty + evaluation.rejected_qty
    donation.pieces_accepted = evaluation.standard_qty + evaluation.good_qty + evaluation.premium_qty
    donation.pieces_rejected = evaluation.rejected_qty
    donation.kiwi_total = total_kiwi
    donation.status = 'evaluated'
    donation.updated_at = new Date().toISOString()

    return evalRecord
  }

  // Kiwi validation - only after evaluation, prevents abuse
  async validateKiwi(donationId: string, adminId: string, idempotencyKey: string): Promise<{ donation: Donation; transaction: KiwiTransaction; account: KiwiAccount }> {
    if (this.idempotencyKeys.has(idempotencyKey)) {
      throw new Error('Duplicate validation - idempotency key already used')
    }

    const donation = this.donations.find(d => d.id === donationId)
    if (!donation) throw new Error('Donation not found')
    if (donation.status !== 'evaluated' && donation.status !== 'accepted' && donation.status !== 'partially_accepted') {
      throw new Error('Donation must be evaluated before Kiwi validation')
    }
    if (!donation.kiwi_total || donation.kiwi_total <= 0) throw new Error('Invalid Kiwi total')

    // Find or create Kiwi account by phone
    let account = this.kiwiAccounts.find(a => a.donor_phone === donation.donor_phone)
    if (!account) {
      account = {
        id: `kiwi-acc-${Date.now()}`,
        donor_id: `donor-${Date.now()}`,
        donor_phone: donation.donor_phone,
        balance: 0,
        total_earned: 0,
        total_used: 0,
        total_renounced: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      this.kiwiAccounts.push(account)
    }

    const balanceBefore = account.balance
    const balanceAfter = balanceBefore + donation.kiwi_total

    const transaction: KiwiTransaction = {
      id: `txn-${Date.now()}`,
      donor_id: account.donor_id,
      donation_id: donationId,
      type: 'donation_reward',
      amount: donation.kiwi_total,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      reason: `Donation ${donation.donation_number} évaluée: ${donation.pieces_accepted} acceptés, ${donation.pieces_rejected} rejetés`,
      admin_id: adminId,
      idempotency_key: idempotencyKey,
      created_at: new Date().toISOString(),
    }

    // Transactional update
    account.balance = balanceAfter
    account.total_earned += donation.kiwi_total
    account.updated_at = new Date().toISOString()

    donation.status = 'kiwi_validated'
    donation.updated_at = new Date().toISOString()

    this.transactions.push(transaction)
    this.idempotencyKeys.add(idempotencyKey)

    return { donation, transaction, account }
  }

  async getKiwiAccountByPhone(phone: string): Promise<KiwiAccount | null> {
    return this.kiwiAccounts.find(a => a.donor_phone === phone) || null
  }

  async getKiwiTransactions(donorId: string): Promise<KiwiTransaction[]> {
    return this.transactions.filter(t => t.donor_id === donorId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  // Voluntary renunciation
  async renounceKiwi(donorId: string, amount: number, reason: string): Promise<KiwiTransaction> {
    const account = this.kiwiAccounts.find(a => a.donor_id === donorId)
    if (!account) throw new Error('Account not found')
    if (account.balance < amount) throw new Error('Insufficient Kiwi balance')

    const balanceBefore = account.balance
    const balanceAfter = balanceBefore - amount

    const transaction: KiwiTransaction = {
      id: `txn-${Date.now()}`,
      donor_id: donorId,
      type: 'voluntary_renunciation',
      amount: -amount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      reason: reason || 'Voluntary renunciation - Laisser mes Kiwi à Barka Nour',
      created_at: new Date().toISOString(),
    }

    account.balance = balanceAfter
    account.total_renounced += amount
    account.updated_at = new Date().toISOString()

    this.transactions.push(transaction)
    return transaction
  }

  // Rewards
  async getRewards(): Promise<Reward[]> {
    return this.rewards.filter(r => r.is_active)
  }

  async redeemReward(donorId: string, rewardId: string, shippingMethod: 'with_existing_order' | 'hold_until_next' | 'separate', existingOrderId?: string): Promise<RewardRedemption> {
    const account = this.kiwiAccounts.find(a => a.donor_id === donorId)
    if (!account) throw new Error('Account not found')

    const reward = this.rewards.find(r => r.id === rewardId)
    if (!reward) throw new Error('Reward not found')
    if (!reward.is_active) throw new Error('Reward not active')
    if (reward.stock !== undefined && reward.stock <= 0) throw new Error('Reward out of stock')
    if (account.balance < reward.kiwi_cost) throw new Error('Insufficient Kiwi')

    // Do NOT deduct Kiwi too early - only after confirmation
    // Here we confirm, so deduct
    const balanceBefore = account.balance
    const balanceAfter = balanceBefore - reward.kiwi_cost

    const redemption: RewardRedemption = {
      id: `red-${Date.now()}`,
      donor_id: donorId,
      reward_id: rewardId,
      kiwi_cost: reward.kiwi_cost,
      status: shippingMethod === 'with_existing_order' ? 'shipped_with_order' : shippingMethod === 'hold_until_next' ? 'held' : 'pending',
      shipping_method: shippingMethod,
      existing_order_id: existingOrderId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const transaction: KiwiTransaction = {
      id: `txn-${Date.now()}`,
      donor_id: donorId,
      reward_redemption_id: redemption.id,
      type: 'reward_redemption',
      amount: -reward.kiwi_cost,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      reason: `Reward redemption: ${reward.name}`,
      created_at: new Date().toISOString(),
    }

    account.balance = balanceAfter
    account.total_used += reward.kiwi_cost
    account.updated_at = new Date().toISOString()

    if (reward.stock !== undefined) reward.stock--

    this.redemptions.push(redemption)
    this.transactions.push(transaction)

    return redemption
  }

  async getRedemptionsByDonor(donorId: string): Promise<RewardRedemption[]> {
    return this.redemptions.filter(r => r.donor_id === donorId)
  }
}

export const donationService = new DonationService()
