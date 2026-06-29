import { useState, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { getAuditLogsByRecord } from '@/services/audit-logs'
import { useRealtime } from '@/hooks/use-realtime'
import { Circle, Clock, Monitor, Smartphone } from 'lucide-react'

const OP_LABELS: Record<string, string> = {
  Create: 'Registro criado',
  Update: 'Registro alterado',
  Delete: 'Registro excluído',
  View: 'Registro visualizado',
  Login: 'Login realizado',
  Logout: 'Logout realizado',
}

const OP_COLORS: Record<string, string> = {
  Create: 'bg-green-500',
  Update: 'bg-blue-500',
  Delete: 'bg-red-500',
  View: 'bg-gray-400',
  Login: 'bg-purple-500',
  Logout: 'bg-orange-500',
}

export function RecordTimeline({ recordId }: { recordId: string }) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const data = await getAuditLogsByRecord(recordId, 1, 50)
      setLogs(data.items || [])
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [recordId])
  useRealtime('audit_logs', () => loadData())

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (logs.length === 0) {
    return <p className="text-sm text-muted-foreground p-4 text-center">Sem eventos registrados.</p>
  }

  return (
    <ScrollArea className="max-h-[400px]">
      <div className="relative pl-6 pb-4">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />
        {logs.map((log, idx) => (
          <div key={log.id} className="relative pb-4">
            <div
              className={`absolute -left-4 top-1 h-3 w-3 rounded-full ${OP_COLORS[log.operation_type] || 'bg-gray-400'} ring-2 ring-background`}
            />
            <div className="ml-2 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {OP_LABELS[log.operation_type] || log.operation_type}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(log.created).toLocaleString('pt-BR')}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Por <strong className="text-foreground">{log.user_name || '—'}</strong>
                {log.ip_address && (
                  <span className="ml-2 flex items-center gap-1 inline-flex">
                    {log.device === 'Mobile' ? (
                      <Smartphone className="h-3 w-3" />
                    ) : (
                      <Monitor className="h-3 w-3" />
                    )}
                    {log.browser} · {log.os}
                  </span>
                )}
              </p>
              {log.protocol && (
                <p className="text-xs font-mono text-muted-foreground">{log.protocol}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
