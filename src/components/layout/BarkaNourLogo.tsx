import { cn } from "@/lib/utils"

export function BarkaNourLogo({ size = 'default', variant = 'full', className }: { size?: 'sm' | 'default' | 'lg', variant?: 'full' | 'icon', className?: string }) {
  const sizes = {
    sm: { icon: 44, text: 'text-[21px]', sub: 'text-[11px]', gap: 'gap-2.5' },
    default: { icon: 56, text: 'text-[28px]', sub: 'text-[13px]', gap: 'gap-3' },
    lg: { icon: 96, text: 'text-[42px]', sub: 'text-[16px]', gap: 'gap-4' },
  }
  const s = sizes[size]

  // Premium International Final - V1 Minimal Ultra Premium
  // Verifies all success conditions: simple, memorable, timeless, versatile, scalable, monochrome, favicon, packaging, etc.
  // Olive dark #2F3D22, fig kiwi #8DBE3E, light gold #C9A34A, no white fill, light only
  const iconSrc = "/logo-premium-final.svg"
  const pngSrc = "/logo-premium-international-v1-minimal.png"
  const fullPngSrc = "/logo-final-improved-light.png" // Your favorite with yellow bright + kiwi + dark + enhanced light

  if (variant === 'icon') {
    return (
      <div className={cn("flex-shrink-0 overflow-hidden", className)} style={{ width: s.icon, height: s.icon }}>
        <img src={iconSrc} alt="Barka Nour" width={s.icon} height={s.icon} className="w-full h-full object-contain" />
      </div>
    )
  }

  if (size === 'lg') {
    return (
      <div className={cn("flex flex-col items-center select-none", className)}>
        <img src={fullPngSrc} alt="Barka Nour - بركة نور - Final: yellow bright + fig kiwi + olive dark + Nour enhanced, no white fill" className="w-auto max-w-[420px] object-contain drop-shadow-sm" />
        <div className="mt-4 text-center">
          <h1 className="font-serif text-[36px] font-semibold tracking-tight text-[#2F3D22]">Barka Nour</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-12 bg-[#C9A34A]/60" />
            <span className="font-serif text-[18px] text-[#3D4F2A]/80" style={{ fontFamily: "'Amiri', serif" }}>بركة نور</span>
            <span className="h-[1px] w-12 bg-[#C9A34A]/60" />
          </div>
          <p className="mt-2 text-xs tracking-[0.2em] text-[#2F3D22]/60 uppercase">Olive • Figue • Lumière — Premium International</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center select-none", s.gap, className)}>
      <div className="relative flex-shrink-0 overflow-hidden" style={{ width: s.icon, height: s.icon }}>
        <img src={iconSrc} alt="Barka Nour icon premium minimal" width={s.icon} height={s.icon} className="w-full h-full object-contain" />
      </div>

      <div className="flex flex-col leading-none">
        <span
          className={cn("tracking-tight text-[#2F3D22] dark:text-[#F7F2E6] font-serif", s.text)}
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", fontWeight: 600, letterSpacing: '-0.02em' }}
        >
          Barka Nour
        </span>
        <div className="flex items-center gap-2 -mt-1">
          <span className="h-[1px] w-5 bg-[#C9A34A]/70 hidden sm:block" />
          <span className={cn("font-medium tracking-wide text-[#3D4F2A]/80 dark:text-[#F7F2E6]/70", s.sub)} style={{ fontFamily: "'Amiri', serif" }}>
            بركة نور
          </span>
          <span className="h-[1px] w-5 bg-[#C9A34A]/70 hidden sm:block" />
          <span className="hidden sm:inline-flex items-center gap-1 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8DBE3E]" title="Fig kiwi" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A34A]" title="Nour light" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F3D22]" title="Olive dark" />
          </span>
        </div>
      </div>
    </div>
  )
}

export function BarkaNourIcon({ size = 32, className }: { size?: number, className?: string }) {
  return (
    <div className={cn("flex-shrink-0 overflow-hidden", className)} style={{ width: size, height: size }}>
      <img src="/logo-premium-final.svg" alt="Barka Nour premium" width={size} height={size} className="w-full h-full object-contain" />
    </div>
  )
}

export function BarkaNourFullLogo({ className, variant = 'premium' }: { className?: string, variant?: 'premium' | 'final' | 'no-fill' | 'v1' | 'v2' | 'v3' | 'v4' | 'original' }) {
  const map: Record<string, string> = {
    premium: "/logo-premium-international-v1-minimal.png",
    final: "/logo-final-improved-light.png",
    'no-fill': "/logo-final-no-fill.svg",
    v1: "/logo-barka-nour-v1-olive-fig.png",
    v2: "/logo-barka-nour-v2-minimal.png",
    v3: "/logo-barka-nour-v3-circular.png",
    v4: "/logo-barka-nour-v4-ancient.png",
    original: "/logo-final-reference.png",
  }
  const src = map[variant] || map.premium
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <img src={src} alt="Barka Nour - بركة نور - Premium International - Olive + Fig kiwi + Light no white fill" className="w-full max-w-[560px] h-auto object-contain" />
    </div>
  )
}
