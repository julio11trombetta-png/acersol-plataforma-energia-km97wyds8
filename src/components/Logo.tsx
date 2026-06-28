import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  showText = true,
  size = 'md',
}: {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = {
    sm: { box: 'h-9 w-9', icon: 'h-5 w-5', text: 'text-xl' },
    md: { box: 'h-12 w-12', icon: 'h-7 w-7', text: 'text-2xl' },
    lg: { box: 'h-16 w-16', icon: 'h-9 w-9', text: 'text-3xl' },
  }

  return (
    <div className={cn('flex items-center gap-3 group', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue/80 shadow-lg transition-transform duration-300 group-hover:scale-105',
          sizes[size].box,
        )}
      >
        <Zap
          className={cn('text-brand-yellow fill-brand-yellow/30', sizes[size].icon)}
          strokeWidth={2.5}
        />
      </div>
      {showText && (
        <span className={cn('font-black tracking-tighter text-foreground', sizes[size].text)}>
          ACER
          <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
            SOL
          </span>
        </span>
      )}
    </div>
  )
}
