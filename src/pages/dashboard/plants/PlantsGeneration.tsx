import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, TrendingUp, Search } from 'lucide-react'
import {
  getPlantGenerations,
  createPlantGeneration,
  updatePlantGeneration,
  deletePlantGeneration,
} from '@/services/plant-generation'
import { getAllPlants } from '@/services/plants'
import { createActivityLog } from '@/services/activity-logs'
import { useRealtime } from '@/hooks/use-realtime'
import { ConfirmDialog } from '@/components/dashboard/association/ConfirmDialog'
import { toast } from 'sonner'

const emptyForm = {
  month: '',
  plantId: '',
  generation: '',
  injetada: '',
  consumo_proprio: '',
  perdas: '',
  repasse_amount: '',
  status: 'Pendente',
  observacoes: '',
}

export default function PlantsGeneration() {
  const [records, setRecords] = useState<any[]>([])
  const [plants, setPlants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<any>(emptyForm)

  const loadData = async () => {
    try {
      const [d, p] = await Promise.all([getPlantGenerations(), getAllPlants()])
      setRecords(d)
      setPlants(p)
    } catch {
      toast.error('Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  useRealtime('plant_generation', () => loadData())

  const plantName = (id: string) => plants.find((p) => p.id === id)?.name || '—'
  const filtered = search
    ? records.filter(
        (r) =>
          r.month?.toLowerCase().includes(search.toLowerCase()) ||
          plantName(r.plantId).toLowerCase().includes(search.toLowerCase()),
      )
    : records

  const openDialog = (rec?: any) => {
    if (rec) {
      setEditing(rec)
      setForm({
        month: rec.month || '',
        plantId: rec.plantId || '',
        generation: String(rec.generation || ''),
        injetada: String(rec.injetada || ''),
        consumo_proprio: String(rec.consumo_proprio || ''),
        perdas: String(rec.perdas || ''),
        repasse_amount: String(rec.repasse_amount || ''),
        status: rec.status || 'Pendente',
        observacoes: rec.observacoes || '',
      })
    } else {
      setEditing(null)
      setForm(emptyForm)
    }
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.month.trim()) return toast.error('Mês obrigatório')
    if (!form.plantId) return toast.error('Usina obrigatória')
    try {
      const payload = {
        month: form.month,
        plantId: form.plantId,
        generation: Number(form.generation) || 0,
        injetada: Number(form.injetada) || 0,
        consumo_proprio: Number(form.consumo_proprio) || 0,
        perdas: Number(form.perdas) || 0,
        repasse_amount: Number(form.repasse_amount) || 0,
        status: form.status,
        observacoes: form.observacoes,
      }
      if (editing) {
        await updatePlantGeneration(editing.id, payload)
        toast.success('Registro atualizado!')
      } else {
        await createPlantGeneration(payload)
        await createActivityLog({
          action: 'Registrou geração',
          entity: 'plant_generation',
          entityId: form.plantId,
        })
        toast.success('Geração registrada!')
      }
      setIsOpen(false)
    } catch {
      toast.error('Erro ao salvar')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deletePlantGeneration(deleteId)
      toast.success('Excluído!')
    } catch {
      toast.error('Erro')
    } finally {
      setDeleteId(null)
    }
  }

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))
  const statusCls = (s: string) =>
    s === 'Pago'
      ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20'
      : 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Geração de Energia</h2>
          <p className="text-muted-foreground">Registro mensal de geração e injeção.</p>
        </div>
        <Button
          onClick={() => openDialog()}
          className="bg-brand-green hover:bg-green-700 text-white rounded-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Registrar Geração
        </Button>
      </div>
      <Card className="shadow-sm">
        <CardHeader className="pb-4 border-b">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<TrendingUp className="h-12 w-12 text-brand-green opacity-80" />}
                title="Nenhum registro"
                description="Registre a geração mensal das usinas."
                action={
                  <Button
                    onClick={() => openDialog()}
                    className="mt-4 rounded-full bg-brand-green hover:bg-green-700 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Registrar
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Mês</TableHead>
                    <TableHead>Usina</TableHead>
                    <TableHead>Geração</TableHead>
                    <TableHead>Injetada</TableHead>
                    <TableHead>Consumo</TableHead>
                    <TableHead>Perdas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/30">
                      <TableCell className="pl-6 font-medium">{r.month}</TableCell>
                      <TableCell>{r.expand?.plantId?.name || plantName(r.plantId)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        >
                          {Number(r.generation).toLocaleString('pt-BR')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {r.injetada ? Number(r.injetada).toLocaleString('pt-BR') : '—'}
                      </TableCell>
                      <TableCell>
                        {r.consumo_proprio
                          ? Number(r.consumo_proprio).toLocaleString('pt-BR')
                          : '—'}
                      </TableCell>
                      <TableCell>
                        {r.perdas ? Number(r.perdas).toLocaleString('pt-BR') : '—'}
                      </TableCell>
                      <TableCell>
                        {r.status && (
                          <Badge variant="outline" className={statusCls(r.status)}>
                            {r.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDialog(r)}
                          className="hover:bg-brand-green/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(r.id)}
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar' : 'Registrar'} Geração</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Usina *</Label>
              <Select value={form.plantId} onValueChange={(v) => set('plantId', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {plants.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Mês *</Label>
              <Input
                placeholder="Ex: Abril 2026"
                value={form.month}
                onChange={(e) => set('month', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Geração (kWh)</Label>
              <Input
                type="number"
                value={form.generation}
                onChange={(e) => set('generation', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Injetada (kWh)</Label>
              <Input
                type="number"
                value={form.injetada}
                onChange={(e) => set('injetada', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Consumo Próprio (kWh)</Label>
              <Input
                type="number"
                value={form.consumo_proprio}
                onChange={(e) => set('consumo_proprio', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Perdas (kWh)</Label>
              <Input
                type="number"
                value={form.perdas}
                onChange={(e) => set('perdas', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Repasse (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.repasse_amount}
                onChange={(e) => set('repasse_amount', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set('status', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>Observações</Label>
              <Input
                value={form.observacoes}
                onChange={(e) => set('observacoes', e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              className="rounded-full px-6"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-brand-green hover:bg-green-700 text-white rounded-full px-8"
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
        title="Excluir Registro"
        description="Confirma a exclusão deste registro?"
      />
    </div>
  )
}
