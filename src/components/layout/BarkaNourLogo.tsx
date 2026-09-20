import { cn } from "@/lib/utils"

export function BarkaNourLogo({ size = 'default', variant = 'full', className }: { size?: 'sm' | 'default' | 'lg', variant?: 'full' | 'icon', className?: string }) {
  const sizes = {
    sm: { icon: 28, text: 'text-[18px]', sub: 'text-[10px]' },
    default: { icon: 36, text: 'text-[22px]', sub: 'text-[11px]' },
    lg: { icon: 48, text: 'text-[28px]', sub: 'text-[12px]' },
  }
  const s = sizes[size]

  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <div className="relative flex items-center justify-center rounded-xl bn-gradient-green shadow-sm" style={{ width: s.icon, height: s.icon }}>
        <svg width={s.icon * 0.6} height={s.icon * 0.6} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L12 12M12 12L2 7M12 12L22 7M12 12L12 22M12 22L2 17M12 22L22 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" fill="#ffc639" fillOpacity="0.95"/>
          <circle cx="12" cy="12" r="1" fill="#284b41"/>
        </svg>
      </div>
      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-display font-bold tracking-tight text-ink-800", s.text)}>Barka Nour</span>
          {size !== 'sm' && <span className={cn("font-medium tracking-widest text-olive-700 uppercase -mt-0.5", s.sub)}>بركة نور • Qualité Premium</span>}
        </div>
      )}
    </div>
  )
}
