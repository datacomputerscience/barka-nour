import { cn } from "@/lib/utils"

export function BarkaNourLogo({ size = 'default', variant = 'full', className }: { size?: 'sm' | 'default' | 'lg', variant?: 'full' | 'icon', className?: string }) {
  const sizes = {
    sm: { icon: 44, text: 'text-[21px]', sub: 'text-[11px]', gap: 'gap-2.5' },
    default: { icon: 56, text: 'text-[28px]', sub: 'text-[13px]', gap: 'gap-3' },
    lg: { icon: 96, text: 'text-[42px]', sub: 'text-[16px]', gap: 'gap-4' },
  }
  const s = sizes[size]

  // Logo officiel validé: olive + feuille dorée + rayons (fond blanc épuré)
  // Fichiers: /logo-barka-nour-icon.png (header/favicon) + /barka-nour-logo-simple.svg (version complète)
  const iconSrc = "/logo-barka-nour-icon.png"
  const pngSrc = "/logo-premium-international-v1-minimal.png"
  const fullPngSrc = "/barka-nour-logo-simple.svg" // Logo simple officiel: olive + Barka Nour + Artisanat Tunisien

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
        <img src={fullPngSrc} alt="Barka Nour - Artisanat Tunisien" className="w-full max-w-[320px] h-auto object-contain" />
      </div>
    )
  }

  return (
    <div className={cn("flex items-center select-none", s.gap, className)}>
      <div className="relative flex-shrink-0 overflow-hidden" style={{ width: s.icon, height: s.icon }}>
        <img src={iconSrc} alt="Barka Nour icon premium minimal" width={s.icon} height={s.icon} className="w-full h-full object-contain" />
      </div>

      <div className="flex flex-col leading-tight">
        <span
          className={cn("tracking-tight text-[#2F3D22] dark:text-[#F7F2E6]", s.text)}
          style={{ fontFamily: "'Amiri', serif", fontWeight: 700 }}
        >
          بركة نور
        </span>
        <div className="flex items-center gap-2 -mt-0.5">
          <span className="h-[1px] w-5 bg-[#C9A34A]/70 hidden sm:block" />
          <span
            className={cn("font-medium tracking-wide text-[#3D4F2A]/80 dark:text-[#F7F2E6]/70", s.sub)}
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", fontWeight: 600 }}
          >
            Barka Nour
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
      <img src="/logo-barka-nour-icon.png" alt="Barka Nour" width={size} height={size} className="w-full h-full object-contain" />
    </div>
  )
}

export function BarkaNourFullLogo({ className, variant = 'simple' }: { className?: string, variant?: 'simple' | 'premium' | 'final' | 'no-fill' | 'v1' | 'v2' | 'v3' | 'v4' | 'original' }) {
  const map: Record<string, string> = {
    simple: "/barka-nour-logo-simple.svg",
    premium: "/logo-premium-international-v1-minimal.png",
    final: "/logo-barka-nour-final.png",
    'no-fill': "/logo-final-no-fill.svg",
    v1: "/logo-barka-nour-v1-olive-fig.png",
    v2: "/logo-barka-nour-v2-minimal.png",
    v3: "/logo-barka-nour-v3-circular.png",
    v4: "/logo-barka-nour-v4-ancient.png",
    original: "/logo-final-reference.png",
  }
  const src = map[variant] || map.simple
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <img src={src} alt="Barka Nour - Artisanat Tunisien" className="w-full max-w-[560px] h-auto object-contain" />
    </div>
  )
}
