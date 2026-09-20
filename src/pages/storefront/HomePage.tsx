import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatTND } from '@/lib/utils'
import { mockProducts } from '@/services/productService'
import { Package, Truck, ShieldCheck, Star, ArrowRight, Sparkles, MapPin, Search, Check, Heart, Clock } from 'lucide-react'
import { Language } from '@/i18n'

interface Props {
  lang: Language
  onAddToCart: (productId: string) => void
}

export function HomePage({ lang, onAddToCart }: Props) {
  const featured = mockProducts.filter(p => p.featured).slice(0, 6)

  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      {/* Hero - Clearer */}
      <section className="relative overflow-hidden bg-white border-b border-ink-100">
        <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-10 lg:py-16">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bn-50 border border-bn-200 text-xs font-medium text-olive-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {lang === 'ar' ? 'توصيل خلال 24-72 ساعة • 24 ولاية' : lang === 'en' ? 'Delivery in 24-72h • 24 governorates' : 'Livraison en 24-72h • 24 gouvernorats'}
              </div>

              <h1 className="mt-5 font-display text-[34px] lg:text-[48px] font-bold leading-[0.95] tracking-tight text-ink-800">
                {lang === 'ar' ? 'منتجات أصيلة،' : lang === 'en' ? 'Authentic' : 'Des produits sélectionnés'}
                <br />
                <span className="text-olive-700">{lang === 'ar' ? 'توصلك لباب دارك' : lang === 'en' ? 'delivered to your door' : 'livrés chez vous'}</span>
              </h1>

              <p className="mt-4 text-[16px] lg:text-[18px] leading-relaxed text-ink-600 max-w-[520px]">
                {lang === 'ar' ? 'تابل، فخار، سلات، زيوت طبيعية - جودة مضمونة، دفع عند الاستلام، توصيل لكل تونس.' :
                 lang === 'en' ? 'Berber rugs, pottery, natural oils — premium quality, cash on delivery, delivery across Tunisia.' :
                 'Tapis berbères, poteries, huiles naturelles — qualité premium, paiement à la livraison, partout en Tunisie.'}
              </p>

              {/* Search - Clear */}
              <div className="mt-7 max-w-[520px]">
                <div className="flex gap-2 p-1.5 rounded-full bg-white border border-ink-200 shadow-sm">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-3 h-5 w-5 text-ink-400" />
                    <Input placeholder={lang === 'ar' ? 'ماذا تبحث؟ tapis, bocaux, tote...' : lang === 'en' ? 'What are you looking for? rug, jars, tote...' : 'Que cherchez-vous ? tapis, bocaux, tote...'} className="pl-11 h-11 rounded-full border-0 bg-transparent focus:ring-0 text-[15px]" />
                  </div>
                  <Link to="/shop"><Button className="h-11 px-6 rounded-full bg-olive-700 hover:bg-olive-800 text-white"><Search className="h-4 w-4" /> {lang === 'ar' ? 'بحث' : lang === 'en' ? 'Search' : 'Rechercher'}</Button></Link>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="text-ink-500">{lang === 'ar' ? 'الأكثر بحثاً:' : lang === 'en' ? 'Popular:' : 'Populaires:'}</span>
                  {['Tapis berbère', 'Bocaux verre', 'Tote bio', 'Huile argan'].map(t => (
                    <Link key={t} to={`/shop?q=${t}`} className="px-2.5 py-1 rounded-full bg-white border border-ink-200 hover:border-olive-300 hover:text-olive-700 transition-colors">{t}</Link>
                  ))}
                </div>
              </div>

              {/* Trust row */}
              <div className="mt-8 grid grid-cols-3 gap-4 max-w-[520px]">
                <div className="flex items-center gap-2 text-sm"><div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center"><Check className="h-4 w-4 text-emerald-600" /></div><span className="font-medium text-ink-700">Paiement<br /><span className="text-ink-500 font-normal text-xs">à la livraison</span></span></div>
                <div className="flex items-center gap-2 text-sm"><div className="h-8 w-8 rounded-full bg-bn-50 flex items-center justify-center"><Truck className="h-4 w-4 text-bn-600" /></div><span className="font-medium text-ink-700">Livraison<br /><span className="text-ink-500 font-normal text-xs">24-72h • 7-10 TND</span></span></div>
                <div className="flex items-center gap-2 text-sm"><div className="h-8 w-8 rounded-full bg-olive-50 flex items-center justify-center"><ShieldCheck className="h-4 w-4 text-olive-700" /></div><span className="font-medium text-ink-700">Qualité<br /><span className="text-ink-500 font-normal text-xs">premium</span></span></div>
              </div>
            </div>

            {/* Right - Clear product showcase */}
            <div className="relative">
              <div className="rounded-[2rem] bg-[#f7f6f2] border border-ink-200 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-ink-800">{lang === 'ar' ? 'منتجات مختارة' : lang === 'en' ? 'Selected for you' : 'Sélection du jour'}</p>
                  <Badge className="bg-bn-400 text-ink-800 border-bn-300">-25% • Livraison gratuite dès 150 TND</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Card className="overflow-hidden border-ink-200 hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-white flex items-center justify-center relative">
                      <Package className="h-12 w-12 text-olive-200" />
                      <Badge className="absolute top-2 left-2 bg-olive-700 text-white text-[10px]">Best-seller</Badge>
                    </div>
                    <CardContent className="p-3">
                      <p className="font-medium text-sm leading-tight">Tapis Berbère • Laine main</p>
                      <p className="text-xs text-ink-500">Kairouan • 200x150cm</p>
                      <div className="mt-2 flex items-center justify-between"><span className="font-bold">{formatTND(299)}</span><span className="text-xs line-through text-ink-400">{formatTND(399)}</span></div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    <Card className="p-4 bg-olive-700 text-white border-0">
                      <p className="text-xs opacity-80">Stock limité</p>
                      <p className="text-[22px] font-bold leading-none mt-1">3 restants</p>
                      <p className="text-xs opacity-70 mt-1">Tapis Berbère • Beige</p>
                    </Card>
                    <Card className="overflow-hidden border-ink-200">
                      <div className="aspect-[4/3] bg-white flex items-center justify-center"><Package className="h-8 w-8 text-bn-300" /></div>
                      <CardContent className="p-2.5">
                        <p className="font-medium text-xs">Bocaux verre • Set 3</p>
                        <p className="font-bold text-sm mt-1">{formatTND(59)}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-white border border-ink-200">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center"><Clock className="h-4 w-4 text-emerald-600" /></div>
                    <div><p className="text-xs font-bold">Commande avant 14h</p><p className="text-[11px] text-ink-500">Expédiée aujourd'hui</p></div>
                  </div>
                  <div className="flex items-center gap-1 text-xs"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><span className="font-bold">4.9</span><span className="text-ink-500">(500+ avis)</span></div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-3 -right-3 hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-white border shadow-lg text-xs font-medium"><div className="h-6 w-6 rounded-full bg-bn-400 flex items-center justify-center">🇹🇳</div> 24 gouvernorats</div>
              <div className="absolute -bottom-3 -left-3 hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-white border shadow-lg text-xs font-medium"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Paiement COD</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Clear 3 steps */}
      <section className="mx-auto max-w-[1280px] px-4 lg:px-6 py-10">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { step: '01', title: 'Choisissez', desc: 'Parcourez nos produits artisanaux, photos claires sur fond neutre.', icon: Search },
            { step: '02', title: 'Commandez', desc: 'Nom, téléphone, gouvernorat, adresse. Pas besoin de carte.', icon: Package },
            { step: '03', title: 'Recevez', desc: 'Livraison 24-72h, SMS suivi, paiement à la réception.', icon: Truck },
          ].map(s => (
            <div key={s.step} className="flex gap-4 p-5 rounded-2xl bg-white border border-ink-200">
              <div className="h-10 w-10 rounded-xl bg-olive-50 border border-olive-100 flex items-center justify-center font-bold text-olive-700">{s.step}</div>
              <div><p className="font-semibold text-ink-800 flex items-center gap-2"><s.icon className="h-4 w-4 text-ink-400" /> {s.title}</p><p className="text-sm text-ink-600 mt-1 leading-relaxed">{s.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories - Clear */}
      <section className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
        <div className="flex items-end justify-between mb-5">
          <div><h2 className="text-[22px] font-bold tracking-tight text-ink-800">Catégories</h2><p className="text-sm text-ink-600 mt-1">Tout l.artisanat en 4 univers</p></div>
          <Link to="/shop" className="text-sm font-medium text-olive-700 hover:text-olive-800 flex items-center gap-1">Voir tout <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Textiles', sub: 'Tapis • Coussins', count: '12 produits', color: 'bg-[#fff7e2] border-bn-200', icon: '🧶' },
            { name: 'Cuisine', sub: 'Bocaux • Rangement', count: '18 produits', color: 'bg-olive-50 border-olive-100', icon: '🫙' },
            { name: 'Accessoires', sub: 'Tote • Sacs bio', count: '16 produits', color: 'bg-white border-ink-200', icon: '👜' },
            { name: 'Beauté', sub: 'Huiles • Naturel', count: '10 produits', color: 'bg-[#f0f5f3] border-olive-100', icon: '🌿' },
          ].map(c => (
            <Link key={c.name} to={`/shop?cat=${c.name}`} className={`group p-5 rounded-2xl border ${c.color} hover:shadow-md transition-all`}>
              <div className="flex items-start justify-between"><span className="text-[22px]">{c.icon}</span><span className="text-[11px] px-2 py-1 rounded-full bg-white border text-ink-600">{c.count}</span></div>
              <p className="font-semibold mt-3 text-ink-800 group-hover:text-olive-700">{c.name}</p>
              <p className="text-xs text-ink-500">{c.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured - Clear */}
      <section className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8">
        <div className="flex items-end justify-between mb-5">
          <div><h2 className="text-[22px] font-bold tracking-tight text-ink-800">Produits vedettes</h2><p className="text-sm text-ink-600 mt-1">Sélection premium • Stock réel • Livraison 24-72h</p></div>
          <Link to="/shop"><Button variant="outline" size="sm" className="rounded-full bg-white">Voir boutique <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map(product => (
            <Card key={product.id} className="group overflow-hidden border-ink-200 bg-white hover:shadow-lg transition-all">
              <Link to={`/products/${product.slug}`}>
                <div className="aspect-[4/3] bg-[#fdfcf8] relative">
                  <div className="absolute inset-0 flex items-center justify-center"><Package className="h-10 w-10 text-olive-200 group-hover:scale-110 transition-transform" /></div>
                  {product.compare_at_price && <Badge className="absolute top-2.5 left-2.5 bg-olive-700 text-white text-[11px]">-{Math.round((1-product.price/product.compare_at_price)*100)}%</Badge>}
                  <Badge className="absolute top-2.5 right-2.5 bg-bn-400 text-ink-800 border-bn-300 text-[10px]"><Star className="h-3 w-3" /> 4.9</Badge>
                </div>
              </Link>
              <CardContent className="p-3.5">
                <p className="text-[11px] font-mono text-ink-500">{product.sku} • {product.stock_quantity} en stock</p>
                <Link to={`/products/${product.slug}`}><h3 className="font-medium text-sm leading-tight mt-1 line-clamp-2 hover:text-olive-700">{product.name}</h3></Link>
                <div className="mt-2.5 flex items-center justify-between">
                  <div><span className="font-bold text-[15px]">{formatTND(product.price)}</span>{product.compare_at_price && <span className="ml-2 text-xs line-through text-ink-400">{formatTND(product.compare_at_price)}</span>}</div>
                  <Button onClick={() => onAddToCart(product.id)} size="sm" className="h-8 rounded-full bg-olive-700 hover:bg-olive-800 text-white text-xs px-3">Ajouter</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust - Clear */}
      <section className="mx-auto max-w-[1280px] px-4 lg:px-6 py-10">
        <div className="rounded-[1.5rem] bg-olive-700 text-white p-6 lg:p-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-3"><div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0"><Truck className="h-5 w-5" /></div><div><p className="font-semibold text-[15px]">Livraison partout</p><p className="text-sm text-white/70 mt-1 leading-relaxed">24 gouvernorats • 24-72h • 7-10 TND • Gratuit dès 150 TND • Suivi SMS</p></div></div>
            <div className="flex gap-3"><div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0"><ShieldCheck className="h-5 w-5" /></div><div><p className="font-semibold text-[15px]">Paiement à la livraison</p><p className="text-sm text-white/70 mt-1 leading-relaxed">Pas de carte • Payez en espèces à réception • Vérification colis</p></div></div>
            <div className="flex gap-3"><div className="h-10 w-10 rounded-xl bg-bn-400/20 flex items-center justify-center shrink-0"><Package className="h-5 w-5 text-bn-300" /></div><div><p className="font-semibold text-[15px]">Qualité garantie</p><p className="text-sm text-white/70 mt-1 leading-relaxed">Artisanat • Matériaux durables • Support réactif • Fabrication locale</p></div></div>
          </div>
        </div>
      </section>
    </div>
  )
}
