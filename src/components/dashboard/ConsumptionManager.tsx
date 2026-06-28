import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Gauge, Plus } from 'lucide-react'
import { getConsumptions, createConsumption } from '@/services/consumptions'
import { getAllClients } from '@/services/clients'
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

export function ConsumptionManager() {
  const [records, setRecords] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ month: '', clientId: '', consumo: '', creditos: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const loadData = async () => {
    try {
      const [cons, cls] = await Promise.all([getConsumptions(), getAllClients()])
      setRecords(cons)
      setClients(cls)
    } catch {
      /* intentionally ignored */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('consumptions', () => {
    loadData()
  })

  const handleSubmit = async () => {
    const errs: Record<string, string> = {}
    if (!form.month.trim()) errs.month = 'Mes obrigatorio'
    if (!form.clientId) errs.clientId = 'Cliente obrigatorio'
    if (!form.consumo || Number(form.consumo) < 0) errs.consumo = 'Valor invalido'
    if (!form.creditos || Number(form.creditos) < 0) errs.creditos = 'Valor invalido'
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    try {
      await createConsumption({
        month: form.month,
        clientId: form.clientId,
        consumo: Number(form.consumo),
        creditos: Number(form.creditos),
      })
      toast.success('Consumo registrado com sucesso!')
      setIsOpen(false)
      setForm({ month: '', clientId: '', consumo: '', creditos: '' })
      setErrors({})
    } catch {
      toast.error('Erro ao registrar consumo')
    }
  }

  return (
    <Card className="border-muted shadow-sm">
      <CardHeader className="pb-4 border-b bg-muted/10">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Consumo e Creditos</CardTitle>
            <CardDescription>Registro mensal de consumo e creditos por cliente.</CardDescription>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-brand-blue hover:bg-blue-800 text-white rounded-full shadow-md"
          >
            <Plus className="mr-2 h-4 w-4" /> Registrar Consumo
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
              icon={<Gauge className="h-12 w-12 text-brand-blue opacity-80" />}
              title="Nenhum registro de consumo"
              description="Registre o consumo mensal dos clientes cadastrados."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6">Mes de Referencia</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Consumo (kWh)</TableHead>
                  <TableHead>Creditos (kWh)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell className="pl-6 font-medium">{r.month}</TableCell>
                    <TableCell>{r.expand?.clientId?.name || '\u2014'}</TableCell>
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
            <DialogDescription>
              Registre o consumo e creditos mensais de um cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select
                value={form.clientId}
                onValueChange={(v) => setForm({ ...form, clientId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clientId && <p className="text-sm text-red-500">{errors.clientId}</p>}
            </div>
            <div className="space-y-2">
              <Label>Mes de Referencia</Label>
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
                <Label>Creditos (kWh)</Label>
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
