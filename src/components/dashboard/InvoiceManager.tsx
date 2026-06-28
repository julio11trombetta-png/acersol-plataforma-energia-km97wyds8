import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DollarSign, Plus, FileText, FileDown } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { getInvoices, createInvoice } from '@/services/invoices'
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
import { generateInvoicePDF } from '@/lib/invoice-pdf'

const statusClass = (s: string) =>
  s === 'Pago'
    ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20'
    : s === 'Pendente'
      ? 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
      : 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20'

export function InvoiceManager() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    month: '',
    clientId: '',
    amount: '',
    status: 'Pendente',
    due_date: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const loadData = async () => {
    try {
      const [invs, cls] = await Promise.all([getInvoices(), getAllClients()])
      setInvoices(invs)
      setClients(cls)
    } catch {
      /* ignored */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('invoices', () => loadData())

  const handleSubmit = async () => {
    const errs: Record<string, string> = {}
    if (!form.month.trim()) errs.month = 'Mês obrigatório'
    if (!form.clientId) errs.clientId = 'Cliente obrigatório'
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Valor inválido'
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    try {
      await createInvoice({
        month: form.month,
        clientId: form.clientId,
        amount: Number(form.amount),
        status: form.status,
        due_date: form.due_date || null,
      })
      toast.success('Fatura criada com sucesso!')
      setIsOpen(false)
      setForm({ month: '', clientId: '', amount: '', status: 'Pendente', due_date: '' })
      setErrors({})
    } catch {
      toast.error('Erro ao criar fatura')
    }
  }

  return (
    <Card className="border-muted shadow-sm">
      <CardHeader className="pb-4 border-b bg-muted/10">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Histórico e Rateios</CardTitle>
            <CardDescription>Faturas emitidas e distribuição de créditos.</CardDescription>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-brand-blue hover:bg-blue-800 text-white rounded-full shadow-md"
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar Fatura
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-8 space-y-4">
            <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
            <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
            <div className="h-10 bg-muted/40 rounded-md animate-pulse" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<DollarSign className="h-12 w-12 text-brand-blue opacity-80" />}
              title="Nenhum registro financeiro"
              description="Adicione faturas para acompanhar o faturamento da plataforma."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6">Referência</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor (R$)</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-muted/30">
                    <TableCell className="pl-6 font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {inv.month}
                      </div>
                    </TableCell>
                    <TableCell>{inv.expand?.clientId?.name || '—'}</TableCell>
                    <TableCell>{formatCurrency(inv.amount)}</TableCell>
                    <TableCell>
                      {inv.due_date ? new Date(inv.due_date).toLocaleDateString('pt-BR') : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusClass(inv.status)}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => generateInvoicePDF(inv)}
                        className="hover:bg-brand-blue/10"
                        title="Gerar PDF"
                      >
                        <FileDown className="h-4 w-4" />
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
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Nova Fatura</DialogTitle>
            <DialogDescription>Registre uma nova fatura para um cliente.</DialogDescription>
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
                <Label>Data de Vencimento</Label>
                <Input
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                />
              </div>
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
