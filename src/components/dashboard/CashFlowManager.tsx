import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Wallet, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { getCashFlow, createCashFlow, deleteCashFlow } from '@/services/cash-flow'
import { useRealtime } from '@/hooks/use-realtime'
import { EmptyState } from '@/components/ui/empty-state'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/formatters'

export function CashFlowManager() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    type: 'Entrada',
    amount: '',
    description: '',
    date: '',
    category: '',
  })

  const loadData = async () => {
    try {
      setRecords(await getCashFlow())
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  useRealtime('cash_flow', () => loadData())

  const handleSubmit = async () => {
    if (!form.amount || Number(form.amount) <= 0) {
      toast.error('Valor inválido')
      return
    }
    try {
      await createCashFlow({
        type: form.type,
        amount: Number(form.amount),
        description: form.description,
        date: form.date || undefined,
        category: form.category,
      })
      toast.success('Movimentação registrada!')
      setIsOpen(false)
      setForm({ type: 'Entrada', amount: '', description: '', date: '', category: '' })
    } catch {
      toast.error('Erro ao registrar')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCashFlow(id)
      toast.info('Movimentação removida')
    } catch {
      toast.error('Erro')
    }
  }

  const totalIn = records
    .filter((r) => r.type === 'Entrada')
    .reduce((a, r) => a + (r.amount || 0), 0)
  const totalOut = records
    .filter((r) => r.type === 'Saida')
    .reduce((a, r) => a + (r.amount || 0), 0)

  return (
    <Card className="border-muted shadow-sm">
      <CardHeader className="pb-4 border-b bg-muted/10">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Fluxo de Caixa</CardTitle>
            <CardDescription>Entradas e saídas financeiras.</CardDescription>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-brand-blue hover:bg-blue-800 text-white rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Movimentação
          </Button>
        </div>
        <div className="flex gap-4 mt-3">
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30">
            <ArrowUpCircle className="mr-1 h-3 w-3" />
            {formatCurrency(totalIn)}
          </Badge>
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30">
            <ArrowDownCircle className="mr-1 h-3 w-3" />
            {formatCurrency(totalOut)}
          </Badge>
          <Badge variant="outline">Saldo: {formatCurrency(totalIn - totalOut)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-8 space-y-3">
            <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
            <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
          </div>
        ) : records.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<Wallet className="h-12 w-12 text-brand-blue opacity-80" />}
              title="Nenhuma movimentação"
              description="Registre entradas e saídas de caixa."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6">Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell className="pl-6">
                      <Badge
                        variant="outline"
                        className={
                          r.type === 'Entrada'
                            ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20'
                            : 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20'
                        }
                      >
                        {r.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{r.description || '—'}</TableCell>
                    <TableCell>{r.category || '—'}</TableCell>
                    <TableCell>
                      {r.date ? new Date(r.date).toLocaleDateString('pt-BR') : '—'}
                    </TableCell>
                    <TableCell
                      className={`font-semibold ${r.type === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {r.type === 'Entrada' ? '+' : '-'}
                      {formatCurrency(r.amount)}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(r.id)}
                        className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Nova Movimentação</DialogTitle>
            <DialogDescription>Registre uma entrada ou saída.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entrada">Entrada</SelectItem>
                  <SelectItem value="Saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Input
                  placeholder="Ex: Energia"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
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
