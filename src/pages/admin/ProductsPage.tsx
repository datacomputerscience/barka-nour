import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatTND } from '@/lib/utils'
import { mockProducts } from '@/services/productService'
import { Package, Plus, Search, Edit, Trash2, Eye, AlertTriangle } from 'lucide-react'

export function ProductsPage() {
  const [search, setSearch] = useState('')
  const filtered = mockProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-[20px] font-bold">Produits • Single-store Barka Nour</h1><p className="text-sm text-ink-600">5 produits mock objet-only, SKU, prix, stock, SEO, featured</p></div>
        <Button className="rounded-full bg-ink-900 text-white h-9"><Plus className="h-4 w-4" /> Nouveau produit</Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-[320px]"><Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" /><Input placeholder="Rechercher SKU, nom..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} /></div>
        <Badge variant="secondary">{filtered.length} produits</Badge>
      </div>

      <div className="grid gap-3">
        {filtered.map(p => (
          <Card key={p.id} className="rounded-xl hover:shadow-sm transition-shadow">
            <CardContent className="p-4 flex gap-4">
              <div className="h-16 w-16 rounded-xl bg-[#fdfcf8] border flex items-center justify-center flex-shrink-0"><Package className="h-7 w-7 text-olive-300" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-mono text-[11px] text-ink-500">{p.sku} • {p.slug}</p><p className="font-medium text-sm leading-tight">{p.name}</p><p className="text-xs text-ink-500 line-clamp-1">{p.short_description}</p></div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm">{formatTND(p.price)}</span>
                  {p.compare_at_price && <span className="text-xs line-through text-ink-400">{formatTND(p.compare_at_price)}</span>}
                  <Badge variant={p.status === 'active' ? 'success' : 'secondary'} className="text-[10px]">{p.status}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{p.stock_quantity} stock</Badge>
                  {p.stock_quantity <= p.low_stock_threshold && <Badge variant="warning" className="text-[10px] flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> low</Badge>}
                  {p.featured && <Badge className="text-[10px] bg-bn-100 text-bn-800 border-bn-200">featured</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-xl bg-ink-50 border-dashed">
        <CardContent className="p-4 text-xs text-ink-600">
          <p className="font-semibold">Architecture produit:</p>
          <p>Simple+variable (ProductVariant SKU/stock/prix), images objet-only sans humains, SEO meta_title/description, featured, statut active/draft/archived, inventory_movements tracés, low_stock_threshold, prevent negative stock, UUID PK, created_at/updated_at.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function CategoriesPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-[20px] font-bold">Catégories • Parent/child</h1>
      <div className="grid gap-3 max-w-[640px]">
        {[
          { name: 'Textiles berbères', slug: 'textiles', count: 1, parent: null },
          { name: 'Cuisine & Stockage', slug: 'cuisine', count: 1, parent: null },
          { name: 'Accessoires éco', slug: 'accessoires', count: 1, parent: null },
          { name: 'Beauté naturelle', slug: 'beaute', count: 1, parent: null },
          { name: 'Tech & Bureau', slug: 'tech', count: 1, parent: null },
        ].map(c => (
          <Card key={c.slug} className="rounded-xl"><CardContent className="p-4 flex justify-between items-center"><div><p className="font-medium text-sm">{c.name}</p><p className="text-xs text-ink-500 font-mono">/{c.slug} • {c.count} produits</p></div><Badge variant="secondary">{c.parent ? 'child' : 'parent'}</Badge></CardContent></Card>
        ))}
      </div>
    </div>
  )
}

export function InventoryPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-[20px] font-bold">Inventaire • Mouvements réels</h1>
      <Card className="rounded-xl"><CardContent className="p-4 space-y-3">
        {[
          { sku: 'BN-TAPIS-001', movement: -1, reason: 'order', at: '2026-09-20 10:00' },
          { sku: 'BN-BOCAUX-001', movement: +20, reason: 'restock', at: '2026-09-19 14:30' },
          { sku: 'BN-SAC-001', movement: -2, reason: 'order', at: '2026-09-19 09:15' },
        ].map((m, i) => (
          <div key={i} className="flex justify-between text-sm p-2 rounded-lg border"><span className="font-mono text-xs">{m.sku}</span><span className={m.movement > 0 ? 'text-emerald-600' : 'text-red-600'}>{m.movement > 0 ? '+' : ''}{m.movement}</span><span className="text-xs text-ink-500">{m.reason}</span><span className="text-xs text-ink-500">{m.at}</span></div>
        ))}
      </CardContent></Card>
      <p className="text-xs text-ink-500">Table inventory_movements: product_id, variant_id nullable, quantity_change, reason (order/restock/adjustment/return), reference_id, created_by, notes, created_at. Prevent negative stock via check constraint + app validation.</p>
    </div>
  )
}
