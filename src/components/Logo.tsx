import logoImg from '@/assets/image-c444e.png'
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
    sm: 'h-9 w-9',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  return (
    <div className={cn('flex items-center gap-3 group', className)}>
      <img
        src={logoImg}
        alt="ACERSOL Portal"
        className={cn(
          'rounded-xl object-contain transition-transform duration-300 group-hover:scale-105',
          sizes[size],
        )}
      />
      {showText && (
        <span className="text-2xl font-black tracking-tighter text-foreground">
          ACER
          <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
            SOL
          </span>
        </span>
      )}
    </div>
  )
}
