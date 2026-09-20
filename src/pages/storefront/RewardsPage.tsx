import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { donationService } from '@/services/donationService'
import type { Reward, KiwiAccount } from '@/types/donation'
import { Gift, Package, Truck, Clock, Star } from 'lucide-react'

export function RewardsPage() {
  const [phone, setPhone] = useState('+216 20 123 456')
  const [account, setAccount] = useState<KiwiAccount | null>(null)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [selected, setSelected] = useState<Reward | null>(null)
  const [shippingMethod, setShippingMethod] = useState<'with_existing_order' | 'hold_until_next' | 'separate'>('with_existing_order')

  useEffect(() => {
    load()
  }, [phone])

  const load = async () => {
    const acc = await donationService.getKiwiAccountByPhone(phone)
    setAccount(acc)
    const rw = await donationService.getRewards()
    setRewards(rw)
  }

  const handleRedeem = async () => {
    if (!account || !selected) return
    if (account.balance < selected.kiwi_cost) {
      alert('Solde Kiwi insuffisant')
      return
    }
    if (!confirm(`Confirmer récompense: ${selected.name} pour ${selected.kiwi_cost} Kiwi ? Livraison: ${shippingMethod}`)) return
    try {
      await donationService.redeemReward(account.donor_id, selected.id, shippingMethod)
      alert(`Récompense confirmée ! ${selected.kiwi_cost} Kiwi déduits.`)
      setSelected(null)
      load()
    } catch (e: any) {
      alert(e.message)
    }
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between">
        <div><h1 className="text-[28px] font-bold tracking-tight">🎁 Mes récompenses</h1><p className="text-sm text-ink-600">Utilisez vos Kiwi • Stock actuel • Pas de promesse d'article spécifique à l'avance</p></div>
        <div className="text-right"><p className="text-xs text-ink-500">Solde</p><p className="text-[20px] font-bold">{account?.balance || 0} 🥝</p></div>
      </div>

      <div className="mt-6 flex gap-2 max-w-[320px]">
        <Input placeholder="Téléphone" value={phone} onChange={e => setPhone(e.target.value)} className="h-9" />
        <Button variant="outline" size="sm" className="h-9 rounded-full" onClick={load}>Charger</Button>
      </div>

      <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="grid md:grid-cols-2 gap-4">
          {rewards.map(r => (
            <Card key={r.id} className={`overflow-hidden hover:shadow-md transition-all cursor-pointer ${selected?.id === r.id ? 'ring-2 ring-olive-700 border-olive-700' : ''}`} onClick={() => setSelected(r)}>
              <div className="aspect-[4/3] bg-[#f7f6f2] flex items-center justify-center relative">
                <Package className="h-10 w-10 text-olive-200" />
                <Badge className="absolute top-2 left-2 bg-bn-400 text-ink-800 text-[11px]">{r.kiwi_cost} Kiwi</Badge>
                <Badge className="absolute top-2 right-2 bg-white border text-ink-700 text-[10px]">{r.category}</Badge>
                {r.stock !== undefined && r.stock <= 2 && <Badge className="absolute bottom-2 left-2 bg-red-100 text-red-800 text-[10px]">Stock faible: {r.stock}</Badge>}
              </div>
              <CardContent className="p-4">
                <p className="font-semibold text-sm leading-tight">{r.name}</p>
                <p className="text-xs text-ink-600 mt-1 line-clamp-2">{r.description}</p>
                <div className="mt-3 flex gap-1 flex-wrap">
                  {r.age_range && <Badge variant="secondary" className="text-[10px]">{r.age_range}</Badge>}
                  {r.donation_category && <Badge variant="secondary" className="text-[10px]">{r.donation_category}</Badge>}
                  <Badge variant="secondary" className="text-[10px]">{r.shipping_rule}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card className="rounded-[1.25rem] sticky top-20">
            <CardContent className="p-5 space-y-4">
              {!selected ? (
                <div className="text-center py-8">
                  <Gift className="h-10 w-10 text-ink-300 mx-auto" />
                  <p className="font-medium mt-3">Sélectionnez une récompense</p>
                  <p className="text-xs text-ink-500 mt-1">Nous vous proposerons les récompenses disponibles correspondant à vos préférences. Pas de promesse d'article spécifique à l'avance.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold">Confirmer récompense</h3>
                  <div className="p-3 rounded-xl bg-ink-50 border">
                    <p className="font-medium text-sm">{selected.name}</p>
                    <p className="text-xs text-ink-600 mt-1">{selected.description}</p>
                    <div className="mt-2 flex justify-between text-sm"><span>Coût</span><span className="font-bold">{selected.kiwi_cost} Kiwi</span></div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium">Livraison :</p>
                    <label className={`flex gap-3 p-3 rounded-xl border cursor-pointer ${shippingMethod === 'with_existing_order' ? 'border-olive-700 bg-olive-50' : 'border-ink-200'}`}>
                      <input type="radio" checked={shippingMethod === 'with_existing_order'} onChange={() => setShippingMethod('with_existing_order')} />
                      <div className="flex-1"><p className="font-medium text-xs">Ajouter à une commande existante</p><p className="text-[11px] text-ink-600">Priorité 1 — Pas de frais séparés</p></div>
                      <Truck className="h-4 w-4 text-ink-400" />
                    </label>
                    <label className={`flex gap-3 p-3 rounded-xl border cursor-pointer ${shippingMethod === 'hold_until_next' ? 'border-olive-700 bg-olive-50' : 'border-ink-200'}`}>
                      <input type="radio" checked={shippingMethod === 'hold_until_next'} onChange={() => setShippingMethod('hold_until_next')} />
                      <div className="flex-1"><p className="font-medium text-xs">Ajouter à ma prochaine commande</p><p className="text-[11px] text-ink-600">Garder Kiwi jusqu'à future commande</p></div>
                      <Clock className="h-4 w-4 text-ink-400" />
                    </label>
                    <label className={`flex gap-3 p-3 rounded-xl border cursor-pointer ${shippingMethod === 'separate' ? 'border-olive-700 bg-olive-50' : 'border-ink-200'}`}>
                      <input type="radio" checked={shippingMethod === 'separate'} onChange={() => setShippingMethod('separate')} />
                      <div className="flex-1"><p className="font-medium text-xs">Livraison séparée</p><p className="text-[11px] text-ink-600">Selon conditions configurables</p></div>
                      <Package className="h-4 w-4 text-ink-400" />
                    </label>
                  </div>

                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[11px]">
                    <p className="font-semibold text-amber-900">Avant confirmation :</p>
                    <p className="mt-1 text-ink-700">Coût {selected.kiwi_cost} Kiwi déduits seulement après confirmation. Si indisponible avant confirmation, pas de déduction. Si annulé par admin, restauration traçable.</p>
                  </div>

                  <Button onClick={handleRedeem} disabled={!account || account.balance < selected.kiwi_cost} className="w-full h-11 rounded-full bg-olive-700 hover:bg-olive-800 text-white">
                    Confirmer • {selected.kiwi_cost} Kiwi
                  </Button>

                  <p className="text-[11px] text-ink-500 text-center">Kiwi non-monétaire, pas d'argent, non transférable. Livraison selon conditions affichées.</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
