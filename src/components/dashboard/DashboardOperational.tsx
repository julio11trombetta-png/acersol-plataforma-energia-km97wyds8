import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Activity, LifeBuoy, Bell } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardOperationalProps {
  tickets: any[]
  activities: any[]
  loading: boolean
}

export function DashboardOperational({ tickets, activities, loading }: DashboardOperationalProps) {
  const openTickets = tickets.filter((t) => t.status === 'Aberto' || t.status === 'Em Andamento')
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-brand-blue" /> Agenda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <p className="text-xs text-muted-foreground">Nenhuma tarefa agendada para hoje.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand-green" /> Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[180px] overflow-y-auto">
          {loading ? (
            <Skeleton className="h-12 w-full" />
          ) : activities.length > 0 ? (
            activities.slice(0, 4).map((a) => (
              <div key={a.id} className="text-xs">
                <span className="font-medium">{a.action}</span>
                <p className="text-muted-foreground">{a.details || a.entity}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">Sem atividade recente.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <LifeBuoy className="h-4 w-4 text-brand-orange" /> Chamados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <div className="space-y-1">
              <p className="text-2xl font-bold">{openTickets.length}</p>
              <p className="text-xs text-muted-foreground">Em aberto</p>
              {tickets.length > 0 && (
                <Badge variant="outline" className="text-[10px] mt-1">
                  {tickets.length} total
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="h-4 w-4 text-brand-yellow" /> Notificações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-muted-foreground">Sem novas notificações</p>
        </CardContent>
      </Card>
    </div>
  )
}
