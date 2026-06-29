import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { Search, Plus, Edit, Ban, FileDown, FileText, Users } from 'lucide-react'
import { getClientsAdvanced, getAllClients } from '@/services/clients'
import { getConsumerUnits } from '@/services/consumer-units'
import { createActivityLog } from '@/services/activity-logs'
import { updateClient } from '@/services/clients'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/stores/use-auth-store'
import { AssociateFormDialog } from '@/components/dashboard/association/AssociateFormDialog'
import { ConfirmDialog } from '@/components/dashboard/association/ConfirmDialog'
import { exportToExcel, exportToPDF } from '@/lib/export-utils'
import { UTILITY_PROVIDERS } from '@/lib/regional-data'
import { toast } from 'sonner'
import { formatDocument } from '@/lib/formatters'

const statusColor: Record<string, string> = {
  Ativo: 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20',
  Suspenso: 'text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-900/20',
  Pendente: 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20',
  Bloqueado: 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20',
  'Em Análise': 'text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20',
  Inativo: 'text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-900/20',
}

export default function Associados() {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [clients, setClients] = useState<any[]>([])
  const [ucCounts, setUcCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(searchParams.get('status') || 'all')
  const [utility, setUtility] = useState('all')
  const [city, setCity] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadData = async () => {
    try {
      const [data, ucs] = await Promise.all([
        getClientsAdvanced({ search, status, utility, city, perPage: 100 }),
        getConsumerUnits(),
      ])
      setClients(data.items)
      const counts: Record<string, number> = {}
      ucs.forEach((u: any) => {
        counts[u.clientId] = (counts[u.clientId] || 0) + 1
      })
      setUcCounts(counts)
    } catch {
      toast.error('Erro ao carregar associados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    const d = setTimeout(() => loadData(), 400)
    return () => clearTimeout(d)
  }, [search, status, utility, city])

  useRealtime('clients', () => loadData())

  const openEdit = (c: any) => {
    setEditing(c)
    setFormOpen(true)
  }
  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await updateClient(deleteId, { associateStatus: 'Inativo' })
      await createActivityLog({
        action: 'Inativou associado',
        entity: 'clients',
        entityId: deleteId,
      })
      toast.success('Associado inativado')
    } catch {
      toast.error('Erro ao inativar')
    } finally {
      setDeleteId(null)
    }
  }

  const handleExportExcel = () => {
    exportToExcel(
      'associados',
      ['Nome', 'Documento', 'Cidade', 'Distribuidora', 'Qtd UCs', 'Status', 'Atualizado'],
      clients.map((c) => [
        c.name,
        c.document_number || '',
        c.city || '',
        c.utilityProvider || '',
        ucCounts[c.id] || 0,
        c.associateStatus || 'Ativo',
        new Date(c.updated).toLocaleDateString('pt-BR'),
      ]),
    )
  }
  const handleExportPDF = () => {
    exportToPDF(
      'Associados',
      ['Nome', 'Documento', 'Cidade', 'Distribuidora', 'Status'],
      clients.map((c) => [
        c.name,
        c.document_number || '',
        c.city || '',
        c.utilityProvider || '',
        c.associateStatus || 'Ativo',
      ]),
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Associados</h2>
          <p className="text-muted-foreground">Gestão completa do ciclo de vida dos associados.</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-brand-blue hover:bg-blue-800 text-white rounded-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Associado
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, documento, UC..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {['Ativo', 'Suspenso', 'Pendente', 'Bloqueado', 'Em Análise', 'Inativo'].map(
                  (s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            <Select value={utility} onValueChange={setUtility}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Distribuidora" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {UTILITY_PROVIDERS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Cidade"
              className="w-[120px]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Button variant="outline" size="icon" onClick={handleExportExcel} title="Exportar CSV">
              <FileDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleExportPDF} title="Exportar PDF">
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : clients.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<Users className="h-12 w-12 text-brand-blue opacity-80" />}
                title="Não existem associados cadastrados"
                description="Comece cadastrando o primeiro associado da plataforma."
                action={
                  <Button
                    onClick={openCreate}
                    className="mt-4 rounded-full bg-brand-blue hover:bg-blue-800 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Cadastrar Associado
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Nome</TableHead>
                    <TableHead>CPF/CNPJ</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Distribuidora</TableHead>
                    <TableHead className="text-center">Qtd UCs</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Atualizado</TableHead>
                    <TableHead className="text-right pr-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((c) => (
                    <TableRow key={c.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium pl-6">{c.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {c.document_number ? formatDocument(c.document_number) : '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{c.city || '—'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {c.utilityProvider || '—'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{ucCounts[c.id] || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusColor[c.associateStatus] || statusColor.Ativo}
                        >
                          {c.associateStatus || 'Ativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(c.updated).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(c)}
                          className="hover:bg-brand-blue/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(c.id)}
                          className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                        >
                          <Ban className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AssociateFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        onSaved={loadData}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Inativar Associado"
        description="O associado será marcado como inativo. Esta ação preserva o histórico."
      />
    </div>
  )
}
