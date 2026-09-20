import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { donationService } from '@/services/donationService'
import type { Donation, DonationLotEvaluation } from '@/types/donation'
import { DONATION_STATUSES } from '@/types/donation'
import { calculateKiwiLot } from '@/lib/kiwiEngine'
import { Package, Recycle, Check, X, Clock, Truck } from 'lucide-react'

export function DonationsAdminPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [selected, setSelected] = useState<Donation | null>(null)
  const [evalForm, setEvalForm] = useState({ standard: 0, good: 0, premium: 0, rejected: 0, condition: 'Très bon état' as any })

  useEffect(() => { load() }, [])

  const load = async () => {
    const dons = await donationService.getDonations()
    setDonations(dons)
  }

  const handleEvaluate = async () => {
    if (!selected) return
    const total = evalForm.standard + evalForm.good + evalForm.premium + evalForm.rejected
    if (total === 0) { alert('Entrez quantités'); return }
    try {
      await donationService.evaluateLot(selected.id, {
        condition: evalForm.condition,
        standard_qty: evalForm.standard,
        good_qty: evalForm.good,
        premium_qty: evalForm.premium,
        rejected_qty: evalForm.rejected,
      }, 'admin-001')
      alert(`Évalué: ${calculateKiwiLot({ standard_qty: evalForm.standard, good_qty: evalForm.good, premium_qty: evalForm.premium })} Kiwi`)
      load()
      setSelected(null)
    } catch (e: any) { alert(e.message) }
  }

  const handleValidate = async () => {
    if (!selected) return
    if (!confirm(`Valider les Kiwi pour ${selected.donation_number} ?`)) return
    try {
      const res = await donationService.validateKiwi(selected.id, 'admin-001', `validate-${selected.id}-${Date.now()}`)
      alert(`Kiwi validés: ${res.transaction.amount} Kiwi ajoutés à ${res.account.donor_phone}. Balance ${res.transaction.balance_before} → ${res.transaction.balance_after}`)
      load()
      setSelected(null)
    } catch (e: any) { alert(e.message) }
  }

  const kiwiPreview = calculateKiwiLot({ standard_qty: evalForm.standard, good_qty: evalForm.good, premium_qty: evalForm.premium })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-[20px] font-bold">Dons • Lot Evaluation Default</h1><Badge>{donations.length} dons</Badge></div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-3">
          {donations.map(d => (
            <Card key={d.id} className={`rounded-xl cursor-pointer hover:shadow-sm transition-all ${selected?.id === d.id ? 'ring-2 ring-olive-700 border-olive-700' : ''}`} onClick={() => setSelected(d)}>
              <CardContent className="p-4 flex justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2"><p className="font-mono text-xs font-bold">{d.donation_number}</p><Badge variant="secondary" className="text-[10px]">{d.status}</Badge><Badge variant="secondary" className="text-[10px]">{d.method}</Badge></div>
                  <p className="text-sm mt-1 font-medium">{d.donor_name} • {d.donor_phone} • {d.governorate}, {d.city}</p>
                  <p className="text-xs text-ink-600">{d.category || 'Mixte'} • {d.age_range || 'Non précisé'} • {d.clothing_types?.join(', ') || 'Non précisé'} • {d.approximate_pieces || d.pieces_declared} pièces</p>
                  <p className="text-xs text-ink-500 mt-1 line-clamp-1">{d.description}</p>
                  {d.pieces_received && <p className="text-[11px] mt-1 text-ink-600">{d.pieces_received} reçues • {d.pieces_accepted} acceptées • {d.pieces_rejected} rejetées • {d.kiwi_total} Kiwi</p>}
                </div>
                <div className="text-right"><p className="text-xs text-ink-500">{new Date(d.created_at).toLocaleDateString()}</p><p className="font-bold text-sm mt-1">{d.kiwi_total ? `${d.kiwi_total} 🥝` : 'À évaluer'}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          {!selected ? (
            <Card className="rounded-xl"><CardContent className="p-8 text-center"><Recycle className="h-10 w-10 text-ink-300 mx-auto" /><p className="font-medium mt-3">Sélectionnez un don</p><p className="text-xs text-ink-500">Évaluation par lot par défaut — efficace pour 20-50 pièces</p></CardContent></Card>
          ) : (
            <>
              <Card className="rounded-xl">
                <CardHeader className="pb-3"><CardTitle className="text-[14px]">Évaluation lot • {selected.donation_number}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label>Condition générale</Label><Select value={evalForm.condition} onChange={e => setEvalForm({...evalForm, condition: e.target.value as any})} className="h-9"><option>Excellent</option><option>Très bon état</option><option>Bon état</option><option>Non accepté</option></Select></div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label>Standard ×1 Kiwi</Label><Input type="number" min="0" value={evalForm.standard} onChange={e => setEvalForm({...evalForm, standard: parseInt(e.target.value) || 0})} className="h-9" /></div>
                    <div className="space-y-1"><Label>Bonne ×2 Kiwi</Label><Input type="number" min="0" value={evalForm.good} onChange={e => setEvalForm({...evalForm, good: parseInt(e.target.value) || 0})} className="h-9" /></div>
                    <div className="space-y-1"><Label>Premium ×4 Kiwi</Label><Input type="number" min="0" value={evalForm.premium} onChange={e => setEvalForm({...evalForm, premium: parseInt(e.target.value) || 0})} className="h-9" /></div>
                    <div className="space-y-1"><Label>Rejeté ×0</Label><Input type="number" min="0" value={evalForm.rejected} onChange={e => setEvalForm({...evalForm, rejected: parseInt(e.target.value) || 0})} className="h-9" /></div>
                  </div>

                  <div className="rounded-xl bg-olive-50 border border-olive-200 p-3">
                    <p className="text-xs font-semibold">Calcul automatique</p>
                    <p className="text-sm mt-1">{evalForm.standard} ×1 = {evalForm.standard} + {evalForm.good} ×2 = {evalForm.good * 2} + {evalForm.premium} ×4 = {evalForm.premium * 4}</p>
                    <p className="font-bold text-[16px] mt-1">Total = {kiwiPreview} Kiwi 🥝</p>
                    <p className="text-[11px] text-ink-600 mt-1">Reçu: {evalForm.standard + evalForm.good + evalForm.premium + evalForm.rejected} • Accepté: {evalForm.standard + evalForm.good + evalForm.premium} • Rejeté: {evalForm.rejected}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-9 rounded-full" onClick={() => setSelected(null)}>Annuler</Button>
                    <Button size="sm" className="flex-1 h-9 rounded-full bg-olive-700 text-white" onClick={handleEvaluate}>Évaluer lot</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl">
                <CardContent className="p-4 space-y-3">
                  <p className="font-semibold text-sm">Actions</p>
                  <Button size="sm" className="w-full h-9 rounded-full bg-emerald-600 text-white" onClick={handleValidate} disabled={selected.status !== 'evaluated' && selected.status !== 'accepted' && selected.status !== 'partially_accepted'}><Check className="h-4 w-4" /> Valider les Kiwi • {selected.kiwi_total || kiwiPreview} 🥝</Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-8 rounded-full text-xs"><Clock className="h-3 w-3" /> Planifier collecte</Button>
                    <Button variant="outline" size="sm" className="h-8 rounded-full text-xs"><Truck className="h-3 w-3" /> Reçue</Button>
                    <Button variant="outline" size="sm" className="h-8 rounded-full text-xs"><Package className="h-4 w-4" /> Tri</Button>
                    <Button variant="outline" size="sm" className="h-8 rounded-full text-xs text-red-600"><X className="h-3 w-3" /> Rejeter</Button>
                  </div>
                  <p className="text-[11px] text-ink-500">Kiwi ajoutés seulement après validation. Idempotency empêche double validation. Transaction traçable.</p>
                </CardContent>
              </Card>

              <Card className="rounded-xl bg-ink-50">
                <CardContent className="p-4 text-xs">
                  <p className="font-semibold">Principe lot — Efficacité</p>
                  <p className="mt-1 leading-relaxed">Ne PAS créer 20-50 produits pour calculer Kiwi. Évaluation lot par défaut via quantités. Option B individuelle seulement pour veste premium, robe exceptionnelle, article haute valeur à vendre individuellement.</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
