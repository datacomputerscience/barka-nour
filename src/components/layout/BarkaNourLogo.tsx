import { cn } from "@/lib/utils"

export function BarkaNourLogo({ size = 'default', variant = 'full', className }: { size?: 'sm' | 'default' | 'lg', variant?: 'full' | 'icon', className?: string }) {
  const sizes = {
    sm: { icon: 36, text: 'text-[19px]', sub: 'text-[10px]', gap: 'gap-2' },
    default: { icon: 44, text: 'text-[24px]', sub: 'text-[11px]', gap: 'gap-2.5' },
    lg: { icon: 64, text: 'text-[32px]', sub: 'text-[13px]', gap: 'gap-3' },
  }
  const s = sizes[size]

  return (
    <div className={cn("flex items-center select-none", s.gap, className)}>
      {/* Geev-inspired icon: organic dark green blob #284B41 with yellow #FFC639 smile + package */}
      <div className="relative flex-shrink-0 animate-geev-bounce" style={{ width: s.icon, height: s.icon }}>
        <svg width={s.icon} height={s.icon} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
          {/* Organic blob - dark green #284B41 - Geev style rounded handwritten blob */}
          <path
            d="M 38 8 C 58 4, 78 12, 86 32 C 92 50, 85 72, 68 84 C 50 96, 24 94, 10 78 C 0 62, 2 38, 14 22 C 20 13, 28 10, 38 8 Z"
            fill="#284B41"
          />
          {/* Slight highlight - inner organic cut for package area */}
          <path
            d="M 26 36 C 26 36, 36 32, 52 34 C 64 36, 74 42, 72 58 C 70 64, 58 66, 46 66 C 34 66, 22 62, 22 52 C 22 44, 24 40, 26 36 Z"
            fill="white"
          />
          {/* Yellow package bottom - #FFC639 */}
          <path
            d="M 28 48 C 28 46, 32 44, 50 45 C 62 46, 70 48, 70 50 L 70 60 C 70 62, 64 65, 48 66 C 32 66, 26 62, 26 54 L 26 48 Z"
            fill="#FFC639"
          />
          {/* Yellow package top flap */}
          <path
            d="M 48 22 L 64 24 C 68 25, 70 27, 69 32 L 67 40 C 66 41, 58 42, 50 41 L 46 30 C 46 26, 47 23, 48 22 Z"
            fill="#FFC639"
          />
          {/* Yellow heart - Geev joyful accent */}
          <path
            d="M 34 30 C 32 27, 27 27.5, 27 31 C 27 33, 29 35, 33 38 L 36 40 L 40 36 C 43 33, 43 28, 40 28 C 38 28, 36 29, 34 30 Z"
            fill="#FFC639"
          />
          {/* Yellow smile - hidden smile like Geev's 2 e's smile */}
          <path
            d="M 20 68 Q 45 88, 72 66"
            stroke="#FFC639"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-logo tracking-tight text-[#284B41] dark:text-[#f7f6f2] lowercase", s.text)} style={{ fontFamily: "'Fredoka', 'Baloo 2', sans-serif", fontWeight: 600, letterSpacing: '-0.03em' }}>
            barka <span className="relative inline-block">
              nour
              {/* Yellow dot on i - Geev mango #FFC639 accent */}
              <span className="absolute -top-1 -right-2.5 w-2 h-2 md:w-2.5 md:h-2.5 bg-[#ffc639] rounded-full" />
            </span>
          </span>
          {size !== 'sm' && (
            <span className={cn("font-medium tracking-wide text-olive-700/70 dark:text-olive-200/70 -mt-1 flex items-center gap-1", s.sub)} style={{ fontFamily: "'Fredoka', sans-serif" }}>
              <span className="hidden sm:inline">donner • récupérer • sourire</span>
              <span className="sm:hidden">donner • sourire</span>
              <span className="inline-block w-1 h-1 bg-[#ffc639] rounded-full ml-1" />
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// Icon only export for favicon / small usage
export function BarkaNourIcon({ size = 32, className }: { size?: number, className?: string }) {
  return (
    <div className={cn("flex-shrink-0", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 38 8 C 58 4, 78 12, 86 32 C 92 50, 85 72, 68 84 C 50 96, 24 94, 10 78 C 0 62, 2 38, 14 22 C 20 13, 28 10, 38 8 Z" fill="#284B41" />
        <path d="M 26 36 C 26 36, 36 32, 52 34 C 64 36, 74 42, 72 58 C 70 64, 58 66, 46 66 C 34 66, 22 62, 22 52 C 22 44, 24 40, 26 36 Z" fill="white" />
        <path d="M 28 48 C 28 46, 32 44, 50 45 C 62 46, 70 48, 70 50 L 70 60 C 70 62, 64 65, 48 66 C 32 66, 26 62, 26 54 L 26 48 Z" fill="#FFC639" />
        <path d="M 48 22 L 64 24 C 68 25, 70 27, 69 32 L 67 40 C 66 41, 58 42, 50 41 L 46 30 C 46 26, 47 23, 48 22 Z" fill="#FFC639" />
        <path d="M 34 30 C 32 27, 27 27.5, 27 31 C 27 33, 29 35, 33 38 L 36 40 L 40 36 C 43 33, 43 28, 40 28 C 38 28, 36 29, 34 30 Z" fill="#FFC639" />
        <path d="M 20 68 Q 45 88, 72 66" stroke="#FFC639" strokeWidth="7" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  )
}
