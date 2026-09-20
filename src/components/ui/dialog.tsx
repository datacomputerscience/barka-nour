import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export function Dialog({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 max-h-[90vh] overflow-auto">{children}</div>
    </div>
  )
}

export function DialogContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("relative bg-white rounded-2xl shadow-2xl border border-ink-200 w-full max-w-[560px] m-4 p-6 animate-in", className)}>
      {children}
    </div>
  )
}

export function DialogHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("flex flex-col space-y-1.5 mb-4", className)}>{children}</div>
}

export function DialogTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return <h3 className={cn("text-[18px] font-semibold leading-none tracking-tight", className)}>{children}</h3>
}

export function DialogDescription({ children, className }: { children: React.ReactNode, className?: string }) {
  return <p className={cn("text-sm text-ink-500", className)}>{children}</p>
}
