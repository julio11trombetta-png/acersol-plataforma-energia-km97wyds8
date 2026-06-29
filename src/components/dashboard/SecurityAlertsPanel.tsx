import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react'
import {
  getSecurityAlerts,
  resolveSecurityAlert,
  dismissSecurityAlert,
} from '@/services/security-alerts'
import { useRealtime } from '@/hooks/use-realtime'
import { toast } from 'sonner'

const SEVERITY_COLORS: Record<string, string> = {
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const TYPE_LABELS: Record<string, string> = {
  failed_logins: 'Logins Falhados',
  unusual_location: 'Localização Incomum',
  unusual_hours: 'Horário Incomum',
  mass_export: 'Exportação em Massa',
  mass_delete: 'Exclusão em Massa',
  permission_change: 'Alteração de Permissão',
  suspicious_activity: 'Atividade Suspeita',
}

export function SecurityAlertsPanel() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setAlerts(await getSecurityAlerts('open'))
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('security_alerts', () => loadData())

  const handleResolve = async (id: string) => {
    try {
      await resolveSecurityAlert(id, 'Resolvido pelo administrador')
      toast.success('Alerta resolvido')
      loadData()
    } catch {
      toast.error('Erro ao resolver alerta')
    }
  }

  const handleDismiss = async (id: string) => {
    try {
      await dismissSecurityAlert(id, 'Descartado pelo administrador')
      toast.success('Alerta descartado')
      loadData()
    } catch {
      toast.error('Erro ao descartar alerta')
    }
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-orange-500" />
          <CardTitle className="text-sm">Alertas de Segurança</CardTitle>
          {alerts.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {alerts.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-2">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            Nenhum alerta ativo no momento.
          </p>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="divide-y">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className={SEVERITY_COLORS[alert.severity] || ''} variant="secondary">
                      {alert.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.created).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{TYPE_LABELS[alert.type] || alert.type}</p>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                    {alert.ip_address && (
                      <p className="text-xs text-muted-foreground font-mono">
                        IP: {alert.ip_address}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => handleResolve(alert.id)}
                    >
                      <CheckCircle className="mr-1 h-3 w-3" /> Resolver
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => handleDismiss(alert.id)}
                    >
                      <XCircle className="mr-1 h-3 w-3" /> Descartar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
