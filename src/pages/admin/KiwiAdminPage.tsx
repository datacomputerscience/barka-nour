import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DEFAULT_KIWI_RULES } from '@/lib/kiwiEngine'
import { donationService } from '@/services/donationService'
import { useEffect, useState } from 'react'
import type { Reward, KiwiTransaction } from '@/types/donation'

export function KiwiConfigPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [transactions, setTransactions] = useState(0)

  useEffect(() => {
    donationService.getRewards().then(setRewards)
  }, [])

  return (
    <div className="p-6 space-y-6 max-w-[960px]">
      <div className="flex items-center justify-between"><h1 className="text-[20px] font-bold">Kiwi • Configuration & Ledger</h1><Badge className="bg-bn-400 text-ink-800">Non-monétaire</Badge></div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-xl">
          <CardHeader className="pb-3"><CardTitle className="text-[14px]">Règles Kiwi par qualité (configurable)</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="grid grid-cols-4 gap-2 font-semibold text-[11px] text-ink-500"><span>Type</span><span>Qualité</span><span>Kiwi</span><span>Actif</span></div>
            {DEFAULT_KIWI_RULES.slice(0, 12).map((r, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 p-2 border rounded-lg"><span>{r.clothing_type}</span><span>{r.quality}</span><span className="font-bold">{r.kiwi_value} 🥝</span><span><Badge variant="secondary" className="text-[10px]">{r.is_active ? 'actif' : 'inactif'}</Badge></span></div>
            ))}
            <p className="text-[11px] text-ink-500">Admin peut modifier règles via dashboard. Calcul automatique serveur-side. Pas de hard-code frontend pour solde final.</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="pb-3"><CardTitle className="text-[14px]">Récompenses • Catalog configurable</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-xs">
            {rewards.map(r => (
              <div key={r.id} className="p-2.5 border rounded-xl flex justify-between"><div><p className="font-medium">{r.name}</p><p className="text-[11px] text-ink-500">{r.category} • {r.kiwi_cost} Kiwi • stock {r.stock} • {r.shipping_rule}</p></div><Badge variant="secondary" className="text-[10px]">{r.is_active ? 'actif' : 'inactif'}</Badge></div>
            ))}
            <div className="rounded-lg bg-ink-50 border p-3">
              <p className="font-semibold">Chaque récompense a :</p>
              <p className="mt-1 leading-relaxed">ID, nom, description, coût Kiwi, catégorie, éligibilité, stock, tranche âge, genre, image, expiration, règle livraison, actif/inactif. Ne jamais promettre article spécifique indisponible.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl">
        <CardHeader className="pb-3"><CardTitle className="text-[14px]">Ledger Kiwi • Traçabilité totale</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="grid grid-cols-6 gap-2 font-semibold text-[11px] text-ink-500"><span>Type</span><span>Montant</span><span>Avant → Après</span><span>Raison</span><span>Admin</span><span>Date</span></div>
          {[
            { type: 'donation_reward', amount: '+18', beforeAfter: '0 → 18', reason: 'Don BN-DON-... évalué', admin: 'admin-001', date: '2026-09-20' },
            { type: 'reward_redemption', amount: '-20', beforeAfter: '28 → 8', reason: 'Pièce Fille 6 ans', admin: '-', date: '2026-09-19' },
            { type: 'voluntary_renunciation', amount: '-24', beforeAfter: '24 → 0', reason: 'Laisser à Barka Nour', admin: '-', date: '2026-09-18' },
          ].map((t, i) => (
            <div key={i} className="grid grid-cols-6 gap-2 p-2 border rounded-lg"><span>{t.type}</span><span className="font-bold">{t.amount}</span><span>{t.beforeAfter}</span><span className="line-clamp-1">{t.reason}</span><span>{t.admin}</span><span>{t.date}</span></div>
          ))}
          <p className="text-[11px] text-ink-500">Chaque mouvement a Transaction ID, User ID, Donation ID, Date, Type, Montant, Balance before/after, Raison, Admin. Jamais modifier silencieusement solde. Idempotency empêche double attribution.</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl bg-ink-900 text-white">
        <CardContent className="p-5 text-xs leading-relaxed">
          <p className="font-semibold">Règles métier Kiwi</p>
          <ul className="list-disc ml-4 mt-2 space-y-1 text-white/70">
            <li>Kiwi n'est pas de l'argent, pas de valeur monétaire, non retirable espèces, non vendable, non transférable</li>
            <li>Ajoutés seulement après validation admin, pas à soumission</li>
            <li>Donateur ne choisit pas sort Kiwi pendant don — choix après : utiliser, conserver, laisser à Barka Nour</li>
            <li>Déduction seulement après confirmation récompense, restauration traçable si annulé admin</li>
            <li>Transactionnel : validation dons, attribution Kiwi, rédemption, restauration, renonciation volontaire</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export function CollectionConfigPage() {
  return (
    <div className="p-6 space-y-6 max-w-[720px]">
      <h1 className="text-[20px] font-bold">Collecte • Configuration</h1>
      <Card className="rounded-xl"><CardContent className="p-5 space-y-4 text-sm">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Quantité minimale</Label><Input defaultValue="10" className="h-9 mt-1" /></div>
          <div><Label>Seuil gratuit</Label><Input defaultValue="20" className="h-9 mt-1" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Frais collecte</Label><Input defaultValue="5 TND" className="h-9 mt-1" /></div>
          <div><Label>Zones</Label><Input defaultValue="Tunis, Ariana, Ben Arous" className="h-9 mt-1" /></div>
        </div>
        <div><Label>Jours groupés</Label><Input defaultValue="Lundi, Jeudi" className="h-9 mt-1" /></div>
        <div className="flex items-center gap-2"><input type="checkbox" defaultChecked /> <span className="text-xs">Approbation manuelle requise (ne pas promettre collecte gratuite auto)</span></div>
        <p className="text-xs text-ink-500">Support: dépôt point collecte, collecte groupée planifiée, collecte domicile selon règles configurables. Admin peut approuver, rejeter, reprogrammer.</p>
      </CardContent></Card>
    </div>
  )
}
