import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { History } from 'lucide-react'
import { getPasswordLogsByUser } from '@/services/password-logs'

interface PasswordLogsViewerProps {
  userId: string
}

export function PasswordLogsViewer({ userId }: PasswordLogsViewerProps) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadLogs = async () => {
    try {
      const res = await getPasswordLogsByUser(userId, 1, 10)
      setLogs(res.items)
    } catch {
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [userId])

  return (
    <div className="rounded-lg border border-border/60">
      <div className="flex items-center gap-2 p-3 border-b border-border/60">
        <History className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Histórico de Ações</span>
      </div>
      <ScrollArea className="max-h-48">
        {loading ? (
          <div className="p-3 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : logs.length > 0 ? (
          <div className="divide-y divide-border/40">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
              >
                <span className="text-sm font-medium">{log.action_type}</span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {log.expand?.admin_id && (
                    <span>por {log.expand.admin_id.name || log.expand.admin_id.email}</span>
                  )}
                  <span>{new Date(log.created).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-3 text-sm text-muted-foreground">Nenhuma ação registrada.</p>
        )}
      </ScrollArea>
    </div>
  )
}
