import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center bg-muted/10 border border-dashed rounded-2xl animate-fade-in transition-all hover:bg-muted/20',
        className,
      )}
    >
      <div className="p-5 bg-background rounded-full mb-6 text-muted-foreground shadow-sm border ring-4 ring-muted/50">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3 tracking-tight">{title}</h3>
      <p className="text-base text-muted-foreground max-w-md mb-8 leading-relaxed">{description}</p>
      {action}
    </div>
  )
}
