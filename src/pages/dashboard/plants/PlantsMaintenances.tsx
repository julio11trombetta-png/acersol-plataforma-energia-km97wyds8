import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Plus, Edit, Trash2, Wrench } from 'lucide-react'
import {
  getPlantMaintenances,
  createPlantMaintenance,
  updatePlantMaintenance,
  deletePlantMaintenance,
} from '@/services/plant-maintenances'
import { getAllPlants } from '@/services/plants'
import { createActivityLog } from '@/services/activity-logs'
import { useRealtime } from '@/hooks/use-realtime'
import { ConfirmDialog } from '@/components/dashboard/association/ConfirmDialog'
import { formatCurrency } from '@/lib/formatters'
import { toast } from 'sonner'

const TYPES = ['Preventiva', 'Corretiva', 'Limpeza', 'Substituição de Equipamento']
const STATUSES = ['Agendada', 'Em Andamento', 'Concluída', 'Cancelada']
const emptyForm = {
  plantId: '',
  date: '',
  type: 'Preventiva',
  responsible: '',
  value: '',
  description: '',
  status: 'Agendada',
}

export default function PlantsMaintenances() {
  const [records, setRecords] = useState<any[]>([])
  const [plants, setPlants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<any>(emptyForm)
  const [photos, setPhotos] = useState<File[]>([])

  const loadData = async () => {
    try {
      const [d, p] = await Promise.all([getPlantMaintenances(), getAllPlants()])
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
  useRealtime('plant_maintenances', () => loadData())

  const plantName = (id: string) => plants.find((p) => p.id === id)?.name || '—'
  const openDialog = (rec?: any) => {
    if (rec) {
      setEditing(rec)
      setForm({
        plantId: rec.plantId || '',
        date: rec.date || '',
        type: rec.type || 'Preventiva',
        responsible: rec.responsible || '',
        value: String(rec.value || ''),
        description: rec.description || '',
        status: rec.status || 'Agendada',
      })
    } else {
      setEditing(null)
      setForm(emptyForm)
    }
    setPhotos([])
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.plantId) return toast.error('Usina obrigatória')
    if (!form.date) return toast.error('Data obrigatória')
    try {
      const fd = new FormData()
      fd.append('plantId', form.plantId)
      fd.append('date', form.date)
      fd.append('type', form.type)
      fd.append('responsible', form.responsible)
      fd.append('value', String(form.value ? Number(form.value) : 0))
      fd.append('description', form.description)
      fd.append('status', form.status)
      photos.forEach((f) => fd.append('photos', f))
      if (editing) {
        await updatePlantMaintenance(editing.id, fd)
        toast.success('Manutenção atualizada!')
      } else {
        await createPlantMaintenance(fd)
        await createActivityLog({
          action: 'Agendou manutenção',
          entity: 'plant_maintenances',
          entityId: form.plantId,
        })
        toast.success('Manutenção registrada!')
      }
      setIsOpen(false)
    } catch {
      toast.error('Erro ao salvar')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deletePlantMaintenance(deleteId)
      toast.success('Excluída!')
    } catch {
      toast.error('Erro')
    } finally {
      setDeleteId(null)
    }
  }

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))
  const statusCls = (s: string) =>
    s === 'Concluída'
      ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20'
      : s === 'Cancelada'
        ? 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20'
        : s === 'Em Andamento'
          ? 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
          : 'text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20'

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manutenções</h2>
          <p className="text-muted-foreground">Gestão de manutenções preventivas e corretivas.</p>
        </div>
        <Button
          onClick={() => openDialog()}
          className="bg-brand-green hover:bg-green-700 text-white rounded-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Manutenção
        </Button>
      </div>
      <Card className="shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<Wrench className="h-12 w-12 text-brand-green opacity-80" />}
                title="Nenhuma manutenção"
                description="Registre manutenções para as usinas."
                action={
                  <Button
                    onClick={() => openDialog()}
                    className="mt-4 rounded-full bg-brand-green hover:bg-green-700 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Cadastrar
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Usina</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/30">
                      <TableCell className="pl-6 font-medium">
                        {r.expand?.plantId?.name || plantName(r.plantId)}
                      </TableCell>
                      <TableCell>
                        {r.date ? new Date(r.date).toLocaleDateString('pt-BR') : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{r.type}</Badge>
                      </TableCell>
                      <TableCell>{r.responsible || '—'}</TableCell>
                      <TableCell>{r.value ? formatCurrency(Number(r.value)) : '—'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusCls(r.status)}>
                          {r.status}
                        </Badge>
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
            <DialogTitle>{editing ? 'Editar' : 'Nova'} Manutenção</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1">
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
              <Label>Data *</Label>
              <Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => set('type', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Responsável</Label>
              <Input
                value={form.responsible}
                onChange={(e) => set('responsible', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.value}
                onChange={(e) => set('value', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set('status', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>Descrição</Label>
              <Textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={2}
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>Fotos</Label>
              <Input
                type="file"
                accept="image/jpeg,image/png"
                multiple
                onChange={(e) => setPhotos(Array.from(e.target.files || []))}
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
        title="Excluir Manutenção"
        description="Confirma a exclusão deste registro?"
      />
    </div>
  )
}
