import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { History } from 'lucide-react'
import { getActivityLogs } from '@/services/activity-logs'
import { useRealtime } from '@/hooks/use-realtime'

export default function HistoricoPage() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const data = await getActivityLogs(1, 50)
      setRecords(data.items || [])
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('activity_logs', () => loadData())

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold">Histórico</h2>
        <p className="text-muted-foreground">Registro de atividades e auditoria do sistema.</p>
      </div>
      <Card>
        <CardHeader className="border-b">
          <h3 className="text-sm font-semibold">Atividades Recentes</h3>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<History className="h-10 w-10 text-brand-blue opacity-80" />}
                title="Nenhuma atividade"
                description="As atividades do sistema aparecerão aqui."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Ação</TableHead>
                    <TableHead>Entidade</TableHead>
                    <TableHead>Detalhes</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/30">
                      <TableCell className="pl-6 font-medium">{r.action}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{r.entity || '—'}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {r.details || '—'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(r.created).toLocaleString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
