import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatTND } from '@/lib/utils'
import { Package, Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import { Language } from '@/i18n'

export interface CartItem {
  id: string
  product_id: string
  name: string
  slug: string
  sku: string
  price: number
  quantity: number
  stock: number
  variant?: string
}

interface Props {
  lang: Language
  items: CartItem[]
  onUpdateQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
  couponCode?: string
  onApplyCoupon?: (code: string) => void
}

export function CartPage({ lang, items, onUpdateQty, onRemove }: Props) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shippingEstimate = subtotal >= 150 ? 0 : 8
  const total = subtotal + shippingEstimate

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-20 text-center">
        <div className="mx-auto h-20 w-20 rounded-[1.5rem] bg-ink-50 border flex items-center justify-center mb-6"><Package className="h-10 w-10 text-ink-300" /></div>
        <h1 className="text-[24px] font-bold">Votre panier est vide</h1>
        <p className="text-ink-600 mt-2 text-sm max-w-[400px] mx-auto">Découvrez nos produits artisanaux tunisiens, 100% objet-only sans images humaines.</p>
        <Link to="/shop"><Button className="mt-6 rounded-full bg-ink-900 text-white h-11 px-8">Continuer achats <ArrowRight className="h-4 w-4" /></Button></Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8">
      <h1 className="text-[24px] font-bold tracking-tight font-display">Panier • {items.length} articles</h1>

      <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-4">
          {items.map(item => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4 flex gap-4">
                <div className="h-[88px] w-[88px] rounded-xl bg-[#fdfcf8] border flex items-center justify-center flex-shrink-0"><Package className="h-8 w-8 text-olive-300" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-mono text-ink-500">{item.sku} {item.variant && `• ${item.variant}`}</p>
                  <Link to={`/products/${item.slug}`} className="font-medium text-sm leading-tight line-clamp-2 hover:text-bn-700">{item.name}</Link>
                  <p className="text-xs text-ink-500 mt-1">{item.stock} en stock</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-1 border rounded-full px-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}><Minus className="h-3.5 w-3.5" /></Button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => onUpdateQty(item.id, Math.min(item.stock, item.quantity + 1))}><Plus className="h-3.5 w-3.5" /></Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(item.id)}><Trash2 className="h-4 w-4 text-ink-400" /></Button>
                    <span className="ml-auto font-bold text-sm">{formatTND(item.price * item.quantity)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex gap-3 text-sm">
            <Truck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-900">{subtotal >= 150 ? 'Livraison gratuite débloquée!' : `Plus que ${formatTND(150 - subtotal)} pour livraison gratuite`}</p>
              <p className="text-xs text-emerald-700 mt-1">Livraison 7-10 TND selon gouvernorat • Paiement à la livraison disponible</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="rounded-[1.25rem]">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold">Résumé</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-ink-600">Sous-total</span><span className="font-medium">{formatTND(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-ink-600">Livraison estimée</span><span className="font-medium">{shippingEstimate === 0 ? 'Gratuite' : formatTND(shippingEstimate)}</span></div>
                <div className="border-t pt-2 flex justify-between font-bold text-[16px]"><span>Total</span><span>{formatTND(total)}</span></div>
              </div>

              <div className="flex gap-2">
                <Input placeholder="Code promo" className="h-10 rounded-full" />
                <Button variant="outline" className="h-10 rounded-full">Appliquer</Button>
              </div>

              <Link to="/checkout"><Button className="w-full h-12 rounded-full bg-ink-900 hover:bg-ink-800 text-white">Passer commande <ArrowRight className="h-4 w-4" /></Button></Link>

              <div className="flex items-center justify-center gap-4 text-[11px] text-ink-500 pt-2">
                <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Paiement sécurisé</span>
                <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> COD</span>
              </div>

              <p className="text-[11px] text-ink-500 leading-relaxed">En commandant, vous acceptez nos conditions. Prix snapshot serveur-side • Aucun trust client totals (15-step validation).</p>
            </CardContent>
          </Card>

          <Card className="rounded-[1.25rem] bg-ink-900 text-white">
            <CardContent className="p-5">
              <p className="font-semibold text-sm">Barka Nour</p>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">Boutique tunisienne unique • Stock réel • Pas de survente • Livraison via MesColis/Aramex/First etc.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
