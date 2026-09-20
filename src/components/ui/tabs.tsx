import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{ active: string, setActive: (v: string) => void } | null>(null)

export function Tabs({ defaultValue, children, className }: { defaultValue: string, children: React.ReactNode, className?: string }) {
  const [active, setActive] = React.useState(defaultValue)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("inline-flex h-10 items-center justify-center rounded-xl bg-ink-100 p-1 text-ink-500", className)}>{children}</div>
}

export function TabsTrigger({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) {
  const ctx = React.useContext(TabsContext)
  const isActive = ctx?.active === value
  return (
    <button
      onClick={() => ctx?.setActive(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-white text-ink-900 shadow-sm" : "hover:bg-white/50",
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) {
  const ctx = React.useContext(TabsContext)
  if (ctx?.active !== value) return null
  return <div className={cn("mt-4 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2", className)}>{children}</div>
}
