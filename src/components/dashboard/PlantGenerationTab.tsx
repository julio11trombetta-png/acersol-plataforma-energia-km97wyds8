import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Zap, Edit, Trash2 } from 'lucide-react'
import {
  getPlantGenerationsByPlant,
  createPlantGeneration,
  updatePlantGeneration,
  deletePlantGeneration,
} from '@/services/plant-generation'
import { useRealtime } from '@/hooks/use-realtime'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { MONTHS, filterByMonthYear, getUniqueYears } from '@/lib/date-filters'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'

const repasseStatusClass = (s: string) =>
  s === 'Pago'
    ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20'
    : 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'

export function PlantGenerationTab({ plantId, plantName }: { plantId: string; plantName: string }) {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({
    month: '',
    generation: '',
    repasse_amount: '',
    status: 'Pendente',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fMonth, setFMonth] = useState('')
  const [fYear, setFYear] = useState('')

  const loadData = async () => {
    try {
      setRecords(await getPlantGenerationsByPlant(plantId))
    } catch {
      /* ignored */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [plantId])
  useRealtime('plant_generation', () => loadData())

  const years = getUniqueYears(records)
  const filtered = filterByMonthYear(records, fMonth, fYear)

  const openDialog = (rec?: any) => {
    if (rec) {
      setEditing(rec)
      setForm({
        month: rec.month,
        generation: String(rec.generation),
        repasse_amount: rec.repasse_amount != null ? String(rec.repasse_amount) : '',
        status: rec.status || 'Pendente',
      })
    } else {
      setEditing(null)
      setForm({ month: '', generation: '', repasse_amount: '', status: 'Pendente' })
    }
    setErrors({})
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    const errs: Record<string, string> = {}
    if (!form.month.trim()) errs.month = 'Mês obrigatório'
    if (!form.generation || Number(form.generation) < 0) errs.generation = 'Valor inválido'
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    try {
      const data = {
        month: form.month,
        generation: Number(form.generation),
        repasse_amount: form.repasse_amount ? Number(form.repasse_amount) : 0,
        status: form.status,
        plantId,
      }
      if (editing) {
        await updatePlantGeneration(editing.id, data)
        toast.success('Registro atualizado!')
      } else {
        await createPlantGeneration(data)
        toast.success('Geração registrada!')
      }
      setIsOpen(false)
    } catch {
      toast.error('Erro ao salvar')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deletePlantGeneration(id)
      toast.success('Registro excluído!')
    } catch {
      toast.error('Erro ao excluir')
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex gap-3">
            <Select value={fMonth || 'all'} onValueChange={(v) => setFMonth(v === 'all' ? '' : v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={fYear || 'all'} onValueChange={(v) => setFYear(v === 'all' ? '' : v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => openDialog()}
            className="bg-brand-green hover:bg-green-700 text-white rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Registrar Geração
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
            <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Zap className="h-10 w-10 text-brand-green opacity-80" />}
            title="Nenhum registro"
            description="Registre a geração mensal desta usina."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead>Geração (kWh)</TableHead>
                  <TableHead>Repasse (R$)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{r.month}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900"
                      >
                        {Number(r.generation).toLocaleString('pt-BR')} kWh
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {r.repasse_amount != null ? formatCurrency(Number(r.repasse_amount)) : '—'}
                    </TableCell>
                    <TableCell>
                      {r.status && (
                        <Badge variant="outline" className={repasseStatusClass(r.status)}>
                          {r.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
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
                        onClick={() => handleDelete(r.id)}
                        className="hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Registro' : 'Registrar Geração'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Edite os dados do registro.' : 'Registre a geração mensal da usina.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mês de Referência</Label>
              <Input
                placeholder="Ex: Abril 2026"
                value={form.month}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
              />
              {errors.month && <p className="text-sm text-red-500">{errors.month}</p>}
            </div>
            <div className="space-y-2">
              <Label>Geração (kWh)</Label>
              <Input
                type="number"
                placeholder="Ex: 5000"
                value={form.generation}
                onChange={(e) => setForm({ ...form, generation: e.target.value })}
              />
              {errors.generation && <p className="text-sm text-red-500">{errors.generation}</p>}
            </div>
            <div className="space-y-2">
              <Label>Valor de Repasse (R$)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={form.repasse_amount}
                onChange={(e) => setForm({ ...form, repasse_amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Status do Repasse</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
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
              className="bg-brand-green hover:bg-green-700 text-white rounded-full px-8"
              onClick={handleSubmit}
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
