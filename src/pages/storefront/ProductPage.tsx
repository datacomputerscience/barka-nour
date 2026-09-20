import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatTND } from '@/lib/utils'
import { mockProducts } from '@/services/productService'
import { Package, Heart, ShoppingBag, Truck, ShieldCheck, Star, Minus, Plus, ArrowLeft, Check } from 'lucide-react'
import { Language } from '@/i18n'
import { trackPixelEvent } from '@/lib/meta'
import { generateEventId } from '@/lib/utils'

interface Props {
  lang: Language
  onAddToCart: (id: string, qty: number, variantId?: string) => void
}

export function ProductPage({ lang, onAddToCart }: Props) {
  const { slug } = useParams()
  const product = mockProducts.find(p => p.slug === slug) || mockProducts[0]
  const [qty, setQty] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)

  const handleAddToCart = () => {
    const eventId = generateEventId()
    trackPixelEvent('AddToCart', { content_ids: [product.id], content_type: 'product', value: product.price * qty, currency: 'TND', num_items: qty }, eventId)
    onAddToCart(product.id, qty, selectedVariant || undefined)
  }

  const related = mockProducts.filter(p => p.id !== product.id).slice(0, 3)

  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-ink-900 mb-6"><ArrowLeft className="h-4 w-4" /> Retour boutique</Link>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-[1.5rem] bg-[#fdfcf8] border border-olive-100 flex items-center justify-center relative overflow-hidden">
            <Package className="h-20 w-20 text-olive-200" />
            {product.compare_at_price && <Badge className="absolute top-4 left-4 bg-ink-900 text-white">-{Math.round((1-product.price/product.compare_at_price)*100)}% • {formatTND(product.compare_at_price - product.price)} économisés</Badge>}
            <Badge className="absolute top-4 right-4 bg-white border text-ink-700"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.8 (24 avis)</Badge>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-square rounded-xl bg-[#fdfcf8] border flex items-center justify-center hover:border-bn-300 cursor-pointer"><Package className="h-6 w-6 text-olive-300" /></div>
            ))}
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800">
            <strong>Politique image Barka Nour:</strong> {product.description?.slice(0, 120)}... Photo objet-only, sans modèle humain, fond neutre.
          </div>
        </div>

        <div>
          <p className="text-xs font-mono text-ink-500">{product.sku} • {product.stock_quantity > 0 ? 'En stock' : 'Rupture'}</p>
          <h1 className="font-display text-[28px] lg:text-[32px] font-bold leading-tight tracking-tight mt-2">{product.name}</h1>
          <p className="text-ink-600 mt-3 leading-relaxed">{product.short_description}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-[28px] font-bold">{formatTND(product.price)}</span>
            {product.compare_at_price && <span className="text-ink-400 line-through">{formatTND(product.compare_at_price)}</span>}
            {product.compare_at_price && <Badge variant="success">Économie {formatTND(product.compare_at_price - product.price)}</Badge>}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Variantes (optionnel)</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'v1', name: 'Beige - S', stock: 5 },
                  { id: 'v2', name: 'Beige - M', stock: 12 },
                  { id: 'v3', name: 'Beige - L', stock: 7 },
                ].map(v => (
                  <button key={v.id} onClick={() => setSelectedVariant(v.id)} className={`px-4 py-2 rounded-full border text-sm transition-all ${selectedVariant === v.id ? 'bg-bn-600 text-white border-bn-600' : 'bg-white border-ink-200 hover:border-bn-300'}`}>
                    {v.name} • {v.stock} stock
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-sm font-medium">Quantité</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => setQty(Math.min(product.stock_quantity, qty + 1))}><Plus className="h-4 w-4" /></Button>
              </div>
              <span className="text-xs text-ink-500">{product.stock_quantity} disponibles</span>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddToCart} disabled={product.stock_quantity === 0} className="flex-1 h-12 rounded-full bg-ink-900 hover:bg-ink-800 text-white"><ShoppingBag className="h-5 w-5" /> {lang === 'ar' ? 'أضف إلى السلة' : 'Ajouter au panier'} • {formatTND(product.price * qty)}</Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full"><Heart className="h-5 w-5" /></Button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100"><Truck className="h-4 w-4 text-emerald-600" /> Livraison 24-72h, 7-10 TND</div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100"><ShieldCheck className="h-4 w-4 text-blue-600" /> Paiement à la livraison</div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold">Description</h3>
              <p className="text-sm text-ink-600 leading-relaxed">{product.description}</p>
              <div className="rounded-xl bg-ink-50 border p-4 text-sm space-y-2">
                <p className="font-medium">Détails:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between"><span className="text-ink-500">SKU</span><span className="font-mono">{product.sku}</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">Stock</span><span className="font-bold">{product.stock_quantity}</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">Seuil alerte</span><span>{product.low_stock_threshold}</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">Statut</span><span className="capitalize">{product.status}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-[20px] font-bold tracking-tight mb-6">Produits similaires</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {related.map(p => (
            <Card key={p.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <Link to={`/products/${p.slug}`}><div className="aspect-[4/3] bg-[#fdfcf8] flex items-center justify-center"><Package className="h-8 w-8 text-olive-300" /></div></Link>
              <CardContent className="p-3">
                <p className="text-xs font-mono text-ink-500">{p.sku}</p>
                <p className="text-sm font-medium line-clamp-2 leading-tight">{p.name}</p>
                <p className="font-bold mt-2 text-sm">{formatTND(p.price)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
