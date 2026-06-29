import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Plus, Zap, Edit, Trash2 } from 'lucide-react'
import {
  getConsumerUnits,
  createConsumerUnit,
  updateConsumerUnit,
  deleteConsumerUnit,
} from '@/services/consumer-units'
import { getAllClients } from '@/services/clients'
import { useRealtime } from '@/hooks/use-realtime'
import { ConfirmDialog } from '@/components/dashboard/association/ConfirmDialog'
import { UTILITY_PROVIDERS } from '@/lib/regional-data'
import { toast } from 'sonner'

export default function ConsumerUnitsPage() {
  const [records, setRecords] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterClient, setFilterClient] = useState('all')
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({
    clientId: '',
    ucCode: '',
    utility: 'RGE',
    ucClass: '',
    tariffGroup: '',
    subgroup: '',
    modality: '',
    averageConsumption: '',
    contractedDemand: '',
    status: 'Ativa',
  })

  const loadData = async () => {
    try {
      const [d, c] = await Promise.all([getConsumerUnits(), getAllClients()])
      setRecords(d)
      setClients(c)
    } catch {
      toast.error('Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  useRealtime('consumer_units', () => loadData())

  const filtered =
    filterClient === 'all' ? records : records.filter((r) => r.clientId === filterClient)
  const clientName = (id: string) => clients.find((c) => c.id === id)?.name || '—'

  const openDialog = (r?: any) => {
    if (r) {
      setEditing(r)
      setForm({
        clientId: r.clientId,
        ucCode: r.ucCode,
        utility: r.utility || 'RGE',
        ucClass: r.ucClass || '',
        tariffGroup: r.tariffGroup || '',
        subgroup: r.subgroup || '',
        modality: r.modality || '',
        averageConsumption: String(r.averageConsumption || ''),
        contractedDemand: String(r.contractedDemand || ''),
        status: r.status || 'Ativa',
      })
    } else {
      setEditing(null)
      setForm({
        clientId: '',
        ucCode: '',
        utility: 'RGE',
        ucClass: '',
        tariffGroup: '',
        subgroup: '',
        modality: '',
        averageConsumption: '',
        contractedDemand: '',
        status: 'Ativa',
      })
    }
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.clientId || !form.ucCode) return toast.error('Cliente e código UC são obrigatórios')
    const data = {
      ...form,
      averageConsumption: Number(form.averageConsumption) || 0,
      contractedDemand: Number(form.contractedDemand) || 0,
    }
    try {
      if (editing) {
        await updateConsumerUnit(editing.id, data)
        toast.success('UC atualizada!')
      } else {
        await createConsumerUnit(data)
        toast.success('UC criada!')
      }
      setIsOpen(false)
    } catch {
      toast.error('Erro ao salvar')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteConsumerUnit(deleteId)
      toast.success('UC excluída')
    } catch {
      toast.error('Erro')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Unidades Consumidoras</h2>
          <p className="text-muted-foreground">Gestão de UCs vinculadas aos associados.</p>
        </div>
        <Button
          onClick={() => openDialog()}
          className="bg-brand-blue hover:bg-blue-800 text-white rounded-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Nova UC
        </Button>
      </div>
      <Card>
        <CardHeader className="border-b">
          <div className="flex gap-3 items-center">
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
          </div>
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
                icon={<Zap className="h-10 w-10 text-brand-blue opacity-80" />}
                title="Nenhuma UC cadastrada"
                description="Cadastre unidades consumidoras para os associados."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Associado</TableHead>
                    <TableHead>Código UC</TableHead>
                    <TableHead>Distribuidora</TableHead>
                    <TableHead>Grupo Tarifário</TableHead>
                    <TableHead>Consumo Médio</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/30">
                      <TableCell className="pl-6 font-medium">{clientName(r.clientId)}</TableCell>
                      <TableCell>{r.ucCode}</TableCell>
                      <TableCell className="text-muted-foreground">{r.utility || '—'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.tariffGroup || '—'}
                      </TableCell>
                      <TableCell>
                        {r.averageConsumption
                          ? `${Number(r.averageConsumption).toLocaleString('pt-BR')} kWh`
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${r.status === 'Ativa' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}
                        >
                          {r.status || '—'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(r)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}>
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar UC' : 'Nova UC'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <Label>Associado *</Label>
              <Select
                value={form.clientId}
                onValueChange={(v) => setForm({ ...form, clientId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Código UC *</Label>
              <Input
                value={form.ucCode}
                onChange={(e) => setForm({ ...form, ucCode: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Distribuidora</Label>
              <Select value={form.utility} onValueChange={(v) => setForm({ ...form, utility: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UTILITY_PROVIDERS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Classe</Label>
              <Input
                value={form.ucClass}
                onChange={(e) => setForm({ ...form, ucClass: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Grupo Tarifário</Label>
              <Input
                value={form.tariffGroup}
                onChange={(e) => setForm({ ...form, tariffGroup: e.target.value })}
                placeholder="Ex: B"
              />
            </div>
            <div className="space-y-1">
              <Label>Subgrupo</Label>
              <Input
                value={form.subgroup}
                onChange={(e) => setForm({ ...form, subgroup: e.target.value })}
                placeholder="Ex: 1"
              />
            </div>
            <div className="space-y-1">
              <Label>Modalidade</Label>
              <Input
                value={form.modality}
                onChange={(e) => setForm({ ...form, modality: e.target.value })}
                placeholder="Ex: Convencional"
              />
            </div>
            <div className="space-y-1">
              <Label>Consumo Médio (kWh)</Label>
              <Input
                type="number"
                value={form.averageConsumption}
                onChange={(e) => setForm({ ...form, averageConsumption: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Demanda Contratada (kW)</Label>
              <Input
                type="number"
                value={form.contractedDemand}
                onChange={(e) => setForm({ ...form, contractedDemand: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Ativa', 'Inativa', 'Em Transição'].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              className="rounded-full px-6"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-brand-blue hover:bg-blue-800 text-white rounded-full px-8"
              onClick={handleSubmit}
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir UC"
        description="Confirma a exclusão desta unidade consumidora?"
      />
    </div>
  )
}
