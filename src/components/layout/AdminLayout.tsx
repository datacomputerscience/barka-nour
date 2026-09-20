import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, ShoppingBag, Package, Tags, Boxes, Users, 
  Megaphone, Ticket, LayoutTemplate, Truck, CreditCard, 
  BarChart3, Palette, Settings, HelpCircle, Menu, X, LogOut, 
  Store, ShieldCheck, FileText, Bell, Recycle, Gift, Coins
} from 'lucide-react'
import { BarkaNourLogo } from './BarkaNourLogo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Commandes', href: '/admin/orders', icon: ShoppingBag, badge: '8' },
  { name: 'Dons 🥝', href: '/admin/donations', icon: Recycle, highlight: true, badge: '2' },
  { name: 'Kiwi Config', href: '/admin/kiwi', icon: Coins, highlight: true },
  { name: 'Collecte', href: '/admin/collection', icon: Truck },
  { name: 'Produits', href: '/admin/products', icon: Package },
  { name: 'Catégories', href: '/admin/categories', icon: Tags },
  { name: 'Inventaire', href: '/admin/inventory', icon: Boxes },
  { name: 'Clients', href: '/admin/customers', icon: Users },
  { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
  { name: 'Récompenses', href: '/admin/rewards', icon: Gift },
  { name: 'Marketing', href: '/admin/marketing', icon: Megaphone },
  { name: 'Landing Pages', href: '/admin/landing-pages', icon: LayoutTemplate },
  { name: 'Livraison', href: '/admin/delivery', icon: Truck },
  { name: 'Paiements', href: '/admin/payments', icon: CreditCard },
  { name: 'Meta', href: '/admin/meta', icon: Store },
  { name: 'Analytiques', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Média', href: '/admin/media', icon: FileText },
  { name: 'Design', href: '/admin/design', icon: Palette },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  { name: 'Logs', href: '/admin/audit', icon: ShieldCheck },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#fdfcf8]">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-ink-900/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-ink-200 flex flex-col transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-[64px] px-5 flex items-center justify-between border-b border-ink-100">
          <BarkaNourLogo size="sm" />
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></Button>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-3 rounded-xl bg-bn-50 border border-bn-200 p-3">
            <div className="h-9 w-9 rounded-lg bg-white border border-bn-200 flex items-center justify-center"><Store className="h-5 w-5 text-bn-700" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink-900 truncate">Barka Nour</p>
              <p className="text-xs text-ink-500 truncate">Single-store • Admin</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 scrollbar-hide">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive ? "bg-bn-50 text-bn-800 border border-bn-200" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
                  (item as any).highlight && !isActive && "bg-blue-50/50 text-blue-700 border border-blue-100"
                )}
              >
                <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-bn-600" : "text-ink-400 group-hover:text-ink-600")} />
                <span className="flex-1">{item.name}</span>
                {(item as any).badge && <span className="ml-auto bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full">{(item as any).badge}</span>}
              </Link>
            )
          })}

          <div className="pt-4 mt-4 border-t border-ink-100">
            <Link to="/help" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-50"><HelpCircle className="h-[18px] w-[18px] text-ink-400" /> Documentation</Link>
            <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-50"><LogOut className="h-[18px] w-[18px] text-ink-400" /> Déconnexion</button>
          </div>
        </nav>

        <div className="p-3">
          <div className="rounded-xl bg-gradient-to-br from-bn-600 to-bn-800 p-4 text-white">
            <p className="text-sm font-semibold">Barka Nour - Single Store</p>
            <p className="text-xs text-bn-100 mt-1">Pas de multi-tenancy, une seule boutique authentique</p>
            <div className="mt-3 flex items-center gap-2 text-xs"><div className="h-2 w-2 rounded-full bg-emerald-400" /> Système opérationnel</div>
          </div>
        </div>
      </div>

      <div className="lg:pl-[280px]">
        <div className="sticky top-0 z-30 h-[64px] bg-white/80 backdrop-blur-xl border-b border-ink-200 flex items-center gap-4 px-4 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></Button>
          <div className="flex-1 flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-ink-400">Barka Nour</span><span className="text-ink-300">/</span>
              <span className="font-medium text-ink-900 capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" target="_blank"><Button variant="outline" size="sm"><Store className="h-4 w-4" /> Voir boutique</Button></Link>
            <Button variant="ghost" size="icon" className="rounded-full"><Bell className="h-5 w-5" /></Button>
            <div className="h-8 w-8 rounded-full bg-bn-100 border border-bn-200 flex items-center justify-center text-bn-700 font-bold text-xs">BN</div>
          </div>
        </div>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
