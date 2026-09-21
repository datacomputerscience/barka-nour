import { cn } from "@/lib/utils"

export function BarkaNourLogo({ size = 'default', variant = 'full', className }: { size?: 'sm' | 'default' | 'lg', variant?: 'full' | 'icon', className?: string }) {
  const sizes = {
    sm: { icon: 44, text: 'text-[21px]', sub: 'text-[11px]', gap: 'gap-2.5' },
    default: { icon: 56, text: 'text-[28px]', sub: 'text-[13px]', gap: 'gap-3' },
    lg: { icon: 88, text: 'text-[40px]', sub: 'text-[16px]', gap: 'gap-4' },
  }
  const s = sizes[size]

  const iconSrc = "/logo-icon-v1.png"
  const fullSrc = "/logo-barka-nour-v1-olive-fig.png"

  if (variant === 'icon') {
    return (
      <div className={cn("flex-shrink-0 overflow-hidden rounded-full shadow-sm ring-1 ring-[#C9A34A]/20", className)} style={{ width: s.icon, height: s.icon }}>
        <img src={iconSrc} alt="Barka Nour" width={s.icon} height={s.icon} className="w-full h-full object-cover" />
      </div>
    )
  }

  if (size === 'lg') {
    return (
      <div className={cn("flex flex-col items-center select-none", className)}>
        <img src={fullSrc} alt="Barka Nour - بركة نور - Olive + Fig + Light" className="w-auto max-w-[380px] object-contain" />
      </div>
    )
  }

  return (
    <div className={cn("flex items-center select-none", s.gap, className)}>
      <div className="relative flex-shrink-0 overflow-hidden rounded-full shadow-sm ring-1 ring-[#C9A34A]/20" style={{ width: s.icon, height: s.icon }}>
        <img src={iconSrc} alt="Barka Nour icon" width={s.icon} height={s.icon} className="w-full h-full object-cover" />
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
            <span className="w-1 h-1 rounded-full bg-[#684552]/60" title="Fig accent" />
            <span className="w-1 h-1 rounded-full bg-[#C9A34A]" />
          </span>
        </div>
      </div>
    </div>
  )
}

export function BarkaNourIcon({ size = 32, className }: { size?: number, className?: string }) {
  return (
    <div className={cn("flex-shrink-0 overflow-hidden rounded-full shadow-sm ring-1 ring-[#C9A34A]/20", className)} style={{ width: size, height: size }}>
      <img src="/logo-icon-v1.png" alt="Barka Nour" width={size} height={size} className="w-full h-full object-cover" />
    </div>
  )
}

export function BarkaNourFullLogo({ className, variant = 'v1' }: { className?: string, variant?: 'v1' | 'v2' | 'v3' | 'v4' | 'original' }) {
  const map: Record<string, string> = {
    v1: "/logo-barka-nour-v1-olive-fig.png",
    v2: "/logo-barka-nour-v2-minimal.png",
    v3: "/logo-barka-nour-v3-circular.png",
    v4: "/logo-barka-nour-v4-ancient.png",
    original: "/logo-official.png",
  }
  const src = map[variant] || map.v1
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <img src={src} alt="Barka Nour - بركة نور - Olive tree + Light + Fig" className="w-full max-w-[480px] h-auto object-contain" />
    </div>
  )
}
