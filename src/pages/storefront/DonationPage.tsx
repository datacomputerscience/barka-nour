import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { TUNISIAN_GOVERNORATES } from '@/lib/utils'
import { Package, MapPin, Phone, User, Mail, Shirt, Clock, CheckCircle, Info, Truck, Recycle } from 'lucide-react'
import { Language } from '@/i18n'
import { donationService } from '@/services/donationService'
import { generateDonationNumber } from '@/lib/kiwiEngine'

interface Props {
  lang: Language
}

export function DonationPage({ lang }: Props) {
  const [method, setMethod] = useState<'depot' | 'collecte'>('depot')
  const [submitted, setSubmitted] = useState(false)
  const [donationNumber, setDonationNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    governorate: 'Tunis',
    city: '',
    address: '',
    category: '' as any,
    age_range: '' as any,
    clothing_types: [] as string[],
    approximate_pieces: '',
    description: '',
  })

  const clothingOptions = ['T-shirt', 'Pantalon', 'Jean', 'Robe', 'Jupe', 'Short', 'Pull', 'Sweat', 'Veste', 'Manteau', 'Pyjama', 'Jogging', 'Chemise', 'Autre']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const number = generateDonationNumber()
    try {
      await donationService.createDonation({
        donor_name: form.name,
        donor_phone: form.phone,
        donor_email: form.email,
        governorate: form.governorate,
        city: form.city,
        address: form.address,
        method,
        category: form.category || undefined,
        age_range: form.age_range || undefined,
        clothing_types: form.clothing_types as any,
        approximate_pieces: form.approximate_pieces ? parseInt(form.approximate_pieces) : undefined,
        description: form.description,
        pieces_declared: form.approximate_pieces ? parseInt(form.approximate_pieces) : undefined,
        idempotency_key: `don-${Date.now()}-${form.phone}`,
      })
      setDonationNumber(number)
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-[640px] px-4 py-12">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle className="h-10 w-10 text-emerald-600" /></div>
          <h1 className="text-[28px] font-bold tracking-tight mt-6">Don soumis !</h1>
          <p className="font-mono text-sm mt-3 bg-ink-50 border inline-block px-4 py-2 rounded-full">{donationNumber}</p>
          <p className="text-ink-600 mt-4 leading-relaxed">Votre don sera évalué par Barka Nour. Vos Kiwi seront ajoutés à votre compte après validation. Vous pourrez ensuite choisir de les utiliser ou d'y renoncer.</p>
        </div>

        <Card className="mt-8 rounded-[1.25rem]">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Recycle className="h-4 w-4" /> Que se passe-t-il maintenant ?</h3>
            <div className="flex gap-2">
              {[
                { label: 'Soumise', done: true },
                { label: 'Reçue', done: false },
                { label: 'Tri', done: false },
                { label: 'Évaluée', done: false },
                { label: 'Kiwi', done: false },
              ].map((s, i) => (
                <div key={i} className="flex-1 text-center"><div className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${s.done ? 'bg-emerald-600 text-white' : 'bg-ink-100 text-ink-500'}`}>{i+1}</div><p className="text-[11px] mt-1">{s.label}</p></div>
              ))}
            </div>
            <div className="rounded-xl bg-bn-50 border border-bn-200 p-3 text-xs text-ink-700">
              <strong>Important :</strong> Les vêtements acceptés deviennent partie de l'inventaire Barka Nour et peuvent être triés, préparés, photographiés, groupés en packs et revendus. Pas de paiement en espèces — Kiwi uniquement.
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1 h-11 rounded-full" onClick={() => setSubmitted(false)}>Nouveau don</Button>
          <Button className="flex-1 h-11 rounded-full bg-olive-700 text-white" onClick={() => window.location.href = '/mon-espace'}>Mon espace 🥝</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[960px] px-4 lg:px-6 py-8">
      <div className="max-w-[640px]">
        <Badge className="bg-olive-50 text-olive-700 border-olive-200 gap-1.5"><Recycle className="h-3 w-3" /> Programme Don & Kiwi</Badge>
        <h1 className="text-[32px] font-bold tracking-tight font-display mt-3">Donner mes vêtements</h1>
        <p className="text-ink-600 mt-2 leading-relaxed">Donnez vos vêtements durablement à Barka Nour. Simple, rapide, sans description détaillée de chaque pièce. Vous recevrez des Kiwi 🥝 après validation.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          <Card className="rounded-[1.25rem]">
            <CardHeader className="pb-3"><CardTitle className="text-[16px] flex items-center gap-2"><User className="h-4 w-4" /> Vos informations</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nom complet *</Label><div className="relative"><User className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" /><Input required placeholder="Leila Ben Salah" className="pl-9 h-11" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div></div>
                <div className="space-y-2"><Label>Téléphone *</Label><div className="relative"><Phone className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" /><Input required placeholder="+216 20 123 456" className="pl-9 h-11" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div></div>
              </div>
              <div className="space-y-2"><Label>Email (optionnel)</Label><div className="relative"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" /><Input placeholder="vous@exemple.tn" className="pl-9 h-11" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Gouvernorat *</Label><Select value={form.governorate} onChange={e => setForm({...form, governorate: e.target.value})} className="h-11"><option value="">Choisir</option>{TUNISIAN_GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}</Select></div>
                <div className="space-y-2"><Label>Ville *</Label><Input required placeholder="Tunis" className="h-11" value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.25rem]">
            <CardHeader className="pb-3"><CardTitle className="text-[16px] flex items-center gap-2"><Truck className="h-4 w-4" /> Méthode de don</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setMethod('depot')} className={`p-4 rounded-xl border-2 text-left transition-all ${method === 'depot' ? 'border-olive-700 bg-olive-50' : 'border-ink-200 bg-white hover:border-ink-300'}`}>
                  <p className="font-semibold text-sm">Dépôt</p><p className="text-xs text-ink-600 mt-1">Vous apportez à un point de collecte Barka Nour</p>
                </button>
                <button type="button" onClick={() => setMethod('collecte')} className={`p-4 rounded-xl border-2 text-left transition-all ${method === 'collecte' ? 'border-olive-700 bg-olive-50' : 'border-ink-200 bg-white hover:border-ink-300'}`}>
                  <p className="font-semibold text-sm">Collecte</p><p className="text-xs text-ink-600 mt-1">On collecte à votre adresse (selon règles)</p>
                </button>
              </div>

              {method === 'collecte' && (
                <div className="space-y-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-xs font-semibold text-amber-900">Collecte — Informations</p>
                  <div className="space-y-2"><Label>Adresse complète *</Label><Input required={method === 'collecte'} placeholder="Rue, numéro, étage" className="h-10" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
                  <p className="text-[11px] text-amber-800">La collecte n'est pas automatiquement gratuite. Barka Nour approuve selon quantité minimale, zone, jours groupés. Frais possibles, gratuit au-delà d'un seuil configurable.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[1.25rem]">
            <CardHeader className="pb-3"><CardTitle className="text-[16px] flex items-center gap-2"><Shirt className="h-4 w-4" /> Informations don (optionnel — rapide)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Catégorie</Label><Select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="h-10"><option value="">Choisir (optionnel)</option>{['Bébé','Fille','Garçon','Femme','Homme','Mixte','Autre'].map(c => <option key={c} value={c}>{c}</option>)}</Select></div>
                <div className="space-y-2"><Label>Âge approximatif</Label><Select value={form.age_range} onChange={e => setForm({...form, age_range: e.target.value})} className="h-10"><option value="">Choisir (optionnel)</option>{['0–2 ans','3–5 ans','6–8 ans','9–12 ans','13–16 ans','Adulte','Autre'].map(a => <option key={a} value={a}>{a}</option>)}</Select></div>
              </div>

              <div className="space-y-2">
                <Label>Types de vêtements (optionnel)</Label>
                <div className="flex flex-wrap gap-2">
                  {clothingOptions.map(t => (
                    <button key={t} type="button" onClick={() => setForm({...form, clothing_types: form.clothing_types.includes(t) ? form.clothing_types.filter(x => x !== t) : [...form.clothing_types, t]})} className={`px-3 py-1.5 rounded-full border text-xs transition-all ${form.clothing_types.includes(t) ? 'bg-olive-700 text-white border-olive-700' : 'bg-white border-ink-200 hover:border-olive-300'}`}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nombre approximatif de pièces</Label><Input type="number" placeholder="Ex: 15" className="h-10" value={form.approximate_pieces} onChange={e => setForm({...form, approximate_pieces: e.target.value})} /></div>
                <div className="space-y-2"><Label>Photos (optionnel)</Label><Input type="file" multiple accept="image/*" className="h-10" /></div>
              </div>

              <div className="space-y-2"><Label>Description libre (optionnel)</Label><Textarea placeholder="Ex: Vêtements fille 6 ans, environ 15 pièces, principalement été." className="min-h-[80px]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>

              <div className="rounded-xl bg-ink-50 border p-3 text-xs text-ink-600">
                <p className="font-semibold flex items-center gap-1"><Info className="h-3.5 w-3.5" /> Principe important</p>
                <p className="mt-1 leading-relaxed">Vous n'avez PAS besoin de décrire chaque pièce. Exemple rapide : "15 vêtements fille 6 ans". Barka Nour fait le tri. Efficacité opérationnelle prioritaire.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.25rem] bg-amber-50 border-amber-200">
            <CardContent className="p-4 text-xs leading-relaxed">
              <p className="font-semibold">Conditions du programme Kiwi — À accepter</p>
              <ul className="mt-2 space-y-1 list-disc ml-4 text-ink-700">
                <li>Kiwi n'est pas de l'argent et n'a pas de valeur monétaire</li>
                <li>Kiwi ne peut pas être retiré en espèces, vendu ou transféré</li>
                <li>Les vêtements acceptés sont transférés définitivement à Barka Nour</li>
                <li>Barka Nour peut trier, préparer, photographier, grouper en packs et revendre</li>
                <li>Kiwi ajoutés seulement après validation par Barka Nour</li>
                <li>Disponibilité récompenses selon stock actuel</li>
              </ul>
              <div className="mt-3 flex items-center gap-2"><input type="checkbox" required id="accept" /><label htmlFor="accept" className="text-xs font-medium">J'accepte que les vêtements acceptés deviennent partie de l'inventaire Barka Nour définitivement *</label></div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-[1.25rem] sticky top-20">
            <CardHeader className="pb-3"><CardTitle className="text-[16px] flex items-center gap-2"><Recycle className="h-4 w-4" /> Résumé don</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-ink-600">Méthode</span><span className="font-medium capitalize">{method}</span></div>
                <div className="flex justify-between"><span className="text-ink-600">Catégorie</span><span className="font-medium">{form.category || 'Non précisé'}</span></div>
                <div className="flex justify-between"><span className="text-ink-600">Âge</span><span className="font-medium">{form.age_range || 'Non précisé'}</span></div>
                <div className="flex justify-between"><span className="text-ink-600">Pièces</span><span className="font-medium">{form.approximate_pieces || 'Non précisé'}</span></div>
              </div>

              <div className="rounded-xl bg-olive-50 border border-olive-200 p-3">
                <p className="text-xs font-semibold text-olive-800">Après validation :</p>
                <p className="text-xs text-ink-700 mt-1">Vous recevrez 🥝 Kiwi automatiquement. Exemple : 8 Standard ×1 + 3 Bonne ×2 + 1 Premium ×4 = 18 Kiwi</p>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-olive-700 hover:bg-olive-800 text-white">
                {loading ? 'Envoi...' : 'Soumettre mon don'}
              </Button>

              <p className="text-[11px] text-ink-500 leading-relaxed text-center">Don simple : pas besoin de décrire chaque pièce. Barka Nour trie. Vos Kiwi seront ajoutés après validation, vous choisirez ensuite utilisation ou renonciation.</p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
