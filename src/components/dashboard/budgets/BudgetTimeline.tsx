import { useState, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { getBudgetHistory } from '@/services/budgets'
import { useRealtime } from '@/hooks/use-realtime'
import { Clock, User, Globe } from 'lucide-react'

const ACTION_COLORS: Record<string, string> = {
  Create: 'bg-green-500',
  Update: 'bg-blue-500',
  Delete: 'bg-red-500',
  View: 'bg-gray-400',
  'Convertido em Associado': 'bg-purple-500',
  'Envio WhatsApp': 'bg-green-600',
  'Envio Email': 'bg-blue-600',
  'Link Copiado': 'bg-purple-600',
}

export function BudgetTimeline({ budgetId }: { budgetId: string }) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const data = await getBudgetHistory(budgetId)
      setLogs(data)
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [budgetId])
  useRealtime('budget_history', () => loadData())

  if (loading)
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  if (logs.length === 0)
    return <p className="text-sm text-muted-foreground p-4 text-center">Sem eventos registrados.</p>

  return (
    <ScrollArea className="max-h-[400px]">
      <div className="relative pl-6 pb-4">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />
        {logs.map((log) => (
          <div key={log.id} className="relative pb-4">
            <div
              className={`absolute -left-4 top-1 h-3 w-3 rounded-full ${ACTION_COLORS[log.action] || 'bg-gray-400'} ring-2 ring-background`}
            />
            <div className="ml-2 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {log.action}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(log.created).toLocaleString('pt-BR')}
                </span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" /> Por{' '}
                <strong className="text-foreground">{log.user_name || '—'}</strong>
                {log.ip_address && (
                  <span className="flex items-center gap-1 ml-2">
                    <Globe className="h-3 w-3" />
                    {log.ip_address}
                  </span>
                )}
              </p>
              {log.details && <p className="text-xs text-muted-foreground">{log.details}</p>}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
