import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarkaNourLogo } from './BarkaNourLogo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ShoppingBag, Heart, Menu, X, Globe, Package, Truck, ShieldCheck } from 'lucide-react'
import { Language } from '@/i18n'

interface Props {
  children: React.ReactNode
  cartCount: number
  lang: Language
  setLang?: (l: Language) => void
  onLangChange?: (l: Language) => void
  onCartOpen?: () => void
}

export function StorefrontLayout({ children, cartCount, lang, setLang, onLangChange, onCartOpen }: Props) {
  const handleLang = (l: Language) => {
    setLang?.(l)
    onLangChange?.(l)
  }
  const [mobileMenu, setMobileMenu] = useState(false)
  const location = useLocation()

  const nav = [
    { href: '/', label: lang === 'ar' ? 'الرئيسية' : lang === 'en' ? 'Home' : 'Accueil' },
    { href: '/shop', label: lang === 'ar' ? 'المتجر' : lang === 'en' ? 'Shop' : 'Boutique' },
    { href: '/categories', label: lang === 'ar' ? 'الفئات' : lang === 'en' ? 'Categories' : 'Catégories' },
    { href: '/offers', label: lang === 'ar' ? 'العروض' : lang === 'en' ? 'Offers' : 'Offres' },
  ]

  return (
    <div className="min-h-screen bg-[#f7f6f2]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-olive-700 text-white text-xs py-2 px-4 text-center">
        <span className="inline-flex items-center gap-2">
          <Truck className="h-3.5 w-3.5" /> 
          {lang === 'ar' ? 'توصيل في جميع أنحاء تونس • الدفع عند الاستلام • إرجاع 7 أيام' : 
           lang === 'en' ? 'Delivery across Tunisia • Cash on Delivery • 7-day returns' :
           'Livraison partout en Tunisie • Paiement à la livraison • Retour 7 jours'}
        </span>
      </div>

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-ink-100">
        <div className="mx-auto max-w-[1280px] px-4 lg:px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/"><BarkaNourLogo size="sm" /></Link>
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              {nav.map(item => (
                <Link key={item.href} to={item.href} className={`hover:text-ink-900 transition-colors ${location.pathname === item.href ? 'text-ink-900 font-semibold' : 'text-ink-600'}`}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 rounded-full bg-ink-50 border border-ink-100 p-1">
              {(['fr','ar','en'] as Language[]).map(l => (
                <button key={l} onClick={() => handleLang(l)} className={`h-7 px-2.5 rounded-full text-xs font-medium transition-all ${lang === l ? 'bg-white shadow-sm text-ink-900 border border-ink-200' : 'text-ink-500 hover:text-ink-700'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="hidden md:relative md:flex">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" />
              <Input placeholder={lang === 'ar' ? 'بحث...' : lang === 'en' ? 'Search...' : 'Rechercher...'} className="pl-9 w-[180px] h-9 rounded-full bg-ink-50 border-ink-100" />
            </div>
            <Button variant="ghost" size="icon" className="rounded-full"><Heart className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="rounded-full relative" onClick={onCartOpen}>
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-bn-600 text-white text-[11px] font-bold flex items-center justify-center">{cartCount}</span>}
            </Button>
          </div>
        </div>

        {mobileMenu && (
          <div className="lg:hidden border-t border-ink-100 bg-white p-4 space-y-3">
            {nav.map(item => (
              <Link key={item.href} to={item.href} onClick={() => setMobileMenu(false)} className="block py-2 font-medium">{item.label}</Link>
            ))}
            <div className="flex gap-2 pt-2">
              {(['fr','ar','en'] as Language[]).map(l => (
                <Button key={l} variant={lang === l ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => handleLang(l)}>{l.toUpperCase()}</Button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="mt-16 border-t border-ink-100 bg-[#fdfcf8]">
        <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <BarkaNourLogo size="sm" />
              <p className="mt-4 text-sm text-ink-600 leading-relaxed">
                {lang === 'ar' ? 'متجر بركة نور - منتجات تونسية أصيلة، حرفة وتقاليد. جودة، ثقة وتوصيل في جميع أنحاء تونس.' :
                 lang === 'en' ? 'Barka Nour store - authentic Tunisian products, craft and tradition. Quality, trust and delivery across Tunisia.' :
                 'Boutique Barka Nour - produits tunisiens authentiques, artisanat et tradition. Qualité, confiance et livraison partout en Tunisie.'}
              </p>
              <div className="mt-4 flex gap-2 text-xs text-ink-500">
                <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> COD</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> 24 Gouvernorats</span>
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">{lang === 'ar' ? 'المتجر' : lang === 'en' ? 'Shop' : 'Boutique'}</p>
              <div className="space-y-2 text-sm text-ink-600">
                <p>Tous les produits</p><p>Nouveautés</p><p>Meilleures ventes</p><p>Offres</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">{lang === 'ar' ? 'المساعدة' : lang === 'en' ? 'Help' : 'Aide'}</p>
              <div className="space-y-2 text-sm text-ink-600">
                <p>{lang === 'ar' ? 'تتبع الطلب' : lang === 'en' ? 'Track order' : 'Suivi commande'}</p>
                <p>{lang === 'ar' ? 'الشحن' : lang === 'en' ? 'Shipping' : 'Livraison'}</p>
                <p>{lang === 'ar' ? 'الإرجاع' : lang === 'en' ? 'Returns' : 'Retours'}</p>
                <p>Contact</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Barka Nour</p>
              <div className="space-y-2 text-sm text-ink-600">
                <p>À propos</p><p>Artisanat Tunisien</p><p>Blog</p><p>Admin</p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-ink-100 flex flex-col md:flex-row justify-between gap-4 text-xs text-ink-400">
            <p>© 2026 Barka Nour. Tous droits réservés. Marque originale tunisienne.</p>
            <p className="flex items-center gap-2"><Package className="h-3 w-3" /> Tunis, Tunisie • Artisanat authentique</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
