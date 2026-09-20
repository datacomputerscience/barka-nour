import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Package, Truck, Phone, MapPin, ArrowRight } from 'lucide-react'

export function OrderConfirmationPage() {
  const [params] = useSearchParams()
  const orderNumber = params.get('order') || 'BN-20260920-ABC123'

  return (
    <div className="mx-auto max-w-[720px] px-4 py-12">
      <div className="text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle className="h-10 w-10 text-emerald-600" /></div>
        <h1 className="text-[28px] font-bold tracking-tight font-display mt-6">Commande confirmée!</h1>
        <p className="text-ink-600 mt-2">Merci pour votre confiance en Barka Nour</p>
        <p className="font-mono text-sm mt-3 bg-ink-50 border inline-block px-4 py-2 rounded-full">{orderNumber}</p>
      </div>

      <div className="mt-10 grid gap-4">
        <Card className="rounded-[1.25rem]">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Truck className="h-4 w-4" /> Suivi livraison</h3>
            <div className="flex gap-3">
              {[
                { label: 'Confirmée', done: true },
                { label: 'Préparation', done: false },
                { label: 'Expédiée', done: false },
                { label: 'Livrée', done: false },
              ].map((s, i) => (
                <div key={i} className="flex-1 text-center">
                  <div className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${s.done ? 'bg-emerald-600 text-white' : 'bg-ink-100 text-ink-500'}`}>{i+1}</div>
                  <p className="text-[11px] mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-600">Livraison estimée 24-72h selon gouvernorat via MesColis/Aramex/First Delivery (mock si non configuré).</p>
          </CardContent>
        </Card>

        <Card className="rounded-[1.25rem]">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-3">Que se passe-t-il maintenant?</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3"><div className="h-8 w-8 rounded-full bg-ink-900 text-white flex items-center justify-center flex-shrink-0"><Phone className="h-4 w-4" /></div><div><p className="font-medium">Appel de confirmation</p><p className="text-xs text-ink-600">Notre équipe vous appelle sous 2h pour confirmer adresse & créneau.</p></div></div>
              <div className="flex gap-3"><div className="h-8 w-8 rounded-full bg-bn-100 text-bn-700 flex items-center justify-center flex-shrink-0"><Package className="h-4 w-4" /></div><div><p className="font-medium">Préparation colis</p><p className="text-xs text-ink-600">Vérification stock réel, emballage éco, étiquette livraison.</p></div></div>
              <div className="flex gap-3"><div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0"><Truck className="h-4 w-4" /></div><div><p className="font-medium">Expédition & tracking</p><p className="text-xs text-ink-600">SMS avec lien suivi. Paiement à la livraison en espèces.</p></div></div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Link to="/shop" className="flex-1"><Button variant="outline" className="w-full h-11 rounded-full">Continuer achats</Button></Link>
          <Link to="/" className="flex-1"><Button className="w-full h-11 rounded-full bg-ink-900 text-white">Accueil <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>

        <p className="text-[11px] text-center text-ink-500 leading-relaxed">Commande sécurisée. Support: contact@barkanour.tn</p>
      </div>
    </div>
  )
}

export function AboutPage() {
  return (
    <div className="mx-auto max-w-[960px] px-4 lg:px-6 py-12">
      <h1 className="text-[32px] font-bold tracking-tight font-display">À propos Barka Nour</h1>
      <p className="text-ink-600 mt-3 leading-relaxed">Barka Nour est la boutique tunisienne unique, artisanat authentique, qualité premium et confiance.</p>
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <Card><CardContent className="p-5"><h3 className="font-semibold">Artisanat tunisien</h3><p className="text-sm text-ink-600 mt-2">Tapis berbère, bocaux verre, tote bio, huile argan, support bambou - 100% Tunisie.</p></CardContent></Card>
        <Card><CardContent className="p-5"><h3 className="font-semibold">Qualité & confiance</h3><p className="text-sm text-ink-600 mt-2">Produits sélectionnés, matériaux durables, fabrication locale et service client dédié.</p></CardContent></Card>
        <Card><CardContent className="p-5"><h3 className="font-semibold">Livraison Tunisie</h3><p className="text-sm text-ink-600 mt-2">24 gouvernorats, paiement à la livraison, suivi SMS et retours faciles.</p></CardContent></Card>
      </div>
    </div>
  )
}

export function ContactPage() {
  return (
    <div className="mx-auto max-w-[640px] px-4 py-12">
      <h1 className="text-[24px] font-bold">Contact</h1>
      <Card className="mt-6"><CardContent className="p-5 space-y-4"><p className="text-sm">Email: contact@barkanour.tn</p><p className="text-sm">Téléphone: +216 XX XXX XXX</p><p className="text-sm">Adresse: Tunis, Tunisie (24 gouvernorats livrés)</p></CardContent></Card>
    </div>
  )
}
