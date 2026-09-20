import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { formatTND } from '@/lib/utils'
import { mockProducts } from '@/services/productService'
import { Package, Search, SlidersHorizontal, Heart } from 'lucide-react'
import { Language } from '@/i18n'

interface Props {
  lang: Language
  onAddToCart: (id: string) => void
}

export function ShopPage({ lang, onAddToCart }: Props) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [category, setCategory] = useState('all')

  let filtered = mockProducts.filter(p => p.status === 'active')
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  if (category !== 'all') filtered = filtered.filter(p => p.name.toLowerCase().includes(category.toLowerCase()))

  if (sort === 'price-asc') filtered = [...filtered].sort((a,b) => a.price - b.price)
  if (sort === 'price-desc') filtered = [...filtered].sort((a,b) => b.price - a.price)
  if (sort === 'newest') filtered = [...filtered].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[240px] space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Catégories</h3>
            <div className="space-y-2 text-sm">
              {[
                { id: 'all', name: 'Tous', count: mockProducts.length },
                { id: 'tapis', name: 'Textiles', count: 1 },
                { id: 'bocaux', name: 'Cuisine', count: 1 },
                { id: 'sac', name: 'Accessoires', count: 1 },
                { id: 'huile', name: 'Beauté', count: 1 },
              ].map(c => (
                <button key={c.id} onClick={() => setCategory(c.id)} className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${category === c.id ? 'bg-bn-50 border border-bn-200 text-bn-800' : 'hover:bg-ink-50'}`}>
                  <span>{c.name}</span><Badge variant="secondary" className="text-[10px]">{c.count}</Badge>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-ink-50 border p-4">
            <h4 className="font-medium text-sm mb-2">Filtres</h4>
            <div className="space-y-3 text-sm">
              <div><p className="text-xs text-ink-500 mb-1">Prix</p><div className="flex gap-2"><Input placeholder="Min" className="h-8" /><Input placeholder="Max" className="h-8" /></div></div>
              <div className="flex items-center gap-2"><input type="checkbox" defaultChecked /> <span>En stock seulement</span></div>
              <div className="flex items-center gap-2"><input type="checkbox" /> <span>Promotions</span></div>
            </div>
          </div>

          <div className="rounded-xl bg-bn-50 border border-bn-200 p-4">
            <p className="font-semibold text-sm text-bn-900">Artisanat authentique</p>
            <p className="text-xs text-bn-700/80 mt-1 leading-relaxed">Produits sélectionnés pour leur qualité, fabrication locale et matériaux durables. Livraison partout en Tunisie.</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div><h1 className="text-[24px] font-bold tracking-tight font-display">Boutique</h1><p className="text-sm text-ink-600">{filtered.length} produits • Artisanat authentique</p></div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-[240px]"><Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" /><Input placeholder="Rechercher..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} /></div>
              <Select value={sort} onChange={e => setSort(e.target.value)} className="h-9 w-[160px]"><option value="featured">Vedette</option><option value="newest">Nouveautés</option><option value="price-asc">Prix croissant</option><option value="price-desc">Prix décroissant</option></Select>
              <Button variant="outline" size="icon" className="h-9 w-9"><SlidersHorizontal className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(product => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all">
                <Link to={`/products/${product.slug}`}>
                  <div className="aspect-[4/3] bg-[#fdfcf8] relative">
                    <div className="absolute inset-0 flex items-center justify-center"><Package className="h-10 w-10 text-olive-200 group-hover:scale-110 transition-transform" /></div>
                    {product.compare_at_price && <Badge className="absolute top-2 left-2 bg-olive-700 text-white text-[10px]">-{Math.round((1-product.price/product.compare_at_price)*100)}%</Badge>}
                  </div>
                </Link>
                <CardContent className="p-3">
                  <p className="text-[11px] text-ink-500 font-mono">{product.sku}</p>
                  <Link to={`/products/${product.slug}`}><h3 className="font-medium text-sm leading-tight line-clamp-2 hover:text-bn-700">{product.name}</h3></Link>
                  <div className="mt-2 flex items-center justify-between"><span className="font-bold text-sm">{formatTND(product.price)}</span><span className="text-[11px] text-ink-500">{product.stock_quantity} stock</span></div>
                  <Button onClick={() => onAddToCart(product.id)} className="w-full mt-3 h-8 rounded-full bg-olive-700 hover:bg-olive-800 text-white text-xs">Ajouter</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16"><Package className="h-12 w-12 text-ink-300 mx-auto" /><p className="font-medium mt-4">Aucun produit trouvé</p><p className="text-sm text-ink-500">Essayez autre recherche ou catégorie</p></div>
          )}
        </div>
      </div>
    </div>
  )
}
