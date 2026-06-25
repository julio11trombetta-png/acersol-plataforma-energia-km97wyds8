import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 group', className)}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue via-brand-blue/90 to-brand-green shadow-lg shadow-brand-blue/20 transition-transform duration-300 group-hover:scale-105">
        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
      <span className="text-2xl font-black tracking-tighter text-foreground">
        ACER
        <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
          SOL
        </span>
      </span>
    </div>
  )
}
