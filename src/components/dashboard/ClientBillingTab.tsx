import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, DollarSign, Edit, FileText } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { getInvoicesByClient, createInvoice, updateInvoice } from '@/services/invoices'
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

const statusClass = (s: string) =>
  s === 'Pago'
    ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20'
    : s === 'Pendente'
      ? 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
      : 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20'

export function ClientBillingTab({ clientId }: { clientId: string }) {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ month: '', amount: '', status: 'Pendente' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fMonth, setFMonth] = useState('')
  const [fYear, setFYear] = useState('')
  const [fStatus, setFStatus] = useState('')

  const loadData = async () => {
    try {
      setRecords(await getInvoicesByClient(clientId))
    } catch {
      /* intentionally ignored */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [clientId])
  useRealtime('invoices', () => loadData())

  const years = getUniqueYears(records)
  let filtered = filterByMonthYear(records, fMonth, fYear)
  if (fStatus) filtered = filtered.filter((r) => r.status === fStatus)

  const openDialog = (inv?: any) => {
    if (inv) {
      setEditing(inv)
      setForm({ month: inv.month, amount: String(inv.amount), status: inv.status })
    } else {
      setEditing(null)
      setForm({ month: '', amount: '', status: 'Pendente' })
    }
    setErrors({})
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    const errs: Record<string, string> = {}
    if (!form.month.trim()) errs.month = 'Mês obrigatório'
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Valor inválido'
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    try {
      const data = { month: form.month, amount: Number(form.amount), status: form.status, clientId }
      if (editing) {
        await updateInvoice(editing.id, data)
        toast.success('Fatura atualizada!')
      } else {
        await createInvoice(data)
        toast.success('Fatura criada!')
      }
      setIsOpen(false)
    } catch {
      toast.error('Erro ao salvar fatura')
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex gap-3 flex-wrap">
            <Select value={fMonth || 'all'} onValueChange={(v) => setFMonth(v === 'all' ? '' : v)}>
              <SelectTrigger className="w-[140px]">
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
              <SelectTrigger className="w-[110px]">
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
            <Select
              value={fStatus || 'all'}
              onValueChange={(v) => setFStatus(v === 'all' ? '' : v)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Pago">Pago</SelectItem>
                <SelectItem value="Atrasado">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => openDialog()}
            className="bg-brand-blue hover:bg-blue-800 text-white rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Fatura
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
            <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<DollarSign className="h-10 w-10 text-brand-blue opacity-80" />}
            title="Nenhuma fatura"
            description="Adicione faturas para este cliente."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {inv.month}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(inv.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusClass(inv.status)}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDialog(inv)}
                        className="hover:bg-brand-blue/10"
                      >
                        <Edit className="h-4 w-4" />
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
            <DialogTitle>{editing ? 'Editar Fatura' : 'Nova Fatura'}</DialogTitle>
            <DialogDescription>Registre a fatura do cliente.</DialogDescription>
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
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Atrasado">Atrasado</SelectItem>
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
    </Card>
  )
}
