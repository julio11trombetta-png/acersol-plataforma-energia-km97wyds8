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

export function PlantGenerationManager() {
  const [records, setRecords] = useState<any[]>([])
  const [plants, setPlants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ month: '', plantId: '', generation: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const loadData = async () => {
    try {
      const [gens, pls] = await Promise.all([getPlantGenerations(), getAllPlants()])
      setRecords(gens)
      setPlants(pls)
    } catch {
      /* intentionally ignored */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('plant_generation', () => {
    loadData()
  })

  const handleSubmit = async () => {
    const errs: Record<string, string> = {}
    if (!form.month.trim()) errs.month = 'Mes obrigatorio'
    if (!form.plantId) errs.plantId = 'Usina obrigatoria'
    if (!form.generation || Number(form.generation) < 0) errs.generation = 'Valor invalido'
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    try {
      await createPlantGeneration({
        month: form.month,
        plantId: form.plantId,
        generation: Number(form.generation),
      })
      toast.success('Geracao registrada com sucesso!')
      setIsOpen(false)
      setForm({ month: '', plantId: '', generation: '' })
      setErrors({})
    } catch {
      toast.error('Erro ao registrar geracao')
    }
  }

  return (
    <Card className="border-muted shadow-sm">
      <CardHeader className="pb-4 border-b bg-muted/10">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Geracao de Usinas</CardTitle>
            <CardDescription>Registro mensal de energia gerada por usina.</CardDescription>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-brand-green hover:bg-green-700 text-white rounded-full shadow-md"
          >
            <Plus className="mr-2 h-4 w-4" /> Registrar Geracao
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
              title="Nenhum registro de geracao"
              description="Registre a geracao mensal das usinas conectadas."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6">Mes de Referencia</TableHead>
                  <TableHead>Usina</TableHead>
                  <TableHead>Geracao (kWh)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell className="pl-6 font-medium">{r.month}</TableCell>
                    <TableCell>{r.expand?.plantId?.name || '\u2014'}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900"
                      >
                        {Number(r.generation).toLocaleString('pt-BR')} kWh
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
            <DialogTitle>Registrar Geracao</DialogTitle>
            <DialogDescription>Registre a geracao mensal de uma usina.</DialogDescription>
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
              <Label>Mes de Referencia</Label>
              <Input
                placeholder="Ex: Abril 2026"
                value={form.month}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
              />
              {errors.month && <p className="text-sm text-red-500">{errors.month}</p>}
            </div>
            <div className="space-y-2">
              <Label>Geracao (kWh)</Label>
              <Input
                type="number"
                placeholder="Ex: 5000"
                value={form.generation}
                onChange={(e) => setForm({ ...form, generation: e.target.value })}
              />
              {errors.generation && <p className="text-sm text-red-500">{errors.generation}</p>}
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
