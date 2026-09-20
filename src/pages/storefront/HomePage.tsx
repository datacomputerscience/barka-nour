import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatTND } from '@/lib/utils'
import { mockProducts } from '@/services/productService'
import { Package, Truck, ShieldCheck, Star, ArrowRight, Sparkles, MapPin, Heart } from 'lucide-react'
import { Language } from '@/i18n'

interface Props {
  lang: Language
  onAddToCart: (productId: string) => void
}

export function HomePage({ lang, onAddToCart }: Props) {
  const featured = mockProducts.filter(p => p.featured).slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#fdfcf8]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(202,138,4,0.08),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(202,138,4,0.05),transparent_50%)]" />
        <div className="relative mx-auto max-w-[1280px] px-4 lg:px-6 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 bg-white border-bn-200 text-bn-800 gap-1.5">
                <Sparkles className="h-3 w-3" />
                {lang === 'ar' ? 'صناعة تونسية أصيلة • بدون صور بشرية' : lang === 'en' ? 'Authentic Tunisian craft • No human images' : 'Artisanat tunisien authentique • Sans images humaines'}
              </Badge>
              <h1 className="font-display text-[36px] lg:text-[52px] font-bold leading-[0.9] tracking-tight text-ink-900">
                {lang === 'ar' ? 'بركة نور' : 'Barka Nour'}<br />
                <span className="text-bn-600">{lang === 'ar' ? 'جوهر الحرف' : lang === 'en' ? 'Essence of Craft' : 'L\'essence de l\'artisanat'}</span>
              </h1>
              <p className="mt-5 text-[17px] leading-relaxed text-ink-600 max-w-[480px]">
                {lang === 'ar' ? 'منتجات تونسية أصيلة مختارة بعناية. كل منتج يحكي قصة حرفي. توصيل في جميع أنحاء تونس، الدفع عند الاستلام.' :
                 lang === 'en' ? 'Authentic Tunisian products, carefully selected. Each product tells a craftsman story. Delivery across Tunisia, cash on delivery.' :
                 'Des produits tunisiens authentiques, sélectionnés avec soin. Chaque produit raconte l\'histoire d\'un artisan. Livraison partout en Tunisie, paiement à la livraison.'}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/shop"><Button size="lg" className="h-12 px-7 bg-bn-600 hover:bg-bn-700 text-white rounded-full">{lang === 'ar' ? 'اكتشف المجموعة' : lang === 'en' ? 'Discover collection' : 'Découvrir la collection'} <ArrowRight className="h-5 w-5" /></Button></Link>
                <Link to="/about"><Button variant="outline" size="lg" className="h-12 px-7 rounded-full bg-white">{lang === 'ar' ? 'قصتنا' : lang === 'en' ? 'Our story' : 'Notre histoire'}</Button></Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">{[1,2,3].map(i => <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-olive-100 flex items-center justify-center text-[10px]">★</div>)}</div>
                  <span className="text-ink-600"><strong className="text-ink-900">+500</strong> {lang === 'ar' ? 'عميل راض' : lang === 'en' ? 'happy customers' : 'clients satisfaits'}</span>
                </div>
                <div className="h-4 w-px bg-ink-200" />
                <div className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><strong className="text-ink-900">4.9/5</strong></div>
              </div>
            </div>

            <div className="relative lg:h-[520px]">
              <div className="relative mx-auto max-w-[440px] lg:absolute lg:inset-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="aspect-[3/4] rounded-[1.5rem] bg-white border border-olive-100 shadow-sm flex flex-col p-4">
                      <div className="flex-1 rounded-xl bg-olive-50 flex items-center justify-center"><Package className="h-10 w-10 text-olive-800/40" /></div>
                      <div className="mt-3"><p className="text-sm font-bold">Tapis Berbère</p><p className="text-xs text-ink-500">Tissé main • Kairouan</p><p className="text-sm font-bold mt-1">299,000 TND</p></div>
                    </div>
                    <div className="aspect-square rounded-[1.5rem] bg-ink-900 text-white p-5 flex flex-col justify-between">
                      <p className="text-xs opacity-70">Offre spéciale</p>
                      <div><p className="text-[28px] font-bold leading-none">-25%</p><p className="text-xs opacity-70 mt-1">Sur collection maison</p></div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="aspect-square rounded-[1.5rem] bg-bn-50 border border-bn-100 p-4 flex flex-col justify-between">
                      <div className="h-12 w-12 rounded-xl bg-white border flex items-center justify-center"><Truck className="h-6 w-6 text-bn-600" /></div>
                      <div><p className="text-sm font-bold">Livraison offerte</p><p className="text-xs text-ink-500">Dès 150 TND</p></div>
                    </div>
                    <div className="aspect-[3/4] rounded-[1.5rem] bg-white border shadow-sm flex flex-col p-4">
                      <div className="flex-1 rounded-xl bg-[#fefce8] flex items-center justify-center"><Package className="h-10 w-10 text-bn-800/30" /></div>
                      <div className="mt-3"><p className="text-sm font-bold">Sac Tote Bio</p><p className="text-xs text-ink-500">Coton bio • Naturel</p><p className="text-sm font-bold mt-1">45,000 TND</p></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-[10%] -right-4 rounded-2xl bg-white border shadow-xl p-3 flex items-center gap-3 animate-float">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center"><ShieldCheck className="h-5 w-5 text-emerald-600" /></div>
                  <div><p className="text-xs font-bold">Paiement sécurisé</p><p className="text-[11px] text-ink-500">COD • Sans carte</p></div>
                </div>
                <div className="absolute bottom-[15%] -left-4 rounded-2xl bg-white border shadow-xl p-3 flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="h-10 w-10 rounded-xl bg-bn-50 flex items-center justify-center"><MapPin className="h-5 w-5 text-bn-600" /></div>
                  <div><p className="text-xs font-bold">24 Gouvernorats</p><p className="text-[11px] text-ink-500">Livraison 24-72h</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-[1280px] px-4 lg:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-bold tracking-tight font-display">{lang === 'ar' ? 'الفئات' : lang === 'en' ? 'Categories' : 'Catégories'}</h2>
          <Link to="/categories"><Button variant="ghost" size="sm">{lang === 'ar' ? 'عرض الكل' : lang === 'en' ? 'View all' : 'Voir tout'} <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: lang === 'ar' ? 'المنسوجات' : lang === 'en' ? 'Textiles' : 'Textiles', count: 12, color: 'bg-amber-50 border-amber-100' },
            { name: lang === 'ar' ? 'المطبخ' : lang === 'en' ? 'Kitchen' : 'Cuisine', count: 18, color: 'bg-olive-100 border-olive-200' },
            { name: lang === 'ar' ? 'الجمال' : lang === 'en' ? 'Beauty' : 'Beauté', count: 10, color: 'bg-rose-50 border-rose-100' },
            { name: lang === 'ar' ? 'الإكسسوارات' : lang === 'en' ? 'Accessories' : 'Accessoires', count: 16, color: 'bg-blue-50 border-blue-100' },
          ].map(c => (
            <Card key={c.name} className={`${c.color} hover:shadow-md transition-all cursor-pointer group`}>
              <CardContent className="p-5">
                <div className="h-12 w-12 rounded-xl bg-white border flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"><Package className="h-6 w-6 text-ink-400" /></div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-ink-500 mt-1">{c.count} {lang === 'ar' ? 'منتج' : lang === 'en' ? 'products' : 'produits'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-bold tracking-tight font-display">{lang === 'ar' ? 'منتجات مميزة' : lang === 'en' ? 'Featured products' : 'Produits vedettes'}</h2>
          <Link to="/shop"><Button variant="outline" size="sm" className="rounded-full">{lang === 'ar' ? 'عرض المتجر' : lang === 'en' ? 'View shop' : 'Voir boutique'}</Button></Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {featured.map(product => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all border-ink-100">
              <Link to={`/products/${product.slug}`}>
                <div className="aspect-[4/3] bg-[#fdfcf8] relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center"><Package className="h-12 w-12 text-olive-200 group-hover:scale-110 transition-transform" /></div>
                  {product.compare_at_price && <Badge className="absolute top-3 left-3 bg-ink-900 text-white">-{Math.round((1-product.price/product.compare_at_price)*100)}%</Badge>}
                  {product.featured && <Badge className="absolute top-3 right-3 bg-bn-600 text-white"><Star className="h-3 w-3" /> Vedette</Badge>}
                </div>
              </Link>
              <CardContent className="p-4">
                <p className="text-xs text-ink-500">{product.sku}</p>
                <Link to={`/products/${product.slug}`}><h3 className="font-medium text-ink-900 mt-1 leading-tight line-clamp-2 text-sm hover:text-bn-700">{product.name}</h3></Link>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-baseline gap-2"><span className="font-bold">{formatTND(product.price)}</span>{product.compare_at_price && <span className="text-xs text-ink-400 line-through">{formatTND(product.compare_at_price)}</span>}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${product.stock_quantity > 5 ? 'bg-emerald-50 text-emerald-700' : product.stock_quantity > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{product.stock_quantity > 0 ? `${product.stock_quantity} en stock` : 'Rupture'}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button onClick={() => onAddToCart(product.id)} disabled={product.stock_quantity === 0} className="flex-1 rounded-full bg-ink-900 hover:bg-ink-800 text-white h-9 text-sm"><Package className="h-4 w-4" /> {lang === 'ar' ? 'أضف' : lang === 'en' ? 'Add' : 'Ajouter'}</Button>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-full"><Heart className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-[1280px] px-4 lg:px-6 py-12">
        <div className="rounded-[2rem] bg-ink-900 text-white p-8 lg:p-12 grid md:grid-cols-3 gap-8">
          <div className="flex gap-4"><div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0"><Truck className="h-6 w-6" /></div><div><p className="font-semibold">Livraison partout en Tunisie</p><p className="text-sm text-ink-300 mt-1 leading-relaxed">24 gouvernorats, 24-72h, suivi SMS. Frais 7-10 TND, gratuit dès 150 TND.</p></div></div>
          <div className="flex gap-4"><div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0"><ShieldCheck className="h-6 w-6" /></div><div><p className="font-semibold">Paiement à la livraison</p><p className="text-sm text-ink-300 mt-1 leading-relaxed">Payez quand vous recevez. Pas de carte nécessaire. Confirmation par téléphone.</p></div></div>
          <div className="flex gap-4"><div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0"><Package className="h-6 w-6" /></div><div><p className="font-semibold">Artisanat authentique</p><p className="text-sm text-ink-300 mt-1 leading-relaxed">Produits sélectionnés, sans images humaines, photos objet-only sur fond neutre.</p></div></div>
        </div>
      </section>
    </div>
  )
}
