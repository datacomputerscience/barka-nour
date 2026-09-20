import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatTND } from '@/lib/utils'
import { donationService } from '@/services/donationService'
import type { Donation, KiwiAccount, KiwiTransaction, RewardRedemption } from '@/types/donation'
import { Package, Recycle, Gift, Heart, History, Settings, AlertTriangle } from 'lucide-react'

export function KiwiDashboardPage() {
  const [phone, setPhone] = useState('+216 20 123 456')
  const [account, setAccount] = useState<KiwiAccount | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [transactions, setTransactions] = useState<KiwiTransaction[]>([])
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([])
  const [showRenounce, setShowRenounce] = useState(false)
  const [renounceAmount, setRenounceAmount] = useState('')

  useEffect(() => {
    loadData()
  }, [phone])

  const loadData = async () => {
    const acc = await donationService.getKiwiAccountByPhone(phone)
    setAccount(acc)
    if (acc) {
      const txns = await donationService.getKiwiTransactions(acc.donor_id)
      setTransactions(txns)
      const reds = await donationService.getRedemptionsByDonor(acc.donor_id)
      setRedemptions(reds)
    }
    const dons = await donationService.getDonationsByPhone(phone)
    setDonations(dons)
  }

  const handleRenounce = async () => {
    if (!account || !renounceAmount) return
    const amount = parseInt(renounceAmount)
    if (isNaN(amount) || amount <= 0 || amount > account.balance) return
    if (!confirm(`Vous êtes sur le point de renoncer volontairement à ${amount} Kiwi. Cette action est définitive. Confirmer ?`)) return
    await donationService.renounceKiwi(account.donor_id, amount, 'Voluntary renunciation via dashboard')
    setShowRenounce(false)
    setRenounceAmount('')
    loadData()
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between">
        <div><h1 className="text-[28px] font-bold tracking-tight">🥝 Mon espace Barka Nour</h1><p className="text-sm text-ink-600">Kiwi, dons, récompenses, préférences, historique</p></div>
        <Badge className="bg-bn-400 text-ink-800 border-bn-300">Kiwi non-monétaire</Badge>
      </div>

      <div className="mt-6 flex gap-2 max-w-[320px]">
        <Input placeholder="Votre téléphone" value={phone} onChange={e => setPhone(e.target.value)} className="h-9" />
        <Button variant="outline" size="sm" className="h-9 rounded-full" onClick={loadData}>Charger</Button>
      </div>

      <div className="mt-8 grid lg:grid-cols-[360px_1fr] gap-6">
        <div className="space-y-4">
          <Card className="rounded-[1.25rem] bg-olive-700 text-white">
            <CardContent className="p-6">
              <p className="text-xs opacity-80">Solde Kiwi</p>
              <p className="text-[36px] font-bold leading-none mt-2">{account?.balance || 0} 🥝</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div><p className="opacity-70">Gagnés</p><p className="font-bold text-[14px]">{account?.total_earned || 0}</p></div>
                <div><p className="opacity-70">Utilisés</p><p className="font-bold text-[14px]">{account?.total_used || 0}</p></div>
                <div><p className="opacity-70">Renoncés</p><p className="font-bold text-[14px]">{account?.total_renounced || 0}</p></div>
              </div>
              <p className="text-[11px] opacity-70 mt-4 leading-relaxed">Kiwi n'est pas de l'argent, pas de valeur monétaire, non transférable, non retirable en espèces.</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader className="pb-3"><CardTitle className="text-[14px] flex items-center gap-2"><Settings className="h-4 w-4" /> Préférences récompenses (optionnel)</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div><p className="font-medium">Âge</p><div className="flex flex-wrap gap-1 mt-1">{['0–2 ans','3–5 ans','6–8 ans','9–12 ans','13–16 ans','Adulte'].map(a => <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>)}</div></div>
              <div><p className="font-medium">Catégorie</p><div className="flex flex-wrap gap-1 mt-1">{['Fille','Garçon','Mixte','Femme','Homme'].map(c => <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>)}</div></div>
              <p className="text-[11px] text-ink-500">Préférences optionnelles pour personnaliser récompenses disponibles. Barka Nour n'est pas obligé de fournir un produit spécifique.</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <p className="font-semibold text-sm flex items-center gap-2"><Heart className="h-4 w-4 text-amber-600" /> Laisser mes Kiwi à Barka Nour</p>
              <p className="text-xs text-ink-600 mt-2">Vous pouvez renoncer volontairement à vos Kiwi. Action définitive.</p>
              {!showRenounce ? (
                <Button variant="outline" size="sm" className="mt-3 h-8 rounded-full w-full" onClick={() => setShowRenounce(true)}>Renoncer à des Kiwi</Button>
              ) : (
                <div className="mt-3 space-y-2">
                  <Input placeholder="Montant à renoncer" type="number" value={renounceAmount} onChange={e => setRenounceAmount(e.target.value)} className="h-8" />
                  <div className="flex gap-2"><Button variant="outline" size="sm" className="flex-1 h-8 rounded-full" onClick={() => setShowRenounce(false)}>Annuler</Button><Button size="sm" className="flex-1 h-8 rounded-full bg-amber-600 text-white" onClick={handleRenounce}>Confirmer</Button></div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-xl">
            <CardHeader className="pb-3"><CardTitle className="text-[16px] flex items-center gap-2"><Recycle className="h-4 w-4" /> Mes dons • {donations.length}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {donations.map(d => (
                <div key={d.id} className="p-3 rounded-xl border flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <p className="font-mono text-xs font-bold">{d.donation_number}</p>
                    <p className="text-sm">{d.category || 'Mixte'} • {d.age_range || 'Non précisé'} • {d.approximate_pieces || d.pieces_declared} pièces</p>
                    <p className="text-xs text-ink-500">{d.description}</p>
                    <div className="mt-2 flex gap-1 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">{d.method}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{d.status}</Badge>
                      {d.pieces_received && <span className="text-[11px] text-ink-500">{d.pieces_received} reçues • {d.pieces_accepted} acceptées • {d.pieces_rejected} rejetées</span>}
                    </div>
                  </div>
                  <div className="text-right"><p className="font-bold text-sm">{d.kiwi_total ? `${d.kiwi_total} 🥝` : 'En évaluation'}</p><p className="text-[11px] text-ink-500">{new Date(d.created_at).toLocaleDateString()}</p></div>
                </div>
              ))}
              {donations.length === 0 && <p className="text-sm text-ink-500">Aucun don trouvé pour ce téléphone.</p>}
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader className="pb-3"><CardTitle className="text-[16px] flex items-center gap-2"><Gift className="h-4 w-4" /> Mes récompenses • {redemptions.length}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {redemptions.map(r => (
                <div key={r.id} className="p-3 rounded-xl border flex justify-between text-sm"><div><p className="font-medium">{r.id}</p><p className="text-xs text-ink-500">{r.status} • {r.kiwi_cost} Kiwi • {r.shipping_method}</p></div><Badge variant="secondary" className="text-[10px]">{r.status}</Badge></div>
              ))}
              {redemptions.length === 0 && <p className="text-sm text-ink-500">Aucune récompense utilisée.</p>}
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader className="pb-3"><CardTitle className="text-[16px] flex items-center gap-2"><History className="h-4 w-4" /> Historique Kiwi • {transactions.length}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              {transactions.map(t => (
                <div key={t.id} className="p-2.5 rounded-lg border flex justify-between items-center">
                  <div><p className="font-medium">{t.type} • {t.amount > 0 ? '+' : ''}{t.amount} 🥝</p><p className="text-[11px] text-ink-500">{t.reason}</p></div>
                  <div className="text-right"><p className="font-bold">{t.balance_before} → {t.balance_after}</p><p className="text-[10px] text-ink-500">{new Date(t.created_at).toLocaleDateString()}</p></div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-xl bg-ink-900 text-white">
            <CardContent className="p-5 text-xs leading-relaxed">
              <p className="font-semibold flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Conditions Kiwi</p>
              <ul className="list-disc ml-4 mt-2 space-y-1 text-white/70">
                <li>Kiwi non-monétaire, pas de valeur en espèces, non transférable</li>
                <li>Ajoutés seulement après validation par Barka Nour</li>
                <li>Vêtements acceptés transférés définitivement à Barka Nour</li>
                <li>Récompenses selon stock actuel, livraison selon conditions affichées</li>
                <li>Vous pouvez conserver, utiliser ou renoncer volontairement</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
