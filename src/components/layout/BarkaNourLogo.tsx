import { cn } from "@/lib/utils"

export function BarkaNourLogo({ size = 'default', variant = 'full', className }: { size?: 'sm' | 'default' | 'lg', variant?: 'full' | 'icon', className?: string }) {
  const sizes = {
    sm: { icon: 40, text: 'text-[20px]', sub: 'text-[11px]', gap: 'gap-2.5' },
    default: { icon: 52, text: 'text-[26px]', sub: 'text-[12px]', gap: 'gap-3' },
    lg: { icon: 72, text: 'text-[36px]', sub: 'text-[14px]', gap: 'gap-3.5' },
  }
  const s = sizes[size]

  const OliveIcon = ({ sz }: { sz: number }) => (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
      {/* Light rays propagating from within - muted gold #C9A34A - Nour */}
      <g opacity="0.85">
        {/* Central glow */}
        <circle cx="50" cy="58" r="3" fill="#C9A34A" opacity="0.9" />
        {/* Thin golden rays - emanating from interior through branches */}
        <g stroke="#C9A34A" strokeWidth="0.6" strokeLinecap="round" opacity="0.7">
          <line x1="50" y1="58" x2="50" y2="8" />
          <line x1="50" y1="58" x2="58" y2="12" />
          <line x1="50" y1="58" x2="68" y2="18" />
          <line x1="50" y1="58" x2="78" y2="28" />
          <line x1="50" y1="58" x2="85" y2="42" />
          <line x1="50" y1="58" x2="88" y2="58" />
          <line x1="50" y1="58" x2="82" y2="72" />
          <line x1="50" y1="58" x2="70" y2="82" />
          <line x1="50" y1="58" x2="50" y2="90" />
          <line x1="50" y1="58" x2="30" y2="82" />
          <line x1="50" y1="58" x2="18" y2="72" />
          <line x1="50" y1="58" x2="12" y2="58" />
          <line x1="50" y1="58" x2="15" y2="42" />
          <line x1="50" y1="58" x2="22" y2="28" />
          <line x1="50" y1="58" x2="32" y2="18" />
          <line x1="50" y1="58" x2="42" y2="12" />
          {/* Subtle shorter rays */}
          <g strokeWidth="0.35" opacity="0.5">
            <line x1="50" y1="58" x2="54" y2="18" />
            <line x1="50" y1="58" x2="62" y2="22" />
            <line x1="50" y1="58" x2="74" y2="35" />
            <line x1="50" y1="58" x2="80" y2="52" />
            <line x1="50" y1="58" x2="76" y2="66" />
            <line x1="50" y1="58" x2="46" y2="18" />
            <line x1="50" y1="58" x2="38" y2="22" />
            <line x1="50" y1="58" x2="26" y2="35" />
            <line x1="50" y1="58" x2="20" y2="52" />
            <line x1="50" y1="58" x2="24" y2="66" />
          </g>
        </g>
        {/* Luminous particles - subtle gold dots */}
        <g fill="#C9A34A">
          <circle cx="48" cy="14" r="0.8" opacity="0.8" />
          <circle cx="62" cy="18" r="0.6" opacity="0.6" />
          <circle cx="72" cy="26" r="0.7" opacity="0.7" />
          <circle cx="82" cy="38" r="0.5" opacity="0.5" />
          <circle cx="18" cy="38" r="0.5" opacity="0.5" />
          <circle cx="28" cy="26" r="0.6" opacity="0.6" />
          <circle cx="52" cy="10" r="0.5" opacity="0.6" />
          <circle cx="75" cy="48" r="0.6" opacity="0.5" />
          <circle cx="25" cy="48" r="0.6" opacity="0.5" />
        </g>
      </g>

      {/* Olive Tree - deep olive green #526B3A / #3D4F2A */}
      {/* Trunk - twisted, rooted, ancient */}
      <path
        d="M 46 92 C 46 92, 44 84, 46 76 C 48 68, 44 60, 42 54 C 40 48, 44 42, 50 38 C 56 42, 60 48, 58 54 C 56 60, 52 68, 54 76 C 56 84, 54 92, 54 92 L 52 92 C 52 92, 54 86, 52 78 C 50 70, 46 62, 48 56 C 48 56, 46 62, 44 70 C 42 78, 44 86, 44 92 Z"
        fill="#3D4F2A"
      />
      <path
        d="M 42 92 C 38 90, 32 88, 28 90 C 34 88, 40 86, 42 82 M 54 92 C 58 90, 64 88, 70 90 C 64 88, 58 86, 56 82"
        stroke="#3D4F2A"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Main branches */}
      <path
        d="M 50 38 C 46 36, 38 32, 30 34 C 22 36, 16 44, 12 52"
        stroke="#3D4F2A"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 50 38 C 54 36, 62 32, 70 34 C 78 36, 84 44, 88 52"
        stroke="#3D4F2A"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 44 46 C 40 44, 32 40, 24 42"
        stroke="#3D4F2A"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 56 46 C 60 44, 68 40, 76 42"
        stroke="#3D4F2A"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 50 38 C 48 30, 46 22, 42 16"
        stroke="#3D4F2A"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 50 38 C 52 30, 54 22, 58 16"
        stroke="#3D4F2A"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Leaves - subtle, elegant, olive green #526B3A */}
      <g fill="#526B3A">
        {/* Top crown */}
        <ellipse cx="42" cy="16" rx="2.2" ry="5" transform="rotate(-15 42 16)" />
        <ellipse cx="38" cy="20" rx="1.8" ry="4" transform="rotate(-25 38 20)" />
        <ellipse cx="46" cy="20" rx="1.8" ry="4" transform="rotate(25 46 20)" />
        <ellipse cx="58" cy="16" rx="2.2" ry="5" transform="rotate(15 58 16)" />
        <ellipse cx="54" cy="20" rx="1.8" ry="4" transform="rotate(-25 54 20)" />
        <ellipse cx="62" cy="20" rx="1.8" ry="4" transform="rotate(25 62 20)" />
        <ellipse cx="50" cy="14" rx="2" ry="4.5" />
        {/* Left side */}
        <ellipse cx="24" cy="34" rx="1.8" ry="4" transform="rotate(-30 24 34)" />
        <ellipse cx="18" cy="38" rx="1.6" ry="3.5" transform="rotate(-40 18 38)" />
        <ellipse cx="14" cy="48" rx="1.8" ry="4" transform="rotate(-35 14 48)" />
        <ellipse cx="12" cy="52" rx="2" ry="4.5" transform="rotate(-20 12 52)" />
        <ellipse cx="22" cy="44" rx="1.5" ry="3" transform="rotate(20 22 44)" />
        <ellipse cx="26" cy="42" rx="1.5" ry="3" transform="rotate(10 26 42)" />
        {/* Right side */}
        <ellipse cx="76" cy="34" rx="1.8" ry="4" transform="rotate(30 76 34)" />
        <ellipse cx="82" cy="38" rx="1.6" ry="3.5" transform="rotate(40 82 38)" />
        <ellipse cx="86" cy="48" rx="1.8" ry="4" transform="rotate(35 86 48)" />
        <ellipse cx="88" cy="52" rx="2" ry="4.5" transform="rotate(20 88 52)" />
        <ellipse cx="78" cy="44" rx="1.5" ry="3" transform="rotate(-20 78 44)" />
        <ellipse cx="74" cy="42" rx="1.5" ry="3" transform="rotate(-10 74 42)" />
        {/* Lower */}
        <ellipse cx="28" cy="56" rx="1.6" ry="3.5" transform="rotate(-15 28 56)" />
        <ellipse cx="32" cy="60" rx="1.4" ry="3" transform="rotate(-10 32 60)" />
        <ellipse cx="72" cy="56" rx="1.6" ry="3.5" transform="rotate(15 72 56)" />
        <ellipse cx="68" cy="60" rx="1.4" ry="3" transform="rotate(10 68 60)" />
      </g>

      {/* Olives - small, subtle */}
      <g fill="#4A5D2F">
        <ellipse cx="36" cy="28" rx="1.5" ry="2" />
        <ellipse cx="64" cy="28" rx="1.5" ry="2" />
        <ellipse cx="22" cy="50" rx="1.3" ry="1.8" />
        <ellipse cx="78" cy="50" rx="1.3" ry="1.8" />
        <ellipse cx="30" cy="58" rx="1.2" ry="1.6" />
        <ellipse cx="70" cy="58" rx="1.2" ry="1.6" />
      </g>
    </svg>
  )

  return (
    <div className={cn("flex items-center select-none", s.gap, className)}>
      <div className="relative flex-shrink-0" style={{ width: s.icon, height: s.icon }}>
        <OliveIcon sz={s.icon} />
      </div>

      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <span
            className={cn("tracking-tight text-[#3D4F2A] dark:text-[#F7F2E6] font-serif", s.text)}
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", fontWeight: 600, letterSpacing: '-0.02em' }}
          >
            Barka Nour
          </span>
          {size !== 'sm' && (
            <div className="flex items-center gap-2 -mt-0.5">
              <span className="h-[1px] w-6 bg-[#C9A34A]/60 hidden sm:block" />
              <span
                className={cn("font-medium tracking-wide text-[#3D4F2A]/80 dark:text-[#F7F2E6]/70", s.sub)}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span className="hidden sm:inline" style={{ fontFamily: "'Amiri', serif" }}>بركة نور</span>
                <span className="sm:hidden">بركة نور</span>
              </span>
              <span className="h-[1px] w-6 bg-[#C9A34A]/60 hidden sm:block" />
            </div>
          )}
          {size === 'lg' && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <svg width="20" height="8" viewBox="0 0 20 8" fill="none"><path d="M10 1 L11 3 L13 3.5 L11 4 L10 6 L9 4 L7 3.5 L9 3 Z" fill="#C9A34A" /></svg>
              <div className="flex gap-0.5">
                <div className="w-1 h-1 rounded-full bg-[#C9A34A]" />
                <div className="w-4 h-[1px] bg-[#C9A34A]/40 mt-[1.5px]" />
                <div className="w-1 h-1 rounded-full bg-[#C9A34A]" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function BarkaNourIcon({ size = 32, className }: { size?: number, className?: string }) {
  return (
    <div className={cn("flex-shrink-0", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.85">
          <circle cx="50" cy="58" r="3" fill="#C9A34A" opacity="0.9" />
          <g stroke="#C9A34A" strokeWidth="0.6" strokeLinecap="round" opacity="0.7">
            <line x1="50" y1="58" x2="50" y2="8" />
            <line x1="50" y1="58" x2="68" y2="18" />
            <line x1="50" y1="58" x2="85" y2="42" />
            <line x1="50" y1="58" x2="88" y2="58" />
            <line x1="50" y1="58" x2="70" y2="82" />
            <line x1="50" y1="58" x2="30" y2="82" />
            <line x1="50" y1="58" x2="12" y2="58" />
            <line x1="50" y1="58" x2="22" y2="28" />
          </g>
        </g>
        <path d="M 46 92 C 46 92, 44 84, 46 76 C 48 68, 44 60, 42 54 C 40 48, 44 42, 50 38 C 56 42, 60 48, 58 54 C 56 60, 52 68, 54 76 C 56 84, 54 92, 54 92 Z" fill="#3D4F2A" />
        <path d="M 50 38 C 46 36, 38 32, 30 34 C 22 36, 16 44, 12 52" stroke="#3D4F2A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 50 38 C 54 36, 62 32, 70 34 C 78 36, 84 44, 88 52" stroke="#3D4F2A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 50 38 C 48 30, 46 22, 42 16" stroke="#3D4F2A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M 50 38 C 52 30, 54 22, 58 16" stroke="#3D4F2A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <g fill="#526B3A">
          <ellipse cx="42" cy="16" rx="2.2" ry="5" transform="rotate(-15 42 16)" />
          <ellipse cx="58" cy="16" rx="2.2" ry="5" transform="rotate(15 58 16)" />
          <ellipse cx="14" cy="48" rx="1.8" ry="4" transform="rotate(-35 14 48)" />
          <ellipse cx="86" cy="48" rx="1.8" ry="4" transform="rotate(35 86 48)" />
        </g>
      </svg>
    </div>
  )
}
