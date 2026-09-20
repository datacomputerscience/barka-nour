import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTND(amount: number): string {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-TN').format(num)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateSKU(prefix = 'BN'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}

export function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(2,10).replace(/-/g,'')
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `BN-${date}-${rand}`
}

export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
}

export const TUNISIAN_GOVERNORATES = [
  "Tunis","Ariana","Ben Arous","Manouba","Nabeul","Zaghouan","Bizerte","Béja","Jendouba","Le Kef","Siliana","Kairouan","Kasserine","Sidi Bouzid","Sousse","Monastir","Mahdia","Sfax","Gabès","Medenine","Tataouine","Gafsa","Tozeur","Kebili",
] as const

export const ORDER_STATUSES = [
  { value: 'pending', label: 'En attente', label_ar: 'قيد الانتظار', color: 'bg-amber-100 text-amber-800 border-amber-200', next: ['confirmed','cancelled'] },
  { value: 'confirmed', label: 'Confirmée', label_ar: 'مؤكدة', color: 'bg-blue-100 text-blue-800 border-blue-200', next: ['preparing','cancelled'] },
  { value: 'preparing', label: 'En préparation', label_ar: 'قيد التحضير', color: 'bg-purple-100 text-purple-800 border-purple-200', next: ['shipped','cancelled'] },
  { value: 'shipped', label: 'Expédiée', label_ar: 'تم الشحن', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', next: ['out_for_delivery','cancelled'] },
  { value: 'out_for_delivery', label: 'En livraison', label_ar: 'قيد التوصيل', color: 'bg-cyan-100 text-cyan-800 border-cyan-200', next: ['delivered','failed','returned'] },
  { value: 'delivered', label: 'Livrée', label_ar: 'تم التوصيل', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', next: ['returned'] },
  { value: 'cancelled', label: 'Annulée', label_ar: 'ملغاة', color: 'bg-red-100 text-red-800 border-red-200', next: [] },
  { value: 'returned', label: 'Retournée', label_ar: 'مرتجعة', color: 'bg-orange-100 text-orange-800 border-orange-200', next: [] },
  { value: 'failed', label: 'Échouée', label_ar: 'فشلت', color: 'bg-gray-100 text-gray-800 border-gray-200', next: ['pending','cancelled'] },
] as const

export const PAYMENT_METHODS = [
  { value: 'cod', label: 'Paiement à la livraison', label_ar: 'الدفع عند الاستلام', icon: 'banknote' },
] as const

export const LANGUAGES = {
  ar: { name: 'العربية', dir: 'rtl' as const, flag: '🇹🇳' },
  fr: { name: 'Français', dir: 'ltr' as const, flag: '🇫🇷' },
  en: { name: 'English', dir: 'ltr' as const, flag: '🇬🇧' },
}
