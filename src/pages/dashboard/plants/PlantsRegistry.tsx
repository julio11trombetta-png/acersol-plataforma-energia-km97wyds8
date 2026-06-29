import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
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
import { Search, Plus, Edit, Trash2, Eye, FileDown, FileText, Zap } from 'lucide-react'
import { getPlantsAdvanced, deletePlant } from '@/services/plants'
import { createActivityLog } from '@/services/activity-logs'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/stores/use-auth-store'
import { PlantFormDialog } from '@/components/dashboard/plants/PlantFormDialog'
import { ConfirmDialog } from '@/components/dashboard/association/ConfirmDialog'
import { exportToExcel, exportToPDF } from '@/lib/export-utils'
import { UTILITY_PROVIDERS, BRAZILIAN_STATES } from '@/lib/regional-data'
import { toast } from 'sonner'

const statusColor: Record<string, string> = {
  Ativa: 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20',
  'Em Projeto': 'text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20',
  'Em Homologação': 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20',
  Manutenção: 'text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-900/20',
  Suspensa: 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20',
  Inativa: 'text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-900/20',
}

export default function PlantsRegistry() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [plants, setPlants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [utility, setUtility] = useState('all')
  const [state, setState] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadData = async () => {
    try {
      const data = await getPlantsAdvanced({ search, status, utility, state, perPage: 100 })
      setPlants(data.items)
    } catch {
      toast.error('Erro ao carregar usinas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    const d = setTimeout(() => loadData(), 400)
    return () => clearTimeout(d)
  }, [search, status, utility, state])

  useRealtime('plants', () => loadData())

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (p: any) => {
    setEditing(p)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deletePlant(deleteId)
      await createActivityLog({ action: 'Excluiu usina', entity: 'plants', entityId: deleteId })
      toast.success('Usina excluída')
    } catch {
      toast.error('Erro ao excluir')
    } finally {
      setDeleteId(null)
    }
  }

  const handleExportExcel = () => {
    exportToExcel(
      'usinas',
      ['Nome', 'Cidade', 'Distribuidora', 'Potência', 'Status', 'Gerada', 'Atualizado'],
      plants.map((p) => [
        p.name,
        p.city || '',
        p.utilityProvider || '',
        p.capacity || 0,
        p.status || '',
        p.generation_now || 0,
        new Date(p.updated).toLocaleDateString('pt-BR'),
      ]),
    )
  }
  const handleExportPDF = () => {
    exportToPDF(
      'Usinas',
      ['Nome', 'Cidade', 'Distribuidora', 'Potência', 'Status'],
      plants.map((p) => [
        p.name,
        p.city || '',
        p.utilityProvider || '',
        p.capacity || 0,
        p.status || '',
      ]),
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cadastro de Usinas</h2>
          <p className="text-muted-foreground">Gestão completa do parque gerador.</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-brand-green hover:bg-green-700 text-white rounded-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Usina
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, local, código..."
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
                {['Em Projeto', 'Em Homologação', 'Ativa', 'Manutenção', 'Suspensa', 'Inativa'].map(
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
            <Select value={state} onValueChange={setState}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {BRAZILIAN_STATES.map((s) => (
                  <SelectItem key={s.code} value={s.code}>
                    {s.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          ) : plants.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<Zap className="h-12 w-12 text-brand-green opacity-80" />}
                title="Nenhuma usina cadastrada"
                description="Cadastre a primeira usina solar."
                action={
                  <Button
                    onClick={openCreate}
                    className="mt-4 rounded-full bg-brand-green hover:bg-green-700 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Cadastrar Usina
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
                    <TableHead>Cidade</TableHead>
                    <TableHead>Distribuidora</TableHead>
                    <TableHead>Potência</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Gerada</TableHead>
                    <TableHead>Atualizado</TableHead>
                    <TableHead className="text-right pr-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plants.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium pl-6">
                        <button
                          onClick={() => navigate(`/dashboard/admin/usinas/${p.id}`)}
                          className="hover:text-brand-green flex items-center gap-2"
                        >
                          <div className="h-7 w-7 rounded-full bg-yellow-500/10 flex items-center justify-center">
                            <Zap className="h-3.5 w-3.5 text-yellow-600" />
                          </div>
                          {p.name}
                        </button>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{p.city || '—'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {p.utilityProvider || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        >
                          {p.capacity || 0} kW
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusColor[p.status] || statusColor.Inativa}
                        >
                          {p.status || 'Inativa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {p.generation_now
                          ? `${Number(p.generation_now).toLocaleString('pt-BR')} kW`
                          : '—'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(p.updated).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/dashboard/admin/usinas/${p.id}`)}
                          className="hover:bg-brand-green/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(p)}
                          className="hover:bg-brand-green/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(p.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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

      <PlantFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        onSaved={loadData}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Usina"
        description="Confirma a exclusão desta usina? Esta ação não pode ser desfeita."
      />
    </div>
  )
}
