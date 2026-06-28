import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Gauge } from 'lucide-react'
import { getConsumptionsByClient, createConsumption } from '@/services/consumptions'
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

export function ClientConsumptionTab({ clientId }: { clientId: string }) {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ month: '', consumo: '', creditos: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fMonth, setFMonth] = useState('')
  const [fYear, setFYear] = useState('')

  const loadData = async () => {
    try {
      setRecords(await getConsumptionsByClient(clientId))
    } catch {
      /* intentionally ignored */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [clientId])
  useRealtime('consumptions', () => loadData())

  const years = getUniqueYears(records)
  const filtered = filterByMonthYear(records, fMonth, fYear)

  const handleSubmit = async () => {
    const errs: Record<string, string> = {}
    if (!form.month.trim()) errs.month = 'Mês obrigatório'
    if (!form.consumo || Number(form.consumo) < 0) errs.consumo = 'Valor inválido'
    if (!form.creditos || Number(form.creditos) < 0) errs.creditos = 'Valor inválido'
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    try {
      await createConsumption({
        month: form.month,
        consumo: Number(form.consumo),
        creditos: Number(form.creditos),
        clientId,
      })
      toast.success('Consumo registrado!')
      setIsOpen(false)
      setForm({ month: '', consumo: '', creditos: '' })
      setErrors({})
    } catch {
      toast.error('Erro ao registrar')
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
                <SelectItem value="all">Todos os meses</SelectItem>
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
            onClick={() => setIsOpen(true)}
            className="bg-brand-blue hover:bg-blue-800 text-white rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Registrar Consumo
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
            <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Gauge className="h-10 w-10 text-brand-blue opacity-80" />}
            title="Nenhum registro"
            description="Registre o consumo mensal deste cliente."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês de Referência</TableHead>
                  <TableHead>Consumo (kWh)</TableHead>
                  <TableHead>Créditos (kWh)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{r.month}</TableCell>
                    <TableCell>{Number(r.consumo).toLocaleString('pt-BR')} kWh</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20"
                      >
                        {Number(r.creditos).toLocaleString('pt-BR')} kWh
                      </Badge>
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
            <DialogTitle>Registrar Consumo</DialogTitle>
            <DialogDescription>Registre o consumo mensal do cliente.</DialogDescription>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Consumo (kWh)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 450"
                  value={form.consumo}
                  onChange={(e) => setForm({ ...form, consumo: e.target.value })}
                />
                {errors.consumo && <p className="text-sm text-red-500">{errors.consumo}</p>}
              </div>
              <div className="space-y-2">
                <Label>Créditos (kWh)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 200"
                  value={form.creditos}
                  onChange={(e) => setForm({ ...form, creditos: e.target.value })}
                />
                {errors.creditos && <p className="text-sm text-red-500">{errors.creditos}</p>}
              </div>
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
    </Card>
  )
}
