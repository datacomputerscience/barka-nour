import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatTND } from '@/lib/utils'
import { Package, ShoppingBag, Users, TrendingUp, AlertTriangle, Banknote, Truck, Eye } from 'lucide-react'

export function DashboardPage() {
  const stats = [
    { label: "Chiffre d'affaires", value: formatTND(12450), change: '+12%', icon: Banknote, color: 'text-emerald-600' },
    { label: 'Commandes', value: '42', change: '+5', icon: ShoppingBag, color: 'text-bn-600' },
    { label: 'Clients', value: '128', change: '+8', icon: Users, color: 'text-blue-600' },
    { label: 'Produits', value: '5', change: 'actifs', icon: Package, color: 'text-ink-700' },
    { label: 'Stock faible', value: '1', change: 'alerte', icon: AlertTriangle, color: 'text-amber-600' },
    { label: 'Panier abandonné', value: '3', change: 'à relancer', icon: Eye, color: 'text-ink-500' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-[24px] font-bold tracking-tight">Dashboard Barka Nour</h1><p className="text-sm text-ink-600">Boutique unique • Single-store • {new Date().toLocaleDateString('fr-TN')}</p></div>
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Production • No-human policy</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="rounded-xl"><CardContent className="p-4"><div className="flex items-center justify-between"><p className="text-xs text-ink-500">{s.label}</p><s.icon className={`h-4 w-4 ${s.color}`} /></div><p className="text-[20px] font-bold mt-2">{s.value}</p><p className="text-[11px] text-ink-500 mt-1">{s.change}</p></CardContent></Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-xl">
          <CardHeader className="pb-3"><CardTitle className="text-[14px] flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Ventes 7 jours • TND</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[160px] flex items-end gap-2">
              {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1"><div className="w-full bg-bn-200 rounded-t" style={{ height: `${h}%` }} /><span className="text-[10px] text-ink-500">J{i+1}</span></div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="pb-3"><CardTitle className="text-[14px] flex items-center gap-2"><ShoppingBag className="h-4 w-4" /> Commandes récentes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { id: 'BN-20260920-A', status: 'pending', total: 299, gov: 'Tunis' },
              { id: 'BN-20260919-B', status: 'confirmed', total: 104, gov: 'Sousse' },
              { id: 'BN-20260918-C', status: 'shipped', total: 59, gov: 'Sfax' },
            ].map(o => (
              <div key={o.id} className="flex items-center justify-between text-sm p-2.5 rounded-lg border">
                <div><p className="font-mono text-xs">{o.id}</p><p className="text-[11px] text-ink-500">{o.gov} • {formatTND(o.total)}</p></div><Badge variant="secondary" className="text-[10px] capitalize">{o.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-xl">
          <CardHeader className="pb-3"><CardTitle className="text-[14px]">Stock faible • Seuil alerte</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm p-2 rounded-lg bg-amber-50 border border-amber-200"><span>Tapis Berbère • 3 restants</span><Badge variant="warning" className="text-[10px]">Low</Badge></div>
            <p className="text-[11px] text-ink-500">Inventaire réel, mouvements tracés, pas de survente. RLS single-store.</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="pb-3"><CardTitle className="text-[14px] flex items-center gap-2"><Truck className="h-4 w-4" /> Livraison • Providers</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-xs">
            {[
              { name: 'MesColis', status: 'not_configured' },
              { name: 'Aramex', status: 'not_configured' },
              { name: 'MockDelivery (test)', status: 'mock' },
            ].map(p => (
              <div key={p.name} className="flex justify-between p-2 rounded-lg border"><span>{p.name}</span><Badge variant="secondary" className="text-[10px]">{p.status}</Badge></div>
            ))}
            <p className="text-[11px] text-ink-500">Pas de fake intégration. Mock si docs indisponibles. Credential requis documenté.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl bg-ink-900 text-white">
        <CardContent className="p-5">
          <p className="font-semibold text-sm">Sécurité commandes 15-step</p>
          <p className="text-xs text-white/70 mt-1 leading-relaxed">Validation champs, phone TN, gouvernorat 24, prix frais serveur, stock, subtotal recalc, coupon server, livraison par gov, total server, idempotency, customer phone, snapshot, inventory decrement, shipment, events Pixel+CAPI. Jamais trust client totals.</p>
        </CardContent>
      </Card>
    </div>
  )
}
