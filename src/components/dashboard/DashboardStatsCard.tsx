import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { type LucideIcon, ArrowRight } from 'lucide-react'

interface DashboardStatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: string
  path: string
  loading?: boolean
  subtitle?: string
}

export function DashboardStatsCard({
  title,
  value,
  icon: Icon,
  color,
  path,
  loading,
  subtitle,
}: DashboardStatsCardProps) {
  return (
    <Link to={path}>
      <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer group h-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className={`rounded-xl p-2 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-xs font-medium text-muted-foreground mb-1">{title}</p>
          <div className="text-xl font-bold tracking-tight">
            {loading ? <Skeleton className="h-6 w-20" /> : value}
          </div>
          {subtitle && <p className="text-[10px] text-muted-foreground mt-1">{subtitle}</p>}
        </CardContent>
      </Card>
    </Link>
  )
}
