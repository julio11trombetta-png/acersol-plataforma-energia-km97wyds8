import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { DollarSign, FileText } from 'lucide-react'
import { getInvoices } from '@/services/invoices'
import { useRealtime } from '@/hooks/use-realtime'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function AdminFinance() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const invs = await getInvoices()
      setInvoices(invs)
    } catch {
      /* intentionally ignored */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('invoices', () => {
    loadData()
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
        <p className="text-muted-foreground">
          Gerencie o histórico de faturas e distribuição de créditos.
        </p>
      </div>

      <Card className="border-muted shadow-sm">
        <CardHeader>
          <CardTitle>Histórico e Rateios</CardTitle>
          <CardDescription>
            Visualização de transações financeiras e faturamento de energia.
          </CardDescription>
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
                title="Nenhum registro financeiro encontrado"
                description="Você ainda não possui histórico financeiro, faturas emitidas ou distribuição de créditos na plataforma."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Referência (Mês)</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
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
                      <TableCell>R$ {inv.amount},00</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            inv.status === 'Pago'
                              ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20'
                              : inv.status === 'Pendente'
                                ? 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
                                : 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20'
                          }
                        >
                          {inv.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
