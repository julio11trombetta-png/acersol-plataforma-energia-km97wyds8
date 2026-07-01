import { cn } from '@/lib/utils'
import logoHorizontal from '@/assets/logomarca-horizontal-jpg-d6a8a.jpg'
import logoCircle from '@/assets/logo-20eaa.png'

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
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
  }

  if (!showText) {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <img src={logoCircle} alt="ACERSOL" className={cn('object-contain', sizes[size])} />
      </div>
    )
  }

  return (
    <div className={cn('flex items-center', className)}>
      <img src={logoHorizontal} alt="ACERSOL" className={cn('object-contain', sizes[size])} />
    </div>
  )
}
