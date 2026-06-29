import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { History, ArrowRight, Globe, Monitor, Smartphone } from 'lucide-react'
import { getAuditLogsByRecord } from '@/services/audit-logs'
import { useRealtime } from '@/hooks/use-realtime'

const OP_BADGES: Record<string, string> = {
  Create: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Update: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Delete: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

function parseChanges(raw: unknown): Record<string, { before: string; after: string }> {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return {}
    }
  }
  if (raw && typeof raw === 'object')
    return raw as Record<string, { before: string; after: string }>
  return {}
}

export function AuditHistory({ recordId }: { recordId: string }) {
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

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Histórico de Auditoria</h3>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<History className="h-10 w-10 text-muted-foreground opacity-60" />}
              title="Nenhum registro de auditoria"
              description="O histórico de operações aparecerá aqui automaticamente."
            />
          </div>
        ) : (
          <ScrollArea className="max-h-[500px]">
            <div className="divide-y">
              {logs.map((log) => {
                const changes = parseChanges(log.field_changes)
                const changeKeys = Object.keys(changes)
                return (
                  <div key={log.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={OP_BADGES[log.operation_type] || 'bg-gray-100 text-gray-700'}
                          variant="secondary"
                        >
                          {log.operation_type}
                        </Badge>
                        {log.record_friendly_code && (
                          <span className="text-xs font-mono text-muted-foreground">
                            {log.record_friendly_code}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.created).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span>
                        Por:{' '}
                        <strong className="text-foreground">
                          {log.user_name || log.expand?.userId?.name || '—'}
                        </strong>
                      </span>
                      <span className="font-mono">{log.protocol}</span>
                      {log.ip_address && (
                        <span className="flex items-center gap-1">
                          {log.device === 'Mobile' ? (
                            <Smartphone className="h-3 w-3" />
                          ) : (
                            <Monitor className="h-3 w-3" />
                          )}
                          {log.browser} / {log.os}
                        </span>
                      )}
                    </div>
                    {changeKeys.length > 0 && (
                      <div className="mt-2 space-y-1 rounded-md bg-muted/50 p-2">
                        {changeKeys.map((key) => (
                          <div key={key} className="flex items-center gap-2 text-xs">
                            <span className="font-medium min-w-[120px]">{key}:</span>
                            <span className="text-red-500 line-through max-w-[150px] truncate">
                              {changes[key].before || '—'}
                            </span>
                            <ArrowRight className="h-3 w-3 flex-shrink-0" />
                            <span className="text-green-600 max-w-[150px] truncate">
                              {changes[key].after || '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
