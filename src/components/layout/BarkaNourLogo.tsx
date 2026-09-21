import { cn } from "@/lib/utils"

export function BarkaNourLogo({ size = 'default', variant = 'full', className }: { size?: 'sm' | 'default' | 'lg', variant?: 'full' | 'icon', className?: string }) {
  const sizes = {
    sm: { icon: 40, text: 'text-[20px]', sub: 'text-[11px]', gap: 'gap-2.5' },
    default: { icon: 52, text: 'text-[26px]', sub: 'text-[12px]', gap: 'gap-3' },
    lg: { icon: 80, text: 'text-[38px]', sub: 'text-[15px]', gap: 'gap-4' },
  }
  const s = sizes[size]

  // Official logo uploaded by user - olive tree + light propagating
  // Improved minimal version for better small-size readability
  const iconSrc = "/logo-icon-gold.png"
  const fullSrc = "/logo-official-improved.png"
  const originalSrc = "/logo-official.png"

  if (variant === 'icon') {
    return (
      <div className={cn("flex-shrink-0 overflow-hidden rounded-full", className)} style={{ width: s.icon, height: s.icon }}>
        <img src={iconSrc} alt="Barka Nour" width={s.icon} height={s.icon} className="w-full h-full object-cover" />
      </div>
    )
  }

  // For lg size, use the full official logo image directly (premium hero)
  if (size === 'lg') {
    return (
      <div className={cn("flex flex-col items-center select-none", className)}>
        <img src={fullSrc} alt="Barka Nour - بركة نور" className="w-auto max-w-[320px] object-contain" style={{ height: 'auto' }} />
      </div>
    )
  }

  return (
    <div className={cn("flex items-center select-none", s.gap, className)}>
      <div className="relative flex-shrink-0 overflow-hidden rounded-full shadow-sm" style={{ width: s.icon, height: s.icon }}>
        <img src={iconSrc} alt="Barka Nour icon" width={s.icon} height={s.icon} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col leading-none">
        <span
          className={cn("tracking-tight text-[#2F3D22] dark:text-[#F7F2E6] font-serif", s.text)}
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", fontWeight: 600, letterSpacing: '-0.02em' }}
        >
          Barka Nour
        </span>
        <div className="flex items-center gap-2 -mt-0.5">
          <span className="h-[1px] w-5 bg-[#C9A34A]/70 hidden sm:block" />
          <span
            className={cn("font-medium tracking-wide text-[#3D4F2A]/80 dark:text-[#F7F2E6]/70", s.sub)}
            style={{ fontFamily: "'Amiri', serif" }}
          >
            بركة نور
          </span>
          <span className="h-[1px] w-5 bg-[#C9A34A]/70 hidden sm:block" />
        </div>
      </div>
    </div>
  )
}

export function BarkaNourIcon({ size = 32, className }: { size?: number, className?: string }) {
  return (
    <div className={cn("flex-shrink-0 overflow-hidden rounded-full", className)} style={{ width: size, height: size }}>
      <img src="/logo-icon-gold.png" alt="Barka Nour" width={size} height={size} className="w-full h-full object-cover" />
    </div>
  )
}

// Full official logo component for hero / about pages - uses original uploaded design
export function BarkaNourFullLogo({ className, variant = 'improved' }: { className?: string, variant?: 'original' | 'improved' }) {
  const src = variant === 'original' ? "/logo-official.png" : "/logo-official-improved.png"
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <img src={src} alt="Barka Nour - بركة نور - Olive tree + light propagating" className="w-full max-w-[420px] h-auto object-contain" />
    </div>
  )
}
