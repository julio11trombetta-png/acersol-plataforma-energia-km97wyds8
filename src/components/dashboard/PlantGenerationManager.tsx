import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Zap, Plus } from 'lucide-react'
import { getPlantGenerations, createPlantGeneration } from '@/services/plant-generation'
import { getAllPlants } from '@/services/plants'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/formatters'

export function PlantGenerationManager() {
  const [records, setRecords] = useState<any[]>([])
  const [plants, setPlants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    month: '',
    plantId: '',
    generation: '',
    repasse_amount: '',
    status: 'Pendente',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const loadData = async () => {
    try {
      const [gens, pls] = await Promise.all([getPlantGenerations(), getAllPlants()])
      setRecords(gens)
      setPlants(pls)
    } catch {
      /* ignored */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('plant_generation', () => loadData())

  const handleSubmit = async () => {
    const errs: Record<string, string> = {}
    if (!form.month.trim()) errs.month = 'Mês obrigatório'
    if (!form.plantId) errs.plantId = 'Usina obrigatória'
    if (!form.generation || Number(form.generation) < 0) errs.generation = 'Valor inválido'
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    try {
      await createPlantGeneration({
        month: form.month,
        plantId: form.plantId,
        generation: Number(form.generation),
        repasse_amount: form.repasse_amount ? Number(form.repasse_amount) : 0,
        status: form.status,
      })
      toast.success('Geração registrada com sucesso!')
      setIsOpen(false)
      setForm({ month: '', plantId: '', generation: '', repasse_amount: '', status: 'Pendente' })
      setErrors({})
    } catch {
      toast.error('Erro ao registrar geração')
    }
  }

  const statusCls = (s: string) =>
    s === 'Pago'
      ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20'
      : 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'

  return (
    <Card className="border-muted shadow-sm">
      <CardHeader className="pb-4 border-b bg-muted/10">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Geração de Usinas</CardTitle>
            <CardDescription>
              Registro mensal de energia gerada e repasses por usina.
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-brand-green hover:bg-green-700 text-white rounded-full shadow-md"
          >
            <Plus className="mr-2 h-4 w-4" /> Registrar Geração
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-8 space-y-4">
            <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
            <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
          </div>
        ) : records.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<Zap className="h-12 w-12 text-brand-green opacity-80" />}
              title="Nenhum registro de geração"
              description="Registre a geração mensal das usinas conectadas."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6">Mês</TableHead>
                  <TableHead>Usina</TableHead>
                  <TableHead>Geração (kWh)</TableHead>
                  <TableHead>Repasse (R$)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell className="pl-6 font-medium">{r.month}</TableCell>
                    <TableCell>{r.expand?.plantId?.name || '—'}</TableCell>
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
                        <Badge variant="outline" className={statusCls(r.status)}>
                          {r.status}
                        </Badge>
                      )}
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
            <DialogTitle>Registrar Geração</DialogTitle>
            <DialogDescription>Registre a geração mensal de uma usina.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Usina</Label>
              <Select value={form.plantId} onValueChange={(v) => setForm({ ...form, plantId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a usina" />
                </SelectTrigger>
                <SelectContent>
                  {plants.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.plantId && <p className="text-sm text-red-500">{errors.plantId}</p>}
            </div>
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
