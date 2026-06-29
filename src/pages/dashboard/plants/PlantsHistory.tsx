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
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'

const PLANT_ENTITIES = [
  'plants',
  'plant_generation',
  'plant_equipments',
  'plant_maintenances',
  'plant_documents',
]

export default function PlantsHistory() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const filters = PLANT_ENTITIES.map((e) => `entity = "${e}"`).join(' || ')
      const data = await pb
        .collection('activity_logs')
        .getList(1, 50, { sort: '-created', filter: filters, expand: 'userId' })
      setRecords(data.items || [])
    } catch {
      /* */
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
        <p className="text-muted-foreground">
          Registro de atividades e auditoria do módulo de usinas.
        </p>
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
                icon={<History className="h-10 w-10 text-brand-green opacity-80" />}
                title="Nenhuma atividade"
                description="As atividades do módulo aparecerão aqui."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Ação</TableHead>
                    <TableHead>Entidade</TableHead>
                    <TableHead>Usuário</TableHead>
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
                      <TableCell className="text-muted-foreground">
                        {r.expand?.userId?.name || '—'}
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
