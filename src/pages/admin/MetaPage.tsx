import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function MetaPage() {
  return (
    <div className="p-6 space-y-6 max-w-[800px]">
      <div><h1 className="text-[20px] font-bold">Meta • Pixel + CAPI + Catalog</h1><p className="text-sm text-ink-600">Architecture server-side secrets jamais exposés frontend, event_id dédup, feed product</p></div>

      <div className="grid gap-6">
        <Card className="rounded-xl">
          <CardHeader className="pb-3"><CardTitle className="text-[14px] flex items-center justify-between">Pixel ID <Badge variant="secondary">not_configured</Badge></CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2"><Label>Meta Pixel ID</Label><Input placeholder="123456789012345" className="h-9 font-mono text-sm" /></div>
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs">Pixel exposé côté client OK, mais CAPI token JAMAIS frontend. Utiliser server-side env META_CAPI_TOKEN.</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="pb-3"><CardTitle className="text-[14px] flex items-center justify-between">CAPI • Server-side <Badge variant="warning">secret serveur uniquement</Badge></CardTitle></CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p>Events: PageView, ViewContent, Search, AddToCart, InitiateCheckout, AddPaymentInfo, Purchase, Lead</p>
            <div className="rounded-lg bg-ink-900 text-white p-3 font-mono text-[11px] leading-relaxed">
              buildCAPIEvent: event_name, event_time, event_id (dédup), user_data hashed SHA256 (email, phone, fbp, fbc, ip, ua), custom_data (content_ids, value, currency), action_source website<br/>
              trackPixelEvent côté client + CAPI côté serveur même event_id → dédup Meta
            </div>
            <div className="space-y-2"><Label>Access Token (server env only)</Label><Input type="password" placeholder="EAA..." disabled className="h-9" /><p className="text-[11px] text-ink-500">Définir dans .env: META_CAPI_ACCESS_TOKEN, jamais dans frontend. Statut: not_configured</p></div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="pb-3"><CardTitle className="text-[14px]">Product Feed • Meta Catalog compatible</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p>generateProductFeed(products): id, title, description, availability (in stock/out of stock), condition new, price TND, link, image_link, brand Barka Nour, google_product_category, fb_product_category, quantity_to_sell_on_facebook</p>
            <div className="rounded-lg bg-ink-50 border p-3 font-mono text-[11px]">/api/meta/feed → XML/CSV • 5 produits mock • object-only images • no humans</div>
            <Button variant="outline" size="sm" className="h-8 rounded-full text-xs">Prévisualiser feed (5 produits)</Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="pb-3"><CardTitle className="text-[14px]">Events Log • Dédup event_id</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-xs">
            {[
              { event: 'Purchase', id: 'evt_abc123', dedup: 'matched', value: '299 TND' },
              { event: 'AddToCart', id: 'evt_def456', dedup: 'pixel only', value: '59 TND' },
              { event: 'ViewContent', id: 'evt_ghi789', dedup: 'capi only', value: '45 TND' },
            ].map(e => (
              <div key={e.id} className="flex justify-between p-2 border rounded-lg"><span className="font-medium">{e.event}</span><span className="font-mono">{e.id}</span><span>{e.dedup}</span><span>{e.value}</span></div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function DeliveryPage() {
  return (
    <div className="p-6 space-y-6 max-w-[800px]">
      <h1 className="text-[20px] font-bold">Livraison • Abstraction Provider</h1>
      <Card className="rounded-xl"><CardContent className="p-5 space-y-4 text-sm">
        <p className="font-mono text-xs">interface DeliveryProvider &#123; createShipment, getShipment, trackShipment, cancelShipment, calculateDeliveryFee &#125;</p>
        <div className="space-y-2">
          {[
            { name: 'MesColis', fee: '7-8 TND', status: 'not_configured', creds: 'API_KEY, BASE_URL' },
            { name: 'Aramex', fee: '10 TND', status: 'not_configured', creds: 'USERNAME, PASSWORD, ACCOUNT' },
            { name: 'First Delivery', fee: '8 TND', status: 'not_configured', creds: 'TOKEN' },
            { name: 'Best Delivery', fee: '8 TND', status: 'not_configured', creds: 'API_KEY' },
            { name: 'Navex', fee: '9 TND', status: 'not_configured', creds: 'API_KEY' },
            { name: 'INTIGO', fee: '9 TND', status: 'not_configured', creds: 'API_KEY' },
            { name: 'MockDelivery', fee: '7 TND test', status: 'mock', creds: 'Aucun - test local' },
          ].map(p => (
            <div key={p.name} className="flex items-center justify-between p-3 border rounded-xl">
              <div><p className="font-medium">{p.name}</p><p className="text-xs text-ink-500">{p.fee} • Creds: {p.creds}</p></div>
              <Badge variant={p.status === 'mock' ? 'warning' : 'secondary'} className="text-[10px]">{p.status}</Badge>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-500">Jamais inventer API delivery. Utiliser MockDeliveryProvider si docs indisponibles, documenter credential requis. Pas de fake intégration. Statuts: configured/not_configured/mock/test/production.</p>
      </CardContent></Card>
    </div>
  )
}

export function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-[20px] font-bold">Analytics • Daily/Weekly/Monthly</h1>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="rounded-xl"><CardHeader className="pb-3"><CardTitle className="text-[14px]">Revenus • 30j</CardTitle></CardHeader><CardContent><div className="h-[120px] flex items-end gap-1">{Array.from({length:30}).map((_,i)=><div key={i} className="flex-1 bg-bn-200 rounded-t" style={{height:`${20+Math.random()*80}%`}} />)}</div></CardContent></Card>
        <Card className="rounded-xl"><CardHeader className="pb-3"><CardTitle className="text-[14px]">Conversion • Funnel</CardTitle></CardHeader><CardContent className="space-y-2 text-xs"><div className="flex justify-between"><span>PageView</span><span>1200</span></div><div className="flex justify-between"><span>ViewContent</span><span>400 (33%)</span></div><div className="flex justify-between"><span>AddToCart</span><span>80 (20%)</span></div><div className="flex justify-between"><span>Checkout</span><span>40 (50%)</span></div><div className="flex justify-between font-bold"><span>Purchase</span><span>32 (80%) • 2.6% conv globale</span></div></CardContent></Card>
      </div>
    </div>
  )
}

export function SettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-[800px]">
      <h1 className="text-[20px] font-bold">Paramètres • Single-store Barka Nour</h1>
      <Card className="rounded-xl"><CardContent className="p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="text-xs font-medium">Nom boutique</label><Input defaultValue="Barka Nour" className="h-9 mt-1" /></div>
          <div><label className="text-xs font-medium">Devise</label><Input defaultValue="TND" disabled className="h-9 mt-1" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="text-xs font-medium">Email contact</label><Input defaultValue="contact@barkanour.tn" className="h-9 mt-1" /></div>
          <div><label className="text-xs font-medium">Téléphone</label><Input defaultValue="+216 XX XXX XXX" className="h-9 mt-1" /></div>
        </div>
        <div className="space-y-2"><label className="text-xs font-medium">Logo / Favicon</label><div className="flex gap-2"><div className="h-12 w-12 rounded-xl bg-bn-gradient" /><div className="h-8 w-8 rounded-lg bg-bn-gradient" /></div></div>
        <div className="rounded-lg bg-ink-50 border p-3 text-xs"><p className="font-semibold">Couleurs • Thème</p><p className="mt-1">bn-50..950 olive #b8860b ink #1a1a1a, gradients bn-gradient, fonts Fraunces+Geist, header/footer/sections custom</p></div>
      </CardContent></Card>
    </div>
  )
}
