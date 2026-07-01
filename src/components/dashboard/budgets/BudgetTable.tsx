import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Eye, Edit, Copy, UserPlus, FileText, Send, Trash2 } from 'lucide-react'
import { STATUS_COLORS } from '@/lib/budget-calculations'
import { formatCurrency } from '@/lib/formatters'

interface BudgetTableProps {
  budgets: any[]
  loading: boolean
  onAction: (action: string, budget: any) => void
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
}

export function BudgetTable({
  budgets,
  loading,
  onAction,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: BudgetTableProps) {
  const allSelected = budgets.length > 0 && budgets.every((b) => selectedIds.includes(b.id))

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="pl-4 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="rounded"
              />
            </TableHead>
            <TableHead>Número</TableHead>
            <TableHead>Cliente / Lead</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Distribuidora</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Economia/mês</TableHead>
            <TableHead className="text-right pr-4">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell colSpan={8}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : budgets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Nenhum orçamento encontrado.
              </TableCell>
            </TableRow>
          ) : (
            budgets.map((b) => (
              <TableRow key={b.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="pl-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(b.id)}
                    onChange={() => onToggleSelect(b.id)}
                    className="rounded"
                  />
                </TableCell>
                <TableCell
                  className="font-mono text-xs font-medium text-brand-blue cursor-pointer"
                  onClick={() => onAction('view', b)}
                >
                  {b.numero}
                </TableCell>
                <TableCell className="font-medium">
                  {b.expand?.client_id?.name || b.expand?.lead_id?.company || '—'}
                </TableCell>
                <TableCell className="text-muted-foreground">{b.cidade || '—'}</TableCell>
                <TableCell className="text-muted-foreground">{b.distribuidora || '—'}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={STATUS_COLORS[b.status] || ''}>
                    {b.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-green-600">
                  {formatCurrency(b.economia_mensal || 0)}
                </TableCell>
                <TableCell className="text-right pr-4">
                  <div className="flex justify-end gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onAction('view', b)}
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onAction('edit', b)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onAction('pdf', b)}
                      title="Gerar PDF"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onAction('send', b)}
                      title="Enviar"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onAction('duplicate', b)}
                      title="Duplicar"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-purple-50 hover:text-purple-600"
                      onClick={() => onAction('convert', b)}
                      title="Converter em Associado"
                      disabled={b.status === 'Convertido'}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                      onClick={() => onAction('delete', b)}
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
