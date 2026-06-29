import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const ROUTE_MAP: Record<string, string> = {
  clients: '/dashboard/admin/clientes',
  plants: '/dashboard/admin/usinas',
}

export function FriendlyCodeLink({
  code,
  collection,
  recordId,
  className,
}: {
  code?: string
  collection: string
  recordId: string
  className?: string
}) {
  if (!code) {
    return <span className={cn('font-mono text-xs text-muted-foreground', className)}>—</span>
  }
  const base = ROUTE_MAP[collection]
  if (!base) {
    return <span className={cn('font-mono text-xs', className)}>{code}</span>
  }
  return (
    <Link
      to={`${base}/${recordId}`}
      className={cn('font-mono text-xs text-brand-blue hover:underline cursor-pointer', className)}
    >
      {code}
    </Link>
  )
}
