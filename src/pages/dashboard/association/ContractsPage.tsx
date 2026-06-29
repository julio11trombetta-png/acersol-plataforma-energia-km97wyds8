import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { FileSignature, Download, Eye } from 'lucide-react'
import { getContracts } from '@/services/contracts'
import { getAllClients } from '@/services/clients'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'

const statusMap: Record<string, { label: string; color: string }> = {
  Ativo: {
    label: 'Assinado',
    color: 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20',
  },
  Expirado: {
    label: 'Vencido',
    color: 'text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-900/20',
  },
  Cancelado: {
    label: 'Cancelado',
    color: 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20',
  },
}

export default function ContractsPage() {
  const [records, setRecords] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterClient, setFilterClient] = useState('all')

  const loadData = async () => {
    try {
      const [d, c] = await Promise.all([getContracts(), getAllClients()])
      setRecords(d)
      setClients(c)
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  useRealtime('contracts', () => loadData())

  const filtered =
    filterClient === 'all' ? records : records.filter((r) => r.clientId === filterClient)
  const clientName = (id: string) => clients.find((c) => c.id === id)?.name || '—'
  const fileUrl = (r: any) => (r.document ? pb.files.getUrl(r, r.document) : '#')

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold">Contratos</h2>
        <p className="text-muted-foreground">Contratos vinculados aos associados.</p>
      </div>
      <Card>
        <CardHeader className="border-b">
          <Select value={filterClient} onValueChange={setFilterClient}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filtrar por associado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<FileSignature className="h-10 w-10 text-brand-blue opacity-80" />}
                title="Nenhum contrato"
                description="Não há contratos cadastrados."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Associado</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Término</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => {
                    const s = statusMap[r.status] || statusMap.Ativo
                    return (
                      <TableRow key={r.id} className="hover:bg-muted/30">
                        <TableCell className="pl-6 font-medium">
                          {r.expand?.clientId?.name || clientName(r.clientId)}
                        </TableCell>
                        <TableCell>{r.title}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {r.startDate ? new Date(r.startDate).toLocaleDateString('pt-BR') : '—'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {r.endDate ? new Date(r.endDate).toLocaleDateString('pt-BR') : '—'}
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-1 rounded-full border ${s.color}`}>
                            {s.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          {r.document && (
                            <>
                              <a href={fileUrl(r)} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </a>
                              <a href={fileUrl(r)} download>
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </a>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
