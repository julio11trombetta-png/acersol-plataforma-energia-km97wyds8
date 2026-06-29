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
import { Plus, Edit, Trash2, Settings, Search } from 'lucide-react'
import {
  getPlantEquipments,
  createPlantEquipment,
  updatePlantEquipment,
  deletePlantEquipment,
} from '@/services/plant-equipments'
import { getAllPlants } from '@/services/plants'
import { createActivityLog } from '@/services/activity-logs'
import { useRealtime } from '@/hooks/use-realtime'
import { ConfirmDialog } from '@/components/dashboard/association/ConfirmDialog'
import { toast } from 'sonner'

const EQUIP_TYPES = ['Modulo', 'Inversor', 'Transformador', 'Outro']
const emptyForm = {
  plantId: '',
  type: 'Modulo',
  manufacturer: '',
  model: '',
  serial: '',
  quantity: '',
  power: '',
  warranty: '',
  firmware: '',
  installation_date: '',
  status: 'Ativo',
}

export function PlantEquipmentManager({ typeFilter }: { typeFilter?: string }) {
  const [records, setRecords] = useState<any[]>([])
  const [plants, setPlants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<any>(typeFilter ? { ...emptyForm, type: typeFilter } : emptyForm)

  const loadData = async () => {
    try {
      const [d, p] = await Promise.all([getPlantEquipments(typeFilter), getAllPlants()])
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
  useRealtime('plant_equipments', () => loadData())

  const plantName = (id: string) => plants.find((p) => p.id === id)?.name || '—'
  const filtered = search
    ? records.filter(
        (r) =>
          r.manufacturer?.toLowerCase().includes(search.toLowerCase()) ||
          r.model?.toLowerCase().includes(search.toLowerCase()) ||
          plantName(r.plantId).toLowerCase().includes(search.toLowerCase()),
      )
    : records

  const openDialog = (rec?: any) => {
    if (rec) {
      setEditing(rec)
      setForm({ ...rec, quantity: String(rec.quantity || ''), power: String(rec.power || '') })
    } else {
      setEditing(null)
      setForm(typeFilter ? { ...emptyForm, type: typeFilter } : emptyForm)
    }
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.plantId) return toast.error('Usina obrigatória')
    try {
      const payload = {
        ...form,
        quantity: form.quantity ? Number(form.quantity) : 0,
        power: form.power ? Number(form.power) : 0,
      }
      if (editing) {
        await updatePlantEquipment(editing.id, payload)
        toast.success('Equipamento atualizado!')
      } else {
        await createPlantEquipment(payload)
        await createActivityLog({
          action: 'Cadastrou equipamento',
          entity: 'plant_equipments',
          entityId: form.plantId,
        })
        toast.success('Equipamento cadastrado!')
      }
      setIsOpen(false)
    } catch {
      toast.error('Erro ao salvar')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deletePlantEquipment(deleteId)
      toast.success('Excluído!')
    } catch {
      toast.error('Erro')
    } finally {
      setDeleteId(null)
    }
  }

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))
  const title = typeFilter
    ? `${EQUIP_TYPES.find((t) => t === typeFilter) || 'Equipamento'}s`
    : 'Equipamentos'

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">Gestão de equipamentos das usinas.</p>
        </div>
        <Button
          onClick={() => openDialog()}
          className="bg-brand-green hover:bg-green-700 text-white rounded-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Equipamento
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
                icon={<Settings className="h-12 w-12 text-brand-green opacity-80" />}
                title="Nenhum equipamento"
                description="Cadastre equipamentos para as usinas."
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
                    <TableHead>Fabricante</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Potência</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/30">
                      <TableCell className="pl-6 font-medium">{plantName(r.plantId)}</TableCell>
                      <TableCell>{r.manufacturer || '—'}</TableCell>
                      <TableCell>{r.model || '—'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{r.quantity || 0}</Badge>
                      </TableCell>
                      <TableCell>{r.power ? `${r.power} kW` : '—'}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            r.status === 'Ativo'
                              ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20'
                              : 'text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-900/20'
                          }
                        >
                          {r.status || 'Ativo'}
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
            <DialogTitle>{editing ? 'Editar' : 'Novo'} Equipamento</DialogTitle>
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
              <Label>Tipo</Label>
              <Select
                value={form.type}
                onValueChange={(v) => set('type', v)}
                disabled={!!typeFilter}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EQUIP_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Fabricante</Label>
              <Input
                value={form.manufacturer}
                onChange={(e) => set('manufacturer', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Modelo</Label>
              <Input value={form.model} onChange={(e) => set('model', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Nº de Série</Label>
              <Input value={form.serial} onChange={(e) => set('serial', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Quantidade</Label>
              <Input
                type="number"
                value={form.quantity}
                onChange={(e) => set('quantity', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Potência (kW)</Label>
              <Input
                type="number"
                value={form.power}
                onChange={(e) => set('power', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Garantia</Label>
              <Input
                value={form.warranty}
                onChange={(e) => set('warranty', e.target.value)}
                placeholder="Ex: 25 anos"
              />
            </div>
            {(form.type === 'Inversor' || !typeFilter) && (
              <div className="space-y-1">
                <Label>Firmware</Label>
                <Input value={form.firmware} onChange={(e) => set('firmware', e.target.value)} />
              </div>
            )}
            <div className="space-y-1">
              <Label>Data Instalação</Label>
              <Input
                type="date"
                value={form.installation_date}
                onChange={(e) => set('installation_date', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set('status', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Ativo', 'Inativo', 'Em Manutenção'].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        title="Excluir Equipamento"
        description="Confirma a exclusão deste equipamento?"
      />
    </div>
  )
}
