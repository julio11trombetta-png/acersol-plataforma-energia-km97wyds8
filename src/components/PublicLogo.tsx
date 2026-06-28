import logoImg from '@/assets/logo-e3415.png'
import { cn } from '@/lib/utils'

export function PublicLogo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 group', className)}>
      <img
        src={logoImg}
        alt="ACERSOL"
        className="h-10 w-10 rounded-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
      <span className="text-2xl font-black tracking-tighter text-foreground">
        ACER
        <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">
          SOL
        </span>
      </span>
    </div>
  )
}
