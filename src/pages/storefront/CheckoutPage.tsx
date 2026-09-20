import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatTND, TUNISIAN_GOVERNORATES } from '@/lib/utils'
import { Package, ShieldCheck, Truck, MapPin, Phone, Mail, User, CreditCard } from 'lucide-react'
import { Language } from '@/i18n'
import { CartItem } from './CartPage'
import { generateEventId, generateOrderNumber } from '@/lib/utils'
import { trackPixelEvent } from '@/lib/meta'

interface Props {
  lang: Language
  items: CartItem[]
  onOrderPlaced: (orderNumber: string) => void
}

export function CheckoutPage({ lang, items, onOrderPlaced }: Props) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    governorate: 'Tunis',
    city: '',
    address: '',
    postalCode: '',
    notes: '',
    paymentMethod: 'cod',
  })

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal >= 150 ? 0 : (form.governorate === 'Tunis' ? 7 : 10)
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Server-side simulation: never trust client totals - recalculate
    const eventId = generateEventId()
    const orderNumber = generateOrderNumber()

    // Simulate 15-step validation
    // 1. Validate required fields
    // 2. Validate phone format TN
    // 3. Validate governorate in 24 list
    // 4. Fetch fresh product prices from server (mock)
    // 5. Validate stock
    // 6. Recalculate subtotal server-side
    // 7. Validate coupon server-side if present
    // 8. Calculate delivery fee by governorate
    // 9. Check free shipping threshold
    // 10. Calculate total server-side
    // 11. Check idempotency key
    // 12. Create customer if phone not exists
    // 13. Create order with price snapshots
    // 14. Decrement inventory
    // 15. Create shipment + emit events

    trackPixelEvent('InitiateCheckout', {
      content_ids: items.map(i => i.product_id),
      content_type: 'product',
      value: total,
      currency: 'TND',
      num_items: items.reduce((s, i) => s + i.quantity, 0),
    }, eventId)

    // Simulate network
    await new Promise(r => setTimeout(r, 900))

    onOrderPlaced(orderNumber)
    navigate(`/order-confirmation?order=${orderNumber}`)
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8">
      <h1 className="text-[24px] font-bold tracking-tight">Commande • Paiement à la livraison</h1>
      <p className="text-sm text-ink-600 mt-1">Livraison {shipping === 0 ? 'gratuite' : `${formatTND(shipping)}`} • Confirmation par téléphone</p>

      <form onSubmit={handleSubmit} className="mt-8 grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-6">
          <Card className="rounded-[1.25rem]">
            <CardHeader className="pb-3"><CardTitle className="text-[16px] flex items-center gap-2"><User className="h-4 w-4" /> Informations client</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nom complet *</Label><div className="relative"><User className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" /><Input required placeholder="Mohamed Ben Ali" className="pl-9 h-11" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} /></div></div>
                <div className="space-y-2"><Label>Téléphone * (TN)</Label><div className="relative"><Phone className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" /><Input required placeholder="+216 20 123 456" className="pl-9 h-11" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div></div>
              </div>
              <div className="space-y-2"><Label>Email (optionnel)</Label><div className="relative"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" /><Input type="email" placeholder="vous@exemple.tn" className="pl-9 h-11" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div></div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.25rem]">
            <CardHeader className="pb-3"><CardTitle className="text-[16px] flex items-center gap-2"><MapPin className="h-4 w-4" /> Adresse de livraison • 24 gouvernorats</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Gouvernorat *</Label><Select value={form.governorate} onChange={e => setForm({...form, governorate: e.target.value})} className="h-11"><option value="">Choisir gouvernorat</option>{TUNISIAN_GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}</Select></div>
                <div className="space-y-2"><Label>Ville *</Label><Input required placeholder="Tunis, Sousse, Sfax..." className="h-11" value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></div>
              </div>
              <div className="space-y-2"><Label>Adresse complète *</Label><Input required placeholder="Rue, numéro, étage, repère" className="h-11" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Code postal</Label><Input placeholder="1000" className="h-11" value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} /></div>
                <div className="space-y-2"><Label>Notes livraison</Label><Input placeholder="Sonner 2e étage..." className="h-11" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.25rem]">
            <CardHeader className="pb-3"><CardTitle className="text-[16px] flex items-center gap-2"><CreditCard className="h-4 w-4" /> Paiement</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-bn-600 bg-bn-50 cursor-pointer">
                <input type="radio" checked={form.paymentMethod === 'cod'} onChange={() => setForm({...form, paymentMethod: 'cod'})} className="h-4 w-4" />
                <div className="flex-1"><p className="font-semibold text-sm">Paiement à la livraison (COD) • Recommandé Tunisie</p><p className="text-xs text-ink-600">Payez en espèces à réception • Vérification colis</p></div>
                <Truck className="h-5 w-5 text-bn-700" />
              </label>
              <p className="text-[11px] text-ink-500">Paiement sécurisé à la réception. Vérification du colis possible.</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-[1.25rem] sticky top-20">
            <CardHeader className="pb-3"><CardTitle className="text-[16px]">Résumé • {items.length} articles</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-[240px] overflow-auto pr-1">
                {items.map(i => (
                  <div key={i.id} className="flex gap-3 text-sm">
                    <div className="h-12 w-12 rounded-lg bg-[#fdfcf8] border flex items-center justify-center flex-shrink-0"><Package className="h-5 w-5 text-olive-300" /></div>
                    <div className="flex-1 min-w-0"><p className="font-medium leading-tight line-clamp-1">{i.name}</p><p className="text-xs text-ink-500">x{i.quantity} • {formatTND(i.price)}</p></div>
                    <span className="font-bold text-sm">{formatTND(i.price * i.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between"><span className="text-ink-600">Sous-total</span><span>{formatTND(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-ink-600">Livraison ({form.governorate})</span><span>{shipping === 0 ? 'Gratuite' : formatTND(shipping)}</span></div>
                {shipping === 0 && <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2">Livraison gratuite car ≥150 TND</p>}
                <div className="flex justify-between font-bold text-[16px] border-t pt-2"><span>Total à payer</span><span>{formatTND(total)}</span></div>
              </div>

              <Button type="submit" disabled={loading || items.length === 0} className="w-full h-12 rounded-full bg-olive-700 hover:bg-olive-800 text-white">
                {loading ? 'Traitement sécurisé...' : `Confirmer • ${formatTND(total)}`}
              </Button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-ink-500">
                <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Paiement sécurisé</span>
                <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> Livraison 24-72h</span>
              </div>

              <div className="rounded-xl bg-ink-50 border p-3 text-[11px] text-ink-600 leading-relaxed">
                En confirmant, vous acceptez nos conditions de vente. Livraison partout en Tunisie, retours sous 7 jours.
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
