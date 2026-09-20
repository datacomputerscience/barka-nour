import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatTND, ORDER_STATUSES } from '@/lib/utils'
import { Truck, Phone, MapPin, Package, Eye } from 'lucide-react'

export function OrdersPage() {
  const orders = [
    { id: '1', order_number: 'BN-20260920-ABC123', status: 'pending', total: 299, subtotal: 299, shipping: 0, customer_name: 'Mohamed Ben Ali', customer_phone: '+216 20 123 456', governorate: 'Tunis', city: 'Tunis', items: 1, created_at: '2026-09-20 10:30' },
    { id: '2', order_number: 'BN-20260919-XYZ789', status: 'confirmed', total: 104, subtotal: 94, shipping: 10, customer_name: 'Fatma Sassi', customer_phone: '+216 98 765 432', governorate: 'Sousse', city: 'Sousse', items: 2, created_at: '2026-09-19 15:00' },
    { id: '3', order_number: 'BN-20260918-DEF456', status: 'shipped', total: 59, subtotal: 59, shipping: 0, customer_name: 'Ali Trabelsi', customer_phone: '+216 22 111 222', governorate: 'Sfax', city: 'Sfax', items: 1, created_at: '2026-09-18 09:00' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-[20px] font-bold">Commandes • 15-step validation</h1><Badge>{orders.length} commandes</Badge></div>

      <div className="grid gap-4">
        {orders.map(o => (
          <Card key={o.id} className="rounded-xl hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2"><p className="font-mono text-xs font-bold">{o.order_number}</p><Badge variant="secondary" className="text-[10px] capitalize">{o.status}</Badge><span className="text-[11px] text-ink-500">{o.created_at}</span></div>
                  <div className="flex gap-4 text-xs text-ink-600">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {o.customer_name} • {o.customer_phone}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {o.city}, {o.governorate}</span>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span>{o.items} articles • Sous-total {formatTND(o.subtotal)} + Livraison {o.shipping === 0 ? 'gratuite' : formatTND(o.shipping)} = <strong>{formatTND(o.total)}</strong></span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {ORDER_STATUSES.slice(0,5).map(s => (
                      <span key={s.value} className={`text-[10px] px-2 py-0.5 rounded-full border ${o.status === s.value ? 'bg-ink-900 text-white border-ink-900' : 'bg-ink-50 text-ink-500'}`}>{s.value}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="h-8 rounded-full text-xs"><Eye className="h-3.5 w-3.5" /> Détails</Button>
                  <Button variant="outline" size="sm" className="h-8 rounded-full text-xs"><Truck className="h-3.5 w-3.5" /> Expédier</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-xl bg-ink-900 text-white">
        <CardContent className="p-5 text-xs leading-relaxed">
          <p className="font-semibold">Order security - 15 étapes serveur-side:</p>
          <ol className="list-decimal ml-4 mt-2 space-y-1 text-white/70">
            <li>Validation champs requis (nom, phone TN, gov 24 list, ville, adresse)</li>
            <li>Validation phone format tunisien</li>
            <li>Validation gouvernorat dans 24</li>
            <li>Fetch prix frais serveur (jamais trust client)</li>
            <li>Check stock réel & prevent negative</li>
            <li>Recalc subtotal serveur</li>
            <li>Validation coupon serveur (expiration, usage, min order)</li>
            <li>Calcul livraison par gouvernorat (7-10 TND)</li>
            <li>Free shipping si ≥150 TND</li>
            <li>Calcul total serveur</li>
            <li>Idempotency key check</li>
            <li>Find/create customer by phone</li>
            <li>Create order + order_items price snapshot + order_status_history</li>
            <li>Decrement inventory + inventory_movements</li>
            <li>Create shipment + emit Meta Pixel+CAPI Purchase event_id dedup</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}

export function CustomersPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-[20px] font-bold">Clients • Par téléphone (Tunisie)</h1>
      <Card className="rounded-xl"><CardContent className="p-4 space-y-2">
        {[
          { name: 'Mohamed Ben Ali', phone: '+216 20 123 456', orders: 3, total: 450, gov: 'Tunis' },
          { name: 'Fatma Sassi', phone: '+216 98 765 432', orders: 1, total: 104, gov: 'Sousse' },
        ].map(c => (
          <div key={c.phone} className="flex justify-between text-sm p-3 border rounded-xl"><div><p className="font-medium">{c.name}</p><p className="text-xs text-ink-500">{c.phone} • {c.gov}</p></div><div className="text-right"><p>{c.orders} cmd</p><p className="text-xs text-ink-500">{formatTND(c.total)}</p></div></div>
        ))}
      </CardContent></Card>
    </div>
  )
}

export function CouponsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-[20px] font-bold">Coupons • Pourcent / Fixe</h1>
      <Card className="rounded-xl"><CardContent className="p-4 space-y-2">
        {[
          { code: 'BIENVENUE10', type: 'percentage', value: 10, min: 50, used: 12, limit: 100, expires: '2026-12-31' },
          { code: 'LIVRAISONGRATUITE', type: 'fixed', value: 10, min: 150, used: 5, limit: 50, expires: '2026-10-31' },
        ].map(c => (
          <div key={c.code} className="flex justify-between text-sm p-3 border rounded-xl"><div><p className="font-mono font-bold">{c.code}</p><p className="text-xs text-ink-500">{c.type} {c.value}{c.type==='percentage'?'%':' TND'} • min {c.min} • {c.used}/{c.limit} • exp {c.expires}</p></div><Badge variant="secondary">active</Badge></div>
        ))}
      </CardContent></Card>
      <p className="text-xs text-ink-500">Validation serveur-side: expiration, usage_limit, min_order_amount, active flag, coupon_usages table, jamais trust client discount.</p>
    </div>
  )
}
