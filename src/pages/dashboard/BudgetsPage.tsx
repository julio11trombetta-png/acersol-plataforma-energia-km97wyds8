import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Plus, FileDown, Trash2 } from 'lucide-react'
import {
  getBudgets,
  softDeleteBudget,
  duplicateBudget,
  convertToAssociate,
  logBudgetAction,
  type BudgetFilters,
} from '@/services/budgets'
import { generateBudgetPDF } from '@/lib/budget-pdf'
import { BUDGET_STATUS } from '@/lib/budget-calculations'
import { useRealtime } from '@/hooks/use-realtime'
import { BudgetTable } from '@/components/dashboard/budgets/BudgetTable'
import { BudgetCommunication } from '@/components/dashboard/budgets/BudgetCommunication'
import { exportToExcel } from '@/lib/export-utils'
import { toast } from 'sonner'

export default function BudgetsPage() {
  const navigate = useNavigate()
  const [budgets, setBudgets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<BudgetFilters>({
    search: '',
    status: 'all',
    distribuidora: 'all',
  })
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [commBudget, setCommBudget] = useState<any>(null)

  const loadData = async () => {
    try {
      const data = await getBudgets(1, 50, filters)
      setBudgets(data.items)
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true)
      loadData()
    }, 400)
    return () => clearTimeout(t)
  }, [filters])
  useRealtime('budgets', () => loadData())

  const handleAction = async (action: string, budget: any) => {
    switch (action) {
      case 'view':
        navigate(`/dashboard/admin/comercial/orcamentos/${budget.id}`)
        break
      case 'edit':
        navigate(`/dashboard/admin/comercial/orcamentos/${budget.id}`)
        break
      case 'pdf':
        generateBudgetPDF(budget)
        await logBudgetAction(budget.id, 'View', 'PDF gerado')
        break
      case 'send':
        setCommBudget(budget)
        break
      case 'duplicate':
        try {
          await duplicateBudget(budget.id)
          toast.success('Orçamento duplicado!')
          loadData()
        } catch {
          toast.error('Erro')
        }
        break
      case 'convert':
        try {
          await convertToAssociate(budget.id)
          toast.success('Convertido em associado!')
          loadData()
        } catch {
          toast.error('Erro na conversão')
        }
        break
      case 'delete':
        try {
          await softDeleteBudget(budget.id)
          toast.info('Orçamento excluído')
          loadData()
        } catch {
          toast.error('Erro')
        }
        break
    }
  }

  const toggleSelect = (id: string) =>
    setSelectedIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const toggleSelectAll = () =>
    setSelectedIds(selectedIds.length === budgets.length ? [] : budgets.map((b) => b.id))

  const handleBulkDelete = async () => {
    for (const id of selectedIds) await softDeleteBudget(id)
    toast.info(`${selectedIds.length} orçamentos excluídos`)
    setSelectedIds([])
    loadData()
  }

  const handleExport = () => {
    exportToExcel(
      'orcamentos',
      [
        'Número',
        'Cliente',
        'Cidade',
        'Distribuidora',
        'Status',
        'Economia Mensal',
        'Economia Anual',
      ],
      budgets.map((b) => [
        b.numero,
        b.expand?.client_id?.name || b.expand?.lead_id?.company || '',
        b.cidade || '',
        b.distribuidora || '',
        b.status,
        b.economia_mensal || 0,
        b.economia_anual || 0,
      ]),
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orçamentos</h2>
          <p className="text-muted-foreground">
            Gestão de propostas comerciais e simulações de economia.
          </p>
        </div>
        <Button
          onClick={() => navigate('/dashboard/admin/comercial/orcamentos/novo')}
          className="bg-brand-blue hover:bg-blue-800 text-white rounded-full shadow-md"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Orçamento
        </Button>
      </div>
      <Card className="border-muted shadow-sm">
        <CardHeader className="pb-4 border-b bg-muted/10">
          <div className="flex flex-col md:flex-row justify-between gap-3">
            <div className="flex gap-2 flex-wrap">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar orçamento..."
                  className="pl-9 rounded-full"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <Select
                value={filters.status || 'all'}
                onValueChange={(v) => setFilters({ ...filters, status: v })}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {BUDGET_STATUS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-full" onClick={handleExport}>
                <FileDown className="mr-2 h-4 w-4" /> Exportar
              </Button>
              {selectedIds.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-red-600"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Excluir ({selectedIds.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <BudgetTable
            budgets={budgets}
            loading={loading}
            onAction={handleAction}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
          />
        </CardContent>
      </Card>
      <BudgetCommunication
        open={!!commBudget}
        onOpenChange={(v) => !v && setCommBudget(null)}
        budget={commBudget}
      />
    </div>
  )
}
